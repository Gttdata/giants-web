import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { FederationMaster } from 'src/app/Models/FederationMaster';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-federation-drawer',
  templateUrl: './federation-drawer.component.html',
  styleUrls: ['./federation-drawer.component.css']
})

export class FederationDrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: FederationMaster;
  @Input() drawerVisible: boolean;
  isSpinning: boolean = false;
  namePattern = "([A-Za-z0-9 \s]){1,}";
  shortNamePattern = "([A-Za-z0-9- \s]){1,}";

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() { }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  save(addNew: boolean, myForm: NgForm): void {
    var isOk = true;

    if ((this.data.NAME != undefined) && (this.data.NAME != null)) {
      if (this.data.NAME.trim() != '') {
        if (!this.api.checkTextBoxIsValid(this.data.NAME)) {
          isOk = false;
          this.message.error("Please Enter Valid Federation Name", "");
        }

      } else {
        isOk = false;
        this.message.error("Please Enter Valid Federation Name", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Federation Name", "");
    }

    if ((this.data.SHORT_NAME != undefined) && (this.data.SHORT_NAME != null)) {
      if (this.data.SHORT_NAME.trim() != '') {
        if (!this.api.checkTextBoxWithDashIsValid(this.data.SHORT_NAME)) {
          isOk = false;
          this.message.error("Please Enter Valid Short Name", "");
        }

      } else {
        isOk = false;
        this.message.error("Please Enter Valid Short Name", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Short Name", "");
    }

    if (isOk) {
      this.isSpinning = true;

      if (this.data.ID) {
        this.api.updateFederation(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Federation Details Updated Successfully", "");
            this.isSpinning = false;

            if (!addNew)
              this.close(myForm);

          } else {
            this.message.error("Federation Details Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.api.createFederation(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Federation Created Successfully", "");
            this.isSpinning = false;

            if (!addNew)
              this.close(myForm);

            else {
              this.data = new FederationMaster();
            }

          } else {
            this.message.error("Federation Creation Failed", "");
            this.isSpinning = false;
          }
        });
      }
    }
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }
}
