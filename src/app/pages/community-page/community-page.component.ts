import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-community-page',
  templateUrl: './community-page.component.html',
  styleUrls: ['./community-page.component.css']
})

export class CommunityPageComponent implements OnInit {
  formTitle: string = "My Community";
  TOTAL_UNITS: number = 0;
  TOTAL_GROUPS: number = 0;
  TOTAL_MEMBERS: number = 0;
  TOTAL_ACTIVITIES: number = 0;
  TOTAL_MEETINGS: number = 0;
  TOTAL_CIRCULARS: number = 0;
  federationID: number = Number(this._cookie.get("FEDERATION_ID"));
  unitID: number = Number(this._cookie.get("UNIT_ID"));
  groupID: number = Number(this._cookie.get("GROUP_ID"));

  constructor(private router: Router, private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() {
    this.getCounts();
  }

  getCounts() {
    this.api.getFederationPresidentCount(this.federationID, this.unitID, this.groupID).subscribe(data => {
      if (data['code'] == 200) {
        this.TOTAL_UNITS = data['data'][0]["UNIT_COUNT"];
        this.TOTAL_GROUPS = data['data1'][0]["GROUP_COUNT"];
        this.TOTAL_MEMBERS = data['data2'][0]["MEMBER_COUNT"];
        this.TOTAL_ACTIVITIES = data['data3'][0]["GROUP_ACTIVITY_COUNT"];
        this.TOTAL_MEETINGS = data['data4'][0]["GROUP_MEETING_COUNT"];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  goToUnitMaster() {
    this.router.navigateByUrl('/unitmaster');
  }

  goToGroupMaster() {
    this.router.navigateByUrl('/groupmaster');
  }

  goToMemberMaster() {
    this.router.navigateByUrl('/membermaster');
  }
}
