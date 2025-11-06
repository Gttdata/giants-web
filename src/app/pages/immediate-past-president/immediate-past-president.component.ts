import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { GroupProjectMaster } from 'src/app/Models/GroupProjectMaster';
import { ImmediatePastPrecidentTitleDrawer, ImmediatePastPresident } from 'src/app/Models/ImmediatePastPresident';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-immediate-past-president',
  templateUrl: './immediate-past-president.component.html',
  styleUrls: ['./immediate-past-president.component.css']
})

export class ImmediatePastPresidentComponent implements OnInit {
  constructor(private api: ApiService, private message: NzNotificationService, private cookie: CookieService, private datePipe: DatePipe) { }

  @Input() data: ImmediatePastPresident = new ImmediatePastPresident();
  @Input() isRemarkVisible: boolean;
  @Input() drawerClose!: Function;
  @Input() drawerVisible: boolean = false;
  @Input() ImmediatedrawerPastdataArray: any[];
 
  loadingRecords = true;
  formTitle = "Projects";
  dataList = [];
  projects: any[] = []
  ImmediatedrawerTitleData: ImmediatePastPrecidentTitleDrawer = new ImmediatePastPrecidentTitleDrawer();
  mobpattern = /^[6-9]\d{9}$/;
  isSpinning = false;
  ImmediatedrawerTitleVisible: boolean = false;
  isOk: boolean = false
  drawerTitle: string = '';
  validation = true;

  ngOnInit(): void {
    this.data.SWITCH_IMMEDIATE = true;
    this.LoadYears();
    this.Fordate();
  }

  omit(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  alphaOnly(event: any) {
    event = (event) ? event : window.event;
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }



  SWITCH_IMMEDIATE: boolean = true;
  onChange(result: Date): void {
    console.log('onChange: ', result);
  }
  closeDrawerImmediat() {
    this.drawerVisible = false;
    this.ImmediatedrawerTitleVisible = false;
  }

  get closeDrawercallback0() {
    return this.closeDrawerImmediat.bind(this);
  }

  ApplyForAward(myForm: any) {
    this.data.IS_SUBMITED = 'S';
    this.save(myForm);
  }
  save(myForm: NgForm) {
    this.validation = false;
    var memberId = Number(this.cookie.get('userId'));
    this.data.GROUP_ID = Number(sessionStorage.getItem('HOME_GROUP_ID'));
    this.data.MEMBER_ID = Number(this.cookie.get('userId'));
    this.data.INITIATED_PROJECT_DETAILS = this.ImmediatedrawerPastdataArray;
    // this.data.CREATED_DATE = this.datePipe.transform(this.data.CREATED_DATE, "yyyy-MM-dd")
    var GroupId = Number(sessionStorage.getItem('HOME_GROUP_ID'));
    this.data.AWARD_TYPE = "I"
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
      this.data.IS_SUBMITED = 'D';

      this.message.error("All Feild Required", "");

    } else
      if (this.data.REGULAR_MEETNG_COUNT_TOTAL == undefined || this.data.REGULAR_MEETNG_COUNT_TOTAL <= 0) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';

        this.message.error('Please Enter Total Regular Meeting Count', '')
      } else
        if (this.data.REGULAR_MEETNG_COUNT_OUT_OF == undefined || this.data.REGULAR_MEETNG_COUNT_OUT_OF <= 0) {
          this.isOk = false;
          this.data.IS_SUBMITED = 'D';

          this.message.error('Please Enter Out Of Regular Meeting Count', '')
        } else
          if (this.data.REGULAR_MEETNG_COUNT_OUT_OF < 0 && (this.data.REGULAR_MEETNG_COUNT_OUT_OF < this.data.REGULAR_MEETNG_COUNT_TOTAL)) {
            this.isOk = false;
            this.data.IS_SUBMITED = 'D';

            this.message.error('Please Enter Valid Out Of Regular Meeting Count', '');
          }
          else
            if (this.data.BOARD_MEETNG_COUNT_TOTAL == undefined || this.data.BOARD_MEETNG_COUNT_TOTAL <= 0) {
              this.isOk = false;
              this.data.IS_SUBMITED = 'D';

              this.message.error('Please Enter Board Meeting Count', '')
            } else
              if (this.data.BOARD_MEETNG_COUNT_OUT_OF == undefined || this.data.BOARD_MEETNG_COUNT_OUT_OF <= 0) {
                this.isOk = false;
                this.data.IS_SUBMITED = 'D';

                this.message.error('Please Enter Out Of Board Meeting Count', '')
              } else
                if (this.data.BOARD_MEETNG_COUNT_OUT_OF < 0 && (this.data.BOARD_MEETNG_COUNT_OUT_OF < this.data.BOARD_MEETNG_COUNT_TOTAL)) {
                  this.isOk = false;
                  this.data.IS_SUBMITED = 'D';

                  this.message.error('Please Enter Valid Out Of Board Meeting Count', '');
                }
                else
                  if (this.data.PROJECTS_COUNT_TOTAL == undefined || this.data.PROJECTS_COUNT_TOTAL <= 0) {
                    this.isOk = false
                    this.data.IS_SUBMITED = 'D';

                    this.message.error('Please Enter Project Count', '')
                  } else
                    if (this.data.PROJECTS_COUNT_OUT_OF == undefined || this.data.PROJECTS_COUNT_OUT_OF <= 0) {
                      this.isOk = false;
                      this.data.IS_SUBMITED = 'D';

                      this.message.error('Please Enter Out Of Project Count', '')
                    } else
                      if (this.data.PROJECTS_COUNT_OUT_OF < 0 && (this.data.PROJECTS_COUNT_OUT_OF < this.data.PROJECTS_COUNT_TOTAL)) {
                        this.isOk = false;
                        this.data.IS_SUBMITED = 'D';

                        this.message.error('Please Enter Valid Out Of Board Meeting Count', '');
                      }
                      else
                        if (this.data.MEMBERSHIP_EXTENSION_CONTRIBUTE_COUNT == undefined || this.data.MEMBERSHIP_EXTENSION_CONTRIBUTE_COUNT <= 0) {
                          this.isOk = false;
                          this.data.IS_SUBMITED = 'D';

                          this.message.error('Please Enter Membership Extension', '')
                        } else
                          if (this.data.MEMBERSHIP_RETENTION_CONTRIBUTE_COUNT == undefined || this.data.MEMBERSHIP_RETENTION_CONTRIBUTE_COUNT <= 0) {
                            this.isOk = false;
                            this.data.IS_SUBMITED = 'D';

                            this.message.error('Please Enter Membership Retension', '')
                          } else
                            if (this.data.AS_A_ASSET_DETAILS == null || this.data.AS_A_ASSET_DETAILS.trim() == '') {
                              this.isOk = false;
                              this.data.IS_SUBMITED = 'D';

                              this.message.error('Please Enter Asset Details', '')
                            } else
                              if (this.data.AS_A_MOTIVATION_DETAILS == null || this.data.AS_A_MOTIVATION_DETAILS.trim() == '') {
                                this.isOk = false;
                                this.data.IS_SUBMITED = 'D';

                                this.message.error('Please Enter Motivation Details', '')
                              } else
                                if (this.data.SWITCH_IMMEDIATE == true && (this.data.DISCHARGED_FISCAL_OBLIGATION_DETAILS == undefined || this.data.DISCHARGED_FISCAL_OBLIGATION_DETAILS.trim() == '')) {
                                  this.isOk = false;
                                  this.data.IS_SUBMITED = 'D';

                                  this.message.error('Please Enter Discharge Fiscal Obligation', '')
                                } else
                                  if (this.data.FUND_RAISING_PROGRAM_DETAILS == null || this.data.FUND_RAISING_PROGRAM_DETAILS.trim() == "") {
                                    this.isOk = false;
                                    this.data.IS_SUBMITED = 'D';

                                    this.message.error('Please Enter Fund Raising Program Details', '')
                                  } else
                                    if (this.data.FUND_RAISING_PROGRAM_PARTICIPATE_DETAILS == null || this.data.FUND_RAISING_PROGRAM_PARTICIPATE_DETAILS.trim() == '') {
                                      this.isOk = false;
                                      this.data.IS_SUBMITED = 'D';

                                      this.message.error('Please Enter Fund Raising Program Participate Details', '')
                                    } else
                                      if (this.data.UNIT_COUNCILS_TOTAL == undefined || this.data.UNIT_COUNCILS_TOTAL <= 0) {
                                        this.isOk = false;
                                        this.data.IS_SUBMITED = 'D';

                                        this.message.error('Please Enter Unit Council Total Count', '')
                                      } else
                                        if (this.data.UNIT_COUNCILS_OUT_OF == undefined || this.data.UNIT_COUNCILS_OUT_OF <= 0) {
                                          this.isOk = false;
                                          this.data.IS_SUBMITED = 'D';

                                          this.message.error('Please Enter Unit Council Out Of Count', '')
                                        } else
                                          if (this.data.UNIT_COUNCILS_OUT_OF < 0 && (this.data.UNIT_COUNCILS_OUT_OF < this.data.UNIT_COUNCILS_TOTAL)) {
                                            this.isOk = false;
                                            this.data.IS_SUBMITED = 'D';

                                            this.message.error('Please Enter Valid Out Of Unit Councils Count', '');
                                          } else
                                            if (this.data.UNIT_CONFERENCE_TOTAL == undefined || this.data.UNIT_CONFERENCE_TOTAL <= 0) {
                                              this.isOk = false;
                                              this.data.IS_SUBMITED = 'D';

                                              this.message.error('Please Enter Unit Conference Total Count', '')
                                            } else
                                              if (this.data.UNIT_CONFERENCE_OUT_OF == undefined || this.data.UNIT_CONFERENCE_OUT_OF <= 0) {
                                                this.isOk = false;
                                                this.data.IS_SUBMITED = 'D';

                                                this.message.error('Please Enter Unit Conference Out Of Count', '')
                                              } else
                                                if (this.data.UNIT_CONFERENCE_OUT_OF < 0 && (this.data.UNIT_CONFERENCE_OUT_OF < this.data.UNIT_CONFERENCE_TOTAL)) {
                                                  this.isOk = false;
                                                  this.data.IS_SUBMITED = 'D';

                                                  this.message.error('Please Enter Valid Out Of Unit Conference Count', '');
                                                } else
                                                  if (this.data.FED_CONVENTION_TOTAL == undefined || this.data.FED_CONVENTION_TOTAL <= 0) {
                                                    this.isOk = false;
                                                    this.data.IS_SUBMITED = 'D';

                                                    this.message.error('Please Enter Fed. Convention Total Cont', '')
                                                  } else
                                                    if (this.data.FED_CONVENTION_OUT_OF == undefined || this.data.FED_CONVENTION_OUT_OF <= 0) {
                                                      this.isOk = false;
                                                      this.data.IS_SUBMITED = 'D';

                                                      this.message.error('Please Enter Fed. Convention Out Of Count', '')
                                                    } else
                                                      if (this.data.FED_CONVENTION_OUT_OF < 0 && (this.data.FED_CONVENTION_OUT_OF < this.data.FED_CONVENTION_TOTAL)) {
                                                        this.isOk = false;
                                                        this.data.IS_SUBMITED = 'D';

                                                        this.message.error('Please Enter Valid Out Of Fed. Convension Count', '');
                                                      } else
                                                        if (this.data.GI_CONVENTION_TOTAL == undefined || this.data.GI_CONVENTION_TOTAL <= 0) {
                                                          this.isOk = false;
                                                          this.data.IS_SUBMITED = 'D';

                                                          this.message.error('Please Enter G.I.Convention Total Count', '')
                                                        } else
                                                          if (this.data.GI_CONVENTION_OUT_OF == undefined || this.data.GI_CONVENTION_OUT_OF <= 0) {
                                                            this.isOk = false;
                                                            this.data.IS_SUBMITED = 'D';

                                                            this.message.error('Please Enter G.I.Convention Out Of Count', '')
                                                          } else
                                                            // if (this.data.BRANCH_CONTRIBUTION_DETAILS == null || this.data.BRANCH_CONTRIBUTION_DETAILS == "") {
                                                            //   this.isOk = false
                                                            //   this.message.error('Please Enter Branch Countribution Count', '')
                                                            // } else
                                                            if (this.data.OTHER_DETAILS == null || this.data.OTHER_DETAILS.trim() == "") {
                                                              this.isOk = false
                                                              this.data.IS_SUBMITED = 'D';

                                                              this.message.error('Please Enter Other Details', '')
                                                            } else {
                                                              if (this.data.SWITCH_IMMEDIATE != true) { this.data.DISCHARGED_FISCAL_OBLIGATION_DETAILS = ' ' }
                                                              if (this.data.ID) {
                                                                this.api.UpdatePastPresident(this.data).subscribe(successCode => {
                                                                  if (successCode['code'] == 200) {
                                                                    this.message.success("Immediate Past President Details Updated Successfully", "");
                                                                    this.isSpinning = false;
                                                                    this.validation = true;
                                                                    this.drawerClose();
                                                                  } else {
                                                                    this.message.error("Immediate Past President Details Updation Failed", "");
                                                                    this.isSpinning = false;
                                                                  }
                                                                });
                                                              }
                                                              else {
                                                                this.api.createPastPresident(this.data).subscribe(successCode => {
                                                                  if (successCode['code'] == 200) {
                                                                    this.message.success("Immediate Past President Created Successfully", "");
                                                                    this.isSpinning = false;
                                                                    this.validation = true;
                                                                    this.drawerClose();

                                                                  } else {
                                                                    this.message.error("Immediate Past President Creation Failed", "");
                                                                    this.isSpinning = false;
                                                                  }
                                                                });
                                                              }
                                                            }
  }

  currentIndex: number

  editdata(data1: ImmediatePastPrecidentTitleDrawer, index: number): void {
    this.currentIndex = index;
    console.log("this.currentIndex", this.currentIndex);
    this.drawerTitle = "Update Title Details";
    this.ImmediatedrawerTitleData = Object.assign({}, data1);
    this.ImmediatedrawerTitleData.OUTSTANDING_PRESIDENT_ID = this.data.ID;
    this.ImmediatedrawerTitleVisible = true;
  }

  getwidth() {
    if (window.innerWidth < 400) {
      return 380;

    } else {
      return 800;
    }
  }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }
  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  OpenDrawer() {
    this.drawerVisible = true;
  }

  AddTitle(): void {
    console.log("Drawer cllaed..");
    this.drawerTitle = "Add Title Details";
    this.ImmediatedrawerTitleData = new ImmediatePastPrecidentTitleDrawer();
    this.ImmediatedrawerTitleVisible = true;
    this.currentIndex = -1;
  }

  get closeCallback() {
    return this.AddTable.bind(this);
  }

  closeDrawer() {
    this.drawerVisible = false;
    this.ImmediatedrawerTitleVisible = false;
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

  GIConvensionmeeting(GI_CONVENTION_TOTAL, GI_CONVENTION_OUT_OF) {
    if (GI_CONVENTION_OUT_OF != '') {
      if (parseInt(GI_CONVENTION_TOTAL) > parseInt(GI_CONVENTION_OUT_OF)) {
        this.message.error("G.I Convention", "Please fill the corrected data");
        this.data.GI_CONVENTION_TOTAL = null;
      }
    }
  }

  AddTable() {
    console.log("this.currentIndex", this.currentIndex);
    this.ImmediatedrawerTitleData.OUTSTANDING_PRESIDENT_ID = this.data.ID;
    console.log("Closed function " + this.ImmediatedrawerTitleData.RESULT);

    if (this.currentIndex > -1) {
      this.ImmediatedrawerPastdataArray[this.currentIndex] = this.ImmediatedrawerTitleData;
      this.ImmediatedrawerPastdataArray = [...[], ...this.ImmediatedrawerPastdataArray];

    } else {
      this.ImmediatedrawerPastdataArray = [...this.ImmediatedrawerPastdataArray, ...[this.ImmediatedrawerTitleData]];
    }

    this.currentIndex = -1;
    console.log("Conti Array" + this.ImmediatedrawerPastdataArray);
    this.ImmediatedrawerTitleVisible = false;
  }

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
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }


  year = new Date().getFullYear();
  baseYear = 2020;
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
    this.data = new ImmediatePastPresident();
    this.ImmediatedrawerPastdataArray = [];
    this.SelectedYear = itsYear;
    var member = this.cookie.get('userId');

    this.api.getAllPastPresident(0, 0, 'ID', 'ASC', " AND MEMBER_ID=" + member + " AND AWARD_TYPE = 'I'", this.SelectedYear).subscribe(data => {
      if (data['count'] > 0) {
        this.data = Object.assign({}, data['data'][0]);

        this.api.getAllPastPresidentInitiatedProjectdetails(0, 0, 'ID', 'ASC', 'AND OUTSTANDING_PRESIDENT_ID = ' + this.data.ID).subscribe(dataSpons => {
          if (dataSpons['count'] > 0) {
            this.ImmediatedrawerPastdataArray = dataSpons['data'];

          } else {
            this.ImmediatedrawerPastdataArray = [];
          }
        });
      }
    });
  }
}
