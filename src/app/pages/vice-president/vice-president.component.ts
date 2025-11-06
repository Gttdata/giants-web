import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { getISOWeek } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
import { Observable, Observer } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadChangeParam } from 'ng-zorro-antd/upload';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/Service/api.service';
import { VicePresident } from 'src/app/Models/vice-president';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import setHours from 'date-fns/set_hours';
import { take } from 'rxjs/operators';
import { CompressImageService } from 'src/app/Service/image-compressor.service';

@Component({
  selector: 'app-vice-president',
  templateUrl: './vice-president.component.html',
  styleUrls: ['./vice-president.component.css']
})

export class VicePresidentComponent implements OnInit {
  @Input() data: VicePresident = new VicePresident();
  @Input() isRemarkVisible: boolean;
  @Input() drawerClose!: Function;
  @Input() drawerVisible: boolean = false;
  fileInput1?: string;
  fileURL1?: any;
  fileURL2?: any;
  fileURL3?: any;
  isSpinning: boolean = false;
  url = this.api.retriveimgUrl + "outstandingVicePresident";
  mobpattern = '/^[0-9]\d{9}$/';
  validation = true;
  isEnglish = false;

  constructor(private compressImage: CompressImageService, private datePipe: DatePipe, private msg: NzMessageService, private message: NzNotificationService, private i18n: NzI18nService, private api: ApiService, private _cookie: CookieService) { }

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
    this.CurrentYear = this.SelectedYear;;
  }

  SelectYear(YEARs: any) {
    this.SelectedYear = YEARs;
    this.filter = '';
    this.data = new VicePresident();
    this.data.SWICTHING = false;
    this.data.SWICTHING1 = false;
    this.data.SWICTHING2 = false;
    this.data.SWICTHING3 = false;
    this.data.MEMBER_ID = parseInt(this._cookie.get('userId'));
    this.data.GROUP_ID = Number(sessionStorage.getItem("HOME_GROUP_ID"));

    this.api.getVicePresident(0, 0, "", "asc", " AND MEMBER_ID=" + this.data.MEMBER_ID + ' ' + "AND GROUP_ID=" + this.data.GROUP_ID, this.SelectedYear).subscribe(data => {
      if ((data['count'] > 0) && (data['code'] == 200)) {
        this.data = data['data'][0];
        if (data['data'][0]['DISCHARGED_DETAILS'] == null || data['data'][0]['DISCHARGED_DETAILS'] == ' ' || data['data'][0]['DISCHARGED_DETAILS'] == '') {
          this.data.SWICTHING = false;
        } else {
          this.data.SWICTHING = true;
        }
        if (data['data'][0]['ACTIVITY_DETAILS'] == null || data['data'][0]['ACTIVITY_DETAILS'] == ' ') {
          this.data.SWICTHING1 = false;
        } else {
          this.data.SWICTHING1 = true;
        }
        if (data['data'][0]['INOVATIVATIVE_PROJECT_DETAILS'] == null || data['data'][0]['INOVATIVATIVE_PROJECT_DETAILS'] == ' ') {
          this.data.SWICTHING2 = false;
        } else {
          this.data.SWICTHING2 = true;
        }
        if (data['data'][0]['MEMBERSHIP_GROUP_GROWTH_DETAILS'] == null || data['data'][0]['MEMBERSHIP_GROUP_GROWTH_DETAILS'] == ' ') {
          this.data.SWICTHING3 = false;
        } else {
          this.data.SWICTHING3 = true;
        }
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

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

  groupmeeting(GROUP_MEETING, OUT_OF_MEETINGS) {
    if (OUT_OF_MEETINGS != '') {
      if (parseInt(GROUP_MEETING) > parseInt(OUT_OF_MEETINGS)) {
        this.message.error("Group Meeting", "Please fill the corrected data");
        this.data.TOTAL_GROUP_MEETINGS = '';
      }
    }
  }

  boardmeeting(TOTAL_BOARD_MEETINGS, BOARD_OUT_OF_MEETINGS) {
    if (BOARD_OUT_OF_MEETINGS != '') {
      if (parseInt(TOTAL_BOARD_MEETINGS) > parseInt(BOARD_OUT_OF_MEETINGS)) {
        this.message.error("Board Meeting", "Please fill the corrected data");
        this.data.TOTAL_BOARD_MEETINGS = '';
      }
    }
  }

  unitcouncilmeeting(UNIT_COUNCILS_TOTAL, UNIT_COUNCILS_OUT_OF) {
    if (UNIT_COUNCILS_OUT_OF != '') {
      if (parseInt(UNIT_COUNCILS_TOTAL) > parseInt(UNIT_COUNCILS_OUT_OF)) {
        this.message.error("Unit Council Meeting", "Please fill the corrected data");
        this.data.UNIT_COUNCILS_TOTAL = '';
      }
    }
  }

  unitconferences(UNIT_CONFERENCES_TOTAL, UNIT_CONFERENCES_OUT_OF) {
    if (UNIT_CONFERENCES_OUT_OF != '') {
      if (parseInt(UNIT_CONFERENCES_TOTAL) > parseInt(UNIT_CONFERENCES_OUT_OF)) {
        this.message.error("Unit Conferences", "Please fill the corrected data");
        this.data.UNIT_CONFERENCES_TOTAL = '';
      }
    }
  }

  folderName = "outstandingVicePresident";
  photo1Str: string;
  photo2Str: string;
  photo3Str: string;

  imageUpload1() {
    this.photo1Str = "";

    if (!this.data.ID) {
      if (this.fileURL1) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL1.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL1, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo1Str = url;

      } else {
        this.photo1Str = "";
      }

    } else {
      if (this.fileURL1) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL1.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;
        this.api.onUpload2(this.folderName, this.fileURL1, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo1Str = url;

      } else {
        if (this.data.PHOTO_URL_1) {
          let photoURL = this.data.PHOTO_URL_1.split("/");
          this.photo1Str = photoURL[photoURL.length - 1];

        } else
          this.photo1Str = "";
      }
    }
  }

  onFileSelected1(event: any) {
    if ((event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') && event.target.files[0].name.split('.').pop() != 'jfif') {
      this.fileURL1 = <File>event.target.files[0];
      this.data.PHOTO_URL_1 = null;
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
      this.fileURL1 = null;
    }
  }

  onFileSelected2(event: any) {
    if ((event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') && event.target.files[0].name.split('.').pop() != 'jfif') {
      this.fileURL2 = <File>event.target.files[0];
      this.data.PHOTO_URL_2 = null;
      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)
      this.compressImage.compress(event.target.files[0]).pipe(take(1))
        .subscribe(compressedImage => {
          console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
          // now you can do upload the compressed image     
          this.fileURL2 = compressedImage;
        })
      console.log("URLLLLL == ", this.fileURL2);

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL2 = null;
    }
  }

  onFileSelected3(event: any) {
    if ((event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') && event.target.files[0].name.split('.').pop() != 'jfif') {
      this.fileURL3 = <File>event.target.files[0];
      this.data.PHOTO_URL_3 = null;

      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)
      this.compressImage.compress(event.target.files[0]).pipe(take(1))
        .subscribe(compressedImage => {
          console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
          // now you can do upload the compressed image     
          this.fileURL3 = compressedImage;
        })
      console.log("URLLLLL == ", this.fileURL3);

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL3 = null;
    }
  }

  onClick() {

  }

  getwidth() {
    if (window.innerWidth < 500) {
      return 350;

    } else {
      return 800;
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
    this.Fordate();
    this.current_year();
    this.data.CREATED_DATE = new Date();
    this.data.MEMBER_ID = parseInt(this._cookie.get('userId'));
    this.data.GROUP_ID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
  }

  VicePresident = false;

  clear1() {
    this.fileURL1 = null;
    this.data.PHOTO_URL_1 = '';
  }

  clear2() {
    this.fileURL2 = null;
    this.data.PHOTO_URL_2 = '';
  }

  clear3() {
    this.fileURL3 = null;
    this.data.PHOTO_URL_3 = '';
  }

  imageUpload2() {
    this.photo2Str = "";

    if (!this.data.ID) {
      if (this.fileURL2) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL2.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL2, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo2Str = url;

      } else {
        this.photo2Str = "";
      }

    } else {
      if (this.fileURL2) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL2.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL2, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo2Str = url;

      } else {
        if (this.data.PHOTO_URL_2) {
          let photoURL = this.data.PHOTO_URL_2.split("/");
          this.photo2Str = photoURL[photoURL.length - 1];

        } else
          this.photo2Str = "";
      }
    }
  }

  imageUpload3() {
    this.photo3Str = "";

    if (!this.data.ID) {
      if (this.fileURL3) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL3.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL3, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo3Str = url;

      } else {
        this.photo3Str = "";
      }

    } else {
      if (this.fileURL3) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL3.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL3, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo3Str = url;

      } else {
        if (this.data.PHOTO_URL_3) {
          let photoURL = this.data.PHOTO_URL_3.split("/");
          this.photo3Str = photoURL[photoURL.length - 1];

        } else
          this.photo3Str = "";
      }
    }
  }

  close(myForm: NgForm): void {
    this.fileURL3 = null;
    this.data.PHOTO_URL_3 = '';
    this.fileURL2 = null;
    this.data.PHOTO_URL_2 = '';
    this.fileURL1 = null;
    this.data.PHOTO_URL_1 = '';
    this.drawerClose();
    // this.reset(myForm);
    this.validation = true;
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  ApplySubmit(myForm) {
    this.data.IS_SUBMITED = 'S';
    this.submit(false, myForm);
  }

  submit(addnew: boolean, myForm: NgForm) {
    this.validation = false;
    this.data.MEMBER_ID = parseInt(this._cookie.get('userId'));
    this.data.GROUP_ID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
    this.data.CREATED_DATE = this.datePipe.transform(this.data.CREATED_DATE, "yyyy-MM-dd");
    if (this.data.DISCHARGED_DETAILS == undefined) { this.data.DISCHARGED_DETAILS = ' '; }
    if (this.data.ACTIVITY_DETAILS == undefined) { this.data.ACTIVITY_DETAILS = ' '; }
    if (this.data.INOVATIVATIVE_PROJECT_DETAILS == undefined) { this.data.INOVATIVATIVE_PROJECT_DETAILS = ' '; }
    if (this.data.MEMBERSHIP_GROUP_GROWTH_DETAILS == undefined) { this.data.MEMBERSHIP_GROUP_GROWTH_DETAILS = ' '; }
    if (this.data.DISCHARGED_DETAILS.trim() == '' && this.data.SWICTHING == true) { this.message.error("As Vice President Internal / External", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.CONTRIBUTION_DETAILS.trim() == '') { this.message.error("Contribution to various committees", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.FISCLE.trim() == '') { this.message.error("Fiscal Discipline", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.ACTIVITY_DETAILS.trim() == '' && this.data.SWICTHING1 == true) { this.message.error("Activity Assisted President", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.INOVATIVATIVE_PROJECT_DETAILS.trim() == '' && this.data.SWICTHING2 == true) { this.message.error("Innovative Projects", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.TOTAL_GROUP_MEETINGS == '') { this.message.error("Group Meeting", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.OUT_OF_MEETINGS == '') { this.message.error("Group Meeting Out Of", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.TOTAL_BOARD_MEETINGS == '') { this.message.error("Board Meeting", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.BOARD_OUT_OF_MEETINGS == '') { this.message.error("Board Meeting Out Of", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.UNIT_COUNCILS_TOTAL == '') { this.message.error("Unit Council Meetings", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.UNIT_COUNCILS_OUT_OF == '') { this.message.error("Unit Council Meetings Out Of", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.UNIT_CONFERENCES_TOTAL == '') { this.message.error("Unit Conferences", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.UNIT_CONFERENCES_OUT_OF == '') { this.message.error("Unit Conferences Out Of", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.BRANCH_PROGRAM_COUNT == '') { this.message.error("Branch Programmes", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.MORE_DETAILS.trim() == '') { this.message.error("Other Relevant Information", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else if (this.data.MEMBERSHIP_GROUP_GROWTH_DETAILS.trim() == '' && this.data.SWICTHING3 == true) { this.message.error("Membership Retention Growth & Group Extension", "Please fill the field"); this.data.IS_SUBMITED = 'D'; }
    else {
      if (this.data.IS_SUBMITED == null) {
        this.data.IS_SUBMITED = 'D';
      };
      this.isSpinning = true;

      if (this.data.SWICTHING != true) { this.data.DISCHARGED_DETAILS = ' ' }
      if (this.data.SWICTHING1 != true) { this.data.ACTIVITY_DETAILS = ' ' }
      if (this.data.SWICTHING2 != true) { this.data.INOVATIVATIVE_PROJECT_DETAILS = ' ' }
      if (this.data.SWICTHING3 != true) { this.data.MEMBERSHIP_GROUP_GROWTH_DETAILS = ' ' }
      if (this.data.ID) {

        this.imageUpload1();
        this.data.PHOTO_URL_1 = (this.photo1Str == "") ? " " : this.photo1Str;

        this.imageUpload2();
        this.data.PHOTO_URL_2 = (this.photo2Str == "") ? " " : this.photo2Str;

        this.imageUpload3();
        this.data.PHOTO_URL_3 = (this.photo3Str == "") ? " " : this.photo3Str;

        this.api.updatVicePresident(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Vice President Updated Successfully", "");
            this.isSpinning = false;
            this.validation = true;

            if (!addnew)
              this.close(myForm);

          } else {
            this.message.error("Vice President  Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.imageUpload1();
        this.data.PHOTO_URL_1 = (this.photo1Str == "") ? " " : this.photo1Str;

        this.imageUpload2();
        this.data.PHOTO_URL_2 = (this.photo2Str == "") ? " " : this.photo2Str;

        this.imageUpload3();
        this.data.PHOTO_URL_3 = (this.photo3Str == "") ? " " : this.photo3Str;

        this.api.VicePresidentCrete(this.data).subscribe(data => {

          if (data["code"] == 200) {
            this.message.success("Vice President Created Successfully", "");
            this.isSpinning = false;
            this.validation = true;

            if (!addnew)
              this.close(myForm);

            else {
              this.data = new VicePresident();
            }

          } else {
            this.message.error("Vice President Creation Failed", "");
            this.isSpinning = false;
          }
        })
      }
    }
  }

  totalRecords = 1;
  OldFetchedData = [];

  FetchOldData() {
    const memberID = parseInt(this._cookie.get('userId'));
    const groupID = Number(this._cookie.get("GROUP_ID"));

    this.api.getAllVicePresidentDetails(memberID, groupID, this.SelectedYear).subscribe(data => {
      if (data['code'] == '200') {
        this.totalRecords = data['count'];
        this.OldFetchedData = data['data'];
      }
      this.data.TOTAL_GROUP_MEETINGS = this.OldFetchedData[0]['TOTAL_GROUP_MEETINGS'];
      this.data.OUT_OF_MEETINGS = this.OldFetchedData[0]['OUT_OF_MEETINGS'];

      this.data.TOTAL_BOARD_MEETINGS = this.OldFetchedData[0]['TOTAL_BOARD_MEETINGS'];
      this.data.BOARD_OUT_OF_MEETINGS = this.OldFetchedData[0]['BOARD_OUT_OF_MEETINGS'];

      this.message.success("Old Data Fetch Successfully", "");
    }, err => {
      if (err['ok'] == false) this.message.error("Server Not Found", "");
    });
  }

  handleChange(info: UploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }

    if (info.file.status === 'done') {
      this.msg.success(`${info.file.name} file uploaded successfully`);

    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
  }

  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  cancel() { }
}