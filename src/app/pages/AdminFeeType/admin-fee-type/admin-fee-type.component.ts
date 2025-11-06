import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { AdminFeeTypeDrawerComponent } from '../admin-fee-type-drawer/admin-fee-type-drawer.component';

@Component({
  selector: 'app-admin-fee-type',
  templateUrl: './admin-fee-type.component.html',
  styleUrls: ['./admin-fee-type.component.css']
})

export class AdminFeeTypeComponent implements OnInit {
  formTitle: string = "International Fee Structure";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList: any[] = [];
  loadingRecords: boolean = true;
  sortKey: string = "id";
  sortValue: string = "asc";
  searchText: string = "";
  filterQuery: string = "";
  columns: string[][] = [["YEAR", "Year"], ["FEE_TYPE", "Fee Type"], ["QUARTER", "Joining Quarter"], ["EXPIRY_DATE", "Expiry Date"], ["SAHELI", "Saheli's Fee"], ["NORMAL", "Main's Fee"], ["YOUNG", "Young's Fee"]];
  drawerVisible: boolean = false;
  drawerTitle: string;
  isSpinning: boolean = false;

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  feeDetails: any[] = [];

  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private _cookie: CookieService,
    private _exportService: ExportService) { }

  ngOnInit() {
    this.search(true);
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

    if (this.searchText != "") {
      likeQuery = " AND (";

      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    this.loadingRecords = true;

    this.api
      .getAdminFeeStructure(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery)
      .subscribe(data => {
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

  onSearching(): void {
    document.getElementById("button1").focus();
    this.search(true);
  }

  today = new Date().setDate(new Date().getDate());

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) > 0;

  disabledExpiryDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) < 0;

  @ViewChild(AdminFeeTypeDrawerComponent, { static: false }) AdminFeeTypeDrawerComponentvar: AdminFeeTypeDrawerComponent;

  addNewFee(): void {
    this.drawerTitle = "aaa " + "Add International Fee Structure";
    this.drawerVisible = true;
    this.AdminFeeTypeDrawerComponentvar.YEAR = undefined;

    this.feeDetails = [
      { FEE_TYPE: 'Joining Fee', QUARTER: 'NA', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      { FEE_TYPE: 'Joining Year Membership Fee', QUARTER: 'Q1', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      { FEE_TYPE: 'Joining Year Membership Fee', QUARTER: 'Q2', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      { FEE_TYPE: 'Joining Year Membership Fee', QUARTER: 'Q3', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      { FEE_TYPE: 'Joining Year Membership Fee', QUARTER: 'Q4', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      // { FEE_TYPE: 'Next Year Membership Fee', QUARTER: 'Q1', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      // { FEE_TYPE: 'Next Year Membership Fee', QUARTER: 'Q2', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      // { FEE_TYPE: 'Next Year Membership Fee', QUARTER: 'Q3', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      // { FEE_TYPE: 'Next Year Membership Fee', QUARTER: 'Q4', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      // { FEE_TYPE: 'System Fee', QUARTER: 'NA', SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 }
    ];
  }

  drawerClose(): void {
    this.search(false);
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
}
