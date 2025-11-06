import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { MediaCoverings } from 'src/app/Models/MediaCoverings';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-addmediacoverings',
  templateUrl: './addmediacoverings.component.html',
  styleUrls: ['./addmediacoverings.component.css']
})

export class AddmediacoveringsComponent implements OnInit {
  @Input() drawerMediaCoverClose: Function;
  @Input() MediaCoverageTable: Function;
  // @Input() ProjectMediaCoverageTable: Function;
  @Input() mediaCoverdata: MediaCoverings = new MediaCoverings();
  @Input() drawerMediaCoverVisible: boolean;
  @Input() data: MediaCoverings;
  @Input() mediaCoverArray: MediaCoverings[] = [];
  numberpattern = /^[6-9]\d{9}$/;
  isSpinning = false;
  isOk = true;
  @Output() fUrl1: EventEmitter<any> = new EventEmitter<any>();
  @Output() fUrl2: EventEmitter<any> = new EventEmitter<any>();
  @Output() fUrl3: EventEmitter<any> = new EventEmitter<any>();

  constructor(public api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() { }

  alphaOnly(event: any) {
    event = (event) ? event : window.event;
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }

  save() {
    this.isSpinning = false;
    this.isOk = true;

    if (this.mediaCoverdata.DETAILS == undefined || this.mediaCoverdata.DETAILS.toString() == '' || this.mediaCoverdata.DETAILS == null) {
      this.isOk = false;
      this.message.error('Please Enter the Details', '');
    }

    if (this.isOk) {
      // console.log("this.PaidDuetdata",  this.mediaCoverdata);
      // console.log("this.fileURL1 = " + this.fileURL1);
      // console.log("this.fileURL2 = " + this.fileURL2);
      // console.log("this.fileURL3 = " + this.fileURL3);
      if (this.fileURL1 != null)
        this.imageUpload1();
      if (this.fileURL2 != null)
        this.imageUpload2();
      if (this.fileURL3 != null)
        this.imageUpload3();

      this.MediaCoverageTable();

      // this.fUrl1.emit(this.fileURL1);
      // this.fUrl2.emit(this.fileURL2);
      // this.fUrl3.emit(this.fileURL3);



      this.fileURL1 = null;
      this.fileURL2 = null;
      this.fileURL3 = null;

      console.log("this.fileURL1 for null = " + this.fileURL1);

      this.mediaCoverdata= new MediaCoverings();
      this.drawerMediaCoverClose();
      this.isSpinning = false;
    }
  }

  close(myForm: NgForm): void {
    this.drawerMediaCoverClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  cancel() { }

  fileURL1: any = null;
  fileURL2: any = null;
  fileURL3: any = null;

  clear1() {
    this.fileURL1 = null;
    this.mediaCoverdata.PHOTO_URL1 = null;
  }

  clear2() {
    this.fileURL2 = null;
    this.mediaCoverdata.PHOTO_URL1 = null;
  }

  clear3() {
    this.fileURL3 = null;
    this.mediaCoverdata.PHOTO_URL3 = null;
  }

  onFileSelected1(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL1 = <File>event.target.files[0];

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.mediaCoverdata.PHOTO_URL1 = reader.result as string;


        };
      }
      // console.log("File URL1 = " + this.fileURL1);
      // console.log("mediaCoverdata.PHOTO_URL1 = " + this.mediaCoverdata.PHOTO_URL1);

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL1 = null;
    }
    // this.fileURL1 = null;
  }

  onFileSelected2(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL2 = <File>event.target.files[0];

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.mediaCoverdata.PHOTO_URL2 = reader.result as string;
        };
      }

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL2 = null;
    }
  }

  onFileSelected3(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL3 = <File>event.target.files[0];

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.mediaCoverdata.PHOTO_URL3 = reader.result as string;
        };
      }
    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL3 = null;
    }
  }

  viewImage(imageName) {
    window.open(imageName);
  }

  // SentUrl(addNew: boolean, myForm: NgForm): void {
  //   this.fUrl1.emit(this.fileURL1);
  //   this.fUrl2.emit(this.fileURL2);
  //   this.fUrl3.emit(this.fileURL3);
  //   this.close(myForm);
  // }

  folderName = "mediaPhotos";
  photo1Str: string;
  photo2Str: string;
  photo3Str: string;

  imageUpload1() {
    this.photo1Str = "";


    var number = Math.floor(100000 + Math.random() * 900000);
    var fileExt = this.fileURL1.name.split('.').pop();
    var url = "GM" + number + "." + fileExt;
    this.mediaCoverdata.PHOTO_URL1 = url;

    console.log("this.fileURL1 ======= " + this.fileURL1);
    console.log("this.mediaCoverdata.PHOTO_URL1 ======= " + this.mediaCoverdata.PHOTO_URL1);

    if (this.fileURL1) {

      this.api.onUploadMedia(this.folderName, this.fileURL1, this.mediaCoverdata.PHOTO_URL1).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");

          // this.fileURL1 = null;

        } else {
          console.log("Not Uploaded");
        }
      });

      this.photo1Str = this.mediaCoverdata.PHOTO_URL1;

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
    this.mediaCoverdata.PHOTO_URL2 = url;


    if (this.fileURL2) {


      this.api.onUploadMedia(this.folderName, this.fileURL2, this.mediaCoverdata.PHOTO_URL2).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");

        } else {
          console.log("Not Uploaded");
        }
      });

      this.photo2Str = this.mediaCoverdata.PHOTO_URL2;

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
    this.mediaCoverdata.PHOTO_URL3 = url;


    if (this.fileURL3) {

      this.api.onUploadMedia(this.folderName, this.fileURL3, this.mediaCoverdata.PHOTO_URL3).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");

        } else {
          console.log("Not Uploaded");
        }
      });

      this.photo3Str = this.mediaCoverdata.PHOTO_URL3;

    } else {
      this.photo3Str = "";
    }

    this.fileURL3 = null;
  }
}
