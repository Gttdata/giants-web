import { DatePipe } from '@angular/common';
import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { ExportService } from 'src/app/Service/export.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { REPORTSCHEDULE } from 'src/app/Models/report-schedule';

@Component({
  selector: 'app-eventreport',
  templateUrl: './eventreport.component.html',
  styleUrls: ['./eventreport.component.css'],
})

export class EventreportComponent implements OnInit {
  formTitle: string = "Event Report";
  @Input() data_post: REPORTSCHEDULE = new REPORTSCHEDULE();
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
    ["FEDERATION_NAME", "Federation Name"], ["UNIT_NAME", "Unit Name"], ["GROUP_NAME", "Group Name"], ["PROJECT_NAME  ", "Event Name"], ["MEMBER_NAME", "Event Creator"],
    ["DATE", "Event Date"], ["VENUE", "Event Venue"], ["LIKE_COUNT", "Like"], ["COMMENT_COUNT", "Comment"], ["STATUS", "Status"]];
  isSpinning: boolean = false;
  federationID = Number(this._cookie.get('FEDERATION_ID'));
  unitID = Number(this._cookie.get('UNIT_ID'));
  groupID = Number(this._cookie.get('GROUP_ID'));
  eventValue = [];
  isDisplay = false;
  tagValue: string[] = ["Federation Name", "Unit Name", "Group Name", "Event Name", "Event Creator", "No.Of.Invities", "No.Of.Attendance", "Event Date", "Event Venue", "Status"];
  tagValue1: string[] = ["Select All", "Federation Name", "Unit Name", "Group Name", "Event Name", "Event Creator", "No.Of.Invities", "No.Of.Attendance", "Event Date", "Event Venue", "Status"];
  Operators: string[][] = [['Between', 'Between'], ["=", "="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["!=", "!="]];
  Operators1: string[][] = [["Start With", "Start With"], ['End With', 'End With'], ['Content', 'Content'], ['=', '='], ['!=', '!=']];
  Operators2: string[][] = [["BETWEEN", "BETWEEN"], ["=", "="], [">", ">"], ["<", "<"], [">=", ">="], ["<=", "<="], ["!=", "!="]];
  Operator_Status: string[][] = [["P", "Pending"], ["C", "Complete"]];
  Operators_Status: string[][] = [["=", "="], ["<>", "!="]];
  mainFilterStatusArray = [];
  filterStatus = '';
  VALUE = [];
  SelectedValue = "BETWEEN";
  yearrange = [];
  year = new Date().getFullYear();
  baseYear = 2020;
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
  filter3 = "";
  filter2 = "";
  filter = "";
  filter1 = "";
  model = "";
  nextfield = true;
  obj = "";
  obj2 = "";
  exportLoading: boolean = false;
  dataListForExport = [];
  exportInPDFLoading: boolean = false;
  exportLoading1: boolean = false;
  isPDFModalVisible: boolean = false;
  next_year = Number(this.year + 1)
  drawerTitle1: string;
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
  ClickAddFilterGroup = false
  ClickAddFilterGroup1 = false;
  ClickAddFilterGroup3 = false;
  drawerVisible1: boolean = false;
  selectedFormName: any;
  drawerData1: REPORTSCHEDULE = new REPORTSCHEDULE();
  a = new Date();
  b = new Date(this.a.getFullYear() + 1, 3, 1);

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService, private _exportService: ExportService, private router: Router) { }

  public handlePrint(): void {
    const printContents = document.getElementById('modal').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  }

  range = [];

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
    this.getEvent()
    this.current_year();
    // this.getEventFilter();

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

    const filterdata = this.ApplyFilter2;
    const filterdata1 = this.ApplyFilter4;
    const array = [filterdata, filterdata1];
    console.log(array);
  }

  SelectYear(YEAR: any) {
    this.SelectedYear = YEAR;
    console.log(this.SelectedYear);

    this.getEvent()

  }
  ModelName: string = "";
  showModal(): void {
    this.isVisible = true;
    this.model = "PROJECT_NAME";
    this.ModelName = "Event Name";


  }
  handleOk(): void {
    this.isVisible = false;
  }
  handleCancel(): void {
    this.isVisible = false;
  }

  //no.of.invities
  showModal1(): void {
    this.isVisible3 = true;
    this.model = "No.Of.Invities";
    this.ModelName = "No.Of.Invities Filter";
  }
  handleOk3(): void {
    this.isVisible3 = false;
  }
  handleCancel3(): void {
    this.isVisible3 = false;
  }

  //evnt date
  showModal2(): void {
    this.isVisible4 = true;
    this.model = "DATE";
    this.ModelName = "Event Date Filter";
  }
  handleOk4(): void {
    this.isVisible4 = false;
  }
  handleCancel4(): void {
    this.isVisible4 = false;
  }


  //event attendance
  showModal3(): void {
    this.isVisible5 = true;
    this.model = "DATE";
    this.ModelName = "Event Date Filter";
  }

  handleOk5(): void {
    this.isVisible5 = false;
  }

  handleCancel5(): void {
    this.isVisible5 = false;
  }

  //event creator
  showModal4(): void {
    this.isVisible6 = true;
    this.model = "VENUE";
    this.ModelName = "Event Venue Filter";
  }

  handleOk6(): void {
    this.isVisible6 = false;
  }

  handleCancel6(): void {
    this.isVisible6 = false;
  }


  //event vanue
  showModal5(): void {
    this.isVisible7 = true;
    this.model = "MEMBER_NAME";
    this.ModelName = "Event Creator Filter";
  }

  handleOk7(): void {
    this.isVisible7 = false;
  }

  handleCancel7(): void {
    this.isVisible7 = false;
  }

  //federation
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

  //unit
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

  Group

  showModal9(): void {
    this.isVisible10 = true;
    this.model = "GROUP_NAME";
    this.ModelName = "Group Filter";
  }

  handleOk10(): void {
    this.isVisible10 = false;
  }

  handleCancel10(): void {
    this.isVisible10 = false;
  }




  //Pdf
  handleCancel1(): void {
    this.isVisiblepdf = false;
  }



  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    console.log(this.sortKey);

    this.sortValue = sort.value;
    console.log(this.sortValue);

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
      filters = ''
    }
    if (exportToExcel) {
      this.exportLoading = true;


      this.api.getEventreport(0, 0, this.sortKey, this.sortValue, filters, this.SelectedYear, "", this.federationID, this.unitID, this.groupID).subscribe(data => {
        if (data['code'] == 200) {
          this.dataListForExport = data['data'];
          this.totalRecords = data['count'];
          this.convertInExcel();
          this.exportLoading = false;
        }
      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }


    else if (exportToPDF) {
      this.exportInPDFLoading1 = true;
      this.api.getEventreport(0, 0, this.sortKey, this.sortValue, filters, this.SelectedYear, "", this.federationID, this.unitID, this.groupID).subscribe(data => {
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
      this.api.getEventreport(this.pageIndex, this.pageSize, this.sortKey, this.sortValue, filters, this.SelectedYear, "", this.federationID, this.unitID, this.groupID).subscribe(data => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
        }
        else {
          this.loadingRecords = false;
          this.message.error("Server Not Found", "");
        }
      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  onSearching() {
    document.getElementById("button1").focus();
    this.search(true);
  }

  getEvent() {
    this.loadingRecords = true;
    this.FilterQuery = this.filtername + this.filterDate + this.filterVanue + this.filterCreator + this.filterFederation + this.filterUnit + this.filterGroup + this.eventfilterstatus;

    this.api.getEventreport(this.pageIndex, this.pageSize, this.sortKey, "desc", "", this.SelectedYear, this.FilterQuery, this.federationID, this.unitID, this.groupID).subscribe(data => {

      if ((data['code'] == 200)) {
        this.dataList = data['data'];
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


  getEventFilter() {

    if (this.filtername == ') )') {
      this.filtername = '';
    }
    if (this.filterDate == ') )') {
      this.filterDate = '';
    }
    if (this.filterVanue == ') )') {
      this.filterVanue = '';
    }
    if (this.filterCreator == ') )') {
      this.filterCreator = '';
    }
    if (this.filterFederation == ') )') {
      this.filterFederation = '';
    }
    if (this.filterUnit == ') )') {
      this.filterUnit = '';
    }
    if (this.filterGroup == ') )') {
      this.filterGroup = '';
    }
    if (this.eventfilterstatus == ') )') {
      this.eventfilterstatus = '';
    }
    if (this.filterLike == ') )') {
      this.filterLike = '';
    }
    if (this.filterComment == ') )') {
      this.filterComment = '';
    }
    this.FilterQuery = this.filtername + this.filterDate + this.filterVanue + this.filterCreator + this.filterFederation + this.filterUnit + this.filterGroup + this.eventfilterstatus + this.filterLike + this.filterComment;


    this.api.getEventreport(this.pageIndex, this.pageSize, this.sortKey, "desc", "", this.SelectedYear, this.FilterQuery, this.federationID, this.unitID, this.groupID).subscribe(data => {

      if ((data['code'] == 200)) {
        this.dataList = data['data'];
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




  ClearFilter() {
    this.values = [];
    this.FilterQuery = "";

    this.values.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });

    this.getEvent();
  }
  ClearFilter2() {
    this.values1 = [];
    this.FilterQuery = '';

    this.getEvent();
    this.values1.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });

  }
  ClearFilter3() {
    this.values3 = [];
    this.FilterQuery = '';
    this.values3.push({ filter: [{ DATE: "", DROPDOWN: '', DATE2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getEvent();
  }
  ClearFilter4() {
    this.values4 = [];
    this.FilterQuery = '';
    this.values4.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getEvent();
  }
  ClearFilter5() {
    this.values5 = [];
    this.FilterQuery = '';
    this.values5.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getEvent();
  }
  ClearFilter6() {
    this.values6 = [];
    this.FilterQuery = '';
    this.values6.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getEvent();
  }
  ClearFilter7() {
    this.values7 = [];
    this.FilterQuery = '';
    this.values7.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getEvent();
  }
  ClearFilter8() {
    this.values8 = [];
    this.FilterQuery = '';
    this.values8.push({ filter: [{ INPUT: "", DROPDOWN: '', INPUT2: "", buttons: { AND: false, OR: false, IS_SHOW: false }, }], Query: '', buttons: { AND: false, OR: false, IS_SHOW: false }, });
    this.getEvent();
  }

  ClearAllFilter() {
    this.sortValue = "asc";
    this.sortKey = "id";
    this.values = [];
    this.values1 = [];
    this.values3 = [];
    this.values4 = [];
    this.values5 = [];
    this.values6 = [];
    this.values7 = [];
    this.values8 = [];
    this.mainFilterStatusArray = []
    this.filtername = '';
    this.filterDate = '';
    this.filterVanue = '';
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
    this.getEvent();
  }

  importInExcel() {
    this.search(true, true);
  }

  importInPdf() {
    this.search(true, false, true);
    this.isVisiblepdf = true;
  }


  convertInExcel() {
    console.log(this.selectCol)
    var arry1 = [];
    var obj1: any = new Object();
    for (var i = 0; i < this.dataListForExport.length; i++) {
      obj1['Federation Name'] = this.dataListForExport[i]['FEDERATION_NAME'];
      obj1['Unit Name'] = this.dataListForExport[i]['UNIT_NAME'];
      obj1['Group Name'] = this.dataListForExport[i]['GROUP_NAME'];
      if (this.Col4 == true) { obj1['Event Name'] = this.dataListForExport[i]['PROJECT_NAME'] };
      if (this.Col5 == true) { obj1['Event Creator'] = this.dataListForExport[i]['MEMBER_NAME'] };
      if (this.Col8 == true) { obj1['Event Date'] = this.datePipe.transform(this.dataListForExport[i]['DATE'], 'dd-MMM-yyyy') };
      if (this.Col9 == true) { obj1['Event Venue'] = this.dataListForExport[i]['VENUE'] };
      if (this.Col10 == true) { obj1['Status'] = this.dataListForExport[i]['STATUS'] == "P" ? "Pending" : this.dataListForExport[i]['STATUS'] == "C" ? "Completed" : "Ongoing" };



      // for(var j=0;j<this.selectCol.length;j++){
      //   if(this.selectCol[j]=='Event Creator'){
      //     obj1['Event Creator'] = this.dataListForExport[i]['MEMBER_NAME'];
      // }
      // else if(this.selectCol[j]=='Event Date'){
      //   obj1['Event Date'] = this.dataListForExport[i]['DATE'];
      // }
      // else if(this.selectCol[j]=='Event Venue'){
      //   obj1['Event Venue'] = this.dataListForExport[i]['VENUE'];

      // }
      // else if(this.selectCol[j]=='Status'){
      //   obj1['Status'] = this.dataListForExport[i]['STATUS']=="P"?"Pending":this.dataListForExport[i]['STATUS']=="C"?"Completed":"Ongoing";

      // }

      // }




      arry1.push(Object.assign({}, obj1));
      if (i == this.dataListForExport.length - 1) {
        this._exportService.exportExcel(arry1, 'Event Report' + this.datePipe.transform(new Date(), 'dd-MMM-yy, hh mm ss a'));
      }
    }
  }

  getActiveStatus(status) {
    if (status == "P") {
      return "Pending";
    }
    else if (status == "C") {
      return "Completed";
    }
    else {
      return "Ongoing"
    }
  }



  //Event name
  applyAnd(i: any) {
    this.values[i]['buttons']['AND'] = true
    this.values[i]['buttons']['OR'] = false;
  }

  applyOr(i: any) {
    this.values[i]['buttons']['AND'] = false
    this.values[i]['buttons']['OR'] = true;

  }
  applyAnd1(i: any, j: any) {
    this.values[i]['filter'][j]['buttons']['OR'] = false
    this.values[i]['filter'][j]['buttons']['AND'] = true;
  }
  applyOr2(i: any, j: any) {
    this.values[i]['filter'][j]['buttons']['OR'] = true
    this.values[i]['filter'][j]['buttons']['AND'] = false;
  }




  //no.of.invities
  applyFirst(i: any) {
    this.values1[i]['buttons']['AND'] = true
    this.values1[i]['buttons']['OR'] = false;
  }
  applySecond(i: any) {
    this.values1[i]['buttons']['AND'] = false
    this.values1[i]['buttons']['OR'] = true;
    console.log(this.values1)
  }
  applyAnd3(i: any, j: any) {
    this.values1[i]['filter'][j]['buttons']['OR'] = false
    this.values1[i]['filter'][j]['buttons']['AND'] = true;
  }
  applyOr3(i: any, j: any) {
    this.values1[i]['filter'][j]['buttons']['OR'] = true
    this.values1[i]['filter'][j]['buttons']['AND'] = false;
    console.log(this.values1)
  }

  //date
  dateAnd(i: any) {
    this.values2[i]['buttons']['AND'] = true
    this.values2[i]['buttons']['OR'] = false;
  }
  dateOr(i: any) {
    this.values2[i]['buttons']['AND'] = false
    this.values2[i]['buttons']['OR'] = true;
    console.log(this.values2)
  }
  applydate1(i: any, j: any) {
    this.values2[i]['filter'][j]['buttons']['OR'] = false
    this.values2[i]['filter'][j]['buttons']['AND'] = true;
  }
  applydate2(i: any, j: any) {
    this.values2[i]['filter'][j]['buttons']['OR'] = true
    this.values2[i]['filter'][j]['buttons']['AND'] = false;
    console.log(this.values2)
  }

  //Attendance
  applyAttendanceFirst(i: any) {
    this.values3[i]['buttons']['AND'] = true
    this.values3[i]['buttons']['OR'] = false;
  }
  applyAttendanceSecond(i: any) {
    this.values3[i]['buttons']['AND'] = false
    this.values3[i]['buttons']['OR'] = true;
  }
  applyAttendanceAnd3(i: any, j: any) {
    this.values3[i]['filter'][j]['buttons']['OR'] = false
    this.values3[i]['filter'][j]['buttons']['AND'] = true;
  }
  applyAttendanceOr3(i: any, j: any) {
    this.values3[i]['filter'][j]['buttons']['OR'] = true
    this.values3[i]['filter'][j]['buttons']['AND'] = false;
  }

  //Event creator
  applyCreatorFirst(i: any) {
    this.values4[i]['buttons']['AND'] = true
    this.values4[i]['buttons']['OR'] = false;
  }
  applyCreatorSecond(i: any) {
    this.values4[i]['buttons']['AND'] = false
    this.values4[i]['buttons']['OR'] = true;
  }
  applyCreatorAnd3(i: any, j: any) {
    this.values4[i]['filter'][j]['buttons']['OR'] = false
    this.values4[i]['filter'][j]['buttons']['AND'] = true;
  }
  applyCreatorOr3(i: any, j: any) {
    this.values4[i]['filter'][j]['buttons']['OR'] = true
    this.values4[i]['filter'][j]['buttons']['AND'] = false;
  }



  //Event Vanue
  applyVanueFirst(i: any) {
    this.values5[i]['buttons']['AND'] = true
    this.values5[i]['buttons']['OR'] = false;
  }
  applyVanueSecond(i: any) {
    this.values5[i]['buttons']['AND'] = false
    this.values5[i]['buttons']['OR'] = true;
  }
  applyVanueAnd3(i: any, j: any) {
    this.values5[i]['filter'][j]['buttons']['OR'] = false
    this.values5[i]['filter'][j]['buttons']['AND'] = true;
  }
  applyVanueOr3(i: any, j: any) {
    this.values5[i]['filter'][j]['buttons']['OR'] = true
    this.values5[i]['filter'][j]['buttons']['AND'] = false;
  }

  //federation
  applyFederationFirst(i: any) {
    this.values6[i]['buttons']['AND'] = true
    this.values6[i]['buttons']['OR'] = false;
  }
  applyFederationSecond(i: any) {
    this.values6[i]['buttons']['AND'] = false
    this.values6[i]['buttons']['OR'] = true;
  }
  applyFederationAnd3(i: any, j: any) {
    this.values6[i]['filter'][j]['buttons']['OR'] = false
    this.values6[i]['filter'][j]['buttons']['AND'] = true;
  }
  applyFederationOr3(i: any, j: any) {
    this.values6[i]['filter'][j]['buttons']['OR'] = true
    this.values6[i]['filter'][j]['buttons']['AND'] = false;
  }

  //unit
  applyUnitFirst(i: any) {
    this.values7[i]['buttons']['AND'] = true
    this.values7[i]['buttons']['OR'] = false;
  }
  applyUnitSecond(i: any) {
    this.values7[i]['buttons']['AND'] = false
    this.values7[i]['buttons']['OR'] = true;
  }
  applyUnitAnd3(i: any, j: any) {
    this.values7[i]['filter'][j]['buttons']['OR'] = false
    this.values7[i]['filter'][j]['buttons']['AND'] = true;
  }
  applyUnitOr3(i: any, j: any) {
    this.values7[i]['filter'][j]['buttons']['OR'] = true
    this.values7[i]['filter'][j]['buttons']['AND'] = false;
  }


  //Group
  applyGroupFirst(i: any) {
    this.values8[i]['buttons']['AND'] = true
    this.values8[i]['buttons']['OR'] = false;
  }
  applyGroupSecond(i: any) {
    this.values8[i]['buttons']['AND'] = false
    this.values8[i]['buttons']['OR'] = true;
  }
  applyGroupAnd3(i: any, j: any) {
    this.values8[i]['filter'][j]['buttons']['OR'] = false
    this.values8[i]['filter'][j]['buttons']['AND'] = true;
  }
  applyGroupOr3(i: any, j: any) {
    this.values8[i]['filter'][j]['buttons']['OR'] = true
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

  //event name
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

  //Eevent date
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

  //event date
  CloseDateCount(i: any) {
    if (i == 0) {
      return false;
    } else {
      this.values3.splice(i, 1);
      return true;
    }
  }
  CloseDATECount1(i: any, j: any) {
    if (this.values3[i]['filter'].length == 1 || j == 0) {
      return false;
    } else {
      this.values3[i]['filter'].splice(j, 1);
      return true;
    }
  }

  AddFilterDATECount(i: any, j: any) {
    this.values3[i]['filter'].push({
      INPUT: "", DROPDOWN: '', INPUT2: '', buttons: {
        AND: false, OR: false, IS_SHOW: true
      },
    });
    return true;
  }

  AddFilterDATECount1() {
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



  //Event Creator
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


  filtersEventCount1 = '';
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
            }
            else if (this.values[i]['filter'][j]['DROPDOWN'] == "End With") {

              condition = "LIKE" + "'%" + this.values[i]['filter'][j]['INPUT'] + "'";
            }
            else {
              condition = "LIKE" + " '%" + this.values[i]['filter'][j]['INPUT'] + "%'";
            }
            this.filtersEventCount1 = Button + Button1 + ' ' + this.model + " " + condition + " ";
          } else {
            this.filtersEventCount1 = Button + Button1 + ' ' + this.model + " " + this.values[i]['filter'][j]['DROPDOWN'] + " '" + this.values[i]['filter'][j]['INPUT'] + "'";
          }
          this.filter = this.filter + this.filtersEventCount1;
        }
        this.filter = this.filter + ") )";
      }
      console.log(this.filter);
      this.filtername = ' AND ' + this.filter;

      this.getEventFilter()
      this.isVisible = false
    }
    else {
      this.getEventFilter()

      this.isVisible = false
    }
  }

  filtersEventCount = '';
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

            this.filtersEventCount = Button + Button1 + ' ' + this.model + " " + this.values1[i]['filter'][j]['DROPDOWN'] + " '" + this.values1[i]['filter'][j]['INPUT'] + "' AND '" + this.values1[i]['filter'][j]['INPUT2'] + "'";
          } else {
            this.filtersEventCount = Button + Button1 + ' ' + this.model + " " + this.values1[i]['filter'][j]['DROPDOWN'] + " '" + this.values1[i]['filter'][j]['INPUT'] + "'";
          }
          this.filter = this.filter + this.filtersEventCount;
        }
        this.filter = this.filter + ") )";
      }
      console.log(this.filter);

    }

    else {
      this.getEventFilter()

      this.isVisible = false
    }
  }


  filtersDateCount = '';
  ApplyDateFilter2() {
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
            this.filtersDateCount = Button + Button1 + ' ' + this.model + " " + this.values3[i]['filter'][j]['DROPDOWN'] + " '" + this.datePipe.transform(this.values3[i]['filter'][j]['DATE'], "yyyy-MM-dd") + "' AND '" + this.datePipe.transform(this.values3[i]['filter'][j]['DATE2'], "yyyy-MM-dd") + "'";
          } else {
            this.filtersDateCount = Button + Button1 + ' ' + this.model + " " + this.values3[i]['filter'][j]['DROPDOWN'] + " '" + this.datePipe.transform(this.values3[i]['filter'][j]['DATE'], "yyyy-MM-dd") + "'";
          }
          this.filter = this.filter + this.filtersDateCount;
        }
        this.filter = this.filter + ") )";
      }
      console.log(this.filter);
      this.filterDate = ' AND ' + this.filter;

      this.getEventFilter()

      this.isVisible5 = false
    }
    else {
      this.getEventFilter()

      this.isVisible5 = false
    }
  }




  filtersAttendanceCount = '';
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

            this.filtersAttendanceCount = Button + Button1 + ' ' + this.model + " " + this.values3[i]['filter'][j]['DROPDOWN'] + " '" + this.values3[i]['filter'][j]['INPUT'] + "' AND '" + this.values3[i]['filter'][j]['INPUT2'] + "'";
          } else {
            this.filtersAttendanceCount = Button + Button1 + ' ' + this.model + " " + this.values3[i]['filter'][j]['DROPDOWN'] + " '" + this.values3[i]['filter'][j]['INPUT'] + "'";
          }
          this.filter = this.filter + this.filtersAttendanceCount;
        }
        this.filter = this.filter + ") )";
      }
      console.log(this.filter);
    }

    else {
      this.getEventFilter()

      this.isVisible = false
    }
  }


  filtersEventCreator = '';
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
            this.filtersEventCreator = Button + Button1 + ' ' + this.model + " " + condition + " ";
          } else {
            this.filtersEventCreator = Button + Button1 + ' ' + this.model + " " + this.values4[i]['filter'][j]['DROPDOWN'] + " '" + this.values4[i]['filter'][j]['INPUT'] + "'";
          }
          this.filter = this.filter + this.filtersEventCreator;
        }
        this.filter = this.filter + ") )";
      }
      console.log(this.filter);
      this.filterCreator = ' AND ' + this.filter;

      this.getEventFilter()

      this.isVisible6 = false
    }
    else {
      this.getEventFilter()

      this.isVisible6 = false
    }
  }

  filtersEventVanue = '';
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
            this.filtersEventVanue = Button + Button1 + ' ' + this.model + " " + condition + " ";
          } else {
            this.filtersEventVanue = Button + Button1 + ' ' + this.model + " " + this.values5[i]['filter'][j]['DROPDOWN'] + " '" + this.values5[i]['filter'][j]['INPUT'] + "'";
          }
          this.filter = this.filter + this.filtersEventVanue;
        }
        this.filter = this.filter + ") )";
      }
      console.log(this.filter);
      this.filterVanue = ' AND ' + this.filter;

      this.getEventFilter()

      this.isVisible7 = false
    }
    else {
      this.getEventFilter()

      this.isVisible7 = false
    }
  }

  filtersEventFederation = '';
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
              condition = "LIKE" + "'%" + this.values6[i]['filter'][j]['INPUT'] + "%'";
            }
            this.filtersEventFederation = Button + Button1 + ' ' + this.model + " " + condition + " ";
          } else {
            this.filtersEventFederation = Button + Button1 + ' ' + this.model + " " + this.values6[i]['filter'][j]['DROPDOWN'] + " '" + this.values6[i]['filter'][j]['INPUT'] + "'";
          }
          this.filter = this.filter + this.filtersEventFederation;
        }
        this.filter = this.filter + ") )";
      }
      console.log(this.filter);
      this.filterFederation = ' AND ' + this.filter;

      this.getEventFilter()

      this.isVisible8 = false
    }
    else {
      this.getEventFilter()

      this.isVisible8 = false
    }
  }

  filtersEventGroup = '';
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
            this.filtersEventGroup = Button + Button1 + ' ' + this.model + " " + condition + " ";
          } else {
            this.filtersEventGroup = Button + Button1 + ' ' + this.model + " " + this.values8[i]['filter'][j]['DROPDOWN'] + " '" + this.values8[i]['filter'][j]['INPUT'] + "'";
          }
          this.filter = this.filter + this.filtersEventGroup;
        }
        this.filter = this.filter + ") )";
      }
      console.log(this.filter);
      this.filterGroup = ' AND ' + this.filter;

      this.getEventFilter()

      this.isVisible10 = false
    }
    else {
      this.getEventFilter()

      this.isVisible10 = false
    }
  }

  filtersEventUnit = '';
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
            this.filtersEventUnit = Button + Button1 + ' ' + this.model + " " + condition + " ";
          } else {
            this.filtersEventUnit = Button + Button1 + ' ' + this.model + " " + this.values7[i]['filter'][j]['DROPDOWN'] + " '" + this.values7[i]['filter'][j]['INPUT'] + "'";
          }
          this.filter = this.filter + this.filtersEventUnit;
        }
        this.filter = this.filter + ") )";
      }
      console.log(this.filter);
      this.filterUnit = ' AND ' + this.filter;
      this.getEventFilter()

      this.isVisible9 = false
    }
    else {
      this.getEventFilter()

    }
  }

  //======================================
  showModal8(): void {
    this.isVisibleStatus = true;
    this.model = "STATUS";
    this.model_name = 'Status'
  }

  model_name: string = "";
  isVisibleStatus = false;

  showModalStatus(): void {
    this.isVisibleStatus = true;
    this.model = "STATUS";
    this.model_name = 'Status'
  }

  modelCancelStatus() {
    this.isVisibleStatus = false;
  }

  ANDBUTTONLASTStatus(i: any) {
    this.mainFilterStatusArray[i]['buttons']['AND'] = true
    this.mainFilterStatusArray[i]['buttons']['OR'] = false;
  }

  ORBUTTONLASTStatus(i: any) {
    this.mainFilterStatusArray[i]['buttons']['AND'] = false
    this.mainFilterStatusArray[i]['buttons']['OR'] = true;
  }

  ANDBUTTONLASTStatus1(i: any, j: any) {
    this.mainFilterStatusArray[i]['filter'][j]['buttons']['OR'] = false
    this.mainFilterStatusArray[i]['filter'][j]['buttons']['AND'] = true;
  }

  ORBUTTONLASTStatus1(i: any, j: any) {
    this.mainFilterStatusArray[i]['filter'][j]['buttons']['OR'] = true
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
    this.getEvent();
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
    this.getEvent();
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

        this.filterStatus = this.filterStatus + ") )";
      }

      console.log(this.filterStatus);

      if (isok) {
        this.isVisibleStatus = false;
        this.eventfilterstatus = ' AND ' + this.filterStatus;
        this.getEventFilter();
        this.isVisibleStatus = false;
      }

      else {
        this.getEventFilter()
        this.isVisibleStatus = false;
      }
    }
  }

  selectCol = [];

  addColumn(colName: []) {
    this.selectCol = colName;
    this.columns = [];
    this.Col1 = true;
    this.Col2 = true;
    this.Col3 = true;
    this.Col4 = true;
    this.Col5 = false;
    // this.Col6 = false;
    // this.Col7 = false;
    this.Col8 = false;
    this.Col9 = false;
    this.Col10 = false;
    this.SelectColumn1 = this.nodes[0]['children'];
    // this.SelectColumn = this.tagValue1

    for (let i = 0; i <= 8; i++) {
      if (this.tagValue1[i] == "Federation Name") { this.Col1 = true; }
      if (this.tagValue1[i] == "Unit Name") { this.Col2 = true; }
      if (this.tagValue1[i] == "Group Name") { this.Col3 = true; }
      if (this.tagValue1[i] == "Event Name") { this.Col4 = true; }
      if (this.tagValue1[i] == "Event Creator") { this.Col9 = true; }
      // if (this.tagValue1[i] == "No.Of.Invities") { this.Col6 = true; }
      // if (this.tagValue1[i] == "No.Of.Attendance") { this.Col7 = true; }
      if (this.tagValue1[i] == "Event Date") { this.Col8 = true; }
      if (this.tagValue1[i] == "Event Venue") { this.Col5 = true; }
      if (this.tagValue1[i] == "Status") { this.Col10 = true; }
    }

    if (this.tagValue1[0] == "Select All") {
      this.Col1 = true;
      this.Col2 = true;
      this.Col3 = true;
      this.Col4 = true;
      this.Col5 = true;
      this.Col8 = true;
      this.Col9 = true;
      this.Col10 = true;
    }
  }

  nodes = [{
    title: 'Select All', value: 'Select All', key: 'Select All',
    children: [
      {
        title: 'Event Creator',
        value: 'Event Creator',
        key: 'Event Creator',
        isLeaf: true
      },
      {
        title: 'Event Date',
        value: 'Event Date',
        key: 'Event Date',
        isLeaf: true
      },
      {
        title: 'Event Venue',
        value: 'Event Venue',
        key: 'Event Venue',
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
  filterDate: string = "";
  filterVanue: string = "";
  filterCreator: string = "";
  filterFederation: string = "";
  filterUnit: string = "";
  filterGroup: string = "";
  FilterQuery: string = "";
  drawerdata2 = [];

  AddData() {
    var f_filtar = '';

    if (this.federationID != 0) {
      f_filtar = " AND FEDERATION_ID=" + this.federationID;

    } else if (this.groupID != 0) {
      f_filtar = " AND GROUP_ID=" + this.groupID;

    } else if (this.unitID != 0) {
      f_filtar = " AND UNIT_ID=" + this.unitID;
    }

    this.drawerTitle1 = "Schedule Report";
    this.drawerData1 = new REPORTSCHEDULE();
    this.drawerVisible1 = true;
    this.drawerData1.SCHEDULE = "D";
    this.drawerData1.FILTER_QUERY = this.FilterQuery + " AND YEAR(DATE)='" + this.SelectedYear + "'" + f_filtar;
    this.drawerData1.SORT_KEY = this.sortKey;
    this.drawerData1.SORT_VALUE = this.sortValue;
    this.drawerData1.USER_ID = parseInt(this._cookie.get('userId'));
    this.drawerData1.REPORT_ID = 4;

    this.api.getScheduledReport(this.pageIndex, this.pageSize, "", "", "" + 'AND STATUS=1 AND REPORT_ID = 4').subscribe(data => {
      if ((data['code'] == 200)) {
        this.drawerdata2 = data['data'];
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

  getWidth() {
    if (window.innerWidth <= 400) {
      return 380;

    } else {
      return 850;
    }
  }

  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }

  mainFilterLike = [];
  mainFilterComment = [];

  filterComment = '';
  filterLike = '';

  isVisibleLike: boolean = false;

  showModalLike(): void {
    this.isVisibleLike = true;
    this.model = "LIKE_COUNT";
    this.model_name = 'Like'

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
    console.log("mainFilterLike = ", this.mainFilterLike);


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

    this.getEventFilter();
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
        this.getEventFilter();
      }
    }
  }

  isVisibleComment: boolean = false;

  showModalComment(): void {
    this.isVisibleComment = true;
    this.model = "COMMENT_COUNT";
    this.model_name = 'Comment';

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

    this.getEventFilter();
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
            this.message.error('Input', 'Please fill the field');
            isok = false;

          } else
            if ((this.mainFilterComment[i]['filter'][j]['INPUT2'] == undefined || this.mainFilterComment[i]['filter'][j]['INPUT2'] == '') && (this.mainFilterComment[i]['filter'][j]['DROPDOWN'] == "Between")) {
              this.message.error('Input', 'Please fill the field');
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
        this.getEventFilter();
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

}
