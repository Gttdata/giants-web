import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { Membermaster } from 'src/app/Models/MemberMaster';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-circular-details',
  templateUrl: './circular-details.component.html',
  styleUrls: ['./circular-details.component.css']
})

export class CircularDetailsComponent implements OnInit {
  circularTitle: string = "";
  circularDetails: any[] = [];
  loadingPage: boolean = false;
  RETRIVE_IMAGE_URL: string = this.api.retriveimgUrl;
  currentIndex: number = -1;
  isVisible: boolean = false;

  SIGNATURE1: string;
  MEMBER_ROLE1: string;
  CREATOR_NAME1: string;
  ROLE1_FEDERATION_UNIT_GROUP: string;

  SIGNATURE2: string;
  MEMBER_ROLE2: string;
  CREATOR_NAME2: string;
  ROLE2_FEDERATION_UNIT_GROUP: string;

  SIGNATURE3: string;
  MEMBER_ROLE3: string;
  CREATOR_NAME3: string;
  ROLE3_FEDERATION_UNIT_GROUP: string;

  GENDER1: string;
  GENDER2: string;
  GENDER3: string;

  USER_ID: number = this.api.userId;
  federationInfo: any[] = [];
  presidentInfo: any[] = [];
  creatorInfo: any[] = [];

  constructor(private _Activatedroute: ActivatedRoute, private router: Router, private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        let details = ev.url.split('=')[(ev.url.split('=').length) - 1];
        this.circularTitle = details;
        this.loadingPage = true;

        this.api.getCircularLink(this.circularTitle).subscribe(data => {
          if (data['code'] == 200) {
            this.circularDetails = data['data'][0];

            this.api.getAllFederationsOpenAPI(0, 0, "ID", "asc", " AND ID=" + this.circularDetails["CREATER_FEDERATION_ID"]).subscribe(data => {
              if (data['code'] == 200) {
                this.federationInfo = data["data"][0];

                // Get all members  
                let memberFilter = " AND ID IN (" + this.circularDetails["SIGNING_AUTHORITY1"] + "," + this.circularDetails["SIGNING_AUTHORITY2"] + "," + this.circularDetails["SIGNING_AUTHORITY3"] + "," + this.federationInfo["PRESIDENT"] + "," + this.circularDetails["CREATER_ID"] + ")";

                this.api.getAllMembersOpenAPI(0, 0, "ID", "asc", memberFilter).subscribe(data => {
                  if (data['code'] == 200) {
                    this.loadingPage = false;
                    let memberData = data["data"];

                    let signingAuth1 = memberData.filter((obj1: Membermaster) => {
                      return obj1.ID == this.circularDetails["SIGNING_AUTHORITY1"];
                    });

                    let signingAuth2 = memberData.filter((obj2: Membermaster) => {
                      return obj2.ID == this.circularDetails["SIGNING_AUTHORITY2"];
                    });

                    let signingAuth3 = memberData.filter((obj3: Membermaster) => {
                      return obj3.ID == this.circularDetails["SIGNING_AUTHORITY3"];
                    });

                    let tempPresidentInfo = memberData.filter((obj4: Membermaster) => {
                      return obj4.ID == this.federationInfo["PRESIDENT"];
                    });

                    let tempCreatorInfo = memberData.filter((obj5: Membermaster) => {
                      return obj5.ID == this.circularDetails["CREATER_ID"];
                    });

                    if (signingAuth1.length > 0) {
                      this.SIGNATURE1 = signingAuth1[0]['SIGNATURE'];
                      this.MEMBER_ROLE1 = signingAuth1[0]['MEMBER_ROLE'];
                      this.CREATOR_NAME1 = signingAuth1[0]['NAME'];
                      this.GENDER1 = signingAuth1[0]['GENDER'];

                      if (signingAuth1[0]['MEMBER_ROLE'] == 'Federation President') {
                        this.ROLE1_FEDERATION_UNIT_GROUP = signingAuth1[0]['FEDERATION_NAME'];

                      } else if (signingAuth1[0]['MEMBER_ROLE'] == 'Unit Director') {
                        this.ROLE1_FEDERATION_UNIT_GROUP = signingAuth1[0]['UNIT_NAME'];

                      } else if (signingAuth1[0]['MEMBER_ROLE'] == 'Group President') {
                        this.ROLE1_FEDERATION_UNIT_GROUP = signingAuth1[0]['GROUP_NAME'];

                      } else {
                        this.ROLE1_FEDERATION_UNIT_GROUP = "";
                      }
                    }

                    if (signingAuth2.length > 0) {
                      this.SIGNATURE2 = signingAuth2[0]['SIGNATURE'];
                      this.MEMBER_ROLE2 = signingAuth2[0]['MEMBER_ROLE'];
                      this.CREATOR_NAME2 = signingAuth2[0]['NAME'];
                      this.GENDER2 = signingAuth2[0]['GENDER'];

                      if (signingAuth2[0]['MEMBER_ROLE'] == 'Federation President') {
                        this.ROLE2_FEDERATION_UNIT_GROUP = signingAuth2[0]['FEDERATION_NAME'];

                      } else if (signingAuth2[0]['MEMBER_ROLE'] == 'Unit Director') {
                        this.ROLE2_FEDERATION_UNIT_GROUP = signingAuth2[0]['UNIT_NAME'];

                      } else if (signingAuth2[0]['MEMBER_ROLE'] == 'Group President') {
                        this.ROLE2_FEDERATION_UNIT_GROUP = signingAuth2[0]['GROUP_NAME'];

                      } else {
                        this.ROLE2_FEDERATION_UNIT_GROUP = "";
                      }
                    }

                    if (signingAuth3.length > 0) {
                      this.SIGNATURE3 = signingAuth3[0]['SIGNATURE'];
                      this.MEMBER_ROLE3 = signingAuth3[0]['MEMBER_ROLE'];
                      this.CREATOR_NAME3 = signingAuth3[0]['NAME'];
                      this.GENDER3 = signingAuth3[0]['GENDER'];

                      if (signingAuth3[0]['MEMBER_ROLE'] == 'Federation President') {
                        this.ROLE3_FEDERATION_UNIT_GROUP = signingAuth3[0]['FEDERATION_NAME'];

                      } else if (signingAuth3[0]['MEMBER_ROLE'] == 'Unit Director') {
                        this.ROLE3_FEDERATION_UNIT_GROUP = signingAuth3[0]['UNIT_NAME'];

                      } else if (signingAuth3[0]['MEMBER_ROLE'] == 'Group President') {
                        this.ROLE3_FEDERATION_UNIT_GROUP = signingAuth3[0]['GROUP_NAME'];

                      } else {
                        this.ROLE3_FEDERATION_UNIT_GROUP = "";
                      }
                    }

                    if (tempPresidentInfo.length > 0) {
                      this.presidentInfo = tempPresidentInfo[0];
                    }

                    if (tempCreatorInfo.length > 0) {
                      this.creatorInfo = tempCreatorInfo[0];
                    }
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

        }, err => {
          this.loadingPage = false;

          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });
      }
    });
  }
}
