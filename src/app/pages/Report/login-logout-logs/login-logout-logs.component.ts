import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-login-logout-logs',
  templateUrl: './login-logout-logs.component.html',
  styleUrls: ['./login-logout-logs.component.css']
})

export class LoginLogoutLogsComponent implements OnInit {
  formTitle: string = "Login-Logout Logs";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList: any[] = [];
  exportDataList: any[] = [];
  loadingRecords: boolean = false;
  sortKey: string = "id";
  sortValue: string = "desc";
  searchText: string = "";
  filterQuery: string = "";
  columns: string[][] = [["NAME", "Member Name"], ["LOGIN_DATE_TIME", "Login Date Time"], ["LOGOUT_DATE_TIME", "Logout Date Time"]];
  isSpinning: boolean = false;
  datePlaceHolder: string[] = ["Login From Date", "Login To Date"];

  federationID: number;
  unitID: number;
  groupID: number;

  homeFederationID: number;
  homeUnitID: number;
  homeGroupID: number;

  FROM_TO_DATE: any[] = [];
  exportLoading: boolean = false;

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

  search(reset: boolean = false, exportToExcel: boolean = false, exportToPDF: boolean = false): void {
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

    if (this.searchText.trim() != "") {
      likeQuery = " AND (";

      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });
    }

    if (likeQuery != "") {
      likeQuery = likeQuery.substring(0, likeQuery.length - 3) + ')';
    }

    // Date filter
    let fromToDateFilter = "";

    if (this.FROM_TO_DATE.length > 0) {
      fromToDateFilter = " AND LOGIN_DATE_TIME BETWEEN '" + this.datePipe.transform(this.FROM_TO_DATE[0], "yyyy-MM-dd 00:00:00") + "' AND '" + this.datePipe.transform(this.FROM_TO_DATE[1], "yyyy-MM-dd 23:59:59") + "'";
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

    // Federation filter
    let federationFilter = "";

    if ((this.federationID == 0) && (this.unitID == 0) && (this.groupID == 0)) {
      federationFilter = " AND FEDERATION_ID=" + this.FEDERATION_NAME;

    } else {
      federationFilter = " AND FEDERATION_ID=" + this.homeFederationID;
    }

    if (exportToExcel) {
      this.exportLoading = true;

      this.api.getLoginLogoutReport(0, 0, this.sortKey, sort, likeQuery + federationFilter + unitNameFilter + groupNameFilter + fromToDateFilter).subscribe(data => {
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

      this.api.getLoginLogoutReport(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + federationFilter + unitNameFilter + groupNameFilter + fromToDateFilter).subscribe(data => {
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

  units: any[] = [];
  UNIT_NAME: any[] = [];
  isUnitLoading: boolean = false;

  getUnits(unitName: string): void {
    if (unitName.length >= 3) {
      this.isUnitLoading = true;

      this.api.getAllUnits(0, 0, "NAME", "asc", " AND STATUS=1 AND NAME LIKE '%" + unitName + "%' AND FEDERATION_ID=" + this.homeFederationID).subscribe(data => {
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

      this.api.getAllGroups(0, 0, "NAME", "asc", " AND STATUS=1 AND NAME LIKE '%" + groupName + "%' AND FEDERATION_ID=" + this.homeFederationID + unitNameFilter).subscribe(data => {
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

  importInExcel(): void {
    this.search(false, true);
  }

  convertInExcel(): void {
    let arry1: any[] = [];
    let obj1: any = new Object();

    for (let i = 0; i < this.exportDataList.length; i++) {
      obj1['Sr. No.'] = i + 1;
      obj1['Federation Name'] = this.exportDataList[i]['FEDERATION_NAME'];
      obj1['Unit Name'] = this.exportDataList[i]['UNIT_NAME'];
      obj1['Group Name'] = this.exportDataList[i]['GROUP_NAME'];
      obj1['Member Name'] = this.exportDataList[i]['NAME'];
      obj1['Login Date Time'] = this.datePipe.transform(this.exportDataList[i]["LOGIN_DATE_TIME"], "dd-MMM-yy hh:mm:ss a");
      obj1['Logout Date Time'] = this.datePipe.transform(this.exportDataList[i]["LOGOUT_DATE_TIME"], "dd-MMM-yy hh:mm:ss a");

      arry1.push(Object.assign({}, obj1));
    }

    this._exportService.exportExcel(arry1, this.formTitle + ' ' + this.datePipe.transform(new Date(), 'dd-MMM-yy, hh mm ss a'));
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
