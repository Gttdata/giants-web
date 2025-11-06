import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { take } from 'rxjs/operators';
import { PublicityWithPressModel } from 'src/app/Models/GiantWeekCelebration';
import { ApiService } from 'src/app/Service/api.service';
import { CompressImageService } from 'src/app/Service/image-compressor.service';

@Component({
  selector: 'app-publicity-with-press-drawer',
  templateUrl: './publicity-with-press-drawer.component.html',
  styleUrls: ['./publicity-with-press-drawer.component.css']
})
export class PublicityWithPressDrawerComponent implements OnInit {

  @Input() drawerClose!: Function;
  @Input() drawerVisible: boolean = false;
  @Input() data: PublicityWithPressModel = new PublicityWithPressModel();
  @Input() drawerWeekdataArray: any[];
  @Input() isRemarkVisible: boolean;
  @Input() closePublicity: Function
  @Input() PublicitySaveInTable: Function;
  @Input() ArrayPublicitySaveInTable: any[] = [];
  @Output() Furlpb: EventEmitter<any> = new EventEmitter<any>();

  constructor(public api: ApiService, private message: NzNotificationService, private compressImage: CompressImageService) { }
  validation = true;

  ngOnInit() {
  }
  close() {
    this.drawerVisible = false
    // this.reset(myForm);
    this.closePublicity();
  }
  // save(addNew: boolean, myForm: NgForm) {
  //   this.validation = false;
  //   if (this.data.TITLE.trim() == '' || this.data.TITLE == undefined) {
  //     this.message.error("Please Enter Project Title", "");
  //   }
  //   else if (this.data.NEWS_PAPER_NAME.trim() == '' || this.data.NEWS_PAPER_NAME == undefined) {
  //     this.message.error("Please Enter News Paper Name", "");
  //   }
  //   else {
  //     this.validation = true;
  //     this.imageUpload1();
  //     this.data.PHOTO_URL = (this.photo1Str == "") ? " " : this.photo1Str;
  //     this.PublicitySaveInTable();
  //     this.close(myForm);
  //   }
  // }

  isOk: boolean = true;
  isSpinning: boolean = false;
  save(addNew: boolean) {
    this.isSpinning = false;
    this.isOk = true;

    if (this.data.TITLE.trim() == '' || this.data.TITLE == undefined) {
      this.message.error("Please Enter Project Title", "");
    }
    else if (this.data.NEWS_PAPER_NAME.trim() == '' || this.data.NEWS_PAPER_NAME == undefined) {
      this.message.error("Please Enter News Paper Name", "");
    }

    if (this.isOk) {
      if (this.fileURL1 != null)
        this.imageUpload1();
      this.PublicitySaveInTable();
      this.fileURL1 = null;
      this.data = new PublicityWithPressModel();
      this.closePublicity();
      this.isSpinning = false;
    }
  }
  fileURL1 = null;
  // folderName1 = "publicityPressImages";
  photo1Str: string;
  // PhotoUrl = this.api.retriveimgUrl + "publicityPressImages";
  clear1() {
    this.fileURL1 = null;
    this.data.PHOTO_URL = '';
  }
  // imageUpload1() {
  //   this.photo1Str = "";
  //   if (!this.data.ID) {
  //     if (this.fileURL1) {
  //       var number = Math.floor(100000 + Math.random() * 900000);
  //       var fileExt = this.fileURL1.name.split('.').pop();
  //       var url = "GM" + number + "." + fileExt;
  //       this.api.onUpload2(this.folderName1, this.fileURL1, url).subscribe(res => {
  //         if (res["code"] == 200) {
  //           console.log("Uploaded");
  //         } else {
  //           console.log("Not Uploaded");
  //         }
  //       });
  //       this.photo1Str = url;
  //     } else {
  //       this.photo1Str = "";
  //     }
  //   } else {
  //     if (this.fileURL1) {
  //       var number = Math.floor(100000 + Math.random() * 900000);
  //       var fileExt = this.fileURL1.name.split('.').pop();
  //       var url = "GM" + number + "." + fileExt;
  //       this.api.onUpload2(this.folderName1, this.fileURL1, url).subscribe(res => {
  //         if (res["code"] == 200) {
  //           console.log("Uploaded");
  //         } else {
  //           console.log("Not Uploaded");
  //         }
  //       });
  //       this.photo1Str = url;
  //     } else {
  //       if (this.data.PHOTO_URL) {
  //         let photoURL = this.data.PHOTO_URL.split("/");
  //         this.photo1Str = photoURL[photoURL.length - 1];
  //       } else
  //         this.photo1Str = "";
  //     }
  //   }
  // }

  viewImage(imageName) {
    window.open(imageName);
  }

  SentUrl(addNew: boolean, myForm: NgForm): void {
    this.Furlpb.emit(this.Furlpb);
    this.close();
  }

  folderName = 'publicityPressImages'
  imageUpload1() {
    this.photo1Str = "";
    var number = Math.floor(100000 + Math.random() * 900000);
    var fileExt = this.fileURL1.name.split('.').pop();
    var url = "GM" + number + "." + fileExt;
    this.data.PHOTO_URL = url;
    console.log("this.fileURL1 ======= " + this.fileURL1);
    console.log("this.data.PHOTO_URL_1 ======= " + this.data.PHOTO_URL);
    if (this.fileURL1) {
      this.api.onUpload2(this.folderName, this.fileURL1, this.data.PHOTO_URL).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");
        } else {
          console.log("Not Uploaded");
        }
      });
      this.photo1Str = this.data.PHOTO_URL;
    } else {
      this.photo1Str = "";
    }
    this.fileURL1 = null;
  }

  // onFileSelected1(event: any) {
  //   if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
  //     this.fileURL1 = <File>event.target.files[0];
  //     console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)
  //       this.compressImage.compress(event.target.files[0]).pipe(take(1)).
  //         subscribe(compressedImage => {
  //           console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
  //           this.fileURL1 = compressedImage;
  //         })
  //     const reader = new FileReader();
  //     if (event.target.files && event.target.files.length) {
  //       const [file] = event.target.files;
  //       reader.readAsDataURL(file);
  //       reader.onload = () => {
  //         this.data.PHOTO_URL = reader.result as string;
  //       };
  //     }
  //   } else {
  //     this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
  //     this.fileURL1 = null;
  //   }
  // }

  onFileSelected1(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL1 = <File>event.target.files[0];
      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)
      this.compressImage.compress(event.target.files[0])
        .pipe(take(1))
        .subscribe(compressedImage => {
          console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
          // now you can do upload the compressed image 
          this.fileURL1 = compressedImage;
        })
      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.data.PHOTO_URL = reader.result as string;
        };
      }
      console.log("File URL1 = " + this.fileURL1);
    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL1 = null;
    }
  }
  cancel() {

  }

}
