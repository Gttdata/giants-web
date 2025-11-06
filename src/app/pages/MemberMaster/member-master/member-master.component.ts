import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NzNotificationService, toArray } from 'ng-zorro-antd';
import { Membermaster } from 'src/app/Models/MemberMaster';
import { ApiService } from 'src/app/Service/api.service';
import { Input, ViewChild } from '@angular/core';
import { MemberDrawerComponent } from '../member-drawer/member-drawer.component';
import { CookieService } from 'ngx-cookie-service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { MemberUploadComponent } from '../../member-upload/member-upload.component';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewMemberPaymentDetailsComponent } from '../view-member-payment-details/view-member-payment-details.component';

@Component({
  selector: 'app-member-master',
  templateUrl: './member-master.component.html',
  styleUrls: ['./member-master.component.css']
})

export class MemberMasterComponent implements OnInit {
  passwordVisible: boolean = false;
  formTitle: string = "Members";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList: any[] = [];
  loadingRecords: boolean = true;
  sortKey: string = "NAME";
  sortValue: string = "asc";
  searchText: string = "";
  filterQuery: string = "";
  columns: string[][] = [["NAME", "Name"], ["MOBILE_NUMBER", "Mobile No."], ["FEDERATION_NAME", "Federation Name"], ["UNIT_NAME", "Unit Name"], ["GROUP_NAME", "Group Name"]];
  advanceFilterColumns: string[][] = [["MEMBERSHIP_DATE", "MEMBERSHIP_DATE"]];
  advanceFilterColumnsFederationNames: string[][] = [["FEDERATION_NAME", "FEDERATION_NAME"]];
  advanceFilterColumnsUnitNames: string[][] = [["UNIT_NAME", "UNIT_NAME"]];
  advanceFilterColumnsGroupNames: string[][] = [["GROUP_NAME", "GROUP_NAME"]];
  drawerVisible: boolean = false;
  drawerTitle: string;
  drawerData: Membermaster = new Membermaster();
  isSpinning: boolean = false;

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  homeFederationID: number = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
  homeUnitID: number = Number(sessionStorage.getItem("HOME_UNIT_ID"));
  homeGroupID: number = Number(sessionStorage.getItem("HOME_GROUP_ID"));

  roleID: number = Number(this._cookie.get("roleId"));
  userID: number = Number(this._cookie.get("userId"));

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
    console.log("End");

    if (this.dataList.length >= this.totalRecords) {
      return false;
    }

    this.search(false, true);
    return true;
  }

  groupIDForSearching: number = 0;
  unitIDForSearching: number = 0;
  federationIDForSearching: number = 0;

  ngOnInit() {
    this.groupIDForSearching = Number(this._Activatedroute.snapshot.paramMap.get("group"));
    this.unitIDForSearching = Number(this._Activatedroute.snapshot.paramMap.get("unit"));
    this.federationIDForSearching = Number(this._Activatedroute.snapshot.paramMap.get("federation"));

    if (this.groupIDForSearching != 0) {
      this.getGroupName(this.groupIDForSearching);
    }

    if (this.unitIDForSearching != 0) {
      this.getUnitName(this.unitIDForSearching);
    }

    if (this.federationIDForSearching != 0) {
      this.getFederationName(this.federationIDForSearching);
    }

    this.getFederations();
    this.search(true);
  }

  getGroupName(groupID: number): void {
    this.api.getAllGroups(0, 0, "", "", " AND ID=" + groupID).subscribe(data => {
      if (data['code'] == 200) {
        this.formTitle = data['data'][0]["SHORT_NAME"] + " > Members";
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getUnitName(unitID: number): void {
    this.api.getAllUnits(0, 0, "", "", " AND ID=" + unitID).subscribe(data => {
      if (data['code'] == 200) {
        this.formTitle = data['data'][0]["SHORT_NAME"] + " > Members";
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getFederationName(federationID: number): void {
    this.api.getAllFederations(0, 0, "", "", " AND ID=" + federationID).subscribe(data => {
      if (data['code'] == 200) {
        this.formTitle = data['data'][0]["FEDERATION_SHORT_NAME"] + " > Members";
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

    var systemAdminFilter = "";

    if (this.roleID == 1) {
      systemAdminFilter = " AND FEDERATION_ID=0 AND UNIT_ID=0 AND GROUP_ID=0";
    }

    var groupIDForSearchingFilter = "";

    if (this.groupIDForSearching != 0) {
      groupIDForSearchingFilter = " AND GROUP_ID=" + this.groupIDForSearching;
    }

    var unitIDForSearchingFilter = "";

    if (this.unitIDForSearching != 0) {
      unitIDForSearchingFilter = " AND UNIT_ID=" + this.unitIDForSearching;
    }

    var federationIDForSearchingFilter = "";

    if (this.federationIDForSearching != 0) {
      federationIDForSearchingFilter = " AND FEDERATION_ID=" + this.federationIDForSearching;
    }

    var globalFederationFilter = "";

    if (sessionStorage.getItem("FILTER") === "MF") {
      globalFederationFilter = " AND FEDERATION_ID=" + this.homeFederationID;
    }

    let activeMemberFilter = "";

    if (this.ACTIVE_STATUS === true) {
      activeMemberFilter = "ACTIVE_STATUS='A'";
    }

    let droppedMemberFilter = "";

    if (this.DROPPED_STATUS === true) {
      droppedMemberFilter = "DROPPED_STATUS=1";
    }

    let finalStatusFilter = "";

    if ((activeMemberFilter != "") && (droppedMemberFilter != "")) {
      finalStatusFilter = " AND (" + activeMemberFilter + " OR " + droppedMemberFilter + ")";

    } else {
      if ((activeMemberFilter == "") && (droppedMemberFilter == "")) {
        finalStatusFilter = "";

      } else if (activeMemberFilter != "") {
        finalStatusFilter = " AND ACTIVE_STATUS='A'";

      } else if (droppedMemberFilter != "") {
        finalStatusFilter = " AND DROPPED_STATUS=1";
      }
    }

    this.loadingRecords = true;

    this.api.getAllMembers(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + advanceLikeQuery + advanceLikeQueryFederationNames + advanceLikeQueryUnitNames + advanceLikeQueryGroupNames + groupIDForSearchingFilter + unitIDForSearchingFilter + federationIDForSearchingFilter + systemAdminFilter + globalFederationFilter + finalStatusFilter).subscribe(data => {
      if ((data['code'] == 200) && (data['count'] > 0)) {
        this.loadingRecords = false;
        this.totalRecords = data['count'];

        if (loadMore) {
          this.dataList.push(...data['data']);

        } else {
          this.dataList = data['data'];
        }

        this.pageIndex++;

      } else {
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.dataList = [];
      }

    }, err => {
      this.loadingRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  @ViewChild(MemberDrawerComponent, { static: false }) MemberDrawerComponentVar: MemberDrawerComponent;

  add(): void {
    this.drawerTitle = "aaa " + "Add Member";
    this.drawerData = new Membermaster();
    this.drawerVisible = true;
    this.drawerData.MEMBERSHIP_DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    let expiryDate = new Date().setFullYear(new Date().getFullYear() + 1);
    this.drawerData.EXPIRY_DATE = this.datePipe.transform(expiryDate, "yyyy-MM-dd");
    this.MemberDrawerComponentVar.fileURL1 = null;
    this.MemberDrawerComponentVar.fileURL2 = null;
    this.MemberDrawerComponentVar.pdfFileURL1 = null;
    this.MemberDrawerComponentVar.readOnly = false;
    this.MemberDrawerComponentVar.passwordVisible = false;
    this.MemberDrawerComponentVar.getInchargeAreas();
    this.MemberDrawerComponentVar.getFederations();

    // Fill federation, unit and group data role wise
    if (this.federationID > 0) {
      this.drawerData.FEDERATION_ID = this.homeFederationID;
      this.MemberDrawerComponentVar.getUnits(this.homeFederationID);
    }

    if (this.unitID > 0) {
      this.drawerData.FEDERATION_ID = this.homeFederationID;
      this.MemberDrawerComponentVar.getUnits(this.homeFederationID);
      this.drawerData.UNIT_ID = this.homeUnitID;
      this.MemberDrawerComponentVar.getGroups(this.homeUnitID);
    }

    if (this.groupID > 0) {
      this.drawerData.FEDERATION_ID = this.homeFederationID;
      this.MemberDrawerComponentVar.getUnits(this.homeFederationID);
      this.drawerData.UNIT_ID = this.homeUnitID;
      this.MemberDrawerComponentVar.getGroups(this.homeUnitID);
      this.drawerData.GROUP_ID = this.homeGroupID;
    }
  }

  edit(data: Membermaster, readOnly: boolean = false): void {
    if (readOnly) {
      this.drawerTitle = "aaa " + "View Member Details";

    } else {
      this.drawerTitle = "aaa " + "Edit Member Details";
    }

    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;

    // For Honorable
    if (this.drawerData.IS_HONORABLE) {
      this.drawerData.NAME = this.drawerData.NAME.trim().substring(4, this.drawerData.NAME.trim().length);
    }

    // For NCF
    if (this.drawerData.IS_NCF) {
      this.drawerData.NAME = this.drawerData.NAME.trim().substring(4, this.drawerData.NAME.trim().length);
    }

    // For Salutation
    let name = this.drawerData.NAME.trim().split('.');

    if (name.length > 1) {
      this.drawerData.SALUTATION = name[0].split(" ")[name[0].split(" ").length - 1].trim() + '.';
      this.drawerData.NAME = name[1].trim();

    } else {
      this.drawerData.SALUTATION = 'Mr.';
      this.drawerData.NAME = name[0].trim();
    }

    // Incharge Area
    if (this.drawerData.INCHARGE_OF == " ") {
      this.drawerData.INCHARGE_OF = undefined;

    } else {
      let inchargeStringArray = [];

      if ((data.INCHARGE_OF != undefined) && (data.INCHARGE_OF != null)) {
        inchargeStringArray = data.INCHARGE_OF.split(',');
      }

      let inchargeArray = [];

      for (var i = 0; i < inchargeStringArray.length; i++) {
        inchargeArray.push(Number(inchargeStringArray[i]));
      }

      this.drawerData.INCHARGE_OF = inchargeArray;
    }

    this.MemberDrawerComponentVar.fileURL1 = null;
    this.MemberDrawerComponentVar.fileURL2 = null;
    this.MemberDrawerComponentVar.pdfFileURL1 = null;
    this.MemberDrawerComponentVar.passwordVisible = false;

    // Get Units and Groups
    this.MemberDrawerComponentVar.getUnits(data.FEDERATION_ID);
    this.MemberDrawerComponentVar.getGroups(data.UNIT_ID);
    this.MemberDrawerComponentVar.getGroupInfoFromEdit(data.GROUP_ID);

    // Birth Date
    if (this.datePipe.transform(this.drawerData.DOB, "yyyyMMdd") == "19000101") {
      this.drawerData.DOB = undefined;
    }

    // Anniversary Date
    if (this.datePipe.transform(this.drawerData.ANNIVERSARY_DATE, "yyyyMMdd") == "19000101") {
      this.drawerData.ANNIVERSARY_DATE = undefined;
    }

    // Profile Img
    if ((this.drawerData.PROFILE_IMAGE != " ") && (this.drawerData.PROFILE_IMAGE != null)) {
      this.drawerData.PROFILE_IMAGE = this.api.retriveimgUrl + "profileImage/" + this.drawerData.PROFILE_IMAGE;

    } else {
      this.drawerData.PROFILE_IMAGE = null;
    }

    // Sign
    if ((this.drawerData.SIGNATURE != " ") && (this.drawerData.SIGNATURE != null)) {
      this.drawerData.SIGNATURE = this.api.retriveimgUrl + "memberSignature/" + this.drawerData.SIGNATURE;

    } else {
      this.drawerData.SIGNATURE = null;
    }

    // Fill Communication Email(s)
    if ((this.drawerData.EMAIL_ID != null) && (this.drawerData.EMAIL_ID.trim() != '')) {
      this.drawerData.EMAIL_ID = this.drawerData.EMAIL_ID.split(',');

    } else {
      this.drawerData.EMAIL_ID = undefined;
    }

    // Fill Bussiness Email(s)
    if ((this.drawerData.BUSSINESS_EMAIL != null) && (this.drawerData.BUSSINESS_EMAIL.trim() != '')) {
      this.drawerData.BUSSINESS_EMAIL = this.drawerData.BUSSINESS_EMAIL.split(',');

    } else {
      this.drawerData.BUSSINESS_EMAIL = undefined;
    }

    // Fill Communication Mobile No(s).
    if ((this.drawerData.COMMUNICATION_MOBILE_NUMBER != null) && (this.drawerData.COMMUNICATION_MOBILE_NUMBER.trim() != '')) {
      this.drawerData.COMMUNICATION_MOBILE_NUMBER = this.drawerData.COMMUNICATION_MOBILE_NUMBER.split(',');

    } else {
      this.drawerData.COMMUNICATION_MOBILE_NUMBER = undefined;
    }

    // read Only purpose
    if (readOnly) {
      this.MemberDrawerComponentVar.readOnly = true;
      this.MemberDrawerComponentVar.getAllFederations(data.FEDERATION_ID);
      this.MemberDrawerComponentVar.getAllUnits(data.FEDERATION_ID);
      this.MemberDrawerComponentVar.getAllGroups(data.UNIT_ID);

    } else {
      this.MemberDrawerComponentVar.readOnly = false;
    }
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

  onStatusChange(data: Membermaster, status: boolean): void {
    data.STATUS = status;

    // this.api.updateGroup(data).subscribe(successCode => {
    //   if (successCode['code'] == 200) {
    //     this.message.success("Status Updated Successfully", "");

    //   } else {
    //     this.message.error("Failed to Update Status", "");
    //   }

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

  getMaritalStatusFullForm(maritalStatus: string): string {
    if (maritalStatus == "S")
      return "Single";

    else if (maritalStatus == "M")
      return "Married";

    else if (maritalStatus == "W")
      return "Widowed";

    else if (maritalStatus == "D")
      return "Divorced";

    else if (maritalStatus == "E")
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
    this.search(false);
    this.memberPaymentDrawerVisible = false;
  }

  get memberPaymentCloseCallback() {
    return this.memberPaymentDrawerClose.bind(this);
  }

  getActiveStatus(status: string): string {
    if (status == "P") {
      return "Pending";

    } else {
      return "Active";
    }
  }

  today = new Date().setDate(new Date().getDate());

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) > 0;

  disabledExpiryDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) < 0;

  isVisible: boolean = false;
  isConfirmLoading: boolean = false;
  tempDataToActivate: Membermaster = new Membermaster();
  PASSWORD: any;
  MEMBERSHIP_DATE: any;
  EXPIRY_DATE: any;

  showModal(data: any): void {
    this.tempDataToActivate = data;
    this.isVisible = true;
    this.passwordVisible = false;
    this.MEMBERSHIP_DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    let expiryDate = new Date().setFullYear(new Date().getFullYear() + 1);
    this.EXPIRY_DATE = this.datePipe.transform(expiryDate, "yyyy-MM-dd");
    this.PASSWORD = this.api.generate8DigitRandomNumber();
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    this.tempDataToActivate.PASSWORD = this.PASSWORD;
    this.tempDataToActivate.MEMBERSHIP_DATE = this.datePipe.transform(this.MEMBERSHIP_DATE, "yyyy-MM-dd");
    this.tempDataToActivate.EXPIRY_DATE = this.datePipe.transform(this.EXPIRY_DATE, "yyyy-MM-dd");
    this.tempDataToActivate.ACTIVE_STATUS = "A";

    this.api.updateMember(this.tempDataToActivate).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Member Details Updated Successfully", "");
        this.isConfirmLoading = false;
        this.isVisible = false;
        this.search(false);

      } else {
        this.message.error("Member Details Updation Failed", "");
        this.isConfirmLoading = false;
        this.search(false);
      }
    });
  }

  importDrawerTitle: string = "";
  importDrawerVisible: boolean = false;
  @ViewChild(MemberUploadComponent, { static: false }) MemberUploadComponentVar: MemberUploadComponent;

  openImportDrawer(): void {
    this.MemberUploadComponentVar.newArray = [];
    this.importDrawerTitle = "Import Data";
    this.importDrawerVisible = true;
    this.MemberUploadComponentVar.uploadedMembersCount = 0;
    this.MemberUploadComponentVar.duplicateMembersCount = 0;
    this.MemberUploadComponentVar.failedToUploadMembersCount = 0;
  }

  importDrawerClose(): void {
    this.importDrawerVisible = false;
    this.search(true);
  }

  get importCloseCallback() {
    return this.importDrawerClose.bind(this);
  }

  cancel(): void { }

  downloadCSVFile(): void {
    window.open(this.api.retriveimgUrl + "CSVFileFormat/MemberMaster.csv");
  }

  getWidth(): number {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 1200;
  }

  getProfilePhoto(photoURL: string): string {
    if ((photoURL != null) && (photoURL.trim() != '')) {
      return this.api.retriveimgUrl + "profileImage/" + photoURL;

    } else {
      return "assets/anony.png";
    }
  }

  goToUnitMaster(): void {
    this.router.navigateByUrl('/units');
  }

  goToGroupMaster(): void {
    this.router.navigateByUrl('/groups');
  }

  goToMemberMaster(): void {
    this.router.navigateByUrl('/membermaster');
  }

  back(): void {
    window.history.back();
  }

  multipleSearchText: any[] = [];
  advanceMultipleSearchText: any[] = [];
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

  disabledFromDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) > 0;

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
  FEDERATION_ID: any[] = [];
  UNIT_ID: any[] = [];
  GROUP_ID: any[] = [];
  MEMBER_ID: any[] = [];

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

  clearAdvanceFilter(): void {
    this.ADVANCE_FILTER_FROM_DATE = null;
    this.ADVANCE_FILTER_TO_DATE = null;
    this.ACTIVE_STATUS = true;
    this.DROPPED_STATUS = false;
    this.MEMBER_ID = [];
    this.FEDERATION_ID = [];
    this.UNIT_ID = [];
    this.GROUP_ID = [];

    this.advanceMultipleSearchText.splice(0, this.advanceMultipleSearchText.length);
    this.advanceMultipleFederationNames = [];
    this.advanceMultipleUnitNames = [];
    this.advanceMultipleGroupNames = [];
    this.advanceFilterModalVisible = false;

    this.search(true);
  }

  getHeigth(): string {
    if ((this.multipleSearchText.length > 0) || (this.advanceMultipleSearchText.length > 0) || (this.advanceMultipleFederationNames.length > 0) || (this.advanceMultipleUnitNames.length > 0) || (this.advanceMultipleGroupNames.length > 0)) {
      return '73vh';

    } else {
      return '80vh';
    }
  }

  viewPaymentDetailsDrawerTitle: string = "";
  viewPaymentDetailsDrawerVisible: boolean = false;
  @ViewChild(ViewMemberPaymentDetailsComponent, { static: false }) ViewMemberPaymentDetailsComponentVar: ViewMemberPaymentDetailsComponent;

  openPaymentDetails(data: Membermaster): void {
    this.viewPaymentDetailsDrawerTitle = "aaa " + "Payment Details of " + data.NAME;
    this.viewPaymentDetailsDrawerVisible = true;
    this.ViewMemberPaymentDetailsComponentVar.getPaymentDetails(data.ID);
  }

  viewPaymentDetailsDrawerClose(): void {
    this.viewPaymentDetailsDrawerVisible = false;
  }

  get viewPaymentDetailsCloseCallback() {
    return this.viewPaymentDetailsDrawerClose.bind(this);
  }

  goToMobileNumber(mobileNo: number): string {
    return "tel:" + mobileNo;
  }

  goToEmail(email: string): string {
    return "mailto:" + email;
  }

  top(): void {
    setTimeout(() => {
      document.getElementById('top').scrollIntoView();
    }, 1500);
  }

  loginMobileNumber: string;
  loginPassword: string;

  loginButton(data: Membermaster): void {
    this.loginMobileNumber = data.MOBILE_NUMBER;
    this.loginPassword = data.PASSWORD;
    this.memberLogin();
  }

  memberLogin(): void {
    this.loadingRecords = true;

    this.api.memberlogin(this.loginMobileNumber, this.loginPassword).subscribe(data => {
      if (data['code'] == 200) {
        sessionStorage.setItem('userId', data["data"][0]['UserData'][0]['USER_ID']);
        sessionStorage.setItem('roleId', data["data"][0]['UserData'][0]['ROLE_ID']);
        sessionStorage.setItem('emailId', data["data"][0]['UserData'][0]['EMAIL_ID']);

        this._cookie.set('token', data["data"][0]["token"], 365, "", "", false, "Strict");
        this._cookie.set('userId', data["data"][0]['UserData'][0]['USER_ID'], 365, "", "", false, "Strict");
        this._cookie.set('userName', data["data"][0]['UserData'][0]['NAME'], 365, "", "", false, "Strict");
        this._cookie.set('roleId', data["data"][0]['UserData'][0]['ROLE_ID'], 365, "", "", false, "Strict");
        this._cookie.set('roleName', data["data"][0]['UserData'][0]['ROLE_NAME'], 365, "", "", false, "Strict");
        this._cookie.set('mobileNo', data["data"][0]['UserData'][0]['MOBILE_NUMBER'], 365, "", "", false, "Strict");
        this._cookie.set('emailId', data["data"][0]['UserData'][0]['EMAIL_ID'], 365, "", "", false, "Strict")
        this._cookie.set("profile", data["data"][0]['UserData'][0]['PROFILE_IMAGE'], 365, "", "", false, "Strict");
        this._cookie.set("gender", data["data"][0]['UserData'][0]['GENDER'], 365, "", "", false, "Strict");

        window.location.reload();

      } else if (data['code'] == 404) {
        this.loadingRecords = false;
        this.message.error(data['message'], "");
      }

    }, err => {
      this.loadingRecords = false;
      this.message.error(JSON.stringify(err), "");
    });
  }

  dropMember(data: Membermaster): void {
    data.DROPPED_STATUS = true;
    data.DROPPED_DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    data.REVIVED_STATUS = false;
    data.REVIVED_DATE = this.datePipe.transform(new Date(1900, 0, 1), "yyyy-MM-dd");
    data.ACTIVE_STATUS = "P";
    this.loadingRecords = true;

    this.api.updateMember(data).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Member Dropped Successfully", "");
        this.search(true);

      } else if (successCode['code'] == 301) {
        this.message.error("Group Fee Not Assigned", "");
        this.search(true);

      } else {
        this.message.error("Failed to Member Drop", "");
        this.search(true);
      }
    });
  }

  revivedMember(data: Membermaster): void {
    data.DROPPED_STATUS = false;
    data.DROPPED_DATE = this.datePipe.transform(new Date(1900, 0, 1), "yyyy-MM-dd");
    data.REVIVED_STATUS = true;
    data.REVIVED_DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    data.ACTIVE_STATUS = "A";
    this.loadingRecords = true;

    this.api.updateMember(data).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Member Revived Successfully", "");
        this.search(true);

      } else if (successCode['code'] == 301) {
        this.message.error("Group Fee Not Assigned", "");
        this.search(true);

      } else {
        this.message.error("Failed to Member Revive", "");
        this.search(true);
      }
    });
  }

  ACTIVE_STATUS: boolean = true;
  DROPPED_STATUS: boolean = false;
}
