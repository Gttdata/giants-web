import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { GroupMaster } from 'src/app/Models/GroupMaster';
import { ApiService } from 'src/app/Service/api.service';
import { AssignGroupMemberComponent } from '../assign-group-member/assign-group-member.component';
import { BehaviorSubject } from 'rxjs';
import { Membermaster } from 'src/app/Models/MemberMaster';
import { MemberDrawerComponent } from '../../MemberMaster/member-drawer/member-drawer.component';
import { GroupDrawerComponent } from '../group-drawer/group-drawer.component';
import { MemberUploadComponent } from '../../member-upload/member-upload.component';
import { SendForApprovalComponent } from '../../send-for-approval/send-for-approval.component';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { GroupFeeTypeDrawerComponent } from '../../GroupFeeType/group-fee-type-drawer/group-fee-type-drawer.component';
import { AuditReport } from 'src/app/Models/AuditReport';

@Component({
  selector: 'app-group-master-tiles',
  templateUrl: './group-master-tiles.component.html',
  styleUrls: ['./group-master-tiles.component.css']
})

export class GroupMasterTilesComponent implements OnInit {
  formTitle: string = "Groups";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList: any[] = [];
  loadingRecords: boolean = true;
  sortKey: string = "GROUP_ID";
  sortValue: string = "desc";
  searchText: string = "";
  filterQuery: string = "";
  columns: string[][] = [["FEDERATION_NAME", "Federation"], ["UNIT_NAME", "Unit"], ["GROUP_NAME", "Group"]];
  advanceFilterColumns: string[][] = [["POST_CREATED_DATETIME", "POST_CREATED_DATETIME"]];
  advanceFilterColumnsFederationNames: string[][] = [["FEDERATION_NAME", "FEDERATION_NAME"]];
  advanceFilterColumnsUnitNames: string[][] = [["UNIT_NAME", "UNIT_NAME"]];
  drawerVisible: boolean = false;
  drawerTitle: string;
  drawerData: GroupMaster = new GroupMaster();

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
  feeDetails: any[] = [];

  constructor(
    private _Activatedroute: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private _cookie: CookieService) { }

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

  unitIDForSearching: number = 0;
  federationIDForSearching: number = 0;

  ngOnInit() {
    this.unitIDForSearching = Number(this._Activatedroute.snapshot.paramMap.get("unit"));
    this.federationIDForSearching = Number(this._Activatedroute.snapshot.paramMap.get("federation"));

    if (this.unitIDForSearching != 0) {
      this.getUnitName(this.unitIDForSearching);
    }

    if (this.federationIDForSearching != 0) {
      this.getFederationName(this.federationIDForSearching);
    }

    this.getYears();
    this.getFederations();
    this.search(true);
  }

  getUnitName(unitID: number): void {
    this.api.getAllUnits(0, 0, "", "", " AND ID=" + unitID).subscribe(data => {
      if (data['code'] == 200) {
        this.formTitle = data['data'][0]["SHORT_NAME"] + " > Groups";
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getFederationName(federationID: number): void {
    this.api.getAllFederations(0, 0, "", "", " AND ID=" + federationID).subscribe(data => {
      if (data['code'] == 200) {
        this.formTitle = data['data'][0]["FEDERATION_SHORT_NAME"] + " > Groups";
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
      activeMemberFilter = "STATUS=1";
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
        finalStatusFilter = " AND STATUS=1";

      } else if (droppedMemberFilter != "") {
        finalStatusFilter = " AND DROPPED_STATUS=1";
      }
    }

    this.loadingRecords = true;

    this.api.getAllGroupsTilesDetails(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + advanceLikeQuery + advanceLikeQueryFederationNames + advanceLikeQueryUnitNames + unitIDForSearchingFilter + federationIDForSearchingFilter + globalFederationFilter + finalStatusFilter).subscribe(data => {
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

  @ViewChild(GroupDrawerComponent, { static: false }) GroupDrawerComponentVar: GroupDrawerComponent;

  add(): void {
    this.drawerTitle = "aaa " + "Add Group";
    this.drawerData = new GroupMaster();
    this.drawerVisible = true;
    this.drawerData.BO_DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.drawerData.ORIENTATION_DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    let tempOrentationDate = this.datePipe.transform(this.drawerData.ORIENTATION_DATE, "dd MMM yyyy");
    this.drawerData.ORIENTATION_DRAFT = "This is to certify that orientation meeting was conducted at " + (this.drawerData.VENUE ? this.drawerData.VENUE : "...") + ", on " + tempOrentationDate + " under my chairmanship. During this meeting president, DA and treasurer of ..... group were also present. In all 25 members from ..... group were present in this meeting to discuss on formation of new group. We were instrumentation to explain aims and objectives of giants and BOD was finalized, and minute's book was maintained. The aims and objectives of giants welfare foundation, constitution to be formed for smooth function of the group, annual and entrance fees to be paid to giants international every year were clearly explained to them. Guidance on projects and programs was also done during the orientations meeting.";
    this.GroupDrawerComponentVar.pdfFileURL1 = null;
    this.GroupDrawerComponentVar.pdf1Str = "";
  }

  edit(data: GroupMaster): void {
    this.drawerTitle = "aaa " + "Edit Group Details";
    this.drawerData = Object.assign({}, data);
    this.drawerData.ID = data["GROUP_ID"];
    this.drawerData.NAME = data["GROUP_NAME"];
    this.drawerVisible = true;
    this.drawerData._20_21_MEMBER_COUNT = String(data._20_21_MEMBER_COUNT);
    this.drawerData._21_22_MEMBER_COUNT = String(data._21_22_MEMBER_COUNT);

    if (data.GROUP_TYPE == null) {
      this.drawerData.GROUP_TYPE = "N";
    }

    if (data.ORIENTATION_DATE == null) {
      this.drawerData.ORIENTATION_DATE = this.datePipe.transform(data.BO_DATE, "yyyy-MM-dd");
      let tempOrentationDate = this.datePipe.transform(this.drawerData.ORIENTATION_DATE, "dd MMM yyyy");
      this.drawerData.ORIENTATION_DRAFT = "This is to certify that orientation meeting was conducted at " + (this.drawerData.VENUE ? this.drawerData.VENUE : "...") + ", on " + tempOrentationDate + " under my chairmanship. During this meeting president, DA and treasurer of ..... group were also present. In all 25 members from ..... group were present in this meeting to discuss on formation of new group. We were instrumentation to explain aims and objectives of giants and BOD was finalized, and minute's book was maintained. The aims and objectives of giants welfare foundation, constitution to be formed for smooth function of the group, annual and entrance fees to be paid to giants international every year were clearly explained to them. Guidance on projects and programs was also done during the orientations meeting.";
    }

    if ((data.SPONSERED_GROUP == null) || (data.SPONSERED_GROUP == 0)) {
      this.drawerData.SPONSERED_GROUP = "0";
    }

    if ((data.PARENT_GROUP_ID == null) || (data.PARENT_GROUP_ID == 0)) {
      this.drawerData.PARENT_GROUP_ID = "0";
    }

    // Administration bank info
    if (this.drawerData.AD_ACC_NO.trim() == "") {
      this.drawerData.AD_ACC_NO = null;
    }

    if (this.drawerData.AD_BANK_NAME.trim() == "") {
      this.drawerData.AD_BANK_NAME = null;
    }

    if (this.drawerData.AD_BRANCH_NAME.trim() == "") {
      this.drawerData.AD_BRANCH_NAME = null;
    }

    // Project bank info
    if (this.drawerData.PR_ACC_NO.trim() == "") {
      this.drawerData.PR_ACC_NO = null;
    }

    if (this.drawerData.PR_BANK_NAME.trim() == "") {
      this.drawerData.PR_BANK_NAME = null;
    }

    if (this.drawerData.PR_BRANCH_NAME.trim() == "") {
      this.drawerData.PR_BRANCH_NAME = null;
    }

    // PAN card
    if (this.drawerData.PAN_NUMBER.trim() == "") {
      this.drawerData.PAN_NUMBER = null;
    }

    this.GroupDrawerComponentVar.pdfFileURL1 = null;
    this.GroupDrawerComponentVar.pdf1Str = "";

    if ((this.drawerData.PAN_URL != " ") && (this.drawerData.PAN_URL != null)) {
      this.drawerData.PAN_URL = this.drawerData.PAN_URL;

    } else {
      this.drawerData.PAN_URL = null;
    }
  }

  drawerClose(): void {
    this.search(true);
    this.drawerVisible = false;
    this.SendForApprovalComponentVar.getGroups();
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  onSearching(): void {
    document.getElementById("button1").focus();
    this.search(true);
  }

  onStatusChange(data: GroupMaster, status: any): void {
    data.STATUS = status;

    this.api.updateGroup(data).subscribe(successCode => {
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
  @ViewChild(AssignGroupMemberComponent, { static: false }) AssignGroupMemberComponentVar: AssignGroupMemberComponent;
  drawerTitleFees: string;
  drawerDataFees: any;
  drawerVisibleFees: boolean = false;
  @ViewChild(GroupFeeTypeDrawerComponent, { static: false }) GroupFeeTypeDrawerComponentVar: GroupFeeTypeDrawerComponent;

  addMembers(data: GroupMaster): void {
    this.memberDrawerTitle = "aaa " + "Group BOD";
    this.memberDrawerData = Object.assign({}, data);
    this.memberDrawerVisible = true;
    this.AssignGroupMemberComponentVar.getData1(data);
    this.AssignGroupMemberComponentVar.gettingGroupBODStatus(data["GROUP_ID"]);
    this.AssignGroupMemberComponentVar.sendForApprovalDrawerInitialization();
  }

  addFeeStructure(data: GroupMaster): void {
    this.drawerTitleFees = "aaa " + "Add Group Fee Structure";
    this.drawerVisibleFees = true;
    this.GroupFeeTypeDrawerComponentVar.getInternationFeeStructure();
    this.GroupFeeTypeDrawerComponentVar.getGroupInfo(data['GROUP_ID']);

    this.feeDetails = [
      { FEE_TYPE: 'Joining Fee', QUARTER: 'NA', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      { FEE_TYPE: 'Joining Year Membership Fee', QUARTER: 'Q1', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      { FEE_TYPE: 'Joining Year Membership Fee', QUARTER: 'Q2', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      { FEE_TYPE: 'Joining Year Membership Fee', QUARTER: 'Q3', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      { FEE_TYPE: 'Joining Year Membership Fee', QUARTER: 'Q4', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      // { FEE_TYPE: 'Next Year Membership Fee', QUARTER: 'Q1', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      // { FEE_TYPE: 'Next Year Membership Fee', QUARTER: 'Q2', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      // { FEE_TYPE: 'Next Year Membership Fee', QUARTER: 'Q3', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      // { FEE_TYPE: 'Next Year Membership Fee', QUARTER: 'Q4', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 }
    ];
  }

  drawerCloseFees(): void {
    this.drawerVisibleFees = false;
    this.search(true);
  }

  get closeCallbackFees() {
    return this.drawerCloseFees.bind(this);
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

  getAddDrawerWidth(): number {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 1200;
  }

  goToUnitMaster(): void {
    this.router.navigateByUrl('/units');
  }

  goToGroupMaster(): void {
    this.router.navigateByUrl('/groupmaster');
  }

  goToMemberMaster(group: GroupMaster): void {
    this.router.navigate(['/members', { group: group["GROUP_ID"] }]);
  }

  back(): void {
    window.history.back();
  }

  newMemberDrawerTitle: string = "";
  newMemberDrawerData: Membermaster = new Membermaster();
  newMemberDrawerVisible: boolean = false;
  @ViewChild(MemberDrawerComponent, { static: false }) MemberDrawerComponentVar: MemberDrawerComponent;
  currentGroupInfo: GroupMaster = new GroupMaster();

  addGroupMembers(groupData: GroupMaster): void {
    this.currentGroupInfo = groupData;
    this.newMemberDrawerTitle = "aaa " + "Add Member";
    this.newMemberDrawerData = new Membermaster();
    this.newMemberDrawerVisible = true;
    this.newMemberDrawerData.MEMBERSHIP_DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    let expiryDate = new Date().setFullYear(new Date().getFullYear() + 1);
    this.newMemberDrawerData.EXPIRY_DATE = this.datePipe.transform(expiryDate, "yyyy-MM-dd");
    this.MemberDrawerComponentVar.fileURL1 = null;

    // Get Units and Groups
    this.MemberDrawerComponentVar.getUnits(groupData["FEDERATION_ID"]);
    this.MemberDrawerComponentVar.getGroups(groupData["UNIT_ID"]);

    this.newMemberDrawerData.FEDERATION_ID = groupData["FEDERATION_ID"];
    this.newMemberDrawerData.UNIT_ID = groupData["UNIT_ID"];
    this.newMemberDrawerData.GROUP_ID = groupData["GROUP_ID"];
  }

  newMemberDrawerClose(): void {
    this.newMemberDrawerVisible = false;
    this.search(true);
  }

  get newMemberDrawerCloseCallback() {
    return this.newMemberDrawerClose.bind(this);
  }

  getGroupType(groupType: string): string {
    if (groupType == "Y") {
      return "Young";

    } else if (groupType == "N") {
      return "Normal";

    } else if (groupType == "S") {
      return "Saheli";
    }
  }

  importDrawerTitle: string = "";
  importDrawerVisible: boolean = false;
  @ViewChild(MemberUploadComponent, { static: false }) MemberUploadComponentVar: MemberUploadComponent;

  openImportDrawer(group: GroupMaster): void {
    this.currentGroupInfo = group;
    this.MemberUploadComponentVar.newArray = [];
    this.importDrawerTitle = "Import Data";
    this.importDrawerVisible = true;
    this.MemberUploadComponentVar.uploadedMembersCount = 0;
    this.MemberUploadComponentVar.duplicateMembersCount = 0;
    this.MemberUploadComponentVar.failedToUploadMembersCount = 0;
    this.MemberUploadComponentVar.federationIDForImport = group["FEDERATION_ID"];
    this.MemberUploadComponentVar.unitIDForImport = group["UNIT_ID"];
    this.MemberUploadComponentVar.groupIDForImport = group["GROUP_ID"];
  }

  importDrawerClose(): void {
    this.importDrawerVisible = false;
    this.search(true);
  }

  get importCloseCallback() {
    return this.importDrawerClose.bind(this);
  }

  goToPayments(group: GroupMaster): void {
    this.router.navigate(['/allpaymentreceipts', { group: group["GROUP_ID"] }]);
  }

  sendApprovalDrawerTitle: string = "";
  sendApprovalDrawerVisible: boolean = false;
  @ViewChild(SendForApprovalComponent, { static: false }) SendForApprovalComponentVar: SendForApprovalComponent;
  DOCUMENTS_LIST: any;
  PAYMENT_LIST: any;
  BIO_DATA_LIST: any;
  GROUP_INFO: any;
  GROUP_INFO_FOR_DRAWER: any;

  goToSendForApproval(groupData: GroupMaster): void {
    this.GROUP_INFO = groupData;
    this.sendApprovalDrawerTitle = "aaa " + "Send For Approval";
    this.SendForApprovalComponentVar.SUBJECT = "Formation of New " + groupData["GROUP_NAME"] + " Group";
    this.SendForApprovalComponentVar.DESCRIPTION = "Respected Sir, <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please find enclosed here with all the relevant documents required for formation of new group along with the demand draft of Rs. ..... of ..... members. The orientation meeting of all members of new group was conducted on " + this.datePipe.transform(groupData.ORIENTATION_DATE, "dd MMM yyyy") + " at under my chairmanship and all the requested of giants international were explained to them. This group has been sponsored by giants group of the certifies and relevant other documents may please be send at the earliest so as to finalize the instillation date of new group 'Giants Group of " + groupData["GROUP_NAME"] + "'.";

    if (groupData["FEDERATION_ID"]) {
      this.SendForApprovalComponentVar.getFederationMemberData(groupData["FEDERATION_ID"]);
      this.SendForApprovalComponentVar.getFederationcentralSpecialCommitteeMemberData(groupData["FEDERATION_ID"]);
    }

    if (groupData["UNIT_ID"]) {
      this.SendForApprovalComponentVar.getUnitMemberData(groupData["UNIT_ID"]);
    }

    if ((groupData["SPONSERED_GROUP"]) && (groupData["GROUP_ID"])) {
      this.SendForApprovalComponentVar.getSponseredGroupMemberData(groupData["SPONSERED_GROUP"], groupData["GROUP_ID"]);
    }

    let obj1 = new Object();
    obj1["GROUP_ID"] = groupData["GROUP_ID"];
    this.loadingRecords = true;

    this.api.sendForApproval(obj1).subscribe(data => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.sendApprovalDrawerVisible = true;
        this.DOCUMENTS_LIST = data["documentsFiles"];
        this.PAYMENT_LIST = data["paymentFiles"];
        this.BIO_DATA_LIST = data["bioDataFiles"];
        this.GROUP_INFO_FOR_DRAWER = data["data"];
        this.SendForApprovalComponentVar.DESCRIPTION = "Respected Sir, <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please find enclosed here with all the relevant documents required for formation of new group along with the demand draft of Rs. " + data["data"][0]["MEMBER_FEES"] + "/- of " + data["data"][0]["MEMBER_COUNT"] + " member(s). The orientation meeting of all members of new group was conducted on " + this.datePipe.transform(groupData.ORIENTATION_DATE, "dd MMM yyyy") + " at under my chairmanship and all the requested of giants international were explained to them. This group has been sponsored by giants group of the certifies and relevant other documents may please be send at the earliest so as to finalize the instillation date of new group 'Giants Group of " + groupData["GROUP_NAME"] + "'.";

      } else {
        this.message.info(data['message'], "");
        this.loadingRecords = false;
      }

    }, err => {
      this.loadingRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  sendForUnitDirector(groupData: GroupMaster): void {
    this.api.sendToUnitDirector(groupData["GROUP_ID"], this.groupID).subscribe(data => {
      if (data['code'] == 200) {
        this.message.success("BOD Approval Email Sent to Unit Director", "");

      } else {
        this.message.error(data['message'], "");
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  sendApprovalDrawerClose(): void {
    this.sendApprovalDrawerVisible = false;
    this.search(true);
  }

  get sendApprovalDrapwerCloseCallback() {
    return this.sendApprovalDrawerClose.bind(this);
  }

  downloadCSVFile(): void {
    window.open(this.api.retriveimgUrl + "CSVFileFormat/MemberMaster.csv");
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
  FEDERATION_ID: any[] = [];
  UNIT_ID: any[] = [];

  advanceFilterModalOk(): void {
    this.advanceFilterModalVisible = false;
    this.advanceMultipleSearchText.splice(0, this.advanceMultipleSearchText.length);
    this.advanceMultipleFederationNames = [];
    this.advanceMultipleUnitNames = [];

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

    this.search(true);
  }

  clearAdvanceFilter(): void {
    this.ADVANCE_FILTER_FROM_DATE = null;
    this.ADVANCE_FILTER_TO_DATE = null;
    this.FEDERATION_ID = [];
    this.UNIT_ID = [];
    this.ACTIVE_STATUS = true;
    this.DROPPED_STATUS = false;

    this.advanceMultipleSearchText.splice(0, this.advanceMultipleSearchText.length);
    this.advanceMultipleFederationNames = [];
    this.advanceMultipleUnitNames = [];
    this.advanceFilterModalVisible = false;

    this.search(true);
  }

  getHeigth(): string {
    if ((this.multipleSearchText.length > 0) || (this.advanceMultipleSearchText.length > 0) || (this.advanceMultipleFederationNames.length > 0) || (this.advanceMultipleUnitNames.length > 0)) {
      return '73vh';

    } else {
      return '80vh';
    }
  }

  getGroupStatus(groupStatus: string): string {
    if (groupStatus == "C") {
      return "Created";

    } else if (groupStatus == "SFA") {
      return "Send for Approval";

    } else if (groupStatus == "R") {
      return "Rejected";

    } else if (groupStatus == "A") {
      return "Approved";

    } else if (groupStatus == "CA") {
      return "Conditionally Approved";
    }
  }

  groupStatusModalVisible: boolean = false;
  remark: string = "";
  memberRemark: string = "";
  paymentRemark: string = "";
  bodRemark: string = "";

  onStatusClick(group: GroupMaster): void {
    this.groupStatusModalVisible = true;
    this.remark = group.REMARKS ? group.REMARKS : "";
    this.memberRemark = group.MEMBER_REMARK ? group.MEMBER_REMARK : "";
    this.paymentRemark = group.PAYMENT_REMARK ? group.PAYMENT_REMARK : "";
    this.bodRemark = group.BOD_REMARK ? group.BOD_REMARK : "";
  }

  groupStatusModalCancel(): void {
    this.groupStatusModalVisible = false;
  }

  top(): void {
    setTimeout(() => {
      document.getElementById('top').scrollIntoView();
    }, 1500);
  }

  cancel(): void { }

  dropGroup(data: GroupMaster): void {
    data.DROPPED_STATUS = true;
    data.DROPPED_DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    data.REVIVED_STATUS = false;
    data.REVIVED_DATE = this.datePipe.transform(new Date(1900, 0, 1), "yyyy-MM-dd");
    data.STATUS = false;
    data.ID = data["GROUP_ID"];
    data.NAME = data["GROUP_NAME"];
    data.REVIVED_BY_GROUP_ID = "0";
    this.loadingRecords = true;

    this.api.updateGroup(data).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Group Dropped Successfully", "");
        this.search(true);

      } else {
        this.message.error("Failed to Group Drop", "");
        this.search(true);
      }
    });
  }

  ACTIVE_STATUS: boolean = true;
  DROPPED_STATUS: boolean = false;
  auditReportData: AuditReport = new AuditReport();
  isAuditReportModalVisible: boolean = false;
  isAuditReportLoading: boolean = false;

  showAuditReportModal(): void {
    this.isAuditReportModalVisible = true;
    this.SELECTED_YEAR = new Date().getFullYear();
    this.getYearWiseExistingAuditReport(this.SELECTED_YEAR, this.groupID);
  }

  getYearWiseExistingAuditReport(selectedYear: number, groupID: number): void {
    this.pdfFileURL1 = null;
    this.AUDIT_REPORT_URL = null;
    this.isAuditReportLoading = true;

    this.api.getAuditReport(0, 0, "", "", " AND YEAR=" + selectedYear + " AND GROUP_ID=" + groupID).subscribe(data => {
      if (data['code'] == 200) {
        this.isAuditReportLoading = false;
        this.auditReportData = Object.assign({}, data['data'][0]);

        if ((this.auditReportData.FILE_URL) && (this.auditReportData.FILE_URL.trim() != "")) {
          this.AUDIT_REPORT_URL = this.auditReportData.FILE_URL;

        } else {
          this.AUDIT_REPORT_URL = null;
        }

      } else {
        this.isAuditReportLoading = false;
      }

    }, err => {
      this.isAuditReportLoading = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  handleAuditReportCancel(): void {
    this.isAuditReportModalVisible = false;
  }

  baseYear: number = 2020;
  range: any[] = [];

  getYears(): void {
    let currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= this.baseYear; i--) {
      this.range.push(i);
    }
  }

  folderName: string = "auditReport";
  pdfFileURL1: any = null;
  AUDIT_REPORT_URL: any = null;
  pdf1Str: string;
  SELECTED_YEAR: number;

  onPdfFileSelected1(event: any): void {
    if ((event.target.files[0].type == 'application/pdf') || (event.target.files[0].type == 'image/jpeg') || (event.target.files[0].type == 'image/jpg') || (event.target.files[0].type == 'image/png')) {
      this.pdfFileURL1 = <File>event.target.files[0];

    } else {
      this.message.error('Please Choose Only pdf or Image File', '');
      this.pdfFileURL1 = null;
    }
  }

  pdfUpload1(): void {
    this.pdf1Str = "";

    if (!this.auditReportData.ID) {
      if (this.pdfFileURL1) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.pdfFileURL1.name.split('.').pop();
        var url = "AUDIT_REPORT_" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.pdfFileURL1, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.pdf1Str = url;

      } else {
        this.pdf1Str = "";
      }

    } else {
      if (this.pdfFileURL1) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.pdfFileURL1.name.split('.').pop();
        var url = "AUDIT_REPORT_" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.pdfFileURL1, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.pdf1Str = url;

      } else {
        if (this.auditReportData.FILE_URL) {
          this.pdf1Str = this.auditReportData.FILE_URL;

        } else
          this.pdf1Str = "";
      }
    }
  }

  viewAuditReport(auditReportUrl: string): void {
    window.open(this.api.retriveimgUrl + this.folderName + "/" + auditReportUrl);
  }

  pdfClear1(): void {
    this.pdfFileURL1 = null;
    this.AUDIT_REPORT_URL = null;
  }

  submitAuditReport(): void {
    let isOK = true;

    if ((this.SELECTED_YEAR == undefined) || (this.SELECTED_YEAR == null)) {
      isOK = false;
      this.message.info('Please Select Year', '');
    }

    if ((this.pdfFileURL1 == undefined) || (this.pdfFileURL1 == null)) {
      isOK = false;
      this.message.info('Please Choose Audit Report File', '');
    }

    if (isOK) {
      this.isAuditReportLoading = true;
      this.auditReportData.GROUP_ID = this.groupID;
      this.auditReportData.YEAR = this.SELECTED_YEAR;

      this.pdfUpload1();
      this.auditReportData.FILE_URL = (this.pdf1Str == "") ? " " : this.pdf1Str;

      if (this.auditReportData.ID) {
        this.api.updateAuditReport(this.auditReportData).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.isAuditReportLoading = false;
            this.message.success("Audit Report Updated Successfully", "");
            this.isAuditReportModalVisible = false;

          } else {
            this.isAuditReportLoading = false;
            this.message.error("Failed to Update Audit Report", "");
          }
        });

      } else {
        this.api.createAuditReport(this.auditReportData).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.isAuditReportLoading = false;
            this.message.success("Audit Report Submitted Successfully", "");
            this.isAuditReportModalVisible = false;

          } else {
            this.isAuditReportLoading = false;
            this.message.error("Failed to Submit Audit Report", "");
          }
        });
      }

      this.pdfFileURL1 = null;
      this.AUDIT_REPORT_URL = null;
    }
  }

  onAuditReportYearChange(selectedYear: number): void {
    this.getYearWiseExistingAuditReport(selectedYear, this.groupID);
  }

  revivedByGroups: any[] = [];
  REVIVED_BY_GROUP_ID: any;
  reviveGroupLoading: boolean = false;

  getRevivedByGroups(groupName: string): void {
    if (groupName.length >= 3) {
      let unitFilter = " AND UNIT_ID=" + this.revivedGroupData["UNIT_ID"];
      this.reviveGroupLoading = true;

      this.api.getAllGroups(0, 0, "NAME", "ASC", " AND STATUS=1 AND NAME LIKE '%" + groupName + "%'" + unitFilter).subscribe(data => {
        if (data['code'] == 200) {
          this.reviveGroupLoading = false;
          this.revivedByGroups = data['data'];
        }

      }, err => {
        this.reviveGroupLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  revivedGroupModalVisible: boolean = false;
  revivedGroupData: GroupMaster = new GroupMaster();

  openReviveGroupModal(data: GroupMaster): void {
    this.revivedGroupData = data;
    this.revivedGroupModalVisible = true;
    this.REVIVED_BY_GROUP_ID = undefined;
    this.revivedByGroups = [];
  }

  revivedGroupModalCancel(): void {
    this.revivedGroupModalVisible = false;
  }

  reviveGroup(): void {
    let isOk = true;

    if ((this.REVIVED_BY_GROUP_ID == undefined) || (this.REVIVED_BY_GROUP_ID == null)) {
      isOk = false;
      this.message.info('Please Select Revive By Group Name', '');
    }

    if (isOk) {
      let data = this.revivedGroupData;
      data.DROPPED_STATUS = false;
      data.DROPPED_DATE = this.datePipe.transform(new Date(1900, 0, 1), "yyyy-MM-dd");
      data.REVIVED_STATUS = true;
      data.REVIVED_DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");
      data.STATUS = true;
      data.ID = this.revivedGroupData["GROUP_ID"];
      data.NAME = this.revivedGroupData["GROUP_NAME"];
      data.REVIVED_BY_GROUP_ID = this.REVIVED_BY_GROUP_ID;
      this.loadingRecords = true;

      this.api.updateGroup(data).subscribe(successCode => {
        if (successCode['code'] == 200) {
          this.message.success("Group Revived Successfully", "");
          this.revivedGroupModalVisible = false;
          this.search(true);

        } else {
          this.message.error("Failed to Group Revive", "");
          this.revivedGroupModalVisible = false;
          this.search(true);
        }
      });
    }
  }
}
