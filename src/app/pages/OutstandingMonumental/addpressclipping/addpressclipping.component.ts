import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import {MonumentalPressClipping} from 'src/app/Models/MonumentalPressClipping';
import { CompressImageService } from 'src/app/Service/image-compressor.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-addpressclipping',
  templateUrl: './addpressclipping.component.html',
  styleUrls: ['./addpressclipping.component.css']
})
export class AddpressclippingComponent implements OnInit {
  @Input() drawerPressClippingClose: Function;
  @Input() PressClippingTable: Function;
  // @Input() ProjectMediaCoverageTable: Function;
  @Input() pressClippingData: MonumentalPressClipping = new MonumentalPressClipping();
  @Input() drawerPressClippingVisible: boolean;
  numberpattern = /^[6-9]\d{9}$/;
  isSpinning = false;
  isOk = true;
  @Output() fUrl1: EventEmitter<any> = new EventEmitter<any>();
  @Output() fUrl2: EventEmitter<any> = new EventEmitter<any>();
  @Output() fUrl3: EventEmitter<any> = new EventEmitter<any>();

  constructor(public api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService,
    private compressImage: CompressImageService) { }


  ngOnInit() {
  }

  alphaOnly(event: any) {
    event = (event) ? event : window.event;
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }

  save(addNew: boolean, myForm: NgForm) {
    this.isSpinning = false;
    this.isOk = true;

    if (this.pressClippingData.DETAILS == undefined || this.pressClippingData.DETAILS.toString() == '' || this.pressClippingData.DETAILS == null || this.pressClippingData.DETAILS.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter the Details', '');
    }

    if (this.isOk) {
      // console.log("this.PaidDuetdata",  this.mediaCoverdata);
      // this.PressClippingTable();
      // this.fUrl1.emit(this.fileURL1);
      // this.fUrl2.emit(this.fileURL2);
      // this.fUrl3.emit(this.fileURL3);

      if (this.fileURL1 != null)
        this.imageUpload1();
      if (this.fileURL2 != null)
        this.imageUpload2();
      if (this.fileURL3 != null)
        this.imageUpload3();

        this.PressClippingTable();

      this.fileURL1 = null;
      this.fileURL2 = null;
      this.fileURL3 = null;

      this.pressClippingData= new MonumentalPressClipping();
      this.drawerPressClippingClose();
      this.isSpinning = false;
    }
  }

  close(myForm: NgForm): void {
    this.drawerPressClippingClose();
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
    this.pressClippingData.PHOTO_URL1 = null;
  }

  clear2() {
    this.fileURL2 = null;
    this.pressClippingData.PHOTO_URL1 = null;
  }

  clear3() {
    this.fileURL3 = null;
    this.pressClippingData.PHOTO_URL3 = null;
  }

  onFileSelected1(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL1 = <File>event.target.files[0];

      this.compressImage.compress(event.target.files[0])
      .pipe(take(1))
      .subscribe(compressedImage => {
        console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
        // now you can do upload the compressed image 
        this.fileURL1=compressedImage;
      })

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.pressClippingData.PHOTO_URL1 = reader.result as string;
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

      this.compressImage.compress(event.target.files[0])
      .pipe(take(1))
      .subscribe(compressedImage => {
        console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
        // now you can do upload the compressed image 
        this.fileURL2=compressedImage;
      })

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.pressClippingData.PHOTO_URL2 = reader.result as string;
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

      this.compressImage.compress(event.target.files[0])
      .pipe(take(1))
      .subscribe(compressedImage => {
        console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
        // now you can do upload the compressed image 
        this.fileURL3=compressedImage;
      })

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.pressClippingData.PHOTO_URL3 = reader.result as string;
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

  SentUrl(addNew: boolean, myForm: NgForm): void {
    this.fUrl1.emit(this.fileURL1);
    this.fUrl2.emit(this.fileURL2);
    this.fUrl3.emit(this.fileURL3);
    this.close(myForm);
  }

  folderName = "monumentalPressClipping";
  photo1Str: string;
  photo2Str: string;
  photo3Str: string;

  imageUpload1() {
    this.photo1Str = "";


    var number = Math.floor(100000 + Math.random() * 900000);
    var fileExt = this.fileURL1.name.split('.').pop();
    var url = "GM" + number + "." + fileExt;
    this.pressClippingData.PHOTO_URL1 = url;

    console.log("this.fileURL1 ======= " + this.fileURL1);
    console.log("this.pressClippingData.PHOTO_URL1 ======= " + this.pressClippingData.PHOTO_URL1);

    if (this.fileURL1) {

      this.api.onUploadMedia(this.folderName, this.fileURL1, this.pressClippingData.PHOTO_URL1).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");

          // this.fileURL1 = null;

        } else {
          console.log("Not Uploaded");
        }
      });

      this.photo1Str = this.pressClippingData.PHOTO_URL1;

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
    this.pressClippingData.PHOTO_URL2 = url;


    if (this.fileURL2) {


      this.api.onUploadMedia(this.folderName, this.fileURL2, this.pressClippingData.PHOTO_URL2).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");

        } else {
          console.log("Not Uploaded");
        }
      });

      this.photo2Str = this.pressClippingData.PHOTO_URL2;

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
    this.pressClippingData.PHOTO_URL3 = url;


    if (this.fileURL3) {

      this.api.onUploadMedia(this.folderName, this.fileURL3, this.pressClippingData.PHOTO_URL3).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");

        } else {
          console.log("Not Uploaded");
        }
      });

      this.photo3Str = this.pressClippingData.PHOTO_URL3;

    } else {
      this.photo3Str = "";
    }

    this.fileURL3 = null;
  }

}


