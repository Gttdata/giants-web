import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})

export class CommunityComponent implements OnInit {
  formTitle: string = "Community";
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
  loadingCommunity: boolean = false;

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  homeFederationID: number = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
  homeUnitID: number = Number(sessionStorage.getItem("HOME_UNIT_ID"));
  homeGroupID: number = Number(sessionStorage.getItem("HOME_GROUP_ID"));

  roleId = Number(this.cookie.get('roleId'));
  COMMUNITY_SELECTION: string = "MF";

  constructor(private router: Router, private api: ApiService, private cookie: CookieService, private message: NzNotificationService,) { }

  ngOnInit() {
    this.getCommunityCount("MF");
  }

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

    this.api.getCommunityData(0, 0, "", "", "", federationfilter).subscribe(data => {
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
      }

    }, err => {
      this.loadingCommunity = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  goToFederationtMaster(): void {
    this.router.navigateByUrl('/federations');
  }

  goToUnitMaster(): void {
    this.router.navigateByUrl('/units');
  }

  goToGroupMaster(): void {
    this.router.navigateByUrl('/groups');
  }

  goToMemberMaster(): void {
    this.router.navigateByUrl('/members');
  }

  goToPostPage(): void {
    this.router.navigateByUrl('/posts');
  }

  goToMeetingPage(): void {
    this.router.navigateByUrl('/meetings');
  }

  goToEventPage(): void {
    this.router.navigateByUrl('/events');
  }

  goToCircularPage(): void {
    this.router.navigateByUrl('/circular');
  }

  goToProjectPage(): void {
    this.router.navigateByUrl('/project');
  }

  onCommunitySelectionChange(type: string): void {
    this.getCommunityCount(type);
  }

  goToPaymentPage(): void {
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
}
