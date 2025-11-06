import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { GroupSponsered } from 'src/app/Models/GroupSponsered';
import { ApiService } from 'src/app/Service/api.service';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

@Component({
  selector: 'app-addgroupsponsered',
  templateUrl: './addgroupsponsered.component.html',
  styleUrls: ['./addgroupsponsered.component.css']
})

export class AddgroupsponseredComponent implements OnInit {
  @Input() drawerGroupSponsClose: Function;
  @Input() grpSponsTable: Function;
  @Input() GroupSponsdata: GroupSponsered = new GroupSponsered();
  @Input() drawerGroupSponsVisible: boolean;
  numberpattern = /^[6-9]\d{9}$/;
  isSpinning = false;
  isOk = true;
  @Output() groupSponsChild: EventEmitter<any> = new EventEmitter<any>();

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() { }

  alphaOnly(event: any) {
    event = (event) ? event : window.event;
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }

  save(addNew: boolean, myForm: NgForm) {
    this.isSpinning = false;
    this.isOk = true;

    if (this.GroupSponsdata.SPONSERED_GROUP_NAME == undefined || this.GroupSponsdata.SPONSERED_GROUP_NAME.toString() == '' || this.GroupSponsdata.SPONSERED_GROUP_NAME == null) {
      this.isOk = false;
      this.message.error('Please Enter the Sponsered Group Name', '');
    }
    else if (this.GroupSponsdata.DATE_OF_INAUGUARTION == undefined || this.GroupSponsdata.DATE_OF_INAUGUARTION.toString() == '' || this.GroupSponsdata.DATE_OF_INAUGUARTION == null) {
      this.isOk = false;
      this.message.error('Select the Inauguartion Date', '');
    }
    else if (this.GroupSponsdata.PRESENT_STATUS == undefined || this.GroupSponsdata.PRESENT_STATUS.toString() == '' || this.GroupSponsdata.PRESENT_STATUS == null) {
      this.isOk = false;
      this.message.error('Please Enter the Present Status', '');
    }

    if (this.isOk) {
      console.log("this.PaidDuetdata", this.GroupSponsdata);

      this.GroupSponsdata.DATE_OF_INAUGUARTION = this.datePipe.transform(this.GroupSponsdata.DATE_OF_INAUGUARTION, "yyyy-MM-dd");

      this.grpSponsTable();
      this.drawerGroupSponsClose();
      this.isSpinning = false;
    }




    // if (!addNew)
    // this.close(myForm);
  }

  close(myForm: NgForm): void {
    this.drawerGroupSponsClose();
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
