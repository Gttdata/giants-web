import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import {ServiceProjectSponsered} from 'src/app/Models/ServiceProjectSponsered';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import { CompressImageService } from 'src/app/Service/image-compressor.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-addserviceprojectsponsered',
  templateUrl: './addserviceprojectsponsered.component.html',
  styleUrls: ['./addserviceprojectsponsered.component.css']
})
export class AddserviceprojectsponseredComponent implements OnInit {
  @Input() drawerProjectSponsClose: Function;
  @Input() projectSponsTable: Function;
  @Input() ProjectSponsData: ServiceProjectSponsered = new ServiceProjectSponsered();
  @Input() drawerProjectSponsVisible: boolean;
  numberpattern = /^[6-9]\d{9}$/;
  isSpinning = false;
  isOk = true;
  @Output() projectSponsChild: EventEmitter<any> = new EventEmitter<any>();
  @Output() fUrl1: EventEmitter<any> = new EventEmitter<any>();


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

    if (this.ProjectSponsData.SPONSERED_PROJECT == undefined || this.ProjectSponsData.SPONSERED_PROJECT.toString() == '' || this.ProjectSponsData.SPONSERED_PROJECT == null || this.ProjectSponsData.SPONSERED_PROJECT.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter the Sponsored Name', '');
    }
    else if (this.ProjectSponsData.DATE_OF_INAGUARATION == undefined || this.ProjectSponsData.DATE_OF_INAGUARATION.toString() == '' || this.ProjectSponsData.DATE_OF_INAGUARATION == null) {
      this.isOk = false;
      this.message.error('Select the Inauguartion Date', '');
    }
    else if (this.ProjectSponsData.DESCRIPTION == undefined || this.ProjectSponsData.DESCRIPTION.toString() == '' || this.ProjectSponsData.DESCRIPTION == null || this.ProjectSponsData.DESCRIPTION.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter the Present Status', '');
    }

    if (this.isOk) {
      console.log("Project SponsData", this.ProjectSponsData);

      this.ProjectSponsData.DATE_OF_INAGUARATION = this.datePipe.transform(this.ProjectSponsData.DATE_OF_INAGUARATION, "yyyy-MM-dd");

      if (this.sponsorFileURL1 != null)
        this.imageUpload1();

      this.projectSponsTable();
      this.sponsorFileURL1 = null;

      // this.fUrl1.emit(this.sponsorFileURL1);
      this.ProjectSponsData= new ServiceProjectSponsered();
      this.drawerProjectSponsClose();
      this.isSpinning = false;
    }




    // if (!addNew)
    // this.close(myForm);
  }

  close(myForm: NgForm): void {
    this.drawerProjectSponsClose();
    // this.sponsorFileURL1 = null;
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

  sponsorFileURL1: any = null;

  clear1() {
    this.sponsorFileURL1 = null;
    this.ProjectSponsData.SPONSERED_CERTIFICATE = null;
  }


  onFileSelected1(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.sponsorFileURL1 = <File>event.target.files[0];

      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)

      this.compressImage.compress(event.target.files[0])
      .pipe(take(1))
      .subscribe(compressedImage => {
        console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
        // now you can do upload the compressed image 
        this.sponsorFileURL1=compressedImage;
      })

      // console.log("URLLLLL == " , this.sponsorFileURL1);
      

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.ProjectSponsData.SPONSERED_CERTIFICATE = reader.result as string;
        };
      }
      console.log("File URL1 = " + this.sponsorFileURL1);

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.sponsorFileURL1 = null;
    }
  }

  viewImage(imageName) {
    window.open(imageName);
  }

  SentUrl(addNew: boolean, myForm: NgForm): void {
    this.fUrl1.emit(this.sponsorFileURL1);
    this.close(myForm);
  }

  folderName = "sponsershipCertificate";
  photo1Str: string;

  imageUpload1() {
    this.photo1Str = "";


    var number = Math.floor(100000 + Math.random() * 900000);
    var fileExt = this.sponsorFileURL1.name.split('.').pop();
    var url = "GM" + number + "." + fileExt;
    this.ProjectSponsData.SPONSERED_CERTIFICATE = url;

    console.log("this.sponsorFileURL1 ======= " + this.sponsorFileURL1);
    console.log("this.UnitAwardData.AWARD_CERTIFICATE ======= " + this.ProjectSponsData.SPONSERED_CERTIFICATE);

    if (this.sponsorFileURL1) {

      this.api.onUploadMedia(this.folderName, this.sponsorFileURL1, this.ProjectSponsData.SPONSERED_CERTIFICATE).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");

          // this.fileURL1 = null;

        } else {
          console.log("Not Uploaded");
        }
      });

      this.photo1Str = this.ProjectSponsData.SPONSERED_CERTIFICATE;

    } else {
      this.photo1Str = "";
    }

    this.sponsorFileURL1 = null;
  }

}
