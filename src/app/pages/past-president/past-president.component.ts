import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { PastPrecident, PastPrecidentTitleDrawer } from 'src/app/Models/PastPrecident';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-past-president',
  templateUrl: './past-president.component.html',
  styleUrls: ['./past-president.component.css']
})

export class PastPresidentComponent implements OnInit {
  @Input() data: PastPrecident = new PastPrecident();
  @Input() isRemarkVisible: boolean;
  @Input() drawerClose!: Function;
  @Input() drawerVisible: boolean = false;
  drawerTitleData: PastPrecidentTitleDrawer = new PastPrecidentTitleDrawer();
  @Input() drawerPastdataArray: any[];
  drawerTitleVisible: boolean = false;
  isOk: boolean = false
  isSpinning: boolean = false;
  drawerTitle: string = '';
  currentIndex: number;
  validation = true;

  constructor(private api: ApiService, private message: NzNotificationService, private cookie: CookieService, private datePipe: DatePipe) { }

  omit(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  SWITCH: boolean = true;

  ngOnInit() {
    this.LoadYears();
    this.Fordate();
  }

  ApplyForAward(myForm: any) {
    this.data.IS_SUBMITED = 'S';
    this.save(myForm);
  }

  regularmeeting(REGULAR_MEETNG_COUNT_TOTAL, REGULAR_MEETNG_COUNT_OUT_OF) {
    if (REGULAR_MEETNG_COUNT_OUT_OF != '') {
      if (parseInt(REGULAR_MEETNG_COUNT_TOTAL) > parseInt(REGULAR_MEETNG_COUNT_OUT_OF)) {
        this.message.error("Regular Meeting", "Please fill the corrected data");
        this.data.REGULAR_MEETNG_COUNT_TOTAL = null;
      }
    }
  }

  boardmeeting(BOARD_MEETNG_COUNT_TOTAL, BOARD_MEETNG_COUNT_OUT_OF) {
    if (BOARD_MEETNG_COUNT_OUT_OF != '') {
      if (parseInt(BOARD_MEETNG_COUNT_TOTAL) > parseInt(BOARD_MEETNG_COUNT_OUT_OF)) {
        this.message.error("Board Meeting", "Please fill the corrected data");
        this.data.BOARD_MEETNG_COUNT_TOTAL = null;
      }
    }
  }

  projectmeeting(PROJECTS_COUNT_TOTAL, PROJECTS_COUNT_OUT_OF) {
    if (PROJECTS_COUNT_OUT_OF != '') {
      if (parseInt(PROJECTS_COUNT_TOTAL) > parseInt(PROJECTS_COUNT_OUT_OF)) {
        this.message.error("Project Meeting", "Please fill the corrected data");
        this.data.PROJECTS_COUNT_TOTAL = null;
      }
    }
  }

  unitCouncilmeeting(UNIT_COUNCILS_TOTAL, UNIT_COUNCILS_OUT_OF) {
    if (UNIT_COUNCILS_OUT_OF != '') {
      if (parseInt(UNIT_COUNCILS_TOTAL) > parseInt(UNIT_COUNCILS_OUT_OF)) {
        this.message.error("Unit Council", "Please fill the corrected data");
        this.data.UNIT_COUNCILS_TOTAL = null;
      }
    }
  }

  unitConferencemeeting(UNIT_CONFERENCE_TOTAL, UNIT_CONFERENCE_OUT_OF) {
    if (UNIT_CONFERENCE_OUT_OF != '') {
      if (parseInt(UNIT_CONFERENCE_TOTAL) > parseInt(UNIT_CONFERENCE_OUT_OF)) {
        this.message.error("Unit Conference", "Please fill the corrected data");
        this.data.UNIT_CONFERENCE_TOTAL = null;
      }
    }
  }
  FedConvensionmeeting(FED_CONVENTION_TOTAL, FED_CONVENTION_OUT_OF) {
    if (FED_CONVENTION_OUT_OF != '') {
      if (parseInt(FED_CONVENTION_TOTAL) > parseInt(FED_CONVENTION_OUT_OF)) {
        this.message.error("Fed. Convention", "Please fill the corrected data");
        this.data.FED_CONVENTION_TOTAL = null;
      }
    }
  }

  // GI_CONVENTION_TOTAL
  GIConvensionmeeting(GI_CONVENTION_TOTAL, GI_CONVENTION_OUT_OF) {
    if (GI_CONVENTION_OUT_OF != '') {
      if (parseInt(GI_CONVENTION_TOTAL) > parseInt(GI_CONVENTION_OUT_OF)) {
        this.message.error("G.I Convention", "Please fill the corrected data");
        this.data.GI_CONVENTION_TOTAL = null;
      }
    }
  }

  save(myForm: NgForm) {
    this.validation = false;
    var memberId = Number(this.cookie.get('userId'));
    this.data.GROUP_ID = Number(sessionStorage.getItem('HOME_GROUP_ID'));
    this.data.MEMBER_ID = Number(this.cookie.get('userId'));
    this.data.INITIATED_PROJECT_DETAILS = this.drawerPastdataArray;
    console.log("submitted data = ", this.data.IS_SUBMITED);

    // this.data.CREATED_DATE = undefined
    var GroupId = Number(sessionStorage.getItem('HOME_GROUP_ID'));
    // this.data.CREATED_DATE=this.datePipe.transform(new Date(), "yyyy-MM-dd HH:MM:SS a");
    this.data.AWARD_TYPE = "P"
    if (
      this.data.REGULAR_MEETNG_COUNT_TOTAL != undefined && this.data.REGULAR_MEETNG_COUNT_OUT_OF != undefined
      && this.data.BOARD_MEETNG_COUNT_TOTAL != undefined && this.data.BOARD_MEETNG_COUNT_OUT_OF != undefined
      && this.data.PROJECTS_COUNT_TOTAL != undefined && this.data.PROJECTS_COUNT_OUT_OF != undefined
      && this.data.MEMBERSHIP_EXTENSION_CONTRIBUTE_COUNT != undefined && this.data.MEMBERSHIP_RETENTION_CONTRIBUTE_COUNT != undefined
      && this.data.AS_A_ASSET_DETAILS == "" && this.data.AS_A_MOTIVATION_DETAILS == "" && this.data.DISCHARGED_FISCAL_OBLIGATION_DETAILS == ""
      && this.data.FUND_RAISING_PROGRAM_DETAILS == "" && this.data.FUND_RAISING_PROGRAM_PARTICIPATE_DETAILS == ""
      && this.data.UNIT_COUNCILS_TOTAL != undefined && this.data.UNIT_COUNCILS_OUT_OF != undefined
      && this.data.UNIT_CONFERENCE_TOTAL != undefined && this.data.UNIT_CONFERENCE_OUT_OF != undefined
      && this.data.FED_CONVENTION_TOTAL != undefined && this.data.FED_CONVENTION_OUT_OF != undefined
      && this.data.GI_CONVENTION_TOTAL != undefined && this.data.GI_CONVENTION_OUT_OF != undefined
      && this.data.BRANCH_CONTRIBUTION_DETAILS == "" && this.data.OTHER_DETAILS == "") {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error("All Feild Required", "");
    } else if (this.data.REGULAR_MEETNG_COUNT_TOTAL == undefined || this.data.REGULAR_MEETNG_COUNT_TOTAL <= 0) {
      this.isOk = false
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Total Regular Meeting Count', '')
    } else if (this.data.REGULAR_MEETNG_COUNT_OUT_OF == undefined || this.data.REGULAR_MEETNG_COUNT_OUT_OF <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Out Of Regular Meeting Count', '')
    } else if (this.data.REGULAR_MEETNG_COUNT_OUT_OF < 0 && (this.data.REGULAR_MEETNG_COUNT_OUT_OF < this.data.REGULAR_MEETNG_COUNT_TOTAL)) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Valid Out Of Regular Meeting Count', '');
    } else if (this.data.BOARD_MEETNG_COUNT_TOTAL == undefined || this.data.BOARD_MEETNG_COUNT_TOTAL <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Board Meeting Count', '')
    } else if (this.data.BOARD_MEETNG_COUNT_OUT_OF == undefined || this.data.BOARD_MEETNG_COUNT_OUT_OF <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Out Of Board Meeting Count', '')
    } else if (this.data.BOARD_MEETNG_COUNT_OUT_OF < 0 && (this.data.BOARD_MEETNG_COUNT_OUT_OF < this.data.BOARD_MEETNG_COUNT_TOTAL)) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Valid Out Of Board Meeting Count', '');
    } else if (this.data.PROJECTS_COUNT_TOTAL == undefined || this.data.PROJECTS_COUNT_TOTAL <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Project Count', '')
    } else if (this.data.PROJECTS_COUNT_OUT_OF == undefined || this.data.PROJECTS_COUNT_OUT_OF <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Out Of Project Count', '')
    } else if (this.data.PROJECTS_COUNT_OUT_OF < 0 && (this.data.PROJECTS_COUNT_OUT_OF < this.data.PROJECTS_COUNT_TOTAL)) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Valid Out Of Board Meeting Count', '');
    } else if (this.data.MEMBERSHIP_EXTENSION_CONTRIBUTE_COUNT == undefined || this.data.MEMBERSHIP_EXTENSION_CONTRIBUTE_COUNT <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Membership Extension', '')
    } else if (this.data.MEMBERSHIP_RETENTION_CONTRIBUTE_COUNT == undefined || this.data.MEMBERSHIP_RETENTION_CONTRIBUTE_COUNT <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Membership Retension', '')
    } else if (this.data.AS_A_ASSET_DETAILS == null || this.data.AS_A_ASSET_DETAILS.trim() == '') {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Asset Details', '')
    } else if (this.data.AS_A_MOTIVATION_DETAILS == null || this.data.AS_A_MOTIVATION_DETAILS.trim() == '') {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Motivation Details', '')
    } else if (this.data.SWITCH == true && (this.data.DISCHARGED_FISCAL_OBLIGATION_DETAILS == undefined || this.data.DISCHARGED_FISCAL_OBLIGATION_DETAILS.trim() == '')) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Discharge Fiscal Obligation', '')
    } else if (this.data.FUND_RAISING_PROGRAM_DETAILS == null || this.data.FUND_RAISING_PROGRAM_DETAILS.trim() == "") {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Fund Raising Program Details', '')
    } else if (this.data.FUND_RAISING_PROGRAM_PARTICIPATE_DETAILS == null || this.data.FUND_RAISING_PROGRAM_PARTICIPATE_DETAILS.trim() == '') {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Fund Raising Program Participate Details', '')
    } else if (this.data.UNIT_COUNCILS_TOTAL == undefined || this.data.UNIT_COUNCILS_TOTAL <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Unit Council Total Count', '')
    } else if (this.data.UNIT_COUNCILS_OUT_OF == undefined || this.data.UNIT_COUNCILS_OUT_OF <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Unit Council Out Of Count', '')
    } else if (this.data.UNIT_COUNCILS_OUT_OF < 0 && (this.data.UNIT_COUNCILS_OUT_OF < this.data.UNIT_COUNCILS_TOTAL)) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Valid Out Of Unit Councils Count', '');
    } else if (this.data.UNIT_CONFERENCE_TOTAL == undefined || this.data.UNIT_CONFERENCE_TOTAL <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Unit Conference Total Count', '')
    } else if (this.data.UNIT_CONFERENCE_OUT_OF == undefined || this.data.UNIT_CONFERENCE_OUT_OF <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Unit Conference Out Of Count', '')
    } else if (this.data.UNIT_CONFERENCE_OUT_OF < 0 && (this.data.UNIT_CONFERENCE_OUT_OF < this.data.UNIT_CONFERENCE_TOTAL)) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Valid Out Of Unit Conference Count', '');
    } else if (this.data.FED_CONVENTION_TOTAL == undefined || this.data.FED_CONVENTION_TOTAL <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Fed. Convention Total Cont', '')
    } else if (this.data.FED_CONVENTION_OUT_OF == undefined || this.data.FED_CONVENTION_OUT_OF <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Fed. Convention Out Of Count', '')
    } else if (this.data.FED_CONVENTION_OUT_OF < 0 && (this.data.FED_CONVENTION_OUT_OF < this.data.FED_CONVENTION_TOTAL)) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Valid Out Of Fed. Convension Count', '');
    } else if (this.data.GI_CONVENTION_TOTAL == undefined || this.data.GI_CONVENTION_TOTAL <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter G.I.Convention Total Count', '')
    } else if (this.data.GI_CONVENTION_OUT_OF == undefined || this.data.GI_CONVENTION_OUT_OF <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter G.I.Convention Out Of Count', '')
    } else if (this.data.BRANCH_CONTRIBUTION_DETAILS == null || this.data.BRANCH_CONTRIBUTION_DETAILS.trim() == "") {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Branch Countribution Count', '')
    } else if (this.data.OTHER_DETAILS == null || this.data.OTHER_DETAILS.trim() == "") {
      this.isOk = false;
      this.data.IS_SUBMITED = "D";
      this.message.error('Please Enter Other Details', '')
    } else {
      if (this.data.SWITCH != true) { this.data.DISCHARGED_FISCAL_OBLIGATION_DETAILS = ' ' }

      if (this.data.ID) {
        this.api.UpdatePastPresident(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Past President Details Updated Successfully", "");
            this.isSpinning = false;
            this.validation = true;
            this.drawerClose();
          } else {
            this.message.error("Past President Details Updation Failed", "");
            this.isSpinning = false;
          }
        });
      }
      else {
        this.api.createPastPresident(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Past President Created Successfully", "");
            this.isSpinning = false;
            this.validation = true;
            this.drawerClose();

          } else {
            this.message.error("Past President Creation Failed", "");
            this.isSpinning = false;
          }
        });
      }
    }
  }

  AddTitle(): void {
    console.log("Drawer cllaed..");
    this.drawerTitle = "Add Title Details";
    this.drawerTitleData = new PastPrecidentTitleDrawer();
    this.drawerTitleVisible = true;
    this.currentIndex = -1;
  }

  editdata(data1: PastPrecidentTitleDrawer, index: number): void {
    this.currentIndex = index
    console.log("this.currentIndex", this.currentIndex);
    this.drawerTitle = "Update Title Details";
    this.drawerTitleData = Object.assign({}, data1);
    this.drawerTitleData.OUTSTANDING_PRESIDENT_ID = this.data.ID;
    this.drawerTitleVisible = true;
  }

  getwidth() {
    if (window.innerWidth < 400) {
      return 380;

    } else {
      return 800;
    }
  }

  closeDrawer0() {
    this.drawerVisible = false;
    this.drawerTitleVisible = false;
  }

  closeDrawerPast() {
    this.drawerVisible = false;
    this.drawerTitleVisible = false;
  }

  get closeDrawercallback0() {
    return this.closeDrawerPast.bind(this);
  }

  AddTable() {
    console.log("this.currentIndex", this.currentIndex);
    this.drawerTitleData.OUTSTANDING_PRESIDENT_ID = this.data.ID;

    console.log("Closed function " + this.drawerTitleData.RESULT);
    if (this.currentIndex > -1) {
      this.drawerPastdataArray[this.currentIndex] = this.drawerTitleData;
      this.drawerPastdataArray = [...[], ...this.drawerPastdataArray];

    } else {
      this.drawerPastdataArray = [...this.drawerPastdataArray, ...[this.drawerTitleData]];
    }

    this.currentIndex = -1;
    console.log("Conti Array" + this.drawerPastdataArray);
    this.drawerTitleVisible = false;
  }

  get closeCallback0() {
    return this.AddTable.bind(this);
  }

  isRemarkVisible0: boolean = false;
  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  totalRecords = 1;
  OldFetchedData: string[] = [];

  FetchOldData() {
    // this.message.info("Fetch Old Data", "Data Fetched") 
    const memberID = parseInt(this.cookie.get('userId'));
    this.api.getOutstandingPastPresidentOldDetails(memberID).subscribe(data => {
      if (data['code'] == '200') {
        this.totalRecords = data['count'];
        this.OldFetchedData = data['data'];
      }
      this.data.REGULAR_MEETNG_COUNT_TOTAL = this.OldFetchedData[0]['MEETING_ATTEMPTED'];
      this.data.REGULAR_MEETNG_COUNT_OUT_OF = this.OldFetchedData[0]['MEETING_INVITED'];
      this.data.PROJECTS_COUNT_TOTAL = this.OldFetchedData[0]['TOTAL_PROJECTS'];
      this.data.PROJECTS_COUNT_OUT_OF = this.OldFetchedData[0]['TOTAL_PROJECTS'];
      this.message.success(" Old Data Fetched Successfully ", "")
    }, err => {
      // this.GroupmeetsattendiesmapComponentVar.isSpinning = false;   
      if (err['ok'] == false) this.message.error("Server Not Found", "");
    });
  }

  year = new Date().getFullYear();
  baseYear = 2010;
  range = [];
  next_year = Number(this.year + 1)
  SelectedYear: any = this.year + "-" + this.next_year;
  currentDate = new Date();
  businessYearStartDate = new Date(this.currentDate.getFullYear() + 1, 3, 1);

  Fordate() {
    let currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= this.baseYear; i--) {
      this.range.push(i);
    }
  }

  CurrentYear: any;

  LoadYears() {
    this.SelectedYear = new Date().getFullYear();
    this.CurrentYear = this.SelectedYear;
  }

  selectChangeYear(itsYear: any) {
    this.data = new PastPrecident();
    this.drawerPastdataArray = [];
    this.SelectedYear = itsYear;
    var member = this.cookie.get('userId');

    this.api.getAllPastPresident(0, 0, 'ID', 'ASC', " AND MEMBER_ID=" + member + " AND AWARD_TYPE = 'P'", this.SelectedYear).subscribe(data => {
      if (data['count'] > 0) {
        this.data = Object.assign({}, data['data'][0]);

        this.api.getAllPastPresidentInitiatedProjectdetails(0, 0, 'ID', 'ASC', 'AND OUTSTANDING_PRESIDENT_ID = ' + this.data.ID).subscribe(dataSpons => {
          if (dataSpons['count'] > 0) {
            this.drawerPastdataArray = dataSpons['data'];

          } else {
            this.drawerPastdataArray = [];
          }
        });
      }
    });
  }
}
