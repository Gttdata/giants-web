import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Service/api.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { Membermaster } from 'src/app/Models/MemberMaster';
import { AwardCertificateMapping } from 'src/app/Models/awardcertificatemapping';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-awardcertificatemapping',
  templateUrl: './awardcertificatemapping.component.html',
  styleUrls: ['./awardcertificatemapping.component.css']
})

export class AwardcertificatemappingComponent implements OnInit {
  formTitle: string = "Award/ Certificate Mapping";
  isOk: boolean = true;
  isSpinning: boolean = false;
  dataList: any[] = [];
  data: AwardCertificateMapping[] = [];
  isMemberLoading: boolean = false;
  homeGroupID: number = Number(sessionStorage.getItem("HOME_GROUP_ID"));
  AllMembers: Membermaster[] = [];
  year: number = new Date().getFullYear();
  baseYear: number = 2020;
  range: any[] = [];
  currentYear: any;
  SELECTED_YEAR: any;
  AWARD_LEVEL: string = "I";
  AWARD_TYPE: string = "A";
  SEARCH_NAME: string;
  SEARCH_PIPE_KEY: string = "AWARD";
  GLOBAL_SELECT: boolean = false;
  indeterminate: boolean = false;

  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private _cookie: CookieService) { }

  ngOnInit() {
    this.AWARD_LEVEL = "I";
    this.AWARD_TYPE = "A";
    this.year = new Date().getFullYear();
    this.SELECTED_YEAR = this.year;
    this.currentYear = this.SELECTED_YEAR;
    this.LoadYears();
    this.Fordate();
    this.getMembersName();
    this.selectChangeYear();
  }

  Fordate(): void {
    let currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= this.baseYear; i--) {
      this.range.push(i);
    }
  }

  LoadYears(): void {
    this.SELECTED_YEAR = new Date().getFullYear();
  }

  getMembersName(): void {
    this.AllMembers = [];
    this.isMemberLoading = true;

    this.api
      .getAllMembers(0, 0, "NAME", "asc", " AND ACTIVE_STATUS = 'A' AND GROUP_ID = " + this.homeGroupID)
      .subscribe(data => {
        if (data['code'] == 200) {
          this.isMemberLoading = false;
          this.AllMembers = data['data'];
        }

      }, err => {
        this.isMemberLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  mappedCount: number = 0;
  mappedAwardCertificateCount: string = "";

  selectChangeYear(): void {
    this.mappedCount = 0;
    this.GLOBAL_SELECT = false;
    this.mappedAwardCertificateCount = "";
    this.dataList = [];
    this.isOk = true;

    if (((this.AWARD_LEVEL == undefined) || (this.AWARD_LEVEL == null))
      && ((this.AWARD_TYPE == undefined) || (this.AWARD_TYPE == null))
      && ((this.SELECTED_YEAR == undefined) || (this.SELECTED_YEAR == null))) {
      this.isOk = false;
      this.message.error('Please select all mandatory field', '');

    } else if ((this.AWARD_LEVEL == undefined) || (this.AWARD_LEVEL == null)) {
      this.isOk = false;
      this.message.error('Please Select Level', '');

    } else if ((this.AWARD_TYPE == undefined) || (this.AWARD_TYPE == null)) {
      this.isOk = false;
      this.message.error('Please Select Type', '');

    } else if ((this.SELECTED_YEAR == undefined) || (this.SELECTED_YEAR == null)) {
      this.isOk = false;
      this.message.error('Please Select Year', '');
    }

    if (this.isOk) {
      if (this.AWARD_TYPE == "A") {
        this.SEARCH_PIPE_KEY = "AWARD";

      } else {
        this.SEARCH_PIPE_KEY = "CERTIFICATE";
      }

      this.isSpinning = true;

      this.api
        .getAwardMapping(this.homeGroupID, this.SELECTED_YEAR, this.AWARD_LEVEL, this.AWARD_TYPE)
        .subscribe(data => {
          if (data['code'] == 200) {
            this.isSpinning = false;
            this.dataList = data['data'];
            this.calcAwardCertificate();
          }

        }, err => {
          this.isSpinning = false;

          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });
    }
  }

  calcAwardCertificate(): void {
    this.mappedCount = 0;
    this.mappedAwardCertificateCount = "";

    if (this.AWARD_TYPE == 'A') {
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i]["IS_RECEIVED"] == 1) {
          this.dataList[i]["IS_RECEIVED"] = true;
          this.mappedCount += 1;

        } else {
          this.dataList[i]["IS_RECEIVED"] = false;
        }
      }

      this.mappedAwardCertificateCount = "Total Award(s) : " + this.mappedCount;

    } else {
      if (this.AWARD_TYPE == 'C') {
        for (let i = 0; i < this.dataList.length; i++) {
          if (this.dataList[i]["IS_RECEIVED"] == 1) {
            this.dataList[i]["IS_RECEIVED"] = true;
            this.mappedCount += 1;

          } else {
            this.dataList[i]["IS_RECEIVED"] = false;
          }
        }

        this.mappedAwardCertificateCount = "Total Certificate(s) : " + this.mappedCount;
      }
    }
  }

  save(): void {
    this.isOk = true;
    this.isSpinning = true;
    let successMsg = "";
    let failMsg = "";

    if (this.AWARD_TYPE == "A") {
      successMsg = "Award Mapped Successfully";
      failMsg = "Failed to Award Mapping";

    } else {
      successMsg = "Certificate Mapped Successfully";
      failMsg = "Failed to Certificate Mapping";
    }

    if (((this.AWARD_LEVEL == undefined) || (this.AWARD_LEVEL == null))
      && ((this.AWARD_TYPE == undefined) || (this.AWARD_TYPE == null))
      && ((this.SELECTED_YEAR == undefined) || (this.SELECTED_YEAR == null))) {
      this.isOk = false;
      this.message.error('Please select all the mandatory field', '');

    } else if ((this.AWARD_LEVEL == undefined) || (this.AWARD_LEVEL == null)) {
      this.isOk = false;
      this.message.error('Please Select Level', '');

    } else if ((this.AWARD_TYPE == undefined) || (this.AWARD_TYPE == null)) {
      this.isOk = false;
      this.message.error('Please Select Type', '');

    } else if ((this.SELECTED_YEAR == undefined) || (this.SELECTED_YEAR == null)) {
      this.isOk = false;
      this.message.error('Please Select Year', '');
    }

    if (this.dataList.length == 0) {
      this.isOk = false;
      this.message.info('Record Not Found', '');
    }

    this.data = [];

    for (let i = 0; i < this.dataList.length; i++) {
      if (this.dataList[i]["IS_RECEIVED"]) {
        if (this.dataList[i]["MEMBER_ID"] == null) {
          this.isOk = false;
          this.isSpinning = false;

          if (this.AWARD_TYPE == 'A') {
            this.message.error('Please Select Member Name for ', this.dataList[i]["AWARD_NAME"]);

          } else {
            this.message.error('Please Select Member Name for ', this.dataList[i]["CERTIFICATE_NAME"]);
          }
        }

        this.data.push(this.dataList[i]);
      }
    }

    if (this.isOk) {
      this.api
        .updateAwardCertificateMapping(this.homeGroupID, this.SELECTED_YEAR, this.AWARD_LEVEL, this.AWARD_TYPE, this.data)
        .subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.isSpinning = false;
            this.message.success(successMsg, "");
            this.selectChangeYear();

          } else {
            this.isSpinning = false;
            this.message.error(failMsg, "");
            this.selectChangeYear();
          }
        });
    }
  }

  onAwardReceivedChanged(): void {
    if (this.dataList.every(item => !item["IS_RECEIVED"])) {
      this.GLOBAL_SELECT = false;
      this.indeterminate = false;

    } else if (this.dataList.every(item => item["IS_RECEIVED"])) {
      this.GLOBAL_SELECT = true;
      this.indeterminate = false;

    } else {
      this.indeterminate = true;
    }

    this.calcAwardCertificate();
  }

  onGlobalSelectChanged(status: boolean): void {
    this.indeterminate = false;

    for (let i = 0; i < this.dataList.length; i++) {
      this.dataList[i]["IS_RECEIVED"] = status;
    }

    this.calcAwardCertificate();
  }
}
