import { Component, OnInit } from '@angular/core';
import { SystemFeesMaster } from 'src/app/Models/SystemFeesMaster';
import { ApiService } from 'src/app/Service/api.service';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-system-fees-master',
  templateUrl: './system-fees-master.component.html',
  styleUrls: ['./system-fees-master.component.css']
})

export class SystemFeesMasterComponent implements OnInit {
  formTitle: string = "System Fee Sructure";
  searchText: string = "";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  loadingRecords: boolean = true;
  sortKey: string = "ID";
  sortValue: string = "desc";
  drawerTitle: string;
  drawerData: SystemFeesMaster = new SystemFeesMaster();
  drawerVisible: boolean = false;
  dataList: any[] = [];

  columns: string[][] = [
    ["INT_FEE", "International Fee"],
    ["FED_FEE", "Federation Fee"],
    ["GR_FEE", "Group Fee"],
    ["INT_EMAIL", "International Emails"],
    ["FED_EMAIL", "Federation Emails"],
    ["GR_EMAIL", "Group Emails"],
    ["INT_SMS", "International SMS"],
    ["FED_SMS", "Federation SMS"],
    ["GR_SMS", "Group SMS"],
    ["INT_WA", "International WhatsApp"],
    ["FED_WA", "Federation WhatsApp"],
    ["GR_WA", "Group WhatsApp"]
  ];

  constructor(private api: ApiService, private message: NzNotificationService) { }

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

    var likeQuery = "";

    if (this.searchText != "") {
      likeQuery = " AND (";

      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    this.loadingRecords = true;

    this.api.getAllSystemFees(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.dataList = data['data'];
      }

    }, err => {
      this.loadingRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  add(): void {
    this.drawerTitle = "aaa " + "Create New System Fee Structure";
    this.drawerData = new SystemFeesMaster();
    this.drawerVisible = true;
  }

  edit(data: SystemFeesMaster): void {
    this.drawerTitle = "aaa " + "Update System Fee Structure";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
  }

  drawerClose(): void {
    this.search(true);
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }
}
