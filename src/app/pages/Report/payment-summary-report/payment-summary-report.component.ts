import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';
import { REPORTSCHEDULE } from 'src/app/Models/report-schedule';

@Component({
  selector: 'app-payment-summary-report',
  templateUrl: './payment-summary-report.component.html',
  styleUrls: ['./payment-summary-report.component.css']
})

export class PaymentSummaryReportComponent implements OnInit {
  @Input() data: REPORTSCHEDULE;
  FEDERATION_ID: number = Number(this._cookie.get("FEDERATION_ID"));
  UNIT_ID: number = Number(this._cookie.get("UNIT_ID"));
  GROUP_ID: number = Number(this._cookie.get("GROUP_ID"));
  MEMBER_ID: number = Number(this._cookie.get("userId"));
  ROLE_ID: number = Number(this._cookie.get("roleId"));
  formTitle: string = "Payment Summary Report";
  filter = "";
  columns: string[][] = [
    ["TOTAL_FEDERATION", "Total Federation"],
    ["TOTAL_UNIT", "Total Unit"],
    ["TOTAL_GROUP", "Total Group"],
    ["TOTAL_PAID_GROUP", "Total Paid Group"],
    ["TOTAL_MEMBER", "Total Member"],
    ["TOTAL_PAID_MEMBER", "Total Paid Member"],
    ["CREDIT_AMOUNT", "Credit Amount "],
    ["DEBIT_AMOUNT", "Debit Amount"],
    ["PENDING_AMOUNT", "Pending Amount"]
  ];

  constructor(private router: Router, private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService, private _exportService: ExportService) { }

  ngOnInit() {
    if (this.FEDERATION_ID > 0) {
      this.sortKey = "FEDERATION_NAME";

    } else if (this.UNIT_ID > 0) {
      this.sortKey = "UNIT_NAME";

    } else if (this.GROUP_ID > 0) {
      this.sortKey = "GROUP_NAME";

    } else if (this.MEMBER_ID > 0) {
      this.sortKey = "MEMBER_NAME";
    }

    this.Fordate();
    this.current_year();
    this.getPaySummaryReport();

    this.mainFilterFederationName.push({
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

    this.mainFilterTotalFederation.push({
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

    this.mainFilterUnitName.push({
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

    this.mainFilterTotalUnit.push({
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

    this.mainFilterGroupName.push({
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

    this.mainFilterTotalGroup.push({
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

    this.mainFilterTotalPaidGroup.push({
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

    this.mainFilterTotalMember.push({
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

    this.mainFilterTotalPaidMember.push({
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

    this.mainFilterCreditAmount.push({
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

    this.mainFilterDebitAmount.push({
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

    this.mainFilterPendingAmount.push({
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

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    else
      return true;
  }

  // Year Range
  SelectedYear: any;
  yearRange = ''
  range = [];
  year = new Date().getFullYear();
  baseYear = 2020;
  next_year = Number(this.year + 1)
  a = new Date();
  b = new Date(this.a.getFullYear() + 1, 3, 1);

  Fordate() {
    let currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= this.baseYear; i--) {
      this.range.push(i);
    }
  }

  current_year() {
    this.SelectedYear = new Date().getFullYear();
  }

  SelectYear(YEARs: any) {
    this.SelectedYear = YEARs;
    this.filter = '';
    this.getPaySummaryReport();
  }

  // Report Table
  sortValue: string = "asc";
  sortKey: string = "CREDIT_AMOUNT";

  mainFilterFederationName = []
  mainFilterTotalFederation = []
  mainFilterUnitName = []
  mainFilterTotalUnit = []
  mainFilterGroupName = []
  mainFilterTotalGroup = []
  mainFilterTotalPaidGroup = []
  mainFilterTotalMember = []
  mainFilterTotalPaidMember = []
  mainFilterCreditAmount = []
  mainFilterDebitAmount = []
  mainFilterPendingAmount = []

  model = "";

  filterFederationName = '';
  filterTotalFederation = '';
  filterUnitName = '';
  filterTotalUnit = '';
  filterGroupName = '';
  filterTotalGroup = '';
  filterTotalPaidGroup = '';
  filterTotalMember = '';
  filterTotalPaidMember = '';
  filterCreditAmount = '';
  filterDebitAmount = '';
  filterPendingAmount = ''

  model_name = '';

  filtersFederationName = '';
  filtersTotalFederation = '';
  filtersUnitName = '';
  filtersTotalUnit = '';
  filtersGroupName = '';
  filtersTotalGroup = '';
  filtersTotalPaidGroup = '';
  filtersTotalMember = '';
  filtersTotalPaidMember = '';
  filtersCreditAmount = '';
  filtersDebitAmount = '';
  filtersPendingAmount = '';

  ScheduleTitle = '';
  ScheduleVisible: boolean = false;
  ScheduleData: REPORTSCHEDULE = new REPORTSCHEDULE();
  dataList = [];

  all_filter = "";
  loadingRecords = true;
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  PaySumReportData = [];

  searchText: string = "";
  exportLoading: boolean = false;
  exportLoading1: boolean = false;
  pdfData = [];
  isPDFModalVisible: boolean = false;

  Col3: boolean = true;
  Col4: boolean = true;
  Col5: boolean = true;

  dataListForExport = [];
  SelectColumn1 = [];

  tagValue: string[] = ["Select All", "Credit Amount", "Debit Amount", "Pending Amount"]

  Operators: string[][] = [["Between", "Between"], ["=", "="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["<>", "!="]];

  Operators_name: string[][] = [["Start With", "Start With"], ["End With", "End With"], ["=", "="], ["<>", "!="], ['Content', 'Content']];

  // Print Modal
  isVisiblepdf: boolean = false;

  goToClear() {
    this.sortValue = "asc";
    this.sortKey = "CREDIT_AMOUNT";

    this.mainFilterFederationName = [];
    this.mainFilterTotalFederation = []
    this.mainFilterUnitName = [];
    this.mainFilterTotalUnit = [];
    this.mainFilterGroupName = [];
    this.mainFilterTotalGroup = [];
    this.mainFilterTotalPaidGroup = [];
    this.mainFilterTotalMember = [];
    this.mainFilterTotalPaidMember = [];
    this.mainFilterCreditAmount = [];
    this.mainFilterDebitAmount = [];
    this.mainFilterPendingAmount = [];

    this.filterFederationName = '';
    this.filterTotalFederation = '';
    this.filterUnitName = '';
    this.filterTotalUnit = '';
    this.filterGroupName = '';
    this.filterTotalGroup = '';
    this.filterTotalPaidGroup = '';
    this.filterTotalMember = '';
    this.filterTotalPaidMember = '';
    this.filterCreditAmount = '';
    this.filterDebitAmount = '';
    this.filterPendingAmount = '';

    this.mainFilterFederationName.push({
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

    this.mainFilterTotalFederation.push({
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

    this.mainFilterUnitName.push({
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

    this.mainFilterTotalUnit.push({
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

    this.mainFilterGroupName.push({
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

    this.mainFilterTotalGroup.push({
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

    this.mainFilterTotalPaidGroup.push({
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

    this.mainFilterTotalMember.push({
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

    this.mainFilterTotalPaidMember.push({
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

    this.mainFilterCreditAmount.push({
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

    this.mainFilterDebitAmount.push({
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

    this.mainFilterPendingAmount.push({
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

    this.getPaySummaryReport();

  }

  goToSchedule(reset: boolean = false, loadMore: boolean = false): void {
    this.ScheduleTitle = "Payament Summary Report";
    this.ScheduleData = new REPORTSCHEDULE();
    this.ScheduleData.SCHEDULE = 'D';
    this.ScheduleData.SORT_KEY = this.sortKey;
    this.ScheduleData.SORT_VALUE = this.sortValue;
    console.log("this.SelectedYear = ", this.SelectedYear);
    // var date = this.SelectedYear.split('-');
    var date = this.SelectedYear;
    var f_filtar = ''
    if (this.FEDERATION_ID != 0) {
      f_filtar = " AND FEDERATION_ID=" + this.FEDERATION_ID;
    } else if (this.GROUP_ID != 0) {
      f_filtar = " AND GROUP_ID=" + this.GROUP_ID;
    } else if (this.UNIT_ID != 0) {
      f_filtar = " AND UNIT_ID=" + this.UNIT_ID;
    } else if (this.MEMBER_ID != 0) {
      f_filtar = "AND userId=" + this.MEMBER_ID
    } this.ScheduleData.FILTER_QUERY = this.all_filter + " AND DATE(POST_CREATED_DATETIME) BETWEEN '" + date[0] + "-04-01' AND '" + date[1] + "-03-31'" + f_filtar;

    this.ScheduleData.REPORT_ID = 12;

    this.ScheduleData.USER_ID = parseInt(this._cookie.get('userId'));

    this.loadingRecords = true;

    this.api.getScheduledReport(this.pageIndex, this.pageSize, '', '', '' + 'AND STATUS=1 AND REPORT_ID=12').subscribe(data => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.ScheduleVisible = true;
        this.dataList = data['data'];
        if (this.totalRecords > 0) {
          this.ScheduleData.REPORT_NAME = data['data'][0]['REPORT_NAME'];
        }

        this.pageIndex++;
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getWidth() {
    if (window.innerWidth <= 400) {
      return 350;

    } else {
      return 850;
    }
  }

  ScheduleClose(): void {
    this.pageIndex = 1;
    this.getPaySummaryReport();
    this.ScheduleVisible = false;
  }

  get closeCallbackSchedule() {
    return this.ScheduleClose.bind(this);
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
      // if (this.FEDERATION_ID != 0) { obj1['Federation Name'] = this.dataListForExport[i]['FEDERATION_NAME']; }

      // if (this.UNIT_ID != 0) { obj1['Unit Name'] = this.dataListForExport[i]['UNIT_NAME']; }

      // if (this.GROUP_ID != 0) { obj1['Name of Group'] = this.dataListForExport[i]['GROUP_NAME']; }
      if (this.ROLE_ID == 60 && this.FEDERATION_ID == 0 && this.UNIT_ID == 0 && this.GROUP_ID == 0) {
        obj1['Total Federation'] = this.dataListForExport[i]['TOTAL_FEDERATION'];
      }

      if ((this.FEDERATION_ID != 0) || (this.ROLE_ID == 60 && this.FEDERATION_ID == 0 && this.UNIT_ID == 0 && this.GROUP_ID == 0)) { obj1['Total Unit'] = this.dataListForExport[i]['TOTAL_UNIT']; }

      if ((this.UNIT_ID != 0 || this.FEDERATION_ID != 0) || (this.ROLE_ID == 60 && this.FEDERATION_ID == 0 && this.UNIT_ID == 0 && this.GROUP_ID == 0)) { obj1['Total Group'] = this.dataListForExport[i]['TOTAL_GROUP']; }

      if ((this.UNIT_ID != 0 || this.FEDERATION_ID != 0 || this.GROUP_ID != 0) || (this.ROLE_ID == 60 && this.FEDERATION_ID == 0 && this.UNIT_ID == 0 && this.GROUP_ID == 0)) { obj1['Total Member'] = this.dataListForExport[i]['TOTAL_MEMBER']; }

      if (this.Col3 == true) { obj1['Credit Amount'] = this.dataListForExport[i]['CREDIT_AMOUNT']; }

      if (this.Col4 == true) { obj1['Debit Amount'] = this.dataListForExport[i]['DEBIT_AMOUNT']; }

      if (this.Col5 == true) { obj1['Pending Amount'] = this.dataListForExport[i]['PENDING_AMOUNT']; }

      arry1.push(Object.assign({}, obj1));
      if (i == this.dataListForExport.length - 1) {
        this._exportService.exportExcel(arry1, 'Payment Summary Report ' + this.datePipe.transform(new Date(), 'dd-MMM-yy, hh mm ss a'));
      }
    }
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true);
  }

  getPaySummaryReport() {
    this.loadingRecords = true;
    this.all_filter = this.filterFederationName + this.filterTotalFederation + this.filterUnitName + this.filterTotalUnit + this.filterGroupName + this.filterTotalGroup, + this.filterTotalPaidGroup + this.filterTotalMember, + this.filterTotalPaidMember + this.filterCreditAmount + this.filterDebitAmount + this.filterPendingAmount

    this.api.getPaymentSummaryReport(this.all_filter, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {
      if ((data['code'] == 200)) {
        this.PaySumReportData = data['data'];

        this.totalRecords = data['count'];
        this.loadingRecords = false;
      } else {
        this.message.error("Server Not Found", "");
        this.loadingRecords = false;

      }
    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
      this.loadingRecords = false;

    });
  }

  onChange(colName: string[]): void {
    this.columns = [];
    this.SelectColumn1 = this.nodes[0]['children'];

    this.Col3 = false;
    this.Col4 = false;
    this.Col5 = false;

    for (let i = 0; i <= 6; i++) {
      if (this.tagValue[i] == "Credit Amount") { this.Col3 = true; }
      if (this.tagValue[i] == "Debit Amount") { this.Col4 = true; }
      if (this.tagValue[i] == "Pending Amount") { this.Col5 = true; }
    }

    if (this.tagValue[0] == "Select All") {
      this.Col3 = true;
      this.Col4 = true;
      this.Col5 = true;
    }
  }

  value: string[] = ['0-0-0'];
  nodes = [{
    title: 'Select All', value: 'Select All', key: 'Select All',
    children: [
      {
        title: 'Credit Amount',
        value: 'Credit Amount',
        key: 'Credit Amount',
        isLeaf: true
      },
      {
        title: 'Debit Amount',
        value: 'Debit Amount',
        key: 'Debit Amount',
        isLeaf: true
      },
      {
        title: 'Pending Amount',
        value: 'Pending Amount',
        key: 'Pending Amount',
        isLeaf: true
      },
    ]
  }
  ];

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
    if (this.all_filter != "") {
      var filters = this.all_filter;
    } else {
      filters = ''
    }

    if (exportToExcel) {
      this.exportLoading = true;
      this.api.getPaymentSummaryReport(filters, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {

        if (data['code'] == 200) {
          this.dataListForExport = data['data'];
          this.totalRecords = data['count'];
          this.convertInExcel();
          this.exportLoading = false;

        }
      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
        this.exportLoading = false;

      });
    }
    else if (exportToPDF) {
      this.exportLoading1 = true;
      this.api.getPaymentSummaryReport(filters, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {

        if (data['code'] == 200) {
          this.pdfData = data['data'];
          this.isPDFModalVisible = true;
          this.exportLoading1 = false;

        } else {
          this.message.error("Server Not Found", "");
          this.exportLoading1 = false;

        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
        this.exportLoading1 = false;

      });
    }
    else {
      this.loadingRecords = true;
      this.api.getPaymentSummaryReport(filters, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {

        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.PaySumReportData = data['data'];
          this.totalRecords = data['count'];
        }
        else {
          this.loadingRecords = false;
          this.message.error("Server Not Found", "");
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
        this.loadingRecords = false;

      });
    }
  }

  handleCancel1() {
    this.isVisiblepdf = false;
  }

  getPaySummaryFilter() {
    if (this.filterFederationName == ') )') {
      this.filterFederationName = '';
    }
    if (this.filterTotalFederation == ') )') {
      this.filterTotalFederation = '';
    }
    if (this.filterUnitName == ') )') {
      this.filterUnitName = '';
    }
    if (this.filterTotalUnit == ') )') {
      this.filterTotalUnit = '';
    }
    if (this.filterGroupName == ') )') {
      this.filterGroupName = '';
    }
    if (this.filterTotalGroup == ') )') {
      this.filterTotalGroup = '';
    }
    if (this.filterTotalPaidGroup == ') )') {
      this.filterTotalPaidGroup = '';
    }
    if (this.filterTotalMember == ') )') {
      this.filterTotalMember = '';
    }
    if (this.filterTotalPaidMember == ') )') {
      this.filterTotalPaidMember = '';
    }
    if (this.filterCreditAmount == ') )') {
      this.filterCreditAmount = '';
    }
    if (this.filterDebitAmount == ') )') {
      this.filterDebitAmount = '';
    }
    if (this.filterPendingAmount == ') )') {
      this.filterPendingAmount = '';
    }

    this.all_filter = this.filterFederationName + this.filterTotalFederation + this.filterUnitName + this.filterTotalUnit + this.filterGroupName + this.filterTotalGroup + this.filterTotalPaidGroup + this.filterTotalMember + this.filterTotalPaidMember + this.filterCreditAmount + this.filterDebitAmount + this.filterPendingAmount
    this.api.getPaymentSummaryReport(this.all_filter, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {
      if ((data['code'] == 200)) {
        this.PaySumReportData = data['data'];
        this.totalRecords = data['count'];
        this.loadingRecords = false;
      } else {
        this.message.error("Server Not Found", "");
        this.loadingRecords = false;

      }
    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
      this.loadingRecords = false;

    });
  }

  // All Filter Modals
  // Federation Name Filter Modal
  isVisibleFederationName = false;
  showModalFederationName(i: any): void {
    this.isVisibleFederationName = true;
    this.model = "FEDERATION_NAME";
    this.model_name = 'Federation Name'
  }

  modelCancelFederationName() {
    this.isVisibleFederationName = false;
    this.getPaySummaryReport();
  }

  CloseFederationName(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterFederationName.splice(i, 1);
      return true;
    }
  }

  ANDBUTTONLASTFederationName(i: any, j: any) {
    this.mainFilterFederationName[i]['buttons']['AND'] = true
    this.mainFilterFederationName[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTFederationName(i: any, j: any) {
    this.mainFilterFederationName[i]['buttons']['AND'] = false
    this.mainFilterFederationName[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTFederationName1(i: any, j: any) {
    this.mainFilterFederationName[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterFederationName[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTFederationName1(i: any, j: any) {
    this.mainFilterFederationName[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterFederationName[i]['filter'][j]['buttons']['AND'] = false;
  }

  CloseGroupOfFederationName1(i: any, j: any) {
    if (this.mainFilterFederationName[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterFederationName[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterFederationName(i: any, j: any) {
    this.mainFilterFederationName[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );
    return true;
  }

  AddFilterGroupFederationName() {
    this.mainFilterFederationName.push({
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

  ApplyFilterFederationName() {
    if (this.mainFilterFederationName.length != 0) {
      var isok = true;
      this.filterFederationName = "";
      for (let i = 0; i < this.mainFilterFederationName.length; i++) {
        var Button = " ";

        if (this.mainFilterFederationName.length > 0) {
          if (this.mainFilterFederationName[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterFederationName[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }
        if (this.mainFilterFederationName.length > 0) {
          if (this.mainFilterFederationName[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterFederationName[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterFederationName[i]['filter'].length; j++) {

          if (this.mainFilterFederationName[i]['filter'][j]['INPUT'] == undefined || this.mainFilterFederationName[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Name', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterFederationName[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterFederationName[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterFederationName[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Name', 'Please fill the field');
              isok = false;
            } else
              if (this.mainFilterFederationName[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterFederationName[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterFederationName[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterFederationName[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else if (this.mainFilterFederationName[i]['buttons']['AND'] == false && this.mainFilterFederationName[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterFederationName[i]['filter'].length > 0) {
                  if (this.mainFilterFederationName[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";

                  }
                }
                if (this.mainFilterFederationName[i]['filter'].length > 0) {
                  if (this.mainFilterFederationName[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";

                  }
                }
                var condition = '';
                if (this.mainFilterFederationName[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterFederationName[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterFederationName[i]['filter'][j]['DROPDOWN'] == "Content") {
                  if (this.mainFilterFederationName[i]['filter'][j]['DROPDOWN'] == "Start With") {
                    condition = "LIKE" + " '" + this.mainFilterFederationName[i]['filter'][j]['INPUT'] + "%";
                  } else if (this.mainFilterFederationName[i]['filter'][j]['DROPDOWN'] == "End With") {
                    condition = "LIKE" + " '%" + this.mainFilterFederationName[i]['filter'][j]['INPUT'] + "";
                  } else {
                    condition = "LIKE" + " '%" + this.mainFilterFederationName[i]['filter'][j]['INPUT'] + "%";
                  }
                  this.filtersFederationName = Button + Button1 + ' ' + this.model + " " + condition + "'";
                } else {
                  this.filtersFederationName = Button + Button1 + ' ' + this.model + " " + this.mainFilterFederationName[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterFederationName[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterFederationName = this.filterFederationName + this.filtersFederationName;
              }
        }
        this.filterFederationName = this.filterFederationName + ") )";
      }
      if (isok) {
        this.loadingRecords = true;
        this.isVisibleFederationName = false;
        this.filterFederationName = ' AND ' + this.filterFederationName;
        this.getPaySummaryFilter();
      }
    }
  }

  ClearFederationName() {
    this.mainFilterFederationName = [];
    this.filterFederationName = '';
    this.mainFilterFederationName.push({
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
    this.getPaySummaryFilter();
  }

  // Total Federation Modal
  isVisibleTotalFederation = false;
  showModalTotalFederation(i: any): void {
    this.isVisibleTotalFederation = true;
    this.model = "TOTAL_FEDERATION";
    this.model_name = 'Total Federation'
  }

  modelCancelTotalFederation() {
    this.isVisibleTotalFederation = false;
  }

  CloseTotalFederation(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterTotalFederation.splice(i, 1);
      return true;
    }
  }

  ANDBUTTONLASTTotalFederation(i: any, j: any) {
    this.mainFilterTotalFederation[i]['buttons']['AND'] = true
    this.mainFilterTotalFederation[i]['buttons']['OR'] = false;
  }
  ORBUTTONLASTTotalFederation(i: any, j: any) {
    this.mainFilterTotalFederation[i]['buttons']['AND'] = false
    this.mainFilterTotalFederation[i]['buttons']['OR'] = true;
  }
  ANDBUTTONLASTTotalFederation1(i: any, j: any) {
    this.mainFilterTotalFederation[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterTotalFederation[i]['filter'][j]['buttons']['AND'] = true;
  }
  ORBUTTONLASTTotalFederation1(i: any, j: any) {
    this.mainFilterTotalFederation[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterTotalFederation[i]['filter'][j]['buttons']['AND'] = false;
  }

  CloseGroupOfTotalFederation1(i: any, j: any) {
    if (this.mainFilterTotalFederation[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterTotalFederation[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterTotalFederation(i: any, j: any) {
    this.mainFilterTotalFederation[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );
    return true;
  }

  AddFilterGroupTotalFederation() {
    this.mainFilterTotalFederation.push({
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

  ApplyFilterTotalFederation() {
    if (this.mainFilterTotalFederation.length != 0) {
      var isok = true;
      this.filterTotalFederation = "";
      for (let i = 0; i < this.mainFilterTotalFederation.length; i++) {
        var Button = " ";

        if (this.mainFilterTotalFederation.length > 0) {
          if (this.mainFilterTotalFederation[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterTotalFederation[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }
        if (this.mainFilterTotalFederation.length > 0) {
          if (this.mainFilterTotalFederation[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterTotalFederation[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterTotalFederation[i]['filter'].length; j++) {

          if (this.mainFilterTotalFederation[i]['filter'][j]['INPUT'] == undefined || this.mainFilterTotalFederation[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Count', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterTotalFederation[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterTotalFederation[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterTotalFederation[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Count', 'Please fill the field');
              isok = false;
            } else
              if (this.mainFilterTotalFederation[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterTotalFederation[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterTotalFederation[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterTotalFederation[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else if (this.mainFilterTotalFederation[i]['buttons']['AND'] == false && this.mainFilterTotalFederation[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterTotalFederation[i]['filter'].length > 0) {
                  if (this.mainFilterTotalFederation[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";

                  }
                }
                if (this.mainFilterTotalFederation[i]['filter'].length > 0) {
                  if (this.mainFilterTotalFederation[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";

                  }
                }

                if (this.mainFilterTotalFederation[i]['filter'][j]['DROPDOWN'] == "Between") {
                  this.filtersTotalFederation = Button + Button1 + ' ' + this.model + " " + this.mainFilterTotalFederation[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterTotalFederation[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterTotalFederation[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersTotalFederation = Button + Button1 + ' ' + this.model + " " + this.mainFilterTotalFederation[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterTotalFederation[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterTotalFederation = this.filterTotalFederation + this.filtersTotalFederation;
              }
        }
        this.filterTotalFederation = this.filterTotalFederation + ") )";
      }
      if (isok) {
        this.loadingRecords = true;
        this.isVisibleTotalFederation = false;
        this.filterTotalFederation = ' AND ' + this.filterTotalFederation;
        this.getPaySummaryFilter();
      }
    }
  }

  ClearTotalFederation() {
    this.mainFilterTotalFederation = [];
    this.filterTotalFederation = '';
    this.mainFilterTotalFederation.push({
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
    this.getPaySummaryFilter();
  }


  // Unit Name Filter Modal
  isVisibleUnitName = false;
  showModalUnitName(i: any): void {
    this.isVisibleUnitName = true;
    this.model = "UNIT_NAME";
    this.model_name = 'Unit Name'
  }

  modelCancelUnitName() {
    this.isVisibleUnitName = false;
    this.getPaySummaryReport();
  }

  CloseUnitName(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterUnitName.splice(i, 1);
      return true;
    }
  }

  ANDBUTTONLASTUnitName(i: any, j: any) {
    this.mainFilterUnitName[i]['buttons']['AND'] = true
    this.mainFilterUnitName[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTUnitName(i: any, j: any) {
    this.mainFilterUnitName[i]['buttons']['AND'] = false
    this.mainFilterUnitName[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTUnitName1(i: any, j: any) {
    this.mainFilterUnitName[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterUnitName[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTUnitName1(i: any, j: any) {
    this.mainFilterUnitName[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterUnitName[i]['filter'][j]['buttons']['AND'] = false;
  }

  CloseGroupOfUnitName1(i: any, j: any) {
    if (this.mainFilterUnitName[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterUnitName[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterUnitName(i: any, j: any) {
    this.mainFilterUnitName[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );
    return true;
  }

  AddFilterGroupUnitName() {
    this.mainFilterUnitName.push({
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

  ApplyFilterUnitName() {
    if (this.mainFilterUnitName.length != 0) {
      var isok = true;
      this.filterUnitName = "";
      for (let i = 0; i < this.mainFilterUnitName.length; i++) {
        var Button = " ";

        if (this.mainFilterUnitName.length > 0) {
          if (this.mainFilterUnitName[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterUnitName[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }
        if (this.mainFilterUnitName.length > 0) {
          if (this.mainFilterUnitName[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterUnitName[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterUnitName[i]['filter'].length; j++) {

          if (this.mainFilterUnitName[i]['filter'][j]['INPUT'] == undefined || this.mainFilterUnitName[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Name', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterUnitName[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterUnitName[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterUnitName[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Name', 'Please fill the field');
              isok = false;
            } else
              if (this.mainFilterUnitName[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterUnitName[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterUnitName[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterUnitName[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else if (this.mainFilterUnitName[i]['buttons']['AND'] == false && this.mainFilterUnitName[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterUnitName[i]['filter'].length > 0) {
                  if (this.mainFilterUnitName[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";

                  }
                }
                if (this.mainFilterUnitName[i]['filter'].length > 0) {
                  if (this.mainFilterUnitName[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";

                  }
                }
                var condition = '';
                if (this.mainFilterUnitName[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterUnitName[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterUnitName[i]['filter'][j]['DROPDOWN'] == "Content") {
                  if (this.mainFilterUnitName[i]['filter'][j]['DROPDOWN'] == "Start With") {
                    condition = "LIKE" + " '" + this.mainFilterUnitName[i]['filter'][j]['INPUT'] + "%";
                  } else if (this.mainFilterUnitName[i]['filter'][j]['DROPDOWN'] == "End With") {
                    condition = "LIKE" + " '%" + this.mainFilterUnitName[i]['filter'][j]['INPUT'] + "";
                  } else {
                    condition = "LIKE" + " '%" + this.mainFilterUnitName[i]['filter'][j]['INPUT'] + "%";
                  }
                  this.filtersUnitName = Button + Button1 + ' ' + this.model + " " + condition + "'";
                } else {
                  this.filtersUnitName = Button + Button1 + ' ' + this.model + " " + this.mainFilterUnitName[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterUnitName[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterUnitName = this.filterUnitName + this.filtersUnitName;
              }
        }
        this.filterUnitName = this.filterUnitName + ") )";
      }
      if (isok) {
        this.loadingRecords = true;
        this.isVisibleUnitName = false;
        this.filterUnitName = ' AND ' + this.filterUnitName;
        this.getPaySummaryFilter();
      }
    }
  }

  ClearUnitName() {
    this.mainFilterUnitName = [];
    this.filterUnitName = '';
    this.mainFilterUnitName.push({
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
    this.getPaySummaryFilter();
  }

  // Total Unit Modal
  isVisibleTotalUnit = false;
  showModalTotalUnit(i: any): void {
    this.isVisibleTotalUnit = true;
    this.model = "TOTAL_UNIT";
    this.model_name = 'Total Unit'
  }

  modelCancelTotalUnit() {
    this.isVisibleTotalUnit = false;
  }

  CloseTotalUnit(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterTotalUnit.splice(i, 1);
      return true;
    }
  }

  ANDBUTTONLASTTotalUnit(i: any, j: any) {
    this.mainFilterTotalUnit[i]['buttons']['AND'] = true
    this.mainFilterTotalUnit[i]['buttons']['OR'] = false;
  }
  ORBUTTONLASTTotalUnit(i: any, j: any) {
    this.mainFilterTotalUnit[i]['buttons']['AND'] = false
    this.mainFilterTotalUnit[i]['buttons']['OR'] = true;
  }
  ANDBUTTONLASTTotalUnit1(i: any, j: any) {
    this.mainFilterTotalUnit[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterTotalUnit[i]['filter'][j]['buttons']['AND'] = true;
  }
  ORBUTTONLASTTotalUnit1(i: any, j: any) {
    this.mainFilterTotalUnit[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterTotalUnit[i]['filter'][j]['buttons']['AND'] = false;
  }

  CloseGroupOfTotalUnit1(i: any, j: any) {
    if (this.mainFilterTotalUnit[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterTotalUnit[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterTotalUnit(i: any, j: any) {
    this.mainFilterTotalUnit[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );
    return true;
  }

  AddFilterGroupTotalUnit() {
    this.mainFilterTotalUnit.push({
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

  ApplyFilterTotalUnit() {
    if (this.mainFilterTotalUnit.length != 0) {
      var isok = true;
      this.filterTotalUnit = "";
      for (let i = 0; i < this.mainFilterTotalUnit.length; i++) {
        var Button = " ";

        if (this.mainFilterTotalUnit.length > 0) {
          if (this.mainFilterTotalUnit[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterTotalUnit[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }
        if (this.mainFilterTotalUnit.length > 0) {
          if (this.mainFilterTotalUnit[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterTotalUnit[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterTotalUnit[i]['filter'].length; j++) {

          if (this.mainFilterTotalUnit[i]['filter'][j]['INPUT'] == undefined || this.mainFilterTotalUnit[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Count', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterTotalUnit[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterTotalUnit[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterTotalUnit[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Count', 'Please fill the field');
              isok = false;
            } else
              if (this.mainFilterTotalUnit[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterTotalUnit[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterTotalUnit[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterTotalUnit[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else if (this.mainFilterTotalUnit[i]['buttons']['AND'] == false && this.mainFilterTotalUnit[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterTotalUnit[i]['filter'].length > 0) {
                  if (this.mainFilterTotalUnit[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";

                  }
                }
                if (this.mainFilterTotalUnit[i]['filter'].length > 0) {
                  if (this.mainFilterTotalUnit[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";

                  }
                }

                if (this.mainFilterTotalUnit[i]['filter'][j]['DROPDOWN'] == "Between") {
                  this.filtersTotalUnit = Button + Button1 + ' ' + this.model + " " + this.mainFilterTotalUnit[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterTotalUnit[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterTotalUnit[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersTotalUnit = Button + Button1 + ' ' + this.model + " " + this.mainFilterTotalUnit[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterTotalUnit[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterTotalUnit = this.filterTotalUnit + this.filtersTotalUnit;
              }
        }
        this.filterTotalUnit = this.filterTotalUnit + ") )";
      }
      if (isok) {
        this.loadingRecords = true;
        this.isVisibleTotalUnit = false;
        this.filterTotalUnit = ' AND ' + this.filterTotalUnit;
        this.getPaySummaryFilter();
      }
    }
  }

  ClearTotalUnit() {
    this.mainFilterTotalUnit = [];
    this.filterTotalUnit = '';
    this.mainFilterTotalUnit.push({
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
    this.getPaySummaryFilter();
  }

  //  Group Name Filter Modal 
  isVisibleGroupName = false;
  showModalGroupName(i: any): void {
    this.isVisibleGroupName = true;
    this.model = "GROUP_NAME";
    this.model_name = 'Group Name'
  }

  modelCancelGroupName() {
    this.isVisibleGroupName = false;
    this.getPaySummaryReport();
  }

  CloseGroupName(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterGroupName.splice(i, 1);
      return true;
    }
  }

  ANDBUTTONLASTGroupName(i: any, j: any) {
    this.mainFilterGroupName[i]['buttons']['AND'] = true
    this.mainFilterGroupName[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTGroupName(i: any, j: any) {
    this.mainFilterGroupName[i]['buttons']['AND'] = false
    this.mainFilterGroupName[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTGroupName1(i: any, j: any) {
    this.mainFilterGroupName[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterGroupName[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTGroupName1(i: any, j: any) {
    this.mainFilterGroupName[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterGroupName[i]['filter'][j]['buttons']['AND'] = false;
  }

  CloseGroupOfGroupName1(i: any, j: any) {
    if (this.mainFilterGroupName[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterGroupName[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterGroupName(i: any, j: any) {
    this.mainFilterGroupName[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );
    return true;
  }

  AddFilterGroupGroupName() {
    this.mainFilterGroupName.push({
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

  ApplyFilterGroupName() {
    if (this.mainFilterGroupName.length != 0) {
      var isok = true;
      this.filterGroupName = "";
      for (let i = 0; i < this.mainFilterGroupName.length; i++) {
        var Button = " ";

        if (this.mainFilterGroupName.length > 0) {
          if (this.mainFilterGroupName[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterGroupName[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }
        if (this.mainFilterGroupName.length > 0) {
          if (this.mainFilterGroupName[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterGroupName[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterGroupName[i]['filter'].length; j++) {

          if (this.mainFilterGroupName[i]['filter'][j]['INPUT'] == undefined || this.mainFilterGroupName[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Name', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterGroupName[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterGroupName[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterGroupName[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Name', 'Please fill the field');
              isok = false;
            } else
              if (this.mainFilterGroupName[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterGroupName[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterGroupName[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterGroupName[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else if (this.mainFilterGroupName[i]['buttons']['AND'] == false && this.mainFilterGroupName[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterGroupName[i]['filter'].length > 0) {
                  if (this.mainFilterGroupName[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";

                  }
                }
                if (this.mainFilterGroupName[i]['filter'].length > 0) {
                  if (this.mainFilterGroupName[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";

                  }
                }
                var condition = '';
                if (this.mainFilterGroupName[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterGroupName[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterGroupName[i]['filter'][j]['DROPDOWN'] == "Content") {
                  if (this.mainFilterGroupName[i]['filter'][j]['DROPDOWN'] == "Start With") {
                    condition = "LIKE" + " '" + this.mainFilterGroupName[i]['filter'][j]['INPUT'] + "%";
                  } else if (this.mainFilterGroupName[i]['filter'][j]['DROPDOWN'] == "End With") {
                    condition = "LIKE" + " '%" + this.mainFilterGroupName[i]['filter'][j]['INPUT'] + "";
                  } else {
                    condition = "LIKE" + " '%" + this.mainFilterGroupName[i]['filter'][j]['INPUT'] + "%";
                  }
                  this.filtersGroupName = Button + Button1 + ' ' + this.model + " " + condition + "'";
                } else {
                  this.filtersGroupName = Button + Button1 + ' ' + this.model + " " + this.mainFilterGroupName[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterGroupName[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterGroupName = this.filterGroupName + this.filtersGroupName;
              }
        }
        this.filterGroupName = this.filterGroupName + ") )";
      }
      if (isok) {
        this.loadingRecords = true;
        this.isVisibleGroupName = false;
        this.filterGroupName = ' AND ' + this.filterGroupName;
        this.getPaySummaryFilter();
      }
    }
  }

  ClearGroupName() {
    this.mainFilterGroupName = [];
    this.filterGroupName = '';
    this.mainFilterGroupName.push({
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
    this.getPaySummaryFilter();
  }

  // Total Group Modal
  isVisibleTotalGroup = false;
  showModalTotalGroup(i: any): void {
    this.isVisibleTotalGroup = true;
    this.model = "TOTAL_GROUP";
    this.model_name = 'Total Group'
  }

  modelCancelTotalGroup() {
    this.isVisibleTotalGroup = false;
  }

  CloseTotalGroup(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterTotalGroup.splice(i, 1);
      return true;
    }
  }

  ANDBUTTONLASTTotalGroup(i: any, j: any) {
    this.mainFilterTotalGroup[i]['buttons']['AND'] = true
    this.mainFilterTotalGroup[i]['buttons']['OR'] = false;
  }
  ORBUTTONLASTTotalGroup(i: any, j: any) {
    this.mainFilterTotalGroup[i]['buttons']['AND'] = false
    this.mainFilterTotalGroup[i]['buttons']['OR'] = true;
  }
  ANDBUTTONLASTTotalGroup1(i: any, j: any) {
    this.mainFilterTotalGroup[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterTotalGroup[i]['filter'][j]['buttons']['AND'] = true;
  }
  ORBUTTONLASTTotalGroup1(i: any, j: any) {
    this.mainFilterTotalGroup[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterTotalGroup[i]['filter'][j]['buttons']['AND'] = false;
  }

  CloseGroupOfTotalGroup1(i: any, j: any) {
    if (this.mainFilterTotalGroup[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterTotalGroup[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterTotalGroup(i: any, j: any) {
    this.mainFilterTotalGroup[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );
    return true;
  }

  AddFilterGroupTotalGroup() {
    this.mainFilterTotalGroup.push({
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

  ApplyFilterTotalGroup() {
    if (this.mainFilterTotalGroup.length != 0) {
      var isok = true;
      this.filterTotalGroup = "";
      for (let i = 0; i < this.mainFilterTotalGroup.length; i++) {
        var Button = " ";

        if (this.mainFilterTotalGroup.length > 0) {
          if (this.mainFilterTotalGroup[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterTotalGroup[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }
        if (this.mainFilterTotalGroup.length > 0) {
          if (this.mainFilterTotalGroup[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterTotalGroup[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterTotalGroup[i]['filter'].length; j++) {

          if (this.mainFilterTotalGroup[i]['filter'][j]['INPUT'] == undefined || this.mainFilterTotalGroup[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Count', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterTotalGroup[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterTotalGroup[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterTotalGroup[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Count', 'Please fill the field');
              isok = false;
            } else
              if (this.mainFilterTotalGroup[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterTotalGroup[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterTotalGroup[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterTotalGroup[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else if (this.mainFilterTotalGroup[i]['buttons']['AND'] == false && this.mainFilterTotalGroup[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterTotalGroup[i]['filter'].length > 0) {
                  if (this.mainFilterTotalGroup[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";

                  }
                }
                if (this.mainFilterTotalGroup[i]['filter'].length > 0) {
                  if (this.mainFilterTotalGroup[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";

                  }
                }

                if (this.mainFilterTotalGroup[i]['filter'][j]['DROPDOWN'] == "Between") {
                  this.filtersTotalGroup = Button + Button1 + ' ' + this.model + " " + this.mainFilterTotalGroup[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterTotalGroup[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterTotalGroup[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersTotalGroup = Button + Button1 + ' ' + this.model + " " + this.mainFilterTotalGroup[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterTotalGroup[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterTotalGroup = this.filterTotalGroup + this.filtersTotalGroup;
              }
        }
        this.filterTotalGroup = this.filterTotalGroup + ") )";
      }
      if (isok) {
        this.loadingRecords = true;
        this.isVisibleTotalGroup = false;
        this.filterTotalGroup = ' AND ' + this.filterTotalGroup;
        this.getPaySummaryFilter();
      }
    }
  }

  ClearTotalGroup() {
    this.mainFilterTotalGroup = [];
    this.filterTotalGroup = '';
    this.mainFilterTotalGroup.push({
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
    this.getPaySummaryFilter();
  }

  // Total Paid Group Modal
  isVisibleTotalPaidGroup = false;
  showModalTotalPaidGroup(i: any): void {
    this.isVisibleTotalPaidGroup = true;
    this.model = "TOTAL_PAID_GROUP";
    this.model_name = 'Total Paid Group'
  }

  modelCancelTotalPaidGroup() {
    this.isVisibleTotalPaidGroup = false;
  }

  CloseTotalPaidGroup(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterTotalPaidGroup.splice(i, 1);
      return true;
    }
  }

  ANDBUTTONLASTTotalPaidGroup(i: any, j: any) {
    this.mainFilterTotalPaidGroup[i]['buttons']['AND'] = true
    this.mainFilterTotalPaidGroup[i]['buttons']['OR'] = false;
  }
  ORBUTTONLASTTotalPaidGroup(i: any, j: any) {
    this.mainFilterTotalPaidGroup[i]['buttons']['AND'] = false
    this.mainFilterTotalPaidGroup[i]['buttons']['OR'] = true;
  }
  ANDBUTTONLASTTotalPaidGroup1(i: any, j: any) {
    this.mainFilterTotalPaidGroup[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterTotalPaidGroup[i]['filter'][j]['buttons']['AND'] = true;
  }
  ORBUTTONLASTTotalPaidGroup1(i: any, j: any) {
    this.mainFilterTotalPaidGroup[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterTotalPaidGroup[i]['filter'][j]['buttons']['AND'] = false;
  }

  CloseGroupOfTotalPaidGroup1(i: any, j: any) {
    if (this.mainFilterTotalPaidGroup[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterTotalPaidGroup[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterTotalPaidGroup(i: any, j: any) {
    this.mainFilterTotalPaidGroup[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );
    return true;
  }

  AddFilterGroupTotalPaidGroup() {
    this.mainFilterTotalPaidGroup.push({
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

  ApplyFilterTotalPaidGroup() {
    if (this.mainFilterTotalPaidGroup.length != 0) {
      var isok = true;
      this.filterTotalPaidGroup = "";
      for (let i = 0; i < this.mainFilterTotalPaidGroup.length; i++) {
        var Button = " ";

        if (this.mainFilterTotalPaidGroup.length > 0) {
          if (this.mainFilterTotalPaidGroup[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterTotalPaidGroup[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }
        if (this.mainFilterTotalPaidGroup.length > 0) {
          if (this.mainFilterTotalPaidGroup[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterTotalPaidGroup[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterTotalPaidGroup[i]['filter'].length; j++) {

          if (this.mainFilterTotalPaidGroup[i]['filter'][j]['INPUT'] == undefined || this.mainFilterTotalPaidGroup[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Count', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterTotalPaidGroup[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterTotalPaidGroup[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterTotalPaidGroup[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Count', 'Please fill the field');
              isok = false;
            } else
              if (this.mainFilterTotalPaidGroup[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterTotalPaidGroup[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterTotalPaidGroup[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterTotalPaidGroup[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else if (this.mainFilterTotalPaidGroup[i]['buttons']['AND'] == false && this.mainFilterTotalPaidGroup[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterTotalPaidGroup[i]['filter'].length > 0) {
                  if (this.mainFilterTotalPaidGroup[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";

                  }
                }
                if (this.mainFilterTotalPaidGroup[i]['filter'].length > 0) {
                  if (this.mainFilterTotalPaidGroup[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";

                  }
                }

                if (this.mainFilterTotalPaidGroup[i]['filter'][j]['DROPDOWN'] == "Between") {
                  this.filtersTotalPaidGroup = Button + Button1 + ' ' + this.model + " " + this.mainFilterTotalPaidGroup[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterTotalPaidGroup[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterTotalPaidGroup[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersTotalPaidGroup = Button + Button1 + ' ' + this.model + " " + this.mainFilterTotalPaidGroup[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterTotalPaidGroup[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterTotalPaidGroup = this.filterTotalPaidGroup + this.filtersTotalPaidGroup;
              }
        }
        this.filterTotalPaidGroup = this.filterTotalPaidGroup + ") )";
      }
      if (isok) {
        this.loadingRecords = true;
        this.isVisibleTotalPaidGroup = false;
        this.filterTotalPaidGroup = ' AND ' + this.filterTotalPaidGroup;
        this.getPaySummaryFilter();
      }
    }
  }

  ClearTotalPaidGroup() {
    this.mainFilterTotalPaidGroup = [];
    this.filterTotalPaidGroup = '';
    this.mainFilterTotalPaidGroup.push({
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
    this.getPaySummaryFilter();
  }

  //  Total Member Modal
  isVisibleTotalMember = false;
  showModalTotalMember(i: any): void {
    this.isVisibleTotalMember = true;
    this.model = "TOTAL_MEMBER";
    this.model_name = 'Total Member'
  }

  modelCancelTotalMember() {
    this.isVisibleTotalMember = false;
  }

  CloseTotalMember(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterTotalMember.splice(i, 1);
      return true;
    }
  }

  ANDBUTTONLASTTotalMember(i: any, j: any) {
    this.mainFilterTotalMember[i]['buttons']['AND'] = true
    this.mainFilterTotalMember[i]['buttons']['OR'] = false;
  }
  ORBUTTONLASTTotalMember(i: any, j: any) {
    this.mainFilterTotalMember[i]['buttons']['AND'] = false
    this.mainFilterTotalMember[i]['buttons']['OR'] = true;
  }
  ANDBUTTONLASTTotalMember1(i: any, j: any) {
    this.mainFilterTotalMember[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterTotalMember[i]['filter'][j]['buttons']['AND'] = true;
  }
  ORBUTTONLASTTotalMember1(i: any, j: any) {
    this.mainFilterTotalMember[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterTotalMember[i]['filter'][j]['buttons']['AND'] = false;
  }

  CloseGroupOfTotalMember1(i: any, j: any) {
    if (this.mainFilterTotalMember[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterTotalMember[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterTotalMember(i: any, j: any) {
    this.mainFilterTotalMember[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );
    return true;
  }

  AddFilterGroupTotalMember() {
    this.mainFilterTotalMember.push({
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

  ApplyFilterTotalMember() {
    if (this.mainFilterTotalMember.length != 0) {
      var isok = true;
      this.filterTotalMember = "";
      for (let i = 0; i < this.mainFilterTotalMember.length; i++) {
        var Button = " ";

        if (this.mainFilterTotalMember.length > 0) {
          if (this.mainFilterTotalMember[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterTotalMember[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }
        if (this.mainFilterTotalMember.length > 0) {
          if (this.mainFilterTotalMember[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterTotalMember[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterTotalMember[i]['filter'].length; j++) {

          if (this.mainFilterTotalMember[i]['filter'][j]['INPUT'] == undefined || this.mainFilterTotalMember[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Count', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterTotalMember[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterTotalMember[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterTotalMember[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Count', 'Please fill the field');
              isok = false;
            } else
              if (this.mainFilterTotalMember[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterTotalMember[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterTotalMember[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterTotalMember[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else if (this.mainFilterTotalMember[i]['buttons']['AND'] == false && this.mainFilterTotalMember[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterTotalMember[i]['filter'].length > 0) {
                  if (this.mainFilterTotalMember[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";

                  }
                }
                if (this.mainFilterTotalMember[i]['filter'].length > 0) {
                  if (this.mainFilterTotalMember[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";

                  }
                }

                if (this.mainFilterTotalMember[i]['filter'][j]['DROPDOWN'] == "Between") {
                  this.filtersTotalMember = Button + Button1 + ' ' + this.model + " " + this.mainFilterTotalMember[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterTotalMember[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterTotalMember[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersTotalMember = Button + Button1 + ' ' + this.model + " " + this.mainFilterTotalMember[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterTotalMember[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterTotalMember = this.filterTotalMember + this.filtersTotalMember;
              }
        }
        this.filterTotalMember = this.filterTotalMember + ") )";
      }
      if (isok) {
        this.loadingRecords = true;
        this.isVisibleTotalMember = false;
        this.filterTotalMember = ' AND ' + this.filterTotalMember;
        this.getPaySummaryFilter();
      }
    }
  }

  ClearTotalMember() {
    this.mainFilterTotalMember = [];
    this.filterTotalMember = '';
    this.mainFilterTotalMember.push({
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
    this.getPaySummaryFilter();
  }

  //  Total Paid Member Modal
  isVisibleTotalPaidMember = false;
  showModalTotalPaidMember(i: any): void {
    this.isVisibleTotalPaidMember = true;
    this.model = "TOTAL_PAID_MEMBER";
    this.model_name = 'Total Paid Member'
  }

  modelCancelTotalPaidMember() {
    this.isVisibleTotalPaidMember = false;
  }

  CloseTotalPaidMember(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterTotalPaidMember.splice(i, 1);
      return true;
    }
  }

  ANDBUTTONLASTTotalPaidMember(i: any, j: any) {
    this.mainFilterTotalPaidMember[i]['buttons']['AND'] = true
    this.mainFilterTotalPaidMember[i]['buttons']['OR'] = false;
  }
  ORBUTTONLASTTotalPaidMember(i: any, j: any) {
    this.mainFilterTotalPaidMember[i]['buttons']['AND'] = false
    this.mainFilterTotalPaidMember[i]['buttons']['OR'] = true;
  }
  ANDBUTTONLASTTotalPaidMember1(i: any, j: any) {
    this.mainFilterTotalPaidMember[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterTotalPaidMember[i]['filter'][j]['buttons']['AND'] = true;
  }
  ORBUTTONLASTTotalPaidMember1(i: any, j: any) {
    this.mainFilterTotalPaidMember[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterTotalPaidMember[i]['filter'][j]['buttons']['AND'] = false;
  }

  CloseGroupOfTotalPaidMember1(i: any, j: any) {
    if (this.mainFilterTotalPaidMember[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterTotalPaidMember[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterTotalPaidMember(i: any, j: any) {
    this.mainFilterTotalPaidMember[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );
    return true;
  }

  AddFilterGroupTotalPaidMember() {
    this.mainFilterTotalPaidMember.push({
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

  ApplyFilterTotalPaidMember() {
    if (this.mainFilterTotalPaidMember.length != 0) {
      var isok = true;
      this.filterTotalPaidMember = "";
      for (let i = 0; i < this.mainFilterTotalPaidMember.length; i++) {
        var Button = " ";

        if (this.mainFilterTotalPaidMember.length > 0) {
          if (this.mainFilterTotalPaidMember[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterTotalPaidMember[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }
        if (this.mainFilterTotalPaidMember.length > 0) {
          if (this.mainFilterTotalPaidMember[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterTotalPaidMember[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterTotalPaidMember[i]['filter'].length; j++) {

          if (this.mainFilterTotalPaidMember[i]['filter'][j]['INPUT'] == undefined || this.mainFilterTotalPaidMember[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Count', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterTotalPaidMember[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterTotalPaidMember[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterTotalPaidMember[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Count', 'Please fill the field');
              isok = false;
            } else
              if (this.mainFilterTotalPaidMember[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterTotalPaidMember[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterTotalPaidMember[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterTotalPaidMember[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else if (this.mainFilterTotalPaidMember[i]['buttons']['AND'] == false && this.mainFilterTotalPaidMember[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterTotalPaidMember[i]['filter'].length > 0) {
                  if (this.mainFilterTotalPaidMember[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";

                  }
                }
                if (this.mainFilterTotalPaidMember[i]['filter'].length > 0) {
                  if (this.mainFilterTotalPaidMember[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";

                  }
                }

                if (this.mainFilterTotalPaidMember[i]['filter'][j]['DROPDOWN'] == "Between") {
                  this.filtersTotalPaidMember = Button + Button1 + ' ' + this.model + " " + this.mainFilterTotalPaidMember[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterTotalPaidMember[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterTotalPaidMember[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersTotalPaidMember = Button + Button1 + ' ' + this.model + " " + this.mainFilterTotalPaidMember[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterTotalPaidMember[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterTotalPaidMember = this.filterTotalPaidMember + this.filtersTotalPaidMember;
              }
        }
        this.filterTotalPaidMember = this.filterTotalPaidMember + ") )";
      }
      if (isok) {
        this.loadingRecords = true;
        this.isVisibleTotalPaidMember = false;
        this.filterTotalPaidMember = ' AND ' + this.filterTotalPaidMember;
        this.getPaySummaryFilter();
      }
    }
  }

  ClearTotalPaidMember() {
    this.mainFilterTotalPaidMember = [];
    this.filterTotalPaidMember = '';
    this.mainFilterTotalPaidMember.push({
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
    this.getPaySummaryFilter();
  }

  // Credit Amount Modal
  isVisibleCreditAmount = false;
  showModalCreditAmount(i: any): void {
    this.isVisibleCreditAmount = true;
    this.model = "CREDIT_AMOUNT";
    this.model_name = 'Credit Amount'
  }

  modelCancelCreditAmount() {
    this.isVisibleCreditAmount = false;
  }

  CloseCreditAmount(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterCreditAmount.splice(i, 1);
      return true;
    }
  }

  ANDBUTTONLASTCreditAmount(i: any, j: any) {
    this.mainFilterCreditAmount[i]['buttons']['AND'] = true
    this.mainFilterCreditAmount[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTCreditAmount(i: any, j: any) {
    this.mainFilterCreditAmount[i]['buttons']['AND'] = false
    this.mainFilterCreditAmount[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTCreditAmount1(i: any, j: any) {
    this.mainFilterCreditAmount[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterCreditAmount[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTCreditAmount1(i: any, j: any) {
    this.mainFilterCreditAmount[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterCreditAmount[i]['filter'][j]['buttons']['AND'] = false;
  }

  CloseGroupOfCreditAmount1(i: any, j: any) {
    if (this.mainFilterCreditAmount[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterCreditAmount[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterCreditAmount(i: any, j: any) {
    this.mainFilterCreditAmount[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );
    return true;
  }

  AddFilterGroupCreditAmount() {
    this.mainFilterCreditAmount.push({
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

  ApplyFilterCreditAmount() {
    if (this.mainFilterCreditAmount.length != 0) {
      var isok = true;
      this.filterCreditAmount = "";
      for (let i = 0; i < this.mainFilterCreditAmount.length; i++) {
        var Button = " ";

        if (this.mainFilterCreditAmount.length > 0) {
          if (this.mainFilterCreditAmount[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterCreditAmount[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }
        if (this.mainFilterCreditAmount.length > 0) {
          if (this.mainFilterCreditAmount[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterCreditAmount[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterCreditAmount[i]['filter'].length; j++) {

          if (this.mainFilterCreditAmount[i]['filter'][j]['INPUT'] == undefined || this.mainFilterCreditAmount[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Count', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterCreditAmount[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterCreditAmount[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterCreditAmount[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Count', 'Please fill the field');
              isok = false;
            } else
              if (this.mainFilterCreditAmount[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterCreditAmount[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterCreditAmount[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterCreditAmount[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else if (this.mainFilterCreditAmount[i]['buttons']['AND'] == false && this.mainFilterCreditAmount[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterCreditAmount[i]['filter'].length > 0) {
                  if (this.mainFilterCreditAmount[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";

                  }
                }
                if (this.mainFilterCreditAmount[i]['filter'].length > 0) {
                  if (this.mainFilterCreditAmount[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";

                  }
                }

                if (this.mainFilterCreditAmount[i]['filter'][j]['DROPDOWN'] == "Between") {
                  this.filtersCreditAmount = Button + Button1 + ' ' + this.model + " " + this.mainFilterCreditAmount[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterCreditAmount[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterCreditAmount[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersCreditAmount = Button + Button1 + ' ' + this.model + " " + this.mainFilterCreditAmount[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterCreditAmount[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterCreditAmount = this.filterCreditAmount + this.filtersCreditAmount;
              }
        }
        this.filterCreditAmount = this.filterCreditAmount + ") )";
      }
      if (isok) {
        this.loadingRecords = true;
        this.isVisibleCreditAmount = false;
        this.filterCreditAmount = ' AND ' + this.filterCreditAmount;
        this.getPaySummaryFilter();
      }
    }
  }

  ClearCreditAmount() {
    this.mainFilterCreditAmount = [];
    this.filterCreditAmount = '';
    this.mainFilterCreditAmount.push({
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
    this.getPaySummaryFilter();
  }

  // Debit Amount Modal
  isVisibleDebitAmount = false;
  showModalDebitAmount(i: any): void {
    this.isVisibleDebitAmount = true;
    this.model = "DEBIT_AMOUNT";
    this.model_name = 'Debit Amount'
  }

  modelCancelDebitAmount() {
    this.isVisibleDebitAmount = false;
  }

  CloseDebitAmount(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterDebitAmount.splice(i, 1);
      return true;
    }
  }

  ANDBUTTONLASTDebitAmount(i: any, j: any) {
    this.mainFilterDebitAmount[i]['buttons']['AND'] = true
    this.mainFilterDebitAmount[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTDebitAmount(i: any, j: any) {
    this.mainFilterDebitAmount[i]['buttons']['AND'] = false
    this.mainFilterDebitAmount[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTDebitAmount1(i: any, j: any) {
    this.mainFilterDebitAmount[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterDebitAmount[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTDebitAmount1(i: any, j: any) {
    this.mainFilterDebitAmount[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterDebitAmount[i]['filter'][j]['buttons']['AND'] = false;
  }

  CloseGroupOfDebitAmount1(i: any, j: any) {
    if (this.mainFilterDebitAmount[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterDebitAmount[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterDebitAmount(i: any, j: any) {
    this.mainFilterDebitAmount[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );
    return true;
  }

  AddFilterGroupDebitAmount() {
    this.mainFilterDebitAmount.push({
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

  ApplyFilterDebitAmount() {
    if (this.mainFilterDebitAmount.length != 0) {
      var isok = true;
      this.filterDebitAmount = "";
      for (let i = 0; i < this.mainFilterDebitAmount.length; i++) {
        var Button = " ";

        if (this.mainFilterDebitAmount.length > 0) {
          if (this.mainFilterDebitAmount[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterDebitAmount[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }
        if (this.mainFilterDebitAmount.length > 0) {
          if (this.mainFilterDebitAmount[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterDebitAmount[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterDebitAmount[i]['filter'].length; j++) {

          if (this.mainFilterDebitAmount[i]['filter'][j]['INPUT'] == undefined || this.mainFilterDebitAmount[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Count', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterDebitAmount[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterDebitAmount[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterDebitAmount[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Count', 'Please fill the field');
              isok = false;
            } else
              if (this.mainFilterDebitAmount[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterDebitAmount[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterDebitAmount[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterDebitAmount[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else if (this.mainFilterDebitAmount[i]['buttons']['AND'] == false && this.mainFilterDebitAmount[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterDebitAmount[i]['filter'].length > 0) {
                  if (this.mainFilterDebitAmount[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";

                  }
                }
                if (this.mainFilterDebitAmount[i]['filter'].length > 0) {
                  if (this.mainFilterDebitAmount[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";

                  }
                }

                if (this.mainFilterDebitAmount[i]['filter'][j]['DROPDOWN'] == "Between") {
                  this.filtersDebitAmount = Button + Button1 + ' ' + this.model + " " + this.mainFilterDebitAmount[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterDebitAmount[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterDebitAmount[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersDebitAmount = Button + Button1 + ' ' + this.model + " " + this.mainFilterDebitAmount[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterDebitAmount[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterDebitAmount = this.filterDebitAmount + this.filtersDebitAmount;
              }
        }
        this.filterDebitAmount = this.filterDebitAmount + ") )";
      }
      if (isok) {
        this.loadingRecords = true;
        this.isVisibleDebitAmount = false;
        this.filterDebitAmount = ' AND ' + this.filterDebitAmount;
        this.getPaySummaryFilter();
      }
    }
  }

  ClearDebitAmount() {
    this.mainFilterDebitAmount = [];
    this.filterDebitAmount = '';
    this.mainFilterDebitAmount.push({
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
    this.getPaySummaryFilter();
  }

  // Pending Amount Modal
  isVisiblePendingAmount = false;
  showModalPendingAmount(i: any): void {
    this.isVisiblePendingAmount = true;
    this.model = "PENDING_AMOUNT";
    this.model_name = 'Pending Amount'
  }

  modelCancelPendingAmount() {
    this.isVisiblePendingAmount = false;
  }

  ClosePendingAmount(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterPendingAmount.splice(i, 1);
      return true;
    }
  }

  ANDBUTTONLASTPendingAmount(i: any, j: any) {
    this.mainFilterPendingAmount[i]['buttons']['AND'] = true
    this.mainFilterPendingAmount[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTPendingAmount(i: any, j: any) {
    this.mainFilterPendingAmount[i]['buttons']['AND'] = false
    this.mainFilterPendingAmount[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTPendingAmount1(i: any, j: any) {
    this.mainFilterPendingAmount[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterPendingAmount[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTPendingAmount1(i: any, j: any) {
    this.mainFilterPendingAmount[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterPendingAmount[i]['filter'][j]['buttons']['AND'] = false;
  }

  CloseGroupOfPendingAmount1(i: any, j: any) {
    if (this.mainFilterPendingAmount[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterPendingAmount[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterPendingAmount(i: any, j: any) {
    this.mainFilterPendingAmount[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );
    return true;
  }

  AddFilterGroupPendingAmount() {
    this.mainFilterPendingAmount.push({
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

  ApplyFilterPendingAmount() {
    if (this.mainFilterPendingAmount.length != 0) {
      var isok = true;
      this.filterPendingAmount = "";
      for (let i = 0; i < this.mainFilterPendingAmount.length; i++) {
        var Button = " ";

        if (this.mainFilterPendingAmount.length > 0) {
          if (this.mainFilterPendingAmount[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterPendingAmount[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }
        if (this.mainFilterPendingAmount.length > 0) {
          if (this.mainFilterPendingAmount[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterPendingAmount[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterPendingAmount[i]['filter'].length; j++) {

          if (this.mainFilterPendingAmount[i]['filter'][j]['INPUT'] == undefined || this.mainFilterPendingAmount[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Count', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterPendingAmount[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterPendingAmount[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterPendingAmount[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Count', 'Please fill the field');
              isok = false;
            } else
              if (this.mainFilterPendingAmount[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterPendingAmount[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterPendingAmount[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterPendingAmount[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else if (this.mainFilterPendingAmount[i]['buttons']['AND'] == false && this.mainFilterPendingAmount[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterPendingAmount[i]['filter'].length > 0) {
                  if (this.mainFilterPendingAmount[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";

                  }
                }
                if (this.mainFilterPendingAmount[i]['filter'].length > 0) {
                  if (this.mainFilterPendingAmount[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";

                  }
                }

                if (this.mainFilterPendingAmount[i]['filter'][j]['DROPDOWN'] == "Between") {
                  this.filtersPendingAmount = Button + Button1 + ' ' + this.model + " " + this.mainFilterPendingAmount[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterPendingAmount[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterPendingAmount[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersPendingAmount = Button + Button1 + ' ' + this.model + " " + this.mainFilterPendingAmount[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterPendingAmount[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterPendingAmount = this.filterPendingAmount + this.filtersPendingAmount;
              }
        }
        this.filterPendingAmount = this.filterPendingAmount + ") )";
      }
      if (isok) {
        this.loadingRecords = true;
        this.isVisiblePendingAmount = false;
        this.filterPendingAmount = ' AND ' + this.filterPendingAmount;
        this.getPaySummaryFilter();
      }
    }
  }

  ClearPendingAmount() {
    this.mainFilterPendingAmount = [];
    this.filterPendingAmount = '';
    this.mainFilterPendingAmount.push({
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
    this.getPaySummaryFilter();
  }
}
