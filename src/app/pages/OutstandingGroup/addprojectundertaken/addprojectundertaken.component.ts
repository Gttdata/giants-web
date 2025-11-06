import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { MediaCoverings } from 'src/app/Models/MediaCoverings';
import { OutstandingGroupMaster } from 'src/app/Models/OutstandingGroupMaster';
import { UndertakenProjectDetails } from 'src/app/Models/UndertakenProjectDetails';
import { ApiService } from 'src/app/Service/api.service';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { CompressImageService } from 'src/app/Service/image-compressor.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-addprojectundertaken',
  templateUrl: './addprojectundertaken.component.html',
  styleUrls: ['./addprojectundertaken.component.css']
})

export class AddprojectundertakenComponent implements OnInit {
  @Input() drawerProjectClose: Function;
  @Input() projectUnderTable: Function;
  @Input() projectdata: UndertakenProjectDetails = new UndertakenProjectDetails();
  // @Input() drawerProjectMediaCoverVisible: boolean;
  // drawerMediaCoverTitle: string;
  // drawerMediaCoverVisible: boolean;
  // drawerMediaCoverData: MediaCoverings = new MediaCoverings();
  // mediaCovertData: any[] = [];
  drawerProjectMediaCoverTitle: string;
  drawerProjectMediaCoverVisible: boolean;
  drawerProjectMediaCoverData: MediaCoverings = new MediaCoverings();

  // projectMediaCoverArray: MediaCoverings[] = [];
  @Input() projectMediaCoverArray: MediaCoverings[] = [];
  currentIndex: number = -1;
  url1: any;
  url2: any;
  url3: any;
  numberpattern = /^[6-9]\d{9}$/;
  isSpinning = false;
  isOk = true;

  constructor(public api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService,
    private compressImage: CompressImageService) { }

  @Output() projectMediaCoverArrayData: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() { }

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

  save(addNew: boolean, myForm: NgForm) {
    this.isSpinning = false;
    this.isOk = true;

    if (this.projectdata.NAME == undefined || this.projectdata.NAME.toString() == '' || this.projectdata.NAME == null) {
      this.isOk = false;
      this.message.error('Please Enter Project Name', '');

    } else if (this.projectdata.DATE_OF_IMPLEMENTATION == undefined || this.projectdata.DATE_OF_IMPLEMENTATION.toString() == '' || this.projectdata.DATE_OF_IMPLEMENTATION == null) {
      this.isOk = false;
      this.message.error('Please Select Implementation Date', '');

    } else if (this.projectdata.PROJECT_COST == undefined || this.projectdata.PROJECT_COST.toString() == '' || this.projectdata.PROJECT_COST == null) {
      this.isOk = false;
      this.message.error('Please Enter the Project Cost', '');

    } else if (this.projectdata.BENIFITED_PERSONS_COUNT == undefined || this.projectdata.BENIFITED_PERSONS_COUNT.toString() == '' || this.projectdata.BENIFITED_PERSONS_COUNT == null) {
      this.isOk = false;
      this.message.error('Please Enter the No. of Benifited Person', '');

    } else if (this.projectdata.MEMBERS_COUNT == undefined || this.projectdata.MEMBERS_COUNT.toString() == '' || this.projectdata.MEMBERS_COUNT == null) {
      this.isOk = false;
      this.message.error('Please Enter the No. of Members', '');

    } else if (this.projectdata.IMPACT_ON_SOCIETY == undefined || this.projectdata.IMPACT_ON_SOCIETY.toString() == '' || this.projectdata.IMPACT_ON_SOCIETY == null) {
      this.isOk = false;
      this.message.error('Please Enter Impact on Society', '');
    }
    else if((this.numbers.test(this.projectdata.PROJECT_COST.toString())) == false){
      this.isOk = false;
      this.message.error('Please Enter the Project Cost in Number Only', '');
    }
    else if((this.numbers.test(this.projectdata.MEMBERS_COUNT.toString())) == false){
      this.isOk = false;
      this.message.error('Please Enter the Member Count in Number Only', '');
    }
    else if((this.numbers.test(this.projectdata.BENIFITED_PERSONS_COUNT.toString())) == false){
      this.isOk = false;
      this.message.error('Please Enter the Benifited Person Count in Number Only', '');
    }
    

    if (this.isOk) {
      this.projectdata.DATE_OF_IMPLEMENTATION = this.datePipe.transform(this.projectdata.DATE_OF_IMPLEMENTATION, "yyyy-MM-dd");
      // console.log(this.projectMediaCoverArray);
      // this.projectMediaCoverArrayData.emit(this.projectMediaCoverArray);

      if (this.fileURL1 != null)
        this.imageUpload1();

        if (this.fileURL2 != null)
        this.imageUpload2();

        if (this.fileURL3 != null)
        this.imageUpload3();

      this.projectUnderTable();
      this.fileURL1 = null;
      this.fileURL2 = null;
      this.fileURL3 = null;

      this.projectdata= new UndertakenProjectDetails();

      this.drawerProjectClose();
      this.isSpinning = false;
    }
  }

  close(myForm: NgForm): void {
    // this.projectMediaCoverArray = null;
    this.drawerProjectClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  addMediaCover(): void {
    console.log("Drawer cllaed..");
    this.currentIndex = -1;
    this.drawerProjectMediaCoverTitle = "Add Media Coverings";
    // this.projectMediaCoverArray = null;
    this.drawerProjectMediaCoverData = new MediaCoverings();
    this.drawerProjectMediaCoverVisible = true;
  }

  // editMediaCover(data: MediaCoverings, index: number): void {
  //   this.currentIndex = index
  //   this.drawerProjectMediaCoverTitle = "Update Media Coverings2";
  //   this.drawerProjectMediaCoverData = Object.assign({}, data);
  //   this.drawerProjectMediaCoverVisible = true;
  // }

  editMediaCover(data: MediaCoverings, index: number): void {
    this.currentIndex = index

    this.drawerProjectMediaCoverTitle = "Update Media Coverings";
    this.drawerProjectMediaCoverData = Object.assign({}, data);
    const readerUrl1 = new FileReader();
    if (this.projectMediaCoverArray[this.currentIndex]['url1']) {
      const [file] = [this.projectMediaCoverArray[this.currentIndex]['url1']];
      readerUrl1.readAsDataURL(file);

      readerUrl1.onload = () => {
        this.drawerProjectMediaCoverData.PHOTO_URL1 = readerUrl1.result as string;
      };
    }

    const readerUrl2 = new FileReader();
    if (this.projectMediaCoverArray[this.currentIndex]['url2']) {
      const [file] = [this.projectMediaCoverArray[this.currentIndex]['url2']];
      readerUrl2.readAsDataURL(file);

      readerUrl2.onload = () => {
        this.drawerProjectMediaCoverData.PHOTO_URL2 = readerUrl2.result as string;
      };
    }
    const readerUrl3 = new FileReader();
    if (this.projectMediaCoverArray[this.currentIndex]['url3']) {
      const [file] = [this.projectMediaCoverArray[this.currentIndex]['url3']];
      readerUrl3.readAsDataURL(file);

      readerUrl3.onload = () => {
        this.drawerProjectMediaCoverData.PHOTO_URL3 = readerUrl3.result as string;
      };
    }
    this.drawerProjectMediaCoverVisible = true;
  }
  get closeProjectMediaCoverCallback() {
    return this.drawerProjectMediaCoverClose.bind(this);
  }

  drawerProjectMediaCoverClose(): void {
    // this.projectMediaCoverArray = null;
    this.drawerProjectMediaCoverVisible = false;
  }

  getWidth() {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 600;
  }

  SentUrl1(event: any) {
    this.url1 = (event)
    this.drawerProjectMediaCoverData.PHOTO_URL1 = this.url1;
    console.log("this.drawerProjectMediaCoverData.PHOTO_URL1" + this.drawerProjectMediaCoverData.PHOTO_URL1);
  }

  SentUrl2(event: any) {
    this.url2 = (event)
    this.drawerProjectMediaCoverData.PHOTO_URL2 = this.url2;
    console.log("this.drawerProjectMediaCoverData.PHOTO_URL2" + this.drawerProjectMediaCoverData.PHOTO_URL2);
  }

  SentUrl3(event: any) {
    this.url3 = (event)
    this.drawerProjectMediaCoverData.PHOTO_URL3 = this.url3;
    console.log("this.drawerProjectMediaCoverData.PHOTO_URL3" + this.drawerProjectMediaCoverData.PHOTO_URL3);
  }

  get ProjectMediaCoverageTableCallback() {
    return this.ProjectMediaCoverageTable.bind(this);
  }

  ProjectMediaCoverageTable(): void {
    console.log( this.drawerProjectMediaCoverData);
    this.drawerProjectMediaCoverData.TYPE = "P";
    this.drawerProjectMediaCoverData.TYPE_ID = 0;

    if (this.currentIndex > -1) {
      this.projectMediaCoverArray[this.currentIndex] = this.drawerProjectMediaCoverData;
      this.projectMediaCoverArray = [...[], ...this.projectMediaCoverArray];

    } else {
      this.projectMediaCoverArray = [...this.projectMediaCoverArray, ...[this.drawerProjectMediaCoverData]];
    }

    this.currentIndex = -1;
    console.log(this.projectMediaCoverArray);
    this.drawerProjectMediaCoverVisible = false;
  }
  today = new Date();

  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;

  };

  fileURL1: any = null;
  fileURL2: any = null;
  fileURL3: any = null;

  
   onFileSelected1(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL1 = <File>event.target.files[0];

      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)

      this.compressImage.compress(event.target.files[0])
      .pipe(take(1))
      .subscribe(compressedImage => {
        console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
        // now you can do upload the compressed image 
        this.fileURL1=compressedImage;
      })

      // console.log("URLLLLL == " , this.sponsorFileURL1);
      

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.projectdata.PHOTO_URL1 = reader.result as string;
        };
      }
      console.log("File URL1 = " + this.fileURL1);

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL1 = null;
    }
  }
  onFileSelected2(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL2 = <File>event.target.files[0];

      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)

      this.compressImage.compress(event.target.files[0])
      .pipe(take(1))
      .subscribe(compressedImage => {
        console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
        // now you can do upload the compressed image 
        this.fileURL2=compressedImage;
      })

      // console.log("URLLLLL == " , this.sponsorFileURL1);
      

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.projectdata.PHOTO_URL2 = reader.result as string;
        };
      }
      console.log("File URL2 = " + this.fileURL2);

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL2 = null;
    }
  }
  onFileSelected3(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL3 = <File>event.target.files[0];

      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)

      this.compressImage.compress(event.target.files[0])
      .pipe(take(1))
      .subscribe(compressedImage => {
        console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
        // now you can do upload the compressed image 
        this.fileURL3=compressedImage;
      })

      // console.log("URLLLLL == " , this.sponsorFileURL1);
      

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.projectdata.PHOTO_URL3 = reader.result as string;
        };
      }
      console.log("File URL3 = " + this.fileURL3);

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL3 = null;
    }
  }

  viewImage(imageName) {
    window.open(imageName);
  }

  folderName = "undertakenProjectsMedia";
  photo1Str: string;
  photo2Str: string;
  photo3Str: string;

  imageUpload1() {
    this.photo1Str = "";


    var number = Math.floor(100000 + Math.random() * 900000);
    var fileExt = this.fileURL1.name.split('.').pop();
    var url = "GM" + number + "." + fileExt;
    this.projectdata.PHOTO_URL1 = url;

    console.log("Undertaking URL1 ======= " + this.fileURL1);
    console.log("Undertaking Image1 ======= " + this.projectdata.PHOTO_URL1);

    if (this.fileURL1) {

      this.api.onUploadMedia(this.folderName, this.fileURL1, this.projectdata.PHOTO_URL1).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");

          // this.fileURL1 = null;

        } else {
          console.log("Not Uploaded");
        }
      });

      this.photo1Str = this.projectdata.PHOTO_URL1;

    } else {
      this.photo1Str = "";
    }

    this.fileURL1 = null;
  }
  imageUpload2() {
    this.photo2Str = "";


    var number = Math.floor(100000 + Math.random() * 900000);
    var fileExt = this.fileURL2.name.split('.').pop();
    var url = "GM" + number + "." + fileExt;
    this.projectdata.PHOTO_URL2 = url;

    console.log("Undertaking URL2 ======= " + this.fileURL2);
    console.log("Undertaking Image2 ======= " + this.projectdata.PHOTO_URL2);

    if (this.fileURL2) {

      this.api.onUploadMedia(this.folderName, this.fileURL2, this.projectdata.PHOTO_URL2).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");

          // this.fileURL1 = null;

        } else {
          console.log("Not Uploaded");
        }
      });

      this.photo2Str = this.projectdata.PHOTO_URL2;

    } else {
      this.photo2Str = "";
    }

    this.fileURL2 = null;
  }
  imageUpload3() {
    this.photo3Str = "";


    var number = Math.floor(100000 + Math.random() * 900000);
    var fileExt = this.fileURL3.name.split('.').pop();
    var url = "GM" + number + "." + fileExt;
    this.projectdata.PHOTO_URL3 = url;

    console.log("Undertaking URL3 ======= " + this.fileURL3);
    console.log("Undertaking Image3 ======= " + this.projectdata.PHOTO_URL3);

    if (this.fileURL3) {

      this.api.onUploadMedia(this.folderName, this.fileURL3, this.projectdata.PHOTO_URL3).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");

          // this.fileURL1 = null;

        } else {
          console.log("Not Uploaded");
        }
      });

      this.photo3Str = this.projectdata.PHOTO_URL3;

    } else {
      this.photo3Str = "";
    }

    this.fileURL3 = null;
  }
}
