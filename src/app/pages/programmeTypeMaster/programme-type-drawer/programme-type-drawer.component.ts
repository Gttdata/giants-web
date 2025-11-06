import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { programmeTypeMaster } from 'src/app/Models/programmeTypeMaster';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-programme-type-drawer',
  templateUrl: './programme-type-drawer.component.html',
  styleUrls: ['./programme-type-drawer.component.css']
})

export class ProgrammeTypeDrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: programmeTypeMaster;
  @Input() drawerVisible: boolean;
  isSpinning: boolean = false;
  namePattern = "([A-Za-z0-9 \s]){1,}";

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe) { }

  ngOnInit() { }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm): void {
    myForm.form.reset();
  }

  save(addNew: boolean, myForm: NgForm): void {
    var isOk = true;

    if ((this.data.NAME != undefined) && (this.data.NAME != null)) {
      if (this.data.NAME.trim() == '') {
        isOk = false;
        this.message.error("Please Enter Valid Type", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Type", "");
    }

    if (isOk) {
      this.isSpinning = true;

      if (this.data.ID) {
        this.api.updateProgrammeType(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Programme Type Updated Successfully", "");
            this.isSpinning = false;

            if (!addNew) {
              this.close(myForm);
            }

          } else {
            this.message.error("Programme Type Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.api.createProgrammeType(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Programme Type Created Successfully", "");
            this.isSpinning = false;

            if (!addNew) {
              this.close(myForm);

            } else {
              this.data = new programmeTypeMaster();
            }

          } else {
            this.message.error("Programme Type Creation Failed", "");
            this.isSpinning = false;
          }
        });
      }
    }
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }
}
