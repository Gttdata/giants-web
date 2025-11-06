import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';
import { Router } from '@angular/router';
import { REPORTSCHEDULE } from 'src/app/Models/report-schedule';

@Component({
  selector: 'app-post-report',
  templateUrl: './post-report.component.html',
  styleUrls: ['./post-report.component.css']
})

export class PostReportComponent implements OnInit {
  @Input() data: REPORTSCHEDULE;
  columns: string[][] = [
    ["FEDERATION_NAME", "Federation Name"], ["UNIT_NAME", "Name Of Unit "],
    ["HOME_GROUP_NAME", "Name Of Group "], ["CREATER_MEMBER_NAME", "Member Name"], ["POST_CREATED_DATETIME", "Date"], ["DESCRIPTION", "Title"],
    ["LIKE_COUNT", "Likes"], ["COMMENT_COUNT", "Comments"]];
  Operators: string[][] = [["Between", "Between"], ["=", "="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["<>", "!="]];
  Operators_name: string[][] = [["Start With", "Start With"], ["End With", "End With"], ["=", "="], ["<>", "!="], ['Content', 'Content']];
  multipleValue = [];
  FEDERATION_ID = this._cookie.get("FEDERATION_ID");
  UNIT_ID = this._cookie.get("UNIT_ID");
  GROUP_ID = this._cookie.get("GROUP_ID");
  formTitle: string = "Post Report";
  size = 'default';
  YEAR: any;
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  abc = '';
  loadingRecords: boolean = true;
  year = new Date().getFullYear();
  baseYear = 2020;
  range = [];
  next_year = Number(this.year + 1);
  SelectedYear: any;
  tagValue: string[] = ["Select All", "Member Name", "Creted Date", "Subject", "Likes", "Comment"]
  exportLoading: boolean = false;
  exportLoading1: boolean = false;
  searchText: string = "";
  sortValue: string = "asc";
  sortKey: string = "ID";
  federations = [];
  federation = [];
  branchNamesToPrint = "";
  displayTA = "";
  all_filter = "";
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
  VALUE = [];
  SelectColumn = [];
  SelectColumn1 = [];
  mainFilterArray = [];
  mainFilterSubject = [];
  mainFilterPostDate = [];
  mainFilterLike = [];
  mainFilterComment = [];
  mainFilterUnitArray = [];
  mainFilterGroupArray = [];
  mainFilterFederationArray = [];
  filterGroup = '';
  filterFederation = '';
  filterUnit = '';
  filterMemberName = '';
  filterSubject = '';
  filterPostDate = '';
  filterComment = '';
  filterLike = '';
  model = "";
  model_name = '';
  filter = "";
  imageURL: string = this.api.retriveimgUrl;

  constructor(private router: Router, private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService, private _exportService: ExportService) { }

  isVisible: boolean = false;

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
      if (this.tagValue[i] == "Likes") { this.Col6 = true; }
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
        title: 'Member Name',
        value: 'Member Name',
        key: 'Member Name',
        isLeaf: true
      },

      {
        title: 'Creted Date',
        value: 'Creted Date',
        key: 'Creted Date',
        isLeaf: true
      },

      {
        title: 'Subject',
        value: 'Subject',
        key: 'Subject',
        isLeaf: true
      },

      {
        title: 'Likes',
        value: 'Likes',
        key: 'Likes',
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

  SelectYear(YEARs: any) {
    this.SelectedYear = YEARs;
    this.filter = '';
    this.getFederation();
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

      this.api.getReportPost(0, 0, this.sortKey, this.sortValue, filters, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {
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

    } else if (exportToPDF) {
      this.exportLoading1 = true;

      this.api.getReportPost(0, 0, this.sortKey, this.sortValue, filters, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {
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

      this.api.getReportPost(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, filters, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {
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
      obj1['Federation Name'] = this.dataListForExport[i]['FEDERATION_NAME'];
      obj1['Name of Unit'] = this.dataListForExport[i]['UNIT_NAME'];
      obj1['Name Of Group'] = this.dataListForExport[i]['HOME_GROUP_NAME'];

      if (this.Col4 == true) { obj1['Member Name'] = this.dataListForExport[i]['CREATER_MEMBER_NAME']; }
      if (this.Col5 == true) { obj1['Date'] = this.datePipe.transform(this.dataListForExport[i]['POST_CREATED_DATETIME'], 'dd-MMM-yyyy'); }
      if (this.Col05 == true) { obj1['Subject'] = this.dataListForExport[i]['DESCRIPTION']; }
      if (this.Col6 == true) { obj1['Likes'] = this.dataListForExport[i]['LIKE_COUNT']; }
      if (this.Col7 == true) { obj1['Comment'] = this.dataListForExport[i]['COMMENT_COUNT']; }

      arry1.push(Object.assign({}, obj1));
      if (i == this.dataListForExport.length - 1) {
        this._exportService.exportExcel(arry1, 'Post Report ' + this.datePipe.transform(new Date(), 'dd-MMM-yy, hh mm ss a'));
      }
    }
  }

  getFederation() {
    this.loadingRecords = true;
    this.all_filter = this.filterMemberName + this.filterPostDate + this.filterSubject + this.filterComment + this.filterLike;

    this.api.getReportPost(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, this.all_filter, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {
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
    if (this.filterMemberName == ') )') { this.filterMemberName = ''; }
    if (this.filterPostDate == ') )') { this.filterPostDate = ''; }
    if (this.filterSubject == ') )') { this.filterSubject = ''; }
    if (this.filterComment == ') )') { this.filterComment = ''; }
    if (this.filterLike == ') )') { this.filterLike = ''; }
    if (this.filterFederation == ') )') { this.filterFederation = ''; }
    if (this.filterUnit == ') )') { this.filterUnit = ''; }
    if (this.filterGroup == ') )') { this.filterGroup = ''; }

    this.all_filter = this.filterFederation + this.filterUnit + this.filterGroup + this.filterMemberName + this.filterPostDate + this.filterSubject + this.filterComment + this.filterLike;
    this.api.getReportPost(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, this.all_filter, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {
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

    this.mainFilterFederationArray.push({
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

    this.mainFilterUnitArray.push({
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

    this.mainFilterGroupArray.push({
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

    this.mainFilterPostDate.push({
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

    this.mainFilterLike.push({
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

  isVisibleFederation: boolean = false;

  showModalFederation(): void {
    this.isVisibleFederation = true;
    this.model = "FEDERATION_NAME";
    this.model_name = 'Federation Name';
  }

  modelCancelFederation() {
    this.isVisibleFederation = false;
  }

  ANDBUTTONLASTFederation(i: any) {
    this.mainFilterFederationArray[i]['buttons']['AND'] = true;
    this.mainFilterFederationArray[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTFederation(i: any) {
    this.mainFilterFederationArray[i]['buttons']['AND'] = false;
    this.mainFilterFederationArray[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTFederation1(i: any, j: any) {
    this.mainFilterFederationArray[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterFederationArray[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTFederation1(i: any, j: any) {
    this.mainFilterFederationArray[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterFederationArray[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersFederation = '';

  AddFilterGroupFederation() {
    this.mainFilterFederationArray.push({
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

  AddFilterFederation(i: any, j: any) {
    this.mainFilterFederationArray[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  CloseGroupFederation(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterFederationArray.splice(i, 1);
      return true;
    }
  }

  CloseGroupFederation1(i: any, j: any) {
    if (this.mainFilterFederationArray[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterFederationArray[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearFederation() {
    this.mainFilterFederationArray = [];
    this.filterFederation = '';

    this.mainFilterFederationArray.push({
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

  filtersMeetingDate = '';

  ApplyFilterFederation() {
    if (this.mainFilterFederationArray.length != 0) {
      var isok = true;
      this.filterFederation = "";
      var Button = " ";

      for (let i = 0; i < this.mainFilterFederationArray.length; i++) {
        Button = " ";
        if (this.mainFilterFederationArray.length > 0) {
          if (this.mainFilterFederationArray[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterFederationArray[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }

        if (this.mainFilterFederationArray.length > 0) {
          if (this.mainFilterFederationArray[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterFederationArray[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterFederationArray[i]['filter'].length; j++) {
          if (this.mainFilterFederationArray[i]['filter'][j]['INPUT'] == undefined || this.mainFilterFederationArray[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Name', 'Please fill the field');
            isok = false;

          } else if (this.mainFilterFederationArray[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterFederationArray[i]['filter'][j]['DROPDOWN'] == '') {
            this.message.error('Condition', 'Please Select the field');
            isok = false;

          } else if (this.mainFilterFederationArray[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterFederationArray[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
            this.message.error('AND or OR', 'Please Clike On The Button');
            isok = false;

          } else if (this.mainFilterFederationArray[i]['buttons']['AND'] == false && this.mainFilterFederationArray[i]['buttons']['OR'] == false && i > 0) {
            this.message.error('AND or OR', 'Please Clike On The Button');
            isok = false;

          } else {
            var Button1 = "((";
            if (this.mainFilterFederationArray[i]['filter'].length > 0) {
              if (this.mainFilterFederationArray[i]['filter'][j]['buttons']['AND'] == true) {
                Button1 = ")" + " AND " + "(";
                Button = " ";
              }
            }

            if (this.mainFilterFederationArray[i]['filter'].length > 0) {
              if (this.mainFilterFederationArray[i]['filter'][j]['buttons']['OR'] == true) {
                Button1 = ")" + " OR " + "(";
                Button = " ";
              }
            }

            var condition = '';

            if (this.mainFilterFederationArray[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterFederationArray[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterFederationArray[i]['filter'][j]['DROPDOWN'] == "Content") {
              if (this.mainFilterFederationArray[i]['filter'][j]['DROPDOWN'] == "Start With") {
                condition = "LIKE" + " '" + this.mainFilterFederationArray[i]['filter'][j]['INPUT'] + "%";

              } else if (this.mainFilterFederationArray[i]['filter'][j]['DROPDOWN'] == "End With") {
                condition = "LIKE" + " '%" + this.mainFilterFederationArray[i]['filter'][j]['INPUT'] + "";

              } else {
                condition = "LIKE" + " '%" + this.mainFilterFederationArray[i]['filter'][j]['INPUT'] + "%";
              }

              this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + condition + "'";

            } else {
              this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterFederationArray[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterFederationArray[i]['filter'][j]['INPUT'] + "'";
            }

            this.filterFederation = this.filterFederation + this.filtersMeetingDate;
          }
        }

        this.filterFederation = this.filterFederation + "))";
      }

      if (isok) {
        this.isVisibleFederation = false;
        this.filterFederation = ' AND ' + this.filterFederation;
        this.getFederationfilter();
      }
    }
  }

  isVisibleUnit: boolean = false;

  showModalUnit(): void {
    this.isVisibleUnit = true;
    this.model = "UNIT_NAME";
    this.model_name = 'Unit Name';
  }

  modelCancelUnit() {
    this.isVisibleUnit = false;
  }

  ANDBUTTONLASTUnit(i: any) {
    this.mainFilterUnitArray[i]['buttons']['AND'] = true;
    this.mainFilterUnitArray[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTUnit(i: any) {
    this.mainFilterUnitArray[i]['buttons']['AND'] = false;
    this.mainFilterUnitArray[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTUnit1(i: any, j: any) {
    this.mainFilterUnitArray[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterUnitArray[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTUnit1(i: any, j: any) {
    this.mainFilterUnitArray[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterUnitArray[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersUnit = '';

  AddFilterGroupUnit() {
    this.mainFilterUnitArray.push({
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

  AddFilterUnit(i: any, j: any) {
    this.mainFilterUnitArray[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );

    return true;
  }

  CloseGroupUnit(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterUnitArray.splice(i, 1);
      return true;
    }
  }

  CloseGroupUnit1(i: any, j: any) {
    if (this.mainFilterUnitArray[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterUnitArray[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearUnit() {
    this.mainFilterUnitArray = [];
    this.filterUnit = '';
    this.mainFilterUnitArray.push({
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

  ApplyFilterUnit() {
    if (this.mainFilterUnitArray.length != 0) {
      var isok = true;
      this.filterUnit = "";
      var Button = " ";

      for (let i = 0; i < this.mainFilterUnitArray.length; i++) {
        Button = " ";
        if (this.mainFilterUnitArray.length > 0) {
          if (this.mainFilterUnitArray[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterUnitArray[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }

        if (this.mainFilterUnitArray.length > 0) {
          if (this.mainFilterUnitArray[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterUnitArray[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterUnitArray[i]['filter'].length; j++) {
          if (this.mainFilterUnitArray[i]['filter'][j]['INPUT'] == undefined || this.mainFilterUnitArray[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Name', 'Please fill the field');
            isok = false;

          } else if (this.mainFilterUnitArray[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterUnitArray[i]['filter'][j]['DROPDOWN'] == '') {
            this.message.error('Condition', 'Please Select the field');
            isok = false;

          } else if (this.mainFilterUnitArray[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterUnitArray[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
            this.message.error('AND or OR', 'Please Clike On The Button');
            isok = false;

          } else if (this.mainFilterUnitArray[i]['buttons']['AND'] == false && this.mainFilterUnitArray[i]['buttons']['OR'] == false && i > 0) {
            this.message.error('AND or OR', 'Please Clike On The Button');
            isok = false;

          } else {
            var Button1 = "((";

            if (this.mainFilterUnitArray[i]['filter'].length > 0) {
              if (this.mainFilterUnitArray[i]['filter'][j]['buttons']['AND'] == true) {
                Button1 = ")" + " AND " + "(";
                Button = " ";
              }
            }

            if (this.mainFilterUnitArray[i]['filter'].length > 0) {
              if (this.mainFilterUnitArray[i]['filter'][j]['buttons']['OR'] == true) {
                Button1 = ")" + " OR " + "(";
                Button = " ";
              }
            }

            var condition = '';

            if (this.mainFilterUnitArray[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterUnitArray[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterUnitArray[i]['filter'][j]['DROPDOWN'] == "Content") {
              if (this.mainFilterUnitArray[i]['filter'][j]['DROPDOWN'] == "Start With") {
                condition = "LIKE" + " '" + this.mainFilterUnitArray[i]['filter'][j]['INPUT'] + "%";

              } else if (this.mainFilterUnitArray[i]['filter'][j]['DROPDOWN'] == "End With") {
                condition = "LIKE" + " '%" + this.mainFilterUnitArray[i]['filter'][j]['INPUT'] + "";

              } else {
                condition = "LIKE" + " '%" + this.mainFilterUnitArray[i]['filter'][j]['INPUT'] + "%";
              }

              this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + condition + "'";

            } else {
              this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterUnitArray[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterUnitArray[i]['filter'][j]['INPUT'] + "'";
            }

            this.filterUnit = this.filterUnit + this.filtersMeetingDate;
          }
        }

        this.filterUnit = this.filterUnit + "))";
      }

      if (isok) {
        this.isVisibleUnit = false;
        this.filterUnit = ' AND ' + this.filterUnit;
        this.getFederationfilter();
      }
    }
  }

  isVisibleGroup: boolean = false;

  showModalGroup(): void {
    this.isVisibleGroup = true;
    this.model = "HOME_GROUP_NAME";
    this.model_name = 'Group Name';
  }

  modelCancelGroup() {
    this.isVisibleGroup = false;
  }

  ANDBUTTONLASTGroup(i: any) {
    this.mainFilterGroupArray[i]['buttons']['AND'] = true;
    this.mainFilterGroupArray[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTGroup(i: any) {
    this.mainFilterGroupArray[i]['buttons']['AND'] = false;
    this.mainFilterGroupArray[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTGroup1(i: any, j: any) {
    this.mainFilterGroupArray[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterGroupArray[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTGroup1(i: any, j: any) {
    this.mainFilterGroupArray[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterGroupArray[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersGroup = '';

  AddFilterGroupGroup() {
    this.mainFilterGroupArray.push({
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

  AddFilterGroup(i: any, j: any) {
    this.mainFilterGroupArray[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );

    return true;
  }

  CloseGroupGroup(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterGroupArray.splice(i, 1);
      return true;
    }
  }

  CloseGroupGroup1(i: any, j: any) {
    if (this.mainFilterGroupArray[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterGroupArray[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearGroup() {
    this.mainFilterGroupArray = [];
    this.filterGroup = '';

    this.mainFilterGroupArray.push({
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

  ApplyFilterGroup() {
    if (this.mainFilterGroupArray.length != 0) {
      var isok = true;
      this.filterGroup = "";
      var Button = " ";

      for (let i = 0; i < this.mainFilterGroupArray.length; i++) {
        Button = " ";
        if (this.mainFilterGroupArray.length > 0) {
          if (this.mainFilterGroupArray[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterGroupArray[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }

        if (this.mainFilterGroupArray.length > 0) {
          if (this.mainFilterGroupArray[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterGroupArray[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterGroupArray[i]['filter'].length; j++) {
          if (this.mainFilterGroupArray[i]['filter'][j]['INPUT'] == undefined || this.mainFilterGroupArray[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Name', 'Please fill the field');
            isok = false;

          } else if (this.mainFilterGroupArray[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterGroupArray[i]['filter'][j]['DROPDOWN'] == '') {
            this.message.error('Condition', 'Please Select the field');
            isok = false;

          } else if (this.mainFilterGroupArray[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterGroupArray[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
            this.message.error('AND or OR', 'Please Clike On The Button');
            isok = false;

          } else if (this.mainFilterGroupArray[i]['buttons']['AND'] == false && this.mainFilterGroupArray[i]['buttons']['OR'] == false && i > 0) {
            this.message.error('AND or OR', 'Please Clike On The Button');
            isok = false;

          } else {
            var Button1 = "((";
            if (this.mainFilterGroupArray[i]['filter'].length > 0) {
              if (this.mainFilterGroupArray[i]['filter'][j]['buttons']['AND'] == true) {
                Button1 = ")" + " AND " + "(";
                Button = " ";
              }
            }

            if (this.mainFilterGroupArray[i]['filter'].length > 0) {
              if (this.mainFilterGroupArray[i]['filter'][j]['buttons']['OR'] == true) {
                Button1 = ")" + " OR " + "(";
                Button = " ";
              }
            }

            var condition = '';

            if (this.mainFilterGroupArray[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterGroupArray[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterGroupArray[i]['filter'][j]['DROPDOWN'] == "Content") {
              if (this.mainFilterGroupArray[i]['filter'][j]['DROPDOWN'] == "Start With") {
                condition = "LIKE" + " '" + this.mainFilterGroupArray[i]['filter'][j]['INPUT'] + "%";

              } else if (this.mainFilterGroupArray[i]['filter'][j]['DROPDOWN'] == "End With") {
                condition = "LIKE" + " '%" + this.mainFilterGroupArray[i]['filter'][j]['INPUT'] + "";

              } else {
                condition = "LIKE" + " '%" + this.mainFilterGroupArray[i]['filter'][j]['INPUT'] + "%";
              }

              this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + condition + "'";

            } else {
              this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterGroupArray[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterGroupArray[i]['filter'][j]['INPUT'] + "'";
            }

            this.filterGroup = this.filterGroup + this.filtersMeetingDate;
          }
        }

        this.filterGroup = this.filterGroup + "))";
      }

      if (isok) {
        this.isVisibleGroup = false;
        this.filterGroup = ' AND ' + this.filterGroup;
        this.getFederationfilter();
      }
    }
  }

  isVisibleMemberName: boolean = false;

  showModalMemberName(): void {
    this.isVisibleMemberName = true;
    this.model = "CREATER_MEMBER_NAME";
    this.model_name = 'Member Name';
  }

  modelCancelMemberName() {
    this.isVisibleMemberName = false;
    this.getFederation();
  }

  ANDBUTTONLASTMemberName(i: any) {
    this.mainFilterArray[i]['buttons']['AND'] = true;
    this.mainFilterArray[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTMemberName(i: any) {
    this.mainFilterArray[i]['buttons']['AND'] = false;
    this.mainFilterArray[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTMemberName1(i: any, j: any) {
    this.mainFilterArray[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterArray[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTMemberName1(i: any, j: any) {
    this.mainFilterArray[i]['filter'][j]['buttons']['OR'] = true;
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
    });

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

              } else if (this.mainFilterArray[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArray[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;

              } else if (this.mainFilterArray[i]['buttons']['AND'] == false && this.mainFilterArray[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;

              } else {
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

  isVisiblePostDate: boolean = false;

  showModalPostDate(): void {
    this.isVisiblePostDate = true;
    this.model = "date(POST_CREATED_DATETIME)";
    this.model_name = 'Member Date';
  }

  modelCancelPostDate() {
    this.isVisiblePostDate = false;
    this.getFederation();
  }

  ANDBUTTONLASTPostDate(i: any) {
    this.mainFilterPostDate[i]['buttons']['AND'] = true;
    this.mainFilterPostDate[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTPostDate(i: any) {
    this.mainFilterPostDate[i]['buttons']['AND'] = false;
    this.mainFilterPostDate[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTPostDate1(i: any, j: any) {
    this.mainFilterPostDate[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterPostDate[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTPostDate1(i: any, j: any) {
    this.mainFilterPostDate[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterPostDate[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersPostDate = '';

  AddFilterGroupPostDate() {
    this.mainFilterPostDate.push({
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

  AddFilterPostDate(i: any, j: any) {
    this.mainFilterPostDate[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );

    return true;
  }

  CloseGroupPostDate(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterPostDate.splice(i, 1);
      return true;
    }
  }

  CloseGroupPostDate1(i: any, j: any) {
    if (this.mainFilterPostDate[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterPostDate[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearPostDate() {
    this.mainFilterPostDate = [];
    this.filterPostDate = '';

    this.mainFilterPostDate.push({
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

  ApplyFilterPostDate() {
    if (this.mainFilterPostDate.length != 0) {
      var isok = true;
      this.filterPostDate = "";

      for (let i = 0; i < this.mainFilterPostDate.length; i++) {
        var Button = " ";

        if (this.mainFilterPostDate.length > 0) {
          if (this.mainFilterPostDate[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterPostDate[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }

        if (this.mainFilterPostDate.length > 0) {
          if (this.mainFilterPostDate[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterPostDate[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterPostDate[i]['filter'].length; j++) {
          if (this.mainFilterPostDate[i]['filter'][j]['INPUT'] == undefined || this.mainFilterPostDate[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Date', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterPostDate[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterPostDate[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterPostDate[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Date 2', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterPostDate[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterPostDate[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterPostDate[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterPostDate[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterPostDate[i]['buttons']['AND'] == false && this.mainFilterPostDate[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";
                if (this.mainFilterPostDate[i]['filter'].length > 0) {
                  if (this.mainFilterPostDate[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";

                  }
                }

                if (this.mainFilterPostDate[i]['filter'].length > 0) {
                  if (this.mainFilterPostDate[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";

                  }
                }
                this.mainFilterPostDate[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterPostDate[i]['filter'][j]['INPUT'], "yyyy-MM-dd");

                if (this.mainFilterPostDate[i]['filter'][j]['DROPDOWN'] == "Between") {
                  this.mainFilterPostDate[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterPostDate[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");
                  this.filtersPostDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterPostDate[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterPostDate[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterPostDate[i]['filter'][j]['INPUT2'] + "'";

                } else
                  if (this.mainFilterPostDate[i]['filter'][j]['DROPDOWN'] == "=") {
                    this.mainFilterPostDate[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterPostDate[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");
                    this.filtersPostDate = Button + Button1 + ' ' + this.model + " " + "Between" + " '" + this.mainFilterPostDate[i]['filter'][j]['INPUT'] + " 00:00:00" + "' AND '" + this.mainFilterPostDate[i]['filter'][j]['INPUT'] + " 23:59:59" + "'";

                  } else {
                    this.filtersPostDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterPostDate[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterPostDate[i]['filter'][j]['INPUT'] + "'";
                  }

                this.filterPostDate = this.filterPostDate + this.filtersPostDate;
              }
        }

        this.filterPostDate = this.filterPostDate + "))";
      }

      if (isok) {
        this.isVisiblePostDate = false;
        this.filterPostDate = ' AND ' + this.filterPostDate;
        this.getFederationfilter();

      } else {
        this.all_filter = '';
      }
    }
  }

  isVisibleSubject = false;

  showModalSubject(): void {
    this.isVisibleSubject = true;
    this.model = "DESCRIPTION";
    this.model_name = 'Subject';
  }

  modelCancelSubject() {
    this.isVisibleSubject = false;
  }

  ANDBUTTONLASTSubject(i: any) {
    this.mainFilterSubject[i]['buttons']['AND'] = true;
    this.mainFilterSubject[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTSubject(i: any) {
    this.mainFilterSubject[i]['buttons']['AND'] = false;
    this.mainFilterSubject[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTSubject1(i: any, j: any) {
    this.mainFilterSubject[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterSubject[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTSubject1(i: any, j: any) {
    this.mainFilterSubject[i]['filter'][j]['buttons']['OR'] = true;
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
        this.filterSubject = " AND " + this.filterSubject;
        this.getFederationfilter();
      }
    }
  }

  isVisibleLike: boolean = false;

  showModalLike(): void {
    this.isVisibleLike = true;
    this.model = "LIKE_COUNT";
    this.model_name = 'Like'
  }

  modelCancelLike() {
    this.isVisibleLike = false;
  }

  ANDBUTTONLASTLike(i: any) {
    this.mainFilterLike[i]['buttons']['AND'] = true;
    this.mainFilterLike[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTLike(i: any) {
    this.mainFilterLike[i]['buttons']['AND'] = false;
    this.mainFilterLike[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTLike1(i: any, j: any) {
    this.mainFilterLike[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterLike[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTLike1(i: any, j: any) {
    this.mainFilterLike[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterLike[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersLike = '';

  AddFilterGroupLike() {
    this.mainFilterLike.push({
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

  AddFilterLike(i: any, j: any) {
    this.mainFilterLike[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );

    return true;
  }

  CloseGroupLike(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterLike.splice(i, 1);
      return true;
    }
  }

  CloseGroupLike1(i: any, j: any) {
    if (this.mainFilterLike[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterLike[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearLike() {
    this.mainFilterLike = [];
    this.filterLike = '';

    this.mainFilterLike.push({
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

  ApplyFilterLike() {
    if (this.mainFilterLike.length != 0) {
      var isok = true;
      this.filterLike = '';

      for (let i = 0; i < this.mainFilterLike.length; i++) {
        var Button = " ";

        if (this.mainFilterLike.length > 0) {
          if (this.mainFilterLike[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterLike[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }

        if (this.mainFilterLike.length > 0) {
          if (this.mainFilterLike[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterLike[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterLike[i]['filter'].length; j++) {
          if (this.mainFilterLike[i]['filter'][j]['INPUT'] == undefined || this.mainFilterLike[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterLike[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterLike[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterLike[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input 2', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterLike[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterLike[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterLike[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterLike[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterLike[i]['buttons']['AND'] == false && this.mainFilterLike[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";
                if (this.mainFilterLike[i]['filter'].length > 0) {
                  if (this.mainFilterLike[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";

                  }
                }

                if (this.mainFilterLike[i]['filter'].length > 0) {
                  if (this.mainFilterLike[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";

                  }
                }

                if (this.mainFilterLike[i]['filter'][j]['DROPDOWN'] == "Between") {
                  this.filtersLike = Button + Button1 + ' ' + this.model + " " + this.mainFilterLike[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterLike[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterLike[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersLike = Button + Button1 + ' ' + this.model + " " + this.mainFilterLike[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterLike[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterLike = this.filterLike + this.filtersLike;
              }
        }

        this.filterLike = this.filterLike + "))";
      }

      if (isok) {
        this.isVisibleLike = false;
        this.filterLike = ' AND ' + this.filterLike;
        this.getFederationfilter();
      }
    }
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    else
      return true;
  }

  isVisibleComment: boolean = false;

  showModalComment(): void {
    this.isVisibleComment = true;
    this.model = "COMMENT_COUNT";
    this.model_name = 'Comment';
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
    });

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
    if (this.mainFilterComment[i]['filter'].length == 1 || j == 0) {
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

                if (this.mainFilterComment[i]['filter'][j]['DROPDOWN'] == "Between") {
                  this.filtersComment = Button + Button1 + ' ' + this.model + " " + this.mainFilterComment[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterComment[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterComment[i]['filter'][j]['INPUT2'] + "'";

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
    this.sortKey = "ID";
    this.sortValue = "asc";
    this.mainFilterArray = [];
    this.mainFilterSubject = [];
    this.mainFilterPostDate = [];
    this.mainFilterLike = [];
    this.mainFilterComment = [];

    this.filterMemberName = '';
    this.filterSubject = '';
    this.filterPostDate = '';
    this.filterComment = '';
    this.filterLike = '';

    this.mainFilterFederationArray = [];
    this.mainFilterGroupArray = [];
    this.mainFilterUnitArray = [];
    this.filterFederation = '';
    this.filterGroup = '';
    this.filterUnit = '';

    this.mainFilterFederationArray.push({
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

    this.mainFilterUnitArray.push({
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

    this.mainFilterGroupArray.push({
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

    this.mainFilterPostDate.push({
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

    this.mainFilterLike.push({
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

  ScheduleTitle: string = '';
  ScheduleVisible: boolean = false;
  ScheduleData: REPORTSCHEDULE = new REPORTSCHEDULE();
  dataList = [];

  goToSchedule(reset: boolean = false, loadMore: boolean = false): void {
    this.ScheduleTitle = "Post Report";
    this.ScheduleData = new REPORTSCHEDULE();
    this.ScheduleData.SCHEDULE = 'D';
    this.ScheduleData.SORT_KEY = this.sortKey;
    this.ScheduleData.SORT_VALUE = this.sortValue;
    var f_filtar = '';

    if (this.FEDERATION_ID != '0') {
      f_filtar = " AND FEDERATION_ID=" + this.FEDERATION_ID;

    } else if (this.GROUP_ID != '0') {
      f_filtar = " AND GROUP_ID=" + this.GROUP_ID;

    } else if (this.UNIT_ID != '0') {
      f_filtar = " AND UNIT_ID=" + this.UNIT_ID;
    }

    this.ScheduleData.FILTER_QUERY = this.all_filter + " AND YEAR(POST_CREATED_DATETIME)='" + this.SelectedYear + "'" + f_filtar;
    this.ScheduleData.REPORT_ID = 2;
    this.ScheduleData.USER_ID = parseInt(this._cookie.get('userId'));
    this.loadingRecords = true;

    this.api.getScheduledReport(this.pageIndex, this.pageSize, '', '', '' + 'AND STATUS=1 AND REPORT_ID=2').subscribe(data => {
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
      return 380;

    } else {
      return 850;
    }
  }

  visible: boolean = false;

  close(): void {
    this.visible = false;
  }

  CountTitle: string = '';
  dataInvitees = [];
  dataRecord: boolean = false;

  getLikeMapping(data: any) {
    this.visible = true;
    this.CountTitle = "Post Likes";
    this.dataInvitees = [];
    this.dataRecord = true;

    this.api.getLikeMapping(0, 0, '', '', '' + 'AND POST_ID=' + data["ID"]).subscribe(data => {
      if (data['code'] == 200) {
        this.dataRecord = false;
        this.dataInvitees = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getCommentMapping(data: any) {
    this.visible = true;
    this.CountTitle = "Post Comments";
    this.dataInvitees = [];
    this.dataRecord = true;

    this.api.getCommentMapping(0, 0, '', '', '' + 'AND POST_ID=' + data["ID"]).subscribe(data => {
      if (data['code'] == 200) {
        this.dataRecord = false;
        this.dataInvitees = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getProfilePhoto(photoURL: string) {
    if ((photoURL == null) || (photoURL.trim() == '')) {
      return 'assets/anony.png';

    } else {
      return this.imageURL + 'profileImage/' + photoURL;
    }
  }
}