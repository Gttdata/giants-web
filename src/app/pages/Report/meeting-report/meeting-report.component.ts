import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { REPORTSCHEDULE } from 'src/app/Models/report-schedule';
import { ApiService } from 'src/app/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';
import { differenceInCalendarDays, setHours } from 'date-fns';

@Component({
  selector: 'app-meeting-report',
  templateUrl: './meeting-report.component.html',
  styleUrls: ['./meeting-report.component.css']
})

export class MeetingReportComponent implements OnInit {
  columns: string[][] = [
    ["FEDERATION_NAME", "Federation Name"], ["UNIT_NAME", "Name Of Unit "],
    ["GROUP_NAME", "Name Of Group "], ["DATE", "Meeting Date"], ["MEETING_SUB", "Meeting Name"],
    ["MEETING_TIME", "Meeting Total Time"], ["TO_TIME", "Meeting End Time"], ["FROM_TIME", "Meeting Start Time"],
    ["INVITEES", "Total Invites"], ["MEETING_ATTENDANCE", "Attempted Project"], ["STATUS", "Status"], ['VENUE', 'Venue']];
  Operators: string[][] = [["Between", "Between"], ["=", "="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["<>", "!="]];
  Operators_name: string[][] = [["Start With", "Start With"], ["End With", "End With"], ["=", "="], ["<>", "!="], ['Content', 'Content']];
  Operators_Status: string[][] = [["=", "="], ["<>", "!="]];
  Operator_Status: string[][] = [["P", "Panding"], ["C", "Complete"]];
  all_filter = '';
  multipleValue: any[] = [];
  formTitle: string = "Meeting Report";
  size = 'default';
  YEAR: any;
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  abc = '';
  loadingRecords: boolean = true;
  year = new Date().getFullYear();
  baseYear: number = 2020;
  range: any[] = [];
  next_year = Number(this.year + 1);
  SelectedYear: any;
  tagValue1: string[] = ["Federation Name", "Name Of Unit", "Name Of Group", "Name Of Member", "Meeting Name", "Meeting Total Time", "Meeting Start Time", "Total Invite", "Attempted Project", "Status"]
  tagValue: string[] = ["Select All", "Federation Name", "Name Of Unit", "Name Of Group", "Name Of Member", "Meeting Name", "Meeting Conducted By", "Meeting Total Time", "Meeting Start Time", "Meeting End Time", "Total Invite", "Attempted Project", "Status"]
  exportLoading1: boolean = false;
  searchText: string = "";
  sortValue: string = "asc";
  sortKey: string = "ID";
  federations: any[] = [];
  federation: any[] = [];
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
  Col1: boolean = true;
  Col2: boolean = true;
  Col3: boolean = true;
  Col4: boolean = true;
  Col5: boolean = true;
  Col15: boolean = true;
  Col6: boolean = true;
  Col7: boolean = true;
  Col17: boolean = true;
  Col8: boolean = true;
  Col18: boolean = true;
  Col19: boolean = true;
  Col10: boolean = true;
  VALUE = [];
  SelectColumn = [];
  SelectColumn1 = [];
  mainFilterArray = []
  mainFilterMeetingNameArray = []
  mainFilterConductedArray = []
  mainFilterTotalTimeArray = []
  mainFilterStartTimeArray = []
  mainFilterEndTimeArray = []
  mainFilterInvitiesArray = []
  mainFilterAttemptedArray = []
  mainFilterStatusArray = []
  mainFilterVenueArray = []
  mainFilterUnitArray = [];
  mainFilterGroupArray = [];
  mainFilterFederationArray = []
  filterGroup = '';
  filterFederation = '';
  filterUnit = '';
  filterMeetingDate = '';
  filterMeetingName = '';
  filterConducted = '';
  filterTotalTime = '';
  filterStartTime = '';
  filterEndTime = '';
  filterInvities = '';
  filterAttempted = '';
  filterStatus = '';
  filterVenue = '';
  model = "";
  model_name = '';
  filter = "";

  constructor(public api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService, private _exportService: ExportService) { }

  today = new Date();

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    else
      return true;
  }

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) < 0;

  isVisible = false;

  onChange(colName: string[]): void {
    this.columns = [];
    this.SelectColumn1 = this.nodes[0]['children'];
    this.Col1 = true;
    this.Col2 = true;
    this.Col3 = true;
    this.Col4 = true;
    this.Col5 = false;
    this.Col15 = false;
    this.Col6 = false;
    this.Col7 = false;
    this.Col17 = false;
    this.Col8 = false;
    this.Col18 = false;
    this.Col19 = false;
    this.Col10 = false;

    for (let i = 0; i <= 8; i++) {
      if (this.tagValue[i] == "Federation Name") { this.Col1 = true; }
      if (this.tagValue[i] == "Name Of Unit") { this.Col2 = true; }
      if (this.tagValue[i] == "Name Of Group") { this.Col3 = true; }
      if (this.tagValue[i] == "Meeting Date") { this.Col4 = true; }
      if (this.tagValue[i] == "Meeting Name") { this.Col5 = true; }
      if (this.tagValue[i] == "Meeting Conducted By") { this.Col15 = true; }
      if (this.tagValue[i] == "Meeting Total Time") { this.Col6 = true; }
      if (this.tagValue[i] == "Meeting Start Time") { this.Col7 = true; }
      if (this.tagValue[i] == "Meeting End Time") { this.Col17 = true; }
      if (this.tagValue[i] == "Total Invite") { this.Col8 = true; }
      if (this.tagValue[i] == "Attempted Project") { this.Col18 = true; }
      if (this.tagValue[i] == "Status") { this.Col19 = true; }
      if (this.tagValue[i] == "Venue") { this.Col10 = true; }
    }

    if (this.tagValue[0] == "Select All") {
      this.Col1 = true;
      this.Col2 = true;
      this.Col3 = true;
      this.Col4 = true;
      this.Col5 = true;
      this.Col15 = true;
      this.Col6 = true;
      this.Col7 = true;
      this.Col17 = true;
      this.Col8 = true;
      this.Col18 = true;
      this.Col19 = true;
      this.Col10 = true;
    }
  }

  value: string[] = ['0-0-0'];
  nodes = [{
    title: 'Select All', value: 'Select All', key: 'Select All',
    children: [
      {
        title: 'Meeting Name',
        value: 'Meeting Name',
        key: 'Meeting Name',
        isLeaf: true
      },
      {
        title: 'Meeting Conducted By',
        value: 'Meeting Conducted By',
        key: 'Meeting Conducted By',
        isLeaf: true
      },
      {
        title: 'Meeting Total Time',
        value: 'Meeting Total Time',
        key: 'Meeting Total Time',
        isLeaf: true
      },
      {
        title: 'Meeting Start Time',
        value: 'Meeting Start Time',
        key: 'Meeting Start Time',
        isLeaf: true
      },
      {
        title: 'Meeting End Time',
        value: 'Meeting End Time',
        key: 'Meeting End Time',
        isLeaf: true
      },
      {
        title: 'Total Invite',
        value: 'Total Invite',
        key: 'Total Invite',
        isLeaf: true
      },
      {
        title: 'Attempted Project',
        value: 'Attempted Project',
        key: 'Attempted Project',
        isLeaf: true
      },
      {
        title: 'Status',
        value: 'Status',
        key: 'Status',
        isLeaf: true
      },
      {
        title: 'Venue',
        value: 'Venue',
        key: 'Venue',
        isLeaf: true
      }
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

  SelectYear(YEARs: any) {
    this.SelectedYear = YEARs;
    this.filter = '';
    this.getFederation();
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
      this.exportLoading1 = true;

      this.api.getReportMeeting(0, 0, this.sortKey, this.sortValue, filters, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {
        if (data['code'] == 200) {
          this.dataListForExport = data['data'];
          this.totalRecords = data['count'];
          this.exportLoading1 = false;
          this.convertInExcel();
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");

        this.exportLoading1 = false;
      });

    } else if (exportToPDF) {
      this.api.getReportMeeting(0, 0, this.sortKey, this.sortValue, filters, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {
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
      this.loadingRecords = true;

      this.api.getReportMeeting(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, filters, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.federations = data['data'];
          this.totalRecords = data['count'];

        } else {
          this.loadingRecords = false;
          this.message.error("Server Not Found", "");
        }

      }, err => {
        this.loadingRecords = false;

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
      obj1['Federation Name'] = this.dataListForExport[i]['FEDERATION_NAME'];
      obj1['Name of Unit'] = this.dataListForExport[i]['UNIT_NAME'];
      obj1['Name ofGroup'] = this.dataListForExport[i]['GROUP_NAME'];
      obj1['Meeting Date'] = this.datePipe.transform(this.dataListForExport[i]['DATE'], 'dd-MMM-yyyy');

      if (this.Col5 == true) { obj1['Meeting Name'] = this.dataListForExport[i]['MEETING_SUB']; }
      if (this.Col15 == true) { obj1['Meeting Conducted by'] = this.dataListForExport[i]['CREATOR_NAME']; }
      if (this.Col6 == true) { obj1['Total Time Of Meeting'] = this.dataListForExport[i]['MEETING_TIME']; }
      if (this.Col7 == true) { obj1['Meeting Start Time'] = this.datePipe.transform(new Date('1997-12-12 ' + this.dataListForExport[i]['FROM_TIME']), 'hh-mm a'); }
      if (this.Col17 == true) { obj1['Meeting End Time'] = this.datePipe.transform(new Date('1997-12-12 ' + this.dataListForExport[i]['TO_TIME']), 'hh-mm a'); }
      if (this.Col8 == true) { obj1['Total Invites'] = this.dataListForExport[i]['INVITEES']; }
      if (this.Col18 == true) { obj1['Project Attempted'] = this.dataListForExport[i]['MEETING_ATTENDANCE']; }

      if (this.Col19 == true) {
        if (this.dataListForExport[i]['STATUS'] == 'C') {
          obj1['Status'] = "Completed";

        } else {
          obj1['Status'] = "Pending";
        }
      }

      if (this.Col10 == true) { obj1['Venue'] = this.dataListForExport[i]['VENUE']; }
      arry1.push(Object.assign({}, obj1));

      if (i == this.dataListForExport.length - 1) {
        this._exportService.exportExcel(arry1, 'Meeting Report' + this.datePipe.transform(new Date(), 'dd-MMM-yy, hh mm ss a'));
      }
    }
  }

  getFederation() {
    this.loadingRecords = true;
    this.all_filter = this.filterMeetingDate + this.filterMeetingName + this.filterConducted + this.filterTotalTime + this.filterStartTime + this.filterEndTime + this.filterInvities + this.filterAttempted + this.filterStatus + this.filterVenue;

    this.api.getReportMeeting(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, this.all_filter, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {
      if ((data['code'] == 200)) {
        this.federations = data['data'];
        this.totalRecords = data['count'];
        this.loadingRecords = false;

      } else {
        this.loadingRecords = false;
        this.message.error("Server Not Found", "");
      }

    }, err => {
      this.loadingRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  FEDERATION_ID = this._cookie.get("FEDERATION_ID");
  UNIT_ID = this._cookie.get("UNIT_ID");
  GROUP_ID = this._cookie.get("GROUP_ID");

  getFederationfilter() {
    if (this.filterAttempted == ') )') { this.filterAttempted = ''; }
    if (this.filterStartTime == ') )') { this.filterStartTime = ''; }
    if (this.filterEndTime == ') )') { this.filterEndTime = ''; }
    if (this.filterInvities == ') )') { this.filterInvities = ''; }
    if (this.filterStatus == ') )') { this.filterStatus = ''; }
    if (this.filterVenue == ') )') { this.filterVenue = ''; }
    if (this.filterTotalTime == ') )') { this.filterTotalTime = ''; }
    if (this.filterConducted == ') )') { this.filterConducted = ''; }
    if (this.filterMeetingName == ') )') { this.filterMeetingName = ''; }
    if (this.filterMeetingDate == ') )') { this.filterMeetingDate = ''; }
    if (this.filterFederation == ') )') { this.filterFederation = ''; }
    if (this.filterUnit == ') )') { this.filterUnit = ''; }
    if (this.filterGroup == ') )') { this.filterGroup = ''; }

    this.all_filter = this.filterGroup + this.filterUnit + this.filterMeetingDate + this.filterMeetingName + this.filterConducted + this.filterTotalTime + this.filterStartTime + this.filterEndTime + this.filterInvities + this.filterAttempted + this.filterStatus + this.filterVenue + this.filterFederation;

    this.api.getReportMeeting(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, this.all_filter, this.SelectedYear, this.FEDERATION_ID, this.GROUP_ID, this.UNIT_ID).subscribe(data => {
      if ((data['code'] == 200)) {
        this.federations = data['data'];
        this.totalRecords = data['count'];
        this.loadingRecords = false;

      } else {
        this.message.error("Server Not Found", "");
        this.loadingRecords = false;
      }

    }, err => {
      this.loadingRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
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
    this.mainFilterMeetingNameArray.push({
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
    this.mainFilterConductedArray.push({
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
    this.mainFilterTotalTimeArray.push({
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
    this.mainFilterStartTimeArray.push({
      filter: [{
        DROPDOWN: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });
    this.mainFilterEndTimeArray.push({
      filter: [{
        DROPDOWN: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });
    this.mainFilterInvitiesArray.push({
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
    this.mainFilterAttemptedArray.push({
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
    this.mainFilterVenueArray.push({
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

  // Federation Name
  isVisibleFederation: boolean = false;

  showModalFederation(): void {
    this.isVisibleFederation = true;
    this.model = "FEDERATION_NAME";
    this.model_name = 'Federation Name'
  }

  modelCancelFederation() {
    this.isVisibleFederation = false;
  }

  ANDBUTTONLASTFederation(i: any) {
    this.mainFilterFederationArray[i]['buttons']['AND'] = true
    this.mainFilterFederationArray[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTFederation(i: any) {
    this.mainFilterFederationArray[i]['buttons']['AND'] = false
    this.mainFilterFederationArray[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTFederation1(i: any, j: any) {
    this.mainFilterFederationArray[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterFederationArray[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTFederation1(i: any, j: any) {
    this.mainFilterFederationArray[i]['filter'][j]['buttons']['OR'] = true
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
    }
    );

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
          }

          else if (this.mainFilterFederationArray[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterFederationArray[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
            this.message.error('AND or OR', 'Please Click On The Button');
            isok = false;
          }

          else if (this.mainFilterFederationArray[i]['buttons']['AND'] == false && this.mainFilterFederationArray[i]['buttons']['OR'] == false && i > 0) {
            this.message.error('AND or OR', 'Please Click On The Button');
            isok = false;
          }

          else {
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

        this.filterFederation = this.filterFederation + ") )";
      }

      if (isok) {
        this.isVisibleFederation = false;
        this.filterFederation = ' AND ' + this.filterFederation;
        this.getFederationfilter();
      }
    }
  }

  // UNIT Name
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
          }

          else if (this.mainFilterUnitArray[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterUnitArray[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
            this.message.error('AND or OR', 'Please Click On The Button');
            isok = false;
          }

          else if (this.mainFilterUnitArray[i]['buttons']['AND'] == false && this.mainFilterUnitArray[i]['buttons']['OR'] == false && i > 0) {
            this.message.error('AND or OR', 'Please Click On The Button');
            isok = false;
          }

          else {
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

        this.filterUnit = this.filterUnit + ") )";
      }

      if (isok) {
        this.isVisibleUnit = false;
        this.filterUnit = ' AND ' + this.filterUnit;
        this.getFederationfilter();
      }
    }
  }

  // Group Name
  isVisibleGroup: boolean = false;

  showModalGroup(): void {
    this.isVisibleGroup = true;
    this.model = "GROUP_NAME";
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
          }

          else if (this.mainFilterGroupArray[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterGroupArray[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
            this.message.error('AND or OR', 'Please Click On The Button');
            isok = false;
          }

          else if (this.mainFilterGroupArray[i]['buttons']['AND'] == false && this.mainFilterGroupArray[i]['buttons']['OR'] == false && i > 0) {
            this.message.error('AND or OR', 'Please Click On The Button');
            isok = false;
          }

          else {
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

        this.filterGroup = this.filterGroup + ") )";
      }

      if (isok) {
        this.isVisibleGroup = false;
        this.filterGroup = ' AND ' + this.filterGroup;
        this.getFederationfilter();
      }
    }
  }

  // Meeting Date
  isVisibleMeetingDate: boolean = false;

  showModalMeetingDate(): void {
    this.isVisibleMeetingDate = true;
    this.model = "Date(DATE)";
    this.model_name = 'Meeting Date';
  }

  modelCancelMeetingDate() {
    this.isVisibleMeetingDate = false;
  }

  ANDBUTTONLASTMeetingDate(i: any) {
    this.mainFilterArray[i]['buttons']['AND'] = true;
    this.mainFilterArray[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTMeetingDate(i: any) {
    this.mainFilterArray[i]['buttons']['AND'] = false;
    this.mainFilterArray[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTMeetingDate1(i: any, j: any) {
    this.mainFilterArray[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterArray[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTMeetingDate1(i: any, j: any) {
    this.mainFilterArray[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterArray[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersMeetingDate = '';

  AddFilterGroupMeetingDate() {
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

  AddFilterMeetingDate(i: any, j: any) {
    this.mainFilterArray[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );

    return true;
  }

  CloseGroupMeetingDate(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterArray.splice(i, 1);
      return true;
    }
  }

  CloseGroupMeetingDate1(i: any, j: any) {
    if (this.mainFilterArray[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterArray[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearMeetingDate() {
    this.mainFilterArray = [];
    this.filterMeetingDate = '';

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

  ApplyFilterMeetingDate() {
    if (this.mainFilterArray.length != 0) {
      var isok = true;
      this.filterMeetingDate = "";

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
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }

              else if (this.mainFilterArray[i]['buttons']['AND'] == false && this.mainFilterArray[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
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

                this.mainFilterArray[i]['filter'][j]['INPUT'] = this.datePipe.transform(this.mainFilterArray[i]['filter'][j]['INPUT'], "yyyy-MM-dd");

                if (this.mainFilterArray[i]['filter'][j]['DROPDOWN'] == "Between") {
                  this.mainFilterArray[i]['filter'][j]['INPUT2'] = this.datePipe.transform(this.mainFilterArray[i]['filter'][j]['INPUT2'], "yyyy-MM-dd");
                  this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterArray[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArray[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterArray[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterArray[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterArray[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterMeetingDate = this.filterMeetingDate + this.filtersMeetingDate;
              }
        }

        this.filterMeetingDate = this.filterMeetingDate + ") )";
      }

      if (isok) {
        this.isVisibleMeetingDate = false;
        this.filterMeetingDate = ' AND ' + this.filterMeetingDate;
        this.getFederationfilter();
      }
    }
  }

  // Meeting Name
  isVisibleMeetingName: boolean = false;

  showModalMeetingName(): void {
    this.isVisibleMeetingName = true;
    this.model = "MEETING_SUB";
    this.model_name = 'Meeting Name';
  }

  modelCancelMeetingName() {
    this.isVisibleMeetingName = false;
  }

  ANDBUTTONLASTMeetingName(i: any) {
    this.mainFilterMeetingNameArray[i]['buttons']['AND'] = true;
    this.mainFilterMeetingNameArray[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTMeetingName(i: any) {
    this.mainFilterMeetingNameArray[i]['buttons']['AND'] = false;
    this.mainFilterMeetingNameArray[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTMeetingName1(i: any, j: any) {
    this.mainFilterMeetingNameArray[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterMeetingNameArray[i]['filter'][j]['buttons']['AND'] = true;
  }
  ORBUTTONLASTMeetingName1(i: any, j: any) {
    this.mainFilterMeetingNameArray[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterMeetingNameArray[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersMeetingName = '';

  AddFilterGroupMeetingName() {
    this.mainFilterMeetingNameArray.push({
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

  AddFilterMeetingName(i: any, j: any) {
    this.mainFilterMeetingNameArray[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );

    return true;
  }

  CloseGroupMeetingName(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterMeetingNameArray.splice(i, 1);
      return true;
    }
  }

  CloseGroupMeetingName1(i: any, j: any) {
    if (this.mainFilterMeetingNameArray[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterMeetingNameArray[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearMeetingName() {
    this.mainFilterMeetingNameArray = [];
    this.filterMeetingName = '';

    this.mainFilterMeetingNameArray.push({
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

  ApplyFilterMeetingName() {
    if (this.mainFilterMeetingNameArray.length != 0) {
      var isok = true;
      this.filterMeetingName = "";
      var Button = " ";

      for (let i = 0; i < this.mainFilterMeetingNameArray.length; i++) {
        Button = " ";

        if (this.mainFilterMeetingNameArray.length > 0) {
          if (this.mainFilterMeetingNameArray[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterMeetingNameArray[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }

        if (this.mainFilterMeetingNameArray.length > 0) {
          if (this.mainFilterMeetingNameArray[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterMeetingNameArray[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterMeetingNameArray[i]['filter'].length; j++) {
          if (this.mainFilterMeetingNameArray[i]['filter'][j]['INPUT'] == undefined || this.mainFilterMeetingNameArray[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Name', 'Please fill the field');
            isok = false;

          } else if (this.mainFilterMeetingNameArray[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterMeetingNameArray[i]['filter'][j]['DROPDOWN'] == '') {
            this.message.error('Condition', 'Please Select the field');
            isok = false;
          }

          else if (this.mainFilterMeetingNameArray[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterMeetingNameArray[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
            this.message.error('AND or OR', 'Please Click On The Button');
            isok = false;
          }

          else if (this.mainFilterMeetingNameArray[i]['buttons']['AND'] == false && this.mainFilterMeetingNameArray[i]['buttons']['OR'] == false && i > 0) {
            this.message.error('AND or OR', 'Please Click On The Button');
            isok = false;
          }

          else {
            var Button1 = "((";

            if (this.mainFilterMeetingNameArray[i]['filter'].length > 0) {
              if (this.mainFilterMeetingNameArray[i]['filter'][j]['buttons']['AND'] == true) {
                Button1 = ")" + " AND " + "(";
                Button = " ";
              }
            }

            if (this.mainFilterMeetingNameArray[i]['filter'].length > 0) {
              if (this.mainFilterMeetingNameArray[i]['filter'][j]['buttons']['OR'] == true) {
                Button1 = ")" + " OR " + "(";
                Button = " ";
              }
            }

            var condition = '';

            if (this.mainFilterMeetingNameArray[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterMeetingNameArray[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterMeetingNameArray[i]['filter'][j]['DROPDOWN'] == "Content") {
              if (this.mainFilterMeetingNameArray[i]['filter'][j]['DROPDOWN'] == "Start With") {
                condition = "LIKE" + " '" + this.mainFilterMeetingNameArray[i]['filter'][j]['INPUT'] + "%";

              } else if (this.mainFilterMeetingNameArray[i]['filter'][j]['DROPDOWN'] == "End With") {
                condition = "LIKE" + " '%" + this.mainFilterMeetingNameArray[i]['filter'][j]['INPUT'] + "";

              } else {
                condition = "LIKE" + " '%" + this.mainFilterMeetingNameArray[i]['filter'][j]['INPUT'] + "%";
              }

              this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + condition + "'";

            } else {
              this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterMeetingNameArray[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterMeetingNameArray[i]['filter'][j]['INPUT'] + "'";
            }

            this.filterMeetingName = this.filterMeetingName + this.filtersMeetingDate;
          }
        }

        this.filterMeetingName = this.filterMeetingName + ") )";
      }

      if (isok) {
        this.isVisibleMeetingName = false;
        this.filterMeetingName = ' AND ' + this.filterMeetingName;
        this.getFederationfilter();
      }
    }
  }

  // Meeting Conducted
  isVisibleConducted: boolean = false;

  showModalConducted(): void {
    this.isVisibleConducted = true;
    this.model = "CREATOR_NAME";
    this.model_name = 'Meeting Conducted By';
  }

  modelCancelConducted() {
    this.isVisibleConducted = false;
  }

  ANDBUTTONLASTConducted(i: any) {
    this.mainFilterConductedArray[i]['buttons']['AND'] = true;
    this.mainFilterConductedArray[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTConducted(i: any) {
    this.mainFilterConductedArray[i]['buttons']['AND'] = false;
    this.mainFilterConductedArray[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTConducted1(i: any, j: any) {
    this.mainFilterConductedArray[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterConductedArray[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTConducted1(i: any, j: any) {
    this.mainFilterConductedArray[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterConductedArray[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersConducted = '';

  AddFilterGroupConducted() {
    this.mainFilterConductedArray.push({
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

  AddFilterConducted(i: any, j: any) {
    this.mainFilterConductedArray[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );

    return true;
  }

  CloseGroupConducted(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterConductedArray.splice(i, 1);
      return true;
    }
  }

  CloseGroupConducted1(i: any, j: any) {
    if (this.mainFilterConductedArray[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterConductedArray[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearConducted() {
    this.mainFilterConductedArray = [];
    this.filterConducted = '';

    this.mainFilterConductedArray.push({
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

  ApplyFilterConducted() {
    if (this.mainFilterConductedArray.length != 0) {
      var isok = true;
      this.filterConducted = "";

      for (let i = 0; i < this.mainFilterConductedArray.length; i++) {
        var Button = " ";

        if (this.mainFilterConductedArray.length > 0) {
          if (this.mainFilterConductedArray[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterConductedArray[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }

        if (this.mainFilterConductedArray.length > 0) {
          if (this.mainFilterConductedArray[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterConductedArray[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterConductedArray[i]['filter'].length; j++) {
          if (this.mainFilterConductedArray[i]['filter'][j]['INPUT'] == undefined || this.mainFilterConductedArray[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Name', 'Please fill the field');
            isok = false;

          } else if (this.mainFilterConductedArray[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterConductedArray[i]['filter'][j]['DROPDOWN'] == '') {
            this.message.error('Condition', 'Please Select the field');
            isok = false;
          }

          else if (this.mainFilterConductedArray[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterConductedArray[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
            this.message.error('AND or OR', 'Please Click On The Button');
            isok = false;
          }

          else if (this.mainFilterConductedArray[i]['buttons']['AND'] == false && this.mainFilterConductedArray[i]['buttons']['OR'] == false && i > 0) {
            this.message.error('AND or OR', 'Please Click On The Button');
            isok = false;
          }

          else {
            var Button1 = "((";

            if (this.mainFilterConductedArray[i]['filter'].length > 0) {
              if (this.mainFilterConductedArray[i]['filter'][j]['buttons']['AND'] == true) {
                Button1 = ")" + " AND " + "(";
                Button = " ";
              }
            }

            if (this.mainFilterConductedArray[i]['filter'].length > 0) {
              if (this.mainFilterConductedArray[i]['filter'][j]['buttons']['OR'] == true) {
                Button1 = ")" + " OR " + "(";
                Button = " ";
              }
            }

            var condition = '';

            if (this.mainFilterConductedArray[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterConductedArray[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterConductedArray[i]['filter'][j]['DROPDOWN'] == "Content") {
              if (this.mainFilterConductedArray[i]['filter'][j]['DROPDOWN'] == "Start With") {
                condition = "LIKE" + " '" + this.mainFilterConductedArray[i]['filter'][j]['INPUT'] + "%";

              } else if (this.mainFilterConductedArray[i]['filter'][j]['DROPDOWN'] == "End With") {
                condition = "LIKE" + " '%" + this.mainFilterConductedArray[i]['filter'][j]['INPUT'] + "";

              } else {
                condition = "LIKE" + " '%" + this.mainFilterConductedArray[i]['filter'][j]['INPUT'] + "%";
              }

              this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + condition + "'";

            } else {
              this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterConductedArray[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterConductedArray[i]['filter'][j]['INPUT'] + "'";
            }

            this.filterConducted = this.filterConducted + this.filtersMeetingDate;
          }
        }

        this.filterConducted = this.filterConducted + ") )";
      }

      if (isok) {
        this.isVisibleConducted = false;
        this.filterConducted = ' AND ' + this.filterConducted;
        this.getFederationfilter();
      }
    }
  }

  // Meeting Total Time
  isVisibleTotalTime: boolean = false;

  showModalTotalTime(i: any): void {
    this.isVisibleTotalTime = true;
    this.model = "MEETING_TIME";
    this.model_name = 'Total Time Of Metting';
  }

  modelCancelTotalTime() {
    this.isVisibleTotalTime = false;
  }

  ANDBUTTONLASTTotalTime(i: any) {
    this.mainFilterTotalTimeArray[i]['buttons']['AND'] = true;
    this.mainFilterTotalTimeArray[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTTotalTime(i: any) {
    this.mainFilterTotalTimeArray[i]['buttons']['AND'] = false;
    this.mainFilterTotalTimeArray[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTTotalTime1(i: any, j: any) {
    this.mainFilterTotalTimeArray[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterTotalTimeArray[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTTotalTime1(i: any, j: any) {
    this.mainFilterTotalTimeArray[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterTotalTimeArray[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersTotalTime = '';

  AddFilterGroupTotalTime() {
    this.mainFilterTotalTimeArray.push({
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

  AddFilterTotalTime(i: any, j: any) {
    this.mainFilterTotalTimeArray[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );
    return true;
  }

  CloseGroupTotalTime(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterTotalTimeArray.splice(i, 1);
      return true;
    }
  }

  CloseGroupTotalTime1(i: any, j: any) {
    if (this.mainFilterTotalTimeArray[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterTotalTimeArray[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearTotalTime() {
    this.mainFilterTotalTimeArray = [];
    this.filterTotalTime = '';

    this.mainFilterTotalTimeArray.push({
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

  ApplyFilterTotalTime() {
    if (this.mainFilterTotalTimeArray.length != 0) {
      var isok = true;
      this.filterTotalTime = "";

      for (let i = 0; i < this.mainFilterTotalTimeArray.length; i++) {
        var Button = " ";

        if (this.mainFilterTotalTimeArray.length > 0) {
          if (this.mainFilterTotalTimeArray[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterTotalTimeArray[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }

        if (this.mainFilterTotalTimeArray.length > 0) {
          if (this.mainFilterTotalTimeArray[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterTotalTimeArray[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterTotalTimeArray[i]['filter'].length; j++) {
          if (this.mainFilterTotalTimeArray[i]['filter'][j]['INPUT'] == undefined || this.mainFilterTotalTimeArray[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Time HH', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterTotalTimeArray[i]['filter'][j]['INPUT_1'] == undefined || this.mainFilterTotalTimeArray[i]['filter'][j]['INPUT_1'] == '')) {
              this.message.error('Time MM', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterTotalTimeArray[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterTotalTimeArray[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterTotalTimeArray[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterTotalTimeArray[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }

              else
                if ((this.mainFilterTotalTimeArray[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterTotalTimeArray[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterTotalTimeArray[i]['filter'][j]['DROPDOWN'] == "Between")) {
                  this.message.error('Time HH', 'Please fill the field');
                  isok = false;

                } else
                  if ((this.mainFilterTotalTimeArray[i]['filter'][j]['INPUT_2'] == undefined || this.mainFilterTotalTimeArray[i]['filter'][j]['INPUT_2'] == '') && (this.mainFilterTotalTimeArray[i]['filter'][j]['DROPDOWN'] == "Between")) {
                    this.message.error('Time MM', 'Please fill the field');
                    isok = false;

                  } else
                    if (this.mainFilterTotalTimeArray[i]['buttons']['AND'] == false && this.mainFilterTotalTimeArray[i]['buttons']['OR'] == false && i > 0) {
                      this.message.error('AND or OR', 'Please Click On The Button');
                      isok = false;
                    }

                    else {
                      var Button1 = "((";

                      if (this.mainFilterTotalTimeArray[i]['filter'].length > 0) {
                        if (this.mainFilterTotalTimeArray[i]['filter'][j]['buttons']['AND'] == true) {
                          Button1 = ")" + " AND " + "(";
                          Button = " ";
                        }
                      }

                      if (this.mainFilterTotalTimeArray[i]['filter'].length > 0) {
                        if (this.mainFilterTotalTimeArray[i]['filter'][j]['buttons']['OR'] == true) {
                          Button1 = ")" + " OR " + "(";
                          Button = " ";
                        }
                      }

                      var input_time = '';
                      var input_time_1 = '';

                      input_time = this.mainFilterTotalTimeArray[i]['filter'][j]['INPUT'] + " Hours " + this.mainFilterTotalTimeArray[i]['filter'][j]['INPUT_1'] + " Minutes";
                      input_time_1 = this.mainFilterTotalTimeArray[i]['filter'][j]['INPUT2'] + " Hours " + this.mainFilterTotalTimeArray[i]['filter'][j]['INPUT_2'] + " Minutes";

                      if (this.mainFilterTotalTimeArray[i]['filter'][j]['DROPDOWN'] == "Between") {
                        this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterTotalTimeArray[i]['filter'][j]['DROPDOWN'] + " '" + input_time + "' AND '" + input_time_1 + "'";

                      } else {
                        this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterTotalTimeArray[i]['filter'][j]['DROPDOWN'] + " '" + input_time + "'";
                      }

                      this.filterTotalTime = this.filterTotalTime + this.filtersMeetingDate;
                    }
        }

        this.filterTotalTime = this.filterTotalTime + ") )";
      }

      if (isok) {
        this.isVisibleTotalTime = false;
        this.filterTotalTime = ' AND ' + this.filterTotalTime;
        this.getFederationfilter();
      }
    }
  }

  // Meeting Start Time
  isVisibleStartTime: boolean = false;

  showModalStartTime(): void {
    this.isVisibleStartTime = true;
    this.model = "FROM_TIME";
    this.model_name = 'Meeting Start Time';
  }

  modelCancelStartTime() {
    this.isVisibleStartTime = false;
  }

  ANDBUTTONLASTStartTime(i: any) {
    this.mainFilterStartTimeArray[i]['buttons']['AND'] = true;
    this.mainFilterStartTimeArray[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTStartTime(i: any) {
    this.mainFilterStartTimeArray[i]['buttons']['AND'] = false;
    this.mainFilterStartTimeArray[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTStartTime1(i: any, j: any) {
    this.mainFilterStartTimeArray[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterStartTimeArray[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTStartTime1(i: any, j: any) {
    this.mainFilterStartTimeArray[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterStartTimeArray[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersStartTime = '';

  AddFilterGroupStartTime() {
    this.mainFilterStartTimeArray.push({
      filter: [{
        DROPDOWN: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
  }

  AddFilterStartTime(i: any, j: any) {
    this.mainFilterStartTimeArray[i]['filter'].push({
      DROPDOWN: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );
    return true;
  }

  CloseGroupStartTime(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterStartTimeArray.splice(i, 1);
      return true;
    }
  }

  CloseGroupStartTime1(i: any, j: any) {
    if (this.mainFilterStartTimeArray[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterStartTimeArray[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearStartTime() {
    this.mainFilterStartTimeArray = [];
    this.filterStartTime = '';

    this.mainFilterStartTimeArray.push({
      filter: [{
        DROPDOWN: '', buttons: {
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

  ApplyFilterStartTime() {
    if (this.mainFilterStartTimeArray.length != 0) {
      var isok = true;
      this.filterStartTime = "";

      for (let i = 0; i < this.mainFilterStartTimeArray.length; i++) {
        var Button = " ";

        if (this.mainFilterStartTimeArray.length > 0) {
          if (this.mainFilterStartTimeArray[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterStartTimeArray[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }

        if (this.mainFilterStartTimeArray.length > 0) {
          if (this.mainFilterStartTimeArray[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterStartTimeArray[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterStartTimeArray[i]['filter'].length; j++) {
          console.log('hh', this.mainFilterStartTimeArray[i]['filter'][j]['INPUT']);

          if (this.mainFilterStartTimeArray[i]['filter'][j]['INPUT'] == undefined || this.mainFilterStartTimeArray[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Time', 'Please fill the field');
            isok = false;

          } else if (this.mainFilterStartTimeArray[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterStartTimeArray[i]['filter'][j]['DROPDOWN'] == '') {
            this.message.error('Condition', 'Please Select the field');
            isok = false;

          } else if (this.mainFilterStartTimeArray[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterStartTimeArray[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
            this.message.error('AND or OR', 'Please Click On The Button');
            isok = false;

          } else if ((this.mainFilterStartTimeArray[i]['filter'][j]['INPUT1'] == undefined || this.mainFilterStartTimeArray[i]['filter'][j]['INPUT1'] == null) && (this.mainFilterStartTimeArray[i]['filter'][j]['DROPDOWN'] == "Between")) {
            this.message.error('Time', 'Please fill the field');
            isok = false;

          } else if (this.mainFilterStartTimeArray[i]['buttons']['AND'] == false && this.mainFilterStartTimeArray[i]['buttons']['OR'] == false && i > 0) {
            this.message.error('AND or OR', 'Please Click On The Button');
            isok = false;

          } else {
            var Button1 = "((";

            if (this.mainFilterStartTimeArray[i]['filter'].length > 0) {
              if (this.mainFilterStartTimeArray[i]['filter'][j]['buttons']['AND'] == true) {
                Button1 = ")" + " AND " + "(";
                Button = " ";
              }
            }

            if (this.mainFilterStartTimeArray[i]['filter'].length > 0) {
              if (this.mainFilterStartTimeArray[i]['filter'][j]['buttons']['OR'] == true) {
                Button1 = ")" + " OR " + "(";
                Button = " ";
              }
            }

            var input_time = '';
            var input_time_1 = '';
            input_time = this.datePipe.transform(this.mainFilterStartTimeArray[i]['filter'][j]['INPUT'], "HH:mm" + ":00");
            input_time_1 = this.datePipe.transform(this.mainFilterStartTimeArray[i]['filter'][j]['INPUT1'], "HH:mm" + ":00");

            if (this.mainFilterStartTimeArray[i]['filter'][j]['DROPDOWN'] == "Between") {
              this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterStartTimeArray[i]['filter'][j]['DROPDOWN'] + " '" + input_time + "' AND '" + input_time_1 + "'";

            } else {
              this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterStartTimeArray[i]['filter'][j]['DROPDOWN'] + " '" + input_time + "'";
            }

            this.filterStartTime = this.filterStartTime + this.filtersMeetingDate;
          }
        }

        this.filterStartTime = this.filterStartTime + ") )";
      }

      if (isok) {
        this.isVisibleStartTime = false;
        this.filterStartTime = ' AND ' + this.filterStartTime;
        this.getFederationfilter();
      }
    }
  }

  // Meeting End Time
  isVisibleEndTime: boolean = false;

  showModalEndTime(): void {
    this.isVisibleEndTime = true;
    this.model = "TO_TIME";
    this.model_name = 'Metting End Time';
  }

  modelCancelEndTime() {
    this.isVisibleEndTime = false;
  }

  ANDBUTTONLASTEndTime(i: any) {
    this.mainFilterEndTimeArray[i]['buttons']['AND'] = true;
    this.mainFilterEndTimeArray[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTEndTime(i: any) {
    this.mainFilterEndTimeArray[i]['buttons']['AND'] = false;
    this.mainFilterEndTimeArray[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTEndTime1(i: any, j: any) {
    this.mainFilterEndTimeArray[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterEndTimeArray[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTEndTime1(i: any, j: any) {
    this.mainFilterEndTimeArray[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterEndTimeArray[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersEndTime = '';

  AddFilterGroupEndTime() {
    this.mainFilterEndTimeArray.push({
      filter: [{
        DROPDOWN: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
  }

  AddFilterEndTime(i: any, j: any) {
    this.mainFilterEndTimeArray[i]['filter'].push({
      DROPDOWN: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );

    return true;
  }

  CloseGroupEndTime(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterEndTimeArray.splice(i, 1);
      return true;
    }
  }

  CloseGroupEndTime1(i: any, j: any) {
    if (this.mainFilterEndTimeArray[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterEndTimeArray[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearEndTime() {
    this.mainFilterEndTimeArray = [];
    this.filterEndTime = '';

    this.mainFilterEndTimeArray.push({
      filter: [{
        DROPDOWN: '', buttons: {
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

  ApplyFilterEndTime() {
    if (this.mainFilterEndTimeArray.length != 0) {
      var isok = true;
      this.filterEndTime = "";

      for (let i = 0; i < this.mainFilterEndTimeArray.length; i++) {
        var Button = " ";

        if (this.mainFilterEndTimeArray.length > 0) {
          if (this.mainFilterEndTimeArray[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterEndTimeArray[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }

        if (this.mainFilterStatusArray.length > 0) {
          if (this.mainFilterEndTimeArray[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterEndTimeArray[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterEndTimeArray[i]['filter'].length; j++) {
          if (this.mainFilterEndTimeArray[i]['filter'][j]['INPUT'] == undefined || this.mainFilterEndTimeArray[i]['filter'][j]['INPUT'] == null) {
            this.message.error('Time', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterEndTimeArray[i]['filter'][j]['INPUT1'] == undefined || this.mainFilterEndTimeArray[i]['filter'][j]['INPUT1'] == null) && this.mainFilterEndTimeArray[i]['filter'][j]['DROPDOWN'] == "Between") {
              this.message.error('Time', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterEndTimeArray[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterEndTimeArray[i]['filter'][j]['DROPDOWN'] == '') {
                this.message.error('Condition', 'Please Select the field');
                isok = false;
              }

              else if (this.mainFilterEndTimeArray[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterEndTimeArray[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }

              else if (this.mainFilterEndTimeArray[i]['buttons']['AND'] == false && this.mainFilterEndTimeArray[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterEndTimeArray[i]['filter'].length > 0) {
                  if (this.mainFilterEndTimeArray[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterEndTimeArray[i]['filter'].length > 0) {
                  if (this.mainFilterEndTimeArray[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                var input_time = '';
                var input_time_1 = '';
                input_time = this.datePipe.transform(this.mainFilterEndTimeArray[i]['filter'][j]['INPUT'], "HH:mm" + ":00");
                input_time_1 = this.datePipe.transform(this.mainFilterEndTimeArray[i]['filter'][j]['INPUT1'], "HH:mm" + ":00");

                if (this.mainFilterEndTimeArray[i]['filter'][j]['DROPDOWN'] == "Between") {
                  this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterEndTimeArray[i]['filter'][j]['DROPDOWN'] + " '" + input_time + "' AND '" + input_time_1 + "'";

                } else {
                  this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterEndTimeArray[i]['filter'][j]['DROPDOWN'] + " '" + input_time + "'";
                }

                this.filterEndTime = this.filterEndTime + this.filtersMeetingDate;
              }
        }

        this.filterEndTime = this.filterEndTime + ") )";
      }

      if (isok) {
        this.isVisibleEndTime = false;
        this.filterEndTime = ' AND ' + this.filterEndTime;
        this.getFederationfilter();
      }
    }
  }

  // Meeting Invities
  isVisibleInvities: boolean = false;

  showModalInvities(): void {
    this.isVisibleInvities = true;
    this.model = "INVITEES";
    this.model_name = 'Invitees';
  }

  modelCancelInvities() {
    this.isVisibleInvities = false;
  }

  ANDBUTTONLASTInvities(i: any) {
    this.mainFilterInvitiesArray[i]['buttons']['AND'] = true;
    this.mainFilterInvitiesArray[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTInvities(i: any) {
    this.mainFilterInvitiesArray[i]['buttons']['AND'] = false;
    this.mainFilterInvitiesArray[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTInvities1(i: any, j: any) {
    this.mainFilterInvitiesArray[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterInvitiesArray[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTInvities1(i: any, j: any) {
    this.mainFilterInvitiesArray[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterInvitiesArray[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersInvities = '';

  AddFilterGroupInvities() {
    this.mainFilterInvitiesArray.push({
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

  AddFilterInvities(i: any, j: any) {
    this.mainFilterInvitiesArray[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );

    return true;
  }

  CloseGroupInvities(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterInvitiesArray.splice(i, 1);
      return true;
    }
  }

  CloseGroupInvities1(i: any, j: any) {
    if (this.mainFilterInvitiesArray[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterInvitiesArray[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearInvities() {
    this.mainFilterInvitiesArray = [];
    this.filterInvities = '';

    this.mainFilterInvitiesArray.push({
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

  ApplyFilterInvities() {
    if (this.mainFilterInvitiesArray.length != 0) {
      var isok = true;
      this.filterInvities = "";

      for (let i = 0; i < this.mainFilterInvitiesArray.length; i++) {
        var Button = " ";

        if (this.mainFilterInvitiesArray.length > 0) {
          if (this.mainFilterInvitiesArray[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterInvitiesArray[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }

        if (this.mainFilterStatusArray.length > 0) {
          if (this.mainFilterInvitiesArray[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterInvitiesArray[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterInvitiesArray[i]['filter'].length; j++) {
          if (this.mainFilterInvitiesArray[i]['filter'][j]['INPUT'] == undefined || this.mainFilterInvitiesArray[i]['filter'][j]['INPUT'] == null) {
            this.message.error('Invities', 'Please fill the field');
            isok = false;

          } else if (this.mainFilterInvitiesArray[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterInvitiesArray[i]['filter'][j]['DROPDOWN'] == '') {
            this.message.error('Condition', 'Please Select the field');
            isok = false;
          }

          else if (this.mainFilterInvitiesArray[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterInvitiesArray[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
            this.message.error('AND or OR', 'Please Click On The Button');
            isok = false;
          }

          else
            if ((this.mainFilterInvitiesArray[i]['filter'][j]['INPUT2'] == '' || this.mainFilterInvitiesArray[i]['filter'][j]['INPUT2'] == null) && (this.mainFilterInvitiesArray[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterInvitiesArray[i]['buttons']['AND'] == false && this.mainFilterInvitiesArray[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterInvitiesArray[i]['filter'].length > 0) {
                  if (this.mainFilterInvitiesArray[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterInvitiesArray[i]['filter'].length > 0) {
                  if (this.mainFilterInvitiesArray[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterInvitiesArray[i]['filter'][j]['DROPDOWN'] == "Between") {
                  this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterInvitiesArray[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterInvitiesArray[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterInvitiesArray[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterInvitiesArray[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterInvitiesArray[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterInvities = this.filterInvities + this.filtersMeetingDate;
              }
        }

        this.filterInvities = this.filterInvities + ") )";
      }

      if (isok) {
        this.isVisibleInvities = false;
        this.filterInvities = ' AND ' + this.filterInvities;
        this.getFederationfilter();
      }
    }
  }

  // Meeting Attempted
  isVisibleAttempted: boolean = false;

  showModalAttempted(): void {
    this.isVisibleAttempted = true;
    this.model = "MEETING_ATTENDANCE";
    this.model_name = 'Attempted';
  }

  modelCancelAttempted() {
    this.isVisibleAttempted = false;
  }

  ANDBUTTONLASTAttempted(i: any) {
    this.mainFilterAttemptedArray[i]['buttons']['AND'] = true;
    this.mainFilterAttemptedArray[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTAttempted(i: any) {
    this.mainFilterAttemptedArray[i]['buttons']['AND'] = false;
    this.mainFilterAttemptedArray[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTAttempted1(i: any, j: any) {
    this.mainFilterAttemptedArray[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterAttemptedArray[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTAttempted1(i: any, j: any) {
    this.mainFilterAttemptedArray[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterAttemptedArray[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersAttempted = '';

  AddFilterGroupAttempted() {
    this.mainFilterAttemptedArray.push({
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

  AddFilterAttempted(i: any, j: any) {
    this.mainFilterAttemptedArray[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );

    return true;
  }

  CloseGroupAttempted(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterAttemptedArray.splice(i, 1);
      return true;
    }
  }

  CloseGroupAttempted1(i: any, j: any) {
    if (this.mainFilterAttemptedArray[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterAttemptedArray[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearAttempted() {
    this.mainFilterAttemptedArray = [];
    this.filterAttempted = '';

    this.mainFilterAttemptedArray.push({
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

  ApplyFilterAttempted() {
    if (this.mainFilterAttemptedArray.length != 0) {
      var isok = true;
      this.filterAttempted = "";

      for (let i = 0; i < this.mainFilterAttemptedArray.length; i++) {
        var Button = " ";

        if (this.mainFilterAttemptedArray.length > 0) {
          if (this.mainFilterAttemptedArray[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterAttemptedArray[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }

        if (this.mainFilterStatusArray.length > 0) {
          if (this.mainFilterAttemptedArray[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterAttemptedArray[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
              Button = " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterAttemptedArray[i]['filter'].length; j++) {
          if (this.mainFilterAttemptedArray[i]['filter'][j]['INPUT'] == undefined || this.mainFilterAttemptedArray[i]['filter'][j]['INPUT'] == null) {
            this.message.error('Attempted', 'Please fill the field');
            isok = false;

          } else if (this.mainFilterAttemptedArray[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterAttemptedArray[i]['filter'][j]['DROPDOWN'] == '') {
            this.message.error('Condition', 'Please Select the field');
            isok = false;
          }

          else
            if ((this.mainFilterAttemptedArray[i]['filter'][j]['INPUT2'] == '' || this.mainFilterAttemptedArray[i]['filter'][j]['INPUT2'] == null) && (this.mainFilterAttemptedArray[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterAttemptedArray[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterAttemptedArray[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }

              else if (this.mainFilterAttemptedArray[i]['buttons']['AND'] == false && this.mainFilterAttemptedArray[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }

              else {
                var Button1 = "((";

                if (this.mainFilterAttemptedArray[i]['filter'].length > 0) {
                  if (this.mainFilterAttemptedArray[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterAttemptedArray[i]['filter'].length > 0) {
                  if (this.mainFilterAttemptedArray[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                  }
                }

                if (this.mainFilterAttemptedArray[i]['filter'][j]['DROPDOWN'] == "Between") {
                  this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterAttemptedArray[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterAttemptedArray[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterAttemptedArray[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterAttemptedArray[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterAttemptedArray[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterAttempted = this.filterAttempted + this.filtersMeetingDate;
              }
        }

        this.filterAttempted = this.filterAttempted + ") )";
      }

      if (isok) {
        this.isVisibleAttempted = false;
        this.filterAttempted = ' AND ' + this.filterAttempted;
        this.getFederationfilter();
      }
    }
  }

  // Meeting Status
  isVisibleStatus: boolean = false;

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

    this.getFederationfilter();
  }

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
          }

          else
            if ((this.mainFilterStatusArray[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterStatusArray[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterStatusArray[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Status', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterStatusArray[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterStatusArray[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }

              else if (this.mainFilterStatusArray[i]['buttons']['AND'] == false && this.mainFilterStatusArray[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
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
                  this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterStatusArray[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterStatusArray[i]['filter'][j]['INPUT'] + "' AND '" + this.mainFilterStatusArray[i]['filter'][j]['INPUT2'] + "'";

                } else {
                  if (this.mainFilterStatusArray[i]['filter'][j]['INPUT'] == 'P') {
                    this.filtersMeetingDate = Button + Button1 + ' ' + "MINUTES =''";

                  } else {
                    this.filtersMeetingDate = Button + Button1 + ' ' + "MINUTES <>''";
                  }
                }

                this.filterStatus = this.filterStatus + this.filtersMeetingDate;
              }
        }

        this.filterStatus = this.filterStatus + ") )";
      }

      if (isok) {
        this.isVisibleStatus = false;
        this.filterStatus = ' AND ' + this.filterStatus;
        this.getFederationfilter();
      }
    }
  }

  // Meeting Venue
  isVisibleVenue: boolean = false;

  showModalVenue(): void {
    this.isVisibleVenue = true;
    this.model = "VENUE";
    this.model_name = 'Venue';
  }

  modelCancelVenue() {
    this.isVisibleVenue = false;
  }

  ANDBUTTONLASTVenue(i: any) {
    this.mainFilterVenueArray[i]['buttons']['AND'] = true;
    this.mainFilterVenueArray[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTVenue(i: any) {
    this.mainFilterVenueArray[i]['buttons']['AND'] = false;
    this.mainFilterVenueArray[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTVenue1(i: any, j: any) {
    this.mainFilterVenueArray[i]['filter'][j]['buttons']['OR'] = false;
    this.mainFilterVenueArray[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTVenue1(i: any, j: any) {
    this.mainFilterVenueArray[i]['filter'][j]['buttons']['OR'] = true;
    this.mainFilterVenueArray[i]['filter'][j]['buttons']['AND'] = false;
  }

  filtersVenue = '';

  AddFilterGroupVenue() {
    this.mainFilterVenueArray.push({
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

  AddFilterVenue(i: any, j: any) {
    this.mainFilterVenueArray[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    }
    );

    return true;
  }

  CloseGroupVenue(i: any) {
    if (i == 0) {
      return false;

    } else {
      this.mainFilterVenueArray.splice(i, 1);
      return true;
    }
  }

  CloseGroupVenue1(i: any, j: any) {
    if (this.mainFilterVenueArray[i]['filter'].length == 1 || j == 0) {
      return false;

    } else {
      this.mainFilterVenueArray[i]['filter'].splice(j, 1);
      return true;
    }
  }

  ClearVenue() {
    this.mainFilterVenueArray = [];
    this.filterVenue = '';

    this.mainFilterVenueArray.push({
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

  ApplyFilterVenue() {
    if (this.mainFilterVenueArray.length != 0) {
      var isok = true;
      this.filterVenue = "";

      for (let i = 0; i < this.mainFilterVenueArray.length; i++) {
        var Button = " ";

        if (this.mainFilterVenueArray.length > 0) {
          if (this.mainFilterVenueArray[i]['buttons']['AND'] != undefined) {
            if (this.mainFilterVenueArray[i]['buttons']['AND'] == true) {
              Button = " " + " AND " + " ";
            }
          }
        }

        if (this.mainFilterVenueArray.length > 0) {
          if (this.mainFilterVenueArray[i]['buttons']['OR'] != undefined) {
            if (this.mainFilterVenueArray[i]['buttons']['OR'] == true) {
              Button = " " + " OR " + " ";
            }
          }
        }

        for (let j = 0; j < this.mainFilterVenueArray[i]['filter'].length; j++) {
          var Button1 = "((";

          if (this.mainFilterVenueArray[i]['filter'][j]['INPUT'] == undefined || this.mainFilterVenueArray[i]['filter'][j]['INPUT'] == '') {
            this.message.error('Venue', 'Please fill the field');
            isok = false;

          } else if (this.mainFilterVenueArray[i]['filter'][j]['DROPDOWN'] == undefined || this.mainFilterVenueArray[i]['filter'][j]['DROPDOWN'] == '') {
            this.message.error('Condition', 'Please Select the field');
            isok = false;
          }

          else
            if ((this.mainFilterVenueArray[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterVenueArray[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterVenueArray[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Venue', 'Please fill the field');
              isok = false;

            } else
              if (this.mainFilterVenueArray[i]['filter'][j]['buttons']['AND'] == false && this.mainFilterVenueArray[i]['filter'][j]['buttons']['OR'] == false && j > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }

              else if (this.mainFilterVenueArray[i]['buttons']['AND'] == false && this.mainFilterVenueArray[i]['buttons']['OR'] == false && i > 0) {
                this.message.error('AND or OR', 'Please Click On The Button');
                isok = false;
              }

              else {
                if (this.mainFilterVenueArray[i]['filter'].length > 0) {
                  if (this.mainFilterVenueArray[i]['filter'][j]['buttons']['AND'] == true) {
                    Button1 = ")" + " AND " + "(";
                    Button = " ";
                  }
                }

                if (this.mainFilterVenueArray[i]['filter'].length > 0) {
                  if (this.mainFilterVenueArray[i]['filter'][j]['buttons']['OR'] == true) {
                    Button1 = ")" + " OR " + "(";
                    Button = " ";
                  }
                }

                var condition = '';

                if (this.mainFilterVenueArray[i]['filter'][j]['DROPDOWN'] == "Start With" || this.mainFilterVenueArray[i]['filter'][j]['DROPDOWN'] == "End With" || this.mainFilterVenueArray[i]['filter'][j]['DROPDOWN'] == "Content") {
                  if (this.mainFilterVenueArray[i]['filter'][j]['DROPDOWN'] == "Start With") {
                    condition = "LIKE" + " '" + this.mainFilterVenueArray[i]['filter'][j]['INPUT'] + "%";

                  } else if (this.mainFilterVenueArray[i]['filter'][j]['DROPDOWN'] == "End With") {
                    condition = "LIKE" + " '%" + this.mainFilterVenueArray[i]['filter'][j]['INPUT'] + "";

                  } else {
                    condition = "LIKE" + " '%" + this.mainFilterVenueArray[i]['filter'][j]['INPUT'] + "%";
                  }

                  this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + condition + "'";

                } else {
                  this.filtersMeetingDate = Button + Button1 + ' ' + this.model + " " + this.mainFilterVenueArray[i]['filter'][j]['DROPDOWN'] + " '" + this.mainFilterVenueArray[i]['filter'][j]['INPUT'] + "'";
                }

                this.filterVenue = this.filterVenue + this.filtersMeetingDate;
              }
        }

        this.filterVenue = this.filterVenue + ") )";
      }

      if (isok) {
        this.isVisibleVenue = false;
        this.filterVenue = ' AND ' + this.filterVenue;
        this.getFederationfilter();
      }
    }
  }

  goToClear() {
    this.sortValue = "asc";
    this.sortKey = "ID";
    this.mainFilterArray = [];
    this.mainFilterMeetingNameArray = [];
    this.mainFilterConductedArray = [];
    this.mainFilterTotalTimeArray = [];
    this.mainFilterStartTimeArray = [];
    this.mainFilterEndTimeArray = [];
    this.mainFilterInvitiesArray = [];
    this.mainFilterAttemptedArray = [];
    this.mainFilterStatusArray = [];
    this.mainFilterVenueArray = [];

    this.filterMeetingDate = '';
    this.filterMeetingName = '';
    this.filterConducted = '';
    this.filterTotalTime = '';
    this.filterStartTime = '';
    this.filterEndTime = '';
    this.filterInvities = '';
    this.filterAttempted = '';
    this.filterStatus = '';
    this.filterVenue = '';
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
    this.mainFilterMeetingNameArray.push({
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
    this.mainFilterConductedArray.push({
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

    this.mainFilterTotalTimeArray.push({
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

    this.mainFilterStartTimeArray.push({
      filter: [{
        DROPDOWN: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.mainFilterEndTimeArray.push({
      filter: [{
        DROPDOWN: '', buttons: {
          AND: false, OR: false, IS_SHOW: false
        },
      }],
      Query: '',
      buttons: {
        AND: false, OR: false, IS_SHOW: false
      },
    });

    this.mainFilterInvitiesArray.push({
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

    this.mainFilterAttemptedArray.push({
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
    this.mainFilterVenueArray.push({
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
  dataList: any[] = [];

  goToSchedule(): void {
    this.ScheduleTitle = "Meeting Report";
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

    this.ScheduleData.FILTER_QUERY = this.all_filter + " AND YEAR(DATE)='" + this.SelectedYear + "'" + f_filtar;
    this.ScheduleData.REPORT_ID = 1;
    this.ScheduleData.USER_ID = parseInt(this._cookie.get('userId'));
    this.pageIndex = 1;
    this.pageSize = 10;

    this.api.getScheduledReport(this.pageIndex, this.pageSize, '', '', ' AND STATUS=1 AND REPORT_ID=1').subscribe(data => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.ScheduleVisible = true;
        this.dataList = data['data'];
        this.ScheduleData.REPORT_NAME = data['data'][0]['REPORT_NAME'];
        this.pageIndex++;
      }

    }, err => {
      this.loadingRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  datetime(time) {
    var date = new Date('1997-12-12 ' + time);
    var datePipeString = this.datePipe.transform(date, 'h:mm a');
    return datePipeString;
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

  visible: boolean = false;

  close(): void {
    this.visible = false;
  }

  CountTitle = '';
  dataInvitees = [];
  dataRecord: boolean = true;

  getinvitees(data) {
    this.visible = true;
    this.CountTitle = "Invitees";
    this.dataInvitees = [];
    this.dataRecord = true;

    this.api.getInvitees(0, 0, '', '', ' AND MEETING_ID=' + data.ID).subscribe(data => {
      if (data['code'] == 200) {
        this.dataInvitees = data['data'];
        this.dataRecord = false;
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getAttempted(data) {
    this.visible = true;
    this.CountTitle = "Attempted";
    this.dataInvitees = [];
    this.dataRecord = true;

    this.api.getInvitees(0, 0, '', '', ' AND P_A=1 AND MEETING_ID=' + data.ID).subscribe(data => {
      if (data['code'] == 200) {
        this.dataInvitees = data['data'];
        this.dataRecord = false;
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }
}
