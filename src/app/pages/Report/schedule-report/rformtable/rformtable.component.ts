import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Service/api.service';
import { Rform } from 'src/app/Models/rform';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-rformtable',
  templateUrl: './rformtable.component.html',
  styleUrls: ['./rformtable.component.css']
})

export class RformtableComponent implements OnInit {
  drawerVisible: boolean;
  drawerTitle: string = "Report";
  drawerData: Rform = new Rform();
  data: Rform = new Rform();
  sortValue: string = "ASC";
  searchText: string = "";
  totalRecords = 1;
  seq_id = 0;
  pageIndex = 0;
  pageSize = 10;
  columns = [["ID", "ID"], ['REPORT_NAME', 'REPORT_NAME']]
  constructor(private api: ApiService, private message: NzNotificationService) { }
  formTitle = "Report";
  loadingRecords: boolean = false;
  loadingRecords2: boolean = false;

  ngOnInit() {
    this.getreport();
  }

  sortKey: string = "REPORT_NAME";

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true);
  }

  getreport() {
    this.api.getReportMatstar(0, 0, '', '', '').subscribe(data => {
      this.data = data['data'];

      if (data['count'] == 0) {
        this.drawerData.SEQ_NO = 1;
        this.seq_id = this.drawerData.SEQ_NO;
        console.log('seq', this.seq_id);

      } else {
        this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
        this.seq_id = this.drawerData.SEQ_NO;
        console.log('seq', this.seq_id);
      }

    }, err => {
      console.log(err);
    });
  }

  getwidth() {
    if (window.innerWidth <= 400) {
      return 350;

    } else {
      return 500;
    }
  }

  search(reset: boolean = false) {
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

    var federationFilter = "";
    // if (this.federationID != 0) {
    //   federationFilter = " AND FEDERATION_ID=" + this.federationID;
    // }

    var unitFilter = "";
    // if (this.unitID != 0) {
    //   unitFilter = " AND UNIT_ID=" + this.unitID;
    // }

    var groupFilter = "";
    // if (this.groupID != 0) {
    //   groupFilter = " AND GROUP_ID=" + this.groupID;
    // }

    this.api.getReportMatstar(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + federationFilter + unitFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.totalRecords = data['count'];
        this.data = data['data'];

        if (data['count'] == 0) {
          this.drawerData.SEQ_NO = 1;
          this.seq_id = this.drawerData.SEQ_NO;
          console.log('seq', this.seq_id);

        } else {
          this.drawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
          this.seq_id = this.drawerData.SEQ_NO;
          console.log('seq', this.seq_id);
        }

        this.data = data['data'];
        this.pageIndex++;
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  add(): void {
    this.drawerData.REPORT_NAME = '';
    this.drawerData.SEQ_NO = this.seq_id;
    this.drawerVisible = true;
  }

  edit(data: Rform, i: number): void {
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.drawerData.ID = null;
    this.getreport();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
}
