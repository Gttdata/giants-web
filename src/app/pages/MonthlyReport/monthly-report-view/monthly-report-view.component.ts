import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { MonthlyReportSubmission } from 'src/app/Models/MonthlyReportSubmission';
import { ApiService } from 'src/app/Service/api.service';
import { MonthlyGroupReport } from 'src/app/Models/MonthlyGroupReport';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-monthly-report-view',
  templateUrl: './monthly-report-view.component.html',
  styleUrls: ['./monthly-report-view.component.css']
})

export class MonthlyReportViewComponent implements OnInit {
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

  dataList: any[] = [];
  dataList1: any[] = [];
  reportGroupName: string;
  isVisible: boolean = false;
  isLoading: boolean = false;
  roleID: number = this.api.roleId;
  userID: number = this.api.userId;
  imgurl: string = this.api.retriveimgUrl;
  submissionData: MonthlyReportSubmission = new MonthlyReportSubmission();
  GROUP_ID: number;
  RETRIVE_IMAGE_URL: string = this.api.retriveimgUrl;
  loadingRecords: boolean = false;
  sortKey: string = "id";
  sortValue: string = "desc";
  searchText: string = "";
  filterQuery: string = "";
  multipleSearchText: any[] = [];
  advanceMultipleSearchText: any[] = [];
  columns: string[][] = [];
  totalRecords: number = 1;
  pageIndex: number = 1;
  pageSize: number = 10;
  isGroupLoading: boolean = false;

  federationID: number;
  unitID: number;
  groupID: number;

  homeFederationID: number;
  homeUnitID: number;
  homeGroupID: number;

  monthlyReportingTitle: string;

  constructor(private message: NzNotificationService, private api: ApiService, private _cookie: CookieService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.getIDs();
    this.getGroups();
  }

  getIDs(): void {
    this.federationID = Number(sessionStorage.getItem("FEDERATION_ID"));
    this.unitID = Number(sessionStorage.getItem("UNIT_ID"));
    this.groupID = Number(sessionStorage.getItem("GROUP_ID"));

    this.homeFederationID = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
    this.homeUnitID = Number(sessionStorage.getItem("HOME_UNIT_ID"));
    this.homeGroupID = Number(sessionStorage.getItem("HOME_GROUP_ID"));

    this.monthlyReportingTitle = sessionStorage.getItem("HOME_FEDERATION_NAME");
  }

  showreport(): void {
    if (this.GROUP_ID != undefined) {
      this.showHideMonthTiles();
      this.getSubmissionData(this.GROUP_ID);

    } else {
      this.message.info("Please Select Valid Group", "");
    }
  }

  getSubmissionData(groupID: number): void {
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

    this.isLoading = true;

    this.api.getMonthlyGroupReport(0, 0, "", "", " AND GROUP_ID=" + groupID + " AND IS_SUBMITTED='S'").subscribe(data => {
      if (data['code'] == 200) {
        this.isLoading = false;
        let reportData = data['data'];

        let tempJan = reportData.filter((item: any) => {
          return (item["MONTH"] == 1) && (item["YEAR"] == this.currentYear);
        });

        if (tempJan.length > 0) {
          this.janTileViewBtnStatus = true;
          this.janTileViewPDF = (tempJan[0]["ATTECHMENT_FILE"] && tempJan[0]["ATTECHMENT_FILE"].trim() != '') ? tempJan[0]["ATTECHMENT_FILE"] : '';
        }

        let tempFeb = reportData.filter((item: any) => {
          return (item["MONTH"] == 2) && (item["YEAR"] == this.currentYear);
        });

        if (tempFeb.length > 0) {
          this.febTileViewBtnStatus = true;
          this.febTileViewPDF = (tempFeb[0]["ATTECHMENT_FILE"] && tempFeb[0]["ATTECHMENT_FILE"].trim() != '') ? tempFeb[0]["ATTECHMENT_FILE"] : '';
        }

        let tempMarch = reportData.filter((item: any) => {
          return (item["MONTH"] == 3) && (item["YEAR"] == this.currentYear);
        });

        if (tempMarch.length > 0) {
          this.marchTileViewBtnStatus = true;
          this.marchTileViewPDF = (tempMarch[0]["ATTECHMENT_FILE"] && tempMarch[0]["ATTECHMENT_FILE"].trim() != '') ? tempMarch[0]["ATTECHMENT_FILE"] : '';
        }

        let tempApril = reportData.filter((item: any) => {
          return (item["MONTH"] == 4) && (item["YEAR"] == this.currentYear);
        });

        if (tempApril.length > 0) {
          this.aprilTileViewBtnStatus = true;
          this.aprilTileViewPDF = (tempApril[0]["ATTECHMENT_FILE"] && tempApril[0]["ATTECHMENT_FILE"].trim() != '') ? tempApril[0]["ATTECHMENT_FILE"] : '';
        }

        let tempMay = reportData.filter((item: any) => {
          return (item["MONTH"] == 5) && (item["YEAR"] == this.currentYear);
        });

        if (tempMay.length > 0) {
          this.mayTileViewBtnStatus = true;
          this.mayTileViewPDF = (tempMay[0]["ATTECHMENT_FILE"] && tempMay[0]["ATTECHMENT_FILE"].trim() != '') ? tempMay[0]["ATTECHMENT_FILE"] : '';
        }

        let tempJune = reportData.filter((item: any) => {
          return (item["MONTH"] == 6) && (item["YEAR"] == this.currentYear);
        });

        if (tempJune.length > 0) {
          this.juneTileViewBtnStatus = true;
          this.juneTileViewPDF = (tempJune[0]["ATTECHMENT_FILE"] && tempJune[0]["ATTECHMENT_FILE"].trim() != '') ? tempJune[0]["ATTECHMENT_FILE"] : '';
        }

        let tempJul = reportData.filter((item: any) => {
          return (item["MONTH"] == 7) && (item["YEAR"] == this.currentYear);
        });

        if (tempJul.length > 0) {
          this.julTileViewBtnStatus = true;
          this.julTileViewPDF = (tempJul[0]["ATTECHMENT_FILE"] && tempJul[0]["ATTECHMENT_FILE"].trim() != '') ? tempJul[0]["ATTECHMENT_FILE"] : '';
        }

        let tempAug = reportData.filter((item: any) => {
          return (item["MONTH"] == 8) && (item["YEAR"] == this.currentYear);
        });

        if (tempAug.length > 0) {
          this.augTileViewBtnStatus = true;
          this.augTileViewPDF = (tempAug[0]["ATTECHMENT_FILE"] && tempAug[0]["ATTECHMENT_FILE"].trim() != '') ? tempAug[0]["ATTECHMENT_FILE"] : '';
        }

        let tempSept = reportData.filter((item: any) => {
          return (item["MONTH"] == 9) && (item["YEAR"] == this.currentYear);
        });

        if (tempSept.length > 0) {
          this.septTileViewBtnStatus = true;
          this.septTileViewPDF = (tempSept[0]["ATTECHMENT_FILE"] && tempSept[0]["ATTECHMENT_FILE"].trim() != '') ? tempSept[0]["ATTECHMENT_FILE"] : '';
        }

        let tempOct = reportData.filter((item: any) => {
          return (item["MONTH"] == 10) && (item["YEAR"] == this.currentYear);
        });

        if (tempOct.length > 0) {
          this.octTileViewBtnStatus = true;
          this.octTileViewPDF = (tempOct[0]["ATTECHMENT_FILE"] && tempOct[0]["ATTECHMENT_FILE"].trim() != '') ? tempOct[0]["ATTECHMENT_FILE"] : '';
        }

        let tempNov = reportData.filter((item: any) => {
          return (item["MONTH"] == 11) && (item["YEAR"] == this.currentYear);
        });

        if (tempNov.length > 0) {
          this.novTileViewBtnStatus = true;
          this.novTileViewPDF = (tempNov[0]["ATTECHMENT_FILE"] && tempNov[0]["ATTECHMENT_FILE"].trim() != '') ? tempNov[0]["ATTECHMENT_FILE"] : '';
        }

        let tempDec = reportData.filter((item: any) => {
          return (item["MONTH"] == 12) && (item["YEAR"] == this.currentYear);
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
    // Home federation filter
    let homeFederationFilter = " AND FEDERATION_ID=" + this.homeFederationID;

    // Unit filter
    let unitFilter = "";

    if (this.unitID > 0) {
      unitFilter = " AND UNIT_ID=" + this.unitID;
    }

    this.groups = [];
    this.isGroupLoading = true;

    this.api.getAllGroups(0, 0, "NAME", "asc", unitFilter + homeFederationFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.isGroupLoading = false;
        this.groups = data['data'];
      }

    }, err => {
      this.isGroupLoading = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  modalHeader: string = "";
  reportHeader: string = "";
  printBtnStatus: boolean = false;
  submissionMonth: number;
  submissionYear: number;

  submitMonthlyReport(month: string, btnValue: boolean, submissionMonth: number): void {
    this.printBtnStatus = btnValue;
    this.dataList = [];
    this.dataList1 = [];
    this.isLoading = true;
    this.reportGroupName = this.getGroupName(this.GROUP_ID);
    let tempCurrentYear = this.currentYear;

    if ((month == "January") || (month == "February") || (month == "March")) {
      tempCurrentYear = tempCurrentYear;

    } else {
      tempCurrentYear = tempCurrentYear;
    }

    this.submissionMonth = submissionMonth;
    this.submissionYear = tempCurrentYear;
    this.modalHeader = "Monthly Reporting of " + month + " " + this.currentYear;

    this.api.getReportDetails(month, tempCurrentYear, this.GROUP_ID).subscribe(data => {
      if (data["code"] == 200) {
        this.isVisible = true;
        this.isLoading = false;
        this.dataList = data['data'];
        this.dataList1 = data['getEvents'];

      } else {
        this.isLoading = false;
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
  selectedMonth: number;
  monthlyGroupData: MonthlyGroupReport = new MonthlyGroupReport();
  isSpinning: boolean = false;

  viewMonthlyReport(month: string, btnValue: boolean): void {
    this.printBtnStatus = btnValue;
    this.dataList = [];
    this.dataList1 = [];
    this.isLoading = true;
    this.reportGroupName = this.getGroupName(this.GROUP_ID);
    let tempCurrentYear = this.currentYear;

    if ((month == "January") || (month == "February") || (month == "March")) {
      tempCurrentYear = tempCurrentYear;

    } else {
      tempCurrentYear = tempCurrentYear;
    }

    this.currentDate = new Date();

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

    this.modalHeader = "Monthly Reporting of " + month + " " + tempCurrentYear;
    this.reportHeader = month + " " + tempCurrentYear;

    this.api.getMonthlyGroupReport(0, 0, 'ID', 'asc', 'AND MONTH=' + this.selectedMonth + ' AND YEAR=' + tempCurrentYear + ' AND GROUP_ID=' + this.GROUP_ID + ' AND IS_SUBMITTED="S"').subscribe(groupData => {
      if (groupData["code"] == 200) {
        this.monthlyGroupData = groupData['data'];

        // Added members list
        let adddedMemberFromDate: string = this.datePipe.transform(new Date(tempCurrentYear, this.selectedMonth - 1, 1), "yyyy-MM-dd");
        let findDaysInMonth: number = new Date(tempCurrentYear, this.selectedMonth, 0).getDate();
        let adddedMemberToDate: string = this.datePipe.transform(new Date(tempCurrentYear, this.selectedMonth - 1, findDaysInMonth), "yyyy-MM-dd");
        this.addedMemberArray = [];

        this.api.AddedMemberList(0, 0, 'NAME', 'asc', ' AND GROUP_ID=' + this.GROUP_ID + " AND MEMBERSHIP_DATE BETWEEN '" + adddedMemberFromDate + "' AND '" + adddedMemberToDate + "'").subscribe(addedMemberData => {
          if (addedMemberData['code'] == 200) {
            this.addedMemberArray = addedMemberData['data'];
          }

        }, err => {
          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });

        // Dropped members list
        this.droppedMemberArray = [];

        this.api.AddedMemberList(0, 0, 'NAME', 'asc', ' AND GROUP_ID=' + this.GROUP_ID + " AND DROPPED_STATUS=1 AND DROPPED_DATE BETWEEN '" + adddedMemberFromDate + "' AND '" + adddedMemberToDate + "'").subscribe(droppedMemberData => {
          if (droppedMemberData['code'] == 200) {
            this.droppedMemberArray = droppedMemberData['data'];
          }

        }, err => {
          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });

        // Projects
        this.projectArray = [];

        this.api.getAllgroupProjects(0, 0, 'ID', 'asc', ' AND GROUP_ID=' + this.GROUP_ID + ' AND MONTH(DATE_OF_PROJECT)=' + this.selectedMonth + ' AND YEAR(DATE_OF_PROJECT)=' + tempCurrentYear + " AND IS_DELETED=0").subscribe(projectdata => {
          if (projectdata['code'] == 200) {
            this.projectArray = projectdata['data'];
          }

        }, err => {
          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });

        // Events
        this.eventArray = [];

        this.api.getAllGroupActivities(0, 0, 'ID', 'asc', ' AND GROUP_ID=' + this.GROUP_ID + ' AND MONTH(DATE)=' + this.selectedMonth + ' AND YEAR(DATE)=' + tempCurrentYear + " AND IS_DELETED=0").subscribe(eventdata => {
          if (eventdata['code'] == 200) {
            this.eventArray = eventdata['data'];
          }

        }, err => {
          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });

        // General meetings
        this.meetingArray = [];

        this.api.getAllgroupMeeting(0, 0, 'ID', 'asc', ' AND GROUP_ID=' + this.GROUP_ID + ' AND MONTH(DATE)=' + this.selectedMonth + ' AND YEAR(DATE)=' + tempCurrentYear + " AND TYPE_OF_MEET IN ('G') AND IS_DELETED=0").subscribe(meetingdata => {
          if (meetingdata['code'] == 200) {
            this.meetingArray = meetingdata['data'];
          }

        }, err => {
          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });

        // Board meetings
        this.boardMeetingArray = [];

        this.api.getAllgroupMeeting(0, 0, 'ID', 'asc', ' AND GROUP_ID=' + this.GROUP_ID + ' AND MONTH(DATE)=' + this.selectedMonth + ' AND YEAR(DATE)=' + tempCurrentYear + " AND TYPE_OF_MEET='B' AND IS_DELETED=0").subscribe(meetingdata => {
          if (meetingdata['code'] == 200) {
            this.boardMeetingArray = meetingdata['data'];
          }

        }, err => {
          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });

        // Payment data
        this.paymentData = [];

        this.api.getAllMembershipPayment(0, 0, "", "", ' AND GROUP_ID=' + this.GROUP_ID + ' AND MONTH(DATE)=' + this.selectedMonth + ' AND YEAR(DATE)=' + tempCurrentYear).subscribe(data => {
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

    }, err => {
      this.isLoading = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    this.isVisible = true;
  }

  showHideMonthTiles(): void {
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
    this.projectArray = null;
    this.meetingArray = null;
    this.eventArray = null;
    this.showreport();
    this.isVisible = false;
    this.isSpinning = false;
  }

  getTimeInAM_PM(time: any): string {
    return this.datePipe.transform(new Date(), "yyyy-MM-dd" + " " + time);
  }

  getPaymentMode(mode: string): string {
    if (mode == "ONL") {
      return "Online";

    } else if (mode == "OFFL") {
      return "Offline";
    }
  }

  folderName: string = "groupMonthlyReportDocuments";

  viewPDF(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + this.folderName + "/" + pdfURL);
  }
}
