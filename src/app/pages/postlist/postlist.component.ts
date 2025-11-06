import { DatePipe } from '@angular/common';
import { Component, OnInit, Output, ViewChild, EventEmitter, HostListener } from '@angular/core';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { Comments, Likes } from 'src/app/Models/comment';
import { Post } from 'src/app/Models/post';
import { ApiService } from 'src/app/Service/api.service';
import { AddpostComponent } from './addpost/addpost.component';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { GroupMaster } from 'src/app/Models/GroupMaster';
import { AddcommentdrawerComponent } from './addcomment/addcommentdrawer/addcommentdrawer.component';
import { MemberReadableProfileComponent } from './member-readable-profile/member-readable-profile.component';
import { NgForm } from '@angular/forms';
import { PostLikeDrawerComponent } from './post-like-drawer/post-like-drawer.component';
// import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-postlist',
  templateUrl: './postlist.component.html',
  styleUrls: ['./postlist.component.css']
})

export class PostlistComponent implements OnInit {
  formTitle: string = "Posts";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList: any[] = [];
  loadingRecords: boolean = true;
  sortKey: string = "POST_CREATED_DATETIME";
  sortValue: string = "desc";
  searchText: string = "";
  multipleSearchText: any[] = [];
  advanceMultipleSearchText: any[] = [];
  advanceMultiplePostCreatedBy: any[] = [];
  advanceMultipleFederationNames: any[] = [];
  advanceMultipleUnitNames: any[] = [];
  advanceMultipleGroupNames: any[] = [];
  advanceMultipleHashtags: any[] = [];
  filterQuery: string = "";
  columns: string[][] = [["CREATER_MEMBER_NAME", "CREATER_MEMBER_NAME"], ["DESCRIPTION", "DESCRIPTION"], ["HASHTAGS", "HASHTAGS"], ["FEDERATION_NAME", "FEDERATION_NAME"], ["UNIT_NAME", "UNIT_NAME"], ["HOME_GROUP_NAME", "HOME_GROUP_NAME"]];
  advanceFilterColumns: string[][] = [["POST_CREATED_DATETIME", "POST_CREATED_DATETIME"]];
  advanceFilterColumnsPostCreatedBy: string[][] = [["CREATER_MEMBER_NAME", "CREATER_MEMBER_NAME"]];
  advanceFilterColumnsFederationNames: string[][] = [["FEDERATION_NAME", "FEDERATION_NAME"]];
  advanceFilterColumnsUnitNames: string[][] = [["UNIT_NAME", "UNIT_NAME"]];
  advanceFilterColumnsGroupNames: string[][] = [["HOME_GROUP_NAME", "HOME_GROUP_NAME"]];
  advanceFilterColumnsHashtags: string[][] = [["HASHTAGS", "HASHTAGS"]];
  drawerVisible: boolean = false;
  drawerTitle: string;
  drawerVisible2: boolean = false;
  drawerTitle2: string;
  drawerData: Post = new Post();
  roleID: number = this.api.roleId;
  userID: number = this.api.userId;
  loadingRecords2: boolean = false;
  emitted: boolean = false;
  filter = '';
  private categoriesSubject = new BehaviorSubject<Array<string>>([]);
  categories$ = this.categoriesSubject.asObservable();
  DETAILSModalVisible: boolean = false;
  selectedIndex: number = -1;
  emitted2: boolean = false;

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  homeFederationID: number = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
  homeUnitID: number = Number(sessionStorage.getItem("HOME_UNIT_ID"));
  homeGroupID: number = Number(sessionStorage.getItem("HOME_GROUP_ID"));

  FEDERATION_ID: any[] = [];
  UNIT_ID: any[] = [];
  GROUP_ID: any[] = [];
  MEMBER_ID: any[] = [];
  HASHTAGS: any[] = [];
  expandDescription: boolean[] = [];

  constructor(public api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService, private modal: NzModalService) { }

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

  members: any[] = [];

  onMemberSearch(memberName: string): void {
    if (memberName.length >= 3) {
      this.api.getAllMembers(0, 0, "NAME", "asc", " AND NAME LIKE '%" + memberName + "%'").subscribe(data => {
        if (data['code'] == 200) {
          this.members = data['data'];
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  hashtags: any[] = [];

  getHashtags(): void {
    this.api.getAllHashtags(0, 0, "NAME", "asc", " AND STATUS=1").subscribe(data => {
      if (data['code'] == 200) {
        this.hashtags = data['data'];
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
    console.log("End");
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

  ngOnInit() {
    this.getIDs();
    this.getFederations();
    this.search(true);
  }

  getIDs(): void {
    this.federationID = Number(sessionStorage.getItem("FEDERATION_ID"));
    this.unitID = Number(sessionStorage.getItem("UNIT_ID"));
    this.groupID = Number(sessionStorage.getItem("GROUP_ID"));

    this.homeFederationID = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
    this.homeUnitID = Number(sessionStorage.getItem("HOME_UNIT_ID"));
    this.homeGroupID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
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

  onAdvanceFilterPostCreatedByTagClose(index: number): void {
    this.advanceMultiplePostCreatedBy.splice(index, 1);
    this.MEMBER_ID.splice(index, 1);
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

  onAdvanceFilterHashtagTagClose(index: number): void {
    this.advanceMultipleHashtags.splice(index, 1);
    this.HASHTAGS.splice(index, 1);
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

    var advanceLikeQueryPostCreatedBy = "";
    if (this.advanceMultiplePostCreatedBy.length > 0) {
      for (var i = 0; i < this.advanceMultiplePostCreatedBy.length; i++) {
        this.advanceFilterColumnsPostCreatedBy.forEach(column => {
          advanceLikeQueryPostCreatedBy += " " + column[0] + " like '%" + this.advanceMultiplePostCreatedBy[i] + "%' OR";
        });
      }

      advanceLikeQueryPostCreatedBy = " AND (" + advanceLikeQueryPostCreatedBy.substring(0, advanceLikeQueryPostCreatedBy.length - 2) + ')';
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

    var advanceLikeQueryHashtags = "";
    if (this.advanceMultipleHashtags.length > 0) {
      for (var i = 0; i < this.advanceMultipleHashtags.length; i++) {
        this.advanceFilterColumnsHashtags.forEach(column => {
          advanceLikeQueryHashtags += " " + column[0] + " like '%" + this.advanceMultipleHashtags[i] + "%' OR";
        });
      }

      advanceLikeQueryHashtags = " AND (" + advanceLikeQueryHashtags.substring(0, advanceLikeQueryHashtags.length - 2) + ')';
    }

    var postAccessFilter = "";
    postAccessFilter = " AND ((IS_DELETED=0 AND MEMBER_ID=" + this.userID + ") OR (IS_DELETED=0 AND POST_STATUS='P' AND POST_TYPE='P') OR (IS_DELETED=0 AND POST_STATUS='P' AND POST_TYPE='G' AND find_in_set('" + this.homeGroupID + "',TYPE_ID)) OR (IS_DELETED=0 AND POST_STATUS='P' AND POST_TYPE='U' AND find_in_set('" + this.homeUnitID + "',TYPE_ID)) OR (IS_DELETED=0 AND POST_STATUS='P' AND POST_TYPE='F' AND find_in_set('" + this.homeFederationID + "',TYPE_ID)))";

    var globalFederationFilter = "";
    if (sessionStorage.getItem("FILTER") === "MF") {
      globalFederationFilter = " AND FEDERATION_ID=" + this.homeFederationID;
    }

    this.loadingRecords = true;

    this.api.getAllUaserposts(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + advanceLikeQuery + advanceLikeQueryPostCreatedBy + advanceLikeQueryFederationNames + advanceLikeQueryUnitNames + advanceLikeQueryGroupNames + advanceLikeQueryHashtags + postAccessFilter + globalFederationFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.expandDescription = new Array(this.totalRecords).fill(false);

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

  @ViewChild(AddpostComponent, { static: false }) addpostComponent: AddpostComponent;

  add(): void {
    this.drawerTitle = "aaa " + "Add Post";
    this.drawerData = new Post();
    this.drawerVisible = true;
    this.drawerData.POST_CREATED_DATETIME = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.addpostComponent.fileURL1 = null;
    this.addpostComponent.fileURL2 = null;
    this.addpostComponent.fileURL3 = null;
    this.addpostComponent.originalFileURL1 = null;
    this.addpostComponent.originalFileURL2 = null;
    this.addpostComponent.originalFileURL3 = null;
    this.addpostComponent.EVENT_ID = 0;

    // Drawer Type
    this.addpostComponent.addDrawer = false;

    // Get IDs
    this.addpostComponent.getIDs();

    // Fill default hashtags
    let defaultHashtags = this.api.defaultHashtags;
    defaultHashtags += "," + ((sessionStorage.getItem("HOME_GROUP_NAME").trim() != "") ? ((sessionStorage.getItem("HOME_GROUP_NAME").trim().replace(/\s/g, "")) + ",") : "") + (sessionStorage.getItem("HOME_UNIT_NAME").trim() !== "" ? ((sessionStorage.getItem("HOME_UNIT_NAME").trim().replace(/\s/g, "")) + ",") : "") + ((sessionStorage.getItem("HOME_FEDERATION_NAME").trim() != "") ? (sessionStorage.getItem("HOME_FEDERATION_NAME").trim().replace(/\s/g, "")) : "");

    if (defaultHashtags.charAt(defaultHashtags.length - 1) == ',') {
      defaultHashtags = defaultHashtags.substring(0, defaultHashtags.length - 1);
    }

    this.drawerData.HASHTAGS = defaultHashtags.split(',');
  }

  edit(data: Post): void {
    this.drawerTitle = "aaa " + "Edit Post";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
    this.addpostComponent.fileURL1 = null;
    this.addpostComponent.fileURL2 = null;
    this.addpostComponent.fileURL3 = null;
    this.addpostComponent.originalFileURL1 = null;
    this.addpostComponent.originalFileURL2 = null;
    this.addpostComponent.originalFileURL3 = null;

    // Post images
    if (this.drawerData.IMAGE_URL1 != " ") {
      if (this.drawerData.IS_EVENT_POST) {
        if (this.drawerData.IMAGE_URL1.startsWith("GA")) {
          this.drawerData.IMAGE_URL1 = this.api.retriveimgUrl + "groupActivity/" + this.drawerData.IMAGE_URL1;

        } else {
          this.drawerData.IMAGE_URL1 = this.api.retriveimgUrl + "postImages/" + this.drawerData.IMAGE_URL1;
        }

      } else {
        this.drawerData.IMAGE_URL1 = this.api.retriveimgUrl + "postImages/" + this.drawerData.IMAGE_URL1;
      }

    } else {
      this.drawerData.IMAGE_URL1 = null;
    }

    if (this.drawerData.IMAGE_URL2 != " ") {
      if (this.drawerData.IS_EVENT_POST) {
        if (this.drawerData.IMAGE_URL2.startsWith("GA")) {
          this.drawerData.IMAGE_URL2 = this.api.retriveimgUrl + "groupActivity/" + this.drawerData.IMAGE_URL2;

        } else {
          this.drawerData.IMAGE_URL2 = this.api.retriveimgUrl + "postImages/" + this.drawerData.IMAGE_URL2;
        }

      } else {
        this.drawerData.IMAGE_URL2 = this.api.retriveimgUrl + "postImages/" + this.drawerData.IMAGE_URL2;
      }

    } else {
      this.drawerData.IMAGE_URL2 = null;
    }

    if (this.drawerData.IMAGE_URL3 != " ") {
      if (this.drawerData.IS_EVENT_POST) {
        if (this.drawerData.IMAGE_URL3.startsWith("GA")) {
          this.drawerData.IMAGE_URL3 = this.api.retriveimgUrl + "groupActivity/" + this.drawerData.IMAGE_URL3;

        } else {
          this.drawerData.IMAGE_URL3 = this.api.retriveimgUrl + "postImages/" + this.drawerData.IMAGE_URL3;
        }

      } else {
        this.drawerData.IMAGE_URL3 = this.api.retriveimgUrl + "postImages/" + this.drawerData.IMAGE_URL3;
      }

    } else {
      this.drawerData.IMAGE_URL3 = null;
    }

    // Drawer Type
    this.addpostComponent.addDrawer = true;

    // Get IDs
    this.addpostComponent.getIDs();

    // Fill Hashtags
    if ((this.drawerData.HASHTAGS != null) && (this.drawerData.HASHTAGS != '')) {
      this.drawerData.HASHTAGS = this.drawerData.HASHTAGS.split(',');
    }

    // Post Sharing
    if (this.drawerData.POST_TYPE == "P") {
      this.drawerData.TYPE_ID = undefined;

    } else if (this.drawerData.POST_TYPE == "F") {
      this.addpostComponent.getFederations();
      this.addpostComponent.SELECT_ALL = false;
      this.addpostComponent.shareWithinPlaceHolder = "Type here to search federation(s)";

      let tempTypeIDs = this.drawerData.TYPE_ID.split(',');
      let tempTypeIDsArray = [];

      for (var i = 0; i < tempTypeIDs.length; i++) {
        tempTypeIDsArray.push(Number(tempTypeIDs[i]));
      }

      this.drawerData.TYPE_ID = tempTypeIDsArray;

    } else if (this.drawerData.POST_TYPE == "U") {
      this.addpostComponent.getUnits();
      this.addpostComponent.SELECT_ALL = false;
      this.addpostComponent.shareWithinPlaceHolder = "Type here to search unit(s)";
      let tempTypeIDs = this.drawerData.TYPE_ID.split(',');
      let tempTypeIDsArray = [];

      for (var i = 0; i < tempTypeIDs.length; i++) {
        tempTypeIDsArray.push(Number(tempTypeIDs[i]));
      }

      this.drawerData.TYPE_ID = tempTypeIDsArray;

    } else if (this.drawerData.POST_TYPE == "G") {
      this.addpostComponent.getGroups();
      this.addpostComponent.SELECT_ALL = false;
      this.addpostComponent.shareWithinPlaceHolder = "Type here to search group(s)";
      let tempTypeIDs = this.drawerData.TYPE_ID.split(',');
      let tempTypeIDsArray = [];

      for (var i = 0; i < tempTypeIDs.length; i++) {
        tempTypeIDsArray.push(Number(tempTypeIDs[i]));
      }

      this.drawerData.TYPE_ID = tempTypeIDsArray;
    }
  }

  drawerClose(): void {
    this.search(true);
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  drawerClose2(): void {
    this.drawerVisible2 = false;
    this.selectedIndex = -1;
  }

  get closeCallback2() {
    return this.drawerClose2.bind(this);
  }

  onSearching(): void {
    document.getElementById("button1").focus();
    this.search(true);
  }

  photoModalVisible: boolean = false;
  IMAGE_URL1: string = "";
  DESCRIPTION1: string = "";
  IMAGE_URL2: string = "";
  DESCRIPTION2: string = "";
  IMAGE_URL3: string = "";

  viewPhotoes(data: Post, i: any): void {
    this.selectedIndex = i;
    this.drawerTitle2 = "Post Details";
    this.drawerVisible2 = true;
    this.imgWidth1 = 60;
    this.imgWidth2 = 60;
    this.imgWidth3 = 60;
  }

  clickCount: number = 0;

  identifyClickOrDoubleClick(data: Post, i: any): void {
    this.clickCount++;

    setTimeout(() => {
      if (this.clickCount === 1) {
        this.viewPhotoes(data, i);

      } else if (this.clickCount === 2) {
        this.likeTheButton(data.ID, i, data["LIKE_STATUS"]);
      }

      this.clickCount = 0;
    }, 200);
  }

  photoModalCancel(): void {
    this.photoModalVisible = false;
  }

  viewPhoto(photoURL: string): void {
    window.open(photoURL);
  }

  getPhotoURL(photoURL: string, status: boolean): string {
    if (status) {
      if (photoURL.startsWith("GA")) {
        return this.api.retriveimgUrl + "groupActivity/" + photoURL;

      } else {
        return this.api.retriveimgUrl + "postImages/" + photoURL;
      }

    } else {
      return this.api.retriveimgUrl + "postImages/" + photoURL;
    }
  }

  getImageCount(photoURL1: string, photoURL2: string): number {
    let count: number = 0;

    if (photoURL1 != " ") {
      count = count + 1;
    }

    if (photoURL2 != " ") {
      count = count + 1;
    }

    return count;
  }

  getWidth(): number {
    if (window.innerWidth <= 400) {
      return 380;

    } else {
      return 800;
    }
  }

  getWidthForProfileDrawer(): number {
    if (window.innerWidth <= 400) {
      return 380;

    } else {
      return 900;
    }
  }

  viewDETAILS(activity: any): void {
    this.DETAILSModalVisible = true;
    this.DESCRIPTION1 = activity["DESCRIPTION"];
  }

  DETAILSModalCancel(): void {
    this.DETAILSModalVisible = false;
  }

  drawerTitle3: string;
  drawerData3: Comments = new Comments();
  drawerVisible3: boolean = false;
  dataList1: any[] = [];

  get closeCallback3() {
    return this.drawerClose3.bind(this);
  }

  drawerClose3(): void {
    this.commentIncrease(sessionStorage.getItem("Comment_Id"), sessionStorage.getItem("Comment_Id_index"),);
    this.drawerVisible3 = false;
  }

  commentIncrease = (postID: any, i: any) => {
    this.loadingRecords = true;

    this.api.getAllUaserposts(1, 1, this.sortKey, 'desc', " AND ID=" + postID).subscribe(data => {
      if ((data['code'] == 200) && (data['count'] > 0)) {
        this.loadingRecords = false;
        this.dataList[i] = data['data'][0];

      } else {
        this.loadingRecords = false;
      }

    }, err => {
      this.loadingRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  @ViewChild(AddcommentdrawerComponent, { static: false }) AddcommentdrawerComponentVar: AddcommentdrawerComponent;

  addComment(postID: any, index: number): void {
    this.drawerTitle3 = "aaa " + "Add your comment";
    this.drawerData3 = new Comments();
    this.drawerData3.POST_ID = Number(postID);
    sessionStorage.setItem("Comment_Id", postID);
    sessionStorage.setItem("Comment_Id_index", String(index));
    this.drawerData3.COMMENT_CREATED_DATETIME = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.dataList1 = [];
    this.AddcommentdrawerComponentVar.pageIndex = 1;
    this.AddcommentdrawerComponentVar.pageSize = 10;
    this.AddcommentdrawerComponentVar.postCommentLoad = true;
    this.AddcommentdrawerComponentVar.search(true, true);
    this.drawerVisible3 = true;
  }

  drawerVisible4: boolean = false;

  drawerClose4(): void {
    this.drawerVisible4 = false;
  }

  get postLikeCloseCallback() {
    return this.drawerClose4.bind(this);
  }

  dataa2: Likes = new Likes();

  likeTheButton = (event: any, i: any, likeStatus: any) => {
    let likeSuccessMsg: string = "";
    let likeUnsuccessMsg: string = "";

    if (likeStatus == null) {
      likeSuccessMsg = "Liked";
      likeUnsuccessMsg = "Failed to Like";

    } else if (likeStatus == 1) {
      likeSuccessMsg = "Unliked";
      likeUnsuccessMsg = "Failed to Unlike";
    }

    this.dataa2.MEMBER_ID = this.api.userId;
    this.dataa2.STATUS = 1;
    this.dataa2.POST_ID = event;
    this.loadingRecords = true;

    this.api.createlike(this.dataa2).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.api.getAllUaserposts(1, 1, this.sortKey, 'desc', " AND ID=" + event).subscribe(data => {
          if ((data['code'] == 200) && (data['count'] > 0)) {
            this.loadingRecords = false;
            this.message.success(likeSuccessMsg, "");
            this.dataList[i] = data['data'][0];

          } else {
            this.loadingRecords = false;
          }

        }, err => {
          this.loadingRecords = false;

          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });

      } else {
        this.loadingRecords = false;
        this.message.error(likeUnsuccessMsg, "");
      }
    });
  }

  dataList2: any[] = [];
  postLikeID: number;
  likeDrawerTitle: string;
  @ViewChild(PostLikeDrawerComponent, { static: false }) PostLikeDrawerComponentVar: PostLikeDrawerComponent;

  like(event: any): void {
    this.likeDrawerTitle = "aaa " + "Likes";
    this.PostLikeDrawerComponentVar.dataList = [];
    this.PostLikeDrawerComponentVar.postLikeID = event;
    this.PostLikeDrawerComponentVar.postLikeLoad = true;
    this.PostLikeDrawerComponentVar.pageIndex = 1;
    this.PostLikeDrawerComponentVar.pageSize = 10;
    this.PostLikeDrawerComponentVar.search(true, true);
    this.drawerVisible4 = true;
  }

  getProfilePhoto(photoURL: string): string {
    if ((photoURL == null) || (photoURL.trim() == '')) {
      return 'assets/anony.png';

    } else {
      return this.api.retriveimgUrl + 'profileImage/' + photoURL;
    }
  }

  today = new Date().setDate(new Date().getDate());

  disabledToDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.ADVANCE_FILTER_FROM_DATE ? this.ADVANCE_FILTER_FROM_DATE : this.today) < 0;

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
    this.advanceFilterModalVisible = !this.advanceFilterModalVisible;
  }

  advanceFilterModalCancel(): void {
    this.advanceFilterModalVisible = false;
  }

  advanceFilterModalOk(): void {
    this.advanceFilterModalVisible = false;
    this.advanceMultipleSearchText.splice(0, this.advanceMultipleSearchText.length);
    this.advanceMultiplePostCreatedBy = [];
    this.advanceMultipleFederationNames = [];
    this.advanceMultipleUnitNames = [];
    this.advanceMultipleGroupNames = [];
    this.advanceMultipleHashtags = [];

    if ((this.ADVANCE_FILTER_FROM_DATE != null) && (this.ADVANCE_FILTER_TO_DATE != null)) {
      this.advanceMultipleSearchText.push("From : " + this.datePipe.transform(this.ADVANCE_FILTER_FROM_DATE, "dd MMM yy") + ", To : " + this.datePipe.transform(this.ADVANCE_FILTER_TO_DATE, "dd MMM yy"));
    }

    if (this.MEMBER_ID.length > 0) {
      for (let i = 0; i < this.MEMBER_ID.length; i++) {
        this.advanceMultiplePostCreatedBy.push(this.MEMBER_ID[i]);
      }
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

    if (this.HASHTAGS.length > 0) {
      for (let i = 0; i < this.HASHTAGS.length; i++) {
        this.advanceMultipleHashtags.push(this.HASHTAGS[i]);
      }
    }

    this.search(true);
  }

  clearAdvanceFilter(): void {
    this.ADVANCE_FILTER_FROM_DATE = null;
    this.ADVANCE_FILTER_TO_DATE = null;
    this.MEMBER_ID = [];
    this.FEDERATION_ID = [];
    this.UNIT_ID = [];
    this.GROUP_ID = [];
    this.HASHTAGS = [];

    this.advanceMultipleSearchText.splice(0, this.advanceMultipleSearchText.length);
    this.advanceMultiplePostCreatedBy = [];
    this.advanceMultipleFederationNames = [];
    this.advanceMultipleUnitNames = [];
    this.advanceMultipleGroupNames = [];
    this.advanceMultipleHashtags = [];
    this.advanceFilterModalVisible = false;

    this.search(true);
  }

  getHeigth(): string {
    if ((this.multipleSearchText.length > 0) || (this.advanceMultipleSearchText.length > 0) || (this.advanceMultiplePostCreatedBy.length > 0) || (this.advanceMultipleFederationNames.length > 0) || (this.advanceMultipleUnitNames.length > 0) || (this.advanceMultipleGroupNames.length > 0) || (this.advanceMultipleHashtags.length > 0)) {
      return '73vh';

    } else {
      return '80vh';
    }
  }

  visible: boolean = false;
  currentPostLink: string = "";
  resharePostMemberID: number = 0;
  resharePostData: Post = new Post();

  showMsg(postData: Post): void {
    this.resharePostMemberID = postData.MEMBER_ID;
    this.resharePostData = postData;
    this.visible = true;
    this.name = postData.DESCRIPTION;
    this.url = this.api.retriveimgUrl + "postImages/" + postData.IMAGE_URL1;
    this.hashtagsToPost = postData.HASHTAGS ? postData.HASHTAGS : "";
    let link = this.api.baseUrl.split('/');
    let formLink = link[0] + "//" + link[2].split(':')[0];

    // this.currentPostLink = formLink + "/post-details;title=" + postData.DESCRIPTION.replace(/\ /g, "-");
    this.currentPostLink = formLink + "/post-details;title=" + postData.ID.toString();

    // console.log(this.encryptUsingAES256(10));
    // console.log(this.decryptUsingAES256(this.encryptUsingAES256(10)));

    // this.currentPostLink = formLink + "/post-details;title=" + (this.encryptData(postData.ID.toString()));
    // console.log(this.currentPostLink);
  }

  CloseShare(): void {
    this.visible = false;
  }

  name: string = '';
  url: string = '';
  hashtagsToPost: string = '';

  social(a: string): void {
    // Twitter
    let twitterHashtags: string = "";

    if (this.hashtagsToPost != "") {
      twitterHashtags = '&hashtags=' + this.hashtagsToPost;
    }

    let twitter: string = 'http://twitter.com/intent/tweet?text=&url=' + this.currentPostLink + twitterHashtags;

    // Instagram
    // let Insta: string = 'https://instagram.com/accounts/login/?text=%20Check%20up%20this%20awesome%20content' + this.url;
    let Insta: string = 'https://instagram.com';

    // LinkedIn
    let Linkdin: string = 'https://www.linkedin.com/sharing/share-offsite/?url=' + this.currentPostLink;

    // Facebook
    let facebook: string = 'https://www.facebook.com/sharer/sharer.php?u=' + this.currentPostLink;

    // WhatsApp
    let Whatsapp: string = 'https://api.whatsapp.com/send?text=' + this.currentPostLink;

    let b = '';

    if (a === 'Insta') {
      b = Insta;
    }

    if (a === 'twitter') {
      b = twitter;
    }

    if (a === 'Linkdin') {
      b = Linkdin;
    }

    if (a === 'facebook') {
      b = facebook;
    }

    if (a === 'Whatsapp') {
      b = Whatsapp;
    }

    let params = `width=600,height=400,left=200,top=100`;
    window.open(b, a, params);
  }

  onHashtagClick(hashtag: string): void {
    this.advanceMultipleHashtags.push(hashtag);
    this.advanceMultipleHashtags = [...new Set(this.advanceMultipleHashtags)];
    this.search(true);
  }

  MemberProfiles: any[] = [];
  ForDisplayProfile: any[] = [];
  images = '';
  ImageArray: any[] = [];
  MemberProfileVisible: boolean = false;
  memberProfileDrawerTitle: string;
  Member_ID: number;
  totalRecords22: number;
  @ViewChild(MemberReadableProfileComponent, { static: false }) MemberReadableProfileComponentVar: MemberReadableProfileComponent;

  onMemberNameClick(memberName: string, memberID: number): void {
    this.Member_ID = memberID;
    this.MemberProfileVisible = true;
    this.memberProfileDrawerTitle = "aaa " + "Profile";
    this.MemberProfiles = [];
    this.ForDisplayProfile = [];
    this.MemberReadableProfileComponentVar.isSpinning = true;
    this.MemberReadableProfileComponentVar.postLoad = false;

    this.api.getAllMembers(0, 0, "NAME", "asc", " AND ID=" + memberID).subscribe(data => {
      if (data['code'] == 200) {
        this.MemberReadableProfileComponentVar.isSpinning = false;
        this.MemberProfiles = data['data'][0];
        this.MemberReadableProfileComponentVar.pageIndex = 1;
        this.MemberReadableProfileComponentVar.pageSize = 5;
        this.MemberReadableProfileComponentVar.postLoad = true;
        this.MemberReadableProfileComponentVar.selectedIndex = -1;
        this.MemberReadableProfileComponentVar.search(true, true);
      }

    }, err => {
      this.MemberReadableProfileComponentVar.isSpinning = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  MemberProfiledrawerClose(): void {
    this.search(true);
    this.MemberProfileVisible = false;
  }

  get closeCallbackMemberProfile() {
    return this.MemberProfiledrawerClose.bind(this);
  }

  copyPostLink(): void {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.currentPostLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.message.success("Link Copied", "");
    this.visible = false;
  }

  getHeightOfDescription(index: number): void {
    this.expandDescription[index] = !this.expandDescription[index];
  }

  // encryptData(data: any) {
  //   try {
  //     return CryptoJS.AES.encrypt(JSON.stringify(data), this.api.encryptSecretKey).toString();

  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  // decryptData(data: any) {
  //   try {
  //     const bytes = CryptoJS.AES.decrypt(data, this.api.encryptSecretKey);

  //     if (bytes.toString()) {
  //       return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  //     }

  //     return data;

  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  // private key = CryptoJS.enc.Utf8.parse(this.api.EncryptKey);
  // private iv = CryptoJS.enc.Utf8.parse(this.api.EncryptIV);

  // encryptUsingAES256(text): any {
  //   var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), this.key, {
  //     keySize: 128 / 8,
  //     iv: this.iv,
  //     mode: CryptoJS.mode.CBC,
  //     padding: CryptoJS.pad.Pkcs7
  //   });

  //   return encrypted.toString();
  // }

  // decryptUsingAES256(decString) {
  //   var decrypted = CryptoJS.AES.decrypt(decString, this.key, {
  //     keySize: 128 / 8,
  //     iv: this.iv,
  //     mode: CryptoJS.mode.CBC,
  //     padding: CryptoJS.pad.Pkcs7
  //   });

  //   return decrypted.toString(CryptoJS.enc.Utf8);
  // }

  ForGmailVisible: boolean = false;
  sendGmail: string = '';

  ForGmail(): void {
    this.ForGmailVisible = true;
    this.sendGmail = undefined;
  }

  CloseGmail(): void {
    this.ForGmailVisible = false;
  }

  MailId: string = '';

  SendMail(mailid: any): void {
    this.MailId = mailid;

    if ((mailid == '') || (mailid == undefined)) {
      this.message.error("Please Enter Mail ID ", "");

    } else {
      let Gmail = 'https://mail.google.com/mail/?view=cm&to=' + this.MailId + '&su=' + this.url + '&body=' + this.url;
      let params = `width=600,height=400,left=200,top=100`;
      window.open(Gmail, params);
      this.ForGmailVisible = false;
    }
  }

  emailpattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  groupDetailsModalVisible: boolean = false;
  homeGroupDetails: GroupMaster = new GroupMaster();
  Spinning: boolean = false;

  openGroupDetailsModal(groupID: number): void {
    this.groupDetailsModalVisible = true;
    this.Spinning = true;

    this.api.getAllGroupsTilesDetails(0, 0, "ID", "asc", " AND GROUP_ID=" + groupID).subscribe(data => {
      if (data['code'] == 200) {
        this.Spinning = false;
        this.homeGroupDetails = data['data'][0];
      }

    }, err => {
      this.Spinning = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  groupDetailsModalClose(): void {
    this.groupDetailsModalVisible = false;
  }

  showPostDetails(postData: Post): void {
    let obj1 = new Post();
    obj1.COMMENT_COUNT = 0;
    obj1.LIKE_COUNT = 0;
    obj1.DESCRIPTION = postData["DESCRIPTION"];
    obj1.HASHTAGS = postData["HASHTAGS"];
    obj1.IMAGE_URL1 = postData["IMAGE_URL1"];
    obj1.IMAGE_URL2 = postData["IMAGE_URL2"];
    obj1.IMAGE_URL3 = postData["IMAGE_URL3"];
    obj1.POST_CREATED_DATETIME = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:MM:SS a");
    obj1.POST_TYPE = "P";
    obj1.TYPE_ID = "0";
    obj1.STATUS = 1;
    obj1.POST_STATUS = "P";
    obj1.IS_DELETED = false;
    obj1.MEMBER_ID = this.api.userId;
    obj1.POST_CREATED_MEMBER_ID = postData["MEMBER_ID"];
    obj1.IS_EVENT_POST = postData["IS_EVENT_POST"];

    this.modal.confirm({
      nzTitle: 'Are you sure, want to repost in public?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOnOk: (postlist: NgForm) => {
        this.loadingRecords = true;
        this.visible = false;

        this.api.addpost(obj1).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Post Created Successfully", "");
            this.search(true);

          } else {
            this.message.error("Post Creation Failed", "");
            this.search(true);
          }
        });
      },

      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  DeletePost(postData: Post): void {
    this.loadingRecords = true;
    postData.IS_DELETED = true;

    this.api.updatePost(postData).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Post Deleted Successfully", "");
        this.search(true);

      } else {
        this.message.error("Failed to Post Deletion", "");
        this.search(true);
      }
    });
  }

  cancel(): void { }

  top(): void {
    setTimeout(() => {
      document.getElementById('top').scrollIntoView();
    }, 1500);
  }

  imgWidth1: number = 60;

  mouseWheelUpFunc1(): void {
    if (this.imgWidth1 > 200) {
      this.imgWidth1 = 200;
    }

    this.imgWidth1 = this.imgWidth1 + 20;
  }

  mouseWheelDownFunc1(): void {
    if (this.imgWidth1 < 60) {
      this.imgWidth1 = 60;
    }

    this.imgWidth1 = this.imgWidth1 - 20;
  }

  imgWidth2: number = 60;

  mouseWheelUpFunc2(): void {
    if (this.imgWidth2 > 200) {
      this.imgWidth2 = 200;
    }

    this.imgWidth2 = this.imgWidth2 + 20;
  }

  mouseWheelDownFunc2(): void {
    if (this.imgWidth2 < 60) {
      this.imgWidth2 = 60;
    }

    this.imgWidth2 = this.imgWidth2 - 20;
  }

  imgWidth3: number = 60;

  mouseWheelUpFunc3(): void {
    if (this.imgWidth3 > 200) {
      this.imgWidth3 = 200;
    }

    this.imgWidth3 = this.imgWidth3 + 20;
  }

  mouseWheelDownFunc3(): void {
    if (this.imgWidth3 < 60) {
      this.imgWidth3 = 60;
    }

    this.imgWidth3 = this.imgWidth3 - 20;
  }

  publishPost(data: Post): void {
    this.loadingRecords = true;
    data.POST_STATUS = "P";

    this.api.updatePost(data).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Post Published Successfully", "");
        this.search(true);

      } else {
        this.message.error("Failed to Publish", "");
        this.search(true);
      }
    });
  }
}
