import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { UnitMaster } from 'src/app/Models/UnitMaster';
import { ApiService } from 'src/app/Service/api.service';
import { AssignUnitMemberComponent } from '../assign-unit-member/assign-unit-member.component';
import { differenceInCalendarDays, setHours } from 'date-fns';

@Component({
  selector: 'app-unit-master-tiles',
  templateUrl: './unit-master-tiles.component.html',
  styleUrls: ['./unit-master-tiles.component.css']
})

export class UnitMasterTilesComponent implements OnInit {
  formTitle: string = "Units";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList: any[] = [];
  loadingRecords: boolean = true;
  sortKey: string = "UNIT_ID";
  sortValue: string = "desc";
  searchText: string = "";
  filterQuery: string = "";
  columns: string[][] = [["UNIT_NAME", "Unit"]];
  advanceFilterColumns: string[][] = [["POST_CREATED_DATETIME", "POST_CREATED_DATETIME"]];
  advanceFilterColumnsFederationNames: string[][] = [["FEDERATION_NAME", "FEDERATION_NAME"]];
  drawerVisible: boolean = false;
  drawerTitle: string;
  drawerData: UnitMaster = new UnitMaster();

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  homeFederationID: number = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
  homeUnitID: number = Number(sessionStorage.getItem("HOME_UNIT_ID"));
  homeGroupID: number = Number(sessionStorage.getItem("HOME_GROUP_ID"));

  emitted = false;
  filter = '';
  private categoriesSubject = new BehaviorSubject<Array<string>>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor(private _Activatedroute: ActivatedRoute, private router: Router, private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

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
    console.log("End");

    if (this.dataList.length >= this.totalRecords) {
      return false;
    }

    this.search(false, true);
    return true;
  }

  federationIDForSearching: number = 0;

  ngOnInit() {
    this.federationIDForSearching = Number(this._Activatedroute.snapshot.paramMap.get("federation"));

    if (this.federationIDForSearching != 0) {
      this.getFederationName(this.federationIDForSearching);
    }

    this.getFederations();
    this.search(true);
  }

  getFederationName(federationID: number): void {
    this.api.getAllFederations(0, 0, "", "", " AND ID=" + federationID).subscribe(data => {
      if (data['code'] == 200) {
        this.formTitle = data['data'][0]["FEDERATION_SHORT_NAME"] + " > Units";
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

    var federationIDForSearchingFilter = "";

    if (this.federationIDForSearching != 0) {
      federationIDForSearchingFilter = " AND FEDERATION_ID=" + this.federationIDForSearching;
    }

    var globalFederationFilter = "";

    if (sessionStorage.getItem("FILTER") === "MF") {
      globalFederationFilter = " AND FEDERATION_ID=" + this.homeFederationID;
    }

    this.loadingRecords = true;

    this.api.getAllUnitsTilesDetails(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + advanceLikeQuery + advanceLikeQueryFederationNames + federationIDForSearchingFilter + globalFederationFilter).subscribe(data => {
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

  add(): void {
    this.drawerTitle = "aaa " + "Add Unit";
    this.drawerData = new UnitMaster();
    this.drawerVisible = true;
    this.drawerData.STATUS = true;
    this.drawerData.BO_DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  }

  edit(data: UnitMaster): void {
    this.drawerTitle = "aaa " + "Edit Unit";
    this.drawerData = Object.assign({}, data);
    this.drawerData.ID = data["UNIT_ID"];
    this.drawerData.NAME = data["UNIT_NAME"];
    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.drawerVisible = false;
    this.search(true);
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  onSearching(): void {
    document.getElementById("button1").focus();
    this.search(true);
  }

  onStatusChange(data: UnitMaster, status: any): void {
    data.STATUS = status;

    this.api.updateUnit(data).subscribe(successCode => {
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
  @ViewChild(AssignUnitMemberComponent, { static: false }) AssignUnitMemberComponentVar: AssignUnitMemberComponent;

  addMembers(data: UnitMaster): void {
    this.memberDrawerTitle = "aaa " + "Unit BOD";
    this.memberDrawerData = Object.assign({}, data);
    this.memberDrawerVisible = true;
    this.AssignUnitMemberComponentVar.getData1(data);
    this.AssignUnitMemberComponentVar.gettingUnitBODStatus(data["UNIT_ID"]);
    this.AssignUnitMemberComponentVar.sendForApprovalDrawerInitialization();
  }

  memberDrawerClose(): void {
    this.memberDrawerVisible = false;
    this.search(true);
  }

  get memberDrawerCloseCallback() {
    return this.memberDrawerClose.bind(this);
  }

  getWidth(): number {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 1100;
  }

  getUnitDrawerWidth(): number {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 500;
  }

  goToUnitMaster(): void {
    this.router.navigateByUrl('/unitmaster');
  }

  goToGroupMaster(unit: UnitMaster): void {
    this.router.navigate(['/groups', { unit: unit["UNIT_ID"] }]);
  }

  goToMemberMaster(unit: UnitMaster): void {
    this.router.navigate(['/members', { unit: unit["UNIT_ID"] }]);
  }

  back(): void {
    window.history.back();
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

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) > 0;

  disabledToDate = (current: Date): boolean =>
    differenceInCalendarDays(current, (this.ADVANCE_FILTER_FROM_DATE == null) ? this.today : this.ADVANCE_FILTER_FROM_DATE) < 0;

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
  FEDERATION_ID: any[] = [];

  advanceFilterModalOk(): void {
    this.advanceFilterModalVisible = false;
    this.advanceMultipleSearchText.splice(0, this.advanceMultipleSearchText.length);
    this.advanceMultipleFederationNames = [];

    if (this.ADVANCE_FILTER_FROM_DATE != null && this.ADVANCE_FILTER_TO_DATE != null) {
      this.advanceMultipleSearchText.push("From : " + this.datePipe.transform(this.ADVANCE_FILTER_FROM_DATE, "dd MMM yy") + ", To : " + this.datePipe.transform(this.ADVANCE_FILTER_TO_DATE, "dd MMM yy"));
    }

    if (this.FEDERATION_ID.length > 0) {
      for (let i = 0; i < this.FEDERATION_ID.length; i++) {
        this.advanceMultipleFederationNames.push(this.FEDERATION_ID[i]);
      }
    }

    this.search(true);
  }

  clearAdvanceFilter(): void {
    this.ADVANCE_FILTER_FROM_DATE = null;
    this.ADVANCE_FILTER_TO_DATE = null;
    this.FEDERATION_ID = [];

    this.advanceMultipleSearchText.splice(0, this.advanceMultipleSearchText.length);
    this.advanceMultipleFederationNames = [];
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

  top(): void {
    setTimeout(() => {
      document.getElementById('top').scrollIntoView();
    }, 1500);
  }
}
