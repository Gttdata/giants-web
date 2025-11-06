import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { MonthlyGroupReport } from 'src/app/Models/MonthlyGroupReport';
import { ApiService } from 'src/app/Service/api.service';
import { ProjectsOfTheMonth } from 'src/app/Models/ProjectsOfTheMonth';
import { EventsOfTheMonth } from 'src/app/Models/EventsOfTheMonth';
import { MeetingsOfTheMonth } from 'src/app/Models/MeetingsOfTheMonth';
import { CompressImageService } from 'src/app/Service/image-compressor.service';
import { take } from 'rxjs/operators';
import { GroupProjectActivityDrawerComponent } from '../../GroupProjectActivity/group-project-activity-drawer/group-project-activity-drawer.component';
import { GroupActivityMaster } from 'src/app/Models/GroupActivityMaster';
import { AddProjectDetailsDrawerComponent } from '../../GroupProjectMaster/add-project-details-drawer/add-project-details-drawer.component';
import { GroupProjectMaster } from 'src/app/Models/GroupProjectMaster';
import { AddgroupmeetingsattendanceComponent } from '../../Meeting/addgroupmeetingsattendance/addgroupmeetingsattendance.component';
import { GroupMeetAttendance } from 'src/app/Models/GroupMeetAttendance';
import { DrawermapinvitiesComponent } from '../../Meeting/drawermapinvities/drawermapinvities.component';
import { GroupMapInvitees } from 'src/app/Models/GroupMapInvitees';
import { GroupmeetsattendiesmapComponent } from '../../Meeting/groupmeetsattendiesmap/groupmeetsattendiesmap.component';
import { GroupMeetingAttendance } from 'src/app/Models/GroupMeetingAttendance';
import { SendMonthlyReportComponent } from '../send-monthly-report/send-monthly-report.component';
import { AddpaymentComponent } from '../../Payments/addpayment/addpayment.component';
import { PaymentCollection } from 'src/app/Models/PaymentCollection';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupProjectActivityMapInviteesDrawerComponent } from '../../GroupProjectActivity/group-project-activity-map-invitees-drawer/group-project-activity-map-invitees-drawer.component';
import { GroupProjectActivityAttendanceDrawerComponent } from '../../GroupProjectActivity/group-project-activity-attendance-drawer/group-project-activity-attendance-drawer.component';

@Component({
  selector: 'app-drawermonthlyreportsubmission',
  templateUrl: './drawermonthlyreportsubmission.component.html',
  styleUrls: ['./drawermonthlyreportsubmission.component.css']
})

export class DrawermonthlyreportsubmissionComponent implements OnInit {
  drawerPaymentVisible!: boolean;
  drawerTitle!: string;
  drawerData: PaymentCollection = new PaymentCollection();
  sum = 0;
  loadingPaymentRecords: boolean = false;
  roleID: number;
  @Input() drawerClose: Function;
  @Input() data: MonthlyGroupReport;
  @Input() drawerVisible: boolean;
  @Input() submissionMonth: number;
  @Input() submissionYear: number;
  numbers = new RegExp(/^\d+(\.\d{1,2})?$/);
  isSpinning: boolean = false;
  pageIndex: number = 1;
  pageSize: number = 10;
  dataList: any[] = [];
  reportGroupName: string;
  isVisible: boolean = false;
  isLoading: boolean = false;
  modalHeader: string = "";
  reportHeader: string = "";
  isMemberLoading: boolean = false;
  isDroppedMemberLoading: boolean = false;
  RETRIVE_IMAGE_URL: string;
  monthlyReportingTitle: string;
  federationID: number;
  unitID: number;
  groupID: number;
  homeFederationID: number;
  homeUnitID: number;
  homeGroupID: number;

  constructor(private router: Router, private _Activatedroute: ActivatedRoute, private compressImage: CompressImageService, private message: NzNotificationService, private api: ApiService, private _cookie: CookieService, private datePipe: DatePipe, private _modal: NzModalService) { }

  ngOnInit() {
    this.getGlobalSettingData();
    this.getIDs();
    this.getFederations();
  }

  getIDs(): void {
    this.federationID = Number(sessionStorage.getItem("FEDERATION_ID"));
    this.unitID = Number(sessionStorage.getItem("UNIT_ID"));
    this.groupID = Number(sessionStorage.getItem("GROUP_ID"));

    this.homeFederationID = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
    this.homeUnitID = Number(sessionStorage.getItem("HOME_UNIT_ID"));
    this.homeGroupID = Number(sessionStorage.getItem("HOME_GROUP_ID"));

    this.roleID = this.api.roleId;
    this.RETRIVE_IMAGE_URL = this.api.retriveimgUrl;
    this.monthlyReportingTitle = sessionStorage.getItem("HOME_FEDERATION_NAME");
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

  close(myForm: NgForm): void {
    this.projectArray = null;
    this.meetingArray = null;
    this.eventArray = null;
    this.addedMemberArray = null;
    this.droppedMemberArray = null;

    this.fileURL1 = null;
    this.fileURL2 = null;
    this.fileURL3 = null;
    this.fileURL4 = null;
    this.fileURL5 = null;

    this.data.PHOTO_URL1 = null;
    this.data.PHOTO_URL2 = null;
    this.data.PHOTO_URL3 = null;
    this.data.PHOTO_URL4 = null;
    this.data.PHOTO_URL5 = null;

    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  save(addNew: boolean, myForm: NgForm): void {
    let isOk = true;
    this.data.BOARDMEETING_ATTENDANCE_PERCENTAGE = Number(this.data.BOARDMEETING_ATTENDANCE_PERCENTAGE);

    if (this.data.MEMBERSHIP_CLOSED_LAST_MONTH == undefined || this.data.MEMBERSHIP_CLOSED_LAST_MONTH.toString() == '' || this.data.MEMBERSHIP_CLOSED_LAST_MONTH == null) {
      isOk = false;
      this.data.IS_SUBMITTED = 'D';
      this.message.error('Please Enter the Number of Membershipe Closed Last Month ', '');

    } else if (this.data.MEMBERSHIP_ADDED_DURING_MONTH == undefined || this.data.MEMBERSHIP_ADDED_DURING_MONTH.toString() == '' || this.data.MEMBERSHIP_ADDED_DURING_MONTH == null) {
      isOk = false;
      this.data.IS_SUBMITTED = 'D';
      this.message.error('Please Enter the Number of Membershipe Added During Month ', '');

    } else if (this.data.MEMBERSHIP_DROPED_DURING_MONTH == undefined || this.data.MEMBERSHIP_DROPED_DURING_MONTH.toString() == '' || this.data.MEMBERSHIP_DROPED_DURING_MONTH == null) {
      isOk = false;
      this.data.IS_SUBMITTED = 'D';
      this.message.error('Please Enter the Number of Membershipe Dropped During Month ', '');

    } else if (this.data.MEMBERSHIP_CLOSED_THIS_MONTH == undefined || this.data.MEMBERSHIP_CLOSED_THIS_MONTH.toString() == '' || this.data.MEMBERSHIP_CLOSED_THIS_MONTH == null) {
      isOk = false;
      this.data.IS_SUBMITTED = 'D';
      this.message.error('Please Enter the Number of Membershipe Closed During Month ', '');

    } else if (this.data.MEMSUB_JANTOJUNE == undefined || this.data.MEMSUB_JANTOJUNE.toString() == '' || this.data.MEMSUB_JANTOJUNE == null) {
      isOk = false;
      this.data.IS_SUBMITTED = 'D';
      this.message.error('Please Enter The No.of Members Between January-Jun ', '');

    } else if (this.data.MEMSUB_JULYTODEC == undefined || this.data.MEMSUB_JULYTODEC.toString() == '' || this.data.MEMSUB_JULYTODEC == null) {
      isOk = false;
      this.data.IS_SUBMITTED = 'D';
      this.message.error('Please Enter The No.of Members Between July-December ', '');

    } else if (this.data.NO_OF_SUB_MEMBER == undefined || this.data.NO_OF_SUB_MEMBER.toString() == '' || this.data.NO_OF_SUB_MEMBER == null) {
      isOk = false;
      this.data.IS_SUBMITTED = 'D';
      this.message.error('Please Enter The No.of Subscribed Members', '');

    } else if (this.data.PER_MEMBER_SUB_FEES == undefined || this.data.PER_MEMBER_SUB_FEES.toString() == '' || this.data.PER_MEMBER_SUB_FEES == null) {
      isOk = false;
      this.data.IS_SUBMITTED = 'D';
      this.message.error('Please Enter The Subscribed Fees Rs./Member ', '');

    } else if (this.data.TOTAL_SUB_FEES == undefined || this.data.TOTAL_SUB_FEES.toString() == '' || this.data.TOTAL_SUB_FEES == null) {
      isOk = false;
      this.data.IS_SUBMITTED = 'D';
      this.message.error('Please Enter The Total Subscribed Member Fees', '');

    } else if (this.data.NO_OF_ENTERENCE_MEMBER == undefined || this.data.NO_OF_ENTERENCE_MEMBER.toString() == '' || this.data.NO_OF_ENTERENCE_MEMBER == null) {
      isOk = false;
      this.data.IS_SUBMITTED = 'D';
      this.message.error('Please Enter The No.of Member Entry', '');

    } else if (this.data.PER_MEMBER_ENTERENCE_FEES == undefined || this.data.PER_MEMBER_ENTERENCE_FEES.toString() == '' || this.data.PER_MEMBER_ENTERENCE_FEES == null) {
      isOk = false;
      this.data.IS_SUBMITTED = 'D';
      this.message.error('Please Enter The Entrance Fees Rs./Member', '');

    } else if (this.data.TOTAL_ENTERENCE_FEES == undefined || this.data.TOTAL_ENTERENCE_FEES.toString() == '' || this.data.TOTAL_ENTERENCE_FEES == null) {
      isOk = false;
      this.data.IS_SUBMITTED = 'D';
      this.message.error('Please Enter The Total Entrance Fees', '');
    }

    // else if (this.data.PAID_AMOUNT == undefined || this.data.PAID_AMOUNT.toString() == '' || this.data.PAID_AMOUNT == null) {
    //   isOk = false;
    //   this.data.IS_SUBMITTED = 'D';
    //   this.message.error('Please Enter The Total Paid Fees', '');
    // } 

    // else if (this.data.CHEQUE_DD_NO == undefined || this.data.CHEQUE_DD_NO.toString() == '' || this.data.CHEQUE_DD_NO == null) {
    //   isOk = false;
    //   this.data.IS_SUBMITTED = 'D';
    //   this.message.error('Please Enter The Cheque/DD number', '');
    // } 

    // else if (this.data.DRAWN_ON == undefined || this.data.DRAWN_ON.toString() == '' || this.data.DRAWN_ON == null) {
    //   isOk = false;
    //   this.data.IS_SUBMITTED = 'D';
    //   this.message.error('Please Enter Drawn On', '');

    // } else if (this.data.REMITTED_ON == undefined || this.data.REMITTED_ON.toString() == '' || this.data.REMITTED_ON == null) {
    //   isOk = false;
    //   this.data.IS_SUBMITTED = 'D';
    //   this.message.error('Please Enter Remitted On', '');
    // }

    else if (this.data.ADMIN_ACCOUNT_NO == undefined || this.data.ADMIN_ACCOUNT_NO.toString() == '' || this.data.ADMIN_ACCOUNT_NO == null) {
      isOk = false;
      this.data.IS_SUBMITTED = 'D';
      this.message.error('Please Enter Administrative Account Number', '');

    } else if (this.data.ADMIN_BANK_NAME == undefined || this.data.ADMIN_BANK_NAME.trim() == '' || this.data.ADMIN_BANK_NAME.toString() == '') {
      isOk = false;
      this.data.IS_SUBMITTED = 'D';
      this.message.error('Please Enter Administrative Bank Name', '');

    } else if (this.data.ADMIN_BRANCH_NAME == undefined || this.data.ADMIN_BRANCH_NAME.trim() == '' || this.data.ADMIN_BRANCH_NAME.toString() == '') {
      isOk = false;
      this.data.IS_SUBMITTED = 'D';
      this.message.error('Please Enter Administrative Branch Name', '');

    } else if (this.data.PROJECT_ACCOUNT_NO == undefined || this.data.PROJECT_ACCOUNT_NO == null || this.data.PROJECT_ACCOUNT_NO.toString() == '') {
      isOk = false;
      this.data.IS_SUBMITTED = 'D';
      this.message.error('Please Enter Project Account Number', '');

    } else if (this.data.PROJECT_BANK_NAME == undefined || this.data.PROJECT_BANK_NAME.trim() == '' || this.data.PROJECT_BANK_NAME.toString() == '') {
      isOk = false;
      this.data.IS_SUBMITTED = 'D';
      this.message.error("Please Enter Project Bank Name", "");

    } else if (this.data.PROJECT_BRANCH_NAME == undefined || this.data.PROJECT_BRANCH_NAME.trim() == '' || this.data.PROJECT_BRANCH_NAME.toString() == '') {
      isOk = false;
      this.data.IS_SUBMITTED = 'D';
      this.message.error('Please Enter Project Branch Name', '');
    }

    if (isOk) {
      this.isSpinning = true;
      this.data.DRAWN_ON = "";
      this.data.DRAWN_ON = this.data.DRAWN_ON.toString();
      this.data.REMITTED_ON = new Date();
      this.data.REMITTED_ON = this.datePipe.transform(this.data.REMITTED_ON, "yyyy-MM-dd");
      this.data.BOARDMEETING_HELD_ON = this.datePipe.transform(this.data.BOARDMEETING_HELD_ON, "yyyy-MM-dd");
      this.data.GROUP_ID = this.groupID;
      this.data.FEDERATION_ID = this.federationID;
      this.data.UNIT_ID = this.unitID;

      if (this.data.IS_SUBMITTED == null) {
        this.data.IS_SUBMITTED = "D";
      }

      this.data.MONTHLY_PROJECT = [];
      this.data.MONTHLY_MEETING = [];
      this.data.MONTHLY_EVENT = [];

      var emailId = this.data.EMAIL_IDS ? this.data.EMAIL_IDS.toString() : "";
      this.data.EMAIL_IDS = emailId;

      if (this.fileURL1 != null) {
        this.imageUpload1();
      }

      if (this.fileURL2 != null) {
        this.imageUpload2();
      }

      if (this.fileURL3 != null) {
        this.imageUpload3();
      }

      if (this.fileURL4 != null) {
        this.imageUpload4();
      }

      if (this.fileURL5 != null) {
        this.imageUpload5();
      }

      if (this.data.ID) {
        this.api.updateMonthlyGroupReport(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Monthly Group Report Details Updated Successfully", "");
            this.isSpinning = false;

            // // Send mail
            // if (this.data.IS_SUBMITTED == 'S') {
            //   this._modal.confirm({
            //     nzTitle: 'Are you want to send email?',
            //     nzOkText: 'Yes',
            //     nzOkType: 'primary',
            //     nzOnOk: (myForm: NgForm) => {
            //       this.emailDrawerVisible = true;
            //       this.emailcircularDrawerTitle = "aaa " + "Send Monthly Report Email";
            //       this.monthlyReportDataIDForSendDrawer = successCode['ID'];
            //       this.SendMonthlyReportComponentVar.getFederationMemberData(this.federationID);
            //       this.SendMonthlyReportComponentVar.getFederationcentralSpecialCommitteeMemberData(this.federationID);
            //       this.SendMonthlyReportComponentVar.getUnitMemberData(this.unitID);
            //       this.SendMonthlyReportComponentVar.getSponseredGroupMemberData(this.groupID);
            //     },

            //     nzCancelText: 'No',
            //     nzOnCancel: () => console.log('Cancel')
            //   });
            // }

            if (!addNew) {
              this.close(myForm);
            }

          } else {
            this.message.error("Monthly Group Report Details Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.api.createMonthlyGroupReport(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Monthly Group Report Created Successfully", "");
            this.isSpinning = false;

            // // Send mail
            // if (this.data.IS_SUBMITTED == 'S') {
            //   this._modal.confirm({
            //     nzTitle: 'Are you want to send email?',
            //     nzOkText: 'Yes',
            //     nzOkType: 'primary',
            //     nzOnOk: (myForm: NgForm) => {
            //       this.emailDrawerVisible = true;
            //       this.emailcircularDrawerTitle = "aaa " + "Send Monthly Report Email";
            //       this.monthlyReportDataIDForSendDrawer = successCode['ID'];
            //       this.SendMonthlyReportComponentVar.getFederationMemberData(this.federationID);
            //       this.SendMonthlyReportComponentVar.getFederationcentralSpecialCommitteeMemberData(this.federationID);
            //       this.SendMonthlyReportComponentVar.getUnitMemberData(this.unitID);
            //       this.SendMonthlyReportComponentVar.getSponseredGroupMemberData(this.groupID);
            //     },

            //     nzCancelText: 'No',
            //     nzOnCancel: () => console.log('Cancel')
            //   });
            // }

            if (!addNew) {
              this.close(myForm);

            } else {
              this.data = new MonthlyGroupReport();
            }

          } else {
            this.message.error("Monthly Group Report Creation Failed", "");
            this.isSpinning = false;
          }
        });
      }
    }
  }

  emailDrawerVisible: boolean = false;
  emailcircularDrawerTitle: string;
  monthlyReportDataIDForSendDrawer: number;
  @ViewChild(SendMonthlyReportComponent, { static: false }) SendMonthlyReportComponentVar: SendMonthlyReportComponent;

  emailDrawerClose(): void {
    this.emailDrawerVisible = false;
  }

  get emailDrawerCloseCallback() {
    return this.emailDrawerClose.bind(this);
  }

  SumofMembers() {
    if (this.data.MEMBERSHIP_CLOSED_THIS_MONTH == undefined || this.data.MEMBERSHIP_CLOSED_THIS_MONTH == null) {
      this.data.MEMBERSHIP_CLOSED_THIS_MONTH = 0;
    }

    this.data.MEMBERSHIP_CLOSED_THIS_MONTH = (Number(this.data.MEMBERSHIP_CLOSED_LAST_MONTH) + Number(this.data.MEMBERSHIP_ADDED_DURING_MONTH)) - Number(this.data.MEMBERSHIP_DROPED_DURING_MONTH);
  }

  TotalSubscriptionAmount() {
    if (this.data.TOTAL_SUB_FEES == undefined || this.data.TOTAL_SUB_FEES == null) {
      this.data.TOTAL_SUB_FEES = 0;
    }

    if (this.data.NO_OF_SUB_MEMBER == undefined || this.data.NO_OF_SUB_MEMBER == null) {
      this.data.NO_OF_SUB_MEMBER = 0;
    }

    if (this.data.PER_MEMBER_SUB_FEES == undefined || this.data.PER_MEMBER_SUB_FEES == null) {
      this.data.PER_MEMBER_SUB_FEES = 0;
    }

    this.data.TOTAL_SUB_FEES = this.data.NO_OF_SUB_MEMBER * this.data.PER_MEMBER_SUB_FEES;

    if (this.data.TOTAL_ENTERENCE_FEES == undefined || this.data.TOTAL_ENTERENCE_FEES == null) {
      this.data.TOTAL_ENTERENCE_FEES = 0;
    }

    this.data.TOTAL_AMOUNT = this.data.TOTAL_SUB_FEES + this.data.TOTAL_ENTERENCE_FEES;
  }

  TotalEnterenceAmount() {
    if (this.data.TOTAL_ENTERENCE_FEES == undefined || this.data.TOTAL_ENTERENCE_FEES == null) {
      this.data.TOTAL_ENTERENCE_FEES = 0;
    }

    if (this.data.NO_OF_ENTERENCE_MEMBER == undefined || this.data.NO_OF_ENTERENCE_MEMBER == null) {
      this.data.NO_OF_ENTERENCE_MEMBER = 0;
    }

    if (this.data.PER_MEMBER_ENTERENCE_FEES == undefined || this.data.PER_MEMBER_ENTERENCE_FEES == null) {
      this.data.PER_MEMBER_ENTERENCE_FEES = 0;
    }

    this.data.TOTAL_ENTERENCE_FEES = this.data.NO_OF_ENTERENCE_MEMBER * this.data.PER_MEMBER_ENTERENCE_FEES;

    if (this.data.TOTAL_SUB_FEES == undefined || this.data.TOTAL_SUB_FEES == null) {
      this.data.TOTAL_SUB_FEES = 0;
    }

    this.data.TOTAL_AMOUNT = this.data.TOTAL_SUB_FEES + this.data.TOTAL_ENTERENCE_FEES;
  }

  @Input() addedMemberArray: any[];
  @Input() droppedMemberArray: any[];
  currentDate: any;
  currentYear: number;
  monthDay: any;

  ViewReport(): void {
    this.currentDate = new Date();
    var monthText: string;

    if (this.data.MONTH == 1) {
      monthText = "Jan";
      this.monthDay = 31;
    }

    else if (this.data.MONTH == 2) {
      monthText = "Feb";
      this.monthDay = 28;
    }

    else if (this.data.MONTH == 3) {
      monthText = "Mar";
      this.monthDay = 31;
    }

    else if (this.data.MONTH == 4) {
      monthText = "April";
      this.monthDay = 30;
    }

    else if (this.data.MONTH == 5) {
      monthText = "May";
      this.monthDay = 31;
    }

    else if (this.data.MONTH == 6) {
      monthText = "June";
      this.monthDay = 30;
    }

    else if (this.data.MONTH == 7) {
      monthText = "July";
      this.monthDay = 31;
    }

    else if (this.data.MONTH == 8) {
      monthText = "Aug";
      this.monthDay = 30;
    }

    else if (this.data.MONTH == 9) {
      monthText = "Sept";
      this.monthDay = 30;
    }

    else if (this.data.MONTH == 10) {
      monthText = "Oct";
      this.monthDay = 31;
    }

    else if (this.data.MONTH == 11) {
      monthText = "Nov";
      this.monthDay = 30;
    }

    else if (this.data.MONTH == 12) {
      monthText = "Dec";
      this.monthDay = 31;
    }

    this.currentYear = this.data.YEAR + 1;
    this.modalHeader = "Monthly Reporting of " + monthText + ' ' + this.data.YEAR;
    this.reportHeader = monthText + ' ' + this.data.YEAR;

    this.api.getMonthlyGroupReport(0, 0, 'ID', 'asc', 'AND MONTH=' + this.data.MONTH + ' AND YEAR=' + this.data.YEAR + ' AND GROUP_ID=' + this.groupID).subscribe(groupData => {
      if (groupData["code"] == 200) {
        this.dataList = groupData['data'];
        console.log(this.dataList);

        if (this.dataList.length == 0) {
          // Group info
          this.api.getAllGroupsTilesDetails(0, 0, "", "", " AND GROUP_ID=" + this.groupID).subscribe(groupData => {
            if (groupData['code'] == 200) {
              console.log(groupData['data'][0]);

              this.data['GROUP_NAME'] = groupData['data'][0]['GROUP_NAME'];
              this.data['UNIT_NAME'] = groupData['data'][0]['UNIT_NAME'];

              // Administration info (President)
              this.api.AddedMemberList(0, 0, 'NAME', 'asc', " AND ID=" + groupData['data'][0]['PRESIDENT']).subscribe(memberData => {
                if (memberData['code'] == 200) {
                  this.data['PRESIDENT_NAME'] = memberData['data'][0]['NAME'];
                  this.data['PRESIDENT_SIGNATURE'] = memberData['data'][0]['SIGNATURE'];
                }

              }, err => {
                if (err['ok'] == false)
                  this.message.error("Server Not Found", "");
              });

              // Administration info (Secretary)
              this.api.AddedMemberList(0, 0, 'NAME', 'asc', " AND ID=" + groupData['data'][0]['SECRETORY']).subscribe(memberData => {
                if (memberData['code'] == 200) {
                  this.data['SECRETORY_NAME'] = memberData['data'][0]['NAME'];
                  this.data['SECRETORY_SIGNATURE'] = memberData['data'][0]['SIGNATURE'];
                }

              }, err => {
                if (err['ok'] == false)
                  this.message.error("Server Not Found", "");
              });
            }

          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
        }
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    // Added members list
    this.addedMemberArray = [];
    let adddedMemberFromDate: string = this.datePipe.transform(new Date(this.submissionYear, this.submissionMonth - 1, 1), "yyyy-MM-dd");
    let findDaysInMonth: number = new Date(this.submissionYear, this.submissionMonth, 0).getDate();
    let adddedMemberToDate: string = this.datePipe.transform(new Date(this.submissionYear, this.submissionMonth - 1, findDaysInMonth), "yyyy-MM-dd");

    this.api.AddedMemberList(0, 0, 'NAME', 'asc', ' AND GROUP_ID=' + this.groupID + " AND MEMBERSHIP_DATE BETWEEN '" + adddedMemberFromDate + "' AND '" + adddedMemberToDate + "'").subscribe(addedMemberData => {
      if (addedMemberData['code'] == 200) {
        this.addedMemberArray = addedMemberData['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    // Dropped member list
    this.droppedMemberArray = [];

    this.api.AddedMemberList(0, 0, 'NAME', 'asc', ' AND GROUP_ID=' + this.groupID + " AND DROPPED_STATUS=1 AND DROPPED_DATE BETWEEN '" + adddedMemberFromDate + "' AND '" + adddedMemberToDate + "'").subscribe(droppedMemberData => {
      if (droppedMemberData['code'] == 200) {
        this.droppedMemberArray = droppedMemberData['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    this.getMeetingData();
    this.getBoardMeetingData();
    this.getProjectData();
    this.getEventData();
    this.loadPaymentData();
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void { }

  GroupMeetingPercentage(): void {
    this.data.GROUPMEETING_ATTENDANCE_PERCENTAGE = ((this.data.GROUPMEETING_ATTENDED_BY / this.data.GROUPMEETING_TOTAL_MEMBER) * 100);
  }

  BoardMeetingPercentage(): void {
    this.data.BOARDMEETING_ATTENDANCE_PERCENTAGE = ((this.data.BOARDMEETING_ATTENDED_BY / this.data.BOARDMEETING_TOTAL_MEMBER) * 100);
    var num = parseFloat(this.data.BOARDMEETING_ATTENDANCE_PERCENTAGE.toString()).toFixed(2);
    this.data.BOARDMEETING_ATTENDANCE_PERCENTAGE = parseInt(num);
  }

  ApplySubmit(myForm: NgForm): void {
    this.data.IS_SUBMITTED = 'S';
    this.save(false, myForm);
  }

  drawerProjectTitle: string;
  drawerProjectVisible: boolean;
  drawerProjectData: ProjectsOfTheMonth = new ProjectsOfTheMonth();
  projectData: any[] = [];
  @Input() projectArray: ProjectsOfTheMonth[] = [];
  currentIndex: number = -1;

  get projectTableCallback() {
    return this.projectTable.bind(this);
  }

  projectTable(): void {
    if (this.currentIndex > -1) {
      this.projectArray[this.currentIndex] = this.drawerProjectData;
      this.projectArray = [...[], ...this.projectArray];
      this.message.success("Project Details Updated Successfully..", "");

    } else {
      this.projectArray = [...this.projectArray, ...[this.drawerProjectData]];
      this.message.success("Project Details Created Successfully..", "");
    }

    this.currentIndex = -1;
    this.drawerProjectVisible = false;
  }

  drawerEventTitle: string;
  drawerEventVisible: boolean;
  drawerEventData: EventsOfTheMonth = new EventsOfTheMonth();
  eventData: any[] = [];
  @Input() eventArray: EventsOfTheMonth[] = [];
  currentEventIndex: number = -1;

  get eventTableCallback() {
    return this.eventTable.bind(this);
  }

  eventTable(): void {
    if (this.currentEventIndex > -1) {
      this.eventArray[this.currentEventIndex] = this.drawerEventData;
      this.eventArray = [...[], ...this.eventArray];
      this.message.success("Event Details Updated Successfully..", "");

    } else {
      this.eventArray = [...this.eventArray, ...[this.drawerEventData]];
      this.message.success("Event Details Created Successfully..", "");
    }

    this.currentEventIndex = -1;
    this.drawerEventVisible = false;
  }

  drawerMeetingTitle: string;
  drawerMeetingVisible: boolean;
  drawerMeetingData: MeetingsOfTheMonth = new MeetingsOfTheMonth();
  meetingData: any[] = [];
  @Input() meetingArray: MeetingsOfTheMonth[] = [];
  currentMeetingIndex: number = -1;

  get meetingTableCallback() {
    return this.meetingTable.bind(this);
  }

  meetingTable(): void {
    if (this.currentMeetingIndex > -1) {
      this.meetingArray[this.currentMeetingIndex] = this.drawerMeetingData;
      this.meetingArray = [...[], ...this.meetingArray];
      this.message.success("Meeting Details Updated Successfully..", "");

    } else {
      this.meetingArray = [...this.meetingArray, ...[this.drawerMeetingData]];
      this.message.success("Meeting Details Created Successfully..", "");
    }

    this.currentMeetingIndex = -1;
    this.drawerMeetingVisible = false;
  }

  fileURL1: any = null;
  fileURL2: any = null;
  fileURL3: any = null;
  fileURL4: any = null;
  fileURL5: any = null;

  onFileSelected1(event: any) {
    var fileExt = event.target.files[0].name.split('.').pop();

    if (fileExt == 'jfif') {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL1 = null;

    } else
      if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
        this.fileURL1 = <File>event.target.files[0];
        this.compressImage.compress(event.target.files[0])
          .pipe(take(1))
          .subscribe(compressedImage => {
            this.fileURL1 = compressedImage;
          })

        const reader = new FileReader();

        if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);

          reader.onload = () => {
            this.data.PHOTO_URL1 = reader.result as string;
          };
        }

      } else {
        this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
        this.fileURL1 = null;
      }
  }

  onFileSelected2(event: any) {
    var fileExt = event.target.files[0].name.split('.').pop();

    if (fileExt == 'jfif') {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL2 = null;

    } else
      if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
        this.fileURL2 = <File>event.target.files[0];
        this.compressImage.compress(event.target.files[0])
          .pipe(take(1))
          .subscribe(compressedImage => {
            this.fileURL2 = compressedImage;
          })

        const reader = new FileReader();

        if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);

          reader.onload = () => {
            this.data.PHOTO_URL2 = reader.result as string;
          };
        }

      } else {
        this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
        this.fileURL2 = null;
      }
  }

  onFileSelected3(event: any) {
    var fileExt = event.target.files[0].name.split('.').pop();

    if (fileExt == 'jfif') {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL3 = null;

    } else
      if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
        this.fileURL3 = <File>event.target.files[0];
        this.compressImage.compress(event.target.files[0])
          .pipe(take(1))
          .subscribe(compressedImage => {
            this.fileURL3 = compressedImage;
          })

        const reader = new FileReader();

        if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.data.PHOTO_URL3 = reader.result as string;
          };
        }

      } else {
        this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
        this.fileURL3 = null;
      }
  }

  onFileSelected4(event: any) {
    var fileExt = event.target.files[0].name.split('.').pop();

    if (fileExt == 'jfif') {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL4 = null;

    } else
      if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
        this.fileURL4 = <File>event.target.files[0];
        this.compressImage.compress(event.target.files[0])
          .pipe(take(1))
          .subscribe(compressedImage => {
            this.fileURL4 = compressedImage;
          })

        const reader = new FileReader();

        if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.data.PHOTO_URL4 = reader.result as string;
          };
        }

      } else {
        this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
        this.fileURL4 = null;
      }
  }

  onFileSelected5(event: any) {
    var fileExt = event.target.files[0].name.split('.').pop();

    if (fileExt == 'jfif') {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL5 = null;

    } else
      if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
        this.fileURL5 = <File>event.target.files[0];
        this.compressImage.compress(event.target.files[0])
          .pipe(take(1))
          .subscribe(compressedImage => {
            this.fileURL5 = compressedImage;
          })

        const reader = new FileReader();

        if (event.target.files && event.target.files.length) {
          const [file] = event.target.files;
          reader.readAsDataURL(file);
          reader.onload = () => {
            this.data.PHOTO_URL5 = reader.result as string;
          };
        }

      } else {
        this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
        this.fileURL5 = null;
      }
  }

  viewImage(imageName) {
    window.open(imageName);
  }

  folderName = "monthlyProjectImages";
  photo1Str: string;
  photo2Str: string;
  photo3Str: string;
  photo4Str: string;
  photo5Str: string;

  imageUpload1() {
    this.photo1Str = "";
    var number = Math.floor(100000 + Math.random() * 900000);
    var fileExt = this.fileURL1.name.split('.').pop();
    var url = "GM" + number + "." + fileExt;
    this.data.PHOTO_URL1 = url;

    if (this.fileURL1) {
      this.api.onUploadMedia(this.folderName, this.fileURL1, this.data.PHOTO_URL1).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");

        } else {
          console.log("Not Uploaded");
        }
      });

      this.photo1Str = this.data.PHOTO_URL1;

    } else {
      this.photo1Str = "";
    }

    this.fileURL1 = null;
  }

  imageUpload2() {
    this.photo2Str = "";
    var number = Math.floor(100000 + Math.random() * 900000);
    var fileExt = this.fileURL2.name.split('.').pop();
    var url = "GM" + number + "." + fileExt;
    this.data.PHOTO_URL2 = url;

    if (this.fileURL2) {
      this.api.onUploadMedia(this.folderName, this.fileURL2, this.data.PHOTO_URL2).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");

        } else {
          console.log("Not Uploaded");
        }
      });

      this.photo2Str = this.data.PHOTO_URL2;

    } else {
      this.photo2Str = "";
    }

    this.fileURL2 = null;
  }

  imageUpload3() {
    this.photo3Str = "";
    var number = Math.floor(100000 + Math.random() * 900000);
    var fileExt = this.fileURL3.name.split('.').pop();
    var url = "GM" + number + "." + fileExt;
    this.data.PHOTO_URL3 = url;

    if (this.fileURL3) {
      this.api.onUploadMedia(this.folderName, this.fileURL3, this.data.PHOTO_URL3).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");

        } else {
          console.log("Not Uploaded");
        }
      });

      this.photo3Str = this.data.PHOTO_URL3;

    } else {
      this.photo3Str = "";
    }

    this.fileURL3 = null;
  }


  imageUpload4() {
    this.photo4Str = "";
    var number = Math.floor(100000 + Math.random() * 900000);
    var fileExt = this.fileURL4.name.split('.').pop();
    var url = "GM" + number + "." + fileExt;
    this.data.PHOTO_URL4 = url;

    if (this.fileURL4) {
      this.api.onUploadMedia(this.folderName, this.fileURL4, this.data.PHOTO_URL4).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");

        } else {
          console.log("Not Uploaded");
        }
      });

      this.photo4Str = this.data.PHOTO_URL4;

    } else {
      this.photo4Str = "";
    }

    this.fileURL4 = null;
  }

  imageUpload5() {
    this.photo5Str = "";
    var number = Math.floor(100000 + Math.random() * 900000);
    var fileExt = this.fileURL5.name.split('.').pop();
    var url = "GM" + number + "." + fileExt;
    this.data.PHOTO_URL5 = url;

    if (this.fileURL5) {
      this.api.onUploadMedia(this.folderName, this.fileURL5, this.data.PHOTO_URL5).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");

        } else {
          console.log("Not Uploaded");
        }
      });

      this.photo5Str = this.data.PHOTO_URL5;

    } else {
      this.photo5Str = "";
    }

    this.fileURL5 = null;
  }

  getWidth(): number {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 600;
  }

  Test(): void {
    this.eventArray = [...[], ...this.eventArray];
  }

  unitconferences(BOARDMEETING_ATTENDED_BY, BOARDMEETING_TOTAL_MEMBER) {
    if (BOARDMEETING_TOTAL_MEMBER != 0) {
      if (parseInt(BOARDMEETING_ATTENDED_BY) > parseInt(BOARDMEETING_TOTAL_MEMBER)) {
        this.message.error("Meeting Of Board Member", "Please fill the corrected data");
        this.data.BOARDMEETING_ATTENDED_BY = 0;
        this.data.BOARDMEETING_ATTENDANCE_PERCENTAGE = 0;
      }
    }
  }

  AddedMemberslastMonthData: any[] = [];
  AddedMembersMonthData: any[] = [];
  AddedMeetingMonthData: any[] = [];
  AddedProjectMonthData: any[] = [];
  lastMonthCount: number;
  currentMonthCount: number;
  janToJunCount: number;
  julyToDecCount: number;
  isProjectSpining: boolean = false;
  isEvenSpining: boolean = false;
  isMeetingSpining: boolean = false;

  FetchOldData(): void {
    // Fetch old data
    this.api.groupMonthlyReportFetchOldData(0, 0, '', '', '', this.groupID, this.submissionMonth, this.submissionYear).subscribe(data => {
      if (data['code'] == 200) {
        this.isSpinning = false;
        this.data.MEMBERSHIP_CLOSED_LAST_MONTH = data['data'][0]["LAST_MONTH_COUNT"];
        this.data.MEMBERSHIP_ADDED_DURING_MONTH = data['data'][0]["CURRENT_MONTH_COUNT"];
        this.data.MEMBERSHIP_DROPED_DURING_MONTH = data['data'][0]["DROPPED_CURRENT_MONTH"];
        this.data.MEMSUB_JANTOJUNE = data['data'][0]["JAN_JUNE_COUNT"];
        this.data.MEMSUB_JULYTODEC = data['data'][0]["JULY_DEC_COUNT"];
        this.data.NO_OF_SUB_MEMBER = data['data'][0]["CURRENT_MONTH_COUNT"];
        this.data.NO_OF_ENTERENCE_MEMBER = data['data'][0]["CURRENT_MONTH_COUNT"];
        this.data.MEMBERSHIP_CLOSED_THIS_MONTH = (this.data.MEMBERSHIP_CLOSED_LAST_MONTH ? this.data.MEMBERSHIP_CLOSED_LAST_MONTH : 0) + (this.data.MEMBERSHIP_ADDED_DURING_MONTH ? this.data.MEMBERSHIP_ADDED_DURING_MONTH : 0) - (this.data.MEMBERSHIP_DROPED_DURING_MONTH ? this.data.MEMBERSHIP_DROPED_DURING_MONTH : 0);

        this.data.PER_MEMBER_SUB_FEES = data['data'][0]["SUBSCRIPTION_FEE_PER_MEMBER"];
        this.data.TOTAL_SUB_FEES = this.data.NO_OF_SUB_MEMBER * this.data.PER_MEMBER_SUB_FEES;
        this.data.PER_MEMBER_ENTERENCE_FEES = data['data'][0]["JOINING_FEE_PER_MEMBER"];
        this.data.TOTAL_ENTERENCE_FEES = this.data.NO_OF_ENTERENCE_MEMBER * this.data.PER_MEMBER_ENTERENCE_FEES;
        this.data.TOTAL_AMOUNT = this.data.TOTAL_SUB_FEES + this.data.TOTAL_ENTERENCE_FEES;

        this.data.PAID_AMOUNT = data['data'][0]["PAID_AMOUNT"];
        this.data.CHEQUE_DD_NO = data['data'][0]["DD_CHEQUE"];
      }

    }, err => {
      this.isSpinning = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    // Addedd members in current month
    let adddedMemberFromDate: string = this.datePipe.transform(new Date(this.submissionYear, this.submissionMonth - 1, 1), "yyyy-MM-dd");
    let findDaysInMonth: number = new Date(this.submissionYear, this.submissionMonth, 0).getDate();
    let adddedMemberToDate: string = this.datePipe.transform(new Date(this.submissionYear, this.submissionMonth - 1, findDaysInMonth), "yyyy-MM-dd");
    this.isMemberLoading = true;

    this.api.AddedMemberList(0, 0, 'NAME', 'asc', " AND GROUP_ID=" + this.groupID + " AND MEMBERSHIP_DATE BETWEEN '" + adddedMemberFromDate + "' AND '" + adddedMemberToDate + "'").subscribe(addedMemberData => {
      if (addedMemberData['code'] == 200) {
        this.isMemberLoading = false;
        this.addedMemberArray = [...addedMemberData['data']];

      } else {
        this.isMemberLoading = false;
        this.addedMemberArray = [];
      }

    }, err => {
      this.isMemberLoading = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    // Dropped members in current month
    this.isDroppedMemberLoading = true;

    this.api.AddedMemberList(0, 0, 'NAME', 'asc', " AND GROUP_ID=" + this.groupID + " AND DROPPED_STATUS=1 AND DROPPED_DATE BETWEEN '" + adddedMemberFromDate + "' AND '" + adddedMemberToDate + "'").subscribe(addedMemberData => {
      if (addedMemberData['code'] == 200) {
        this.isDroppedMemberLoading = false;
        this.droppedMemberArray = [...addedMemberData['data']];

      } else {
        this.isDroppedMemberLoading = false;
        this.droppedMemberArray = [];
      }

    }, err => {
      this.isDroppedMemberLoading = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    // Bank account details
    this.api.getAllGroupsTilesDetails(0, 0, "", "", " AND GROUP_ID=" + this.groupID).subscribe(data => {
      if (data['code'] == 200) {
        this.data.ADMIN_ACCOUNT_NO = data['data'][0]['AD_ACC_NO'];
        this.data.ADMIN_BANK_NAME = data['data'][0]['AD_BANK_NAME'];
        this.data.ADMIN_BRANCH_NAME = data['data'][0]['AD_BRANCH_NAME'];
        this.data.PROJECT_ACCOUNT_NO = data['data'][0]['PR_ACC_NO'];
        this.data.PROJECT_BANK_NAME = data['data'][0]['PR_BANK_NAME'];
        this.data.PROJECT_BRANCH_NAME = data['data'][0]['PR_BRANCH_NAME'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    this.getMeetingData();
    this.getBoardMeetingData();
    this.getProjectData();
    this.getEventData();
    this.loadPaymentData();
  }

  getEventData(): void {
    this.isEvenSpining = true;
    this.eventArray = [];

    this.api.getAllGroupActivities(0, 0, 'ID', 'asc', ' AND GROUP_ID=' + this.groupID + ' AND MONTH(DATE)=' + this.data.MONTH + ' AND YEAR(DATE)=' + this.data.YEAR + " AND IS_DELETED=0").subscribe(eventdata => {
      if (eventdata['code'] == 200) {
        this.isEvenSpining = false;
        this.eventArray = eventdata['data'];

      } else {
        this.isEvenSpining = false;
      }

    }, err => {
      this.isEvenSpining = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getProjectData(): void {
    this.isProjectSpining = true;
    this.projectArray = [];

    this.api.getAllgroupProjects(0, 0, 'ID', 'asc', ' AND GROUP_ID=' + this.groupID + ' AND MONTH(DATE_OF_PROJECT)=' + this.data.MONTH + ' AND YEAR(DATE_OF_PROJECT)=' + this.data.YEAR + " AND IS_DELETED=0").subscribe(projectdata => {
      if (projectdata['code'] == 200) {
        this.isProjectSpining = false;
        this.projectArray = projectdata['data'];

      } else {
        this.isProjectSpining = false;
      }

    }, err => {
      this.isProjectSpining = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getMeetingData(): void {
    this.isMeetingSpining = true;
    this.meetingArray = [];

    this.api.getAllgroupMeeting(0, 0, 'ID', 'asc', ' AND GROUP_ID=' + this.groupID + ' AND MONTH(DATE)=' + this.data.MONTH + ' AND YEAR(DATE)=' + this.data.YEAR + " AND TYPE_OF_MEET IN ('G') AND IS_DELETED=0").subscribe(meetingdata => {
      if (meetingdata['code'] == 200) {
        this.isMeetingSpining = false;
        this.meetingArray = meetingdata['data'];

      } else {
        this.isMeetingSpining = false;
      }

    }, err => {
      this.isMeetingSpining = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  @Input() boardMeetingArray: any[] = [];
  isBoardMeetingSpining: boolean = false;

  getBoardMeetingData(): void {
    this.isBoardMeetingSpining = true;
    this.boardMeetingArray = [];

    this.api.getAllgroupMeeting(0, 0, 'ID', 'asc', ' AND GROUP_ID=' + this.groupID + ' AND MONTH(DATE)=' + this.data.MONTH + ' AND YEAR(DATE)=' + this.data.YEAR + " AND TYPE_OF_MEET='B' AND IS_DELETED=0").subscribe(meetingdata => {
      if (meetingdata['code'] == 200) {
        this.isBoardMeetingSpining = false;
        this.boardMeetingArray = meetingdata['data'];

      } else {
        this.isBoardMeetingSpining = false;
      }

    }, err => {
      this.isBoardMeetingSpining = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  @ViewChild(GroupProjectActivityDrawerComponent, { static: false }) GroupProjectActivityDrawerComponentVar: GroupProjectActivityDrawerComponent;
  eventDrawerTitle: string;
  eventDrawerData: GroupActivityMaster = new GroupActivityMaster();
  eventDrawerVisible: boolean = false;

  addNewEvent(): void {
    this.eventDrawerTitle = "aaa " + "Add Event";
    this.eventDrawerData = new GroupActivityMaster();
    this.eventDrawerVisible = true;
    this.eventDrawerData.DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.GroupProjectActivityDrawerComponentVar.fileURL1 = null;
    this.GroupProjectActivityDrawerComponentVar.fileURL2 = null;
    this.GroupProjectActivityDrawerComponentVar.fileURL3 = null;
    this.GroupProjectActivityDrawerComponentVar.fileURL4 = null;
    this.GroupProjectActivityDrawerComponentVar.fileURL5 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL1 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL2 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL3 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL4 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL5 = null;
    this.GroupProjectActivityDrawerComponentVar.pdfFileURL1 = null;
    this.GroupProjectActivityDrawerComponentVar.pdfFileURL2 = null;

    // Drawer Type
    this.GroupProjectActivityDrawerComponentVar.addDrawer = false;

    // Week celebration event
    this.GroupProjectActivityDrawerComponentVar.GIANTS_WEEK_START_DATE = this.GIANTS_WEEK_START_DATE;
    this.GroupProjectActivityDrawerComponentVar.GIANTS_WEEK_END_DATE = this.GIANTS_WEEK_END_DATE;

    this.GroupProjectActivityDrawerComponentVar.CURRENT_DATE = new Date();
    this.GroupProjectActivityDrawerComponentVar.celebrationWeekTitle();
    this.GroupProjectActivityDrawerComponentVar.celebrationCheckBox();

    // Fill default hashtags
    let defaultHashtags = this.api.defaultHashtags;
    defaultHashtags += "," + (sessionStorage.getItem("HOME_GROUP_NAME").trim().replace(/\s/g, "")) + "," + (sessionStorage.getItem("HOME_UNIT_NAME").trim().replace(/\s/g, "")) + "," + (sessionStorage.getItem("HOME_FEDERATION_NAME").trim().replace(/\s/g, ""));
    this.eventDrawerData.HASHTAGS = defaultHashtags.split(',');
  }

  eventEditInPartially(data: any, updateBeneficiaryDetails: boolean = false): void {
    this.eventDrawerVisible = true;
    this.eventDrawerTitle = "aaa " + "Edit Event";
    this.GroupProjectActivityDrawerComponentVar.isSpinning = true;

    this.api.getAllGroupActivitiesUser(0, 0, "", "", " AND ID=" + data["ID"], this.api.userId).subscribe(data => {
      if ((data['code'] == 200)) {
        this.GroupProjectActivityDrawerComponentVar.isSpinning = false;
        let eventData = data['data'][0];
        this.eventDrawerData = Object.assign({}, eventData);
        this.eventDrawerData.COUNT = String(this.eventDrawerData.COUNT);
        this.eventDrawerData.FROM_TIME = this.datePipe.transform(new Date(), "yyyy-MM-dd") + " " + this.eventDrawerData.FROM_TIME;
        this.eventDrawerData.TO_TIME = this.datePipe.transform(new Date(), "yyyy-MM-dd") + " " + this.eventDrawerData.TO_TIME;
        this.GroupProjectActivityDrawerComponentVar.fileURL1 = null;
        this.GroupProjectActivityDrawerComponentVar.fileURL2 = null;
        this.GroupProjectActivityDrawerComponentVar.fileURL3 = null;
        this.GroupProjectActivityDrawerComponentVar.fileURL4 = null;
        this.GroupProjectActivityDrawerComponentVar.fileURL5 = null;
        this.GroupProjectActivityDrawerComponentVar.originalFileURL1 = null;
        this.GroupProjectActivityDrawerComponentVar.originalFileURL2 = null;
        this.GroupProjectActivityDrawerComponentVar.originalFileURL3 = null;
        this.GroupProjectActivityDrawerComponentVar.originalFileURL4 = null;
        this.GroupProjectActivityDrawerComponentVar.originalFileURL5 = null;
        this.GroupProjectActivityDrawerComponentVar.pdfFileURL1 = null;
        this.GroupProjectActivityDrawerComponentVar.pdfFileURL2 = null;

        if (this.eventDrawerData.PHOTO1 != " ")
          this.eventDrawerData.PHOTO1 = this.api.retriveimgUrl + "groupActivity/" + this.eventDrawerData.PHOTO1;
        else
          this.eventDrawerData.PHOTO1 = null;

        if (this.eventDrawerData.PHOTO2 != " ")
          this.eventDrawerData.PHOTO2 = this.api.retriveimgUrl + "groupActivity/" + this.eventDrawerData.PHOTO2;
        else
          this.eventDrawerData.PHOTO2 = null;

        if (this.eventDrawerData.PHOTO3 != " ")
          this.eventDrawerData.PHOTO3 = this.api.retriveimgUrl + "groupActivity/" + this.eventDrawerData.PHOTO3;
        else
          this.eventDrawerData.PHOTO3 = null;

        if (this.eventDrawerData.PHOTO4 != " ")
          this.eventDrawerData.PHOTO4 = this.api.retriveimgUrl + "groupActivity/" + this.eventDrawerData.PHOTO4;
        else
          this.eventDrawerData.PHOTO4 = null;

        if (this.eventDrawerData.PHOTO5 != " ")
          this.eventDrawerData.PHOTO5 = this.api.retriveimgUrl + "groupActivity/" + this.eventDrawerData.PHOTO5;
        else
          this.eventDrawerData.PHOTO5 = null;

        if (this.eventDrawerData.PDF1 != " ")
          this.eventDrawerData.PDF1 = this.eventDrawerData.PDF1;
        else
          this.eventDrawerData.PDF1 = null;

        if (this.eventDrawerData.PDF2 != " ")
          this.eventDrawerData.PDF2 = this.eventDrawerData.PDF2;
        else
          this.eventDrawerData.PDF2 = null;

        // Drawer Type
        if (updateBeneficiaryDetails) {
          this.GroupProjectActivityDrawerComponentVar.addDrawer = true;

        } else {
          if (this.eventDrawerData["IS_INVITION_SEND"] && this.eventDrawerData["IS_ATTENDANCE_MARKED"]) {
            this.GroupProjectActivityDrawerComponentVar.addDrawer = true;

          } else {
            this.GroupProjectActivityDrawerComponentVar.addDrawer = false;
          }
        }

        // Fill Hashtags
        if ((this.eventDrawerData.HASHTAGS != null) && (this.eventDrawerData.HASHTAGS != '')) {
          this.eventDrawerData.HASHTAGS = this.eventDrawerData.HASHTAGS.split(',');
        }

        // Week celebration event
        this.GroupProjectActivityDrawerComponentVar.GIANTS_WEEK_START_DATE = this.GIANTS_WEEK_START_DATE;
        this.GroupProjectActivityDrawerComponentVar.GIANTS_WEEK_END_DATE = this.GIANTS_WEEK_END_DATE;

        this.GroupProjectActivityDrawerComponentVar.CURRENT_DATE = new Date(Number(this.eventDrawerData.DATE.split("-")[0]), Number(this.eventDrawerData.DATE.split("-")[1]) - 1, Number(this.eventDrawerData.DATE.split("-")[2]));
        this.GroupProjectActivityDrawerComponentVar.celebrationWeekTitle();
        this.GroupProjectActivityDrawerComponentVar.celebrationCheckBox();
      }

    }, err => {
      this.GroupProjectActivityDrawerComponentVar.isSpinning = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  deleteEvent(eventData: GroupActivityMaster): void {
    eventData.IS_DELETED = true;
    this.isEvenSpining = true;

    this.api.updateGroupActivity(eventData).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Event Deleted Successfully", "");
        this.getEventData();

      } else {
        this.message.error("Failed to Event Deletion", "");
        this.getEventData();
      }
    });
  }

  eventDrawerClose(): void {
    this.eventDrawerVisible = false;
    this.getEventData();
  }

  get eventDrawerCloseCallback() {
    return this.eventDrawerClose.bind(this);
  }

  @ViewChild(AddProjectDetailsDrawerComponent, { static: false }) AddProjectDetailsDrawerComponentVar: AddProjectDetailsDrawerComponent;
  projectDrawerTitle: string;
  projectDrawerData: GroupProjectMaster = new GroupProjectMaster();
  projectDrawerVisible: boolean = false;

  addNewProject(): void {
    this.projectDrawerTitle = "aaa " + "Add Project";
    this.projectDrawerData = new GroupProjectMaster();
    this.projectDrawerVisible = true;
    this.projectDrawerData.DATE_OF_PROJECT = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.AddProjectDetailsDrawerComponentVar.fileURL1 = null;
    this.AddProjectDetailsDrawerComponentVar.fileURL2 = null;
    this.AddProjectDetailsDrawerComponentVar.fileURL3 = null;
    this.AddProjectDetailsDrawerComponentVar.fileURL4 = null;
    this.AddProjectDetailsDrawerComponentVar.fileURL5 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL1 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL2 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL3 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL4 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL5 = null;
    this.AddProjectDetailsDrawerComponentVar.pdfFileURL1 = null;
    this.AddProjectDetailsDrawerComponentVar.pdfFileURL2 = null;

    // Drawer Type
    this.AddProjectDetailsDrawerComponentVar.addDrawer = false;
  }

  projectEditInPartially(data: any): void {
    this.projectDrawerVisible = true;
    this.projectDrawerTitle = "aaa " + "Edit Project";
    this.AddProjectDetailsDrawerComponentVar.isSpinning = true;

    this.api.getAllgroupProjectData(0, 0, "", "", " AND ID=" + data["ID"]).subscribe(data => {
      if ((data['code'] == 200)) {
        this.AddProjectDetailsDrawerComponentVar.isSpinning = false;
        let projectData = data['data'][0];
        this.projectDrawerData = Object.assign({}, projectData);
        this.AddProjectDetailsDrawerComponentVar.fileURL1 = null;
        this.AddProjectDetailsDrawerComponentVar.fileURL2 = null;
        this.AddProjectDetailsDrawerComponentVar.fileURL3 = null;
        this.AddProjectDetailsDrawerComponentVar.fileURL4 = null;
        this.AddProjectDetailsDrawerComponentVar.fileURL5 = null;
        this.AddProjectDetailsDrawerComponentVar.originalFileURL1 = null;
        this.AddProjectDetailsDrawerComponentVar.originalFileURL2 = null;
        this.AddProjectDetailsDrawerComponentVar.originalFileURL3 = null;
        this.AddProjectDetailsDrawerComponentVar.originalFileURL4 = null;
        this.AddProjectDetailsDrawerComponentVar.originalFileURL5 = null;
        this.AddProjectDetailsDrawerComponentVar.pdfFileURL1 = null;
        this.AddProjectDetailsDrawerComponentVar.pdfFileURL2 = null;

        if (this.projectDrawerData.PHOTO1 != " ") {
          this.projectDrawerData.PHOTO1 = this.api.retriveimgUrl + "groupProjectPhotos/" + this.projectDrawerData.PHOTO1;

        } else {
          this.projectDrawerData.PHOTO1 = null;
        }

        if (this.projectDrawerData.PHOTO2 != " ") {
          this.projectDrawerData.PHOTO2 = this.api.retriveimgUrl + "groupProjectPhotos/" + this.projectDrawerData.PHOTO2;

        } else {
          this.projectDrawerData.PHOTO2 = null;
        }

        if (this.projectDrawerData.PHOTO3 != " ") {
          this.projectDrawerData.PHOTO3 = this.api.retriveimgUrl + "groupProjectPhotos/" + this.projectDrawerData.PHOTO3;

        } else {
          this.projectDrawerData.PHOTO3 = null;
        }

        // Drawer Type
        this.AddProjectDetailsDrawerComponentVar.addDrawer = false;

        // Fill Hashtags
        if ((this.projectDrawerData.AWARDS_RECEIVED != null) && (this.projectDrawerData.AWARDS_RECEIVED != '')) {
          this.projectDrawerData.AWARDS_RECEIVED = this.projectDrawerData.AWARDS_RECEIVED.split(',');
        }
      }

    }, err => {
      this.AddProjectDetailsDrawerComponentVar.isSpinning = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  deleteProject(projectData: GroupProjectMaster): void {
    projectData.IS_DELETED = true;
    this.isProjectSpining = true;

    this.api.updategroupProjects(projectData).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Project Deleted Successfully", "");
        this.getProjectData();

      } else {
        this.message.error("Failed to Project Deletion", "");
        this.getProjectData();
      }
    });
  }

  projectDrawerClose(): void {
    this.projectDrawerVisible = false;
    this.getProjectData();
  }

  get projectDrawerCloseCallback() {
    return this.projectDrawerClose.bind(this);
  }

  @ViewChild(AddgroupmeetingsattendanceComponent, { static: false }) AddgroupmeetingsattendanceComponentVar: AddgroupmeetingsattendanceComponent;
  meetingDrawerTitle: string;
  meetingDrawerData: GroupMeetAttendance = new GroupMeetAttendance();
  meetingDrawerVisible: boolean = false;
  meetingType: string;

  addNewMeeting(meetingType: string = 'G'): void {
    this.meetingType = meetingType;
    this.meetingDrawerTitle = "aaa " + "Add Meeting";
    this.meetingDrawerData = new GroupMeetAttendance();
    this.meetingDrawerVisible = true;
    this.meetingDrawerData.DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");

    // Meeting Type
    if (meetingType == "G") {
      this.meetingDrawerData.TYPE_OF_MEET = "G";

    } else if (meetingType == "B") {
      this.meetingDrawerData.TYPE_OF_MEET = "B";
    }

    this.AddgroupmeetingsattendanceComponentVar.fileURL1 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL2 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL3 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL4 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL5 = null;
    this.AddgroupmeetingsattendanceComponentVar.originalFileURL1 = null;
    this.AddgroupmeetingsattendanceComponentVar.originalFileURL2 = null;
    this.AddgroupmeetingsattendanceComponentVar.originalFileURL3 = null;
    this.AddgroupmeetingsattendanceComponentVar.originalFileURL4 = null;
    this.AddgroupmeetingsattendanceComponentVar.originalFileURL5 = null;
    this.AddgroupmeetingsattendanceComponentVar.pdfFileURL1 = null;
    this.AddgroupmeetingsattendanceComponentVar.pdfFileURL2 = null;

    // Drawer Type
    this.AddgroupmeetingsattendanceComponentVar.addDrawer = false;
    this.AddgroupmeetingsattendanceComponentVar.uploadMinutes = false;

    // Meeting Type
    if (this.federationID > 0) {
      this.meetingDrawerData.MEETING_TYPE = "P";

    } else if (this.unitID > 0) {
      this.meetingDrawerData.MEETING_TYPE = "U";
      this.AddgroupmeetingsattendanceComponentVar.getUnits();
      this.AddgroupmeetingsattendanceComponentVar.SELECT_ALL = false;
      this.AddgroupmeetingsattendanceComponentVar.shareWithinTitle = "Select Unit";
      this.AddgroupmeetingsattendanceComponentVar.shareWithinPlaceHolder = "Type here to search unit(s)";

    } else if (this.groupID > 0) {
      this.meetingDrawerData.MEETING_TYPE = "G";
      this.AddgroupmeetingsattendanceComponentVar.getFilteredGroups();
      this.AddgroupmeetingsattendanceComponentVar.SELECT_ALL = false;
      this.AddgroupmeetingsattendanceComponentVar.shareWithinTitle = "Select Group";
      this.AddgroupmeetingsattendanceComponentVar.shareWithinPlaceHolder = "Type here to search group(s)";
    }
  }

  meetingEditInPartially(data: any, meetingType: string = 'G'): void {
    this.meetingType = meetingType;
    this.meetingDrawerVisible = true;
    this.meetingDrawerTitle = "aaa " + "Edit Meeting";
    this.AddgroupmeetingsattendanceComponentVar.isSpinning = true;

    this.api.getAllgroupMeeting(0, 0, "", "", " AND ID=" + data["ID"]).subscribe(data => {
      if (data['code'] == 200) {
        this.AddgroupmeetingsattendanceComponentVar.isSpinning = false;
        let meetingData = data['data'][0];
        this.meetingDrawerData = Object.assign({}, meetingData);
        this.meetingDrawerData.FROM_TIME = this.datePipe.transform(new Date(), "yyyy-MM-dd") + " " + this.meetingDrawerData.FROM_TIME;
        this.meetingDrawerData.TO_TIME = this.datePipe.transform(new Date(), "yyyy-MM-dd") + " " + this.meetingDrawerData.TO_TIME;
        this.AddgroupmeetingsattendanceComponentVar.fileURL1 = null;
        this.AddgroupmeetingsattendanceComponentVar.fileURL2 = null;
        this.AddgroupmeetingsattendanceComponentVar.fileURL3 = null;
        this.AddgroupmeetingsattendanceComponentVar.fileURL4 = null;
        this.AddgroupmeetingsattendanceComponentVar.fileURL5 = null;
        this.AddgroupmeetingsattendanceComponentVar.pdfFileURL1 = null;
        this.AddgroupmeetingsattendanceComponentVar.pdfFileURL2 = null;

        // Drawer Type
        if (this.meetingDrawerData["IS_INVITION_SEND"] && this.meetingDrawerData["IS_ATTENDANCE_MARKED"]) {
          this.AddgroupmeetingsattendanceComponentVar.addDrawer = true;
          this.AddgroupmeetingsattendanceComponentVar.uploadMinutes = true;

        } else {
          this.AddgroupmeetingsattendanceComponentVar.addDrawer = false;
          this.AddgroupmeetingsattendanceComponentVar.uploadMinutes = false;
        }

        // Meeting images
        if (this.meetingDrawerData.PHOTO1 != " ")
          this.meetingDrawerData.PHOTO1 = this.api.retriveimgUrl + "groupMeeting/" + this.meetingDrawerData.PHOTO1;
        else
          this.meetingDrawerData.PHOTO1 = null;

        if (this.meetingDrawerData.PHOTO2 != " ")
          this.meetingDrawerData.PHOTO2 = this.api.retriveimgUrl + "groupMeeting/" + this.meetingDrawerData.PHOTO2;
        else
          this.meetingDrawerData.PHOTO2 = null;

        if (this.meetingDrawerData.PHOTO3 != " ")
          this.meetingDrawerData.PHOTO3 = this.api.retriveimgUrl + "groupMeeting/" + this.meetingDrawerData.PHOTO3;
        else
          this.meetingDrawerData.PHOTO3 = null;

        if (this.meetingDrawerData.PHOTO4 != " ")
          this.meetingDrawerData.PHOTO4 = this.api.retriveimgUrl + "groupMeeting/" + this.meetingDrawerData.PHOTO4;
        else
          this.meetingDrawerData.PHOTO4 = null;

        if (this.meetingDrawerData.PHOTO5 != " ")
          this.meetingDrawerData.PHOTO5 = this.api.retriveimgUrl + "groupMeeting/" + this.meetingDrawerData.PHOTO5;
        else
          this.meetingDrawerData.PHOTO5 = null;

        if (this.meetingDrawerData.PDF1 != " ")
          this.meetingDrawerData.PDF1 = this.meetingDrawerData.PDF1;
        else
          this.meetingDrawerData.PDF1 = null;

        if (this.meetingDrawerData.PDF2 != " ")
          this.meetingDrawerData.PDF2 = this.meetingDrawerData.PDF2;
        else
          this.meetingDrawerData.PDF2 = null;

        // Meeting Share
        if (this.meetingDrawerData.MEETING_TYPE == "P") {
          this.meetingDrawerData.TYPE_ID = undefined;

        } else if (this.meetingDrawerData.MEETING_TYPE == "F") {
          this.AddgroupmeetingsattendanceComponentVar.getFederations();
          this.AddgroupmeetingsattendanceComponentVar.SELECT_ALL = false;
          this.AddgroupmeetingsattendanceComponentVar.shareWithinPlaceHolder = "Type here to search federation(s)";

          let tempTypeIDs = this.meetingDrawerData.TYPE_ID.split(',');
          let tempTypeIDsArray = [];

          for (var i = 0; i < tempTypeIDs.length; i++) {
            tempTypeIDsArray.push(Number(tempTypeIDs[i]));
          }

          this.meetingDrawerData.TYPE_ID = tempTypeIDsArray;

        } else if (this.meetingDrawerData.MEETING_TYPE == "U") {
          this.AddgroupmeetingsattendanceComponentVar.getUnits();
          this.AddgroupmeetingsattendanceComponentVar.SELECT_ALL = false;
          this.AddgroupmeetingsattendanceComponentVar.shareWithinPlaceHolder = "Type here to search unit(s)";
          let tempTypeIDs = this.meetingDrawerData.TYPE_ID.split(',');
          let tempTypeIDsArray = [];

          for (var i = 0; i < tempTypeIDs.length; i++) {
            tempTypeIDsArray.push(Number(tempTypeIDs[i]));
          }

          this.meetingDrawerData.TYPE_ID = tempTypeIDsArray;

        } else if (this.meetingDrawerData.MEETING_TYPE == "G") {
          this.AddgroupmeetingsattendanceComponentVar.getFilteredGroups();
          this.AddgroupmeetingsattendanceComponentVar.SELECT_ALL = false;
          this.AddgroupmeetingsattendanceComponentVar.shareWithinPlaceHolder = "Type here to search group(s)";
          let tempTypeIDs = this.meetingDrawerData.TYPE_ID.split(',');
          let tempTypeIDsArray = [];

          for (var i = 0; i < tempTypeIDs.length; i++) {
            tempTypeIDsArray.push(Number(tempTypeIDs[i]));
          }

          this.meetingDrawerData.TYPE_ID = tempTypeIDsArray;
        }
      }

    }, err => {
      this.AddgroupmeetingsattendanceComponentVar.isSpinning = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  deleteMeeting(data: GroupMeetAttendance, meetingType: string = 'G'): void {
    data.IS_DELETED = true;

    if (meetingType == "G") {
      this.isMeetingSpining = true;

    } else if (meetingType == "B") {
      this.isBoardMeetingSpining = true;
    }

    this.api.updategroupMeeting(data).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Meeting Deleted Successfully", "");

        if (meetingType == "G") {
          this.getMeetingData();

        } else if (meetingType == "B") {
          this.getBoardMeetingData();
        }

      } else {
        this.message.error("Failed to Meeting Deletion", "");

        if (meetingType == "G") {
          this.getMeetingData();

        } else if (meetingType == "B") {
          this.getBoardMeetingData();
        }
      }
    });
  }

  meetingDrawerClose(): void {
    this.meetingDrawerVisible = false;

    if (this.meetingType == "G") {
      this.getMeetingData();

    } else if (this.meetingType == "B") {
      this.getBoardMeetingData();
    }
  }

  get meetingDrawerCloseCallback() {
    return this.meetingDrawerClose.bind(this);
  }

  MEETING_ID: number;
  drawerVisibleInvities: boolean = false;
  drawerTitleInvities: string;
  @ViewChild(DrawermapinvitiesComponent, { static: false }) DrawermapinvitiesComponentVar: DrawermapinvitiesComponent;

  mapInvitees(data: any, meetingType: string = 'G'): void {
    this.meetingType = meetingType;
    this.drawerVisibleInvities = true;
    this.drawerTitleInvities = data.MEETING_SUB ? ((data.MEETING_SUB.length > 60) ? ("aaa " + "Map Invitees for " + data.MEETING_SUB.substring(0, 60) + "...") : ("aaa " + "Invitees for " + data.MEETING_SUB)) : "Map Invitees";
    this.MEETING_ID = data["ID"];
    this.DrawermapinvitiesComponentVar.UNIT_ID = [];
    this.DrawermapinvitiesComponentVar.GROUP_ID = [];
    this.DrawermapinvitiesComponentVar.ROLE_ID = [];
    this.DrawermapinvitiesComponentVar.getUnits();
    this.DrawermapinvitiesComponentVar.getGroups([]);
    this.DrawermapinvitiesComponentVar.getMembersPost();
  }

  drawerCloseInvities(): void {
    this.drawerVisibleInvities = false;

    if (this.meetingType == "G") {
      this.getMeetingData();

    } else if (this.meetingType == "B") {
      this.getBoardMeetingData();
    }
  }

  get closeCallbackInvities() {
    return this.drawerCloseInvities.bind(this);
  }

  EVENT_ID: number;
  drawerVisibleEventInvities: boolean = false;
  drawerTitleEventInvities: string;
  @ViewChild(GroupProjectActivityMapInviteesDrawerComponent, { static: false }) GroupProjectActivityMapInviteesDrawerComponentVar: GroupProjectActivityMapInviteesDrawerComponent;

  mapEventInvities(data: GroupActivityMaster): void {
    this.drawerTitleEventInvities = data.EVENT_NAME ? ((data.EVENT_NAME.length > 60) ? ("aaa " + "Invitees for " + data.EVENT_NAME.substring(0, 60) + "...") : ("aaa " + "Invitees for " + data.EVENT_NAME)) : "Map Invitees";
    this.drawerVisibleEventInvities = true;
    this.EVENT_ID = data.ID;
    this.GroupProjectActivityMapInviteesDrawerComponentVar.getIDs();
    this.GroupProjectActivityMapInviteesDrawerComponentVar.UNIT_ID = [];
    this.GroupProjectActivityMapInviteesDrawerComponentVar.GROUP_ID = [];
    this.GroupProjectActivityMapInviteesDrawerComponentVar.ROLE_ID = [];
    this.GroupProjectActivityMapInviteesDrawerComponentVar.getUnits();
    this.GroupProjectActivityMapInviteesDrawerComponentVar.getGroups([]);
    this.GroupProjectActivityMapInviteesDrawerComponentVar.getMembersPost();
  }

  drawerCloseEventInvities(): void {
    this.getEventData();
    this.drawerVisibleEventInvities = false;
  }

  get closeCallbackEventInvities() {
    return this.drawerCloseEventInvities.bind(this);
  }

  @ViewChild(GroupmeetsattendiesmapComponent, { static: false }) GroupmeetsattendiesmapComponentVar: GroupmeetsattendiesmapComponent;
  groupDetails: GroupMeetAttendance;
  markAttendiesDrawerVisible: boolean = false;
  markAttendiesDrawerTitle: string;
  markAttendiesDrawerData: any[] = [];
  markAttendiesDrawerTotalRecords: number;
  markAttendiesDrawerData1: GroupMeetingAttendance = new GroupMeetingAttendance();

  markAttendies(data: any, meetingType: string = 'G'): void {
    this.meetingType = meetingType;
    this.markAttendiesDrawerVisible = true;
    this.markAttendiesDrawerTitle = "Mark Attendies";
    this.GroupmeetsattendiesmapComponentVar.isSpinning = true;
    this.GroupmeetsattendiesmapComponentVar.GLOBAL_P_A = true;
    this.GroupmeetsattendiesmapComponentVar.indeterminate = false;
    this.MEETING_ID = data["ID"];
    this.markAttendiesDrawerData = [];
    this.groupDetails = data;

    this.api.getAllgroupMeetingAttendanceDetails(this.MEETING_ID, this.groupID).subscribe(data => {
      if (data['code'] == '200') {
        this.markAttendiesDrawerTotalRecords = data['count'];
        this.markAttendiesDrawerData = data['data'];
        this.GroupmeetsattendiesmapComponentVar.isSpinning = false;
        this.GroupmeetsattendiesmapComponentVar.calcPresentAbsent(this.markAttendiesDrawerData);
      }

    }, err => {
      this.GroupmeetsattendiesmapComponentVar.isSpinning = false;
      this.GroupmeetsattendiesmapComponentVar.calcPresentAbsent(this.markAttendiesDrawerData);

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  markAttendiesDrawerClose(): void {
    this.markAttendiesDrawerVisible = false;

    if (this.meetingType == "G") {
      this.getMeetingData();

    } else if (this.meetingType == "B") {
      this.getBoardMeetingData();
    }
  }

  get markAttendiesDrawerCloseCallback() {
    return this.markAttendiesDrawerClose.bind(this);
  }

  eventAttendanceDrawerTitle: string;
  eventAttendanceDrawerVisible: boolean = false;
  @ViewChild(GroupProjectActivityAttendanceDrawerComponent, { static: false }) GroupProjectActivityAttendanceDrawerComponentVar: GroupProjectActivityAttendanceDrawerComponent;
  eventDetails: GroupActivityMaster = new GroupActivityMaster();
  eventAttendanceDrawerData: any[] = [];
  eventAttendanceDrawerDataTotalRecords: number;
  eventAttendanceDrawerData1: GroupActivityMaster = new GroupActivityMaster();

  markEventAttendance(data: GroupActivityMaster): void {
    this.eventAttendanceDrawerTitle = data.EVENT_NAME ? ((data.EVENT_NAME.length > 60) ? ("Attendies for " + data.EVENT_NAME.substring(0, 60) + "...") : ("Attendies for " + data.EVENT_NAME)) : "Mark Attendance";
    this.eventAttendanceDrawerVisible = true;
    this.GroupProjectActivityAttendanceDrawerComponentVar.isSpinning = true;
    this.GroupProjectActivityAttendanceDrawerComponentVar.GLOBAL_P_A = true;
    this.GroupProjectActivityAttendanceDrawerComponentVar.indeterminate = false;
    this.EVENT_ID = data.ID;
    this.eventAttendanceDrawerData = [];
    this.eventDetails = data;

    this.api.getAllEventAttendanceDetails(this.EVENT_ID, data.GROUP_ID).subscribe(data => {
      if (data['code'] == 200) {
        this.eventAttendanceDrawerDataTotalRecords = data['count'];
        this.eventAttendanceDrawerData = data['data'];
        this.GroupProjectActivityAttendanceDrawerComponentVar.isSpinning = false;
        this.GroupProjectActivityAttendanceDrawerComponentVar.calcPresentAbsent(this.eventAttendanceDrawerData);
      }

    }, err => {
      this.GroupProjectActivityAttendanceDrawerComponentVar.isSpinning = false;
      this.GroupProjectActivityAttendanceDrawerComponentVar.calcPresentAbsent(this.eventAttendanceDrawerData);

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  eventAttendanceDrawerClose(): void {
    this.getEventData();
    this.eventAttendanceDrawerVisible = false;
  }

  get eventAttendanceCloseCallback() {
    return this.eventAttendanceDrawerClose.bind(this);
  }

  uploadMeetingMinutes(data: any, meetingType: string = 'G'): void {
    this.meetingType = meetingType;
    this.meetingDrawerVisible = true;
    this.meetingDrawerTitle = "aaa " + "Edit Meeting";
    this.AddgroupmeetingsattendanceComponentVar.isSpinning = true;

    this.api.getAllgroupMeeting(0, 0, "", "", " AND ID=" + data["ID"]).subscribe(data => {
      if (data['code'] == 200) {
        this.AddgroupmeetingsattendanceComponentVar.isSpinning = false;
        let meetingData = data['data'][0];
        this.meetingDrawerData = Object.assign({}, meetingData);
        this.meetingDrawerData.FROM_TIME = this.datePipe.transform(new Date(), "yyyy-MM-dd") + " " + this.meetingDrawerData.FROM_TIME;
        this.meetingDrawerData.TO_TIME = this.datePipe.transform(new Date(), "yyyy-MM-dd") + " " + this.meetingDrawerData.TO_TIME;
        this.AddgroupmeetingsattendanceComponentVar.fileURL1 = null;
        this.AddgroupmeetingsattendanceComponentVar.fileURL2 = null;
        this.AddgroupmeetingsattendanceComponentVar.fileURL3 = null;
        this.AddgroupmeetingsattendanceComponentVar.fileURL4 = null;
        this.AddgroupmeetingsattendanceComponentVar.fileURL5 = null;
        this.AddgroupmeetingsattendanceComponentVar.originalFileURL1 = null;
        this.AddgroupmeetingsattendanceComponentVar.originalFileURL2 = null;
        this.AddgroupmeetingsattendanceComponentVar.originalFileURL3 = null;
        this.AddgroupmeetingsattendanceComponentVar.originalFileURL4 = null;
        this.AddgroupmeetingsattendanceComponentVar.originalFileURL5 = null;
        this.AddgroupmeetingsattendanceComponentVar.pdfFileURL1 = null;
        this.AddgroupmeetingsattendanceComponentVar.pdfFileURL2 = null;

        // Meeting images
        if (this.meetingDrawerData.PHOTO1 != " ")
          this.meetingDrawerData.PHOTO1 = this.api.retriveimgUrl + "groupMeeting/" + this.meetingDrawerData.PHOTO1;
        else
          this.meetingDrawerData.PHOTO1 = null;

        if (this.meetingDrawerData.PHOTO2 != " ")
          this.meetingDrawerData.PHOTO2 = this.api.retriveimgUrl + "groupMeeting/" + this.meetingDrawerData.PHOTO2;
        else
          this.meetingDrawerData.PHOTO2 = null;

        if (this.meetingDrawerData.PHOTO3 != " ")
          this.meetingDrawerData.PHOTO3 = this.api.retriveimgUrl + "groupMeeting/" + this.meetingDrawerData.PHOTO3;
        else
          this.meetingDrawerData.PHOTO3 = null;

        if (this.meetingDrawerData.PHOTO4 != " ")
          this.meetingDrawerData.PHOTO4 = this.api.retriveimgUrl + "groupMeeting/" + this.meetingDrawerData.PHOTO4;
        else
          this.meetingDrawerData.PHOTO4 = null;

        if (this.meetingDrawerData.PHOTO5 != " ")
          this.meetingDrawerData.PHOTO5 = this.api.retriveimgUrl + "groupMeeting/" + this.meetingDrawerData.PHOTO5;
        else
          this.meetingDrawerData.PHOTO5 = null;

        if (this.meetingDrawerData.PDF1 != " ")
          this.meetingDrawerData.PDF1 = this.meetingDrawerData.PDF1;
        else
          this.meetingDrawerData.PDF1 = null;

        if (this.meetingDrawerData.PDF2 != " ")
          this.meetingDrawerData.PDF2 = this.meetingDrawerData.PDF2;
        else
          this.meetingDrawerData.PDF2 = null;

        // Drawer Type
        this.AddgroupmeetingsattendanceComponentVar.addDrawer = true;
        this.AddgroupmeetingsattendanceComponentVar.uploadMinutes = true;

        // Meeting Sharing
        if (this.meetingDrawerData.MEETING_TYPE == "P") {
          this.meetingDrawerData.TYPE_ID = undefined;

        } else if (this.meetingDrawerData.MEETING_TYPE == "F") {
          this.AddgroupmeetingsattendanceComponentVar.getFederations();
          this.AddgroupmeetingsattendanceComponentVar.SELECT_ALL = false;
          this.AddgroupmeetingsattendanceComponentVar.shareWithinPlaceHolder = "Type here to search federation(s)";

          let tempTypeIDs = this.meetingDrawerData.TYPE_ID.split(',');
          let tempTypeIDsArray = [];

          for (var i = 0; i < tempTypeIDs.length; i++) {
            tempTypeIDsArray.push(Number(tempTypeIDs[i]));
          }

          this.meetingDrawerData.TYPE_ID = tempTypeIDsArray;

        } else if (this.meetingDrawerData.MEETING_TYPE == "U") {
          this.AddgroupmeetingsattendanceComponentVar.getUnits();
          this.AddgroupmeetingsattendanceComponentVar.SELECT_ALL = false;
          this.AddgroupmeetingsattendanceComponentVar.shareWithinPlaceHolder = "Type here to search unit(s)";
          let tempTypeIDs = this.meetingDrawerData.TYPE_ID.split(',');
          let tempTypeIDsArray = [];

          for (var i = 0; i < tempTypeIDs.length; i++) {
            tempTypeIDsArray.push(Number(tempTypeIDs[i]));
          }

          this.meetingDrawerData.TYPE_ID = tempTypeIDsArray;

        } else if (this.meetingDrawerData.MEETING_TYPE == "G") {
          this.AddgroupmeetingsattendanceComponentVar.getFilteredGroups();
          this.AddgroupmeetingsattendanceComponentVar.SELECT_ALL = false;
          this.AddgroupmeetingsattendanceComponentVar.shareWithinPlaceHolder = "Type here to search group(s)";
          let tempTypeIDs = this.meetingDrawerData.TYPE_ID.split(',');
          let tempTypeIDsArray = [];

          for (var i = 0; i < tempTypeIDs.length; i++) {
            tempTypeIDsArray.push(Number(tempTypeIDs[i]));
          }

          this.meetingDrawerData.TYPE_ID = tempTypeIDsArray;
        }
      }

    }, err => {
      this.AddgroupmeetingsattendanceComponentVar.isSpinning = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  DRAWN_ON_DATE: Date;
  tempDates: any[] = [];

  addDrawnOnDates(): void {
    if ((this.DRAWN_ON_DATE != undefined) && (this.DRAWN_ON_DATE != null)) {
      this.tempDates.push(this.datePipe.transform(this.DRAWN_ON_DATE, "dd MMM yy"));
      this.tempDates = [...new Set(this.tempDates)];
      this.data.DRAWN_ON = this.tempDates;
      this.DRAWN_ON_DATE = null;
    }
  }

  removeFromDates(dates: any): void {
    this.tempDates = dates;
  }

  getTimeInAM_PM(time: any): string {
    return this.datePipe.transform(new Date(), "yyyy-MM-dd" + " " + time);
  }

  cancel(): void { }

  @ViewChild(AddpaymentComponent, { static: false }) AddpaymentComponentVar: AddpaymentComponent;

  addpayment(): void {
    this.AddpaymentComponentVar.groupIDForPayment = this.groupID;
    this.drawerTitle = "aaa " + "Add New Payment";
    this.drawerData = new PaymentCollection();
    this.sum = 0;
    this.drawerPaymentVisible = true;
    this.drawerData.DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.AddpaymentComponentVar.PAYMENT_MODE_TYPE = "ONL";
    this.AddpaymentComponentVar.fileURL = null;
    this.drawerData.CHILD_GROUP_AMOUNT = 0;
    this.drawerData.AMOUNT = 0;
    this.AddpaymentComponentVar.CHILD_PARENT_GROUP_AMOUNT = 0;
    this.AddpaymentComponentVar.fileURLToDisplay = "";
    this.AddpaymentComponentVar.displayUploadFile = false;

    // Get Child Group
    this.AddpaymentComponentVar.getChildGroups(this.groupID);
  }

  drawerPaymentClose(): void {
    this.loadPaymentData();
    this.drawerPaymentVisible = false;
  }

  get closeCallback() {
    return this.drawerPaymentClose.bind(this);
  }

  federations: any[] = [];

  getFederations(): void {
    this.federations = [];

    this.api.getAllFederations(0, 0, "NAME", "asc", " AND STATUS=1").subscribe(data => {
      if (data['code'] == 200) {
        this.federations = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  units: any[] = [];

  getUnits(unitName: string): void {
    if (unitName.length >= 3) {
      this.api.getAllUnits(0, 0, "NAME", "asc", " AND STATUS=1 AND NAME LIKE '%" + unitName + "%'").subscribe(data => {
        if (data['code'] == 200) {
          this.units = data['data'];
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  groups: any[] = [];

  getGroups(groupName: string): void {
    if (groupName.length >= 3) {
      this.api.getAllGroups(0, 0, "NAME", "asc", " AND STATUS=1 AND NAME LIKE '%" + groupName + "%'").subscribe(data => {
        if (data['code'] == 200) {
          this.groups = data['data'];
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  @Input() groupPaymentData: any[] = [];

  loadPaymentData(): void {
    this.loadingPaymentRecords = true;
    this.groupPaymentData = [];

    this.api.getAllMembershipPayment(0, 0, "", "", ' AND GROUP_ID=' + this.groupID + ' AND MONTH(DATE)=' + this.data.MONTH + ' AND YEAR(DATE)=' + this.data.YEAR).subscribe(data => {
      if (data['code'] == 200) {
        this.loadingPaymentRecords = false;
        this.groupPaymentData = data['data'];
      }

    }, err => {
      this.loadingPaymentRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getPaymentMode(mode: string): string {
    if (mode == "ONL") {
      return "Online";

    } else if (mode == "OFFL") {
      return "Offline";
    }
  }

  showPayment(): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/allpaymentreceipts', { group: this.groupID }]);
    });
  }

  getStatus(status: string): string {
    if (status == "D") {
      return "In Draft Mode";

    } else if (status == "P") {
      return "Published";
    }
  }

  isViewAttendanceSpinning: boolean = false;
  drawerAttendanciesVisible: boolean = false;
  drawerAttendanciesTitle: string;
  meetingTotalRecords: number;
  meetingTotalCount: number;
  meetingPresentCount: number;
  meetingAbsentCount: number;
  attendanceData: any[] = [];

  viewAttendancies(data1: GroupMeetAttendance): void {
    this.drawerAttendanciesTitle = "Attendies for " + data1.MEETING_SUB.substring(0, 60);
    this.drawerAttendanciesVisible = true;
    this.meetingTotalCount = 0;
    this.meetingPresentCount = 0
    this.meetingAbsentCount = 0;
    this.isViewAttendanceSpinning = true;

    this.api.getAllgroupMeetingAttendancy(data1.ID).subscribe(data => {
      if (data['code'] == 200) {
        this.isViewAttendanceSpinning = false;
        this.meetingTotalRecords = data['count'];
        this.attendanceData = data['data'];

        let presentCount = 0;
        let absentCount = 0;

        this.attendanceData.filter(obj1 => {
          if (obj1["P_A"] == 1) {
            presentCount += 1;
          }

          if (obj1["P_A"] == 0) {
            absentCount += 1;
          }
        });

        this.meetingTotalCount = this.meetingTotalRecords;
        this.meetingPresentCount = presentCount;
        this.meetingAbsentCount = absentCount;

      } else {
        this.isViewAttendanceSpinning = false;
      }

    }, err => {
      this.isViewAttendanceSpinning = false;

      if (err['ok'] == false) {
        this.message.error("Server Not Found", "");
      }
    });
  }

  drawerAttendanciesClose(): void {
    this.drawerAttendanciesVisible = false;
  }

  get closeAttendanciesCallback() {
    return this.drawerAttendanciesClose.bind(this);
  }

  drawerEventAttendanciesTitle: string;
  drawerEventAttendanciesVisible: boolean = false;
  isEventViewAttendanceSpinning: boolean = false;
  eventTotalCount: number;
  eventPresentCount: number;
  eventAbsentCount: number;
  viewEventAttendanceTotalRecords: number = 1;
  eventAttendanceData: any[] = [];

  viewEventAttendance(data: GroupActivityMaster): void {
    this.drawerEventAttendanciesTitle = ((data.EVENT_NAME.length > 60) ? ("Attendies for " + data.EVENT_NAME.substring(0, 60) + "...") : ("Attendies for " + data.EVENT_NAME));
    this.drawerEventAttendanciesVisible = true;
    this.eventTotalCount = 0;
    this.eventPresentCount = 0
    this.eventAbsentCount = 0;
    this.isEventViewAttendanceSpinning = true;

    this.api.getEventAttendanceData(data.ID).subscribe(data => {
      if (data['code'] == 200) {
        this.isEventViewAttendanceSpinning = false;
        this.viewEventAttendanceTotalRecords = data['count'];
        this.eventAttendanceData = data['data'];

        let presentCount = 0;
        let absentCount = 0;

        this.eventAttendanceData.filter(obj1 => {
          if (obj1["P_A"] == 1) {
            presentCount += 1;
          }

          if (obj1["P_A"] == 0) {
            absentCount += 1;
          }
        });

        this.meetingTotalCount = this.viewEventAttendanceTotalRecords;
        this.meetingPresentCount = presentCount;
        this.meetingAbsentCount = absentCount;

      } else {
        this.isEventViewAttendanceSpinning = false;
      }

    }, err => {
      this.isEventViewAttendanceSpinning = false;

      if (err['ok'] == false) {
        this.message.error("Server Not Found", "");
      }
    });
  }

  drawerEventAttendanciesClose(): void {
    this.drawerEventAttendanciesVisible = false;
  }

  get closeEventAttendanciesCallback() {
    return this.drawerEventAttendanciesClose.bind(this);
  }

  getwidth(): number {
    if (window.innerWidth <= 400) {
      return 380;

    } else {
      return 800;
    }
  }

  publishBoardMeeting(meetingData: GroupMeetAttendance): void {
    this.isBoardMeetingSpining = true;
    meetingData.STATUS = "P";

    this.api.updategroupMeeting(meetingData).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Board Meeting Published Successfully", "");
        this.getBoardMeetingData();

      } else {
        this.message.error("Failed to Publish Board Meeting", "");
        this.getBoardMeetingData();
      }
    });
  }

  publishGroupMemberMeeting(meetingData: GroupMeetAttendance): void {
    this.isMeetingSpining = true;
    meetingData.STATUS = "P";

    this.api.updategroupMeeting(meetingData).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Group Members Meeting Published Successfully", "");
        this.getMeetingData();

      } else {
        this.message.error("Failed to Publish Group Members Meeting", "");
        this.getMeetingData();
      }
    });
  }

  publishProject(projectData: GroupProjectMaster): void {
    this.isProjectSpining = true;
    projectData.STATUS = "P";

    this.api.updategroupProjects(projectData).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Project Published Successfully", "");
        this.getProjectData();

      } else {
        this.message.error("Failed to Project Publish", "");
        this.getProjectData();
      }
    });
  }

  publishEvent(eventData: GroupActivityMaster): void {
    this.isEvenSpining = true;
    eventData.STATUS = "P";

    this.api.updateGroupActivity(eventData).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Event Published Successfully", "");
        this.getEventData();

      } else {
        this.message.error("Failed to Publish Event", "");
        this.getEventData();
      }
    });
  }

  GIANTS_WEEK_START_DATE: Date = null;
  GIANTS_WEEK_END_DATE: Date = null;

  getGlobalSettingData(): void {
    this.GIANTS_WEEK_START_DATE = null;
    this.GIANTS_WEEK_END_DATE = null;

    this.api.getGlobalSettingData(0, 0, "", "", "").subscribe(data => {
      if (data['code'] == 200) {
        this.GIANTS_WEEK_START_DATE = new Date(new Date().getFullYear(), Number(data['data'][0]["GIANTS_WEEK_CELEBRATION_START_DATE"].split("-")[1]) - 1, Number(data['data'][0]["GIANTS_WEEK_CELEBRATION_START_DATE"].split("-")[2]));
        this.GIANTS_WEEK_END_DATE = new Date(new Date().getFullYear(), Number(data['data'][0]["GIANTS_WEEK_CELEBRATION_END_DATE"].split("-")[1]) - 1, Number(data['data'][0]["GIANTS_WEEK_CELEBRATION_END_DATE"].split("-")[2]));
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  meetingPreviewModalVisible: boolean = false;
  meetingPreviewModalData: GroupMeetAttendance = new GroupMeetAttendance();

  meetingPreviewModalOpen(data: GroupMeetAttendance): void {
    this.meetingPreviewModalVisible = true;
    this.meetingPreviewModalData = new GroupMeetAttendance();
    this.meetingPreviewModalData.PHOTO1 = null;
    this.meetingPreviewModalData.PHOTO2 = null;
    this.meetingPreviewModalData.PHOTO3 = null;
    this.meetingPreviewModalData.PHOTO4 = null;
    this.meetingPreviewModalData.PHOTO5 = null;
    this.meetingPreviewModalData = Object.assign({}, data);

    // Existing meeting images
    if (this.meetingPreviewModalData.PHOTO1 != " ") {
      this.meetingPreviewModalData.PHOTO1 = this.api.retriveimgUrl + "groupMeeting/" + this.meetingPreviewModalData.PHOTO1;

    } else {
      this.meetingPreviewModalData.PHOTO1 = null;
    }

    if (this.meetingPreviewModalData.PHOTO2 != " ") {
      this.meetingPreviewModalData.PHOTO2 = this.api.retriveimgUrl + "groupMeeting/" + this.meetingPreviewModalData.PHOTO2;

    } else {
      this.meetingPreviewModalData.PHOTO2 = null;
    }

    if (this.meetingPreviewModalData.PHOTO3 != " ") {
      this.meetingPreviewModalData.PHOTO3 = this.api.retriveimgUrl + "groupMeeting/" + this.meetingPreviewModalData.PHOTO3;

    } else {
      this.meetingPreviewModalData.PHOTO3 = null;
    }

    if (this.meetingPreviewModalData.PHOTO4 != " ") {
      this.meetingPreviewModalData.PHOTO4 = this.api.retriveimgUrl + "groupMeeting/" + this.meetingPreviewModalData.PHOTO4;

    } else {
      this.meetingPreviewModalData.PHOTO4 = null;
    }

    if (this.meetingPreviewModalData.PHOTO5 != " ") {
      this.meetingPreviewModalData.PHOTO5 = this.api.retriveimgUrl + "groupMeeting/" + this.meetingPreviewModalData.PHOTO5;

    } else {
      this.meetingPreviewModalData.PHOTO5 = null;
    }
  }

  meetingPreviewModalCancel(): void {
    this.meetingPreviewModalVisible = false;
  }

  getMeetingImageCount(photoURL1: string, photoURL2: string, photoURL3: string, photoURL4: string, photoURL5: string): number {
    let count: number = 0;
    photoURL1 = photoURL1 ? photoURL1 : "";
    photoURL2 = photoURL2 ? photoURL2 : "";
    photoURL3 = photoURL3 ? photoURL3 : "";
    photoURL4 = photoURL4 ? photoURL4 : "";
    photoURL5 = photoURL5 ? photoURL5 : "";

    if (photoURL1.trim() != "")
      count = count + 1;

    if (photoURL2.trim() != "")
      count = count + 1;

    if (photoURL3.trim() != "")
      count = count + 1;

    if (photoURL4.trim() != "")
      count = count + 1;

    if (photoURL5.trim() != "")
      count = count + 1;

    return count;
  }

  projectPreviewModalVisible: boolean = false;
  projectPreviewModalData: GroupProjectMaster = new GroupProjectMaster();

  projectPreviewModalOpen(data: GroupProjectMaster): void {
    this.projectPreviewModalVisible = true;
    this.projectPreviewModalData = new GroupProjectMaster();
    this.projectPreviewModalData.PHOTO1 = null;
    this.projectPreviewModalData.PHOTO2 = null;
    this.projectPreviewModalData.PHOTO3 = null;
    this.projectPreviewModalData = Object.assign({}, data);

    // Existing project images
    if (this.projectPreviewModalData.PHOTO1 != " ") {
      this.projectPreviewModalData.PHOTO1 = this.api.retriveimgUrl + "groupProjectPhotos/" + this.projectPreviewModalData.PHOTO1;

    } else {
      this.projectPreviewModalData.PHOTO1 = null;
    }

    if (this.projectPreviewModalData.PHOTO2 != " ") {
      this.projectPreviewModalData.PHOTO2 = this.api.retriveimgUrl + "groupProjectPhotos/" + this.projectPreviewModalData.PHOTO2;

    } else {
      this.projectPreviewModalData.PHOTO2 = null;
    }

    if (this.projectPreviewModalData.PHOTO3 != " ") {
      this.projectPreviewModalData.PHOTO3 = this.api.retriveimgUrl + "groupProjectPhotos/" + this.projectPreviewModalData.PHOTO3;

    } else {
      this.projectPreviewModalData.PHOTO3 = null;
    }
  }

  projectPreviewModalCancel(): void {
    this.projectPreviewModalVisible = false;
  }

  getProjectImageCount(photoURL1: string, photoURL2: string, photoURL3: string): number {
    let count: number = 0;
    photoURL1 = photoURL1 ? photoURL1 : "";
    photoURL2 = photoURL2 ? photoURL2 : "";
    photoURL3 = photoURL3 ? photoURL3 : "";

    if (photoURL1.trim() != "")
      count = count + 1;

    if (photoURL2.trim() != "")
      count = count + 1;

    if (photoURL3.trim() != "")
      count = count + 1;

    return count;
  }

  getProjectCompleteStatus(status: string): string {
    if (status == "P") {
      return "Upcoming";

    } else if (status == "S") {
      return "In Progress";

    } else if (status == "H") {
      return "On Hold";

    } else if (status == "C") {
      return "Completed";
    }
  }

  eventPreviewModalVisible: boolean = false;
  eventPreviewModalData: GroupActivityMaster = new GroupActivityMaster();

  eventPreviewModalOpen(data: GroupActivityMaster): void {
    this.eventPreviewModalVisible = true;
    this.eventPreviewModalData = new GroupActivityMaster();
    this.eventPreviewModalData.PHOTO1 = null;
    this.eventPreviewModalData.PHOTO2 = null;
    this.eventPreviewModalData.PHOTO3 = null;
    this.eventPreviewModalData.PHOTO4 = null;
    this.eventPreviewModalData.PHOTO5 = null;
    this.eventPreviewModalData = Object.assign({}, data);

    // Existing event images
    if (this.eventPreviewModalData.PHOTO1 != " ") {
      this.eventPreviewModalData.PHOTO1 = this.api.retriveimgUrl + "groupActivity/" + this.eventPreviewModalData.PHOTO1;

    } else {
      this.eventPreviewModalData.PHOTO1 = null;
    }

    if (this.eventPreviewModalData.PHOTO2 != " ") {
      this.eventPreviewModalData.PHOTO2 = this.api.retriveimgUrl + "groupActivity/" + this.eventPreviewModalData.PHOTO2;

    } else {
      this.eventPreviewModalData.PHOTO2 = null;
    }

    if (this.eventPreviewModalData.PHOTO3 != " ") {
      this.eventPreviewModalData.PHOTO3 = this.api.retriveimgUrl + "groupActivity/" + this.eventPreviewModalData.PHOTO3;

    } else {
      this.eventPreviewModalData.PHOTO3 = null;
    }

    if (this.eventPreviewModalData.PHOTO4 != " ") {
      this.eventPreviewModalData.PHOTO4 = this.api.retriveimgUrl + "groupActivity/" + this.eventPreviewModalData.PHOTO4;

    } else {
      this.eventPreviewModalData.PHOTO4 = null;
    }

    if (this.eventPreviewModalData.PHOTO5 != " ") {
      this.eventPreviewModalData.PHOTO5 = this.api.retriveimgUrl + "groupActivity/" + this.eventPreviewModalData.PHOTO5;

    } else {
      this.eventPreviewModalData.PHOTO5 = null;
    }
  }

  eventPreviewModalCancel(): void {
    this.eventPreviewModalVisible = false;
  }

  getEventImageCount(photoURL1: string, photoURL2: string, photoURL3: string, photoURL4: string, photoURL5: string): number {
    let count: number = 0;
    photoURL1 = photoURL1 ? photoURL1 : "";
    photoURL2 = photoURL2 ? photoURL2 : "";
    photoURL3 = photoURL3 ? photoURL3 : "";
    photoURL4 = photoURL4 ? photoURL4 : "";
    photoURL5 = photoURL5 ? photoURL5 : "";

    if (photoURL1.trim() != "")
      count = count + 1;

    if (photoURL2.trim() != "")
      count = count + 1;

    if (photoURL3.trim() != "")
      count = count + 1;

    if (photoURL4.trim() != "")
      count = count + 1;

    if (photoURL5.trim() != "")
      count = count + 1;

    return count;
  }

  getTime(time: any): string {
    return this.datePipe.transform(new Date(), 'yyyyMMdd') + 'T' + time;
  }
}
