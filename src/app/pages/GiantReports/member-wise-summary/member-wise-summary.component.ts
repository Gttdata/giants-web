import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { Membermaster } from 'src/app/Models/MemberMaster';
import { ApiService } from 'src/app/Service/api.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-member-wise-summary',
  templateUrl: './member-wise-summary.component.html',
  styleUrls: ['./member-wise-summary.component.css']
})

export class MemberWiseSummaryComponent implements OnInit {
  passwordVisible: boolean = false;
  formTitle: string = "Member Details";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList: any[] = [];
  loadingRecords: boolean = true;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  columns: string[][] = [["FEDERATION_NAME", "Federation"], ["UNIT_NAME", "Unit"], ["GROUP_NAME", "Group"], ["NAME", "Member Name"], ["MOBILE_NUMBER", "Mobile No."], ["GENDER", "Gender"], ["MARITAL_STATUS", "Marital Status"], ["MEMBERSHIP_DATE", "Membership Date"], ["EXPIRY_DATE", "Expiry Date"], ["ADDRESS1", "Address 1"], ["ADDRESS2", "Address 2"], ["CITY", "City"], ["PINCODE", "Pincode"]];
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: Membermaster = new Membermaster();
  isSpinning: boolean = false;
  federationID = this._cookie.get("FEDERATION_ID");
  unitID = this._cookie.get("UNIT_ID");
  groupID = this._cookie.get("GROUP_ID");

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
    if (this.federationID != "0") {
      federationFilter = " AND ID=" + this.federationID;
    }

    var unitFilter = "";
    if (this.unitID != "0") {
      unitFilter = " AND ID=(SELECT FEDERATION_ID FROM unit_master WHERE ID=" + this.unitID + ")";
    }

    var groupFilter = "";
    if (this.groupID != "0") {
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

  units = [];

  getUnits(federationID: any) {
    var unitFilter = "";
    if (this.unitID != "0") {
      unitFilter = " AND ID=" + this.unitID;
    }

    var groupFilter = "";
    if (this.groupID != "0") {
      groupFilter = " AND ID=(SELECT UNIT_ID FROM group_master WHERE ID=" + this.groupID + ")";
    }

    this.units = [];
    this.UNIT_ID = [];

    this.groups = [];
    this.GROUP_ID = [];

    this.api.getAllUnits(0, 0, "NAME", "asc", " AND FEDERATION_ID IN (" + federationID + ") AND STATUS=1" + unitFilter + groupFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.units = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  groups = [];

  getGroups(unitID: any) {
    var groupFilter = "";
    if (this.groupID != "0") {
      groupFilter = " AND ID=" + this.groupID;
    }

    this.groups = [];
    this.GROUP_ID = [];

    this.api.getAllGroups(0, 0, "NAME", "asc", " AND UNIT_ID IN (" + unitID + ") AND STATUS=1" + groupFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.groups = data['data'];
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

      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    var federationFilter = "";
    if (this.federationID != "0") {
      federationFilter = " AND FEDERATION_ID=" + this.federationID;
    }

    var unitFilter = "";
    if (this.unitID != "0") {
      unitFilter = " AND UNIT_ID=" + this.unitID;
    }

    var groupFilter = "";
    if (this.groupID != "0") {
      groupFilter = " AND GROUP_ID=" + this.groupID;
    }

    var membershipStartDateFilter = "";
    if ((this.MEMBERSHIP_START_DATE != undefined) && (this.MEMBERSHIP_START_DATE.length != 0)) {
      membershipStartDateFilter = " AND (MEMBERSHIP_DATE BETWEEN '" + this.datePipe.transform(this.MEMBERSHIP_START_DATE[0], 'yyyy-MM-dd 00:00:00') + "' AND '" + this.datePipe.transform(this.MEMBERSHIP_START_DATE[1], 'yyyy-MM-dd 23:59:59') + "')";
    }

    var membershipEndDateFilter = "";
    if ((this.MEMBERSHIP_EXPIRY_DATE != undefined) && (this.MEMBERSHIP_EXPIRY_DATE.length != 0)) {
      membershipEndDateFilter = " AND (EXPIRY_DATE BETWEEN '" + this.datePipe.transform(this.MEMBERSHIP_EXPIRY_DATE[0], 'yyyy-MM-dd 00:00:00') + "' AND '" + this.datePipe.transform(this.MEMBERSHIP_EXPIRY_DATE[1], 'yyyy-MM-dd 23:59:59') + "')";
    }

    var federationFilterStr = "";
    if (this.FEDERATION_ID.length > 0) {
      federationFilterStr = " AND FEDERATION_ID IN (" + this.FEDERATION_ID + ")";
    }

    var unitFilterStr = "";
    if (this.UNIT_ID.length > 0) {
      unitFilterStr = " AND UNIT_ID IN (" + this.UNIT_ID + ")";
    }

    var groupFilterStr = "";
    if (this.GROUP_ID.length > 0) {
      groupFilterStr = " AND GROUP_ID IN (" + this.GROUP_ID + ")";
    }

    if (exportToExcel) {
      this.exportLoading = true;

      this.api.getAllMembers(0, 0, this.sortKey, sort, likeQuery + federationFilter + unitFilter + groupFilter + membershipStartDateFilter + membershipEndDateFilter + federationFilterStr + unitFilterStr + groupFilterStr).subscribe(data => {
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

      this.api.getAllMembers(0, 0, this.sortKey, sort, likeQuery + federationFilter + unitFilter + groupFilter + membershipStartDateFilter + membershipEndDateFilter + federationFilterStr + unitFilterStr + groupFilterStr).subscribe(data => {
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

      this.api.getAllMembers(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + federationFilter + unitFilter + groupFilter + membershipStartDateFilter + membershipEndDateFilter + federationFilterStr + unitFilterStr + groupFilterStr).subscribe(data => {
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

  onSearching(): void {
    document.getElementById("button1").focus();
  }

  onStatusChange(data: Membermaster, status): void {
    data.STATUS = status;

    // this.api.updateGroup(data).subscribe(successCode => {
    //   if (successCode['code'] == 200)
    //     this.message.success("Status Updated Successfully", "");

    //   else
    //     this.message.error("Failed to Update Status", "");

    //   this.search();
    // });
  }

  getGenderFullForm(gender: string): string {
    if (gender == "M")
      return "Male";

    else if (gender == "F")
      return "Female";

    else if (gender == "O")
      return "Other";
  }

  getMaritalStatusFullForm(status: string): string {
    if (status == "S")
      return "Single";

    else if (status == "M")
      return "Married";

    else if (status == "W")
      return "Widowed";

    else if (status == "D")
      return "Divorced";

    else if (status == "E")
      return "Separated";
  }

  memberPaymentDrawerVisible: boolean;
  memberPaymentDrawerTitle: string;
  memberPaymentDrawerData: Membermaster = new Membermaster();

  makePayment(data: Membermaster): void {
    this.memberPaymentDrawerTitle = "Payment Details";
    this.memberPaymentDrawerData = Object.assign({}, data);
    this.memberPaymentDrawerVisible = true;
  }

  memberPaymentDrawerClose(): void {
    this.search();
    this.memberPaymentDrawerVisible = false;
  }

  get memberPaymentCloseCallback() {
    return this.memberPaymentDrawerClose.bind(this);
  }

  getActiveStatus(status: string): string {
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

  MEMBERSHIP_START_DATE: any[] = [];
  MEMBERSHIP_EXPIRY_DATE: any[] = [];
  FEDERATION_ID: any[] = [];
  UNIT_ID: any[] = [];
  GROUP_ID: any[] = [];

  clearFilter(): void {
    this.isFilterApplied = "default";
    this.filterClass = "filter-invisible";
    this.MEMBERSHIP_START_DATE = [];
    this.MEMBERSHIP_EXPIRY_DATE = [];
    this.FEDERATION_ID = [];
    this.UNIT_ID = [];
    this.GROUP_ID = [];
    this.search(true);
  }

  applyFilter(): void {
    if ((this.MEMBERSHIP_START_DATE.length > 0) || (this.MEMBERSHIP_EXPIRY_DATE.length > 0) || (this.FEDERATION_ID.length > 0) || (this.UNIT_ID.length > 0) || (this.GROUP_ID.length > 0))
      this.isFilterApplied = "primary";

    else
      this.isFilterApplied = "default";

    this.search(true);
    this.filterClass = "filter-invisible";
  }

  exportLoading: boolean = false;
  dataListForExport: any[] = [];
  exportInPDFLoading: boolean = false;
  isPDFModalVisible: boolean = false;

  importInExcel(): void {
    this.search(true, true);
  }

  convertInExcel(): void {
    var arry1 = [];
    var obj1: any = new Object();

    for (var i = 0; i < this.dataListForExport.length; i++) {
      obj1['Federation'] = this.dataListForExport[i]['FEDERATION_NAME'];
      obj1['Unit'] = this.dataListForExport[i]['UNIT_NAME'];
      obj1['Group'] = this.dataListForExport[i]['GROUP_NAME'];
      obj1['Member Name'] = this.dataListForExport[i]['NAME'];
      obj1['Mobile No.'] = this.dataListForExport[i]['MOBILE_NUMBER'];
      obj1['Gender'] = this.getGenderFullForm(this.dataListForExport[i]['GENDER']);
      obj1['Marital Status'] = this.getMaritalStatusFullForm(this.dataListForExport[i]['MARITAL_STATUS']);
      obj1['Membership Date'] = this.datePipe.transform(this.dataListForExport[i]['MEMBERSHIP_DATE'], "dd MMM yyyy");
      obj1['Expiry Date'] = this.datePipe.transform(this.dataListForExport[i]['EXPIRY_DATE'], "dd MMM yyyy");
      obj1['Address 1'] = this.dataListForExport[i]['ADDRESS1'];
      obj1['Address 2'] = this.dataListForExport[i]['ADDRESS2'];
      obj1['City'] = this.dataListForExport[i]['CITY'];
      obj1['Pincode'] = this.dataListForExport[i]['PINCODE'];

      arry1.push(Object.assign({}, obj1));

      if (i == this.dataListForExport.length - 1) {
        this._exportService.exportExcel(arry1, 'Member Wise Details ' + this.datePipe.transform(new Date(), 'dd-MMM-yy, hh mm ss a'));
      }
    }
  }

  getColumnAlign(columnName: string): string {
    if ((columnName == "GROUP_NAME") || (columnName == "NAME") || (columnName == "ADDRESS1") || (columnName == "ADDRESS2")) {
      return 'leftAlign';

    } else {
      return 'centerAlign';
    }
  }
}