import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-detailed-group-status-report',
  templateUrl: './detailed-group-status-report.component.html',
  styleUrls: ['./detailed-group-status-report.component.css']
})

export class DetailedGroupStatusReportComponent implements OnInit {
  formTitle: string = "Group Status Report";
  dataList: any[] = [];
  exportDataList: any[] = [];
  loadingRecords: boolean = false;
  totalRecords: number = 1;
  pageIndex: number = 1;
  pageSize: number = 5;
  sortKey: string = "UNIT_ID";
  sortValue: string = "asc";
  searchText: string = "";
  columns: string[][] = [["NAME", "Group Name"], ["PRESIDENT_NAME", "President Name"], ["MOBILE_NUMBER", "Mobile No."]];
  federationID: number;
  unitID: number;
  groupID: number;
  homeFederationID: number;
  homeUnitID: number;
  homeGroupID: number;

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _exportService: ExportService, private _cookie: CookieService) { }

  ngOnInit() {
    this.getIDs();
    this.getYearRange();
    this.search(true, false);
  }

  getIDs(): void {
    this.federationID = Number(sessionStorage.getItem("FEDERATION_ID"));
    this.unitID = Number(sessionStorage.getItem("UNIT_ID"));
    this.groupID = Number(sessionStorage.getItem("GROUP_ID"));

    this.homeFederationID = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
    this.homeUnitID = Number(sessionStorage.getItem("HOME_UNIT_ID"));
    this.homeGroupID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
  }

  PAID_1: number = 0;
  PAID_2: number = 0;
  MEMBER_COUNT: number = 0;
  NCF_MEMBER_COUNT: number = 0;
  exportLoading: boolean = false;

  search(reset: boolean = false, exportToExcel: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }

    var sort: string;

    try {
      sort = this.sortValue.startsWith("a") ? "asc" : "desc";

    } catch (error) {
      sort = "";
    }

    var likeQuery = "";

    if (this.searchText != "") {
      likeQuery = " AND";

      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }

    // Federation filter
    let federationFilter = "";

    if (this.federationID > 0) {
      federationFilter = " AND FEDERATION_ID=" + this.federationID;
    }

    // Unit filter
    let unitFilter = "";

    if (this.unitID > 0) {
      unitFilter = " AND UNIT_ID=" + this.unitID;
    }

    let unitNameFilter = "";
    let unitNameString = "";

    if (this.UNIT_NAME.length > 0) {
      for (let i = 0; i < this.UNIT_NAME.length; i++) {
        unitNameString = unitNameString + "'" + this.UNIT_NAME[i] + "',";
      }

      unitNameString = unitNameString.substring(0, unitNameString.length - 1);
      unitNameFilter = " AND UNIT_ID IN (" + unitNameString + ")";
    }

    if (exportToExcel) {
      this.exportLoading = true;

      this.api.getDetailedGroupStatusWiseReport(0, 0, this.sortKey, sort, likeQuery + federationFilter + unitFilter + unitNameFilter, this.SELECTED_YEAR).subscribe(data => {
        if (data['code'] == 200) {
          this.exportLoading = false;
          this.exportDataList = data['data'];
          this.convertInExcel();
        }

      }, err => {
        this.exportLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });

    } else {
      this.loadingRecords = true;

      this.api.getDetailedGroupStatusWiseReport(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + federationFilter + unitFilter + unitNameFilter, this.SELECTED_YEAR).subscribe(data => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
        }

      }, err => {
        this.loadingRecords = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true, false);
  }

  baseYear: number = 2020;
  yearRange: any[] = [];
  SELECTED_YEAR: number = new Date().getFullYear();

  getYearRange(): void {
    let currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= this.baseYear; i--) {
      this.yearRange.push(i);
    }
  }

  isUnitLoading: boolean = false;
  units: any[] = [];
  UNIT_NAME: any[] = [];

  getUnits(unitName: string): void {
    if (unitName.length >= 3) {
      let unitFilter = "";

      if (this.unitID > 0) {
        unitFilter = " AND ID=" + this.unitID;
      }

      this.isUnitLoading = true;

      this.api.getAllUnits(0, 0, "NAME", "asc", " AND STATUS=1 AND NAME LIKE '%" + unitName + "%' AND FEDERATION_ID=" + this.homeFederationID + unitFilter).subscribe(data => {
        if (data['code'] == 200) {
          this.isUnitLoading = false;
          this.units = data['data'];
        }

      }, err => {
        this.isUnitLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  getUnitInfo(unitNames: any): void {
    this.search(true, false);
  }

  importInExcel(): void {
    this.search(false, true);
  }

  convertInExcel(): void {
    let arry1 = [];
    let obj1: any = new Object();

    for (let i = 0; i < this.exportDataList.length; i++) {
      obj1['Sr. No.'] = i + 1;
      obj1['Group Name'] = this.exportDataList[i]['NAME'];
      obj1["Group's President Name"] = this.exportDataList[i]['PRESIDENT_NAME'];
      obj1['Mobile No.'] = this.exportDataList[i]['MOBILE_NUMBER'];
      obj1[" " + (this.SELECTED_YEAR - 2)] = this.exportDataList[i]['_20_21_MEMBER_COUNT'];
      obj1[" " + (this.SELECTED_YEAR - 1)] = this.exportDataList[i]['_21_22_MEMBER_COUNT'];
      obj1['B.O.D. ' + this.SELECTED_YEAR + ' Date'] = this.datePipe.transform(this.exportDataList[i]['BOD_DATE'], 'dd-MMM-yy');
      obj1['B.O.D. ' + this.SELECTED_YEAR + ' Remark'] = this.exportDataList[i]['BOD_REMARK'];
      obj1['M.L. ' + this.SELECTED_YEAR + ' Date'] = this.datePipe.transform(this.exportDataList[i]['ML_DATE'], 'dd-MMM-yy');
      obj1['M.L. ' + this.SELECTED_YEAR + ' Remark'] = this.exportDataList[i]['ML_REMARK'];
      obj1['Old Paid Membership ' + this.SELECTED_YEAR + ' Count'] = this.exportDataList[i]['OLD_PAID_MEMBER'];
      obj1['Old Paid Membership ' + this.SELECTED_YEAR + ' Fees'] = this.exportDataList[i]['OLD_PAID_MEMBER_FEE'];
      obj1['New Paid Membership ' + this.SELECTED_YEAR + ' Count'] = this.exportDataList[i]['NEW_PAID_MEMBER'];
      obj1['New Paid Membership ' + this.SELECTED_YEAR + ' Fees'] = this.exportDataList[i]['NEW_PAID_MEMBER_FEE'];
      obj1['Revived Membership ' + this.SELECTED_YEAR + ' Count'] = this.exportDataList[i]['REVIVED_MEMBER'];
      obj1['Revived Membership ' + this.SELECTED_YEAR + ' Fees'] = this.exportDataList[i]['REVIVED_MEMBER_FEE'];
      obj1['Honorable Membership ' + this.SELECTED_YEAR + ' Count'] = this.exportDataList[i]['HONORABL_MEMBER_COUNT'];
      obj1['Honorable Membership ' + this.SELECTED_YEAR + ' Fees'] = this.exportDataList[i]['HONORABLE_MEMBER_FEE'];
      obj1['NCF Member(s)'] = this.exportDataList[i]['NCF_MEMBER'];
      obj1['Total Member(s)'] = this.exportDataList[i]['TOTAL_MEMBER'];
      obj1['Total Paid'] = this.exportDataList[i]['TOTAL_PAID'];
      obj1['Oath (Yes/ No)'] = this.exportDataList[i]['OATH'];

      obj1['Jan Monthly Reporting (Yes/ No)'] = this.exportDataList[i]['JAN'];
      obj1['Feb Monthly Reporting (Yes/ No)'] = this.exportDataList[i]['FEB'];
      obj1['Mar Monthly Reporting (Yes/ No)'] = this.exportDataList[i]['MAR'];
      obj1['Apr Monthly Reporting (Yes/ No)'] = this.exportDataList[i]['APR'];
      obj1['May Monthly Reporting (Yes/ No)'] = this.exportDataList[i]['MAY'];
      obj1['Jun Monthly Reporting (Yes/ No)'] = this.exportDataList[i]['JUNE'];
      obj1['Jul Monthly Reporting (Yes/ No)'] = this.exportDataList[i]['JULY'];
      obj1['Aug Monthly Reporting (Yes/ No)'] = this.exportDataList[i]['AUG'];
      obj1['Sept Monthly Reporting (Yes/ No)'] = this.exportDataList[i]['SEP'];
      obj1['Oct Monthly Reporting (Yes/ No)'] = this.exportDataList[i]['OCT'];
      obj1['Nov Monthly Reporting (Yes/ No)'] = this.exportDataList[i]['NOV'];
      obj1['Dec Monthly Reporting (Yes/ No)'] = this.exportDataList[i]['DECE'];

      obj1['New Group/ Revived Group ' + this.SELECTED_YEAR] = this.exportDataList[i]["GROUP_REVIVED_COUNT"];
      obj1['Due Count ' + this.SELECTED_YEAR] = this.exportDataList[i]["DUES_COUNT"];
      obj1['M.L. ' + this.SELECTED_YEAR] = this.exportDataList[i]["MAILING_LIST_BOD"];

      obj1['International Level Award(s)'] = this.exportDataList[i]['AWARD_INTRNATION_LEVEL'];
      obj1['International Level Certificate(s)'] = this.exportDataList[i]['CERTIFICATE_INTERNATIONAL'];

      obj1['Unit Level Award(s)'] = this.exportDataList[i]['AWARD_UNIT_LEVEL'];
      obj1['Unit Level Certificate(s)'] = this.exportDataList[i]['CERTIFICATE_UNIT_LEVEL'];

      obj1['Is Data Filled in Application?'] = "---";
      obj1['Members Growth (%)'] = this.exportDataList[i]['MEMBER_GROWTH'] ? ((parseFloat(this.exportDataList[i]['MEMBER_GROWTH']).toFixed(2).split(".")[1] == "00") ? this.exportDataList[i]['MEMBER_GROWTH'] : Number(parseFloat(this.exportDataList[i]['MEMBER_GROWTH']).toFixed(2))) : "";
      obj1['Host Unit Level Council/ Conference Count'] = this.exportDataList[i]['HOST_UNIT_LEVEL'];
      obj1['Host Council Level Programme Count'] = this.exportDataList[i]['HOST_COUNCIL_LEVEL'];

      obj1['Monumental Project(s)'] = this.exportDataList[i]['MONUMENTAL_PROJECT'];
      obj1['Service Project(s)'] = this.exportDataList[i]['SERVICES_PROJECT'];
      obj1['Giants Week Celebration Event(s)'] = this.exportDataList[i]['GIANTS_WEEK_DETAILS'];

      obj1['Unit Council/ Conferance Attended Member(s) count'] = this.exportDataList[i]['UNIT_LEVEL_CONFERENCE_ATTENDANCE_COUNT'];
      obj1['Federation Council/ Conferance Attended Member(s) count'] = this.exportDataList[i]['FEDERATION_LEVEL_COUNCIL_ATTENDANCE_COUNT'];

      obj1['International Convention Attended Member(s) Count'] = this.exportDataList[i]['CONVENTION_MEMBER_COUNT'];
      obj1['Young Giants Group Name'] = this.exportDataList[i]['YOUNG_GIANT_GROUP_NAME'];
      obj1['PAN Card (Yes/ No)'] = this.exportDataList[i]['PAN_CARD'];
      obj1['Audit Report (Yes/ No)'] = (this.exportDataList[i]['AUDIT_REPORT']) ? "Yes" : "No";
      obj1['Total Marks'] = Number(this.exportDataList[i]['TOTAL']);

      arry1.push(Object.assign({}, obj1));
    }

    this._exportService.exportExcel(arry1, this.formTitle + ' ' + this.datePipe.transform(new Date(), 'dd-MMM-yy, hh mm ss a'));
  }

  folderName: string = "auditReport";

  viewAuditReport(auditReportUrl: string): void {
    window.open(this.api.retriveimgUrl + this.folderName + "/" + auditReportUrl);
  }
}
