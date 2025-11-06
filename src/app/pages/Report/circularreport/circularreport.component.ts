import { DatePipe } from '@angular/common';
import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';
import { REPORTSCHEDULE } from 'src/app/Models/report-schedule';

@Component({
  selector: 'app-circularreport',
  templateUrl: './circularreport.component.html',
  styleUrls: ['./circularreport.component.css']
})

export class CircularreportComponent implements OnInit {
  formTitle: string = "Circular Report";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList: any[] = [];
  loadingRecords: boolean = true;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  columns: string[][] = [
    ["FEDERATION_NAME", "Federation Name"], ["UNIT_NAME", "Unit Name"], ["GROUP_NAME", "Group Name"], ["CIRCULAR_TYPE_NAME", "Circular Type"], ["CREATOR_NAME", "Circular Creatror"],
    ["DATE", "Create Date"], ["APPROVAL_DATETIME", "Publish Date"], ["STATUS", "Status"]];
  isSpinning: boolean = false;
  federationID = Number(this._cookie.get('FEDERATION_ID'));
  unitID = Number(this._cookie.get('UNIT_ID'));
  groupID = Number(this._cookie.get('GROUP_ID'));
  eventValue = [];
  isDisplay: boolean = false;
  tagValue: string[] = ["Federation Name", "Unit Name", "Group Name", "Circular Type", "Circular  Creator", "No. Of.Providers", "Create Date", "Publish Date", "Status"];
  tagValue1: string[] = ["Select All", "Federation Name", "Unit Name", "Group Name", "Circular Type", "Circular  Creator", "No. Of.Providers", "Create Date", "Publish Date", "Status"];
  Operators: string[][] = [['Between', 'Between'], ["=", "="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["!=", "!="]];
  Operators1: string[][] = [["Start With", "Start With"], ['End With', 'End With'], ['Content', 'Content'], ['=', '='], ['!=', '!=']];
  Operators2: string[][] = [["BETWEEN", "BETWEEN"], ["=", "="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["!=", "!="]];
  VALUE = [];
  SelectedValue = "BETWEEN";
  yearrange = [];
  year = new Date().getFullYear();
  baseYear: number = 2020;
  Next_Year = Number(this.year + 1);
  isVisible = false;
  isVisible3 = false;
  isVisible4 = false;
  isVisible5 = false;
  isVisible6 = false;
  isVisible7 = false;
  isVisible8 = false;
  isVisible9 = false;
  isVisible10 = false;
  SelectColumn = [];
  SelectColumn1 = [];
  Col1: boolean = true;
  Col2: boolean = true;
  Col3: boolean = true;
  Col4: boolean = true;
  Col5: boolean = true;
  Col6: boolean = true;
  Col7: boolean = true;
  Col8: boolean = true;
  Col9: boolean = true;
  Col10: boolean = true;
  isVisiblepdf: boolean = false;
  exportInPDFLoading1: boolean = false
  Column1: string;
  Column2: string;
  INPUT1 = "";
  FirstButton = "";
  SecondButton = "";
  abc = "";
  val2 = "";
  abc2 = "";
  filter = "";
  filter1 = "";
  model = "";
  nextfield = true;
  obj = "";
  obj2 = "";
  exportLoading: boolean = false;
  dataListForExport: any[] = [];
  exportInPDFLoading: boolean = false;
  exportLoading1: boolean = false;
  isPDFModalVisible: boolean = false;
  next_year = Number(this.year + 1);
  SelectedYear: any;
  values: any[] = [];
  values1: any[] = [];
  values2: any[] = [];
  values3: any[] = [];
  values4: any[] = [];
  values5: any[] = [];
  values6: any[] = [];
  values7: any[] = [];
  values8: any[] = [];
  event = [];
  drawerData1: REPORTSCHEDULE = new REPORTSCHEDULE();
  drawerTitle1: string;
  drawerVisible1: boolean = false;
  ClickAddFilterGroup = false
  ClickAddFilterGroup1 = false;
  ClickAddFilterGroup3 = false;
  selectedFormName: any;
  a = new Date();
  b = new Date(this.a.getFullYear() + 1, 3, 1);
  Operator_Status: string[][] = [["P", "Pending"], ["A", "Active"]];
  Operators_Status: string[][] = [["=", "="], ["<>", "!="]];
  mainFilterStatusArray = [];
  filterStatus = '';

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService, private _exportService: ExportService) { }

  public handlePrint(): void {
    const printContents = document.getElementById('modal').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  }

  Fordate() {
    let currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= this.baseYear; i--) {
      this.yearrange.push(i);
    }
  }

  current_year() {
    this.SelectedYear = new Date().getFullYear();
  }

  ngOnInit() {
    this.Fordate();
    this.search(true);
    this.getCircular();
    this.current_year();

    this.values.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.values1.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.values2.push({
      filter: [{
        DATE: "", DROPDOWN: '', DATE2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.values3.push({
      filter: [{
        DATE: "", DROPDOWN: '', DATE2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.values4.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.values5.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.values6.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.values7.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.values8.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.mainFilterStatusArray.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: "", buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });
  }

  SelectYear(YEAR: any) {
    this.SelectedYear = YEAR;
    this.getCircular();
  }

  ModelName: string = "";

  showModal(): void {
    this.isVisible = true;
    this.model = "CIRCULAR_TYPE_NAME";
    this.ModelName = "Circular Type";
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  showModal1(): void {
    this.isVisible3 = true;
    this.model = "NO_OF_PROVIDERS";
    this.ModelName = "No.Of.Providers Filter";
  }

  handleOk3(): void {
    this.isVisible3 = false;
  }

  handleCancel3(): void {
    this.isVisible3 = false;
  }

  showModal2(): void {
    this.isVisible4 = true;
    this.model = "APPROVAL_DATETIME";
    this.ModelName = "Publish Date Filter";
  }

  handleOk4(): void {
    this.isVisible4 = false;
  }

  handleCancel4(): void {
    this.isVisible4 = false;
  }

  showModal3(): void {
    this.isVisible5 = true;
    this.model = "DATE";
    this.ModelName = "Circular date  Filter";
  }

  handleOk5(): void {
    this.isVisible5 = false;
  }

  handleCancel5(): void {
    this.isVisible5 = false;
  }

  showModal4(): void {
    this.isVisible6 = true;
    this.model = "CREATOR_NAME";
    this.ModelName = "Circular Creartor Filter";
  }

  handleOk6(): void {
    this.isVisible6 = false;
  }

  handleCancel6(): void {
    this.isVisible6 = false;
  }

  showModal5(i: any): void {
    this.isVisible7 = true;
    this.model = "EVENT_VANUE";
    this.ModelName = "Event Vanue Filter";
  }

  handleOk7(): void {
    this.isVisible7 = false;
  }

  handleCancel7(): void {
    this.isVisible7 = false;
  }

  showModal6(): void {
    this.isVisible8 = true;
    this.model = "FEDERATION_NAME";
    this.ModelName = "Event Federation Filter";
  }

  handleOk8(): void {
    this.isVisible8 = false;
  }

  handleCancel8(): void {
    this.isVisible8 = false;
  }

  showModal7(): void {
    this.isVisible9 = true;
    this.model = "UNIT_NAME";
    this.ModelName = "Unit Name Filter";
  }

  handleOk9(): void {
    this.isVisible9 = false;
  }

  handleCancel9(): void {
    this.isVisible9 = false;
  }

  Group;

  showModal9(): void {
    this.isVisible10 = true;
    this.model = "GROUP_NAME";
    this.ModelName = "Group Name Filter";
  }

  handleOk10(): void {
    this.isVisible10 = false;
  }

  handleCancel10(): void {
    this.isVisible10 = false;
  }

  handleCancel1(): void {
    this.isVisiblepdf = false;
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true);
  }

  search(reset: boolean = false, exportToExcel: boolean = false, exportToPDF: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }

    var sort: string;
    try {
      this.sortValue = this.sortValue.startsWith("a") ? "asc" : "desc";

    } catch (error) {
      sort = "";
    }

    var likeQuery = "";
    if (this.searchText != "") {
      likeQuery = " AND";
      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2);
    }

    if (this.FilterQuery != "") {
      var filters = this.FilterQuery;

    } else {
      filters = '';
    }

    if (exportToExcel) {
      this.exportLoading = true;

      this.api.getCircularreport(0, 0, this.sortKey, this.sortValue, filters, this.SelectedYear, "", this.federationID, this.unitID, this.groupID).subscribe(data => {
        if (data['code'] == 200) {
          this.exportLoading = false;
          this.dataListForExport = data['data'];
          this.convertInExcel();
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }

    else if (exportToPDF) {
      this.exportInPDFLoading1 = true;

      this.api.getCircularreport(0, 0, this.sortKey, this.sortValue, filters, this.SelectedYear, "", this.federationID, this.unitID, this.groupID).subscribe(data => {
        if (data['code'] == 200) {
          this.exportInPDFLoading1 = false;
          this.dataList = data['data'];
          this.isPDFModalVisible = true;
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }

    else {
      this.loadingRecords = true;

      this.api.getCircularreport(0, 0, this.sortKey, this.sortValue, filters, this.SelectedYear, "", this.federationID, this.unitID, this.groupID).subscribe(data => {
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

  getCircular() {
    this.api.getCircularreport(0, 0, this.sortKey, this.sortValue, "", this.SelectedYear, "", this.federationID, this.unitID, this.groupID).subscribe(data => {
      if ((data['code'] == 200)) {
        this.dataList = data['data'];
        this.loadingRecords = false;

      } else {
        this.message.error("Server Not Found", "");
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getCircularFilter() {
    this.FilterQuery = this.filtername + this.filterPublishDate + this.filterCreateDate + this.filterCreator + this.filterFederation + this.filterUnit + this.filterGroup + this.eventfilterstatus;

    this.api.getCircularreport(0, 0, this.sortKey, this.sortValue, "", this.SelectedYear, this.FilterQuery, this.federationID, this.unitID, this.groupID).subscribe(data => {
      if ((data['code'] == 200)) {
        this.dataList = data['data'];
        this.loadingRecords = false;

      } else {
        this.message.error("Server Not Found", "");
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  onSearching() {
    document.getElementById("button1").focus();
    this.search(true);
  }

  MEMBERSHIP_START_DATE: any[] = [];
  MEMBERSHIP_EXPIRY_DATE: any[] = [];
  FEDERATION_ID: any[] = [];
  UNIT_ID: any[] = [];
  GROUP_ID: any[] = [];

  importInExcel() {
    this.search(true, true);
  }

  importInPdf() {
    this.search(true, false, true);
    this.isVisiblepdf = true;
  }

  convertInExcel() {
    var arry1 = [];
    var obj1: any = new Object();

    for (var i = 0; i < this.dataListForExport.length; i++) {
      obj1['Federation Name'] = this.dataListForExport[i]['FEDERATION_NAME'];
      obj1['Unit Name'] = this.dataListForExport[i]['UNIT_NAME'];
      obj1['Group Name'] = this.dataListForExport[i]['GROUP_NAME'];

      if (this.Col4 == true) { obj1['Circular Type'] = this.dataListForExport[i]['CIRCULAR_TYPE_NAME'] };
      if (this.Col5 == true) { obj1['Circular Creator'] = this.dataListForExport[i]['CREATOR_NAME'] };
      if (this.Col7 == true) { obj1['Create Date'] = this.datePipe.transform(this.dataListForExport[i]['DATE'], 'dd-MMM-yyyy') };
      if (this.Col8 == true) { obj1['Publish Date'] = this.datePipe.transform(this.dataListForExport[i]['APPROVAL_DATETIME'], "dd-MMM-yyyy") };
      if (this.Col9 == true) { obj1['Status'] = this.dataListForExport[i]['STATUS'] == "P" ? "Pending" : "Active" };

      arry1.push(Object.assign({}, obj1));
      if (i == this.dataListForExport.length - 1) {
        this._exportService.exportExcel(arry1, 'Circular Report' + this.datePipe.transform(new Date(), 'dd-MMM-yy, hh mm ss a'));
      }
    }
  }

  applyAnd(i: any) {
    this.values[i]['buttons']['AND'] = true;
    this.values[i]['buttons']['OR'] = false;
  }

  applyOr(i: any) {
    this.values[i]['buttons']['AND'] = false;
    this.values[i]['buttons']['OR'] = true;
  }

  applyAnd1(i: any, j: any) {
    this.values[i]['filter'][j]['buttons']['OR'] = false;
    this.values[i]['filter'][j]['buttons']['AND'] = true;
  }

  applyOr2(i: any, j: any) {
    this.values[i]['filter'][j]['buttons']['OR'] = true;
    this.values[i]['filter'][j]['buttons']['AND'] = false;
  }

  applyFirst(i: any) {
    this.values1[i]['buttons']['AND'] = true;
    this.values1[i]['buttons']['OR'] = false;
  }

  applySecond(i: any) {
    this.values1[i]['buttons']['AND'] = false;
    this.values1[i]['buttons']['OR'] = true;
  }

  applyAnd3(i: any, j: any) {
    this.values1[i]['filter'][j]['buttons']['OR'] = false;
    this.values1[i]['filter'][j]['buttons']['AND'] = true;
  }

  applyOr3(i: any, j: any) {
    this.values1[i]['filter'][j]['buttons']['OR'] = true;
    this.values1[i]['filter'][j]['buttons']['AND'] = false;
  }

  applyAttendanceFirst(i: any) {
    this.values3[i]['buttons']['AND'] = true;
    this.values3[i]['buttons']['OR'] = false;
  }

  applyAttendanceSecond(i: any) {
    this.values3[i]['buttons']['AND'] = false;
    this.values3[i]['buttons']['OR'] = true;
  }

  applyAttendanceAnd3(i: any, j: any) {
    this.values3[i]['filter'][j]['buttons']['OR'] = false;
    this.values3[i]['filter'][j]['buttons']['AND'] = true;
  }

  applyAttendanceOr3(i: any, j: any) {
    this.values3[i]['filter'][j]['buttons']['OR'] = true;
    this.values3[i]['filter'][j]['buttons']['AND'] = false;
  }

  dateAnd(i: any) {
    this.values2[i]['buttons']['AND'] = true;
    this.values2[i]['buttons']['OR'] = false;
  }

  dateOr(i: any) {
    this.values2[i]['buttons']['AND'] = false;
    this.values2[i]['buttons']['OR'] = true;
  }

  applydate1(i: any, j: any) {
    this.values2[i]['filter'][j]['buttons']['OR'] = false;
    this.values2[i]['filter'][j]['buttons']['AND'] = true;
  }

  applydate2(i: any, j: any) {
    this.values2[i]['filter'][j]['buttons']['OR'] = true;
    this.values2[i]['filter'][j]['buttons']['AND'] = false;
  }

  applyCreatorFirst(i: any) {
    this.values4[i]['buttons']['AND'] = true;
    this.values4[i]['buttons']['OR'] = false;
  }

  applyCreatorSecond(i: any) {
    this.values4[i]['buttons']['AND'] = false;
    this.values4[i]['buttons']['OR'] = true;
  }

  applyCreatorAnd3(i: any, j: any) {
    this.values4[i]['filter'][j]['buttons']['OR'] = false;
    this.values4[i]['filter'][j]['buttons']['AND'] = true;
  }

  applyCreatorOr3(i: any, j: any) {
    this.values4[i]['filter'][j]['buttons']['OR'] = true;
    this.values4[i]['filter'][j]['buttons']['AND'] = false;
  }

  //Event Vanue
  applyVanueFirst(i: any) {
    this.values5[i]['buttons']['AND'] = true;
    this.values5[i]['buttons']['OR'] = false;
  }

  applyVanueSecond(i: any) {
    this.values5[i]['buttons']['AND'] = false;
    this.values5[i]['buttons']['OR'] = true;
  }

  applyVanueAnd3(i: any, j: any) {
    this.values5[i]['filter'][j]['buttons']['OR'] = false;
    this.values5[i]['filter'][j]['buttons']['AND'] = true;
  }

  applyVanueOr3(i: any, j: any) {
    this.values5[i]['filter'][j]['buttons']['OR'] = true;
    this.values5[i]['filter'][j]['buttons']['AND'] = false;
  }

  //federation
  applyFederationFirst(i: any) {
    this.values6[i]['buttons']['AND'] = true;
    this.values6[i]['buttons']['OR'] = false;
  }

  applyFederationSecond(i: any) {
    this.values6[i]['buttons']['AND'] = false;
    this.values6[i]['buttons']['OR'] = true;
  }

  applyFederationAnd3(i: any, j: any) {
    this.values6[i]['filter'][j]['buttons']['OR'] = false;
    this.values6[i]['filter'][j]['buttons']['AND'] = true;
  }

  applyFederationOr3(i: any, j: any) {
    this.values6[i]['filter'][j]['buttons']['OR'] = true;
    this.values6[i]['filter'][j]['buttons']['AND'] = false;
  }

  //unit
  applyUnitFirst(i: any) {
    this.values7[i]['buttons']['AND'] = true;
    this.values7[i]['buttons']['OR'] = false;
  }

  applyUnitSecond(i: any) {
    this.values7[i]['buttons']['AND'] = false;
    this.values7[i]['buttons']['OR'] = true;
  }

  applyUnitAnd3(i: any, j: any) {
    this.values7[i]['filter'][j]['buttons']['OR'] = false;
    this.values7[i]['filter'][j]['buttons']['AND'] = true;
  }

  applyUnitOr3(i: any, j: any) {
    this.values7[i]['filter'][j]['buttons']['OR'] = true;
    this.values7[i]['filter'][j]['buttons']['AND'] = false;
  }

  //Group
  applyGroupFirst(i: any) {
    this.values8[i]['buttons']['AND'] = true;
    this.values8[i]['buttons']['OR'] = false;
  }

  applyGroupSecond(i: any) {
    this.values8[i]['buttons']['AND'] = false;
    this.values8[i]['buttons']['OR'] = true;
  }

  applyGroupAnd3(i: any, j: any) {
    this.values8[i]['filter'][j]['buttons']['OR'] = false;
    this.values8[i]['filter'][j]['buttons']['AND'] = true;
  }

  applyGroupOr3(i: any, j: any) {
    this.values8[i]['filter'][j]['buttons']['OR'] = true;
    this.values8[i]['filter'][j]['buttons']['AND'] = false;
  }

  //no.of.invities
  CloseCount(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.values1.splice(i, 1);
      return true;
    }
  }

  CloseCount1(i: any, j: any) {
    if (this.values1[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.values1[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterMeetCount(i: any, j: any) {
    this.values1[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  AddFilterCount() {
    this.values1.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
  }

  //circular TYpe
  CloseEventCount1(i: any, j: any) {
    if (this.values[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.values[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterEventCount(i: any, j: any) {
    this.values[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  AddFilterEventCount1() {
    this.values.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
  }

  CloseGroup(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.values.splice(i, 1);
      return true;
    }
  }

  //Circular Publish date
  CloseDateCount1(i: any, j: any) {
    if (this.values2[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.values2[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterDateCount(i: any, j: any) {
    this.values2[i]['filter'].push({
      DATE: "", DROPDOWN: '', DATE2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  AddFilterDateCount1() {
    this.values2.push({
      filter: [{
        DATE: "", DROPDOWN: '', DATE2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
  }

  CloseGroup4(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.values2.splice(i, 1);
      return true;
    }
  }

  //event attendance
  CloseAttendanceCount(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.values3.splice(i, 1);
      return true;
    }
  }
  CloseAttendanceCount1(i: any, j: any) {
    if (this.values3[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.values3[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterAttendanceCount(i: any, j: any) {
    this.values3[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  AddFilterAttendanceCount1() {
    this.values3.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
  }

  //Circular Creator
  CloseCreatorCount(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.values4.splice(i, 1);
      return true;
    }
  }

  CloseCreatorCount1(i: any, j: any) {
    if (this.values4[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.values4[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterCreatorCount(i: any, j: any) {
    this.values4[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  AddFilterCreatorCount1() {
    this.values4.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
  }

  //Event Vanue
  CloseVanueCount(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.values5.splice(i, 1);
      return true;
    }
  }
  CloseVanueCount1(i: any, j: any) {
    if (this.values5[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.values5[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterVanueCount(i: any, j: any) {
    this.values5[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  AddFilterVanueCount1() {
    this.values5.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
  }

  //Federation
  CloseFederationCount(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.values6.splice(i, 1);
      return true;
    }
  }
  CloseFederationCount1(i: any, j: any) {
    if (this.values6[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.values6[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterFederationCount(i: any, j: any) {
    this.values6[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  AddFilterFederationCount1() {
    this.values6.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
  }

  //Unit
  CloseUnitCount(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.values7.splice(i, 1);
      return true;
    }
  }
  CloseUnitCount1(i: any, j: any) {
    if (this.values7[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.values7[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterUnitCount(i: any, j: any) {
    this.values7[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  AddFilterUnitCount1() {
    this.values7.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
  }

  //Group
  CloseGroupCount(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.values8.splice(i, 1);
      return true;
    }
  }

  CloseGroupCount1(i: any, j: any) {
    if (this.values8[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.values8[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterGroupCount(i: any, j: any) {
    this.values8[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  AddFilterGroupCount1() {
    this.values8.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
  }

  getActiveStatus(status) {
    if (status == "P")
      return "Pending";

    else
      return "Active";
  }

  ClearFilter() {
    this.values = [];
    this.values.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.FilterQuery = '';
    this.getCircular();
  }

  ClearFilter2() {
    this.values1 = [];
    this.values1.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.FilterQuery = '';
    this.getCircular();
  }

  ClearFilter3() {
    this.values2 = [];
    this.values2.push({ filter: [{ DATE: "", DROPDOWN: '', DATE2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.FilterQuery = '';
    this.getCircular();
  }

  ClearFilter4() {
    this.values3 = [];
    this.values3.push({ filter: [{ DATE: "", DROPDOWN: '', DATE2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.FilterQuery = '';
    this.getCircular();
  }

  ClearFilter5() {
    this.values4 = [];
    this.values4.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.FilterQuery = '';
    this.getCircular();
  }

  ClearFilter6() {
    this.values5 = [];
    this.values5.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.FilterQuery = '';
    this.getCircular();
  }

  ClearFilter7() {
    this.values6 = [];
    this.values6.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.FilterQuery = '';
    this.getCircular();
  }

  ClearFilter8() {
    this.values7 = [];
    this.values7.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.FilterQuery = '';
    this.getCircular();
  }

  ClearFilter9() {
    this.values8 = [];
    this.values8.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.FilterQuery = '';
    this.getCircular();
  }

  ClearAllFilter() {
    this.values = [];
    this.values1 = [];
    this.values2 = [];
    this.values3 = [];
    this.values4 = [];
    this.values5 = [];
    this.values6 = [];
    this.values7 = [];
    this.values8 = [];
    this.mainFilterStatusArray = []
    this.filtername = '';
    this.filterPublishDate = '';
    this.filterCreateDate = '';
    this.filterCreator = '';
    this.filterFederation = '';
    this.filterUnit = '';
    this.filterGroup = '';
    this.eventfilterstatus = '';

    this.values.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.values1.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.values2.push({
      filter: [{
        DATE: "", DROPDOWN: '', DATE2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.values3.push({
      filter: [{
        DATE: "", DROPDOWN: '', DATE2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.values4.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.values5.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.values6.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.values7.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.values8.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.mainFilterStatusArray.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: "", buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.getCircular();
  }

  filtersCircularCount1 = '';

  ApplyFilter() {
    if (this.values.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";

      for (let i = 0; i < this.values.length; i++) {
        Button = "";
        if (this.values.length > 0) {
          if (this.values[i]['buttons']['AND'] != undefined) {
            if (this.values[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.values.length > 0) {
          if (this.values[i]['buttons']['OR'] != undefined) {
            if (this.values[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.values[i]['filter'].length; j++) {
          var Button1 = "((";
          if (this.values[i]['filter'].length > 0) {
            if (this.values[i]['filter'][j]['buttons']['AND'] == true) {
              Button1 = ")" + " AND " + "(";
              Button = "";

            }
          }

          if (this.values[i]['filter'].length > 0) {
            if (this.values[i]['filter'][j]['buttons']['OR'] == true) {
              Button1 = ")" + " OR " + "(";
              Button = "";
            }
          }

          var condition = '';

          if (this.values[i]['filter'][j]['DROPDOWN'] == "Start With" || this.values[i]['filter'][j]['DROPDOWN'] == "End With" || this.values[i]['filter'][j]['DROPDOWN'] == "Content") {
            if (this.values[i]['filter'][j]['DROPDOWN'] == "Start With") {
              condition = "LIKE" + "'" + this.values[i]['filter'][j]['INPUT'] + "%'";

            } else if (this.values[i]['filter'][j]['DROPDOWN'] == "End With") {
              condition = "LIKE" + "'%" + this.values[i]['filter'][j]['INPUT'] + "'";

            } else {
              condition = "LIKE" + " '%" + this.values[i]['filter'][j]['INPUT'] + "%'";
            }

            this.filtersCircularCount1 = Button + Button1 + ' ' + this.model + " " + condition + " ";

          } else {
            this.filtersCircularCount1 = Button + Button1 + ' ' + this.model + " " + this.values[i]['filter'][j]['DROPDOWN'] + " '" + this.values[i]['filter'][j]['INPUT'] + "'";
          }

          this.filter = this.filter + this.filtersCircularCount1;
        }

        this.filter = this.filter + "))";
      }

      this.filtername = ' AND ' + this.filter;
      this.getCircularFilter();
      this.isVisible = false;
    }

    else {
      this.getCircularFilter();
      this.isVisible = false;
    }
  }

  filtersCircularCount = '';

  ApplyFilter2() {
    if (this.values1.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";

      for (let i = 0; i < this.values1.length; i++) {
        if (this.values1.length > 0) {
          if (this.values1[i]['buttons']['AND'] != undefined) {
            if (this.values1[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.values1.length > 0) {
          if (this.values1[i]['buttons']['OR'] != undefined) {
            if (this.values1[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.values1[i]['filter'].length; j++) {
          var Button1 = "((";
          if (this.values1[i]['filter'].length > 0) {
            if (this.values1[i]['filter'][j]['buttons']['AND'] == true) {
              Button1 = ")" + " AND " + "(";
            }
          }

          if (this.values1[i]['filter'].length > 0) {
            if (this.values1[i]['filter'][j]['buttons']['OR'] == true) {
              Button1 = ")" + " OR " + "(";
            }
          }

          if (this.values1[i]['filter'][j]['DROPDOWN'] == "Between") {
            this.filtersCircularCount = Button + Button1 + ' ' + this.model + " " + this.values1[i]['filter'][j]['DROPDOWN'] + " '" + this.values1[i]['filter'][j]['INPUT'] + "' AND '" + this.values1[i]['filter'][j]['INPUT2'] + "'";

          } else {
            this.filtersCircularCount = Button + Button1 + ' ' + this.model + " " + this.values1[i]['filter'][j]['DROPDOWN'] + " '" + this.values1[i]['filter'][j]['INPUT'] + "'";
          }

          this.filter = this.filter + this.filtersCircularCount;
        }

        this.filter = this.filter + "))";
      }

    } else {
      this.getCircularFilter();
      this.isVisible = false;
    }
  }

  filtersDateCount = '';

  ApplyDateFilter2() {
    if (this.values2.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";

      for (let i = 0; i < this.values2.length; i++) {
        if (this.values2.length > 0) {
          if (this.values2[i]['buttons']['AND'] != undefined) {
            if (this.values2[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.values2.length > 0) {
          if (this.values2[i]['buttons']['OR'] != undefined) {
            if (this.values2[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.values2[i]['filter'].length; j++) {
          var Button1 = "((";
          if (this.values2[i]['filter'].length > 0) {
            if (this.values2[i]['filter'][j]['buttons']['AND'] == true) {
              Button1 = ")" + " AND " + "(";
            }
          }

          if (this.values2[i]['filter'].length > 0) {
            if (this.values2[i]['filter'][j]['buttons']['OR'] == true) {
              Button1 = ")" + " OR " + "(";
            }
          }

          if (this.values2[i]['filter'][j]['DROPDOWN'] == "Between") {
            this.filtersDateCount = Button + Button1 + ' ' + this.model + " " + this.values2[i]['filter'][j]['DROPDOWN'] + " '" + this.datePipe.transform(this.values2[i]['filter'][j]['DATE'], "yyyy-MM-dd") + "' AND '" + this.datePipe.transform(this.values2[i]['filter'][j]['DATE2'], "yyyy-MM-dd") + "'";

          } else {
            this.filtersDateCount = Button + Button1 + ' ' + this.model + " " + this.values2[i]['filter'][j]['DROPDOWN'] + " '" + this.datePipe.transform(this.values2[i]['filter'][j]['DATE'], "yyyy-MM-dd") + "'";
          }

          this.filter = this.filter + this.filtersDateCount;
        }

        this.filter = this.filter + "))";
      }

      this.filterPublishDate = ' AND ' + this.filter;
      this.getCircularFilter();
      this.isVisible4 = false;

    } else {
      this.getCircularFilter();
      this.isVisible4 = false;
    }
  }

  filtersDateCount1 = '';

  ApplyFilter4() {
    if (this.values3.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";

      for (let i = 0; i < this.values3.length; i++) {
        if (this.values3.length > 0) {
          if (this.values3[i]['buttons']['AND'] != undefined) {
            if (this.values3[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.values3.length > 0) {
          if (this.values3[i]['buttons']['OR'] != undefined) {
            if (this.values3[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.values3[i]['filter'].length; j++) {
          var Button1 = "((";
          if (this.values3[i]['filter'].length > 0) {
            if (this.values3[i]['filter'][j]['buttons']['AND'] == true) {
              Button1 = ")" + " AND " + "(";
            }
          }

          if (this.values3[i]['filter'].length > 0) {
            if (this.values3[i]['filter'][j]['buttons']['OR'] == true) {
              Button1 = ")" + " OR " + "(";
            }
          }

          if (this.values3[i]['filter'][j]['DROPDOWN'] == "Between") {
            this.filtersDateCount1 = Button + Button1 + ' ' + this.model + " " + this.values3[i]['filter'][j]['DROPDOWN'] + " '" + this.datePipe.transform(this.values3[i]['filter'][j]['DATE'], "yyyy-MM-dd") + "' AND '" + this.datePipe.transform(this.values3[i]['filter'][j]['DATE2'], "yyyy-MM-dd") + "'";

          } else {
            this.filtersDateCount1 = Button + Button1 + ' ' + this.model + " " + this.values3[i]['filter'][j]['DROPDOWN'] + " '" + this.datePipe.transform(this.values3[i]['filter'][j]['DATE'], "yyyy-MM-dd") + "'";
          }

          this.filter = this.filter + this.filtersDateCount1;
        }

        this.filter = this.filter + "))";
      }

      this.filterCreateDate = ' AND ' + this.filter;
      this.getCircularFilter();
      this.isVisible5 = false;

    } else {
      this.getCircularFilter();
      this.isVisible5 = false;
    }
  }

  filtersCircularCreator = '';

  ApplyFilter5() {
    if (this.values4.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";

      for (let i = 0; i < this.values4.length; i++) {
        Button = "";

        if (this.values4.length > 0) {
          if (this.values4[i]['buttons']['AND'] != undefined) {
            if (this.values4[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.values4.length > 0) {
          if (this.values4[i]['buttons']['OR'] != undefined) {
            if (this.values4[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.values4[i]['filter'].length; j++) {
          var Button1 = "((";
          if (this.values4[i]['filter'].length > 0) {
            if (this.values4[i]['filter'][j]['buttons']['AND'] == true) {
              Button1 = ")" + " AND " + "(";
              Button = "";

            }
          }

          if (this.values4[i]['filter'].length > 0) {
            if (this.values4[i]['filter'][j]['buttons']['OR'] == true) {
              Button1 = ")" + " OR " + "(";
              Button = "";
            }
          }

          var condition = '';

          if (this.values4[i]['filter'][j]['DROPDOWN'] == "Start With" || this.values4[i]['filter'][j]['DROPDOWN'] == "End With" || this.values4[i]['filter'][j]['DROPDOWN'] == "Content") {
            if (this.values4[i]['filter'][j]['DROPDOWN'] == "Start With") {
              condition = "LIKE" + "'" + this.values4[i]['filter'][j]['INPUT'] + "%'";

            } else if (this.values4[i]['filter'][j]['DROPDOWN'] == "End With") {

              condition = "LIKE" + "'%" + this.values4[i]['filter'][j]['INPUT'] + "'";

            } else {
              condition = "LIKE" + " '%" + this.values4[i]['filter'][j]['INPUT'] + "%'";
            }

            this.filtersCircularCreator = Button + Button1 + ' ' + this.model + " " + condition + " ";

          } else {
            this.filtersCircularCreator = Button + Button1 + ' ' + this.model + " " + this.values4[i]['filter'][j]['DROPDOWN'] + " '" + this.values4[i]['filter'][j]['INPUT'] + "'";
          }

          this.filter = this.filter + this.filtersCircularCreator;
        }

        this.filter = this.filter + "))";
      }

      this.filterCreator = ' AND ' + this.filter;
      this.getCircularFilter();
      this.isVisible6 = false;

    } else {
      this.getCircularFilter();
      this.isVisible6 = false;
    }
  }

  filtersCircularVanue = '';

  ApplyFilter6() {
    if (this.values5.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";

      for (let i = 0; i < this.values5.length; i++) {
        Button = "";

        if (this.values5.length > 0) {
          if (this.values5[i]['buttons']['AND'] != undefined) {
            if (this.values5[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.values5.length > 0) {
          if (this.values5[i]['buttons']['OR'] != undefined) {
            if (this.values5[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.values5[i]['filter'].length; j++) {
          var Button1 = "((";

          if (this.values5[i]['filter'].length > 0) {
            if (this.values5[i]['filter'][j]['buttons']['AND'] == true) {
              Button1 = ")" + " AND " + "(";
              Button = "";
            }
          }

          if (this.values5[i]['filter'].length > 0) {
            if (this.values5[i]['filter'][j]['buttons']['OR'] == true) {
              Button1 = ")" + " OR " + "(";
              Button = "";
            }
          }

          var condition = '';
          if (this.values5[i]['filter'][j]['DROPDOWN'] == "Start With" || this.values5[i]['filter'][j]['DROPDOWN'] == "End With" || this.values5[i]['filter'][j]['DROPDOWN'] == "Content") {
            if (this.values5[i]['filter'][j]['DROPDOWN'] == "Start With") {
              condition = "LIKE" + "'" + this.values5[i]['filter'][j]['INPUT'] + "%'";

            } else if (this.values5[i]['filter'][j]['DROPDOWN'] == "End With") {
              condition = "LIKE" + "'%" + this.values5[i]['filter'][j]['INPUT'] + "'";

            } else {
              condition = "LIKE" + " '%" + this.values5[i]['filter'][j]['INPUT'] + "%'";
            }
            this.filtersCircularVanue = Button + Button1 + ' ' + this.model + " " + condition + " ";

          } else {
            this.filtersCircularVanue = Button + Button1 + ' ' + this.model + " " + this.values5[i]['filter'][j]['DROPDOWN'] + " '" + this.values5[i]['filter'][j]['INPUT'] + "'";
          }

          this.filter = this.filter + this.filtersCircularVanue;
        }

        this.filter = this.filter + "))";
      }

      this.getCircularFilter();
      this.isVisible = false;

    } else {
      this.getCircularFilter();
      this.isVisible = false;
    }
  }

  filtersCircularFederation = '';

  ApplyFilter7() {
    if (this.values6.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";

      for (let i = 0; i < this.values6.length; i++) {
        Button = "";
        if (this.values6.length > 0) {
          if (this.values6[i]['buttons']['AND'] != undefined) {
            if (this.values6[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.values6.length > 0) {
          if (this.values6[i]['buttons']['OR'] != undefined) {
            if (this.values6[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.values6[i]['filter'].length; j++) {
          var Button1 = "((";
          if (this.values6[i]['filter'].length > 0) {
            if (this.values6[i]['filter'][j]['buttons']['AND'] == true) {
              Button1 = ")" + " AND " + "(";
              Button = "";

            }
          }

          if (this.values6[i]['filter'].length > 0) {
            if (this.values6[i]['filter'][j]['buttons']['OR'] == true) {
              Button1 = ")" + " OR " + "(";
              Button = "";

            }
          }

          var condition = '';
          if (this.values6[i]['filter'][j]['DROPDOWN'] == "Start With" || this.values6[i]['filter'][j]['DROPDOWN'] == "End With" || this.values6[i]['filter'][j]['DROPDOWN'] == "Content") {
            if (this.values6[i]['filter'][j]['DROPDOWN'] == "Start With") {
              condition = "LIKE" + "'" + this.values6[i]['filter'][j]['INPUT'] + "%'";

            } else if (this.values6[i]['filter'][j]['DROPDOWN'] == "End With") {
              condition = "LIKE" + "'%" + this.values6[i]['filter'][j]['INPUT'] + "'";

            } else {
              condition = "LIKE" + " '%" + this.values6[i]['filter'][j]['INPUT'] + "%'";
            }

            this.filtersCircularFederation = Button + Button1 + ' ' + this.model + " " + condition + " ";

          } else {
            this.filtersCircularFederation = Button + Button1 + ' ' + this.model + " " + this.values6[i]['filter'][j]['DROPDOWN'] + " '" + this.values6[i]['filter'][j]['INPUT'] + "'";
          }

          this.filter = this.filter + this.filtersCircularFederation;
        }

        this.filter = this.filter + "))";
      }

      this.filterFederation = ' AND ' + this.filter;
      this.getCircularFilter();
      this.isVisible8 = false;

    } else {
      this.getCircularFilter();
      this.isVisible8 = false;
    }
  }

  filtersCircularGroup = '';

  ApplyFilter9() {
    if (this.values8.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";

      for (let i = 0; i < this.values8.length; i++) {
        Button = "";

        if (this.values8.length > 0) {
          if (this.values8[i]['buttons']['AND'] != undefined) {
            if (this.values8[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.values8.length > 0) {
          if (this.values8[i]['buttons']['OR'] != undefined) {
            if (this.values8[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.values8[i]['filter'].length; j++) {
          var Button1 = "((";

          if (this.values8[i]['filter'].length > 0) {
            if (this.values8[i]['filter'][j]['buttons']['AND'] == true) {
              Button1 = ")" + " AND " + "(";
              Button = "";
            }
          }

          if (this.values8[i]['filter'].length > 0) {
            if (this.values8[i]['filter'][j]['buttons']['OR'] == true) {
              Button1 = ")" + " OR " + "(";
              Button = "";
            }
          }

          var condition = '';
          if (this.values8[i]['filter'][j]['DROPDOWN'] == "Start With" || this.values8[i]['filter'][j]['DROPDOWN'] == "End With" || this.values8[i]['filter'][j]['DROPDOWN'] == "Content") {
            if (this.values8[i]['filter'][j]['DROPDOWN'] == "Start With") {
              condition = "LIKE" + "'" + this.values8[i]['filter'][j]['INPUT'] + "%'";

            } else if (this.values8[i]['filter'][j]['DROPDOWN'] == "End With") {
              condition = "LIKE" + "'%" + this.values8[i]['filter'][j]['INPUT'] + "'";

            } else {
              condition = "LIKE" + " '%" + this.values8[i]['filter'][j]['INPUT'] + "%'";
            }

            this.filtersCircularGroup = Button + Button1 + ' ' + this.model + " " + condition + " ";

          } else {
            this.filtersCircularGroup = Button + Button1 + ' ' + this.model + " " + this.values8[i]['filter'][j]['DROPDOWN'] + " '" + this.values8[i]['filter'][j]['INPUT'] + "'";
          }

          this.filter = this.filter + this.filtersCircularGroup;
        }

        this.filter = this.filter + "))";
      }

      this.filterGroup = ' AND ' + this.filter;
      this.getCircularFilter();
      this.isVisible10 = false;

    } else {
      this.getCircularFilter();
      this.isVisible10 = false;
    }
  }

  filtersCircularUnit = '';

  ApplyFilter8() {
    if (this.values7.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";

      for (let i = 0; i < this.values7.length; i++) {
        Button = "";

        if (this.values7.length > 0) {
          if (this.values7[i]['buttons']['AND'] != undefined) {
            if (this.values7[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.values7.length > 0) {
          if (this.values7[i]['buttons']['OR'] != undefined) {
            if (this.values7[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.values7[i]['filter'].length; j++) {
          var Button1 = "((";

          if (this.values7[i]['filter'].length > 0) {
            if (this.values7[i]['filter'][j]['buttons']['AND'] == true) {
              Button1 = ")" + " AND " + "(";
              Button = "";
            }
          }

          if (this.values7[i]['filter'].length > 0) {
            if (this.values7[i]['filter'][j]['buttons']['OR'] == true) {
              Button1 = ")" + " OR " + "(";
              Button = "";
            }
          }

          var condition = '';
          if (this.values7[i]['filter'][j]['DROPDOWN'] == "Start With" || this.values7[i]['filter'][j]['DROPDOWN'] == "End With" || this.values7[i]['filter'][j]['DROPDOWN'] == "Content") {
            if (this.values7[i]['filter'][j]['DROPDOWN'] == "Start With") {
              condition = "LIKE" + "'" + this.values7[i]['filter'][j]['INPUT'] + "%'";

            } else if (this.values7[i]['filter'][j]['DROPDOWN'] == "End With") {
              condition = "LIKE" + "'%" + this.values7[i]['filter'][j]['INPUT'] + "'";

            } else {
              condition = "LIKE" + " '%" + this.values7[i]['filter'][j]['INPUT'] + "%'";
            }

            this.filtersCircularUnit = Button + Button1 + ' ' + this.model + " " + condition + " ";

          } else {
            this.filtersCircularUnit = Button + Button1 + ' ' + this.model + " " + this.values7[i]['filter'][j]['DROPDOWN'] + " '" + this.values7[i]['filter'][j]['INPUT'] + "'";
          }

          this.filter = this.filter + this.filtersCircularUnit;
        }

        this.filter = this.filter + "))";
      }

      this.filterUnit = ' AND ' + this.filter;
      this.getCircularFilter();
      this.isVisible9 = false;

    } else {
      this.getCircularFilter();
      this.isVisible9 = false;
    }
  }

  showModal8(): void {
    this.isVisibleStatus = true;
    this.model = "STATUS";
    this.model_name = 'Status';
  }

  model_name: string = "";
  isVisibleStatus = false;

  showModalStatus(): void {
    this.isVisibleStatus = true;
    this.model = "STATUS";
    this.model_name = 'Status';
  }

  modelCancelStatus() {
    this.isVisibleStatus = false;
  }

  ANDBUTTONLASTStatus(i: any) {
    this.mainFilterStatusArray[i]['buttons']['AND'] = true;
    this.mainFilterStatusArray[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTStatus(i: any) {
    this.mainFilterStatusArray[i]['buttons']['AND'] = false;
    this.mainFilterStatusArray[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTStatus1(i: any, j: any) {
    this.mainFilterStatusArray[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterStatusArray[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTStatus1(i: any, j: any) {
    this.mainFilterStatusArray[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterStatusArray[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersStatus = '';

  AddFilterGroupStatus() {
    this.mainFilterStatusArray.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
  }

  AddFilterStatus(i: any, j: any) {
    this.mainFilterStatusArray[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );
    return true;
  }

  CloseGroupStatus(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterStatusArray.splice(i, 1);
      return true;
    }
  }

  CloseGroupStatus1(i: any, j: any) {
    if (this.mainFilterStatusArray[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterStatusArray[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearStatus() {
    this.mainFilterStatusArray = [];
    this.filterStatus = '';

    this.mainFilterStatusArray.push({
      filter: [{
        INPUT: "", DROPDOWN: '', INPUT2: "", buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.getCircular()
  }

  filterseventstatus = "";

  ApplyFilterStatus() {
    if (this.mainFilterStatusArray.length != 0) {
      var isok = true;
      this.filterStatus = "";

      for (let i = 0; i < this.mainFilterStatusArray.length; i++) {
        var Button = " ";

        if (this.mainFilterStatusArray.length > 0) {
          if (this.mainFilterStatusArray[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterStatusArray[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }

        if (this.mainFilterStatusArray.length > 0) {
          if (this.mainFilterStatusArray[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterStatusArray[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterStatusArray[i]['filter'].length; j++) {
          var Button1 = "((";

          if (this.mainFilterStatusArray[i]['filter'][j]['INPUT'] == undefined || this.mainFilterStatusArray[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Status', 'Please fill the field');
            isok = false;

          } else if (this.mainFilterStatusArray[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterStatusArray[i]['filter'][j]['DROPDOWN'] == '') {
            this.message.error('Condition', 'Please Select the field');
            isok = false;
          }

          else
            if ((this.mainFilterStatusArray[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterStatusArray[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterStatusArray[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Status', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterStatusArray[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterStatusArray[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterStatusArray[i]['buttons']['AND'] == false && this.mainFilterStatusArray[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                if (this.mainFilterStatusArray[i]['filter'].length > 0) {
                  if (this.mainFilterStatusArray[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterStatusArray[i]['filter'].length > 0) {
                  if (this.mainFilterStatusArray[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterStatusArray[i]['filter'][j]['DROPDOWN'] == "Between") {
                  this.filterseventstatus = Button + Button1 + ' ' + this.model + " " + this.mainFilterStatusArray[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterStatusArray[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterStatusArray[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filterseventstatus = Button + Button1 + ' ' + this.model + " " + this.mainFilterStatusArray[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterStatusArray[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterStatus = this.filterStatus + this.filterseventstatus;
              }
        }

        this.filterStatus = this.filterStatus + "))";
      }

      if (isok) {
        this.isVisibleStatus = false;
        this.eventfilterstatus = ' AND ' + this.filterStatus;
        this.getCircularFilter();
        this.isVisibleStatus = false;

      } else {
        this.getCircularFilter();
        this.isVisibleStatus = false;
      }
    }
  }

  getWidth() {
    if (window.innerWidth <= 400) {
      return 380;

    } else {
      return 850;
    }
  }

  SelectCol = [];

  addColumn(colName: []) {
    this.SelectCol = colName;
    this.columns = [];
    this.Col1 = true;
    this.Col2 = true;
    this.Col3 = true;
    this.Col4 = true;
    this.Col5 = false;
    this.Col6 = false;
    this.Col7 = false;
    this.Col8 = false;
    this.Col9 = false;
    // this.Col10= false;
    this.SelectColumn1 = this.nodes[0]['children'];
    // this.SelectColumn = this.tagValue1

    for (let i = 0; i <= 8; i++) {
      if (this.tagValue1[i] == "Federation Name") { this.Col1 = true; }
      if (this.tagValue1[i] == "Unit Name") { this.Col2 = true; }
      if (this.tagValue1[i] == "Group Name") { this.Col3 = true; }
      if (this.tagValue1[i] == "Circular Type") { this.Col4 = true; }
      if (this.tagValue1[i] == "Circular Creator") { this.Col5 = true; }
      // if (this.tagValue1[i] == "No.Of.Providers") { this.Col6 = true; }
      if (this.tagValue1[i] == "Create Date") { this.Col7 = true; }
      if (this.tagValue1[i] == "Publish Date") { this.Col8 = true; }
      // if (this.tagValue1[i] == "Event Vanue") { this.Col9 = true; }
      if (this.tagValue1[i] == "Status") { this.Col9 = true; }
    }

    if (this.tagValue1[0] == "Select All") {
      this.Col1 = true;
      this.Col2 = true;
      this.Col3 = true;
      this.Col4 = true;
      this.Col5 = true;
      this.Col6 = true;
      this.Col7 = true;
      this.Col8 = true;
      this.Col9 = true;
    }
  }

  nodes = [{
    title: 'Select All', value: 'Select All', key: 'Select All',
    children: [
      {
        title: 'Circular Creator',
        value: 'Circular Creator',
        key: 'Circular Creator',
        isLeaf: true
      },
      {
        title: 'Create Date',
        value: 'Create Date',
        key: 'Create Date',
        isLeaf: true
      },
      {
        title: 'Publish Date',
        value: 'Publish Date',
        key: 'Publish Date',
        isLeaf: true
      },
      {
        title: 'Status',
        value: 'Status',
        key: 'Status',
        isLeaf: true
      }
    ]
  }
  ];

  eventfilterstatus: string = "";
  filtername: string = "";
  filterPublishDate: string = "";
  filterVanue: string = "";
  filterCreator: string = "";
  filterFederation: string = "";
  filterUnit: string = "";
  filterGroup: string = "";
  filterCreateDate: string = "";
  FilterQuery: string = "";
  drawerData2 = [];

  AddData() {
    var f_filtar = '';

    if (this.federationID != 0) {
      f_filtar = " AND FEDERATION_ID=" + this.federationID;

    } else if (this.groupID != 0) {
      f_filtar = " AND GROUP_ID=" + this.groupID;

    } else if (this.unitID != 0) {
      f_filtar = " AND UNIT_ID=" + this.unitID;
    }

    this.drawerTitle1 = "Report Master";
    this.drawerData1 = new REPORTSCHEDULE();
    this.drawerVisible1 = true;
    this.drawerData1.SCHEDULE = "D";
    this.drawerData1.FILTER_QUERY = this.FilterQuery + " AND YEAR(DATE)='" + this.SelectedYear + "'" + f_filtar;
    this.drawerData1.SORT_KEY = this.sortKey;
    this.drawerData1.SORT_VALUE = this.sortValue;
    this.drawerData1.USER_ID = parseInt(this._cookie.get('userId'));
    this.drawerData1.REPORT_ID = 5;

    this.api.getScheduledReport(this.pageIndex, this.pageSize, "", "", "" + 'AND STATUS=1 AND REPORT_ID = 5').subscribe(data => {
      if ((data['code'] == 200)) {
        this.drawerData2 = data['data'];
        this.loadingRecords = false;

      } else {
        this.message.error("Server Not Found", "");
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  drawerClose1(): void {
    this.drawerVisible1 = false;
  }

  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }
}
