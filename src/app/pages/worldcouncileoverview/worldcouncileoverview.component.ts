import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { MeetingWorldCouncileOverview } from 'src/app/Models/MeetingWorldCouncileOverview';
import { CircularWorldCouncileOverview } from 'src/app/Models/CircularWorldCouncileOverview';
import { EventsWorldCouncileOverview } from 'src/app/Models/EventsWorldCouncileOverview';
import { ProjectsWorldCouncileOverview } from 'src/app/Models/ProjectsWorldCouncileOverview';
import { Router } from '@angular/router';

@Component({
  selector: 'app-worldcouncileoverview',
  templateUrl: './worldcouncileoverview.component.html',
  styleUrls: ['./worldcouncileoverview.component.css']
})

export class WorldcouncileoverviewComponent implements OnInit {
  formTitle: string = "Dashboard";
  loadingRecords: boolean = false;
  totalRecords: number = 1;
  meetingDataList: MeetingWorldCouncileOverview = new MeetingWorldCouncileOverview();
  postDataList: MeetingWorldCouncileOverview = new MeetingWorldCouncileOverview();
  circularDataList: CircularWorldCouncileOverview = new CircularWorldCouncileOverview();
  eventsDataList: EventsWorldCouncileOverview = new EventsWorldCouncileOverview();
  topEventsDataList: any[] = [];
  projectsDataList: ProjectsWorldCouncileOverview = new ProjectsWorldCouncileOverview();
  paymentData: any[] = [];
  TOTAL_FEDERATION: number = 0;
  TOTAL_UNITS: number = 0;
  TOTAL_GROUPS: number = 0;
  TOTAL_MEMBERS: number = 0;

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  homeFederationID = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
  homeUnitID = Number(sessionStorage.getItem("HOME_UNIT_ID"));
  homeGroupID = Number(sessionStorage.getItem("HOME_GROUP_ID"));

  roleID: number = this.api.roleId;

  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit() {
    this.Fordate();
    this.search();
  }

  year = new Date().getFullYear();
  baseYear: number = 2020;
  range: any[] = [];
  SelectedYear: any = new Date().getFullYear();

  Fordate(): void {
    let currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= this.baseYear; i--) {
      this.range.push(i);
    }
  }

  selectChangeYear(event: any): void {
    this.search();
  }

  search(): void {
    let tempFederationID = this.federationID;
    let tempUnitID = this.unitID;
    let tempGroupID = this.groupID;

    if ((this.roleID == 37) && (this.federationID == 0) && (this.unitID == 0) && (this.groupID == 0)) {
      tempFederationID = 0;
      tempUnitID = 0;
      tempGroupID = this.homeGroupID;
    }

    // Federations, Units, Groups and Members Count
    this.api.getCommunityDataYearwise(0, 0, "", "", "", this.SelectedYear, tempFederationID, tempUnitID, tempGroupID).subscribe(data => {
      if (data['code'] == 200) {
        this.TOTAL_FEDERATION = data["data"][0]["FEDERATION_COUNT"];
        this.TOTAL_UNITS = data["data"][0]["UNIT_COUNT"];
        this.TOTAL_GROUPS = data["data"][0]["GROUP_COUNT"];
        this.TOTAL_MEMBERS = data["data"][0]["MEMBER_COUNT"];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    // Meetings Count
    this.api.getMeetingStat(0, 0, '', '', '', this.SelectedYear, tempFederationID, tempUnitID, tempGroupID).subscribe(data => {
      if (data['code'] == 200) {
        this.meetingDataList = data['data'][0];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    // Posts Count
    this.api.getPostStat(0, 0, '', '', '', this.SelectedYear, tempFederationID, tempUnitID, tempGroupID).subscribe(data => {
      if (data['code'] == 200) {
        this.postDataList = data['data'][0];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    // Circulars Count
    this.api.getCircularStat(0, 0, '', '', '', this.SelectedYear, tempFederationID, tempUnitID, tempGroupID).subscribe(data => {
      if (data['code'] == 200) {
        this.circularDataList = data['data'][0];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    // Events Count
    this.api.getEventsStat(0, 0, '', '', '', this.SelectedYear, tempFederationID, tempUnitID, tempGroupID).subscribe(data => {
      if (data['code'] == 200) {
        this.eventsDataList = data['data'][0];
        this.topEventsDataList = data['TopEvents'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    // Projects Count
    this.api.getProjectsStat(0, 0, '', '', '', this.SelectedYear, tempFederationID, tempUnitID, tempGroupID).subscribe(data => {
      if (data['code'] == 200) {
        this.projectsDataList = data['data'][0];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    // Payments Count
    this.api.getPaymentStat(0, 0, '', '', '', this.SelectedYear, tempFederationID, tempUnitID, tempGroupID).subscribe(data => {
      if (data['code'] == 200) {
        this.paymentData = data['data'][0];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  goToFederationReport(): void {
    if (this.roleID != 37) {
      window.open("report/federation-report");
    }
  }

  goToUnitReport(): void {
    if (this.roleID != 37) {
      window.open("report/unit-report");
    }
  }

  goToGroupReport(): void {
    if (this.roleID != 37) {
      window.open("report/group-report");
    }
  }

  goToMemberReport(): void {
    if (this.roleID != 37) {
      window.open("report/member-report");
    }
  }

  goToMeetingReport(): void {
    if (this.roleID != 37) {
      window.open("report/meeting-report");
    }
  }

  goToPostReport(): void {
    if (this.roleID != 37) {
      window.open("report/post-report");
    }
  }

  goToCommentReport(): void {
    if (this.roleID != 37) {
      // window.open("report/comment-report");
    }
  }

  goToPaymentReport(): void {
    if (this.roleID != 37) {
      window.open("report/payment-report");
    }
  }

  goToProjectReport(): void {
    if (this.roleID != 37) {
      window.open("report/project-report");
    }
  }

  goToEventsReport(): void {
    if (this.roleID != 37) {
      window.open("report/event-report");
    }
  }

  goToCircularReport(): void {
    if (this.roleID != 37) {
      window.open("report/circular-report");
    }
  }
}
