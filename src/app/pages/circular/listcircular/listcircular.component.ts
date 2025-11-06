import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { CircularMaster } from 'src/app/Models/Circular';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Service/api.service';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Membermaster } from 'src/app/Models/MemberMaster';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { AddcircularComponent } from '../addcircular/addcircular.component';
import { FederationMaster } from 'src/app/Models/FederationMaster';
import { CircularemailsenderlistComponent } from '../circularemailsenderlist/circularemailsenderlist.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-listcircular',
  templateUrl: './listcircular.component.html',
  styleUrls: ['./listcircular.component.css']
})

export class ListcircularComponent implements OnInit {
  drawerVisible: boolean = false;
  drawerTitle: string;
  drawerData: CircularMaster = new CircularMaster();
  formTitle: string = "Circulars";
  dataList: any[] = [];
  loadingRecords: boolean = false;
  totalRecords: number = 1;
  pageIndex: number = 1;
  pageSize: number = 10;
  sortKey: string = "DATE";
  sortValue: string = "desc";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: string = "default";
  columns: string[][] = [['CREATOR_NAME', 'Created By'], ['CIRCULAR_TYPE_NAME', 'Circular Type'], ['SUBJECT', 'Subject'], ["FEDERATION_NAME", "FEDERATION_NAME"], ["UNIT_NAME", "UNIT_NAME"], ["GROUP_NAME", "GROUP_NAME"]];
  advanceFilterColumns: string[][] = [["DATE", "DATE"]];
  advanceFilterColumnsFederationNames: string[][] = [["FEDERATION_NAME", "FEDERATION_NAME"]];
  advanceFilterColumnsUnitNames: string[][] = [["UNIT_NAME", "UNIT_NAME"]];
  advanceFilterColumnsGroupNames: string[][] = [["GROUP_NAME", "GROUP_NAME"]];
  advanceFilterColumnsCircularTypeNames: string[][] = [["CIRCULAR_TYPE_NAME", "CIRCULAR_TYPE_NAME"]];
  userID: number = this.api.userId;
  isRemarkVisible: boolean = false;
  DESCRIPTION1: string = '';
  sign = '';
  memberData: Membermaster = new Membermaster();
  loadingRecords2: boolean = false;
  emitted = false;
  filter = '';
  private categoriesSubject = new BehaviorSubject<Array<string>>([]);
  categories$ = this.categoriesSubject.asObservable();
  DETAILSModalVisible: boolean = false;
  selectedIndex: number = -1;

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  homeFederationID: number = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
  homeUnitID: number = Number(sessionStorage.getItem("HOME_UNIT_ID"));
  homeGroupID: number = Number(sessionStorage.getItem("HOME_GROUP_ID"));

  roleID: number = this.api.roleId;
  RETRIVE_IMAGE_URL: string = this.api.retriveimgUrl;
  auth2RejectRemarkExpand: boolean[] = [];
  auth3RejectRemarkExpand: boolean[] = [];
  USER_ID: number = this.api.userId;

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private sanitizer: DomSanitizer) { }

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

  circulars: any[] = [];

  getCircularsTypes(circularName: string): void {
    if (circularName.length >= 3) {
      this.api.getAllCircularType(0, 0, "NAME", "asc", " AND STATUS=1 AND NAME LIKE '%" + circularName + "%'").subscribe(data => {
        if (data['code'] == 200) {
          this.circulars = data['data'];
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  @HostListener('document:touchmove', ['$event'])
  @HostListener('document:wheel', ['$event'])

  onScroll(e: any) {
    if (Math.round(document.getElementById("activityItem").scrollTop + document.getElementById("activityItem").offsetHeight + 1) >= document.getElementById("activityItem").scrollHeight && !this.emitted) {
      this.emitted = true;
      this.onScrollingFinished();

    } else if (Math.round(document.getElementById("activityItem").scrollTop + document.getElementById("activityItem").offsetHeight + 1) < document.getElementById("activityItem").scrollHeight) {
      this.emitted = false;
    }
  }

  onScrollingFinished() {
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

  ngOnInit(): void {
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
      sort = this.sortValue.startsWith('a') ? 'asc' : 'desc';

    } catch (error) {
      sort = '';
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

    var advanceLikeQueryCircularTypeNames = "";

    if (this.advanceMultipleCircularTypeNames.length > 0) {
      for (var i = 0; i < this.advanceMultipleCircularTypeNames.length; i++) {
        this.advanceFilterColumnsCircularTypeNames.forEach(column => {
          advanceLikeQueryCircularTypeNames += " " + column[0] + " like '%" + this.advanceMultipleCircularTypeNames[i] + "%' OR";
        });
      }

      advanceLikeQueryCircularTypeNames = " AND (" + advanceLikeQueryCircularTypeNames.substring(0, advanceLikeQueryCircularTypeNames.length - 2) + ')';
    }

    let circularDisplayStatusFilter = "";
    circularDisplayStatusFilter = " AND ((SIGNING_AUTHORITY3=" + this.userID + " AND SUBMITTED_TO_SIGNING_AUTHORITY3=1 AND SIGNING_AUTHORITY3_STATUS NOT IN ('A','R') AND IS_DELETED=0) OR (SIGNING_AUTHORITY2=" + this.userID + " AND SUBMITTED_TO_SIGNING_AUTHORITY2=1 AND SIGNING_AUTHORITY2_STATUS NOT IN ('A','R') AND IS_DELETED=0) OR (CREATER_ID=" + this.userID + " AND IS_DELETED=0) OR (STATUS='P' AND IS_DELETED=0))";

    // Global filter
    let globalFederationFilter = "";

    if (sessionStorage.getItem("FILTER") === "MF") {
      globalFederationFilter = " AND FEDERATION_ID=" + this.homeFederationID;
    }

    // Filter to show circular
    let filterToShow = "";

    if ((this.roleID != 59) && (this.roleID != 60) && (this.roleID != 61)) {
      if (this.federationID > 0) {
        filterToShow = " AND (FEDERATION_ID_TO_SHOW=" + this.homeFederationID + " OR UNIT_ID_TO_SHOW IN (" + sessionStorage.getItem("unitIDsUnderMyFederation") + ") OR GROUP_ID_TO_SHOW IN (" + sessionStorage.getItem("groupIDsUnderMyFederation") + "))";
      }

      if (this.unitID > 0) {
        filterToShow = " AND (FEDERATION_ID_TO_SHOW=" + this.homeFederationID + " OR UNIT_ID_TO_SHOW=" + this.homeUnitID + " OR GROUP_ID_TO_SHOW IN (" + sessionStorage.getItem("groupIDsUnderMyUnit") + "))";
      }

      if ((this.groupID > 0) || ((this.federationID == 0) && (this.unitID == 0) && (this.groupID == 0))) {
        filterToShow = " AND (FEDERATION_ID_TO_SHOW=" + this.homeFederationID + " OR UNIT_ID_TO_SHOW=" + this.homeUnitID + " OR GROUP_ID_TO_SHOW=" + this.homeGroupID + ")";
      }
    }

    this.loadingRecords = true;

    this.api.getAllCircular(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + advanceLikeQuery + advanceLikeQueryFederationNames + advanceLikeQueryUnitNames + advanceLikeQueryGroupNames + advanceLikeQueryCircularTypeNames + circularDisplayStatusFilter + globalFederationFilter + filterToShow).subscribe((data) => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.auth2RejectRemarkExpand = new Array(this.totalRecords).fill(false);
        this.auth3RejectRemarkExpand = new Array(this.totalRecords).fill(false);

        if (loadMore) {
          this.dataList.push(...data['data']);

        } else {
          this.dataList = data['data'];
        }

        this.pageIndex++;
      }

    }, (err) => {
      this.loadingRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  drawerClose(): void {
    this.search(true);
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  @ViewChild(AddcircularComponent, { static: false }) AddcircularComponentVar: AddcircularComponent;

  add(): void {
    this.drawerTitle = "aaa " + "Add Circular";
    this.drawerData = new CircularMaster();
    this.drawerData.LETTER_HEAD_ID = this.api.userId;
    this.drawerData.SIGNING_AUTHORITY1 = this.api.userId;
    this.drawerData.SIGNING_AUTHORITY2 = null;
    this.drawerData.SIGNING_AUTHORITY3 = null;
    this.drawerData.LETTER_HEAD = "SIGNING_AUTHORITY1";
    this.drawerData.DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");

    this.AddcircularComponentVar.getIDs();
    this.AddcircularComponentVar.attachedpdfFileURL1 = null;
    this.AddcircularComponentVar.attachedpdfFileURL2 = null;
    this.AddcircularComponentVar.attachedpdfFileURL3 = null;
    this.AddcircularComponentVar.Members2 = [];
    this.AddcircularComponentVar.Members3 = [];
    this.AddcircularComponentVar.editAccess = false;

    this.drawerVisible = true;
    this.loadingRecords = true;

    this.api.getAllMembers(0, 0, "NAME", "asc", " AND ID=" + this.api.userId).subscribe(data => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.memberData = data['data'][0];
        sessionStorage.setItem('Img', (this.memberData["SIGNATURE"] == undefined) ? '' : this.memberData["SIGNATURE"]);
        this.sign = (sessionStorage.getItem('Img') == undefined) ? '' : sessionStorage.getItem('Img');

      } else {
        this.loadingRecords = false;
      }

    }, err => {
      this.loadingRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  edit(data: CircularMaster): void {
    this.drawerTitle = "aaa " + "Update Circular";
    this.drawerData = Object.assign({}, data);
    this.AddcircularComponentVar.getIDs();
    this.AddcircularComponentVar.attachedpdfFileURL1 = null;
    this.AddcircularComponentVar.attachedpdfFileURL2 = null;
    this.AddcircularComponentVar.attachedpdfFileURL3 = null;

    if (this.drawerData.CREATER_ID == this.userID) {
      this.AddcircularComponentVar.editAccess = false;

    } else {
      this.AddcircularComponentVar.editAccess = true;
    }

    this.drawerVisible = true;
    this.loadingRecords = true;

    this.api.getAllMembers(0, 0, "NAME", "asc", " AND ID=" + this.api.userId).subscribe(data => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.memberData = data['data'][0];
        sessionStorage.setItem('Img', (this.memberData["SIGNATURE"] == undefined) ? '' : this.memberData["SIGNATURE"]);
        this.sign = (sessionStorage.getItem('Img') == undefined) ? '' : sessionStorage.getItem('Img');

      } else {
        this.loadingRecords = false;
      }

    }, err => {
      this.loadingRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    // Attached file
    if (this.drawerData.ATTACHED_PDF1 != " ") {
      this.drawerData.ATTACHED_PDF1 = this.drawerData.ATTACHED_PDF1;

    } else {
      this.drawerData.ATTACHED_PDF1 = null;
    }

    if (this.drawerData.ATTACHED_PDF2 != " ") {
      this.drawerData.ATTACHED_PDF2 = this.drawerData.ATTACHED_PDF2;

    } else {
      this.drawerData.ATTACHED_PDF2 = null;
    }

    if (this.drawerData.ATTACHED_PDF3 != " ") {
      this.drawerData.ATTACHED_PDF3 = this.drawerData.ATTACHED_PDF3;

    } else {
      this.drawerData.ATTACHED_PDF3 = null;
    }

    // Get signing auth. 1
    if (this.drawerData.SIGNING_AUTHORITY1) {
      this.AddcircularComponentVar.getMembers1OnEdit(this.drawerData.SIGNING_AUTHORITY1);
    }

    // Get signing auth. 2
    if (this.drawerData.SIGNING_AUTHORITY2) {
      this.AddcircularComponentVar.getMembers2OnEdit(this.drawerData.SIGNING_AUTHORITY2);
    }

    // Get signing auth. 3
    if (this.drawerData.SIGNING_AUTHORITY3) {
      this.AddcircularComponentVar.getMembers3OnEdit(this.drawerData.SIGNING_AUTHORITY3);
    }
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true);
  }

  getwidth(): number {
    if (window.innerWidth <= 400) {
      return 380;

    } else {
      return 1000;
    }
  }

  getwidth2(): number {
    if (window.innerWidth <= 400) {
      return 380;

    } else {
      return 1200;
    }
  }

  currentIndex: number = -1;
  isVisible: boolean = false;
  SIGNATURE1: string;
  MEMBER_ROLE1: string;
  CREATOR_NAME1: string;
  ROLE1_FEDERATION_UNIT_GROUP: string = "";

  SIGNATURE2: string;
  MEMBER_ROLE2: string;
  CREATOR_NAME2: string;
  ROLE2_FEDERATION_UNIT_GROUP: string = "";

  SIGNATURE3: string;
  MEMBER_ROLE3: string;
  CREATOR_NAME3: string;
  ROLE3_FEDERATION_UNIT_GROUP: string = "";

  GENDER1: string;
  GENDER2: string;
  GENDER3: string;

  getSIGNING_AUTHORITY1(i: any): void {
    this.api.getAllMembers(0, 0, "NAME", "asc", " AND ID=" + this.dataList[i]["SIGNING_AUTHORITY1"]).subscribe(data21 => {
      if ((data21['code'] == 200) && (data21['data'].length > 0)) {
        this.SIGNATURE1 = data21['data'][0]['SIGNATURE'];
        this.MEMBER_ROLE1 = data21['data'][0]['MEMBER_ROLE'];
        this.CREATOR_NAME1 = data21['data'][0]['NAME'];
        this.GENDER1 = data21['data'][0]['GENDER'];

        if (data21['data'][0]['MEMBER_ROLE'] == 'Federation President') {
          this.ROLE1_FEDERATION_UNIT_GROUP = data21['data'][0]['FEDERATION_NAME'];

        } else if (data21['data'][0]['MEMBER_ROLE'] == 'Unit Director') {
          this.ROLE1_FEDERATION_UNIT_GROUP = data21['data'][0]['UNIT_NAME'];

        } else if (data21['data'][0]['MEMBER_ROLE'] == 'Group President') {
          this.ROLE1_FEDERATION_UNIT_GROUP = data21['data'][0]['GROUP_NAME'];

        } else {
          this.ROLE1_FEDERATION_UNIT_GROUP = "";
        }
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getSIGNING_AUTHORITY2(i: any): void {
    this.api.getAllMembers(0, 0, "NAME", "asc", " AND ID=" + this.dataList[i]["SIGNING_AUTHORITY2"]).subscribe(data22 => {
      if ((data22['code'] == 200) && (data22['data'].length > 0)) {
        this.SIGNATURE2 = data22['data'][0]['SIGNATURE'];
        this.MEMBER_ROLE2 = data22['data'][0]['MEMBER_ROLE'];
        this.CREATOR_NAME2 = data22['data'][0]['NAME'];
        this.GENDER2 = data22['data'][0]['GENDER'];

        if (data22['data'][0]['MEMBER_ROLE'] == 'Federation President') {
          this.ROLE2_FEDERATION_UNIT_GROUP = data22['data'][0]['FEDERATION_NAME'];

        } else if (data22['data'][0]['MEMBER_ROLE'] == 'Unit Director') {
          this.ROLE2_FEDERATION_UNIT_GROUP = data22['data'][0]['UNIT_NAME'];

        } else if (data22['data'][0]['MEMBER_ROLE'] == 'Group President') {
          this.ROLE2_FEDERATION_UNIT_GROUP = data22['data'][0]['GROUP_NAME'];

        } else {
          this.ROLE2_FEDERATION_UNIT_GROUP = "";
        }
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getSIGNING_AUTHORITY3(i: any): void {
    this.api.getAllMembers(0, 0, "NAME", "asc", " AND ID=" + this.dataList[i]["SIGNING_AUTHORITY3"]).subscribe(data23 => {
      if ((data23['code'] == 200) && (data23['data'].length > 0)) {
        this.SIGNATURE3 = data23['data'][0]['SIGNATURE'];
        this.MEMBER_ROLE3 = data23['data'][0]['MEMBER_ROLE'];
        this.GENDER3 = data23['data'][0]['GENDER'];
        this.CREATOR_NAME3 = data23['data'][0]['NAME'];

        if (data23['data'][0]['MEMBER_ROLE'] == 'Federation President') {
          this.ROLE3_FEDERATION_UNIT_GROUP = data23['data'][0]['FEDERATION_NAME'];

        } else if (data23['data'][0]['MEMBER_ROLE'] == 'Unit Director') {
          this.ROLE3_FEDERATION_UNIT_GROUP = data23['data'][0]['UNIT_NAME'];

        } else if (data23['data'][0]['MEMBER_ROLE'] == 'Group President') {
          this.ROLE3_FEDERATION_UNIT_GROUP = data23['data'][0]['GROUP_NAME'];

        } else {
          this.ROLE3_FEDERATION_UNIT_GROUP = "";
        }
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  downloadBtn: boolean = false;
  displaySigningAuth2Sign: boolean = false;
  displaySigningAuth3Sign: boolean = false;
  federationInfo: FederationMaster = new FederationMaster();
  presidentInfo: Membermaster = new Membermaster();

  viewPDF(i: any, data: CircularMaster): void {
    this.loadingRecords = true;

    if (data.STATUS == "P") {
      this.downloadBtn = true;

    } else {
      this.downloadBtn = false;
    }

    if ((data.SIGNING_AUTHORITY2) && (data.SUBMITTED_TO_SIGNING_AUTHORITY2) && ((data.SIGNING_AUTHORITY2_STATUS == "A") || (data.SIGNING_AUTHORITY2 == this.USER_ID))) {
      this.displaySigningAuth2Sign = true;

    } else {
      this.displaySigningAuth2Sign = false;
    }

    if ((data.SIGNING_AUTHORITY3) && (data.SUBMITTED_TO_SIGNING_AUTHORITY3) && ((data.SIGNING_AUTHORITY3_STATUS == "A") || (data.SIGNING_AUTHORITY3 == this.USER_ID))) {
      this.displaySigningAuth3Sign = true;

    } else {
      this.displaySigningAuth3Sign = false;
    }

    this.getSIGNING_AUTHORITY1(i);
    this.getSIGNING_AUTHORITY2(i);
    this.getSIGNING_AUTHORITY3(i);

    this.loadingRecords = true;

    this.api.getAllMembers(0, 0, "NAME", "asc", " AND ID=" + data.LETTER_HEAD_ID).subscribe(data => {
      if ((data['code'] == 200) && (data['data'].length > 0)) {
        this.loadingRecords = false;
        this.isVisible = true;
        this.memberData = data['data'][0];
        this.currentIndex = i;

      } else {
        this.loadingRecords = false;
      }

    }, err => {
      this.loadingRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    // Get Federation Info
    this.api.getAllFederations(0, 0, "ID", "asc", " AND ID=" + data.FEDERATION_ID).subscribe(data => {
      if (data['code'] == 200) {
        this.federationInfo = data["data"][0];

        this.api.getAllMembers(0, 0, "NAME", "asc", " AND ID=" + this.federationInfo["PRESIDENT"]).subscribe(data => {
          if (data['code'] == 200) {
            this.presidentInfo = data['data'][0];
          }

        }, err => {
          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  public handlePrint(): void {
    const printContents = document.getElementById('modal').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  }

  handleCancel(): void {
    this.isVisible = false;
    this.CREATOR_NAME1 = null;
    this.MEMBER_ROLE1 = null;
    this.SIGNATURE1 = null;
    this.CREATOR_NAME2 = null;
    this.MEMBER_ROLE2 = null;
    this.SIGNATURE2 = null;
    this.CREATOR_NAME3 = null;
    this.MEMBER_ROLE3 = null;
    this.SIGNATURE3 = null;
  }

  viewDETAILS(activity: any): void {
    this.DETAILSModalVisible = true;
    this.DESCRIPTION1 = activity.DESCRIPTION;
  }

  DETAILSModalCancel(): void {
    this.DETAILSModalVisible = false;
  }

  photoModalCancel(): void { }

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

  onAdvanceFilterCircularTypeTagClose(index: number): void {
    this.advanceMultipleCircularTypeNames.splice(index, 1);
    this.CIRCULAR_TYPE_ID.splice(index, 1);
    this.search(true);
  }

  disabledToDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.ADVANCE_FILTER_FROM_DATE ? this.ADVANCE_FILTER_FROM_DATE : this.today) < 0;

  onFromDateChange(fromDate: any): void {
    if (fromDate == null) {
      this.ADVANCE_FILTER_TO_DATE = new Date();

    } else {
      this.ADVANCE_FILTER_TO_DATE = new Date(fromDate);
    }
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
  advanceMultipleCircularTypeNames: any[] = [];
  FEDERATION_ID: any[] = [];
  UNIT_ID: any[] = [];
  GROUP_ID: any[] = [];
  CIRCULAR_TYPE_ID: any[] = [];

  advanceFilterModalOk(): void {
    this.advanceFilterModalVisible = false;
    this.advanceMultipleSearchText.splice(0, this.advanceMultipleSearchText.length);
    this.advanceMultipleFederationNames = [];
    this.advanceMultipleUnitNames = [];
    this.advanceMultipleGroupNames = [];
    this.advanceMultipleCircularTypeNames = [];

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

    if (this.CIRCULAR_TYPE_ID.length > 0) {
      for (let i = 0; i < this.CIRCULAR_TYPE_ID.length; i++) {
        this.advanceMultipleCircularTypeNames.push(this.CIRCULAR_TYPE_ID[i]);
      }
    }

    this.search(true);
  }

  clearAdvanceFilter(): void {
    this.ADVANCE_FILTER_FROM_DATE = null;
    this.ADVANCE_FILTER_TO_DATE = null;
    this.FEDERATION_ID = [];
    this.UNIT_ID = [];
    this.GROUP_ID = [];
    this.CIRCULAR_TYPE_ID = [];

    this.advanceMultipleSearchText.splice(0, this.advanceMultipleSearchText.length);
    this.advanceMultipleFederationNames = [];
    this.advanceMultipleUnitNames = [];
    this.advanceMultipleGroupNames = [];
    this.advanceMultipleCircularTypeNames = [];
    this.advanceFilterModalVisible = false;

    this.search(true);
  }

  getHeigth(): string {
    if ((this.multipleSearchText.length > 0) || (this.advanceMultipleSearchText.length > 0) || (this.advanceMultipleFederationNames.length > 0) || (this.advanceMultipleUnitNames.length > 0) || (this.advanceMultipleGroupNames.length > 0) || (this.advanceMultipleCircularTypeNames.length > 0)) {
      return '73vh';

    } else {
      return '80vh';
    }
  }

  getProfilePhoto(photoURL: string): string {
    if ((photoURL == null) || (photoURL.trim() == '')) {
      return 'assets/anony.png';

    } else {
      return this.api.retriveimgUrl + 'profileImage/' + photoURL;
    }
  }

  onMemberNameClick(memberName: string): void {
    this.multipleSearchText.push(memberName);
    this.search(true);
  }

  viewAttachedPDF(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + "circularPdf/" + pdfURL);
  }

  top(): void {
    setTimeout(() => {
      document.getElementById('top').scrollIntoView();
    }, 1500);
  }

  circularDrawerVisibleEmail: boolean = false;
  circularDrawerTitleEmail: string;
  circularDrawerDataID: number;
  @ViewChild(CircularemailsenderlistComponent, { static: false }) CircularemailsenderlistComponentVar: CircularemailsenderlistComponent;

  circularDrawerCloseEmail(): void {
    this.circularDrawerVisibleEmail = false;
  }

  get circularDrawerCloseEmailCallback() {
    return this.circularDrawerCloseEmail.bind(this);
  }

  sendMail(data: CircularMaster): void {
    this.circularDrawerVisibleEmail = true;
    this.circularDrawerDataID = data.ID;
    this.circularDrawerTitleEmail = "aaa " + "Circular Email Sender List";

    this.CircularemailsenderlistComponentVar.getFederationMemberData(this.homeFederationID);
    this.CircularemailsenderlistComponentVar.getFederationcentralSpecialCommitteeMemberData(this.homeFederationID);
    this.CircularemailsenderlistComponentVar.getUnitMemberData(this.homeUnitID);
    this.CircularemailsenderlistComponentVar.getSponseredGroupMemberData(this.homeGroupID);
  }

  deleteCircular(data: CircularMaster): void {
    data.IS_DELETED = true;
    this.loadingRecords = true;

    this.api.updateCircular(data).subscribe((successCode) => {
      if (successCode.code == 200) {
        this.message.success('Circular Deleted Successfully', '');
        this.search(true);

      } else {
        this.message.error('Circular Deletion Failed', '');
        this.search(true);
      }
    });
  }

  publishCircular(data: CircularMaster): void {
    data.STATUS = "P";
    this.loadingRecords = true;

    this.api.updateCircular(data).subscribe((successCode) => {
      if (successCode.code == 200) {
        this.message.success('Circular Published Successfully', '');
        this.search(true);

      } else {
        this.message.error('Failed to Publish Circular', '');
        this.search(true);
      }
    });
  }

  cancel(): void { }

  viewFileDrawerVisible: boolean = false;
  viewFileDrawerTitle: string;
  attachedFiles: any[] = [];
  sanitizedLink: any;

  viewAttachedFiles(files: any, title: string = ""): void {
    // let tempAttachedFiles = files.split(",");
    // this.attachedFiles = [];

    // tempAttachedFiles.forEach((item: any) => {
    //   this.attachedFiles.push(this.api.retriveimgUrl + "circularPdf/" + item);
    // });

    this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.api.retriveimgUrl + "circularPdf/" + files);
    this.viewFileDrawerVisible = true;
    let tempTitle = "";

    if (title == "") {
      tempTitle = "File(s)";

    } else {
      tempTitle = title;
    }

    this.viewFileDrawerTitle = "Attached " + tempTitle;
  }

  viewFileDrawerClose(): void {
    this.viewFileDrawerVisible = false;
  }
}
