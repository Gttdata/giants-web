import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { LetterHeadMaster } from 'src/app/Models/LetterHeadMaster';
import { ApiService } from 'src/app/Service/api.service';
import { take } from 'rxjs/operators';
import { CompressImageService } from 'src/app/Service/image-compressor.service';

@Component({
  selector: 'app-addletterhead',
  templateUrl: './addletterhead.component.html',
  styleUrls: ['./addletterhead.component.css']
})
export class AddletterheadComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: LetterHeadMaster = new LetterHeadMaster();
  @Input() drawerVisible: boolean = false;

  isSpinning = false;
  isOk = true;


  constructor(public api: ApiService,private message: NzNotificationService,private compressImage: CompressImageService) { }

  ngOnInit() {
    
  }

  save(addNew: boolean, myForm: NgForm){
    this.isOk = true;
    this.isSpinning = false;

    if (this.isOk){
      this.imageUpload1();
      this.data.TEMPLATE_URL = (this.photo1Str == "") ? " " : this.photo1Str;

      if (this.data.ID) {
        this.api.updateLetterHead(this.data).subscribe(successCode => {
          if (successCode["code"] == 200) {
            this.message.success("Letter Head Details Updated Successfully", "");
            this.isSpinning = false;

            if (!addNew)
              this.close(myForm);

          } else {
            this.message.error("Letter Head Details Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.api.createLetterHead(this.data).subscribe(successCode => {
          if (successCode["code"] == 200) {
            this.message.success("Letter Head Details Created Successfully", "");
            this.isSpinning = false;

            if (!addNew)
              this.close(myForm);

            else {
              this.data = new LetterHeadMaster();
            }

          } else {
            this.message.error("Letter Head Details Creation Failed", "");
            this.isSpinning = false;
          }
        });
      }

      this.fileURL1 = null;
    }
  }

  close(myForm: NgForm): void {
    this.fileURL1 = null;
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  cancel() { 
    this.fileURL1 = null
  }

  fileURL1: any = null;

  onFileSelected1(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL1 = <File>event.target.files[0];
      console.log(`Image Size before compressed : ${event.target.files[0].size}bytes.`);
      this.compressImage.compress(event.target.files[0])
        .pipe(take(1))
        .subscribe(compressedImage => {
          console.log(`Image Size After Compressed:${compressedImage.size} bytes.`)
          this.fileURL1 = compressedImage;
        });
      console.log("Compressed Image", this.fileURL1);
      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.data.TEMPLATE_URL = reader.result as string;
        };
      }

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL1 = null;
    }
  }
  clear1() {
    this.fileURL1 = null;
    this.data.TEMPLATE_URL = null;
    this.data.DESCRIPTION = null;
  }

  folderName = "templateImages";
  photo1Str: string;

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
        if (this.data.TEMPLATE_URL) {
          let photoURL = this.data.TEMPLATE_URL.split("/");
          this.photo1Str = photoURL[photoURL.length - 1];

        } else
          this.photo1Str = "";
      }
    }
  }
}
