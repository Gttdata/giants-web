import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { PaymentCollectionDetails } from 'src/app/Models/PaymentCollectionDetails';
import { PaymentCollection } from 'src/app/Models/PaymentCollection';
import { ApiService } from 'src/app/Service/api.service';
import { AddpaymentComponent } from 'src/app/pages/Payments/addpayment/addpayment.component'
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { MemberspaymentdetailsComponent } from '../memberspaymentdetails/memberspaymentdetails.component';
import { differenceInCalendarDays, setHours } from 'date-fns';

@Component({
  selector: 'app-paymentreceipt',
  templateUrl: './paymentreceipt.component.html',
  styleUrls: ['./paymentreceipt.component.css']
})

export class PaymentreceiptComponent implements OnInit {
  formTitle: string = "Payment";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  totalRecords2: number = 1;
  dataList: any[] = [];
  dataId: any[] = [];
  loadingRecords: boolean = true;
  sortKey: string = "id";
  sortValue: string = "desc";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: string = "default";
  columns: string[][] = [['PAYMENT_REFERENCE_NO', 'PAYMENT_REFERENCE_NO'], ['NARRATION', 'NARRATION'], ['GROUP_NAME', 'GROUP_NAME']];
  advanceFilterColumns: string[][] = [["DATE", "DATE"]];
  advanceFilterColumnsFederationNames: string[][] = [["FEDERATION_NAME", "FEDERATION_NAME"]];
  advanceFilterColumnsUnitNames: string[][] = [["UNIT_NAME", "UNIT_NAME"]];
  advanceFilterColumnsGroupNames: string[][] = [["GROUP_NAME", "GROUP_NAME"]];
  scheduleId = 0;
  empId = 0;
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: PaymentCollection = new PaymentCollection();
  drawerVisible4!: boolean;
  drawerTitle4!: string;
  drawerData4: PaymentCollectionDetails = new PaymentCollectionDetails();
  paymentDetailsID: number;

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  homeFederationID: number = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
  homeUnitID: number = Number(sessionStorage.getItem("HOME_UNIT_ID"));
  homeGroupID: number = Number(sessionStorage.getItem("HOME_GROUP_ID"));

  roleID: number = this.api.roleId;
  currentDate: Date = new Date();
  sum = 0;
  groupIDForSearching: number = 0;
  emitted = false;
  private categoriesSubject = new BehaviorSubject<Array<string>>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor(private _Activatedroute: ActivatedRoute, private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  federations: any[] = [];

  getFederations(): void {
    // Home federation filter
    let homeFederationFilter = "";

    if (this.homeFederationID != 0) {
      homeFederationFilter = " AND ID=" + this.homeFederationID;
    }

    this.federations = [];

    this.api.getAllFederations(0, 0, "NAME", "asc", " AND STATUS=1" + homeFederationFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.federations = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  units: any[] = [];

  getUnits(unitName: string): void {
    if (unitName.length >= 3) {
      // Home federation filter
      let homeFederationFilter = "";

      if (this.homeFederationID != 0) {
        homeFederationFilter = " AND FEDERATION_ID=" + this.homeFederationID;
      }

      this.api.getAllUnits(0, 0, "ID", "asc", " AND STATUS=1 AND NAME LIKE '%" + unitName + "%'" + homeFederationFilter).subscribe(data => {
        if (data['code'] == 200) {
          this.units = data['data'];
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  groups: any[] = [];

  getGroups(groupName: string): void {
    if (groupName.length >= 3) {
      // Home federation filter
      let homeFederationFilter = "";

      if (this.homeFederationID != 0) {
        homeFederationFilter = " AND FEDERATION_ID=" + this.homeFederationID;
      }

      this.api.getAllGroups(0, 0, "NAME", "asc", " AND STATUS=1 AND NAME LIKE '%" + groupName + "%'" + homeFederationFilter).subscribe(data => {
        if (data['code'] == 200) {
          this.groups = data['data'];
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  @HostListener('document:touchmove', ['$event'])
  @HostListener('document:wheel', ['$event'])

  onScroll(e: any): void {
    if (Math.round(document.getElementById("activityItem").scrollTop + document.getElementById("activityItem").offsetHeight + 1) >= document.getElementById("activityItem").scrollHeight && !this.emitted) {
      this.emitted = true;
      this.onScrollingFinished();

    } else if (Math.round(document.getElementById("activityItem").scrollTop + document.getElementById("activityItem").offsetHeight + 1) < document.getElementById("activityItem").scrollHeight) {
      this.emitted = false;
    }
  }

  onScrollingFinished(): void {
    this.loadMore();
  }

  loadMore(): void {
    if (this.getNextItems()) {
      this.categoriesSubject.next(this.dataList);
    }
  }

  getNextItems(): boolean {
    if (this.dataList.length >= this.totalRecords) {
      return false;
    }

    this.search(false, true);
    return true;
  }

  currentGroupDetails: any[] = [];

  ngOnInit() {
    this.groupIDForSearching = Number(this._Activatedroute.snapshot.paramMap.get("group"));

    if (this.groupIDForSearching > 0) {
      this.api.getAllGroups(0, 0, "NAME", "asc", " AND ID=" + this.groupIDForSearching).subscribe(data => {
        if (data['code'] == 200) {
          this.currentGroupDetails = data['data'][0];
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }

    this.getFederations();
    this.search(true);
  }

  search(reset: boolean = false, loadMore: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
      this.top();
    }

    var sort: string;

    try {
      sort = this.sortValue.startsWith("a") ? "asc" : "desc";

    } catch (error) {
      sort = "";
    }

    var likeQuery = "";

    if (this.multipleSearchText.length > 0) {
      for (var i = 0; i < this.multipleSearchText.length; i++) {
        this.columns.forEach(column => {
          likeQuery += " " + column[0] + " like '%" + this.multipleSearchText[i] + "%' OR";
        });
      }

      likeQuery = " AND (" + likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    var advanceLikeQuery = "";

    if (this.advanceMultipleSearchText.length > 0) {
      for (var i = 0; i < this.advanceMultipleSearchText.length; i++) {
        this.advanceFilterColumns.forEach(column => {
          advanceLikeQuery += " (" + column[0] + " BETWEEN '" + this.datePipe.transform(this.ADVANCE_FILTER_FROM_DATE, 'yyyy-MM-dd 00:00:00') + "' AND '" + this.datePipe.transform(this.ADVANCE_FILTER_TO_DATE, 'yyyy-MM-dd 23:59:59') + "') OR";
        });
      }

      advanceLikeQuery = " AND (" + advanceLikeQuery.substring(0, advanceLikeQuery.length - 2) + ')';
    }

    var advanceLikeQueryFederationNames = "";

    if (this.advanceMultipleFederationNames.length > 0) {
      for (var i = 0; i < this.advanceMultipleFederationNames.length; i++) {
        this.advanceFilterColumnsFederationNames.forEach(column => {
          advanceLikeQueryFederationNames += " " + column[0] + " like '%" + this.advanceMultipleFederationNames[i] + "%' OR";
        });
      }

      advanceLikeQueryFederationNames = " AND (" + advanceLikeQueryFederationNames.substring(0, advanceLikeQueryFederationNames.length - 2) + ')';
    }

    var advanceLikeQueryUnitNames = "";

    if (this.advanceMultipleUnitNames.length > 0) {
      for (var i = 0; i < this.advanceMultipleUnitNames.length; i++) {
        this.advanceFilterColumnsUnitNames.forEach(column => {
          advanceLikeQueryUnitNames += " " + column[0] + " like '%" + this.advanceMultipleUnitNames[i] + "%' OR";
        });
      }

      advanceLikeQueryUnitNames = " AND (" + advanceLikeQueryUnitNames.substring(0, advanceLikeQueryUnitNames.length - 2) + ')';
    }

    var advanceLikeQueryGroupNames = "";

    if (this.advanceMultipleGroupNames.length > 0) {
      for (var i = 0; i < this.advanceMultipleGroupNames.length; i++) {
        this.advanceFilterColumnsGroupNames.forEach(column => {
          advanceLikeQueryGroupNames += " " + column[0] + " like '%" + this.advanceMultipleGroupNames[i] + "%' OR";
        });
      }

      advanceLikeQueryGroupNames = " AND (" + advanceLikeQueryGroupNames.substring(0, advanceLikeQueryGroupNames.length - 2) + ')';
    }

    var groupFilterForSearching = "";

    if (this.groupIDForSearching != 0) {
      groupFilterForSearching = " AND GROUP_ID=" + this.groupIDForSearching;
    }

    var globalFederationFilter = "";

    if (sessionStorage.getItem("FILTER") === "MF") {
      globalFederationFilter = " AND FEDERATION_ID=" + this.homeFederationID;
    }

    this.loadingRecords = true;

    this.api.getAllMembershipPayment(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + advanceLikeQuery + advanceLikeQueryFederationNames + advanceLikeQueryUnitNames + advanceLikeQueryGroupNames + groupFilterForSearching + globalFederationFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.totalRecords = data['count'];

        if (loadMore) {
          this.dataList.push(...data['data']);

        } else {
          this.dataList = data['data'];
        }

        this.pageIndex++;
      }

    }, err => {
      this.loadingRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  @ViewChild(AddpaymentComponent, { static: false }) AddpaymentComponentVar: AddpaymentComponent;

  add(): void {
    this.drawerTitle = "aaa " + "Add New Payment";
    this.drawerData = new PaymentCollection();
    this.sum = 0;
    this.drawerVisible = true;
    this.drawerData.DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.AddpaymentComponentVar.PAYMENT_MODE_TYPE = "ONL";
    this.AddpaymentComponentVar.fileURL = null;
    this.drawerData.CHILD_GROUP_AMOUNT = 0;
    this.drawerData.AMOUNT = 0;
    this.AddpaymentComponentVar.CHILD_PARENT_GROUP_AMOUNT = 0;
    this.AddpaymentComponentVar.fileURLToDisplay = "";
    this.AddpaymentComponentVar.displayUploadFile = false;

    // Get Child Group
    this.AddpaymentComponentVar.getChildGroups(this.groupIDForSearching);
  }

  edit(data: PaymentCollection): void {
    this.drawerTitle = "Update Payment Details";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }

  drawerData5: PaymentCollectionDetails = new PaymentCollectionDetails();
  paymentData: any[] = [];
  @ViewChild(MemberspaymentdetailsComponent, { static: false }) MemberspaymentdetailsComponentVar: MemberspaymentdetailsComponent;

  ViewDetails(id: number): void {
    this.drawerTitle4 = "aaa " + "Member Payment Details";
    this.drawerData4 = new PaymentCollectionDetails();
    this.paymentData = [];
    this.drawerVisible4 = true;
    this.paymentDetailsID = id;

    if ((this.paymentDetailsID == null) || ((this.paymentDetailsID).toString() == '') || (this.paymentDetailsID == undefined)) {
      this.paymentData = null;
    }

    var sort: string;
    try {
      sort = this.sortValue.startsWith("a") ? "asc" : "desc";

    } catch (error) {
      sort = "";
    }

    this.MemberspaymentdetailsComponentVar.isSpinning = true;

    this.api.getAllMemberPaymentDetails(0, 0, "MEMBER_NAME", "asc", " AND PAYMENT_COLLECTION_MASTER_ID=" + this.paymentDetailsID).subscribe(data => {
      if (data['code'] == 200) {
        this.MemberspaymentdetailsComponentVar.isSpinning = false;
        this.totalRecords = data['count'];
        this.dataId = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  drawerClose4(): void {
    this.drawerVisible4 = false;
  }

  get closeCallback4() {
    return this.drawerClose4.bind(this);
  }

  drawerClose(): void {
    this.search(true);
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  viewReceipt(fileURL: string): void {
    window.open(this.api.retriveimgUrl + "paymentFiles/" + fileURL);
  }

  multipleSearchText: any[] = [];
  advanceMultipleSearchText: any[] = [];
  today = new Date().setDate(new Date().getDate());
  advanceFilterModalVisible: boolean = false;
  ADVANCE_FILTER_FROM_DATE: Date = null;
  ADVANCE_FILTER_TO_DATE: Date = null;

  addSearchTextForSearching(text: string): void {
    if (text.trim() != "") {
      this.multipleSearchText.push(text);
      this.multipleSearchText = [...new Set(this.multipleSearchText)];
      this.searchText = undefined;
      this.search(true);
    }
  }

  onClose(index: number): void {
    this.multipleSearchText.splice(index, 1);
    this.search(true);
  }

  onAdvanceFilterTagClose(index: number): void {
    this.advanceMultipleSearchText.splice(index, this.advanceMultipleSearchText.length);
    this.ADVANCE_FILTER_FROM_DATE = null;
    this.ADVANCE_FILTER_TO_DATE = null;
    this.search(true);
  }

  onAdvanceFilterFederationNamesTagClose(index: number): void {
    this.advanceMultipleFederationNames.splice(index, 1);
    this.FEDERATION_ID.splice(index, 1);
    this.search(true);
  }

  onAdvanceFilterUnitNamesTagClose(index: number): void {
    this.advanceMultipleUnitNames.splice(index, 1);
    this.UNIT_ID.splice(index, 1);
    this.search(true);
  }

  onAdvanceFilterGroupNamesTagClose(index: number): void {
    this.advanceMultipleGroupNames.splice(index, 1);
    this.GROUP_ID.splice(index, 1);
    this.search(true);
  }

  disabledToDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.ADVANCE_FILTER_FROM_DATE ? this.ADVANCE_FILTER_FROM_DATE : this.today) < 0;

  onFromDateChange(fromDate: any): void {
    if (fromDate == null)
      this.ADVANCE_FILTER_TO_DATE = new Date();

    else
      this.ADVANCE_FILTER_TO_DATE = new Date(fromDate);
  }

  openAdvanceFilter(): void {
    this.advanceFilterModalVisible = !this.advanceFilterModalVisible;
  }

  advanceFilterModalCancel(): void {
    this.advanceFilterModalVisible = false;
  }

  advanceMultipleFederationNames: any[] = [];
  advanceMultipleUnitNames: any[] = [];
  advanceMultipleGroupNames: any[] = [];

  advanceFilterModalOk(): void {
    this.advanceFilterModalVisible = false;
    this.advanceMultipleSearchText.splice(0, this.advanceMultipleSearchText.length);
    this.advanceMultipleFederationNames = [];
    this.advanceMultipleUnitNames = [];
    this.advanceMultipleGroupNames = [];

    if (this.ADVANCE_FILTER_FROM_DATE != null && this.ADVANCE_FILTER_TO_DATE != null) {
      this.advanceMultipleSearchText.push("From : " + this.datePipe.transform(this.ADVANCE_FILTER_FROM_DATE, "dd MMM yy") + ", To : " + this.datePipe.transform(this.ADVANCE_FILTER_TO_DATE, "dd MMM yy"));
    }

    if (this.FEDERATION_ID.length > 0) {
      for (let i = 0; i < this.FEDERATION_ID.length; i++) {
        this.advanceMultipleFederationNames.push(this.FEDERATION_ID[i]);
      }
    }

    if (this.UNIT_ID.length > 0) {
      for (let i = 0; i < this.UNIT_ID.length; i++) {
        this.advanceMultipleUnitNames.push(this.UNIT_ID[i]);
      }
    }

    if (this.GROUP_ID.length > 0) {
      for (let i = 0; i < this.GROUP_ID.length; i++) {
        this.advanceMultipleGroupNames.push(this.GROUP_ID[i]);
      }
    }

    this.search(true);
  }

  FEDERATION_ID: any[] = [];
  UNIT_ID: any[] = [];
  GROUP_ID: any[] = [];

  clearAdvanceFilter(): void {
    this.ADVANCE_FILTER_FROM_DATE = null;
    this.ADVANCE_FILTER_TO_DATE = null;
    this.FEDERATION_ID = [];
    this.UNIT_ID = [];
    this.GROUP_ID = [];

    this.advanceMultipleSearchText.splice(0, this.advanceMultipleSearchText.length);
    this.advanceFilterModalVisible = false;

    this.search(true);
  }

  getHeigth(): string {
    if ((this.multipleSearchText.length > 0) || (this.advanceMultipleSearchText.length > 0)) {
      return '73vh';

    } else {
      return '80vh';
    }
  }

  back(): void {
    window.history.back();
  }

  getPaymentMode(mode: string): string {
    if (mode == "ONL") {
      return "Online";

    } else if (mode == "OFFL") {
      return "Offline";
    }
  }

  top(): void {
    setTimeout(() => {
      document.getElementById('top').scrollIntoView();
    }, 1500);
  }

  getStatus(status: string): string {
    if (status == "P") {
      return "Pending";
    }

    if (status == "A") {
      return "Approved";
    }

    if (status == "R") {
      return "Rejected";
    }
  }
}
