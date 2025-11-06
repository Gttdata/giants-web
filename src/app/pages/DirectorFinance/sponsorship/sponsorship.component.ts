import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { Sponsormaster } from 'src/app/Models/Sponsorship';
import { DatePipe } from '@angular/common';
import { ApiService } from 'src/app/Service/api.service';
import { CompressImageService } from 'src/app/Service/image-compressor.service';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-sponsorship',
  templateUrl: './sponsorship.component.html',
  styleUrls: ['./sponsorship.component.css']
})

export class SponsorshipComponent implements OnInit {
  @Input() drawerClose1: Function;
  @Input() data1: Sponsormaster;
  @Input() drawerVisible2: boolean=false;
  @Input() closeDrawer0: Function;
  validation=true;
  addDrawer: boolean = false;
  myForm1: any;
  listData: any[] = [];
  fileName = "";
  fileURL2?: any;
  photo1Str: string;
  @Output() updateDataEvent = new EventEmitter();
  drawerData1: any;
  pdfBufferRender;

  constructor(private message: NzNotificationService, private datePipe: DatePipe, private api: ApiService,private compressImage:CompressImageService) { }

  ngOnInit() {
    this.data1.CERTIFICATE_URL
  }

  listofData() {
    return this.listData = [
      ...this.listData, {
        sponsor: this.data1.SPONSERSHIP_DETAILS,
        date: this.data1.SPONSER_DATE,
        file: this.data1.CERTIFICATE_URL
      }
    ]
  }

  PhotoUrl2 = this.api.retriveimgUrl + "financeCertificate";

  close(): void {
    this.drawerVisible2=false
    this.drawerClose1();
    this.fileURL2 = null;
    this.data1.CERTIFICATE_URL = '';
  }

folderName = "financeCertificate";

imageUpload1() {
    this.photo1Str = "";

    if (!this.data1.ID) {
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

        this.photo1Str = url;

      } else {
        this.photo1Str = "";
      }

    } else {
      if (this.fileURL2) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL2.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;
        console.log(this.fileURL2);

        this.api.onUpload2(this.folderName, this.fileURL2, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo1Str = url;

      } else {
        if (this.data1.CERTIFICATE_URL) {
          let photoURL = this.data1.CERTIFICATE_URL.split("/");
          this.photo1Str = photoURL[photoURL.length - 1];

        } else
          this.photo1Str = "";
      }
    }
  }
 
  onPdfFileSelected2(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png' || event.target.files[0].type == 'application/pdf') {
      this.fileURL2 = <File>event.target.files[0];
      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)      
      this.compressImage.compress(event.target.files[0])     
      .pipe(take(1))      
      .subscribe(compressedImage => {        
        console.log(`Image size after compressed: ${compressedImage.size} bytes.`)        
        // now you can do upload the compressed image         
        this.fileURL2=compressedImage;      
      })      
      console.log("compressed image == " , this.fileURL2);   
      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.data1.CERTIFICATE_URL = reader.result as string;
        };
      }
    } else {
        this.message.error('Please Choose Only JPEG/ JPG/ PNG /pdf File', '');
        this.fileURL2 = null;
      }
  }
  pdfClear1() {
    this.fileURL2 = null;
    this.data1.CERTIFICATE_URL = null;
  }
  viewImage2(photoUrl: string) {
    window.open(this.api.retriveimgUrl + "financeCertificate/" + photoUrl);
console.log( window.open)
  }
// viewImage2(imageName) {
//   window.open(imageName);
// }


  save(myForm1: any) {
    this.validation=false;
  // this.drawerClose1();
  if (this.data1.SPONSERSHIP_DETAILS == undefined || this.data1.SPONSERSHIP_DETAILS == null || this.data1.SPONSERSHIP_DETAILS.trim() == '') {
      this.message.error("Please add SPONSOR", "");
  }
   else if(this.data1.SPONSER_DATE == undefined || this.data1.SPONSER_DATE== null) {
    this.message.error("Please Selct Valid Sponsor Date", "");
  }
  else if(this.data1.CERTIFICATE_URL == "" ||  this.data1.CERTIFICATE_URL==undefined){
    this.message.error("Please Choose File","");
  }
   else{
    this.validation=true;
      this.data1.SPONSER_DATE = this.datePipe.transform(this.data1.SPONSER_DATE, "yyyy-MM-dd");
      this.imageUpload1();
      this.data1.CERTIFICATE_URL = (this.photo1Str == "") ? " " : this.photo1Str;
      this.updateDataEvent.emit(this.data1);
      this.drawerClose1();
    }
  }


  handleChange(info: any): void {
    console.log(info.file);
    this.fileName = info.file.name;
  }

}
