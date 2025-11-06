import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { GroupProjectMaster } from 'src/app/Models/GroupProjectMaster';
import { EventComment, EventLikes } from 'src/app/Models/comment';
import { GroupActivityMaster } from 'src/app/Models/GroupActivityMaster';
import { BehaviorSubject } from 'rxjs';
import { AddProjectDetailsDrawerComponent } from '../add-project-details-drawer/add-project-details-drawer.component';
import { differenceInCalendarDays, setHours } from 'date-fns';

@Component({
  selector: 'app-projectslist',
  templateUrl: './projectslist.component.html',
  styleUrls: ['./projectslist.component.css']
})

export class ProjectslistComponent implements OnInit {
  formTitle: string = "Projects";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList: any[] = [];
  loadingRecords: boolean = true;
  sortKey: string = "DATE_OF_PROJECT";
  sortValue: string = "desc";
  searchText: string = "";
  filterQuery: string = "";
  columns: string[][] = [["PROJECT_NAME", "PROJECT_NAME"], ["PROJECT_TYPE_NAME", "PROJECT_TYPE_NAME"], ["DESCRIPTION", "DESCRIPTION"], ["AWARDS_RECEIVED", "AWARDS_RECEIVED"], ["FEDERATION_NAME", "FEDERATION_NAME"], ["UNIT_NAME", "UNIT_NAME"], ["GROUP_NAME", "GROUP_NAME"]];
  advanceFilterColumns: string[][] = [["DATE_OF_PROJECT", "DATE_OF_PROJECT"]];
  advanceFilterColumnsFederationNames: string[][] = [["FEDERATION_NAME", "FEDERATION_NAME"]];
  advanceFilterColumnsUnitNames: string[][] = [["UNIT_NAME", "UNIT_NAME"]];
  advanceFilterColumnsGroupNames: string[][] = [["GROUP_NAME", "GROUP_NAME"]];
  advanceFilterColumnsProjectTypeNames: string[][] = [["PROJECT_TYPE_NAME", "PROJECT_TYPE_NAME"]];
  drawerVisible: boolean = false;
  drawerTitle: string;
  drawerData: GroupProjectMaster = new GroupProjectMaster();
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
  expandProjectDescription: boolean[] = [];
  expandProjectBeneficiaryDetails: boolean[] = [];
  RETRIVE_IMAGE_URL: string = this.api.retriveimgUrl;

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

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

  projects: any[] = [];

  getProjectTypes(projectName: string): void {
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

  ngOnInit() {
    this.getFederations();
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

    var advanceLikeQueryProjectTypeNames = "";

    if (this.advanceMultipleProjectTypeNames.length > 0) {
      for (var i = 0; i < this.advanceMultipleProjectTypeNames.length; i++) {
        this.advanceFilterColumnsProjectTypeNames.forEach(column => {
          advanceLikeQueryProjectTypeNames += " " + column[0] + " like '%" + this.advanceMultipleProjectTypeNames[i] + "%' OR";
        });
      }

      advanceLikeQueryProjectTypeNames = " AND (" + advanceLikeQueryProjectTypeNames.substring(0, advanceLikeQueryProjectTypeNames.length - 2) + ')';
    }

    var projectAccessFilter = "";
    projectAccessFilter = " AND ((IS_DELETED=0 AND CREATOR_ID=" + this.userID + ") OR (IS_DELETED=0 AND STATUS='P'))";

    // Global federation filter
    var globalFederationFilter = "";
    if (sessionStorage.getItem("FILTER") === "MF") {
      globalFederationFilter = " AND FEDERATION_ID=" + this.homeFederationID;
    }

    // Filter to show project
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

    this.api.getAllgroupProjectData(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + advanceLikeQuery + advanceLikeQueryFederationNames + advanceLikeQueryUnitNames + advanceLikeQueryGroupNames + advanceLikeQueryProjectTypeNames + projectAccessFilter + globalFederationFilter + filterToShow).subscribe(data => {
      if ((data['code'] == 200)) {
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.expandProjectDescription = new Array(this.totalRecords).fill(false);
        this.expandProjectBeneficiaryDetails = new Array(this.totalRecords).fill(false);

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

  @ViewChild(AddProjectDetailsDrawerComponent, { static: false }) AddProjectDetailsDrawerComponentVar: AddProjectDetailsDrawerComponent;

  add(): void {
    this.drawerTitle = "aaa " + "Add Project";
    this.drawerData = new GroupProjectMaster();
    this.drawerVisible = true;
    this.drawerData.DATE_OF_PROJECT = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.AddProjectDetailsDrawerComponentVar.fileURL1 = null;
    this.AddProjectDetailsDrawerComponentVar.fileURL2 = null;
    this.AddProjectDetailsDrawerComponentVar.fileURL3 = null;
    this.AddProjectDetailsDrawerComponentVar.fileURL4 = null;
    this.AddProjectDetailsDrawerComponentVar.fileURL5 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL1 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL2 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL3 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL4 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL5 = null;
    this.AddProjectDetailsDrawerComponentVar.pdfFileURL1 = null;
    this.AddProjectDetailsDrawerComponentVar.pdfFileURL2 = null;

    // Drawer Type
    this.AddProjectDetailsDrawerComponentVar.addDrawer = false;
  }

  edit(data: GroupProjectMaster): void {
    this.drawerTitle = "aaa " + "Edit Project";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
    this.AddProjectDetailsDrawerComponentVar.fileURL1 = null;
    this.AddProjectDetailsDrawerComponentVar.fileURL2 = null;
    this.AddProjectDetailsDrawerComponentVar.fileURL3 = null;
    this.AddProjectDetailsDrawerComponentVar.fileURL4 = null;
    this.AddProjectDetailsDrawerComponentVar.fileURL5 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL1 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL2 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL3 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL4 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL5 = null;
    this.AddProjectDetailsDrawerComponentVar.pdfFileURL1 = null;
    this.AddProjectDetailsDrawerComponentVar.pdfFileURL2 = null;

    if (this.drawerData.PHOTO1 != " ") {
      this.drawerData.PHOTO1 = this.api.retriveimgUrl + "groupProjectPhotos/" + this.drawerData.PHOTO1;

    } else {
      this.drawerData.PHOTO1 = null;
    }

    if (this.drawerData.PHOTO2 != " ") {
      this.drawerData.PHOTO2 = this.api.retriveimgUrl + "groupProjectPhotos/" + this.drawerData.PHOTO2;

    } else {
      this.drawerData.PHOTO2 = null;
    }

    if (this.drawerData.PHOTO3 != " ") {
      this.drawerData.PHOTO3 = this.api.retriveimgUrl + "groupProjectPhotos/" + this.drawerData.PHOTO3;

    } else {
      this.drawerData.PHOTO3 = null;
    }

    // Drawer Type
    this.AddProjectDetailsDrawerComponentVar.addDrawer = true;

    // Fill Hashtags
    if ((this.drawerData.AWARDS_RECEIVED != null) && (this.drawerData.AWARDS_RECEIVED != '')) {
      this.drawerData.AWARDS_RECEIVED = this.drawerData.AWARDS_RECEIVED.split(',');

    } else {
      this.drawerData.AWARDS_RECEIVED = undefined;
    }
  }

  editInPartially(data: GroupProjectMaster): void {
    this.drawerTitle = "aaa " + "Edit Project";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
    this.AddProjectDetailsDrawerComponentVar.fileURL1 = null;
    this.AddProjectDetailsDrawerComponentVar.fileURL2 = null;
    this.AddProjectDetailsDrawerComponentVar.fileURL3 = null;
    this.AddProjectDetailsDrawerComponentVar.fileURL4 = null;
    this.AddProjectDetailsDrawerComponentVar.fileURL5 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL1 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL2 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL3 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL4 = null;
    this.AddProjectDetailsDrawerComponentVar.originalFileURL5 = null;
    this.AddProjectDetailsDrawerComponentVar.pdfFileURL1 = null;
    this.AddProjectDetailsDrawerComponentVar.pdfFileURL2 = null;

    if (this.drawerData.PHOTO1 != " ") {
      this.drawerData.PHOTO1 = this.api.retriveimgUrl + "groupProjectPhotos/" + this.drawerData.PHOTO1;

    } else {
      this.drawerData.PHOTO1 = null;
    }

    if (this.drawerData.PHOTO2 != " ") {
      this.drawerData.PHOTO2 = this.api.retriveimgUrl + "groupProjectPhotos/" + this.drawerData.PHOTO2;

    } else {
      this.drawerData.PHOTO2 = null;
    }

    if (this.drawerData.PHOTO3 != " ") {
      this.drawerData.PHOTO3 = this.api.retriveimgUrl + "groupProjectPhotos/" + this.drawerData.PHOTO3;

    } else {
      this.drawerData.PHOTO3 = null;
    }

    // Drawer Type
    this.AddProjectDetailsDrawerComponentVar.addDrawer = false;

    // Fill Hashtags
    if ((this.drawerData.AWARDS_RECEIVED != null) && (this.drawerData.AWARDS_RECEIVED != '')) {
      this.drawerData.AWARDS_RECEIVED = this.drawerData.AWARDS_RECEIVED.split(',');
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

  photoModalTitle: string = "Project Photo(s)";
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
  selectedIndex: number = -1;
  drawerVisible2: boolean = false;

  viewPhotoes(data: GroupActivityMaster, i: any): void {
    this.selectedIndex = i;
    this.drawerTitle2 = (data["PROJECT_NAME"].length > 60) ? (data["PROJECT_NAME"].substring(0, 60) + "...") : data["PROJECT_NAME"];
    this.drawerVisible2 = true;
    this.imgWidth1 = 60;
    this.imgWidth2 = 60;
    this.imgWidth3 = 60;
  }

  photoModalCancel(): void {
    this.photoModalVisible = false;
  }

  viewPhoto(photoURL: string): void {
    window.open(photoURL);
  }

  getPhotoURL(photoURL: string): string {
    return this.api.retriveimgUrl + "groupProjectPhotos/" + photoURL;
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
    if (window.innerWidth <= 400)
      return 380;

    else
      return 800;
  }

  viewDETAILS(activity: any): void {
    this.DETAILSModalVisible = true;
    this.DESCRIPTION1 = activity.DESCRIPTION;
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

  drawerClose3(): void {
    this.search(true);
    this.drawerVisible3 = false;
  }

  get closeCallback3() {
    return this.drawerClose3.bind(this);
  }

  drawerVisible4: boolean = false;

  drawerClose4(): void {
    this.drawerVisible4 = false;
  }

  dataa2: EventLikes = new EventLikes();
  dataList2: any[] = [];
  pageIndex2: number = 1
  totalRecords2: number = 5;

  getCompleteStatus(status: string): string {
    if (status == "P") {
      return "Upcoming";

    } else if (status == "S") {
      return "In Progress";

    } else if (status == "H") {
      return "On Hold";

    } else if (status == "C") {
      return "Completed";
    }
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

  onAdvanceFilterProjectTypeTagClose(index: number): void {
    this.advanceMultipleProjectTypeNames.splice(index, 1);
    this.PROJECT_TYPE_ID.splice(index, 1);
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
  advanceMultipleProjectTypeNames: any[] = [];
  FEDERATION_ID: any[] = [];
  UNIT_ID: any[] = [];
  GROUP_ID: any[] = [];
  PROJECT_TYPE_ID: any[] = [];

  advanceFilterModalOk(): void {
    this.advanceFilterModalVisible = false;
    this.advanceMultipleSearchText.splice(0, this.advanceMultipleSearchText.length);
    this.advanceMultipleFederationNames = [];
    this.advanceMultipleUnitNames = [];
    this.advanceMultipleGroupNames = [];
    this.advanceMultipleProjectTypeNames = [];

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

    if (this.PROJECT_TYPE_ID.length > 0) {
      for (let i = 0; i < this.PROJECT_TYPE_ID.length; i++) {
        this.advanceMultipleProjectTypeNames.push(this.PROJECT_TYPE_ID[i]);
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
    this.PROJECT_TYPE_ID = [];

    this.advanceMultipleSearchText.splice(0, this.advanceMultipleSearchText.length);
    this.advanceMultipleFederationNames = [];
    this.advanceMultipleUnitNames = [];
    this.advanceMultipleGroupNames = [];
    this.advanceMultipleProjectTypeNames = [];
    this.advanceFilterModalVisible = false;

    this.search(true);
  }

  getHeigth(): string {
    if ((this.multipleSearchText.length > 0) || (this.advanceMultipleSearchText.length > 0) || (this.advanceMultipleFederationNames.length > 0) || (this.advanceMultipleUnitNames.length > 0) || (this.advanceMultipleGroupNames.length > 0) || (this.advanceMultipleProjectTypeNames.length > 0)) {
      return '73vh';

    } else {
      return '80vh';
    }
  }

  getheightOfProjectDescription(index: number): void {
    this.expandProjectDescription[index] = !this.expandProjectDescription[index];
  }

  getHeightOfProjectBeneficiaryDetails(index: number): void {
    this.expandProjectBeneficiaryDetails[index] = !this.expandProjectBeneficiaryDetails[index];
  }

  DeleteProject(projectData: GroupProjectMaster): void {
    this.loadingRecords = true;
    projectData.IS_DELETED = true;

    this.api.updategroupProjects(projectData).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Project Deleted Successfully", "");
        this.search(true);

      } else {
        this.message.error("Failed to Project Deletion", "");
        this.search(true);
      }
    });
  }

  publishProject(projectData: GroupProjectMaster): void {
    this.loadingRecords = true;
    projectData.STATUS = "P";

    this.api.updategroupProjects(projectData).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Project Published Successfully", "");
        this.search(true);

      } else {
        this.message.error("Failed to Project Publish", "");
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
}
