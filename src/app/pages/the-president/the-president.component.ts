import { Component, Input, Output, OnInit, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { getISOWeek } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/Service/api.service';
import { DatePipe } from '@angular/common';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import setHours from 'date-fns/set_hours';
import { ThePresident } from 'src/app/Models/the-president';
import { OutstandingPresidentDetails } from 'src/app/Models/outstanding-president-details';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-the-president',
  templateUrl: './the-president.component.html',
  styleUrls: ['./the-president.component.css']
})

export class ThePresidentComponent implements OnInit {
  @Input() data: ThePresident = new ThePresident();
  @Input() isRemarkVisible: boolean;
  @Input() drawerClose!: Function;
  @Input() drawerVisible: boolean = false;
  @Input() drawerPresidentDetails: any[] = [];

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '25rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
    ],
    customClasses: [],
    uploadUrl: '',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['fonts', 'uploadUrl'],
      ['video']
    ]
  };

  drawerTitleVisible: boolean = false;
  mobpattern = '/^[0-9]\d{9}$/';
  PhotoUrl = this.api.retriveimgUrl + "outstandingPresidentDetailsPhotos";
  PdfUrl2 = this.api.retriveimgUrl + "outstandingPresidentFiles";
  isSpinning = false;
  currentIndex: number;
  validation = true;
  Swicthing: boolean = true;
  federationID = this._cookie.get("HOME_FEDERATION_ID");
  unitID = this._cookie.get("UNIT_ID");
  groupID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
  user_id = this._cookie.get('roleId');
  GROUP: [];
  demoValue = 10;
  drawerTitleData1: OutstandingPresidentDetails = new OutstandingPresidentDetails();
  Branch: [];
  ICON = [];
  date = null;
  isEnglish = false;

  constructor(private datePipe: DatePipe, private message: NzNotificationService, private i18n: NzI18nService, private api: ApiService, private _cookie: CookieService) { }

  today = new Date();
  timeDefaultValue = setHours(new Date(), 0);

  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  };

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

  close(myForm: NgForm): void {
    this.drawerPresidentDetails = [];
    this.fileURL = null;
    this.data.FILE_URL = '';
    this.validation = true;
    this.drawerClose();
  }

  getwidth() {
    if (window.innerWidth < 400) {
      return 380;

    } else {
      return 700;
    }
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  year = new Date().getFullYear();
  baseYear = 2020;
  range = [];
  next_year = Number(this.year + 1);
  a = new Date();
  b = new Date(this.a.getFullYear() + 1, 3, 1);
  SelectedYear: any;
  filter = '';

  Fordate() {
    let currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= this.baseYear; i--) {
      this.range.push(i);
    }
  }

  CurrentYear: any;

  current_year() {
    this.SelectedYear = new Date().getFullYear();
    this.CurrentYear = this.SelectedYear;
  }

  SelectYear(YEARs: any) {
    this.SelectedYear = YEARs;
    this.filter = '';
    this.data = new ThePresident();
    this.drawerPresidentDetails = [];
    this.data.SWICTHING = false;
    this.data.GROUP_ID = Number(sessionStorage.getItem("HOME_GROUP_ID"));

    this.api.getPresident(0, 0, "", "asc", "AND GROUP_ID=" + this.data.GROUP_ID, this.SelectedYear).subscribe(data1 => {
      if ((data1['count'] > 0) && (data1['code'] == 200)) {
        this.data = data1['data'][0];
        this.data.MEETING_DATE = new Date();

        if (this.data.BRANCH_CONVENTION == null || this.data.BRANCH_CONVENTION == ' ') {
          this.data.SWICTHING = false;

        } else {
          this.data.SWICTHING = true;
        }

        this.api.getPresidentDetails(0, 0, "", "asc", "AND OUTSTANDING_PRESIDENT_ID=" + this.data.ID).subscribe(data2 => {
          if ((data2['count'] > 0) && (data2['code'] == 200)) {
            this.drawerPresidentDetails = data2['data'];
          }

        }, err => {
          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  log(result: Date) { }

  getWeek(result: Date): void {
    console.log('week: ', getISOWeek(result));
  }

  changeLanguage(): void {
    this.i18n.setLocale(this.isEnglish ? zh_CN : en_US);
    this.isEnglish = !this.isEnglish;
  }

  ngOnInit() {
    this.Fordate();
    this.current_year();
  }

  inmeetings(NO_OF_IN_MEETINGS, MEETINGS_OUT_OF) {
    if (MEETINGS_OUT_OF != '') {
      if (parseInt(NO_OF_IN_MEETINGS) > parseInt(MEETINGS_OUT_OF)) {
        this.message.error("In Meeting", "Please fill the corrected data");
        this.data.NO_OF_IN_MEETINGS = null;
      }
    }
  }

  inproject(NO_OF_PROJECTS, PROJECTS_OUT_OF) {
    if (PROJECTS_OUT_OF != '') {
      if (parseInt(NO_OF_PROJECTS) > parseInt(PROJECTS_OUT_OF)) {
        this.message.error("In Project", "Please fill the corrected data");
        this.data.NO_OF_PROJECTS = null;
      }
    }
  }

  unitconferences(NO_UNIT_CONFERENCES, UNIT_CONFERENCES_OUT_OF) {
    if (UNIT_CONFERENCES_OUT_OF != '') {
      if (parseInt(NO_UNIT_CONFERENCES) > parseInt(UNIT_CONFERENCES_OUT_OF)) {
        this.message.error("Unit Conferences", "Please fill the corrected data");
        this.data.NO_UNIT_CONFERENCES = null;
      }
    }
  }

  visible_President = false;

  editdata(data1: OutstandingPresidentDetails, index: number): void {
    this.currentIndex = index
    console.log("this.currentIndex", this.currentIndex);
    this.drawerTitle = "Update Title Details";
    this.drawerTitleData1 = Object.assign({}, data1);
    this.drawerTitleData1.OUTSTANDING_PRESIDENT_ID = this.data.ID;
    this.PresidentProject = true;
  }

  drawerTitle3: string = 'Details to novel & imaginative projects undertaken during year team'
  PresidentProject: boolean = false;
  isRemarkVisible3: boolean;
  drawerData3: OutstandingPresidentDetails = new OutstandingPresidentDetails();

  AddPresidentDetils() {
    this.drawerTitleData1 = new OutstandingPresidentDetails();
    this.PresidentProject = true;
    this.currentIndex = -1;
    this.isRemarkVisible3 = false;
  }

  drawerTitle: string;

  President_details(): void {
    if (this.currentIndex > -1) {
      this.drawerPresidentDetails[this.currentIndex] = this.drawerTitleData1;
      this.drawerPresidentDetails = [...[], ...this.drawerPresidentDetails];

    } else {
      this.drawerPresidentDetails = [...this.drawerPresidentDetails, ...[this.drawerTitleData1]];
    }

    this.currentIndex = -1;
    this.message.success("Detilas Added in list", "");

    console.log("Conti Array" + this.drawerPresidentDetails);
    this.PresidentProject = false;
  }

  get submita() {
    return this.President_details.bind(this);
  }

  lenthCount(count) {
    console.log(count);

  }

  totalRecords = 1;
  OldFetchedData = [];
  FetchOldData() {
    // this.message.info("Fetch Old Data", "Data Fetched")   
    const memberID = parseInt(this._cookie.get('userId'));
    this.api.getOutstandingPresidentOldDetails(memberID).subscribe(data => {
      if (data['code'] == '200') {
        this.totalRecords = data['count'];
        this.OldFetchedData = data['data'];
      }
      this.data.NO_OF_IN_MEETINGS = this.OldFetchedData[0]['MEETING_ATTEMPTED'];
      this.data.MEETINGS_OUT_OF = this.OldFetchedData[0]['MEETING_INVITED'];
      this.data.NO_OF_PROJECTS = this.OldFetchedData[0]['TOTAL_PROJECTS'];
      this.data.PROJECTS_OUT_OF = this.OldFetchedData[0]['TOTAL_PROJECTS'];
      this.message.success("Old Data Fetch Successfully", "");
    }, err => {
      this.message.error("Server Not Found", "");
    });
  }
  ApplySubmit(a, myForm) {
    this.data.IS_SUBMITED = 'S';
    this.submit(false, myForm);
  }


  submit(addnew: boolean, myForm: NgForm) {


    this.validation = false;
    this.data.MEMBER_ID = parseInt(this._cookie.get('userId'));
    this.data.GROUP_ID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
    this.data.MEETING_DATE = this.datePipe.transform(this.data.MEETING_DATE, "yyyy-MM-dd");
    this.data.OUTSTANDING_PRESIDENT_DETAILS = this.drawerPresidentDetails;
    let length = Number(this.data.OUTSTANDING_PRESIDENT_DETAILS.length);
    if (this.data.BRANCH_CONVENTION == undefined) { this.data.BRANCH_CONVENTION = ' '; }

    if (this.data.NO_OF_PROJECTS == null || this.data.NO_OF_PROJECTS == undefined) { this.message.error("In Poject Meeting ", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.PROJECTS_OUT_OF == null || this.data.PROJECTS_OUT_OF == undefined) { this.message.error("In Poject Meeting Out  Of ", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.NO_OF_IN_MEETINGS == undefined || this.data.NO_OF_IN_MEETINGS == null) { this.message.error("In projects ", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.MEETINGS_OUT_OF == undefined || this.data.MEETINGS_OUT_OF == null) { this.message.error("out Of Meeting", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.NO_UNIT_CONFERENCES == null || this.data.NO_UNIT_CONFERENCES == undefined) { this.message.error("In Unit Conferences", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.UNIT_CONFERENCES_OUT_OF == null || this.data.UNIT_CONFERENCES_OUT_OF == undefined) { this.message.error("In Unit Conferences Out Of", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.PAST_CONVENTION == null || this.data.PAST_CONVENTION == undefined) { this.message.error("In G.I. Past Convention", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.CONVENTION_DETAILS == undefined || this.data.CONVENTION_DETAILS.trim() == '') { this.message.error("Convention Details", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.MEMBER_PREVIOUS_YEAR == null || this.data.MEMBER_PREVIOUS_YEAR == '') { this.message.error("No. of members as on Previous Year:", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.MEMBER_DURING_YEAR == null || this.data.MEMBER_DURING_YEAR == '') { this.message.error("New Members added during year", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.MEMBER_DROPPED_DURING_YEAR == null || this.data.MEMBER_DROPPED_DURING_YEAR == '') { this.message.error("Members dropped during the year", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.GROWTH_DETAILS == null || this.data.GROWTH_DETAILS.trim() == '') { this.message.error(" Details of special efforts made for Growth", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.GROWTH_RETENTION == null || this.data.GROWTH_RETENTION.trim() == '') { this.message.error("Growth & Retention", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.FINANCIAL_POSITION == null || this.data.FINANCIAL_POSITION == '') { this.message.error("Financial position of the Group", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.MEETING_PLACE == null || this.data.MEETING_PLACE.trim() == '') { this.message.error("Place", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.MEETING_DATE == null || this.data.MEETING_DATE == '') { this.message.error("Date", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.SWICTHING == true && (this.data.BRANCH_CONVENTION == null || this.data.BRANCH_CONVENTION.trim() == '')) { this.message.error("BRANCH CONVENTION", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.OTHER_DETAILS == null || this.data.OTHER_DETAILS.trim() == '') { this.message.error("Any other relevant information", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.FILE_URL == '') { this.message.error("File", "Please Select  the file"); this.data.IS_SUBMITED = 'D'; }
    else {

      this.isSpinning = true;
      if (this.data.SWICTHING != true) {
        this.data.BRANCH_CONVENTION = " ";
      }
      if (this.data.IS_SUBMITED == null) {
        this.data.IS_SUBMITED = 'D';
      };

      this.validation = true;

      for (let i = 0; i < length; i++) {
        this.imageUpload(i);
        this.data.OUTSTANDING_PRESIDENT_DETAILS[i]['PHOTO_URL'] = (this.photostr == "") ? " " : this.photostr;
      }

      this.PDFUplod();
      this.data.FILE_URL = (this.fileStr == "") ? " " : this.fileStr;

      if (this.data.ID) {
        this.api.updatePresident(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("The Outstanding President Updated Successfully", "");
            this.isSpinning = false;
            this.validation = true;
            this.data.FINANCIAL_POSITION = "";

            if (!addnew)
              this.close(myForm);

          } else {
            this.message.error("The Outstanding President Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.api.createPresident(this.data).subscribe(data => {
          if (data["code"] == 200) {
            this.message.success("The Outstanding President Created Successfully", "");
            this.isSpinning = false;
            this.validation = true;
            this.data.FINANCIAL_POSITION = "";

            if (!addnew)
              this.close(myForm);

            else {
              this.data = new ThePresident();
            }

          } else {
            this.message.error("The Outstanding President Creation Failed", "");
            this.isSpinning = false;
          }
        })
      }

    }
  }

  cancel() { }

  drawerClose1(): void {
    this.PresidentProject = false;
  }

  get closeCallback() {
    return this.drawerClose1.bind(this);
  }

  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  imagefolderName = "outstandingPresidentDetailsPhotos";
  photostr: string;
  photofilrUrl?: any;

  imageUpload(i: number) {
    this.photostr = "";
    this.photofilrUrl = this.data.OUTSTANDING_PRESIDENT_DETAILS[i]['PHOTO_URL'];
    if (typeof (this.photofilrUrl) != 'string') {
      if (!this.data.ID) {
        if (this.photofilrUrl) {
          var number = Math.floor(100000 + Math.random() * 900000);

          var fileExt = this.photofilrUrl.name.split('.').pop();
          var url = "IM" + number + "." + fileExt;

          this.api.onUpload2(this.imagefolderName, this.photofilrUrl, url).subscribe(res => {
            if (res["code"] == 200) {
              console.log("Uploaded");

            } else {
              console.log("Not Uploaded");
            }
          });

          this.photostr = url;

        } else {
          this.photostr = "";
        }

      } else {
        if (this.photofilrUrl) {
          var number = Math.floor(100000 + Math.random() * 900000);
          console.log(typeof (this.photofilrUrl));

          var fileExt = this.photofilrUrl.name.split('.').pop();
          var url = "IM" + number + "." + fileExt;

          this.api.onUpload2(this.imagefolderName, this.photofilrUrl, url).subscribe(res => {
            if (res["code"] == 200) {
              console.log("Uploaded");

            } else {
              console.log("Not Uploaded");
            }
          });

          this.photostr = url;

        } else {
          if (this.data.OUTSTANDING_PRESIDENT_DETAILS[i]['PHOTO_URL']) {
            let pdfURL = this.data.OUTSTANDING_PRESIDENT_DETAILS[i]['PHOTO_URL'].split("/");
            this.photostr = pdfURL[pdfURL.length - 1];

          } else
            this.photostr = "";
        }
      }

    } else {
      this.photostr = this.data.OUTSTANDING_PRESIDENT_DETAILS[i]['PHOTO_URL'];
    }
  }

  folderName = "outstandingPresidentFiles";
  fileStr: string;
  fileURL?: any;

  PDFUplod() {
    this.fileStr = "";
    if (!this.data.ID) {
      if (this.fileURL) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL.name.split('.').pop();
        var url = "PF" + number + "." + fileExt;
        this.api.onUpload2(this.folderName, this.fileURL, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");
          } else {
            console.log("Not Uploaded");
          }
        });
        this.fileStr = url;

      } else {
        this.fileStr = "";
      }

    } else {
      if (this.fileURL) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL.name.split('.').pop();
        var url = "PF" + number + "." + fileExt;
        this.api.onUpload2(this.folderName, this.fileURL, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.fileStr = url;

      } else {
        if (this.data.FILE_URL) {
          let photoURL = this.data.FILE_URL.split("/");
          this.fileStr = photoURL[photoURL.length - 1];

        } else
          this.fileStr = "";
      }
    }
  }

  onFileSelected(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.fileURL = <File>event.target.files[0];
      this.data.FILE_URL = null;

    } else {
      this.message.error('Please Choose Only PDF File', '');
      this.fileURL = null;
    }
  }

  clear() {
    this.fileURL = null;
    this.data.FILE_URL = '';
  }
}
