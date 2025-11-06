import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Service/api.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { ConventionalMemberMapping } from 'src/app/Models/ConventionalMemberMapping';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-conventionmembermapping',
  templateUrl: './conventionmembermapping.component.html',
  styleUrls: ['./conventionmembermapping.component.css']
})

export class ConventionmembermappingComponent implements OnInit {
  formTitle: string = "Convention Member Mapping";
  isOk: boolean = true;
  isSpinning: boolean = false;
  dataList: any[] = [];
  data: ConventionalMemberMapping[] = [];
  homeGroupID: number = Number(sessionStorage.getItem("HOME_GROUP_ID"));
  year: number = new Date().getFullYear();
  baseYear: number = 2020;
  range: any[] = [];
  SELECTED_YEAR: number;
  mappedCount: number = 0;
  mappedCountString: string = "";
  SEARCH_NAME: string;
  GLOBAL_SELECT: boolean = false;
  indeterminate: boolean = false;

  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private _cookie: CookieService) { }

  ngOnInit() {
    this.year = new Date().getFullYear();
    this.SELECTED_YEAR = this.year;
    this.LoadYears();
    this.Fordate();
    this.search(this.SELECTED_YEAR);
  }

  LoadYears(): void {
    this.SELECTED_YEAR = new Date().getFullYear();
  }

  Fordate(): void {
    let currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= this.baseYear; i--) {
      this.range.push(i);
    }
  }

  search(year: number): void {
    this.SELECTED_YEAR = year;
    this.mappedCount = 0;
    this.GLOBAL_SELECT = false;
    this.mappedCountString = "";
    this.isSpinning = true;

    this.api
      .getConventionalMemberMapping(this.SELECTED_YEAR, this.homeGroupID)
      .subscribe(data => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          this.dataList = data['data'];
          this.calcMemberCount();
        }

      }, err => {
        this.isSpinning = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  calcMemberCount(): void {
    this.mappedCount = 0;
    this.mappedCountString = "";

    for (let i = 0; i < this.dataList.length; i++) {
      if (this.dataList[i]["IS_CHECKED"] == 1) {
        this.dataList[i]["IS_CHECKED"] = true;
        this.mappedCount += 1;

      } else {
        this.dataList[i]["IS_CHECKED"] = false;
      }
    }

    this.mappedCountString = "Total Member(s) : " + this.mappedCount;
  }

  save(): void {
    this.isOk = true;
    this.data = [];

    if ((this.SELECTED_YEAR == undefined) || (this.SELECTED_YEAR == null)) {
      this.isOk = false;
      this.message.error('Please Select Year', '');
    }

    for (let i = 0; i < this.dataList.length; i++) {
      if (this.dataList[i]["IS_CHECKED"]) {
        this.data.push(this.dataList[i]);
      }
    }

    this.isSpinning = true;

    if (this.isOk) {
      this.api
        .saveConventionalMemberMapping(this.homeGroupID, this.data, this.SELECTED_YEAR)
        .subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.isSpinning = false;
            this.message.success("Convention's Member Mapped Successfully", "");
            this.search(this.SELECTED_YEAR);

          } else {
            this.isSpinning = false;
            this.message.error("Failed to Member Mapping", "");
            this.search(this.SELECTED_YEAR);
          }
        });
    }
  }

  onCheckedChanged(): void {
    if (this.dataList.every(item => !item["IS_CHECKED"])) {
      this.GLOBAL_SELECT = false;
      this.indeterminate = false;

    } else if (this.dataList.every(item => item["IS_CHECKED"])) {
      this.GLOBAL_SELECT = true;
      this.indeterminate = false;

    } else {
      this.indeterminate = true;
    }

    this.calcMemberCount();
  }

  onGlobalSelectChanged(status: boolean): void {
    this.indeterminate = false;

    for (let i = 0; i < this.dataList.length; i++) {
      this.dataList[i]["IS_CHECKED"] = status;
    }

    this.calcMemberCount();
  }
}
