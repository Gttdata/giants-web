import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { ApiService } from 'src/app/Service/api.service';
import { GroupMeetAttendance } from 'src/app/Models/GroupMeetAttendance';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { CompressImageService } from 'src/app/Service/image-compressor.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-groupmeetingsend',
  templateUrl: './groupmeetingsend.component.html',
  styleUrls: ['./groupmeetingsend.component.css']
})
export class GroupmeetingsendComponent implements OnInit {

  @Input() drawerClose!: Function;
  @Input() data: GroupMeetAttendance = new GroupMeetAttendance();
  @Input() drawerVisible: boolean = false;
  isSpinning = false;
  isOk = true;
  posnopatt = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
  emailpattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  namepatt = /^[a-zA-Z \-\']+/
  mobpattern = /^[6-9]\d{9}$/
  today = new Date();
  START_TIME: any = null;
  END_TIME: any = null;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  federationID = this._cookie.get("FEDERATION_ID");
  unitID = this._cookie.get("UNIT_ID");
  groupID = this._cookie.get("GROUP_ID");
  roleID: number = this.api.roleId;

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService,
    private compressImage: CompressImageService) { }

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) < 0;

  ngOnInit(): void {
    this.getGroups();
  }

  groups = [];

  getGroups() {
    var groupFilter = "";
    if (this.groupID != "0") {
      groupFilter = " AND ID=" + this.groupID;
    }

    this.groups = [];

    this.api.getAllGroups(0, 0, "NAME", "asc", " AND STATUS=1" + groupFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.groups = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  save(addNew: boolean, myForm: NgForm): void {
    this.isOk = true;
    this.isSpinning = false;

    if (this.data.GROUP_ID == undefined || this.data.GROUP_ID == null) {
      this.isOk = false;
      this.message.error("Please Selct Valid Group", "");
    }

    if (this.data.DATE == undefined || this.data.DATE == null) {
      this.isOk = false;
      this.message.error('Please Select Date', '');
    }

    if (this.data.FROM_TIME == undefined || this.data.FROM_TIME == null) {
      this.isOk = false;
      this.message.error('Please Select From Time', '');
    }

    if (this.data.TO_TIME == undefined || this.data.TO_TIME == null) {
      this.isOk = false;
      this.message.error('Please Select To Time', '');
    }

    if ((this.data.MEETING_NUMBER != undefined) && (this.data.MEETING_NUMBER != null)) {
      if (this.data.MEETING_NUMBER.trim() == '') {
        this.isOk = false;
        this.message.error('Please Enter Valid Meeting Number', '');
      }

    } else {
      this.isOk = false;
      this.message.error('Please Enter Meeting Number', '');
    }

    if ((this.data.MEETING_SUB != undefined) && (this.data.MEETING_SUB != null)) {
      if (this.data.MEETING_SUB.trim() == '') {
        this.isOk = false;
        this.message.error('Please Enter Valid Meeting Subject', '');
      }

    } else {
      this.isOk = false;
      this.message.error('Please Enter Meeting Subject', '');
    }

    if ((this.data.AGENDA != undefined) && (this.data.AGENDA != null)) {
      if (this.data.AGENDA.trim() == '') {
        this.isOk = false;
        this.message.error('Please Enter Valid Meeting Agenda', '');
      }

    } else {
      this.isOk = false;
      this.message.error('Please Enter Meeting Agenda', '');
    }

    if ((this.data.MINUTES != undefined) && (this.data.MINUTES != null)) {
      if (this.data.MINUTES.trim() == '') {
        this.isOk = false;
        this.message.error('Please Enter Valid Minutes', '');
      }

    } else {
      this.isOk = false;
      this.message.error('Please Enter Minutes', '');
    }

    if (this.isOk) {
      this.isSpinning = true;

      this.imageUpload1();
      this.data.PHOTO1 = (this.photo1Str == "") ? " " : this.photo1Str;

      this.imageUpload2();
      this.data.PHOTO2 = (this.photo2Str == "") ? " " : this.photo2Str;

      this.imageUpload3();
      this.data.PHOTO3 = (this.photo3Str == "") ? " " : this.photo3Str;

      this.imageUpload4();
      this.data.PHOTO4 = (this.photo4Str == "") ? " " : this.photo4Str;

      this.imageUpload5();
      this.data.PHOTO5 = (this.photo5Str == "") ? " " : this.photo5Str;

      this.pdfUpload1();
      this.data.PDF1 = (this.pdf1Str == "") ? " " : this.pdf1Str;

      this.pdfUpload2();
      this.data.PDF2 = (this.pdf2Str == "") ? " " : this.pdf2Str;

      this.data.DATE = this.datePipe.transform(this.data.DATE, "yyyy-MM-dd");
      this.data.FROM_TIME = this.datePipe.transform(this.data.FROM_TIME, "HH:mm" + ":00");
      this.data.TO_TIME = this.datePipe.transform(this.data.TO_TIME, "HH:mm" + ":00");

      if (this.data.ID) {
        this.api.updategroupMeeting(this.data).subscribe(successCode => {
          if (successCode["code"] == 200) {
            this.message.success("Group Meeting Updated Successfully", "");
            this.isSpinning = false;

            if (!addNew)
              this.close(myForm);

          } else {
            this.message.error("Group Meeting Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.api.creategroupMeeting(this.data).subscribe(successCode => {
          if (successCode["code"] == 200) {
            this.message.success("Group Meeting Created Successfully", "");
            this.isSpinning = false;

            if (!addNew)
              this.close(myForm);

            else {
              this.data = new GroupMeetAttendance();
            }

          } else {
            this.message.error("Group Meeting Creation Failed", "");
            this.isSpinning = false;
          }
        });
      }

      this.fileURL1 = null;
      this.fileURL2 = null;
      this.fileURL3 = null;
      this.fileURL4 = null;
      this.fileURL5 = null;
      this.pdfFileURL1 = null;
      this.pdfFileURL2 = null;
    }
  }

  fileURL1: any = null;
  fileURL2: any = null;
  fileURL3: any = null;
  fileURL4: any = null;
  fileURL5: any = null;

  clear1() {
    this.fileURL1 = null;
    this.data.PHOTO1 = null;
    this.data.DESCRIPTION1 = null;
  }

  clear2() {
    this.fileURL2 = null;
    this.data.PHOTO2 = null;
    this.data.DESCRIPTION2 = null;
  }

  clear3() {
    this.fileURL3 = null;
    this.data.PHOTO3 = null;
    this.data.DESCRIPTION3 = null;
  }

  clear4() {
    this.fileURL4 = null;
    this.data.PHOTO4 = null;
    this.data.DESCRIPTION4 = null;
  }

  clear5() {
    this.fileURL5 = null;
    this.data.PHOTO5 = null;
    this.data.DESCRIPTION5 = null;
  }

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

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.data.PHOTO1 = reader.result as string;
        };
      }

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

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.data.PHOTO2 = reader.result as string;
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

      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)

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
          this.data.PHOTO3 = reader.result as string;
        };
      }
    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL3 = null;
    }
  }

  onFileSelected4(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL4 = <File>event.target.files[0];

      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)

      this.compressImage.compress(event.target.files[0])
      .pipe(take(1))
      .subscribe(compressedImage => {
        console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
        // now you can do upload the compressed image 
        this.fileURL4=compressedImage;
      })

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.data.PHOTO4 = reader.result as string;
        };
      }
    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL4 = null;
    }
  }

  onFileSelected5(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL5 = <File>event.target.files[0];

      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)

      this.compressImage.compress(event.target.files[0])
      .pipe(take(1))
      .subscribe(compressedImage => {
        console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
        // now you can do upload the compressed image 
        this.fileURL5=compressedImage;
      })

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.data.PHOTO5 = reader.result as string;
        };
      }
    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL5 = null;
    }
  }

  folderName = "groupMeeting";
  photo1Str: string;
  photo2Str: string;
  photo3Str: string;
  photo4Str: string;
  photo5Str: string;

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
        if (this.data.PHOTO1) {
          let photoURL = this.data.PHOTO1.split("/");
          this.photo1Str = photoURL[photoURL.length - 1];

        } else
          this.photo1Str = "";
      }
    }
  }

  imageUpload2() {
    this.photo2Str = "";

    if (!this.data.ID) {
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

        this.photo2Str = url;

      } else {
        this.photo2Str = "";
      }

    } else {
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

        this.photo2Str = url;

      } else {
        if (this.data.PHOTO2) {
          let photoURL = this.data.PHOTO2.split("/");
          this.photo2Str = photoURL[photoURL.length - 1];

        } else
          this.photo2Str = "";
      }
    }
  }

  imageUpload3() {
    this.photo3Str = "";

    if (!this.data.ID) {
      if (this.fileURL3) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL3.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

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
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL3, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo3Str = url;

      } else {
        if (this.data.PHOTO3) {
          let photoURL = this.data.PHOTO3.split("/");
          this.photo3Str = photoURL[photoURL.length - 1];

        } else
          this.photo3Str = "";
      }
    }
  }

  imageUpload4() {
    this.photo4Str = "";

    if (!this.data.ID) {
      if (this.fileURL4) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL4.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

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
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL4, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo4Str = url;

      } else {
        if (this.data.PHOTO4) {
          let photoURL = this.data.PHOTO4.split("/");
          this.photo4Str = photoURL[photoURL.length - 1];

        } else
          this.photo4Str = "";
      }
    }
  }

  imageUpload5() {
    this.photo5Str = "";

    if (!this.data.ID) {
      if (this.fileURL5) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL5.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

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
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL5, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo5Str = url;

      } else {
        if (this.data.PHOTO5) {
          let photoURL = this.data.PHOTO5.split("/");
          this.photo5Str = photoURL[photoURL.length - 1];

        } else
          this.photo5Str = "";
      }
    }
  }

  cancel() { }

  pdfFileURL1: any = null;
  pdfFileURL2: any = null;
  pdf1Str: string;
  pdf2Str: string;

  onPdfFileSelected1(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.pdfFileURL1 = <File>event.target.files[0];

    } else {
      this.message.error('Please Choose Only pdf File', '');
      this.pdfFileURL1 = null;
    }
  }

  onPdfFileSelected2(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.pdfFileURL2 = <File>event.target.files[0];

    } else {
      this.message.error('Please Choose Only pdf File', '');
      this.pdfFileURL2 = null;
    }
  }

  pdfUpload1() {
    this.pdf1Str = "";

    if (!this.data.ID) {
      if (this.pdfFileURL1) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.pdfFileURL1.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

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
        var fileExt = this.pdfFileURL1.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.pdfFileURL1, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.pdf1Str = url;

      } else {
        if (this.data.PDF1) {
          let pdfURL = this.data.PDF1.split("/");
          this.pdf1Str = pdfURL[pdfURL.length - 1];

        } else
          this.pdf1Str = "";
      }
    }
  }

  pdfUpload2() {
    this.pdf2Str = "";

    if (!this.data.ID) {
      if (this.pdfFileURL2) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.pdfFileURL2.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.pdfFileURL2, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.pdf2Str = url;

      } else {
        this.pdf2Str = "";
      }

    } else {
      if (this.pdfFileURL2) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.pdfFileURL2.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.pdfFileURL2, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.pdf2Str = url;

      } else {
        if (this.data.PDF2) {
          let pdfURL = this.data.PDF2.split("/");
          this.pdf2Str = pdfURL[pdfURL.length - 1];

        } else
          this.pdf2Str = "";
      }
    }
  }

  pdfClear1() {
    this.pdfFileURL1 = null;
    this.data.PDF1 = null;
  }

  pdfClear2() {
    this.pdfFileURL2 = null;
    this.data.PDF2 = null;
  }

  viewPDF(pdfName) {
    window.open(this.api.retriveimgUrl + "groupMeeting/" + pdfName);
  }

  viewImage(imageName) {
    window.open(imageName);
  }

}
