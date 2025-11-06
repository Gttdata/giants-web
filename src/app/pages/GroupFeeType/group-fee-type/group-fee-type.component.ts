import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { GroupFeeTypeDrawerComponent } from '../group-fee-type-drawer/group-fee-type-drawer.component';
import { GroupMaster } from 'src/app/Models/GroupMaster';

@Component({
  selector: 'app-group-fee-type',
  templateUrl: './group-fee-type.component.html',
  styleUrls: ['./group-fee-type.component.css']
})

export class GroupFeeTypeComponent implements OnInit {
  formTitle: string = "Group Fee Structure";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList: any[] = [];
  loadingRecords: boolean = true;
  sortKey: string = "ID";
  sortValue: string = "desc";
  searchText: string = "";
  filterQuery: string = "";
  columns: string[][] = [["FEDERATION_NAME", "Federation"], ["UNIT_NAME", "Unit"], ["NAME", "Group"]];
  drawerVisible: boolean;
  drawerTitle: string;
  viewDrawerVisible: boolean = false;
  viewDrawerTitle: string;
  isSpinning: boolean = false;
  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));
  feeDetails: any[] = [];

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService, private _exportService: ExportService) { }

  ngOnInit() {
    this.feeDetails = [
      { FEE_TYPE: 'Joining Fee', QUARTER: 'NA', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      { FEE_TYPE: 'Joining Year Membership Fee', QUARTER: 'Q1', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      { FEE_TYPE: 'Joining Year Membership Fee', QUARTER: 'Q2', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      { FEE_TYPE: 'Joining Year Membership Fee', QUARTER: 'Q3', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      { FEE_TYPE: 'Joining Year Membership Fee', QUARTER: 'Q4', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      // { FEE_TYPE: 'Next Year Membership Fee', QUARTER: 'Q1', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      // { FEE_TYPE: 'Next Year Membership Fee', QUARTER: 'Q2', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      // { FEE_TYPE: 'Next Year Membership Fee', QUARTER: 'Q3', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      // { FEE_TYPE: 'Next Year Membership Fee', QUARTER: 'Q4', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 }
    ];

    this.getInternationFeeStructure();
    this.openFeeStucture();
    this.getGroupInfo(this.groupID);
  }

  currentGroupInfo: GroupMaster = new GroupMaster();

  getGroupInfo(groupID: number): void {
    this.currentGroupInfo = new GroupMaster();

    this.api.getAllGroups(0, 0, "NAME", "asc", " AND ID=" + groupID).subscribe(data => {
      if (data['code'] == 200) {
        this.currentGroupInfo = data['data'][0];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  FEDERATION_ID: any[] = [];
  UNIT_ID: any[] = [];
  GROUP_ID: any[] = [];
  federations: any[] = [];
  internationalFeeStructure: any[] = [];

  getInternationFeeStructure(): void {
    this.api.getAdminFeeStructure(0, 0, "YEAR", "asc", "").subscribe(data => {
      if (data['code'] == 200) {
        this.internationalFeeStructure = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getFederations(): void {
    var federationFilter = "";

    if (this.federationID != 0) {
      federationFilter = " AND ID=" + this.federationID;
    }

    var unitFilter = "";

    if (this.unitID != 0) {
      unitFilter = " AND ID=(SELECT FEDERATION_ID FROM unit_master WHERE ID=" + this.unitID + ")";
    }

    var groupFilter = "";

    if (this.groupID != 0) {
      groupFilter = " AND ID=(SELECT FEDERATION_ID FROM unit_master WHERE ID=(SELECT UNIT_ID FROM group_master WHERE ID=" + this.groupID + "))";
    }

    this.federations = [];

    this.api.getAllFederations(0, 0, "NAME", "asc", " AND STATUS=1" + federationFilter + unitFilter + groupFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.federations = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  units = [];

  getUnits(federationID: any): void {
    var unitFilter = "";

    if (this.unitID != 0) {
      unitFilter = " AND ID=" + this.unitID;
    }

    var groupFilter = "";

    if (this.groupID != 0) {
      groupFilter = " AND ID=(SELECT UNIT_ID FROM group_master WHERE ID=" + this.groupID + ")";
    }

    this.units = [];
    this.UNIT_ID = [];

    this.groups = [];
    this.GROUP_ID = [];

    this.api.getAllUnits(0, 0, "NAME", "asc", " AND FEDERATION_ID IN (" + federationID + ") AND STATUS = 1" + unitFilter + groupFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.units = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  groups = [];

  getGroups(unitID: any): void {
    var groupFilter = "";

    if (this.groupID != 0) {
      groupFilter = " AND ID=" + this.groupID;
    }

    this.groups = [];
    this.GROUP_ID = [];

    this.api.getAllGroups(0, 0, "NAME", "asc", " AND UNIT_ID IN (" + unitID + ") AND STATUS = 1" + groupFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.groups = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
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

    var federationFilter = "";
    if (this.FEDERATION_ID.length > 0) {
      federationFilter = " AND FEDERATION_ID IN (" + this.FEDERATION_ID + ")";
    }

    var unitFilter = "";
    if (this.UNIT_ID.length > 0) {
      unitFilter = " AND UNIT_ID IN (" + this.UNIT_ID + ")";
    }

    var groupFilter = "";
    if (this.GROUP_ID.length > 0) {
      groupFilter = " AND GROUP_ID IN (" + this.GROUP_ID + ")";
    }

    this.loadingRecords = true;

    this.api.getAllGroups(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + federationFilter + unitFilter + groupFilter).subscribe(data => {
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

  onSearching(): void {
    document.getElementById("button1").focus();
    this.search(true);
  }

  today = new Date().setDate(new Date().getDate());

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) > 0;

  disabledExpiryDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) < 0;

  @ViewChild(GroupFeeTypeDrawerComponent, { static: false }) GroupFeeTypeDrawerComponentVar: GroupFeeTypeDrawerComponent;

  addNewFee(): void {
    this.drawerTitle = "aaa " + "Add Group Fee Structure";
    this.drawerVisible = true;
    this.GroupFeeTypeDrawerComponentVar.YEAR = new Date().getFullYear().toString();
    this.GroupFeeTypeDrawerComponentVar.getInternationFeeStructure();
    this.GroupFeeTypeDrawerComponentVar.getGroupInfo(this.groupID);

    this.feeDetails = [
      { FEE_TYPE: 'Joining Fee', QUARTER: 'NA', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      { FEE_TYPE: 'Joining Year Membership Fee', QUARTER: 'Q1', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      { FEE_TYPE: 'Joining Year Membership Fee', QUARTER: 'Q2', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      { FEE_TYPE: 'Joining Year Membership Fee', QUARTER: 'Q3', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      { FEE_TYPE: 'Joining Year Membership Fee', QUARTER: 'Q4', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      // { FEE_TYPE: 'Next Year Membership Fee', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), QUARTER: 'Q1', SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      // { FEE_TYPE: 'Next Year Membership Fee', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), QUARTER: 'Q2', SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      // { FEE_TYPE: 'Next Year Membership Fee', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), QUARTER: 'Q3', SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      // { FEE_TYPE: 'Next Year Membership Fee', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), QUARTER: 'Q4', SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 },
      // { FEE_TYPE: 'System Fee', QUARTER: 'NA', EXPIRY_DATE: new Date(new Date().getFullYear(), 11, 31), SAHELI: 0.00, NORMAL: 0.00, YOUNG: 0.00 }
    ];
  }

  drawerClose(): void {
    this.getInternationFeeStructure();
    this.openFeeStucture();
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  // openFeeStucture(groupData: GroupMaster):void {
  //   this.viewDrawerTitle = "aaa " + "Group Wise Fee Stucture";
  //   this.loadingRecords = true;

  //   this.api.getGroupWiseFeeStructure(0, 0, "ID", "asc", " AND GROUP_ID=" + this.groupID).subscribe(data => {
  //     if ((data['code'] == 200) && (data['data'].length > 0)) {
  //       this.feeDetails = data['data'];
  //       this.loadingRecords = false;
  //       this.viewDrawerVisible = true;

  //     } else {
  //       this.loadingRecords = false;
  //       this.message.info("No Fee Added for " + groupData.NAME, "");
  //     }

  //   }, err => {
  //     this.loadingRecords = false;

  //     if (err['ok'] == false)
  //       this.message.error("Server Not Found", "");
  //   });
  // }

  openFeeStucture(): void {
    this.loadingRecords = true;
    console.log(this.groupID);

    this.api
      .getGroupWiseFeeStructure(0, 0, "YEAR", "asc", " AND GROUP_ID = " + this.groupID)
      .subscribe(data => {
        if ((data['code'] == 200) && (data['data'].length > 0)) {
          this.loadingRecords = false;
          this.feeDetails = data['data'];
          console.log(this.feeDetails);

        } else {
          this.loadingRecords = false;
        }

      }, err => {
        this.loadingRecords = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  viewDrawerClose(): void {
    this.getInternationFeeStructure();
    this.openFeeStucture();
    this.viewDrawerVisible = false;
  }

  get viewDreawerCloseCallback() {
    return this.viewDrawerClose.bind(this);
  }
}
