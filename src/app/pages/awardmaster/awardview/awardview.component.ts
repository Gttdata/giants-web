import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { ApiService } from 'src/app/Service/api.service';
import { AwardsMaster } from 'src/app/Models/AwardsMaster';

@Component({
  selector: 'app-awardview',
  templateUrl: './awardview.component.html',
  styleUrls: ['./awardview.component.css']
})

export class AwardviewComponent implements OnInit {
  formTitle: string = "Award List";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList: any[] = [];
  loadingRecords: boolean = true;
  sortKey: string = "ID";
  sortValue: string = "desc";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: string = "default";
  columns: string[][] = [["AWARD_NAME", "Award Name"]];
  drawerVisible: boolean = false;
  drawerTitle: string;
  drawerData: AwardsMaster = new AwardsMaster();

  constructor(
    private api: ApiService,
    private message: NzNotificationService) { }

  ngOnInit() {
    this.search(true);
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true);
  }

  search(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }

    var sort: string;

    try {
      sort = this.sortValue.startsWith("a") ? "asc" : "desc";

    } catch (error) {
      sort = "";
    }

    if (this.searchText != "") {
      var likeQuery = " AND";

      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }

    this.loadingRecords = true;

    this.api
      .getAllAwards(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery)
      .subscribe(data => {
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.dataList = data['data'];

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  add(): void {
    this.drawerTitle = "Create New Award";
    this.drawerData = new AwardsMaster();
    this.drawerVisible = true;
  }

  edit(data: AwardsMaster): void {
    this.drawerTitle = "Update Award";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search(false);
    this.drawerVisible = false;
  }
}
