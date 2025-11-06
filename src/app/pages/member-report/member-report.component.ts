import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { REPORTSCHEDULE } from 'src/app/Models/reportSchedule';
import { ApiService } from 'src/app/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-member-report',
  templateUrl: './member-report.component.html',
  styleUrls: ['./member-report.component.css']
})

export class MemberReportComponent implements OnInit {
  columns: string[][] = [
    ["FEDERATION_NAME", "Federation Name"], ["UNIT_NAME", "Name Of Unit "],
    ["GROUP_NAME", "Name Of Group "], ["MEMBER_NAME", "Member Name"], ["MEETING_PLANNED", "Meeting Planned"],
    ["AVG_ATTENDENCE", "Avg. Attendence"], ["POSTS", "No. Of Post"], ["LIKES", "Total Likes"],
    ["COMMENTS", "Total Comments"], ["EVENT_PLANNED", "Total event Planned"], ["CIRCULAR", "No. Of Circular"]];
  Operators_name: string[][] = [["Start With", "Start With"], ["End With", "End With"], ["=", "="], ["<>", "!="], ['Content', 'Content']];
  Operators: string[][] = [["Between", "Between"], ["=", "="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["<>", "!="]];
  multipleValue = [];
  formTitle: string = "Member Level Report";
  a = new Date();
  b = new Date(this.a.getFullYear() + 1, 3, 1);
  size = 'default';
  YEAR: any;
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  loadingRecords: boolean = true;
  year = new Date().getFullYear();
  baseYear = 2020;
  range = [];
  next_year = Number(this.year + 1)
  SelectedYear: any
  tagValue: string[] = ["Select All", "Federation Name", "Name Of Unit", "Name Of Group", "Member Name",
    "Meeting Planned", "Avg. Attendence", "No. Of Post", "Total Likes", "Total Comments", "Total event Planned",
    "No. Of Circular"]
  federationId = Number(this._cookie.get('FEDERATION_ID'));
  UnitId = Number(this._cookie.get('UNIT_ID'));
  GroupId = Number(this._cookie.get('GROUP_ID'));
  exportLoading: boolean = false;
  exportLoading1: boolean = false;
  searchText: string = "";
  sortValue: string = "desc";
  sortKey: string = "id";
  federations = [];
  branchNamesToPrint = "";
  displayTA = "";
  isVisiblepdf: boolean = false;
  exportInPDFLoading: boolean = false;
  isPDFModalVisible: boolean = false;
  dataListForExport = [];
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
  Col11: boolean = true;
  Col12: boolean = true;
  Col13: boolean = true;
  VALUE = [];
  SelectColumn1 = [];

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService, private _exportService: ExportService) { }

  HandleCancel() {
    this.isVisiblepdf = false;
  }

  Fordate() {
    let currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= this.baseYear; i--) {
      this.range.push(i);
    }
  }

  SelectYear(YEARs: any) {
    this.SelectedYear = YEARs;
    this.loadingRecords = true;

    if (this.filter != "") {
      var filters = " AND " + this.filter;

    } else {
      filters = '';
    }

    this.filter = '';
    this.SelectedYear = YEARs;

    this.api.getMemberReport(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, "", this.SelectedYear, filters, this.federationId, this.UnitId, this.GroupId).subscribe(data => {
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

  ngOnInit() {
    this.Fordate();
    this.getFederation();
    this.current_year();
    this.forClearfilter();
  }

  GroupWiseData = [];
  SELECT_ALL1: boolean = false;

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true);
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
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

      this.api.getMemberReport(0, 0, this.sortKey, this.sortValue, "", this.SelectedYear, filters, this.federationId, this.UnitId, this.GroupId).subscribe(data => {
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
      // this.exportLoading1 = true;

      this.api.getMemberReport(0, 0, this.sortKey, this.sortValue, "", this.SelectedYear, filters, this.federationId, this.UnitId, this.GroupId).subscribe(data => {
        if (data['code'] == 200) {
          // this.exportLoading1 = false;
          this.GroupWiseData = data['data'];
          this.isVisiblepdf = true;
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });

    } else {
      this.loadingRecords = true;

      this.api.getMemberReport(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, "", this.SelectedYear, filters, this.federationId, this.UnitId, this.GroupId).subscribe(data => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.federations = data['data'];
          this.totalRecords = data['count'];
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
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
      if (this.Col1 == true) {
        obj1['Federation Name'] = this.dataListForExport[i]['FEDERATION_NAME'];
      }
      if (this.Col2 == true) {
        obj1['Unit Name'] = this.dataListForExport[i]['UNIT_NAME'];
      }
      if (this.Col3 == true) {
        obj1['Group Name'] = this.dataListForExport[i]['GROUP_NAME'];
      }
      if (this.Col4 == true) {
        obj1['Member Name'] = this.dataListForExport[i]['MEMBER_NAME'];
      }
      if (this.Col5 == true) {
        obj1['Meeting Planned'] = this.dataListForExport[i]['MEETING_PLANNED'];
      }
      if (this.Col6 == true) {
        obj1['Meeting Invited'] = this.dataListForExport[i]['MEETING_INVITED'];
      }
      if (this.Col7 == true) {
        obj1['Meeting Attempted'] = this.dataListForExport[i]['MEETING_ATTEMPTED'];
      }
      if (this.Col8 == true) {
        obj1['Avg Attendence'] = this.dataListForExport[i]['AVG_ATTENDENCE'];
      }
      if (this.Col9 == true) {
        obj1['No. Of Post'] = this.dataListForExport[i]['POSTS'];
      }
      if (this.Col10 == true) {
        obj1['Total Like'] = this.dataListForExport[i]['LIKES'];
      }
      if (this.Col11 == true) {
        obj1['Total Comment'] = this.dataListForExport[i]['COMMENTS'];
      }
      if (this.Col12 == true) {
        obj1['Event Planned'] = this.dataListForExport[i]['EVENT_PLANNED'];
      }
      if (this.Col13 == true) {
        obj1['Total Circular'] = this.dataListForExport[i]['CIRCULAR'];
      }
      // obj1['Total View'] = this.dataListForExport[i]['TOTAL_VIEW'];
      arry1.push(Object.assign({}, obj1));
      if (i == this.dataListForExport.length - 1) {
        this._exportService.exportExcel(arry1, 'Member Wise Count ' + this.datePipe.transform(new Date(), 'dd-MMM-yy, hh mm ss a'));
      }
    }
  }

  getFederation() {
    this.SelectedYear = (new Date()).getFullYear();

    this.api.getMemberReport(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, "", this.SelectedYear, "", this.federationId, this.UnitId, this.GroupId).subscribe(data => {
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

  onChange(colName: string[]): void {
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
    this.Col11 = false;
    this.Col12 = false;
    this.Col13 = false;

    for (let i = 0; i <= 12; i++) {
      if (this.tagValue[i] == "Federation Name") { this.Col1 = true; }
      if (this.tagValue[i] == "Name Of Unit") { this.Col2 = true; }
      if (this.tagValue[i] == "Name Of Group") { this.Col3 = true; }
      if (this.tagValue[i] == "Member Name") { this.Col4 = true; }
      if (this.tagValue[i] == "Meeting Planned") { this.Col5 = true; }
      if (this.tagValue[i] == "Meeting Invited") { this.Col6 = true; }
      if (this.tagValue[i] == "Meeting Attempted") { this.Col7 = true; }
      if (this.tagValue[i] == "Avg. Attendence") { this.Col8 = true; }
      if (this.tagValue[i] == "No. Of Post") { this.Col9 = true; }
      if (this.tagValue[i] == "Total Likes") { this.Col10 = true; }
      if (this.tagValue[i] == "Total Comments") { this.Col11 = true; }
      if (this.tagValue[i] == "Total event Planned") { this.Col12 = true; }
      if (this.tagValue[i] == "No. Of Circular") { this.Col13 = true; }
    }

    // <!--MEETING_PLANNED , AVG_ATTENDENCE , POSTS , LIKES , COMMENTS , EVENT_PLANNED , CIRCULAR , TOTAL_VIEW -->
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
      this.Col11 = true;
      this.Col12 = true;
      this.Col13 = true;
    }
  }

  value: string[] = ['0-0-0'];
  nodes = [{
    title: 'Select All', value: 'Select All', key: 'Select All',
    children: [
      {
        title: 'Meeting Planned',
        value: 'Meeting Planned',
        key: 'Meeting Planned',
        isLeaf: true
      },
      {
        title: 'Meeting Invited',
        value: 'Meeting Invited',
        key: 'Meeting Invited',
        isLeaf: true
      },
      {
        title: 'Meeting Attempted',
        value: 'Meeting Attempted',
        key: 'Meeting Attempted',
        isLeaf: true
      },
      {
        title: 'Avg. Attendence',
        value: 'Avg. Attendence',
        key: 'Avg. Attendence',
        isLeaf: true
      },
      {
        title: 'No. Of Post',
        value: 'No. Of Post',
        key: 'No. Of Post',
        isLeaf: true
      },
      {
        title: 'Total Likes',
        value: 'Total Likes',
        key: 'Total Likes',
        isLeaf: true
      },
      {
        title: 'Total Comments',
        value: 'Total Comments',
        key: 'Total Comments',
        isLeaf: true
      },
      // <!-- No. Of Circular , Total View's -->
      {
        title: 'Total event Planned',
        value: 'Total event Planned',
        key: 'Total event Planned',
        isLeaf: true
      },
      {
        title: 'No. Of Circular',
        value: 'No. Of Circular',
        key: 'No. Of Circular',
        isLeaf: true
      },
    ]
  }
  ];

  isVisiblePostCount: boolean = false;
  isVisibleCircularCount: boolean = false;
  isVisibleProjCount: boolean = false;
  ModelName: string = "";

  goToClear() {
    this.mainFilterArrayCircular = [];
    this.mainFilterArrayEventPlanned = [];
    this.mainFilterArrayMeetAttempt = [];
    this.mainFilterArrayMeetInvite = [];
    this.mainFilterArrayMeetPlanned = [];
    this.mainFilterArrayMemberName = [];
    this.mainFilterArrayPost = [];
    this.mainFilterArrayTotViews = [];
    this.mainFilterArrayTotalPostComment = [];
    this.mainFilterArrayTotalPostLikes = [];
    this.mainFilterArrayViewCircular = [];
    this.mainFilterArrayfednm = [];
    this.mainFilterArrayUnitCount = [];
    this.mainFilterArraygrpcount = [];

    this.filterPostCoun = '';
    this.filterCircuCoun = '';
    this.filterMeetPlan = '';
    this.filterTotLike = '';
    this.filterTotCommen = '';
    this.filterMeetAtt = '';
    this.filterTotView = '';
    this.filterViewCircu = '';
    this.filterfednm = '';
    this.filterUnitCount = '';
    this.filtergrpReport = '';
    this.filterMemNm = '';
    this.filterAvePln = '';
    this.filterMeetInv = '';
    this.getMemberReport();
    this.forClearfilter();
  }

  forClearfilter() {
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
    this.mainFilterArrayPost.push({
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
    this.mainFilterArrayEventPlanned.push({
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
    this.mainFilterArrayCircular.push({
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
    this.mainFilterArrayProject.push({
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
    this.mainFilterArrayMeetPlanned.push({
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

    this.mainFilterArrayTotViews.push({
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
    this.mainFilterArrayMemberName.push({
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
    this.mainFilterArrayTotalPostComment.push({
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
    this.mainFilterArrayTotalPostLikes.push({
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

    this.mainFilterArrayViewCircular.push({
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
    this.mainFilterArrayMeetInvite.push({
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

    this.mainFilterArrayMeetAttempt.push({
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

  showModalPostCount() {
    this.isVisiblePostCount = true;
    this.ModelName = "Post Count Filter";
    this.model = "POSTS";
  }

  ClosePostCount() {
    this.isVisiblePostCount = false;
  }

  showModalCircularCount() {
    this.isVisibleCircularCount = true;
    this.ModelName = "Circular Count Filter";
    this.model = "CIRCULAR";
  }

  CloseCircularCount() {
    this.isVisibleCircularCount = false;
  }

  CloseProjectCount() {
    this.isVisibleProjCount = false;
  }

  model = '';
  mainFilterArrayPost = [];
  mainFilterArrayCircular = [];
  mainFilterArrayProject = [];
  mainFilterArrayMemberName = []

  secondButton = "";
  ClickAddFilter1 = false;
  filter = '';
  filtersMeetingCount = '';
  filtersPostCount = '';
  filtersCircularCount = '';
  filtersProjectCount = '';
  PushFilterMeeting: any[] = [];

  ClearFilterPostCount() {
    this.mainFilterArrayPost = [];
    this.filterPostCoun = '';
    this.mainFilterArrayPost.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getMemberReport();
  }

  CloseGroupPostCount(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayPost.splice(i, 1);
      return true;
    }
  }

  CloseGroupPostCount1(i: any, j: any) {
    if (this.mainFilterArrayPost[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayPost[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterPostCount() {
    if (this.mainFilterArrayPost.length != 0) {
      var isok = true;
      var Button = " ";
      this.filterPostCoun = "";

      for (let i = 0; i < this.mainFilterArrayPost.length; i++) {
        Button = " ";
        if (this.mainFilterArrayPost.length > 0) {
          if (this.mainFilterArrayPost[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayPost[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayPost.length > 0) {
          if (this.mainFilterArrayPost[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayPost[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayPost[i]['filter'].length; j++) {
          if (this.mainFilterArrayPost[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayPost[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayPost[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterArrayPost[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayPost[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterArrayPost[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayPost[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterArrayPost[i]['buttons']['AND'] == false && this.mainFilterArrayPost[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";
                if (this.mainFilterArrayPost[i]['filter'].length > 0) {
                  if (this.mainFilterArrayPost[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterArrayPost[i]['filter'].length > 0) {
                  if (this.mainFilterArrayPost[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayPost[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");
                  this.filtersPostCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayPost[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayPost[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersPostCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayPost[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayPost[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterPostCoun = this.filterPostCoun + this.filtersPostCount;
              }
        }

        this.filterPostCoun = this.filterPostCoun + "))";
      }

      if (isok == true) {
        console.log(this.filterPostCoun);
        this.filterPostCoun = ' AND ' + this.filterPostCoun;
        this.getMemberReport();
        this.isVisiblePostCount = false;
      }
    }

    else {
      this.getMemberReport();
      this.isVisiblePostCount = false
    }
  }

  AddFilterGroupPostCount() {
    this.mainFilterArrayPost.push({
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

  AddFilterPostCount(i: any) {
    this.mainFilterArrayPost[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }

  ANDBUTTONLASTPostCount(i: any) {
    this.mainFilterArrayPost[i]['buttons']['AND'] = true
    this.mainFilterArrayPost[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTPostCount(i: any) {
    this.mainFilterArrayPost[i]['buttons']['AND'] = false
    this.mainFilterArrayPost[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTPostCount1(i: any, j: any) {
    this.mainFilterArrayPost[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayPost[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTPostCount1(i: any, j: any) {
    this.mainFilterArrayPost[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayPost[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Circular

  ClearFilterCircularCount() {
    this.mainFilterArrayCircular = [];
    this.filterCircuCoun = '';
    this.mainFilterArrayCircular.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getMemberReport();
  }

  CloseGroupCircularCount(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterArrayCircular.splice(i, 1);
      return true;
    }
  }

  CloseGroupCircularCount1(i: any, j: any) {
    if (this.mainFilterArrayCircular[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterArrayCircular[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterCircularCount() {
    if (this.mainFilterArrayCircular.length != 0) {
      var isok = true;
      var Button = " ";
      this.filterCircuCoun = "";
      for (let i = 0; i < this.mainFilterArrayCircular.length; i++) {
        Button = " ";
        if (this.mainFilterArrayCircular.length > 0) {
          if (this.mainFilterArrayCircular[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayCircular[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayCircular.length > 0) {
          if (this.mainFilterArrayCircular[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayCircular[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayCircular[i]['filter'].length; j++) {
          if (this.mainFilterArrayCircular[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayCircular[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayCircular[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayCircular[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayCircular[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayCircular[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayCircular[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterArrayCircular[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayCircular[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterArrayCircular[i]['buttons']['AND'] == false && this.mainFilterArrayCircular[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayCircular[i]['filter'].length > 0) {
                  if (this.mainFilterArrayCircular[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayCircular[i]['filter'].length > 0) {
                  if (this.mainFilterArrayCircular[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayCircular[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersCircularCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayCircular[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayCircular[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayCircular[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersCircularCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayCircular[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayCircular[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterCircuCoun = this.filterCircuCoun + this.filtersCircularCount;
              }
        }
        this.filterCircuCoun = this.filterCircuCoun + "))";
      }
      if (isok == true) {
        console.log(this.filterCircuCoun);
        this.filterCircuCoun = ' AND ' + this.filterCircuCoun;
        this.getMemberReport();
        this.isVisibleCircularCount = false;
      }
    }

    else {
      this.getMemberReport();
      this.isVisibleCircularCount = false
    }
  }

  AddFilterGroupCircularCount() {
    this.mainFilterArrayCircular.push({
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

  AddFilterCircularCount(i: any) {
    this.mainFilterArrayCircular[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }

  ANDBUTTONLASTCircularCount(i: any) {
    this.mainFilterArrayCircular[i]['buttons']['AND'] = true
    this.mainFilterArrayCircular[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTCircularCount(i: any) {
    this.mainFilterArrayCircular[i]['buttons']['AND'] = false
    this.mainFilterArrayCircular[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTCircularCount1(i: any, j: any) {
    this.mainFilterArrayCircular[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayCircular[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTCircularCount1(i: any, j: any) {
    this.mainFilterArrayCircular[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayCircular[i]['filter'][j]['buttons']['AND'] = false;
  }

  all_filter = '';
  filterPostCoun = '';
  filterEventCoun = '';
  filterCircuCoun = '';
  filterMeetPlan = '';
  filterTotLike = '';
  filterTotCommen = '';
  filterMeetAtt = '';
  filterTotView = '';
  filterViewCircu = '';

  getMemberReport() {
    this.loadingRecords = true;

    if (this.filtergrpReport == '))') { this.filtergrpReport = ''; }
    if (this.filterUnitCount == '))') { this.filterUnitCount = ''; }
    if (this.filterfednm == '))') { this.filterfednm = '' }
    if (this.filterPostCoun == '))') {
      this.filterPostCoun = '';
    }
    if (this.filterAvePln == '))') {
      this.filterAvePln = '';
    }
    if (this.filterCircuCoun == '))') {
      this.filterCircuCoun = '';
    }
    if (this.filterMeetPlan == '))') {
      this.filterMeetPlan = '';
    }
    if (this.filterTotLike == '))') {
      this.filterTotLike = '';
    }
    if (this.filterTotCommen == '))') {
      this.filterTotCommen = '';
    }
    if (this.filterTotView == '))') {
      this.filterTotView = '';
    }
    if (this.filterViewCircu == '))') {
      this.filterViewCircu = '';
    }
    if (this.filterMeetInv == '))') {
      this.filterMeetInv = '';
    }
    if (this.filterMeetAtt == '))') {
      this.filterMeetAtt = '';
    }
    if (this.filterMemNm == '))') {
      this.filterMemNm = '';
    }

    this.all_filter = this.filterPostCoun + this.filterAvePln + this.filterCircuCoun + this.filterMeetPlan + this.filterTotLike +
      this.filterTotCommen + this.filterTotView + this.filterViewCircu + this.filterMeetInv + this.filterMeetAtt + this.filterMemNm + this.filterfednm + this.filterUnitCount + this.filtergrpReport;

    this.api.getMemberReport(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, "", this.SelectedYear, this.all_filter, this.federationId, this.UnitId, this.GroupId).subscribe(data => {
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

  // Meeting Planned
  mainFilterArrayMeetPlanned = [];
  filtersMeetPlanned = "";
  isVisibleMeetPlanned = false;

  ClearFilterMeetPlanned() {
    this.mainFilterArrayMeetPlanned = [];
    this.filterMeetPlan = '';
    this.mainFilterArrayMeetPlanned.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getMemberReport();
  }

  showModalMeetPlanned() {
    this.isVisibleMeetPlanned = true;
    this.ModelName = "Meeting Planned Filter";
    this.model = "MEETING_PLANNED";
  }

  CloseMeetPlanned() {
    this.isVisibleMeetPlanned = false;
  }

  CloseGroupMeetPlanned(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayMeetPlanned.splice(i, 1);
      return true;
    }
  }

  CloseGroupMeetPlanned1(i: any, j: any) {
    if (this.mainFilterArrayMeetPlanned[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayMeetPlanned[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterMeetPlanned() {
    if (this.mainFilterArrayMeetPlanned.length != 0) {
      var isok = true;
      var Button = " ";
      this.filterMeetPlan = "";

      for (let i = 0; i < this.mainFilterArrayMeetPlanned.length; i++) {
        Button = " ";
        if (this.mainFilterArrayMeetPlanned.length > 0) {
          if (this.mainFilterArrayMeetPlanned[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayMeetPlanned[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayMeetPlanned.length > 0) {
          if (this.mainFilterArrayMeetPlanned[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayMeetPlanned[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayMeetPlanned[i]['filter'].length; j++) {
          if (this.mainFilterArrayMeetPlanned[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayMeetPlanned[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayMeetPlanned[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayMeetPlanned[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayMeetPlanned[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayMeetPlanned[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayMeetPlanned[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayMeetPlanned[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayMeetPlanned[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayMeetPlanned[i]['buttons']['AND'] == false && this.mainFilterArrayMeetPlanned[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayMeetPlanned[i]['filter'].length > 0) {
                  if (this.mainFilterArrayMeetPlanned[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayMeetPlanned[i]['filter'].length > 0) {
                  if (this.mainFilterArrayMeetPlanned[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayMeetPlanned[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersMeetPlanned = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayMeetPlanned[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayMeetPlanned[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayMeetPlanned[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersMeetPlanned = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayMeetPlanned[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayMeetPlanned[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterMeetPlan = this.filterMeetPlan + this.filtersMeetPlanned;
              }
        }
        this.filterMeetPlan = this.filterMeetPlan + "))";
      }

      if (isok == true) {
        console.log(this.filterMeetPlan);
        this.filterMeetPlan = ' AND ' + this.filterMeetPlan;
        this.getMemberReport();
        this.isVisibleMeetPlanned = false;
      }
    }

    else {
      this.getMemberReport();
      this.isVisibleMeetPlanned = false
    }
  }

  AddFilterGroupMeetPlanned() {
    this.mainFilterArrayMeetPlanned.push({
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

  AddFilterMeetPlanned(i: any) {
    this.mainFilterArrayMeetPlanned[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }

  ANDBUTTONLASTMeetPlanned(i: any) {
    this.mainFilterArrayMeetPlanned[i]['buttons']['AND'] = true
    this.mainFilterArrayMeetPlanned[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTMeetPlanned(i: any) {
    this.mainFilterArrayMeetPlanned[i]['buttons']['AND'] = false
    this.mainFilterArrayMeetPlanned[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTMeetPlanned1(i: any, j: any) {
    this.mainFilterArrayMeetPlanned[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayMeetPlanned[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTMeetPlanned1(i: any, j: any) {
    this.mainFilterArrayMeetPlanned[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayMeetPlanned[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Total Post Like
  mainFilterArrayTotalPostLikes = [];
  filtersTotalPostLikes = "";
  isVisibleTotalPostLikes = false;

  ClearFilterTotalPostLikes() {
    this.mainFilterArrayTotalPostLikes = [];
    this.filterTotLike = '';
    this.mainFilterArrayTotalPostLikes.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getMemberReport();
  }

  showModalTotalPostLikes() {
    this.isVisibleTotalPostLikes = true;
    this.ModelName = "Total Post Like Filter";
    this.model = "LIKES";
  }

  CloseTotalPostLikes() {
    this.isVisibleTotalPostLikes = false;
  }

  CloseGroupTotalPostLikes(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterArrayTotalPostLikes.splice(i, 1);
      return true;
    }
  }

  CloseGroupTotalPostLikes1(i: any, j: any) {
    if (this.mainFilterArrayTotalPostLikes[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterArrayTotalPostLikes[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterTotalPostLikes() {
    if (this.mainFilterArrayTotalPostLikes.length != 0) {
      var isok = true;
      var Button = " ";
      this.filterTotLike = "";

      for (let i = 0; i < this.mainFilterArrayTotalPostLikes.length; i++) {
        Button = " ";
        if (this.mainFilterArrayTotalPostLikes.length > 0) {
          if (this.mainFilterArrayTotalPostLikes[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayTotalPostLikes[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayTotalPostLikes.length > 0) {
          if (this.mainFilterArrayTotalPostLikes[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayTotalPostLikes[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayTotalPostLikes[i]['filter'].length; j++) {
          if (this.mainFilterArrayTotalPostLikes[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayTotalPostLikes[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayTotalPostLikes[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayTotalPostLikes[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayTotalPostLikes[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayTotalPostLikes[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayTotalPostLikes[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayTotalPostLikes[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayTotalPostLikes[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayTotalPostLikes[i]['buttons']['AND'] == false && this.mainFilterArrayTotalPostLikes[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayTotalPostLikes[i]['filter'].length > 0) {
                  if (this.mainFilterArrayTotalPostLikes[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayTotalPostLikes[i]['filter'].length > 0) {
                  if (this.mainFilterArrayTotalPostLikes[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayTotalPostLikes[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersTotalPostLikes = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayTotalPostLikes[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayTotalPostLikes[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayTotalPostLikes[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersTotalPostLikes = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayTotalPostLikes[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayTotalPostLikes[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterTotLike = this.filterTotLike + this.filtersTotalPostLikes;
              }
        }

        this.filterTotLike = this.filterTotLike + "))";
      }

      if (isok == true) {
        console.log(this.filterTotLike);
        this.filterTotLike = ' AND ' + this.filterTotLike;
        this.getMemberReport();
        this.isVisibleTotalPostLikes = false;
      }
    }

    else {
      this.getMemberReport();
      this.isVisibleTotalPostLikes = false
    }
  }

  AddFilterGroupTotalPostLikes() {
    this.mainFilterArrayTotalPostLikes.push({
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

  AddFilterTotalPostLikes(i: any) {
    this.mainFilterArrayTotalPostLikes[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }

  ANDBUTTONLASTTotalPostLikes(i: any) {
    this.mainFilterArrayTotalPostLikes[i]['buttons']['AND'] = true
    this.mainFilterArrayTotalPostLikes[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTTotalPostLikes(i: any) {
    this.mainFilterArrayTotalPostLikes[i]['buttons']['AND'] = false
    this.mainFilterArrayTotalPostLikes[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTTotalPostLikes1(i: any, j: any) {
    this.mainFilterArrayTotalPostLikes[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayTotalPostLikes[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTTotalPostLikes1(i: any, j: any) {
    this.mainFilterArrayTotalPostLikes[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayTotalPostLikes[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Total Post Comment
  mainFilterArrayTotalPostComment = [];
  filtersTotalPostComment = "";
  isVisibleTotalPostComment = false;

  ClearFilterTotalPostComment() {
    this.mainFilterArrayTotalPostComment = [];
    this.filterTotCommen = '';
    this.mainFilterArrayTotalPostComment.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getMemberReport();
  }

  showModalTotalPostComment() {
    this.isVisibleTotalPostComment = true;
    this.ModelName = "Total Comment Till Date Filter";
    this.model = "COMMENTS";
  }

  CloseTotalPostComment() {
    this.isVisibleTotalPostComment = false;
  }

  CloseGroupTotalPostComment(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayTotalPostComment.splice(i, 1);
      return true;
    }
  }

  CloseGroupTotalPostComment1(i: any, j: any) {
    if (this.mainFilterArrayTotalPostComment[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterArrayTotalPostComment[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterTotalPostComment() {
    if (this.mainFilterArrayTotalPostComment.length != 0) {
      var isok = true;
      var Button = " ";
      this.filterTotCommen = "";

      for (let i = 0; i < this.mainFilterArrayTotalPostComment.length; i++) {
        Button = " ";
        if (this.mainFilterArrayTotalPostComment.length > 0) {
          if (this.mainFilterArrayTotalPostComment[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayTotalPostComment[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayTotalPostComment.length > 0) {
          if (this.mainFilterArrayTotalPostComment[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayTotalPostComment[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayTotalPostComment[i]['filter'].length; j++) {
          if (this.mainFilterArrayTotalPostComment[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayTotalPostComment[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayTotalPostComment[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayTotalPostComment[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayTotalPostComment[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayTotalPostComment[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayTotalPostComment[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayTotalPostComment[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayTotalPostComment[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayTotalPostComment[i]['buttons']['AND'] == false && this.mainFilterArrayTotalPostComment[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayTotalPostComment[i]['filter'].length > 0) {
                  if (this.mainFilterArrayTotalPostComment[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayTotalPostComment[i]['filter'].length > 0) {
                  if (this.mainFilterArrayTotalPostComment[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayTotalPostComment[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersTotalPostComment = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayTotalPostComment[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayTotalPostComment[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayTotalPostComment[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersTotalPostComment = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayTotalPostComment[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayTotalPostComment[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterTotCommen = this.filterTotCommen + this.filtersTotalPostComment;
              }
        }
        this.filterTotCommen = this.filterTotCommen + "))";
      }

      if (isok == true) {
        console.log(this.filterTotCommen);
        this.filterTotCommen = ' AND ' + this.filterTotCommen;
        this.getMemberReport();
        this.isVisibleTotalPostComment = false;
      }
    }

    else {
      this.getMemberReport();
      this.isVisibleTotalPostComment = false
    }
  }

  AddFilterGroupTotalPostComment() {
    this.mainFilterArrayTotalPostComment.push({
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

  AddFilterTotalPostComment(i: any) {
    this.mainFilterArrayTotalPostComment[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }

  ANDBUTTONLASTTotalPostComment(i: any) {
    this.mainFilterArrayTotalPostComment[i]['buttons']['AND'] = true
    this.mainFilterArrayTotalPostComment[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTTotalPostComment(i: any) {
    this.mainFilterArrayTotalPostComment[i]['buttons']['AND'] = false
    this.mainFilterArrayTotalPostComment[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTTotalPostComment1(i: any, j: any) {
    this.mainFilterArrayTotalPostComment[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayTotalPostComment[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTTotalPostComment1(i: any, j: any) {
    this.mainFilterArrayTotalPostComment[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayTotalPostComment[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Total Circular Created
  mainFilterArrayMeetAttempt = [];
  filtersMeetAttempt = "";
  isVisibleMeetAttempt = false;

  ClearFilterMeetAttempt() {
    this.mainFilterArrayMeetAttempt = [];
    this.filterMeetAtt = '';
    this.mainFilterArrayMeetAttempt.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getMemberReport();
  }

  showModalMeetAttempt() {
    this.isVisibleMeetAttempt = true;
    this.ModelName = "Meeting Attempted Filter";
    this.model = "MEETING_ATTEMPTED";
  }

  CloseMeetAttempt() {
    this.isVisibleMeetAttempt = false;
  }

  CloseGroupMeetAttempt(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayMeetAttempt.splice(i, 1);
      return true;
    }
  }

  CloseGroupMeetAttempt1(i: any, j: any) {
    if (this.mainFilterArrayMeetAttempt[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayMeetAttempt[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterMeetAttempt() {
    if (this.mainFilterArrayMeetAttempt.length != 0) {
      var isok = true;
      var Button = " ";
      this.filterMeetAtt = "";

      for (let i = 0; i < this.mainFilterArrayMeetAttempt.length; i++) {
        Button = " ";
        if (this.mainFilterArrayMeetAttempt.length > 0) {
          if (this.mainFilterArrayMeetAttempt[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayMeetAttempt[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayMeetAttempt.length > 0) {
          if (this.mainFilterArrayMeetAttempt[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayMeetAttempt[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayMeetAttempt[i]['filter'].length; j++) {
          if (this.mainFilterArrayMeetAttempt[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayMeetAttempt[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayMeetAttempt[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayMeetAttempt[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayMeetAttempt[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayMeetAttempt[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayMeetAttempt[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayMeetAttempt[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayMeetAttempt[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayMeetAttempt[i]['buttons']['AND'] == false && this.mainFilterArrayMeetAttempt[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayMeetAttempt[i]['filter'].length > 0) {
                  if (this.mainFilterArrayMeetAttempt[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayMeetAttempt[i]['filter'].length > 0) {
                  if (this.mainFilterArrayMeetAttempt[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayMeetAttempt[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersMeetAttempt = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayMeetAttempt[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayMeetAttempt[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayMeetAttempt[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersMeetAttempt = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayMeetAttempt[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayMeetAttempt[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterMeetAtt = this.filterMeetAtt + this.filtersMeetAttempt;
              }
        }
        this.filterMeetAtt = this.filterMeetAtt + "))";
      }

      if (isok == true) {
        console.log(this.filterMeetAtt);
        this.filterMeetAtt = ' AND ' + this.filterMeetAtt;
        this.getMemberReport();
        this.isVisibleMeetAttempt = false;
      }
    }

    else {
      this.getMemberReport();
      this.isVisibleMeetAttempt = false
    }
  }

  AddFilterGroupMeetAttempt() {
    this.mainFilterArrayMeetAttempt.push({
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

  AddFilterMeetAttempt(i: any) {
    this.mainFilterArrayMeetAttempt[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  ANDBUTTONLASTMeetAttempt(i: any) {
    this.mainFilterArrayMeetAttempt[i]['buttons']['AND'] = true
    this.mainFilterArrayMeetAttempt[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTMeetAttempt(i: any) {
    this.mainFilterArrayMeetAttempt[i]['buttons']['AND'] = false
    this.mainFilterArrayMeetAttempt[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTMeetAttempt1(i: any, j: any) {
    this.mainFilterArrayMeetAttempt[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayMeetAttempt[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTMeetAttempt1(i: any, j: any) {
    this.mainFilterArrayMeetAttempt[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayMeetAttempt[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Total Circular Views
  mainFilterArrayTotViews = [];
  filtersTotViews = "";
  isVisibleTotViews: boolean = false;

  ClearFilterTotViews() {
    this.mainFilterArrayTotViews = [];
    this.filterTotView = '';
    this.mainFilterArrayTotViews.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getMemberReport();
  }

  showModalTotViews() {
    this.isVisibleTotViews = true;
    this.ModelName = "Total View Filter";
    this.model = "TOTAL_VIEW";
  }

  CloseTotViews() {
    this.isVisibleTotViews = false;
  }

  CloseGroupTotViews(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayTotViews.splice(i, 1);
      return true;
    }
  }

  CloseGroupTotViews1(i: any, j: any) {
    if (this.mainFilterArrayTotViews[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayTotViews[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterTotViews() {
    if (this.mainFilterArrayTotViews.length != 0) {
      var isok = true;
      var Button = " ";
      this.filterTotView = "";

      for (let i = 0; i < this.mainFilterArrayTotViews.length; i++) {
        Button = " ";
        if (this.mainFilterArrayTotViews.length > 0) {
          if (this.mainFilterArrayTotViews[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayTotViews[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayTotViews.length > 0) {
          if (this.mainFilterArrayTotViews[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayTotViews[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayTotViews[i]['filter'].length; j++) {
          if (this.mainFilterArrayTotViews[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayTotViews[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayTotViews[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayTotViews[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayTotViews[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayTotViews[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayTotViews[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayTotViews[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayTotViews[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayTotViews[i]['buttons']['AND'] == false && this.mainFilterArrayTotViews[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayTotViews[i]['filter'].length > 0) {
                  if (this.mainFilterArrayTotViews[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayTotViews[i]['filter'].length > 0) {
                  if (this.mainFilterArrayTotViews[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayTotViews[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersTotViews = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayTotViews[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayTotViews[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayTotViews[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersTotViews = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayTotViews[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayTotViews[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterTotView = this.filterTotView + this.filtersTotViews;
              }
        }

        this.filterTotView = this.filterTotView + "))";
      }

      if (isok == true) {
        console.log(this.filterTotView);
        this.filterTotView = ' AND ' + this.filterTotView;
        this.getMemberReport();
        this.isVisibleTotViews = false;
      }
    }

    else {
      this.getMemberReport();
      this.isVisibleTotViews = false
    }
  }

  AddFilterGroupTotViews() {
    this.mainFilterArrayTotViews.push({
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

  AddFilterTotViews(i: any) {
    this.mainFilterArrayTotViews[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  ANDBUTTONLASTTotViews(i: any) {
    this.mainFilterArrayTotViews[i]['buttons']['AND'] = true
    this.mainFilterArrayTotViews[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTTotViews(i: any) {
    this.mainFilterArrayTotViews[i]['buttons']['AND'] = false
    this.mainFilterArrayTotViews[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTTotViews1(i: any, j: any) {
    this.mainFilterArrayTotViews[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayTotViews[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTTotViews1(i: any, j: any) {
    this.mainFilterArrayTotViews[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayTotViews[i]['filter'][j]['buttons']['AND'] = false;
  }

  // view Circular
  mainFilterArrayViewCircular = [];
  filtersViewCircular = "";
  isVisibleViewCircular: boolean = false;

  ClearFilterViewCircular() {
    this.mainFilterArrayViewCircular = [];
    this.filterViewCircu = '';
    this.mainFilterArrayViewCircular.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getMemberReport();
  }

  showModalViewCircular() {
    this.isVisibleViewCircular = true;
    this.ModelName = "Circular Filter";
    this.model = "CIRCULAR";
  }

  CloseViewCircular() {
    this.isVisibleViewCircular = false;
  }

  CloseGroupViewCircular(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayViewCircular.splice(i, 1);
      return true;
    }
  }

  CloseGroupViewCircular1(i: any, j: any) {
    if (this.mainFilterArrayViewCircular[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayViewCircular[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterViewCircular() {
    if (this.mainFilterArrayViewCircular.length != 0) {
      var isok = true;
      var Button = " ";
      this.filterViewCircu = "";

      for (let i = 0; i < this.mainFilterArrayViewCircular.length; i++) {
        Button = " ";
        if (this.mainFilterArrayViewCircular.length > 0) {
          if (this.mainFilterArrayViewCircular[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayViewCircular[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayViewCircular.length > 0) {
          if (this.mainFilterArrayViewCircular[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayViewCircular[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayViewCircular[i]['filter'].length; j++) {
          if (this.mainFilterArrayViewCircular[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayViewCircular[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterArrayViewCircular[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayViewCircular[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayViewCircular[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayViewCircular[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayViewCircular[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayViewCircular[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayViewCircular[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayViewCircular[i]['buttons']['AND'] == false && this.mainFilterArrayViewCircular[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayViewCircular[i]['filter'].length > 0) {
                  if (this.mainFilterArrayViewCircular[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayViewCircular[i]['filter'].length > 0) {
                  if (this.mainFilterArrayViewCircular[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                this.mainFilterArrayViewCircular[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayViewCircular[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayViewCircular[i]['filter'][j]['DROPDOWN'] == "Between") {
                  this.mainFilterArrayViewCircular[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayViewCircular[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersViewCircular = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayViewCircular[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayViewCircular[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayViewCircular[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersViewCircular = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayViewCircular[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayViewCircular[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterViewCircu = this.filterViewCircu + this.filtersViewCircular;
              }
        }

        this.filterViewCircu = this.filterViewCircu + "))";
      }

      if (isok == true) {
        console.log(this.filterViewCircu);
        this.filterViewCircu = ' AND ' + this.filterViewCircu;
        this.getMemberReport();
        this.isVisibleViewCircular = false;
      }
    }

    else {
      this.getMemberReport();
      this.isVisibleViewCircular = false
    }
  }

  AddFilterGroupViewCircular() {
    this.mainFilterArrayViewCircular.push({
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

  AddFilterViewCircular(i: any) {
    this.mainFilterArrayViewCircular[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }

  ANDBUTTONLASTViewCircular(i: any) {
    this.mainFilterArrayViewCircular[i]['buttons']['AND'] = true
    this.mainFilterArrayViewCircular[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTViewCircular(i: any) {
    this.mainFilterArrayViewCircular[i]['buttons']['AND'] = false
    this.mainFilterArrayViewCircular[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTViewCircular1(i: any, j: any) {
    this.mainFilterArrayViewCircular[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayViewCircular[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTViewCircular1(i: any, j: any) {
    this.mainFilterArrayViewCircular[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayViewCircular[i]['filter'][j]['buttons']['AND'] = false;
  }

  mainFilterArrayMeetInvite = [];
  filtersMeetInvite = "";
  isVisibleMeetInvite: boolean = false;

  ClearFilterMeetInvite() {
    this.mainFilterArrayMeetInvite = [];
    this.filterMeetInv = '';
    this.mainFilterArrayMeetInvite.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getMemberReport();
  }

  showModalMeetInvite() {
    this.isVisibleMeetInvite = true;
    this.ModelName = "Meeting Invite Filter";
    this.model = "MEETING_INVITED";
  }

  CloseMeetInvite() {
    this.isVisibleMeetInvite = false;
  }

  CloseGroupMeetInvite(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayMeetInvite.splice(i, 1);
      return true;
    }
  }

  CloseGroupMeetInvite1(i: any, j: any) {
    if (this.mainFilterArrayMeetInvite[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterArrayMeetInvite[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterMeetInvite() {
    if (this.mainFilterArrayMeetInvite.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterMeetInv = '';

      for (let i = 0; i < this.mainFilterArrayMeetInvite.length; i++) {
        Button = " ";
        if (this.mainFilterArrayMeetInvite.length > 0) {
          if (this.mainFilterArrayMeetInvite[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayMeetInvite[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayMeetInvite.length > 0) {
          if (this.mainFilterArrayMeetInvite[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayMeetInvite[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayMeetInvite[i]['filter'].length; j++) {
          if (this.mainFilterArrayMeetInvite[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayMeetInvite[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayMeetInvite[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayMeetInvite[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayMeetInvite[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayMeetInvite[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayMeetInvite[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayMeetInvite[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayMeetInvite[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayMeetInvite[i]['buttons']['AND'] == false && this.mainFilterArrayMeetInvite[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayMeetInvite[i]['filter'].length > 0) {
                  if (this.mainFilterArrayMeetInvite[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayMeetInvite[i]['filter'].length > 0) {
                  if (this.mainFilterArrayMeetInvite[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayMeetInvite[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersMeetInvite = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayMeetInvite[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayMeetInvite[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayMeetInvite[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersMeetInvite = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayMeetInvite[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayMeetInvite[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterMeetInv = this.filterMeetInv + this.filtersMeetInvite;
              }
        }
        this.filterMeetInv = this.filterMeetInv + "))";
      }

      if (isok == true) {
        console.log(this.filterMeetInv);
        this.filterMeetInv = ' AND ' + this.filterMeetInv;
        this.getMemberReport();
        this.isVisibleMeetInvite = false;
      }
    }

    else {
      this.getMemberReport();
      this.isVisibleMeetInvite = false
    }
  }

  filterMeetInv = '';

  AddFilterGroupMeetInvite() {
    this.mainFilterArrayMeetInvite.push({
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

  AddFilterMeetInvite(i: any) {
    this.mainFilterArrayMeetInvite[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  ANDBUTTONLASTMeetInvite(i: any) {
    this.mainFilterArrayMeetInvite[i]['buttons']['AND'] = true
    this.mainFilterArrayMeetInvite[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTMeetInvite(i: any) {
    this.mainFilterArrayMeetInvite[i]['buttons']['AND'] = false
    this.mainFilterArrayMeetInvite[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTMeetInvite1(i: any, j: any) {
    this.mainFilterArrayMeetInvite[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayMeetInvite[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTMeetInvite1(i: any, j: any) {
    this.mainFilterArrayMeetInvite[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayMeetInvite[i]['filter'][j]['buttons']['AND'] = false;
  }

  mainFilterArrayEventPlanned = [];
  filtersEventPlanned = "";
  isVisibleEventPlanned: boolean = false;

  ClearFilterEventPlanned() {
    this.mainFilterArrayEventPlanned = [];
    this.filterAvePln = '';
    this.mainFilterArrayEventPlanned.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getMemberReport();
  }

  showModalEventPlanned() {
    this.isVisibleEventPlanned = true;
    this.ModelName = "Event Planned Filter";
    this.model = "EVENT_PLANNED";
  }

  CloseEventPlanned() {
    this.isVisibleEventPlanned = false;
  }

  CloseGroupEventPlanned(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayEventPlanned.splice(i, 1);
      return true;
    }
  }

  CloseGroupEventPlanned1(i: any, j: any) {
    if (this.mainFilterArrayEventPlanned[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayEventPlanned[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterEventPlanned() {
    if (this.mainFilterArrayEventPlanned.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterAvePln = "";

      for (let i = 0; i < this.mainFilterArrayEventPlanned.length; i++) {
        Button = " ";
        if (this.mainFilterArrayEventPlanned.length > 0) {
          if (this.mainFilterArrayEventPlanned[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayEventPlanned[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayEventPlanned.length > 0) {
          if (this.mainFilterArrayEventPlanned[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayEventPlanned[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayEventPlanned[i]['filter'].length; j++) {
          if (this.mainFilterArrayEventPlanned[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayEventPlanned[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayEventPlanned[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayEventPlanned[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayEventPlanned[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayEventPlanned[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayEventPlanned[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayEventPlanned[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayEventPlanned[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayEventPlanned[i]['buttons']['AND'] == false && this.mainFilterArrayEventPlanned[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayEventPlanned[i]['filter'].length > 0) {
                  if (this.mainFilterArrayEventPlanned[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayEventPlanned[i]['filter'].length > 0) {
                  if (this.mainFilterArrayEventPlanned[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayEventPlanned[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersEventPlanned = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayEventPlanned[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayEventPlanned[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayEventPlanned[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersEventPlanned = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayEventPlanned[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayEventPlanned[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterAvePln = this.filterAvePln + this.filtersEventPlanned;
              }
        }

        this.filterAvePln = this.filterAvePln + "))";
      }

      if (isok == true) {
        console.log(this.filterAvePln);
        this.filterAvePln = ' AND ' + this.filterAvePln;
        this.getMemberReport();
        this.isVisibleEventPlanned = false;
      }
    }

    else {
      this.getMemberReport();
      this.isVisibleEventPlanned = false
    }
  }

  filterAvePln = '';

  AddFilterGroupEventPlanned() {
    this.mainFilterArrayEventPlanned.push({
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

  AddFilterEventPlanned(i: any) {
    this.mainFilterArrayEventPlanned[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }

  ANDBUTTONLASTEventPlanned(i: any) {
    this.mainFilterArrayEventPlanned[i]['buttons']['AND'] = true
    this.mainFilterArrayEventPlanned[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTEventPlanned(i: any) {
    this.mainFilterArrayEventPlanned[i]['buttons']['AND'] = false
    this.mainFilterArrayEventPlanned[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTEventPlanned1(i: any, j: any) {
    this.mainFilterArrayEventPlanned[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayEventPlanned[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTEventPlanned1(i: any, j: any) {
    this.mainFilterArrayEventPlanned[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayEventPlanned[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Member Level
  // mainFilterArrayMemberName = [];

  filtersMemberName = "";
  isVisibleMemberName: boolean = false;

  ClearFilterMemberName() {
    this.mainFilterArrayMemberName = [];
    this.filterMemNm = '';
    this.mainFilterArrayMemberName.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getMemberReport();
  }

  showModalMemberName() {
    this.isVisibleMemberName = true;
    this.ModelName = "Member Name Filter";
    this.model = "MEMBER_NAME";
  }

  CloseMemberName() {
    this.isVisibleMemberName = false;
  }

  CloseGroupMemberName(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayMemberName.splice(i, 1);
      return true;
    }
  }

  CloseGroupMemberName1(i: any, j: any) {
    if (this.mainFilterArrayMemberName[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayMemberName[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterMemberName() {
    if (this.mainFilterArrayMemberName.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterMemNm = "";

      for (let i = 0; i < this.mainFilterArrayMemberName.length; i++) {
        Button = " ";
        if (this.mainFilterArrayMemberName.length > 0) {
          if (this.mainFilterArrayMemberName[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayMemberName[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayMemberName.length > 0) {
          if (this.mainFilterArrayMemberName[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayMemberName[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayMemberName[i]['filter'].length; j++) {
          if (this.mainFilterArrayMemberName[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayMemberName[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayMemberName[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayMemberName[i]['filter'][j]['INPUT2'] == '')
              && (this.mainFilterArrayMemberName[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayMemberName[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayMemberName[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterArrayMemberName[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayMemberName[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterArrayMemberName[i]['buttons']['AND'] == false && this.mainFilterArrayMemberName[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayMemberName[i]['filter'].length > 0) {
                  if (this.mainFilterArrayMemberName[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";

                  }
                }
                if (this.mainFilterArrayMemberName[i]['filter'].length > 0) {
                  if (this.mainFilterArrayMemberName[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";

                  }
                }
                var condition = '';
                if (this.mainFilterArrayMemberName[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterArrayMemberName[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterArrayMemberName[i]['filter'][j]['DROPDOWN'] == "Content") {
                  if (this.mainFilterArrayMemberName[i]['filter'][j]['DROPDOWN'] == "Start With") {
                    condition = "LIKE" + " '" + this.mainFilterArrayMemberName[i]['filter'][j]['INPUT'] + "%";
                  } else if (this.mainFilterArrayMemberName[i]['filter'][j]['DROPDOWN'] == "End With") {
                    condition = "LIKE" + " '%" + this.mainFilterArrayMemberName[i]['filter'][j]['INPUT'] + "";
                  } else {
                    condition = "LIKE" + " '%" + this.mainFilterArrayMemberName[i]['filter'][j]['INPUT'] + "%";
                  }
                  this.filterMemName = Button + Button1 + ' ' + this.model + " " + condition + "'";
                } else {
                  this.filterMemName = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayMemberName[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayMemberName[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterMemNm = this.filterMemNm + this.filterMemName;
              }
        }

        this.filterMemNm = this.filterMemNm + "))";
      }

      if (isok == true) {
        console.log(this.filterMemNm);
        this.filterMemNm = ' AND ' + this.filterMemNm;
        this.getMemberReport();
        this.isVisibleMemberName = false;
      }
    }

    else {
      this.getMemberReport();
      this.isVisibleMemberName = false
    }
  }

  filterMemName = "";
  filterMemNm = '';

  AddFilterGroupMemberName() {
    this.mainFilterArrayMemberName.push({
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

  AddFilterMemberName(i: any) {
    this.mainFilterArrayMemberName[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }

  ANDBUTTONLASTMemberName(i: any) {
    this.mainFilterArrayMemberName[i]['buttons']['AND'] = true
    this.mainFilterArrayMemberName[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTMemberName(i: any) {
    this.mainFilterArrayMemberName[i]['buttons']['AND'] = false
    this.mainFilterArrayMemberName[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTMemberName1(i: any, j: any) {
    this.mainFilterArrayMemberName[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayMemberName[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTMemberName1(i: any, j: any) {
    this.mainFilterArrayMemberName[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayMemberName[i]['filter'][j]['buttons']['AND'] = false;
  }

  ScheduleTitle = '';
  ScheduleVisible: boolean = false;
  ScheduleData: REPORTSCHEDULE = new REPORTSCHEDULE();
  dataList = [];

  goToSchedule(): void {
    this.ScheduleTitle = "Member Report";
    this.ScheduleData = new REPORTSCHEDULE();
    this.ScheduleData.SCHEDULE = 'D';
    this.ScheduleData.SORT_KEY = this.sortKey;
    this.ScheduleData.SORT_VALUE = this.sortValue;
    var f_filtar = ''

    if (this.federationId != 0) {
      f_filtar = " AND FEDERATION_ID=" + this.federationId;

    } else if (this.GroupId != 0) {
      f_filtar = " AND GROUP_ID=" + this.GroupId;

    } else if (this.UnitId != 0) {
      f_filtar = " AND UNIT_ID=" + this.UnitId;
    }

    this.ScheduleData.FILTER_QUERY = this.all_filter + " AND YEAR='" + this.SelectedYear + "'" + f_filtar;
    this.ScheduleData.REPORT_ID = 10;
    this.ScheduleData.USER_ID = parseInt(this._cookie.get('userId'));

    // getschedule(IDForSearching, ) {

    this.api.getScheduledReport(this.pageIndex, this.pageSize, '', '', '' + 'AND STATUS=1 AND REPORT_ID=' + this.ScheduleData.REPORT_ID).subscribe(data => {
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

  PostCountTitle = '';

  closePostCountDrawer(): void {
    this.PostCountVisible = false;
  }

  get closeCallbackPostCount() {
    return this.closePostCountDrawer.bind(this);
  }

  PostCountVisible: boolean = false;
  DetailCount = [];

  PostCountWiseData(id: any) {
    this.PostCountVisible = true;

    this.api.getPostDetailCount(this.pageIndex, this.pageSize, "", "asc", "AND MEMBER_ID =" + id).subscribe(data => {
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

  CircularCountTitle = '';

  closeCircularCountDrawer(): void {
    this.circucountVisible = false;
  }

  get closeCallbackCircularCount() {
    return this.closeCircularCountDrawer.bind(this);
  }

  circucountVisible: boolean = false;
  CircuCount = [];

  CircuCountWiseData(id: any) {
    this.circucountVisible = true;

    this.api.getCircularDetailCount(this.pageIndex, this.pageSize, "", "asc", "AND CREATER_ID =" + id).subscribe(data => {
      if ((data['code'] == 200)) {
        this.CircuCount = data['data'];
        this.loadingRecords = false;

      } else {
        this.message.error("Server Not Found", "");
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  mainFilterArrayfednm = [];
  filtersfednm = "";
  isVisiblefednm: boolean = false;

  ClearFilterfednm() {
    this.mainFilterArrayfednm = [];
    this.filterfednm = '';
    this.mainFilterArrayfednm.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getMemberReport();
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
        this.getMemberReport();
        this.isVisiblefednm = false;
      }
    }

    else {
      this.getMemberReport();
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
  isVisiblegrpcount: boolean = false;

  ClearFiltergrpcount() {
    this.mainFilterArraygrpcount = [];
    this.filtergrpReport = '';
    this.mainFilterArraygrpcount.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getMemberReport();
  }

  showModalgrpcount() {
    this.isVisiblegrpcount = true;
    this.ModelName = "Group Name Filter";
    this.model = "GROUP_NAME";
  }

  Closegrpcount() {
    this.isVisiblegrpcount = false;
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
        this.filtergrpReport = ' AND ' + this.filtergrpReport;
        this.getMemberReport();
        this.isVisiblegrpcount = false;
      }
    }

    else {
      this.getMemberReport();
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
    this.getMemberReport();
  }

  showModalUnitcount() {
    this.isVisibleUnitCount = true;
    this.ModelName = "Unit Name Filter";
    this.model = "UNIT_NAME";
  }

  CloseUnitCount() {
    this.isVisibleUnitCount = false;
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
        this.getMemberReport();
        this.isVisibleUnitCount = false;
      }
    }

    else {
      this.getMemberReport();
      this.isVisibleUnitCount = false
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
}
