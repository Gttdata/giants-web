import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Rform } from 'src/app/Models/rform';
import { REPORTSCHEDULE } from 'src/app/Models/report-schedule';
import { YEAR } from 'ngx-bootstrap/chronos/units/constants';

@Component({
  selector: 'app-project-table-data',
  templateUrl: './project-table-data.component.html',
  styleUrls: ['./project-table-data.component.css']
})

export class ProjectTableDataComponent implements OnInit {
  formTitle: string = "Project Report";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList = [];
  federations = [];
  federation = [];
  loadingRecords: boolean = true;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  columns: string[][] = [
    ["FEDERATION_NAME", "Federation Name"], ["UNIT_NAME", "Unit Name"], ["GROUP_NAME", "Group Name"],
    ["PROJECT_NAME", "Project Name"], ["START_DATE", 'Start Date'], ["END_DATE", 'End Date'], ['NO_OF_PROJECT', 'No Of Project'], ['PROJECT_VALUE', 'Project Value'], ['PROJECT_STATUS', 'Project Status']];
  isSpinning: boolean = false;
  FEDERATION_ID = Number(this._cookie.get("FEDERATION_ID"));
  UNIT_ID = Number(this._cookie.get("UNIT_ID"));
  GROUP_ID = Number(this._cookie.get("GROUP_ID"));
  roleId = Number(this._cookie.get('roleId'));
  eventValue = [];
  isDisplay: boolean = false;
  tagValue1: string[] = ["Federation Name", "Unit Name", "Group Name", "Project Name", "Start Date", "Project Type ", "Name Of Owner", "Total Expenses", "Current Status"];
  tagValue: string[] = ["Select All", "Federation Name", "Unit Name", "Group Name", "Project Name", "Start Date", "Project Type ", "Name Of Owner", "Total Expenses", "Current Status"];
  OpratorLike: string[] = ["Starts With", "Ends With", "Content", "!=", '='];
  Operators: string[][] = [["=", "="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["!=", "!="]];
  Operators1: string[][] = [['Between', 'Between'], ["=", "="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["!=", "!="]];
  Operators_name: string[][] = [["Start With", "Start With"], ['End With', 'End With'], ['Content', 'Content'], ['=', '='], ['!=', '!=']];
  VALUE = [];
  yearrange = [];
  year = new Date().getFullYear();
  baseYear: number = 2020;
  Next_Year = Number(this.year + 1);
  isVisible = false;
  isVisible3 = false;
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
  Column1: string;
  Column2: string;
  INPUT1 = "";
  FirstButton = "";
  SecondButton = "";
  abc = "";
  val2 = "";
  abc2 = "";
  filter3: any;
  filter2 = "";
  filter = "";
  filter1 = "";
  model = "";
  nextfield = true;
  exportLoading: boolean = false;
  dataListForExport = [];
  exportInPDFLoading: boolean = false;
  exportLoading1: boolean = false;
  isPDFModalVisible: boolean = false;
  next_year = Number(this.year + 1);
  SelectedYear: any;
  values: any[] = [];
  values1: any[] = [];
  values2: any[] = [];
  faderationArray: any[] = [];
  event = [];
  isVisible2: boolean = false;
  isVisible5: boolean = false;
  is_ShowNewFilter: boolean = false;
  newField5: any = {};

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService, private _exportService: ExportService, private router: Router) { }

  a = new Date();
  b = new Date(this.a.getFullYear() + 1, 3, 1);
  is_filterShow = false;

  interMouse() {
    this.is_filterShow = true;
  }

  outMouse() {
    this.is_filterShow = false;
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

  ClearAllFilter() {
    this.filterExpensess = '';
    this.filterStartDate = '';
    this.filterProjectType = '';
    this.filterProjectName = '';
    this.filterFed_Name = '';
    this.filterUnitName = '';
    this.filterGroupName = '';
    this.filterStatus = '';
    this.mainFilterProjectNumCount = [];
    this.mainFilterProjectUnitName = [];
    this.mainFilterProjectGroupName = [];
    this.mainFilterArrayStartDate = [];
    this.mainFilterArrayProjectType = [];
    this.mainFilterArrayNameOfOwner = [];
    this.mainFilterArrayProjectName = [];
    this.mainFilterArrayPro_FederationName = [];
    this.mainFilterArrayStatus = [];
    this.all_filter = "";
    this.forClearfilter();
    this.getProjectData();
  }

  forClearfilter() {
    this.mainFilterProjectNumCount.push({
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

    this.mainFilterArrayStartDate.push({
      filter: [{
        DATE1: "", DROPDOWN: '', DATE2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.mainFilterArrayProjectName.push({
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

    this.mainFilterArrayPro_FederationName.push({
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

    this.mainFilterProjectUnitName.push({
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

    this.mainFilterProjectGroupName.push({
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

    this.mainFilterArrayProjectType.push({
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

    this.mainFilterArrayNameOfOwner.push({
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

    this.mainFilterArrayStatus.push({
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
  }

  ngOnInit() {
    // this.FEDERATION_ID = this._cookie.get("FEDERATION_ID");
    // console.log(this.FEDERATION_ID);
    // console.log(this.UNIT_ID);

    // this.UNIT_ID = this._cookie.get("HOME_UNIT_NAME");
    // console.log(this.UNIT_ID);

    // this.GROUP_ID = this._cookie.get("HOME_GROUP_NAME");
    // console.log(this.GROUP_ID);

    let fn = this._cookie.get("HOME_GROUP_NAME");
    console.log(fn);

    this.getProjectData();
    this.Fordate();
    this.current_year();

    this.mainFilterProjectNumCount.push({
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

    this.mainFilterArrayStartDate.push({
      filter: [{
        DATE1: "", DROPDOWN: '', DATE2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.mainFilterArrayProjectName.push({
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

    this.mainFilterArrayPro_FederationName.push({
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

    this.mainFilterProjectUnitName.push({
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

    this.mainFilterProjectGroupName.push({
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

    this.mainFilterArrayProjectType.push({
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

    this.mainFilterArrayNameOfOwner.push({
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

    this.mainFilterArrayStatus.push({
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

    // this.search(true);
  }

  public handlePrint(): void {
    const printContents = document.getElementById('modal').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  }

  handleOk(): void {
    this.isVisiblepdf = false;
  }

  handleCancel1(): void {
    this.isVisiblepdf = false;
  }

  handleCancel(): void {
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
      likeQuery = " AND (";

      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    if (this.all_filter != "") {
      var filters = this.all_filter;
    }
    else {
      filters = "";
    }

    if (exportToExcel) {
      this.exportLoading = true;

      this.api.getProjectDeatils(0, 0, this.sortKey, this.sortValue, "", this.SelectedYear, filters, this.UNIT_ID, this.FEDERATION_ID, this.GROUP_ID).subscribe(data => {
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
      this.exportInPDFLoading = true;

      this.api.getProjectDeatils(0, 0, this.sortKey, this.sortValue, "", this.SelectedYear, '', this.UNIT_ID, this.FEDERATION_ID, this.GROUP_ID).subscribe(data => {
        if (data['code'] == 200) {
          this.federation = data['data'];
          this.totalRecords = data['count'];
          this.isPDFModalVisible = true;
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });

    } else {
      if (this.all_filter != "") {
        this.loadingRecords = true;

        this.api.getProjectDeatils(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, "", this.SelectedYear, this.all_filter, this.UNIT_ID, this.FEDERATION_ID, this.GROUP_ID).subscribe(data => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.federations = data['data'];
          }

        }, err => {
          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });

      } else {
        this.loadingRecords = true;

        this.api.getProjectDeatils(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, "", this.SelectedYear, '', this.UNIT_ID, this.FEDERATION_ID, this.GROUP_ID).subscribe(data => {
          if (data['code'] == 200) {
            this.loadingRecords = false;
            this.totalRecords = data['count'];
            this.federations = data['data'];
          }

        }, err => {
          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });
      }
    }
  }

  SelectYear(YEARs: any) {
    this.SelectedYear = YEARs;

    this.api.getProjectDeatils(this.pageIndex, this.pageSize, "id", this.sortValue, "", this.SelectedYear, '', this.UNIT_ID, this.FEDERATION_ID, this.GROUP_ID).subscribe(data => {
      if (data['code'] == 200) {
        this.federations = data['data'];
        this.loadingRecords = false;

      } else {
        this.message.error("Server Not Found", "");
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getProjectData() {
    this.api.getProjectDeatils(this.pageIndex, this.pageSize, 'id', this.sortValue, "", this.SelectedYear, '', this.UNIT_ID, this.FEDERATION_ID, this.GROUP_ID).subscribe(data => {
      if ((data['code'] == 200)) {
        this.federations = data['data'];
        this.totalRecords = data['count'];
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
      obj1['Project Name'] = this.dataListForExport[i]['PROJECT_NAME'];

      if (this.tagValue[0] == "Select All") {
        obj1['Start Date'] = this.dataListForExport[i]['DATE_OF_PROJECT'];
        obj1['Project type'] = this.dataListForExport[i]['PROJECT_TYPE_NAME'];
        obj1['Name Of Owner'] = this.dataListForExport[i]['NAME'];
        obj1['Total Expenses'] = this.dataListForExport[i]['TOTAL_EXPENSES'];
        obj1['Current Status'] = this.dataListForExport[i]['CURRENT_STATUS'];
      }

      for (let k = 0; k < this.selected_cols.length; k++) {
        // obj1[this.selected_cols[k]] = this.dataListForExport[i][this.selected_cols[k]];
        if (this.selected_cols[k] == 'Start Date') {
          obj1['Start Date'] = this.dataListForExport[i]['DATE_OF_PROJECT'];
        }

        else if (this.selected_cols[k] == 'Project type') {
          obj1['Project type'] = this.dataListForExport[i]['PROJECT_TYPE_NAME'];
        }

        else if (this.selected_cols[k] == 'Name Of Owner') {
          obj1['Name Of Owner'] = this.dataListForExport[i]['NAME'];
        }

        else if (this.selected_cols[k] == 'Total Expenses') {
          obj1['Total Expenses'] = this.dataListForExport[i]['TOTAL_EXPENSES'];
        }

        else if (this.selected_cols[k] == 'Current Status') {
          obj1['Current Status'] = this.dataListForExport[i]['CURRENT_STATUS'];
        }
      }

      // obj1['Start Date'] = this.dataListForExport[i]['DATE_OF_PROJECT'];
      // obj1['Project type'] = this.dataListForExport[i]['PROJECT_TYPE_NAME'];
      // obj1['Name Of Owner'] = this.dataListForExport[i]['NAME'];
      // obj1['Total Expenses'] = this.dataListForExport[i]['TOTAL_EXPENSES'];
      // obj1['Current Status'] = this.dataListForExport[i]['CURRENT_STATUS'];

      arry1.push(Object.assign({}, obj1));

      if (i == this.dataListForExport.length - 1) {
        this._exportService.exportExcel(arry1, 'Project Report' + this.datePipe.transform(new Date(), 'dd-MMM-yy, hh mm ss a'));
      }
    }
  }

  removefilter(i) {
    if (this.values.length > 1) {
      this.values.splice(i, 1);
    }
  }

  selected_cols: any[] = [];

  onChange(colName: []) {
    this.selected_cols = colName;
    this.columns = [];
    this.SelectColumn1 = this.nodes[0]['children'];
    this.Col1 = true;
    this.Col2 = true;
    this.Col3 = true;
    this.Col4 = true;
    this.Col5 = false;
    this.Col6 = false;
    this.Col7 = false;
    this.Col8 = false;
    this.Col9 = false;
    this.Col10 = false;
    // this.SelectColumn = this.tagValue1

    for (let i = 0; i <= 8; i++) {
      if (this.tagValue[i] == "Federation Name") { this.Col1 = true; }
      if (this.tagValue[i] == "Unit Name") { this.Col2 = true; }
      if (this.tagValue[i] == "Group Name") { this.Col3 = true; }
      if (this.tagValue[i] == "Project Name") { this.Col4 = true; }
      if (this.tagValue[i] == "Start Date") { this.Col5 = true; }
      if (this.tagValue[i] == "Project Type") { this.Col6 = true; }
      if (this.tagValue[i] == "Name Of Owner") { this.Col7 = true; }
      if (this.tagValue[i] == "Total Expenses") { this.Col10 = true; }
      if (this.tagValue[i] == "Current Status") { this.Col8 = true; }
    }

    if (this.tagValue[0] == "Select All") {
      this.Col1 = true;
      this.Col2 = true;
      this.Col3 = true;
      this.Col4 = true;
      this.Col5 = true;
      this.Col6 = true;
      this.Col7 = true;
      this.Col8 = true;
      this.Col9 = true;
      this.Col10 = true;
    }
  }

  value: string[] = ['0-0-0'];
  nodes = [{
    title: 'Select All', value: 'Select All', key: 'Select All',
    children: [
      {
        title: 'Project Name',
        value: 'Project Name',
        key: 'Project Name',
        isLeaf: true

      },
      {
        title: 'Start Date',
        value: 'Start Date',
        key: 'Start Date',
        isLeaf: true
      },

      {
        title: 'Project Type',
        value: 'Project Type',
        key: 'Project Type',
        isLeaf: true
      },
      {
        title: 'Name Of Owner',
        value: 'Name Of Owner',
        key: 'Name Of Owner',
        isLeaf: true
      },
      {
        title: 'Total Expenses',
        value: 'Total Expenses',
        key: 'Total Expenses',
        isLeaf: true
      },
      {
        title: 'Current Status',
        value: 'Current Status',
        key: 'Current Status',
        isLeaf: true
      }
    ]
  }
  ];

  clearFilterFederation() {
    this.mainFilterArrayPro_FederationName = [];
    this.filterFed_Name = '';
    this.mainFilterArrayPro_FederationName.push({
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

    this.getMemberFilter();
    this.isVisiblePro_FederationName = false;
  }

  clearFilterUnit() {
    this.mainFilterProjectUnitName = [];
    this.filterUnitName = "";

    this.mainFilterProjectUnitName.push({
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

    this.getMemberFilter();
    this.isVisiblePro_UnitName = false;

    // this.filterExpensess = '';
    // this.filterStartDate = '';
    // this.filterProjectType = '';
    // this.filterProjectName = '';
    // this.filterFed_Name = '';
    // this.filterUnitName = '';
    // this.filterGroupName = '';
    // this.filterStatus = '';
    // this.all_filter = "";
    // this.getProjectData();
    // this.mainFilterProjectUnitName.splice(0, this.mainFilterProjectUnitName.length)
    // this.mainFilterProjectUnitName.push({
    //   filter: [{
    //     INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
    //       AND: false, OR: false, IS_SHOW: false
    //     },
    //   }],
    //   Query: '',
    //   buttons: {
    //     AND: false, OR: false, IS_SHOW: false
    //   },
    // });
    // this.myfilter.splice(0, this.myfilter.length);
    // this.isVisiblePro_UnitName = false;
  }

  clearFilterGroupName() {
    this.mainFilterProjectGroupName = [];
    this.filterGroupName = "";

    this.mainFilterProjectGroupName.push({
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

    this.getMemberFilter();
    this.isVisiblePro_GroupName = false;

    // this.filterExpensess = '';
    // this.filterStartDate = '';
    // this.filterProjectType = '';
    // this.filterProjectName = '';
    // this.filterFed_Name = '';
    // this.filterUnitName = '';
    // this.filterGroupName = '';
    // this.filterStatus = '';
    // this.all_filter = "";
    // this.getProjectData();
    // this.mainFilterProjectGroupName.splice(0, this.mainFilterProjectGroupName.length)
    // this.mainFilterProjectGroupName.push({
    //   filter: [{
    //     INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
    //       AND: false, OR: false, IS_SHOW: false
    //     },
    //   }],
    //   Query: '',
    //   buttons: {
    //     AND: false, OR: false, IS_SHOW: false
    //   },
    // });

    // this.myfilter.splice(0, this.myfilter.length);
    // this.isVisiblePro_GroupName = false;
  }

  clearFilterProjectName() {
    this.mainFilterArrayProjectName = [];
    this.filterProjectName = "";

    this.mainFilterArrayProjectName.push({
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

    this.getMemberFilter();
    this.isVisibleProjectName = false;
  }


  clearFilterDate() {
    this.mainFilterArrayStartDate = [];
    this.filterStartDate = '';

    this.mainFilterArrayStartDate.push({
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

    this.getMemberFilter();
    this.isVisibleProject_StartDate = false;
  }


  clearFilterProjectType() {
    this.mainFilterArrayProjectType = [];
    this.filterProjectType = '';

    this.mainFilterArrayProjectType.push({
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

    this.getMemberFilter();
    this.isVisibleProject_ProjectType = false;
  }


  clearFilterNameOfOwner() {
    this.mainFilterArrayNameOfOwner = [];
    this.filterProjectType = '';

    this.mainFilterArrayNameOfOwner.push({
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

    this.getMemberFilter();
    this.isVisibleProject_NameOfOwner = false;
  }

  clearFilterStatus() {
    this.mainFilterArrayStatus = [];
    this.filterStatus = '';

    this.mainFilterArrayStatus.push({
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

    this.getMemberFilter();
    this.isVisibleProject_ProjectType = false;
  }

  clearFilterNumCount() {
    this.mainFilterProjectNumCount = [];
    this.filterExpensess = '';

    this.mainFilterProjectNumCount.push({
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

    this.isVisibleProject_NumCount = false;
  }


  isVisibleProject_NumCount: boolean = false;
  isVisibleProject_StartDate: boolean = false;
  isVisibleProject_ProjectType: boolean = false;
  isVisibleProject_NameOfOwner: boolean = false;
  isVisibleProject_Status: boolean = false;
  isVisibleProjectName: boolean = false;
  isVisiblePro_FederationName: boolean = false;
  isVisiblePro_UnitName: boolean = false;
  isVisiblePro_GroupName: boolean = false;
  ModelName: string = "";
  mainFilterProjectNumCount = [];
  mainFilterProjectUnitName = [];
  mainFilterProjectGroupName = [];
  mainFilterArrayStartDate = [];
  mainFilterArrayProjectType = [];
  mainFilterArrayNameOfOwner = [];
  mainFilterArrayProjectName = [];
  mainFilterArrayPro_FederationName = [];
  mainFilterArrayStatus = [];
  filtersMeetingCount = '';

  showModalNo_OF_Project() {
    this.isVisibleProject_NumCount = true;
    this.ModelName = "Project Count Filter";
    this.model = 'TOTAL_EXPENSES';
  }

  CloseMeetCount() {
    this.isVisibleProject_NumCount = false;
  }

  CloseMeetStatus() {
    this.isVisibleProject_Status = false;
  }

  showModalDateStart() {
    this.isVisibleProject_StartDate = true;
    this.ModelName = "Project Start Date Filter";
    this.model = 'DATE_OF_PROJECT';
    console.log(this.mainFilterProjectNumCount);
  }

  showModalProjectType() {
    this.isVisibleProject_ProjectType = true;
    this.ModelName = "Project  Filter";
    this.model = 'PROJECT_TYPE_NAME';
    console.log(this.mainFilterProjectNumCount);
  }

  showModalNameOfOwner() {
    this.isVisibleProject_NameOfOwner = true;
    this.ModelName = "Name Of Owner";
    this.model = 'NAME';
    console.log(this.mainFilterProjectNumCount);
  }

  ShowCurrentStatus() {
    this.isVisibleProject_Status = true;
    this.ModelName = "Project Status";
    this.model = 'CURRENT_STATUS';
    console.log(this.mainFilterProjectNumCount);
  }

  CloseMeetDateStart() {
    this.isVisibleProject_StartDate = false;
  }

  CloseMeetProjectType() {
    this.isVisibleProject_ProjectType = false;
  }

  CloseMeetNameOfOwner() {
    // this.isVisibleProject_ProjectType = false;
    this.isVisibleProject_NameOfOwner = false;
  }

  showModalProjectName() {
    this.isVisibleProjectName = true;
    this.ModelName = "Project Name Filter";
    this.model = 'PROJECT_NAME';
  }

  showModalPro_FederationName() {
    this.isVisiblePro_FederationName = true;
    this.ModelName = "Federation Name Filter";
    this.model = 'FEDERATION_NAME';
  }

  showModalPro_UnitName() {
    this.isVisiblePro_UnitName = true;
    this.ModelName = "Unit Name Filter";
    this.model = 'UNIT_NAME';
  }

  showModalPro_GroupName() {
    this.isVisiblePro_GroupName = true;
    this.ModelName = "Group Name Filter";
    this.model = 'GROUP_NAME';
  }

  CloseUnitName() {
    this.isVisiblePro_UnitName = false;
  }

  CloseGroupName() {
    this.isVisiblePro_GroupName = false;
  }

  CloseProjectName() {
    this.isVisibleProjectName = false;
  }

  ClosePro_FederationName() {
    this.isVisiblePro_FederationName = false;
  }

  CloseGroupPro_UnitName(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterProjectUnitName.splice(i, 1);
      this.myfilter.splice(this.myfilter.length, 1);
      return true;
    }
  }

  CloseGroupPro_GroupName(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterProjectGroupName.splice(i, 1);
      this.myfilter.splice(this.myfilter.length, 1);
      return true;
    }
  }

  CloseGrouppro_NumCount(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterProjectNumCount.splice(i, 1);
      this.myfilter.splice(this.myfilter.length, 1);
      return true;
    }
  }

  CloseGroupStartDate(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayStartDate.splice(i, 1);
      this.myfilter.splice(this.myfilter.length, 1);
      return true;
    }
  }

  CloseGroupProjectType(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayProjectType.splice(i, 1);
      this.myfilter.splice(this.myfilter.length, 1);
      return true;
    }
  }

  CloseGroupNameOfOwner(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayNameOfOwner.splice(i, 1);
      this.myfilter.splice(this.myfilter.length, 1);
      return true;
    }
  }

  CloseGroupStatus(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayStatus.splice(i, 1);
      this.myfilter.splice(this.myfilter.length, 1);
      return true;
    }
  }

  ANDBUTTONLASTpro_NumCount(i: any) {
    this.mainFilterProjectNumCount[i]['buttons']['AND'] = true;
    this.mainFilterProjectNumCount[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTpro_NumCount(i: any) {
    this.mainFilterProjectNumCount[i]['buttons']['AND'] = false
    this.mainFilterProjectNumCount[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTpro_NumCount1(i: any, j: any) {
    this.mainFilterProjectNumCount[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterProjectNumCount[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTpro_NumCount1(i: any, j: any) {
    this.mainFilterProjectNumCount[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterProjectNumCount[i]['filter'][j]['buttons']['AND'] = false;
  }

  ANDBUTTONLASTstartDate(i: any) {
    this.mainFilterArrayStartDate[i]['buttons']['AND'] = true;
    this.mainFilterArrayStartDate[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTstartDate(i: any) {
    this.mainFilterArrayStartDate[i]['buttons']['AND'] = false
    this.mainFilterArrayStartDate[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTstartDate1(i: any, j: any) {
    this.mainFilterArrayStartDate[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayStartDate[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTstartDate1(i: any, j: any) {
    this.mainFilterArrayStartDate[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayStartDate[i]['filter'][j]['buttons']['AND'] = false;
  }

  ANDBUTTONLASTProjectName(i: any) {
    this.mainFilterArrayProjectName[i]['buttons']['AND'] = true
    this.mainFilterArrayProjectName[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTProjectName(i: any) {
    this.mainFilterArrayProjectName[i]['buttons']['AND'] = false
    this.mainFilterArrayProjectName[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTProjectName1(i: any, j: any) {
    this.mainFilterArrayProjectName[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayProjectName[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTProjectName1(i: any, j: any) {
    this.mainFilterArrayProjectName[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayProjectName[i]['filter'][j]['buttons']['AND'] = false;
  }

  ORBUTTONLASTMemberCount1(i: any, j: any) {
    this.mainFilterArrayProjectName[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayProjectName[i]['filter'][j]['buttons']['AND'] = false;
  }

  ANDBUTTONLASTProjectType(i: any) {
    this.mainFilterArrayProjectType[i]['buttons']['AND'] = true;
    this.mainFilterArrayProjectType[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTProjectType(i: any) {
    this.mainFilterArrayProjectType[i]['buttons']['AND'] = false
    this.mainFilterArrayProjectType[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTProjectType1(i: any, j: any) {
    this.mainFilterArrayProjectType[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayProjectType[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTProjectType1(i: any, j: any) {
    this.mainFilterArrayProjectType[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayProjectType[i]['filter'][j]['buttons']['AND'] = false;
  }

  ANDBUTTONLASTNameOfOwner(i: any) {
    this.mainFilterArrayNameOfOwner[i]['buttons']['AND'] = true;
    this.mainFilterArrayNameOfOwner[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTNameOfOwner(i: any) {
    this.mainFilterArrayNameOfOwner[i]['buttons']['AND'] = false
    this.mainFilterArrayNameOfOwner[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTNameOfOwner1(i: any, j: any) {
    this.mainFilterArrayNameOfOwner[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayNameOfOwner[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTNameOfOwner1(i: any, j: any) {
    this.mainFilterArrayNameOfOwner[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayNameOfOwner[i]['filter'][j]['buttons']['AND'] = false;
  }

  ANDBUTTONLASTStatus(i: any) {
    this.mainFilterArrayStatus[i]['buttons']['AND'] = true;
    this.mainFilterArrayStatus[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTStatus(i: any) {
    this.mainFilterArrayStatus[i]['buttons']['AND'] = false
    this.mainFilterArrayStatus[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTStatus1(i: any, j: any) {
    this.mainFilterArrayStatus[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayStatus[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTStatus1(i: any, j: any) {
    this.mainFilterArrayStatus[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayStatus[i]['filter'][j]['buttons']['AND'] = false;
  }

  ANDBUTTONLASTPro_FederationName(i: any) {
    this.mainFilterArrayPro_FederationName[i]['buttons']['AND'] = true
    this.mainFilterArrayPro_FederationName[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTPro_FederationName(i: any) {
    this.mainFilterArrayPro_FederationName[i]['buttons']['AND'] = false
    this.mainFilterArrayPro_FederationName[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTPro_FederationName1(i: any, j: any) {
    this.mainFilterArrayPro_FederationName[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayPro_FederationName[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTPro_FederationName1(i: any, j: any) {
    this.mainFilterArrayPro_FederationName[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayPro_FederationName[i]['filter'][j]['buttons']['AND'] = false;
  }

  ANDBUTTONLASTPro_UnitName(i: any) {
    this.mainFilterProjectUnitName[i]['buttons']['AND'] = true;
    this.mainFilterProjectUnitName[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTPro_UnitName(i: any) {
    this.mainFilterProjectUnitName[i]['buttons']['AND'] = false
    this.mainFilterProjectUnitName[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTPro_UnitName1(i: any, j: any) {
    this.mainFilterProjectUnitName[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterProjectUnitName[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTPro_UnitName1(i: any, j: any) {
    this.mainFilterProjectUnitName[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterProjectUnitName[i]['filter'][j]['buttons']['AND'] = false;
  }

  ANDBUTTONLASTPro_GroupName(i: any) {
    this.mainFilterProjectGroupName[i]['buttons']['AND'] = true;
    this.mainFilterProjectGroupName[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTPro_GroupName(i: any) {
    this.mainFilterProjectGroupName[i]['buttons']['AND'] = false
    this.mainFilterProjectGroupName[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTPro_GroupName1(i: any, j: any) {
    this.mainFilterProjectGroupName[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterProjectGroupName[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTPro_GroupName1(i: any, j: any) {
    this.mainFilterProjectGroupName[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterProjectGroupName[i]['filter'][j]['buttons']['AND'] = false;
  }

  CloseGrouppro_NumCount1(i: any, j: any) {
    if (this.mainFilterProjectNumCount[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterProjectNumCount[i]['filter'].splice(j, 1);
      this.myfilter.splice(this.myfilter.length, 1);
      return true;
    }
  }

  CloseGroupPro_UnitName1(i: any, j: any) {
    if (this.mainFilterProjectUnitName[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterProjectUnitName[i]['filter'].splice(j, 1);
      this.myfilter.splice(this.myfilter.length, 1);
      return true;
    }
  }

  CloseGroupPro_GroupName1(i: any, j: any) {
    if (this.mainFilterProjectGroupName[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterProjectGroupName[i]['filter'].splice(j, 1);
      this.myfilter.splice(this.myfilter.length, 1);
      return true;
    }
  }

  CloseGroupStartDate1(i: any, j: any) {
    if (this.mainFilterArrayStartDate[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayStartDate[i]['filter'].splice(j, 1);
      this.myfilter.splice(this.myfilter.length, 1);
      return true;
    }
  }

  CloseGroupProjectType1(i: any, j: any) {
    if (this.mainFilterArrayProjectType[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayProjectType[i]['filter'].splice(j, 1);
      this.myfilter.splice(this.myfilter.length, 1);
      return true;
    }
  }

  CloseGroupNameOfOwner1(i: any, j: any) {
    if (this.mainFilterArrayNameOfOwner[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayNameOfOwner[i]['filter'].splice(j, 1);
      this.myfilter.splice(this.myfilter.length, 1);
      return true;
    }
  }


  CloseGroupStatus1(i: any, j: any) {
    if (this.mainFilterArrayStatus[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayStatus[i]['filter'].splice(j, 1);
      this.myfilter.splice(this.myfilter.length, 1);
      return true;
    }
  }

  CloseGroupProjectName(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayProjectName.splice(i, 1);
      this.myfilter.splice(this.myfilter.length, 1);
      return true;
    }
  }


  CloseGroupProjectName1(i: any, j: any) {
    if (this.mainFilterArrayProjectName[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayProjectName[i]['filter'].splice(j, 1);
      return true;
    }
  }


  CloseGroupPro_FederationName(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayPro_FederationName.splice(i, 1);
      this.myfilter.splice(this.myfilter.length, 1);
      return true;
    }
  }

  CloseGroupPro_FederationName1(i: any, j: any) {
    if (this.mainFilterArrayPro_FederationName[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayPro_FederationName[i]['filter'].splice(j, 1);
      this.myfilter.splice(this.myfilter.length, 1);
      return true;
    }
  }

  AddFilterpro_NumCount(i: any, j: any) {
    this.mainFilterProjectNumCount[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }

  AddFilterPro_UnitName(i: any, j: any) {
    this.mainFilterProjectUnitName[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  AddFilterPro_GroupName(i: any, j: any) {
    this.mainFilterProjectGroupName[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  AddFilterStartDate(i: any, j: any) {
    this.mainFilterArrayStartDate[i]['filter'].push({
      DATE1: "", DROPDOWN: '', DATE2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  AddFilterProjectType(i: any, j: any) {
    this.mainFilterArrayProjectType[i]['filter'].push({
      DATE1: "", DROPDOWN: '', DATE2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  AddFilterNameOfFilter(i: any, j: any) {
    this.mainFilterArrayNameOfOwner[i]['filter'].push({
      DATE1: "", DROPDOWN: '', DATE2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  AddFilterStatus(i: any, j: any) {
    this.mainFilterArrayStatus[i]['filter'].push({
      DATE1: "", DROPDOWN: '', DATE2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  AddFilterNameOfOwner(i: any, j: any) {
    this.mainFilterArrayNameOfOwner[i]['filter'].push({
      DATE1: "", DROPDOWN: '', DATE2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  AddFilterGrouppro_NumCount() {
    this.mainFilterProjectNumCount.push({
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

  AddFilterGroupPro_UnitName() {
    this.mainFilterProjectUnitName.push({
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

  AddFilterGroupPro_GroupName() {
    this.mainFilterProjectGroupName.push({
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

  AddFilterGroupStartDate() {
    this.mainFilterArrayStartDate.push({
      filter: [{
        DATE1: "", DROPDOWN: '', DATE2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
  }

  AddFilterGroupProjectType() {
    this.mainFilterArrayProjectType.push({
      filter: [{
        DATE1: "", DROPDOWN: '', DATE2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
  }

  AddFilterGroupNameOfOwner() {
    this.mainFilterArrayNameOfOwner.push({
      filter: [{
        DATE1: "", DROPDOWN: '', DATE2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
  }

  AddFilterGroupStatus() {
    this.mainFilterArrayStatus.push({
      filter: [{
        DATE1: "", DROPDOWN: '', DATE2: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
  }

  AddFilterGroupPorojectName() {
    this.mainFilterArrayProjectName.push({
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

  AddFilterGroupPro_FederationName() {
    this.mainFilterArrayPro_FederationName.push({
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

  AddFilterProjectName(i: any, j: any) {
    this.mainFilterArrayProjectName[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }

  AddFilterPro_FederationName(i: any, j: any) {
    this.mainFilterArrayPro_FederationName[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  ApplyFilterNo_of_project() {
    if (this.mainFilterProjectNumCount.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";

      for (let i = 0; i < this.mainFilterProjectNumCount.length; i++) {
        if (this.mainFilterProjectNumCount.length > 0) {
          if (this.mainFilterProjectNumCount[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterProjectNumCount[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterProjectNumCount.length > 0) {
          if (this.mainFilterProjectNumCount[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterProjectNumCount[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterProjectNumCount[i]['filter'].length; j++) {
          var Button1 = "((";
          if (this.mainFilterProjectNumCount[i]['filter'].length > 0) {
            if (this.mainFilterProjectNumCount[i]['filter'][j]['buttons']['AND'] == true) {
              Button1 = ")" + " AND " + "(";
            }
          }
          if (this.mainFilterProjectNumCount[i]['filter'].length > 0) {
            if (this.mainFilterProjectNumCount[i]['filter'][j]['buttons']['OR'] == true) {
              Button1 = ")" + " OR " + "(";
            }
          }
          // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
          if (this.mainFilterProjectNumCount[i]['filter'][j]['DROPDOWN'] == "Between") {
            // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

            this.filtersMeetingCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterProjectNumCount[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterProjectNumCount[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterProjectNumCount[i]['filter'][j]['INPUT2'] + "'";
          } else {
            this.filtersMeetingCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterProjectNumCount[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterProjectNumCount[i]['filter'][j]['INPUT'] + "'";
          }

          this.filter = this.filter + this.filtersMeetingCount;
        }
        this.filter = this.filter + "))";
      }

      this.filterExpensess = " AND" + this.filter;
      this.getMemberFilter();
      this.isVisibleProject_NumCount = false
    }

    else {
      this.getMemberFilter();
      this.isVisibleProject_NumCount = false
    }
  }

  ApplyFilterStartDate() {
    if (this.mainFilterArrayStartDate.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";

      for (let i = 0; i < this.mainFilterArrayStartDate.length; i++) {
        if (this.mainFilterArrayStartDate.length > 0) {
          if (this.mainFilterArrayStartDate[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayStartDate[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayStartDate.length > 0) {
          if (this.mainFilterArrayStartDate[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayStartDate[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayStartDate[i]['filter'].length; j++) {
          var Button1 = "((";
          if (this.mainFilterArrayStartDate[i]['filter'].length > 0) {
            if (this.mainFilterArrayStartDate[i]['filter'][j]['buttons']['AND'] == true) {
              Button1 = ")" + " AND " + "(";
            }
          }
          if (this.mainFilterArrayStartDate[i]['filter'].length > 0) {
            if (this.mainFilterArrayStartDate[i]['filter'][j]['buttons']['OR'] == true) {
              Button1 = ")" + " OR " + "(";
            }
          }
          // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
          if (this.mainFilterArrayStartDate[i]['filter'][j]['DROPDOWN'] == "Between") {
            // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");
            this.filtersMeetingCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayStartDate[i]['filter'][j]['DROPDOWN'] + " '" + this.datePipe.transform(this.mainFilterArrayStartDate[i]['filter'][j]['DATE1'], 'yyyy-MM-dd') + "' AND '" + this.datePipe.transform(this.mainFilterArrayStartDate[i]['filter'][j]['DATE2'], 'yyyy-MM-dd') + "'";

          } else {
            this.filtersMeetingCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayStartDate[i]['filter'][j]['DROPDOWN'] + " '" + this.datePipe.transform(this.mainFilterArrayStartDate[i]['filter'][j]['DATE1'], 'yyyy-MM-dd') + "'";
          }

          this.filter = this.filter + this.filtersMeetingCount;
        }

        this.filter = this.filter + "))";
      }

      this.filterStartDate = " AND" + this.filter;
      this.getMemberFilter();
      this.isVisibleProject_StartDate = false
    }

    else {
      this.getMemberFilter();
      this.isVisibleProject_StartDate = false
    }
  }

  // mainFilterArrayProjectType

  ApplyFilterProjectType() {
    if (this.mainFilterArrayProjectType.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";

      for (let i = 0; i < this.mainFilterArrayProjectType.length; i++) {
        Button = "";

        if (this.mainFilterArrayProjectType.length > 0) {
          if (this.mainFilterArrayProjectType[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayProjectType[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayProjectType.length > 0) {
          if (this.mainFilterArrayProjectType[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayProjectType[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayProjectType[i]['filter'].length; j++) {
          var Button1 = " ((";
          if (this.mainFilterArrayProjectType[i]['filter'].length > 0) {
            if (this.mainFilterArrayProjectType[i]['filter'][j]['buttons']['AND'] == true) {
              Button1 = ")" + " AND " + "(";
              Button = "";
            }
          }

          if (this.mainFilterArrayProjectType[i]['filter'].length > 0) {
            if (this.mainFilterArrayProjectType[i]['filter'][j]['buttons']['OR'] == true) {
              Button1 = ")" + " OR " + "(";
              Button = "";
            }
          }

          // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
          var condition = '';

          if (this.mainFilterArrayProjectType[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterArrayProjectType[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterArrayProjectType[i]['filter'][j]['DROPDOWN'] == "Content") {
            if (this.mainFilterArrayProjectType[i]['filter'][j]['DROPDOWN'] == "Start With") {
              condition = "LIKE " + "'" + this.mainFilterArrayProjectType[i]['filter'][j]['INPUT'] + "%'";

            } else if (this.mainFilterArrayProjectType[i]['filter'][j]['DROPDOWN'] == "End With") {
              condition = "LIKE " + "'%" + this.mainFilterArrayProjectType[i]['filter'][j]['INPUT'] + "'";

            } else {
              condition = "LIKE " + "'%" + this.mainFilterArrayProjectType[i]['filter'][j]['INPUT'] + "%'";
            }

            this.filtersMeetingCount = Button + Button1 + ' ' + this.model + " " + condition + " ";

          } else {
            this.filtersMeetingCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayProjectType[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayProjectType[i]['filter'][j]['INPUT'] + "'";
          }

          this.filter = this.filter + this.filtersMeetingCount;
        }
        this.filter = this.filter + "))";
      }

      this.filterProjectType = " AND" + this.filter;
      this.getMemberFilter();
      this.isVisibleProject_ProjectType = false
    }

    else {
      this.getMemberFilter();
      this.isVisibleProject_ProjectType = false
    }
  }

  ApplyFilterNameOfOwner() {
    if (this.mainFilterArrayNameOfOwner.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";

      for (let i = 0; i < this.mainFilterArrayNameOfOwner.length; i++) {
        Button = "";
        if (this.mainFilterArrayNameOfOwner.length > 0) {
          if (this.mainFilterArrayNameOfOwner[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayNameOfOwner[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayNameOfOwner.length > 0) {
          if (this.mainFilterArrayNameOfOwner[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayNameOfOwner[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayNameOfOwner[i]['filter'].length; j++) {
          var Button1 = " ((";
          if (this.mainFilterArrayNameOfOwner[i]['filter'].length > 0) {
            if (this.mainFilterArrayNameOfOwner[i]['filter'][j]['buttons']['AND'] == true) {
              Button1 = ")" + " AND " + "(";
              Button = "";
            }
          }

          if (this.mainFilterArrayNameOfOwner[i]['filter'].length > 0) {
            if (this.mainFilterArrayNameOfOwner[i]['filter'][j]['buttons']['OR'] == true) {
              Button1 = ")" + " OR " + "(";
              Button = "";
            }
          }

          // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
          var condition = '';

          if (this.mainFilterArrayNameOfOwner[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterArrayNameOfOwner[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterArrayNameOfOwner[i]['filter'][j]['DROPDOWN'] == "Content") {
            if (this.mainFilterArrayNameOfOwner[i]['filter'][j]['DROPDOWN'] == "Start With") {
              condition = "LIKE " + "'" + this.mainFilterArrayNameOfOwner[i]['filter'][j]['INPUT'] + "%'";

            } else if (this.mainFilterArrayNameOfOwner[i]['filter'][j]['DROPDOWN'] == "End With") {
              condition = "LIKE " + "'%" + this.mainFilterArrayNameOfOwner[i]['filter'][j]['INPUT'] + "'";

            } else {
              condition = "LIKE " + "'%" + this.mainFilterArrayNameOfOwner[i]['filter'][j]['INPUT'] + "%'";
            }

            this.filtersMeetingCount = Button + Button1 + ' ' + this.model + " " + condition + " ";

          } else {
            this.filtersMeetingCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayNameOfOwner[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayNameOfOwner[i]['filter'][j]['INPUT'] + "'";
          }

          this.filter = this.filter + this.filtersMeetingCount;
        }

        this.filter = this.filter + "))";
      }

      this.filterProjectType = " AND" + this.filter;
      this.getMemberFilter();
      this.isVisibleProject_NameOfOwner = false
    }

    else {
      this.getMemberFilter();
      this.isVisibleProject_NameOfOwner = false
    }
  }

  filterStatus = '';

  ApplyFilterStatus() {
    if (this.mainFilterArrayStatus.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";

      for (let i = 0; i < this.mainFilterArrayStatus.length; i++) {
        Button = " ";
        if (this.mainFilterArrayStatus.length > 0) {
          if (this.mainFilterArrayStatus[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayStatus[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayStatus.length > 0) {
          if (this.mainFilterArrayStatus[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayStatus[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayStatus[i]['filter'].length; j++) {
          var Button1 = " ((";

          if (this.mainFilterArrayStatus[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayStatus[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Date', 'Please fill the field');
            isok = false;
          }
          else if ((this.mainFilterArrayStatus[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayStatus[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayStatus[i]['filter'][j]['DROPDOWN'] == "Between")) {
            this.message.error('Date', 'Please fill the field');
            isok = false;
          }
          else if (this.mainFilterArrayStatus[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayStatus[i]['filter'][j]['DROPDOWN'] == '') {
            this.message.error('Condition', 'Please Select the field');
            isok = false;
          }
          else if (this.mainFilterArrayStatus[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayStatus[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
            this.message.error('AND or OR', 'Please Clike On The Button');
            isok = false;
          }
          else if (this.mainFilterArrayStatus[i]['buttons']['AND'] == false && this.mainFilterArrayStatus[i]['buttons']['OR'] == false && i > 0) {
            this.message.error('AND or OR', 'Please Clike On The Button');
            isok = false;
          }

          else {
            var Button1 = "((";
            if (this.mainFilterArrayStatus[i]['filter'].length > 0) {
              if (this.mainFilterArrayStatus[i]['filter'][j]['buttons']['AND'] == true) {
                Button1 = ")" + " AND " + "(";
                Button = " ";

              }
            }
            if (this.mainFilterArrayStatus[i]['filter'].length > 0) {
              if (this.mainFilterArrayStatus[i]['filter'][j]['buttons']['OR'] == true) {
                Button1 = ")" + " OR " + "(";
                Button = " ";

              }
            }
            var condition = '';
            if (this.mainFilterArrayStatus[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterArrayStatus[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterArrayStatus[i]['filter'][j]['DROPDOWN'] == "Content") {
              if (this.mainFilterArrayStatus[i]['filter'][j]['DROPDOWN'] == "Start With") {
                condition = "LIKE" + " '" + this.mainFilterArrayStatus[i]['filter'][j]['INPUT'] + "%";
              } else if (this.mainFilterArrayStatus[i]['filter'][j]['DROPDOWN'] == "End With") {
                condition = "LIKE" + " '%" + this.mainFilterArrayStatus[i]['filter'][j]['INPUT'] + "";
              } else {
                condition = "LIKE" + " '%" + this.mainFilterArrayStatus[i]['filter'][j]['INPUT'] + "%";
              }
              this.filtersSubject = Button + Button1 + ' ' + this.model + " " + condition + "'";
            } else {
              this.filtersSubject = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayStatus[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayStatus[i]['filter'][j]['INPUT'] + "'";
            }
            this.filter = this.filter + this.filtersSubject;
          }
        }

        this.filter = this.filter + "))";
      }

      this.filterStatus = " AND" + this.filter;

      if (isok) {
        this.isVisibleProject_Status = false;
        // this.filterStatus = " AND " + this.filterStatus
        this.filterStatus = " AND" + this.filter;
        this.getMemberFilter();
      }
    }
  }

  filtersSubject: string = '';
  filters_FedName: string = '';
  filters_UnitName: string = '';
  filters_GroupName: string = '';
  filters_ProjectName: string = '';
  filter_StartTime: string = '';
  filters_ProjectType: string = '';
  filters_NameOfOwner: string = '';
  filters_Expensess: string = '';
  // all_filter: string = '';

  getMemberFilter() {
    this.all_filter = this.filterExpensess + this.filterStartDate + this.filterProjectType + this.filterProjectName + this.filterFed_Name + this.filterUnitName + this.filterGroupName + this.filterStatus;

    this.api.getProjectDeatils(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, '', this.SelectedYear, this.all_filter, this.UNIT_ID, this.FEDERATION_ID, this.GROUP_ID).subscribe(data => {
      if ((data['code'] == 200)) {
        this.loadingRecords = false;
        this.federations = data['data'];
        this.totalRecords = data['count'];

      } else {
        this.message.error("Server Not Found", "");
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  ApplyFilterProjectName() {
    if (this.mainFilterArrayProjectName.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";

      for (let i = 0; i < this.mainFilterArrayProjectName.length; i++) {
        Button = "";
        if (this.mainFilterArrayProjectName.length > 0) {
          if (this.mainFilterArrayProjectName[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayProjectName[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayProjectName.length > 0) {
          if (this.mainFilterArrayProjectName[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayProjectName[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayProjectName[i]['filter'].length; j++) {
          var Button1 = "((";

          if (this.mainFilterArrayProjectName[i]['filter'].length > 0) {
            if (this.mainFilterArrayProjectName[i]['filter'][j]['buttons']['AND'] == true) {
              Button1 = ")" + " AND " + "(";
              Button = "";

            }
          }

          if (this.mainFilterArrayProjectName[i]['filter'].length > 0) {
            if (this.mainFilterArrayProjectName[i]['filter'][j]['buttons']['OR'] == true) {
              Button1 = ")" + " OR " + "(";
              Button = "";

            }
          }

          // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
          var condition = '';

          if (this.mainFilterArrayProjectName[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterArrayProjectName[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterArrayProjectName[i]['filter'][j]['DROPDOWN'] == "Content") {
            if (this.mainFilterArrayProjectName[i]['filter'][j]['DROPDOWN'] == "Start With") {
              condition = "LIKE" + "'" + this.mainFilterArrayProjectName[i]['filter'][j]['INPUT'] + "%'";

            } else if (this.mainFilterArrayProjectName[i]['filter'][j]['DROPDOWN'] == "End With") {
              condition = "LIKE" + "'%" + this.mainFilterArrayProjectName[i]['filter'][j]['INPUT'] + "'";

            } else {
              condition = "LIKE" + "'%" + this.mainFilterArrayProjectName[i]['filter'][j]['INPUT'] + "%'";
            }

            this.filtersMeetingCount = Button + Button1 + ' ' + this.model + " " + condition + " ";

          } else {
            this.filtersMeetingCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayProjectName[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayProjectName[i]['filter'][j]['INPUT'] + "'";
          }

          this.filter = this.filter + this.filtersMeetingCount;
        }

        this.filter = this.filter + "))";
      }

      this.filterProjectName = " AND" + this.filter;
      this.getMemberFilter();
      this.isVisibleProjectName = false
    }

    else {
      this.getMemberFilter();
      this.isVisibleProjectName = false
    }
  }

  ApplyFilterPro_FederationName() {
    if (this.mainFilterArrayPro_FederationName.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";

      for (let i = 0; i < this.mainFilterArrayPro_FederationName.length; i++) {
        Button = "";

        if (this.mainFilterArrayPro_FederationName.length > 0) {
          if (this.mainFilterArrayPro_FederationName[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayPro_FederationName[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayPro_FederationName.length > 0) {
          if (this.mainFilterArrayPro_FederationName[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayPro_FederationName[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayPro_FederationName[i]['filter'].length; j++) {
          var Button1 = "((";
          if (this.mainFilterArrayPro_FederationName[i]['filter'].length > 0) {
            if (this.mainFilterArrayPro_FederationName[i]['filter'][j]['buttons']['AND'] == true) {
              Button1 = ")" + " AND " + "(";
              Button = "";

            }
          }
          if (this.mainFilterArrayPro_FederationName[i]['filter'].length > 0) {
            if (this.mainFilterArrayPro_FederationName[i]['filter'][j]['buttons']['OR'] == true) {
              Button1 = ")" + " OR " + "(";
              Button = "";

            }
          }
          // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
          var condition = '';
          if (this.mainFilterArrayPro_FederationName[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterArrayPro_FederationName[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterArrayPro_FederationName[i]['filter'][j]['DROPDOWN'] == "Content") {
            if (this.mainFilterArrayPro_FederationName[i]['filter'][j]['DROPDOWN'] == "Start With") {
              condition = "LIKE " + "'" + this.mainFilterArrayPro_FederationName[i]['filter'][j]['INPUT'] + "%'";

            } else if (this.mainFilterArrayPro_FederationName[i]['filter'][j]['DROPDOWN'] == "End With") {
              condition = "LIKE " + "'%" + this.mainFilterArrayPro_FederationName[i]['filter'][j]['INPUT'] + "'";

            } else {
              condition = "LIKE " + "'%" + this.mainFilterArrayPro_FederationName[i]['filter'][j]['INPUT'] + "%'";
            }

            this.filtersMeetingCount = Button + Button1 + ' ' + this.model + " " + condition + " ";

          } else {
            this.filtersMeetingCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayPro_FederationName[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayPro_FederationName[i]['filter'][j]['INPUT'] + "'";
          }

          this.filter = this.filter + this.filtersMeetingCount;
        }

        this.filter = this.filter + "))";
      }

      this.filterFed_Name = " AND" + this.filter;
      this.getMemberFilter();
      this.isVisiblePro_FederationName = false
    }

    else {
      this.getMemberFilter();
      this.isVisiblePro_FederationName = false
    }
  }

  ApplyFilterPro_UnitName() {
    if (this.mainFilterProjectUnitName.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";

      for (let i = 0; i < this.mainFilterProjectUnitName.length; i++) {
        Button = "";
        if (this.mainFilterProjectUnitName.length > 0) {
          if (this.mainFilterProjectUnitName[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterProjectUnitName[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterProjectUnitName.length > 0) {
          if (this.mainFilterProjectUnitName[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterProjectUnitName[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterProjectUnitName[i]['filter'].length; j++) {
          var Button1 = "((";
          if (this.mainFilterProjectUnitName[i]['filter'].length > 0) {
            if (this.mainFilterProjectUnitName[i]['filter'][j]['buttons']['AND'] == true) {
              Button1 = ")" + " AND " + "(";
              Button = "";

            }
          }
          if (this.mainFilterProjectUnitName[i]['filter'].length > 0) {
            if (this.mainFilterProjectUnitName[i]['filter'][j]['buttons']['OR'] == true) {
              Button1 = ")" + " OR " + "(";
              Button = "";

            }
          }
          // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
          var condition = '';
          if (this.mainFilterProjectUnitName[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterProjectUnitName[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterProjectUnitName[i]['filter'][j]['DROPDOWN'] == "Content") {
            if (this.mainFilterProjectUnitName[i]['filter'][j]['DROPDOWN'] == "Start With") {

              condition = "LIKE " + "'" + this.mainFilterProjectUnitName[i]['filter'][j]['INPUT'] + "%'";

            } else if (this.mainFilterProjectUnitName[i]['filter'][j]['DROPDOWN'] == "End With") {

              condition = "LIKE " + "'%" + this.mainFilterProjectUnitName[i]['filter'][j]['INPUT'] + "'";

            } else {
              condition = "LIKE " + "'%" + this.mainFilterProjectUnitName[i]['filter'][j]['INPUT'] + "%'";
            }
            this.filtersMeetingCount = Button + Button1 + ' ' + this.model + " " + condition + " ";
          } else {
            this.filtersMeetingCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterProjectUnitName[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterProjectUnitName[i]['filter'][j]['INPUT'] + "'";
          }
          this.filter = this.filter + this.filtersMeetingCount;
        }

        this.filter = this.filter + ")) ";
      }
      console.log(this.filter);
      this.filterUnitName = " AND" + this.filter;
      this.getMemberFilter();
      this.isVisiblePro_UnitName = false
    }

    else {
      this.getMemberFilter();
      this.isVisiblePro_UnitName = false
    }
  }

  // if (this.mainFilterProjectGroupName.length != 0) 

  ApplyFilterPro_GroupName() {
    if (this.mainFilterProjectGroupName.length != 0) {
      var isok = true;
      var Button = "";
      this.filter = "";

      for (let i = 0; i < this.mainFilterProjectGroupName.length; i++) {
        Button = "";
        if (this.mainFilterProjectGroupName.length > 0) {
          if (this.mainFilterProjectGroupName[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterProjectGroupName[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterProjectGroupName.length > 0) {
          if (this.mainFilterProjectGroupName[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterProjectGroupName[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterProjectGroupName[i]['filter'].length; j++) {
          var Button1 = "((";
          if (this.mainFilterProjectGroupName[i]['filter'].length > 0) {
            if (this.mainFilterProjectGroupName[i]['filter'][j]['buttons']['AND'] == true) {
              Button1 = ")" + " AND " + "(";
              Button = "";

            }
          }
          if (this.mainFilterProjectGroupName[i]['filter'].length > 0) {
            if (this.mainFilterProjectGroupName[i]['filter'][j]['buttons']['OR'] == true) {
              Button1 = ")" + " OR " + "(";
              Button = "";

            }
          }
          // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
          var condition = '';
          if (this.mainFilterProjectGroupName[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterProjectGroupName[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterProjectGroupName[i]['filter'][j]['DROPDOWN'] == "Content") {
            if (this.mainFilterProjectGroupName[i]['filter'][j]['DROPDOWN'] == "Start With") {
              condition = "LIKE " + "'" + this.mainFilterProjectGroupName[i]['filter'][j]['INPUT'] + "%'";

            } else if (this.mainFilterProjectGroupName[i]['filter'][j]['DROPDOWN'] == "End With") {
              condition = "LIKE " + "'%" + this.mainFilterProjectGroupName[i]['filter'][j]['INPUT'] + "'";

            } else {
              condition = "LIKE " + "'%" + this.mainFilterProjectGroupName[i]['filter'][j]['INPUT'] + "%'";
            }
            this.filtersMeetingCount = Button + Button1 + ' ' + this.model + " " + condition + " ";
          } else {
            this.filtersMeetingCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterProjectGroupName[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterProjectGroupName[i]['filter'][j]['INPUT'] + "'";
          }
          this.filter = this.filter + this.filtersMeetingCount;
        }

        this.filter = this.filter + ")) ";
      }

      this.filterGroupName = " AND" + this.filter;
      this.getMemberFilter();
      this.isVisiblePro_GroupName = false
    }

    else {
      this.getMemberFilter();
      this.isVisiblePro_GroupName = false
    }
  }

  reportName = 'PROJECT_REPORT';
  ReportId = 6;
  myfilter = [];
  ScheduleVisible: boolean = false;
  ScheduleTitle: string;
  ScheduleData: REPORTSCHEDULE = new REPORTSCHEDULE();
  filterConcat: string = '';
  filterData: string;
  all_filter = '';
  filterExpensess: string = '';
  filterStartDate: string = '';
  filterProjectType: string = '';
  filterProjectName: string = '';
  filterFed_Name: string = '';
  filterUnitName: string = '';
  filterGroupName: string = '';
  filter17: string = '';
  // filterStatus: string = '';
  dataReport: Rform = new Rform();

  addSchedule(): void {
    // this.all_filter = this.filterExpensess + this.filterStartDate + this.filterProjectType + this.filterProjectName + this.filterFed_Name + this.filterUnitName + this.filterGroupName + this.filterStatus;
    this.ScheduleTitle = "Project Report";
    this.ScheduleData = new REPORTSCHEDULE();
    this.ScheduleData.SCHEDULE = 'D';
    this.ScheduleData.SORT_KEY = this.sortKey;
    this.ScheduleData.SORT_VALUE = this.sortValue;
    // this.ScheduleData.REPORT_NAME = this.reportName;
    // this.ScheduleData.ID = this.ReportId;

    var f_filtar = '';

    if (this.FEDERATION_ID != 0) {
      f_filtar = " AND FEDERATION_ID=" + this.FEDERATION_ID;

    } else if (this.GROUP_ID != 0) {
      f_filtar = " AND GROUP_ID=" + this.GROUP_ID;

    } else if (this.UNIT_ID != 0) {
      f_filtar = " AND UNIT_ID=" + this.UNIT_ID;
    }

    this.ScheduleData.FILTER_QUERY = this.all_filter + " AND YEAR(DATE_OF_PROJECT)='" + this.SelectedYear + "'" + f_filtar;
    this.ScheduleData.REPORT_ID = 6;
    this.ScheduleData.USER_ID = parseInt(this._cookie.get('userId'));
    this.pageIndex = 1;
    this.pageSize = 10;

    this.api.getScheduledReport(this.pageIndex, this.pageSize, '', '', '' + 'AND STATUS=1 AND REPORT_ID=6').subscribe(data => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.ScheduleVisible = true;
        this.dataList = data['data'];
        this.ScheduleData.REPORT_NAME = data['data'][0]['REPORT_NAME'];
        this.pageIndex++;
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    this.ScheduleVisible = true;
  }

  get closeCallbackSchedule() {
    return this.ScheduleClose.bind(this);
  }

  ScheduleClose(): void {
    this.pageIndex = 1;
    this.search(true);
    this.ScheduleVisible = false;
  }

  getWidth() {
    if (window.innerWidth <= 400)
      return 400;

    else
      return 800;
  }
}

