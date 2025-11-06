import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { FederationMaster } from 'src/app/Models/FederationMaster';
import { ApiService } from 'src/app/Service/api.service';
import { Input, ViewChild } from '@angular/core';
import { AssignFederationMembersComponent } from '../assign-federation-members/assign-federation-members.component';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { differenceInCalendarDays, setHours } from 'date-fns';

@Component({
  selector: 'app-federation-master',
  templateUrl: './federation-master.component.html',
  styleUrls: ['./federation-master.component.css']
})

export class FederationMasterComponent implements OnInit {
  formTitle: string = "Federations";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList: any[] = [];
  loadingRecords: boolean = true;
  sortKey: string = "FEDERATION_ID";
  sortValue: string = "desc";
  searchText: string = "";
  filterQuery: string = "";
  columns: string[][] = [["NAME", "Federation"]];
  advanceFilterColumns: string[][] = [["POST_CREATED_DATETIME", "POST_CREATED_DATETIME"]];
  drawerVisible: boolean = false;
  drawerTitle: string;
  drawerData: FederationMaster = new FederationMaster();

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));
  roleID: number = Number(this._cookie.get("roleId"));

  homeFederationID: number = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
  homeUnitID: number = Number(sessionStorage.getItem("HOME_UNIT_ID"));
  homeGroupID: number = Number(sessionStorage.getItem("HOME_GROUP_ID"));

  emitted = false;
  filter = '';
  private categoriesSubject = new BehaviorSubject<Array<string>>([]);
  categories$ = this.categoriesSubject.asObservable();
  multipleSearchText: any[] = [];
  advanceMultipleSearchText: any[] = [];

  constructor(private api: ApiService, private router: Router, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

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
    this.search(true);
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true);
  }

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

    var globalFederationFilter = "";

    if (sessionStorage.getItem("FILTER") === "MF") {
      globalFederationFilter = " AND FEDERATION_ID=" + this.homeFederationID;
    }

    this.loadingRecords = true;

    this.api.getFederationsTilesDetails(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + advanceLikeQuery + globalFederationFilter).subscribe(data => {
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

  goToUnitMaster(federation: FederationMaster): void {
    this.router.navigate(['/units', { federation: federation["FEDERATION_ID"] }]);
  }

  goToGroupMaster(federation: FederationMaster): void {
    this.router.navigate(['/groups', { federation: federation["FEDERATION_ID"] }]);
  }

  goToMemberMaster(federation: FederationMaster): void {
    this.router.navigate(['/members', { federation: federation["FEDERATION_ID"] }]);
  }

  add(): void {
    this.drawerTitle = "aaa " + "Add Federation";
    this.drawerData = new FederationMaster();
    this.drawerVisible = true;
    this.drawerData.STATUS = true;
  }

  edit(data: FederationMaster): void {
    this.drawerTitle = "aaa " + "Edit Federation";
    this.drawerData = Object.assign({}, data);
    this.drawerData.ID = data["FEDERATION_ID"];
    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search(true);
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  onSearching(): void {
    document.getElementById("button1").focus();
    this.search(true);
  }

  onStatusChange(data: FederationMaster, status: boolean): void {
    data.STATUS = status;

    this.api.updateFederation(data).subscribe(successCode => {
      if (successCode['code'] == 200)
        this.message.success("Status Updated Successfully", "");

      else
        this.message.error("Failed to Update Status", "");

      this.search(false);
    });
  }

  memberDrawerTitle: string;
  memberDrawerData: any;
  memberDrawerVisible: boolean = false;
  @ViewChild(AssignFederationMembersComponent, { static: false }) AssignFederationMembersComponentVar: AssignFederationMembersComponent;

  addMembers(data: FederationMaster): void {
    this.memberDrawerTitle = "aaa " + "Council List";
    this.memberDrawerData = Object.assign({}, data);
    this.memberDrawerVisible = true;
    this.AssignFederationMembersComponentVar.getData1(data);
    this.AssignFederationMembersComponentVar.gettingFederationBODStatus(data["FEDERATION_ID"]);
    this.AssignFederationMembersComponentVar.sendForApprovalDrawerInitialization();
  }

  memberDrawerClose(): void {
    this.memberDrawerVisible = false;
    this.search(true);
  }

  get memberDrawerCloseCallback() {
    return this.memberDrawerClose.bind(this);
  }

  back(): void {
    window.history.back();
  }

  getWidth(): number {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 1100;
  }

  getFederationDrawerWidth(): number {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 500;
  }

  today = new Date().setDate(new Date().getDate());

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) > 0;

  disabledToDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.ADVANCE_FILTER_FROM_DATE == null ? this.today : this.ADVANCE_FILTER_FROM_DATE) < 0;

  onFromDateChange(fromDate: any): void {
    if (fromDate == null) {
      this.ADVANCE_FILTER_TO_DATE = new Date();

    } else {
      this.ADVANCE_FILTER_TO_DATE = new Date(fromDate);
    }
  }

  advanceFilterModalVisible: boolean = false;
  ADVANCE_FILTER_FROM_DATE: Date = null;
  ADVANCE_FILTER_TO_DATE: Date = null;

  openAdvanceFilter(): void {
    this.advanceFilterModalVisible = true;
  }

  advanceFilterModalCancel(): void {
    this.advanceFilterModalVisible = false;
  }

  advanceFilterModalOk(): void {
    this.advanceFilterModalVisible = false;

    if ((this.ADVANCE_FILTER_FROM_DATE != null) && (this.ADVANCE_FILTER_TO_DATE != null)) {
      this.advanceMultipleSearchText.splice(0, this.advanceMultipleSearchText.length);
      this.advanceMultipleSearchText.push("From : " + this.datePipe.transform(this.ADVANCE_FILTER_FROM_DATE, "dd MMM yy") + ", To : " + this.datePipe.transform(this.ADVANCE_FILTER_TO_DATE, "dd MMM yy"));
    }

    this.search(true);
  }

  getHeigth(): string {
    if ((this.multipleSearchText.length > 0) || (this.advanceMultipleSearchText.length > 0)) {
      return '73vh';

    } else {
      return '80vh';
    }
  }

  top(): void {
    setTimeout(() => {
      document.getElementById('top').scrollIntoView();
    }, 1500);
  }
}