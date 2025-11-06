import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { REPORTSCHEDULE } from 'src/app/Models/report-schedule';
import { ApiService } from 'src/app/Service/api.service';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import setHours from 'date-fns/set_hours';
import { Rform } from 'src/app/Models/rform';

@Component({
  selector: 'app-schedule-report-create',
  templateUrl: './schedule-report-create.component.html',
  styleUrls: ['./schedule-report-create.component.css']
})

export class ScheduleReportCreateComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: REPORTSCHEDULE;
  @Input() dataReport: Rform
  @Input() drawerVisible: boolean;
  isSpinning = false;
  TIMEING = [];
  HH = [];
  DATES = [];
  MM = [];
  YEAR = [];
  MONTLYS = [];
  dataTypeAttachement = ['Html', 'Excel'];
  WEEKS = [['MON', 'Monday'], ['TUE', 'Tuesday'], ['WED', 'Wednesday'], ['THU', 'Thursday'], ['FRI', 'Friday'], ['SAT', 'Saturday'], ['SUN', 'Sunday']];
  MONTH = [['01', 'Janaury'], ['02', 'February'], ['03', 'March'], ['04', 'April'], ['05', 'May'], ['06', 'June'], ['07', 'July'], ['08', 'August'], ['09', 'September'], ['10', 'October'], ['11', 'November'], ['12', 'December']];
  validation: boolean = false;

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  today = new Date();
  timeDefaultValue = setHours(new Date(), 0);

  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(this.today, current) > 0;
  };

  onChange(result: Date): void {
    // console.log('Selected Time: ', result);
  }

  onOk(result: Date | Date[] | null): void {
    // console.log('onOk', result);
  }

  dates(month) {
    this.DATES = [];
    let j = '';

    if (month == '01' || month == '03' || month == '05' || month == '07' || month == '08' || month == '10' || month == '12') {
      for (let i = 1; i <= 31; i++) {
        if (i && this.DATES.indexOf(i) === -1) {
          if (i < 10) {
            j = String('0' + i);

          } else {
            j = String('' + i);
          }

          this.DATES = [...this.DATES, j];
        }
      }

    } else if (month == '04' || month == '06' || month == '09' || month == '11') {
      for (let i = 1; i <= 30; i++) {
        if (i && this.DATES.indexOf(i) === -1) {
          if (i < 10) {
            j = String('0' + i)
            console.log(j);

          } else {
            j = String('' + i)
          }

          this.DATES = [...this.DATES, j];
        }
      }

    } else if (month == '02') {
      for (let i = 1; i <= 29; i++) {
        if (i && this.DATES.indexOf(i) === -1) {
          if (i < 10) {
            j = String('0' + i);

          } else {
            j = String('' + i);
          }

          this.DATES = [...this.DATES, j];
        }
      }
    }
  }

  getreport() {
    this.api.getReportMatstar(0, 0, '', '', '').subscribe(data => {
      this.dataReport = data['data'];

    }, err => {
      console.log(err);
    });
  }

  ngOnInit() {
    this.data.SCHEDULE = 'D';
    this.getreport();
    this.gettime();
    this.getmonthly();
  }

  yeararray(month, date) {
    if (month == undefined) {
      this.message.error('Please Select Month', '');

    } else if (date == undefined) {
      this.message.error('Please Select Date', '');

    } else {
      var fulldate = month + "-" + date;

      if (this.data.YEAR == undefined || this.data.YEAR == null) {
        this.data.YEAR = [];
      }
      this.YEAR = this.data.YEAR;

      if (fulldate && this.YEAR.indexOf(fulldate) === -1) {
        this.YEAR = [...this.YEAR, fulldate];
      }

      this.data.YEAR = this.YEAR;
    }
  }

  timearray(timeing) {
    if (this.data.TIMEING == undefined || this.data.TIMEING == null) {
      this.data.TIMEING = [];
    }

    this.TIMEING = this.data.TIMEING;
    var time = this.datePipe.transform(timeing, "HH:mm:00");

    if (time && this.TIMEING.indexOf(time) === -1) {
      this.TIMEING = [...this.TIMEING, time];
    }

    this.data.TIMEING = this.TIMEING;
    this.data.DDTIME = null;
  }

  getmonthly() {
    for (let i = 1; i <= 31; i++) {
      let j = '';

      if (i && this.MONTLYS.indexOf(i) === -1) {
        if (i < 10) {
          j = String('0' + i)

        } else {
          j = String('' + i)
        }

        this.MONTLYS = [...this.MONTLYS, j];
      }
    }
  }

  gettime() {
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        var time = "0" + i;

      } else {
        var time = '' + i;
      }

      if (time && this.HH.indexOf(time) === -1) {
        this.HH = [...this.HH, time];
      }
    }

    for (let j = 0; j < 60; j++) {
      if (j < 10) {
        var mm = '0' + j;
      }
      else {
        var mm = j + "";
      }

      if (mm && this.MM.indexOf(mm) === -1) {
        this.MM = [...this.MM, mm];
      }
    }
  }

  Emails = [];

  getEmails(email: string): void {
    if (email.length >= 3) {
      this.api.getAllMembers(0, 0, "EMAIL_ID", "asc", " AND EMAIL_ID like '%" + email + "%' AND EMAIL_ID Not like '%,%' AND EMAIL_ID != '' Group By EMAIL_ID").subscribe(data => {
        if (data['code'] == 200) {
          this.Emails = data['data'];
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  close(myForm: NgForm): void {
    this.isSpinning = false;
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }

  submit(addnew: boolean, myForm: NgForm): void {
    this.data.CUSTOM_DATE = this.datePipe.transform(this.data.CUSTOM_DATE, "yyyy-MM-dd");
    if (this.data.REPORT_ID == null && this.data.REPORT_ID == undefined) { this.message.error("Name", "Please fill the field"); }
    else if (this.data.EMAIL == undefined || this.data.EMAIL.length == 0) { this.message.error("Email", "Please fill the field"); }
    else if (this.data.SCHEDULE == '') { this.message.error("SCHEDULE", "Please fill the field"); }
    else if (this.data.TIMEING == undefined || this.data.TIMEING.length == 0) { this.message.error("Time", "Please fill the field"); }
    else if ((this.data.EVERY_WEEK == undefined || this.data.EVERY_WEEK.length == 0) && this.data.SCHEDULE == 'E') { this.message.error("Week", "Please fill the field"); }
    else if ((this.data.MONTH == undefined || this.data.MONTH.length == 0) && this.data.SCHEDULE == 'M') { this.message.error("Month", "Please fill the field"); }
    else if ((this.data.YEAR == undefined || this.data.YEAR.length == 0) && this.data.SCHEDULE == 'Y') { this.message.error("Year", "Please fill the field"); }
    else if ((this.data.CUSTOM_DATE == '' || this.data.CUSTOM_DATE == null) && this.data.SCHEDULE == 'C') { this.message.error("Date", "Please fill the field"); }
    else if (this.data.TYPE_OF_ATTACHEMENT == '' || this.data.TYPE_OF_ATTACHEMENT == undefined) { this.message.error("Type Of Attachement", "Please fill the field"); }
    else {
      this.isSpinning = true;
      if (this.data.SCHEDULE != 'E') {
        this.data.EVERY_WEEK = ' ';
      }
      if (this.data.SCHEDULE != 'M') {
        this.data.MONTH = ' ';
      }
      if (this.data.SCHEDULE != 'Y') {
        this.data.YEAR = ' ';
      }
      if (this.data.SCHEDULE != 'C') {
        this.data.CUSTOM_DATE = null;
      }

      this.data.EMAIL = this.data.EMAIL.toString();
      this.data.TIMEING = this.data.TIMEING.toString();
      this.data.EVERY_WEEK = this.data.EVERY_WEEK.toString();
      this.data.MONTH = this.data.MONTH.toString();
      this.data.YEAR = this.data.YEAR.toString();

      if (this.data.ID) {
        this.api.reportScheduledUpdate(this.data).subscribe(data => {
          if (data["code"] == 200) {
            this.message.success("Update Successfully", "");
            this.close(myForm);
            this.isSpinning = false;

          } else {
            this.message.error("Report Schduleding Creation Failed", "");
            this.isSpinning = false;
          }
        })

      } else {
        this.api.reportScheduledCreate(this.data).subscribe(data => {
          if (data["code"] == 200) {
            this.message.success("Save Successfully", "");
            this.close(myForm);
            this.isSpinning = false;

          } else {
            this.message.error("Report Schduleding Creation Failed", "");
            this.isSpinning = false;
          }
        })
      }
    }
  }
}  