import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ApiService } from './Service/api.service';
import { CookieService } from 'ngx-cookie-service';
import { NzNotificationService } from 'ng-zorro-antd';
import { ViewNotificationDrawerComponent } from './pages/NotificationModule/view-notification-drawer/view-notification-drawer.component';
import { ChangePasswordDrawerComponent } from './pages/CommonModule/change-password-drawer/change-password-drawer.component';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment.prod';
import { Membermaster } from './Models/MemberMaster';
import { UpdateMemberInfoComponent } from './pages/MemberMaster/update-member-info/update-member-info.component';
import { AssignGroupMemberComponent } from './pages/GroupMaster/assign-group-member/assign-group-member.component';
import { GroupMaster } from './Models/GroupMaster';
import { AssignUnitMemberComponent } from './pages/UnitMaster/assign-unit-member/assign-unit-member.component';
import { UnitMaster } from './Models/UnitMaster';
import { AssignFederationMembersComponent } from './pages/FederationMaster/assign-federation-members/assign-federation-members.component';
import { FederationMaster } from './Models/FederationMaster';
import { GroupMeetAttendance } from './Models/GroupMeetAttendance';
import { GroupActivityMaster } from './Models/GroupActivityMaster';
declare const L: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  menus: any[] = [];
  isCollapsed: boolean = false;
  isLogedIn: boolean = false;
  EMAIL_ID: string = "";
  supportKey: string = "";
  ORGANIZATION_ID: number;
  drawerVisible: boolean = false;
  drawerTitle: string;
  drawerData: any[] = [];
  userId = this.cookie.get('userId');
  USERNAME = this.cookie.get('userName').trim();
  roleId = Number(this.cookie.get('roleId'));
  emailId = this.cookie.get('emailId');
  roleName: string = "";
  mobileNo: string = (this.cookie.get('mobileNo') == "undefined") ? "" : this.cookie.get('mobileNo');
  pageName: string = "";
  pageName2: string = "";
  dataList: any[] = [];
  org: any[] = [];
  shownotify: boolean = false;
  currentApplicationVersion: string = environment.appVersioning.appVersion;
  PASSWORD: any = '';
  NEWPASSWORD: any = '';
  CONFPASSWORD: any = '';
  showconfirm: boolean = false;
  user: Membermaster = new Membermaster();
  isVisible: boolean = false;
  isVisible2: boolean = false;
  loadingMeets: boolean = true;
  federationID: number = Number(this.cookie.get("FEDERATION_ID"));
  unitID: number = Number(this.cookie.get("UNIT_ID"));
  groupID: number = Number(this.cookie.get("GROUP_ID"));
  homeFederationID: number;
  homeUnitID: number;
  homeGroupID: number;
  homefederationName: string = "Giants Welfare Foundation";
  homefederationShortName: string = "Giants Welfare Foundation";
  meetList: any[] = [];
  eventList: any[] = [];
  url: string = "";
  memberData: Membermaster = new Membermaster();
  profileDrawerVisible: boolean = false;
  ProfileDrawerTitle: string = "My Profile";
  COMMUNITY_SELECTION: string = "MF";
  fullPageURL: string;

  constructor(
    private router: Router,
    private api: ApiService,
    private cookie: CookieService,
    private message: NzNotificationService,
    private datePipe: DatePipe) {
    this.loggerInit();

    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        console.log(ev);

        // Upcoming meeting
        if ((ev.url == "/meetings") || (ev.url == "/")) {

        } else {
          sessionStorage.setItem("meetingIDFromUpcomingMeeting", "");
        }

        // Upcoming event
        if ((ev.url == "/events") || (ev.url == "/")) {

        } else {
          sessionStorage.setItem("eventIDFromUpcomingEvent", "");
        }

        let url = window.location.href;
        var arr = url.split("/");
        this.pageName2 = arr[3];

        if (ev.url != "/") {
          this.fullPageURL = this.pageName2;

        } else {
          if (this.roleId == 37) {
            this.fullPageURL = "dashboard";
          }
        }

        if (this.pageName2.split(';').length == 1) {
          this.pageName2 = this.pageName2;

        } else {
          this.pageName2 = this.pageName2.split(';')[0];
        }
      }
    });
  }

  loggerInit() {
    // console.log("before init");

    if ((this.cookie.get('supportKey') === '') || (this.cookie.get('supportKey') === null)) {
      // console.log("after device id");

      this.api.loggerInit().subscribe(data => {
        // console.log("data from api logger init");
        // console.log(data);

        if (data['code'] == "200") {
          this.cookie.set('supportKey', data["data"][0]["supportkey"], 365, "", "", false, "Strict");
          // console.log("after init");
        }

      }, err => {
        // console.log(err);
      });

    } else {
      // console.log("present device id");
      // console.log(this.cookie);
    }
  }

  setUserId(event: any) {
    this.roleId = event;
    sessionStorage.setItem('roleId', this.roleId.toString());
    this.cookie.set('roleId', this.roleId.toString(), 365, "", "", false, "Strict");
    this.router.navigateByUrl('/dashboard');
    this.router.navigate(['dashboard']).then(() => {
      window.location.reload();
    });
  }

  ngOnInit() {
    sessionStorage.setItem('FILTER', "MF");
    sessionStorage.setItem("meetingIDFromUpcomingMeeting", "");
    sessionStorage.setItem("eventIDFromUpcomingEvent", "");
    this.emailId = this.emailId.split(',')[0];
    let urlStr = (this.cookie.get("profile") == "null") ? " " : this.cookie.get("profile");
    this.url = (urlStr.trim() == "") ? "assets/anony.png" : (this.api.retriveimgUrl + "profileImage/" + urlStr);
    let url = window.location.href;
    var arr = url.split("/");
    this.pageName2 = arr[arr.length - 1];
    this.pageName = arr[arr.length - 2];
    let postPageURL = arr[arr.length - 1];
    let postPage = postPageURL.split(';')[0];

    if ((this.cookie.get('token') === '') || (this.cookie.get('token') === null)) {
      this.isLogedIn = false;
      let url = window.location.href;
      var arr = url.split("/");
      let route = arr[3];
      let postRoute = arr[3].split(';');

      if (postRoute.length > 1) {
        route = postRoute[0];
      }

      if (route == "adminlogin") {
        this.pageName2 = 'adminlogin';
        this.router.navigateByUrl('/adminlogin');

      } else if (route == "post-details") {
        let postRoute1 = window.location.href;
        let postDetails1 = postRoute1.split('title');
        let postID = postDetails1[1].substring(1, postDetails1[1].length);
        this.pageName2 = 'post-details';
        this.router.navigate(['/post-details', { title: postID }]);

      } else if (route == "event-details") {
        let eventRoute1 = window.location.href;
        let eventDetails1 = eventRoute1.split('title');
        let eventID = eventDetails1[1].substring(1, eventDetails1[1].length);
        this.pageName2 = 'event-details';
        this.router.navigate(['/event-details', { title: eventID }]);

      } else if (route == "circular-details") {
        let circularRoute1 = window.location.href;
        let circularDetails1 = circularRoute1.split('title');
        let circularID = circularDetails1[1].substring(1, circularDetails1[1].length);
        this.pageName2 = 'circular-details';
        this.router.navigate(['/circular-details', { title: circularID }]);

      } else {
        this.pageName2 = 'login';
        this.router.navigateByUrl('/login');
      }

    } else {
      if (postPage == 'post-details') {
        let postRoute1 = window.location.href;
        let postDetails1 = postRoute1.split('title');
        let postID = postDetails1[1].substring(1, postDetails1[1].length);
        this.pageName2 = 'post-details';
        this.router.navigate(['/post-details', { title: postID }]);

      } else if (postPage == 'event-details') {
        let eventRoute1 = window.location.href;
        let eventDetails1 = eventRoute1.split('title');
        let eventID = eventDetails1[1].substring(1, eventDetails1[1].length);
        this.pageName2 = 'event-details';
        this.router.navigate(['/event-details', { title: eventID }]);

      } else if (postPage == 'circular-details') {
        let circularRoute1 = window.location.href;
        let circularDetails1 = circularRoute1.split('title');
        let circularID = circularDetails1[1].substring(1, circularDetails1[1].length);
        this.pageName2 = 'circular-details';
        this.router.navigate(['/circular-details', { title: circularID }]);

      } else {
        this.isLogedIn = true;

        this.api
          .getAllEmpRoleMap(0, 0, 'ROLE_ID', 'desc', ' AND STATUS = 1 AND EMPLOYEE_ID = ' + this.userId)
          .subscribe(data => {
            if (data['code'] == 200) {
              this.dataList = data['data'];
              console.log(this.dataList);

              // Find member role
              let tempFederationAdminRole: any;

              if (this.dataList.length == 2) {
                tempFederationAdminRole = this.dataList.filter(item => {
                  return (item["ROLE_ID"] != 37);
                });

              } else {
                tempFederationAdminRole = this.dataList;
              }

              this.roleId = tempFederationAdminRole[0]["ROLE_ID"];
              this.roleName = tempFederationAdminRole[0]["ROLE_NAME"];
              this.api.roleId = this.roleId;

              // Set Values for Session
              sessionStorage.setItem('FEDERATION_ID', ((tempFederationAdminRole[0]["FEDERATION_ID"]) ? (tempFederationAdminRole[0]["FEDERATION_ID"]) : 0));
              sessionStorage.setItem('UNIT_ID', (tempFederationAdminRole[0]["UNIT_ID"] ? (tempFederationAdminRole[0]["UNIT_ID"]) : 0));
              sessionStorage.setItem('GROUP_ID', (tempFederationAdminRole[0]["GROUP_ID"] ? (tempFederationAdminRole[0]["GROUP_ID"]) : 0));

              if (sessionStorage.getItem('roleId') != "1") {
                sessionStorage.setItem('roleId', String(this.roleId));
              }

              // Set values for cookie
              this.cookie.set('FEDERATION_ID', ((tempFederationAdminRole[0]["FEDERATION_ID"]) ? (tempFederationAdminRole[0]["FEDERATION_ID"]) : 0), 365, "", "", false, "Strict");
              this.cookie.set('UNIT_ID', (tempFederationAdminRole[0]["UNIT_ID"] ? (tempFederationAdminRole[0]["UNIT_ID"]) : 0), 365, "", "", false, "Strict");
              this.cookie.set('GROUP_ID', (tempFederationAdminRole[0]["GROUP_ID"] ? (tempFederationAdminRole[0]["GROUP_ID"]) : 0), 365, "", "", false, "Strict");

              if (this.cookie.get('roleId') != "1") {
                this.cookie.set('roleId', String(this.roleId), 365, "", "", false, "Strict");
                this.cookie.set('roleName', this.roleName, 365, "", "", false, "Strict");
              }

              if (this.pageName == "report") {
                this.isLogedIn = true;

              } else {
                this.getHomeFederationHomeUnitHomeGroup();
              }
            }

          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
      }
    }

    this.api.requestPermission(this.userId);
    this.api.receiveMessage();
  }

  getHomeFederationHomeUnitHomeGroup(): void {
    this.api
      .getAllMembers(0, 0, "", "", " AND ID = " + this.userId)
      .subscribe(data => {
        if (data['code'] == 200) {
          let memberData = data['data'][0];
          this.homefederationName = (memberData["FEDERATION_NAME"]) ? (memberData["FEDERATION_NAME"]) : "Giants Welfare Foundation";
          this.homefederationShortName = (memberData["FEDERATION_SHORT_NAME"]) ? ("Giants Welfare Foundation " + memberData["FEDERATION_SHORT_NAME"]) : "Giants Welfare Foundation";

          sessionStorage.setItem('HOME_FEDERATION_ID', memberData["FEDERATION_ID"] ? (memberData["FEDERATION_ID"]) : 0);
          sessionStorage.setItem('HOME_UNIT_ID', memberData["UNIT_ID"] ? (memberData["UNIT_ID"]) : 0);
          sessionStorage.setItem('HOME_GROUP_ID', memberData["GROUP_ID"] ? (memberData["GROUP_ID"]) : 0);

          sessionStorage.setItem('HOME_FEDERATION_NAME', memberData["FEDERATION_NAME"] ? (memberData["FEDERATION_NAME"]) : "");
          sessionStorage.setItem('HOME_UNIT_NAME', memberData["UNIT_NAME"] ? (memberData["UNIT_NAME"]) : "");
          sessionStorage.setItem('HOME_GROUP_NAME', memberData["GROUP_NAME"] ? (memberData["GROUP_NAME"]) : "");

          this.cookie.set('HOME_FEDERATION_ID', (memberData["FEDERATION_ID"]) ? (memberData["FEDERATION_ID"]) : 0, 365, "", "", false, "Strict");
          this.cookie.set('HOME_UNIT_ID', (memberData["UNIT_ID"]) ? (memberData["UNIT_ID"]) : 0, 365, "", "", false, "Strict");
          this.cookie.set('HOME_GROUP_ID', (memberData["GROUP_ID"]) ? (memberData["GROUP_ID"]) : 0, 365, "", "", false, "Strict");

          this.cookie.set('HOME_FEDERATION_NAME', (memberData["FEDERATION_NAME"]) ? (memberData["FEDERATION_NAME"]) : "", 365, "", "", false, "Strict");
          this.cookie.set('HOME_UNIT_NAME', (memberData["UNIT_NAME"]) ? (memberData["UNIT_NAME"]) : "", 365, "", "", false, "Strict");
          this.cookie.set('HOME_GROUP_NAME', (memberData["GROUP_NAME"]) ? (memberData["GROUP_NAME"]) : "", 365, "", "", false, "Strict");

          this.homeFederationID = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
          this.homeUnitID = Number(sessionStorage.getItem("HOME_UNIT_ID"));
          this.homeGroupID = Number(sessionStorage.getItem("HOME_GROUP_ID"));

          this.getDashboard();
          this.getCommunityCount("MF");
          this.getUpcomingMeetings();
          this.getAllUnitsForFilter();
          this.getAllGroupsForFilter();
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  getDashboard(): void {
    this.federationID = Number(sessionStorage.getItem("FEDERATION_ID"));
    this.unitID = Number(sessionStorage.getItem("UNIT_ID"));
    this.groupID = Number(sessionStorage.getItem("GROUP_ID"));
    this.roleId = Number(this.cookie.get("roleId"));

    if (this.roleId == 1) {
      this.router.navigateByUrl('/members');

      sessionStorage.setItem('FEDERATION_ID', "0");
      sessionStorage.setItem('UNIT_ID', "0");
      sessionStorage.setItem('GROUP_ID', "0");

      sessionStorage.setItem('HOME_FEDERATION_ID', "0");
      sessionStorage.setItem('HOME_UNIT_ID', "0");
      sessionStorage.setItem('HOME_GROUP_ID', "0");

      sessionStorage.setItem('HOME_FEDERATION_NAME', "");
      sessionStorage.setItem('HOME_UNIT_NAME', "");
      sessionStorage.setItem('HOME_GROUP_NAME', "");

      this.cookie.set('FEDERATION_ID', "0", 365, "", "", false, "Strict");
      this.cookie.set('UNIT_ID', "0", 365, "", "", false, "Strict");
      this.cookie.set('GROUP_ID', "0", 365, "", "", false, "Strict");

      this.cookie.set('HOME_FEDERATION_ID', "0", 365, "", "", false, "Strict");
      this.cookie.set('HOME_UNIT_ID', "0", 365, "", "", false, "Strict");
      this.cookie.set('HOME_GROUP_ID', "0", 365, "", "", false, "Strict");

      this.cookie.set('HOME_FEDERATION_NAME', "", 365, "", "", false, "Strict");
      this.cookie.set('HOME_UNIT_NAME', "", 365, "", "", false, "Strict");
      this.cookie.set('HOME_GROUP_NAME', "", 365, "", "", false, "Strict");

    } else {
      if (this.pageName != "report") {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/dashboard']);
        });

      } else {
        this.router.navigateByUrl(this.pageName2);
      }
    }
  }

  TOTAL_FEDERATION: number = 0;
  TOTAL_UNITS: number = 0;
  TOTAL_GROUPS: number = 0;
  TOTAL_MEMBERS: number = 0;
  TOTAL_POSTS: number = 0;
  TOTAL_MEETINGS: number = 0;
  TOTAL_EVENTS: number = 0;
  TOTAL_CIRCULARS: number = 0;
  TOTAL_PROJECTS: number = 0;
  COLLECTED_FEE: number = 0;
  loadingCommunity: boolean = true;

  getCommunityCount(type: string): void {
    this.TOTAL_FEDERATION = 0;
    this.TOTAL_UNITS = 0;
    this.TOTAL_GROUPS = 0;
    this.TOTAL_MEMBERS = 0;
    this.TOTAL_POSTS = 0;
    this.TOTAL_MEETINGS = 0;
    this.TOTAL_EVENTS = 0;
    this.TOTAL_CIRCULARS = 0;
    this.TOTAL_PROJECTS = 0;
    this.COLLECTED_FEE = 0;
    let federationfilter = 0;

    if ((this.roleId == 1) || (this.roleId == 59) || (this.roleId == 60) || (this.roleId == 61)) {
      federationfilter = 0;
      sessionStorage.setItem('FILTER', "GWF");
      this.COMMUNITY_SELECTION = "GWF";

    } else {
      if (type == "MF") {
        federationfilter = this.homeFederationID;
        sessionStorage.setItem('FILTER', "MF");

      } else {
        federationfilter = 0;
        sessionStorage.setItem('FILTER', "GWF");
      }
    }

    this.loadingCommunity = true;

    this.api
      .getCommunityData(0, 0, "", "", "", federationfilter)
      .subscribe(data => {
        if (data['code'] == 200) {
          this.loadingCommunity = false;
          this.TOTAL_FEDERATION = data["data"][0]["FEDERATION_COUNT"];
          this.TOTAL_UNITS = data["data"][0]["UNIT_COUNT"];
          this.TOTAL_GROUPS = data["data"][0]["GROUP_COUNT"];
          this.TOTAL_MEMBERS = data["data"][0]["MEMBER_COUNT"];
          this.TOTAL_POSTS = data["data"][0]["POST_COUNT"];
          this.TOTAL_MEETINGS = data["data"][0]["MEETING_COUNT"];
          this.TOTAL_EVENTS = data["data"][0]["EVENT_COUNT"];
          this.TOTAL_CIRCULARS = data["data"][0]["CIRCULAR_COUNT"];
          this.TOTAL_PROJECTS = data["data"][0]["PROJECT_COUNT"];
          this.COLLECTED_FEE = data["data"][0]["COLLECTED_FEE"];

        } else {
          this.loadingCommunity = false;
          this.TOTAL_FEDERATION = 0;
          this.TOTAL_UNITS = 0;
          this.TOTAL_GROUPS = 0;
          this.TOTAL_MEMBERS = 0;
          this.TOTAL_POSTS = 0;
          this.TOTAL_MEETINGS = 0;
          this.TOTAL_EVENTS = 0;
          this.TOTAL_CIRCULARS = 0;
          this.TOTAL_PROJECTS = 0;
          this.COLLECTED_FEE = 0;
        }

      }, err => {
        this.loadingCommunity = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  getUpcomingMeetings(): void {
    let userID: number = this.api.userId;
    this.meetList = [];
    this.eventList = [];
    this.loadingMeets = true;

    this.api
      .getUpcoming5Meetings(userID)
      .subscribe(data => {
        if (data['code'] == 200) {
          this.loadingMeets = false;
          this.meetList = data['meetingData'];
          this.eventList = data['eventData'];

        } else {
          this.loadingMeets = false;
          this.meetList = [];
          this.eventList = [];
        }

      }, err => {
        this.loadingMeets = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  sortFunction(a, b) {
    var dateA = a.SEQ_NO;
    var dateB = b.SEQ_NO;

    return (dateA > dateB) ? 1 : -1;
  };

  getData(form: any) {
    this.cookie.set('roleId', form.ROLE_ID);
  }

  isSpinning: boolean = false;

  logout(): void {
    this.isSpinning = true;

    this.api.logout().subscribe(forms => {
      if (this.roleId != 1) {
        this.api.unsubscribeTokenToTopic(this.api.cloudID);
      }

      setTimeout(() => {
        window.location.reload();
      }, 1000);

      this.cookie.deleteAll();
      sessionStorage.clear();

    }, err => {
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      this.cookie.deleteAll();
      sessionStorage.clear();

      this.isSpinning = false;
      this.message.error("Failed to Logout", JSON.stringify(err));
    });
  }

  @ViewChild(ViewNotificationDrawerComponent, { static: false }) ViewNotificationDrawerComponentVar: ViewNotificationDrawerComponent;

  add(): void {
    this.drawerTitle = "aaa " + "Notifications";
    this.drawerVisible = true;
    this.ViewNotificationDrawerComponentVar.notificationData = [];
    this.ViewNotificationDrawerComponentVar.pageIndex = 1;
    this.ViewNotificationDrawerComponentVar.pageSize = 10;
    this.ViewNotificationDrawerComponentVar.notificationDataLoad = true;
    this.ViewNotificationDrawerComponentVar.getNotifications(true);
  }

  drawerClose(): void {
    this.drawerVisible = false;
    this.ViewNotificationDrawerComponentVar.notificationDataLoad = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  changePasswordDrawerVisible: boolean = false;
  changePasswordDrawerTitle: string;
  @ViewChild(ChangePasswordDrawerComponent, { static: false }) ChangePasswordDrawerComponentVar: ChangePasswordDrawerComponent;

  showChangePasswordDrawer(): void {
    this.changePasswordDrawerTitle = "Reset Password";
    this.changePasswordDrawerVisible = true;
    this.ChangePasswordDrawerComponentVar.getInfo();
  }

  changePasswordDrawerClose(): void {
    this.changePasswordDrawerVisible = false;
  }

  get changePasswordDrawerCloseCallback() {
    return this.changePasswordDrawerClose.bind(this);
  }

  numberWithDecimal(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }

  ProfileDrawerClose(): void {
    this.profileDrawerVisible = false;
  }

  get ProfileDrawerCloseCallback() {
    return this.ProfileDrawerClose.bind(this);
  }

  @ViewChild(UpdateMemberInfoComponent, { static: false }) UpdateMemberInfoComponentVar: UpdateMemberInfoComponent;

  UserProfile(): void {
    this.ProfileDrawerTitle = "aaa " + "My Profile";
    var tempMemberData = new Membermaster();
    this.profileDrawerVisible = true;
    this.UpdateMemberInfoComponentVar.isSpinning = true;

    this.api.getAllMembers(0, 0, "NAME", "asc", " AND ID=" + this.userId).subscribe(data => {
      if ((data['code'] == 200)) {
        this.UpdateMemberInfoComponentVar.isSpinning = false;
        tempMemberData = data['data'][0];

        if (this.datePipe.transform(tempMemberData.DOB, "yyyyMMdd") == "19000101") {
          tempMemberData.DOB = undefined;
        }

        if (this.datePipe.transform(tempMemberData.ANNIVERSARY_DATE, "yyyyMMdd") == "19000101") {
          tempMemberData.ANNIVERSARY_DATE = undefined;
        }

        this.UpdateMemberInfoComponentVar.fileURL1 = null;

        // Profile picture
        if ((tempMemberData.PROFILE_IMAGE != " ") && (tempMemberData.PROFILE_IMAGE != null)) {
          tempMemberData.PROFILE_IMAGE = this.api.retriveimgUrl + "profileImage/" + tempMemberData.PROFILE_IMAGE;

        } else {
          tempMemberData.PROFILE_IMAGE = null;
        }

        // Signature
        if ((tempMemberData.SIGNATURE != " ") && (tempMemberData.SIGNATURE != null)) {
          tempMemberData.SIGNATURE = this.api.retriveimgUrl + "memberSignature/" + tempMemberData.SIGNATURE;

        } else {
          tempMemberData.SIGNATURE = null;
        }

        // Fill Communication Emails
        if ((tempMemberData.EMAIL_ID != null) && (tempMemberData.EMAIL_ID.trim() != ''))
          tempMemberData.EMAIL_ID = tempMemberData.EMAIL_ID.split(',');

        else
          tempMemberData.EMAIL_ID = undefined;


        // Fill Bussiness Emails
        if ((tempMemberData.BUSSINESS_EMAIL != null) && (tempMemberData.BUSSINESS_EMAIL.trim() != ''))
          tempMemberData.BUSSINESS_EMAIL = tempMemberData.BUSSINESS_EMAIL.split(',');

        else
          tempMemberData.BUSSINESS_EMAIL = undefined;

        // Fill Communication Mobile No(s).
        if ((tempMemberData.COMMUNICATION_MOBILE_NUMBER != null) && (tempMemberData.COMMUNICATION_MOBILE_NUMBER.trim() != ''))
          tempMemberData.COMMUNICATION_MOBILE_NUMBER = tempMemberData.COMMUNICATION_MOBILE_NUMBER.split(',');

        else
          tempMemberData.COMMUNICATION_MOBILE_NUMBER = undefined;

        this.memberData = tempMemberData;

      } else {
        this.UpdateMemberInfoComponentVar.isSpinning = false;
      }

    }, err => {
      this.UpdateMemberInfoComponentVar.isSpinning = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  goToFederationtMaster() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/federations']);
    });
  }

  goToUnitMaster() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/units']);
    });
  }

  goToGroupMaster() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/groups']);
    });
  }

  goToMemberMaster() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/members']);
    });
  }

  goToPostPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/posts']);
    });
  }

  goToMeetingPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/meetings']);
    });
  }

  goToEventPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/events']);
    });
  }

  goToCircularPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/circular']);
    });
  }

  goToProjectPage() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/project']);
    });
  }

  goToPaymentPage() {
    if (this.groupID > 0) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/allpaymentreceipts', { group: this.groupID }]);
      });

    } else if (this.unitID > 0) {
      let homeGroupID: number = Number(this.cookie.get("HOME_GROUP_ID"));

      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/allpaymentreceipts', { group: homeGroupID }]);
      });

    } else {
      if ((this.federationID == 0) && (this.unitID == 0) && (this.groupID == 0) && (this.roleId == 37)) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/allpaymentreceipts', { group: this.homeGroupID }]);
        });

      } else {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/allpaymentreceipts']);
        });
      }
    }
  }

  getTimeInAM_PM(time: any) {
    return this.datePipe.transform(new Date(), "yyyy-MM-dd" + " " + time);
  }

  changepass(): void {
    this.NEWPASSWORD = '';
    this.CONFPASSWORD = '';
    this.PASSWORD = '';
    this.isVisible = true;
    this.showconfirm = false;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.NEWPASSWORD = '';
    this.CONFPASSWORD = '';
    this.PASSWORD = '';
  }

  checkPasswordLoading: boolean = false;

  checkpass(): void {
    let isOK = true;

    if (this.PASSWORD) {
      if (this.PASSWORD.trim() == "") {
        isOK = false;
        this.message.error('Please Enter Correct Password', '');
      }

    } else {
      isOK = false;
      this.message.error('Please Enter Correct Password', '');
    }

    if (isOK) {
      this.checkPasswordLoading = true;

      this.api
        .getAllMembers(0, 0, '', '', ' AND ID = ' + Number(this.cookie.get('userId')))
        .subscribe(data => {
          if (data["code"] == 200) {
            this.checkPasswordLoading = false;
            this.user = data['data'][0];

            if (this.PASSWORD == this.user.PASSWORD) {
              this.showconfirm = true;

            } else {
              this.showconfirm = false;
              this.message.error('Please Enter Correct Password', '');
            }
          }

        }, err => {
          this.checkPasswordLoading = false;
          console.log(err);
        });
    }
  }

  passwordVisible: boolean = false;
  newPasswordVisible: boolean = false;
  reEnterNewPasswordVisible: boolean = false;
  resetPasswordLoading: boolean = false;

  confpass(): void {
    let isOk = true;
    this.NEWPASSWORD = (this.NEWPASSWORD == undefined) ? "" : this.NEWPASSWORD;

    if ((this.NEWPASSWORD.trim() != "")) {
      if ((this.NEWPASSWORD != undefined) && (this.NEWPASSWORD != null)) {
        if (this.NEWPASSWORD.length >= 8) {
          if ((/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=[^@#]*[@#]).{8,15}$/.test(this.NEWPASSWORD))) {
            if (this.NEWPASSWORD != this.CONFPASSWORD) {
              isOk = false;
              this.message.error("New password and Re-entered password not matches", "");
            }

          } else {
            isOk = false;
            this.message.error('Password must contains at least one uppercase letter, one lowercase letter, one number and one special character (@ or #)', '');
          }

        } else {
          isOk = false;
          this.message.error("Password must be greater than or equal to 8 characters", "");
        }

      } else {
        isOk = false;
        this.message.error("Please Enter New Password", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter New Password", "");
    }

    if (isOk) {
      this.user['MEMBER_ID'] = this.userId;
      this.user['PASSWORD'] = this.PASSWORD;
      this.user['OLD_PASSWORD'] = this.PASSWORD;
      this.user['NEW_PASSWORD'] = this.NEWPASSWORD;
      this.resetPasswordLoading = true;

      this.api
        .userchangepassord(this.user)
        .subscribe((successCode) => {
          if (successCode['code'] == '200') {
            this.resetPasswordLoading = false;
            this.message.success('Password Reset Successfully', '');
            this.isVisible = false;
            this.showconfirm = false;
            this.NEWPASSWORD = undefined;
            this.CONFPASSWORD = undefined;
            this.PASSWORD = undefined;

          } else {
            this.resetPasswordLoading = false;
            this.message.error('Failed to Reset Password', '');
          }
        });
    }
  }

  getWidth(): number {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 550;
  }

  goToPayments() {
    this.router.navigate(['/allpaymentreceipts', { group: this.groupID }]);
  }

  goToPaymentsApproval() {
    this.router.navigate(['/payment-approval']);
  }

  onCommunitySelectionChange(type: string) {
    this.getCommunityCount(type);

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl('/' + this.fullPageURL);
    });
  }

  videoManualDrawerVisible: boolean = false;
  videoManualDrawerTitle: string;

  videoManualDrawerOpen(): void {
    this.videoManualDrawerTitle = "aaa " + "Video Manual";
    this.videoManualDrawerVisible = true;
  }

  videoManualDrawerClose(): void {
    this.videoManualDrawerVisible = false;
  }

  get videoManualCloseCallback() {
    return this.videoManualDrawerClose.bind(this);
  }

  getVideoManualDrawerWidth() {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 600;
  }

  manageGroupBODDrawerTitle: string;
  manageGroupBODDrawerData: any;
  manageGroupBODDrawerVisible: boolean = false;
  @ViewChild(AssignGroupMemberComponent, { static: false }) AssignGroupMemberComponentVar: AssignGroupMemberComponent;

  openManageGroupBOD(): void {
    this.manageGroupBODDrawerTitle = "aaa " + "Manage Group BOD";
    this.manageGroupBODDrawerVisible = true;

    this.api
      .getAllGroupsTilesDetails(0, 0, "", "", " AND GROUP_ID = " + this.groupID)
      .subscribe(data => {
        if (data['code'] == 200) {
          let groupData: GroupMaster = data["data"][0];
          this.manageGroupBODDrawerTitle = this.manageGroupBODDrawerTitle + " of " + groupData["GROUP_NAME"];
          this.manageGroupBODDrawerData = Object.assign({}, groupData);
          this.AssignGroupMemberComponentVar.tempOpenedGroupID = groupData["GROUP_ID"];
          this.AssignGroupMemberComponentVar.getIDs();
          this.AssignGroupMemberComponentVar.getData1(groupData);
          this.AssignGroupMemberComponentVar.gettingGroupBODStatus(groupData["GROUP_ID"]);
          this.AssignGroupMemberComponentVar.sendForApprovalDrawerInitialization();
          this.AssignGroupMemberComponentVar.getInchargeAreas();
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  manageGroupBODDrawerClose(): void {
    this.manageGroupBODDrawerVisible = false;
  }

  get manageGroupBODDrawerCloseCallback() {
    return this.manageGroupBODDrawerClose.bind(this);
  }

  getManageBODDrawerWidth() {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 1100;
  }

  manageUnitBODDrawerTitle: string;
  manageUnitBODDrawerData: any;
  manageUnitBODDrawerVisible: boolean = false;
  @ViewChild(AssignUnitMemberComponent, { static: false }) AssignUnitMemberComponentVar: AssignUnitMemberComponent;

  openManageUnitBOD(): void {
    this.manageUnitBODDrawerTitle = "aaa " + "Manage Unit BOD";
    this.manageUnitBODDrawerVisible = true;

    this.api
      .getAllUnitsTilesDetails(0, 0, "", "", " AND UNIT_ID = " + this.unitID)
      .subscribe(data => {
        if (data['code'] == 200) {
          let unitData: UnitMaster = data["data"][0];
          this.manageUnitBODDrawerTitle = this.manageUnitBODDrawerTitle + " of " + unitData["UNIT_NAME"];
          this.manageUnitBODDrawerData = Object.assign({}, unitData);
          this.AssignUnitMemberComponentVar.tempOpenedUnitID = unitData["UNIT_ID"];
          this.AssignUnitMemberComponentVar.getIDs();
          this.AssignUnitMemberComponentVar.getData1(unitData);
          this.AssignUnitMemberComponentVar.gettingUnitBODStatus(unitData["UNIT_ID"]);
          this.AssignUnitMemberComponentVar.sendForApprovalDrawerInitialization();
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  manageUnitBODDrawerClose(): void {
    this.manageUnitBODDrawerVisible = false;
  }

  get manageUnitBODDrawerCloseCallback() {
    return this.manageUnitBODDrawerClose.bind(this);
  }

  manageFederationBODDrawerTitle: string;
  manageFederationBODDrawerData: any;
  manageFederationBODDrawerVisible: boolean = false;
  @ViewChild(AssignFederationMembersComponent, { static: false }) AssignFederationMembersComponentVar: AssignFederationMembersComponent;

  openManageFederationBOD(): void {
    this.manageFederationBODDrawerTitle = "aaa " + "Manage Council List";
    this.manageFederationBODDrawerVisible = true;

    this.api
      .getFederationsTilesDetails(0, 0, "", "", " AND FEDERATION_ID = " + this.federationID)
      .subscribe(data => {
        if (data['code'] == 200) {
          let federationData: FederationMaster = data["data"][0];
          this.manageFederationBODDrawerTitle = this.manageFederationBODDrawerTitle + " of " + federationData["NAME"];
          this.manageFederationBODDrawerData = Object.assign({}, federationData);
          this.AssignFederationMembersComponentVar.tempOpenedFederationID = federationData["FEDERATION_ID"];
          this.AssignFederationMembersComponentVar.getIDs();
          this.AssignUnitMemberComponentVar.getIDs();
          this.AssignFederationMembersComponentVar.getData1(federationData);
          this.AssignFederationMembersComponentVar.gettingFederationBODStatus(federationData["FEDERATION_ID"]);
          this.AssignFederationMembersComponentVar.sendForApprovalDrawerInitialization();
          this.AssignFederationMembersComponentVar.getInchargeAreas();
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  manageFederationBODDrawerClose(): void {
    this.manageFederationBODDrawerVisible = false;
  }

  get manageFederationBODDrawerCloseCallback() {
    return this.manageFederationBODDrawerClose.bind(this);
  }

  unitsForFilter: any[] = [];

  getAllUnitsForFilter(): void {
    this.api
      .getAllUnits(0, 0, "NAME", "asc", " AND STATUS = 1 AND FEDERATION_ID = " + this.homeFederationID)
      .subscribe(data => {
        if (data['code'] == 200) {
          this.unitsForFilter = data['data'];
          this.gettingUnitIDsUnderMyFederation(this.federationID);
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  groupsForFilter: any[] = [];

  getAllGroupsForFilter(): void {
    this.api
      .getAllGroups(0, 0, "NAME", "asc", " AND STATUS = 1 AND FEDERATION_ID = " + this.homeFederationID)
      .subscribe(data => {
        if (data['code'] == 200) {
          this.groupsForFilter = data['data'];
          this.gettingGroupIDsUnderMyFederation(this.federationID);
          this.gettingGroupIDsUnderMyUnit(this.unitID);
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  unitIDs: string;

  gettingUnitIDsUnderMyFederation(federationID: number): void {
    this.unitIDs = "";

    let tempArray = this.unitsForFilter.filter((obj1: UnitMaster) => {
      return obj1.FEDERATION_ID == federationID;
    });

    let tempIDArray = [];

    for (let i = 0; i < tempArray.length; i++) {
      tempIDArray.push(tempArray[i]["ID"]);
    }

    this.unitIDs = tempIDArray.toString();
    sessionStorage.setItem("unitIDsUnderMyFederation", this.unitIDs);
  }

  fedrationWiseGroupIDs: string;

  gettingGroupIDsUnderMyFederation(federationID: number): void {
    this.fedrationWiseGroupIDs = "";

    let tempArray = this.groupsForFilter.filter((obj1: GroupMaster) => {
      return obj1["FEDERATION_ID"] == federationID;
    });

    let tempIDArray = [];

    for (let i = 0; i < tempArray.length; i++) {
      tempIDArray.push(tempArray[i]["ID"]);
    }

    this.fedrationWiseGroupIDs = tempIDArray.toString();
    sessionStorage.setItem("groupIDsUnderMyFederation", this.fedrationWiseGroupIDs);
  }

  unitWiseGroupIDs: string;

  gettingGroupIDsUnderMyUnit(unitID: number): void {
    this.unitWiseGroupIDs = "";

    let tempArray = this.groupsForFilter.filter((obj1: GroupMaster) => {
      return obj1["UNIT_ID"] == unitID;
    });

    let tempIDArray = [];

    for (let i = 0; i < tempArray.length; i++) {
      tempIDArray.push(tempArray[i]["ID"]);
    }

    this.unitWiseGroupIDs = tempIDArray.toString();
    sessionStorage.setItem("groupIDsUnderMyUnit", this.unitWiseGroupIDs);
  }

  getMeetingDetails(data: GroupMeetAttendance): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/meetings']);
    });

    sessionStorage.setItem("meetingIDFromUpcomingMeeting", data["MEETING_NUMBER"] ? data["MEETING_NUMBER"] : "");
  }

  getEventDetails(data: GroupActivityMaster): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/events']);
    });

    sessionStorage.setItem("eventIDFromUpcomingEvent", data["EVENT_NO"] ? data["EVENT_NO"] : "");
  }

  getNotificationDrawerWidth(): number {
    if (window.innerWidth <= 400) {
      return 380;

    } else {
      return 500;
    }
  }
}
