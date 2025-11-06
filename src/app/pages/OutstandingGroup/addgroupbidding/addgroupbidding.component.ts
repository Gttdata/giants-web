import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OutstandingGroupMaster } from 'src/app/Models/OutstandingGroupMaster';
import { UndertakenProjectDetails } from 'src/app/Models/UndertakenProjectDetails';
import { DuePaidToFoundation } from 'src/app/Models/DuePaidToFoundation';
import { MediaCoverings } from 'src/app/Models/MediaCoverings';
import { ContinuingProjectDetails } from 'src/app/Models/ContinuingProjectDetails';
import { GroupSponsered } from 'src/app/Models/GroupSponsered';
import { ApiService } from 'src/app/Service/api.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

@Component({
  selector: 'app-addgroupbidding',
  templateUrl: './addgroupbidding.component.html',
  styleUrls: ['./addgroupbidding.component.css']
})

export class AddgroupbiddingComponent implements OnInit {
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  federationID = this._cookie.get("FEDERATION_ID");
  unitID = this._cookie.get("UNIT_ID");
  groupID = this._cookie.get("GROUP_ID");
  roleID: number = this.api.roleId;

  @Input() drawerClose: Function;
  @Input() data: OutstandingGroupMaster;
  @Input() drawerVisible: boolean;

  currentIndex: number = -1;
  projectMediaCoverArray1: MediaCoverings[] = [];
  @Input() projectMediaCoverArrayQuery: MediaCoverings[] = [];
  projectMediaCoverArray: MediaCoverings[] = [];
  formTitle = "Add New Project Details";
  drawerProjectTitle: string;
  drawerProjectVisible: boolean;
  drawerProjectData: UndertakenProjectDetails = new UndertakenProjectDetails();
  projectData: any[] = [];
  @Input() projectArray: UndertakenProjectDetails[] = [];
  drawerPaidDueTitle: string;
  drawerPaidDueVisible: boolean;
  drawerPaidDueData: DuePaidToFoundation = new DuePaidToFoundation();
  @Input() paidDueArray: DuePaidToFoundation[] = [];
  drawerMediaCoverTitle: string;
  drawerMediaCoverVisible: boolean;
  drawerMediaCoverData: MediaCoverings = new MediaCoverings();
  @Input() mediaCoverArray: MediaCoverings[] = [];
  @Input() projectMediaCoverArrayData: MediaCoverings[] = [];
  @Input() FormStatus: string;
  drawerContiProjectTitle: string;
  drawerContiProjectVisible: boolean;
  drawerContiProjectData: ContinuingProjectDetails = new ContinuingProjectDetails();
  @Input() contiProjectArray: ContinuingProjectDetails[] = [];
  drawerGroupSponsTitle: string;
  drawerGroupSponsVisible: boolean;
  drawerGroupSponsData: GroupSponsered = new GroupSponsered();
  @Input() groupSponsArray: GroupSponsered[] = [];
  url1: any;
  url2: any;
  url3: any;
  numberpattern = /^[6-9]\d{9}$/;
  isSpinning = false;
  isOk = true;
  Swicthing = true;
  isVisible = false;
  totalRecords = 1;
  OldFetchedData: string[] = [];

  constructor(public api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() {
    this.year = new Date().getFullYear();
    this.SelectedYear = this.year
    this.currentYear = this.SelectedYear;

    this.LoadYears();
    this.Fordate();
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

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  numberOnly1(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }


    return true;
  }

  numberOnly2(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }


    return true;
  }


  numbers = new RegExp(/^\d+(\.\d{1,2})?$/);
  // pointingNumber = new RegExp(/^[0-9]+$+/);

  ApplySubmit(myForm: NgForm) {
    this.data.IS_SUBMITED = 'S';
    this.save(false, myForm);
  }

  save(addNew: boolean, myForm: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    this.data.AWARD_TYPE = this.FormStatus;
    console.log("Award Type  ", this.data.AWARD_TYPE);

    this.data.GROUP_ID = parseInt(this.groupID);
    // this.data.GROUP_ID = 81;
    // console.log("projectMediaCoverArray" + this.projectMediaCoverArray);
    this.data.UNDER_PROJECT_DETAILS = this.projectArray;
    this.data.DUES_PAID_TO_F = this.paidDueArray;
    // console.log("this.mediaCoverArray123 = " + this.mediaCoverArray);
    // console.log("this.projectMediaCoverArray123 = " + this.projectMediaCoverArray);

    if (this.mediaCoverArray != null && this.projectMediaCoverArray != null) {
      this.data.MEDIA_COVERAGE = [...this.mediaCoverArray, ...this.projectMediaCoverArray];
    }
    else if (this.mediaCoverArray != null) {
      this.data.MEDIA_COVERAGE = this.mediaCoverArray;
    }
    else if (this.projectMediaCoverArray != null) {
      this.data.MEDIA_COVERAGE = this.projectMediaCoverArray;
    }
    // console.log("this.data.MEDIA_COVERAGE123 = " + this.data.MEDIA_COVERAGE);
    this.data.C_PROJECT_DETAILS = this.contiProjectArray;
    this.data.SPONSERED_GROUP = this.groupSponsArray;
    this.data.DATE_OF_BIDING = new Date();

    if (this.Swicthing == false) {
      this.data.OUTSTANDING_DUES_DETAILS = 'NA';
      this.data.OUTSTANDING_DUES_AMOUNT = 0;
    }

    if ((this.data.GROUP_MEETINGS == undefined || this.data.GROUP_MEETINGS.toString() == '' || this.data.GROUP_MEETINGS == null)
    && (this.data.AVG_ATTENDANCE_MEETINGS == undefined || this.data.GROUP_MEETINGS.toString() == '' || this.data.GROUP_MEETINGS == null)
    && (this.data.MONTHLY_REPORTING_SENT == undefined || this.data.MONTHLY_REPORTING_SENT.toString() == '' || this.data.MONTHLY_REPORTING_SENT == null)
    && (this.data.BOARD_MEETINGS == undefined || this.data.BOARD_MEETINGS.toString() == '' || this.data.BOARD_MEETINGS == null)
    && (this.data.BOARD_MEETINGS_ATTENDENCE == undefined || this.data.BOARD_MEETINGS_ATTENDENCE.toString() == '' || this.data.BOARD_MEETINGS_ATTENDENCE == null)
    && (this.data.OUTSTANDING_DUES_DETAILS.trim() == '' && this.data.SWICTHING == true)
    && (this.data.FUND_RAISING_GAINED_AMOUNT == undefined || this.data.FUND_RAISING_GAINED_AMOUNT.toString() == '' || this.data.FUND_RAISING_GAINED_AMOUNT == null)
    && (this.data.MEMBERSHIP_ON_31_MARCH == undefined || this.data.MEMBERSHIP_ON_31_MARCH.toString() == '' || this.data.MEMBERSHIP_ON_31_MARCH == null)
    && (this.data.MEMBERSHIP_ON_30_SEPT == undefined || this.data.MEMBERSHIP_ON_30_SEPT.toString() == '' || this.data.MEMBERSHIP_ON_30_SEPT == null)
    && (this.data.MEMBERSHIP_ON_31_DEC == undefined || this.data.MEMBERSHIP_ON_31_DEC.toString() == '' || this.data.MEMBERSHIP_ON_31_DEC == null)
    && (this.data.ATTENDANCE_OF_UNIT_COUNCILS_COUNT == undefined || this.data.ATTENDANCE_OF_UNIT_COUNCILS_COUNT.toString() == '' || this.data.ATTENDANCE_OF_UNIT_COUNCILS_COUNT == null)
    && (this.data.ATTENDANCE_OF_UNIT_COUNCILS_TOTAL == undefined || this.data.ATTENDANCE_OF_UNIT_COUNCILS_TOTAL.toString() == '' || this.data.ATTENDANCE_OF_UNIT_COUNCILS_TOTAL == null)
    && (this.data.ATTENDANCE_OF_UNIT_CONFERENCES_COUNT == undefined || this.data.ATTENDANCE_OF_UNIT_CONFERENCES_COUNT.toString() == '' || this.data.ATTENDANCE_OF_UNIT_CONFERENCES_COUNT == null)
    && (this.data.ATTENDANCE_OF_PAST_GWF_COUNT == undefined || this.data.ATTENDANCE_OF_PAST_GWF_COUNT.toString() == '' || this.data.ATTENDANCE_OF_PAST_GWF_COUNT == null)
    && (this.data.OTHER_DETAILS == undefined || this.data.OTHER_DETAILS.toString() == '' || this.data.OTHER_DETAILS == null)
    && (this.data.MEMBER_MAILING_LIST_SENT_PRESENT_YEAR == undefined || this.data.MEMBER_MAILING_LIST_SENT_PRESENT_YEAR.toString() == '' || this.data.MEMBER_MAILING_LIST_SENT_PRESENT_YEAR == null)
    && (this.data.BOD_MAILING_LIST_SENT_PRESENT_YEAR == undefined || this.data.BOD_MAILING_LIST_SENT_PRESENT_YEAR.toString() == '' || this.data.BOD_MAILING_LIST_SENT_PRESENT_YEAR == null)
    && (this.data.MEMBER_MAILING_LIST_SENT_ENSUING_YEAR == undefined || this.data.MEMBER_MAILING_LIST_SENT_ENSUING_YEAR.toString() == '' || this.data.MEMBER_MAILING_LIST_SENT_ENSUING_YEAR == null)
    && (this.data.BOD_MAILING_LIST_SENT_ENSUING_YEAR == undefined || this.data.BOD_MAILING_LIST_SENT_ENSUING_YEAR.toString() == '' || this.data.BOD_MAILING_LIST_SENT_ENSUING_YEAR == null)
    ) {
      this.isOk = false;
      this.data.IS_SUBMITED = 'D';
      this.message.error('Please enter all the mandatory field', '');        
    }
    else {
      if (this.data.DATE_OF_BIDING == undefined || this.data.DATE_OF_BIDING.toString() == '' || this.data.DATE_OF_BIDING == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Select Biding Date', '');
      }
      else if (this.data.GROUP_MEETINGS == undefined || this.data.GROUP_MEETINGS.toString() == '' || this.data.GROUP_MEETINGS == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Number of Meetings Held During the Year ', '');
      }
      else if ((this.numbers.test(this.data.GROUP_MEETINGS.toString())) == false) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Meetings Held in Number Only', '');
      }
      else if (this.data.AVG_ATTENDANCE_MEETINGS == undefined || this.data.GROUP_MEETINGS.toString() == '' || this.data.GROUP_MEETINGS == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Avarage meeting attended During the Year ', '');
      }
      else if ((this.numbers.test(this.data.AVG_ATTENDANCE_MEETINGS.toString())) == false) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Avarage meeting attended in Number Only', '');
      }
      else if (this.data.MONTHLY_REPORTING_SENT == undefined || this.data.MONTHLY_REPORTING_SENT.toString() == '' || this.data.MONTHLY_REPORTING_SENT == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Monthly sent report count ', '');
      }
      else if ((this.numbers.test(this.data.MONTHLY_REPORTING_SENT.toString())) == false) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Monthly sent report count in Number Only', '');
      }
      else if (this.data.BOARD_MEETINGS == undefined || this.data.BOARD_MEETINGS.toString() == '' || this.data.BOARD_MEETINGS == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Board meetings Held During the Year ', '');
      }
      else if ((this.numbers.test(this.data.BOARD_MEETINGS.toString())) == false) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Board meetings Held in Number Only', '');
      }
      else if (this.data.BOARD_MEETINGS_ATTENDENCE == undefined || this.data.BOARD_MEETINGS_ATTENDENCE.toString() == '' || this.data.BOARD_MEETINGS_ATTENDENCE == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Avarage Board meeting attended During the Year ', '');
      }
      else if ((this.numbers.test(this.data.BOARD_MEETINGS_ATTENDENCE.toString())) == false) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Avarage Board meeting attended in Number Only', '');
      }


      else if (this.data.OUTSTANDING_DUES_DETAILS.trim() == '' && this.data.SWICTHING == true) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error("Outstanding Amount & Details", "Please fill the field");
      }



      else if ((this.numbers.test(this.data.FUND_RAISING_COLLECTED_AMOUNT.toString())) == false) {
        this.isOk = false;
        this.message.error('Please Enter the Fund Raising Collected Amount in Number Only', '');
      }
      else if (this.data.FUND_RAISING_GAINED_AMOUNT == undefined || this.data.FUND_RAISING_GAINED_AMOUNT.toString() == '' || this.data.FUND_RAISING_GAINED_AMOUNT == null) {
        this.isOk = false;
        this.message.error('Please Enter the Fund Raising Gained Amount ', '');
      }
      else if ((this.numbers.test(this.data.FUND_RAISING_GAINED_AMOUNT.toString())) == false) {
        this.isOk = false;
        this.message.error('Please Enter the Fund Raising Gained Amount in Number Only', '');
      }
      else if (this.data.MEMBERSHIP_ON_31_MARCH == undefined || this.data.MEMBERSHIP_ON_31_MARCH.toString() == '' || this.data.MEMBERSHIP_ON_31_MARCH == null) {
        this.isOk = false;
        this.message.error('Please Enter the Total Membership on 31th March ', '');
      }
      else if ((this.numbers.test(this.data.MEMBERSHIP_ON_31_MARCH.toString())) == false) {
        this.isOk = false;
        this.message.error('Please Enter the Total Membership on 31th March in Number Only', '');
      }
      else if (this.data.MEMBERSHIP_ON_30_SEPT == undefined || this.data.MEMBERSHIP_ON_30_SEPT.toString() == '' || this.data.MEMBERSHIP_ON_30_SEPT == null) {
        this.isOk = false;
        this.message.error('Please Enter the Total Membership on 30th Sept ', '');
      }
      else if ((this.numbers.test(this.data.MEMBERSHIP_ON_30_SEPT.toString())) == false) {
        this.isOk = false;
        this.message.error('Please Enter the Total Membership on 30th Sept in Number Only', '');
      }
      else if (this.data.MEMBERSHIP_ON_31_DEC == undefined || this.data.MEMBERSHIP_ON_31_DEC.toString() == '' || this.data.MEMBERSHIP_ON_31_DEC == null) {
        this.isOk = false;
        this.message.error('Please Enter the Total Membership on 31th Dec ', '');
      }
      else if ((this.numbers.test(this.data.MEMBERSHIP_ON_31_DEC.toString())) == false) {
        this.isOk = false;
        this.message.error('Please Enter the Total Membership on 31th Dec in Number Only', '');
      }
      else if (this.data.ATTENDANCE_OF_UNIT_COUNCILS_COUNT == undefined || this.data.ATTENDANCE_OF_UNIT_COUNCILS_COUNT.toString() == '' || this.data.ATTENDANCE_OF_UNIT_COUNCILS_COUNT == null) {
        this.isOk = false;
        this.message.error('Please Enter the Attendance of Unit Councils Count ', '');
      }
      else if ((this.numbers.test(this.data.ATTENDANCE_OF_UNIT_COUNCILS_COUNT.toString())) == false) {
        this.isOk = false;
        this.message.error('Please Enter the Attendance of Unit Councils Count in Number Only', '');
      }
      else if (this.data.ATTENDANCE_OF_UNIT_COUNCILS_TOTAL == undefined || this.data.ATTENDANCE_OF_UNIT_COUNCILS_TOTAL.toString() == '' || this.data.ATTENDANCE_OF_UNIT_COUNCILS_TOTAL == null) {
        this.isOk = false;
        this.message.error('Please Enter the Out of total Attendance of Unit Councils Count ', '');
      }
      else if ((this.numbers.test(this.data.ATTENDANCE_OF_UNIT_COUNCILS_TOTAL.toString())) == false) {
        this.isOk = false;
        this.message.error('Please Enter the Out of total Attendance of Unit Councils Count in Number Only', '');
      }
      else if (this.data.ATTENDANCE_OF_UNIT_COUNCILS_COUNT > this.data.ATTENDANCE_OF_UNIT_COUNCILS_TOTAL) {
        this.isOk = false;
        this.message.error('Please Enter UNIT COUNCILS Member Count Less ', '');
      }
      else if (this.data.ATTENDANCE_OF_UNIT_CONFERENCES_COUNT == undefined || this.data.ATTENDANCE_OF_UNIT_CONFERENCES_COUNT.toString() == '' || this.data.ATTENDANCE_OF_UNIT_CONFERENCES_COUNT == null) {
        this.isOk = false;
        this.message.error('Please Enter the Attendance of Unit Conference Count ', '');
      }

      else if ((this.numbers.test(this.data.ATTENDANCE_OF_UNIT_CONFERENCES_COUNT.toString())) == false) {
        this.isOk = false;
        this.message.error('Please Enter the Attendance of Unit Conference Count in Number Only', '');
      }
      else if (this.data.ATTENDANCE_OF_UNIT_CONFERENCES_TOTAL == undefined || this.data.ATTENDANCE_OF_UNIT_CONFERENCES_TOTAL.toString() == '' || this.data.ATTENDANCE_OF_UNIT_CONFERENCES_TOTAL == null) {
        this.isOk = false;
        this.message.error('Please Enter the Out of total Attendance of Unit Conference Count ', '');
      }
      else if ((this.numbers.test(this.data.ATTENDANCE_OF_UNIT_CONFERENCES_TOTAL.toString())) == false) {
        this.isOk = false;
        this.message.error('Please Enter the Out of total Attendance of Unit Conference Count in Number Only', '');
      }
      else if (this.data.ATTENDANCE_OF_UNIT_CONFERENCES_COUNT > this.data.ATTENDANCE_OF_UNIT_CONFERENCES_TOTAL) {
        this.isOk = false;
        this.message.error('Please Enter UNIT CONFERENCES Member Count Less ', '');
      }
      else if (this.data.ATTENDANCE_OF_PAST_GWF_COUNT == undefined || this.data.ATTENDANCE_OF_PAST_GWF_COUNT.toString() == '' || this.data.ATTENDANCE_OF_PAST_GWF_COUNT == null) {
        this.isOk = false;
        this.message.error('Please Enter the Attendance of Past GWF Count ', '');
      }
      else if ((this.numbers.test(this.data.ATTENDANCE_OF_PAST_GWF_COUNT.toString())) == false) {
        this.isOk = false;
        this.message.error('Please Enter the Attendance of Past GWF Count in Number Only', '');
      }
      else if (this.data.ATTENDANCE_OF_PAST_GWF_TOTAL == undefined || this.data.ATTENDANCE_OF_PAST_GWF_TOTAL.toString() == '' || this.data.ATTENDANCE_OF_PAST_GWF_TOTAL == null) {
        this.isOk = false;
        this.message.error('Please Enter the Out of total Attendance of Past GWF Count ', '');
      }
      else if ((this.numbers.test(this.data.ATTENDANCE_OF_PAST_GWF_TOTAL.toString())) == false) {
        this.isOk = false;
        this.message.error('Please Enter the Out of total Attendance of Past GWF Count in Number Only', '');
      }
      else if (this.data.ATTENDANCE_OF_PAST_GWF_COUNT > this.data.ATTENDANCE_OF_PAST_GWF_TOTAL) {
        this.isOk = false;
        this.message.error('Please Enter Past GWF CONVENTION Member Count Less ', '');
      }
      else if (this.data.OTHER_DETAILS == undefined || this.data.OTHER_DETAILS.toString() == '' || this.data.OTHER_DETAILS == null) {
        this.isOk = false;
        this.message.error(' Please enter the other Information Details', '');
      }
      else if (this.data.MEMBER_MAILING_LIST_SENT_PRESENT_YEAR == undefined || this.data.MEMBER_MAILING_LIST_SENT_PRESENT_YEAR.toString() == '' || this.data.MEMBER_MAILING_LIST_SENT_PRESENT_YEAR == null) {
        this.isOk = false;
        this.message.error('Please Select Present Year Members list mail sent Date', '');
      }
      else if (this.data.BOD_MAILING_LIST_SENT_PRESENT_YEAR == undefined || this.data.BOD_MAILING_LIST_SENT_PRESENT_YEAR.toString() == '' || this.data.BOD_MAILING_LIST_SENT_PRESENT_YEAR == null) {
        this.isOk = false;
        this.message.error('Please Select Present Year BOD list mail sent Date', '');
      }
      else if (this.data.MEMBER_MAILING_LIST_SENT_ENSUING_YEAR == undefined || this.data.MEMBER_MAILING_LIST_SENT_ENSUING_YEAR.toString() == '' || this.data.MEMBER_MAILING_LIST_SENT_ENSUING_YEAR == null) {
        this.isOk = false;
        this.message.error('Please Select Ensuing Year Members list mail sent Date', '');
      }
      else if (this.data.BOD_MAILING_LIST_SENT_ENSUING_YEAR == undefined || this.data.BOD_MAILING_LIST_SENT_ENSUING_YEAR.toString() == '' || this.data.BOD_MAILING_LIST_SENT_ENSUING_YEAR == null) {
        this.isOk = false;
        this.message.error('Please Select Ensuing Year BOD list mail sent Date', '');
      }

    }





    if (this.isOk) {

      this.isSpinning = true;

      this.data.AVG_ATTENDANCE_MEETINGS = Number(this.data.AVG_ATTENDANCE_MEETINGS);
      this.data.BOARD_MEETINGS_ATTENDENCE = Number(this.data.BOARD_MEETINGS_ATTENDENCE);
      if (this.data.SWICTHING == true) {

        console.log("True = ", this.data.SWICTHING);

        this.data.OUTSTANDING_DUES_AMOUNT = Number(this.data.OUTSTANDING_DUES_AMOUNT);
      }
      this.data.FUND_RAISING_GAINED_AMOUNT = Number(this.data.FUND_RAISING_GAINED_AMOUNT);

      if (this.data.SWICTHING != true) {
        console.log("False = ", this.data.SWICTHING);

        this.data.OUTSTANDING_DUES_DETAILS = ' '
        this.data.OUTSTANDING_DUES_AMOUNT = 0;
      }


      this.data.DATE_OF_BIDING = this.datePipe.transform(this.data.DATE_OF_BIDING, "yyyy-MM-dd");
      this.data.BOD_MAILING_LIST_SENT_ENSUING_YEAR = this.datePipe.transform(this.data.BOD_MAILING_LIST_SENT_ENSUING_YEAR, "yyyy-MM-dd");
      this.data.BOD_MAILING_LIST_SENT_PRESENT_YEAR = this.datePipe.transform(this.data.BOD_MAILING_LIST_SENT_PRESENT_YEAR, "yyyy-MM-dd");
      this.data.MEMBER_MAILING_LIST_SENT_ENSUING_YEAR = this.datePipe.transform(this.data.MEMBER_MAILING_LIST_SENT_ENSUING_YEAR, "yyyy-MM-dd");
      this.data.MEMBER_MAILING_LIST_SENT_PRESENT_YEAR = this.datePipe.transform(this.data.MEMBER_MAILING_LIST_SENT_PRESENT_YEAR, "yyyy-MM-dd");


      // this.imageUpload1();
      // this.drawerMediaCoverData.PHOTO_URL1 = (this.photo1Str == "") ? " " : this.photo1Str;

      // this.imageUpload2();
      // this.drawerMediaCoverData.PHOTO_URL2 = (this.photo2Str == "") ? " " : this.photo2Str;

      // this.imageUpload3();
      // this.drawerMediaCoverData.PHOTO_URL3 = (this.photo3Str == "") ? " " : this.photo3Str;

      if (this.data.ID) {

        this.api.updateOutstandingGroup(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Outstanding Group Details Updated Successfully", "");
            this.isSpinning = false;

            if (!addNew)
              this.close(myForm);

          } else {
            this.message.error("Outstanding Group Details Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.api.createOutstandingGroup(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Outstanding Group Created Successfully", "");
            this.isSpinning = false;

            if (!addNew)
              this.close(myForm);

            else {
              this.data = new OutstandingGroupMaster();
            }

          } else {
            this.message.error("Outstanding Group Creation Failed", "");
            this.isSpinning = false;
          }
        });
      }
    }
  }

  close(myForm: NgForm): void {
    this.projectMediaCoverArray = null;
    this.projectArray = null
    this.paidDueArray = null;
    this.mediaCoverArray = null;
    this.contiProjectArray = null;
    this.groupSponsArray = null;

    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  drawerPaidDueClose(): void {
    this.drawerPaidDueVisible = false;
  }
  get PaidDueTableCallback() {
    return this.PaidDueTable.bind(this);
  }
  PaidDueTable(): void {
    console.log("Closed function " + this.drawerPaidDueData.DATE);
    if (this.currentIndex > -1) {
      this.paidDueArray[this.currentIndex] = this.drawerPaidDueData;
      this.paidDueArray = [...[], ...this.paidDueArray];
      console.log("If condition called");
      this.message.success("Due Paid Details Updated Successfully..", "");
    }
    else {
      console.log("Project Array == " + this.paidDueArray);
      this.paidDueArray = [...this.paidDueArray, ...[this.drawerPaidDueData]];
      console.log("Else condition called");
      this.message.success("Due Paid Details Created Successfully..", "");
    }
    this.currentIndex = -1;
    console.log("Project Array" + this.paidDueArray);
    this.drawerPaidDueVisible = false;
    // console.log("other condition called");
    // this.message.success("other condition called", "");
  }
  addPaidDue(): void {
    console.log("Drawer cllaed..");

    this.drawerPaidDueTitle = "Due Details";
    this.drawerPaidDueData = new DuePaidToFoundation();
    this.drawerPaidDueVisible = true;
  }
  editPaidDue(data: DuePaidToFoundation, index: number): void {
    this.currentIndex = index

    this.drawerPaidDueTitle = "Update Due Paid Details";
    this.drawerPaidDueData = Object.assign({}, data);
    this.drawerPaidDueVisible = true;
  }


  drawerContiProjectClose(): void {
    this.drawerContiProjectVisible = false;
  }

  get contiProjectTableCallback() {
    return this.contiProjectTable.bind(this);
  }
  contiProjectTable(): void {
    // this.search();
    // this.projectData.push(this.drawerProjectData);
    console.log("Closed function " + this.drawerContiProjectData.DESCRIPTION);
    if (this.currentIndex > -1) {
      this.contiProjectArray[this.currentIndex] = this.drawerContiProjectData;
      this.contiProjectArray = [...[], ...this.contiProjectArray];
      this.message.success("Continuing projects Details Updated Successfully..", "");

    }
    else {
      this.contiProjectArray = [...this.contiProjectArray, ...[this.drawerContiProjectData]];
      this.message.success("Continuing projects Details Created Successfully..", "");
    }
    this.currentIndex = -1;
    console.log("Conti Array" + this.contiProjectArray);
    this.drawerProjectVisible = false;
  }
  addContiProject(): void {
    this.drawerContiProjectTitle = "Add Continuning Project Details";
    this.drawerContiProjectData = new ContinuingProjectDetails();
    this.drawerContiProjectVisible = true;
  }
  editContiProject(data: ContinuingProjectDetails, index: number): void {
    this.currentIndex = index

    this.drawerContiProjectTitle = "Update Continuning Project Details";
    this.drawerContiProjectData = Object.assign({}, data);
    this.drawerContiProjectVisible = true;
  }

  drawerGroupSponsClose(): void {

    this.drawerGroupSponsVisible = false;
  }
  get grpSponsTableCallback() {
    return this.grpSponsTable.bind(this);
  }
  grpSponsTable(): void {
    console.log("Closed function " + this.drawerGroupSponsData.SPONSERED_GROUP_NAME);
    this.drawerGroupSponsData.GROUP_ID = parseInt(this.groupID);
    // this.drawerGroupSponsData.GROUP_ID = 81 ;

    if (this.currentIndex > -1) {
      this.groupSponsArray[this.currentIndex] = this.drawerGroupSponsData;
      this.groupSponsArray = [...[], ...this.groupSponsArray];
      this.message.success("Groups Sponsored Details Updated Successfully..", "");

    }
    else {
      this.groupSponsArray = [...this.groupSponsArray, ...[this.drawerGroupSponsData]];
      this.message.success("Groups Sponsored Details Created Successfully..", "");
    }
    this.currentIndex = -1;
    console.log("Group Spons Array" + this.groupSponsArray);
    this.drawerGroupSponsVisible = false;

  }

  addGroupSpons(): void {
    this.drawerGroupSponsTitle = "Add Group Sponsered Details";
    this.drawerGroupSponsData = new GroupSponsered();
    this.drawerGroupSponsVisible = true;
  }
  editGroupSpons(data: GroupSponsered, index: number): void {
    this.currentIndex = index

    this.drawerGroupSponsTitle = "Update Group Sponsered Details";
    this.drawerGroupSponsData = Object.assign({}, data);
    this.drawerGroupSponsVisible = true;
  }


  drawerMediaCoverClose(): void {
    this.drawerMediaCoverVisible = false;
    // console.log("this.SentUrl1 = " + this.SentUrl1);
    // console.log("this.SentUrl2 = " + this.SentUrl2);
    // console.log("this.SentUrl3 = " + this.SentUrl3);

  }
  get MediaCoverageTableCallback() {
    return this.MediaCoverageTable.bind(this);
  }
  MediaCoverageTable(): void {
    console.log("Closed function " + this.drawerMediaCoverData.DETAILS);
    this.drawerMediaCoverData.TYPE = "G";
    this.drawerMediaCoverData.TYPE_ID = parseInt(this.groupID);
    // this.drawerMediaCoverData.TYPE_ID = 81;
    if (this.currentIndex > -1) {
      this.mediaCoverArray[this.currentIndex] = this.drawerMediaCoverData;
      this.mediaCoverArray = [...[], ...this.mediaCoverArray];
      // this.imageUpload1();
      // this.imageUpload2();
      // this.imageUpload3();
      this.message.success("Media Coverage Details Updated Successfully..", "");

    }
    else {
      this.mediaCoverArray = [...this.mediaCoverArray, ...[this.drawerMediaCoverData]];
      // this.imageUpload1();
      // this.imageUpload2();
      // this.imageUpload3();
      this.message.success("Media Coverage Details Created Successfully..", "");
    }
    this.currentIndex = -1;
    console.log("Media Array" + this.mediaCoverArray);
    this.drawerMediaCoverVisible = false;
  }
  // ProjectMediaCoverageTable():void{
  //   console.log("Project Closed function " + this.drawerMediaCoverData.DETAILS);

  //   if (this.currentIndex > -1) {
  //     this.projectMediaCoverArray[this.currentIndex] = this.drawerMediaCoverData;
  //     this.projectMediaCoverArray = [...[], ...this.projectMediaCoverArray];

  //   }
  //   else {
  //     this.projectMediaCoverArray = [...this.projectMediaCoverArray, ...[this.drawerMediaCoverData]];
  //   }
  //   this.currentIndex = -1;
  //   console.log("Project Media Array" + this.projectMediaCoverArray);
  //   this.drawerMediaCoverVisible = false;
  // }
  addMediaCover(): void {
    console.log("Drawer calles..");

    this.currentIndex = -1;

    // this.mediaCoverArray = null;

    // console.log(" this.url1 = " +  this.url1);
    // console.log(" this.url2 = " +  this.url2);
    // console.log(" this.url3 = " +  this.url3);

    // console.log("this.drawerMediaCoverData.PHOTO_URL1 = " + this.drawerMediaCoverData.PHOTO_URL1);
    // console.log("this.drawerMediaCoverData.PHOTO_URL2 = " + this.drawerMediaCoverData.PHOTO_URL2);
    // console.log("this.drawerMediaCoverData.PHOTO_URL3 = " + this.drawerMediaCoverData.PHOTO_URL3);

    // this.url1 = "";
    // this.url2 = "";
    // this.url3 = "";



    this.drawerMediaCoverTitle = "Add Media Coverings";
    this.drawerMediaCoverData = new MediaCoverings();
    this.drawerMediaCoverVisible = true;
  }
  editMediaCover(data: MediaCoverings, index: number): void {
    this.currentIndex = index

    this.drawerMediaCoverTitle = "Update Media Coverings";
    this.drawerMediaCoverData = Object.assign({}, data);
    const readerUrl1 = new FileReader();
    if (this.mediaCoverArray[this.currentIndex]['url1']) {
      const [file] = [this.mediaCoverArray[this.currentIndex]['url1']];
      readerUrl1.readAsDataURL(file);

      readerUrl1.onload = () => {
        this.drawerMediaCoverData.PHOTO_URL1 = readerUrl1.result as string;
      };
    }

    const readerUrl2 = new FileReader();
    if (this.mediaCoverArray[this.currentIndex]['url2']) {
      const [file] = [this.mediaCoverArray[this.currentIndex]['url2']];
      readerUrl2.readAsDataURL(file);

      readerUrl2.onload = () => {
        this.drawerMediaCoverData.PHOTO_URL2 = readerUrl2.result as string;
      };
    }
    const readerUrl3 = new FileReader();
    if (this.mediaCoverArray[this.currentIndex]['url3']) {
      const [file] = [this.mediaCoverArray[this.currentIndex]['url3']];
      readerUrl3.readAsDataURL(file);

      readerUrl3.onload = () => {
        this.drawerMediaCoverData.PHOTO_URL3 = readerUrl3.result as string;
      };
    }
    this.drawerMediaCoverVisible = true;
  }


  drawerProjectClose(): void {
    this.drawerProjectVisible = false;
  }
  get projectUnderTableCallback() {
    return this.projectUnderTable.bind(this);
  }
  ProjectMedia(event: any) {
    this.projectData = (event)
    this.projectMediaCoverArray = this.projectData;

    console.log("this.projectData ==== " + this.projectData);

  }
  projectUnderTable(): void {
    // this.search();
    // this.projectData.push(this.drawerProjectData);
    console.log("Closed function " + this.drawerProjectData.NAME);
    this.drawerProjectData['projectMediaCoverArray'] = this.projectData
    this.drawerMediaCoverData.TYPE = "P";
    this.drawerMediaCoverData.TYPE_ID = 0;
    if (this.currentIndex > -1) {
      this.projectArray[this.currentIndex] = this.drawerProjectData;
      this.projectArray = [...[], ...this.projectArray];
      console.log("this.projectMediaCoverArrayUpdate = " + this.projectMediaCoverArray);
      this.projectMediaCoverArray = [...[], ...this.projectMediaCoverArray];
      this.message.success("Project Undertaken Details Updated Successfully..", "");
    }
    else {
      this.projectArray = [...this.projectArray, ...[this.drawerProjectData]];
      console.log("this.projectMediaCoverArray Create = " + this.projectMediaCoverArray);
      this.projectMediaCoverArray = [...[], ...this.projectMediaCoverArray];
      this.message.success("Project Undertaken Details Created Successfully..", "");

    }

    // console.log("this.projectMediaCoverArray = " + this.projectMediaCoverArray);


    // this.projectMediaCoverArray = [...[], ...this.projectMediaCoverArray];

    this.currentIndex = -1;
    // console.log(this.projectMediaCoverArray);
    this.drawerProjectVisible = false;


  }
  projectMediaCoverArray2 = []
  addProject(): void {
    console.log("Drawer cllaed..");
    this.currentIndex = -1
    this.drawerProjectTitle = "Add Project Details";
    this.drawerProjectData = new UndertakenProjectDetails();
    this.projectMediaCoverArray2 = Object.assign([], [])
    this.drawerProjectVisible = true;
  }
  edit(data: UndertakenProjectDetails, index: number): void {
    this.currentIndex = index;
    // if(data.ID!=undefined && data.ID> 0){
    //   // for(var p=0;p<this.projectMediaCoverArrayQuery.length;p++){

    //   // }
    //   this.projectMediaCoverArray2 = Object.assign([], this.projectArray[index]['projectMediaCoverArray']);
    // }else{
    //   this.projectMediaCoverArray2 = Object.assign([], this.projectArray[index]['projectMediaCoverArray']);
    // }

    this.drawerProjectTitle = "Update Project Details";
    this.drawerProjectData = Object.assign({}, data);
    // for()
    this.drawerProjectVisible = true;
  }

  getWidth() {
    if (window.innerWidth <= 400)
      return 380;
    else
      return 600;
  }
  getDueWidth() {
    if (window.innerWidth <= 400)
      return 380;
    else
      return 330;
  }
  get closeProjectCallback() {
    return this.drawerProjectClose.bind(this);
  }

  get closePaidDueCallback() {
    return this.drawerPaidDueClose.bind(this);
  }

  get closeMediaCoverCallback() {
    return this.drawerMediaCoverClose.bind(this);
  }
  get closeContiProjectCallback() {
    return this.drawerContiProjectClose.bind(this);
  }
  get closeGroupSponsCallback() {
    return this.drawerGroupSponsClose.bind(this);
  }


  SentUrl1(event: any) {
    this.url1 = (event)
    this.mediaCoverArray[this.currentIndex]['url1'] = (event);
    // this.url1 = this.mediaCoverArray[this.currentIndex]['url1']
    console.log("This URL1 ============ " + this.url1);
    if (this.url1 == null || this.url1 == undefined || this.url1 == "") {
      var url = "";
    }
    else {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.url1.name.split('.').pop();
      var url = "GM" + number + "." + fileExt;
    }
    this.drawerMediaCoverData.PHOTO_URL1 = url;
    console.log("this.drawerMediaCoverData.PHOTO_URL1" + this.drawerMediaCoverData.PHOTO_URL1);

  }
  SentUrl2(event: any) {
    this.url2 = (event)
    this.mediaCoverArray[this.currentIndex]['url2'] = (event)
    console.log("This URL2 " + this.url2);
    if (this.url2 == null || this.url2 == undefined || this.url2 == "") {
      var url = "";
    }
    else {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.url2.name.split('.').pop();
      var url = "GM" + number + "." + fileExt;
    }
    this.drawerMediaCoverData.PHOTO_URL2 = url;
    console.log("this.drawerMediaCoverData.PHOTO_URL2" + this.drawerMediaCoverData.PHOTO_URL2);

  }
  SentUrl3(event: any) {
    this.url3 = (event)
    console.log("This URL3 " + this.url3);
    this.mediaCoverArray[this.currentIndex]['url3'] = (event)

    console.log("this.mediaCoverArray[this.currentIndex]['url3']" + this.mediaCoverArray[this.currentIndex]['url3']);


    if (this.url3 == null || this.url3 == undefined || this.url3 == "") {
      var url = "";
    }
    else {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.url3.name.split('.').pop();
      var url = "GM" + number + "." + fileExt;
    }

    this.drawerMediaCoverData.PHOTO_URL3 = url;
    console.log("this.drawerMediaCoverData.PHOTO_URL3" + this.drawerMediaCoverData.PHOTO_URL3);
    return url;
  }
  folderName = "mediaPhotos";
  photo1Str: string;
  photo2Str: string;
  photo3Str: string;

  imageUpload1() {
    this.photo1Str = "";
    // console.log("this.mediaCoverArray[this.currentIndex]['url1'] = " + this.mediaCoverArray[this.currentIndex]['url1']);
    // this.url1 = this.mediaCoverArray[this.currentIndex]['url1'];

    // console.log("this.url1 === " + this.url1);

    var number = Math.floor(100000 + Math.random() * 900000);
    // var fileExt = this.url1.name.split('.').pop();

    var fileExt = this.mediaCoverArray[this.currentIndex]['url1'].name.split('.').pop();
    var url = "GM" + number + "." + fileExt;

    this.drawerMediaCoverData.PHOTO_URL1 = url;

    // var url = this.SentUrl1(this.url1);

    // console.log("PhotoUrl111111 === " + url);

    // console.log("this.url1 === " + this.url1);
    // console.log("this.drawerMediaCoverData === " + this.drawerMediaCoverData.PHOTO_URL1);

    if (!this.data.ID) {
      if (this.url1) {

        this.api.onUploadMedia(this.folderName, this.url1, this.drawerMediaCoverData.PHOTO_URL1).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo1Str = this.drawerMediaCoverData.PHOTO_URL1;

      } else {
        this.photo1Str = "";
      }

    } else {
      if (this.url1) {

        this.api.onUploadMedia(this.folderName, this.url1, this.drawerMediaCoverData.PHOTO_URL1).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo1Str = this.drawerMediaCoverData.PHOTO_URL1;;

      } else {
        if (this.drawerMediaCoverData.PHOTO_URL1) {
          let photoURL = this.drawerMediaCoverData.PHOTO_URL1.split("/");
          this.photo1Str = photoURL[photoURL.length - 1];

        } else
          this.photo1Str = "";
      }
    }
  }

  imageUpload2() {
    this.photo2Str = "";

    // this.url2 = this.mediaCoverArray[this.currentIndex]['url2'];

    var number = Math.floor(100000 + Math.random() * 900000);
    var fileExt = this.mediaCoverArray[this.currentIndex]['url2'].name.split('.').pop();
    var url = "GM" + number + "." + fileExt;

    this.drawerMediaCoverData.PHOTO_URL2 = url;

    if (!this.data.ID) {
      if (this.url2) {


        this.api.onUploadMedia(this.folderName, this.url2, this.drawerMediaCoverData.PHOTO_URL2).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo2Str = this.drawerMediaCoverData.PHOTO_URL2;

      } else {
        this.photo2Str = "";
      }

    } else {
      if (this.url2) {


        this.api.onUploadMedia(this.folderName, this.url2, this.drawerMediaCoverData.PHOTO_URL2).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo2Str = this.drawerMediaCoverData.PHOTO_URL2;

      } else {
        if (this.drawerMediaCoverData.PHOTO_URL2) {
          let photoURL = this.drawerMediaCoverData.PHOTO_URL2.split("/");
          this.photo2Str = photoURL[photoURL.length - 1];

        } else
          this.photo2Str = "";
      }
    }
  }

  imageUpload3() {
    this.photo3Str = "";

    // this.url3 = this.mediaCoverArray[this.currentIndex]['url3'];

    var number = Math.floor(100000 + Math.random() * 900000);
    var fileExt = this.mediaCoverArray[this.currentIndex]['url3'].name.split('.').pop();
    var url = "GM" + number + "." + fileExt;

    this.drawerMediaCoverData.PHOTO_URL3 = url;

    if (!this.data.ID) {
      if (this.url3) {

        this.api.onUploadMedia(this.folderName, this.url3, this.drawerMediaCoverData.PHOTO_URL3).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo3Str = this.drawerMediaCoverData.PHOTO_URL3;

      } else {
        this.photo3Str = "";
      }

    } else {
      if (this.url3) {

        this.api.onUploadMedia(this.folderName, this.url3, this.drawerMediaCoverData.PHOTO_URL3).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo3Str = this.drawerMediaCoverData.PHOTO_URL3;

      } else {
        if (this.drawerMediaCoverData.PHOTO_URL3) {
          let photoURL = this.drawerMediaCoverData.PHOTO_URL3.split("/");
          this.photo3Str = photoURL[photoURL.length - 1];

        } else
          this.photo3Str = "";
      }
    }
  }
  // switchFun(val: boolean) {
  //   this.Swicthing = val;
  //   if(this.Swicthing==false){      
  //     this.data.OUTSTANDING_DUES_AMOUNT = 0;
  //     this.data.OUTSTANDING_DUES_DETAILS = 'NA';
  //   }
  //   console.log("this.switchValue Value = " + this.Swicthing);


  // }
  switchFun(val: boolean) {
    this.Swicthing = val;
    if (this.Swicthing == false) {

    }
    console.log("this.switchValue Value = " + this.Swicthing);


  }
  showModal(): void {
    this.isVisible = true;
  }
  handleCancel() {
    this.isVisible = false;
  }
  // public handleMissingImage(event: Event) {
  //   (event.target as HTMLImageElement).style.display = 'none';
  // }

  today = new Date();

  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  };
  // checkMemberCountValid(){
  //   if((this.data.ATTENDANCE_OF_UNIT_COUNCILS_TOTAL != 0 ))
  //         if((this.data.ATTENDANCE_OF_UNIT_COUNCILS_TOTAL < this.data.ATTENDANCE_OF_UNIT_COUNCILS_COUNT))
  //         {
  //               this.message.error("Please Enter UNIT COUNCILS Member Count Less", "");
  //         }
  // }
  // checkOutOfCountValid(){
  //   if((this.data.ATTENDANCE_OF_UNIT_COUNCILS_COUNT != 0 ))
  //       if ((this.data.ATTENDANCE_OF_UNIT_COUNCILS_COUNT > this.data.ATTENDANCE_OF_UNIT_COUNCILS_TOTAL))
  //         {
  //               this.message.error("Please Enter UNIT COUNCILS Out of count Greater", "");
  //         }
  // }

  unitconferences(ATTENDANCE_OF_UNIT_CONFERENCES_COUNT, ATTENDANCE_OF_UNIT_CONFERENCES_TOTAL) {
    if (ATTENDANCE_OF_UNIT_CONFERENCES_COUNT != '') {
      if (parseInt(ATTENDANCE_OF_UNIT_CONFERENCES_COUNT) > parseInt(ATTENDANCE_OF_UNIT_CONFERENCES_TOTAL)) {
        this.message.error("Unit Conferences", "Please fill the corrected data");
        this.data.ATTENDANCE_OF_UNIT_CONFERENCES_COUNT = 0;
      }
    }
  }

  unitCouncile(ATTENDANCE_OF_UNIT_COUNCILS_COUNT, ATTENDANCE_OF_UNIT_COUNCILS_TOTAL) {
    if (ATTENDANCE_OF_UNIT_COUNCILS_COUNT != '') {
      if (parseInt(ATTENDANCE_OF_UNIT_COUNCILS_COUNT) > parseInt(ATTENDANCE_OF_UNIT_COUNCILS_TOTAL)) {
        this.message.error("Unit Councils", "Please fill the corrected data");
        this.data.ATTENDANCE_OF_UNIT_COUNCILS_COUNT = 0;
      }
    }
  }

  pastGWF(ATTENDANCE_OF_PAST_GWF_COUNT, ATTENDANCE_OF_PAST_GWF_TOTAL) {
    if (ATTENDANCE_OF_PAST_GWF_COUNT != '') {
      if (parseInt(ATTENDANCE_OF_PAST_GWF_COUNT) > parseInt(ATTENDANCE_OF_PAST_GWF_TOTAL)) {
        this.message.error("Unit Councils", "Please fill the corrected data");
        this.data.ATTENDANCE_OF_PAST_GWF_COUNT = 0;
      }
    }
  }

  FetchOldData() {
    // this.message.info("Fetch Old Data", "Data Fetched")
    const memberID = parseInt(this._cookie.get('userId'));
    const groupID = Number(this._cookie.get("HOME_GROUP_ID"));

    this.api.getOutstandingDetails(memberID, groupID).subscribe(data => {
      if (data['code'] == '200') {
        this.totalRecords = data['count'];
        this.OldFetchedData = data['data'];
      }

      this.data.GROUP_MEETINGS = this.OldFetchedData[0]['GROUP_MEETINGS'];
      this.data.AVG_ATTENDANCE_MEETINGS = this.OldFetchedData[0]['REGULAR_MEETING_PERCENTAGE'];
      this.data.MEMBERSHIP_ON_31_DEC = this.OldFetchedData[0]['CURRENT_YEAR_TILL_DEC'];
      this.data.MEMBERSHIP_ON_30_SEPT = this.OldFetchedData[0]['CURRENT_YEAR_TILL_SEP'];
      this.data.MEMBERSHIP_ON_31_MARCH = this.OldFetchedData[0]['PREVOUS_YEAR_TILL_MARCH'];
      this.data.MEMBER_MAILING_LIST_SENT_PRESENT_YEAR = this.OldFetchedData[0]['MAIL_SEND_DATE'];
      this.data.BOD_MAILING_LIST_SENT_PRESENT_YEAR = this.OldFetchedData[0]['MAIL_SEND_DATE'];
      this.data.MEMBER_MAILING_LIST_SENT_ENSUING_YEAR = this.OldFetchedData[0]['MAIL_SEND_DATE'];
      this.data.BOD_MAILING_LIST_SENT_ENSUING_YEAR = this.OldFetchedData[0]['MAIL_SEND_DATE'];
      this.data.BOARD_MEETINGS = this.OldFetchedData[0]['BOARD_MEETINGS'];
      this.data.BOARD_MEETINGS_ATTENDENCE = this.OldFetchedData[0]['BOARD_MEETINGS_ATTENDENCE'];

      // console.log("old Data = ",  this.OldFetchedData);

      // console.log("ACTIVE_PARTICIPATION_MEMBERS = ",  this.OldFetchedData[0]['ACTIVE_MEMBERS']);
      // console.log("ACTIVE_PARTICIPATION_MEMBERS_PERCENTAGE = ", this.OldFetchedData[0]['ACTIVE_MEMBER_PERCENTAGE']);



    }, err => {
      // this.GroupmeetsattendiesmapComponentVar.isSpinning = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  year = new Date().getFullYear();
  baseYear = 2020;
  range = [];
  // next_year = Number(this.year + 1)
  // SelectedYear: any = this.year + "-" + this.next_year;
  // currentYear: any = this.year - 1 + "-" + this.year;
  // currentDate = new Date();
  // businessYearStartDate = new Date(this.currentDate.getFullYear() + 1, 3, 1);

  currentYear: any;
  SelectedYear: any;

  Fordate() {
    let currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= this.baseYear; i--) {
      this.range.push(i);
    }
  }

  LoadYears() {
    this.SelectedYear = new Date().getFullYear();
  }

  selectChangeYear() {
    this.isSpinning = true;
    this.data = new OutstandingGroupMaster();
    this.projectArray = [];
    this.paidDueArray = [];
    this.mediaCoverArray = [];
    this.contiProjectArray = [];
    this.groupSponsArray = [];

    this.api.getOutstandingGroup(0, 0, 'ID', 'ASC', "AND AWARD_TYPE = " + this.FormStatus + " AND GROUP_ID = " + this.groupID, this.SelectedYear).subscribe(data => {
      if (data['count'] > 0) {
        this.data = Object.assign({}, data['data'][0]);
        this.isSpinning = false;

        this.api.getContinuproject(0, 0, 'ID', 'ASC', 'AND OUTSTANDING_GROUP_MASTER_ID = ' + this.data.ID).subscribe(dataContinu => {
          if (dataContinu['count'] > 0) {
            this.contiProjectArray = dataContinu['data'];
            this.isSpinning = false;

          } else {
            this.contiProjectArray = [];
          }
        });

        this.api.getDuePaidToFundation(0, 0, 'ID', 'ASC', 'AND OUTSTANDING_GROUP_MASTER_ID = ' + this.data.ID).subscribe(dataDuePaid => {
          if (dataDuePaid['count'] > 0) {
            this.paidDueArray = dataDuePaid['data'];
            this.isSpinning = false;

          } else {
            this.paidDueArray = [];
          }
        });

        this.api.getUndertakenProject(0, 0, 'ID', 'ASC', 'AND OUTSTANDING_GROUP_MASTER_ID = ' + this.data.ID).subscribe(dataUnderProject => {
          if (dataUnderProject['count'] > 0) {
            this.projectArray = dataUnderProject['data'];
            this.isSpinning = false;

          } else {
            this.projectArray = [];
          }
        });

        this.api.getMediaCoverage(0, 0, 'ID', 'ASC', 'AND OUTSTANDING_GROUP_MASTER_ID = ' + this.data.ID).subscribe(dataMediaCover => {
          if (dataMediaCover['count'] > 0) {
            this.mediaCoverArray = dataMediaCover['data'];
            this.isSpinning = false;

          } else {
            this.mediaCoverArray = [];
          }
        });

        this.api.getGroupSponser(0, 0, 'ID', 'ASC', 'AND OUTSTANDING_GROUP_MASTER_ID = ' + this.data.ID).subscribe(dataSponsor => {
          if (dataSponsor['count'] > 0) {
            this.groupSponsArray = dataSponsor['data'];
            this.isSpinning = false;

          } else {
            this.groupSponsArray = [];
          }
        });
      }
      this.isSpinning = false;
    });
  }
}
