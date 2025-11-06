import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { MonthlyReportSubmission } from 'src/app/Models/MonthlyReportSubmission';
import { ApiService } from 'src/app/Service/api.service';
import { DrawermonthlyreportsubmissionComponent } from '../drawermonthlyreportsubmission/drawermonthlyreportsubmission.component';
import { MonthlyGroupReport } from 'src/app/Models/MonthlyGroupReport';
import { DatePipe } from '@angular/common';
import { SendMonthlyReportComponent } from '../send-monthly-report/send-monthly-report.component';
import { DomSanitizer } from "@angular/platform-browser";
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-monthly-report-submission',
  templateUrl: './monthly-report-submission.component.html',
  styleUrls: ['./monthly-report-submission.component.css']
})

export class MonthlyReportSubmissionComponent implements OnInit {
  formTitle: string = "Group Monthly Reporting";
  currentMonth: number = new Date().getMonth() + 1;
  currentYear: number = new Date().getFullYear();

  janTileStatus: boolean = false;
  febTileStatus: boolean = false;
  marchTileStatus: boolean = false;
  aprilTileStatus: boolean = false;
  mayTileStatus: boolean = false;
  juneTileStatus: boolean = false;
  julTileStatus: boolean = false;
  augTileStatus: boolean = false;
  septTileStatus: boolean = false;
  octTileStatus: boolean = false;
  novTileStatus: boolean = false;
  decTileStatus: boolean = false;

  janTileViewBtnStatus: boolean = false;
  febTileViewBtnStatus: boolean = false;
  marchTileViewBtnStatus: boolean = false;
  aprilTileViewBtnStatus: boolean = false;
  mayTileViewBtnStatus: boolean = false;
  juneTileViewBtnStatus: boolean = false;
  julTileViewBtnStatus: boolean = false;
  augTileViewBtnStatus: boolean = false;
  septTileViewBtnStatus: boolean = false;
  octTileViewBtnStatus: boolean = false;
  novTileViewBtnStatus: boolean = false;
  decTileViewBtnStatus: boolean = false;

  janTileViewPDF: string = "";
  febTileViewPDF: string = "";
  marchTileViewPDF: string = "";
  aprilTileViewPDF: string = "";
  mayTileViewPDF: string = "";
  juneTileViewPDF: string = "";
  julTileViewPDF: string = "";
  augTileViewPDF: string = "";
  septTileViewPDF: string = "";
  octTileViewPDF: string = "";
  novTileViewPDF: string = "";
  decTileViewPDF: string = "";

  reportGroupName: string;
  reportAdminName: string;
  isVisible: boolean = false;
  isLoading: boolean = false;

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  homeFederationID: number = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
  homeUnitID: number = Number(sessionStorage.getItem("HOME_UNIT_ID"));
  homeGroupID: number = Number(sessionStorage.getItem("HOME_GROUP_ID"));

  monthlyReportingTitle: string = sessionStorage.getItem("HOME_FEDERATION_NAME");
  roleID: number = this.api.roleId;
  userID: number = this.api.userId;
  imgurl: string = this.api.retriveimgUrl;
  submissionData: MonthlyReportSubmission = new MonthlyReportSubmission();
  drawerVisible: boolean = false;
  drawerTitle: string;
  drawerData: MonthlyGroupReport = new MonthlyGroupReport();
  isReportLoading: boolean = false;
  monthlyGroupData: MonthlyGroupReport = new MonthlyGroupReport();
  selectedMonth: number;
  RETRIVE_IMAGE_URL: string = this.api.retriveimgUrl;
  loadingRecords: boolean = false;
  sortKey: string = "id";
  sortValue: string = "desc";
  searchText: string = "";
  filterQuery: string = "";
  columns: string[][] = [];
  totalRecords: number = 1;
  isSpinning: boolean = false;
  pageIndex: number = 1;
  pageSize: number = 10;

  constructor(
    private message: NzNotificationService,
    private api: ApiService,
    private _cookie: CookieService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getGroups();
    this.showHideMonthTiles();
    this.getSubmissionData();
  }

  getSubmissionData(): void {
    this.isLoading = true;

    this.api
      .getMonthlyGroupReport(0, 0, 'ID', 'asc', ' AND GROUP_ID = ' + this.groupID)
      .subscribe(data => {
        if (data['code'] == 200) {
          this.isLoading = false;
          let reportData = data['data'];

          // Jan
          let tempJan = reportData.filter((item: any) => {
            return (item["MONTH"] == 1) && (item["YEAR"] == this.currentYear) && (item["IS_SUBMITTED"] == "S");
          });

          if (tempJan.length > 0) {
            this.janTileViewBtnStatus = true;
            this.janTileViewPDF = (tempJan[0]["ATTECHMENT_FILE"] && tempJan[0]["ATTECHMENT_FILE"].trim() != '') ? tempJan[0]["ATTECHMENT_FILE"] : '';
          }

          // Feb
          let tempFeb = reportData.filter((item: any) => {
            return (item["MONTH"] == 2) && (item["YEAR"] == this.currentYear) && (item["IS_SUBMITTED"] == "S");
          });

          if (tempFeb.length > 0) {
            this.febTileViewBtnStatus = true;
            this.febTileViewPDF = (tempFeb[0]["ATTECHMENT_FILE"] && tempFeb[0]["ATTECHMENT_FILE"].trim() != '') ? tempFeb[0]["ATTECHMENT_FILE"] : '';
          }

          // Mar
          let tempMarch = reportData.filter((item: any) => {
            return (item["MONTH"] == 3) && (item["YEAR"] == this.currentYear) && (item["IS_SUBMITTED"] == "S");
          });

          if (tempMarch.length > 0) {
            this.marchTileViewBtnStatus = true;
            this.marchTileViewPDF = (tempMarch[0]["ATTECHMENT_FILE"] && tempMarch[0]["ATTECHMENT_FILE"].trim() != '') ? tempMarch[0]["ATTECHMENT_FILE"] : '';
          }

          // Apr
          let tempApril = reportData.filter((item: any) => {
            return (item["MONTH"] == 4) && (item["YEAR"] == this.currentYear) && (item["IS_SUBMITTED"] == "S");
          });

          if (tempApril.length > 0) {
            this.aprilTileViewBtnStatus = true;
            this.aprilTileViewPDF = (tempApril[0]["ATTECHMENT_FILE"] && tempApril[0]["ATTECHMENT_FILE"].trim() != '') ? tempApril[0]["ATTECHMENT_FILE"] : '';
          }

          // May
          let tempMay = reportData.filter((item: any) => {
            return (item["MONTH"] == 5) && (item["YEAR"] == this.currentYear) && (item["IS_SUBMITTED"] == "S");
          });

          if (tempMay.length > 0) {
            this.mayTileViewBtnStatus = true;
            this.mayTileViewPDF = (tempMay[0]["ATTECHMENT_FILE"] && tempMay[0]["ATTECHMENT_FILE"].trim() != '') ? tempMay[0]["ATTECHMENT_FILE"] : '';
          }

          // Jun
          let tempJune = reportData.filter((item: any) => {
            return (item["MONTH"] == 6) && (item["YEAR"] == this.currentYear) && (item["IS_SUBMITTED"] == "S");
          });

          if (tempJune.length > 0) {
            this.juneTileViewBtnStatus = true;
            this.juneTileViewPDF = (tempJune[0]["ATTECHMENT_FILE"] && tempJune[0]["ATTECHMENT_FILE"].trim() != '') ? tempJune[0]["ATTECHMENT_FILE"] : '';
          }

          // Jul
          let tempJul = reportData.filter((item: any) => {
            return (item["MONTH"] == 7) && (item["YEAR"] == this.currentYear) && (item["IS_SUBMITTED"] == "S");
          });

          if (tempJul.length > 0) {
            this.julTileViewBtnStatus = true;
            this.julTileViewPDF = (tempJul[0]["ATTECHMENT_FILE"] && tempJul[0]["ATTECHMENT_FILE"].trim() != '') ? tempJul[0]["ATTECHMENT_FILE"] : '';
          }

          // Aug
          let tempAug = reportData.filter((item: any) => {
            return (item["MONTH"] == 8) && (item["YEAR"] == this.currentYear) && (item["IS_SUBMITTED"] == "S");
          });

          if (tempAug.length > 0) {
            this.augTileViewBtnStatus = true;
            this.augTileViewPDF = (tempAug[0]["ATTECHMENT_FILE"] && tempAug[0]["ATTECHMENT_FILE"].trim() != '') ? tempAug[0]["ATTECHMENT_FILE"] : '';
          }

          // Sept
          let tempSept = reportData.filter((item: any) => {
            return (item["MONTH"] == 9) && (item["YEAR"] == this.currentYear) && (item["IS_SUBMITTED"] == "S");
          });

          if (tempSept.length > 0) {
            this.septTileViewBtnStatus = true;
            this.septTileViewPDF = (tempSept[0]["ATTECHMENT_FILE"] && tempSept[0]["ATTECHMENT_FILE"].trim() != '') ? tempSept[0]["ATTECHMENT_FILE"] : '';
          }

          // Oct
          let tempOct = reportData.filter((item: any) => {
            return (item["MONTH"] == 10) && (item["YEAR"] == this.currentYear) && (item["IS_SUBMITTED"] == "S");
          });

          if (tempOct.length > 0) {
            this.octTileViewBtnStatus = true;
            this.octTileViewPDF = (tempOct[0]["ATTECHMENT_FILE"] && tempOct[0]["ATTECHMENT_FILE"].trim() != '') ? tempOct[0]["ATTECHMENT_FILE"] : '';
          }

          // Nov
          let tempNov = reportData.filter((item: any) => {
            return (item["MONTH"] == 11) && (item["YEAR"] == this.currentYear) && (item["IS_SUBMITTED"] == "S");
          });

          if (tempNov.length > 0) {
            this.novTileViewBtnStatus = true;
            this.novTileViewPDF = (tempNov[0]["ATTECHMENT_FILE"] && tempNov[0]["ATTECHMENT_FILE"].trim() != '') ? tempNov[0]["ATTECHMENT_FILE"] : '';
          }

          // Dec
          let tempDec = reportData.filter((item: any) => {
            return (item["MONTH"] == 12) && (item["YEAR"] == this.currentYear) && (item["IS_SUBMITTED"] == "S");
          });

          if (tempDec.length > 0) {
            this.decTileViewBtnStatus = true;
            this.decTileViewPDF = (tempDec[0]["ATTECHMENT_FILE"] && tempDec[0]["ATTECHMENT_FILE"].trim() != '') ? tempDec[0]["ATTECHMENT_FILE"] : '';
          }

        } else {
          this.isLoading = false;
        }

      }, err => {
        this.isLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  groups: any[] = [];

  getGroups(): void {
    this.groups = [];

    this.api
      .getAllGroups(0, 0, "NAME", "asc", " AND ID = " + this.groupID)
      .subscribe(data => {
        if (data['code'] == 200) {
          this.groups = data['data'];
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  modalHeader: string = "";
  reportHeader: string = "";
  printBtnStatus: boolean = false;
  submissionMonth: number;
  submissionYear: number;
  AddedMembersMonthData: any[] = [];
  droppedMembersMonthData: any[] = [];
  ProjectsOfTheMonthData: any[] = [];
  EventsOfTheMonthData: any[] = [];
  MeetingsOfTheMonthData: any[] = [];
  boardMeetingsOfTheMonthData: any[] = [];
  groupPaymentData: any[] = [];
  @ViewChild(DrawermonthlyreportsubmissionComponent, { static: false }) drawermonthlyreportsubmissionComponentvar: DrawermonthlyreportsubmissionComponent;
  monthlyReportRecord: number = 0;

  submitMonthlyReport(month: string, btnValue: boolean, submissionMonth: number): void {
    this.isLoading = true;
    this.printBtnStatus = btnValue;
    this.reportGroupName = this.getGroupName(this.groupID);
    this.drawermonthlyreportsubmissionComponentvar.getIDs();
    let tempCurrentYear = this.currentYear;

    if ((month == "January") || (month == "February") || (month == "March")) {
      tempCurrentYear = tempCurrentYear;

    } else {
      tempCurrentYear = tempCurrentYear;
    }

    this.submissionMonth = submissionMonth;
    this.submissionYear = tempCurrentYear;
    this.modalHeader = "Monthly Reporting of " + month + " " + tempCurrentYear;
    this.drawerTitle = "Monthly Reporting of " + month + " " + tempCurrentYear;

    if (submissionMonth == 1) {
      this.monthDay = 31;

    } else if (submissionMonth == 2) {
      this.monthDay = 28;

    } else if (submissionMonth == 3) {
      this.monthDay = 31;

    } else if (submissionMonth == 4) {
      this.monthDay = 30;

    } else if (submissionMonth == 5) {
      this.monthDay = 31;

    } else if (submissionMonth == 6) {
      this.monthDay = 30;

    } else if (submissionMonth == 7) {
      this.monthDay = 31;

    } else if (submissionMonth == 8) {
      this.monthDay = 31;

    } else if (submissionMonth == 9) {
      this.monthDay = 30;

    } else if (submissionMonth == 10) {
      this.monthDay = 31;

    } else if (submissionMonth == 11) {
      this.monthDay = 30;

    } else if (submissionMonth == 12) {
      this.monthDay = 31;
    }

    this.AddedMembersMonthData = [];
    this.droppedMembersMonthData = [];
    this.ProjectsOfTheMonthData = [];
    this.EventsOfTheMonthData = [];
    this.MeetingsOfTheMonthData = [];
    this.boardMeetingsOfTheMonthData = [];
    this.groupPaymentData = [];

    this.api
      .getMonthlyGroupReport(0, 0, 'ID', 'asc', ' AND MONTH = ' + submissionMonth + ' AND YEAR = ' + tempCurrentYear + ' AND GROUP_ID = ' + this.groupID)
      .subscribe(data => {
        if (data['code'] == 200) {
          this.isLoading = false;

          if (data['count'] == 0) {
            this.monthlyReportRecord = 0;

          } else {
            this.monthlyReportRecord = 1;
          }

          if (this.monthlyReportRecord == 1) {
            this.drawerVisible = true;
            this.drawerTitle = "Update Monthly Report of " + month + " " + tempCurrentYear;
            this.drawerData = Object.assign({}, data['data'][0]);
            this.drawerData["DRAWN_ON"] = data['data'][0]["DRAWN_ON"].split(',');
            this.drawermonthlyreportsubmissionComponentvar.tempDates = data['data'][0]["DRAWN_ON"].split(',');

            // Added members
            let adddedMemberFromDate: string = this.datePipe.transform(new Date(this.submissionYear, this.submissionMonth - 1, 1), "yyyy-MM-dd");
            let findDaysInMonth: number = new Date(this.submissionYear, this.submissionMonth, 0).getDate();
            let adddedMemberToDate: string = this.datePipe.transform(new Date(this.submissionYear, this.submissionMonth - 1, findDaysInMonth), "yyyy-MM-dd");
            this.drawermonthlyreportsubmissionComponentvar.isMemberLoading = true;
            this.AddedMembersMonthData = [];

            this.api
              .AddedMemberList(0, 0, 'NAME', 'asc', " AND GROUP_ID = " + this.groupID + " AND MEMBERSHIP_DATE BETWEEN '" + adddedMemberFromDate + "' AND '" + adddedMemberToDate + "'")
              .subscribe(addedMemberData => {
                if (addedMemberData['code'] == 200) {
                  this.drawermonthlyreportsubmissionComponentvar.isMemberLoading = false;
                  this.AddedMembersMonthData = addedMemberData['data'];
                }

              }, err => {
                this.drawermonthlyreportsubmissionComponentvar.isMemberLoading = false;

                if (err['ok'] == false)
                  this.message.error("Server Not Found", "");
              });

            // Dropped members
            this.droppedMembersMonthData = [];
            this.drawermonthlyreportsubmissionComponentvar.isDroppedMemberLoading = true;

            this.api
              .AddedMemberList(0, 0, 'NAME', 'asc', " AND GROUP_ID = " + this.groupID + " AND DROPPED_STATUS=1 AND DROPPED_DATE BETWEEN '" + adddedMemberFromDate + "' AND '" + adddedMemberToDate + "'")
              .subscribe(droppedMemberData => {
                if (droppedMemberData['code'] == 200) {
                  this.drawermonthlyreportsubmissionComponentvar.isDroppedMemberLoading = false;
                  this.droppedMembersMonthData = droppedMemberData['data'];
                }

              }, err => {
                this.drawermonthlyreportsubmissionComponentvar.isDroppedMemberLoading = false;

                if (err['ok'] == false)
                  this.message.error("Server Not Found", "");
              });

            // Projects
            this.ProjectsOfTheMonthData = [];
            this.drawermonthlyreportsubmissionComponentvar.isProjectSpining = true;

            this.api
              .getAllgroupProjects(0, 0, 'ID', 'asc', ' AND GROUP_ID = ' + this.groupID + ' AND MONTH(DATE_OF_PROJECT) = ' + submissionMonth + ' AND YEAR(DATE_OF_PROJECT) = ' + tempCurrentYear + " AND IS_DELETED = 0")
              .subscribe(projectdata => {
                if (projectdata['code'] == 200) {
                  this.drawermonthlyreportsubmissionComponentvar.isProjectSpining = false;
                  this.ProjectsOfTheMonthData = projectdata['data'];
                }

              }, err => {
                this.drawermonthlyreportsubmissionComponentvar.isProjectSpining = false;

                if (err['ok'] == false)
                  this.message.error("Server Not Found", "");
              });

            // Events
            this.EventsOfTheMonthData = [];
            this.drawermonthlyreportsubmissionComponentvar.isEvenSpining = true;

            this.api
              .getAllGroupActivities(0, 0, 'ID', 'asc', ' AND GROUP_ID = ' + this.groupID + ' AND MONTH(DATE) = ' + submissionMonth + ' AND YEAR(DATE) = ' + tempCurrentYear + " AND IS_DELETED = 0")
              .subscribe(eventdata => {
                if (eventdata['code'] == 200) {
                  this.drawermonthlyreportsubmissionComponentvar.isEvenSpining = false;
                  this.EventsOfTheMonthData = eventdata['data'];
                }

              }, err => {
                this.drawermonthlyreportsubmissionComponentvar.isEvenSpining = false;

                if (err['ok'] == false)
                  this.message.error("Server Not Found", "");
              });

            // General meetings
            this.MeetingsOfTheMonthData = [];
            this.drawermonthlyreportsubmissionComponentvar.isMeetingSpining = true;

            this.api
              .getAllgroupMeeting(0, 0, 'ID', 'asc', ' AND GROUP_ID = ' + this.groupID + ' AND MONTH(DATE) = ' + submissionMonth + ' AND YEAR(DATE) = ' + tempCurrentYear + " AND TYPE_OF_MEET IN ('G') AND IS_DELETED = 0")
              .subscribe(meetingdata => {
                if (meetingdata['code'] == 200) {
                  this.drawermonthlyreportsubmissionComponentvar.isMeetingSpining = false;
                  this.MeetingsOfTheMonthData = meetingdata['data'];
                }

              }, err => {
                this.drawermonthlyreportsubmissionComponentvar.isMeetingSpining = false;

                if (err['ok'] == false)
                  this.message.error("Server Not Found", "");
              });

            // Board meetings
            this.boardMeetingsOfTheMonthData = [];
            this.drawermonthlyreportsubmissionComponentvar.isBoardMeetingSpining = true;

            this.api
              .getAllgroupMeeting(0, 0, 'ID', 'asc', ' AND GROUP_ID = ' + this.groupID + ' AND MONTH(DATE) = ' + submissionMonth + ' AND YEAR(DATE) = ' + tempCurrentYear + " AND TYPE_OF_MEET = 'B' AND IS_DELETED = 0")
              .subscribe(meetingdata => {
                if (meetingdata['code'] == 200) {
                  this.drawermonthlyreportsubmissionComponentvar.isBoardMeetingSpining = false;
                  this.boardMeetingsOfTheMonthData = meetingdata['data'];
                }

              }, err => {
                this.drawermonthlyreportsubmissionComponentvar.isBoardMeetingSpining = false;

                if (err['ok'] == false)
                  this.message.error("Server Not Found", "");
              });

            // Group payments
            this.groupPaymentData = [];
            this.drawermonthlyreportsubmissionComponentvar.isBoardMeetingSpining = true;

            this.api
              .getAllMembershipPayment(0, 0, "", "", ' AND GROUP_ID = ' + this.groupID + ' AND MONTH(DATE) = ' + submissionMonth + ' AND YEAR(DATE) = ' + tempCurrentYear)
              .subscribe(paymentData => {
                if (paymentData['code'] == 200) {
                  this.drawermonthlyreportsubmissionComponentvar.loadingPaymentRecords = false;
                  this.groupPaymentData = paymentData['data'];
                }

              }, err => {
                this.drawermonthlyreportsubmissionComponentvar.loadingPaymentRecords = false;

                if (err['ok'] == false)
                  this.message.error("Server Not Found", "");
              });

          } else {
            this.drawerVisible = true;
            this.drawerTitle = "Monthly Reporting of " + month + " " + tempCurrentYear;
            this.drawerData = new MonthlyGroupReport();
            this.drawerData.MONTH = submissionMonth;
            this.drawerData.YEAR = tempCurrentYear;
            this.AddedMembersMonthData = [];
            this.droppedMembersMonthData = [];
            this.ProjectsOfTheMonthData = [];
            this.EventsOfTheMonthData = [];
            this.MeetingsOfTheMonthData = [];
            this.boardMeetingsOfTheMonthData = [];
            this.groupPaymentData = [];
            this.drawermonthlyreportsubmissionComponentvar.tempDates = [];
          }
        }

      }, err => {
        this.isLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  projectArray: any[] = [];
  eventArray: any[] = [];
  meetingArray: any[] = [];
  boardMeetingArray: any[] = [];
  addedMemberArray: any[] = [];
  droppedMemberArray: any[] = [];
  paymentData: any[] = [];
  currentDate: any;
  monthDay: any;
  tempMonthlyReportDataIDForSendDrawer: number;

  deleteMonthlyReportingRecord(month: string): void {
    let monthNum: number;
    let tempCurrentYear = this.currentYear;

    if ((month == "January") || (month == "February") || (month == "March")) {
      tempCurrentYear = tempCurrentYear;

    } else {
      tempCurrentYear = tempCurrentYear;
    }

    if (month == "January") {
      monthNum = 1;

    } else if (month == "February") {
      monthNum = 2;

    } else if (month == "March") {
      monthNum = 3;

    } else if (month == "April") {
      monthNum = 4;

    } else if (month == "May") {
      monthNum = 5;

    } else if (month == "June") {
      monthNum = 6;

    } else if (month == "July") {
      monthNum = 7;

    } else if (month == "August") {
      monthNum = 8;

    } else if (month == "September") {
      monthNum = 9;

    } else if (month == "October") {
      monthNum = 10;

    } else if (month == "November") {
      monthNum = 11;

    } else if (month == "December") {
      monthNum = 12;
    }

    this.isLoading = true;

    this.api
      .deleteMonthlyReportingRecord(monthNum, tempCurrentYear, this.groupID)
      .subscribe(successCode => {
        if (successCode['code'] == 200) {
          this.message.success("Monthly Reporting Record Deleted Successfully", "");
          this.showHideMonthTiles();
          this.getSubmissionData();

        } else {
          this.message.error("Failed to Delete Monthly Reporting Record", "");
          this.showHideMonthTiles();
          this.getSubmissionData();
        }
      });
  }

  viewMonthlyReport(month: string, btnValue: boolean): void {
    this.currentDate = new Date();
    this.printBtnStatus = btnValue;
    this.isLoading = true;
    this.reportGroupName = this.getGroupName(this.groupID);
    this.reportAdminName = this.getGroupName(this.groupID);
    this.drawermonthlyreportsubmissionComponentvar.getIDs();

    let tempCurrentYear = this.currentYear;

    if ((month == "January") || (month == "February") || (month == "March")) {
      tempCurrentYear = tempCurrentYear;

    } else {
      tempCurrentYear = tempCurrentYear;
    }

    this.modalHeader = "Monthly Reporting of " + month + " " + tempCurrentYear;
    this.reportHeader = month + " " + tempCurrentYear;

    if (month == "January") {
      this.selectedMonth = 1;
      this.monthDay = 31;

    } else if (month == "February") {
      this.selectedMonth = 2;
      this.monthDay = 28;

    } else if (month == "March") {
      this.selectedMonth = 3;
      this.monthDay = 31;

    } else if (month == "April") {
      this.selectedMonth = 4;
      this.monthDay = 30;

    } else if (month == "May") {
      this.selectedMonth = 5;
      this.monthDay = 31;

    } else if (month == "June") {
      this.selectedMonth = 6;
      this.monthDay = 30;

    } else if (month == "July") {
      this.selectedMonth = 7;
      this.monthDay = 31;

    } else if (month == "August") {
      this.selectedMonth = 8;
      this.monthDay = 31;

    } else if (month == "September") {
      this.selectedMonth = 9;
      this.monthDay = 30;

    } else if (month == "October") {
      this.selectedMonth = 10;
      this.monthDay = 31;

    } else if (month == "November") {
      this.selectedMonth = 11;
      this.monthDay = 30;

    } else if (month == "December") {
      this.selectedMonth = 12;
      this.monthDay = 31;
    }

    this.isReportLoading = true;

    this.api
      .getMonthlyGroupReport(0, 0, 'ID', 'asc', ' AND MONTH = ' + this.selectedMonth + ' AND YEAR = ' + tempCurrentYear + ' AND GROUP_ID = ' + this.groupID + ' AND IS_SUBMITTED = "S"')
      .subscribe(groupData => {
        if (groupData["code"] == 200) {
          this.isReportLoading = false;
          this.monthlyGroupData = groupData['data'];
          this.tempMonthlyReportDataIDForSendDrawer = groupData['data'][0]["ID"];

          // Added members list
          let adddedMemberFromDate: string = this.datePipe.transform(new Date(tempCurrentYear, this.selectedMonth - 1, 1), "yyyy-MM-dd");
          let findDaysInMonth: number = new Date(tempCurrentYear, this.selectedMonth, 0).getDate();
          let adddedMemberToDate: string = this.datePipe.transform(new Date(tempCurrentYear, this.selectedMonth - 1, findDaysInMonth), "yyyy-MM-dd");
          this.addedMemberArray = [];

          this.api
            .AddedMemberList(0, 0, 'NAME', 'asc', ' AND GROUP_ID = ' + this.groupID + " AND MEMBERSHIP_DATE BETWEEN '" + adddedMemberFromDate + "' AND '" + adddedMemberToDate + "'")
            .subscribe(addedMemberData => {
              if (addedMemberData['code'] == 200) {
                this.addedMemberArray = addedMemberData['data'];
              }

            }, err => {
              if (err['ok'] == false)
                this.message.error("Server Not Found", "");
            });

          // Dropped members list
          this.droppedMemberArray = [];

          this.api
            .AddedMemberList(0, 0, 'NAME', 'asc', ' AND GROUP_ID = ' + this.groupID + " AND DROPPED_STATUS = 1 AND DROPPED_DATE BETWEEN '" + adddedMemberFromDate + "' AND '" + adddedMemberToDate + "'")
            .subscribe(droppedMemberData => {
              if (droppedMemberData['code'] == 200) {
                this.droppedMemberArray = droppedMemberData['data'];
              }

            }, err => {
              if (err['ok'] == false)
                this.message.error("Server Not Found", "");
            });

          // Projects
          this.projectArray = [];

          this.api
            .getAllgroupProjects(0, 0, 'ID', 'asc', ' AND GROUP_ID = ' + this.groupID + ' AND MONTH(DATE_OF_PROJECT) = ' + this.selectedMonth + ' AND YEAR(DATE_OF_PROJECT) = ' + tempCurrentYear + " AND IS_DELETED = 0")
            .subscribe(projectdata => {
              if (projectdata['code'] == 200) {
                this.projectArray = projectdata['data'];
              }

            }, err => {
              if (err['ok'] == false)
                this.message.error("Server Not Found", "");
            });

          // Events
          this.eventArray = [];

          this.api
            .getAllGroupActivities(0, 0, 'ID', 'asc', ' AND GROUP_ID = ' + this.groupID + ' AND MONTH(DATE) = ' + this.selectedMonth + ' AND YEAR(DATE) = ' + tempCurrentYear + " AND IS_DELETED = 0")
            .subscribe(eventdata => {
              if (eventdata['code'] == 200) {
                this.eventArray = eventdata['data'];
              }

            }, err => {
              if (err['ok'] == false)
                this.message.error("Server Not Found", "");
            });

          // General meetings
          this.meetingArray = [];

          this.api
            .getAllgroupMeeting(0, 0, 'ID', 'asc', ' AND GROUP_ID = ' + this.groupID + ' AND MONTH(DATE) = ' + this.selectedMonth + ' AND YEAR(DATE) = ' + tempCurrentYear + " AND TYPE_OF_MEET IN ('G') AND IS_DELETED = 0")
            .subscribe(meetingdata => {
              if (meetingdata['code'] == 200) {
                this.meetingArray = meetingdata['data'];
              }

            }, err => {
              if (err['ok'] == false)
                this.message.error("Server Not Found", "");
            });

          // Board meetings
          this.boardMeetingArray = [];

          this.api
            .getAllgroupMeeting(0, 0, 'ID', 'asc', ' AND GROUP_ID = ' + this.groupID + ' AND MONTH(DATE) = ' + this.selectedMonth + ' AND YEAR(DATE) = ' + tempCurrentYear + " AND TYPE_OF_MEET = 'B' AND IS_DELETED = 0")
            .subscribe(meetingdata => {
              if (meetingdata['code'] == 200) {
                this.boardMeetingArray = meetingdata['data'];
              }

            }, err => {
              if (err['ok'] == false)
                this.message.error("Server Not Found", "");
            });

          // Payment data
          this.paymentData = [];

          this.api
            .getAllMembershipPayment(0, 0, "", "", ' AND GROUP_ID = ' + this.groupID + ' AND MONTH(DATE) = ' + this.selectedMonth + ' AND YEAR(DATE) = ' + tempCurrentYear)
            .subscribe(data => {
              if (data['code'] == 200) {
                this.paymentData = data['data'];
              }

            }, err => {
              if (err['ok'] == false)
                this.message.error("Server Not Found", "");
            });

        } else {
          this.isLoading = false;
        }
      });

    this.isVisible = true;
  }

  showHideMonthTiles(): void {
    this.janTileViewBtnStatus = false;
    this.febTileViewBtnStatus = false;
    this.marchTileViewBtnStatus = false;
    this.aprilTileViewBtnStatus = false;
    this.mayTileViewBtnStatus = false;
    this.juneTileViewBtnStatus = false;
    this.julTileViewBtnStatus = false;
    this.augTileViewBtnStatus = false;
    this.septTileViewBtnStatus = false;
    this.octTileViewBtnStatus = false;
    this.novTileViewBtnStatus = false;
    this.decTileViewBtnStatus = false;

    this.janTileViewPDF = "";
    this.febTileViewPDF = "";
    this.marchTileViewPDF = "";
    this.aprilTileViewPDF = "";
    this.mayTileViewPDF = "";
    this.juneTileViewPDF = "";
    this.julTileViewPDF = "";
    this.augTileViewPDF = "";
    this.septTileViewPDF = "";
    this.octTileViewPDF = "";
    this.novTileViewPDF = "";
    this.decTileViewPDF = "";

    if (this.currentMonth == 1) {
      this.janTileStatus = true;
      this.febTileStatus = false;
      this.marchTileStatus = false;
      this.aprilTileStatus = false;
      this.mayTileStatus = false;
      this.juneTileStatus = false;
      this.julTileStatus = false;
      this.augTileStatus = false;
      this.septTileStatus = false;
      this.octTileStatus = false;
      this.novTileStatus = false;
      this.decTileStatus = false;

    } else if (this.currentMonth == 2) {
      this.janTileStatus = true;
      this.febTileStatus = true;
      this.marchTileStatus = false;
      this.aprilTileStatus = false;
      this.mayTileStatus = false;
      this.juneTileStatus = false;
      this.julTileStatus = false;
      this.augTileStatus = false;
      this.septTileStatus = false;
      this.octTileStatus = false;
      this.novTileStatus = false;
      this.decTileStatus = false;

    } else if (this.currentMonth == 3) {
      this.janTileStatus = true;
      this.febTileStatus = true;
      this.marchTileStatus = true;
      this.aprilTileStatus = false;
      this.mayTileStatus = false;
      this.juneTileStatus = false;
      this.julTileStatus = false;
      this.augTileStatus = false;
      this.septTileStatus = false;
      this.octTileStatus = false;
      this.novTileStatus = false;
      this.decTileStatus = false;

    } else if (this.currentMonth == 4) {
      this.janTileStatus = true;
      this.febTileStatus = true;
      this.marchTileStatus = true;
      this.aprilTileStatus = true;
      this.mayTileStatus = false;
      this.juneTileStatus = false;
      this.julTileStatus = false;
      this.augTileStatus = false;
      this.septTileStatus = false;
      this.octTileStatus = false;
      this.novTileStatus = false;
      this.decTileStatus = false;

    } else if (this.currentMonth == 5) {
      this.janTileStatus = true;
      this.febTileStatus = true;
      this.marchTileStatus = true;
      this.aprilTileStatus = true;
      this.mayTileStatus = true;
      this.juneTileStatus = false;
      this.julTileStatus = false;
      this.augTileStatus = false;
      this.septTileStatus = false;
      this.octTileStatus = false;
      this.novTileStatus = false;
      this.decTileStatus = false;

    } else if (this.currentMonth == 6) {
      this.janTileStatus = true;
      this.febTileStatus = true;
      this.marchTileStatus = true;
      this.aprilTileStatus = true;
      this.mayTileStatus = true;
      this.juneTileStatus = true;
      this.julTileStatus = false;
      this.augTileStatus = false;
      this.septTileStatus = false;
      this.octTileStatus = false;
      this.novTileStatus = false;
      this.decTileStatus = false;

    } else if (this.currentMonth == 7) {
      this.janTileStatus = true;
      this.febTileStatus = true;
      this.marchTileStatus = true;
      this.aprilTileStatus = true;
      this.mayTileStatus = true;
      this.juneTileStatus = true;
      this.julTileStatus = true;
      this.augTileStatus = false;
      this.septTileStatus = false;
      this.octTileStatus = false;
      this.novTileStatus = false;
      this.decTileStatus = false;

    } else if (this.currentMonth == 8) {
      this.janTileStatus = true;
      this.febTileStatus = true;
      this.marchTileStatus = true;
      this.aprilTileStatus = true;
      this.mayTileStatus = true;
      this.juneTileStatus = true;
      this.julTileStatus = true;
      this.augTileStatus = true;
      this.septTileStatus = false;
      this.octTileStatus = false;
      this.novTileStatus = false;
      this.decTileStatus = false;

    } else if (this.currentMonth == 9) {
      this.janTileStatus = true;
      this.febTileStatus = true;
      this.marchTileStatus = true;
      this.aprilTileStatus = true;
      this.mayTileStatus = true;
      this.juneTileStatus = true;
      this.julTileStatus = true;
      this.augTileStatus = true;
      this.septTileStatus = true;
      this.octTileStatus = false;
      this.novTileStatus = false;
      this.decTileStatus = false;

    } else if (this.currentMonth == 10) {
      this.janTileStatus = true;
      this.febTileStatus = true;
      this.marchTileStatus = true;
      this.aprilTileStatus = true;
      this.mayTileStatus = true;
      this.juneTileStatus = true;
      this.julTileStatus = true;
      this.augTileStatus = true;
      this.septTileStatus = true;
      this.octTileStatus = true;
      this.novTileStatus = false;
      this.decTileStatus = false;

    } else if (this.currentMonth == 11) {
      this.janTileStatus = true;
      this.febTileStatus = true;
      this.marchTileStatus = true;
      this.aprilTileStatus = true;
      this.mayTileStatus = true;
      this.juneTileStatus = true;
      this.julTileStatus = true;
      this.augTileStatus = true;
      this.septTileStatus = true;
      this.octTileStatus = true;
      this.novTileStatus = true;
      this.decTileStatus = false;

    } else if (this.currentMonth == 12) {
      this.janTileStatus = true;
      this.febTileStatus = true;
      this.marchTileStatus = true;
      this.aprilTileStatus = true;
      this.mayTileStatus = true;
      this.juneTileStatus = true;
      this.julTileStatus = true;
      this.augTileStatus = true;
      this.septTileStatus = true;
      this.octTileStatus = true;
      this.novTileStatus = true;
      this.decTileStatus = true;
    }
  }

  getGroupName(groupID: number): string {
    let tempData = this.groups.filter(obj1 => {
      return obj1["ID"] == groupID;
    });

    return tempData[0]["NAME"] + ", " + tempData[0]["UNIT_NAME"];
  }

  handleOk(): void { }

  handleCancel(): void {
    this.isVisible = false;
    this.isReportLoading = false;
    this.projectArray = null;
    this.meetingArray = null;
    this.boardMeetingArray = null;
    this.eventArray = null;
    this.drawerClose();
  }

  getWidth(): number {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 1250;
  }

  drawerClose(): void {
    this.ngOnInit();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  getTimeInAM_PM(time: any) {
    return this.datePipe.transform(new Date(), "yyyy-MM-dd" + " " + time);
  }

  emailDrawerVisible: boolean = false;
  emailcircularDrawerTitle: string;
  monthlyReportDataIDForSendDrawer: number;
  @ViewChild(SendMonthlyReportComponent, { static: false }) SendMonthlyReportComponentVar: SendMonthlyReportComponent;

  sendMonthlyReportEmail(month: number): void {
    this.emailDrawerVisible = true;
    this.emailcircularDrawerTitle = "aaa " + "Send Monthly Reporting Mail";
    this.monthlyReportDataIDForSendDrawer = this.groupID;
    this.SendMonthlyReportComponentVar.getFederationMemberData(this.homeFederationID);
    this.SendMonthlyReportComponentVar.getFederationcentralSpecialCommitteeMemberData(this.homeFederationID);
    this.SendMonthlyReportComponentVar.getUnitMemberData(this.homeUnitID);
    this.SendMonthlyReportComponentVar.getSponseredGroupMemberData(this.homeGroupID);
    this.SendMonthlyReportComponentVar.getMonthlyReportingData(month, this.homeGroupID);
    this.SendMonthlyReportComponentVar.month = month;
  }

  emailDrawerClose(): void {
    this.ngOnInit();
    this.emailDrawerVisible = false;
  }

  get emailDrawerCloseCallback() {
    return this.emailDrawerClose.bind(this);
  }

  generatePDF(): void {
    // var i = 0;
    // var date = new Date();
    // var datef = this.datePipe.transform(date, "dd-MM-yy");
    // var dates = this.datePipe.transform(date, "hh-mm-ss a");
    // var data = document.getElementById('print');

    // html2pdf().set({ margin: [6, 13, 6, 6], pagebreak: { mode: 'avoid-all' }, jsPDF: { unit: 'mm', format: 'A4', orientation: 'portrait' } }).from(data).toPdf().get('pdf').then(function (pdf) {
    //   var totalPages = pdf.internal.getNumberOfPages();

    //   for (i = 1; i <= totalPages; i++) {
    //     pdf.setPage(i);
    //     pdf.setFontSize(12);
    //     pdf.setTextColor(150);
    //     pdf.text(i.toString(), pdf.internal.pageSize.getWidth() / 2, 10);
    //   }

    // }).save("Monthly_Reporting_" + datef + "_" + dates + '.pdf');

    // 
    // var date = new Date();
    // var datef = this.datePipe.transform(date, "dd-MM-yy");
    // var dates = this.datePipe.transform(date, "hh-mm-ss a");
    // var htmlElement = document.getElementById('print');

    // const opt: any = {
    //   callback: function (jsPdf) {
    //     jsPdf.save("Monthly_Reporting_" + datef + "_" + dates + '.pdf');
    //   },
    //   margin: [6, 13, 6, 6],
    //   html2canvas: {
    //     allowTaint: true,
    //     dpi: 300,
    //     letterRendering: true,
    //     logging: false,
    //     scale: 2,
    //     useCORS: true
    //   }
    // };

    // html2canvas(htmlElement, opt.html2canvas).then(function (canvas) {
    //   const imgData = canvas.toDataURL('image/png');
    //   const pdf = new jsPDF('p', 'pt', 'A4');
    //   const pdfWidth = pdf.internal.pageSize.getWidth();
    //   const pdfHeight = pdf.internal.pageSize.getHeight();
    //   const ratio = pdfWidth / pdfHeight;

    //   const imgHeight = canvas.height * pdfWidth / canvas.width;
    //   let position = 0;

    //   pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    //   position -= pdfHeight;

    //   while (position > -canvas.height) {
    //     pdf.addPage();
    //     pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    //     position -= pdfHeight;
    //   }

    //   pdf.save("Monthly_Reporting_" + datef + "_" + dates + '.pdf');
    // });
  }

  getMeetingImage(imageName: string): string {
    return "static/groupMeeting/" + imageName + "'";
  }

  onPrinted(): void {
    console.log('PDF downloaded');
  }

  getPaymentMode(mode: string): string {
    if (mode == "ONL") {
      return "Online";

    } else if (mode == "OFFL") {
      return "Offline";
    }
  }

  cancel(): void { }

  folderName: string = "groupMonthlyReportDocuments";

  viewPDF(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + this.folderName + "/" + pdfURL);
  }
}
