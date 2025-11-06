import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { DateAndScheduleModel } from 'src/app/Models/GiantWeekCelebration';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-date-and-schedule-drawer',
  templateUrl: './date-and-schedule-drawer.component.html',
  styleUrls: ['./date-and-schedule-drawer.component.css']
})
export class DateAndScheduleDrawerComponent implements OnInit {

  @Input() drawerClose!: Function;
  @Input() drawerVisible: boolean = false;
  @Input() data: DateAndScheduleModel = new DateAndScheduleModel();
  @Input() drawerWeekdataArray: any[];
  @Input() isRemarkVisible: boolean;
  @Input() closeDateAndSchedule: Function
  @Input() DateAndScheduleSaveInTable: Function;
  @Input() ArrayDateAndScheduleSaveInTable: any[] = [];


  constructor(public api: ApiService, private message: NzNotificationService, private cookie: CookieService, private datePipe: DatePipe) { }
  validation = true;
  ngOnInit() {
  }
  onChange(result: Date): void {
    console.log('onChange: ', result);
  }
  close(myForm) {
    this.drawerVisible = false;
    this.reset(myForm);
    this.closeDateAndSchedule();
  }
  save(addNew: boolean, myForm: NgForm) {
    this.validation = false;
    if (this.data.DATE == null || this.data.DATE == undefined) {
      this.message.error("Please Select Date", "");
    }
    else
      if (this.data.SCHEDULE.trim() == '' || this.data.SCHEDULE == undefined) {
        this.message.error("Please Enter Schedule", "");
      }
      else {
        this.validation = true;
        this.data.DATE = this.datePipe.transform(this.data.DATE, "yyyy-MM-dd")
        this.DateAndScheduleSaveInTable()
      }
  }
  reset(myForm: NgForm) {
    myForm.form.reset();
  }
}
