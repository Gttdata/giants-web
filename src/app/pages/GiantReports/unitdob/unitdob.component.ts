import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Service/api.service';
import { UnitBOD } from 'src/app/Models/unitbod';
import { UnitMaster } from 'src/app/Models/UnitMaster';
import { ViewUnitBodComponent } from '../view-unit-bod/view-unit-bod.component';
import { ExportService } from 'src/app/Service/export.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-unitdob',
  templateUrl: './unitdob.component.html',
  styleUrls: ['./unitdob.component.css']
})

export class UnitdobComponent implements OnInit {
  drawerVisible!: boolean;
  drawerTitle!: string;
  drawerData: UnitBOD = new UnitBOD();
  formTitle: string = " Unit List";
  dataList: any[] = [];
  loadingRecords: boolean = true;
  totalRecords: number = 1;
  pageIndex: number = 1;
  pageSize: number = 10;
  sortKey: string = "UNIT_ID";
  sortValue: string = "desc";
  searchText: string = "";
  groupname: string = '';
  filterQuery: string = "";
  isFilterApplied: any = "default";
  filterClass: string = 'filter-invisible';
  isSpinning: boolean = false;
  selectedDate: Date[] = [];
  selectedUnitName: any = '';
  current = new Date();
  columns: string[][] = [["FEDERATION_NAME", "Federation"], ["UNIT_NAME", "Unit"], ["STATUS", "Active"]];

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  homeFederationID: number = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
  homeUnitID: number = Number(sessionStorage.getItem("HOME_UNIT_ID"));
  homeGroupID: number = Number(sessionStorage.getItem("HOME_GROUP_ID"));

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _exportService: ExportService, private _cookie: CookieService) { }

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

  onKeypressEvent(event: any) {
    document.getElementById('button').focus();
    this.search(true);
  }

  keyup(event: any) {
    this.search();
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

    // Fderation filter
    let federationFilter = "";

    if (this.federationID != 0) {
      federationFilter = " AND FEDERATION_ID=" + this.federationID;
    }

    // Unit filter
    let unitFilter = "";

    if (this.unitID != 0) {
      unitFilter = " AND UNIT_ID=" + this.unitID;
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

    if (exportToExcel) {
      this.exportLoading = true;

      this.api.getAllUnitsTilesDetails(0, 0, this.sortKey, sort, likeQuery + this.filterQuery + federationFilter + unitFilter + federationNameFilter + unitNameFilter).subscribe(data => {
        if (data['code'] == 200) {
          this.exportLoading = false;
          this.dataListForExport = data['data'];
          this.convertInExcel();
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });

    } else if (exportToPDF) {
      this.exportInPDFLoading = true;

      this.api.getAllUnitsTilesDetails(0, 0, this.sortKey, sort, likeQuery + this.filterQuery + federationFilter + unitFilter + federationNameFilter + unitNameFilter).subscribe(data => {
        if (data['code'] == 200) {
          this.exportInPDFLoading = false;
          this.dataListForExport = data['data'];
          this.isPDFModalVisible = true;
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });

    } else {
      this.loadingRecords = true;

      this.api.getAllUnitsTilesDetails(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + this.filterQuery + federationFilter + unitFilter + federationNameFilter + unitNameFilter).subscribe(data => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
        }

      }, err => {
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

  @ViewChild(ViewUnitBodComponent, { static: false }) ViewUnitBodComponentVar: ViewUnitBodComponent;

  viewBOD(data: UnitMaster): void {
    this.memberDrawerTitle = "aaa " + "Unit Members";
    this.memberDrawerData = Object.assign({}, data);
    this.memberDrawerVisible = true;
    this.ViewUnitBodComponentVar.getData1(data);
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

  importInExcel() {
    this.search(true, true);
  }

  convertInExcel() {
    var arry1 = [];
    var obj1: any = new Object();

    for (var i = 0; i < this.dataListForExport.length; i++) {
      obj1['Federation'] = this.dataListForExport[i]['FEDERATION_NAME'];
      obj1['Unit'] = this.dataListForExport[i]['UNIT_NAME'];
      obj1['Status'] = ((this.dataListForExport[i]['STATUS'] == '1') ? 'Active' : 'In-active');

      arry1.push(Object.assign({}, obj1));

      if (i == this.dataListForExport.length - 1) {
        this._exportService.exportExcel(arry1, 'Unit Wise Details ' + this.datePipe.transform(new Date(), 'dd-MMM-yy, hh mm ss a'));
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
    this.search(true);
  }
}