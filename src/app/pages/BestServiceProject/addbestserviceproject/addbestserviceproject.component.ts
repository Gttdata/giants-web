import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { BestServiceProjectMaster } from 'src/app/Models/BestServiceProjectMaster';
import { ApiService } from 'src/app/Service/api.service';
import { ServiceProjectSponsered } from 'src/app/Models/ServiceProjectSponsered';
import { UnitConferenceAward } from "src/app/Models/UnitConferenceAward";
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

@Component({
  selector: 'app-addbestserviceproject',
  templateUrl: './addbestserviceproject.component.html',
  styleUrls: ['./addbestserviceproject.component.css']
})

export class AddbestserviceprojectComponent implements OnInit {
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  federationID = this._cookie.get("FEDERATION_ID");
  unitID = this._cookie.get("UNIT_ID");
  groupID = this._cookie.get("GROUP_ID");
  roleID: number = this.api.roleId;
  @Input() drawerClose: Function;
  @Input() data: BestServiceProjectMaster;
  @Input() drawerVisible: boolean;
  formTitle = "Add Best Service Project Details";
  numberpattern = /^[6-9]\d{9}$/;
  isSpinning = false;
  isOk = true;
  switchValue = false;
  isVisible = false;
  currentIndex: number = -1;
  url1: any;
  url2: any;
  drawerProjectSponsTitle: string;
  drawerProjectSponsVisible: boolean;
  drawerProjectSponsData: ServiceProjectSponsered = new ServiceProjectSponsered();
  @Input() ProjectSponsArray: ServiceProjectSponsered[] = [];
  drawerUnitAwardTitle: string;
  drawerUnitAwardVisible: boolean;
  drawerUnitAwardData: UnitConferenceAward = new UnitConferenceAward();
  @Input() UnitAwardArray: UnitConferenceAward[] = [];

  constructor(public api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() {
    this.year = new Date().getFullYear();
    this.SelectedYear = this.year
    this.currentYear = this.SelectedYear;

    this.LoadYears();
    this.Fordate();
  }

  alphaOnly(event: any) {
    event = (event) ? event : window.event;
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }
  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }
  numbers = new RegExp(/^[0-9]+$/);

  ApplySubmit(myForm: NgForm) {
    this.data.IS_SUBMITED = 'S';
    this.save(false, myForm);
  }

  save(addNew: boolean, myForm: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;

    this.data.GROUP_ID = parseInt(this.groupID);

    this.data.SERVICE_PROJECT_SPONSERED_DETAILS = this.ProjectSponsArray;
    this.data.UNIT_CONFERENCE_AWARD_DETAILS = this.UnitAwardArray;

    if((this.data.PROJECT_NAME == undefined || this.data.PROJECT_NAME.toString() == '' || this.data.PROJECT_NAME == null || this.data.PROJECT_NAME.trim() == '')
    && (this.data.DATE_OF_IMPLEMENTATION == undefined || this.data.DATE_OF_IMPLEMENTATION.toString() == '' || this.data.DATE_OF_IMPLEMENTATION == null)
    && (this.data.BENEFICIAERIES == undefined || this.data.BENEFICIAERIES.toString() == '' || this.data.BENEFICIAERIES == null || this.data.BENEFICIAERIES.trim() == '')
    && (this.data.INVOLVEMENT == undefined || this.data.INVOLVEMENT.toString() == '' || this.data.INVOLVEMENT == null)
    && (this.data.NO_OF_NON_MEMBER == undefined || this.data.NO_OF_NON_MEMBER.toString() == '' || this.data.NO_OF_NON_MEMBER == null)
    && (this.data.OTHER_ANGENCIES == undefined || this.data.OTHER_ANGENCIES.toString() == '' || this.data.OTHER_ANGENCIES == null)
    && (this.data.REPORTING_DATE == undefined || this.data.REPORTING_DATE.toString() == '' || this.data.REPORTING_DATE == null)
    && (this.data.TO_OTHER_ANGENCIES == undefined || this.data.TO_OTHER_ANGENCIES.toString() == '' || this.data.TO_OTHER_ANGENCIES == null)
    && (this.data.TOTAL_EXPENCES_IN_PROJECT == undefined || this.data.TOTAL_EXPENCES_IN_PROJECT.toString() == '' || this.data.TOTAL_EXPENCES_IN_PROJECT == null)
    && (this.data.PLANNING == undefined || this.data.PLANNING.toString() == '' || this.data.PLANNING == null || this.data.PLANNING.trim() == '')
    && (this.data.EXECUTION == undefined || this.data.EXECUTION.toString() == '' || this.data.EXECUTION == null || this.data.EXECUTION.trim() == '')
    && (this.data.IMPACT_ON_SOCIETY == undefined || this.data.IMPACT_ON_SOCIETY.toString() == '' || this.data.IMPACT_ON_SOCIETY == null || this.data.IMPACT_ON_SOCIETY.trim() == '')
    && (this.data.OTHER_INFORMATION == undefined || this.data.OTHER_INFORMATION.toString() == '' || this.data.OTHER_INFORMATION == null || this.data.OTHER_INFORMATION.trim() == '')
    ){
      this.isOk = false;
      this.data.IS_SUBMITED = 'D';
      this.message.error('Please enter all the mandatory field', '');
    }
    else{
      if (this.data.PROJECT_NAME == undefined || this.data.PROJECT_NAME.toString() == '' || this.data.PROJECT_NAME == null || this.data.PROJECT_NAME.trim() == '') {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Service Project Name ', '');
      }
      else if (this.data.DATE_OF_IMPLEMENTATION == undefined || this.data.DATE_OF_IMPLEMENTATION.toString() == '' || this.data.DATE_OF_IMPLEMENTATION == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Select Date of Implementation', '');
      }
      else if (this.data.BENEFICIAERIES == undefined || this.data.BENEFICIAERIES.toString() == '' || this.data.BENEFICIAERIES == null || this.data.BENEFICIAERIES.trim() == '') {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Beneficiaries Details', '');
      }
      else if (this.data.INVOLVEMENT == undefined || this.data.INVOLVEMENT.toString() == '' || this.data.INVOLVEMENT == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Number of Involement', '');
      }
      else if (this.data.NO_OF_NON_MEMBER == undefined || this.data.NO_OF_NON_MEMBER.toString() == '' || this.data.NO_OF_NON_MEMBER == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Number of Involved Non-Member', '');
      }
      else if ((this.numbers.test(this.data.NO_OF_NON_MEMBER.toString())) == false) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Member Count in Number Only', '');
      }
      else if (this.data.OTHER_ANGENCIES == undefined || this.data.OTHER_ANGENCIES.toString() == '' || this.data.OTHER_ANGENCIES == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Number of Involved Other Angencies', '');
      }
      else if (this.data.REPORTING_DATE == undefined || this.data.REPORTING_DATE.toString() == '' || this.data.REPORTING_DATE == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Select Date Reporting Date', '');
      }
      else if (this.data.TO_OTHER_ANGENCIES == undefined || this.data.TO_OTHER_ANGENCIES.toString() == '' || this.data.TO_OTHER_ANGENCIES == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the other Agencies report to Branch', '');
      }
      else if (this.data.TOTAL_EXPENCES_IN_PROJECT == undefined || this.data.TOTAL_EXPENCES_IN_PROJECT.toString() == '' || this.data.TOTAL_EXPENCES_IN_PROJECT == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Total Expences in Project', '');
      }
      else if ((this.numbers.test(this.data.TOTAL_EXPENCES_IN_PROJECT.toString())) == false) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Total Expenses in Number Only', '');
      }
      else if (this.data.PLANNING == undefined || this.data.PLANNING.toString() == '' || this.data.PLANNING == null || this.data.PLANNING.trim() == '') {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Planning', '');
      }
      else if (this.data.EXECUTION == undefined || this.data.EXECUTION.toString() == '' || this.data.EXECUTION == null || this.data.EXECUTION.trim() == '') {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Execution', '');
      }
      else if (this.data.IMPACT_ON_SOCIETY == undefined || this.data.IMPACT_ON_SOCIETY.toString() == '' || this.data.IMPACT_ON_SOCIETY == null || this.data.IMPACT_ON_SOCIETY.trim() == '') {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Impact on Society', '');
      }
      else if (this.data.OTHER_INFORMATION == undefined || this.data.OTHER_INFORMATION.toString() == '' || this.data.OTHER_INFORMATION == null || this.data.OTHER_INFORMATION.trim() == '') {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Other Information', '');
      }
    }

    

    if (this.isOk) {
      this.isSpinning = true;

      this.data.DATE_OF_IMPLEMENTATION = this.datePipe.transform(this.data.DATE_OF_IMPLEMENTATION, "yyyy-MM-dd");
      this.data.REPORTING_DATE = this.datePipe.transform(this.data.REPORTING_DATE, "yyyy-MM-dd");

      // this.SponserPhotoUpload1();
      // this.drawerProjectSponsData.SPONSERED_CERTIFICATE = (this.sponserPhotoStr == "") ? " " : this.sponserPhotoStr;

      // this.UnitAwardPhotoUpload1();
      // this.drawerUnitAwardData.AWARD_CERTIFICATE = (this.unitAwardPhotoStr == "") ? " " : this.unitAwardPhotoStr;

      if (this.data.ID) {
        this.api.updateBestServiceProject(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Best Service Project Details Updated Successfully", "");
            this.isSpinning = false;

            if (!addNew)
              this.close(myForm);

          } else {
            this.message.error("Best Service Project Details Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.api.createBestServiceProject(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Best Service Project Created Successfully", "");
            this.isSpinning = false;

            if (!addNew)
              this.close(myForm);

            else {
              this.data = new BestServiceProjectMaster();
            }

          } else {
            this.message.error("Best Service Project Creation Failed", "");
            this.isSpinning = false;
          }
        });
      }
    }

  }
  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    this.ProjectSponsArray = null;
    this.UnitAwardArray = null;
    myForm.form.reset();
  }
  drawerProjectSponsClose(): void {

    this.drawerProjectSponsVisible = false;
  }
  get closeProjectSponsCallback() {
    return this.drawerProjectSponsClose.bind(this);
  }
  get projectSponsTableCallback() {
    return this.projectSponsTable.bind(this);
  }
  projectSponsTable(): void {
    console.log("Closed function " + this.drawerProjectSponsData.SPONSERED_PROJECT);
    this.drawerProjectSponsData.GROUP_ID = parseInt(this.groupID);
    // this.drawerGroupSponsData.GROUP_ID = 81 ;

    if (this.currentIndex > -1) {
      this.ProjectSponsArray[this.currentIndex] = this.drawerProjectSponsData;
      this.ProjectSponsArray = [...[], ...this.ProjectSponsArray];

    }
    else {
      this.ProjectSponsArray = [...this.ProjectSponsArray, ...[this.drawerProjectSponsData]];
    }
    this.currentIndex = -1;
    console.log("Service Project Spons Array" + this.ProjectSponsArray);
    this.drawerProjectSponsVisible = false;

  }
  addProjectSpons() {
    this.drawerProjectSponsTitle = "Add Service Project Sponsored Details";
    this.drawerProjectSponsData = new ServiceProjectSponsered();
    this.drawerProjectSponsVisible = true;
  }
  editProjectSpons(data: ServiceProjectSponsered, index: number): void {
    this.currentIndex = index;
    this.drawerProjectSponsTitle = "Update Service Project Sponsored Details";
    this.drawerProjectSponsData = Object.assign({}, data);
    this.drawerProjectSponsVisible = true;
  }

  drawerUnitAwardClose(): void {

    this.drawerUnitAwardVisible = false;
  }
  get closeUnitAwardCallback() {
    return this.drawerUnitAwardClose.bind(this);
  }
  get UnitAwardTableCallback() {
    return this.unitAwardTable.bind(this);
  }
  unitAwardTable(): void {
    console.log("Closed function " + this.drawerUnitAwardData.AWARD_NAME);
    this.drawerUnitAwardData.GROUP_ID = parseInt(this.groupID);
    // this.drawerGroupSponsData.GROUP_ID = 81 ;

    if (this.currentIndex > -1) {
      this.UnitAwardArray[this.currentIndex] = this.drawerUnitAwardData;
      this.UnitAwardArray = [...[], ...this.UnitAwardArray];

    }
    else {
      this.UnitAwardArray = [...this.UnitAwardArray, ...[this.drawerUnitAwardData]];
    }
    this.currentIndex = -1;
    console.log("Service Unit Conference Award Array" + this.UnitAwardArray);
    this.drawerUnitAwardVisible = false;

  }
  addUnitAward() {
    this.drawerUnitAwardTitle = "Add Unit Conference Award Details";
    this.drawerUnitAwardData = new UnitConferenceAward();
    this.drawerUnitAwardVisible = true;
  }
  editUnitAward(data: UnitConferenceAward, index: number): void {
    this.currentIndex = index;
    this.drawerUnitAwardTitle = "Update Unit Conference Award Details";
    this.drawerUnitAwardData = Object.assign({}, data);
    this.drawerUnitAwardVisible = true;
  }

  getWidth() {
    if (window.innerWidth <= 400)
      return 380;
    else
      return 600;
  }
  showModal(): void {
    this.isVisible = true;
  }
  handleCancel() {
    this.isVisible = false;
  }

  SentUrl1(event: any) {
    this.url1 = (event)
    console.log("This URL1 " + this.url1);
    if (this.url1 == null || this.url1 == undefined || this.url1 == "") {
      var URL1 = "";
    }
    else {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.url1.name.split('.').pop();
      var URL1 = "GM" + number + "." + fileExt;
    }
    this.drawerProjectSponsData.SPONSERED_CERTIFICATE = URL1;
    console.log("this.drawerProjectSponsData.SPONSERED_CERTIFICATE" + this.drawerProjectSponsData.SPONSERED_CERTIFICATE);

  }
  SentUrl2(event: any) {
    this.url2 = (event)
    console.log("This URL1 " + this.url2);
    if (this.url2 == null || this.url2 == undefined || this.url2 == "") {
      var URL2 = "";
    }
    else {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.url2.name.split('.').pop();
      var URL2 = "GM" + number + "." + fileExt;
    }
    this.drawerUnitAwardData.AWARD_CERTIFICATE = URL2;
    console.log("this.AWARD_CERTIFICATE.AWARD_CERTIFICATE" + this.drawerUnitAwardData.AWARD_CERTIFICATE);

  }
  folderName1 = "sponsershipCertificate";
  folderName2 = "awardCertificate";
  sponserPhotoStr: string;
  unitAwardPhotoStr: string;

  SponserPhotoUpload1() {
    this.sponserPhotoStr = "";

    if (!this.data.ID) {
      if (this.url1) {

        this.api.onUploadMedia(this.folderName1, this.url1, this.drawerProjectSponsData.SPONSERED_CERTIFICATE).subscribe(res => {
          if (res["code"] == 200) {
            console.log("SponserPhoto Uploaded in Folder = " + this.folderName1);

          } else {
            console.log("SponserPhoto Not Uploaded in Folder = " + this.folderName1);
          }
        });

        this.sponserPhotoStr = this.drawerProjectSponsData.SPONSERED_CERTIFICATE;

      } else {
        this.sponserPhotoStr = "";
      }

    } else {
      if (this.url1) {

        this.api.onUploadMedia(this.folderName1, this.url1, this.drawerProjectSponsData.SPONSERED_CERTIFICATE).subscribe(res => {
          if (res["code"] == 200) {
            console.log("SponserPhoto Uploaded in Folder = " + this.folderName1);

          } else {
            console.log("SponserPhoto Not Uploaded in Folder = " + this.folderName1);
          }
        });

        this.sponserPhotoStr = this.drawerProjectSponsData.SPONSERED_CERTIFICATE;;

      } else {
        if (this.drawerProjectSponsData.SPONSERED_CERTIFICATE) {
          let photoURL = this.drawerProjectSponsData.SPONSERED_CERTIFICATE.split("/");
          this.sponserPhotoStr = photoURL[photoURL.length - 1];

        } else
          this.sponserPhotoStr = "";
      }
    }
  }
  UnitAwardPhotoUpload1() {
    this.unitAwardPhotoStr = "";

    if (!this.data.ID) {
      if (this.url2) {

        this.api.onUploadMedia(this.folderName2, this.url2, this.drawerUnitAwardData.AWARD_CERTIFICATE).subscribe(res => {
          if (res["code"] == 200) {
            console.log("UnitAwardPhoto Uploaded in Folder = " + this.folderName2);

          } else {
            console.log("UnitAwardPhoto Not Uploaded in Folder = " + this.folderName2);
          }
        });

        this.unitAwardPhotoStr = this.drawerUnitAwardData.AWARD_CERTIFICATE;

      } else {
        this.unitAwardPhotoStr = "";
      }

    } else {
      if (this.url2) {

        this.api.onUploadMedia(this.folderName2, this.url2, this.drawerUnitAwardData.AWARD_CERTIFICATE).subscribe(res => {
          if (res["code"] == 200) {
            console.log("UnitAwardPhoto Uploaded in Folder = " + this.folderName2);

          } else {
            console.log("UnitAwardPhoto Not Uploaded in Folder = " + this.folderName2);
          }
        });

        this.unitAwardPhotoStr = this.drawerUnitAwardData.AWARD_CERTIFICATE;;

      } else {
        if (this.drawerUnitAwardData.AWARD_CERTIFICATE) {
          let photoURL = this.drawerUnitAwardData.AWARD_CERTIFICATE.split("/");
          this.unitAwardPhotoStr = photoURL[photoURL.length - 1];

        } else
          this.unitAwardPhotoStr = "";
      }
    }
  }
  today = new Date();

  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  };

  // FetchOldData(){
  //   this.message.info("Fetch Old Data", "Data Fetched")
  // }

 year = new Date().getFullYear();
  baseYear = 2020;
  range = [];
  // next_year = Number(this.year + 1)
  // SelectedYear: any = this.year + "-" + this.next_year;
  // currentYear: any = this.year - 1 + "-" + this.year;
  // currentDate = new Date();
  // businessYearStartDate = new Date(this.currentDate.getFullYear() + 1, 3, 1);

  currentYear: any;
  SelectedYear: any;

  Fordate() {
    let currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= this.baseYear; i--) {
      this.range.push(i);
    }
  }

  LoadYears() {
    this.SelectedYear = new Date().getFullYear();
  }

  selectChangeYear() {
    this.isSpinning = true;
    this.data = new BestServiceProjectMaster();
    this.ProjectSponsArray = [];
    this.UnitAwardArray = [];

    this.api.getBestServiceProject(0, 0, 'ID', 'ASC', 'AND GROUP_ID = ' + this.groupID, this.SelectedYear).subscribe(data => {
      if (data['count'] > 0) {
        this.data = Object.assign({}, data['data'][0]);
        this.isSpinning = false;

        this.api.getServiceProjectSponser(0, 0, 'ID', 'ASC', 'AND BEST_SERVICE_PROJECT_ID = ' + this.data.ID).subscribe(dataSpons => {
          if (dataSpons['count'] > 0) {
            this.ProjectSponsArray = dataSpons['data'];
            this.isSpinning = false;

          } else {
            this.ProjectSponsArray = [];
          }
        });

        this.api.getUnitConfernceAward(0, 0, 'ID', 'ASC', 'AND BEST_SERVICE_PROJECT_ID = ' + this.data.ID).subscribe(dataUnitConf => {
          if (dataUnitConf['count'] > 0) {
            this.UnitAwardArray = dataUnitConf['data'];
            this.isSpinning = false;

          } else {
            this.UnitAwardArray = [];
          }
        });
      }

      this.isSpinning = false;
    });
  }
}
