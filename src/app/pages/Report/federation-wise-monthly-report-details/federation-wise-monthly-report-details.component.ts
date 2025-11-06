import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-federation-wise-monthly-report-details',
  templateUrl: './federation-wise-monthly-report-details.component.html',
  styleUrls: ['./federation-wise-monthly-report-details.component.css']
})

export class FederationWiseMonthlyReportDetailsComponent implements OnInit {
  formTitle: string = "Federation Wise Monthly Reporting Submission Count";
  dataList: any[] = [];
  loadingRecords: boolean = false;
  totalRecords: number = 1;
  pageIndex: number = 1;
  pageSize: number = 10;
  sortValue: string = "asc";
  sortKey: string = "FEDERATION_NAME";
  searchText: string = "";
  isFilterApplied: any = "default";
  filterClass: string = 'filter-invisible';
  columns: string[][] = [["FEDERATION_NAME", "Federation Name"]];
  monthColumns: any[] = [];

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  homeFederationID: number = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
  homeUnitID: number = Number(sessionStorage.getItem("HOME_UNIT_ID"));
  homeGroupID: number = Number(sessionStorage.getItem("HOME_GROUP_ID"));

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _exportService: ExportService, private _cookie: CookieService) { }

  ngOnInit() {
    this.getIDs();
    this.getFederations();
    this.getMonthList();
  }

  getIDs(): void {
    this.federationID = Number(sessionStorage.getItem("FEDERATION_ID"));
    this.unitID = Number(sessionStorage.getItem("UNIT_ID"));
    this.groupID = Number(sessionStorage.getItem("GROUP_ID"));

    this.homeFederationID = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
    this.homeUnitID = Number(sessionStorage.getItem("HOME_UNIT_ID"));
    this.homeGroupID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
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
    if (this.searchText != "") {
      likeQuery = " AND";

      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }

    // Federation filter
    let federationFilter = "";

    if ((this.federationID == 0) && (this.unitID == 0) && (this.groupID == 0)) {
      federationFilter = " AND FEDERATION_ID=" + this.FEDERATION_NAME;

    } else {
      federationFilter = " AND FEDERATION_ID=" + this.homeFederationID;
    }

    this.loadingRecords = true;

    this.api.getFederationWiseMonthlyReportDetails(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + federationFilter, new Date().getFullYear()).subscribe(data => {
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

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true);
  }

  getMonthList(): void {
    this.monthColumns = [];
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();

    for (let i = 4; i <= currentMonth; i++) {
      if (i == 4) {
        this.monthColumns.push(["APRIL", "April " + currentYear]);
      }

      if (i == 5) {
        this.monthColumns.push(["MAY", "May " + currentYear]);
      }

      if (i == 6) {
        this.monthColumns.push(["JUNE", "June " + currentYear]);
      }

      if (i == 7) {
        this.monthColumns.push(["JULY", "July " + currentYear]);
      }

      if (i == 8) {
        this.monthColumns.push(["AUGUST", "August " + currentYear]);
      }

      if (i == 9) {
        this.monthColumns.push(["SEPTEMBER", "September " + currentYear]);
      }

      if (i == 10) {
        this.monthColumns.push(["OCTOBER", "October " + currentYear]);
      }

      if (i == 11) {
        this.monthColumns.push(["NOVEMBER", "November " + currentYear]);
      }

      if (i == 12) {
        this.monthColumns.push(["DECEMBAR", "December " + currentYear]);
      }

      if (i == 1) {
        this.monthColumns.push(["JANUARY", "January " + currentYear]);
      }

      if (i == 2) {
        this.monthColumns.push(["FEBRUARY", "February " + currentYear]);
      }

      if (i == 3) {
        this.monthColumns.push(["MARCH", "March " + currentYear]);
      }
    }
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
