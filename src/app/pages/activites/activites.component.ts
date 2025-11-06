import { Component, Input, Output, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { getISOWeek } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/Service/api.service';
import { Activities } from 'src/app/Models/activities';
import { ActivityProjectDetails } from 'src/app/Models/activity-project-details';
import { DatePipe } from '@angular/common';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import setHours from 'date-fns/set_hours';
import { take } from 'rxjs/operators';
import { CompressImageService } from 'src/app/Service/image-compressor.service';

@Component({
  selector: 'app-activites',
  templateUrl: './activites.component.html',
  styleUrls: ['./activites.component.css']
})

export class ActivitesComponent implements OnInit {
  @Input() data: Activities = new Activities();
  @Input() isRemarkVisible: boolean;
  @Input() drawerClose!: Function;
  @Input() drawerVisible: boolean = false;
  @Input() drawerActivityDetails: any[] = [];
  ACTIVITY_PROJECT_DETAILS: ActivityProjectDetails = new ActivityProjectDetails()
  drawerTitleVisible: boolean = false;
  mobpattern = '/^[0-9]\d{9}$/';
  PhotoUrl = this.api.retriveimgUrl + "activitiesInformation";
  isSpinning = false;
  currentIndex: number;
  validation = true;
  Swicthing: boolean = true;
  Swicthing2: boolean = true;
  federationID = this._cookie.get("HOME_FEDERATION_ID");
  unitID = this._cookie.get("UNIT_ID");
  groupID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
  user_id = this._cookie.get('roleId');
  GROUP: [];
  demoValue = 10;
  drawerTitleData: ActivityProjectDetails = new ActivityProjectDetails();
  Branch: [];
  ICON = [

  ];

  date = null;
  isEnglish = false;

  constructor(private compressImage: CompressImageService, private datePipe: DatePipe, private message: NzNotificationService, private i18n: NzI18nService, private api: ApiService, private _cookie: CookieService) { }

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

  administrationData: Activities = new Activities();

  SelectYear(YEARs: any) {
    this.SelectedYear = YEARs;
    this.filter = '';
    this.data = new Activities();
    this.drawerActivityDetails = [];
    this.data.IS_GROUP_AWARDED = false;
    this.data.GROUP_ID = Number(sessionStorage.getItem("HOME_GROUP_ID"));

    this.api.getActivitics(0, 0, "", "asc", "AND GROUP_ID=" + this.data.GROUP_ID, this.SelectedYear).subscribe(data1 => {
      if (data1['count'] > 0 && data1['code'] == 200) {
        this.data = data1['data'][0];
        this.data.CREATED_DATE = new Date();

        if (data1['data'][0]['AWARD_DETAILS'] == null || data1['data'][0]['AWARD_DETAILS'] == ' ') {
          this.data.IS_GROUP_AWARDED = false;

        } else {
          this.data.IS_GROUP_AWARDED = true;
        }

        this.api.getActiviticDetails(0, 0, "", "asc", "AND OUTSTANDING_ACTIVITY_ID=" + this.data.ID).subscribe(data => {
          if (data['count'] > 0 && data['code'] == 200) {
            this.drawerActivityDetails = data['data'];
          }

        }, err => {

        });

      } else { }

    }, err => {

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

  close(myForm: NgForm): void {
    this.validation = true;
    this.fileURL1 = null;
    this.data.PHOTO_URL1 = '';
    this.fileURL2 = null;
    this.data.PHOTO_URL2 = '';
    this.fileURL3 = null;
    this.data.PHOTO_URL3 = '';
    this.fileURL4 = null;
    this.data.PHOTO_URL4 = '';
    this.fileURL5 = null;
    this.data.PHOTO_URL5 = '';
    this.fileURL6 = null;
    this.data.PHOTO_URL6 = '';
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  getwidth() {
    if (window.innerWidth < 500) {
      return 350;

    } else {
      return 700;
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
  }

  visible_activity = false;

  editdata(data1: ActivityProjectDetails, index: number): void {
    this.currentIndex = index
    console.log("this.currentIndex", this.currentIndex);
    this.drawerTitle = "Update Title Details";
    this.drawerTitleData = Object.assign({}, data1);
    this.drawerTitleData.OUTSTANDING_ACTIVITY_ID = this.data.ID;
    this.ActivityProject = true;
  }

  drawerTitle3: string = ' Details Of Projects'
  ActivityProject: boolean = false;
  isRemarkVisible3: boolean;
  drawerData3: ActivityProjectDetails = new ActivityProjectDetails();

  AddActivityDetils() {
    this.drawerTitleData = new ActivityProjectDetails();
    this.currentIndex = -1;
    this.ActivityProject = true;
    this.isRemarkVisible3 = false;
  }

  drawerTitle: string;

  activity_details(): void {
    if (this.currentIndex > -1) {
      this.drawerActivityDetails[this.currentIndex] = this.drawerTitleData;
      this.drawerActivityDetails = [...[], ...this.drawerActivityDetails];
    }

    else {
      this.drawerActivityDetails = [...this.drawerActivityDetails, ...[this.drawerTitleData]];
    }

    this.currentIndex = -1;
    this.message.success("Activities Detilas Added in list", "");
    this.ActivityProject = false;
  }

  get submita() {
    return this.activity_details.bind(this);
  }

  clear1() {
    this.fileURL1 = null;
    this.data.PHOTO_URL1 = '';
  }

  clear2() {
    this.fileURL2 = null;
    this.data.PHOTO_URL2 = '';
  }

  clear3() {
    this.fileURL3 = null;
    this.data.PHOTO_URL3 = '';
  }

  clear4() {
    this.fileURL4 = null;
    this.data.PHOTO_URL4 = '';
  }

  clear5() {
    this.fileURL5 = null;
    this.data.PHOTO_URL5 = '';
  }

  clear6() {
    this.fileURL6 = null;
    this.data.PHOTO_URL6 = '';
  }

  ApplySubmit(myForm: NgForm) {
    this.data.IS_SUBMITED = 'S';
    this.submit(false, myForm);
  }


  submit(addnew: boolean, myForm: NgForm) {
    this.validation = false;
    this.data.MEMBER_ID = parseInt(this._cookie.get('userId'));
    this.data.GROUP_ID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
    this.data.PROJECT_COUNT = this.drawerActivityDetails.length;
    this.data.ACTIVITY_PROJECT_DETAILS = this.drawerActivityDetails;
    let length = Number(this.data.ACTIVITY_PROJECT_DETAILS.length);
    this.data.CREATED_DATE = this.datePipe.transform(this.data.CREATED_DATE, "yyyy-MM-dd");

    if (this.data.AWARD_DETAILS == undefined) { this.data.AWARD_DETAILS = ' '; }

    this.data.DATE_OF_REPORT_TO_BRANCH = this.datePipe.transform(this.data.DATE_OF_REPORT_TO_BRANCH, "yyyy-MM-dd");
    this.data.DATE_OF_REPORT_TO_FEDERATION = this.datePipe.transform(this.data.DATE_OF_REPORT_TO_FEDERATION, "yyyy-MM-dd");

    if (this.data.DATE_OF_REPORT_TO_BRANCH == '' || this.data.DATE_OF_REPORT_TO_BRANCH == undefined) {
      this.message.error("Date Of Branch", "Please fill the field");
      this.data.IS_SUBMITED = 'D';
    }

    else if (this.data.DATE_OF_REPORT_TO_FEDERATION == '' || this.data.DATE_OF_REPORT_TO_FEDERATION == undefined) {
      this.message.error("Date Of Foundation", "Please fill the field");
      this.data.IS_SUBMITED = 'D';
    }

    else if (this.data.IS_GROUP_AWARDED == true && (this.data.AWARD_DETAILS.trim() == '' || this.data.AWARD_DETAILS == undefined)) {
      this.message.error("Award Details", "Please fill the field");
      this.data.IS_SUBMITED = 'D';
    }

    else {
      if (this.data.OTHER_DETAILS.trim() == '' || this.data.OTHER_DETAILS == undefined) {
        this.data.OTHER_DETAILS = ' ';
      }
      if (this.data.IS_SUBMITED == null) {
        this.data.IS_SUBMITED = 'D';
      };
      this.isSpinning = true;
      if (this.data.IS_GROUP_AWARDED == false) { this.data.AWARD_DETAILS = ' '; }
      if (this.data.PHOTO_DETAILS1 == '') { this.data.PHOTO_DETAILS1 = ' '; }
      if (this.data.PHOTO_DETAILS2 == '') { this.data.PHOTO_DETAILS2 = ' '; }
      if (this.data.PHOTO_DETAILS3 == '') { this.data.PHOTO_DETAILS3 = ' '; }
      if (this.data.PHOTO_DETAILS4 == '') { this.data.PHOTO_DETAILS4 = ' '; }
      if (this.data.PHOTO_DETAILS5 == '') { this.data.PHOTO_DETAILS5 = ' '; }
      if (this.data.PHOTO_DETAILS6 == '') { this.data.PHOTO_DETAILS6 = ' '; }

      for (let i = 0; i < length; i++) {
        this.pdfUpload1(i);
        this.data.ACTIVITY_PROJECT_DETAILS[i]['SPONSER_CERTIFICATE'] = (this.pdf1Str == "") ? " " : this.pdf1Str;
      }

      if (this.data.ID) {
        this.imageUpload1();
        this.data.PHOTO_URL1 = (this.photo1Str == "") ? " " : this.photo1Str;
        this.imageUpload2();
        this.data.PHOTO_URL2 = (this.photo2Str == "") ? " " : this.photo2Str;
        this.imageUpload3();
        this.data.PHOTO_URL3 = (this.photo3Str == "") ? " " : this.photo3Str;
        this.imageUpload4();
        this.data.PHOTO_URL4 = (this.photo4Str == "") ? " " : this.photo4Str;
        this.imageUpload5()
        this.data.PHOTO_URL5 = (this.photo5Str == "") ? " " : this.photo5Str;
        this.imageUpload6();
        this.data.PHOTO_URL6 = (this.photo6Str == "") ? " " : this.photo6Str;
        this.api.updatActivites(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Activities Of The Year Updated Successfully", "");
            this.isSpinning = false;
            this.validation = true;

            if (!addnew)
              this.close(myForm);

          } else {
            this.message.error("Activities Of The Year Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.imageUpload1();
        this.data.PHOTO_URL1 = (this.photo1Str == "") ? " " : this.photo1Str;
        this.imageUpload2();
        this.data.PHOTO_URL2 = (this.photo2Str == "") ? " " : this.photo2Str;
        this.imageUpload3();
        this.data.PHOTO_URL3 = (this.photo3Str == "") ? " " : this.photo3Str;
        this.imageUpload4();
        this.data.PHOTO_URL4 = (this.photo4Str == "") ? " " : this.photo4Str;
        this.imageUpload5()
        this.data.PHOTO_URL5 = (this.photo5Str == "") ? " " : this.photo5Str;
        this.imageUpload6();
        this.data.PHOTO_URL6 = (this.photo6Str == "") ? " " : this.photo6Str;
        this.api.createActivites(this.data).subscribe(data => {
          if (data["code"] == 200) {
            this.message.success("Activities Of The Year Created Successfully", "");
            this.isSpinning = false;
            this.validation = true;

            if (!addnew)
              this.close(myForm);

            else {
              this.data = new Activities();
            }

          } else {
            this.message.error("Activities Of The Year Creation Failed", "");
            this.isSpinning = false;
          }
        })
      }
    }
  }

  folderName = "outstandingActivitiesInformation";
  photo1Str: string;
  photo2Str: string;
  photo3Str: string;
  photo4Str: string;
  photo5Str: string;
  photo6Str: string;
  fileURL1?: any;
  fileURL2?: any;
  fileURL3?: any;
  fileURL4?: any;
  fileURL5?: any;
  fileURL6?: any;

  imageUpload1() {
    this.photo1Str = "";

    if (!this.data.ID) {
      if (this.fileURL1) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL1.name.split('.').pop();
        var url = "NE" + number + "." + fileExt;

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
        var url = "NE" + number + "." + fileExt;
        this.api.onUpload2(this.folderName, this.fileURL1, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo1Str = url;

      } else {
        if (this.data.PHOTO_URL1) {
          let photoURL = this.data.PHOTO_URL1.split("/");
          this.photo1Str = photoURL[photoURL.length - 1];

        } else
          this.photo1Str = "";
      }
    }
  }
  onFileSelected1(event: any) {
    console.log(event.target.files[0].name.split('.').pop());

    if ((event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') && event.target.files[0].name.split('.').pop() != 'jfif') {
      this.fileURL1 = <File>event.target.files[0];
      this.data.PHOTO_URL1 = null;

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

  imageUpload2() {
    this.photo2Str = "";

    if (!this.data.ID) {
      if (this.fileURL2) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL2.name.split('.').pop();
        var url = "NE" + number + "." + fileExt;

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
        var url = "NE" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL2, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo2Str = url;

      } else {
        if (this.data.PHOTO_URL2) {
          let photoURL = this.data.PHOTO_URL2.split("/");
          this.photo2Str = photoURL[photoURL.length - 1];

        } else
          this.photo2Str = "";
      }
    }
  }

  onFileSelected2(event: any) {
    if ((event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') && event.target.files[0].name.split('.').pop() != 'jfif') {
      this.fileURL2 = <File>event.target.files[0];
      this.data.PHOTO_URL2 = null;
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

  imageUpload3() {
    this.photo3Str = "";

    if (!this.data.ID) {
      if (this.fileURL3) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL3.name.split('.').pop();
        var url = "NE" + number + "." + fileExt;

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
        var url = "NE" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL3, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo3Str = url;

      } else {
        if (this.data.PHOTO_URL3) {
          let photoURL = this.data.PHOTO_URL3.split("/");
          this.photo3Str = photoURL[photoURL.length - 1];

        } else
          this.photo3Str = "";
      }
    }
  }
  onFileSelected3(event: any) {
    if ((event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') && event.target.files[0].name.split('.').pop() != 'jfif') {
      this.fileURL3 = <File>event.target.files[0];
      this.data.PHOTO_URL3 = null;

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

  imageUpload4() {
    this.photo4Str = "";

    if (!this.data.ID) {
      if (this.fileURL4) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL4.name.split('.').pop();
        var url = "NE" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL4, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo4Str = url;

      } else {
        this.photo4Str = "";
      }

    } else {
      if (this.fileURL4) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL4.name.split('.').pop();
        var url = "NE" + number + "." + fileExt;
        this.api.onUpload2(this.folderName, this.fileURL4, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo4Str = url;

      } else {
        if (this.data.PHOTO_URL4) {
          let photoURL = this.data.PHOTO_URL4.split("/");
          this.photo4Str = photoURL[photoURL.length - 1];

        } else
          this.photo4Str = "";
      }
    }
  }

  onFileSelected4(event: any) {
    if ((event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') && event.target.files[0].name.split('.').pop() != 'jfif') {
      this.fileURL4 = <File>event.target.files[0];
      this.data.PHOTO_URL4 = null;
      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)
      this.compressImage.compress(event.target.files[0]).pipe(take(1))
        .subscribe(compressedImage => {
          console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
          // now you can do upload the compressed image         
          this.fileURL4 = compressedImage;
        })
      console.log("URLLLLL == ", this.fileURL4);

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL4 = null;
    }
  }

  imageUpload5() {
    this.photo5Str = "";

    if (!this.data.ID) {
      if (this.fileURL5) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL5.name.split('.').pop();
        var url = "NE" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL5, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo5Str = url;

      } else {
        this.photo5Str = "";
      }

    } else {
      if (this.fileURL5) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL5.name.split('.').pop();
        var url = "NE" + number + "." + fileExt;
        this.api.onUpload2(this.folderName, this.fileURL5, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo5Str = url;

      } else {
        if (this.data.PHOTO_URL5) {
          let photoURL = this.data.PHOTO_URL5.split("/");
          this.photo5Str = photoURL[photoURL.length - 1];

        } else
          this.photo5Str = "";
      }
    }
  }

  onFileSelected5(event: any) {
    if ((event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') && event.target.files[0].name.split('.').pop() != 'jfif') {
      this.fileURL5 = <File>event.target.files[0];
      this.data.PHOTO_URL5 = null;
      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)
      this.compressImage.compress(event.target.files[0]).pipe(take(1))
        .subscribe(compressedImage => {
          console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
          // now you can do upload the compressed image         
          this.fileURL5 = compressedImage;
        })
      console.log("URLLLLL == ", this.fileURL5);

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL5 = null;
    }
  }

  imageUpload6() {
    this.photo6Str = "";

    if (!this.data.ID) {
      if (this.fileURL6) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL6.name.split('.').pop();
        var url = "NE" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL6, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo6Str = url;

      } else {
        this.photo6Str = "";
      }

    } else {
      if (this.fileURL6) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL6.name.split('.').pop();
        var url = "NE" + number + "." + fileExt;
        this.api.onUpload2(this.folderName, this.fileURL6, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo6Str = url;

      } else {
        if (this.data.PHOTO_URL6) {
          let photoURL = this.data.PHOTO_URL6.split("/");
          this.photo6Str = photoURL[photoURL.length - 1];

        } else
          this.photo6Str = "";
      }
    }
  }
  onFileSelected6(event: any) {
    if ((event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') && event.target.files[0].name.split('.').pop() != 'jfif') {
      this.fileURL6 = <File>event.target.files[0];
      this.data.PHOTO_URL6 = null;

      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)
      this.compressImage.compress(event.target.files[0]).pipe(take(1))
        .subscribe(compressedImage => {
          console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
          // now you can do upload the compressed image         
          this.fileURL6 = compressedImage;
        })
      console.log("URLLLLL == ", this.fileURL6);

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL6 = null;
    }
  }
  cancel() { }

  drawerClose1(): void {

    this.ActivityProject = false;
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
  pdfFileURL1: any;
  pdf1Str: string;
  pdfUpload1(i: number) {
    this.pdf1Str = "";
    this.pdfFileURL1 = this.data.ACTIVITY_PROJECT_DETAILS[i]['SPONSER_CERTIFICATE'];
    if (typeof (this.pdfFileURL1) != 'string') {
      if (!this.data.ID) {

        if (this.pdfFileURL1) {
          var number = Math.floor(100000 + Math.random() * 900000);
          console.log(typeof (this.pdfFileURL1));

          var fileExt = this.pdfFileURL1.name.split('.').pop();
          var url = "GA" + number + "." + fileExt;

          this.api.onUpload2(this.folderName, this.pdfFileURL1, url).subscribe(res => {
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
        if (this.pdfFileURL1) {
          var number = Math.floor(100000 + Math.random() * 900000);
          console.log(typeof (this.pdfFileURL1));

          var fileExt = this.pdfFileURL1.name.split('.').pop();
          var url = "GA" + number + "." + fileExt;

          this.api.onUpload2(this.folderName, this.pdfFileURL1, url).subscribe(res => {
            if (res["code"] == 200) {
              console.log("Uploaded");

            } else {
              console.log("Not Uploaded");
            }
          });

          this.pdf1Str = url;

        } else {
          if (this.data.ACTIVITY_PROJECT_DETAILS[i]['SPONSER_CERTIFICATE']) {
            let pdfURL = this.data.ACTIVITY_PROJECT_DETAILS[i]['SPONSER_CERTIFICATE'].split("/");
            this.pdf1Str = pdfURL[pdfURL.length - 1];

          } else
            this.pdf1Str = "";
        }
      }
    } else {
      this.pdf1Str = this.data.ACTIVITY_PROJECT_DETAILS[i]['SPONSER_CERTIFICATE'];
    }
  }
}
