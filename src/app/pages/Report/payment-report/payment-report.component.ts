import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { REPORTSCHEDULE } from 'src/app/Models/reportSchedule';
import { ApiService } from 'src/app/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.css']
})

export class PaymentReportComponent implements OnInit {
  Operators_name: string[][] = [["Start With", "Start With"], ["End With", "End With"], ["=", "="], ["<>", "!="], ['Content', 'Content']];
  columns: string[][] = [
    ["FEDERATION_NAME", "Federation Name"], ["UNIT_NAME", "Name Of Unit "],
    ["GROUP_NAME", "Name Of Group "], ["CREDIT_AMOUNT", "Credit Amount"],
    ["DEBIT_AMOUNT", "Debit Amount"], ["PENDING_AMOUNT", "Pending Amount"]];
  Operators: string[][] = [["Between", "Between"], ["=", "="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["<>", "!="]];
  filter = '';
  year = new Date().getFullYear();
  baseYear = 2020;
  range = [];
  next_year = Number(this.year + 1);
  SelectedYear: any;
  federations = [];
  totalRecords = 1;
  loadingRecords = true;
  pageIndex = 1;
  pageSize = 10;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText = '';
  exportLoading = false;
  dataListForExport = [];
  PaymentData = [];
  isVisiblepdf = false;
  formTitle: string = "Payment Report";
  a = new Date();
  b = new Date(this.a.getFullYear() + 1, 3, 1);
  tagValue: string[] = ["Select All", "Federation Name", "Name Of Unit", "Name Of Group", "Credit Amount", "Debit Amount", "Pending Amount"];
  federationId = Number(this._cookie.get('FEDERATION_ID'));
  UnitId = Number(this._cookie.get('UNIT_ID'));
  GroupId = Number(this._cookie.get('GROUP_ID'));

  constructor(private _cookie: CookieService, private api: ApiService, private message: NzNotificationService, private _exportService: ExportService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.getFederation();
    this.Fordate();
    this.current_year();
    this.ForClearFilter();
  }

  ForClearFilter() {
    this.mainFilterArrayUnitCount.push({
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

    this.mainFilterArrayfednm.push({
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

    this.mainFilterArraygrpcount.push({
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

    this.mainFilterArrayCreditAmt.push({
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

    this.mainFilterArrayDebitAmt.push({
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

    this.mainFilterArrayPendingAmt.push({
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
    this.loadingRecords = true;

    if (this.filter != "") {
      var filters = " AND " + this.filter;

    } else {
      filters = '';
    }

    this.SelectedYear = YEARs;

    this.api.getPaymentReport(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, "", this.SelectedYear, filters, this.federationId, this.UnitId, this.GroupId).subscribe(data => {
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

    if (this.all_filter != "") {
      var filters = this.all_filter;

    } else {
      filters = '';
    }

    if (exportToExcel) {
      this.exportLoading = true;

      this.api.getPaymentReport(0, 0, this.sortKey, this.sortValue, "", this.SelectedYear, filters, this.federationId, this.UnitId, this.GroupId).subscribe(data => {
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
      this.api.getPaymentReport(0, 0, this.sortKey, this.sortValue, "", this.SelectedYear, filters, this.federationId, this.UnitId, this.GroupId).subscribe(data => {
        if (data['code'] == 200) {
          this.PaymentData = data['data'];
          this.isVisiblepdf = true;
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });

    } else {
      this.loadingRecords = true;

      this.api.getPaymentReport(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, "", this.SelectedYear, filters, this.federationId, this.UnitId, this.GroupId).subscribe(data => {
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

  convertInExcel() {
    var arry1 = [];
    var obj1: any = new Object();

    for (var i = 0; i < this.dataListForExport.length; i++) {
      if (this.Col1 == true) {
        obj1['Federation Name'] = this.dataListForExport[i]['FEDERATION_NAME'];
      }
      if (this.Col2 == true) {
        obj1['Unit Name'] = this.dataListForExport[i]['UNIT_NAME'];
      }
      if (this.Col3 == true) {
        obj1['Name Of Group'] = this.dataListForExport[i]['GROUP_NAME'];
      }
      if (this.Col4 == true) {
        obj1['Credit Amount'] = this.dataListForExport[i]['CREDIT_AMOUNT'];
      }
      if (this.Col5 == true) {
        obj1['Debit Amount'] = this.dataListForExport[i]['DEBIT_AMOUNT'];
      }
      if (this.Col6) {
        obj1['Pending Amount'] = this.dataListForExport[i]['PENDING_AMOUNT'];
      }

      arry1.push(Object.assign({}, obj1));
      if (i == this.dataListForExport.length - 1) {
        this._exportService.exportExcel(arry1, 'Collection Fees Count ' + this.datePipe.transform(new Date(), 'dd-MMM-yy, hh mm ss a'));
      }
    }
  }

  getFederation() {
    this.api.getPaymentReport(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, "", this.SelectedYear, "", this.federationId, this.UnitId, this.GroupId).subscribe(data => {
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

  handleCancel1() {
    this.isVisiblepdf = false;
  }

  HandleCancel() {
    this.isVisiblepdf = false;
  }

  importInExcel() {
    this.search(true, true);
  }

  importInPdf() {
    this.search(true, false, true);
    this.isVisiblepdf = true;
  }

  SelectColumn1 = [];
  Col1: boolean = true;
  Col2: boolean = true;
  Col3: boolean = true;
  Col4: boolean = true;
  Col5: boolean = true;
  Col6: boolean = true;

  onChange(colName: string[]): void {
    this.columns = [];
    this.SelectColumn1 = this.nodes[0]['children'];
    this.Col1 = true;
    this.Col2 = true;
    this.Col3 = true;
    this.Col4 = false;
    this.Col5 = false;
    this.Col6 = false;

    for (let i = 0; i <= 5; i++) {
      if (this.tagValue[i] == "Federation Name") { this.Col1 = true; }
      if (this.tagValue[i] == "Name Of Unit") { this.Col2 = true; }
      if (this.tagValue[i] == "Name Of Group") { this.Col3 = true; }
      if (this.tagValue[i] == "Credit Amount") { this.Col4 = true; }
      if (this.tagValue[i] == "Debit Amount") { this.Col5 = true; }
      if (this.tagValue[i] == "Pending Amount") { this.Col6 = true; }
    }

    if (this.tagValue[0] == "Select All") {
      this.Col1 = true;
      this.Col2 = true;
      this.Col3 = true;
      this.Col4 = true;
      this.Col5 = true;
      this.Col6 = true;
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

  all_filter = ''
  Creditfilter = '';
  filterDebit = '';
  grpid = '';

  getPaymentReport() {
    this.loadingRecords = true;
    if (this.filtergrpReport == '))') { this.filtergrpReport = ''; }
    if (this.filterUnitCount == '))') { this.filterUnitCount = ''; }
    if (this.filterfednm == '))') { this.filterfednm = ''; }
    if (this.Creditfilter == '))') {
      this.Creditfilter = '';
    }
    if (this.filterDebit == '))') {
      this.filterDebit = '';
    }
    if (this.filterPending == '))') {
      this.filterPending = '';
    }

    this.all_filter = this.filterfednm + this.Creditfilter + this.filterDebit + this.filterPending + this.filtergrpReport + this.filterUnitCount;

    this.api.getPaymentReport(this.pageIndex, this.pageSize, this.sortKey, "asc", "", this.SelectedYear, this.all_filter, this.federationId, this.UnitId, this.GroupId).subscribe(data => {
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

  mainFilterArrayCreditAmt = [];
  filtersCreditAmt = "";
  isVisibleCreditAmt = false;
  model = '';
  ModelName = '';

  ClearFilterCreditAmt() {
    this.mainFilterArrayCreditAmt = [];
    this.Creditfilter = '';
    this.mainFilterArrayCreditAmt.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getPaymentReport();
  }

  showModalCreditAmt() {
    this.isVisibleCreditAmt = true;
    this.ModelName = "Credit Amount Filter";
    this.model = "CREDIT_AMOUNT";
  }

  CloseCreditAmt() {
    this.isVisibleCreditAmt = false;
    // this.Creditfilter='';
  }

  CloseGroupCreditAmt(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayCreditAmt.splice(i, 1);
      return true;
    }
  }

  CloseGroupCreditAmt1(i: any, j: any) {
    if (this.mainFilterArrayCreditAmt[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayCreditAmt[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterCreditAmt() {
    if (this.mainFilterArrayCreditAmt.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.Creditfilter = '';

      for (let i = 0; i < this.mainFilterArrayCreditAmt.length; i++) {
        Button = " ";

        if (this.mainFilterArrayCreditAmt.length > 0) {
          if (this.mainFilterArrayCreditAmt[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayCreditAmt[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayCreditAmt.length > 0) {
          if (this.mainFilterArrayCreditAmt[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayCreditAmt[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayCreditAmt[i]['filter'].length; j++) {
          if (this.mainFilterArrayCreditAmt[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayCreditAmt[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterArrayCreditAmt[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayCreditAmt[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayCreditAmt[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterArrayCreditAmt[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayCreditAmt[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterArrayCreditAmt[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayCreditAmt[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterArrayCreditAmt[i]['buttons']['AND'] == false && this.mainFilterArrayCreditAmt[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";

                if (this.mainFilterArrayCreditAmt[i]['filter'].length > 0) {
                  if (this.mainFilterArrayCreditAmt[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterArrayCreditAmt[i]['filter'].length > 0) {
                  if (this.mainFilterArrayCreditAmt[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                // this.mainFilterArrayCreditAmt[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayCreditAmt[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayCreditAmt[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayCreditAmt[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayCreditAmt[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersCreditAmt = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayCreditAmt[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayCreditAmt[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayCreditAmt[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersCreditAmt = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayCreditAmt[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayCreditAmt[i]['filter'][j]['INPUT'] + "'";
                }

                this.Creditfilter = this.Creditfilter + this.filtersCreditAmt;
              }
        }

        this.Creditfilter = this.Creditfilter + "))";
      }

      console.log(this.Creditfilter);

      if (isok == true) {
        this.Creditfilter = ' AND ' + this.Creditfilter;
        this.getPaymentReport();
        this.isVisibleCreditAmt = false
      }
    }

    else {
      this.getPaymentReport();
      this.isVisibleCreditAmt = false
    }
  }

  AddFilterGroupCreditAmt() {
    this.mainFilterArrayCreditAmt.push({
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

  AddFilterCreditAmt(i: any, j: any) {
    this.mainFilterArrayCreditAmt[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  ANDBUTTONLASTCreditAmt(i: any) {
    this.mainFilterArrayCreditAmt[i]['buttons']['AND'] = true
    this.mainFilterArrayCreditAmt[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTCreditAmt(i: any) {
    this.mainFilterArrayCreditAmt[i]['buttons']['AND'] = false
    this.mainFilterArrayCreditAmt[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTCreditAmt1(i: any, j: any) {
    this.mainFilterArrayCreditAmt[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayCreditAmt[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTCreditAmt1(i: any, j: any) {
    this.mainFilterArrayCreditAmt[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayCreditAmt[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Debit Amount
  mainFilterArrayDebitAmt = [];
  filtersDebitAmt = "";
  isVisibleDebitAmt = false;

  ClearFilterDebitAmt() {
    this.mainFilterArrayDebitAmt = [];
    this.filterDebit = '';
    this.mainFilterArrayDebitAmt.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getPaymentReport();
  }

  showModalDebitAmt() {
    this.isVisibleDebitAmt = true;
    this.ModelName = "Debit Amount Filter";
    this.model = "DEBIT_AMOUNT";
  }

  CloseDebitAmt() {
    this.isVisibleDebitAmt = false;
    // this.filterDebit='';
  }

  CloseGroupDebitAmt(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayDebitAmt.splice(i, 1);
      return true;
    }
  }
  CloseGroupDebitAmt1(i: any, j: any) {
    if (this.mainFilterArrayDebitAmt[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayDebitAmt[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterDebitAmt() {
    if (this.mainFilterArrayDebitAmt.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterDebit = "";

      for (let i = 0; i < this.mainFilterArrayDebitAmt.length; i++) {
        Button = " ";

        if (this.mainFilterArrayDebitAmt.length > 0) {
          if (this.mainFilterArrayDebitAmt[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayDebitAmt[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayDebitAmt.length > 0) {
          if (this.mainFilterArrayDebitAmt[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayDebitAmt[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayDebitAmt[i]['filter'].length; j++) {
          if (this.mainFilterArrayDebitAmt[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayDebitAmt[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterArrayDebitAmt[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayDebitAmt[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayDebitAmt[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterArrayDebitAmt[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayDebitAmt[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterArrayDebitAmt[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayDebitAmt[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterArrayDebitAmt[i]['buttons']['AND'] == false && this.mainFilterArrayDebitAmt[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterArrayDebitAmt[i]['filter'].length > 0) {
                  if (this.mainFilterArrayDebitAmt[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterArrayDebitAmt[i]['filter'].length > 0) {
                  if (this.mainFilterArrayDebitAmt[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayDebitAmt[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");
                  this.filtersDebitAmt = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayDebitAmt[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayDebitAmt[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayDebitAmt[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersDebitAmt = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayDebitAmt[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayDebitAmt[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterDebit = this.filterDebit + this.filtersDebitAmt;
              }
        }

        this.filterDebit = this.filterDebit + "))";
      }

      console.log(this.filterDebit);

      if (isok == true) {
        this.filterDebit = ' AND ' + this.filterDebit;
        this.getPaymentReport();
        this.isVisibleDebitAmt = false
      }
    }

    else {
      this.getPaymentReport();
      this.isVisibleDebitAmt = false
    }
  }

  AddFilterGroupDebitAmt() {
    this.mainFilterArrayDebitAmt.push({
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

  AddFilterDebitAmt(i: any, j: any) {
    this.mainFilterArrayDebitAmt[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  ANDBUTTONLASTDebitAmt(i: any) {
    this.mainFilterArrayDebitAmt[i]['buttons']['AND'] = true
    this.mainFilterArrayDebitAmt[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTDebitAmt(i: any) {
    this.mainFilterArrayDebitAmt[i]['buttons']['AND'] = false
    this.mainFilterArrayDebitAmt[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTDebitAmt1(i: any, j: any) {
    this.mainFilterArrayDebitAmt[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayDebitAmt[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTDebitAmt1(i: any, j: any) {
    this.mainFilterArrayDebitAmt[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayDebitAmt[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Pending Amount
  mainFilterArrayPendingAmt = [];
  filtersPendingAmt = "";
  isVisiblePendingAmt = false;

  ClearFilterPendingAmt() {
    this.mainFilterArrayPendingAmt = [];
    this.filterPending = '';
    this.mainFilterArrayPendingAmt.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getPaymentReport();
  }

  showModalPendingAmt() {
    this.isVisiblePendingAmt = true;
    this.ModelName = "Pending Amount Filter";
    this.model = "PENDING_AMOUNT";
  }

  ClosePendingAmt() {
    this.isVisiblePendingAmt = false;
    // this.filterPending=''
  }

  CloseGroupPendingAmt(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayPendingAmt.splice(i, 1);
      return true;
    }
  }

  CloseGroupPendingAmt1(i: any, j: any) {
    if (this.mainFilterArrayPendingAmt[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayPendingAmt[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterPendingAmt() {
    if (this.mainFilterArrayPendingAmt.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterPending = "";

      for (let i = 0; i < this.mainFilterArrayPendingAmt.length; i++) {
        Button = " ";

        if (this.mainFilterArrayPendingAmt.length > 0) {
          if (this.mainFilterArrayPendingAmt[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayPendingAmt[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayPendingAmt.length > 0) {
          if (this.mainFilterArrayPendingAmt[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayPendingAmt[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayPendingAmt[i]['filter'].length; j++) {
          if (this.mainFilterArrayPendingAmt[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayPendingAmt[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterArrayPendingAmt[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayPendingAmt[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayPendingAmt[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterArrayPendingAmt[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayPendingAmt[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterArrayPendingAmt[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayPendingAmt[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterArrayPendingAmt[i]['buttons']['AND'] == false && this.mainFilterArrayPendingAmt[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterArrayPendingAmt[i]['filter'].length > 0) {
                  if (this.mainFilterArrayPendingAmt[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterArrayPendingAmt[i]['filter'].length > 0) {
                  if (this.mainFilterArrayPendingAmt[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayPendingAmt[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");
                  this.filtersPendingAmt = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayPendingAmt[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayPendingAmt[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayPendingAmt[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersPendingAmt = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayPendingAmt[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayPendingAmt[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterPending = this.filterPending + this.filtersPendingAmt;
              }
        }

        this.filterPending = this.filterPending + "))";
      }

      console.log(this.filterPending);

      if (isok == true) {
        this.filterPending = ' AND ' + this.filterPending;
        this.getPaymentReport();
        this.isVisiblePendingAmt = false
      }
    }

    else {
      this.getPaymentReport();
      this.isVisiblePendingAmt = false
    }
  }

  filterPending = '';

  AddFilterGroupPendingAmt() {
    this.mainFilterArrayPendingAmt.push({
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

  AddFilterPendingAmt(i: any, j: any) {
    this.mainFilterArrayPendingAmt[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  ANDBUTTONLASTPendingAmt(i: any) {
    this.mainFilterArrayPendingAmt[i]['buttons']['AND'] = true
    this.mainFilterArrayPendingAmt[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTPendingAmt(i: any) {
    this.mainFilterArrayPendingAmt[i]['buttons']['AND'] = false
    this.mainFilterArrayPendingAmt[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTPendingAmt1(i: any, j: any) {
    this.mainFilterArrayPendingAmt[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayPendingAmt[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTPendingAmt1(i: any, j: any) {
    this.mainFilterArrayPendingAmt[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayPendingAmt[i]['filter'][j]['buttons']['AND'] = false;
  }

  mainFilterArrayfednm = [];
  filtersfednm = "";
  isVisiblefednm = false;

  ClearFilterfednm() {
    this.mainFilterArrayfednm = [];
    this.filterfednm = '';
    this.mainFilterArrayfednm.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getPaymentReport();
  }

  showModalfednm() {
    this.isVisiblefednm = true;
    this.ModelName = "Federation Name Filter";
    this.model = "FEDERATION_NAME";
  }

  Closefednm() {
    this.isVisiblefednm = false;
  }

  CloseGroupfednm(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayfednm.splice(i, 1);
      return true;
    }
  }

  CloseGroupfednm1(i: any, j: any) {
    if (this.mainFilterArrayfednm[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayfednm[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterfednm() {
    if (this.mainFilterArrayfednm.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterfednm = "";

      for (let i = 0; i < this.mainFilterArrayfednm.length; i++) {
        Button = " ";

        if (this.mainFilterArrayfednm.length > 0) {
          if (this.mainFilterArrayfednm[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayfednm[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayfednm.length > 0) {
          if (this.mainFilterArrayfednm[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayfednm[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayfednm[i]['filter'].length; j++) {
          if (this.mainFilterArrayfednm[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayfednm[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterArrayfednm[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayfednm[i]['filter'][j]['INPUT2'] == '')
              && (this.mainFilterArrayfednm[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterArrayfednm[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayfednm[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterArrayfednm[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayfednm[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterArrayfednm[i]['buttons']['AND'] == false && this.mainFilterArrayfednm[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterArrayfednm[i]['filter'].length > 0) {
                  if (this.mainFilterArrayfednm[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterArrayfednm[i]['filter'].length > 0) {
                  if (this.mainFilterArrayfednm[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                var condition = '';

                if (this.mainFilterArrayfednm[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterArrayfednm[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterArrayfednm[i]['filter'][j]['DROPDOWN'] == "Content") {
                  if (this.mainFilterArrayfednm[i]['filter'][j]['DROPDOWN'] == "Start With") {
                    condition = "LIKE" + " '" + this.mainFilterArrayfednm[i]['filter'][j]['INPUT'] + "%";

                  } else if (this.mainFilterArrayfednm[i]['filter'][j]['DROPDOWN'] == "End With") {
                    condition = "LIKE" + " '%" + this.mainFilterArrayfednm[i]['filter'][j]['INPUT'] + "";

                  } else {
                    condition = "LIKE" + " '%" + this.mainFilterArrayfednm[i]['filter'][j]['INPUT'] + "%";
                  }

                  this.filtersfednm = Button + Button1 + ' ' + this.model + " " + condition + "'";

                } else {
                  this.filtersfednm = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayfednm[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayfednm[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterfednm = this.filterfednm + this.filtersfednm;
              }
        }

        this.filterfednm = this.filterfednm + "))";
      }

      if (isok == true) {
        console.log(this.filterfednm);
        this.filterfednm = ' AND ' + this.filterfednm;
        this.getPaymentReport();
        this.isVisiblefednm = false;
      }
    }

    else {
      this.getPaymentReport();
      this.isVisiblefednm = false
    }
  }

  filterfednm = '';

  AddFilterGroupfednm() {
    this.mainFilterArrayfednm.push({
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

  AddFilterfednm(i: any) {
    this.mainFilterArrayfednm[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  ANDBUTTONLASTfednm(i: any) {
    this.mainFilterArrayfednm[i]['buttons']['AND'] = true
    this.mainFilterArrayfednm[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTfednm(i: any) {
    this.mainFilterArrayfednm[i]['buttons']['AND'] = false
    this.mainFilterArrayfednm[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTfednm1(i: any, j: any) {
    this.mainFilterArrayfednm[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayfednm[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTfednm1(i: any, j: any) {
    this.mainFilterArrayfednm[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayfednm[i]['filter'][j]['buttons']['AND'] = false;
  }

  mainFilterArraygrpcount = [];
  filtersgrpcount = "";
  isVisiblegrpcount = false;

  ClearFiltergrpcount() {
    this.mainFilterArraygrpcount = [];
    this.filtergrpReport = '';
    this.mainFilterArraygrpcount.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getPaymentReport();
  }

  showModalgrpcount() {
    this.isVisiblegrpcount = true;
    this.ModelName = "Group Name Filter";
    this.model = "GROUP_NAME";
  }

  Closegrpcount() {
    this.isVisiblegrpcount = false;
    // this.filtergrpReport=''
  }

  CloseGroupgrpcount(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArraygrpcount.splice(i, 1);
      return true;
    }
  }

  CloseGroupgrpcount1(i: any, j: any) {
    if (this.mainFilterArraygrpcount[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArraygrpcount[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFiltergrpcount() {
    if (this.mainFilterArraygrpcount.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filtergrpReport = "";

      for (let i = 0; i < this.mainFilterArraygrpcount.length; i++) {
        Button = " ";

        if (this.mainFilterArraygrpcount.length > 0) {
          if (this.mainFilterArraygrpcount[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArraygrpcount[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArraygrpcount.length > 0) {
          if (this.mainFilterArraygrpcount[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArraygrpcount[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArraygrpcount[i]['filter'].length; j++) {
          if (this.mainFilterArraygrpcount[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArraygrpcount[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterArraygrpcount[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArraygrpcount[i]['filter'][j]['INPUT2'] == '')
              && (this.mainFilterArraygrpcount[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterArraygrpcount[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArraygrpcount[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterArraygrpcount[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArraygrpcount[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterArraygrpcount[i]['buttons']['AND'] == false && this.mainFilterArraygrpcount[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterArraygrpcount[i]['filter'].length > 0) {
                  if (this.mainFilterArraygrpcount[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterArraygrpcount[i]['filter'].length > 0) {
                  if (this.mainFilterArraygrpcount[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                var condition = '';

                if (this.mainFilterArraygrpcount[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterArraygrpcount[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterArraygrpcount[i]['filter'][j]['DROPDOWN'] == "Content") {
                  if (this.mainFilterArraygrpcount[i]['filter'][j]['DROPDOWN'] == "Start With") {
                    condition = "LIKE" + " '" + this.mainFilterArraygrpcount[i]['filter'][j]['INPUT'] + "%";

                  } else if (this.mainFilterArraygrpcount[i]['filter'][j]['DROPDOWN'] == "End With") {
                    condition = "LIKE" + " '%" + this.mainFilterArraygrpcount[i]['filter'][j]['INPUT'] + "";

                  } else {
                    condition = "LIKE" + " '%" + this.mainFilterArraygrpcount[i]['filter'][j]['INPUT'] + "%";
                  }

                  this.filtersgrpcount = Button + Button1 + ' ' + this.model + " " + condition + "'";

                } else {
                  this.filtersgrpcount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArraygrpcount[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArraygrpcount[i]['filter'][j]['INPUT'] + "'";
                }

                this.filtergrpReport = this.filtergrpReport + this.filtersgrpcount;
              }
        }

        this.filtergrpReport = this.filtergrpReport + "))";
      }

      if (isok == true) {
        console.log(this.filtergrpReport);
        this.filtergrpReport = ' AND ' + this.filtergrpReport;
        this.getPaymentReport();
        this.isVisiblegrpcount = false;
      }
    }

    else {
      this.getPaymentReport();
      this.isVisiblegrpcount = false
    }
  }

  filtergrpReport = '';

  AddFilterGroupgrpcount() {
    this.mainFilterArraygrpcount.push({
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

  AddFiltergrpcount(i: any, j: any) {
    this.mainFilterArraygrpcount[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  ANDBUTTONLASTgrpcount(i: any) {
    this.mainFilterArraygrpcount[i]['buttons']['AND'] = true
    this.mainFilterArraygrpcount[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTgrpcount(i: any) {
    this.mainFilterArraygrpcount[i]['buttons']['AND'] = false
    this.mainFilterArraygrpcount[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTgrpcount1(i: any, j: any) {
    this.mainFilterArraygrpcount[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArraygrpcount[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTgrpcount1(i: any, j: any) {
    this.mainFilterArraygrpcount[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArraygrpcount[i]['filter'][j]['buttons']['AND'] = false;
  }

  mainFilterArrayUnitCount = [];
  filtersUnitCount = "";
  isVisibleUnitCount = false;

  ClearFilterUnitCount() {
    this.mainFilterArrayUnitCount = [];
    this.filterUnitCount = '';
    this.mainFilterArrayUnitCount.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getPaymentReport();
  }

  showModalUnitcount() {
    this.isVisibleUnitCount = true;
    this.ModelName = "Unit Name Filter";
    this.model = "UNIT_NAME";
  }

  CloseUnitCount() {
    this.isVisibleUnitCount = false;
    // this.filterUnitCount=''
  }

  CloseGroupUnitCount(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayUnitCount.splice(i, 1);
      return true;
    }
  }

  CloseGroupUnitCount1(i: any, j: any) {
    if (this.mainFilterArrayUnitCount[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayUnitCount[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterUnitCount() {
    if (this.mainFilterArrayUnitCount.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterUnitCount = "";

      for (let i = 0; i < this.mainFilterArrayUnitCount.length; i++) {
        Button = " ";

        if (this.mainFilterArrayUnitCount.length > 0) {
          if (this.mainFilterArrayUnitCount[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayUnitCount[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayUnitCount.length > 0) {
          if (this.mainFilterArrayUnitCount[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayUnitCount[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayUnitCount[i]['filter'].length; j++) {
          if (this.mainFilterArrayUnitCount[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayUnitCount[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterArrayUnitCount[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayUnitCount[i]['filter'][j]['INPUT2'] == '')
              && (this.mainFilterArrayUnitCount[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterArrayUnitCount[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayUnitCount[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterArrayUnitCount[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayUnitCount[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterArrayUnitCount[i]['buttons']['AND'] == false && this.mainFilterArrayUnitCount[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterArrayUnitCount[i]['filter'].length > 0) {
                  if (this.mainFilterArrayUnitCount[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterArrayUnitCount[i]['filter'].length > 0) {
                  if (this.mainFilterArrayUnitCount[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                var condition = '';

                if (this.mainFilterArrayUnitCount[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterArrayUnitCount[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterArrayUnitCount[i]['filter'][j]['DROPDOWN'] == "Content") {
                  if (this.mainFilterArrayUnitCount[i]['filter'][j]['DROPDOWN'] == "Start With") {
                    condition = "LIKE" + " '" + this.mainFilterArrayUnitCount[i]['filter'][j]['INPUT'] + "%";

                  } else if (this.mainFilterArrayUnitCount[i]['filter'][j]['DROPDOWN'] == "End With") {
                    condition = "LIKE" + " '%" + this.mainFilterArrayUnitCount[i]['filter'][j]['INPUT'] + "";

                  } else {
                    condition = "LIKE" + " '%" + this.mainFilterArrayUnitCount[i]['filter'][j]['INPUT'] + "%";
                  }

                  this.filtersUnitCount = Button + Button1 + ' ' + this.model + " " + condition + "'";

                } else {
                  this.filtersUnitCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayUnitCount[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayUnitCount[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterUnitCount = this.filterUnitCount + this.filtersUnitCount;
              }
        }

        this.filterUnitCount = this.filterUnitCount + "))";
      }

      if (isok == true) {
        console.log(this.filterUnitCount);
        this.filterUnitCount = ' AND ' + this.filterUnitCount;
        this.getPaymentReport();
        this.isVisibleUnitCount = false;
      }
    }
    else {
      this.getPaymentReport();
      this.isVisibleUnitCount = false;
    }
  }

  filterUnitCount = '';

  AddFilterGroupUnitCount() {
    this.mainFilterArrayUnitCount.push({
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

  AddFilterUnitCount(i: any, j: any) {
    this.mainFilterArrayUnitCount[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  ANDBUTTONLASTUnitCount(i: any) {
    this.mainFilterArrayUnitCount[i]['buttons']['AND'] = true
    this.mainFilterArrayUnitCount[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTUnitCount(i: any) {
    this.mainFilterArrayUnitCount[i]['buttons']['AND'] = false
    this.mainFilterArrayUnitCount[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTUnitCount1(i: any, j: any) {
    this.mainFilterArrayUnitCount[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayUnitCount[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTUnitCount1(i: any, j: any) {
    this.mainFilterArrayUnitCount[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayUnitCount[i]['filter'][j]['buttons']['AND'] = false;
  }

  PayCountTitle = '';

  closePayCountDrawer(): void {
    this.drawerVisible = false;
  }

  get closeCallbackPayCount() {
    return this.closePayCountDrawer.bind(this);
  }

  drawerVisible: boolean = false;
  GROUP_ID: number
  DetailCount = [];

  ShowDrawer(grpid: any) {
    this.drawerVisible = true;
    console.log("GrpId : ", grpid);

    this.api.getPaymentDetailCount(this.pageIndex, this.pageSize, "", "asc", " AND GROUP_ID=" + grpid).subscribe(data => {
      if ((data['code'] == 200)) {
        this.DetailCount = data['data'];
        this.loadingRecords = false;

      } else {
        this.message.error("Server Not Found", "");
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  goToClear() {
    this.mainFilterArrayfednm = [];
    this.mainFilterArrayUnitCount = [];
    this.mainFilterArraygrpcount = [];
    this.mainFilterArrayCreditAmt = [];
    this.mainFilterArrayDebitAmt = [];
    this.mainFilterArrayPendingAmt = [];
    this.Creditfilter = '';
    this.filterDebit = '';
    this.filterPending = '';
    this.filterfednm = '';
    this.filterUnitCount = '';
    this.filtergrpReport = '';
    this.ForClearFilter();
    this.getPaymentReport();
  }

  ScheduleTitle = '';
  ScheduleVisible: boolean = false;
  ScheduleData: REPORTSCHEDULE = new REPORTSCHEDULE();
  dataList = [];

  goToSchedule(reset: boolean = false, loadMore: boolean = false): void {
    this.ScheduleTitle = "Payment Report";
    this.ScheduleData = new REPORTSCHEDULE();
    this.ScheduleData.SCHEDULE = 'D';
    this.ScheduleData.SORT_KEY = this.sortKey;
    this.ScheduleData.SORT_VALUE = this.sortValue;
    var f_filtar = '';

    if (this.federationId != 0) {
      f_filtar = " AND FEDERATION_ID=" + this.federationId;

    } else if (this.GroupId != 0) {
      f_filtar = " AND GROUP_ID=" + this.GroupId;

    } else if (this.UnitId != 0) {
      f_filtar = " AND UNIT_ID=" + this.UnitId;
    }

    this.ScheduleData.FILTER_QUERY = this.all_filter + " AND YEAR(DATE)='" + this.SelectedYear + "'" + f_filtar;
    this.ScheduleData.REPORT_ID = 7;
    this.ScheduleData.USER_ID = parseInt(this._cookie.get('userId'));

    this.api.getScheduledReport(this.pageIndex, this.pageSize, '', '', '' + ' AND STATUS=1 AND REPORT_ID=' + this.ScheduleData.REPORT_ID).subscribe(data => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.ScheduleVisible = true;
        this.totalRecords = data['count'];
        this.dataList = data['data'];
        this.ScheduleData.REPORT_NAME = data['data'][0]['REPORT_NAME'];
        this.pageIndex++;
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  ScheduleClose(): void {
    this.pageIndex = 1;
    this.ScheduleVisible = false;
  }

  get closeCallbackSchedule() {
    return this.ScheduleClose.bind(this);
  }

  getWidth() {
    if (window.innerWidth <= 400) {
      return 350;

    } else {
      return 800;
    }
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }
}
