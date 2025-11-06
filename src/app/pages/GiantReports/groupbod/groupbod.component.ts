import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Service/api.service';
import { GroupMaster } from 'src/app/Models/GroupMaster';
import { ViewGroupBodComponent } from '../view-group-bod/view-group-bod.component';
import { CookieService } from 'ngx-cookie-service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-groupbod',
  templateUrl: './groupbod.component.html',
  styleUrls: ['./groupbod.component.css']
})

export class GroupbodComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  formTitle: string = " Group List";
  dataList: any[] = [];
  loadingRecords: boolean = true;
  totalRecords: number = 1;
  pageIndex: number = 1;
  pageSize: number = 10;
  sortKey: string = "UNIT_ID";
  sortValue: string = "desc";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: any = "default";
  filterClass: string = 'filter-invisible';
  columns: string[][] = [["FEDERATION_NAME", "Federation"], ["UNIT_NAME", "Unit"], ["GROUP_NAME", "Group"], ["STATUS", "Active"]];

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  homeFederationID: number = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
  homeUnitID: number = Number(sessionStorage.getItem("HOME_UNIT_ID"));
  homeGroupID: number = Number(sessionStorage.getItem("HOME_GROUP_ID"));

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService, private _exportService: ExportService) { }

  ngOnInit(): void {
    this.loadingRecords = false;

    this.federationID = Number(sessionStorage.getItem("FEDERATION_ID"));
    this.unitID = Number(sessionStorage.getItem("UNIT_ID"));
    this.groupID = Number(sessionStorage.getItem("GROUP_ID"));

    this.homeFederationID = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
    this.homeUnitID = Number(sessionStorage.getItem("HOME_UNIT_ID"));
    this.homeGroupID = Number(sessionStorage.getItem("HOME_GROUP_ID"));

    this.search(true);
  }

  search(reset: boolean = false, exportToExcel: boolean = false, exportToPDF: boolean = false) {
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

      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ")";
    }

    // Federation filter
    var federationFilter = "";

    if (this.federationID != 0) {
      federationFilter = " AND FEDERATION_ID=" + this.federationID;
    }

    // Unit filter
    var unitFilter = "";

    if (this.unitID != 0) {
      unitFilter = " AND UNIT_ID=" + this.unitID;
    }

    // Group filter
    var groupFilter = "";

    if (this.groupID != 0) {
      groupFilter = " AND GROUP_ID=" + this.groupID;
    }

    // Federation name filter
    let federationNameFilter = "";

    if (this.FEDERATION_NAME.length > 0) {
      federationNameFilter = " AND FEDERATION_ID IN (" + this.FEDERATION_NAME.toString() + ")";
    }

    // Unit name filter
    let unitNameFilter = "";

    if (this.UNIT_NAME.length > 0) {
      unitNameFilter = " AND UNIT_ID IN (" + this.UNIT_NAME.toString() + ")";
    }

    // Unit name filter
    let groupNameFilter = "";

    if (this.GROUP_NAME.length > 0) {
      groupNameFilter = " AND GROUP_ID IN (" + this.GROUP_NAME.toString() + ")";
    }

    if (exportToExcel) {
      this.exportLoading = true;

      this.api.getAllGroupsTilesDetails(0, 0, this.sortKey, sort, likeQuery + federationFilter + unitFilter + groupFilter + federationNameFilter + unitNameFilter + groupNameFilter).subscribe(data => {
        if (data['code'] == 200) {
          this.exportLoading = false;
          this.dataListForExport = data['data'];
          this.convertInExcel();
        }

      }, err => {
        this.exportLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });

    } else if (exportToPDF) {
      this.exportInPDFLoading = true;

      this.api.getAllGroupsTilesDetails(0, 0, this.sortKey, sort, likeQuery + federationFilter + unitFilter + groupFilter + federationNameFilter + unitNameFilter + groupNameFilter).subscribe(data => {
        if (data['code'] == 200) {
          this.exportInPDFLoading = false;
          this.dataListForExport = data['data'];
          this.isPDFModalVisible = true;
        }

      }, err => {
        this.exportInPDFLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });

    } else {
      this.loadingRecords = true;

      this.api.getAllGroupsTilesDetails(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + federationFilter + unitFilter + groupFilter + federationNameFilter + unitNameFilter + groupNameFilter).subscribe(data => {
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
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true);
  }

  memberDrawerTitle: string;
  memberDrawerData: any;
  memberDrawerVisible: boolean = false;
  @ViewChild(ViewGroupBodComponent, { static: false }) ViewGroupBodComponentVar: ViewGroupBodComponent;

  viewBOD(data: GroupMaster): void {
    this.memberDrawerTitle = "aaa " + "Group Members";
    this.memberDrawerData = Object.assign({}, data);
    this.memberDrawerVisible = true;
    this.ViewGroupBodComponentVar.getData1(data);
  }

  memberDrawerClose(): void {
    this.memberDrawerVisible = false;
    this.search(false);
  }

  get memberDrawerCloseCallback() {
    return this.memberDrawerClose.bind(this);
  }

  exportLoading: boolean = false;
  dataListForExport: any[] = [];
  exportInPDFLoading: boolean = false;
  isPDFModalVisible: boolean = false;

  importInExcel(): void {
    this.search(true, true);
  }

  convertInExcel(): void {
    var arry1 = [];
    var obj1: any = new Object();

    for (var i = 0; i < this.dataListForExport.length; i++) {
      obj1['Federation'] = this.dataListForExport[i]['FEDERATION_NAME'];
      obj1['Unit'] = this.dataListForExport[i]['UNIT_NAME'];
      obj1['Group'] = this.dataListForExport[i]['GROUP_NAME'];
      obj1['Status'] = (this.dataListForExport[i]['STATUS'] == '1' ? 'Active' : 'In-active');

      arry1.push(Object.assign({}, obj1));

      if (i == this.dataListForExport.length - 1) {
        this._exportService.exportExcel(arry1, 'Group Wise Details ' + this.datePipe.transform(new Date(), 'dd-MMM-yy, hh mm ss a'));
      }
    }
  }

  units: any[] = [];
  UNIT_NAME: any[] = [];
  isUnitLoading: boolean = false;

  getUnits(unitName: string): void {
    if (unitName.length >= 3) {
      // Fderation filter
      let federationFilter = "";

      if (this.federationID > 0) {
        federationFilter = " AND FEDERATION_ID=" + this.federationID;
      }

      // Unit filter
      let unitFilter = "";

      if (this.unitID > 0) {
        unitFilter = " AND FEDERATION_ID=" + this.homeFederationID + " AND ID=" + this.unitID;
      }

      this.isUnitLoading = true;

      this.api.getAllUnits(0, 0, "ID", "ASC", " AND STATUS=1 AND NAME LIKE '%" + unitName + "%'" + federationFilter + unitFilter).subscribe(data => {
        if (data['code'] == 200) {
          this.isUnitLoading = false;
          this.units = data['data'];
        }

      }, err => {
        this.isUnitLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  getUnitInfo(unitNames: any): void {
    this.search(true);
  }

  federations: any[] = [];
  FEDERATION_NAME: any[] = [];
  isFederationLoading: boolean = false;

  getFederations(federationName: string): void {
    if (federationName.length >= 3) {
      // Fderation filter
      let federationFilter = "";

      if (this.federationID > 0) {
        federationFilter = " AND ID=" + this.federationID;
      }

      this.isFederationLoading = true;

      this.api.getAllFederations(0, 0, "ID", "ASC", " AND STATUS=1 AND NAME LIKE '%" + federationName + "%'" + federationFilter).subscribe(data => {
        if (data['code'] == 200) {
          this.isFederationLoading = false;
          this.federations = data['data'];
        }

      }, err => {
        this.isFederationLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  getFederationInfo(federationNames: any): void {
    this.units = [];
    this.UNIT_NAME = [];
    this.groups = [];
    this.GROUP_NAME = [];
    this.search(true);
  }

  groups: any[] = [];
  GROUP_NAME: any[] = [];
  isGroupLoading: boolean = false;

  getGroups(groupName: string): void {
    if (groupName.length >= 3) {
      // Fderation filter
      let federationFilter = "";

      if (this.federationID > 0) {
        federationFilter = " AND FEDERATION_ID=" + this.federationID;
      }

      // Unit filter
      let unitFilter = "";

      if (this.unitID > 0) {
        unitFilter = " AND UNIT_ID=" + this.unitID;
      }

      // Group filter
      let groupFilter = "";

      if (this.groupID > 0) {
        groupFilter = " AND ID=" + this.homeGroupID;
      }

      this.isGroupLoading = true;

      this.api.getAllGroups(0, 0, "ID", "ASC", " AND STATUS=1 AND NAME LIKE '%" + groupName + "%'" + federationFilter + unitFilter + groupFilter).subscribe(data => {
        if (data['code'] == 200) {
          this.isGroupLoading = false;
          this.groups = data['data'];
        }

      }, err => {
        this.isGroupLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  getGroupInfo(groupName: any): void {
    this.search(true);
  }

  getColumnAlign(columnName: string): string {
    if (columnName == "GROUP_NAME") {
      return 'leftAlign';

    } else {
      return 'centerAlign';
    }
  }
}