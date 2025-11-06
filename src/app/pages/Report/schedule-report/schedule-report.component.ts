import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NzNotificationService, toArray } from 'ng-zorro-antd';
import { ApiService } from 'src/app/Service/api.service';
import { Input, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { REPORTSCHEDULE } from 'src/app/Models/report-schedule';
import { Rform } from 'src/app/Models/rform';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-schedule-report',
  templateUrl: './schedule-report.component.html',
  styleUrls: ['./schedule-report.component.css']
})

export class ScheduleReportComponent implements OnInit {
  formTitle: string = "Report Schedule";
  @Input() data_post: REPORTSCHEDULE;
  @Input() ScheduleClose: Function;
  @Input() ScheduleVisible: boolean;
  @Input() data_List: any[] = [];
  @Input() totalRecords: number;
  loadingRecords2: boolean = false;
  dataReport: Rform = new Rform();
  passwordVisible: boolean = false;
  pageIndex: number = 1;
  pageSize: number = 5;
  dataList: any[] = [];
  dataemail: any[] = [];
  switch = 0;
  loadingRecords: boolean = true;
  sortKey: string = "ID";
  sortValue: string = "asc";
  searchText: string = "";
  filterQuery: string = "";
  columns: string[][] = [['ID', 'ID'], ["REPORT_NAME", "REPORT_NAME"], ["EMAIL", "EMAIL"], ["TIMEING", "TIMEING"], ["SCHEDULE", "SCHEDULE"], ["EVERY_WEEK", "EVERY_WEEK"], ["MONTH", "MONTH"], ["YEAR", "YEAR"], ["CUSTOM_DATE", "CUSTOM_DATE"]];
  drawerVisible: boolean;
  drawerTitle: string;
  isSpinning: boolean = false;
  emitted = false;
  filter = '';
  private categoriesSubject = new BehaviorSubject<Array<string>>([]);
  categories$ = this.categoriesSubject.asObservable();
  userID: number = this.api.userId;

  constructor(private api: ApiService, private _Activatedroute: ActivatedRoute, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  @HostListener('document:wheel', ['$event'])

  onScroll(e: any) {
    if ((document.getElementById("activityItem").scrollTop + document.getElementById("activityItem").offsetHeight) >= document.getElementById("activityItem").scrollHeight && !this.emitted) {
      this.emitted = true;
      this.onScrollingFinished();

    } else if ((document.getElementById("activityItem").scrollTop + document.getElementById("activityItem").offsetHeight) < document.getElementById("activityItem").scrollHeight) {
      this.emitted = false;
    }
  }

  getwidth() {
    if (window.innerWidth <= 400) {
      return 380;

    } else {
      return 800;
    }
  }

  size() {
    if (window.innerWidth <= 400) {
      return 100;

    } else {
      return 50;
    }
  }

  onScrollingFinished() {
    this.loadMore();
  }

  loadMore(): void {
    if (this.getNextItems()) {
      this.categoriesSubject.next(this.dataList);
    }
  }

  getNextItems(): boolean {
    console.log("End");

    if (this.data_List.length >= this.totalRecords) {
      return false;
    }

    this.search(false, true);
    return true;
  }

  getreport() {
    this.api.getReportMatstar(0, 0, '', '', '').subscribe(data => {
      this.dataReport = data['data'];

    }, err => {
      console.log(err);
    });
  }

  IDForSearching: number = 0;

  ngOnInit() {
    this.getreport();
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true);
  }

  search(reset: boolean = false, loadMore: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }

    var sort: string;

    try {
      sort = this.sortValue.startsWith("a") ? "asc" : "desc";

    } catch (error) {
      sort = "";
    }

    var likeQuery = "";

    if (this.searchText != "") {
      likeQuery = " AND (";

      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    this.IDForSearching = Number(this._Activatedroute.snapshot.paramMap.get("ID"));
    var groupIDForSearchingFilter = " AND REPORT_ID=" + this.data_post.REPORT_ID;
    this.loadingRecords = true;

    this.api.getScheduledReport(0, 0, '', '', likeQuery + groupIDForSearchingFilter + " AND STATUS=1").subscribe(data => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.data_List = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  Emails: any[] = [];
  drawerData: REPORTSCHEDULE = new REPORTSCHEDULE();

  edit(data: any): void {
    this.drawerTitle = "Report Schedule";
    this.drawerData = new REPORTSCHEDULE();
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;

    if ((this.drawerData.EMAIL != null) && (this.drawerData.EMAIL != ''))
      this.drawerData.EMAIL = this.drawerData.EMAIL.split(',');

    if ((this.drawerData.TIMEING != null) && (this.drawerData.TIMEING != ''))
      this.drawerData.TIMEING = this.drawerData.TIMEING.split(',');

    if ((this.drawerData.EVERY_WEEK != null) && (this.drawerData.EVERY_WEEK != ''))
      this.drawerData.EVERY_WEEK = this.drawerData.EVERY_WEEK.split(',');

    if ((this.drawerData.MONTH != null) && (this.drawerData.MONTH != ''))
      this.drawerData.MONTH = this.drawerData.MONTH.split(',');

    if ((this.drawerData.YEAR != null) && (this.drawerData.YEAR != ''))
      this.drawerData.YEAR = this.drawerData.YEAR.split(',');
  }

  confirm(data: any) {
    this.api.deleteSchedule(data).subscribe(data => {

      if (data["code"] == 200) {
        this.message.success("Delete Successfully", "");

      } else {
        this.message.error("Delete Failed", "");
        this.isSpinning = false;
      }

      this.search(true);
    })
  }

  add(): void {
    this.drawerTitle = "Report Schedule";
    this.drawerData = new REPORTSCHEDULE();
    this.drawerData.SCHEDULE = 'D';
    this.drawerData.SORT_KEY = this.data_post.SORT_KEY;
    this.drawerData.SORT_VALUE = this.data_post.SORT_VALUE;
    this.drawerData.FILTER_QUERY = this.data_post.FILTER_QUERY;
    this.drawerData.USER_ID = parseInt(this._cookie.get('userId'));
    this.drawerData.REPORT_ID = this.data_post.REPORT_ID;
    this.drawerVisible = true;
    this.Emails = this.dataList;
  }

  date_time(time: any): string {
    return this.datePipe.transform(new Date('1997-12-12 ' + time), 'hh:mm a');
  }

  drawerClose(): void {
    this.pageIndex = 1;
    this.search(true);
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  onSearching() {
    document.getElementById("button1").focus();
    this.search(true);
  }

  onStatusChange(data: any, status: any) {
    data.STATUS = status;
  }

  cancel() { }

  getWidth() {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 700;
  }

  back() {
    window.history.back();
  }

  close() {
    this.ScheduleClose();
  }
}