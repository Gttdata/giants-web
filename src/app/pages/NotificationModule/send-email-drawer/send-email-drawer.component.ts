import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzDatePickerComponent, NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-send-email-drawer',
  templateUrl: './send-email-drawer.component.html',
  styleUrls: ['./send-email-drawer.component.css']
})

export class SendEmailDrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  isSpinning = false;

  FROM_DATE: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  TO_DATE: string = this.datePipe.transform(new Date(), "yyyy-MM-dd");

  constructor(private api: ApiService, private message: NzNotificationService, private cookie: CookieService, private datePipe: DatePipe) { }

  userId = Number(this.cookie.get('userId'));
  roleId = Number(this.cookie.get('roleId'));
  orgId = Number(this.cookie.get('orgId'));
  deptId = Number(this.cookie.get('deptId'));
  branchId = Number(this.cookie.get('branchId'));
  designationId = Number(this.cookie.get('designationId'));

  ngOnInit() { }

  close(): void {
    this.drawerClose();
  }

  send(): void {
    var isOk = true;

    if (this.FROM_DATE == undefined) {
      isOk = false;
      this.message.error("Please Select Valid From Date", "");
    }

    if (this.TO_DATE == undefined) {
      isOk = false;
      this.message.error("Please Select Valid To Date", "");
    }

    if (isOk) {
      this.sendBtnStatus = true;

      this.FROM_DATE = this.datePipe.transform(this.FROM_DATE, "yyyy-MM-dd 00:00:00");
      this.TO_DATE = this.datePipe.transform(this.TO_DATE, "yyyy-MM-dd 23:59:59");

      this.api.sendEmail(this.FROM_DATE, this.TO_DATE, this.orgId).subscribe(data => {
        if (data['code'] == 200) {
          this.sendBtnStatus = false;
          this.message.success("Email Sent Successfully", "");
          this.close();

        } else {
          this.sendBtnStatus = false;
          this.message.error("Failed to Send Email", "");
        }

      }, err => {
        this.sendBtnStatus = false;

        if (err['ok'] == false)
          this.message.error("Failed to Send Email", "");
      });
    }
  }

  @ViewChild('moduleEndDatePicker', { static: false }) moduleEndDatePicker: NzDatePickerComponent;

  moduleStartDateHandle(open: boolean) {
    if (!open) {
      this.TO_DATE = null;
      this.TO_DATE = this.FROM_DATE;
    }
  }

  disabledEndDate = (endValue: Date): boolean => {
    if (this.FROM_DATE != null) {
      if (!endValue) {
        return false;
      }

      var modulePreviousDate = new Date(this.FROM_DATE);
      modulePreviousDate.setDate(modulePreviousDate.getDate() + (-1));

      return endValue <= new Date(modulePreviousDate);
    };
  }

  emmData = [];
  countLoading = false;
  sendBtnStatus = false;

  getCount() {
    var isOk = true;

    if (this.FROM_DATE == undefined) {
      isOk = false;
      this.message.error("Please Select Valid From Date", "");
    }

    if (this.TO_DATE == undefined) {
      isOk = false;
      this.message.error("Please Select Valid To Date", "");
    }

    if (isOk) {
      this.countLoading = true;
      this.emmData = [];

      this.FROM_DATE = this.datePipe.transform(this.FROM_DATE, "yyyy-MM-dd 00:00:00");
      this.TO_DATE = this.datePipe.transform(this.TO_DATE, "yyyy-MM-dd 23:59:59");

      this.api.getcountData(this.FROM_DATE, this.TO_DATE, this.orgId).subscribe(data => {
        if (data['code'] == 200) {
          this.countLoading = false;

          this.emmData = data['data'][0];
          console.log(this.emmData);

        } else {
          this.countLoading = false;
          this.message.error("Failed to Get Count", "");
        }

      }, err => {
        this.countLoading = false;

        if (err['ok'] == false)
          this.message.error("Failed to Get Count", "");
      });
    }
  }
}
