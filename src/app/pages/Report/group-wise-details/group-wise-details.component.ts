import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-group-wise-details',
  templateUrl: './group-wise-details.component.html',
  styleUrls: ['./group-wise-details.component.css']
})

export class GroupWiseDetailsComponent implements OnInit {
  formTitle: string = "Group Status Report";
  dataList: any[] = [];
  exportDataList: any[] = [];
  loadingRecords: boolean = false;
  totalRecords: number = 1;
  pageIndex: number = 1;
  pageSize: number = 10;
  sortKey: string = "UNIT_ID";
  sortValue: string = "asc";
  searchText: string = "";
  isFilterApplied: any = "default";
  filterClass: string = 'filter-invisible';
  columns: string[][] = [["NAME", "Group Name"], ["BOD_2022_23", "BOD"], ["MAILING_LIST", "M.L."], ["PAID_2022", "2022"], ["PAID_2023", "2023"], ["PEROID", "Period"], ["MEMBER_COUNT", "New Member Count"], ["NCF_MEMBER_COUNT", "NCF Member Count"]];

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
    this.search(true);
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

    // Calculate total
    if (!exportToExcel) {
      this.PAID_1 = 0;
      this.PAID_2 = 0;
      this.MEMBER_COUNT = 0;
      this.NCF_MEMBER_COUNT = 0;
      let dataListForTotal: any[] = [];

      this.api.getGroupStatusWiseReport(0, 0, this.sortKey, sort, likeQuery + federationFilter + unitFilter + unitNameFilter, this.SELECTED_YEAR).subscribe(data => {
        if (data['code'] == 200) {
          dataListForTotal = data['data'];

          for (let i = 0; i < dataListForTotal.length; i++) {
            this.PAID_1 = this.PAID_1 + dataListForTotal[i]["PAID_" + (this.SELECTED_YEAR - 1)];
            this.PAID_2 = this.PAID_2 + dataListForTotal[i]["PAID_" + (this.SELECTED_YEAR)];
            this.MEMBER_COUNT = this.MEMBER_COUNT + dataListForTotal[i]["MEMBER_COUNT"];
            this.NCF_MEMBER_COUNT = this.NCF_MEMBER_COUNT + dataListForTotal[i]["NCF_MEMBER_COUNT"];
          }
        }

      }, err => {
        console.log(err);
      });
    }

    if (exportToExcel) {
      this.exportLoading = true;

      this.api.getGroupStatusWiseReport(0, 0, this.sortKey, sort, likeQuery + federationFilter + unitFilter + unitNameFilter, this.SELECTED_YEAR).subscribe(data => {
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

      this.api.getGroupStatusWiseReport(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + federationFilter + unitFilter + unitNameFilter, this.SELECTED_YEAR).subscribe(data => {
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
    this.search(true);
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
    this.search(true);
  }

  importInExcel(): void {
    this.search(false, true);
  }

  convertInExcel(): void {
    let arry1 = [];
    let obj1: any = new Object();

    for (let i = 0; i < this.exportDataList.length; i++) {
      obj1['Sr. No.'] = i + 1;
      obj1['Unit Name'] = this.exportDataList[i]['UNIT_NAME'];
      obj1['Group Name'] = this.exportDataList[i]['NAME'];
      obj1['B.O.D.'] = this.exportDataList[i]['BOD_2022_23'] ? this.exportDataList[i]['BOD_2022_23'] : "NO";
      obj1['M.L.'] = this.exportDataList[i]['MAILING_LIST'] ? this.exportDataList[i]['MAILING_LIST'] : "NO";
      obj1['Paid Membership ' + (this.SELECTED_YEAR - 1)] = this.exportDataList[i]["PAID_" + (this.SELECTED_YEAR - 1)];
      obj1['Paid Membership ' + this.SELECTED_YEAR] = this.exportDataList[i]["PAID_" + (this.SELECTED_YEAR)];
      obj1['Period'] = this.exportDataList[i]['PEROID'];
      obj1['New Member(s)'] = this.exportDataList[i]['MEMBER_COUNT'];
      obj1['NCF Member(s)'] = this.exportDataList[i]['NCF_MEMBER_COUNT'];

      arry1.push(Object.assign({}, obj1));

      if (i == this.exportDataList.length - 1) {
        obj1['Sr. No.'] = "Total";
        obj1['Unit Name'] = "---";
        obj1['Group Name'] = "---";
        obj1['B.O.D.'] = "---";
        obj1['M.L.'] = "---";
        obj1['Paid Membership ' + (this.SELECTED_YEAR - 1)] = this.PAID_1;
        obj1['Paid Membership ' + this.SELECTED_YEAR] = this.PAID_2;
        obj1['Period'] = "---";
        obj1['New Member(s)'] = this.MEMBER_COUNT;
        obj1['NCF Member(s)'] = this.NCF_MEMBER_COUNT;

        arry1.push(Object.assign({}, obj1));
      }
    }

    this._exportService.exportExcel(arry1, this.formTitle + ' ' + this.datePipe.transform(new Date(), 'dd-MMM-yy, hh mm ss a'));
  }
}
