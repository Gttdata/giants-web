import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { OutstandingGroupMaster } from 'src/app/Models/OutstandingGroupMaster';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-groupbiddinglist',
  templateUrl: './groupbiddinglist.component.html',
  styleUrls: ['./groupbiddinglist.component.css']
})

export class GroupbiddinglistComponent implements OnInit {

  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  federationID = Number(this._cookie.get("FEDERATION_ID"));
  unitID = Number(this._cookie.get("UNIT_ID"));
  groupID = Number(this._cookie.get("GROUP_ID"));

  GROUP_ID:number=0;

  formTitle = "Add New Outstadnging Group Details";
  drawerTitle: string;
  drawerVisible: boolean;
  drawerData: OutstandingGroupMaster = new OutstandingGroupMaster();
  drawerContiProjectData: any[] = [];
  drawerDuePaidData: any[] = [];
  drawerUndertakenProjData: any[] = [];
  drawerMediaCoverageData: any[] = [];
  drawerSponsorData: any[] = [];
  totalRecords = 0;

  constructor(public api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() { }

  drawerClose(): void {
    this.drawerVisible = false;
  }

  // add(): void {
  //   this.api.getOutstandingGroup(0, 0, 'ID', 'ASC', 'AND GROUP_ID = 81 ').subscribe(data => {
  //     if (data['count'] == 0){
  //       this.totalRecords = 0
  //     }
  //     else{
  //       this.totalRecords = 1
  //     }
  //     this.drawerData = data['data'][0];

  //     console.log("RecordLength = " + this.totalRecords);
  //   if(this.totalRecords == 1)
  //   {
  //     this.drawerTitle = "Update Outstadnging Group Details";
  //     this.drawerData = Object.assign({}, this.drawerData);
  //     this.drawerVisible = true;
  //   }
  //   else{
  //     this.drawerTitle = "Add Outstadnging Group Details";
  //     this.drawerData = new OutstandingGroupMaster();
  //     this.drawerVisible = true;
  //   }
  //   });
  // }

  // add(): void {
  //   // this.GROUP_ID = parseInt(this.groupID);
  //   // console.log("this.GROUP_ID = " +this.GROUP_ID);
    

  //   this.api.getOutstandingGroup(0, 0, 'ID', 'ASC', 'AND GROUP_ID = ' + this.groupID).subscribe(data => {
  //     if (data['count'] == 0) {
  //       this.totalRecords = 0;

  //     } else {
  //       this.totalRecords = 1;
  //     }

  //     if (this.totalRecords == 1) {
  //       this.drawerTitle = "Update Outstadnging Group Details";
  //       this.drawerData = Object.assign({}, data['data'][0]);
  //       this.drawerVisible = true;

  //       this.api.getContinuproject(0, 0, 'ID', 'ASC', 'AND OUTSTANDING_GROUP_MASTER_ID = ' + this.drawerData.ID).subscribe(dataContinu => {
  //         if (dataContinu['count'] > 0) {
  //           this.drawerContiProjectData = dataContinu['data'];

  //         } else {
  //           this.drawerContiProjectData = []
  //         }
  //       });

  //       this.api.getDuePaidToFundation(0, 0, 'ID', 'ASC', 'AND OUTSTANDING_GROUP_MASTER_ID = ' + this.drawerData.ID).subscribe(dataDuePaid => {
  //         if (dataDuePaid['count'] > 0) {
  //           this.drawerDuePaidData = dataDuePaid['data'];
  //         } else {
  //           this.drawerDuePaidData = []
  //         }
  //       });

  //       this.api.getUndertakenProject(0, 0, 'ID', 'ASC', 'AND OUTSTANDING_GROUP_MASTER_ID = ' + this.drawerData.ID).subscribe(dataUnderProject => {
  //         if (dataUnderProject['count'] > 0) {
  //           this.drawerUndertakenProjData = dataUnderProject['data'];
  //         } else {
  //           this.drawerUndertakenProjData = []
  //         }
  //       });

  //       this.api.getMediaCoverage(0, 0, 'ID', 'ASC', 'AND OUTSTANDING_GROUP_MASTER_ID = ' + this.drawerData.ID).subscribe(dataMediaCover => {
  //         if (dataMediaCover['count'] > 0) {
  //           this.drawerMediaCoverageData = dataMediaCover['data'];
  //         } else {
  //           this.drawerMediaCoverageData = []
  //         }
  //       });

  //       this.api.getGroupSponser(0, 0, 'ID', 'ASC', 'AND OUTSTANDING_GROUP_MASTER_ID = ' + this.drawerData.ID).subscribe(dataSponsor => {
  //         if (dataSponsor['count'] > 0) {
  //           this.drawerSponsorData = dataSponsor['data'];
  //         } else {
  //           this.drawerSponsorData = []
  //         }
  //       });

  //     } else {
  //       this.drawerTitle = "Add Outstadnging Group Details";
  //       this.drawerData = new OutstandingGroupMaster();
  //       this.drawerVisible = true;
  //     }
  //   });
  // }

  getWidth() {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 840;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
}
