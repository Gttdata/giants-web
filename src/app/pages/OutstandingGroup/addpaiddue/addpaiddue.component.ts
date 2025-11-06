import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { DuePaidToFoundation } from 'src/app/Models/DuePaidToFoundation';
import { ApiService } from 'src/app/Service/api.service';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

@Component({
  selector: 'app-addpaiddue',
  templateUrl: './addpaiddue.component.html',
  styleUrls: ['./addpaiddue.component.css']
})

export class AddpaiddueComponent implements OnInit {
  @Input() drawerPaidDueClose: Function;
  @Input() PaidDueTable: Function;
  @Input() PaidDuedata: DuePaidToFoundation = new DuePaidToFoundation();
  @Input() drawerPaidDueVisible: boolean;
  numberpattern = /^[6-9]\d{9}$/;
  isSpinning = false;
  isOk = true;

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  @Output() paidDueChild: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
  }

  alphaOnly(event: any) {
    event = (event) ? event : window.event;
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }
   numbers = new RegExp(/^[0-9]+$/);
  save(addNew: boolean, myForm: NgForm) {
    this.isSpinning = false;
    this.isOk = true;

    if (this.PaidDuedata.DATE == undefined || this.PaidDuedata.DATE.toString() == '' || this.PaidDuedata.DATE == null) {
      this.isOk = false;
      this.message.error('Please Select Due Date', '');
    }

    else if (this.PaidDuedata.AMOUNT == undefined || this.PaidDuedata.AMOUNT.toString() == '' || this.PaidDuedata.AMOUNT == null) {
      this.isOk = false;
      this.message.error('Please Enter the Due Paid Amount', '');
    }
    else if((this.numbers.test(this.PaidDuedata.AMOUNT.toString())) == false){
      this.isOk = false;
      this.message.error('Please Enter the Due Amount in Number Only', '');
    }

    if (this.isOk) {
      // console.log("this.PaidDuetdata",  this.PaidDuedata);

      this.PaidDuedata.DATE = this.datePipe.transform(this.PaidDuedata.DATE, "yyyy-MM-dd");
      this.PaidDueTable();
      this.drawerPaidDueClose();
      this.isSpinning = false;
    }
  }

  close(myForm: NgForm): void {
    this.drawerPaidDueClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }
  today = new Date();

  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;

  };
}
