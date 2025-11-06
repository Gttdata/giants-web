import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { REPORTSCHEDULE } from 'src/app/Models/report-schedule';
import { ApiService } from 'src/app/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-comment-report',
  templateUrl: './comment-report.component.html',
  styleUrls: ['./comment-report.component.css']
})

export class CommentReportComponent implements OnInit {
  columns: string[][] = [
    ["FEDERATION_NAME", "Federation Name"], ["UNIT_NAME", "Name Of Unit "],
    ["GROUP_NAME", "Name Of Group "], ["MEMBER_NAME", "Member Name"], ["COMMENT_CREATED_DATETIME", "Date"], ["DESCRIPTION", "Title"],
    ["COMMENT_CREATED_NAME", "Comment Member Name"], ["COMMENT", "Comments"]
  ];

  Operators: string[][] = [
    ["Between", "Between"], ["=", "="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["<>", "!="]
  ];

  Operators_name: string[][] = [
    ["Start With", "Start With"], ["End With", "End With"], ["=", "="], ["<>", "!="], ['Content', 'Content']
  ];

  multipleValue = [];
  FEDERATION_ID = this._cookie.get("FEDERATION_ID");
  UNIT_ID = this._cookie.get("UNIT_ID");
  GROUP_ID = this._cookie.get("GROUP_ID");
  formTitle: string = "Comment Report";
  size = 'default';
  YEAR: any;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  abc = '';
  loadingRecords: boolean = true;
  year = new Date().getFullYear();
  baseYear: number = 2020;
  range = [];
  next_year = Number(this.year + 1);
  SelectedYear: any;
  tagValue: string[] = ["Select All", "Member Name", "Creted Date", "Subject", "Comment Member Name", "Comment"]
  exportLoading: boolean = false;
  exportLoading1: boolean = false;
  searchText: string = "";
  sortValue: string = "asc";
  sortKey: string = "ID";
  federations = [];
  federation = [];
  branchNamesToPrint = "";
  displayTA = "";
  isVisiblepdf: boolean = false;

  HandleCancel() {
    this.isVisiblepdf = false;
  }

  nextFieldDisplay: boolean = false;
  exportInPDFLoading: boolean = false;
  isPDFModalVisible: boolean = false;
  dataListForExport = [];
  Col4: boolean = true;
  Col5: boolean = true;
  Col05: boolean = true;
  Col6: boolean = true;
  Col7: boolean = true;
  all_filter = '';
  VALUE = [];
  SelectColumn = [];
  SelectColumn1 = [];
  mainFilterArray = [];
  mainFilterSubject = [];
  mainFilterCommentDate = [];
  mainFilterCommentBy = [];
  mainFilterComment = [];
  filterMemberName = '';
  filterSubject = '';
  filterCommentDate = '';
  filterCommentBy = '';
  filterComment = '';
  model = "";
  model_name = '';
  filter = "";

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService, private _exportService: ExportService) { }

  isVisible = false;

  onChange(colName: string[]): void {
    this.columns = [];
    this.SelectColumn1 = this.nodes[0]['children'];

    this.Col4 = false;
    this.Col5 = false;
    this.Col05 = false;
    this.Col6 = false;
    this.Col7 = false;

    for (let i = 0; i <= 8; i++) {
      if (this.tagValue[i] == "Member Name") { this.Col4 = true; }
      if (this.tagValue[i] == "Creted Date") { this.Col5 = true; }
      if (this.tagValue[i] == "Subject") { this.Col05 = true; }
      if (this.tagValue[i] == "Comment Member Name") { this.Col6 = true; }
      if (this.tagValue[i] == "Comment") { this.Col7 = true; }
    }

    if (this.tagValue[0] == "Select All") {
      this.Col4 = true;
      this.Col5 = true;
      this.Col05 = true;
      this.Col6 = true;
      this.Col7 = true;
    }
  }

  value: string[] = ['0-0-0'];

  nodes = [{
    title: 'Select All', value: 'Select All', key: 'Select All',
    children: [
      {
        title: 'Subject',
        value: 'Subject',
        key: 'Subject',
        isLeaf: true
      },
      {
        title: 'Creted Date',
        value: 'Creted Date',
        key: 'Creted Date',
        isLeaf: true
      },
      {
        title: 'Member Name',
        value: 'Member Name',
        key: 'Member Name',
        isLeaf: true
      },
      {
        title: 'Comment Create Member',
        value: 'Comment Create Member',
        key: 'Comment Create Member',
        isLeaf: true
      },
      {
        title: 'Comment',
        value: 'Comment',
        key: 'Comment',
        isLeaf: true
      },
    ]
  }
  ];

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

  public handlePrint(): void {
    const printContents = document.getElementById('modal').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  }

  SELECT_ALL1: boolean = false;

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

      this.api.getReportComment(0, 0, this.sortKey, this.sortValue, filters, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {
        if (data['code'] == 200) {
          this.dataListForExport = data['data'];
          this.totalRecords = data['count'];
          this.exportLoading = false;
          this.convertInExcel();
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");

        this.exportLoading = false;

      });
    } else if (exportToPDF) {
      this.exportLoading1 = true;

      this.api.getReportComment(0, 0, this.sortKey, this.sortValue, filters, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {
        if (data['code'] == 200) {
          this.federation = data['data'];
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

    } else {
      this.loadingRecords = true;

      this.api.getReportComment(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, filters, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.federations = data['data'];
          this.totalRecords = data['count'];

        } else {
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

  SelectYear(YEARs: any) {
    this.SelectedYear = YEARs;
    this.filter = '';
    this.getFederation();
  }

  handleCancel1() {
    this.isVisiblepdf = false;
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
      obj1['Federation'] = this.dataListForExport[i]['FEDERATION_NAME'];
      obj1['Unit'] = this.dataListForExport[i]['UNIT_NAME'];
      obj1['Group'] = this.dataListForExport[i]['GROUP_NAME'];

      if (this.Col4 == true) { obj1['Member Name'] = this.dataListForExport[i]['CREATER_MEMBER_NAME']; }
      if (this.Col5 == true) { obj1['Date'] = this.datePipe.transform(this.dataListForExport[i]['POST_CREATED_DATETIME'], 'dd-MMM-yyyy'); }
      if (this.Col05 == true) { obj1['Subject'] = this.dataListForExport[i]['DESCRIPTION']; }
      if (this.Col6 == true) { obj1['Comment By'] = this.dataListForExport[i]['CREATER_MEMBER_NAME']; }
      if (this.Col7 == true) { obj1['Comment'] = this.dataListForExport[i]['COMMENT']; }

      arry1.push(Object.assign({}, obj1));

      if (i == this.dataListForExport.length - 1) {
        this._exportService.exportExcel(arry1, 'Comment' + this.datePipe.transform(new Date(), 'dd-MMM-yy, hh mm ss a'));
      }
    }
  }
  getFederation() {
    this.loadingRecords = true;
    this.all_filter = this.filterMemberName + this.filterSubject + this.filterCommentDate + this.filterCommentBy + this.filterComment;

    this.api.getReportComment(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, this.all_filter, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {
      if ((data['code'] == 200)) {
        this.federations = data['data'];
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

  getFederationfilter() {
    this.all_filter = this.filterMemberName + this.filterSubject + this.filterCommentDate + this.filterCommentBy + this.filterComment;

    this.api.getReportComment(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, this.all_filter, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {
      if ((data['code'] == 200)) {
        this.federations = data['data'];
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

  ngOnInit() {
    this.Fordate();
    this.current_year();
    this.getFederation();

    this.mainFilterArray.push({
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
    this.mainFilterSubject.push({
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
    this.mainFilterCommentDate.push({
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

    this.mainFilterCommentBy.push({
      filter: [{
        INPUT: "", INPUT_1: "", DROPDOWN: '', INPUT2: "", INPUT_2: "", buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.mainFilterComment.push({
      filter: [{
        INPUT: "", INPUT_1: "", DROPDOWN: '', INPUT2: "", INPUT_2: "", buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });
  }

  // Member Name
  isVisibleMemberName = false;

  showModalMemberName(): void {
    this.isVisibleMemberName = true;
    this.model = "CREATER_MEMBER_NAME";
    this.model_name = 'Member Name'
  }

  modelCancelMemberName() {
    this.isVisibleMemberName = false;
  }

  ANDBUTTONLASTMemberName(i: any) {
    this.mainFilterArray[i]['buttons']['AND'] = true
    this.mainFilterArray[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTMemberName(i: any) {
    this.mainFilterArray[i]['buttons']['AND'] = false
    this.mainFilterArray[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTMemberName1(i: any, j: any) {
    this.mainFilterArray[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArray[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTMemberName1(i: any, j: any) {
    this.mainFilterArray[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArray[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersMemberName = '';

  AddFilterGroupMemberName() {
    this.mainFilterArray.push({
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

  AddFilterMemberName(i: any, j: any) {
    this.mainFilterArray[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );

    return true;
  }

  CloseGroupMemberName(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArray.splice(i, 1);
      return true;
    }
  }

  CloseGroupMemberName1(i: any, j: any) {
    if (this.mainFilterArray[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArray[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearMemberName() {
    this.mainFilterArray = [];
    this.filterMemberName = '';

    this.mainFilterArray.push({
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

    this.getFederationfilter();
  }

  ApplyFilterMemberName() {
    if (this.mainFilterArray.length != 0) {
      var isok = true;
      this.filterMemberName = "";

      for (let i = 0; i < this.mainFilterArray.length; i++) {
        var Button = " ";

        if (this.mainFilterArray.length > 0) {
          if (this.mainFilterArray[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArray[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }

        if (this.mainFilterArray.length > 0) {
          if (this.mainFilterArray[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArray[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArray[i]['filter'].length; j++) {
          if (this.mainFilterArray[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArray[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Date', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterArray[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArray[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArray[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Date', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterArray[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArray[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterArray[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArray[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterArray[i]['buttons']['AND'] == false && this.mainFilterArray[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterArray[i]['filter'].length > 0) {
                  if (this.mainFilterArray[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterArray[i]['filter'].length > 0) {
                  if (this.mainFilterArray[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                var condition = '';

                if (this.mainFilterArray[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterArray[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterArray[i]['filter'][j]['DROPDOWN'] == "Content") {
                  if (this.mainFilterArray[i]['filter'][j]['DROPDOWN'] == "Start With") {
                    condition = "LIKE" + " '" + this.mainFilterArray[i]['filter'][j]['INPUT'] + "%";

                  } else if (this.mainFilterArray[i]['filter'][j]['DROPDOWN'] == "End With") {
                    condition = "LIKE" + " '%" + this.mainFilterArray[i]['filter'][j]['INPUT'] + "";

                  } else {
                    condition = "LIKE" + " '%" + this.mainFilterArray[i]['filter'][j]['INPUT'] + "%";
                  }

                  this.filtersMemberName = Button + Button1 + ' ' + this.model + " " + condition + "'";

                } else {
                  this.filtersMemberName = Button + Button1 + ' ' + this.model + " " + this.mainFilterArray[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArray[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterMemberName = this.filterMemberName + this.filtersMemberName;
              }
        }

        this.filterMemberName = this.filterMemberName + "))";
      }

      if (isok) {
        this.isVisibleMemberName = false;
        this.filterMemberName = ' AND ' + this.filterMemberName;
        this.getFederationfilter();
      }
    }
  }

  //Subject
  isVisibleSubject = false;

  showModalSubject(): void {
    this.isVisibleSubject = true;
    this.model = "DESCRIPTION";
    this.model_name = 'Subject'
  }

  modelCancelSubject() {
    this.isVisibleSubject = false;
  }

  ANDBUTTONLASTSubject(i: any) {
    this.mainFilterSubject[i]['buttons']['AND'] = true
    this.mainFilterSubject[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTSubject(i: any) {
    this.mainFilterSubject[i]['buttons']['AND'] = false
    this.mainFilterSubject[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTSubject1(i: any, j: any) {
    this.mainFilterSubject[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterSubject[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTSubject1(i: any, j: any) {
    this.mainFilterSubject[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterSubject[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersSubject = '';

  AddFilterGroupSubject() {
    this.mainFilterSubject.push({
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

  AddFilterSubject(i: any, j: any) {
    this.mainFilterSubject[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );

    return true;
  }

  CloseGroupSubject(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterSubject.splice(i, 1);
      return true;
    }
  }

  CloseGroupSubject1(i: any, j: any) {
    if (this.mainFilterSubject[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterSubject[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearSubject() {
    this.mainFilterSubject = [];
    this.filterSubject = '';

    this.mainFilterSubject.push({
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

    this.getFederationfilter();
  }

  ApplyFilterSubject() {
    if (this.mainFilterSubject.length != 0) {
      var isok = true;
      this.filterSubject = "";

      for (let i = 0; i < this.mainFilterSubject.length; i++) {
        var Button = " ";

        if (this.mainFilterSubject.length > 0) {
          if (this.mainFilterSubject[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterSubject[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }

        if (this.mainFilterSubject.length > 0) {
          if (this.mainFilterSubject[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterSubject[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterSubject[i]['filter'].length; j++) {
          if (this.mainFilterSubject[i]['filter'][j]['INPUT'] == undefined || this.mainFilterSubject[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Date', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterSubject[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterSubject[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterSubject[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Date', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterSubject[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterSubject[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterSubject[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterSubject[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterSubject[i]['buttons']['AND'] == false && this.mainFilterSubject[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterSubject[i]['filter'].length > 0) {
                  if (this.mainFilterSubject[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterSubject[i]['filter'].length > 0) {
                  if (this.mainFilterSubject[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                var condition = '';

                if (this.mainFilterSubject[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterSubject[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterSubject[i]['filter'][j]['DROPDOWN'] == "Content") {
                  if (this.mainFilterSubject[i]['filter'][j]['DROPDOWN'] == "Start With") {
                    condition = "LIKE" + " '" + this.mainFilterSubject[i]['filter'][j]['INPUT'] + "%";

                  } else if (this.mainFilterSubject[i]['filter'][j]['DROPDOWN'] == "End With") {
                    condition = "LIKE" + " '%" + this.mainFilterSubject[i]['filter'][j]['INPUT'] + "";

                  } else {
                    condition = "LIKE" + " '%" + this.mainFilterSubject[i]['filter'][j]['INPUT'] + "%";
                  }

                  this.filtersSubject = Button + Button1 + ' ' + this.model + " " + condition + "'";

                } else {
                  this.filtersSubject = Button + Button1 + ' ' + this.model + " " + this.mainFilterSubject[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterSubject[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterSubject = this.filterSubject + this.filtersSubject;
              }
        }

        this.filterSubject = this.filterSubject + "))";
      }

      if (isok) {
        this.isVisibleSubject = false;
        this.filterSubject = ' AND ' + this.filterSubject;
        this.getFederationfilter();
      }
    }
  }

  //Date
  isVisibleCommentDate = false;

  showModalCommentDate(): void {
    this.isVisibleCommentDate = true;
    this.model = "Date(COMMENT_CREATED_DATETIME)";
    this.model_name = 'Member Date'
  }

  modelCancelCommentDate() {
    this.isVisibleCommentDate = false;
  }

  ANDBUTTONLASTCommentDate(i: any) {
    this.mainFilterCommentDate[i]['buttons']['AND'] = true
    this.mainFilterCommentDate[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTCommentDate(i: any) {
    this.mainFilterCommentDate[i]['buttons']['AND'] = false
    this.mainFilterCommentDate[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTCommentDate1(i: any, j: any) {
    this.mainFilterCommentDate[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterCommentDate[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTCommentDate1(i: any, j: any) {
    this.mainFilterCommentDate[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterCommentDate[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersCommentDate = '';

  AddFilterGroupCommentDate() {
    this.mainFilterCommentDate.push({
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

  AddFilterCommentDate(i: any, j: any) {
    this.mainFilterCommentDate[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );

    return true;
  }

  CloseGroupCommentDate(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterCommentDate.splice(i, 1);
      return true;
    }
  }

  CloseGroupCommentDate1(i: any, j: any) {
    if (this.mainFilterCommentDate[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterCommentDate[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearCommentDate() {
    this.mainFilterCommentDate = [];
    this.filterCommentDate = '';

    this.mainFilterCommentDate.push({
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

    this.getFederationfilter();
  }

  ApplyFilterCommentDate() {
    if (this.mainFilterCommentDate.length != 0) {
      var isok = true;
      this.filterCommentDate = "";

      for (let i = 0; i < this.mainFilterCommentDate.length; i++) {
        var Button = " ";

        if (this.mainFilterCommentDate.length > 0) {
          if (this.mainFilterCommentDate[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterCommentDate[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }

        if (this.mainFilterCommentDate.length > 0) {
          if (this.mainFilterCommentDate[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterCommentDate[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterCommentDate[i]['filter'].length; j++) {
          if (this.mainFilterCommentDate[i]['filter'][j]['INPUT'] == undefined || this.mainFilterCommentDate[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Date', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterCommentDate[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterCommentDate[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterCommentDate[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Date 2', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterCommentDate[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterCommentDate[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterCommentDate[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterCommentDate[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterCommentDate[i]['buttons']['AND'] == false && this.mainFilterCommentDate[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterCommentDate[i]['filter'].length > 0) {
                  if (this.mainFilterCommentDate[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterCommentDate[i]['filter'].length > 0) {
                  if (this.mainFilterCommentDate[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                this.mainFilterCommentDate[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterCommentDate[i]['filter'][j]['INPUT'], "yyyy-MM-dd");

                if (this.mainFilterCommentDate[i]['filter'][j]['DROPDOWN'] == "Between") {
                  this.mainFilterCommentDate[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterCommentDate[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");
                  this.filtersCommentDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterCommentDate[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterCommentDate[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterCommentDate[i]['filter'][j]['INPUT2'] + "'";

                } else
                  if (this.mainFilterCommentDate[i]['filter'][j]['DROPDOWN'] == "=") {
                    this.mainFilterCommentDate[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterCommentDate[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");
                    this.filtersCommentDate = Button + Button1 + ' ' + this.model + " " + "Between" + " '" + this.mainFilterCommentDate[i]['filter'][j]['INPUT'] + " 00:00:00" + "' AND '" + this.mainFilterCommentDate[i]['filter'][j]['INPUT'] + " 23:59:59" + "'";

                  } else {
                    this.filtersCommentDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterCommentDate[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterCommentDate[i]['filter'][j]['INPUT'] + "'";
                  }

                this.filterCommentDate = this.filterCommentDate + this.filtersCommentDate;
              }
        }

        this.filterCommentDate = this.filterCommentDate + "))";
      }

      if (isok) {
        this.isVisibleCommentDate = false;
        this.filterCommentDate = ' AND ' + this.filterCommentDate;
        this.getFederationfilter();
      }
    }
  }

  //CommentBy
  isVisibleCommentBy = false;

  showModalCommentBy(): void {
    this.isVisibleCommentBy = true;
    this.model = "CREATER_MEMBER_NAME";
    this.model_name = 'Comment Creater Name'
  }

  modelCancelCommentBy() {
    this.isVisibleCommentBy = false;
  }

  ANDBUTTONLASTCommentBy(i: any) {
    this.mainFilterCommentBy[i]['buttons']['AND'] = true
    this.mainFilterCommentBy[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTCommentBy(i: any) {
    this.mainFilterCommentBy[i]['buttons']['AND'] = false
    this.mainFilterCommentBy[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTCommentBy1(i: any, j: any) {
    this.mainFilterCommentBy[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterCommentBy[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTCommentBy1(i: any, j: any) {
    this.mainFilterCommentBy[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterCommentBy[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersCommentBy = '';

  AddFilterGroupCommentBy() {
    this.mainFilterCommentBy.push({
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

  AddFilterCommentBy(i: any, j: any) {
    this.mainFilterCommentBy[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );

    return true;
  }

  CloseGroupCommentBy(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterCommentBy.splice(i, 1);
      return true;
    }
  }

  CloseGroupCommentBy1(i: any, j: any) {
    if (this.mainFilterCommentBy[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterCommentBy[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearCommentBy() {
    this.mainFilterCommentBy = [];
    this.filterCommentBy = '';

    this.mainFilterCommentBy.push({
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

    this.getFederationfilter();
  }

  ApplyFilterCommentBy() {
    if (this.mainFilterCommentBy.length != 0) {
      var isok = true;
      this.filterCommentBy = "";

      for (let i = 0; i < this.mainFilterCommentBy.length; i++) {
        var Button = " ";

        if (this.mainFilterCommentBy.length > 0) {
          if (this.mainFilterCommentBy[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterCommentBy[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }
        if (this.mainFilterCommentBy.length > 0) {
          if (this.mainFilterCommentBy[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterCommentBy[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterCommentBy[i]['filter'].length; j++) {
          if (this.mainFilterCommentBy[i]['filter'][j]['INPUT'] == undefined || this.mainFilterCommentBy[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Date', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterCommentBy[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterCommentBy[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterCommentBy[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Date', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterCommentBy[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterCommentBy[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterCommentBy[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterCommentBy[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterCommentBy[i]['buttons']['AND'] == false && this.mainFilterCommentBy[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterCommentBy[i]['filter'].length > 0) {
                  if (this.mainFilterCommentBy[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterCommentBy[i]['filter'].length > 0) {
                  if (this.mainFilterCommentBy[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                var condition = '';

                if (this.mainFilterCommentBy[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterCommentBy[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterCommentBy[i]['filter'][j]['DROPDOWN'] == "Content") {
                  if (this.mainFilterCommentBy[i]['filter'][j]['DROPDOWN'] == "Start With") {
                    condition = "LIKE" + " '" + this.mainFilterCommentBy[i]['filter'][j]['INPUT'] + "%";

                  } else if (this.mainFilterCommentBy[i]['filter'][j]['DROPDOWN'] == "End With") {
                    condition = "LIKE" + " '%" + this.mainFilterCommentBy[i]['filter'][j]['INPUT'] + "";

                  } else {
                    condition = "LIKE" + " '%" + this.mainFilterCommentBy[i]['filter'][j]['INPUT'] + "%";
                  }

                  this.filtersCommentBy = Button + Button1 + ' ' + this.model + " " + condition + "'";

                } else {
                  this.filtersCommentBy = Button + Button1 + ' ' + this.model + " " + this.mainFilterCommentBy[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterCommentBy[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterCommentBy = this.filterCommentBy + this.filtersCommentBy;
              }
        }

        this.filterCommentBy = this.filterCommentBy + "))";
      }

      if (isok) {
        this.filterCommentBy = ' AND ' + this.filterCommentBy;
        this.isVisibleCommentBy = false;
        this.getFederationfilter();
      }
    }
  }

  // Comment
  isVisibleComment = false;

  showModalComment(): void {
    this.isVisibleComment = true;
    this.model = "COMMENT";
    this.model_name = 'Comment'
  }

  modelCancelComment() {
    this.isVisibleComment = false;
  }

  ANDBUTTONLASTComment(i: any) {
    this.mainFilterComment[i]['buttons']['AND'] = true;
    this.mainFilterComment[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTComment(i: any) {
    this.mainFilterComment[i]['buttons']['AND'] = false;
    this.mainFilterComment[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTComment1(i: any, j: any) {
    this.mainFilterComment[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterComment[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTComment1(i: any, j: any) {
    this.mainFilterComment[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterComment[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersComment = '';

  AddFilterGroupComment() {
    this.mainFilterComment.push({
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

  AddFilterComment(i: any, j: any) {
    this.mainFilterComment[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );

    return true;
  }

  CloseGroupComment(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterComment.splice(i, 1);
      return true;
    }
  }

  CloseGroupComment1(i: any, j: any) {
    if ((this.mainFilterComment[i]['filter'].length == 1) || (j == 0)) {
      return false;

    } else {
      this.mainFilterComment[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearComment() {
    this.mainFilterComment = [];
    this.filterComment = '';

    this.mainFilterComment.push({
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

    this.getFederationfilter();
  }

  ApplyFilterComment() {
    if (this.mainFilterComment.length != 0) {
      var isok = true;
      this.filterComment = "";

      for (let i = 0; i < this.mainFilterComment.length; i++) {
        var Button = " ";

        if (this.mainFilterComment.length > 0) {
          if (this.mainFilterComment[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterComment[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }
        if (this.mainFilterComment.length > 0) {
          if (this.mainFilterComment[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterComment[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterComment[i]['filter'].length; j++) {
          if (this.mainFilterComment[i]['filter'][j]['INPUT'] == undefined || this.mainFilterComment[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Date', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterComment[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterComment[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterComment[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Date', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterComment[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterComment[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterComment[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterComment[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterComment[i]['buttons']['AND'] == false && this.mainFilterComment[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterComment[i]['filter'].length > 0) {
                  if (this.mainFilterComment[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterComment[i]['filter'].length > 0) {
                  if (this.mainFilterComment[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                var condition = '';

                if (this.mainFilterComment[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterComment[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterComment[i]['filter'][j]['DROPDOWN'] == "Content") {
                  if (this.mainFilterComment[i]['filter'][j]['DROPDOWN'] == "Start With") {
                    condition = "LIKE" + " '" + this.mainFilterComment[i]['filter'][j]['INPUT'] + "%";

                  } else if (this.mainFilterComment[i]['filter'][j]['DROPDOWN'] == "End With") {
                    condition = "LIKE" + " '%" + this.mainFilterComment[i]['filter'][j]['INPUT'] + "";

                  } else {
                    condition = "LIKE" + " '%" + this.mainFilterComment[i]['filter'][j]['INPUT'] + "%";
                  }

                  this.filtersComment = Button + Button1 + ' ' + this.model + " " + condition + "'";

                } else {
                  this.filtersComment = Button + Button1 + ' ' + this.model + " " + this.mainFilterComment[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterComment[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterComment = this.filterComment + this.filtersComment;
              }
        }

        this.filterComment = this.filterComment + "))";
      }

      if (isok) {
        this.isVisibleComment = false;
        this.filterComment = ' AND ' + this.filterComment;
        this.getFederationfilter();
      }
    }
  }

  goToClear() {
    this.sortValue = "asc";
    this.sortKey = "ID";
    this.filterMemberName = '';
    this.filterSubject = '';
    this.filterCommentDate = '';
    this.filterCommentBy = '';
    this.filterComment = '';
    this.mainFilterArray = [];
    this.mainFilterSubject = [];
    this.mainFilterCommentDate = [];
    this.mainFilterCommentBy = [];
    this.mainFilterComment = [];

    this.mainFilterArray.push({
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
    this.mainFilterSubject.push({
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
    this.mainFilterCommentDate.push({
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

    this.mainFilterCommentBy.push({
      filter: [{
        INPUT: "", INPUT_1: "", DROPDOWN: '', INPUT2: "", INPUT_2: "", buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.mainFilterComment.push({
      filter: [{
        INPUT: "", INPUT_1: "", DROPDOWN: '', INPUT2: "", INPUT_2: "", buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.getFederation();
  }

  ScheduleTitle = '';
  ScheduleVisible: boolean = false;
  ScheduleData: REPORTSCHEDULE = new REPORTSCHEDULE();
  dataList = [];

  goToSchedule(reset: boolean = false, loadMore: boolean = false): void {
    this.ScheduleTitle = "Comment Report";
    this.ScheduleData = new REPORTSCHEDULE();
    this.ScheduleData.SCHEDULE = 'D';
    this.ScheduleData.SORT_KEY = this.sortKey;
    this.ScheduleData.SORT_VALUE = this.sortValue;
    this.ScheduleData.FILTER_QUERY = this.all_filter + " AND YEAR='" + this.SelectedYear + "'";
    this.ScheduleData.REPORT_ID = 3;
    this.ScheduleData.USER_ID = parseInt(this._cookie.get('userId'));

    this.api.getScheduledReport(this.pageIndex, this.pageSize, '', '', '' + 'AND STATUS=1 AND REPORT_ID=3').subscribe(data => {
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
  }

  ScheduleClose(): void {
    this.pageIndex = 1;
    this.getFederation();
    this.ScheduleVisible = false;
  }

  get closeCallbackSchedule() {
    return this.ScheduleClose.bind(this);
  }

  getWidth() {
    if (window.innerWidth <= 400) {
      return 350;

    } else {
      return 850;
    }
  }
}