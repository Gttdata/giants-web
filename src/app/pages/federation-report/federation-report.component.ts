import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { REPORTSCHEDULE } from 'src/app/Models/reportSchedule';
import { ApiService } from 'src/app/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-federation-report',
  templateUrl: './federation-report.component.html',
  styleUrls: ['./federation-report.component.css']
})

export class FederationReportComponent implements OnInit {
  columns: string[][] = [
    ["NAME", "Federation Name"], ["UNIT_COUNT", "No of Unit "],
    ["GROUP_COUNT", "NO of Group "], ["MEMBER_COUNT", "No. Of Member"], ["TOTAL_MEETING", "No.Of Meeting"],
    ["TOTAL_POST", "No. Of Post"], ["TOTAL_EVENT", "No. Of Event"], ["PUBLISHED_CIRCULAR", "No. Of Circular"], ["TOTAL_PROJECTS", "No. Of Project"]];
  Operators: string[][] = [["Between", "Between"], ["=", "="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["<>", "!="]];
  multipleValue = [];
  Operators_name: string[][] = [["Start With", "Start With"], ["End With", "End With"], ["=", "="], ["<>", "!="], ['Content', 'Content']];
  formTitle: string = "Federation Level Report";
  a = new Date();
  b = new Date(this.a.getFullYear() + 1, 3, 1);
  size = 'default';
  YEAR: any;
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  loadingRecords = true;
  year = new Date().getFullYear();
  baseYear: number = 2020;
  range = [];
  next_year = Number(this.year + 1);
  SelectedYear: any = new Date().getFullYear();
  tagValue: string[] = ["Select All", "Federation Name", "No of Unit", "NO of Group", "No. Of Member", "No.Of Meeting", "Meeting Planned", "Meeting Conducted", "Avg. Attendence", "Meeting Time", "Avg. Meeting/day", "Avg. Meetings/Group", "No. Of Post", "Total Likes", "Total Comments", "Avg. Post/Member", "Avg. Like/Member", "Avg. Comment/Member", "No. Of Shares", "No. Of Event", "Total event Planned", "Event Conducted", "No. Of Circular", "Total Circular Created", "Published / Signed", "Avg. View/Circular", "No. Of Project", "Completed Project's", "Ongoing Project", "Total Fund Utilisation", "Avg. Fund/Project", "Avg. Projects/group"]
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
  Col14: boolean = true;
  Col15: boolean = true;
  Col16: boolean = true;
  Col17: boolean = true;
  Col18: boolean = true;
  Col19: boolean = true;
  Col20: boolean = true;
  Col21: boolean = true;
  Col22: boolean = true;
  Col24: boolean = true;
  Col25: boolean = true;
  Col26: boolean = true;
  Col28: boolean = true;
  Col29: boolean = true;
  Col30: boolean = true;
  Col31: boolean = true;
  Col32: boolean = true;
  Col33: boolean = true;
  Col34: boolean = true;
  Col35: boolean = true;
  VALUE = [];
  SelectColumn1 = [];
  filterMeetingCount = '';
  all_filter = '';
  federationId: number = Number(this._cookie.get('FEDERATION_ID'));
  UnitId: number = Number(this._cookie.get('UNIT_ID'));
  GroupId: number = Number(this._cookie.get('GROUP_ID'));

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
    this.filter = '';
    this.search();
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
    this.ForClearFilter();
  }

  GroupWiseData: any[] = [];
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

      this.api.getFederationReport(0, 0, this.sortKey, this.sortValue, "", this.SelectedYear, filters, this.federationId, this.UnitId, this.GroupId).subscribe(data => {
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
      this.api.getFederationReport(0, 0, this.sortKey, this.sortValue, "", this.SelectedYear, filters, this.federationId, this.UnitId, this.GroupId).subscribe(data => {
        if (data['code'] == 200) {
          this.GroupWiseData = data['data'];
          this.isVisiblepdf = true;
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });

    } else {
      this.loadingRecords = true;

      this.api.getFederationReport(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, "", this.SelectedYear, filters, this.federationId, this.UnitId, this.GroupId).subscribe(data => {
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

  handleCancel1(): void {
    this.isVisiblepdf = false;
  }

  importInExcel(): void {
    this.search(true, true);
  }

  importInPdf(): void {
    this.search(true, false, true);
    this.isVisiblepdf = true;
  }

  convertInExcel(): void {
    var arry1 = [];
    var obj1: any = new Object();

    for (var i = 0; i < this.dataListForExport.length; i++) {
      if (this.Col1 == true) {
        obj1['Federation Name'] = this.dataListForExport[i]['NAME'];
      }

      if (this.Col2 == true) {
        obj1['Total Unit'] = this.dataListForExport[i]['UNIT_COUNT'];
      }

      if (this.Col3 == true) {
        obj1['Total Group'] = this.dataListForExport[i]['GROUP_COUNT'];
      }

      if (this.Col4 == true) {
        obj1['Total Member'] = this.dataListForExport[i]['MEMBER_COUNT'];
      }

      if (this.Col5 == true) {
        obj1['Total Meeting '] = this.dataListForExport[i]['TOTAL_MEETING'];
      }

      if (this.Col6 == true) {
        obj1['Meeting Planned'] = this.dataListForExport[i]['MEETING_PLANNED'];
      }

      if (this.Col7 == true) {
        obj1['Meeting Conducted'] = this.dataListForExport[i]['MEETING_CONDUCTED'];
      }

      if (this.Col8 == true) {
        obj1['Avg. Attendence'] = this.dataListForExport[i]['AVG_ATTENDENCE'];
      }

      if (this.Col9 == true) {
        obj1['Meeting Time'] = this.dataListForExport[i]['MEETING_TIME'];
      }

      if (this.Col10 == true) {
        obj1['Avg. Meeting Per Day'] = this.dataListForExport[i]['AVG_MEETING_PER_DAY'];
      }

      if (this.Col11 == true) {
        obj1['Avg. Meeting Per Group'] = this.dataListForExport[i]['AVG_MEETING_PER_GROUP'];
      }

      if (this.Col12 == true) {
        obj1['Total Post'] = this.dataListForExport[i]['TOTAL_POST'];
      }

      if (this.Col13 == true) {
        obj1['Total Like'] = this.dataListForExport[i]['TOTAL_LIKE_TILL_DATE'];
      }

      if (this.Col14 == true) {
        obj1['Total Comment'] = this.dataListForExport[i]['TOTAL_COMMENT_TILL_DATE'];
      }

      if (this.Col15 == true) {
        obj1['Avg. Post Per Member'] = this.dataListForExport[i]['AVG_POST_PER_MEMBER'];
      }

      if (this.Col16 == true) {
        obj1['Avg. Like Per Member'] = this.dataListForExport[i]['AVG_LIKE_PER_MEMBER'];
      }

      if (this.Col17 == true) {
        obj1['Avg. Comment Per Member'] = this.dataListForExport[i]['AVG_COMMENT_PER_MEMBER'];
      }

      if (this.Col18 == true) {
        obj1['Number Of Shares'] = this.dataListForExport[i]['NO_OF_SHARES'];
      }

      if (this.Col19 == true) {
        obj1['Total Event'] = this.dataListForExport[i]['TOTAL_EVENT'];
      }

      if (this.Col20 == true) {
        obj1['Event Planned'] = this.dataListForExport[i]['EVENT_PLANNED'];
      }

      if (this.Col21 == true) {
        obj1['Event Conducted'] = this.dataListForExport[i]['EVENT_CONDUCTED'];
      }

      if (this.Col24 == true) {
        obj1['Total Circular'] = this.dataListForExport[i]['CIRCULAR_COUNT'];
      }

      if (this.Col25 == true) {
        obj1['Total Circular Created'] = this.dataListForExport[i]['TOTAL_CIRCULAR_CREATED'];
      }

      if (this.Col26 == true) {
        obj1['Published Circular'] = this.dataListForExport[i]['PUBLISHED_CIRCULAR'];
      }

      if (this.Col28 == true) {
        obj1['Avg View Per Circular'] = this.dataListForExport[i]['AVG_VIEW_PER_CIRCULAR'];
      }

      if (this.Col29 == true) {
        obj1['Total Project'] = this.dataListForExport[i]['TOTAL_PROJECTS'];
      }

      if (this.Col30 == true) {
        obj1['Completed Project'] = this.dataListForExport[i]['COMPLETED_PROJECTS'];
      }

      if (this.Col31 == true) {
        obj1['Ongoing Project'] = this.dataListForExport[i]['ONGOING_PROJECTS'];
      }

      if (this.Col32 == true) {
        obj1['Fund Utilised'] = this.dataListForExport[i]['FUND_UTILISED'];
      }

      if (this.Col33 == true) {
        obj1['Avg Fund Per Project'] = this.dataListForExport[i]['AVG_FUND_PER_PROJECT'];
      }

      if (this.Col34 == true) {
        obj1['Avg Project Per Group'] = this.dataListForExport[i]['AVG_PROJECT_PER_GROUP'];
      }

      arry1.push(Object.assign({}, obj1));

      if (i == this.dataListForExport.length - 1) {
        this._exportService.exportExcel(arry1, 'Federation Wise Count ' + this.datePipe.transform(new Date(), 'dd-MMM-yy, hh mm ss a'));
      }
    }
  }

  getFederation(): void {
    this.api.getFederationReport(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, "", this.SelectedYear, "", this.federationId, this.UnitId, this.GroupId).subscribe(data => {
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

    this.isVisibleMeetCount = false;
    this.isVisibleMeetConduct = false;
    this.isVisibleMeetPlanned = false;
    this.isVisibleAvgAttend = false;
    this.isVisibleMeetTime = false;
    this.isVisibleAvgMeetPerDay = false;
    this.isVisibleAvgMeetPerGroup = false;
    this.isVisiblePostCount = false;
    this.isVisibleTotalPostLikes = false;
    this.isVisibleTotalPostComment = false;
    this.isVisibleAvgPostPerMember = false;
    this.isVisibleAvgCommentPerMember = false;
    this.isVisibleAvgLikePerMember = false;
    this.isVisibleNoOfShares = false;
    this.isVisibleEventCount = false;
    this.isVisibleEventPlanned = false;
    this.isVisibleEventConducted = false;
    this.isVisibleEventTotalBeneficiaries = false;
    this.isVisibleCircularCount = false;
    this.isVisibleTotCircularCreated = false;
    this.isVisibleCircuPublished = false;
    this.isVisibleTotViews = false;
    this.isVisibleAvgViewCircu = false;
    this.isVisibleProjCount = false;
    this.isVisibleCompletedProj = false;
    this.isVisibleOnGoingProj = false;
    this.isVisibleTotFundUtilize = false;
    this.isVisibleAvgProjGroup = false;
    this.isVisibleTotalBenefic = false;
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
    this.Col14 = false;
    this.Col15 = false;
    this.Col16 = false;
    this.Col17 = false;
    this.Col18 = false;
    this.Col19 = false;
    this.Col20 = false;
    this.Col21 = false;
    this.Col22 = false;
    // this.Col23 = false;
    this.Col24 = false;
    this.Col25 = false;
    this.Col26 = false;
    // this.Col27 = false;
    this.Col28 = false;
    this.Col29 = false;
    this.Col30 = false;
    this.Col31 = false;
    this.Col32 = false;
    this.Col33 = false;
    this.Col34 = false;
    this.Col35 = false;

    for (let i = 0; i <= 34; i++) {
      if (this.tagValue[i] == "Federation Name") { this.Col1 = true; }
      if (this.tagValue[i] == "No of Unit") { this.Col2 = true; }
      if (this.tagValue[i] == "NO of Group") { this.Col3 = true; }
      if (this.tagValue[i] == "No. Of Member") { this.Col4 = true; }
      if (this.tagValue[i] == "No.Of Meeting") { this.Col5 = true; }
      if (this.tagValue[i] == "Meeting Planned") { this.Col6 = true; }
      if (this.tagValue[i] == "Meeting Conducted") { this.Col7 = true; }
      if (this.tagValue[i] == "Avg. Attendence") { this.Col8 = true; }
      if (this.tagValue[i] == "Meeting Time") { this.Col9 = true; }
      if (this.tagValue[i] == "Avg. Meeting/day") { this.Col10 = true; }
      if (this.tagValue[i] == "Avg. Meetings/Group") { this.Col11 = true; }
      if (this.tagValue[i] == "No. Of Post") { this.Col12 = true; }
      if (this.tagValue[i] == "Total Likes") { this.Col13 = true; }
      if (this.tagValue[i] == "Total Comments") { this.Col14 = true; }
      if (this.tagValue[i] == "Avg. Post/Member") { this.Col15 = true; }
      if (this.tagValue[i] == "Avg. Like/Member") { this.Col16 = true; }
      if (this.tagValue[i] == "Avg. Comment/Member") { this.Col17 = true; }
      if (this.tagValue[i] == "No. Of Shares") { this.Col18 = true; }
      if (this.tagValue[i] == "No. Of Event") { this.Col19 = true; }
      if (this.tagValue[i] == "Total event Planned") { this.Col20 = true; }
      if (this.tagValue[i] == "Event Conducted") { this.Col21 = true; }
      // if (this.tagValue[i] == "Total benificieries") { this.Col22 = true; }
      // if (this.tagValue[i] == "Top Types") { this.Col23 = true; }
      if (this.tagValue[i] == "No. Of Circular") { this.Col24 = true; }
      if (this.tagValue[i] == "Total Circular Created") { this.Col25 = true; }
      if (this.tagValue[i] == "Published / Signed") { this.Col26 = true; }
      // if (this.tagValue[i] == "Total View's") { this.Col27 = true; }
      if (this.tagValue[i] == "Avg. View/Circular") { this.Col28 = true; }
      if (this.tagValue[i] == "No. Of Project") { this.Col29 = true; }
      if (this.tagValue[i] == "Completed Project's") { this.Col30 = true; }
      if (this.tagValue[i] == "Ongoing Project") { this.Col31 = true; }
      if (this.tagValue[i] == "Total Fund Utilisation") { this.Col32 = true; }
      if (this.tagValue[i] == "Avg. Fund/Project") { this.Col33 = true; }
      if (this.tagValue[i] == "Avg. Projects/group") { this.Col34 = true; }
      // if (this.tagValue[i] == "Total Benificieries") { this.Col35 = true; }
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
      this.Col11 = true;
      this.Col12 = true;
      this.Col13 = true;
      this.Col14 = true;
      this.Col15 = true;
      this.Col16 = true;
      this.Col17 = true;
      this.Col18 = true;
      this.Col19 = true;
      this.Col20 = true;
      this.Col21 = true;
      this.Col22 = true;
      // this.Col23 = true;
      this.Col24 = true;
      this.Col25 = true;
      this.Col26 = true;
      // this.Col27 = true;
      this.Col28 = true;
      this.Col29 = true;
      this.Col30 = true;
      this.Col31 = true;
      this.Col32 = true;
      this.Col33 = true;
      this.Col34 = true;
      this.Col35 = true;
    }
  }

  value: string[] = ['0-0-0'];
  nodes = [{
    title: 'Select All', value: 'Select All', key: 'Select All',
    children: [
      {
        title: 'No.Of Meeting',
        value: 'No.Of Meeting',
        key: 'No.Of Meeting',
        isLeaf: true
      },
      {
        title: 'Meeting Planned',
        value: 'Meeting Planned',
        key: 'Meeting Planned',
        isLeaf: true
      },
      {
        title: 'Meeting Conducted',
        value: 'Meeting Conducted',
        key: 'Meeting Conducted',
        isLeaf: true
      },
      {
        title: 'Avg. Attendence',
        value: 'Avg. Attendence',
        key: 'Avg. Attendence',
        isLeaf: true
      },
      {
        title: 'Meeting Time',
        value: 'Meeting Time',
        key: 'Meeting Time',
        isLeaf: true
      },
      {
        title: 'Avg. Meeting/day',
        value: 'Avg. Meeting/day',
        key: 'Avg. Meeting/day',
        isLeaf: true
      },
      {
        title: 'Avg. Meetings/Group',
        value: 'Avg. Meetings/Group',
        key: 'Avg. Meetings/Group',
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
      {
        title: 'Avg. Post/Member',
        value: 'Avg. Post/Member',
        key: 'Avg. Post/Member',
        isLeaf: true
      },
      {
        title: 'Avg. Like/Member',
        value: 'Avg. Like/Member',
        key: 'Avg. Like/Member',
        isLeaf: true
      },
      {
        title: 'Avg. Comment/Member',
        value: 'Avg. Comment/Member',
        key: 'Avg. Comment/Member',
        isLeaf: true
      },
      {
        title: 'No. Of Shares',
        value: 'No. Of Shares',
        key: 'No. Of Shares',
        isLeaf: true
      },
      {
        title: 'No. Of Event',
        value: 'No. Of Event',
        key: 'No. Of Event',
        isLeaf: true
      },
      {
        title: 'Total event Planned',
        value: 'Total event Planned',
        key: 'Total event Planned',
        isLeaf: true
      },
      {
        title: 'Event Conducted',
        value: 'Event Conducted',
        key: 'Event Conducted',
        isLeaf: true
      },
      // {
      //   title: 'Total benificieries',
      //   value: 'Total benificieries',
      //   key: 'Total benificieries',
      //   isLeaf: true
      // },
      // {
      //   title: 'Top Types',
      //   value: 'Top Types',
      //   key: 'Top Types',
      //   isLeaf: true
      // },
      {
        title: 'No. Of Circular',
        value: 'No. Of Circular',
        key: 'No. Of Circular',
        isLeaf: true
      },
      {
        title: 'Total Circular Created',
        value: 'Total Circular Created',
        key: 'Total Circular Created',
        isLeaf: true
      },
      {
        title: 'Published / Signed',
        value: 'Published / Signed',
        key: 'Published / Signed',
        isLeaf: true
      },
      // {
      //   title: "Total View's",
      //   value: "Total View's",
      //   key: "Total View's",
      //   isLeaf: true
      // },
      {
        title: 'Avg. View/Circular',
        value: 'Avg. View/Circular',
        key: 'Avg. View/Circular',
        isLeaf: true
      },
      {
        title: 'No. Of Project',
        value: 'No. Of Project',
        key: 'No. Of Project',
        isLeaf: true
      },
      {
        title: "Completed Project's",
        value: "Completed Project's",
        key: "Completed Project's",
        isLeaf: true
      },
      {
        title: 'Ongoing Project',
        value: 'Ongoing Project',
        key: 'Ongoing Project',
        isLeaf: true
      },
      {
        title: 'Total Fund Utilisation',
        value: 'Total Fund Utilisation',
        key: 'Total Fund Utilisation',
        isLeaf: true
      },
      {
        title: 'Avg. Fund/Project',
        value: 'Avg. Fund/Project',
        key: 'Avg. Fund/Project',
        isLeaf: true
      },
      {
        title: 'Avg. Projects/group',
        value: 'Avg. Projects/group',
        key: 'Avg. Projects/group',
        isLeaf: true
      },
      // {
      //   title: 'Total Benificieries',
      //   value: 'Total Benificieries',
      //   key: 'Total Benificieries',
      //   isLeaf: true
      // }
    ]
  }
  ];

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }

  getFederationReport(): void {
    this.loadingRecords = true;

    if (this.filtermemCount == '))') { this.filtermemCount = ''; }
    if (this.filtergrpReport == '))') { this.filtergrpReport = ''; }
    if (this.filterUnitCount == '))') { this.filterUnitCount = ''; }
    if (this.filterfednm == '))') { this.filterfednm = '' }
    if (this.filterMeetingCount == '))') { this.filterMeetingCount = ''; }
    if (this.ApplyfilterPost == '))') { this.ApplyfilterPost = ''; }
    if (this.ApplyfilterEvent == '))') { this.ApplyfilterEvent = '' }
    if (this.filterCircular == '))') { this.filterCircular = ''; }
    if (this.filterProjcoun == '))') { this.filterProjcoun = ''; }
    if (this.filterMeetPlan == '))') { this.filterMeetPlan = ''; }
    if (this.filterMeetCond == '))') { this.filterMeetCond = ''; }
    if (this.filterAvgAttendence == '))') { this.filterAvgAttendence = ''; }
    if (this.filterMeetPerDay == '))') { this.filterMeetPerDay = ''; }
    if (this.filterMeetpergrp == '))') { this.filterMeetpergrp = ''; }
    if (this.filterPostLike == '))') { this.filterPostLike = ''; }
    if (this.filterPostComm == '))') { this.filterPostComm = ''; }
    if (this.filterPostPerMem == '))') { this.filterPostPerMem = '' }
    if (this.filterlikeperMem == '))') { this.filterlikeperMem = '' }
    if (this.filterCommentPerMem == '))') { this.filterCommentPerMem = ''; }
    if (this.filterShares == '))') { this.filterShares = ''; }
    if (this.filterEventPlan == '))') { this.filterEventPlan = ''; }
    if (this.filterEventConduct == '))') { this.filterEventConduct = ''; }
    if (this.filterTotBenefi == '))') { this.filterTotBenefi = ''; }
    if (this.filterTotCircCreate == '))') { this.filterTotCircCreate = '' }
    if (this.filterCircPubl == '))') { this.filterCircPubl = ''; }
    if (this.filterTView == '))') { this.filterTView = ''; }
    if (this.filterCompProj == '))') { this.filterCompProj = ''; }
    if (this.filterOnGoProj == '))') { this.filterOnGoProj = ''; }
    if (this.filterFundUtil == '))') { this.filterFundUtil = ''; }
    if (this.filterFundProj == '))') { this.filterFundProj = ''; }
    if (this.filterAvgProGrp == '))') { this.filterAvgProGrp = ''; }
    if (this.filtertotBenef == '))') { this.filtertotBenef = ''; }
    if (this.filterViewCir == '))') { this.filterViewCir = ''; }
    if (this.filterMeetTimming == '))') { this.filterMeetTimming = '' }

    this.all_filter = this.filterMeetingCount + this.ApplyfilterPost + this.ApplyfilterEvent + this.filterCircular +
      this.filterProjcoun + this.filterMeetPlan + this.filterMeetCond + this.filterAvgAttendence + this.filterMeetPerDay +
      this.filterMeetpergrp + this.filterPostLike + this.filterPostComm + this.filterPostPerMem + this.filterlikeperMem +
      this.filterCommentPerMem + this.filterShares + this.filterEventPlan + this.filterEventConduct + this.filterTotBenefi +
      this.filterTotCircCreate + this.filterCircPubl + this.filterTView + this.filterCompProj + this.filterOnGoProj +
      this.filterFundUtil + this.filterFundProj + this.filterAvgProGrp + this.filtertotBenef + this.filterViewCir +
      this.filterMeetTimming + this.filterfednm + this.filterUnitCount + this.filtergrpReport + this.filtermemCount;

    this.api.getFederationReport(this.pageIndex, this.pageSize, "NAME", "asc", "", this.SelectedYear, this.all_filter, this.federationId, this.UnitId, this.GroupId).subscribe(data => {
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

  isVisibleMeetCount: boolean = false;
  isVisiblePostCount: boolean = false;
  isVisibleEventCount: boolean = false;
  isVisibleCircularCount: boolean = false;
  isVisibleProjCount: boolean = false;
  ModelName: string = "";

  showModalMeetCount(): void {
    this.isVisibleMeetCount = true;
    this.ModelName = "Meeting Count Filter";
    this.model = "TOTAL_MEETING";
  }

  CloseMeetCount(): void {
    this.isVisibleMeetCount = false;
  }

  showModalPostCount(): void {
    this.isVisiblePostCount = true;
    this.ModelName = "Post Count Filter";
    this.model = "TOTAL_POST";
  }

  ClosePostCount(): void {
    this.isVisiblePostCount = false;
  }

  showModalEventCount(): void {
    this.isVisibleEventCount = true;
    this.ModelName = "Event Count Filter";
    this.model = "TOTAL_EVENT"
  }

  CloseEventCount(): void {
    this.isVisibleEventCount = false;
  }

  showModalCircularCount(): void {
    this.isVisibleCircularCount = true;
    this.ModelName = "Circular Count Filter";
    this.model = "CIRCULAR_COUNT";
  }

  CloseCircularCount(): void {
    this.isVisibleCircularCount = false;
  }

  showModalProjCount(): void {
    this.isVisibleProjCount = true;
    this.ModelName = "Project Count Filter";
    this.model = "TOTAL_PROJECTS";
  }

  CloseProjectCount(): void {
    this.isVisibleProjCount = false;
  }

  model = '';
  mainFilterArrayPost = [];
  mainFilterArrayEvent = [];
  mainFilterArrayCircular = [];
  mainFilterArrayProject = [];
  mainFilterArrayMeet = []

  ClearFilterMeetCount(): void {
    this.mainFilterArrayMeet = [];
    this.filterMeetingCount = '';
    this.mainFilterArrayMeet.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }

  ANDBUTTONLASTMeetCount(i: any) {
    this.mainFilterArrayMeet[i]['buttons']['AND'] = true;
    this.mainFilterArrayMeet[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTMeetCount(i: any) {
    this.mainFilterArrayMeet[i]['buttons']['AND'] = false;
    this.mainFilterArrayMeet[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTMeetCount1(i: any, j: any) {
    this.mainFilterArrayMeet[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterArrayMeet[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTMeetCount1(i: any, j: any) {
    this.mainFilterArrayMeet[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterArrayMeet[i]['filter'][j]['buttons']['AND'] = false;
  }

  secondButton = "";
  PushFilterMeetCount = [];
  filterMeetCount1 = "";
  ClickAddFilter1: boolean = false;

  CloseGroupMeetCount(i: any): boolean {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayMeet.splice(i, 1);
      return true;
    }
  }

  CloseGroupMeetCount1(i: any, j: any): boolean {
    if (this.mainFilterArrayMeet[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayMeet[i]['filter'].splice(j, 1);
      return true;
    }
  }

  filter = '';
  filtersMeetingCount = '';
  filtersPostCount = '';
  filtersEventCount = '';
  filtersCircularCount = '';
  filtersProjectCount = '';

  ApplyFilterMeetCount() {
    if (this.mainFilterArrayMeet.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterMeetingCount = '';

      for (let i = 0; i < this.mainFilterArrayMeet.length; i++) {
        Button = "";

        if (this.mainFilterArrayMeet.length > 0) {
          if (this.mainFilterArrayMeet[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayMeet[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayMeet.length > 0) {
          if (this.mainFilterArrayMeet[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayMeet[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayMeet[i]['filter'].length; j++) {
          if (this.mainFilterArrayMeet[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayMeet[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterArrayMeet[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayMeet[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayMeet[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterArrayMeet[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayMeet[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterArrayMeet[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayMeet[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterArrayMeet[i]['buttons']['AND'] == false && this.mainFilterArrayMeet[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterArrayMeet[i]['filter'].length > 0) {
                  if (this.mainFilterArrayMeet[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = "";

                  }
                }

                if (this.mainFilterArrayMeet[i]['filter'].length > 0) {
                  if (this.mainFilterArrayMeet[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = "";

                  }
                }

                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayMeet[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");
                  this.filtersMeetingCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayMeet[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayMeet[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayMeet[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersMeetingCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayMeet[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayMeet[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterMeetingCount = this.filterMeetingCount + this.filtersMeetingCount;
              }
        }

        this.filterMeetingCount = this.filterMeetingCount + "))";
      }

      if (isok == true) {
        this.filterMeetingCount = ' AND ' + this.filterMeetingCount;
        this.getFederationReport();
        this.isVisibleMeetCount = false;
      }
    }

    else {
      this.getFederationReport();
      this.isVisibleMeetCount = false
    }
  }

  AddFilterGroupMeetCount() {
    this.mainFilterArrayMeet.push({
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

  PushFilterMeeting: any[] = [];

  AddFilterMeetCount(i: any) {
    this.mainFilterArrayMeet[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  ApplyfilterPost = '';

  ClearFilterPostCount() {
    this.mainFilterArrayPost = [];
    this.ApplyfilterPost = '';
    this.mainFilterArrayPost.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }

  CloseGroupPostCount(i: any): boolean {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayPost.splice(i, 1);
      return true;
    }
  }

  CloseGroupPostCount1(i: any, j: any): boolean {
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
      this.filter = "";
      this.ApplyfilterPost = '';

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

                this.ApplyfilterPost = this.ApplyfilterPost + this.filtersPostCount;
              }
        }

        this.ApplyfilterPost = this.ApplyfilterPost + "))";
      }

      if (isok == true) {
        this.ApplyfilterPost = ' AND ' + this.ApplyfilterPost;
        this.getFederationReport();
        this.isVisiblePostCount = false;
      }

    } else {
      this.getFederationReport();
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
    this.mainFilterArrayPost[i]['buttons']['AND'] = true;
    this.mainFilterArrayPost[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTPostCount(i: any) {
    this.mainFilterArrayPost[i]['buttons']['AND'] = false;
    this.mainFilterArrayPost[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTPostCount1(i: any, j: any) {
    this.mainFilterArrayPost[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterArrayPost[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTPostCount1(i: any, j: any) {
    this.mainFilterArrayPost[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterArrayPost[i]['filter'][j]['buttons']['AND'] = false;
  }

  // event
  ClearFilterEventCount() {
    this.mainFilterArrayEvent = [];
    this.ApplyfilterEvent = '';
    this.mainFilterArrayEvent.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }

  CloseGroupEventCount(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayEvent.splice(i, 1);
      return true;
    }
  }

  CloseGroupEventCount1(i: any, j: any) {
    if (this.mainFilterArrayEvent[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayEvent[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterEventCount() {
    if (this.mainFilterArrayEvent.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.ApplyfilterEvent = "";

      for (let i = 0; i < this.mainFilterArrayEvent.length; i++) {
        Button = " ";

        if (this.mainFilterArrayEvent.length > 0) {
          if (this.mainFilterArrayEvent[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayEvent[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayEvent.length > 0) {
          if (this.mainFilterArrayEvent[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayEvent[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayEvent[i]['filter'].length; j++) {
          if (this.mainFilterArrayEvent[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayEvent[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterArrayEvent[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayEvent[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayEvent[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterArrayEvent[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayEvent[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterArrayEvent[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayEvent[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterArrayEvent[i]['buttons']['AND'] == false && this.mainFilterArrayEvent[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterArrayEvent[i]['filter'].length > 0) {
                  if (this.mainFilterArrayEvent[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterArrayEvent[i]['filter'].length > 0) {
                  if (this.mainFilterArrayEvent[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayEvent[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");
                  this.filtersEventCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayEvent[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayEvent[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayEvent[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersEventCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayEvent[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayEvent[i]['filter'][j]['INPUT'] + "'";
                }

                this.ApplyfilterEvent = this.ApplyfilterEvent + this.filtersEventCount;
              }
        }

        this.ApplyfilterEvent = this.ApplyfilterEvent + "))";
      }

      if (isok == true) {
        this.ApplyfilterEvent = ' AND ' + this.ApplyfilterEvent;
        this.getFederationReport();
        this.isVisibleEventCount = false;
      }
    }

    else {
      this.getFederationReport();
      this.isVisibleEventCount = false
    }
  }

  ApplyfilterEvent = '';

  AddFilterGroupEventCount() {
    this.mainFilterArrayEvent.push({
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

  AddFilterEventCount(i: any) {
    this.mainFilterArrayEvent[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }

  ANDBUTTONLASTEventCount(i: any) {
    this.mainFilterArrayEvent[i]['buttons']['AND'] = true;
    this.mainFilterArrayEvent[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTEventCount(i: any) {
    this.mainFilterArrayEvent[i]['buttons']['AND'] = false;
    this.mainFilterArrayEvent[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTEventCount1(i: any, j: any) {
    this.mainFilterArrayEvent[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterArrayEvent[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTEventCount1(i: any, j: any) {
    this.mainFilterArrayEvent[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterArrayEvent[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Circular
  ClearFilterCircularCount() {
    this.mainFilterArrayCircular = [];
    this.filterCircular = '';
    this.mainFilterArrayCircular.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
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
      this.filter = "";
      this.filterCircular = '';

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

                this.filterCircular = this.filterCircular + this.filtersCircularCount;
              }
        }

        this.filterCircular = this.filterCircular + "))";
      }

      if (isok == true) {
        this.filterCircular = ' AND ' + this.filterCircular;
        this.getFederationReport();
        this.isVisibleCircularCount = false;
      }
    }

    else {
      this.getFederationReport();
      this.isVisibleCircularCount = false
    }
  }

  filterCircular = '';

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
    this.mainFilterArrayCircular[i]['buttons']['AND'] = true;
    this.mainFilterArrayCircular[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTCircularCount(i: any) {
    this.mainFilterArrayCircular[i]['buttons']['AND'] = false;
    this.mainFilterArrayCircular[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTCircularCount1(i: any, j: any) {
    this.mainFilterArrayCircular[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterArrayCircular[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTCircularCount1(i: any, j: any) {
    this.mainFilterArrayCircular[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterArrayCircular[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Project
  ClearFilterProjectCount() {
    this.mainFilterArrayProject = [];
    this.filterProjcoun = '';
    this.mainFilterArrayProject.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }

  CloseGroupProjectCount(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayProject.splice(i, 1);
      return true;
    }
  }

  CloseGroupProjectCount1(i: any, j: any) {
    if (this.mainFilterArrayProject[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayProject[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterProjectCount() {
    if (this.mainFilterArrayProject.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterProjcoun = '';

      for (let i = 0; i < this.mainFilterArrayProject.length; i++) {
        Button = " ";
        if (this.mainFilterArrayProject.length > 0) {
          if (this.mainFilterArrayProject[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayProject[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayProject.length > 0) {
          if (this.mainFilterArrayProject[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayProject[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayProject[i]['filter'].length; j++) {
          if (this.mainFilterArrayProject[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayProject[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterArrayProject[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayProject[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayProject[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterArrayProject[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayProject[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterArrayProject[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayProject[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterArrayProject[i]['buttons']['AND'] == false && this.mainFilterArrayProject[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterArrayProject[i]['filter'].length > 0) {
                  if (this.mainFilterArrayProject[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterArrayProject[i]['filter'].length > 0) {
                  if (this.mainFilterArrayProject[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayProject[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");
                  this.filtersProjectCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayProject[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayProject[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayProject[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersProjectCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayProject[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayProject[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterProjcoun = this.filterProjcoun + this.filtersProjectCount;
              }
        }

        this.filterProjcoun = this.filterProjcoun + "))";
      }

      if (isok == true) {
        console.log(this.filter);
        this.filterProjcoun = ' AND ' + this.filterProjcoun;
        this.getFederationReport();
        this.isVisibleProjCount = false;
      }
    }

    else {
      this.getFederationReport();
      this.isVisibleProjCount = false;
    }
  }

  filterProjcoun = '';

  AddFilterGroupProjectCount() {
    this.mainFilterArrayProject.push({
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

  AddFilterProjectCount(i: any) {
    this.mainFilterArrayProject[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  ANDBUTTONLASTProjectCount(i: any) {
    this.mainFilterArrayProject[i]['buttons']['AND'] = true;
    this.mainFilterArrayProject[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTProjectCount(i: any) {
    this.mainFilterArrayProject[i]['buttons']['AND'] = false;
    this.mainFilterArrayProject[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTProjectCount1(i: any, j: any) {
    this.mainFilterArrayProject[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterArrayProject[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTProjectCount1(i: any, j: any) {
    this.mainFilterArrayProject[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterArrayProject[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Meeting Planned
  mainFilterArrayMeetPlanned = [];
  filtersMeetPlanned = "";
  isVisibleMeetPlanned = false;

  ClearFilterMeetPlanned() {
    this.mainFilterArrayMeetPlanned = [];
    this.filterMeetPlan = '';
    this.mainFilterArrayMeetPlanned.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
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
      this.filter = "";
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
        this.filterMeetPlan = ' AND ' + this.filterMeetPlan;
        this.getFederationReport();
        this.isVisibleMeetPlanned = false;
      }
    }

    else {
      this.getFederationReport();
      this.isVisibleMeetPlanned = false
    }
  }

  filterMeetPlan = '';

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
    this.mainFilterArrayMeetPlanned[i]['buttons']['AND'] = true;
    this.mainFilterArrayMeetPlanned[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTMeetPlanned(i: any) {
    this.mainFilterArrayMeetPlanned[i]['buttons']['AND'] = false;
    this.mainFilterArrayMeetPlanned[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTMeetPlanned1(i: any, j: any) {
    this.mainFilterArrayMeetPlanned[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterArrayMeetPlanned[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTMeetPlanned1(i: any, j: any) {
    this.mainFilterArrayMeetPlanned[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterArrayMeetPlanned[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Meeting Conducted
  mainFilterArrayMeetConduct = [];
  filtersMeetConduct = "";
  isVisibleMeetConduct = false;

  ClearFilterMeetConduct() {
    this.mainFilterArrayMeetConduct = [];
    this.filterMeetCond = '';
    this.mainFilterArrayMeetConduct.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }

  showModalMeetConduct() {
    this.isVisibleMeetConduct = true;
    this.ModelName = "Meeting Conducted Filter";
    this.model = "MEETING_CONDUCTED";
  }

  CloseMeetConduct() {
    this.isVisibleMeetConduct = false;
  }

  CloseGroupMeetConduct(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayMeetConduct.splice(i, 1);
      return true;
    }
  }

  CloseGroupMeetConduct1(i: any, j: any) {
    if (this.mainFilterArrayMeetConduct[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayMeetConduct[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterMeetConduct() {
    if (this.mainFilterArrayMeetConduct.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterMeetCond = '';

      for (let i = 0; i < this.mainFilterArrayMeetConduct.length; i++) {
        Button = " ";

        if (this.mainFilterArrayMeetConduct.length > 0) {
          if (this.mainFilterArrayMeetConduct[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayMeetConduct[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayMeetConduct.length > 0) {
          if (this.mainFilterArrayMeetConduct[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayMeetConduct[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayMeetConduct[i]['filter'].length; j++) {
          if (this.mainFilterArrayMeetConduct[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayMeetConduct[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterArrayMeetConduct[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayMeetConduct[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayMeetConduct[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterArrayMeetConduct[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayMeetConduct[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterArrayMeetConduct[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayMeetConduct[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterArrayMeetConduct[i]['buttons']['AND'] == false && this.mainFilterArrayMeetConduct[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterArrayMeetConduct[i]['filter'].length > 0) {
                  if (this.mainFilterArrayMeetConduct[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterArrayMeetConduct[i]['filter'].length > 0) {
                  if (this.mainFilterArrayMeetConduct[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayMeetConduct[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");
                  this.filtersMeetConduct = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayMeetConduct[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayMeetConduct[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayMeetConduct[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersMeetConduct = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayMeetConduct[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayMeetConduct[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterMeetCond = this.filterMeetCond + this.filtersMeetConduct;
              }
        }

        this.filterMeetCond = this.filterMeetCond + "))";
      }

      if (isok == true) {
        this.filterMeetCond = ' AND ' + this.filterMeetCond;
        this.getFederationReport();
        this.isVisibleMeetConduct = false;
      }
    }

    else {
      this.getFederationReport();
      this.isVisibleMeetConduct = false
    }
  }

  filterMeetCond = "";

  AddFilterGroupMeetConduct() {
    this.mainFilterArrayMeetConduct.push({
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

  AddFilterMeetConduct(i: any) {
    this.mainFilterArrayMeetConduct[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  ANDBUTTONLASTMeetConduct(i: any) {
    this.mainFilterArrayMeetConduct[i]['buttons']['AND'] = true;
    this.mainFilterArrayMeetConduct[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTMeetConduct(i: any) {
    this.mainFilterArrayMeetConduct[i]['buttons']['AND'] = false;
    this.mainFilterArrayMeetConduct[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTMeetConduct1(i: any, j: any) {
    this.mainFilterArrayMeetConduct[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayMeetConduct[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTMeetConduct1(i: any, j: any) {
    this.mainFilterArrayMeetConduct[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayMeetConduct[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Average Attendence
  mainFilterArrayAvgAttend = [];
  filtersAvgAttend = "";
  isVisibleAvgAttend = false;

  ClearFilterAvgAttend() {
    this.mainFilterArrayAvgAttend = [];
    this.filterAvgAttendence = '';
    this.mainFilterArrayAvgAttend.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }

  showModalAvgAttend() {
    this.isVisibleAvgAttend = true;
    this.ModelName = "Avg Attendence Filter";
    this.model = "AVG_ATTENDENCE";
  }

  CloseAvgAttend() {
    this.isVisibleAvgAttend = false;
  }

  CloseGroupAvgAttend(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterArrayAvgAttend.splice(i, 1);
      return true;
    }
  }

  CloseGroupAvgAttend1(i: any, j: any) {
    if (this.mainFilterArrayAvgAttend[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayAvgAttend[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterAvgAttend() {
    if (this.mainFilterArrayAvgAttend.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterAvgAttendence = '';

      for (let i = 0; i < this.mainFilterArrayAvgAttend.length; i++) {
        Button = " ";
        if (this.mainFilterArrayAvgAttend.length > 0) {
          if (this.mainFilterArrayAvgAttend[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayAvgAttend[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayAvgAttend.length > 0) {
          if (this.mainFilterArrayAvgAttend[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayAvgAttend[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayAvgAttend[i]['filter'].length; j++) {
          if (this.mainFilterArrayAvgAttend[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayAvgAttend[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterArrayAvgAttend[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayAvgAttend[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayAvgAttend[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterArrayAvgAttend[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayAvgAttend[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterArrayAvgAttend[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayAvgAttend[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterArrayAvgAttend[i]['buttons']['AND'] == false && this.mainFilterArrayAvgAttend[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";
                if (this.mainFilterArrayAvgAttend[i]['filter'].length > 0) {
                  if (this.mainFilterArrayAvgAttend[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterArrayAvgAttend[i]['filter'].length > 0) {
                  if (this.mainFilterArrayAvgAttend[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayAvgAttend[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");
                  this.filtersAvgAttend = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayAvgAttend[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayAvgAttend[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayAvgAttend[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersAvgAttend = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayAvgAttend[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayAvgAttend[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterAvgAttendence = this.filterAvgAttendence + this.filtersAvgAttend;
              }
        }

        this.filterAvgAttendence = this.filterAvgAttendence + "))";
      }

      if (isok == true) {
        this.filterAvgAttendence = ' AND ' + this.filterAvgAttendence;
        this.getFederationReport();
        this.isVisibleAvgAttend = false;
      }
    }

    else {
      this.getFederationReport();
      this.isVisibleAvgAttend = false
    }
  }

  filterAvgAttendence = '';

  AddFilterGroupAvgAttend() {
    this.mainFilterArrayAvgAttend.push({
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

  AddFilterAvgAttend(i: any) {
    this.mainFilterArrayAvgAttend[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  ANDBUTTONLASTAvgAttend(i: any) {
    this.mainFilterArrayAvgAttend[i]['buttons']['AND'] = true;
    this.mainFilterArrayAvgAttend[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTAvgAttend(i: any) {
    this.mainFilterArrayAvgAttend[i]['buttons']['AND'] = false;
    this.mainFilterArrayAvgAttend[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTAvgAttend1(i: any, j: any) {
    this.mainFilterArrayAvgAttend[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterArrayAvgAttend[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTAvgAttend1(i: any, j: any) {
    this.mainFilterArrayAvgAttend[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterArrayAvgAttend[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Average meeting Per Day
  mainFilterArrayAvgMeetPerDay = [];
  filtersAvgMeetPerDay = "";
  isVisibleAvgMeetPerDay = false;

  ClearFilterMeetPerDay() {
    this.mainFilterArrayAvgMeetPerDay = [];
    this.filterMeetPerDay = '';
    this.mainFilterArrayAvgMeetPerDay.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }

  showModalAvgMeetPerDay() {
    this.isVisibleAvgMeetPerDay = true;
    this.ModelName = "Avg Meeting Per Day Filter";
    this.model = "AVG_MEETING_PER_DAY";
  }

  CloseAvgMeetPerDay() {
    this.isVisibleAvgMeetPerDay = false;
  }

  CloseGroupAvgMeetPerDay(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayAvgMeetPerDay.splice(i, 1);
      return true;
    }
  }

  CloseGroupAvgMeetPerDay1(i: any, j: any) {
    if (this.mainFilterArrayAvgMeetPerDay[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayAvgMeetPerDay[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterAvgMeetPerDay() {
    if (this.mainFilterArrayAvgMeetPerDay.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterMeetPerDay = '';

      for (let i = 0; i < this.mainFilterArrayAvgMeetPerDay.length; i++) {
        Button = " ";

        if (this.mainFilterArrayAvgMeetPerDay.length > 0) {
          if (this.mainFilterArrayAvgMeetPerDay[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayAvgMeetPerDay[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayAvgMeetPerDay.length > 0) {
          if (this.mainFilterArrayAvgMeetPerDay[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayAvgMeetPerDay[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayAvgMeetPerDay[i]['filter'].length; j++) {
          if (this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterArrayAvgMeetPerDay[i]['buttons']['AND'] == false && this.mainFilterArrayAvgMeetPerDay[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterArrayAvgMeetPerDay[i]['filter'].length > 0) {
                  if (this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterArrayAvgMeetPerDay[i]['filter'].length > 0) {
                  if (this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");
                  this.filtersAvgMeetPerDay = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersAvgMeetPerDay = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterMeetPerDay = this.filterMeetPerDay + this.filtersAvgMeetPerDay;
              }
        }

        this.filterMeetPerDay = this.filterMeetPerDay + "))";
      }

      if (isok == true) {
        this.filterMeetPerDay = ' AND ' + this.filterMeetPerDay;
        this.getFederationReport();
        this.isVisibleAvgMeetPerDay = false;
      }
    }

    else {
      this.getFederationReport();
      this.isVisibleAvgMeetPerDay = false;
    }
  }

  filterMeetPerDay = '';

  AddFilterGroupAvgMeetPerDay() {
    this.mainFilterArrayAvgMeetPerDay.push({
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

  AddFilterAvgMeetPerDay(i: any) {
    this.mainFilterArrayAvgMeetPerDay[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  ANDBUTTONLASTAvgMeetPerDay(i: any) {
    this.mainFilterArrayAvgMeetPerDay[i]['buttons']['AND'] = true;
    this.mainFilterArrayAvgMeetPerDay[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTAvgMeetPerDay(i: any) {
    this.mainFilterArrayAvgMeetPerDay[i]['buttons']['AND'] = false;
    this.mainFilterArrayAvgMeetPerDay[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTAvgMeetPerDay1(i: any, j: any) {
    this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTAvgMeetPerDay1(i: any, j: any) {
    this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterArrayAvgMeetPerDay[i]['filter'][j]['buttons']['AND'] = false;
  }

  //  Average Meeting Per Group 
  mainFilterArrayAvgMeetPerGroup = [];
  filtersAvgMeetPerGroup = "";
  isVisibleAvgMeetPerGroup = false;

  ClearFilterAvgMeetPerGroup() {
    this.mainFilterArrayAvgMeetPerGroup = [];
    this.filterMeetpergrp = '';
    this.mainFilterArrayAvgMeetPerGroup.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }

  showModalAvgMeetPerGroup() {
    this.isVisibleAvgMeetPerGroup = true;
    this.ModelName = "Avg Meeting Per Group Filter";
    this.model = "AVG_MEETING_PER_GROUP";
  }

  CloseAvgMeetPerGroup() {
    this.isVisibleAvgMeetPerGroup = false;
  }

  CloseGroupAvgMeetPerGroup(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayAvgMeetPerGroup.splice(i, 1);
      return true;
    }
  }

  CloseGroupAvgMeetPerGroup1(i: any, j: any) {
    if (this.mainFilterArrayAvgMeetPerGroup[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayAvgMeetPerGroup[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterAvgMeetPerGroup() {
    if (this.mainFilterArrayAvgMeetPerGroup.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterMeetpergrp = '';

      for (let i = 0; i < this.mainFilterArrayAvgMeetPerGroup.length; i++) {
        Button = " ";

        if (this.mainFilterArrayAvgMeetPerGroup.length > 0) {
          if (this.mainFilterArrayAvgMeetPerGroup[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayAvgMeetPerGroup[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayAvgMeetPerGroup.length > 0) {
          if (this.mainFilterArrayAvgMeetPerGroup[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayAvgMeetPerGroup[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayAvgMeetPerGroup[i]['filter'].length; j++) {
          if (this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterArrayAvgMeetPerGroup[i]['buttons']['AND'] == false && this.mainFilterArrayAvgMeetPerGroup[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterArrayAvgMeetPerGroup[i]['filter'].length > 0) {
                  if (this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterArrayAvgMeetPerGroup[i]['filter'].length > 0) {
                  if (this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");
                  this.filtersAvgMeetPerGroup = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersAvgMeetPerGroup = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterMeetpergrp = this.filterMeetpergrp + this.filtersAvgMeetPerGroup;
              }
        }

        this.filterMeetpergrp = this.filterMeetpergrp + "))";
      }

      if (isok == true) {
        this.filterMeetpergrp = ' AND ' + this.filterMeetpergrp;
        this.getFederationReport();
        this.isVisibleAvgMeetPerGroup = false;
      }
    }

    else {
      this.getFederationReport();
      this.isVisibleAvgMeetPerGroup = false
    }
  }

  filterMeetpergrp = '';

  AddFilterGroupAvgMeetPerGroup() {
    this.mainFilterArrayAvgMeetPerGroup.push({
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

  AddFilterAvgMeetPerGroup(i: any) {
    this.mainFilterArrayAvgMeetPerGroup[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  ANDBUTTONLASTAvgMeetPerGroup(i: any) {
    this.mainFilterArrayAvgMeetPerGroup[i]['buttons']['AND'] = true;
    this.mainFilterArrayAvgMeetPerGroup[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTAvgMeetPerGroup(i: any) {
    this.mainFilterArrayAvgMeetPerGroup[i]['buttons']['AND'] = false;
    this.mainFilterArrayAvgMeetPerGroup[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTAvgMeetPerGroup1(i: any, j: any) {
    this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTAvgMeetPerGroup1(i: any, j: any) {
    this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayAvgMeetPerGroup[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Total Post Like
  mainFilterArrayTotalPostLikes = [];
  filtersTotalPostLikes = "";
  isVisibleTotalPostLikes = false;

  ClearFilterTotalPostLikes() {
    this.mainFilterArrayTotalPostLikes = [];
    this.filterPostLike = '';
    this.mainFilterArrayTotalPostLikes.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }

  showModalTotalPostLikes() {
    this.isVisibleTotalPostLikes = true;
    this.ModelName = "Total Post Like Filter";
    this.model = "TOTAL_LIKE_TILL_DATE";
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
      this.filter = "";
      this.filterPostLike = '';

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

                this.filterPostLike = this.filterPostLike + this.filtersTotalPostLikes;
              }
        }

        this.filterPostLike = this.filterPostLike + "))";
      }

      if (isok == true) {
        this.filterPostLike = ' AND ' + this.filterPostLike;
        this.getFederationReport();
        this.isVisibleTotalPostLikes = false;
      }
    }

    else {
      this.getFederationReport();
      this.isVisibleTotalPostLikes = false;
    }
  }

  filterPostLike = '';

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
    this.mainFilterArrayTotalPostLikes[i]['buttons']['AND'] = true;
    this.mainFilterArrayTotalPostLikes[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTTotalPostLikes(i: any) {
    this.mainFilterArrayTotalPostLikes[i]['buttons']['AND'] = false;
    this.mainFilterArrayTotalPostLikes[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTTotalPostLikes1(i: any, j: any) {
    this.mainFilterArrayTotalPostLikes[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterArrayTotalPostLikes[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTTotalPostLikes1(i: any, j: any) {
    this.mainFilterArrayTotalPostLikes[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterArrayTotalPostLikes[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Total Post Comment
  mainFilterArrayTotalPostComment = [];
  filtersTotalPostComment = "";
  isVisibleTotalPostComment = false;

  ClearFilterPostComment() {
    this.mainFilterArrayTotalPostComment = [];
    this.filterPostComm = '';
    this.mainFilterArrayTotalPostComment.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }

  showModalTotalPostComment() {
    this.isVisibleTotalPostComment = true;
    this.ModelName = "Total Comment Till Date Filter";
    this.model = "TOTAL_COMMENT_TILL_DATE";
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
      this.filter = "";
      this.filterPostComm = "";

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

                this.filterPostComm = this.filterPostComm + this.filtersTotalPostComment;
              }
        }

        this.filterPostComm = this.filterPostComm + "))";
      }

      if (isok == true) {
        this.filterPostComm = ' AND ' + this.filterPostComm;
        this.getFederationReport();
        this.isVisibleTotalPostComment = false;
      }
    }

    else {
      this.getFederationReport();
      this.isVisibleTotalPostComment = false;
    }
  }

  filterPostComm = '';

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
    this.mainFilterArrayTotalPostComment[i]['buttons']['AND'] = true;
    this.mainFilterArrayTotalPostComment[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTTotalPostComment(i: any) {
    this.mainFilterArrayTotalPostComment[i]['buttons']['AND'] = false;
    this.mainFilterArrayTotalPostComment[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTTotalPostComment1(i: any, j: any) {
    this.mainFilterArrayTotalPostComment[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterArrayTotalPostComment[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTTotalPostComment1(i: any, j: any) {
    this.mainFilterArrayTotalPostComment[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterArrayTotalPostComment[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Average Post Per Member
  mainFilterArrayAvgPostPerMember = [];
  filtersAvgPostPerMember = "";
  isVisibleAvgPostPerMember = false;

  ClearFilterAvgPostPerMember() {
    this.mainFilterArrayAvgPostPerMember = [];
    this.filterPostPerMem = '';
    this.mainFilterArrayAvgPostPerMember.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }

  showModalAvgPostPerMember() {
    this.isVisibleAvgPostPerMember = true;
    this.ModelName = "Avg Post Per Member Filter";
    this.model = "AVG_POST_PER_MEMBER";
  }

  CloseAvgPostPerMember() {
    this.isVisibleAvgPostPerMember = false;
  }

  CloseGroupAvgPostPerMember(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayAvgPostPerMember.splice(i, 1);
      return true;
    }
  }

  CloseGroupAvgPostPerMember1(i: any, j: any) {
    if (this.mainFilterArrayAvgPostPerMember[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayAvgPostPerMember[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterAvgPostPerMember() {
    if (this.mainFilterArrayAvgPostPerMember.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterPostPerMem = '';

      for (let i = 0; i < this.mainFilterArrayAvgPostPerMember.length; i++) {
        Button = " ";

        if (this.mainFilterArrayAvgPostPerMember.length > 0) {
          if (this.mainFilterArrayAvgPostPerMember[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayAvgPostPerMember[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayAvgPostPerMember.length > 0) {
          if (this.mainFilterArrayAvgPostPerMember[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayAvgPostPerMember[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayAvgPostPerMember[i]['filter'].length; j++) {
          if (this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterArrayAvgPostPerMember[i]['buttons']['AND'] == false && this.mainFilterArrayAvgPostPerMember[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterArrayAvgPostPerMember[i]['filter'].length > 0) {
                  if (this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterArrayAvgPostPerMember[i]['filter'].length > 0) {
                  if (this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");
                  this.filtersAvgPostPerMember = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersAvgPostPerMember = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterPostPerMem = this.filterPostPerMem + this.filtersAvgPostPerMember;
              }
        }

        this.filterPostPerMem = this.filterPostPerMem + "))";
      }

      if (isok == true) {
        this.filterPostPerMem = ' AND ' + this.filterPostPerMem;
        this.getFederationReport();
        this.isVisibleAvgPostPerMember = false;
      }
    }

    else {
      this.getFederationReport();
      this.isVisibleAvgPostPerMember = false
    }
  }

  filterPostPerMem = '';

  AddFilterGroupAvgPostPerMember() {
    this.mainFilterArrayAvgPostPerMember.push({
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

  AddFilterAvgPostPerMember(i: any) {
    this.mainFilterArrayAvgPostPerMember[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  ANDBUTTONLASTAvgPostPerMember(i: any) {
    this.mainFilterArrayAvgPostPerMember[i]['buttons']['AND'] = true;
    this.mainFilterArrayAvgPostPerMember[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTAvgPostPerMember(i: any) {
    this.mainFilterArrayAvgPostPerMember[i]['buttons']['AND'] = false;
    this.mainFilterArrayAvgPostPerMember[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTAvgPostPerMember1(i: any, j: any) {
    this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTAvgPostPerMember1(i: any, j: any) {
    this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayAvgPostPerMember[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Average Like Per Member
  mainFilterArrayAvgLikePerMember = [];
  filtersAvgLikePerMember = "";
  isVisibleAvgLikePerMember = false;

  ClearFilterAvgLikePerMember() {
    this.mainFilterArrayAvgLikePerMember = [];
    this.filterlikeperMem = '';
    this.mainFilterArrayAvgLikePerMember.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }

  showModalAvgLikePerMember() {
    this.isVisibleAvgLikePerMember = true;
    this.ModelName = "Avg. Likes Per Member Filter";
    this.model = "AVG_LIKE_PER_MEMBER";
  }

  CloseAvgLikePerMember() {
    this.isVisibleAvgLikePerMember = false;
  }

  CloseGroupAvgLikePerMember(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayAvgLikePerMember.splice(i, 1);
      return true;
    }
  }

  CloseGroupAvgLikePerMember1(i: any, j: any) {
    if (this.mainFilterArrayAvgLikePerMember[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayAvgLikePerMember[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterAvgLikePerMember() {
    if (this.mainFilterArrayAvgLikePerMember.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterlikeperMem = '';

      for (let i = 0; i < this.mainFilterArrayAvgLikePerMember.length; i++) {
        Button = " ";
        if (this.mainFilterArrayAvgLikePerMember.length > 0) {
          if (this.mainFilterArrayAvgLikePerMember[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayAvgLikePerMember[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayAvgLikePerMember.length > 0) {
          if (this.mainFilterArrayAvgLikePerMember[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayAvgLikePerMember[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayAvgLikePerMember[i]['filter'].length; j++) {
          if (this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else
              if (this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayAvgLikePerMember[i]['buttons']['AND'] == false && this.mainFilterArrayAvgLikePerMember[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayAvgLikePerMember[i]['filter'].length > 0) {
                  if (this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayAvgLikePerMember[i]['filter'].length > 0) {
                  if (this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersAvgLikePerMember = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersAvgLikePerMember = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterlikeperMem = this.filterlikeperMem + this.filtersAvgLikePerMember;
              }
        }

        this.filterlikeperMem = this.filterlikeperMem + "))";
      }

      if (isok == true) {
        console.log(this.filterlikeperMem);
        this.filterlikeperMem = ' AND ' + this.filterlikeperMem;
        this.getFederationReport();
        this.isVisibleAvgLikePerMember = false;
      }
    }

    else {
      this.getFederationReport();
      this.isVisibleAvgLikePerMember = false
    }
  }

  filterlikeperMem = '';

  AddFilterGroupAvgLikePerMember() {
    this.mainFilterArrayAvgLikePerMember.push({
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

  AddFilterAvgLikePerMember(i: any) {
    this.mainFilterArrayAvgLikePerMember[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  ANDBUTTONLASTAvgLikePerMember(i: any) {
    this.mainFilterArrayAvgLikePerMember[i]['buttons']['AND'] = true
    this.mainFilterArrayAvgLikePerMember[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTAvgLikePerMember(i: any) {
    this.mainFilterArrayAvgLikePerMember[i]['buttons']['AND'] = false
    this.mainFilterArrayAvgLikePerMember[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTAvgLikePerMember1(i: any, j: any) {
    this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTAvgLikePerMember1(i: any, j: any) {
    this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayAvgLikePerMember[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Average Comment Per Member
  mainFilterArrayAvgCommentPerMember = [];
  filtersAvgCommentPerMember = "";
  isVisibleAvgCommentPerMember = false;

  ClearFilterCommentPerMember() {
    this.mainFilterArrayAvgCommentPerMember = [];
    this.filterCommentPerMem = '';
    this.mainFilterArrayAvgCommentPerMember.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }

  showModalAvgCommentPerMember() {
    this.isVisibleAvgCommentPerMember = true;
    this.ModelName = "Avg. Comment Per Member Filter";
    this.model = "AVG_COMMENT_PER_MEMBER";
  }

  CloseAvgCommentPerMember() {
    this.isVisibleAvgCommentPerMember = false;
  }

  CloseGroupAvgCommentPerMember(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayAvgCommentPerMember.splice(i, 1);
      return true;
    }
  }

  CloseGroupAvgCommentPerMember1(i: any, j: any) {
    if (this.mainFilterArrayAvgCommentPerMember[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayAvgCommentPerMember[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterAvgCommentPerMember() {
    if (this.mainFilterArrayAvgCommentPerMember.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterCommentPerMem = '';

      for (let i = 0; i < this.mainFilterArrayAvgCommentPerMember.length; i++) {
        Button = " ";
        if (this.mainFilterArrayAvgCommentPerMember.length > 0) {
          if (this.mainFilterArrayAvgCommentPerMember[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayAvgCommentPerMember[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayAvgCommentPerMember.length > 0) {
          if (this.mainFilterArrayAvgCommentPerMember[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayAvgCommentPerMember[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayAvgCommentPerMember[i]['filter'].length; j++) {
          if (this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else
              if (this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayAvgCommentPerMember[i]['buttons']['AND'] == false && this.mainFilterArrayAvgCommentPerMember[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayAvgCommentPerMember[i]['filter'].length > 0) {
                  if (this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayAvgCommentPerMember[i]['filter'].length > 0) {
                  if (this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersAvgCommentPerMember = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersAvgCommentPerMember = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterCommentPerMem = this.filterCommentPerMem + this.filtersAvgCommentPerMember;
              }
        }

        this.filterCommentPerMem = this.filterCommentPerMem + "))";
      }

      if (isok == true) {
        console.log(this.filterCommentPerMem);
        this.filterCommentPerMem = ' AND ' + this.filterCommentPerMem;
        this.getFederationReport();
        this.isVisibleAvgCommentPerMember = false;
      }
    }

    else {
      this.getFederationReport();
      this.isVisibleAvgCommentPerMember = false
    }
  }

  filterCommentPerMem = '';

  AddFilterGroupAvgCommentPerMember() {
    this.mainFilterArrayAvgCommentPerMember.push({
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

  AddFilterAvgCommentPerMember(i: any) {
    this.mainFilterArrayAvgCommentPerMember[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }

  ANDBUTTONLASTAvgCommentPerMember(i: any) {
    this.mainFilterArrayAvgCommentPerMember[i]['buttons']['AND'] = true
    this.mainFilterArrayAvgCommentPerMember[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTAvgCommentPerMember(i: any) {
    this.mainFilterArrayAvgCommentPerMember[i]['buttons']['AND'] = false
    this.mainFilterArrayAvgCommentPerMember[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTAvgCommentPerMember1(i: any, j: any) {
    this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTAvgCommentPerMember1(i: any, j: any) {
    this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayAvgCommentPerMember[i]['filter'][j]['buttons']['AND'] = false;
  }

  // No Of Shares
  mainFilterArrayNoOfShares = [];
  filtersNoOfShares = "";
  isVisibleNoOfShares = false;

  ClearFilterNoOfShares() {
    this.mainFilterArrayNoOfShares = [];
    this.filterShares = '';
    this.mainFilterArrayNoOfShares.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }

  showModalNoOfShares() {
    this.isVisibleNoOfShares = true;
    this.ModelName = "No Of Shares Filter";
    this.model = "NO_OF_SHARES";
  }

  CloseNoOfShares() {
    this.isVisibleNoOfShares = false;
  }

  CloseGroupNoOfShares(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayNoOfShares.splice(i, 1);
      return true;
    }
  }

  CloseGroupNoOfShares1(i: any, j: any) {
    if (this.mainFilterArrayNoOfShares[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayNoOfShares[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterNoOfShares() {
    if (this.mainFilterArrayNoOfShares.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterShares = '';

      for (let i = 0; i < this.mainFilterArrayNoOfShares.length; i++) {
        Button = " ";
        if (this.mainFilterArrayNoOfShares.length > 0) {
          if (this.mainFilterArrayNoOfShares[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayNoOfShares[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayNoOfShares.length > 0) {
          if (this.mainFilterArrayNoOfShares[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayNoOfShares[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayNoOfShares[i]['filter'].length; j++) {
          if (this.mainFilterArrayNoOfShares[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayNoOfShares[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayNoOfShares[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayNoOfShares[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayNoOfShares[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayNoOfShares[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayNoOfShares[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayNoOfShares[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayNoOfShares[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayNoOfShares[i]['buttons']['AND'] == false && this.mainFilterArrayNoOfShares[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayNoOfShares[i]['filter'].length > 0) {
                  if (this.mainFilterArrayNoOfShares[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayNoOfShares[i]['filter'].length > 0) {
                  if (this.mainFilterArrayNoOfShares[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayNoOfShares[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersNoOfShares = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayNoOfShares[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayNoOfShares[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayNoOfShares[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersNoOfShares = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayNoOfShares[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayNoOfShares[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterShares = this.filterShares + this.filtersNoOfShares;
              }
        }
        this.filterShares = this.filterShares + "))";
      }

      if (isok == true) {
        console.log(this.filterShares);
        this.filterShares = ' AND ' + this.filterShares;
        this.getFederationReport();
        this.isVisibleNoOfShares = false;
      }
    }

    else {
      this.getFederationReport();
      this.isVisibleNoOfShares = false
    }
  }

  filterShares = '';

  AddFilterGroupNoOfShares() {
    this.mainFilterArrayNoOfShares.push({
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

  AddFilterNoOfShares(i: any) {
    this.mainFilterArrayNoOfShares[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }

  ANDBUTTONLASTNoOfShares(i: any) {
    this.mainFilterArrayNoOfShares[i]['buttons']['AND'] = true
    this.mainFilterArrayNoOfShares[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTNoOfShares(i: any) {
    this.mainFilterArrayNoOfShares[i]['buttons']['AND'] = false
    this.mainFilterArrayNoOfShares[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTNoOfShares1(i: any, j: any) {
    this.mainFilterArrayNoOfShares[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayNoOfShares[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTNoOfShares1(i: any, j: any) {
    this.mainFilterArrayNoOfShares[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayNoOfShares[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Event Planned
  mainFilterArrayEventPlanned = [];
  filtersEventPlanned = "";
  isVisibleEventPlanned = false;

  ClearFilterEventPlanned() {
    this.mainFilterArrayEventPlanned = [];
    this.filterEventPlan = '';
    this.mainFilterArrayEventPlanned.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
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
      this.filterEventPlan = '';

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

                this.filterEventPlan = this.filterEventPlan + this.filtersEventPlanned;
              }
        }

        this.filterEventPlan = this.filterEventPlan + "))";
      }

      if (isok == true) {
        console.log(this.filterEventPlan);
        this.filterEventPlan = ' AND ' + this.filterEventPlan;
        this.getFederationReport();
        this.isVisibleEventPlanned = false;
      }
    }

    else {
      this.getFederationReport();
      this.isVisibleEventPlanned = false
    }
  }

  filterEventPlan = '';

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

  // Event Conducted
  mainFilterArrayEventConducted = [];
  filtersEventConducted = "";
  isVisibleEventConducted = false;

  ClearFilterEventConducted() {
    this.mainFilterArrayEventConducted = [];
    this.filterEventConduct = '';
    this.mainFilterArrayEventConducted.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }

  showModalEventConducted() {
    this.isVisibleEventConducted = true;
    this.ModelName = "Event Conducted Filter";
    this.model = "EVENT_CONDUCTED";
  }

  CloseEventConducted() {
    this.isVisibleEventConducted = false;
  }

  CloseGroupEventConducted(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayEventConducted.splice(i, 1);
      return true;
    }
  }

  CloseGroupEventConducted1(i: any, j: any) {
    if (this.mainFilterArrayEventConducted[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayEventConducted[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterEventConducted() {
    if (this.mainFilterArrayEventConducted.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterEventConduct = '';

      for (let i = 0; i < this.mainFilterArrayEventConducted.length; i++) {
        Button = " ";
        if (this.mainFilterArrayEventConducted.length > 0) {
          if (this.mainFilterArrayEventConducted[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayEventConducted[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayEventConducted.length > 0) {
          if (this.mainFilterArrayEventConducted[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayEventConducted[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayEventConducted[i]['filter'].length; j++) {
          if (this.mainFilterArrayEventConducted[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayEventConducted[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayEventConducted[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayEventConducted[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayEventConducted[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayEventConducted[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayEventConducted[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayEventConducted[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayEventConducted[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayEventConducted[i]['buttons']['AND'] == false && this.mainFilterArrayEventConducted[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayEventConducted[i]['filter'].length > 0) {
                  if (this.mainFilterArrayEventConducted[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayEventConducted[i]['filter'].length > 0) {
                  if (this.mainFilterArrayEventConducted[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayEventConducted[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersEventConducted = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayEventConducted[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayEventConducted[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayEventConducted[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersEventConducted = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayEventConducted[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayEventConducted[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterEventConduct = this.filterEventConduct + this.filtersEventConducted;
              }
        }
        this.filterEventConduct = this.filterEventConduct + "))";
      }

      if (isok == true) {
        console.log(this.filterEventConduct);
        this.filterEventConduct = ' AND ' + this.filterEventConduct;
        this.getFederationReport();
        this.isVisibleEventConducted = false;
      }
    }

    else {
      this.getFederationReport();
      this.isVisibleEventConducted = false
    }
  }

  filterEventConduct = '';

  AddFilterGroupEventConducted() {
    this.mainFilterArrayEventConducted.push({
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

  AddFilterEventConducted(i: any) {
    this.mainFilterArrayEventConducted[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }

  ANDBUTTONLASTEventConducted(i: any) {
    this.mainFilterArrayEventConducted[i]['buttons']['AND'] = true
    this.mainFilterArrayEventConducted[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTEventConducted(i: any) {
    this.mainFilterArrayEventConducted[i]['buttons']['AND'] = false
    this.mainFilterArrayEventConducted[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTEventConducted1(i: any, j: any) {
    this.mainFilterArrayEventConducted[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayEventConducted[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTEventConducted1(i: any, j: any) {
    this.mainFilterArrayEventConducted[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayEventConducted[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Event Total Beneficiaries
  mainFilterArrayEventTotalBeneficiaries = [];
  filtersEventTotalBeneficiaries = "";
  isVisibleEventTotalBeneficiaries = false;

  ClearFilterBeneficiaries() {
    this.mainFilterArrayEventTotalBeneficiaries = [];
    this.filterTotBenefi = '';
    this.mainFilterArrayEventTotalBeneficiaries.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }

  showModalEventTotalBeneficiaries() {
    this.isVisibleEventTotalBeneficiaries = true;
    this.ModelName = "Event Total Beneficiaries Filter";
    this.model = "TOTAL_BENEFICIARIES";
  }

  CloseEventTotalBeneficiaries() {
    this.isVisibleEventTotalBeneficiaries = false;
  }

  CloseGroupEventTotalBeneficiaries(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayEventTotalBeneficiaries.splice(i, 1);
      return true;
    }
  }

  CloseGroupEventTotalBeneficiaries1(i: any, j: any) {
    if (this.mainFilterArrayEventTotalBeneficiaries[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayEventTotalBeneficiaries[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterEventTotalBeneficiaries() {
    if (this.mainFilterArrayEventTotalBeneficiaries.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterTotBenefi = '';

      for (let i = 0; i < this.mainFilterArrayEventTotalBeneficiaries.length; i++) {
        Button = " ";
        if (this.mainFilterArrayEventTotalBeneficiaries.length > 0) {
          if (this.mainFilterArrayEventTotalBeneficiaries[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayEventTotalBeneficiaries[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayEventTotalBeneficiaries.length > 0) {
          if (this.mainFilterArrayEventTotalBeneficiaries[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayEventTotalBeneficiaries[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayEventTotalBeneficiaries[i]['filter'].length; j++) {
          if (this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else if (this.mainFilterArrayEventTotalBeneficiaries[i]['buttons']['AND'] == false && this.mainFilterArrayEventTotalBeneficiaries[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";
                if (this.mainFilterArrayEventTotalBeneficiaries[i]['filter'].length > 0) {
                  if (this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterArrayEventTotalBeneficiaries[i]['filter'].length > 0) {
                  if (this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");
                  this.filtersEventTotalBeneficiaries = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersEventTotalBeneficiaries = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterTotBenefi = this.filterTotBenefi + this.filtersEventTotalBeneficiaries;
              }
        }

        this.filterTotBenefi = this.filterTotBenefi + "))";
      }

      if (isok == true) {
        console.log(this.filterTotBenefi);
        this.filterTotBenefi = ' AND ' + this.filterTotBenefi;
        this.getFederationReport();
        this.isVisibleEventTotalBeneficiaries = false;
      }
    }

    else {
      this.getFederationReport();
      this.isVisibleEventTotalBeneficiaries = false
    }
  }

  filterTotBenefi = '';

  AddFilterGroupEventTotalBeneficiaries() {
    this.mainFilterArrayEventTotalBeneficiaries.push({
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

  AddFilterEventTotalBeneficiaries(i: any) {
    this.mainFilterArrayEventTotalBeneficiaries[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });

    return true;
  }

  ANDBUTTONLASTEventTotalBeneficiaries(i: any) {
    this.mainFilterArrayEventTotalBeneficiaries[i]['buttons']['AND'] = true
    this.mainFilterArrayEventTotalBeneficiaries[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTEventTotalBeneficiaries(i: any) {
    this.mainFilterArrayEventTotalBeneficiaries[i]['buttons']['AND'] = false
    this.mainFilterArrayEventTotalBeneficiaries[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTEventTotalBeneficiaries1(i: any, j: any) {
    this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTEventTotalBeneficiaries1(i: any, j: any) {
    this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayEventTotalBeneficiaries[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Top Type
  // mainFilterArrayTopType = [];
  // filtersTopType = "";
  // isVisibleTopType = false;

  // ClearFilterTopType() {
  //   this.mainFilterArrayTopType = [];
  //   this.filterTType = '';
  //   this.mainFilterArrayTopType.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
  //   this.getFederationReport();
  // }
  // showModalTopType(index: any) {
  //   this.isVisibleTopType = true;
  //   this.ModelName = "Top Type Filter";
  //   this.model = "MEMBER_COUNT";
  // }
  // CloseTopType(index: any) {
  //   this.isVisibleTopType = false;
  // }
  // CloseGroupTopType(i: any) {
  //   if (i == 0) {
  //     return false;
  //   } else {
  //     this.mainFilterArrayTopType.splice(i, 1);
  //     return true;
  //   }
  // }
  // CloseGroupTopType1(i: any, j: any) {
  //   if (this.mainFilterArrayTopType[i]['filter'].length == 1 || j == 0) {
  //     return false;
  //   } else {
  //     this.mainFilterArrayTopType[i]['filter'].splice(j, 1);
  //     return true;
  //   }
  // }
  // ApplyFilterTopType() {
  //   if (this.mainFilterArrayTopType.length != 0) {
  //     var isok = true;
  //     var Button = " ";
  //     this.filter = "";
  //     this.filterTType = '';
  //     for (let i = 0; i < this.mainFilterArrayTopType.length; i++) {
  //       Button = " ";
  //       if (this.mainFilterArrayTopType.length > 0) {
  //         if (this.mainFilterArrayTopType[i]['buttons']['AND'] != undefined) {
  //           if (this.mainFilterArrayTopType[i]['buttons']['AND'] == true) {
  //             Button = " " + " AND " + "  ";
  //           }
  //         }
  //       }
  //       if (this.mainFilterArrayTopType.length > 0) {
  //         if (this.mainFilterArrayTopType[i]['buttons']['OR'] != undefined) {
  //           if (this.mainFilterArrayTopType[i]['buttons']['OR'] == true) {
  //             Button = " " + " OR " + " ";
  //           }
  //         }
  //       }
  //       for (let j = 0; j < this.mainFilterArrayTopType[i]['filter'].length; j++) {
  //         if (this.mainFilterArrayTopType[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayTopType[i]['filter'][j]['INPUT'] == '') {
  //           this.message.error('Input', 'Please fill the field');
  //           isok = false;
  //         } else
  //           if ((this.mainFilterArrayTopType[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayTopType[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayTopType[i]['filter'][j]['DROPDOWN'] == "Between")) {
  //             this.message.error('Input2', 'Please fill the field');
  //             isok = false;
  //           } else

  //             if (this.mainFilterArrayTopType[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayTopType[i]['filter'][j]['DROPDOWN'] == '') {
  //               this.message.error('Condition', 'Please Select the field');
  //               isok = false;
  //             }
  //             else if (this.mainFilterArrayTopType[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayTopType[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
  //               this.message.error('AND or OR', 'Please Clike On The Button');
  //               isok = false;
  //             }
  //             else if (this.mainFilterArrayTopType[i]['buttons']['AND'] == false && this.mainFilterArrayTopType[i]['buttons']['OR'] == false && i > 0) {
  //               this.message.error('AND or OR', 'Please Clike On The Button');
  //               isok = false;
  //             }
  //             else {
  //               var Button1 = "((";
  //               if (this.mainFilterArrayTopType[i]['filter'].length > 0) {
  //                 if (this.mainFilterArrayTopType[i]['filter'][j]['buttons']['AND'] == true) {
  //                   Button1 = ")" + " AND " + "(";
  //                   Button = " ";
  //                 }
  //               }
  //               if (this.mainFilterArrayTopType[i]['filter'].length > 0) {
  //                 if (this.mainFilterArrayTopType[i]['filter'][j]['buttons']['OR'] == true) {
  //                   Button1 = ")" + " OR " + "(";
  //                   Button = " ";
  //                 }
  //               }
  //               // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
  //               if (this.mainFilterArrayTopType[i]['filter'][j]['DROPDOWN'] == "Between") {
  //                 // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

  //                 this.filtersTopType = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayTopType[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayTopType[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayTopType[i]['filter'][j]['INPUT2'] + "'";
  //               } else {
  //                 this.filtersTopType = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayTopType[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayTopType[i]['filter'][j]['INPUT'] + "'";
  //               }
  //               this.filterTType = this.filterTType + this.filtersTopType;
  //             }
  //       }
  //       this.filterTType = this.filterTType + "))";
  //     }
  //     console.log(this.filterTType);
  //     this.filterTType = ' AND ' + this.filterTType;
  //     this.getFederationReport();
  //     this.isVisibleTopType = false
  //   }
  //   else {
  //     this.getFederationReport();
  //     this.isVisibleTopType = false
  //   }
  // }
  // filterTType = '';
  // AddFilterGroupTopType() {
  //   this.mainFilterArrayTopType.push({
  //     filter: [{
  //       INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
  //         AND: false, OR: false, IS_SHOW: false
  //       },
  //     }],
  //     Query: '',
  //     buttons: {
  //       AND: false, OR: false, IS_SHOW: true
  //     },
  //   });
  // }
  // AddFilterTopType(i: any, j: any) {
  //   this.mainFilterArrayTopType[i]['filter'].push({
  //     INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
  //       AND: false, OR: false, IS_SHOW: true
  //     },
  //   });
  //   return true;
  // }
  // ANDBUTTONLASTTopType(i: any, j: any) {
  //   this.mainFilterArrayTopType[i]['buttons']['AND'] = true
  //   this.mainFilterArrayTopType[i]['buttons']['OR'] = false;
  // }
  // ORBUTTONLASTTopType(i: any, j: any) {
  //   this.mainFilterArrayTopType[i]['buttons']['AND'] = false
  //   this.mainFilterArrayTopType[i]['buttons']['OR'] = true;
  // }
  // ANDBUTTONLASTTopType1(i: any, j: any) {
  //   this.mainFilterArrayTopType[i]['filter'][j]['buttons']['OR'] = false
  //   this.mainFilterArrayTopType[i]['filter'][j]['buttons']['AND'] = true;
  // }
  // ORBUTTONLASTTopType1(i: any, j: any) {
  //   this.mainFilterArrayTopType[i]['filter'][j]['buttons']['OR'] = true
  //   this.mainFilterArrayTopType[i]['filter'][j]['buttons']['AND'] = false;
  // }

  // Total Circular Created
  mainFilterArrayTotCircularCreated = [];
  filtersTotCircularCreated = "";
  isVisibleTotCircularCreated = false;

  ClearFilterTotCircularCreated() {
    this.mainFilterArrayTotCircularCreated = [];
    this.filterTotCircCreate = '';
    this.mainFilterArrayTotCircularCreated.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }

  showModalTotCircularCreated() {
    this.isVisibleTotCircularCreated = true;
    this.ModelName = "Total Circular Created Filter";
    this.model = "TOTAL_CIRCULAR_CREATED";
  }

  CloseTotCircularCreated() {
    this.isVisibleTotCircularCreated = false;
  }

  CloseGroupTotCircularCreated(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArrayTotCircularCreated.splice(i, 1);
      return true;
    }
  }

  CloseGroupTotCircularCreated1(i: any, j: any) {
    if (this.mainFilterArrayTotCircularCreated[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArrayTotCircularCreated[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ApplyFilterTotCircularCreated() {
    if (this.mainFilterArrayTotCircularCreated.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterTotCircCreate = '';

      for (let i = 0; i < this.mainFilterArrayTotCircularCreated.length; i++) {
        Button = " ";
        if (this.mainFilterArrayTotCircularCreated.length > 0) {
          if (this.mainFilterArrayTotCircularCreated[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayTotCircularCreated[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }

        if (this.mainFilterArrayTotCircularCreated.length > 0) {
          if (this.mainFilterArrayTotCircularCreated[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayTotCircularCreated[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterArrayTotCircularCreated[i]['filter'].length; j++) {
          if (this.mainFilterArrayTotCircularCreated[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayTotCircularCreated[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterArrayTotCircularCreated[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayTotCircularCreated[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayTotCircularCreated[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else
              if (this.mainFilterArrayTotCircularCreated[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayTotCircularCreated[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayTotCircularCreated[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayTotCircularCreated[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayTotCircularCreated[i]['buttons']['AND'] == false && this.mainFilterArrayTotCircularCreated[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayTotCircularCreated[i]['filter'].length > 0) {
                  if (this.mainFilterArrayTotCircularCreated[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayTotCircularCreated[i]['filter'].length > 0) {
                  if (this.mainFilterArrayTotCircularCreated[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayTotCircularCreated[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersTotCircularCreated = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayTotCircularCreated[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayTotCircularCreated[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayTotCircularCreated[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersTotCircularCreated = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayTotCircularCreated[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayTotCircularCreated[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterTotCircCreate = this.filterTotCircCreate + this.filtersTotCircularCreated;
              }
        }

        this.filterTotCircCreate = this.filterTotCircCreate + "))";
      }

      if (isok == true) {
        console.log(this.filterTotCircCreate);
        this.filterTotCircCreate = ' AND ' + this.filterTotCircCreate;
        this.getFederationReport();
        this.isVisibleTotCircularCreated = false;
      }
    }

    else {
      this.getFederationReport();
      this.isVisibleTotCircularCreated = false
    }
  }

  filterTotCircCreate = '';

  AddFilterGroupTotCircularCreated() {
    this.mainFilterArrayTotCircularCreated.push({
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

  AddFilterTotCircularCreated(i: any) {
    this.mainFilterArrayTotCircularCreated[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }

  ANDBUTTONLASTTotCircularCreated(i: any) {
    this.mainFilterArrayTotCircularCreated[i]['buttons']['AND'] = true
    this.mainFilterArrayTotCircularCreated[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTTotCircularCreated(i: any) {
    this.mainFilterArrayTotCircularCreated[i]['buttons']['AND'] = false
    this.mainFilterArrayTotCircularCreated[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTTotCircularCreated1(i: any, j: any) {
    this.mainFilterArrayTotCircularCreated[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayTotCircularCreated[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTTotCircularCreated1(i: any, j: any) {
    this.mainFilterArrayTotCircularCreated[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayTotCircularCreated[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Circular Published
  mainFilterArrayCircuPublished = [];
  filtersCircuPublished = "";
  isVisibleCircuPublished = false;

  ClearFilterCircuPublished() {
    this.mainFilterArrayCircuPublished = [];
    this.filterCircPubl = '';
    this.mainFilterArrayCircuPublished.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }
  showModalCircuPublished() {
    this.isVisibleCircuPublished = true;
    this.ModelName = "Published Circular Filter";
    this.model = "PUBLISHED_CIRCULAR";
  }
  CloseCircuPublished() {
    this.isVisibleCircuPublished = false;
  }
  CloseGroupCircuPublished(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterArrayCircuPublished.splice(i, 1);
      return true;
    }
  }
  CloseGroupCircuPublished1(i: any, j: any) {
    if (this.mainFilterArrayCircuPublished[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterArrayCircuPublished[i]['filter'].splice(j, 1);
      return true;
    }
  }
  ApplyFilterCircuPublished() {
    if (this.mainFilterArrayCircuPublished.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterCircPubl = '';
      for (let i = 0; i < this.mainFilterArrayCircuPublished.length; i++) {
        Button = " ";
        if (this.mainFilterArrayCircuPublished.length > 0) {
          if (this.mainFilterArrayCircuPublished[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayCircuPublished[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayCircuPublished.length > 0) {
          if (this.mainFilterArrayCircuPublished[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayCircuPublished[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayCircuPublished[i]['filter'].length; j++) {
          if (this.mainFilterArrayCircuPublished[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayCircuPublished[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayCircuPublished[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayCircuPublished[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayCircuPublished[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayCircuPublished[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayCircuPublished[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayCircuPublished[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayCircuPublished[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayCircuPublished[i]['buttons']['AND'] == false && this.mainFilterArrayCircuPublished[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayCircuPublished[i]['filter'].length > 0) {
                  if (this.mainFilterArrayCircuPublished[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayCircuPublished[i]['filter'].length > 0) {
                  if (this.mainFilterArrayCircuPublished[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayCircuPublished[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersCircuPublished = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayCircuPublished[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayCircuPublished[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayCircuPublished[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersCircuPublished = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayCircuPublished[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayCircuPublished[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterCircPubl = this.filterCircPubl + this.filtersCircuPublished;
              }
        }
        this.filterCircPubl = this.filterCircPubl + "))";
      }
      if (isok == true) {
        console.log(this.filterCircPubl);
        this.filterCircPubl = ' AND ' + this.filterCircPubl;
        this.getFederationReport();
        this.isVisibleCircuPublished = false;
      }
    }
    else {
      this.getFederationReport();
      this.isVisibleCircuPublished = false
    }
  }
  filterCircPubl = '';
  AddFilterGroupCircuPublished() {
    this.mainFilterArrayCircuPublished.push({
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
  AddFilterCircuPublished(i: any) {
    this.mainFilterArrayCircuPublished[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }
  ANDBUTTONLASTCircuPublished(i: any) {
    this.mainFilterArrayCircuPublished[i]['buttons']['AND'] = true
    this.mainFilterArrayCircuPublished[i]['buttons']['OR'] = false;
  }
  ORBUTTONLASTCircuPublished(i: any) {
    this.mainFilterArrayCircuPublished[i]['buttons']['AND'] = false
    this.mainFilterArrayCircuPublished[i]['buttons']['OR'] = true;
  }
  ANDBUTTONLASTCircuPublished1(i: any, j: any) {
    this.mainFilterArrayCircuPublished[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayCircuPublished[i]['filter'][j]['buttons']['AND'] = true;
  }
  ORBUTTONLASTCircuPublished1(i: any, j: any) {
    this.mainFilterArrayCircuPublished[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayCircuPublished[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Total Circular Views
  mainFilterArrayTotViews = [];
  filtersTotViews = "";
  isVisibleTotViews = false;

  ClearFilterTotViews() {
    this.mainFilterArrayTotViews = [];
    this.filterTView = '';
    this.mainFilterArrayTotViews.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
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
      this.filter = "";
      this.filterTView = "";
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
                this.filterTView = this.filterTView + this.filtersTotViews;
              }
        }
        this.filterTView = this.filterTView + "))";
      }
      if (isok == true) {
        console.log(this.filterTView);
        this.filterTView = ' AND ' + this.filterTView;
        this.getFederationReport();
        this.isVisibleTotViews = false;
      }
    }
    else {
      this.getFederationReport();
      this.isVisibleTotViews = false
    }
  }
  filterTView = '';
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

  // Completed Project
  mainFilterArrayCompletedProj = [];
  filtersCompletedProj = "";
  isVisibleCompletedProj = false;
  ClearFilterCompletedProj() {
    this.mainFilterArrayCompletedProj = [];
    this.filterCompProj = '';
    this.mainFilterArrayCompletedProj.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }
  showModalCompletedProj() {
    this.isVisibleCompletedProj = true;
    this.ModelName = "Completed Projects Filter";
    this.model = "COMPLETED_PROJECTS";
  }
  CloseCompletedProj() {
    this.isVisibleCompletedProj = false;
  }
  CloseGroupCompletedProj(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterArrayCompletedProj.splice(i, 1);
      return true;
    }
  }
  CloseGroupCompletedProj1(i: any, j: any) {
    if (this.mainFilterArrayCompletedProj[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterArrayCompletedProj[i]['filter'].splice(j, 1);
      return true;
    }
  }
  ApplyFilterCompletedProj() {
    if (this.mainFilterArrayCompletedProj.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterCompProj = '';
      for (let i = 0; i < this.mainFilterArrayCompletedProj.length; i++) {
        Button = " ";
        if (this.mainFilterArrayCompletedProj.length > 0) {
          if (this.mainFilterArrayCompletedProj[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayCompletedProj[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayCompletedProj.length > 0) {
          if (this.mainFilterArrayCompletedProj[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayCompletedProj[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayCompletedProj[i]['filter'].length; j++) {
          if (this.mainFilterArrayCompletedProj[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayCompletedProj[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayCompletedProj[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayCompletedProj[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayCompletedProj[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayCompletedProj[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayCompletedProj[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayCompletedProj[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayCompletedProj[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayCompletedProj[i]['buttons']['AND'] == false && this.mainFilterArrayCompletedProj[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayCompletedProj[i]['filter'].length > 0) {
                  if (this.mainFilterArrayCompletedProj[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayCompletedProj[i]['filter'].length > 0) {
                  if (this.mainFilterArrayCompletedProj[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayCompletedProj[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersCompletedProj = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayCompletedProj[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayCompletedProj[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayCompletedProj[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersCompletedProj = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayCompletedProj[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayCompletedProj[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterCompProj = this.filterCompProj + this.filtersCompletedProj;
              }
        }
        this.filterCompProj = this.filterCompProj + "))";
      }
      if (isok == true) {
        console.log(this.filterCompProj);
        this.filterCompProj = ' AND ' + this.filterCompProj;
        this.getFederationReport();
        this.isVisibleCompletedProj = false;
      }
    }
    else {
      this.getFederationReport();
      this.isVisibleCompletedProj = false
    }
  }
  filterCompProj = '';
  AddFilterGroupCompletedProj() {
    this.mainFilterArrayCompletedProj.push({
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
  AddFilterCompletedProj(i: any) {
    this.mainFilterArrayCompletedProj[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }
  ANDBUTTONLASTCompletedProj(i: any) {
    this.mainFilterArrayCompletedProj[i]['buttons']['AND'] = true
    this.mainFilterArrayCompletedProj[i]['buttons']['OR'] = false;
  }
  ORBUTTONLASTCompletedProj(i: any) {
    this.mainFilterArrayCompletedProj[i]['buttons']['AND'] = false
    this.mainFilterArrayCompletedProj[i]['buttons']['OR'] = true;
  }
  ANDBUTTONLASTCompletedProj1(i: any, j: any) {
    this.mainFilterArrayCompletedProj[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayCompletedProj[i]['filter'][j]['buttons']['AND'] = true;
  }
  ORBUTTONLASTCompletedProj1(i: any, j: any) {
    this.mainFilterArrayCompletedProj[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayCompletedProj[i]['filter'][j]['buttons']['AND'] = false;
  }

  // On Going Project
  mainFilterArrayOnGoingProj = [];
  filtersOnGoingProj = "";
  isVisibleOnGoingProj = false;

  ClearFilterOnGoingProj() {
    this.mainFilterArrayOnGoingProj = [];
    this.filterOnGoProj = '';
    this.mainFilterArrayOnGoingProj.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }
  showModalOnGoingProj() {
    this.isVisibleOnGoingProj = true;
    this.ModelName = "OnGoing Project Filter";
    this.model = "ONGOING_PROJECTS";
  }
  CloseOnGoingProj() {
    this.isVisibleOnGoingProj = false;
  }
  CloseGroupOnGoingProj(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterArrayOnGoingProj.splice(i, 1);
      return true;
    }
  }
  CloseGroupOnGoingProj1(i: any, j: any) {
    if (this.mainFilterArrayOnGoingProj[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterArrayOnGoingProj[i]['filter'].splice(j, 1);
      return true;
    }
  }
  ApplyFilterOnGoingProj() {
    if (this.mainFilterArrayOnGoingProj.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterOnGoProj = '';
      for (let i = 0; i < this.mainFilterArrayOnGoingProj.length; i++) {
        Button = " ";
        if (this.mainFilterArrayOnGoingProj.length > 0) {
          if (this.mainFilterArrayOnGoingProj[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayOnGoingProj[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayOnGoingProj.length > 0) {
          if (this.mainFilterArrayOnGoingProj[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayOnGoingProj[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayOnGoingProj[i]['filter'].length; j++) {
          if (this.mainFilterArrayOnGoingProj[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayOnGoingProj[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayOnGoingProj[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayOnGoingProj[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayOnGoingProj[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayOnGoingProj[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayOnGoingProj[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayOnGoingProj[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayOnGoingProj[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayOnGoingProj[i]['buttons']['AND'] == false && this.mainFilterArrayOnGoingProj[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayOnGoingProj[i]['filter'].length > 0) {
                  if (this.mainFilterArrayOnGoingProj[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayOnGoingProj[i]['filter'].length > 0) {
                  if (this.mainFilterArrayOnGoingProj[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayOnGoingProj[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersOnGoingProj = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayOnGoingProj[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayOnGoingProj[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayOnGoingProj[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersOnGoingProj = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayOnGoingProj[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayOnGoingProj[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterOnGoProj = this.filterOnGoProj + this.filtersOnGoingProj;
              }
        }
        this.filterOnGoProj = this.filterOnGoProj + "))";
      }
      if (isok == true) {
        console.log(this.filterOnGoProj);
        this.filterOnGoProj = ' AND ' + this.filterOnGoProj;
        this.getFederationReport();
        this.isVisibleOnGoingProj = false;
      }
    }
    else {
      this.getFederationReport();
      this.isVisibleOnGoingProj = false
    }
  }
  filterOnGoProj = '';
  AddFilterGroupOnGoingProj() {
    this.mainFilterArrayOnGoingProj.push({
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
  AddFilterOnGoingProj(i: any) {
    this.mainFilterArrayOnGoingProj[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }
  ANDBUTTONLASTOnGoingProj(i: any) {
    this.mainFilterArrayOnGoingProj[i]['buttons']['AND'] = true
    this.mainFilterArrayOnGoingProj[i]['buttons']['OR'] = false;
  }
  ORBUTTONLASTOnGoingProj(i: any) {
    this.mainFilterArrayOnGoingProj[i]['buttons']['AND'] = false
    this.mainFilterArrayOnGoingProj[i]['buttons']['OR'] = true;
  }
  ANDBUTTONLASTOnGoingProj1(i: any, j: any) {
    this.mainFilterArrayOnGoingProj[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayOnGoingProj[i]['filter'][j]['buttons']['AND'] = true;
  }
  ORBUTTONLASTOnGoingProj1(i: any, j: any) {
    this.mainFilterArrayOnGoingProj[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayOnGoingProj[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Total Fund Utilization
  mainFilterArrayTotFundUtilize = [];
  filtersTotFundUtilize = "";
  isVisibleTotFundUtilize = false;

  ClearFilterTotFundUtilize() {
    this.mainFilterArrayTotFundUtilize = [];
    this.filterFundUtil = '';
    this.mainFilterArrayTotFundUtilize.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }
  showModalTotFundUtilize() {
    this.isVisibleTotFundUtilize = true;
    this.ModelName = "Fund Utilize Filter";
    this.model = "FUND_UTILISED";
  }
  CloseTotFundUtilize() {
    this.isVisibleTotFundUtilize = false;
  }
  CloseGroupTotFundUtilize(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterArrayTotFundUtilize.splice(i, 1);
      return true;
    }
  }
  CloseGroupTotFundUtilize1(i: any, j: any) {
    if (this.mainFilterArrayTotFundUtilize[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterArrayTotFundUtilize[i]['filter'].splice(j, 1);
      return true;
    }
  }
  ApplyFilterTotFundUtilize() {
    if (this.mainFilterArrayTotFundUtilize.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterFundUtil = '';
      for (let i = 0; i < this.mainFilterArrayTotFundUtilize.length; i++) {
        Button = " ";
        if (this.mainFilterArrayTotFundUtilize.length > 0) {
          if (this.mainFilterArrayTotFundUtilize[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayTotFundUtilize[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayTotFundUtilize.length > 0) {
          if (this.mainFilterArrayTotFundUtilize[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayTotFundUtilize[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayTotFundUtilize[i]['filter'].length; j++) {
          if (this.mainFilterArrayTotFundUtilize[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayTotFundUtilize[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayTotFundUtilize[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayTotFundUtilize[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayTotFundUtilize[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayTotFundUtilize[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayTotFundUtilize[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayTotFundUtilize[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayTotFundUtilize[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayTotFundUtilize[i]['buttons']['AND'] == false && this.mainFilterArrayTotFundUtilize[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayTotFundUtilize[i]['filter'].length > 0) {
                  if (this.mainFilterArrayTotFundUtilize[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayTotFundUtilize[i]['filter'].length > 0) {
                  if (this.mainFilterArrayTotFundUtilize[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayTotFundUtilize[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersTotFundUtilize = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayTotFundUtilize[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayTotFundUtilize[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayTotFundUtilize[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersTotFundUtilize = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayTotFundUtilize[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayTotFundUtilize[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterFundUtil = this.filterFundUtil + this.filtersTotFundUtilize;
              }
        }
        this.filterFundUtil = this.filterFundUtil + "))";
      }
      if (isok == true) {
        console.log(this.filterFundUtil);
        this.filterFundUtil = ' AND ' + this.filterFundUtil;
        this.getFederationReport();
        this.isVisibleTotFundUtilize = false;
      }
    }
    else {
      this.getFederationReport();
      this.isVisibleTotFundUtilize = false
    }
  }
  filterFundUtil = '';
  AddFilterGroupTotFundUtilize() {
    this.mainFilterArrayTotFundUtilize.push({
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
  AddFilterTotFundUtilize(i: any) {
    this.mainFilterArrayTotFundUtilize[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }
  ANDBUTTONLASTTotFundUtilize(i: any) {
    this.mainFilterArrayTotFundUtilize[i]['buttons']['AND'] = true
    this.mainFilterArrayTotFundUtilize[i]['buttons']['OR'] = false;
  }
  ORBUTTONLASTTotFundUtilize(i: any) {
    this.mainFilterArrayTotFundUtilize[i]['buttons']['AND'] = false
    this.mainFilterArrayTotFundUtilize[i]['buttons']['OR'] = true;
  }
  ANDBUTTONLASTTotFundUtilize1(i: any, j: any) {
    this.mainFilterArrayTotFundUtilize[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayTotFundUtilize[i]['filter'][j]['buttons']['AND'] = true;
  }
  ORBUTTONLASTTotFundUtilize1(i: any, j: any) {
    this.mainFilterArrayTotFundUtilize[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayTotFundUtilize[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Average Fund Project
  mainFilterArrayAvgFundProj = [];
  filtersAvgFundProj = "";
  isVisibleAvgFundProj = false;
  ClearFilterAvgFundProj() {
    this.mainFilterArrayAvgFundProj = [];
    this.filterFundProj = '';
    this.mainFilterArrayAvgFundProj.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }
  showModalAvgFundProj() {
    this.isVisibleAvgFundProj = true;
    this.ModelName = "Avg. Fund Project Filter";
    this.model = "AVG_FUND_PER_PROJECT";
  }
  CloseAvgFundProj() {
    this.isVisibleAvgFundProj = false;
  }
  CloseGroupAvgFundProj(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterArrayAvgFundProj.splice(i, 1);
      return true;
    }
  }
  CloseGroupAvgFundProj1(i: any, j: any) {
    if (this.mainFilterArrayAvgFundProj[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterArrayAvgFundProj[i]['filter'].splice(j, 1);
      return true;
    }
  }
  ApplyFilterAvgFundProj() {
    if (this.mainFilterArrayAvgFundProj.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterFundProj = '';
      for (let i = 0; i < this.mainFilterArrayAvgFundProj.length; i++) {
        Button = " ";
        if (this.mainFilterArrayAvgFundProj.length > 0) {
          if (this.mainFilterArrayAvgFundProj[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayAvgFundProj[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayAvgFundProj.length > 0) {
          if (this.mainFilterArrayAvgFundProj[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayAvgFundProj[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayAvgFundProj[i]['filter'].length; j++) {
          if (this.mainFilterArrayAvgFundProj[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayAvgFundProj[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayAvgFundProj[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayAvgFundProj[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayAvgFundProj[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayAvgFundProj[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayAvgFundProj[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayAvgFundProj[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayAvgFundProj[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayAvgFundProj[i]['buttons']['AND'] == false && this.mainFilterArrayAvgFundProj[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayAvgFundProj[i]['filter'].length > 0) {
                  if (this.mainFilterArrayAvgFundProj[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayAvgFundProj[i]['filter'].length > 0) {
                  if (this.mainFilterArrayAvgFundProj[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayAvgFundProj[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersAvgFundProj = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayAvgFundProj[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayAvgFundProj[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayAvgFundProj[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersAvgFundProj = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayAvgFundProj[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayAvgFundProj[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterFundProj = this.filterFundProj + this.filtersAvgFundProj;
              }
        }
        this.filterFundProj = this.filterFundProj + "))";
      }
      if (isok == true) {
        console.log(this.filterFundProj);
        this.filterFundProj = ' AND ' + this.filterFundProj;
        this.getFederationReport();
        this.isVisibleAvgFundProj = false;
      }
    }
    else {
      this.getFederationReport();
      this.isVisibleAvgFundProj = false
    }
  }
  filterFundProj = '';
  AddFilterGroupAvgFundProj() {
    this.mainFilterArrayAvgFundProj.push({
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
  AddFilterAvgFundProj(i: any) {
    this.mainFilterArrayAvgFundProj[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }
  ANDBUTTONLASTAvgFundProj(i: any) {
    this.mainFilterArrayAvgFundProj[i]['buttons']['AND'] = true
    this.mainFilterArrayAvgFundProj[i]['buttons']['OR'] = false;
  }
  ORBUTTONLASTAvgFundProj(i: any) {
    this.mainFilterArrayAvgFundProj[i]['buttons']['AND'] = false
    this.mainFilterArrayAvgFundProj[i]['buttons']['OR'] = true;
  }
  ANDBUTTONLASTAvgFundProj1(i: any, j: any) {
    this.mainFilterArrayAvgFundProj[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayAvgFundProj[i]['filter'][j]['buttons']['AND'] = true;
  }
  ORBUTTONLASTAvgFundProj1(i: any, j: any) {
    this.mainFilterArrayAvgFundProj[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayAvgFundProj[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Average Project Group
  mainFilterArrayAvgProjGroup = [];
  filtersAvgProjGroup = "";
  isVisibleAvgProjGroup = false;
  ClearFilterAvgProjGroup() {
    this.mainFilterArrayAvgProjGroup = [];
    this.filterAvgProGrp = '';
    this.mainFilterArrayAvgProjGroup.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }
  showModalAvgProjGroup() {
    this.isVisibleAvgProjGroup = true;
    this.ModelName = "Avg. Project Group Filter";
    this.model = "AVG_PROJECT_PER_GROUP";
  }
  CloseAvgProjGroup() {
    this.isVisibleAvgProjGroup = false;
  }
  CloseGroupAvgProjGroup(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterArrayAvgProjGroup.splice(i, 1);
      return true;
    }
  }
  CloseGroupAvgProjGroup1(i: any, j: any) {
    if (this.mainFilterArrayAvgProjGroup[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterArrayAvgProjGroup[i]['filter'].splice(j, 1);
      return true;
    }
  }
  ApplyFilterAvgProjGroup() {
    if (this.mainFilterArrayAvgProjGroup.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterAvgProGrp = "";
      for (let i = 0; i < this.mainFilterArrayAvgProjGroup.length; i++) {
        Button = " ";
        if (this.mainFilterArrayAvgProjGroup.length > 0) {
          if (this.mainFilterArrayAvgProjGroup[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayAvgProjGroup[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayAvgProjGroup.length > 0) {
          if (this.mainFilterArrayAvgProjGroup[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayAvgProjGroup[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayAvgProjGroup[i]['filter'].length; j++) {
          if (this.mainFilterArrayAvgProjGroup[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayAvgProjGroup[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayAvgProjGroup[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayAvgProjGroup[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayAvgProjGroup[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayAvgProjGroup[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayAvgProjGroup[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayAvgProjGroup[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayAvgProjGroup[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayAvgProjGroup[i]['buttons']['AND'] == false && this.mainFilterArrayAvgProjGroup[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayAvgProjGroup[i]['filter'].length > 0) {
                  if (this.mainFilterArrayAvgProjGroup[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayAvgProjGroup[i]['filter'].length > 0) {
                  if (this.mainFilterArrayAvgProjGroup[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayAvgProjGroup[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersAvgProjGroup = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayAvgProjGroup[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayAvgProjGroup[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayAvgProjGroup[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersAvgProjGroup = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayAvgProjGroup[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayAvgProjGroup[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterAvgProGrp = this.filterAvgProGrp + this.filtersAvgProjGroup;
              }
        }
        this.filterAvgProGrp = this.filterAvgProGrp + "))";
      }
      if (isok == true) {
        console.log(this.filterAvgProGrp);
        this.filterAvgProGrp = ' AND ' + this.filterAvgProGrp;
        this.getFederationReport();
        this.isVisibleAvgProjGroup = false;
      }
    }
    else {
      this.getFederationReport();
      this.isVisibleAvgProjGroup = false
    }
  }
  filterAvgProGrp = '';
  AddFilterGroupAvgProjGroup() {
    this.mainFilterArrayAvgProjGroup.push({
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
  AddFilterAvgProjGroup(i: any) {
    this.mainFilterArrayAvgProjGroup[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }
  ANDBUTTONLASTAvgProjGroup(i: any) {
    this.mainFilterArrayAvgProjGroup[i]['buttons']['AND'] = true
    this.mainFilterArrayAvgProjGroup[i]['buttons']['OR'] = false;
  }
  ORBUTTONLASTAvgProjGroup(i: any) {
    this.mainFilterArrayAvgProjGroup[i]['buttons']['AND'] = false
    this.mainFilterArrayAvgProjGroup[i]['buttons']['OR'] = true;
  }
  ANDBUTTONLASTAvgProjGroup1(i: any, j: any) {
    this.mainFilterArrayAvgProjGroup[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayAvgProjGroup[i]['filter'][j]['buttons']['AND'] = true;
  }
  ORBUTTONLASTAvgProjGroup1(i: any, j: any) {
    this.mainFilterArrayAvgProjGroup[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayAvgProjGroup[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Total Beneficieries
  mainFilterArrayTotalBenefic = [];
  filtersTotalBenefic = "";
  isVisibleTotalBenefic = false;

  ClearFilterTotalBenefic() {
    this.mainFilterArrayTotalBenefic = [];
    this.filtertotBenef = '';
    this.mainFilterArrayTotalBenefic.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }
  showModalTotalBenefic() {
    this.isVisibleTotalBenefic = true;
    this.ModelName = "Project Total Beneficiaries Filter";
    this.model = "PROJECT_TOTAL_BENEFICIARIES";
  }
  CloseTotalBenefic() {
    this.isVisibleTotalBenefic = false;
  }
  CloseGroupTotalBenefic(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterArrayTotalBenefic.splice(i, 1);
      return true;
    }
  }
  CloseGroupTotalBenefic1(i: any, j: any) {
    if (this.mainFilterArrayTotalBenefic[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterArrayTotalBenefic[i]['filter'].splice(j, 1);
      return true;
    }
  }
  ApplyFilterTotalBenefic() {
    if (this.mainFilterArrayTotalBenefic.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filtertotBenef = '';
      for (let i = 0; i < this.mainFilterArrayTotalBenefic.length; i++) {
        Button = " ";
        if (this.mainFilterArrayTotalBenefic.length > 0) {
          if (this.mainFilterArrayTotalBenefic[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayTotalBenefic[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayTotalBenefic.length > 0) {
          if (this.mainFilterArrayTotalBenefic[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayTotalBenefic[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayTotalBenefic[i]['filter'].length; j++) {
          if (this.mainFilterArrayTotalBenefic[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayTotalBenefic[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayTotalBenefic[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayTotalBenefic[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayTotalBenefic[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayTotalBenefic[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayTotalBenefic[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayTotalBenefic[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayTotalBenefic[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayTotalBenefic[i]['buttons']['AND'] == false && this.mainFilterArrayTotalBenefic[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayTotalBenefic[i]['filter'].length > 0) {
                  if (this.mainFilterArrayTotalBenefic[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayTotalBenefic[i]['filter'].length > 0) {
                  if (this.mainFilterArrayTotalBenefic[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayTotalBenefic[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersTotalBenefic = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayTotalBenefic[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayTotalBenefic[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayTotalBenefic[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersTotalBenefic = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayTotalBenefic[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayTotalBenefic[i]['filter'][j]['INPUT'] + "'";
                }
                this.filtertotBenef = this.filtertotBenef + this.filtersTotalBenefic;
              }
        }
        this.filtertotBenef = this.filtertotBenef + "))";
      }
      if (isok == true) {
        console.log(this.filtertotBenef);
        this.filtertotBenef = ' AND ' + this.filtertotBenef;
        this.getFederationReport();
        this.isVisibleTotalBenefic = false;
      }
    }
    else {
      this.getFederationReport();
      this.isVisibleTotalBenefic = false
    }
  }
  filtertotBenef = '';
  AddFilterGroupTotalBenefic() {
    this.mainFilterArrayTotalBenefic.push({
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
  AddFilterTotalBenefic(i: any) {
    this.mainFilterArrayTotalBenefic[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }
  ANDBUTTONLASTTotalBenefic(i: any) {
    this.mainFilterArrayTotalBenefic[i]['buttons']['AND'] = true
    this.mainFilterArrayTotalBenefic[i]['buttons']['OR'] = false;
  }
  ORBUTTONLASTTotalBenefic(i: any) {
    this.mainFilterArrayTotalBenefic[i]['buttons']['AND'] = false
    this.mainFilterArrayTotalBenefic[i]['buttons']['OR'] = true;
  }
  ANDBUTTONLASTTotalBenefic1(i: any, j: any) {
    this.mainFilterArrayTotalBenefic[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayTotalBenefic[i]['filter'][j]['buttons']['AND'] = true;
  }
  ORBUTTONLASTTotalBenefic1(i: any, j: any) {
    this.mainFilterArrayTotalBenefic[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayTotalBenefic[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Average View Per Circular
  mainFilterArrayAvgViewCircu = [];
  filtersAvgViewCircu = "";
  isVisibleAvgViewCircu = false;

  ClearFilterAvgViewCircu() {
    this.mainFilterArrayAvgViewCircu = [];
    this.filterViewCir = '';
    this.mainFilterArrayAvgViewCircu.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }
  showModalAvgViewCircu() {
    this.isVisibleAvgViewCircu = true;
    this.ModelName = "Avg View Circular Filter";
    this.model = "AVG_VIEW_PER_CIRCULAR";
  }
  CloseAvgViewCircu() {
    this.isVisibleAvgViewCircu = false;
  }
  CloseGroupAvgViewCircu(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterArrayAvgViewCircu.splice(i, 1);
      return true;
    }
  }
  CloseGroupAvgViewCircu1(i: any, j: any) {
    if (this.mainFilterArrayAvgViewCircu[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterArrayAvgViewCircu[i]['filter'].splice(j, 1);
      return true;
    }
  }
  ApplyFilterAvgViewCircu() {
    if (this.mainFilterArrayAvgViewCircu.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterViewCir = '';
      for (let i = 0; i < this.mainFilterArrayAvgViewCircu.length; i++) {
        Button = " ";
        if (this.mainFilterArrayAvgViewCircu.length > 0) {
          if (this.mainFilterArrayAvgViewCircu[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayAvgViewCircu[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayAvgViewCircu.length > 0) {
          if (this.mainFilterArrayAvgViewCircu[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayAvgViewCircu[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayAvgViewCircu[i]['filter'].length; j++) {
          if (this.mainFilterArrayAvgViewCircu[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayAvgViewCircu[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayAvgViewCircu[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayAvgViewCircu[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayAvgViewCircu[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayAvgViewCircu[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayAvgViewCircu[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayAvgViewCircu[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayAvgViewCircu[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayAvgViewCircu[i]['buttons']['AND'] == false && this.mainFilterArrayAvgViewCircu[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayAvgViewCircu[i]['filter'].length > 0) {
                  if (this.mainFilterArrayAvgViewCircu[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayAvgViewCircu[i]['filter'].length > 0) {
                  if (this.mainFilterArrayAvgViewCircu[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayAvgViewCircu[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayAvgViewCircu[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayAvgViewCircu[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayAvgViewCircu[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayAvgViewCircu[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersAvgViewCircu = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayAvgViewCircu[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayAvgViewCircu[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayAvgViewCircu[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersAvgViewCircu = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayAvgViewCircu[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayAvgViewCircu[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterViewCir = this.filterViewCir + this.filtersAvgViewCircu;
              }
        }
        this.filterViewCir = this.filterViewCir + "))";
      }
      if (isok == true) {
        console.log(this.filterViewCir);
        this.filterViewCir = ' AND ' + this.filterViewCir;
        this.getFederationReport();
        this.isVisibleAvgViewCircu = false;
      }
    }
    else {
      this.getFederationReport();
      this.isVisibleAvgViewCircu = false
    }
  }
  filterViewCir = '';
  AddFilterGroupAvgViewCircu() {
    this.mainFilterArrayAvgViewCircu.push({
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
  AddFilterAvgViewCircu(i: any) {
    this.mainFilterArrayAvgViewCircu[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }
  ANDBUTTONLASTAvgViewCircu(i: any) {
    this.mainFilterArrayAvgViewCircu[i]['buttons']['AND'] = true
    this.mainFilterArrayAvgViewCircu[i]['buttons']['OR'] = false;
  }
  ORBUTTONLASTAvgViewCircu(i: any) {
    this.mainFilterArrayAvgViewCircu[i]['buttons']['AND'] = false
    this.mainFilterArrayAvgViewCircu[i]['buttons']['OR'] = true;
  }
  ANDBUTTONLASTAvgViewCircu1(i: any, j: any) {
    this.mainFilterArrayAvgViewCircu[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayAvgViewCircu[i]['filter'][j]['buttons']['AND'] = true;
  }
  ORBUTTONLASTAvgViewCircu1(i: any, j: any) {
    this.mainFilterArrayAvgViewCircu[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayAvgViewCircu[i]['filter'][j]['buttons']['AND'] = false;
  }

  // Total Time 
  mainFilterArrayMeetTime = [];
  filtersMeetTime = "";
  isVisibleMeetTime = false;
  ClearFilterMeetTime() {
    this.mainFilterArrayMeetTime = [];
    this.filterMeetTimming = '';
    this.mainFilterArrayMeetTime.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }
  showModalMeetTime() {
    this.isVisibleMeetTime = true;
    this.ModelName = "Meeting Time Filter";
    this.model = "MEETING_TIME";
  }
  CloseMeetTime() {
    this.isVisibleMeetTime = false;
  }
  CloseGroupMeetTime(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterArrayMeetTime.splice(i, 1);
      return true;
    }
  }
  CloseGroupMeetTime1(i: any, j: any) {
    if (this.mainFilterArrayMeetTime[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterArrayMeetTime[i]['filter'].splice(j, 1);
      return true;
    }
  }
  ApplyFilterMeetTime() {
    if (this.mainFilterArrayMeetTime.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filterMeetTimming = "";
      for (let i = 0; i < this.mainFilterArrayMeetTime.length; i++) {
        Button = " ";
        if (this.mainFilterArrayMeetTime.length > 0) {
          if (this.mainFilterArrayMeetTime[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArrayMeetTime[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArrayMeetTime.length > 0) {
          if (this.mainFilterArrayMeetTime[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArrayMeetTime[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArrayMeetTime[i]['filter'].length; j++) {
          if (this.mainFilterArrayMeetTime[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArrayMeetTime[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArrayMeetTime[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayMeetTime[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayMeetTime[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArrayMeetTime[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArrayMeetTime[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArrayMeetTime[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArrayMeetTime[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArrayMeetTime[i]['buttons']['AND'] == false && this.mainFilterArrayMeetTime[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArrayMeetTime[i]['filter'].length > 0) {
                  if (this.mainFilterArrayMeetTime[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArrayMeetTime[i]['filter'].length > 0) {
                  if (this.mainFilterArrayMeetTime[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayMeetTime[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersMeetTime = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayMeetTime[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayMeetTime[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayMeetTime[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersMeetTime = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayMeetTime[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayMeetTime[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterMeetTimming = this.filterMeetTimming + this.filtersMeetTime;
              }
        }
        this.filterMeetTimming = this.filterMeetTimming + "))";
      }
      if (isok == true) {
        console.log(this.filterMeetTimming);
        this.filterMeetTimming = ' AND ' + this.filterMeetTimming;
        this.getFederationReport();
        this.isVisibleMeetTime = false;
      }
    }
    else {
      this.getFederationReport();
      this.isVisibleMeetTime = false
    }
  }
  filterMeetTimming = '';
  AddFilterGroupMeetTime() {
    this.mainFilterArrayMeetTime.push({
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
  AddFilterMeetTime(i: any) {
    this.mainFilterArrayMeetTime[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }
  ANDBUTTONLASTMeetTime(i: any) {
    this.mainFilterArrayMeetTime[i]['buttons']['AND'] = true
    this.mainFilterArrayMeetTime[i]['buttons']['OR'] = false;
  }
  ORBUTTONLASTMeetTime(i: any) {
    this.mainFilterArrayMeetTime[i]['buttons']['AND'] = false
    this.mainFilterArrayMeetTime[i]['buttons']['OR'] = true;
  }
  ANDBUTTONLASTMeetTime1(i: any, j: any) {
    this.mainFilterArrayMeetTime[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArrayMeetTime[i]['filter'][j]['buttons']['AND'] = true;
  }
  ORBUTTONLASTMeetTime1(i: any, j: any) {
    this.mainFilterArrayMeetTime[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArrayMeetTime[i]['filter'][j]['buttons']['AND'] = false;
  }
  ScheduleTitle = '';
  ScheduleVisible: boolean = false;
  ScheduleData: REPORTSCHEDULE = new REPORTSCHEDULE();
  dataList = [];
  goToSchedule(reset: boolean = false, loadMore: boolean = false): void {
    this.ScheduleTitle = "Federation Report";
    this.ScheduleData = new REPORTSCHEDULE();
    this.ScheduleData.SCHEDULE = 'D';
    this.ScheduleData.SORT_KEY = this.sortKey;
    this.ScheduleData.SORT_VALUE = this.sortValue;
    // this.ScheduleData.FILTER_QUERY = this.all_filter + " AND YEAR = '" + this.SelectedYear+"'";
    var f_filtar = ''
    if (this.federationId != 0) {
      f_filtar = " AND FEDERATION_ID=" + this.federationId;
    } else if (this.GroupId != 0) {
      f_filtar = " AND GROUP_ID=" + this.GroupId;
    } else if (this.UnitId != 0) {
      f_filtar = " AND UNIT_ID=" + this.UnitId;
    }
    this.ScheduleData.FILTER_QUERY = this.all_filter + " AND YEAR='" + this.SelectedYear + "'" + f_filtar;
    // this.ScheduleData.FILTER_QUERY = this.all_filter;
    this.ScheduleData.REPORT_ID = 11;
    this.ScheduleData.USER_ID = parseInt(this._cookie.get('userId'));
    console.log("SortKey", this.ScheduleData.SORT_KEY, "SortValue", this.ScheduleData.SORT_VALUE);

    // getschedule(IDForSearching, ) {

    // this.IDForSearching = IDForSearching;
    this.api.getScheduledReport(this.pageIndex, this.pageSize, '', '', '' + 'AND STATUS=0 AND REPORT_ID=' + this.ScheduleData.REPORT_ID).subscribe(data => {
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
    // }
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

  goToClear() {
    this.mainFilterArrayMeet = [];
    this.mainFilterArrayMeetPlanned = [];
    this.mainFilterArrayMeetConduct = [];
    this.mainFilterArrayAvgAttend = [];
    this.mainFilterArrayAvgMeetPerDay = [];
    this.mainFilterArrayAvgMeetPerGroup = [];
    this.mainFilterArrayTotalPostLikes = [];
    this.mainFilterArrayTotalPostComment = [];
    this.mainFilterArrayAvgPostPerMember = [];
    this.mainFilterArrayAvgLikePerMember = [];
    this.mainFilterArrayAvgCommentPerMember = [];
    this.mainFilterArrayNoOfShares = [];
    this.mainFilterArrayEventPlanned = [];
    this.mainFilterArrayEventConducted = [];
    this.mainFilterArrayEventTotalBeneficiaries = [];
    this.mainFilterArrayTotCircularCreated = [];
    this.mainFilterArrayCircuPublished = [];
    this.mainFilterArrayCompletedProj = [];
    this.mainFilterArrayOnGoingProj = [];
    this.mainFilterArrayTotFundUtilize = [];
    this.mainFilterArrayAvgFundProj = [];
    this.mainFilterArrayAvgProjGroup = [];
    this.mainFilterArrayTotalBenefic = [];
    this.mainFilterArrayAvgViewCircu = [];
    this.mainFilterArrayMeetTime = [];
    this.mainFilterArrayMeetPlanned = [];
    this.mainFilterArrayPost = [];
    this.mainFilterArrayfednm = [];
    this.mainFilterArrayUnitCount = [];
    this.mainFilterArraygrpcount = [];
    this.mainFilterArraymemcount = [];
    this.mainFilterArrayProject = [];
    this.filterMeetingCount = '';
    this.ApplyfilterPost = '';
    this.ApplyfilterEvent = '';
    this.filterCircular = '';
    this.filterProjcoun = '';
    this.filterMeetPlan = '';
    this.filterMeetCond = '';
    this.filterAvgAttendence = '';
    this.filterMeetPerDay = '';
    this.filterMeetpergrp = '';
    this.filterPostLike = '';
    this.filterPostComm = '';
    this.filterPostPerMem = '';
    this.filterlikeperMem = '';
    this.filterCommentPerMem = '';
    this.filterShares = '';
    this.filterEventPlan = '';
    this.filterEventConduct = '';
    this.filterTotBenefi = '';
    this.filterTotCircCreate = '';
    this.filterCircPubl = '';
    this.filterTView = '';
    this.filterCompProj = '';
    this.filterOnGoProj = '';
    this.filterFundUtil = '';
    this.filterFundProj = '';
    this.filterAvgProGrp = '';
    this.filtertotBenef = '';
    this.filterViewCir = '';
    this.filterMeetTimming = '';
    this.filtergrpReport = '';
    this.filterfednm = '';
    this.filterUnitCount = '';
    this.filtermemCount = '';
    this.ForClearFilter();
    this.getFederationReport();
  }

  ForClearFilter() {

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
    this.mainFilterArrayEvent.push({
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
    this.mainFilterArrayMeet.push({
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
    this.mainFilterArrayAvgProjGroup.push({
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
    this.mainFilterArrayTotalBenefic.push({
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
    this.mainFilterArrayAvgFundProj.push({
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
    this.mainFilterArrayTotFundUtilize.push({
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
    this.mainFilterArrayOnGoingProj.push({
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
    this.mainFilterArrayCompletedProj.push({
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
    this.mainFilterArrayCircuPublished.push({
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
    this.mainFilterArrayTotCircularCreated.push({
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
    // this.mainFilterArrayTopType.push({
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
    this.mainFilterArrayAvgViewCircu.push({
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
    this.mainFilterArrayEventTotalBeneficiaries.push({
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
    this.mainFilterArrayEventConducted.push({
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
    this.mainFilterArrayNoOfShares.push({
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
    this.mainFilterArrayAvgCommentPerMember.push({
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
    this.mainFilterArrayAvgLikePerMember.push({
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
    this.mainFilterArrayMeetTime.push({
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
    this.mainFilterArrayAvgPostPerMember.push({
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
    this.mainFilterArrayAvgMeetPerGroup.push({
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
    this.mainFilterArrayAvgMeetPerDay.push({
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
    this.mainFilterArrayAvgAttend.push({
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
    this.mainFilterArrayMeetConduct.push({
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
    this.mainFilterArraymemcount.push({
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
  }


  mainFilterArrayfednm = [];
  filtersfednm = "";
  isVisiblefednm = false;
  ClearFilterfednm() {
    this.mainFilterArrayfednm = [];
    this.filterfednm = '';
    this.mainFilterArrayfednm.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }
  showModalfednm() {
    this.isVisiblefednm = true;
    this.ModelName = "Federation Filter";
    this.model = "NAME";
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
        this.getFederationReport();
        this.isVisiblefednm = false;
      }
    }
    else {
      this.getFederationReport();
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
    this.getFederationReport();
  }
  showModalgrpcount() {
    this.isVisiblegrpcount = true;
    this.ModelName = "Group Count Filter";
    this.model = "GROUP_COUNT";
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
            if ((this.mainFilterArraygrpcount[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArraygrpcount[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArraygrpcount[i]['filter'][j]['DROPDOWN'] == "Between")) {
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
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArraygrpcount[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersgrpcount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArraygrpcount[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArraygrpcount[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArraygrpcount[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersgrpcount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArraygrpcount[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArraygrpcount[i]['filter'][j]['INPUT'] + "'";
                }
                this.filtergrpReport = this.filtergrpReport + this.filtersgrpcount;
              }
        }
        this.filtergrpReport = this.filtergrpReport + "))";
      }
      console.log(this.filtergrpReport);
      if (isok == true) {
        this.filtergrpReport = ' AND ' + this.filtergrpReport;
        this.getFederationReport();
        this.isVisiblegrpcount = false
      }
    }
    else {
      this.getFederationReport();
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
    this.getFederationReport();
  }
  showModalUnitcount() {
    this.isVisibleUnitCount = true;
    this.ModelName = "Unit Count Filter";
    this.model = "UNIT_COUNT";
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
            if ((this.mainFilterArrayUnitCount[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArrayUnitCount[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArrayUnitCount[i]['filter'][j]['DROPDOWN'] == "Between")) {
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
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArrayUnitCount[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersUnitCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayUnitCount[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayUnitCount[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArrayUnitCount[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersUnitCount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArrayUnitCount[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArrayUnitCount[i]['filter'][j]['INPUT'] + "'";
                }
                this.filterUnitCount = this.filterUnitCount + this.filtersUnitCount;
              }
        }
        this.filterUnitCount = this.filterUnitCount + "))";
      }
      console.log(this.filterUnitCount);
      if (isok == true) {
        this.filterUnitCount = ' AND ' + this.filterUnitCount;
        this.getFederationReport();
        this.isVisibleUnitCount = false
      }
    }
    else {
      this.getFederationReport();
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
  mainFilterArraymemcount = [];
  filtersmemcount = "";
  isVisiblememcount = false;
  ClearFiltermemcount() {
    this.mainFilterArraymemcount = [];
    this.filtermemCount = '';
    this.mainFilterArraymemcount.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getFederationReport();
  }
  showModalMemcount() {
    this.isVisiblememcount = true;
    this.ModelName = "Member Count Filter";
    this.model = "MEMBER_COUNT";
  }
  Closememcount() {
    this.isVisiblememcount = false;
    // this.filtermemCount=''
  }
  CloseGroupmemcount(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.mainFilterArraymemcount.splice(i, 1);
      return true;
    }
  }
  CloseGroupmemcount1(i: any, j: any) {
    if (this.mainFilterArraymemcount[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.mainFilterArraymemcount[i]['filter'].splice(j, 1);
      return true;
    }
  }
  ApplyFiltermemcount() {
    if (this.mainFilterArraymemcount.length != 0) {
      var isok = true;
      var Button = " ";
      this.filter = "";
      this.filtermemCount = "";
      for (let i = 0; i < this.mainFilterArraymemcount.length; i++) {
        Button = " ";
        if (this.mainFilterArraymemcount.length > 0) {
          if (this.mainFilterArraymemcount[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterArraymemcount[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + "  ";
            }
          }
        }
        if (this.mainFilterArraymemcount.length > 0) {
          if (this.mainFilterArraymemcount[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterArraymemcount[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }
        for (let j = 0; j < this.mainFilterArraymemcount[i]['filter'].length; j++) {
          if (this.mainFilterArraymemcount[i]['filter'][j]['INPUT'] == undefined || this.mainFilterArraymemcount[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Input', 'Please fill the field');
            isok = false;
          } else
            if ((this.mainFilterArraymemcount[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterArraymemcount[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterArraymemcount[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input2', 'Please fill the field');
              isok = false;
            } else

              if (this.mainFilterArraymemcount[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterArraymemcount[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }
              else if (this.mainFilterArraymemcount[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterArraymemcount[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else if (this.mainFilterArraymemcount[i]['buttons']['AND'] == false && this.mainFilterArraymemcount[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Clike On The Button');
                isok = false;
              }
              else {
                var Button1 = "((";
                if (this.mainFilterArraymemcount[i]['filter'].length > 0) {
                  if (this.mainFilterArraymemcount[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }
                if (this.mainFilterArraymemcount[i]['filter'].length > 0) {
                  if (this.mainFilterArraymemcount[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }
                // this.mainFilterArrayPost[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT'], "yyyy-MM-dd");
                if (this.mainFilterArraymemcount[i]['filter'][j]['DROPDOWN'] == "Between") {
                  // this.mainFilterArrayPost[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArrayPost[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");

                  this.filtersmemcount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArraymemcount[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArraymemcount[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArraymemcount[i]['filter'][j]['INPUT2'] + "'";
                } else {
                  this.filtersmemcount = Button + Button1 + ' ' + this.model + " " + this.mainFilterArraymemcount[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArraymemcount[i]['filter'][j]['INPUT'] + "'";
                }
                this.filtermemCount = this.filtermemCount + this.filtersmemcount;
              }
        }
        this.filtermemCount = this.filtermemCount + "))";
      }
      console.log(this.filtermemCount);
      if (isok == true) {
        this.filtermemCount = ' AND ' + this.filtermemCount;
        this.getFederationReport();
        this.isVisiblememcount = false
      }
    }
    else {
      this.getFederationReport();
      this.isVisiblememcount = false
    }
  }
  filtermemCount = '';
  AddFilterGroupmemcount() {
    this.mainFilterArraymemcount.push({
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
  AddFiltermemcount(i: any, j: any) {
    this.mainFilterArraymemcount[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }
  ANDBUTTONLASTmemcount(i: any) {
    this.mainFilterArraymemcount[i]['buttons']['AND'] = true
    this.mainFilterArraymemcount[i]['buttons']['OR'] = false;
  }
  ORBUTTONLASTmemcount(i: any) {
    this.mainFilterArraymemcount[i]['buttons']['AND'] = false
    this.mainFilterArraymemcount[i]['buttons']['OR'] = true;
  }
  ANDBUTTONLASTmemcount1(i: any, j: any) {
    this.mainFilterArraymemcount[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterArraymemcount[i]['filter'][j]['buttons']['AND'] = true;
  }
  ORBUTTONLASTmemcount1(i: any, j: any) {
    this.mainFilterArraymemcount[i]['filter'][j]['buttons']['OR'] = true
    this.mainFilterArraymemcount[i]['filter'][j]['buttons']['AND'] = false;
  }
}
