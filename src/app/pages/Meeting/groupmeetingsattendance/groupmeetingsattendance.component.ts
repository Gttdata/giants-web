import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { GroupMeetAttendance } from 'src/app/Models/GroupMeetAttendance';
import { GroupMeetingAttendance } from 'src/app/Models/GroupMeetingAttendance';
import { ApiService } from 'src/app/Service/api.service';
import { AddgroupmeetingsattendanceComponent } from '../addgroupmeetingsattendance/addgroupmeetingsattendance.component';
import { GroupmeetsattendiesmapComponent } from '../groupmeetsattendiesmap/groupmeetsattendiesmap.component';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { DrawermapinvitiesComponent } from '../drawermapinvities/drawermapinvities.component';
import { GroupMapInvitees } from 'src/app/Models/GroupMapInvitees';
import { GroupMaster } from 'src/app/Models/GroupMaster';

@Component({
  selector: 'app-groupmeetingsattendance',
  templateUrl: './groupmeetingsattendance.component.html',
  styleUrls: ['./groupmeetingsattendance.component.css']
})

export class GroupmeetingsattendanceComponent implements OnInit {
  formTitle: string = "Meetings";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  totalRecords2: number = 1;
  totalAttendanciesRecords: number = 1;
  dataList: any[] = [];
  loadingRecords: boolean = true;
  sortKey: string = "DATE";
  sortValue: string = "desc";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: string = "default";
  columns: string[][] = [["MEETING_SUB", "MEETING_SUB"], ["VENUE", "VENUE"], ["AGENDA", "AGENDA"], ["MINUTES", "MINUTES"], ["FEDERATION_NAME", "FEDERATION_NAME"], ["UNIT_NAME", "UNIT_NAME"], ["GROUP_NAME", "GROUP_NAME"], ["MEETING_NUMBER", "MEETING_NUMBER"]];
  advanceFilterColumns: string[][] = [["DATE", "DATE"]];
  advanceFilterColumnsFederationNames: string[][] = [["FEDERATION_NAME", "FEDERATION_NAME"]];
  advanceFilterColumnsUnitNames: string[][] = [["UNIT_NAME", "UNIT_NAME"]];
  advanceFilterColumnsGroupNames: string[][] = [["GROUP_NAME", "GROUP_NAME"]];
  advanceFilterColumnsVenues: string[][] = [["VENUE", "VENUE"]];
  scheduleId = 0;
  empId = 0;
  drawerVisible2: boolean = false;
  drawerTitle2!: string;
  drawerVisible: boolean = false;
  drawerTitle!: string;
  drawerData: GroupMeetAttendance = new GroupMeetAttendance();
  drawerVisible1: boolean = false;
  drawerTitle1: string = '';
  drawerAttendanciesTitle: string = '';
  drawerAttendanciesVisible: boolean = false;
  drawerAttendanciesData: string[] = [];
  drawerData1: GroupMeetingAttendance = new GroupMeetingAttendance();
  drawerData2: string[] = [];
  attendanceData: string[] = [];

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  homeFederationID: number = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
  homeUnitID: number = Number(sessionStorage.getItem("HOME_UNIT_ID"));
  homeGroupID: number = Number(sessionStorage.getItem("HOME_GROUP_ID"));

  roleID: number = this.api.roleId;
  userID: number = this.api.userId;
  private categoriesSubject = new BehaviorSubject<Array<string>>([]);
  categories$ = this.categoriesSubject.asObservable();
  loadingRecords2: boolean = false;
  emitted = false;

  expandAgenda: boolean[] = [];
  expandMinutes: boolean[] = [];
  expandSubject: boolean[] = [];

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() {
    this.getIDs();
    this.getFederations();
    this.getGroupsForFindingHostedGroupName();
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

  keyup(event: any): void {
    this.search(true);
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

    // Filter for upcoming meetings
    let meetingIDFromUpcomingMeeting = sessionStorage.getItem("meetingIDFromUpcomingMeeting");

    if (meetingIDFromUpcomingMeeting != "") {
      this.multipleSearchText.push(meetingIDFromUpcomingMeeting.trim());
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

    // Meeting publish, draft filter
    var meetingAccessFilter = "";
    meetingAccessFilter = " AND ((IS_DELETED=0 AND CREATOR_ID=" + this.userID + ") OR (IS_DELETED=0 AND STATUS='P'))";

    // Global federation filter
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

    this.api.getAllgroupMeeting(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + advanceLikeQuery + advanceLikeQueryFederationNames + advanceLikeQueryUnitNames + advanceLikeQueryGroupNames + advanceLikeQueryVenues + meetingAccessFilter + globalFederationFilter + mapInviteeFilter + filterToShow).subscribe(data => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.expandAgenda = new Array(this.totalRecords).fill(false);
        this.expandMinutes = new Array(this.totalRecords).fill(false);
        this.expandSubject = new Array(this.totalRecords).fill(false);

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

  drawerClose(): void {
    this.search(true);
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  drawerClose2(): void {
    this.search(true);
    this.drawerVisible2 = false;
  }

  get closeCallback2() {
    return this.drawerClose2.bind(this);
  }

  @ViewChild(AddgroupmeetingsattendanceComponent, { static: false }) AddgroupmeetingsattendanceComponentVar: AddgroupmeetingsattendanceComponent;

  add(): void {
    this.drawerTitle = "aaa " + "Add Meeting";
    this.drawerData = new GroupMeetAttendance();
    this.drawerVisible = true;
    this.drawerData.DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.AddgroupmeetingsattendanceComponentVar.fileURL1 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL2 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL3 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL4 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL5 = null;
    this.AddgroupmeetingsattendanceComponentVar.originalFileURL1 = null;
    this.AddgroupmeetingsattendanceComponentVar.originalFileURL2 = null;
    this.AddgroupmeetingsattendanceComponentVar.originalFileURL3 = null;
    this.AddgroupmeetingsattendanceComponentVar.originalFileURL4 = null;
    this.AddgroupmeetingsattendanceComponentVar.originalFileURL5 = null;
    this.AddgroupmeetingsattendanceComponentVar.pdfFileURL1 = null;
    this.AddgroupmeetingsattendanceComponentVar.pdfFileURL2 = null;

    // Drawer Type
    this.AddgroupmeetingsattendanceComponentVar.addDrawer = false;
    this.AddgroupmeetingsattendanceComponentVar.uploadMinutes = false;

    // Meeting Type
    if (this.federationID > 0) {
      this.drawerData.MEETING_TYPE = "P";

    } else if (this.unitID > 0) {
      this.drawerData.MEETING_TYPE = "U";
      this.AddgroupmeetingsattendanceComponentVar.getUnits();
      this.AddgroupmeetingsattendanceComponentVar.SELECT_ALL = false;
      this.AddgroupmeetingsattendanceComponentVar.shareWithinTitle = "Select Unit";
      this.AddgroupmeetingsattendanceComponentVar.shareWithinPlaceHolder = "Type here to search unit(s)";

    } else if (this.groupID > 0) {
      this.drawerData.MEETING_TYPE = "G";
      this.AddgroupmeetingsattendanceComponentVar.getFilteredGroups();
      this.AddgroupmeetingsattendanceComponentVar.SELECT_ALL = false;
      this.AddgroupmeetingsattendanceComponentVar.shareWithinTitle = "Select Group";
      this.AddgroupmeetingsattendanceComponentVar.shareWithinPlaceHolder = "Type here to search group(s)";
    }

    // Hosted group name
    let tempHomeGroupArray = [];
    tempHomeGroupArray.push(this.homeGroupID);
    this.drawerData.HOSTED_BY_GROUP_IDS = tempHomeGroupArray;
  }

  edit(data: GroupMeetAttendance): void {
    this.drawerTitle = "aaa " + "Edit Meeting";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
    this.drawerData.FROM_TIME = this.datePipe.transform(new Date(), "yyyy-MM-dd") + " " + this.drawerData.FROM_TIME;
    this.drawerData.TO_TIME = this.datePipe.transform(new Date(), "yyyy-MM-dd") + " " + this.drawerData.TO_TIME;
    this.AddgroupmeetingsattendanceComponentVar.fileURL1 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL2 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL3 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL4 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL5 = null;
    this.AddgroupmeetingsattendanceComponentVar.originalFileURL1 = null;
    this.AddgroupmeetingsattendanceComponentVar.originalFileURL2 = null;
    this.AddgroupmeetingsattendanceComponentVar.originalFileURL3 = null;
    this.AddgroupmeetingsattendanceComponentVar.originalFileURL4 = null;
    this.AddgroupmeetingsattendanceComponentVar.originalFileURL5 = null;
    this.AddgroupmeetingsattendanceComponentVar.pdfFileURL1 = null;
    this.AddgroupmeetingsattendanceComponentVar.pdfFileURL2 = null;

    if (this.drawerData.PHOTO1 != " ")
      this.drawerData.PHOTO1 = this.api.retriveimgUrl + "groupMeeting/" + this.drawerData.PHOTO1;
    else
      this.drawerData.PHOTO1 = null;

    if (this.drawerData.PHOTO2 != " ")
      this.drawerData.PHOTO2 = this.api.retriveimgUrl + "groupMeeting/" + this.drawerData.PHOTO2;
    else
      this.drawerData.PHOTO2 = null;

    if (this.drawerData.PHOTO3 != " ")
      this.drawerData.PHOTO3 = this.api.retriveimgUrl + "groupMeeting/" + this.drawerData.PHOTO3;
    else
      this.drawerData.PHOTO3 = null;

    if (this.drawerData.PHOTO4 != " ")
      this.drawerData.PHOTO4 = this.api.retriveimgUrl + "groupMeeting/" + this.drawerData.PHOTO4;
    else
      this.drawerData.PHOTO4 = null;

    if (this.drawerData.PHOTO5 != " ")
      this.drawerData.PHOTO5 = this.api.retriveimgUrl + "groupMeeting/" + this.drawerData.PHOTO5;
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
    this.AddgroupmeetingsattendanceComponentVar.addDrawer = true;
    this.AddgroupmeetingsattendanceComponentVar.uploadMinutes = true;

    // Meeting Sharing
    if (this.drawerData.MEETING_TYPE == "P") {
      this.drawerData.TYPE_ID = undefined;

    } else if (this.drawerData.MEETING_TYPE == "F") {
      this.AddgroupmeetingsattendanceComponentVar.getFederations();
      this.AddgroupmeetingsattendanceComponentVar.SELECT_ALL = false;
      this.AddgroupmeetingsattendanceComponentVar.shareWithinPlaceHolder = "Type here to search federation(s)";

      let tempTypeIDs = this.drawerData.TYPE_ID.split(',');
      let tempTypeIDsArray = [];

      for (var i = 0; i < tempTypeIDs.length; i++) {
        tempTypeIDsArray.push(Number(tempTypeIDs[i]));
      }

      this.drawerData.TYPE_ID = tempTypeIDsArray;

    } else if (this.drawerData.MEETING_TYPE == "U") {
      this.AddgroupmeetingsattendanceComponentVar.getUnits();
      this.AddgroupmeetingsattendanceComponentVar.SELECT_ALL = false;
      this.AddgroupmeetingsattendanceComponentVar.shareWithinPlaceHolder = "Type here to search unit(s)";
      let tempTypeIDs = this.drawerData.TYPE_ID.split(',');
      let tempTypeIDsArray = [];

      for (var i = 0; i < tempTypeIDs.length; i++) {
        tempTypeIDsArray.push(Number(tempTypeIDs[i]));
      }

      this.drawerData.TYPE_ID = tempTypeIDsArray;

    } else if (this.drawerData.MEETING_TYPE == "G") {
      this.AddgroupmeetingsattendanceComponentVar.getFilteredGroups();
      this.AddgroupmeetingsattendanceComponentVar.SELECT_ALL = false;
      this.AddgroupmeetingsattendanceComponentVar.shareWithinPlaceHolder = "Type here to search group(s)";
      let tempTypeIDs = this.drawerData.TYPE_ID.split(',');
      let tempTypeIDsArray = [];

      for (var i = 0; i < tempTypeIDs.length; i++) {
        tempTypeIDsArray.push(Number(tempTypeIDs[i]));
      }

      this.drawerData.TYPE_ID = tempTypeIDsArray;
    }

    // Hosted meeting data
    if (this.drawerData.HOSTING_LEVEL.trim() == "") {
      this.drawerData.HOSTING_LEVEL = undefined;
    }

    if (this.drawerData.HOSTED_BY_GROUP_IDS == "0") {
      this.drawerData.HOSTED_BY_GROUP_IDS = undefined;
    }

    if (this.drawerData.HOSTED_PROGRAMME_ID == 0) {
      this.drawerData.HOSTED_PROGRAMME_ID = undefined;
    }

    // Hosted by group name(s)
    if (this.drawerData.HOSTED_BY_GROUP_IDS) {
      let tempHostedByGroupIDs = this.drawerData.HOSTED_BY_GROUP_IDS.split(',');
      let tempHostedByGroupIDsArray = [];

      for (var i = 0; i < tempHostedByGroupIDs.length; i++) {
        tempHostedByGroupIDsArray.push(Number(tempHostedByGroupIDs[i]));
      }

      this.AddgroupmeetingsattendanceComponentVar.getExistingGroups(tempHostedByGroupIDsArray.toString());
      this.drawerData.HOSTED_BY_GROUP_IDS = tempHostedByGroupIDsArray;
    }
  }

  editInPartially(data: GroupMeetAttendance): void {
    this.drawerTitle = "aaa " + "Edit Meeting";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
    this.drawerData.FROM_TIME = this.datePipe.transform(new Date(), "yyyy-MM-dd") + " " + this.drawerData.FROM_TIME;
    this.drawerData.TO_TIME = this.datePipe.transform(new Date(), "yyyy-MM-dd") + " " + this.drawerData.TO_TIME;
    this.AddgroupmeetingsattendanceComponentVar.fileURL1 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL2 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL3 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL4 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL5 = null;
    this.AddgroupmeetingsattendanceComponentVar.pdfFileURL1 = null;
    this.AddgroupmeetingsattendanceComponentVar.pdfFileURL2 = null;

    // Drawer Type
    this.AddgroupmeetingsattendanceComponentVar.addDrawer = false;
    this.AddgroupmeetingsattendanceComponentVar.uploadMinutes = false;

    if (this.drawerData.PHOTO1 != " ")
      this.drawerData.PHOTO1 = this.api.retriveimgUrl + "groupMeeting/" + this.drawerData.PHOTO1;
    else
      this.drawerData.PHOTO1 = null;

    if (this.drawerData.PHOTO2 != " ")
      this.drawerData.PHOTO2 = this.api.retriveimgUrl + "groupMeeting/" + this.drawerData.PHOTO2;
    else
      this.drawerData.PHOTO2 = null;

    if (this.drawerData.PHOTO3 != " ")
      this.drawerData.PHOTO3 = this.api.retriveimgUrl + "groupMeeting/" + this.drawerData.PHOTO3;
    else
      this.drawerData.PHOTO3 = null;

    if (this.drawerData.PHOTO4 != " ")
      this.drawerData.PHOTO4 = this.api.retriveimgUrl + "groupMeeting/" + this.drawerData.PHOTO4;
    else
      this.drawerData.PHOTO4 = null;

    if (this.drawerData.PHOTO5 != " ")
      this.drawerData.PHOTO5 = this.api.retriveimgUrl + "groupMeeting/" + this.drawerData.PHOTO5;
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

    // Meeting Share
    if (this.drawerData.MEETING_TYPE == "P") {
      this.drawerData.TYPE_ID = undefined;

    } else if (this.drawerData.MEETING_TYPE == "F") {
      this.AddgroupmeetingsattendanceComponentVar.getFederations();
      this.AddgroupmeetingsattendanceComponentVar.SELECT_ALL = false;
      this.AddgroupmeetingsattendanceComponentVar.shareWithinPlaceHolder = "Type here to search federation(s)";

      let tempTypeIDs = this.drawerData.TYPE_ID.split(',');
      let tempTypeIDsArray = [];

      for (var i = 0; i < tempTypeIDs.length; i++) {
        tempTypeIDsArray.push(Number(tempTypeIDs[i]));
      }

      this.drawerData.TYPE_ID = tempTypeIDsArray;

    } else if (this.drawerData.MEETING_TYPE == "U") {
      this.AddgroupmeetingsattendanceComponentVar.getUnits();
      this.AddgroupmeetingsattendanceComponentVar.SELECT_ALL = false;
      this.AddgroupmeetingsattendanceComponentVar.shareWithinPlaceHolder = "Type here to search unit(s)";
      let tempTypeIDs = this.drawerData.TYPE_ID.split(',');
      let tempTypeIDsArray = [];

      for (var i = 0; i < tempTypeIDs.length; i++) {
        tempTypeIDsArray.push(Number(tempTypeIDs[i]));
      }

      this.drawerData.TYPE_ID = tempTypeIDsArray;

    } else if (this.drawerData.MEETING_TYPE == "G") {
      this.AddgroupmeetingsattendanceComponentVar.getFilteredGroups();
      this.AddgroupmeetingsattendanceComponentVar.SELECT_ALL = false;
      this.AddgroupmeetingsattendanceComponentVar.shareWithinPlaceHolder = "Type here to search group(s)";
      let tempTypeIDs = this.drawerData.TYPE_ID.split(',');
      let tempTypeIDsArray = [];

      for (var i = 0; i < tempTypeIDs.length; i++) {
        tempTypeIDsArray.push(Number(tempTypeIDs[i]));
      }

      this.drawerData.TYPE_ID = tempTypeIDsArray;
    }

    // Hosted meeting data
    if (this.drawerData.HOSTING_LEVEL.trim() == "") {
      this.drawerData.HOSTING_LEVEL = undefined;
    }

    if (this.drawerData.HOSTED_BY_GROUP_IDS == "0") {
      this.drawerData.HOSTED_BY_GROUP_IDS = undefined;
    }

    if (this.drawerData.HOSTED_PROGRAMME_ID == 0) {
      this.drawerData.HOSTED_PROGRAMME_ID = undefined;
    }

    // Hosted by group name(s)
    if (this.drawerData.HOSTED_BY_GROUP_IDS) {
      let tempHostedByGroupIDs = this.drawerData.HOSTED_BY_GROUP_IDS.split(',');
      let tempHostedByGroupIDsArray = [];

      for (var i = 0; i < tempHostedByGroupIDs.length; i++) {
        tempHostedByGroupIDsArray.push(Number(tempHostedByGroupIDs[i]));
      }

      this.AddgroupmeetingsattendanceComponentVar.getExistingGroups(tempHostedByGroupIDsArray.toString());
      this.drawerData.HOSTED_BY_GROUP_IDS = tempHostedByGroupIDsArray;
    }
  }

  UploadAttendancy(data: GroupMeetAttendance): void {
    this.drawerTitle2 = "Update Group Meeting Details";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible2 = true;
    this.drawerData.FROM_TIME = this.datePipe.transform(new Date(), "yyyy-MM-dd") + " " + this.drawerData.FROM_TIME;
    this.drawerData.TO_TIME = this.datePipe.transform(new Date(), "yyyy-MM-dd") + " " + this.drawerData.TO_TIME;
    this.AddgroupmeetingsattendanceComponentVar.fileURL1 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL2 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL3 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL4 = null;
    this.AddgroupmeetingsattendanceComponentVar.fileURL5 = null;
    this.AddgroupmeetingsattendanceComponentVar.pdfFileURL1 = null;
    this.AddgroupmeetingsattendanceComponentVar.pdfFileURL2 = null;

    if (this.drawerData.PHOTO1 != " ")
      this.drawerData.PHOTO1 = this.api.retriveimgUrl + "groupMeeting/" + this.drawerData.PHOTO1;
    else
      this.drawerData.PHOTO1 = null;

    if (this.drawerData.PHOTO2 != " ")
      this.drawerData.PHOTO2 = this.api.retriveimgUrl + "groupMeeting/" + this.drawerData.PHOTO2;
    else
      this.drawerData.PHOTO2 = null;

    if (this.drawerData.PHOTO3 != " ")
      this.drawerData.PHOTO3 = this.api.retriveimgUrl + "groupMeeting/" + this.drawerData.PHOTO3;
    else
      this.drawerData.PHOTO3 = null;

    if (this.drawerData.PHOTO4 != " ")
      this.drawerData.PHOTO4 = this.api.retriveimgUrl + "groupMeeting/" + this.drawerData.PHOTO4;
    else
      this.drawerData.PHOTO4 = null;

    if (this.drawerData.PHOTO5 != " ")
      this.drawerData.PHOTO5 = this.api.retriveimgUrl + "groupMeeting/" + this.drawerData.PHOTO5;
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
  }

  MEETING_ID: number;
  @ViewChild(GroupmeetsattendiesmapComponent, { static: false }) GroupmeetsattendiesmapComponentVar: GroupmeetsattendiesmapComponent;
  groupDetails: GroupMeetAttendance;

  MapAttendies(data: GroupMeetAttendance): void {
    this.drawerTitle1 = "Attendies for " + ((data.MEETING_SUB.length > 60) ? (data.MEETING_SUB.substring(0, 60) + "...") : data.MEETING_SUB);
    this.drawerVisible1 = true;
    this.GroupmeetsattendiesmapComponentVar.isSpinning = true;
    this.GroupmeetsattendiesmapComponentVar.GLOBAL_P_A = true;
    this.GroupmeetsattendiesmapComponentVar.indeterminate = false;
    this.MEETING_ID = data.ID;
    this.drawerData2 = [];
    this.groupDetails = data;

    this.api.getAllgroupMeetingAttendanceDetails(this.MEETING_ID, data.GROUP_ID).subscribe(data => {
      if (data['code'] == 200) {
        this.totalRecords2 = data['count'];
        this.drawerData2 = data['data'];
        this.GroupmeetsattendiesmapComponentVar.isSpinning = false;
        this.GroupmeetsattendiesmapComponentVar.calcPresentAbsent(this.drawerData2);
      }

    }, err => {
      this.GroupmeetsattendiesmapComponentVar.isSpinning = false;
      this.GroupmeetsattendiesmapComponentVar.calcPresentAbsent(this.drawerData2);

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  isSpinning: boolean = false;
  meetingTotalCount: number;
  meetingPresentCount: number;
  meetingAbsentCount: number;
  viewAttendancePageIndex: number = 1;
  viewAttendancePageSize: number = 10;
  viewAttendanceTotalRecords: number = 1;

  viewAttendancies(data1: GroupMeetAttendance): void {
    this.drawerAttendanciesTitle = "Attendies for " + ((data1.MEETING_SUB.length > 60) ? (data1.MEETING_SUB.substring(0, 60) + "...") : data1.MEETING_SUB);
    this.drawerAttendanciesVisible = true;
    this.meetingTotalCount = 0;
    this.meetingPresentCount = 0
    this.meetingAbsentCount = 0;
    this.isSpinning = true;
    this.viewAttendancePageIndex = 1;

    this.api.getAllgroupMeetingAttendancy(data1.ID).subscribe(data => {
      if (data['code'] == 200) {
        this.isSpinning = false;
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
        this.isSpinning = false;
      }

    }, err => {
      this.isSpinning = false;

      if (err['ok'] == false) {
        this.message.error("Server Not Found", "");
      }
    });
  }

  drawerClose1(): void {
    this.search(true);
    this.drawerVisible1 = false;
  }

  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }

  drawerAttendanciesClose(): void {
    this.drawerAttendanciesVisible = false;
  }

  get closeAttendanciesCallback() {
    return this.drawerAttendanciesClose.bind(this);
  }

  getTimeInAM_PM(time: any): string {
    return this.datePipe.transform(new Date(), "yyyy-MM-dd" + " " + time);
  }

  AttendancyModalVisible: boolean = false;
  photoModalTitle: string = "Meeting Photo(s)";
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
  viewPhotoDrawerTitle: string;
  selectedIndex: number = -1;
  viewPhotoDrawerVisible: boolean = false;

  viewPhotoes(data: GroupMeetAttendance, i: any): void {
    this.selectedIndex = i;
    this.viewPhotoDrawerTitle = (data.MEETING_SUB.length > 60) ? (data.MEETING_SUB.substring(0, 60) + "...") : data.MEETING_SUB;
    this.viewPhotoDrawerVisible = true;
    this.imgWidth1 = 60;
    this.imgWidth2 = 60;
    this.imgWidth3 = 60;
    this.imgWidth4 = 60;
    this.imgWidth5 = 60;
  }

  viewPhotoDrawerClose(): void {
    this.viewPhotoDrawerVisible = false;
    this.selectedIndex = -1;
  }

  get viewPhotoCloseCallback() {
    return this.viewPhotoDrawerClose.bind(this);
  }

  photoModalCancel(): void {
    this.photoModalVisible = false;
  }

  AttendancyModalCancel(): void {
    this.AttendancyModalVisible = false;
  }

  viewPhoto(photoURL: string): void {
    window.open(photoURL);
  }

  viewPDF(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + "groupMeeting/" + pdfURL);
  }

  getwidth(): number {
    if (window.innerWidth <= 400) {
      return 380;

    } else {
      return 800;
    }
  }

  getImageCount(photoURL1: string, photoURL2: string, photoURL3: string, photoURL4: string): number {
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

  getPhotoURL(photoURL: string): string {
    return this.api.retriveimgUrl + "groupMeeting/" + photoURL;
  }

  getWidth(): number {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 800;
  }

  DETAILSModalVisible: boolean = false;
  DETAILSModalTitle: string = "";
  AttendancyModalTitle: string = "";

  viewDETAILS(activity: any): void {
    this.DETAILSModalTitle = "Meeting Agenda";
    this.DETAILSModalVisible = true;
    this.DESCRIPTION1 = activity.AGENDA;
  }

  viewMinutes(activity: any): void {
    this.DETAILSModalTitle = "Meeting Minutes";
    this.DETAILSModalVisible = true;
    this.DESCRIPTION1 = activity.MINUTES;
  }

  DETAILSModalCancel(): void {
    this.DETAILSModalVisible = false;
  }

  getClassName(photoURL1: string, photoURL2: string, photoURL3: string, photoURL4: string): string {
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

    if (index == 0) {
      sessionStorage.setItem("meetingIDFromUpcomingMeeting", "");
    }

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

  onAdvanceFilterVenuesClose(index: number): void {
    this.advanceMultipleVenues.splice(index, 1);
    this.VENUES.splice(index, 1);
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
  advanceMultipleVenues: any[] = [];
  FEDERATION_ID: any[] = [];
  UNIT_ID: any[] = [];
  GROUP_ID: any[] = [];
  MEMBER_ID: any[] = [];
  VENUES: any[] = [];

  advanceFilterModalOk(): void {
    this.advanceFilterModalVisible = false;
    this.advanceMultipleSearchText.splice(0, this.advanceMultipleSearchText.length);
    this.advanceMultipleFederationNames = [];
    this.advanceMultipleUnitNames = [];
    this.advanceMultipleGroupNames = [];
    this.advanceMultipleVenues = [];

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

    if (this.VENUES.length > 0) {
      for (let i = 0; i < this.VENUES.length; i++) {
        this.advanceMultipleVenues.push(this.VENUES[i]);
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
    this.VENUES = [];

    this.advanceMultipleSearchText.splice(0, this.advanceMultipleSearchText.length);
    this.advanceMultipleFederationNames = [];
    this.advanceMultipleUnitNames = [];
    this.advanceMultipleGroupNames = [];
    this.advanceMultipleVenues = [];
    this.advanceFilterModalVisible = false;

    this.search(true);
  }

  getHeigth(): string {
    if ((this.multipleSearchText.length > 0) || (this.advanceMultipleSearchText.length > 0) || (this.advanceMultipleFederationNames.length > 0) || (this.advanceMultipleUnitNames.length > 0) || (this.advanceMultipleGroupNames.length > 0) || (this.advanceMultipleVenues.length > 0)) {
      return '73vh';

    } else {
      return '80vh';
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

  Googlecalender(data: GroupMeetAttendance): void {
    var FROM_TIME = new Date(data.DATE + ' ' + data.FROM_TIME);
    var TO_TIME = new Date(data.DATE + ' ' + data.TO_TIME);
    var Form = this.datePipe.transform(data.DATE, 'yyyyMMdd') + 'T' + this.datePipe.transform(FROM_TIME, 'HHmmss');
    var To = this.datePipe.transform(data.DATE, 'yyyyMMdd') + 'T' + this.datePipe.transform(TO_TIME, 'HHmmss');
    this.GoogleCalender = "https://calendar.google.com/calendar/r/eventedit?text=" + data.MEETING_SUB + "&details=" + data.AGENDA + "&location=" + data.VENUE + "&dates=" + Form + "/" + To + "&ctz=Asia%2FKolkata";
    this.isVisible = true;
  }

  getMeetingDetails(meeting: GroupMeetAttendance): boolean {
    let currentDateTime: Date = new Date(this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    let meetingStartDateTime: Date = new Date(this.datePipe.transform(meeting.DATE, 'yyyy-MM-dd') + 'T' + meeting.FROM_TIME);

    if ((this.homeGroupID == meeting.GROUP_ID) && (meeting.STATUS == "P") && (meetingStartDateTime.getTime() > currentDateTime.getTime()) && (meeting["IS_ATTENDANCE_MARKED"] == 0)) {
      return true;
    }
  }

  getMeetingTag(meeting: GroupMeetAttendance): boolean {
    let currentDateTime: Date = new Date(this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
    let meetingStartDateTime: Date = new Date(this.datePipe.transform(meeting.DATE, 'yyyy-MM-dd') + 'T' + meeting.FROM_TIME);

    if ((meetingStartDateTime.getTime() > currentDateTime.getTime()) && (meeting["IS_ATTENDANCE_MARKED"] == 0)) {
      return true;
    }
  }

  getHeightOfMinutes(index: number): void {
    this.expandMinutes[index] = !this.expandMinutes[index];
  }

  getHeightOfAgenda(index: number): void {
    this.expandAgenda[index] = !this.expandAgenda[index];
  }

  getHeightOfSubject(index: number): void {
    this.expandSubject[index] = !this.expandSubject[index];
  }

  DeleteMeeting(meetingData: GroupMeetAttendance): void {
    this.loadingRecords = true;
    meetingData.IS_DELETED = true;

    this.api.updategroupMeeting(meetingData).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Meeting Deleted Successfully", "");
        this.search(true);

      } else {
        this.message.error("Failed to Meeting Deletion", "");
        this.search(true);
      }
    });
  }

  publishMeeting(meetingData: GroupMeetAttendance): void {
    var Form = this.datePipe.transform(meetingData.DATE, 'yyyyMMdd') + 'T' + this.datePipe.transform(this.datePipe.transform(new Date(), 'yyyyMMdd') + 'T' + meetingData.FROM_TIME, 'HHmmss');
    var To = this.datePipe.transform(meetingData.DATE, 'yyyyMMdd') + 'T' + this.datePipe.transform(this.datePipe.transform(new Date(), 'yyyyMMdd') + 'T' + meetingData.TO_TIME, 'HHmmss');
    this.loadingRecords = true;
    meetingData.STATUS = "P";

    this.api.updategroupMeeting(meetingData).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Meeting Published Successfully", "");

        if (meetingData["IS_ATTENDANCE_MARKED"] == 0) {
          this.GoogleCalender = "https://calendar.google.com/calendar/r/eventedit?text=" + meetingData.MEETING_SUB + "&details=" + meetingData.AGENDA + "&location=" + meetingData.VENUE + "&dates=" + Form + "/" + To + "&ctz=Asia%2FKolkata";
          this.isVisible = true;
        }

        this.search(true);

      } else {
        this.message.error("Failed to Publish Meeting", "");
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

  drawerVisibleInvities: boolean = false;
  drawerTitleInvities: string = '';
  drawerDataInvities: GroupMapInvitees = new GroupMapInvitees();
  @ViewChild(DrawermapinvitiesComponent, { static: false }) DrawermapinvitiesComponentVar: DrawermapinvitiesComponent;

  MapInvities(data: GroupMeetAttendance): void {
    this.drawerTitleInvities = "aaa " + "Invitees for " + ((data.MEETING_SUB.length > 100) ? (data.MEETING_SUB.substring(0, 100) + "...") : data.MEETING_SUB);
    this.drawerVisibleInvities = true;
    this.MEETING_ID = data.ID;
    this.DrawermapinvitiesComponentVar.getIDs();
    this.DrawermapinvitiesComponentVar.UNIT_ID = [];
    this.DrawermapinvitiesComponentVar.GROUP_ID = [];
    this.DrawermapinvitiesComponentVar.ROLE_ID = [];
    this.DrawermapinvitiesComponentVar.getUnits();
    this.DrawermapinvitiesComponentVar.getGroups([]);
    this.DrawermapinvitiesComponentVar.getMembersPost();
    this.DrawermapinvitiesComponentVar.TEMP_MEETING_DATA = null;
    this.DrawermapinvitiesComponentVar.TEMP_MEETING_DATA = Object.assign({}, data);

    // Hosting unit
    this.DrawermapinvitiesComponentVar.UNIT_ID_FOR_HOST_MEETING = [];
    this.DrawermapinvitiesComponentVar.getUnitsForHostMeeting(this.homeUnitID);

    if (data.HOSTING_LEVEL == "U") {
      this.DrawermapinvitiesComponentVar.UNIT_ID_FOR_HOST_MEETING = [this.homeUnitID];
    }

    // Hosting federation
    this.DrawermapinvitiesComponentVar.FEDERATION_ID_FOR_HOST_MEETING = [];
    this.DrawermapinvitiesComponentVar.getFederationForHostMeeting();

    if (data.HOSTING_LEVEL == "F") {
      this.DrawermapinvitiesComponentVar.FEDERATION_ID_FOR_HOST_MEETING = [this.homeFederationID];
    }
  }

  drawerCloseInvities(): void {
    this.search(true);
    this.drawerVisibleInvities = false;
  }

  get closeCallbackInvities() {
    return this.drawerCloseInvities.bind(this);
  }

  getwidthInvities(): number {
    if (window.innerWidth <= 400) {
      return 380;

    } else {
      return 1200;
    }
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

  imgWidth4: number = 60;

  mouseWheelUpFunc4(): void {
    if (this.imgWidth4 > 200) {
      this.imgWidth4 = 200;
    }

    this.imgWidth4 = this.imgWidth4 + 20;
  }

  mouseWheelDownFunc4(): void {
    if (this.imgWidth4 < 60) {
      this.imgWidth4 = 60;
    }

    this.imgWidth4 = this.imgWidth4 - 20;
  }

  imgWidth5: number = 60;

  mouseWheelUpFunc5(): void {
    if (this.imgWidth5 > 200) {
      this.imgWidth5 = 200;
    }

    this.imgWidth5 = this.imgWidth5 + 20;
  }

  mouseWheelDownFunc5(): void {
    if (this.imgWidth5 < 60) {
      this.imgWidth5 = 60;
    }

    this.imgWidth5 = this.imgWidth5 - 20;
  }

  getMeetingType(meetType: string): string {
    if (meetType == "B") {
      return "BOD";
    }

    if (meetType == "G") {
      return "General";
    }

    if (meetType == "O") {
      return "Other";
    }
  }

  groupsForFindingHostedGroupName: any[] = [];

  getGroupsForFindingHostedGroupName(): void {
    this.api.getAllGroups(0, 0, "NAME", "asc", "").subscribe(data => {
      if (data['code'] == 200) {
        this.groupsForFindingHostedGroupName = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getHostedGroupNames(groupIDs: string): string {
    let hostedGroupNamesArray = [];

    if ((groupIDs) && (groupIDs.trim() != "")) {
      let IDs = groupIDs.split(',');

      for (var i = 0; i < IDs.length; i++) {
        this.groupsForFindingHostedGroupName.filter((obj1: GroupMaster) => {
          if (obj1.ID == Number(IDs[i])) {
            hostedGroupNamesArray.push(obj1.NAME);
          }
        });
      }
    }

    return hostedGroupNamesArray.toString();
  }
}
