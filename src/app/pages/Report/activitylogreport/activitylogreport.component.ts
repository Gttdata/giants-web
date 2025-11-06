import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-activitylogreport',
  templateUrl: './activitylogreport.component.html',
  styleUrls: ['./activitylogreport.component.css']
})

export class ActivitylogreportComponent implements OnInit {
  formTitle: string = "Activity Logs";
  radioValue: string = 'P';
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList: any[] = [];
  loadingRecords: boolean = false;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  columnsPost: string[][] = [["CREATED_DATE_TIME", "Date Time"], ["LOG_CREATOR_NAME", "Log Creator Name"], ["LOG_TEXT", "Log Text"], ["POST_DESCRIPTION", "Post Description"], ["POST_CREATOR_MEMBER_NAME", "Post Creator Name"]];
  columnsEvent: string[][] = [["CREATED_DATE_TIME", "Date Time"], ["LOG_CREATOR_NAME", "Log Creator Name"], ["LOG_TEXT", "Log Text"], ["EVENT_DETAILS", "Event Description"], ["EVENT_CREATOR_MEMBER_NAME", "Event Creator Name"]];
  columnsMeeting: string[][] = [["CREATED_DATE_TIME", "Date Time"], ["LOG_CREATOR_NAME", "Log Creator Name"], ["LOG_TEXT", "Log Text"], ["MEETING_SUB", "Meeting Subject"], ["MEETING_CREATOR_MEMBER_NAME", "Meeting Creator Name"]];
  columnsCircular: string[][] = [["CREATED_DATE_TIME", "Date Time"], ["LOG_CREATOR_NAME", "Log Creator Name"], ["LOG_TEXT", "Log Text"], ["CIRCULAR_NAME", "Circular Name"], ["CIRCULAR_CREATOR_MEMBER_NAME", "Circular Creator Name"]];
  columnsProject: string[][] = [["CREATED_DATE_TIME", "Date Time"], ["LOG_CREATOR_NAME", "Log Creator Name"], ["LOG_TEXT", "Log Text"], ["PROJECT_NAME", "Project Name"], ["PROJECT_CREATOR_MEMBER_NAME", "Project Creator Name"]];
  drawerVisible: boolean;
  drawerTitle: string;
  Col1: boolean = true;
  Col2: boolean = true;
  Col3: boolean = true;
  Col4: boolean = true;
  Col5: boolean = true;
  Col6: boolean = true;
  Col7: boolean = true;
  Col8: boolean = true;
  isSpinning: boolean = false;
  datePlaceHolder: string[] = ["From Date", "To Date"];

  federationID: number;
  unitID: number;
  groupID: number;

  homeFederationID: number;
  homeUnitID: number;
  homeGroupID: number;

  FROM_TO_DATE: any[] = [];

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService, private _exportService: ExportService) { }

  ngOnInit() {
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
  }

  onSearching(): void {
    document.getElementById("button1").focus();
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true);
  }

  search(reset: boolean = false): void {
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
    if (this.searchText != "" && this.radioValue == "P") {
      likeQuery = " AND (";

      this.columnsPost.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });
    }

    if (this.searchText != "" && this.radioValue == "M") {
      likeQuery = " AND (";

      this.columnsMeeting.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });
    }

    if (this.searchText != "" && this.radioValue == "C") {
      likeQuery = " AND (";

      this.columnsCircular.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });
    }

    if (this.searchText != "" && this.radioValue == "E") {
      likeQuery = " AND (";

      this.columnsPost.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });
    }

    if (this.searchText != "" && this.radioValue == "R") {
      likeQuery = " AND (";

      this.columnsProject.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });
    }

    if (likeQuery != "") {
      likeQuery += " " + "FEDERATION_NAME" + " like '%" + this.searchText + "%' OR";
      likeQuery += " " + "UNIT_NAME" + " like '%" + this.searchText + "%' OR";
      likeQuery += " " + "GROUP_NAME" + " like '%" + this.searchText + "%' OR";
      likeQuery = likeQuery.substring(0, likeQuery.length - 3) + ')';
    }

    // Unit filter
    let unitNameFilter = "";
    let unitNameString = "";

    if (this.UNIT_NAME.length > 0) {
      for (let i = 0; i < this.UNIT_NAME.length; i++) {
        unitNameString = unitNameString + "'" + this.UNIT_NAME[i] + "',";
      }

      unitNameString = unitNameString.substring(0, unitNameString.length - 1);
      unitNameFilter = " AND UNIT_ID IN (" + unitNameString + ")";
    }

    // Group filter
    let groupNameFilter = "";
    let groupNameString = "";

    if (this.GROUP_NAME.length > 0) {
      for (let i = 0; i < this.GROUP_NAME.length; i++) {
        groupNameString = groupNameString + "'" + this.GROUP_NAME[i] + "',";
      }

      groupNameString = groupNameString.substring(0, groupNameString.length - 1);
      groupNameFilter = " AND GROUP_ID IN (" + groupNameString + ")";
    }

    // Date filter
    let fromToDateFilter = "";

    if (this.FROM_TO_DATE.length > 0) {
      fromToDateFilter = " AND CREATED_DATE_TIME BETWEEN '" + this.datePipe.transform(this.FROM_TO_DATE[0], "yyyy-MM-dd 00:00:00") + "' AND '" + this.datePipe.transform(this.FROM_TO_DATE[1], "yyyy-MM-dd 23:59:59") + "'";
    }

    // Federation fiter
    let federationFilter = "";

    if ((this.federationID == 0) && (this.unitID == 0) && (this.groupID == 0)) {
      federationFilter = " AND FEDERATION_ID=" + this.FEDERATION_NAME;

    } else {
      federationFilter = " AND FEDERATION_ID=" + this.homeFederationID;
    }

    this.loadingRecords = true;

    this.api.getActivityReport(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + federationFilter + unitNameFilter + groupNameFilter + fromToDateFilter, this.radioValue).subscribe(data => {
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

  onTypeSelectionChange(btnValue: any): void {
    this.radioValue = btnValue;
    this.search(true);
  }

  units: any[] = [];
  UNIT_NAME: any[] = [];
  isUnitLoading: boolean = false;

  getUnits(unitName: string): void {
    if (unitName.length >= 3) {
      // Federation filter
      let federationFilter = "";

      if (this.federationID > 0) {
        federationFilter = " AND FEDERATION_ID=" + this.homeFederationID;
      }

      //  Unit filter
      let unitFilter = "";

      if (this.unitID > 0) {
        unitFilter = " AND ID=" + this.unitID;
      }

      this.isUnitLoading = true;

      this.api.getAllUnits(0, 0, "ID", "ASC", " AND STATUS=1 AND NAME LIKE '%" + unitName + "%'" + federationFilter + unitFilter).subscribe(data => {
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
    this.groups = [];
    this.GROUP_NAME = [];
    this.search(true);
  }

  isGroupLoading: boolean = false;
  groups: any[] = [];
  GROUP_NAME: any[] = [];

  getGroups(groupName: string): void {
    if (groupName.length >= 3) {
      // Federation filter
      let federationFilter = "";

      if (this.federationID > 0) {
        federationFilter = " AND FEDERATION_ID=" + this.homeFederationID;
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

      this.isGroupLoading = true;

      this.api.getAllGroups(0, 0, "NAME", "ASC", " AND STATUS=1 AND NAME LIKE '%" + groupName + "%'" + federationFilter + unitFilter + unitNameFilter).subscribe(data => {
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
  }

  getGroupInfo(groupNames: any): void {
    this.search(true);
  }

  fromToDateChange(date: any): void {
    this.search(true);
  }

  federations: any[] = [];
  FEDERATION_NAME: any;
  isFederationLoading: boolean = false;

  getFederations(): void {
    // Fderation filter
    let federationFilter = "";

    if (this.federationID > 0) {
      federationFilter = " AND ID=" + this.federationID;
    }

    this.isFederationLoading = true;

    this.api.getAllFederations(0, 0, "ID", "ASC", " AND STATUS=1" + federationFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.isFederationLoading = false;
        this.federations = data['data'];
        this.FEDERATION_NAME = data['data'][0].ID;
        this.search(true);
      }

    }, err => {
      this.isFederationLoading = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  onFederationChange(federationID: number): void {
    this.FEDERATION_NAME = federationID;
    this.search(true);
  }
}
