import { DatePipe } from '@angular/common';
import { Component, OnInit, Output, ViewChild, EventEmitter, HostListener } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { EventComment, EventLikes } from 'src/app/Models/comment';
import { GroupActivityMaster } from 'src/app/Models/GroupActivityMaster';
import { ApiService } from 'src/app/Service/api.service';
import { GroupProjectActivityDrawerComponent } from '../group-project-activity-drawer/group-project-activity-drawer.component';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { AddCommentComponent } from '../add-comment/add-comment.component';
import { EventLikeDrawerComponent } from '../event-like-drawer/event-like-drawer.component';
import { AddpostComponent } from '../../postlist/addpost/addpost.component';
import { Post } from 'src/app/Models/post';
import { GroupMapInvitees } from 'src/app/Models/GroupMapInvitees';
import { GroupProjectActivityMapInviteesDrawerComponent } from '../group-project-activity-map-invitees-drawer/group-project-activity-map-invitees-drawer.component';
import { GroupProjectActivityAttendanceDrawerComponent } from '../group-project-activity-attendance-drawer/group-project-activity-attendance-drawer.component';

@Component({
  selector: 'app-group-project-activity-tiles',
  templateUrl: './group-project-activity-tiles.component.html',
  styleUrls: ['./group-project-activity-tiles.component.css']
})

export class GroupProjectActivityTilesComponent implements OnInit {
  formTitle: string = "Events";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList: any[] = [];
  loadingRecords: boolean = true;
  sortKey: string = "DATE";
  sortValue: string = "desc";
  searchText: string = "";
  filterQuery: string = "";
  columns: string[][] = [["EVENT_NAME", "EVENT_NAME"], ["PROJECT_NAME", "PROJECT_NAME"], ["VENUE", "VENUE"], ["DETAILS", "Details"], ["HASHTAGS", "HASHTAGS"], ["FEDERATION_NAME", "FEDERATION_NAME"], ["UNIT_NAME", "UNIT_NAME"], ["GROUP_NAME", "GROUP_NAME"], ["EVENT_NO", "EVENT_NO"]];
  advanceFilterColumns: string[][] = [["DATE", "DATE"]];
  advanceFilterColumnsFederationNames: string[][] = [["FEDERATION_NAME", "FEDERATION_NAME"]];
  advanceFilterColumnsUnitNames: string[][] = [["UNIT_NAME", "UNIT_NAME"]];
  advanceFilterColumnsGroupNames: string[][] = [["GROUP_NAME", "GROUP_NAME"]];
  advanceFilterColumnsVenues: string[][] = [["VENUE", "VENUE"]];
  advanceFilterColumnsHashtags: string[][] = [["HASHTAGS", "HASHTAGS"]];
  advanceFilterColumnsProjectTypeNames: string[][] = [["PROJECT_NAME", "PROJECT_NAME"]];
  drawerVisible: boolean = false;
  drawerTitle: string;
  drawerData: GroupActivityMaster = new GroupActivityMaster();
  isSpinning: boolean = false;

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  homeFederationID: number = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
  homeUnitID: number = Number(sessionStorage.getItem("HOME_UNIT_ID"));
  homeGroupID: number = Number(sessionStorage.getItem("HOME_GROUP_ID"));

  roleID: number = this.api.roleId;
  userID: number = this.api.userId;
  loadingRecords2: boolean = false;
  emitted = false;
  emitted2 = false;
  filter = '';
  private categoriesSubject = new BehaviorSubject<Array<string>>([]);
  categories$ = this.categoriesSubject.asObservable();
  DETAILSModalVisible: boolean = false;
  expandEventDetails: boolean[] = [];
  expandEventBeneficiaryDetails: boolean[] = [];
  RETRIVE_IMAGE_URL: string = this.api.retriveimgUrl;

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

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

  onMemberSearch(memberName: string) {
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

  getHashtags() {
    this.api.getAllHashtags(0, 0, "NAME", "asc", " AND STATUS=1").subscribe(data => {
      if (data['code'] == 200) {
        this.hashtags = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
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
    console.log("End");

    if (this.dataList.length >= this.totalRecords) {
      return false;
    }

    this.search(false, true);
    return true;
  }

  ngOnInit() {
    this.getGlobalSettingData();
    this.getFederations();
    this.getHashtags();
    this.search(true);
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true);
  }

  search(reset: boolean = false, loadMore: boolean = false) {
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

    // Filter for upcoming events
    let eventIDFromUpcomingEvent = sessionStorage.getItem("eventIDFromUpcomingEvent");

    if (eventIDFromUpcomingEvent != "") {
      this.multipleSearchText.push(eventIDFromUpcomingEvent.trim());
      this.multipleSearchText = [...new Set(this.multipleSearchText)];
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

    var advanceLikeQueryVenues = "";

    if (this.advanceMultipleVenues.length > 0) {
      for (var i = 0; i < this.advanceMultipleVenues.length; i++) {
        this.advanceFilterColumnsVenues.forEach(column => {
          advanceLikeQueryVenues += " " + column[0] + " like '%" + this.advanceMultipleVenues[i] + "%' OR";
        });
      }

      advanceLikeQueryVenues = " AND (" + advanceLikeQueryVenues.substring(0, advanceLikeQueryVenues.length - 2) + ')';
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

    var advanceLikeQueryProjectTypeNames = "";

    if (this.advanceMultipleProjectTypeNames.length > 0) {
      for (var i = 0; i < this.advanceMultipleProjectTypeNames.length; i++) {
        this.advanceFilterColumnsProjectTypeNames.forEach(column => {
          advanceLikeQueryProjectTypeNames += " " + column[0] + " like '%" + this.advanceMultipleProjectTypeNames[i] + "%' OR";
        });
      }

      advanceLikeQueryProjectTypeNames = " AND (" + advanceLikeQueryProjectTypeNames.substring(0, advanceLikeQueryProjectTypeNames.length - 2) + ')';
    }

    // Event publish, draft filter
    var eventAccessFilter = "";
    eventAccessFilter = " AND ((IS_DELETED=0 AND CREATOR_ID=" + this.userID + ") OR (IS_DELETED=0 AND STATUS<>'D'))";

    //  Global federation filter
    var globalFederationFilter = "";

    if (sessionStorage.getItem("FILTER") === "MF") {
      globalFederationFilter = " AND FEDERATION_ID=" + this.homeFederationID;
    }

    // Map invitees filter
    let mapInviteeFilter = "";

    if ((this.roleID != 59) && (this.roleID != 60) && (this.roleID != 61) && (this.federationID == 0) && (this.unitID == 0) && (this.groupID == 0)) {
      mapInviteeFilter = " AND (find_in_set('" + this.userID + "',INVITEE_IDS) OR (CREATOR_ID=" + this.userID + "))";
    }

    // Filter to show meeting
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

    this.api.getAllGroupActivitiesUser(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + advanceLikeQuery + advanceLikeQueryFederationNames + advanceLikeQueryUnitNames + advanceLikeQueryGroupNames + advanceLikeQueryVenues + advanceLikeQueryHashtags + advanceLikeQueryProjectTypeNames + eventAccessFilter + globalFederationFilter + filterToShow + mapInviteeFilter, this.userID).subscribe(data => {
      if ((data['code'] == 200)) {
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.expandEventDetails = new Array(this.totalRecords).fill(false);
        this.expandEventBeneficiaryDetails = new Array(this.totalRecords).fill(false);

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

  GIANTS_WEEK_START_DATE: Date = null;
  GIANTS_WEEK_END_DATE: Date = null;

  getGlobalSettingData(): void {
    this.GIANTS_WEEK_START_DATE = null;
    this.GIANTS_WEEK_END_DATE = null;

    this.api.getGlobalSettingData(0, 0, "", "", "").subscribe(data => {
      if (data['code'] == 200) {
        if ((data['data'][0]["GIANTS_WEEK_CELEBRATION_START_DATE"]) && (data['data'][0]["GIANTS_WEEK_CELEBRATION_END_DATE"])) {
          this.GIANTS_WEEK_START_DATE = new Date(new Date().getFullYear(), Number(data['data'][0]["GIANTS_WEEK_CELEBRATION_START_DATE"].split("-")[1]) - 1, Number(data['data'][0]["GIANTS_WEEK_CELEBRATION_START_DATE"].split("-")[2]));
          this.GIANTS_WEEK_END_DATE = new Date(new Date().getFullYear(), Number(data['data'][0]["GIANTS_WEEK_CELEBRATION_END_DATE"].split("-")[1]) - 1, Number(data['data'][0]["GIANTS_WEEK_CELEBRATION_END_DATE"].split("-")[2]));

        } else {
          this.GIANTS_WEEK_START_DATE = null;
          this.GIANTS_WEEK_END_DATE = null;
        }
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  @ViewChild(GroupProjectActivityDrawerComponent, { static: false }) GroupProjectActivityDrawerComponentVar: GroupProjectActivityDrawerComponent;

  add(): void {
    this.drawerTitle = "aaa " + "Add Event";
    this.drawerData = new GroupActivityMaster();
    this.drawerVisible = true;
    this.drawerData.DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.GroupProjectActivityDrawerComponentVar.fileURL1 = null;
    this.GroupProjectActivityDrawerComponentVar.fileURL2 = null;
    this.GroupProjectActivityDrawerComponentVar.fileURL3 = null;
    this.GroupProjectActivityDrawerComponentVar.fileURL4 = null;
    this.GroupProjectActivityDrawerComponentVar.fileURL5 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL1 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL2 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL3 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL4 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL5 = null;
    this.GroupProjectActivityDrawerComponentVar.pdfFileURL1 = null;
    this.GroupProjectActivityDrawerComponentVar.pdfFileURL2 = null;

    // Drawer Type
    this.GroupProjectActivityDrawerComponentVar.addDrawer = false;

    // Week celebration event
    this.GroupProjectActivityDrawerComponentVar.GIANTS_WEEK_START_DATE = this.GIANTS_WEEK_START_DATE;
    this.GroupProjectActivityDrawerComponentVar.GIANTS_WEEK_END_DATE = this.GIANTS_WEEK_END_DATE;

    this.GroupProjectActivityDrawerComponentVar.CURRENT_DATE = new Date();
    this.GroupProjectActivityDrawerComponentVar.celebrationWeekTitle();
    this.GroupProjectActivityDrawerComponentVar.celebrationCheckBox();

    // Fill default hashtags
    let defaultHashtags = this.api.defaultHashtags;
    defaultHashtags += "," + (sessionStorage.getItem("HOME_GROUP_NAME").trim().replace(/\s/g, "")) + "," + (sessionStorage.getItem("HOME_UNIT_NAME").trim().replace(/\s/g, "")) + "," + (sessionStorage.getItem("HOME_FEDERATION_NAME").trim().replace(/\s/g, ""));
    this.drawerData.HASHTAGS = defaultHashtags.split(',');
  }

  edit(data: GroupActivityMaster): void {
    this.drawerTitle = "aaa " + "Edit Event";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
    this.drawerData.COUNT = String(data.COUNT);
    this.drawerData.FROM_TIME = this.datePipe.transform(new Date(), "yyyy-MM-dd") + " " + this.drawerData.FROM_TIME;
    this.drawerData.TO_TIME = this.datePipe.transform(new Date(), "yyyy-MM-dd") + " " + this.drawerData.TO_TIME;
    this.GroupProjectActivityDrawerComponentVar.fileURL1 = null;
    this.GroupProjectActivityDrawerComponentVar.fileURL2 = null;
    this.GroupProjectActivityDrawerComponentVar.fileURL3 = null;
    this.GroupProjectActivityDrawerComponentVar.fileURL4 = null;
    this.GroupProjectActivityDrawerComponentVar.fileURL5 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL1 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL2 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL3 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL4 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL5 = null;
    this.GroupProjectActivityDrawerComponentVar.pdfFileURL1 = null;
    this.GroupProjectActivityDrawerComponentVar.pdfFileURL2 = null;

    if (this.drawerData.PHOTO1 != " ")
      this.drawerData.PHOTO1 = this.api.retriveimgUrl + "groupActivity/" + this.drawerData.PHOTO1;
    else
      this.drawerData.PHOTO1 = null;

    if (this.drawerData.PHOTO2 != " ")
      this.drawerData.PHOTO2 = this.api.retriveimgUrl + "groupActivity/" + this.drawerData.PHOTO2;
    else
      this.drawerData.PHOTO2 = null;

    if (this.drawerData.PHOTO3 != " ")
      this.drawerData.PHOTO3 = this.api.retriveimgUrl + "groupActivity/" + this.drawerData.PHOTO3;
    else
      this.drawerData.PHOTO3 = null;

    if (this.drawerData.PHOTO4 != " ")
      this.drawerData.PHOTO4 = this.api.retriveimgUrl + "groupActivity/" + this.drawerData.PHOTO4;
    else
      this.drawerData.PHOTO4 = null;

    if (this.drawerData.PHOTO5 != " ")
      this.drawerData.PHOTO5 = this.api.retriveimgUrl + "groupActivity/" + this.drawerData.PHOTO5;
    else
      this.drawerData.PHOTO5 = null;

    if (this.drawerData.PDF1 != " ")
      this.drawerData.PDF1 = this.drawerData.PDF1;
    else
      this.drawerData.PDF1 = null;

    if (this.drawerData.PDF2 != " ")
      this.drawerData.PDF2 = this.drawerData.PDF2;
    else
      this.drawerData.PDF2 = null;

    // Drawer Type
    this.GroupProjectActivityDrawerComponentVar.addDrawer = true;

    // Fill Hashtags
    if ((this.drawerData.HASHTAGS != null) && (this.drawerData.HASHTAGS != '')) {
      this.drawerData.HASHTAGS = this.drawerData.HASHTAGS.split(',');
    }

    // Week celebration event
    this.GroupProjectActivityDrawerComponentVar.GIANTS_WEEK_START_DATE = this.GIANTS_WEEK_START_DATE;
    this.GroupProjectActivityDrawerComponentVar.GIANTS_WEEK_END_DATE = this.GIANTS_WEEK_END_DATE;

    this.GroupProjectActivityDrawerComponentVar.CURRENT_DATE = new Date(Number(this.drawerData.DATE.split("-")[0]), Number(this.drawerData.DATE.split("-")[1]) - 1, Number(this.drawerData.DATE.split("-")[2]));
    this.GroupProjectActivityDrawerComponentVar.celebrationWeekTitle();
    this.GroupProjectActivityDrawerComponentVar.celebrationCheckBox();
  }

  editInPartially(data: GroupActivityMaster): void {
    this.drawerTitle = "aaa " + "Edit Event";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
    this.drawerData.COUNT = String(data.COUNT);
    this.drawerData.FROM_TIME = this.datePipe.transform(new Date(), "yyyy-MM-dd") + " " + this.drawerData.FROM_TIME;
    this.drawerData.TO_TIME = this.datePipe.transform(new Date(), "yyyy-MM-dd") + " " + this.drawerData.TO_TIME;
    this.GroupProjectActivityDrawerComponentVar.fileURL1 = null;
    this.GroupProjectActivityDrawerComponentVar.fileURL2 = null;
    this.GroupProjectActivityDrawerComponentVar.fileURL3 = null;
    this.GroupProjectActivityDrawerComponentVar.fileURL4 = null;
    this.GroupProjectActivityDrawerComponentVar.fileURL5 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL1 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL2 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL3 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL4 = null;
    this.GroupProjectActivityDrawerComponentVar.originalFileURL5 = null;
    this.GroupProjectActivityDrawerComponentVar.pdfFileURL1 = null;
    this.GroupProjectActivityDrawerComponentVar.pdfFileURL2 = null;

    if (this.drawerData.PHOTO1 != " ")
      this.drawerData.PHOTO1 = this.api.retriveimgUrl + "groupActivity/" + this.drawerData.PHOTO1;
    else
      this.drawerData.PHOTO1 = null;

    if (this.drawerData.PHOTO2 != " ")
      this.drawerData.PHOTO2 = this.api.retriveimgUrl + "groupActivity/" + this.drawerData.PHOTO2;
    else
      this.drawerData.PHOTO2 = null;

    if (this.drawerData.PHOTO3 != " ")
      this.drawerData.PHOTO3 = this.api.retriveimgUrl + "groupActivity/" + this.drawerData.PHOTO3;
    else
      this.drawerData.PHOTO3 = null;

    if (this.drawerData.PHOTO4 != " ")
      this.drawerData.PHOTO4 = this.api.retriveimgUrl + "groupActivity/" + this.drawerData.PHOTO4;
    else
      this.drawerData.PHOTO4 = null;

    if (this.drawerData.PHOTO5 != " ")
      this.drawerData.PHOTO5 = this.api.retriveimgUrl + "groupActivity/" + this.drawerData.PHOTO5;
    else
      this.drawerData.PHOTO5 = null;

    if (this.drawerData.PDF1 != " ")
      this.drawerData.PDF1 = this.drawerData.PDF1;
    else
      this.drawerData.PDF1 = null;

    if (this.drawerData.PDF2 != " ")
      this.drawerData.PDF2 = this.drawerData.PDF2;
    else
      this.drawerData.PDF2 = null;

    // Drawer Type
    this.GroupProjectActivityDrawerComponentVar.addDrawer = false;

    // Fill Hashtags
    if ((this.drawerData.HASHTAGS != null) && (this.drawerData.HASHTAGS != '')) {
      this.drawerData.HASHTAGS = this.drawerData.HASHTAGS.split(',');
    }

    // Week celebration event
    this.GroupProjectActivityDrawerComponentVar.GIANTS_WEEK_START_DATE = this.GIANTS_WEEK_START_DATE;
    this.GroupProjectActivityDrawerComponentVar.GIANTS_WEEK_END_DATE = this.GIANTS_WEEK_END_DATE;

    this.GroupProjectActivityDrawerComponentVar.CURRENT_DATE = new Date(Number(this.drawerData.DATE.split("-")[0]), Number(this.drawerData.DATE.split("-")[1]) - 1, Number(this.drawerData.DATE.split("-")[2]));
    this.GroupProjectActivityDrawerComponentVar.celebrationWeekTitle();
    this.GroupProjectActivityDrawerComponentVar.celebrationCheckBox();
  }

  drawerClose(): void {
    this.search(true);
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  onSearching() {
    document.getElementById("button1").focus();
    this.search(true);
  }

  photoModalTitle: string = "Event Photo(s)";
  photoModalVisible: boolean = false;
  PHOTO1: string = "";
  DESCRIPTION1: string = "";
  PHOTO2: string = "";
  DESCRIPTION2: string = "";
  PHOTO3: string = "";
  DESCRIPTION3: string = "";
  PHOTO4: string = "";
  DESCRIPTION4: string = "";
  PHOTO5: string = "";
  DESCRIPTION5: string = "";
  drawerTitle2: string;
  selectedIndex = -1;
  drawerVisible2: boolean = false;

  viewPhotoes(data: GroupActivityMaster, i: any): void {
    this.selectedIndex = i;
    this.drawerTitle2 = data.EVENT_NAME ? ((data.EVENT_NAME.length > 60) ? (data.EVENT_NAME.substring(0, 60) + "...") : data.EVENT_NAME) : "Event Details";
    this.drawerVisible2 = true;
    this.imgWidth1 = 60;
    this.imgWidth2 = 60;
    this.imgWidth3 = 60;
    this.imgWidth4 = 60;
    this.imgWidth5 = 60;
  }

  clickCount: number = 0;

  identifyClickOrDoubleClick(data: GroupActivityMaster, i: any): void {
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

  photoModalCancel() {
    this.photoModalVisible = false;
  }

  viewPhoto(photoURL: string) {
    window.open(photoURL);
  }

  viewPDF(pdfURL: string) {
    window.open(this.api.retriveimgUrl + "groupActivity/" + pdfURL);
  }

  getPhotoURL(photoURL: string) {
    return this.api.retriveimgUrl + "groupActivity/" + photoURL;
  }

  getImageCount(photoURL1: string, photoURL2: string, photoURL3: string, photoURL4: string) {
    let count: number = 0;

    if (photoURL1 != " ")
      count = count + 1;

    if (photoURL2 != " ")
      count = count + 1;

    if (photoURL3 != " ")
      count = count + 1;

    if (photoURL4 != " ")
      count = count + 1;

    return count;
  }

  getWidth() {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 800;
  }

  viewDETAILS(activity: any) {
    this.DETAILSModalVisible = true;
    this.DESCRIPTION1 = activity.DETAILS;
  }

  DETAILSModalCancel() {
    this.DETAILSModalVisible = false;
  }

  getClassName(photoURL1: string, photoURL2: string, photoURL3: string, photoURL4: string) {
    let count: number = 0;

    if (photoURL1 != " ")
      count = count + 1;

    if (photoURL2 != " ")
      count = count + 1;

    if (photoURL3 != " ")
      count = count + 1;

    if (photoURL4 != " ")
      count = count + 1;

    if (count > 0)
      return 'opacityImg';

    else
      return '';
  }

  drawerClose2(): void {
    this.drawerVisible2 = false;
    this.selectedIndex = -1;
  }

  get closeCallback2() {
    return this.drawerClose2.bind(this);
  }

  drawerTitle3: string;
  drawerData3: EventComment = new EventComment();
  drawerVisible3: boolean = false;
  dataList1: any[] = [];
  @ViewChild(AddCommentComponent, { static: false }) AddCommentComponentVar: AddCommentComponent;

  addComment(event: any, index: number) {
    this.drawerTitle3 = "aaa " + "Add your comment";
    this.drawerData3 = new EventComment();
    this.drawerData3.EVENT_ID = Number(event);
    sessionStorage.setItem("Comment_Id", event);
    sessionStorage.setItem("Comment_Id_index", String(index));
    this.drawerData3.CREATED_MODIFIED_DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.dataList1 = [];
    this.AddCommentComponentVar.pageIndex = 1;
    this.AddCommentComponentVar.pageSize = 10;
    this.AddCommentComponentVar.eventCommentLoad = true;
    this.AddCommentComponentVar.search(true, true);
    this.drawerVisible3 = true;
  }

  drawerClose3(): void {
    this.commentIncrease(sessionStorage.getItem("Comment_Id"), sessionStorage.getItem("Comment_Id_index"),);
    this.drawerVisible3 = false;
  }

  commentIncrease = (postID: any, i: any) => {
    this.loadingRecords = true;

    this.api.getAllGroupActivitiesUser(1, 1, this.sortKey, 'desc', " AND ID=" + postID, this.userID).subscribe(data => {
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

  get closeCallback3() {
    return this.drawerClose3.bind(this);
  }

  drawerVisible4: boolean = false;

  drawerClose4(): void {
    this.drawerVisible4 = false;
  }

  get eventLikeCloseCallback() {
    return this.drawerClose4.bind(this);
  }

  dataa2: EventLikes = new EventLikes();

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
    this.dataa2.EVENT_ID = event;
    this.loadingRecords = true;

    this.api.createEventlike(this.dataa2).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.api.getAllGroupActivitiesUser(1, 1, this.sortKey, 'desc', " AND ID=" + event, this.userID).subscribe(data => {
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
  likeDrawerTitle: string;
  @ViewChild(EventLikeDrawerComponent, { static: false }) EventLikeDrawerComponentVar: EventLikeDrawerComponent;

  like(event: any): void {
    this.likeDrawerTitle = "aaa " + "Likes";
    this.EventLikeDrawerComponentVar.dataList = [];
    this.EventLikeDrawerComponentVar.eventLikeID = event;
    this.EventLikeDrawerComponentVar.pageIndex = 1;
    this.EventLikeDrawerComponentVar.pageSize = 10;
    this.EventLikeDrawerComponentVar.eventLikeLoad = true;
    this.EventLikeDrawerComponentVar.search(true, true);
    this.drawerVisible4 = true;
  }

  multipleSearchText: any[] = [];
  advanceMultipleSearchText: any[] = [];
  today = new Date().setDate(new Date().getDate());
  advanceFilterModalVisible: boolean = false;
  ADVANCE_FILTER_FROM_DATE: Date = null;
  ADVANCE_FILTER_TO_DATE: Date = null;

  addSearchTextForSearching(text: string) {
    if (text.trim() != "") {
      this.multipleSearchText.push(text);
      this.multipleSearchText = [...new Set(this.multipleSearchText)];
      this.searchText = undefined;
      this.search(true);
    }
  }

  onClose(index: number) {
    this.multipleSearchText.splice(index, 1);

    if (index == 0) {
      sessionStorage.setItem("eventIDFromUpcomingEvent", "");
    }

    this.search(true);
  }

  onAdvanceFilterTagClose(index: number) {
    this.advanceMultipleSearchText.splice(index, this.advanceMultipleSearchText.length);
    this.ADVANCE_FILTER_FROM_DATE = null;
    this.ADVANCE_FILTER_TO_DATE = null;
    this.search(true);
  }

  onAdvanceFilterFederationNamesTagClose(index: number) {
    this.advanceMultipleFederationNames.splice(index, 1);
    this.FEDERATION_ID.splice(index, 1);
    this.search(true);
  }

  onAdvanceFilterUnitNamesTagClose(index: number) {
    this.advanceMultipleUnitNames.splice(index, 1);
    this.UNIT_ID.splice(index, 1);
    this.search(true);
  }

  onAdvanceFilterGroupNamesTagClose(index: number) {
    this.advanceMultipleGroupNames.splice(index, 1);
    this.GROUP_ID.splice(index, 1);
    this.search(true);
  }

  onAdvanceFilterVenuesClose(index: number) {
    this.advanceMultipleVenues.splice(index, 1);
    this.VENUES.splice(index, 1);
    this.search(true);
  }

  onAdvanceFilterHashtagTagClose(index: number) {
    this.advanceMultipleHashtags.splice(index, 1);
    this.HASHTAGS.splice(index, 1);
    this.search(true);
  }

  onAdvanceFilterProjectTypeTagClose(index: number) {
    this.advanceMultipleProjectTypeNames.splice(index, 1);
    this.PROJECT_TYPE_ID.splice(index, 1);
    this.search(true);
  }

  disabledToDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.ADVANCE_FILTER_FROM_DATE ? this.ADVANCE_FILTER_FROM_DATE : this.today) < 0;

  onFromDateChange(fromDate: any) {
    if (fromDate == null)
      this.ADVANCE_FILTER_TO_DATE = new Date();

    else
      this.ADVANCE_FILTER_TO_DATE = new Date(fromDate);
  }

  openAdvanceFilter() {
    this.advanceFilterModalVisible = !this.advanceFilterModalVisible;
  }

  advanceFilterModalCancel() {
    this.advanceFilterModalVisible = false;
  }

  advanceMultipleFederationNames: any[] = [];
  advanceMultipleUnitNames: any[] = [];
  advanceMultipleGroupNames: any[] = [];
  advanceMultipleVenues: any[] = [];
  advanceMultipleHashtags: any[] = [];
  advanceMultipleProjectTypeNames: any[] = [];
  FEDERATION_ID: any[] = [];
  UNIT_ID: any[] = [];
  GROUP_ID: any[] = [];
  MEMBER_ID: any[] = [];
  VENUES: any[] = [];
  HASHTAGS: any[] = [];
  PROJECT_TYPE_ID: any[] = [];

  advanceFilterModalOk() {
    this.advanceFilterModalVisible = false;
    this.advanceMultipleSearchText.splice(0, this.advanceMultipleSearchText.length);
    this.advanceMultipleFederationNames = [];
    this.advanceMultipleUnitNames = [];
    this.advanceMultipleGroupNames = [];
    this.advanceMultipleVenues = [];
    this.advanceMultipleHashtags = [];
    this.advanceMultipleProjectTypeNames = [];

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

    if (this.VENUES.length > 0) {
      for (let i = 0; i < this.VENUES.length; i++) {
        this.advanceMultipleVenues.push(this.VENUES[i]);
      }
    }

    if (this.HASHTAGS.length > 0) {
      for (let i = 0; i < this.HASHTAGS.length; i++) {
        this.advanceMultipleHashtags.push(this.HASHTAGS[i]);
      }
    }

    if (this.PROJECT_TYPE_ID.length > 0) {
      for (let i = 0; i < this.PROJECT_TYPE_ID.length; i++) {
        this.advanceMultipleProjectTypeNames.push(this.PROJECT_TYPE_ID[i]);
      }
    }

    this.search(true);
  }

  clearAdvanceFilter() {
    this.ADVANCE_FILTER_FROM_DATE = null;
    this.ADVANCE_FILTER_TO_DATE = null;
    this.MEMBER_ID = [];
    this.FEDERATION_ID = [];
    this.UNIT_ID = [];
    this.GROUP_ID = [];
    this.VENUES = [];
    this.HASHTAGS = [];
    this.PROJECT_TYPE_ID = [];

    this.advanceMultipleSearchText.splice(0, this.advanceMultipleSearchText.length);
    this.advanceMultipleFederationNames = [];
    this.advanceMultipleUnitNames = [];
    this.advanceMultipleGroupNames = [];
    this.advanceMultipleVenues = [];
    this.advanceMultipleHashtags = [];
    this.advanceMultipleProjectTypeNames = [];
    this.advanceFilterModalVisible = false;

    this.search(true);
  }

  getHeigth() {
    if ((this.multipleSearchText.length > 0) || (this.advanceMultipleSearchText.length > 0) || (this.advanceMultipleFederationNames.length > 0) || (this.advanceMultipleUnitNames.length > 0) || (this.advanceMultipleGroupNames.length > 0) || (this.advanceMultipleVenues.length > 0) || (this.advanceMultipleVenues.length > 0) || (this.advanceMultipleProjectTypeNames.length > 0) || (this.advanceMultipleHashtags.length > 0)) {
      return '73vh';

    } else {
      return '80vh';
    }
  }

  onHashtagClick(hashtag: string) {
    this.advanceMultipleHashtags.push(hashtag);
    this.advanceMultipleHashtags = [...new Set(this.advanceMultipleHashtags)];
    this.search(true);
  }

  getHeightOfEventDetails(index: number): void {
    this.expandEventDetails[index] = !this.expandEventDetails[index];
  }

  getTimeInAM_PM(time: any) {
    return this.datePipe.transform(new Date(), "yyyy-MM-dd" + " " + time);
  }

  visible: boolean = false;
  currentPostLink: string = "";

  showMsg(eventData: GroupActivityMaster) {
    this.visible = true;
    let link = this.api.baseUrl.split('/');
    let formLink = link[0] + "//" + link[2].split(':')[0];
    this.currentPostLink = formLink + "/event-details;title=" + eventData.ID.toString();
  }

  CloseShare() {
    this.visible = false;
  }

  hashtagsToPost: string = '';

  social(a: string) {
    // Twitter
    let twitterHashtags = "";

    if (this.hashtagsToPost != "") {
      twitterHashtags = '&hashtags=' + this.hashtagsToPost;
    }

    let twitter = 'http://twitter.com/intent/tweet?text=&url=' + this.currentPostLink + twitterHashtags;

    // Instagram
    // let Insta = 'https://instagram.com/accounts/login/?text=%20Check%20up%20this%20awesome%20content' + this.url;
    let Insta = 'https://instagram.com';

    // LinkedIn
    let Linkdin = 'https://www.linkedin.com/sharing/share-offsite/?url=' + this.currentPostLink;

    // Facebook
    let facebook = 'https://www.facebook.com/sharer/sharer.php?u=' + this.currentPostLink;

    // WhatsApp
    let Whatsapp = 'https://api.whatsapp.com/send?text=' + this.currentPostLink;

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

  copyPostLink() {
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
    this.message.info("Link Copied", "");
    this.visible = false;
  }

  DeleteEvent(eventData: GroupActivityMaster) {
    this.loadingRecords = true;
    eventData.IS_DELETED = true;

    this.api.updateGroupActivity(eventData).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Event Deleted Successfully", "");
        this.search(true);

      } else {
        this.message.error("Failed to Event Deletion", "");
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

  projects: any[] = [];

  getProjectTypes(projectName: string) {
    if (projectName.length >= 3) {
      this.api.getAllProjects(0, 0, "NAME", "asc", " AND STATUS=1 AND NAME LIKE '%" + projectName + "%'").subscribe(data => {
        if (data['code'] == 200) {
          this.projects = data['data'];
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  imgWidth1: number = 60;

  mouseWheelUpFunc1() {
    if (this.imgWidth1 > 200) {
      this.imgWidth1 = 200;
    }

    this.imgWidth1 = this.imgWidth1 + 20;
  }

  mouseWheelDownFunc1() {
    if (this.imgWidth1 < 60) {
      this.imgWidth1 = 60;
    }

    this.imgWidth1 = this.imgWidth1 - 20;
  }

  imgWidth2: number = 60;

  mouseWheelUpFunc2() {
    if (this.imgWidth2 > 200) {
      this.imgWidth2 = 200;
    }

    this.imgWidth2 = this.imgWidth2 + 20;
  }

  mouseWheelDownFunc2() {
    if (this.imgWidth2 < 60) {
      this.imgWidth2 = 60;
    }

    this.imgWidth2 = this.imgWidth2 - 20;
  }

  imgWidth3: number = 60;

  mouseWheelUpFunc3() {
    if (this.imgWidth3 > 200) {
      this.imgWidth3 = 200;
    }

    this.imgWidth3 = this.imgWidth3 + 20;
  }

  mouseWheelDownFunc3() {
    if (this.imgWidth3 < 60) {
      this.imgWidth3 = 60;
    }

    this.imgWidth3 = this.imgWidth3 - 20;
  }

  imgWidth4: number = 60;

  mouseWheelUpFunc4() {
    if (this.imgWidth4 > 200) {
      this.imgWidth4 = 200;
    }

    this.imgWidth4 = this.imgWidth4 + 20;
  }

  mouseWheelDownFunc4() {
    if (this.imgWidth4 < 60) {
      this.imgWidth4 = 60;
    }

    this.imgWidth4 = this.imgWidth4 - 20;
  }

  imgWidth5: number = 60;

  mouseWheelUpFunc5() {
    if (this.imgWidth5 > 200) {
      this.imgWidth5 = 200;
    }

    this.imgWidth5 = this.imgWidth5 + 20;
  }

  mouseWheelDownFunc5() {
    if (this.imgWidth5 < 60) {
      this.imgWidth5 = 60;
    }

    this.imgWidth5 = this.imgWidth5 - 20;
  }

  publishEvent(eventData: GroupActivityMaster): void {
    var Form = this.datePipe.transform(eventData.DATE, 'yyyyMMdd') + 'T' + this.datePipe.transform(this.datePipe.transform(new Date(), 'yyyyMMdd') + 'T' + eventData.FROM_TIME, 'HHmmss');
    var To = this.datePipe.transform(eventData.DATE, 'yyyyMMdd') + 'T' + this.datePipe.transform(this.datePipe.transform(new Date(), 'yyyyMMdd') + 'T' + eventData.TO_TIME, 'HHmmss');
    this.loadingRecords = true;
    eventData.STATUS = "P";

    this.api.updateGroupActivity(eventData).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Event Published Successfully", "");

        if (eventData["IS_ATTENDANCE_MARKED"] == 0) {
          this.GoogleCalender = "https://calendar.google.com/calendar/r/eventedit?text=" + eventData.EVENT_NAME + "&details=" + eventData.DETAILS + "&location=" + eventData.VENUE + "&dates=" + Form + "/" + To + "&ctz=Asia%2FKolkata";
          this.isVisible = true;
        }

        this.search(true);

      } else {
        this.message.error("Failed to Publish Event", "");
        this.search(true);
      }
    });
  }

  @ViewChild(AddpostComponent, { static: false }) addpostComponent: AddpostComponent;
  postDrawerTitle: string;
  postDrawerData: Post = new Post();
  postDrawerVisible: boolean = false;

  createPost(data: GroupActivityMaster): void {
    this.postDrawerTitle = "aaa " + "Add Post";
    this.postDrawerData = new Post();
    this.postDrawerVisible = true;
    this.postDrawerData.POST_CREATED_DATETIME = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.addpostComponent.fileURL1 = null;
    this.addpostComponent.fileURL2 = null;
    this.addpostComponent.fileURL3 = null;
    this.addpostComponent.originalFileURL1 = null;
    this.addpostComponent.originalFileURL2 = null;
    this.addpostComponent.originalFileURL3 = null;

    // Drawer Type
    this.addpostComponent.addDrawer = false;

    // Get IDs
    this.addpostComponent.getIDs();

    // Fill existing event data
    if (data.PHOTO1 != " ") {
      this.postDrawerData.IMAGE_URL1 = this.api.retriveimgUrl + "groupActivity/" + data.PHOTO1;

    } else {
      this.postDrawerData.IMAGE_URL1 = null;
    }

    if (data.PHOTO2 != " ") {
      this.postDrawerData.IMAGE_URL2 = this.api.retriveimgUrl + "groupActivity/" + data.PHOTO2;

    } else {
      this.postDrawerData.IMAGE_URL2 = null;
    }

    if (data.PHOTO3 != " ") {
      this.postDrawerData.IMAGE_URL3 = this.api.retriveimgUrl + "groupActivity/" + data.PHOTO3;

    } else {
      this.postDrawerData.IMAGE_URL3 = null;
    }

    this.postDrawerData.DESCRIPTION = data.DETAILS;
    this.postDrawerData.IS_EVENT_POST = true;
    this.addpostComponent.EVENT_ID = data.ID;

    if ((data.HASHTAGS != null) && (data.HASHTAGS != '')) {
      this.postDrawerData.HASHTAGS = data.HASHTAGS.split(',');
    }
  }

  postDrawerClose(): void {
    this.search(true);
    this.postDrawerVisible = false;
  }

  get postDrawerCloseCallback() {
    return this.postDrawerClose.bind(this);
  }

  getwidthInvities(): number {
    if (window.innerWidth <= 400) {
      return 380;

    } else {
      return 1200;
    }
  }

  EVENT_ID: number;
  drawerVisibleInvities: boolean = false;
  drawerTitleInvities: string = '';
  drawerDataInvities: GroupMapInvitees = new GroupMapInvitees();
  @ViewChild(GroupProjectActivityMapInviteesDrawerComponent, { static: false }) GroupProjectActivityMapInviteesDrawerComponentVar: GroupProjectActivityMapInviteesDrawerComponent;

  mapInvities(data: GroupActivityMaster): void {
    this.drawerTitleInvities = data.EVENT_NAME ? ((data.EVENT_NAME.length > 60) ? ("aaa " + "Invitees for " + data.EVENT_NAME.substring(0, 60) + "...") : ("aaa " + "Invitees for " + data.EVENT_NAME)) : "Map Invitees";
    this.drawerVisibleInvities = true;
    this.EVENT_ID = data.ID;
    this.GroupProjectActivityMapInviteesDrawerComponentVar.getIDs();
    this.GroupProjectActivityMapInviteesDrawerComponentVar.UNIT_ID = [];
    this.GroupProjectActivityMapInviteesDrawerComponentVar.GROUP_ID = [];
    this.GroupProjectActivityMapInviteesDrawerComponentVar.ROLE_ID = [];
    this.GroupProjectActivityMapInviteesDrawerComponentVar.getUnits();
    this.GroupProjectActivityMapInviteesDrawerComponentVar.getGroups([]);
    this.GroupProjectActivityMapInviteesDrawerComponentVar.getMembersPost();
  }

  drawerCloseInvities(): void {
    this.search(true);
    this.drawerVisibleInvities = false;
  }

  get closeCallbackInvities() {
    return this.drawerCloseInvities.bind(this);
  }

  eventAttendanceDrawerTitle: string;
  eventAttendanceDrawerVisible: boolean = false;
  @ViewChild(GroupProjectActivityAttendanceDrawerComponent, { static: false }) GroupProjectActivityAttendanceDrawerComponentVar: GroupProjectActivityAttendanceDrawerComponent;
  groupDetails: GroupActivityMaster = new GroupActivityMaster();
  eventAttendanceDrawerData: any[] = [];
  eventAttendanceDrawerDataTotalRecords: number;
  drawerData1: GroupActivityMaster = new GroupActivityMaster();

  mapAttendies(data: GroupActivityMaster): void {
    this.eventAttendanceDrawerTitle = "Attendies for " + data.EVENT_NAME ? ((data.EVENT_NAME.length > 60) ? (data.EVENT_NAME.substring(0, 60) + "...") : data.EVENT_NAME) : "";
    this.eventAttendanceDrawerVisible = true;
    this.GroupProjectActivityAttendanceDrawerComponentVar.isSpinning = true;
    this.GroupProjectActivityAttendanceDrawerComponentVar.GLOBAL_P_A = true;
    this.GroupProjectActivityAttendanceDrawerComponentVar.indeterminate = false;
    this.EVENT_ID = data.ID;
    this.eventAttendanceDrawerData = [];
    this.groupDetails = data;

    this.api.getAllEventAttendanceDetails(this.EVENT_ID, data.GROUP_ID).subscribe(data => {
      if (data['code'] == 200) {
        this.eventAttendanceDrawerDataTotalRecords = data['count'];
        this.eventAttendanceDrawerData = data['data'];
        this.GroupProjectActivityAttendanceDrawerComponentVar.isSpinning = false;
        this.GroupProjectActivityAttendanceDrawerComponentVar.calcPresentAbsent(this.eventAttendanceDrawerData);
      }

    }, err => {
      this.GroupProjectActivityAttendanceDrawerComponentVar.isSpinning = false;
      this.GroupProjectActivityAttendanceDrawerComponentVar.calcPresentAbsent(this.eventAttendanceDrawerData);

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  eventAttendanceDrawerClose(): void {
    this.search(true);
    this.eventAttendanceDrawerVisible = false;
  }

  get eventAttendanceCloseCallback() {
    return this.eventAttendanceDrawerClose.bind(this);
  }

  getEventAttendanceWidth(): number {
    if (window.innerWidth <= 400) {
      return 380;

    } else {
      return 800;
    }
  }

  drawerAttendanciesTitle: string;
  drawerAttendanciesVisible: boolean = false;
  isViewAttendanceSpinning: boolean = false;
  meetingTotalCount: number;
  meetingPresentCount: number;
  meetingAbsentCount: number;
  viewAttendanceTotalRecords: number = 1;
  attendanceData: any[] = [];

  viewAttendancies(data: GroupActivityMaster): void {
    this.drawerAttendanciesTitle = "Attendies for " + ((data.EVENT_NAME.length > 60) ? (data.EVENT_NAME.substring(0, 60) + "...") : data.EVENT_NAME);
    this.drawerAttendanciesVisible = true;
    this.meetingTotalCount = 0;
    this.meetingPresentCount = 0
    this.meetingAbsentCount = 0;
    this.isViewAttendanceSpinning = true;

    this.api.getEventAttendanceData(data.ID).subscribe(data => {
      if (data['code'] == 200) {
        this.isViewAttendanceSpinning = false;
        this.viewAttendanceTotalRecords = data['count'];
        this.attendanceData = data['data'];

        let presentCount = 0;
        let absentCount = 0;

        this.attendanceData.filter(obj1 => {
          if (obj1["P_A"] == 1) {
            presentCount += 1;
          }

          if (obj1["P_A"] == 0) {
            absentCount += 1;
          }
        });

        this.meetingTotalCount = this.viewAttendanceTotalRecords;
        this.meetingPresentCount = presentCount;
        this.meetingAbsentCount = absentCount;

      } else {
        this.isViewAttendanceSpinning = false;
      }

    }, err => {
      this.isViewAttendanceSpinning = false;

      if (err['ok'] == false) {
        this.message.error("Server Not Found", "");
      }
    });
  }

  drawerAttendanciesClose(): void {
    this.drawerAttendanciesVisible = false;
  }

  get closeAttendanciesCallback() {
    return this.drawerAttendanciesClose.bind(this);
  }

  getViewAttendanceWidth(): number {
    if (window.innerWidth <= 400) {
      return 380;

    } else {
      return 800;
    }
  }

  getHeightOfEventBeneficiaryDetails(index: number): void {
    this.expandEventBeneficiaryDetails[index] = !this.expandEventBeneficiaryDetails[index];
  }

  getEventTag(eventData: GroupActivityMaster): boolean {
    let currentDateTime: Date = new Date(this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    let eventStartDateTime: Date = new Date(this.datePipe.transform(eventData.DATE, 'yyyy-MM-dd') + 'T' + eventData.FROM_TIME);

    if ((eventStartDateTime.getTime() > currentDateTime.getTime()) && eventData["IS_ATTENDANCE_MARKED"] == 0) {
      return true;
    }
  }

  getTextInOriginalFormat(text: string): string {
    const htmlString = text;

    const div = document.createElement('div');
    div.innerHTML = htmlString;

    return div.textContent.trim();
  }

  getActivityDetails(activity: GroupActivityMaster): boolean {
    let currentDateTime: Date = new Date(this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    let meetingStartDateTime: Date = new Date(this.datePipe.transform(activity.DATE, 'yyyy-MM-dd') + 'T' + activity.FROM_TIME);

    if ((this.homeGroupID == activity.GROUP_ID) && (activity.STATUS == "P") && (meetingStartDateTime.getTime() > currentDateTime.getTime()) && (activity["IS_ATTENDANCE_MARKED"] == 0)) {
      return true;
    }
  }

  isVisible: boolean = false;

  handleOk(): void {
    this.isVisible = false;
  }
  handleCancel(): void {
    this.isVisible = false;
  }

  GoogleCalender: string = '';

  gotoGoogleCalender(activity: GroupActivityMaster): void {
    var FROM_TIME = new Date(activity.DATE + ' ' + activity.FROM_TIME);
    var TO_TIME = new Date(activity.DATE + ' ' + activity.TO_TIME);
    var Form = this.datePipe.transform(activity.DATE, 'yyyyMMdd') + 'T' + this.datePipe.transform(FROM_TIME, 'HHmmss');
    var To = this.datePipe.transform(activity.DATE, 'yyyyMMdd') + 'T' + this.datePipe.transform(TO_TIME, 'HHmmss');
    this.GoogleCalender = "https://calendar.google.com/calendar/r/eventedit?text=" + activity.EVENT_NAME + "&details=" + activity.DETAILS + "&location=" + activity.VENUE + "&dates=" + Form + "/" + To + "&ctz=Asia%2FKolkata";
    this.isVisible = true;
  }
}
