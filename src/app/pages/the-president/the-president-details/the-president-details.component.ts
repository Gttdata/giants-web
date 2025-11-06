import { Component, Input, Output, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { getISOWeek } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/Service/api.service';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import setHours from 'date-fns/set_hours';
import { DisabledTimeFn, DisabledTimePartial } from 'ng-zorro-antd/date-picker/standard-types';
import { OutstandingPresidentDetails } from 'src/app/Models/outstanding-president-details';
import { take } from 'rxjs/operators';
import { CompressImageService } from 'src/app/Service/image-compressor.service';

@Component({
  selector: 'app-the-president-details',
  templateUrl: './the-president-details.component.html',
  styleUrls: ['./the-president-details.component.css']
})

export class ThePresidentDetailsComponent implements OnInit {
  @Input() data: OutstandingPresidentDetails = new OutstandingPresidentDetails();
  @Input() isRemarkVisible: boolean;
  @Input() drawerClose1!: Function;
  @Input() drawerVisible: boolean = false;
  @Input() President_details: Function;
  fileInput1?: string;
  isSpinning = false;
  mobpattern = '/^[0-9]\d{9}$/';
  validation = true;
  public Swicthing: boolean = true;
  PhotoUrl = this.api.retriveimgUrl + "outstandingPresidentDetailsPhotos/";
  // url = this.api.retriveimgUrl + "activitiesInformation/";
  loading = false;
  avatarUrl?: string;
  sponsorship?: boolean;
  federationID = this._cookie.get("HOME_FEDERATION_ID");
  unitID = this._cookie.get("UNIT_ID");
  groupID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
  user_id = this._cookie.get('roleId');
  date = null;
  isEnglish = false;
  constructor(private compressImage: CompressImageService, private datePipe: DatePipe, private msg: NzMessageService, private message: NzNotificationService, private i18n: NzI18nService, private api: ApiService, private _cookie: CookieService) { }

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
    myForm.form.reset();
  }

  submit() {
    this.validation = false;
    this.data.PROJECT_DATE = this.datePipe.transform(this.data.PROJECT_DATE, "yyyy-MM-dd");
    if (this.data.PROJECT_TITLE == null || this.data.PROJECT_TITLE.trim() == '') { this.message.error("Project Title", "Please fill the field"); }
    else if (this.data.PROJECT_DATE == '' || this.data.PROJECT_DATE == null) { this.message.error("Select Date", "Please fill the field"); }
    else if (this.data.PHOTO_URL == '' || this.data.PHOTO_URL == null) { this.message.error("Upload Image ", "Please fill the field"); }
    else if (this.data.PHOTO_DETAILS == null || this.data.PHOTO_DETAILS.trim() == '') { this.message.error("Photo Details ", "Please fill the field"); }
    else {
      this.validation = true;
      this.President_details();
    }
  }

  close(): void {
    this.fileURL1 = null;
    this.data.PHOTO_URL = '';
    this.validation = true;
    this.drawerClose1();
  }

  folderName = "outstandingVicePresident";
  photo1Str: string;
  fileURL1: any;
  onFileSelected1(event: any) {
    if ((event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') && event.target.files[0].name.split('.').pop() != 'jfif') {
      this.fileURL1 = <File>event.target.files[0];
      this.data.PHOTO_URL = <File>event.target.files[0];

      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)
      this.compressImage.compress(event.target.files[0]).pipe(take(1))
        .subscribe(compressedImage => {
          console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
          // now you can do upload the compressed image     
          this.fileURL1 = compressedImage;
        })
      console.log("URLLLLL == ", this.fileURL1);

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.data.PHOTO_URL = null;
    }
  }

  clear1() {
    this.fileURL1 = null;
    this.data.PHOTO_URL = '';
  }

  cancel() { }
}