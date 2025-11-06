import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { PaymentCollection } from 'src/app/Models/PaymentCollection';
import { PaymentCollectionDetails } from 'src/app/Models/PaymentCollectionDetails';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/Service/api.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { DatePipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { AddpaymentComponent } from '../addpayment/addpayment.component';
import { MemberspaymentdetailsComponent } from '../memberspaymentdetails/memberspaymentdetails.component';

@Component({
  selector: 'app-payment-approval-by-admin',
  templateUrl: './payment-approval-by-admin.component.html',
  styleUrls: ['./payment-approval-by-admin.component.css']
})

export class PaymentApprovalByAdminComponent implements OnInit {
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
  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: PaymentCollection = new PaymentCollection();
  drawerVisible4: boolean = false;
  drawerTitle4!: string;
  drawerData4: PaymentCollectionDetails = new PaymentCollectionDetails();
  paymentDetailsID: number;

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

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
    this.federations = [];

    this.api.getAllFederations(0, 0, "NAME", "asc", " AND STATUS=1").subscribe(data => {
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
      this.api.getAllUnits(0, 0, "ID", "asc", " AND STATUS=1 AND NAME LIKE '%" + unitName + "%'").subscribe(data => {
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
      this.api.getAllGroups(0, 0, "NAME", "asc", " AND STATUS=1 AND NAME LIKE '%" + groupName + "%'").subscribe(data => {
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

  ngOnInit() {
    this.groupIDForSearching = Number(this._Activatedroute.snapshot.paramMap.get("group"));
    this.getFederations();
    this.search(true);
  }

  search(reset: boolean = false, loadMore: boolean = false): void {
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

    this.loadingRecords = true;

    this.api.getAllMembershipPayment(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + advanceLikeQuery + advanceLikeQueryFederationNames + advanceLikeQueryUnitNames + advanceLikeQueryGroupNames + groupFilterForSearching + " AND PAYMENT_TRANSACTION_MODE='OFFL' AND RECEIVED_STATUS='P'").subscribe(data => {
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
    this.drawerTitle = "Add New Payment";
    this.drawerData = new PaymentCollection();
    this.sum = 0;
    this.drawerVisible = true;
    this.drawerData.DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.AddpaymentComponentVar.PAYMENT_MODE_TYPE = "ONL";
    this.AddpaymentComponentVar.fileURL = null;
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
    this.drawerTitle4 = "aaa " + "Member Payments Details";
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

    this.api.getAllMemberPaymentDetails(0, 0, this.sortKey, sort, " AND PAYMENT_COLLECTION_MASTER_ID=" + this.paymentDetailsID).subscribe(data => {
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

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) > 0;

  disabledToDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.ADVANCE_FILTER_FROM_DATE == null ? this.today : this.ADVANCE_FILTER_FROM_DATE) < 0;

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

    if ((this.ADVANCE_FILTER_FROM_DATE != null) && (this.ADVANCE_FILTER_TO_DATE != null)) {
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

  paymentApproveReject(data: any, status: string): void {
    let msg1 = "";
    let msg2 = "";

    if (status == "A") {
      msg1 = "Payment Approved";
      msg2 = "Failed to Payment Approve";

    } else if (status == "R") {
      msg1 = "Payment Rejected";
      msg2 = "Failed to Payment Rejection";
    }

    this.loadingRecords = true;

    this.api.updatePaymentStatus(data["ID"], status).subscribe(data => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.message.success(msg1, "");
        this.search(true);

      } else {
        this.loadingRecords = false;
        this.message.error(msg2, "");
        this.search(true);
      }

    }, err => {
      this.loadingRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  cancel(): void { }
}
