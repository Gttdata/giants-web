import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzButtonType, NzNotificationService } from 'ng-zorro-antd';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-giantsreport',
  templateUrl: './giantsreport.component.html',
  styleUrls: ['./giantsreport.component.css']
})

export class GiantsreportComponent implements OnInit {
  formTitle = "Giants Report";
  pageIndex = 1;
  pageSize = 7;
  totalRecords = 1;
  dataList = [];
  d: any;
  dataList1 = [];
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  filterValue = []
  isFilterApplied: NzButtonType = "default";
  columns: string[][] = []
  isLoading: boolean = false;
  MONTH: any;
  YEAR: any;
  current = new Date();
  datePipe = new DatePipe("en-US");
  value1: any
  value2: any
  isVisible = false;
  i = -1;
  imgurl = this.api.retriveimgUrl;
  GROUP_ID: number;
  YEAR_SELECTION = [];
  reportGroupName: string;

  constructor(private message: NzNotificationService, private api: ApiService) { }

  ngOnInit(): void {
    this.getGroups();
    this.getYearSelection(new Date().getFullYear());
  }

  getYearSelection(currentYear: number) {
    this.YEAR = currentYear;

    this.YEAR_SELECTION = [];
    let obj1 = new Object();
    obj1["NAME"] = currentYear - 1;
    this.YEAR_SELECTION.push(Object.assign({}, obj1));

    let obj2 = new Object();
    obj2["NAME"] = currentYear;
    this.YEAR_SELECTION.push(Object.assign({}, obj2));
  }

  groups = [];

  getGroups() {
    this.groups = [];
    this.GROUP_ID = undefined;

    this.api.getAllGroups(0, 0, "NAME", "asc", " AND STATUS=1").subscribe(data => {
      if (data['code'] == 200) {
        this.groups = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  showreport(): void {
    let isOk = true;
    this.dataList = [];
    this.dataList1 = [];

    if (this.MONTH == undefined) {
      isOk = false;
      this.message.error("Please Select Valid Month", "");
    }

    if (this.YEAR == undefined) {
      isOk = false;
      this.message.error("Please Select Valid Year", "");
    }

    if (this.GROUP_ID == undefined) {
      isOk = false;
      this.message.error("Please Select Valid Group", "");
    }

    if (isOk) {
      this.isLoading = true;
      this.reportGroupName = this.getGroupName(this.GROUP_ID);

      this.api.getReportDetails(this.MONTH, this.YEAR, this.GROUP_ID).subscribe(data => {
        if (data["code"] == 200) {
          this.isVisible = true;
          this.isLoading = false;
          this.dataList = data['data'];
          this.dataList1 = data['getEvents'];

        } else {
          this.isLoading = false;
        }

      }, err => {
        this.isLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  getGroupName(groupID: number): string {
    let tempData = this.groups.filter(obj1 => {
      return obj1["ID"] == groupID;
    });

    return tempData[0]["NAME"] + ", " + tempData[0]["UNIT_NAME"];
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
