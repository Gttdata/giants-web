import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import {UnitConferenceAward} from "src/app/Models/UnitConferenceAward";
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { CompressImageService } from 'src/app/Service/image-compressor.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-addunitconferenceaward',
  templateUrl: './addunitconferenceaward.component.html',
  styleUrls: ['./addunitconferenceaward.component.css']
})
export class AddunitconferenceawardComponent implements OnInit {
  @Input() drawerUnitAwardClose: Function;
  @Input() unitAwardTable: Function;
  @Input() UnitAwardData: UnitConferenceAward = new UnitConferenceAward();
  @Input() drawerUnitAwardVisible: boolean;
  numberpattern = /^[6-9]\d{9}$/;
  isSpinning = false;
  isOk = true;
  @Output() unitAwardChild: EventEmitter<any> = new EventEmitter<any>();
  @Output() fUrl2: EventEmitter<any> = new EventEmitter<any>();


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

    if (this.UnitAwardData.AWARD_NAME == undefined || this.UnitAwardData.AWARD_NAME.toString() == '' || this.UnitAwardData.AWARD_NAME == null || this.UnitAwardData.AWARD_NAME.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Unit Conference Award Name', '');
    }
    else if (this.UnitAwardData.AWARD_DATE == undefined || this.UnitAwardData.AWARD_DATE.toString() == '' || this.UnitAwardData.AWARD_DATE == null) {
      this.isOk = false;
      this.message.error('Select the Inauguartion Date', '');
    }
    else if (this.UnitAwardData.DESCRIPTION == undefined || this.UnitAwardData.DESCRIPTION.toString() == '' || this.UnitAwardData.DESCRIPTION == null || this.UnitAwardData.DESCRIPTION.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter the Present Status', '');
    }

    if (this.isOk) {
      console.log("this.PaidDuetdata", this.UnitAwardData);

      this.UnitAwardData.AWARD_DATE = this.datePipe.transform(this.UnitAwardData.AWARD_DATE, "yyyy-MM-dd");

      if (this.unitAwardFileURL1 != null)
        this.imageUpload1();
      // if (this.unitAwardFileURL1 != null)
      //   this.imageUpload2();
      // if (this.unitAwardFileURL1 != null)
      //   this.imageUpload3();

      this.unitAwardTable();

      this.unitAwardFileURL1 = null;
      // this.unitAwardFileURL1 = null;
      // this.unitAwardFileURL1 = null;

      // this.fUrl2.emit(this.unitAwardFileURL1);

      this.UnitAwardData= new UnitConferenceAward();
      this.drawerUnitAwardClose();
      this.isSpinning = false;
    }




    // if (!addNew)
    // this.close(myForm);
  }

  close(myForm: NgForm): void {
    this.drawerUnitAwardClose();
    this.reset(myForm);
  }
  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  today = new Date();

  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) > 0;
  };

  cancel() { }

  unitAwardFileURL1: any = null;

  clear1() {
    this.unitAwardFileURL1 = null;
    this.UnitAwardData.AWARD_CERTIFICATE = null;
  }


  onFileSelected1(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.unitAwardFileURL1 = <File>event.target.files[0];

      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)

      this.compressImage.compress(event.target.files[0])
      .pipe(take(1))
      .subscribe(compressedImage => {
        console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
        // now you can do upload the compressed image 
        this.unitAwardFileURL1 = compressedImage;
      })

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.UnitAwardData.AWARD_CERTIFICATE = reader.result as string;
        };
      }
      console.log("AWARD_CERTIFICATE File URL1 = " + this.unitAwardFileURL1);

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.unitAwardFileURL1 = null;
    }
  }
  viewImage(imageName) {
    window.open(imageName);
  }

  // SentUrl(addNew: boolean, myForm: NgForm): void {
  //   this.fUrl2.emit(this.unitAwardFileURL1);
  //   this.close(myForm);
  // }

  
  folderName = "awardCertificate";
  photo1Str: string;

  imageUpload1() {
    this.photo1Str = "";


    var number = Math.floor(100000 + Math.random() * 900000);
    var fileExt = this.unitAwardFileURL1.name.split('.').pop();
    var url = "GM" + number + "." + fileExt;
    this.UnitAwardData.AWARD_CERTIFICATE = url;

    console.log("this.unitAwardFileURL1 ======= " + this.unitAwardFileURL1);
    console.log("this.UnitAwardData.AWARD_CERTIFICATE ======= " + this.UnitAwardData.AWARD_CERTIFICATE);

    if (this.unitAwardFileURL1) {

      this.api.onUploadMedia(this.folderName, this.unitAwardFileURL1, this.UnitAwardData.AWARD_CERTIFICATE).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");

          // this.fileURL1 = null;

        } else {
          console.log("Not Uploaded");
        }
      });

      this.photo1Str = this.UnitAwardData.AWARD_CERTIFICATE;

    } else {
      this.photo1Str = "";
    }

    this.unitAwardFileURL1 = null;
  }

}
