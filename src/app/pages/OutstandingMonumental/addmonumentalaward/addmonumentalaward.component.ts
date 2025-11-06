import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { OutstandingMonumental } from 'src/app/Models/OutstandingMonumental';
import { ApiService } from 'src/app/Service/api.service';
import { MonumentalSponsorship } from 'src/app/Models/MonumentalSponsorship';
import { GaintsBannerPhotos } from 'src/app/Models/GaintsBannerPhotos';
import { MonumentalPressClipping } from 'src/app/Models/MonumentalPressClipping';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

@Component({
  selector: 'app-addmonumentalaward',
  templateUrl: './addmonumentalaward.component.html',
  styleUrls: ['./addmonumentalaward.component.css']
})

export class AddmonumentalawardComponent implements OnInit {
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  federationID = this._cookie.get("FEDERATION_ID");
  unitID = this._cookie.get("UNIT_ID");
  groupID = this._cookie.get("GROUP_ID");
  roleID: number = this.api.roleId;
  @Input() drawerClose: Function;
  @Input() data: OutstandingMonumental;
  @Input() drawerVisible: boolean;
  drawerGaintsBannerTitle: string;
  drawerGaintsBannerVisible: boolean;
  drawerGaintsBannerData: GaintsBannerPhotos = new GaintsBannerPhotos();
  @Input() gaintsBannerArray: GaintsBannerPhotos[] = [];
  drawerPressClippingTitle: string;
  drawerPressClippingVisible: boolean;
  drawerPressClippingData: MonumentalPressClipping = new MonumentalPressClipping();
  @Input() pressClippingArray: MonumentalPressClipping[] = [];
  formTitle: string = "Add Monomemtal Project Details";
  numberpattern = /^[6-9]\d{9}$/;
  isSpinning: boolean = false;
  isOk = true;
  switchValue = false;
  isVisible = false;
  currentIndex: number = -1;
  public Swicthing: boolean = true;
  validation = true;
  drawerMonumentalSponsTitle: string;
  drawerMonumentalSponsVisible: boolean;
  drawerMonumentalSponsData: MonumentalSponsorship = new MonumentalSponsorship();
  @Input() MonumentalSponsArray: MonumentalSponsorship[] = [];
  sponsURL1: any;
  pressClipURL1: any;
  pressClipURL2: any;
  pressClipURL3: any;
  gaintsBannerURL1: any;
  gaintsBannerURL2: any;
  gaintsBannerURL3: any;

  constructor(public api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  monthSeq: number;

  ngOnInit() {
    this.year = new Date().getFullYear();
    this.SelectedYear = this.year
    this.currentYear = this.SelectedYear;
    this.LoadYears();
    this.Fordate();
    this.Swicthing = true;
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
    this.validation = false;
    this.isSpinning = false;
    this.isOk = true;
    this.data.GROUP_ID = parseInt(this.groupID);
    this.data.MONUMENTAL_PROJECT_SPONSORSHIP = this.MonumentalSponsArray;
    this.data.MONUMENTAL_BANNER_PHOTOS = this.gaintsBannerArray;
    this.data.MONUMENTAL_PRESS_CLIPPING = this.pressClippingArray;
    // this.data.DATE_OF_BIDING = new Date();

    if ((this.data.MONUMENT_PROJECT_NAME == undefined || this.data.MONUMENT_PROJECT_NAME.toString() == '' || this.data.MONUMENT_PROJECT_NAME == null || this.data.MONUMENT_PROJECT_NAME.trim() == '')
      && (this.data.DATE_OF_LAUNCHING == undefined || this.data.DATE_OF_LAUNCHING == '' || this.data.DATE_OF_LAUNCHING == null)
      && (this.data.DATE_OF_COMPLETION == undefined || this.data.DATE_OF_COMPLETION == '' || this.data.DATE_OF_COMPLETION == null)
      && (this.data.TOTAL_EXPENCES_IN_PROJECT == undefined || this.data.TOTAL_EXPENCES_IN_PROJECT.toString() == '' || this.data.TOTAL_EXPENCES_IN_PROJECT == null)
      && (this.data.TOTAL_BUDGET_IN_PROJECT == undefined || this.data.TOTAL_BUDGET_IN_PROJECT.toString() == '' || this.data.TOTAL_BUDGET_IN_PROJECT == null)
      && (this.data.BENEFITS_OF_PROJECT == undefined || this.data.BENEFITS_OF_PROJECT.toString() == '' || this.data.BENEFITS_OF_PROJECT == null || this.data.BENEFITS_OF_PROJECT.trim() == '')
      && (this.data.BENEFITS_TO_PUBLIC == undefined || this.data.BENEFITS_TO_PUBLIC.toString() == '' || this.data.BENEFITS_TO_PUBLIC == null || this.data.BENEFITS_TO_PUBLIC.trim() == '')
      && (this.data.AIMS_AND_OBJECTS == undefined || this.data.AIMS_AND_OBJECTS.toString() == '' || this.data.AIMS_AND_OBJECTS == null || this.data.AIMS_AND_OBJECTS.trim() == '')
      && (this.data.LOCAL_BODIES_APPROVED == undefined || this.data.LOCAL_BODIES_APPROVED.toString() == '' || this.data.LOCAL_BODIES_APPROVED == null || this.data.LOCAL_BODIES_APPROVED.trim() == '')
      && (this.data.OTHER_DETAILS == undefined || this.data.OTHER_DETAILS.toString() == '' || this.data.OTHER_DETAILS == null || this.data.OTHER_DETAILS.trim() == '')
      && (this.data.NATIONAL_PROGRAMME.trim() == '' && this.Swicthing == true)) {
      this.isOk = false;
      this.data.IS_SUBMITED = 'D';
      this.message.error('Please enter all the mandatory field', '');

    } else {
      if (this.data.MONUMENT_PROJECT_NAME == undefined || this.data.MONUMENT_PROJECT_NAME.toString() == '' || this.data.MONUMENT_PROJECT_NAME == null || this.data.MONUMENT_PROJECT_NAME.trim() == '') {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Monumental Project Name', '');

      } else if (this.data.DATE_OF_LAUNCHING == undefined || this.data.DATE_OF_LAUNCHING == '' || this.data.DATE_OF_LAUNCHING == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Launching Date', '');

      } else if (this.data.DATE_OF_COMPLETION == undefined || this.data.DATE_OF_COMPLETION == '' || this.data.DATE_OF_COMPLETION == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Completion Date', '');

      } else if (this.data.TOTAL_EXPENCES_IN_PROJECT == undefined || this.data.TOTAL_EXPENCES_IN_PROJECT.toString() == '' || this.data.TOTAL_EXPENCES_IN_PROJECT == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Total Expenes ', '');

      } else if ((this.numbers.test(this.data.TOTAL_EXPENCES_IN_PROJECT.toString())) == false) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Total Expenes in Number Only', '');

      } else if (this.data.TOTAL_BUDGET_IN_PROJECT == undefined || this.data.TOTAL_BUDGET_IN_PROJECT.toString() == '' || this.data.TOTAL_BUDGET_IN_PROJECT == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Total Budget ', '');

      } else if ((this.numbers.test(this.data.TOTAL_BUDGET_IN_PROJECT.toString())) == false) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Total Budget in Number Only', '');

      } else if (this.data.BENEFITS_OF_PROJECT == undefined || this.data.BENEFITS_OF_PROJECT.toString() == '' || this.data.BENEFITS_OF_PROJECT == null || this.data.BENEFITS_OF_PROJECT.trim() == '') {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Benefits of Project', '');

      } else if (this.data.BENEFITS_TO_PUBLIC == undefined || this.data.BENEFITS_TO_PUBLIC.toString() == '' || this.data.BENEFITS_TO_PUBLIC == null || this.data.BENEFITS_TO_PUBLIC.trim() == '') {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Benefits of Project to Public', '');

      } else if (this.data.AIMS_AND_OBJECTS == undefined || this.data.AIMS_AND_OBJECTS.toString() == '' || this.data.AIMS_AND_OBJECTS == null || this.data.AIMS_AND_OBJECTS.trim() == '') {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Aims & Objects', '');

      } else if (this.data.LOCAL_BODIES_APPROVED == undefined || this.data.LOCAL_BODIES_APPROVED.toString() == '' || this.data.LOCAL_BODIES_APPROVED == null || this.data.LOCAL_BODIES_APPROVED.trim() == '') {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Local bodies Approved details', '');

      } else if (this.data.OTHER_DETAILS == undefined || this.data.OTHER_DETAILS.toString() == '' || this.data.OTHER_DETAILS == null || this.data.OTHER_DETAILS.trim() == '') {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error('Please Enter the Other Details', '');

      } else if (this.data.NATIONAL_PROGRAMME.trim() == '' && this.Swicthing == true) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error("Please Enter the National Programme Details", '');
      }
    }

    if (this.Swicthing != true) { this.data.NATIONAL_PROGRAMME = ' ' }

    if (this.isOk) {
      this.isSpinning = true;
      this.data.DATE_OF_LAUNCHING = this.datePipe.transform(this.data.DATE_OF_LAUNCHING, "yyyy-MM-dd");
      this.data.DATE_OF_COMPLETION = this.datePipe.transform(this.data.DATE_OF_COMPLETION, "yyyy-MM-dd");

      if (this.data.ID) {
        this.api.updateOutstandingMonumental(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Outstanding Monumental Award Updated Successfully", "");
            this.isSpinning = false;
            this.validation = true;

            if (!addNew)
              this.close(myForm);

          } else {
            this.message.error("Outstanding Monumental Award Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.api.createOutstandingMonumental(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Outstanding Monumental Award Created Successfully", "");
            this.isSpinning = false;
            this.validation = true;

            if (!addNew)
              this.close(myForm);

            else {
              this.data = new OutstandingMonumental();
            }

          } else {
            this.message.error("Outstanding Monumental Award Creation Failed", "");
            this.isSpinning = false;
          }
        });
      }
    }
  }

  close(myForm: NgForm): void {
    this.gaintsBannerArray = null;
    this.pressClippingArray = null;
    this.MonumentalSponsArray = null;
    this.drawerClose();
    this.validation = true;
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  getWidth() {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 650;
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  drawerMonumentalSponsClose(): void {
    this.drawerMonumentalSponsVisible = false;
  }

  get closeMonumentalSponsCallback() {
    return this.drawerMonumentalSponsClose.bind(this);
  }

  get monumentalSponsTableCallback() {
    return this.MonumentalSponsTable.bind(this);
  }

  MonumentalSponsTable(): void {
    this.drawerMonumentalSponsData.GROUP_ID = parseInt(this.groupID);
    // this.drawerGroupSponsData.GROUP_ID = 81 ;

    if (this.currentIndex > -1) {
      this.MonumentalSponsArray[this.currentIndex] = this.drawerMonumentalSponsData;
      this.MonumentalSponsArray = [...[], ...this.MonumentalSponsArray];

    } else {
      this.MonumentalSponsArray = [...this.MonumentalSponsArray, ...[this.drawerMonumentalSponsData]];
    }

    this.currentIndex = -1;
    this.drawerMonumentalSponsVisible = false;
  }

  addMonumentalSpons() {
    this.drawerMonumentalSponsTitle = "Add Monumental Project Sponsored Details";
    this.drawerMonumentalSponsData = new MonumentalSponsorship();
    this.drawerMonumentalSponsVisible = true;
  }

  editMonumentalSpons(data: MonumentalSponsorship, index: number): void {
    this.currentIndex = index;
    this.drawerMonumentalSponsTitle = "Update Monumental Project Sponsored Details";
    this.drawerMonumentalSponsData = Object.assign({}, data);
    this.drawerMonumentalSponsVisible = true;
  }

  SponsSentUrl1(event: any) {
    this.sponsURL1 = (event)

    if (this.sponsURL1 == null || this.sponsURL1 == undefined || this.sponsURL1 == "") {
      var sponsorURL1 = "";
    }

    else {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.sponsURL1.name.split('.').pop();
      var sponsorURL1 = "GM" + number + "." + fileExt;
    }

    this.drawerMonumentalSponsData.SPONSERED_CERTIFICATE = sponsorURL1;
  }

  PressClipSentUrl1(event: any) {
    this.pressClipURL1 = (event)

    if (this.pressClipURL1 == null || this.pressClipURL1 == undefined || this.pressClipURL1 == "") {
      var PressURL = "";
    }

    else {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.pressClipURL1.name.split('.').pop();
      var PressURL = "GM" + number + "." + fileExt;
    }

    this.drawerPressClippingData.PHOTO_URL1 = PressURL;
  }

  PressClipSentUrl2(event: any) {
    this.pressClipURL2 = (event)

    if (this.pressClipURL2 == null || this.pressClipURL2 == undefined || this.pressClipURL2 == "") {
      var PressURL = "";
    }

    else {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.pressClipURL2.name.split('.').pop();
      var PressURL = "GM" + number + "." + fileExt;
    }

    this.drawerPressClippingData.PHOTO_URL2 = PressURL;
  }

  PressClipSentUrl3(event: any) {
    this.pressClipURL3 = (event)

    if (this.pressClipURL3 == null || this.pressClipURL3 == undefined || this.pressClipURL3 == "") {
      var PressURL = "";
    }

    else {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.pressClipURL3.name.split('.').pop();
      var PressURL = "GM" + number + "." + fileExt;
    }

    this.drawerPressClippingData.PHOTO_URL3 = PressURL;
  }

  BannerSentUrl1(event: any) {
    this.gaintsBannerURL1 = (event)

    if (this.gaintsBannerURL1 == null || this.gaintsBannerURL1 == undefined || this.gaintsBannerURL1 == "") {
      var BannerURL = "";
    }

    else {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.gaintsBannerURL1.name.split('.').pop();
      var BannerURL = "GM" + number + "." + fileExt;
    }

    this.drawerGaintsBannerData.PHOTO_URL1 = BannerURL;
  }

  BannerSentUrl2(event: any) {
    this.gaintsBannerURL2 = (event)

    if (this.gaintsBannerURL2 == null || this.gaintsBannerURL2 == undefined || this.gaintsBannerURL2 == "") {
      var BannerURL = "";
    }

    else {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.gaintsBannerURL2.name.split('.').pop();
      var BannerURL = "GM" + number + "." + fileExt;
    }

    this.drawerGaintsBannerData.PHOTO_URL2 = BannerURL;
  }

  BannerSentUrl3(event: any) {
    this.gaintsBannerURL3 = (event)

    if (this.gaintsBannerURL3 == null || this.gaintsBannerURL3 == undefined || this.gaintsBannerURL3 == "") {
      var BannerURL = "";
    }

    else {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.gaintsBannerURL3.name.split('.').pop();
      var BannerURL = "GM" + number + "." + fileExt;
    }

    this.drawerGaintsBannerData.PHOTO_URL3 = BannerURL;
  }

  drawerGaintsBannerClose(): void {
    this.drawerGaintsBannerVisible = false;
  }

  get closeGaintsBannerCallback() {
    return this.drawerGaintsBannerClose.bind(this);
  }

  get GaintsBannerTableCallback() {
    return this.GaintsBannerTable.bind(this);
  }

  GaintsBannerTable(): void {
    if (this.currentIndex > -1) {
      this.gaintsBannerArray[this.currentIndex] = this.drawerGaintsBannerData;
      this.gaintsBannerArray = [...[], ...this.gaintsBannerArray];
    }

    else {
      this.gaintsBannerArray = [...this.gaintsBannerArray, ...[this.drawerGaintsBannerData]];
    }

    this.currentIndex = -1;
    this.drawerGaintsBannerVisible = false;
  }

  addGaintsBanner(): void {
    this.drawerGaintsBannerTitle = "Add Giants Banner Photographics";
    this.drawerGaintsBannerData = new GaintsBannerPhotos();
    this.drawerGaintsBannerVisible = true;
  }

  editGaintsBanner(data: GaintsBannerPhotos, index: number): void {
    this.currentIndex = index
    this.drawerGaintsBannerTitle = "Update Giants Banner Photographics";
    this.drawerGaintsBannerData = Object.assign({}, data);
    const readerUrl1 = new FileReader();

    if (this.gaintsBannerURL1) {
      const [file] = [this.gaintsBannerURL1];
      readerUrl1.readAsDataURL(file);
      readerUrl1.onload = () => {
        this.drawerGaintsBannerData.PHOTO_URL1 = readerUrl1.result as string;
      };
    }

    const readerUrl2 = new FileReader();
    if (this.gaintsBannerURL2) {
      const [file] = [this.gaintsBannerURL2];
      readerUrl2.readAsDataURL(file);

      readerUrl2.onload = () => {
        this.drawerGaintsBannerData.PHOTO_URL2 = readerUrl2.result as string;
      };
    }

    const readerUrl3 = new FileReader();
    if (this.gaintsBannerURL3) {
      const [file] = [this.gaintsBannerURL3];
      readerUrl3.readAsDataURL(file);

      readerUrl3.onload = () => {
        this.drawerGaintsBannerData.PHOTO_URL3 = readerUrl3.result as string;
      };
    }

    this.drawerGaintsBannerVisible = true;
  }

  drawerPressClippingClose(): void {
    this.drawerPressClippingVisible = false;
  }

  get closePressClippingCallback() {
    return this.drawerPressClippingClose.bind(this);
  }

  get PressClippingTableCallback() {
    return this.PressClippingTable.bind(this);
  }

  PressClippingTable(): void {
    if (this.currentIndex > -1) {
      this.pressClippingArray[this.currentIndex] = this.drawerPressClippingData;
      this.pressClippingArray = [...[], ...this.pressClippingArray];
    }

    else {
      this.pressClippingArray = [...this.pressClippingArray, ...[this.drawerPressClippingData]];
    }

    this.currentIndex = -1;
    this.drawerPressClippingVisible = false;
  }

  addPressClipping(): void {
    this.drawerPressClippingTitle = "Add Press Clipping";
    this.drawerPressClippingData = new MonumentalPressClipping();
    this.drawerPressClippingVisible = true;
  }

  editPressClipping(data: MonumentalPressClipping, index: number): void {
    this.currentIndex = index
    this.drawerPressClippingTitle = "Update Press Clipping";
    this.drawerPressClippingData = Object.assign({}, data);
    const readerUrl1 = new FileReader();

    if (this.pressClipURL1) {
      const [file] = [this.pressClipURL1];
      readerUrl1.readAsDataURL(file);

      readerUrl1.onload = () => {
        this.drawerPressClippingData.PHOTO_URL1 = readerUrl1.result as string;
      };
    }

    const readerUrl2 = new FileReader();
    if (this.pressClipURL2) {
      const [file] = [this.pressClipURL2];
      readerUrl2.readAsDataURL(file);
      readerUrl2.onload = () => {
        this.drawerPressClippingData.PHOTO_URL2 = readerUrl2.result as string;
      };
    }

    const readerUrl3 = new FileReader();
    if (this.pressClipURL3) {
      const [file] = [this.pressClipURL3];
      readerUrl3.readAsDataURL(file);

      readerUrl3.onload = () => {
        this.drawerPressClippingData.PHOTO_URL3 = readerUrl3.result as string;
      };
    }
    this.drawerPressClippingVisible = true;
  }

  folderName: string = "monumentalProjectSponsorship";
  sponsPhotoStr: string;

  sponsImageUpload1() {
    this.sponsPhotoStr = "";

    if (!this.data.ID) {
      if (this.sponsURL1) {
        this.api.onUploadMedia(this.folderName, this.sponsURL1, this.drawerMonumentalSponsData.SPONSERED_CERTIFICATE).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.sponsPhotoStr = this.drawerMonumentalSponsData.SPONSERED_CERTIFICATE;

      } else {
        this.sponsPhotoStr = "";
      }

    } else {
      if (this.sponsURL1) {
        this.api.onUploadMedia(this.folderName, this.sponsURL1, this.drawerMonumentalSponsData.SPONSERED_CERTIFICATE).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.sponsPhotoStr = this.drawerMonumentalSponsData.SPONSERED_CERTIFICATE;;

      } else {
        if (this.drawerMonumentalSponsData.SPONSERED_CERTIFICATE) {
          let photoURL = this.drawerMonumentalSponsData.SPONSERED_CERTIFICATE.split("/");
          this.sponsPhotoStr = photoURL[photoURL.length - 1];

        } else
          this.sponsPhotoStr = "";
      }
    }
  }

  bannerFolderName = "monumentalBannerPhotos";
  bannerPhotoStr1: string;
  bannerPhotoStr2: string;
  bannerPhotoStr3: string;

  bannerImageUpload1() {
    this.bannerPhotoStr1 = "";

    if (!this.data.ID) {
      if (this.gaintsBannerURL1) {
        this.api.onUploadMedia(this.bannerFolderName, this.gaintsBannerURL1, this.drawerGaintsBannerData.PHOTO_URL1).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.bannerPhotoStr1 = this.drawerGaintsBannerData.PHOTO_URL1;

      } else {
        this.bannerPhotoStr1 = "";
      }

    } else {
      if (this.gaintsBannerURL1) {
        this.api.onUploadMedia(this.bannerFolderName, this.gaintsBannerURL1, this.drawerGaintsBannerData.PHOTO_URL1).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.bannerPhotoStr1 = this.drawerGaintsBannerData.PHOTO_URL1;;

      } else {
        if (this.drawerGaintsBannerData.PHOTO_URL1) {
          let photoURL = this.drawerGaintsBannerData.PHOTO_URL1.split("/");
          this.bannerPhotoStr1 = photoURL[photoURL.length - 1];

        } else
          this.bannerPhotoStr1 = "";
      }
    }
  }

  bannerImageUpload2() {
    this.bannerPhotoStr2 = "";

    if (!this.data.ID) {
      if (this.gaintsBannerURL2) {
        this.api.onUploadMedia(this.bannerFolderName, this.gaintsBannerURL2, this.drawerGaintsBannerData.PHOTO_URL2).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.bannerPhotoStr2 = this.drawerGaintsBannerData.PHOTO_URL2;

      } else {
        this.bannerPhotoStr2 = "";
      }

    } else {
      if (this.gaintsBannerURL2) {
        this.api.onUploadMedia(this.bannerFolderName, this.gaintsBannerURL2, this.drawerGaintsBannerData.PHOTO_URL2).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.bannerPhotoStr2 = this.drawerGaintsBannerData.PHOTO_URL2;

      } else {
        if (this.drawerGaintsBannerData.PHOTO_URL2) {
          let photoURL = this.drawerGaintsBannerData.PHOTO_URL2.split("/");
          this.bannerPhotoStr2 = photoURL[photoURL.length - 1];

        } else
          this.bannerPhotoStr2 = "";
      }
    }
  }

  bannerImageUpload3() {
    this.bannerPhotoStr3 = "";

    if (!this.data.ID) {
      if (this.bannerPhotoStr3) {
        this.api.onUploadMedia(this.bannerFolderName, this.gaintsBannerURL3, this.drawerGaintsBannerData.PHOTO_URL3).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.bannerPhotoStr3 = this.drawerGaintsBannerData.PHOTO_URL3;

      } else {
        this.bannerPhotoStr3 = "";
      }

    } else {
      if (this.bannerPhotoStr3) {
        this.api.onUploadMedia(this.bannerFolderName, this.gaintsBannerURL3, this.drawerGaintsBannerData.PHOTO_URL3).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.bannerPhotoStr3 = this.drawerGaintsBannerData.PHOTO_URL3;

      } else {
        if (this.drawerGaintsBannerData.PHOTO_URL3) {
          let photoURL = this.drawerGaintsBannerData.PHOTO_URL3.split("/");
          this.bannerPhotoStr3 = photoURL[photoURL.length - 1];

        } else
          this.bannerPhotoStr3 = "";
      }
    }
  }

  mediaclipFolderName = "monumentalPressClipping";
  mediaclipPhotoStr1: string;
  mediaclipPhotoStr2: string;
  mediaclipPhotoStr3: string;

  mediaClipImageUpload1() {
    this.mediaclipPhotoStr1 = "";

    if (!this.data.ID) {
      if (this.pressClipURL1) {
        this.api.onUploadMedia(this.mediaclipFolderName, this.pressClipURL1, this.drawerPressClippingData.PHOTO_URL1).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.mediaclipPhotoStr1 = this.drawerPressClippingData.PHOTO_URL1;

      } else {
        this.mediaclipPhotoStr1 = "";
      }

    } else {
      if (this.pressClipURL1) {
        this.api.onUploadMedia(this.mediaclipFolderName, this.pressClipURL1, this.drawerPressClippingData.PHOTO_URL1).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.mediaclipPhotoStr1 = this.drawerPressClippingData.PHOTO_URL1;;

      } else {
        if (this.drawerPressClippingData.PHOTO_URL1) {
          let photoURL = this.drawerPressClippingData.PHOTO_URL1.split("/");
          this.mediaclipPhotoStr1 = photoURL[photoURL.length - 1];

        } else
          this.mediaclipPhotoStr1 = "";
      }
    }
  }

  mediaClipImageUpload2() {
    this.mediaclipPhotoStr2 = "";

    if (!this.data.ID) {
      if (this.pressClipURL2) {
        this.api.onUploadMedia(this.mediaclipFolderName, this.pressClipURL2, this.drawerPressClippingData.PHOTO_URL2).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.mediaclipPhotoStr2 = this.drawerPressClippingData.PHOTO_URL2;

      } else {
        this.mediaclipPhotoStr2 = "";
      }

    } else {
      if (this.pressClipURL2) {
        this.api.onUploadMedia(this.mediaclipFolderName, this.pressClipURL2, this.drawerPressClippingData.PHOTO_URL2).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.mediaclipPhotoStr2 = this.drawerPressClippingData.PHOTO_URL2;

      } else {
        if (this.drawerPressClippingData.PHOTO_URL2) {
          let photoURL = this.drawerPressClippingData.PHOTO_URL2.split("/");
          this.mediaclipPhotoStr2 = photoURL[photoURL.length - 1];

        } else
          this.mediaclipPhotoStr2 = "";
      }
    }
  }

  mediaClipImageUpload3() {
    this.mediaclipPhotoStr3 = "";

    if (!this.data.ID) {
      if (this.pressClipURL3) {
        this.api.onUploadMedia(this.mediaclipFolderName, this.pressClipURL3, this.drawerPressClippingData.PHOTO_URL3).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.mediaclipPhotoStr3 = this.drawerPressClippingData.PHOTO_URL3;

      } else {
        this.mediaclipPhotoStr3 = "";
      }

    } else {
      if (this.pressClipURL3) {
        this.api.onUploadMedia(this.mediaclipFolderName, this.pressClipURL3, this.drawerPressClippingData.PHOTO_URL3).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.mediaclipPhotoStr3 = this.drawerPressClippingData.PHOTO_URL3;

      } else {
        if (this.drawerPressClippingData.PHOTO_URL3) {
          let photoURL = this.drawerPressClippingData.PHOTO_URL3.split("/");
          this.mediaclipPhotoStr3 = photoURL[photoURL.length - 1];

        } else
          this.mediaclipPhotoStr3 = "";
      }
    }
  }

  today = new Date();

  disabledDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, this.today) > 0;
  };

  year = new Date().getFullYear();
  baseYear = 2020;
  range = [];
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
    this.data = new OutstandingMonumental();
    this.gaintsBannerArray = [];
    this.pressClippingArray = [];
    this.MonumentalSponsArray = []

    this.api.getOutstandingMonumental(0, 0, 'ID', 'ASC', 'AND GROUP_ID = ' + this.groupID, this.SelectedYear).subscribe(data => {
      if (data['count'] > 0) {
        this.data = Object.assign({}, data['data'][0]);
        this.isSpinning = false;

        this.api.getOutstandingMonumentalSpons(0, 0, 'ID', 'ASC', 'AND MONUMENTAL_MASTER_ID = ' + this.data.ID).subscribe(dataSpons => {
          if (dataSpons['count'] > 0) {
            this.MonumentalSponsArray = dataSpons['data'];
            this.isSpinning = false;

          } else {
            this.MonumentalSponsArray = [];
          }
        });

        this.api.getOutstandingMonumentalBanner(0, 0, 'ID', 'ASC', 'AND MONUMENTAL_MASTER_ID = ' + this.data.ID).subscribe(dataBanner => {
          if (dataBanner['count'] > 0) {
            this.gaintsBannerArray = dataBanner['data'];
            this.isSpinning = false;

          } else {
            this.gaintsBannerArray = [];
          }
        });

        this.api.getOutstandingMonumentalMediaClip(0, 0, 'ID', 'ASC', 'AND MONUMENTAL_MASTER_ID = ' + this.data.ID).subscribe(dataMediaClip => {
          if (dataMediaClip['count'] > 0) {
            this.pressClippingArray = dataMediaClip['data'];
            this.isSpinning = false;

          } else {
            this.pressClippingArray = [];
          }
        });
      }

      this.isSpinning = false;
    });
  }
}
