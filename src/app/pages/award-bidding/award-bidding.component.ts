import { Component, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { VicePresident } from 'src/app/Models/vice-president';
import { ApiService } from 'src/app/Service/api.service';
import { ThePresident } from 'src/app/Models/the-president';
import { OutstandingPresidentDetails } from 'src/app/Models/outstanding-president-details';
import { ThePresidentComponent } from '../the-president/the-president.component';
import { Awardmaster } from 'src/app/Models/AwardMaster';
import { ImmediatePastPresident } from 'src/app/Models/ImmediatePastPresident';
import { GroupProjectMaster } from 'src/app/Models/GroupProjectMaster';
import { PastPrecident } from 'src/app/Models/PastPrecident';
import { OutstandingGroupMaster } from 'src/app/Models/OutstandingGroupMaster';
import { GiantWeekCelebration } from 'src/app/Models/GiantWeekCelebration';
import { Activities } from 'src/app/Models/activities';
import { ActivityProjectDetails } from 'src/app/Models/activity-project-details';
import { Adminstration } from 'src/app/Models/adminstration';
import { Membermaster } from 'src/app/Models/MemberMaster';
import { MemberAwardModel } from 'src/app/Models/MemberAward';
import { LadyMemberAwardModel } from 'src/app/Models/LadyMemberAward';
import { BestServiceProjectMaster } from 'src/app/Models/BestServiceProjectMaster';
import { OutstandingMonumental } from 'src/app/Models/OutstandingMonumental';
import { OustandingYoungGiantsDivisionMaster } from 'src/app/Models/OutstandingYoungGiantsDivision';

@Component({
  selector: 'app-award-bidding',
  templateUrl: './award-bidding.component.html',
  styleUrls: ['./award-bidding.component.css']
})

export class AwardBiddingComponent implements OnInit {
  formTitle: string = "Award Bidding";
  data: VicePresident = new VicePresident();
  mobpattern = '/^[0-9]\d{9}$/';
  validation: boolean = true;
  public Swicthing: boolean = true;
  public Swicthing1: boolean = true;
  public Swicthing2: boolean = true;
  public Swicthing3: boolean = true;
  sponsorship: boolean;
  federationID: number = Number(this._cookie.get("FEDERATION_ID"));
  unitID: number = Number(this._cookie.get("UNIT_ID"));
  groupID: number = Number(this._cookie.get("GROUP_ID"));
  roleID: number = Number(this._cookie.get('roleId'));
  GENDER: string = (this._cookie.get('gender') == 'null') ? 'M' : this._cookie.get('gender');
  GROUP: any[] = [];
  demoValue: number = 10;
  switching: any;
  group: string;
  optionList1: any[] = [];
  Branch: any[] = [];
  optionList2: any[] = [];

  constructor(private cookie: CookieService, private message: NzNotificationService, private api: ApiService, private _cookie: CookieService) { }

  ngOnInit() { }

  omit(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }

  compareFn(c1: boolean): boolean {
    return c1;
  }

  getwidth(): number {
    if (window.innerWidth <= 400) {
      return 380;

    } else {
      return 1050;
    }
  }

  visible: boolean = false;
  visible_activity: boolean = false;
  Past_president: boolean = false;
  VicePresident: boolean = false;
  drawerTitle1: string = '';
  isRemarkVisible1: boolean;
  drawerData1: VicePresident = new VicePresident();

  vicePresidentOfTheGroup(): void {
    this.drawerTitle1 = 'OUTSTANDING VICE PRESIDENT OF THE GROUP';
    this.drawerData1 = new VicePresident();
    this.drawerData1.CREATED_DATE = new Date();
    this.data.MEMBER_ID = parseInt(this._cookie.get('userId'));
    this.data.GROUP_ID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
    this.drawerData1.SWICTHING = false;
    this.drawerData1.SWICTHING1 = false;
    this.drawerData1.SWICTHING2 = false;
    this.drawerData1.SWICTHING3 = false;

    this.api.getVicePresident(0, 0, "", "asc", " AND MEMBER_ID=" + this.data.MEMBER_ID + " AND GROUP_ID=" + this.data.GROUP_ID, this.SelectedYear).subscribe(data => {
      if ((data['count'] > 0) && (data['code'] == 200)) {
        this.drawerData1 = data['data'][0];

        if ((data['data'][0]['DISCHARGED_DETAILS'] == null) || (data['data'][0]['DISCHARGED_DETAILS'] == ' ')) {
          this.drawerData1.SWICTHING = false;

        } else {
          this.drawerData1.SWICTHING = true;
        }

        if ((data['data'][0]['ACTIVITY_DETAILS'] == null) || (data['data'][0]['ACTIVITY_DETAILS'] == ' ')) {
          this.drawerData1.SWICTHING1 = false;

        } else {
          this.drawerData1.SWICTHING1 = true;
        }

        if ((data['data'][0]['INOVATIVATIVE_PROJECT_DETAILS'] == null) || (data['data'][0]['INOVATIVATIVE_PROJECT_DETAILS'] == ' ')) {
          this.drawerData1.SWICTHING2 = false;

        } else {
          this.drawerData1.SWICTHING2 = true;
        }

        if ((data['data'][0]['MEMBERSHIP_GROUP_GROWTH_DETAILS'] == null) || (data['data'][0]['MEMBERSHIP_GROUP_GROWTH_DETAILS'] == ' ')) {
          this.drawerData1.SWICTHING3 = false;

        } else {
          this.drawerData1.SWICTHING3 = true;
        }
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    this.VicePresident = true;
    this.isRemarkVisible1 = false;
  }

  drawerTitle3: string = '';

  drawerClose(): void {
    this.visible = false;
    this.visible_activity = false;
    this.VicePresident = false;
  }

  get closeCallback1() {
    return this.drawerClose.bind(this);
  }

  closeDrawer1(): void {
    this.visible = false;
    this.visible_activity = false;
    this.VicePresident = false;
  }

  outstandingPastPresident(): void {
    this.message.info("Coming Soon", "");
  }

  PresidentTitle: string = '';
  VisiablePresident: boolean = false;
  PresidentData: ThePresident = new ThePresident();
  PresidentDetilsData: OutstandingPresidentDetails = new OutstandingPresidentDetails();
  drawerPresidentDetails: any[] = [];
  PresidentVisible: boolean = false;
  @ViewChild(ThePresidentComponent, { static: false }) ThePresidentComponentVar: ThePresidentComponent;

  outstandingPresident(): void {
    this.PresidentTitle = 'THE OUTSTANDING PRESIDENT';
    this.PresidentData = new ThePresident();
    this.data.GROUP_ID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
    this.VisiablePresident = true;
    this.PresidentData.MEETING_DATE = new Date();
    this.ThePresidentComponentVar.isSpinning = true;

    this.api.getPresident(0, 0, "", "asc", " AND GROUP_ID=" + this.data.GROUP_ID, this.SelectedYear).subscribe(data => {
      if ((data['count'] > 0) && (data['code'] == 200)) {
        this.ThePresidentComponentVar.isSpinning = false;
        this.PresidentData = data['data'][0];
        this.PresidentData.MEETING_DATE = new Date();

        this.api.getPresidentDetails(0, 0, "", "asc", " AND OUTSTANDING_PRESIDENT_ID=" + this.PresidentData.ID).subscribe(data => {
          if ((data['count'] > 0) && (data['code'] == 200)) {
            this.drawerPresidentDetails = data['data'];
          }

        }, err => {
          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });

      } else {
        this.ThePresidentComponentVar.isSpinning = false;
      }

    }, err => {
      this.ThePresidentComponentVar.isSpinning = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  PresidentCloseDrawer(): void {
    this.VisiablePresident = false;
  }

  get closeCallbackPresident() {
    return this.PresidentCloseDrawer.bind(this);
  }

  directorfinancedrawerData: Awardmaster = new Awardmaster();
  directorOfFinanceDrawerTitle: string = "";
  directorOfFinanceDrawerVisible: boolean = false;
  directorOfFinanceData2: any[] = [];

  directorOfFinance(): void {
    var member = this._cookie.get('userId');
    this.directorOfFinanceDrawerTitle = 'DIRECTOR OF FINANCE';
    this.directorfinancedrawerData = new Awardmaster();
    var GroupId = Number(sessionStorage.getItem('GROUP_ids'));
    this.directorOfFinanceData2 = [];

    this.api.getFinanceDirector(0, 0, "", "asc", " AND MEMBER_ID=" + member, this.SelectedYear).subscribe(data => {
      if ((data['code'] == 200) && (data['count'] > 0)) {
        this.directorfinancedrawerData = data['data'][0];

        if (this.directorfinancedrawerData.ID != null) {
          this.api.getAllFinanceSponsorshipdetails(0, 0, "", "asc", " AND DIRECTOR_FINANCE_ID=" + this.directorfinancedrawerData.ID).subscribe(data3 => {
            if ((data3['code'] == 200) && (data3['count'] > 0)) {
              this.directorOfFinanceData2 = data3['data'];
              this.directorOfFinanceDrawerVisible = true;
              this.isRemarkVisible1 = false;

            } else {
              this.directorOfFinanceDrawerVisible = true;
              this.isRemarkVisible1 = false;
            }

          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
        }

      } else {
        this.directorOfFinanceDrawerVisible = true;
        this.isRemarkVisible1 = false;
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  directorOfFinanceDrawerClose(): void {
    this.directorOfFinanceDrawerVisible = false;
  }

  get directorOfFinanceCloseCallback() {
    return this.directorOfFinanceDrawerClose.bind(this);
  }

  drawerTitleImmediatePastPresident: string = '';
  isRemarkVisibleImmediatePastPresident: boolean;
  drawerDataImmediatePastPresident: ImmediatePastPresident = new ImmediatePastPresident();
  ImmediatedrawerDataz: any[] = [];
  drawerVisibleImmediatePastPresident!: boolean;
  drawerData: GroupProjectMaster = new GroupProjectMaster();

  proj(): void {
    this.api.getAllgroupProjectData(0, 0, "NAME", "asc", "").subscribe(data => {
      if ((data['code'] == 200) && (data['count'] > 0)) {
        this.drawerData = data['data'];

      } else {
        this.message.error("Server Not Found", "");
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  OpenDrawer(): void {
    var member = this.cookie.get('userId');
    this.drawerTitleImmediatePastPresident = 'Outstanding Immediate Past President';
    this.drawerDataImmediatePastPresident = new ImmediatePastPresident();
    this.proj();
    var GroupId = Number(sessionStorage.getItem('HOME_GROUP_ID'));
    this.ImmediatedrawerDataz = [];
    this.drawerDataImmediatePastPresident.SWITCH_IMMEDIATE = false;

    this.api.getAllPastPresident(0, 0, "", "asc", " AND MEMBER_ID=" + member + " AND AWARD_TYPE = 'I'", this.SelectedYear).subscribe(data => {
      if ((data['code'] == 200) && (data['count'] > 0)) {
        this.drawerDataImmediatePastPresident = data['data'][0];

        if (data['data'][0]['DISCHARGED_FISCAL_OBLIGATION_DETAILS'] == null ||
          data['data'][0]['DISCHARGED_FISCAL_OBLIGATION_DETAILS'] == ' ') { this.drawerDataImmediatePastPresident.SWITCH_IMMEDIATE = false; }

        else {
          this.drawerDataImmediatePastPresident.SWITCH_IMMEDIATE = true;
        }

        if (this.drawerDataImmediatePastPresident.ID != null) {
          this.api.getAllPastPresidentInitiatedProjectdetails(0, 0, "", "asc", " AND OUTSTANDING_PRESIDENT_ID=" + this.drawerDataImmediatePastPresident.ID).subscribe(data2 => {
            if ((data2['code'] == 200) && (data2['count'] > 0)) {
              this.ImmediatedrawerDataz = data2['data'];
              this.drawerVisibleImmediatePastPresident = true;
              this.isRemarkVisibleImmediatePastPresident = false;

            } else {
              this.drawerVisibleImmediatePastPresident = true;
              this.isRemarkVisibleImmediatePastPresident = false;
            }

          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
        }

      } else {
        this.drawerVisibleImmediatePastPresident = true;
        this.isRemarkVisibleImmediatePastPresident = false;
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  drawerTitlePastPresident: string = '';
  isRemarkVisiblePastPresident: boolean;
  drawerDataPastPresident: PastPrecident = new PastPrecident();
  drawerDatazPastPresident: any[] = [];
  drawerVisiblePastPresident: boolean = false;

  OpenDrawer1(): void {
    var member = this.cookie.get('userId');
    this.drawerTitlePastPresident = 'Outstanding Past President';
    this.drawerDataPastPresident = new PastPrecident();
    this.drawerVisiblePastPresident = true;
    this.proj();
    var GroupId = Number(sessionStorage.getItem('HOME_GROUP_ID'));
    this.drawerDatazPastPresident = [];
    this.drawerDataPastPresident.SWITCH = false;

    this.api.getAllPastPresident(0, 0, "", "asc", " AND MEMBER_ID=" + member + " AND AWARD_TYPE='P'", this.SelectedYear).subscribe(data => {
      if ((data['code'] == 200) && (data['count'] > 0)) {
        this.drawerDataPastPresident = data['data'][0];

        if ((data['data'][0]['DISCHARGED_FISCAL_OBLIGATION_DETAILS'] == null) || (data['data'][0]['DISCHARGED_FISCAL_OBLIGATION_DETAILS'] == ' ')) {
          this.drawerDataPastPresident.SWITCH = false;

        } else {
          this.drawerDataPastPresident.SWITCH = true;
        }

        if (this.drawerDataPastPresident.ID != null) {
          this.api.getAllPastPresidentInitiatedProjectdetails(0, 0, "", "asc", " AND OUTSTANDING_PRESIDENT_ID=" + this.drawerDataPastPresident.ID).subscribe(data2 => {
            if ((data2['code'] == 200) && (data2['count'] > 0)) {
              this.drawerDatazPastPresident = data2['data'];
              this.drawerVisiblePastPresident = true;
              this.isRemarkVisible1 = false

            } else {
              this.drawerVisiblePastPresident = true;
              this.isRemarkVisible1 = false;
            }

          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
        }

      } else {
        this.drawerVisiblePastPresident = true;
        this.isRemarkVisible1 = false;
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  closeImmediatePastPresidentDrawer(): void {
    this.drawerVisibleImmediatePastPresident = false;
  }

  get closeCallbackImmediatePastPresident() {
    return this.closeImmediatePastPresidentDrawer.bind(this);
  }

  closeclosePastPresidentDrawerDrawer(): void {
    this.drawerVisiblePastPresident = false;
  }

  get closeCallbackPastPresident() {
    return this.closeclosePastPresidentDrawerDrawer.bind(this);
  }

  outstandingGroupDrawerTitle: string;
  outstandingGroupDrawerVisible: boolean;
  outstandingGroupDrawerData: OutstandingGroupMaster = new OutstandingGroupMaster();
  outstandingGroupDrawerContiProjectData: any[] = [];
  outstandingGroupDrawerDuePaidData: any[] = [];
  outstandingGroupDrawerUndertakenProjData: any[] = [];
  outstandingGroupDrawerMediaCoverageData: any[] = [];
  outstandingGroupDrawerSponsorData: any[] = [];
  outstandingGroupDTotalRecords: number = 0;
  FormStatus: string;

  openOutstandingGroupAward(): void {
    this.FormStatus = 'G';

    this.api.getOutstandingGroup(0, 0, 'ID', 'asc', " AND AWARD_TYPE='G' AND GROUP_ID=" + this.groupID, this.SelectedYear).subscribe(data => {
      if (data['count'] == 0) {
        this.outstandingGroupDTotalRecords = 0;

      } else {
        this.outstandingGroupDTotalRecords = 1;
      }

      if (this.outstandingGroupDTotalRecords == 1) {
        this.outstandingGroupDrawerTitle = "Update Outstanding Group Details";
        this.outstandingGroupDrawerData = Object.assign({}, data['data'][0]);
        this.outstandingGroupDrawerVisible = true;

        this.api.getContinuproject(0, 0, 'ID', 'asc', ' AND OUTSTANDING_GROUP_MASTER_ID=' + this.outstandingGroupDrawerData.ID).subscribe(dataContinu => {
          if (dataContinu['count'] > 0) {
            this.outstandingGroupDrawerContiProjectData = dataContinu['data'];

          } else {
            this.outstandingGroupDrawerContiProjectData = [];
          }
        });

        this.api.getDuePaidToFundation(0, 0, 'ID', 'asc', ' AND OUTSTANDING_GROUP_MASTER_ID=' + this.outstandingGroupDrawerData.ID).subscribe(dataDuePaid => {
          if (dataDuePaid['count'] > 0) {
            this.outstandingGroupDrawerDuePaidData = dataDuePaid['data'];

          } else {
            this.outstandingGroupDrawerDuePaidData = [];
          }
        });

        this.api.getUndertakenProject(0, 0, 'ID', 'asc', ' AND OUTSTANDING_GROUP_MASTER_ID=' + this.outstandingGroupDrawerData.ID).subscribe(dataUnderProject => {
          if (dataUnderProject['count'] > 0) {
            this.outstandingGroupDrawerUndertakenProjData = dataUnderProject['data'];

          } else {
            this.outstandingGroupDrawerUndertakenProjData = [];
          }
        });

        this.api.getMediaCoverage(0, 0, 'ID', 'asc', ' AND OUTSTANDING_GROUP_MASTER_ID=' + this.outstandingGroupDrawerData.ID).subscribe(dataMediaCover => {
          if (dataMediaCover['count'] > 0) {
            this.outstandingGroupDrawerMediaCoverageData = dataMediaCover['data'];

          } else {
            this.outstandingGroupDrawerMediaCoverageData = [];
          }
        });

        this.api.getGroupSponser(0, 0, 'ID', 'asc', ' AND OUTSTANDING_GROUP_MASTER_ID=' + this.outstandingGroupDrawerData.ID).subscribe(dataSponsor => {
          if (dataSponsor['count'] > 0) {
            this.outstandingGroupDrawerSponsorData = dataSponsor['data'];

          } else {
            this.outstandingGroupDrawerSponsorData = [];
          }
        });

      } else {
        this.outstandingGroupDrawerTitle = "Add Outstanding Group Details";
        this.outstandingGroupDrawerData = new OutstandingGroupMaster();
        this.outstandingGroupDrawerVisible = true;
      }
    });
  }

  openOutstandingNewGroupAward(): void {
    this.FormStatus = 'NG';

    this.api.getOutstandingGroup(0, 0, 'ID', 'asc', " AND AWARD_TYPE='NG' AND GROUP_ID=" + this.groupID, this.SelectedYear).subscribe(data => {
      if (data['count'] == 0) {
        this.outstandingGroupDTotalRecords = 0;

      } else {
        this.outstandingGroupDTotalRecords = 1;
      }

      if (this.outstandingGroupDTotalRecords == 1) {
        this.outstandingGroupDrawerTitle = "Update Outstanding Group Details";
        this.outstandingGroupDrawerData = Object.assign({}, data['data'][0]);
        this.outstandingGroupDrawerVisible = true;

        this.api.getContinuproject(0, 0, 'ID', 'asc', ' AND OUTSTANDING_GROUP_MASTER_ID=' + this.outstandingGroupDrawerData.ID).subscribe(dataContinu => {
          if (dataContinu['count'] > 0) {
            this.outstandingGroupDrawerContiProjectData = dataContinu['data'];

          } else {
            this.outstandingGroupDrawerContiProjectData = [];
          }
        });

        this.api.getDuePaidToFundation(0, 0, 'ID', 'asc', ' AND OUTSTANDING_GROUP_MASTER_ID=' + this.outstandingGroupDrawerData.ID).subscribe(dataDuePaid => {
          if (dataDuePaid['count'] > 0) {
            this.outstandingGroupDrawerDuePaidData = dataDuePaid['data'];

          } else {
            this.outstandingGroupDrawerDuePaidData = [];
          }
        });

        this.api.getUndertakenProject(0, 0, 'ID', 'asc', ' AND OUTSTANDING_GROUP_MASTER_ID=' + this.outstandingGroupDrawerData.ID).subscribe(dataUnderProject => {
          if (dataUnderProject['count'] > 0) {
            this.outstandingGroupDrawerUndertakenProjData = dataUnderProject['data'];

          } else {
            this.outstandingGroupDrawerUndertakenProjData = [];
          }
        });

        this.api.getMediaCoverage(0, 0, 'ID', 'asc', ' AND OUTSTANDING_GROUP_MASTER_ID=' + this.outstandingGroupDrawerData.ID).subscribe(dataMediaCover => {
          if (dataMediaCover['count'] > 0) {
            this.outstandingGroupDrawerMediaCoverageData = dataMediaCover['data'];

          } else {
            this.outstandingGroupDrawerMediaCoverageData = [];
          }
        });

        this.api.getGroupSponser(0, 0, 'ID', 'asc', ' AND OUTSTANDING_GROUP_MASTER_ID=' + this.outstandingGroupDrawerData.ID).subscribe(dataSponsor => {
          if (dataSponsor['count'] > 0) {
            this.outstandingGroupDrawerSponsorData = dataSponsor['data'];

          } else {
            this.outstandingGroupDrawerSponsorData = [];
          }
        });

      } else {
        this.outstandingGroupDrawerTitle = "Add Outstanding Group Details";
        this.outstandingGroupDrawerData = new OutstandingGroupMaster();
        this.outstandingGroupDrawerVisible = true;
      }
    });
  }

  outstandingGroupAwardDrawerClose(): void {
    this.outstandingGroupDrawerVisible = false;
  }

  get outstandingGroupAwardCloseCallback() {
    return this.outstandingGroupAwardDrawerClose.bind(this);
  }

  drawerWeekCeleData: GiantWeekCelebration = new GiantWeekCelebration();
  DateAndScheduleDrawerDataArray: any[] = [];
  ProjectDuringServiceDrawerDataArray: any[] = [];
  ProjectExpensesDrawerDataArray: any[] = [];
  DescriptionOfWeekDrawerDataArray: any[] = [];
  PublicityWithPressDrawerDataArray: any[] = [];
  isRemarkWeekVisible: boolean = false;
  drawerWeekVisible!: boolean;
  giantWeekCelebrationDrawerTitle: string = "";

  outstandingGiantsWeekCelebrations(): void {
    var member = this.cookie.get('userId');
    this.giantWeekCelebrationDrawerTitle = 'Outstanding Giants Week Celebration';
    this.drawerWeekCeleData = new GiantWeekCelebration();
    this.data.GROUP_ID = Number(sessionStorage.getItem('HOME_GROUP_ID'));
    this.DateAndScheduleDrawerDataArray = [];
    this.ProjectDuringServiceDrawerDataArray = [];
    this.ProjectExpensesDrawerDataArray = [];
    this.DescriptionOfWeekDrawerDataArray = [];
    this.PublicityWithPressDrawerDataArray = [];
    this.drawerWeekCeleData.SWITCH_WEEKCELE = false;

    this.api.getAllWeekCelebration(0, 0, "", "asc", " AND MEMBER_ID=" + member, this.SelectedYear).subscribe(data => {
      if ((data['code'] == 200) && (data['count'] > 0)) {
        this.drawerWeekCeleData = data['data'][0];

        if ((data['data'][0]['IMAGE_IN_PUBLIC'] == null) || (data['data'][0]['IMAGE_IN_PUBLIC'] == ' ')) {
          this.drawerWeekCeleData.SWITCH_WEEKCELE = false;

        } else {
          this.drawerWeekCeleData.SWITCH_WEEKCELE = true;
        }

        if (this.drawerWeekCeleData.ID != null) {
          this.api.getAllDateAndScheduledetails(0, 0, "", "asc", " AND OUTSTANDING_GIANTS_WEEK_ID=" + this.drawerWeekCeleData.ID).subscribe(data2 => {
            if ((data2['code'] == 200) && (data2['count'] > 0)) {
              this.DateAndScheduleDrawerDataArray = data2['data'];
              this.drawerWeekVisible = true;
              this.isRemarkWeekVisible = false;

            } else {
              this.drawerWeekVisible = true;
              this.isRemarkWeekVisible = false;
            }

          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });

          this.api.getAllProjectDuringdetails(0, 0, "", "asc", " AND OUTSTANDING_GIANTS_WEEK_ID=" + this.drawerWeekCeleData.ID).subscribe(data2 => {
            if ((data2['code'] == 200) && (data2['count'] > 0)) {
              this.ProjectDuringServiceDrawerDataArray = data2['data'];
              this.drawerWeekVisible = true;
              this.isRemarkWeekVisible = false;

            } else {
              this.drawerWeekVisible = true;
              this.isRemarkWeekVisible = false;
            }

          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });

          this.api.getAllProjectExpensesdetails(0, 0, "", "asc", " AND OUTSTANDING_GIANTS_WEEK_ID=" + this.drawerWeekCeleData.ID).subscribe(data2 => {
            if ((data2['code'] == 200) && (data2['count'] > 0)) {
              this.ProjectExpensesDrawerDataArray = data2['data'];
              this.drawerWeekVisible = true;
              this.isRemarkWeekVisible = false;

            } else {
              this.drawerWeekVisible = true;
              this.isRemarkWeekVisible = false;
            }

          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });

          this.api.getAllDescriptiondetails(0, 0, "", "asc", " AND OUTSTANDING_GIANTS_WEEK_ID=" + this.drawerWeekCeleData.ID).subscribe(data2 => {
            if ((data2['code'] == 200) && (data2['count'] > 0)) {
              this.DescriptionOfWeekDrawerDataArray = data2['data'];
              this.drawerWeekVisible = true;
              this.isRemarkWeekVisible = false;

            } else {
              this.drawerWeekVisible = true;
              this.isRemarkWeekVisible = false;
            }

          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });

          this.api.getAllPublicitydetails(0, 0, "", "asc", " AND OUTSTANDING_GIANTS_WEEK_ID=" + this.drawerWeekCeleData.ID).subscribe(data2 => {
            if ((data2['code'] == 200) && (data2['count'] > 0)) {
              this.PublicityWithPressDrawerDataArray = data2['data'];
              this.drawerWeekVisible = true;
              this.isRemarkWeekVisible = false;

            } else {
              this.drawerWeekVisible = true;
              this.isRemarkWeekVisible = false;
            }

          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
        }

      } else {
        this.drawerWeekVisible = true;
        this.isRemarkWeekVisible = false;
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  closeGiantWeekCelebrationDrawer(): void {
    this.drawerWeekVisible = false;
  }

  get closeCallbackGiantWeekCelebration() {
    return this.closeGiantWeekCelebrationDrawer.bind(this);
  }

  ActiviticsTitle: string = '';
  VisiableActivitics: boolean = false;
  ActiviticsVisible: boolean;
  ActiviticsData: Activities = new Activities();
  drawerPastdata: ActivityProjectDetails = new ActivityProjectDetails();
  drawerActivityDetails: any[] = [];

  activityOfTheYear(): void {
    this.ActiviticsTitle = 'OUTSTANDING ACTIVITIES OF THE YEAR';
    this.ActiviticsData = new Activities();
    this.data.GROUP_ID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
    this.ActiviticsData.CREATED_DATE = new Date();
    this.ActiviticsData.IS_GROUP_AWARDED = false;

    this.api.getActivitics(0, 0, "", "asc", " AND GROUP_ID=" + this.data.GROUP_ID, this.SelectedYear).subscribe(data => {
      if ((data['count'] > 0) && (data['code'] == 200)) {
        this.ActiviticsData = data['data'][0];
        this.ActiviticsData.CREATED_DATE = new Date();
        this.VisiableActivitics = true;

        if ((data['data'][0]['AWARD_DETAILS'] == null) || (data['data'][0]['AWARD_DETAILS'] == ' ')) {
          this.ActiviticsData.IS_GROUP_AWARDED = false;

        } else {
          this.ActiviticsData.IS_GROUP_AWARDED = true;
        }

        this.api.getActiviticDetails(0, 0, "", "asc", " AND OUTSTANDING_ACTIVITY_ID=" + this.ActiviticsData.ID).subscribe(data => {
          if ((data['count'] > 0) && (data['code'] == 200)) {
            this.drawerActivityDetails = data['data'];
          }

        }, err => {

        });

      } else
        this.VisiableActivitics = true;

    }, err => {

    });
  }

  ActiviticsCloseDrawer(): void {
    this.VisiableActivitics = false;
  }

  get closeCallbackActivitics() {
    return this.ActiviticsCloseDrawer.bind(this);
  }

  administrationTitle: string = '';
  VisiableAdministration: boolean = false;
  administrationVisible: boolean = false;
  administrationData: Adminstration = new Adminstration();
  AllMembers: Membermaster = new Membermaster();

  OpenAdministration(): void {
    this.data.MEMBER_ID = parseInt(this._cookie.get('userId'));
    this.administrationTitle = 'DIRECTOR OF ADMINISTRATION';
    this.administrationData = new Adminstration();
    this.VisiableAdministration = true;
    this.administrationVisible = false;
    this.data.GROUP_ID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
    this.data.CREATED_DATE = new Date();
    this.administrationData.SWICTHING3 = false;
    this.administrationData.SWICTHING4 = false;

    this.api.getAllMembers(0, 0, "", "asc", " AND GROUP_ID=" + this.data.GROUP_ID).subscribe(data => {
      if ((data['count'] > 0) && (data['code'] == 200)) {
        this.AllMembers = data['data'];
      }
    });

    this.api.getAdministration(0, 0, "", "asc", " AND GROUP_ID=" + this.data.GROUP_ID, this.SelectedYear).subscribe(data => {
      if ((data['count'] > 0) && (data['code'] == 200)) {
        this.administrationData = data['data'][0];

        if ((data['data'][0]['CIRCULATED_TO_BOARD_MEMBERS'] == null) || (data['data'][0]['CIRCULATED_TO_BOARD_MEMBERS'] == ' ')) {
          this.administrationData.SWICTHING3 = false;

        } else {
          this.administrationData.SWICTHING3 = true;
        }

        if ((data['data'][0]['RECOMMENDATION_FOR_AWARD'] == null) || (data['data'][0]['RECOMMENDATION_FOR_AWARD'] == ' ')) {
          this.administrationData.SWICTHING4 = false;

        } else {
          this.administrationData.SWICTHING4 = true;
        }
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  administrationCloseDrawer(): void {
    this.VisiableAdministration = false;
  }

  get closeCallbackAdministration() {
    return this.administrationCloseDrawer.bind(this);
  }

  drawerTitle: string = '';
  MemberDrawerData: MemberAwardModel = new MemberAwardModel();
  LadyMemberDrawerData: LadyMemberAwardModel = new LadyMemberAwardModel();
  drawerMemberVisible: boolean = false;
  drawerLadyMemberVisible: boolean = false;
  NewMemberDrawerDataArray: any[] = [];
  LadyNewMemberDrawerDataArray: any[] = [];
  DocAndDetailDrawerDataArray: any[] = [];
  LadyDocAndDetailDrawerDataArray: any[] = [];
  isRemarkMemberVisible: boolean = false;
  isRemarkLadyMemberVisible: boolean = false;

  theOutstandingMember(): void {
    this.drawerTitle = 'OUTSTANDING MEMBER AWARD';
    this.MemberDrawerData = new MemberAwardModel();
    this.MemberDrawerData.CREATED_DATE = new Date();
    this.data.MEMBER_ID = parseInt(this._cookie.get('userId'));
    this.data.GROUP_ID = Number(sessionStorage.getItem("HOME_GROUP_ID"))
    this.drawerMemberVisible = true;
    var member = this.cookie.get('userId');
    var GroupId = Number(sessionStorage.getItem('HOME_GROUP_ID'));
    this.NewMemberDrawerDataArray = [];
    this.DocAndDetailDrawerDataArray = [];

    this.api.getMemberAwardDetails(0, 0, "", "asc", " AND MEMBER_ID=" + member + " AND AWARD_TYPE='M'", this.SelectedYear).subscribe(data => {
      if ((data['code'] == 200) && (data['count'] > 0)) {
        this.MemberDrawerData = data['data'][0];

        if (this.MemberDrawerData.ID != null) {
          this.api.getNewMemberDrawer(0, 0, "", "asc", " AND OUTSTANDING_MEMBER_ID=" + this.MemberDrawerData.ID).subscribe(data2 => {
            if ((data2['code'] == 200) && (data2['count'] > 0)) {
              this.NewMemberDrawerDataArray = data2['data'];
              this.drawerMemberVisible = true;
              this.isRemarkMemberVisible = false;

            } else {
              this.drawerMemberVisible = true;
              this.isRemarkMemberVisible = false;
            }

          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });

          this.api.getDocAndDetailDrawer(0, 0, "", "asc", " AND OUTSTANDING_MEMBER_ID=" + this.MemberDrawerData.ID).subscribe(data2 => {
            if ((data2['code'] == 200) && (data2['count'] > 0)) {
              this.DocAndDetailDrawerDataArray = data2['data'];
              this.drawerMemberVisible = true;
              this.isRemarkMemberVisible = false;

            } else {
              this.drawerMemberVisible = true;
              this.isRemarkMemberVisible = false;
            }

          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
        }

      } else {
        this.drawerMemberVisible = true;
        this.isRemarkMemberVisible = false;
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  theOutstandingLadyMember(): void {
    this.drawerTitle = 'OUTSTANDING LADY MEMBER AWARD';
    this.LadyMemberDrawerData = new LadyMemberAwardModel();
    this.LadyMemberDrawerData.CREATED_DATE = new Date();
    this.data.MEMBER_ID = parseInt(this._cookie.get('userId'));
    this.data.GROUP_ID = Number(sessionStorage.getItem("HOME_GROUP_ID"))
    this.drawerLadyMemberVisible = true;
    var member = this.cookie.get('userId');
    var GroupId = Number(sessionStorage.getItem('HOME_GROUP_ID'));
    this.LadyNewMemberDrawerDataArray = [];
    this.LadyDocAndDetailDrawerDataArray = [];

    this.api.getMemberAwardDetails(0, 0, "", "asc", " AND MEMBER_ID=" + member + " AND AWARD_TYPE='L'", this.SelectedYear).subscribe(data => {
      if ((data['code'] == 200) && (data['count'] > 0)) {
        this.LadyMemberDrawerData = data['data'][0];

        if (this.LadyMemberDrawerData.ID != null) {
          this.api.getNewMemberDrawer(0, 0, "", "asc", " AND OUTSTANDING_MEMBER_ID=" + this.LadyMemberDrawerData.ID).subscribe(data2 => {
            if ((data2['code'] == 200) && (data2['count'] > 0)) {
              this.LadyNewMemberDrawerDataArray = data2['data'];
              this.drawerLadyMemberVisible = true;
              this.isRemarkLadyMemberVisible = false;

            } else {
              this.drawerLadyMemberVisible = true;
              this.isRemarkLadyMemberVisible = false;
            }

          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });

          this.api.getDocAndDetailDrawer(0, 0, "", "asc", " AND OUTSTANDING_MEMBER_ID=" + this.LadyMemberDrawerData.ID).subscribe(data2 => {
            if ((data2['code'] == 200) && (data2['count'] > 0)) {
              this.LadyDocAndDetailDrawerDataArray = data2['data'];
              this.drawerLadyMemberVisible = true;
              this.isRemarkLadyMemberVisible = false;

            } else {
              this.drawerLadyMemberVisible = true;
              this.isRemarkLadyMemberVisible = false;
            }

          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
        }

      } else {
        this.drawerLadyMemberVisible = true;
        this.isRemarkLadyMemberVisible = false;
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  closeMemberDrawer(): void {
    this.drawerMemberVisible = false;
  }

  get closeCallbackMember() {
    return this.closeMemberDrawer.bind(this);
  }

  closeLadyMemberDrawer(): void {
    this.drawerLadyMemberVisible = false;
  }

  get closeCallbackLadyMember() {
    return this.closeLadyMemberDrawer.bind(this)
  }

  bestServiceProjectDrawerTitle: string;
  bestServiceProjectDrawerVisible: boolean;
  bestServiceProjectDrawerData: BestServiceProjectMaster = new BestServiceProjectMaster();
  bestServiceProjectSponsorDrawerData: any[] = [];
  unitConferenceAwardDrawerData: any[] = [];
  bestServiceProjectTotalRecords: number = 0;

  bestServiceProjectOfTheYear(): void {
    this.api.getBestServiceProject(0, 0, 'ID', 'asc', ' AND GROUP_ID=' + this.groupID, this.SelectedYear).subscribe(data => {
      if (data['count'] == 0) {
        this.bestServiceProjectTotalRecords = 0;

      } else {
        this.bestServiceProjectTotalRecords = 1;
      }

      if (this.bestServiceProjectTotalRecords == 1) {
        this.bestServiceProjectDrawerTitle = "Update Best Service Details";
        this.bestServiceProjectDrawerData = Object.assign({}, data['data'][0]);
        this.bestServiceProjectDrawerVisible = true;

        this.api.getServiceProjectSponser(0, 0, 'ID', 'asc', ' AND BEST_SERVICE_PROJECT_ID=' + this.bestServiceProjectDrawerData.ID).subscribe(projectSpons => {
          if (projectSpons['count'] > 0) {
            this.bestServiceProjectSponsorDrawerData = projectSpons['data'];

          } else {
            this.bestServiceProjectSponsorDrawerData = [];
          }
        });

        this.api.getUnitConfernceAward(0, 0, 'ID', 'asc', ' AND BEST_SERVICE_PROJECT_ID=' + this.bestServiceProjectDrawerData.ID).subscribe(unitConfernce => {
          if (unitConfernce['count'] > 0) {
            this.unitConferenceAwardDrawerData = unitConfernce['data'];

          } else {
            this.unitConferenceAwardDrawerData = [];
          }
        });

      } else {
        this.bestServiceProjectDrawerTitle = "Add Best Service Details";
        this.bestServiceProjectDrawerData = new BestServiceProjectMaster();
        this.bestServiceProjectDrawerVisible = true;
      }
    });
  }

  bestServiceProjectAwardDrawerClose(): void {
    this.bestServiceProjectDrawerVisible = false;
  }

  get bestServiceProjectAwardCloseCallback() {
    return this.bestServiceProjectAwardDrawerClose.bind(this);
  }

  outstandingMonumentalProjectDrawerTitle: string;
  outstandingMonumentalProjectDrawerVisible: boolean;
  outstandingMonumentalProjectDrawerData: OutstandingMonumental = new OutstandingMonumental();
  monumnentalSponsorDrawerData: any[] = [];
  bannerDrawerData: any[] = [];
  mediaClippingDrawerData: any[] = [];
  monumentalProjectTotalRecords: number = 0;

  outstandingMonumentalProject(): void {
    this.api.getOutstandingMonumental(0, 0, 'ID', 'asc', ' AND GROUP_ID=' + this.groupID, this.SelectedYear).subscribe(data => {
      if (data['count'] == 0) {
        this.monumentalProjectTotalRecords = 0;

      } else {
        this.monumentalProjectTotalRecords = 1;
      }

      if (this.monumentalProjectTotalRecords == 1) {
        this.outstandingMonumentalProjectDrawerTitle = "Outstanding Monumental Project Details";
        this.outstandingMonumentalProjectDrawerData = Object.assign({}, data['data'][0]);
        this.outstandingMonumentalProjectDrawerVisible = true;

        this.api.getOutstandingMonumentalSpons(0, 0, 'ID', 'asc', ' AND MONUMENTAL_MASTER_ID=' + this.outstandingMonumentalProjectDrawerData.ID).subscribe(dataSpons => {
          if (dataSpons['count'] > 0) {
            this.monumnentalSponsorDrawerData = dataSpons['data'];

          } else {
            this.monumnentalSponsorDrawerData = [];
          }
        });

        this.api.getOutstandingMonumentalBanner(0, 0, 'ID', 'asc', ' AND MONUMENTAL_MASTER_ID=' + this.outstandingMonumentalProjectDrawerData.ID).subscribe(dataBanner => {
          if (dataBanner['count'] > 0) {
            this.bannerDrawerData = dataBanner['data'];

          } else {
            this.bannerDrawerData = [];
          }
        });

        this.api.getOutstandingMonumentalMediaClip(0, 0, 'ID', 'asc', ' AND MONUMENTAL_MASTER_ID=' + this.outstandingMonumentalProjectDrawerData.ID).subscribe(dataMediaClip => {
          if (dataMediaClip['count'] > 0) {
            this.mediaClippingDrawerData = dataMediaClip['data'];

          } else {
            this.mediaClippingDrawerData = [];
          }
        });

      } else {
        this.outstandingMonumentalProjectDrawerTitle = "Outstanding Monumental Project Details";
        this.outstandingMonumentalProjectDrawerData = new OutstandingMonumental();
        this.outstandingMonumentalProjectDrawerVisible = true;
      }
    });
  }

  outstandingMonumentalProjectAwardDrawerClose(): void {
    this.outstandingMonumentalProjectDrawerVisible = false;
  }

  get outstandingMonumentalProjectAwardCloseCallback() {
    return this.outstandingMonumentalProjectAwardDrawerClose.bind(this);
  }

  outstandingYoungGiantsDrawerVisible: boolean;
  outstandingYoungGiantsDrawerTitle: string;
  OutstandingYoungGiantsDivisionProjectTotalRecords: number = 0;
  outstandingYoungGiantsData: OustandingYoungGiantsDivisionMaster = new OustandingYoungGiantsDivisionMaster();

  outstandingYoungGiantsDivision(): void {
    this.api.getOutstandingYoungGiantsDivision(0, 0, "ID", "asc", " AND GROUP_ID=" + this.groupID, this.SelectedYear).subscribe((data) => {
      if (data["count"] == 0) {
        this.OutstandingYoungGiantsDivisionProjectTotalRecords = 0;

      } else {
        this.OutstandingYoungGiantsDivisionProjectTotalRecords = 1;
      }

      if (this.OutstandingYoungGiantsDivisionProjectTotalRecords == 1) {
        this.outstandingYoungGiantsDrawerTitle = "Outstanding Group Details";
        this.outstandingYoungGiantsData = Object.assign({}, data["data"][0]);
        this.outstandingYoungGiantsDrawerVisible = true;

      } else {
        this.outstandingYoungGiantsDrawerTitle = "Outstanding Group Details";
        this.outstandingYoungGiantsData = new OustandingYoungGiantsDivisionMaster();
        this.outstandingYoungGiantsDrawerVisible = true;
      }
    });
  }

  outstandingYoungGiantsDrawerClose(): void {
    this.outstandingYoungGiantsDrawerVisible = false;
  }

  get outstandingYoungGiantsAwardsCloseCallBack() {
    return this.outstandingYoungGiantsDrawerClose.bind(this);
  }

  year: number = new Date().getFullYear();
  baseYear: number = 2020;
  SelectedYear: any = this.year
  currentYear: any = this.SelectedYear;

  // LoadYear(): void {
  //   if (this.businessYearStartDate > this.currentDate) {
  //     this.SelectedYear = this.year - 1 + "-" + this.year;

  //   } else {
  //     this.SelectedYear = this.year + "-" + this.next_year;
  //   }
  // }
}
