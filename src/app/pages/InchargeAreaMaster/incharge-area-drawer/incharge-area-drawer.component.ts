import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { InchargeAreaMatser } from 'src/app/Models/InchargeAreaMaster';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-incharge-area-drawer',
  templateUrl: './incharge-area-drawer.component.html',
  styleUrls: ['./incharge-area-drawer.component.css']
})

export class InchargeAreaDrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: InchargeAreaMatser;
  @Input() drawerVisible: boolean;
  isSpinning: boolean = false;
  leaveTypes = [];
  namePattern = "([A-Za-z0-9 \s]){1,}";

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe) { }

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

    if (this.data.NAME != undefined && this.data.NAME != null) {
      if (this.data.NAME.trim() != '') {
        if (!this.api.checkTextBoxIsValid(this.data.NAME)) {
          isOk = false;
          this.message.error("Please Enter Valid Incharge Area Name", "");
        }

      } else {
        isOk = false;
        this.message.error("Please Enter Valid Incharge Area Name", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Incharge Area Name", "");
    }

    if (isOk) {
      this.isSpinning = true;

      if (this.data.ID) {
        this.api.updateInchargeArea(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Incharge Area Details Updated Successfully", "");
            this.isSpinning = false;

            if (!addNew) {
              this.close(myForm);
            }

          } else {
            this.message.error("Incharge Area Details Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.api.createInchargeArea(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Incharge Area Created Successfully", "");
            this.isSpinning = false;

            if (!addNew) {
              this.close(myForm);

            } else {
              this.data = new InchargeAreaMatser();
            }

          } else {
            this.message.error("Incharge Area Creation Failed", "");
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
