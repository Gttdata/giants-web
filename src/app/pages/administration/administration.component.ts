import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { getISOWeek } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
import { Adminstration } from 'src/app/Models/adminstration';
import { ApiService } from 'src/app/Service/api.service';
import { Membermaster } from 'src/app/Models/MemberMaster';
import { DatePipe } from '@angular/common';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import setHours from 'date-fns/set_hours';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})

export class AdministrationComponent implements OnInit {
  @Input() data: Adminstration = new Adminstration;
  @Input() isRemarkVisible: boolean;
  @Input() drawerClose!: Function;
  @Input() drawerVisible: boolean = false;
  @Input() AllMembers: Membermaster = new Membermaster()
  PdfUrl1 = this.api.retriveimgUrl + "generalMeetingFiles";
  PdfUrl2 = this.api.retriveimgUrl + "directorsOfAdministrationFiles";
  fileInput1: string;
  fileURL1: any;
  fileURL2: any;
  mobpattern = '/^[0-9]\d{9}$/';
  validation = true;
  isSpinning = false;
  isEnglish = false;

  constructor(private datePipe: DatePipe, private message: NzNotificationService, private i18n: NzI18nService, private api: ApiService, private _cookie: CookieService) { }

  today = new Date();
  timeDefaultValue = setHours(new Date(), 0);
  year = new Date().getFullYear();
  baseYear = 2020;
  range = [];
  next_year = Number(this.year + 1)
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

  administrationData: Adminstration = new Adminstration();

  SelectYear(YEARs: any) {
    this.SelectedYear = YEARs;
    this.filter = '';
    this.data = new Adminstration();
    this.data.GROUP_ID = Number(sessionStorage.getItem("HOME_GROUP_ID"));

    this.api.getAdministration(0, 0, "", "asc", " AND GROUP_ID=" + this.data.GROUP_ID, this.SelectedYear).subscribe(data1 => {
      if ((data1['count'] > 0) && (data1['code'] == 200)) {
        this.data = data1['data'][0];

        if (data1['data'][0]['CIRCULATED_TO_BOARD_MEMBERS'] == null || data1['data'][0]['CIRCULATED_TO_BOARD_MEMBERS'] == ' ') {
          this.data.SWICTHING3 = false;
        } else {
          this.data.SWICTHING3 = true;
        }
        if (data1['data'][0]['RECOMMENDATION_FOR_AWARD'] == null || data1['data'][0]['RECOMMENDATION_FOR_AWARD'] == ' ') {
          this.data.SWICTHING4 = false;
        } else {
          this.data.SWICTHING4 = true;
        }
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  disabledDate = (current: Date): boolean => {
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
    this.fileURL2 = null;
    this.data.FILE_URL = '';
    this.fileURL1 = null;
    this.data.GENERAL_MEETING_FILE_URL = '';
    this.drawerClose();
  }

  getwidth() {
    if (window.innerWidth < 500) {
      return 380;

    } else {
      return 800;
    }
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

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

  clear1() {
    this.fileURL1 = null;
    this.data.GENERAL_MEETING_FILE_URL = '';
  }

  clear2() {
    this.fileURL2 = null;
    this.data.FILE_URL = '';
  }

  isVisible: boolean = false;

  showModal(): void {
    this.isVisible = true;
  }

  boardmeeting(NO_OF_BOARD_MEETING, NO_OF_BOARD_MEETING_OUT) {
    if (NO_OF_BOARD_MEETING_OUT != '') {
      if (parseInt(NO_OF_BOARD_MEETING) > parseInt(NO_OF_BOARD_MEETING_OUT)) {
        this.message.error("Board Meeting", "Please fill the corrected data");
        this.data.NO_OF_BOARD_MEETING = null;
      }
    }
  }

  groupmeeting(GROUP_AND_BOARDING_MEETINGS, GROUP_AND_BOARDING_MEETINGS_OUT_OF) {
    if (GROUP_AND_BOARDING_MEETINGS_OUT_OF != '') {
      if (parseInt(GROUP_AND_BOARDING_MEETINGS) > parseInt(GROUP_AND_BOARDING_MEETINGS_OUT_OF)) {
        this.message.error("Group meetings and Board meetings", "Please fill the corrected data");
        this.data.GROUP_AND_BOARDING_MEETINGS = null;
      }
    }
  }

  inProject(PROJECTS_MEETINGS, PROJECTS_MEETINGS_OUT_OF) {
    if (PROJECTS_MEETINGS_OUT_OF != '') {
      if (parseInt(PROJECTS_MEETINGS) > parseInt(PROJECTS_MEETINGS_OUT_OF)) {
        this.message.error("In Pojects", "Please fill the corrected data");
        this.data.PROJECTS_MEETINGS = null;
      }
    }
  }

  unitCouncil(UNIT_COUNCILS_MEETINGS, UNIT_COUNCILS_MEETINGS_OUT_OF) {
    if (UNIT_COUNCILS_MEETINGS_OUT_OF != '') {
      if (parseInt(UNIT_COUNCILS_MEETINGS) > parseInt(UNIT_COUNCILS_MEETINGS_OUT_OF)) {
        this.message.error("Unit Council Meetings", "Please fill the corrected data");
        this.data.UNIT_COUNCILS_MEETINGS = null;
      }
    }
  }

  unitConferences(UNIT_CONFERENCES, UNIT_CONFERENCES_OUT_OF) {
    if (UNIT_CONFERENCES_OUT_OF != '') {
      if (parseInt(UNIT_CONFERENCES) > parseInt(UNIT_CONFERENCES_OUT_OF)) {
        this.message.error("Unit Conferences", "Please fill the corrected data");
        this.data.UNIT_CONFERENCES = null;
      }
    }
  }

  totalRecords = 1;
  OldFetchedData = [];

  FetchOldData() {
    const memberID = parseInt(this._cookie.get('userId'));
    this.api.getDirectorOfAdminDetails(memberID).subscribe(data => {
      if (data['code'] == '200') {
        this.totalRecords = data['count'];
        this.OldFetchedData = data['data'];
      }

      this.data.ENSURING_DATE_ON_SUBMITTED = this.OldFetchedData[0]['BO_DATE'];
      this.data.GROUP_AND_BOARDING_MEETINGS = this.OldFetchedData[0]['MEETING_ATTEMPTED'];
      this.data.GROUP_AND_BOARDING_MEETINGS_OUT_OF = this.OldFetchedData[0]['MEETING_INVITED'];
      this.data.PROJECTS_MEETINGS = this.OldFetchedData[0]['TOTAL_PROJECTS'];
      this.data.PROJECTS_MEETINGS_OUT_OF = this.OldFetchedData[0]['TOTAL_PROJECTS'];
      this.message.success("Old Data Fetch Successfully", "");

    }, err => {
      if (err['ok'] == false) this.message.error("Server Not Found", "");
    });
  }

  ApplySubmit(myForm) {
    this.data.IS_SUBMITED = 'S';
    this.submit(false, myForm);
  }

  submit(addnew: boolean, myForm: NgForm) {
    this.validation = false;
    this.data.MEMBER_ID = parseInt(this._cookie.get('userId'));
    this.data.GROUP_ID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
    this.data.DATE_OF_GENERAL_MEETINGS = this.datePipe.transform(this.data.DATE_OF_GENERAL_MEETINGS, "yyyy-MM-dd");
    this.data.DATE_OF_NOMINATION_APPOINTED = this.datePipe.transform(this.data.DATE_OF_NOMINATION_APPOINTED, "yyyy-MM-dd");
    this.data.ENSURING_DATE_ON_SUBMITTED = this.datePipe.transform(this.data.ENSURING_DATE_ON_SUBMITTED, "yyyy-MM-dd");
    this.data.MEMBERSHIP_LIST_ON_CURRENT_YEAR = this.datePipe.transform(this.data.MEMBERSHIP_LIST_ON_CURRENT_YEAR, "yyyy-MM-dd");
    this.data.YEAR = this.datePipe.transform(this.data.YEAR, "yyyy-MM-dd");
    if (this.data.CIRCULATED_TO_BOARD_MEMBERS == undefined) { this.data.CIRCULATED_TO_BOARD_MEMBERS = ' '; }
    if (this.data.RECOMMENDATION_FOR_AWARD == undefined) { this.data.RECOMMENDATION_FOR_AWARD = ' '; }
    if (this.data.SENT_BEFORE_10th_OF_MONTH == null || this.data.SENT_BEFORE_10th_OF_MONTH == undefined) {
      this.message.error("Sent before 10th of the month", "Please fill the field");
      this.data.IS_SUBMITED = 'D';
    }

    else if (this.data.SENT_AFTER_10th_OF_MONTH == null || this.data.SENT_AFTER_10th_OF_MONTH == undefined) {
      this.message.error("Sent after 10th of the month", "Please fill the field");
      this.data.IS_SUBMITED = 'D';
    }

    else if (this.data.PROJECT_AND_PROGRAMME == null || this.data.PROJECT_AND_PROGRAMME == undefined) {
      this.message.error("Project & Programme ", "Please fill the field");
      this.data.IS_SUBMITED = 'D';
    }

    else if (this.data.GENERAL_MEETING.trim() == '' || this.data.GENERAL_MEETING == "") {
      this.message.error(" General meeting", "Please fill the field");
      this.data.IS_SUBMITED = 'D';
    }

    else if (this.data.GENERAL_MEETING_FILE_URL == undefined) {
      this.message.error(" General Meeting File", "Please fill the field");
      this.data.IS_SUBMITED = 'D';
    }

    else if (this.data.NO_OF_BOARD_MEETING == null || this.data.NO_OF_BOARD_MEETING == undefined) {
      this.message.error(" Board Meetings ", "Please fill the field");
      this.data.IS_SUBMITED = 'D';
    }

    else if (this.data.NO_OF_BOARD_MEETING_OUT_OF == null || this.data.NO_OF_BOARD_MEETING_OUT_OF == undefined) {
      this.message.error(" Board Meetings Out Of", "Please fill the field");
      this.data.IS_SUBMITED = 'D';
    }

    else if ((this.data.CIRCULATED_TO_BOARD_MEMBERS.trim() == '' || this.data.CIRCULATED_TO_BOARD_MEMBERS == "") && this.data.SWICTHING3 == true) {
      this.message.error("Circulated to Board Members ", "Please fill the field");
      this.data.IS_SUBMITED = 'D';
    }

    else if (this.data.DATE_OF_NOMINATION_APPOINTED == '' || this.data.DATE_OF_NOMINATION_APPOINTED == undefined) {
      this.message.error("Nomination Date", "Please fill the field");
      this.data.IS_SUBMITED = 'D';
    }

    else if (this.data.DATE_OF_GENERAL_MEETINGS == '' || this.data.DATE_OF_GENERAL_MEETINGS == undefined) {
      this.message.error("General Meetings Date", "Please fill the field");
      this.data.IS_SUBMITED = 'D';
    }

    else if (this.data.ENSURING_DATE_ON_SUBMITTED == '' || this.data.ENSURING_DATE_ON_SUBMITTED == undefined) {
      this.message.error("Ensuring Date  ", "Please fill the field");
      this.data.IS_SUBMITED = 'D';
    }

    else if (this.data.MEMBERSHIP_LIST_ON_CURRENT_YEAR == '' || this.data.MEMBERSHIP_LIST_ON_CURRENT_YEAR == undefined) {
      this.message.error("Membership Date", "Please fill the field");
      this.data.IS_SUBMITED = 'D';
    }

    else if (this.data.GROUP_AND_BOARDING_MEETINGS == null || this.data.GROUP_AND_BOARDING_MEETINGS == undefined) { this.message.error(" Group meetings and Board meetings", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.GROUP_AND_BOARDING_MEETINGS_OUT_OF == null || this.data.GROUP_AND_BOARDING_MEETINGS_OUT_OF == undefined) { this.message.error("Group meetings and Board meetings Out Of ", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.PROJECTS_MEETINGS == null || this.data.PROJECTS_MEETINGS == undefined) { this.message.error("In Project", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.PROJECTS_MEETINGS_OUT_OF == null || this.data.PROJECTS_MEETINGS_OUT_OF == undefined) { this.message.error(" Out Of Project ", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.UNIT_COUNCILS_MEETINGS == null || this.data.UNIT_COUNCILS_MEETINGS == undefined) { this.message.error("Unit Council Meetings ", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.UNIT_COUNCILS_MEETINGS_OUT_OF == null || this.data.UNIT_COUNCILS_MEETINGS_OUT_OF == undefined) { this.message.error(" Unit Council Meetings Out Of", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.UNIT_CONFERENCES == null || this.data.UNIT_CONFERENCES == undefined) { this.message.error("Unit Conferences", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.UNIT_CONFERENCES_OUT_OF == null || this.data.UNIT_CONFERENCES_OUT_OF == undefined) { this.message.error(" Unit Conferences Out Of", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.ATTENDENCE_OF_ORIENTATION_MEETING == null || this.data.ATTENDENCE_OF_ORIENTATION_MEETING == undefined) { this.message.error(" Attendance of Orientation Meeting", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.ATTENDED_CONVENTION_PLACE.trim() == '' || this.data.ATTENDED_CONVENTION_PLACE == "") { this.message.error("Attended Convention Place ", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.YEAR == null || this.data.YEAR == undefined) { this.message.error("Please fill year", ""); this.data.IS_SUBMITED = 'D'; }
    else if ((this.data.RECOMMENDATION_FOR_AWARD.trim() == '' || this.data.RECOMMENDATION_FOR_AWARD == undefined) && this.data.SWICTHING4 == true) { this.message.error("Recommendation for award", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.FILE_URL == undefined) {
      this.message.error("Select File", "Please fill the field");
      this.data.IS_SUBMITED = 'D';
    }

    else {
      this.validation = true;
      this.isSpinning = true;

      if (this.data.SWICTHING3 == false) {
        this.data.CIRCULATED_TO_BOARD_MEMBERS = " ";
      }

      if (this.data.IS_SUBMITED == null) {
        this.data.IS_SUBMITED = 'D';
      };

      if (this.data.SWICTHING4 == false) {
        this.data.RECOMMENDATION_FOR_AWARD = " ";

      } if (this.data.ID) {
        this.pdfUpload1();
        this.data.GENERAL_MEETING_FILE_URL = (this.pdf1Str == "") ? " " : this.pdf1Str;
        this.pdfUpload2();
        this.data.FILE_URL = (this.pdf2Str == "") ? " " : this.pdf2Str;

        this.api.updatAdministration(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Administration  Updated Successfully", "");
            this.isSpinning = false;
            this.validation = true;
            if (!addnew)
              this.close(myForm);
          } else {
            this.message.error("Administration Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.pdfUpload1();
        this.data.GENERAL_MEETING_FILE_URL = (this.pdf1Str == "") ? " " : this.pdf1Str;
        this.pdfUpload2();
        this.data.FILE_URL = (this.pdf2Str == "") ? " " : this.pdf2Str;

        this.api.createAdministration(this.data).subscribe(data => {
          if (data["code"] == 200) {
            this.message.success("Administration Created Successfully", "");
            this.isSpinning = false;
            this.validation = true;

            if (!addnew)
              this.close(myForm);

            else {
              this.data = new Adminstration();
            }

          } else {
            this.message.error("Administration Creation Failed", "");
            this.isSpinning = false;
          }
        })
      }
    }
  }

  folderName1 = "generalMeetingFiles";
  folderName2 = "directorsOfAdministrationFiles";
  pdf1Str: string;
  pdf2Str: string;

  pdfUpload1() {
    this.pdf1Str = "";

    if (!this.data.ID) {
      if (this.fileURL1) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL1.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName1, this.fileURL1, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");
          } else {
            console.log("Not Uploaded");
          }
        });

        this.pdf1Str = url;

      } else {
        this.pdf1Str = "";
      }

    } else {
      if (this.fileURL1) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL1.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName1, this.fileURL1, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.pdf1Str = url;

      } else {
        if (this.data.GENERAL_MEETING_FILE_URL) {
          let photoURL = this.data.GENERAL_MEETING_FILE_URL.split("/");
          this.pdf1Str = photoURL[photoURL.length - 1];

        } else
          this.pdf1Str = "";
      }
    }
  }

  pdfUpload2() {
    this.pdf2Str = "";

    if (!this.data.ID) {
      if (this.fileURL2) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL2.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName2, this.fileURL2, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.pdf2Str = url;

      } else {
        this.pdf2Str = "";
      }

    } else {
      if (this.fileURL2) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL2.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName2, this.fileURL2, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.pdf2Str = url;

      } else {
        if (this.data.FILE_URL) {
          let photoURL = this.data.FILE_URL.split("/");
          this.pdf2Str = photoURL[photoURL.length - 1];

        } else
          this.pdf2Str = "";
      }
    }
  }

  onFileSelected1(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.fileURL1 = <File>event.target.files[0];
      this.data.GENERAL_MEETING_FILE_URL = this.fileURL1.name;

    } else {
      this.message.error('Please Choose Only PDF File', '');
      this.fileURL1 = null;
    }
  }

  onFileSelected2(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.fileURL2 = <File>event.target.files[0];
      this.data.FILE_URL = this.fileURL2.name;

    } else {
      this.message.error('Please Choose Only PDF File', '');
      this.fileURL2 = null;
    }
  }

  handleCancel() {
    this.isVisible = false;
  }

  cancel() { }
}
