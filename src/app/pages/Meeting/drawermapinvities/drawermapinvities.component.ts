import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { NgForm } from '@angular/forms';
import { Membermaster } from 'src/app/Models/MemberMaster';
import { GroupMeetAttendance } from 'src/app/Models/GroupMeetAttendance';

@Component({
  selector: 'app-drawermapinvities',
  templateUrl: './drawermapinvities.component.html',
  styleUrls: ['./drawermapinvities.component.css']
})

export class DrawermapinvitiesComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() drawerVisible: boolean = false;
  @Input() MEETING_ID: any;
  formTitle: string = "Invitees Mapping";
  isSpinning: boolean = false;
  loadingRecords: boolean = false;
  isOk: boolean = true;
  pageIndex: number = 1;
  pageSize: number = 10;
  sortKey: string = "id";
  sortValue: string = "desc";
  searchText: string = "";
  SEARCH_NAME: any;

  federationID: number;
  unitID: number;
  groupID: number;
  roleID: number = this.api.roleId;

  homeFederationID: number;
  homeUnitID: number;
  homeGroupID: number;

  UNIT_ID: any[] = [];
  GROUP_ID: any[] = [];
  ROLE_ID: any[] = [];

  UNIT_ID_FOR_HOST_MEETING: any[] = [];
  FEDERATION_ID_FOR_HOST_MEETING: any[] = [];

  constructor(private api: ApiService, private router: Router, private datePipe: DatePipe, private message: NzNotificationService, private _cookie: CookieService) { }

  ngOnInit() {
    this.getIDs();
  }

  getIDs(): void {
    this.federationID = Number(sessionStorage.getItem("FEDERATION_ID"));
    this.unitID = Number(sessionStorage.getItem("UNIT_ID"));
    this.groupID = Number(sessionStorage.getItem("GROUP_ID"));
    this.roleID = this.api.roleId;

    this.homeFederationID = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
    this.homeUnitID = Number(sessionStorage.getItem("HOME_UNIT_ID"));
    this.homeGroupID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
  }

  close(myForm: NgForm): void {
    this.CHECK_PA = [];
    this.memberData = [];
    this.newArray = [];
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  units: any[] = [];
  unitLoading: boolean = false;

  getUnits(): void {
    this.unitLoading = true;

    var federationFilter = "";
    if (this.federationID != 0) {
      federationFilter = " AND FEDERATION_ID=" + this.homeFederationID;
    }

    var unitFilter = "";
    if (this.unitID != 0) {
      unitFilter = " AND ID=" + this.unitID;
    }

    var groupFilter = "";
    if (this.groupID != 0) {
      groupFilter = " AND ID=(SELECT UNIT_ID FROM group_master WHERE ID=" + this.groupID + ")";
    }

    this.units = [];

    this.api.getAllUnits(0, 0, "ID", "asc", " AND STATUS=1" + federationFilter + unitFilter + groupFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.unitLoading = false;
        this.units = data['data'];
      }

    }, err => {
      this.unitLoading = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  unitsForHostMeeting: any[] = [];
  unitLoadingForHostMeeting: boolean = false;

  getUnitsForHostMeeting(homeUnitID: number): void {
    this.unitLoadingForHostMeeting = true;
    this.unitsForHostMeeting = [];

    this.api.getAllUnits(0, 0, "ID", "asc", " AND STATUS=1 AND FEDERATION_ID=" + this.homeFederationID + " AND ID=" + homeUnitID).subscribe(data => {
      if (data['code'] == 200) {
        this.unitLoadingForHostMeeting = false;
        this.unitsForHostMeeting = data['data'];
      }

    }, err => {
      this.unitLoadingForHostMeeting = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  federationForHostMeeting: any[] = [];
  federationLoadingForHostMeeting: boolean = false;

  getFederationForHostMeeting(): void {
    this.federationLoadingForHostMeeting = true;
    this.federationForHostMeeting = [];

    this.api.getAllFederations(0, 0, "NAME", "asc", " AND STATUS=1 AND ID=" + this.homeFederationID).subscribe(data => {
      if (data['code'] == 200) {
        this.federationLoadingForHostMeeting = false;
        this.federationForHostMeeting = data['data'];
      }

    }, err => {
      this.federationLoadingForHostMeeting = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  groups: any[] = [];
  groupLoading: boolean = false;

  getGroups(unitID: any): void {
    this.groupLoading = true;

    let multipleUnitFilter = "";
    if (unitID.length > 0) {
      multipleUnitFilter = " AND UNIT_ID IN (" + unitID + ")";
    }

    var federationFilter = "";
    if (this.federationID != 0) {
      federationFilter = " AND FEDERATION_ID=" + this.homeFederationID;
    }

    var unitFilter = "";
    if (this.unitID != 0) {
      unitFilter = " AND UNIT_ID=" + this.unitID;
    }

    var groupFilter = "";
    if (this.groupID != 0) {
      groupFilter = " AND ID=" + this.groupID;
    }

    this.groups = [];

    this.api.getAllGroups(0, 0, "NAME", "asc", " AND STATUS=1" + federationFilter + unitFilter + groupFilter + multipleUnitFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.groupLoading = false;
        this.groups = data['data'];
      }

    }, err => {
      this.groupLoading = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  post: any[] = [];
  roleLoading: boolean = false;

  getMembersPost(): void {
    this.roleLoading = true;
    this.post = [];

    this.api.getAllRoles(0, 0, "NAME", "asc", " AND STATUS=1 AND PARENT_ROLE_ID != 0").subscribe(data => {
      if (data['code'] == 200) {
        this.roleLoading = false;
        this.post = data['data'];
      }

    }, err => {
      this.roleLoading = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  memberData: any[] = [];

  GetMembersSearch(): void {
    let blankCaseFilter = "";
    let unitFilter = "";

    if (this.UNIT_ID.length > 0) {
      unitFilter = " AND UNIT_ID IN (" + this.UNIT_ID + ")";

    } else {
      if (this.federationID > 0) {
        blankCaseFilter = " AND FEDERATION_ID=" + this.federationID;

      } else if (this.unitID > 0) {
        blankCaseFilter = " AND UNIT_ID=" + this.unitID;

      } else if (this.groupID > 0) {
        blankCaseFilter = " AND GROUP_ID=" + this.groupID;
      }
    }

    let groupFilter = "";

    if (this.GROUP_ID.length > 0) {
      groupFilter = " AND GROUP_ID IN (" + this.GROUP_ID + ")";

    } else {
      if (this.federationID > 0) {
        blankCaseFilter = " AND FEDERATION_ID=" + this.federationID;

      } else if (this.unitID > 0) {
        blankCaseFilter = " AND UNIT_ID=" + this.unitID;

      } else if (this.groupID > 0) {
        blankCaseFilter = " AND GROUP_ID=" + this.groupID;
      }
    }

    let roleNameArry = "";
    let roleNameFilter = "";

    if (this.ROLE_ID.length > 0) {
      for (var i = 0; i < this.ROLE_ID.length; i++) {
        roleNameArry = roleNameArry + "'" + this.ROLE_ID[i] + "',";
      }

      roleNameArry = roleNameArry.substring(0, roleNameArry.length - 1);
      roleNameFilter = " AND MEMBER_ROLE IN (" + roleNameArry + ")";

    } else {
      if (this.federationID > 0) {
        blankCaseFilter = " AND FEDERATION_ID=" + this.federationID;

      } else if (this.unitID > 0) {
        blankCaseFilter = " AND UNIT_ID=" + this.unitID;

      } else if (this.groupID > 0) {
        blankCaseFilter = " AND GROUP_ID=" + this.groupID;
      }
    }

    this.memberData = [];
    // this.CHECK_PA = [];
    this.isSpinning = true;

    this.api.getAllMembers(0, 0, "NAME", "asc", " AND ACTIVE_STATUS='A'" + unitFilter + groupFilter + roleNameFilter + blankCaseFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.isSpinning = false;
        this.memberData = data["data"];
      }

    }, err => {
      this.isSpinning = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  GetMembersForHostMeeting(): void {
    let isOK = true;
    let federationFilter = "";

    if (this.TEMP_MEETING_DATA.HOSTING_LEVEL == "F") {
      if (this.FEDERATION_ID_FOR_HOST_MEETING.length > 0) {
        federationFilter = " AND FEDERATION_ID IN (" + this.FEDERATION_ID_FOR_HOST_MEETING + ")";

      } else {
        isOK = false;
        this.message.info("Please Select Valid Federation", "");
      }
    }

    let unitFilter = "";

    if (this.TEMP_MEETING_DATA.HOSTING_LEVEL == "U") {
      if (this.UNIT_ID_FOR_HOST_MEETING.length > 0) {
        unitFilter = " AND UNIT_ID IN (" + this.UNIT_ID_FOR_HOST_MEETING + ")";

      } else {
        isOK = false;
        this.message.info("Please Select Valid Unit(s)", "");
      }
    }

    if (isOK) {
      this.memberData = [];
      this.CHECK_PA = [];
      this.isSpinning = true;

      this.api.getAllMembers(0, 0, "NAME", "asc", " AND ACTIVE_STATUS='A'" + federationFilter + unitFilter).subscribe(data => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          this.memberData = data["data"];
        }

      }, err => {
        this.isSpinning = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  CHECK_PA: any[] = [];
  CLIENT_ID: number = 1;
  newArray: any[] = [];
  IS_ATTENDANCE_MARKED: boolean;
  IS_INVITION_SEND: boolean;

  save(myForm: NgForm): void {
    this.isOk = true;
    this.isSpinning = false;

    if (this.CHECK_PA.length > 0) {
      this.IS_ATTENDANCE_MARKED = false;
      this.IS_INVITION_SEND = true;

      this.CHECK_PA.forEach((item) => {
        this.newArray.push({
          MEMBER_ID: item.ID,
          MEETING_ID: this.MEETING_ID,
          P_A: 1
        })
      });

    } else {
      this.isOk = false;
      this.message.error("Please Select Invitees", "");
    }

    if (this.isOk) {
      this.isSpinning = true;

      this.api.saveMapInvities(this.CLIENT_ID, this.MEETING_ID, this.newArray, this.IS_ATTENDANCE_MARKED, this.IS_INVITION_SEND).subscribe(data => {
        if (data["code"] == 200) {
          this.message.success("Invitees Mapped Successfully", "");
          this.isSpinning = false;
          this.close(myForm);

        } else {
          this.message.error("Failed to Map Invitees", "");
          this.isSpinning = false;
        }
      });
    }
  }

  resetSearchBox(): void {
    this.SEARCH_NAME = "";
  }

  inviteMember(data: Membermaster): void {
    this.CHECK_PA.push(data);
    this.CHECK_PA = [...new Set(this.CHECK_PA)];
  }

  inviteAllMember(): void {
    this.CHECK_PA = [...new Set(this.CHECK_PA), ...new Set(this.memberData)];
    this.CHECK_PA = [...new Set(this.CHECK_PA)];
  }

  removeMember(index: number): void {
    this.CHECK_PA.splice(index, 1);
    this.CHECK_PA = [...new Set(this.CHECK_PA)];
  }

  removeAllMember(): void {
    this.CHECK_PA = [...[]];
  }

  TEMP_MEETING_DATA: GroupMeetAttendance = new GroupMeetAttendance();
}
