import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { DateAndScheduleModel, DescriptionOfWeekModel, GiantWeekCelebration, ProjectDuringServiceModel, ProjectExpensesModel, PublicityWithPressModel } from 'src/app/Models/GiantWeekCelebration';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-giant-week-celebration-award',
  templateUrl: './giant-week-celebration-award.component.html',
  styleUrls: ['./giant-week-celebration-award.component.css']
})

export class GiantWeekCelebrationAwardComponent implements OnInit {
  isSpinning: boolean = false
  @Input() drawerClose!: Function;
  @Input() drawerVisible: boolean = false;
  @Input() data: GiantWeekCelebration = new GiantWeekCelebration();
  @Input() drawerWeekdataArray: any[];
  @Input() isRemarkVisible: boolean;
  @Input() ArrayProjectDuringServiceDrawerDataSaveInTable: any[] = [];
  @Input() ArrayDateAndScheduleSaveInTable: any[] = [];
  @Input() ArrayProjectExpensesDrawerDataSaveInTable: any[] = [];
  @Input() ArrayDescriptionOfWeekSaveInTable: any[] = [];
  @Input() ArrayPublicitySaveInTable: any[] = [];
  validation = true;
  DateAndScheduleDrawerData: DateAndScheduleModel = new DateAndScheduleModel();
  ProjectDuringServiceDrawerData: ProjectDuringServiceModel = new ProjectDuringServiceModel();
  ProjectExpensesDrawerData: ProjectExpensesModel = new ProjectExpensesModel();
  DescriptionOfWeekDrawerData: DescriptionOfWeekModel = new DescriptionOfWeekModel();
  PublicityWithPressDrawerData: PublicityWithPressModel = new PublicityWithPressModel();

  DateAndScheduleDrawerVisible: boolean = false;
  ProjectDuringServiceDrawerVisible: boolean = false;
  ProjectExpensesDrawerVisible: boolean = false;
  DescriptionOfWeekDrawerVisible: boolean = false;
  PublicityWithPressDrawerVisible: boolean = false;

  isRemarkDateAndScheduleDrawerVisible: boolean = false;
  isRemarkProjectDuringServiceDrawerVisible: boolean = false;
  isRemarkProjectExpensesDrawerVisible: boolean = false;
  isRemarkDescriptionOfWeekDrawerVisible: boolean = false;
  isRemarkPublicityWithPressDrawerVisible: boolean = false;

  DateAndScheduleDrawerDataArray: any[] = [];
  ProjectDuringServiceDrawerDataArray: any[] = [];
  ProjectExpensesDrawerDataArray: any[] = [];
  DescriptionOfWeekDrawerDataArray: any[] = [];
  PublicityWithPressDrawerDataArray: any[] = [];
  SWITCH_WEEKCELE: boolean = true;

  getwidth() {
    if (window.innerWidth < 500) {
      return 380;

    } else {
      return 800;
    }
  }

  constructor(public api: ApiService, private message: NzNotificationService, private cookie: CookieService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.data.SWITCH_WEEKCELE = true;
    this.Fordate();
    this.LoadYears();
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

  isOk: boolean;
  save(myForm: NgForm) {
    this.validation = false;
    this.isOk = true;    

    var memberId = Number(this.cookie.get('userId'));
    this.data.GROUP_ID = Number(sessionStorage.getItem('HOME_GROUP_ID'));
    this.data.MEMBER_ID = Number(this.cookie.get('userId'));
    this.data.SCHEDULE_OF_WORK = this.ArrayDateAndScheduleSaveInTable;
    this.data.PROJECT_DURING_SERVICE_WEEK = this.ArrayProjectDuringServiceDrawerDataSaveInTable;
    this.data.PROJECT_EXPENSES_DETAILS_SPONSORSHIP = this.ArrayProjectExpensesDrawerDataSaveInTable;
    this.data.DESCRIPTION_OF_WEEK = this.ArrayDescriptionOfWeekSaveInTable;
    this.data.PUBLICITY_WITH_PRESS = this.ArrayPublicitySaveInTable;
    // this.data.CREATED_DATETIME=this.datePipe.transform(this.data.CREATED_DATETIME, "yyyy-MM-dd")
    var GroupId = Number(sessionStorage.getItem('HOME_GROUP_ID'));
    // if (
    //   this.data.PUBLIC_IMPACT.trim() == "" && this.data.MOTIVATED_MEMBERS.trim() == ""
    //   && this.data.IMAGE_IN_PUBLIC.trim() == "") {
    //   this.isOk = false
    //   this.message.error("All Feild Required", "");
    // } else

    if ((this.data.PUBLIC_IMPACT == null || this.data.PUBLIC_IMPACT.trim() == '')
      && (this.data.MOTIVATED_MEMBERS == null || this.data.MOTIVATED_MEMBERS.trim() == '')
     ) 
      {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please enter all the mandatory fields', '')
    }
    else {
      if (this.data.PUBLIC_IMPACT == null || this.data.PUBLIC_IMPACT.trim() == '') {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter Public Impact', '')

      } else
        if (this.data.MOTIVATED_MEMBERS == null || this.data.MOTIVATED_MEMBERS.trim() == '') {
          this.isOk = false;
          this.data.IS_SUBMITED = 'D';
          this.message.error('Please Enter Motivated Member', '')

        } else
          if (this.data.SWITCH_WEEKCELE == true && (this.data.IMAGE_IN_PUBLIC.trim() == "" || this.data.IMAGE_IN_PUBLIC == undefined)) {
            this.isOk = false;
            this.data.IS_SUBMITED = 'D';

            this.message.error('Please Enter Image In Public', '')
          } else {
            if (this.data.SWITCH_WEEKCELE != true) { this.data.IMAGE_IN_PUBLIC = ' ' }
          }
    }

    if (this.isOk) {
      this.isSpinning = true;
      if (this.data.ID) {
        this.api.UpdateWeekCelebration(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Giants Week Celebration Details Updated Successfully", "");
            this.isSpinning = false;
            this.validation = true;
            this.drawerClose();
          } else {
            this.message.error("Giants Week Celebration Details Updation Failed", "");
            this.isSpinning = false;
          }
        });
      }
      else {
        this.api.createWeekCelebration(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Giants Week Celebration Created Successfully", "");
            this.isSpinning = false;
            this.validation = true;
            this.drawerClose();
          } else {
            this.message.error("Giants Week Celebration Creation Failed", "");
            this.isSpinning = false;
          }
        });
      }
    }


  }

  ApplyForAward(myForm: any) {
    this.data.IS_SUBMITED = 'S';
    this.save(myForm);
  }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  drawerTitle: string = '';

  DateAndScheduleDrawer(): void {
    this.drawerTitle = "Add Date And Schedule Details";
    this.DateAndScheduleDrawerData = new DateAndScheduleModel();
    this.DateAndScheduleDrawerVisible = true;
    this.currentIndex = -1
  }

  fileURL1: string;
  fileURL2: string;
  fileURL3: string;

  ProjectDuringServiceDrawer(): void {
    // this.ProjectDuringServiceDrawerData.PHOTO_URL_1 = '';
    // this.ProjectDuringServiceDrawerData.PHOTO_URL_2 = null;
    // this.ProjectDuringServiceDrawerData.PHOTO_URL_3 = null;
    this.fileURL1 = null;
    this.fileURL2 = "";
    this.fileURL3 = "";
    this.drawerTitle = "Add Project During Service Details";
    this.ProjectDuringServiceDrawerData = new ProjectDuringServiceModel();
    this.ProjectDuringServiceDrawerVisible = true;
  }

  ProjectExpensesDrawer(): void {
    this.drawerTitle = "Add Project Expenses Details";
    this.ProjectExpensesDrawerData = new ProjectExpensesModel();
    this.ProjectExpensesDrawerVisible = true;
    this.currentIndex = -1;
  }

  DescriptionOfWeekDrawer(): void {
    this.drawerTitle = "Add Description Of Week Details";
    this.DescriptionOfWeekDrawerData = new DescriptionOfWeekModel();
    this.DescriptionOfWeekDrawerVisible = true;
    this.currentIndex = -1;
  }

  PublicityWithPressDrawer(): void {
    this.drawerTitle = "Add Publicity Details";
    this.PublicityWithPressDrawerData = new PublicityWithPressModel();
    this.PublicityWithPressDrawerVisible = true;
    this.currentIndex = -1;
  }

  closeDateAndScheduleDrawer() {
    this.DateAndScheduleDrawerVisible = false;
  }

  closeDateAndSchedule() {
    this.DateAndScheduleDrawerVisible = false;
  }

  get getcloseDateAndSchedule() {
    return this.closeDateAndSchedule.bind(this);
  }

  get closeCallbackcloseDateAndSchedule() {
    return this.DateAndScheduleSaveInTable.bind(this);
  }

  closeProjectDuringServiceDrawer() {
    this.ProjectDuringServiceDrawerVisible = false;
  }

  closeProjectDuring() {
    this.ProjectDuringServiceDrawerVisible = false;
  }

  get CloseCallProjectDuring() {
    return this.closeProjectDuring.bind(this);
  }

  get closeCallbackcloseProjectDuringService() {
    return this.ProjectDuringServiceDrawerDataSaveInTable.bind(this);
  }

  closeProjectExpensesDrawer() {
    this.ProjectExpensesDrawerVisible = false;
  }

  closeProjectExpen() {
    this.ProjectExpensesDrawerVisible = false;
  }

  get closeCallProjectExpens() {
    return this.closeProjectExpen.bind(this);
  }

  get closeCallbackcloseProjectExpenses() {
    return this.ProjectExpensesSaveInTable.bind(this);
  }

  closeDescriptionOfWeekDrawer() {
    this.DescriptionOfWeekDrawerVisible = false;
  }

  closeDescription() {
    this.DescriptionOfWeekDrawerVisible = false;
  }

  get CloseCallcloseDescription() {
    return this.closeDescription.bind(this);
  }

  get closeCallbackcloseDescriptionOfWeek() {
    return this.DescriptionWeekSaveInTable.bind(this);
  }

  closePublicityWithPressDrawer() {
    this.PublicityWithPressDrawerVisible = false;
  }

  closePublicity() {
    this.PublicityWithPressDrawerVisible = false;
  }

  get closeCallPublicity() {
    return this.closePublicity.bind(this);
  }

  get closeCallbackclosePublicityWithPress() {
    return this.PublicitySaveInTable.bind(this);
  }

  currentIndex: number;

  ProjectDuringServiceDrawerDataSaveInTable() {
    if (this.currentIndex > -1) {
      this.ArrayProjectDuringServiceDrawerDataSaveInTable[this.currentIndex] = this.ProjectDuringServiceDrawerData;
      this.ArrayProjectDuringServiceDrawerDataSaveInTable = [...[], ...this.ArrayProjectDuringServiceDrawerDataSaveInTable];

    } else {
      this.ArrayProjectDuringServiceDrawerDataSaveInTable = [...this.ArrayProjectDuringServiceDrawerDataSaveInTable, ...[this.ProjectDuringServiceDrawerData]];
    }

    this.currentIndex = -1;
    this.ProjectDuringServiceDrawerVisible = false;
    this.drawerVisible = false;
  }

  url1: any;
  url2: any;
  url3: any;

  // SentUrl1(event: any) {
  //   if(this.fileURL1!=null){
  //   this.url1 = (event)
  //   this.ProjectDuringServiceDrawerData.PHOTO_URL_1 = this.url1;
  //   console.log("this.drawerMediaCoverData.PHOTO_URL1" + this.ProjectDuringServiceDrawerData.PHOTO_URL_1);
  //   }
  //   else{
  //   this.url1 = null;
  //   this.ProjectDuringServiceDrawerData.PHOTO_URL_1 = this.url1;
  //   }
  // }

  // SentUrl2(event: any) {
  //   if(this.fileURL2!=null){
  //   this.url2 = (event)
  //   this.ProjectDuringServiceDrawerData.PHOTO_URL_2 = this.url2;
  //   console.log("this.drawerMediaCoverData.PHOTO_URL2" + this.ProjectDuringServiceDrawerData.PHOTO_URL_2);
  //   }
  //   else{
  //     this.url2 = null
  //   this.ProjectDuringServiceDrawerData.PHOTO_URL_2 = this.url2;
  //   }
  // }

  // SentUrl3(event: any) {
  //   if(this.fileURL3!=null){
  //   this.url3 = (event)
  //   this.ProjectDuringServiceDrawerData.PHOTO_URL_3 = this.url3;
  //   console.log("this.drawerMediaCoverData.PHOTO_URL3" + this.ProjectDuringServiceDrawerData.PHOTO_URL_3);
  //   }
  //   else{
  //     this.url3 = null;
  //     this.ProjectDuringServiceDrawerData.PHOTO_URL_3 = this.url3;
  //   }
  // }

  BannerSentUrl1(event: any) {
    this.url1 = (event);

    console.log("This URL1 " + this.url1);
    if (this.url1 == null || this.url1 == undefined || this.url1 == "") {
      var BannerURL = "";
    }

    else {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.url1.name.split('.').pop();
      var BannerURL = "GM" + number + "." + fileExt;
    }

    this.ProjectDuringServiceDrawerData.PHOTO_URL_1 = BannerURL;
    console.log("photo url 1" + this.ProjectDuringServiceDrawerData.PHOTO_URL_1);
  }

  BannerSentUrl2(event: any) {
    this.url2 = (event)
    console.log("This URL2 " + this.url2);
    if (this.url2 == null || this.url2 == undefined || this.url2 == "") {
      var BannerURL = "";

    } else {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.url2.name.split('.').pop();
      var BannerURL = "GM" + number + "." + fileExt;
    }

    this.ProjectDuringServiceDrawerData.PHOTO_URL_2 = BannerURL;
    console.log("PHOTO_URL2" + this.ProjectDuringServiceDrawerData.PHOTO_URL_2);
  }

  BannerSentUrl3(event: any) {
    this.url3 = (event)
    console.log("This URL3 " + this.url3);
    if (this.url3 == null || this.url3 == undefined || this.url3 == "") {
      var BannerURL = "";
    }
    else {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.url3.name.split('.').pop();
      var BannerURL = "GM" + number + "." + fileExt;
    }

    this.ProjectDuringServiceDrawerData.PHOTO_URL_3 = BannerURL;
    console.log("PHOTO_URL3" + this.ProjectDuringServiceDrawerData.PHOTO_URL_3);
  }

  editdata2(data1: ProjectDuringServiceModel, index: number): void {
    this.currentIndex = index
    this.drawerTitle = "Update Title Details";
    this.ProjectDuringServiceDrawerData = Object.assign({}, data1);
    this.ProjectDuringServiceDrawerData.OUTSTANDING_GIANTS_WEEK_ID = this.data.ID;
    this.ProjectDuringServiceDrawerVisible = true;
  }

  DateAndScheduleSaveInTable() {
    if (this.currentIndex > -1) {
      this.ArrayDateAndScheduleSaveInTable[this.currentIndex] = this.DateAndScheduleDrawerData;
      this.ArrayDateAndScheduleSaveInTable = [...[], ...this.ArrayDateAndScheduleSaveInTable];

    } else {
      this.ArrayDateAndScheduleSaveInTable = [...this.ArrayDateAndScheduleSaveInTable, ...[this.DateAndScheduleDrawerData]];
    }

    this.currentIndex = -1;
    this.DateAndScheduleDrawerVisible = false;
    this.drawerVisible = false;
  }

  editdata1(data1: DateAndScheduleModel, index: number): void {
    this.currentIndex = index
    this.drawerTitle = "Update Title Details";
    this.DateAndScheduleDrawerData = Object.assign({}, data1);
    this.DateAndScheduleDrawerData.OUTSTANDING_GIANTS_WEEK_ID = this.data.ID;
    this.DateAndScheduleDrawerVisible = true;
  }

  ProjectExpensesSaveInTable() {
    if (this.currentIndex > -1) {
      this.ArrayProjectExpensesDrawerDataSaveInTable[this.currentIndex] = this.ProjectExpensesDrawerData;
      this.ArrayProjectExpensesDrawerDataSaveInTable = [...[], ...this.ArrayProjectExpensesDrawerDataSaveInTable];

    } else {
      this.ArrayProjectExpensesDrawerDataSaveInTable = [...this.ArrayProjectExpensesDrawerDataSaveInTable, ...[this.ProjectExpensesDrawerData]];
    }

    this.currentIndex = -1;
    this.ProjectExpensesDrawerVisible = false;
    this.drawerVisible = false;
  }

  editdata3(data1: ProjectExpensesModel, index: number): void {
    this.currentIndex = index
    this.drawerTitle = "Update Title Details";
    this.ProjectExpensesDrawerData = Object.assign({}, data1);
    this.ProjectExpensesDrawerData.OUTSTANDING_GIANTS_WEEK_ID = this.data.ID;
    this.ProjectExpensesDrawerVisible = true;
  }

  DescriptionWeekSaveInTable() {
    if (this.currentIndex > -1) {
      this.ArrayDescriptionOfWeekSaveInTable[this.currentIndex] = this.DescriptionOfWeekDrawerData;
      this.ArrayDescriptionOfWeekSaveInTable = [...[], ...this.ArrayDescriptionOfWeekSaveInTable];

    } else {
      this.ArrayDescriptionOfWeekSaveInTable = [...this.ArrayDescriptionOfWeekSaveInTable, ...[this.DescriptionOfWeekDrawerData]];
    }

    this.currentIndex = -1;
    this.DescriptionOfWeekDrawerVisible = false;
    this.drawerVisible = false;
  }

  editdata4(data1: DescriptionOfWeekModel, index: number): void {
    this.currentIndex = index
    this.drawerTitle = "Update Title Details";
    this.DescriptionOfWeekDrawerData = Object.assign({}, data1);
    this.DescriptionOfWeekDrawerData.OUTSTANDING_GIANTS_WEEK_ID = this.data.ID;
    this.DescriptionOfWeekDrawerVisible = true;
  }

  PublicitySaveInTable() {
    if (this.currentIndex > -1) {
      this.ArrayPublicitySaveInTable[this.currentIndex] = this.PublicityWithPressDrawerData;
      this.ArrayPublicitySaveInTable = [...[], ...this.ArrayPublicitySaveInTable];

    } else {
      this.ArrayPublicitySaveInTable = [...this.ArrayPublicitySaveInTable, ...[this.PublicityWithPressDrawerData]];
    }

    this.currentIndex = -1;
    this.PublicityWithPressDrawerVisible = false;
    this.drawerVisible = false;
  }

  urlpb: any;
  BannerSentUrlPressPublicity(event: any) {
    this.urlpb = (event)
    console.log("This URL1 " + this.urlpb);

    if (this.urlpb == null || this.urlpb == undefined || this.urlpb == "") {
      var BannerURL = "";
    }

    else {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.urlpb.name.split('.').pop();
      var BannerURL = "GM" + number + "." + fileExt;
    }

    this.PublicityWithPressDrawerData.PHOTO_URL = BannerURL;
    console.log("photo url 1" + this.PublicityWithPressDrawerData.PHOTO_URL);
  }

  editdata5(data1: PublicityWithPressModel, index: number): void {
    this.currentIndex = index
    this.drawerTitle = "Update Title Details";
    this.PublicityWithPressDrawerData = Object.assign({}, data1);
    this.PublicityWithPressDrawerData.OUTSTANDING_GIANTS_WEEK_ID = this.data.ID;
    this.PublicityWithPressDrawerVisible = true;
  }

  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  PhotoUrl = this.api.retriveimgUrl + "projectDuringServiceWeekPhotos";
  PhotoUrl2 = this.api.retriveimgUrl + "publicityPressImages";
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
    this.data = new GiantWeekCelebration();
    this.ArrayProjectDuringServiceDrawerDataSaveInTable = [];
    this.ArrayDateAndScheduleSaveInTable = [];
    this.ArrayProjectExpensesDrawerDataSaveInTable = [];
    this.ArrayDescriptionOfWeekSaveInTable = [];
    this.ArrayPublicitySaveInTable = [];
    this.SelectedYear = itsYear;
    var member = this.cookie.get('userId');

    this.api.getAllWeekCelebration(0, 0, "", "asc", " AND MEMBER_ID=" + member, this.SelectedYear).subscribe(data => {
      if (data['count'] > 0) {
        this.data = Object.assign({}, data['data'][0]);
        this.api.getAllDateAndScheduledetails(0, 0, "", "asc", " AND OUTSTANDING_GIANTS_WEEK_ID=" + this.data.ID).subscribe(dataSpons => {
          if (dataSpons['count'] > 0) {
            this.ArrayDateAndScheduleSaveInTable = dataSpons['data'];

          } else {
            this.ArrayDateAndScheduleSaveInTable = [];
          }
        });

        this.api.getAllProjectDuringdetails(0, 0, "", "asc", " AND OUTSTANDING_GIANTS_WEEK_ID=" + this.data.ID).subscribe(dataSpons => {
          if (dataSpons['count'] > 0) {
            this.ArrayProjectDuringServiceDrawerDataSaveInTable = dataSpons['data'];

          } else {
            this.ArrayProjectDuringServiceDrawerDataSaveInTable = [];
          }
        });

        this.api.getAllProjectExpensesdetails(0, 0, "", "asc", " AND OUTSTANDING_GIANTS_WEEK_ID=" + this.data.ID).subscribe(dataSpons => {
          if (dataSpons['count'] > 0) {
            this.ArrayProjectExpensesDrawerDataSaveInTable = dataSpons['data'];

          } else {
            this.ArrayProjectExpensesDrawerDataSaveInTable = [];
          }
        });

        this.api.getAllDescriptiondetails(0, 0, "", "asc", " AND OUTSTANDING_GIANTS_WEEK_ID=" + this.data.ID).subscribe(dataSpons => {
          if (dataSpons['count'] > 0) {
            this.ArrayDescriptionOfWeekSaveInTable = dataSpons['data'];

          } else {
            this.ArrayDescriptionOfWeekSaveInTable = [];
          }
        });

        this.api.getAllPublicitydetails(0, 0, "", "asc", " AND OUTSTANDING_GIANTS_WEEK_ID=" + this.data.ID).subscribe(dataSpons => {
          if (dataSpons['count'] > 0) {
            this.ArrayPublicitySaveInTable = dataSpons['data'];

          } else {
            this.ArrayPublicitySaveInTable = [];
          }
        });
      }
    });
  }
}
