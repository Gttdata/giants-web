import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { UnitMaster } from 'src/app/Models/UnitMaster';
import { ApiService } from 'src/app/Service/api.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-unit-drawer',
  templateUrl: './unit-drawer.component.html',
  styleUrls: ['./unit-drawer.component.css']
})

export class UnitDrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: UnitMaster;
  @Input() drawerVisible: boolean;
  isSpinning = false;
  leaveTypes = [];
  namePattern = "([A-Za-z0-9 \s]){1,}";
  shortNamePattern = "([A-Za-z0-9- \s]){1,}";
  federationID = this._cookie.get("FEDERATION_ID");
  unitID = this._cookie.get("UNIT_ID");
  groupID = this._cookie.get("GROUP_ID");

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() {
    this.getFederations();
  }

  federations = [];

  getFederations() {
    var federationFilter = "";
    if (this.federationID != "0") {
      federationFilter = " AND ID=" + this.federationID;
    }

    var unitFilter = "";
    if (this.unitID != "0") {
      unitFilter = " AND ID=(SELECT FEDERATION_ID FROM unit_master WHERE ID=" + this.unitID + ")";
    }

    this.federations = [];

    this.api.getAllFederations(0, 0, "NAME", "asc", " AND STATUS=1" + federationFilter + unitFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.federations = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  save(addNew: boolean, myForm: NgForm): void {
    var isOk = true;

    if (this.data.FEDERATION_ID == undefined || this.data.FEDERATION_ID == null) {
      isOk = false;
      this.message.error("Please Selct Valid Federation", "");
    }

    if (this.data.NAME != undefined && this.data.NAME != null) {
      if (this.data.NAME.trim() != '') {
        if (!this.api.checkTextBoxIsValid(this.data.NAME)) {
          isOk = false;
          this.message.error("Please Enter Valid Unit Name", "");
        }

      } else {
        isOk = false;
        this.message.error("Please Enter Valid Unit Name", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Unit Name", "");
    }

    if (this.data.SHORT_NAME != undefined && this.data.SHORT_NAME != null) {
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

    if (this.data.BO_DATE == undefined || this.data.BO_DATE == null) {
      isOk = false;
      this.message.error("Please Selct Valid Date", "");
    }

    if (isOk) {
      this.isSpinning = true;
      this.data.BO_DATE = this.datePipe.transform(this.data.BO_DATE, "yyyy-MM-dd");

      if (this.data.ID) {
        this.api.updateUnit(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Unit Details Updated Successfully", "");
            this.isSpinning = false;

            if (!addNew)
              this.close(myForm);

          } else {
            this.message.error("Unit Details Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.api.createUnit(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Unit Created Successfully", "");
            this.isSpinning = false;

            if (!addNew)
              this.close(myForm);

            else {
              this.data = new UnitMaster();
            }

          } else {
            this.message.error("Unit Creation Failed", "");
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

  today = new Date().setDate(new Date().getDate());

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) < 0;
}
