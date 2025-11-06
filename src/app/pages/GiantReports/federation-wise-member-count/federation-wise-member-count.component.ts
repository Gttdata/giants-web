import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-federation-wise-member-count',
  templateUrl: './federation-wise-member-count.component.html',
  styleUrls: ['./federation-wise-member-count.component.css']
})

export class FederationWiseMemberCountComponent implements OnInit {
  passwordVisible: boolean = false;
  formTitle: string = "Federation Wise Member Count";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList: any[] = [];
  loadingRecords: boolean = true;
  sortKey: string = "id";
  sortValue: string = "desc";
  searchText: string = "";
  filterQuery: string = "";
  columns: string[][] = [["FEDERATION_NAME", "Federation"], ["MEMBER_COUNT", "Count"]];
  columns1: string[][] = [["FEDERATION_NAME", "Federation"]];
  drawerVisible: boolean;
  drawerTitle: string;
  isSpinning: boolean = false;

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService, private _exportService: ExportService) { }

  ngOnInit() {
    this.getFederations();
    this.search(true);
    this.isFilterApplied = "default";
    this.filterClass = "filter-invisible";
  }

  federations = [];

  getFederations() {
    var federationFilter = "";

    if (this.federationID != 0) {
      federationFilter = " AND ID=" + this.federationID;
    }

    var unitFilter = "";

    if (this.unitID != 0) {
      unitFilter = " AND ID=(SELECT FEDERATION_ID FROM unit_master WHERE ID=" + this.unitID + ")";
    }

    var groupFilter = "";

    if (this.groupID != 0) {
      groupFilter = " AND ID=(SELECT FEDERATION_ID FROM unit_master WHERE ID=(SELECT UNIT_ID FROM group_master WHERE ID=" + this.groupID + "))";
    }

    this.federations = [];

    this.api.getAllFederations(0, 0, "NAME", "asc", " AND STATUS=1" + federationFilter + unitFilter + groupFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.federations = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true);
  }

  search(reset: boolean = false, exportToExcel: boolean = false, exportToPDF: boolean = false) {
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

      this.columns1.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    var federationFilter = "";

    if (this.federationID != 0) {
      federationFilter = " AND FEDERATION_ID=" + this.federationID;
    }

    var unitFilter = "";

    if (this.unitID != 0) {
      unitFilter = " AND UNIT_ID=" + this.unitID;
    }

    var groupFilter = "";

    if (this.groupID != 0) {
      groupFilter = " AND GROUP_ID=" + this.groupID;
    }

    var federationFilterStr = "";

    if (this.FEDERATION_ID.length > 0) {
      federationFilterStr = " AND FEDERATION_ID IN (" + this.FEDERATION_ID + ")";
    }

    this.loadingRecords = true;

    this.api.getFederationWiseMemberCount(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + federationFilter + unitFilter + groupFilter + federationFilterStr + " AND ACTIVE_STATUS='A'").subscribe(data => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.dataList = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    if (exportToExcel) {
      this.exportLoading = true;

      this.api.getFederationWiseMemberCount(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + federationFilter + unitFilter + groupFilter + federationFilterStr + " AND ACTIVE_STATUS='A'").subscribe(data => {
        if (data['code'] == 200) {
          this.exportLoading = false;
          this.dataListForExport = data['data'];
          this.convertInExcel();
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });

    } else if (exportToPDF) {
      this.exportInPDFLoading = true;

      this.api.getFederationWiseMemberCount(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + federationFilter + unitFilter + groupFilter + federationFilterStr + " AND ACTIVE_STATUS='A'").subscribe(data => {
        if (data['code'] == 200) {
          this.exportInPDFLoading = false;
          this.dataListForExport = data['data'];
          this.isPDFModalVisible = true;
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });

    } else {
      this.loadingRecords = true;

      this.api.getFederationWiseMemberCount(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + federationFilter + unitFilter + groupFilter + federationFilterStr + " AND ACTIVE_STATUS='A'").subscribe(data => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  onSearching() {
    document.getElementById("button1").focus();
    this.search(true);
  }

  getGenderFullForm(gender) {
    if (gender == "M")
      return "Male";

    else if (gender == "F")
      return "Female";

    else if (gender == "O")
      return "Other";
  }

  getMaritalStatusFullForm(gender) {
    if (gender == "S")
      return "Single";

    else if (gender == "M")
      return "Married";

    else if (gender == "W")
      return "Widowed";

    else if (gender == "D")
      return "Divorced";

    else if (gender == "S")
      return "Separated";
  }

  getActiveStatus(status) {
    if (status == "P")
      return "Pending";

    else
      return "Active";
  }

  today = new Date().setDate(new Date().getDate());

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) > 0;

  disabledExpiryDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) < 0;

  isFilterApplied: string = "default";
  filterClass: string = "filter-visible";

  showFilter(): void {
    if (this.filterClass === "filter-visible")
      this.filterClass = "filter-invisible";

    else
      this.filterClass = "filter-visible";
  }

  MEMBERSHIP_START_DATE = [];
  MEMBERSHIP_EXPIRY_DATE = [];
  FEDERATION_ID = [];

  clearFilter() {
    this.isFilterApplied = "default";
    this.filterClass = "filter-invisible";
    this.MEMBERSHIP_START_DATE = [];
    this.MEMBERSHIP_EXPIRY_DATE = [];
    this.FEDERATION_ID = [];
    this.search(true);
  }

  applyFilter() {
    if ((this.MEMBERSHIP_START_DATE.length > 0) || (this.MEMBERSHIP_EXPIRY_DATE.length > 0) || (this.FEDERATION_ID.length > 0))
      this.isFilterApplied = "primary";

    else
      this.isFilterApplied = "default";

    this.search(true);
    this.filterClass = "filter-invisible";
  }

  exportLoading: boolean = false;
  dataListForExport = [];
  exportInPDFLoading: boolean = false;
  isPDFModalVisible: boolean = false;

  importInExcel() {
    this.search(true, true);
  }

  convertInExcel() {
    var arry1 = [];
    var obj1: any = new Object();

    for (var i = 0; i < this.dataListForExport.length; i++) {
      obj1['Federation'] = this.dataListForExport[i]['FEDERATION_NAME'];
      obj1['Member Count'] = this.dataListForExport[i]['MEMBER_COUNT'];

      arry1.push(Object.assign({}, obj1));

      if (i == this.dataListForExport.length - 1) {
        this._exportService.exportExcel(arry1, 'Federation Wise Member Count ' + this.datePipe.transform(new Date(), 'dd-MMM-yy, hh mm ss a'));
      }
    }
  }
}
