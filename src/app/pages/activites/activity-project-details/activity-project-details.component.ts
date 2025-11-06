import { Component, Input, Output, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { getISOWeek } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DatePipe } from '@angular/common';
import { ActivityProjectDetails } from 'src/app/Models/activity-project-details';
import { ApiService } from 'src/app/Service/api.service';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import setHours from 'date-fns/set_hours';

@Component({
  selector: 'app-activity-project-details',
  templateUrl: './activity-project-details.component.html',
  styleUrls: ['./activity-project-details.component.css']
})

export class ActivityProjectDetailsComponent implements OnInit {
  @Input() data: ActivityProjectDetails = new ActivityProjectDetails();
  @Input() isRemarkVisible: boolean;
  @Input() drawerClose1!: Function;
  @Input() drawerVisible: boolean = false;
  @Input() activity_details: Function;
  fileInput1?: string;
  isSpinning = false;
  mobpattern = '/^[0-9]\d{9}$/';
  validation = true;
  url = this.api.retriveimgUrl + "activitiesInformation/";
  avatarUrl?: string;
  sponsorship?: boolean;
  date = null;
  isEnglish = false;

  constructor(private datePipe: DatePipe, private msg: NzMessageService, private message: NzNotificationService, private i18n: NzI18nService, private api: ApiService, private _cookie: CookieService) { }

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

  getwidth() {
    if (window.innerWidth < 500) {
      return 350;

    } else {
      return 750;
    }
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  log(result: Date) {

  }

  getWeek(result: Date): void {
    console.log('week: ', getISOWeek(result));
  }

  changeLanguage(): void {
    this.i18n.setLocale(this.isEnglish ? zh_CN : en_US);
    this.isEnglish = !this.isEnglish;
  }

  ngOnInit() {
    this.getCategory();
  }

  projects: [];

  getCategory() {
    this.api.getAllProjects(0, 0, "NAME", "asc", " AND STATUS=1").subscribe(data => {
      if (data['code'] == 200) {
        this.projects = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  get closeCallback() {
    return this.drawerClose1.bind(this);
  }

  reset(myForm: NgForm) {
    this.validation = true;
    myForm.form.reset();
  }

  submit() {
    this.validation = false;
    this.data.IMPLEMENTATION_YEAR = this.datePipe.transform(this.data.IMPLEMENTATION_YEAR, "yyyy-MM-dd");
    if (this.data.PROJECT_TITLE == undefined || this.data.PROJECT_TITLE.trim() == '') { this.message.error("Project Title", "Please fill the field"); }
    else if (this.data.IMPLEMENTATION_YEAR == '' || this.data.IMPLEMENTATION_YEAR == null) { this.message.error("Select Year", "Please fill the field"); }
    else if (this.data.CATEGORY == '' || this.data.CATEGORY == null) { this.message.error("Category", "Please fill the field"); }
    else if (this.data.REGULARITY_DETAILS == undefined || this.data.REGULARITY_DETAILS.trim() == '') { this.message.error("Regularity Details", "Please fill the field"); }
    else if (this.data.BENEFITS_TO_COMMUNITY == undefined || this.data.BENEFITS_TO_COMMUNITY.trim() == '') { this.message.error("Benefits To Communnity", "Please fill the field"); }
    else if (this.data.EXPENSES_DETAILS == undefined || this.data.EXPENSES_DETAILS.trim() == '') { this.message.error("Expenses Details", "Please fill the field"); }
    else if (this.data.SPONSERSHIP_DETAILS.trim() == '' || this.data.SPONSERSHIP_DETAILS == null) { this.message.error("Sposership Details", "Please fill the field"); }
    else if (this.data.SPONSER_CERTIFICATE == '' || this.data.SPONSER_CERTIFICATE == null) { this.message.error("Sponsor Certifcate ", "Please fill the field"); }
    else if (this.data.PROJECT_PLANNING == undefined || this.data.PROJECT_PLANNING.trim() == '') { this.message.error("Project Planning", "Please fill the field"); }
    else if (this.data.EXECUTION_DETAILS == undefined || this.data.EXECUTION_DETAILS.trim() == '') { this.message.error("Execution Details", "Please fill the field"); }
    else if (this.data.IMPACT_SOCIETY == undefined || this.data.IMPACT_SOCIETY.trim() == '') { this.message.error("Impact Society", "Please fill the field"); } else {
      this.validation = true;
      this.activity_details();
    }
  }

  close(): void {
    this.validation = true;
    this.fileURL1 = null;
    this.data.SPONSER_CERTIFICATE = '';
    this.drawerClose1();
  }

  folderName = "outstandingVicePresident";
  photo1Str: string;
  fileURL1: any;

  onFileSelected1(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.data.SPONSER_CERTIFICATE = <File>event.target.files[0];
    } else {
      this.message.error('Please Choose Only PDF File', '');
      this.data.SPONSER_CERTIFICATE = null;
    }
  }

  clear1() {
    this.fileURL1 = null;
    this.data.SPONSER_CERTIFICATE = '';
  }

  cancel() { }
}
