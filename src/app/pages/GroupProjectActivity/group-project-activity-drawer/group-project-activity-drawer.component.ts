import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { GroupActivityMaster } from 'src/app/Models/GroupActivityMaster';
import { ApiService } from 'src/app/Service/api.service';
import { NgForm } from '@angular/forms';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CookieService } from 'ngx-cookie-service';
import { ProjectMaster } from 'src/app/Models/ProjectMaster';
import { CompressImageService } from 'src/app/Service/image-compressor.service';
import { take } from 'rxjs/operators';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-group-project-activity-drawer',
  templateUrl: './group-project-activity-drawer.component.html',
  styleUrls: ['./group-project-activity-drawer.component.css']
})

export class GroupProjectActivityDrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: GroupActivityMaster;
  @Input() drawerVisible: boolean;
  isSpinning: boolean = false;
  namePattern = "([A-Za-z0-9 \s]){1,}";
  roleID: number = this.api.roleId;
  addDrawer: boolean = false;
  federationID = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID = Number(sessionStorage.getItem("UNIT_ID"));
  groupID = Number(sessionStorage.getItem("GROUP_ID"));
  homeFederationID = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
  homeUnitID = Number(sessionStorage.getItem("HOME_UNIT_ID"));
  homeGroupID = Number(sessionStorage.getItem("HOME_GROUP_ID"));

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '25rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
    ],
    customClasses: [],
    uploadUrl: '',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['fonts', 'uploadUrl'],
      [
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };

  constructor(private compressImage: CompressImageService, private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() {
    this.getGroups();
    this.getProjects();
  }

  hashtags: any[] = [];

  getHashtags(projectID: number): void {
    this.hashtags = [];
    this.data.HASHTAGS = undefined;

    this.api.getAllHashtags(0, 0, "NAME", "asc", " AND STATUS=1 AND PROJECT_ID=" + projectID).subscribe(data => {
      if (data['code'] == 200) {
        this.hashtags = data['data'];

        if (this.hashtags.length != 0) {
          let hashtags = "";

          for (var i = 0; i < this.hashtags.length; i++) {
            hashtags = hashtags + this.hashtags[i]["NAME"] + ',';
          }

          hashtags = hashtags.substring(0, hashtags.length - 1);
          this.data.HASHTAGS = hashtags.split(',');

        } else {
          // Fill default hashtags
          let defaultHashtags = this.api.defaultHashtags;
          defaultHashtags += "," + (sessionStorage.getItem("HOME_GROUP_NAME").trim().replace(/\s/g, "")) + "," + (sessionStorage.getItem("HOME_UNIT_NAME").trim().replace(/\s/g, "")) + "," + (sessionStorage.getItem("HOME_FEDERATION_NAME").trim().replace(/\s/g, ""));
          this.data.HASHTAGS = defaultHashtags.split(',');
        }
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  groups: any[] = [];

  getGroups(): void {
    var groupFilter = "";

    if (this.groupID != 0) {
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

  projects: any[] = [];

  getProjects(): void {
    this.api.getAllProjects(0, 0, "NAME", "asc", " AND STATUS=1 AND ID!=43").subscribe(data => {
      if (data['code'] == 200) {
        this.projects = data['data'];
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

  save(addNew: boolean, myForm: NgForm, status: string = "D"): void {
    var isOk = true;

    if (this.data.DATE == undefined || this.data.DATE == null) {
      isOk = false;
      this.message.error("Please Selct Valid Date", "");
    }

    if (this.data.FROM_TIME == undefined || this.data.FROM_TIME == null) {
      isOk = false;
      this.message.error('Please Select From Time', '');
    }

    if (this.data.TO_TIME == undefined || this.data.TO_TIME == null) {
      isOk = false;
      this.message.error('Please Select To Time', '');
    }

    if (this.data.FROM_TIME > this.data.TO_TIME) {
      isOk = false;
      this.message.error('Please Select Valid To Time', '');
    }

    if (this.data.EVENT_NAME != undefined && this.data.EVENT_NAME != null) {
      if (this.data.EVENT_NAME.trim() == '') {
        isOk = false;
        this.message.error("Please Enter Event Name", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Event Name", "");
    }

    if (this.data.VENUE != undefined && this.data.VENUE != null) {
      if (this.data.VENUE.trim() == '') {
        isOk = false;
        this.message.error("Please Enter Venue", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Venue", "");
    }

    // if (this.data.GROUP_ID == undefined || this.data.GROUP_ID == null) {
    //   isOk = false;
    //   this.message.error("Please Selct Valid Group", "");
    // }

    if (this.data.PROJECT_ID == undefined || this.data.PROJECT_ID == null) {
      isOk = false;
      this.message.error("Please Selct Valid Event Type", "");
    }

    // if (this.data.COUNT != undefined && this.data.COUNT != null) {
    //   if (this.data.COUNT.trim() == '') {
    //     isOk = false;
    //     this.message.error("Please Enter Valid Count", "");
    //   }

    // } else {
    //   isOk = false;
    //   this.message.error("Please Enter Valid Count", "");
    // }

    if ((this.data.DETAILS != undefined) && (this.data.DETAILS != null)) {
      if (this.data.DETAILS.trim() == '') {
        isOk = false;
        this.message.error("Please Enter Valid Event Details", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Event Details", "");
    }

    if (isOk) {
      this.isSpinning = true;
      let GoogleDATE = this.data.DATE;
      let GoogleFROM_TIME = this.data.FROM_TIME;
      let GoogleTO_TIME = this.data.TO_TIME;

      this.data.DATE = this.datePipe.transform(this.data.DATE, "yyyy-MM-dd");
      this.data.FROM_TIME = this.datePipe.transform(this.data.FROM_TIME, "HH:mm" + ":00");
      this.data.TO_TIME = this.datePipe.transform(this.data.TO_TIME, "HH:mm" + ":00");
      this.data.GROUP_ID = this.groupID;
      this.data.CREATOR_ID = this.api.userId;

      if (this.data.HASHTAGS != null) {
        this.data.HASHTAGS = this.data.HASHTAGS.toString();
      }

      if (status == "D") {
        this.data.STATUS = "D";

      } else if (status == "P") {
        this.data.STATUS = "P";
      }

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

      // Add to google calendar
      let Form = this.datePipe.transform(GoogleDATE, 'yyyyMMdd') + 'T' + this.datePipe.transform(GoogleFROM_TIME, 'HHmmss');
      let To = this.datePipe.transform(GoogleDATE, 'yyyyMMdd') + 'T' + this.datePipe.transform(GoogleTO_TIME, 'HHmmss');
      let currentDateTime: Date = new Date(this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
      let eventStartDateTime: Date = new Date(this.datePipe.transform(this.data.DATE, 'yyyy-MM-dd') + 'T' + this.data.FROM_TIME);

      if (this.data.ID) {
        this.api.updateGroupActivity(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Event Details Updated Successfully", "");
            this.isSpinning = false;

            if ((this.data.STATUS == "P") && (eventStartDateTime.getTime() > currentDateTime.getTime())) {
              this.GoogleCalender = "https://calendar.google.com/calendar/r/eventedit?text=" + this.data.EVENT_NAME + "&details=" + this.data.DETAILS + "&location=" + this.data.VENUE + "&dates=" + Form + "/" + To + "&ctz=Asia%2FKolkata";
              this.isVisible = true;
            }

            if (!addNew)
              this.close(myForm);

          } else {
            this.message.error("Event Details Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        if (this.federationID > 0) {
          this.data.FEDERATION_ID_TO_SHOW = this.homeFederationID;
        }

        if (this.unitID > 0) {
          this.data.UNIT_ID_TO_SHOW = this.homeUnitID;
        }

        if (this.groupID > 0) {
          this.data.GROUP_ID_TO_SHOW = this.homeGroupID;
        }

        this.api.createGroupActivity(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Event Created Successfully", "");
            this.isSpinning = false;

            if ((this.data.STATUS == "P") && (eventStartDateTime.getTime() > currentDateTime.getTime())) {
              this.GoogleCalender = "https://calendar.google.com/calendar/r/eventedit?text=" + this.data.EVENT_NAME + "&details=" + this.data.DETAILS + "&location=" + this.data.VENUE + "&dates=" + Form + "/" + To + "&ctz=Asia%2FKolkata";
              this.isVisible = true;
            }

            if (!addNew)
              this.close(myForm);

            else {
              this.data = new GroupActivityMaster();
            }

          } else {
            this.message.error("Event Creation Failed", "");
            this.isSpinning = false;
          }
        });
      }

      this.fileURL1 = null;
      this.originalFileURL1 = null;
      this.fileURL2 = null;
      this.originalFileURL2 = null;
      this.fileURL3 = null;
      this.originalFileURL3 = null;
      this.fileURL4 = null;
      this.originalFileURL4 = null;
      this.fileURL5 = null;
      this.originalFileURL5 = null;
      this.pdfFileURL1 = null;
      this.pdfFileURL2 = null;
    }
  }

  isVisible: boolean = false;
  GoogleCalender: string = "";

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }

  today = new Date().setDate(new Date().getDate());

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) > 0;

  fileURL1: any = null;
  fileURL2: any = null;
  fileURL3: any = null;
  fileURL4: any = null;
  fileURL5: any = null;
  originalFileURL1: any = null;
  originalFileURL2: any = null;
  originalFileURL3: any = null;
  originalFileURL4: any = null;
  originalFileURL5: any = null;

  clear1() {
    this.fileURL1 = null;
    this.originalFileURL1 = null;
    this.data.PHOTO1 = null;
    this.data.DESCRIPTION1 = null;
  }

  clear2() {
    this.fileURL2 = null;
    this.originalFileURL2 = null;
    this.data.PHOTO2 = null;
    this.data.DESCRIPTION2 = null;
  }

  clear3() {
    this.fileURL3 = null;
    this.originalFileURL3 = null;
    this.data.PHOTO3 = null;
    this.data.DESCRIPTION3 = null;
  }

  clear4() {
    this.fileURL4 = null;
    this.originalFileURL4 = null;
    this.data.PHOTO4 = null;
    this.data.DESCRIPTION4 = null;
  }

  clear5() {
    this.fileURL5 = null;
    this.originalFileURL5 = null;
    this.data.PHOTO5 = null;
    this.data.DESCRIPTION5 = null;
  }

  onFileSelected1(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL1 = <File>event.target.files[0];
      this.originalFileURL1 = <File>event.target.files[0];

      this.compressImage.compress(event.target.files[0]).pipe(take(1)).subscribe(compressedImage => {
        this.fileURL1 = compressedImage;
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
      this.originalFileURL1 = null;
    }
  }

  onFileSelected2(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL2 = <File>event.target.files[0];
      this.originalFileURL2 = <File>event.target.files[0];

      this.compressImage.compress(event.target.files[0]).pipe(take(1)).subscribe(compressedImage => {
        this.fileURL2 = compressedImage;
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
      this.originalFileURL2 = null;
    }
  }

  onFileSelected3(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL3 = <File>event.target.files[0];
      this.originalFileURL3 = <File>event.target.files[0];

      this.compressImage.compress(event.target.files[0]).pipe(take(1)).subscribe(compressedImage => {
        this.fileURL3 = compressedImage;
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
      this.originalFileURL3 = null;
    }
  }

  onFileSelected4(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL4 = <File>event.target.files[0];
      this.originalFileURL4 = <File>event.target.files[0];

      this.compressImage.compress(event.target.files[0]).pipe(take(1)).subscribe(compressedImage => {
        this.fileURL4 = compressedImage;
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
      this.originalFileURL4 = null;
    }
  }

  onFileSelected5(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL5 = <File>event.target.files[0];
      this.originalFileURL5 = <File>event.target.files[0];

      this.compressImage.compress(event.target.files[0]).pipe(take(1)).subscribe(compressedImage => {
        this.fileURL5 = compressedImage;
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
      this.originalFileURL5 = null;
    }
  }

  folderName: string = "groupActivity";
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
        var url = "GA" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL1, url, this.originalFileURL1).subscribe(res => {
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
        var url = "GA" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL1, url, this.originalFileURL1).subscribe(res => {
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
        var url = "GA" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL2, url, this.originalFileURL2).subscribe(res => {
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
        var url = "GA" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL2, url, this.originalFileURL2).subscribe(res => {
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
        var url = "GA" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL3, url, this.originalFileURL3).subscribe(res => {
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
        var url = "GA" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL3, url, this.originalFileURL3).subscribe(res => {
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
        var url = "GA" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL4, url, this.originalFileURL4).subscribe(res => {
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
        var url = "GA" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL4, url, this.originalFileURL4).subscribe(res => {
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
        var url = "GA" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL5, url, this.originalFileURL5).subscribe(res => {
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
        var url = "GA" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL5, url, this.originalFileURL5).subscribe(res => {
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
        var url = "GA" + number + "." + fileExt;

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
        var url = "GA" + number + "." + fileExt;

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
        var url = "GA" + number + "." + fileExt;

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
        var url = "GA" + number + "." + fileExt;

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
    window.open(this.api.retriveimgUrl + "groupActivity/" + pdfName);
  }

  viewImage(imageName) {
    window.open(imageName);
  }

  eventTypeDrawerVisible: boolean = false;
  eventTypeDrawerTitle: string;
  eventTypeDrawerData: ProjectMaster = new ProjectMaster();

  addEventType(): void {
    this.eventTypeDrawerTitle = "aaa " + "Add Event Type";
    this.eventTypeDrawerData = new ProjectMaster();
    this.eventTypeDrawerVisible = true;
    this.eventTypeDrawerData.STATUS = true;
  }

  eventTypeDrawerClose(): void {
    this.getProjects();
    this.eventTypeDrawerVisible = false;
  }

  get eventTypeDrawerCloseCallback() {
    return this.eventTypeDrawerClose.bind(this);
  }

  previewModalVisible: boolean = false;

  previewModalOpen() {
    this.previewModalVisible = true;
  }

  previewModalCancel() {
    this.previewModalVisible = false;
  }

  getImageCount(photoURL1: string, photoURL2: string, photoURL3: string, photoURL4: string, photoURL5: string) {
    let count: number = 0;
    photoURL1 = photoURL1 ? photoURL1 : "";
    photoURL2 = photoURL2 ? photoURL2 : "";
    photoURL3 = photoURL3 ? photoURL3 : "";
    photoURL4 = photoURL4 ? photoURL4 : "";
    photoURL5 = photoURL5 ? photoURL5 : "";

    if (photoURL1.trim() != "")
      count = count + 1;

    if (photoURL2.trim() != "")
      count = count + 1;

    if (photoURL3.trim() != "")
      count = count + 1;

    if (photoURL4.trim() != "")
      count = count + 1;

    if (photoURL5.trim() != "")
      count = count + 1;

    return count;
  }

  GIANTS_WEEK_START_DATE: Date = null;
  GIANTS_WEEK_END_DATE: Date = null;
  CELEBRATION_WEEK_TITLE: boolean = false;
  CELEBRATION_CHECK_BOX: boolean = false;
  CURRENT_DATE: Date = new Date();

  celebrationWeekTitle(): void {
    let currentDate = new Date(this.datePipe.transform(this.CURRENT_DATE, "yyyy-MM-dd 00:00:00"));
    let weekEndDate = new Date(this.datePipe.transform(this.GIANTS_WEEK_END_DATE, "yyyy-MM-dd 00:00:00"));

    if ((currentDate.getTime() <= weekEndDate.getTime())) {
      this.CELEBRATION_WEEK_TITLE = true;

    } else {
      this.CELEBRATION_WEEK_TITLE = false;
    }
  }

  celebrationCheckBox(): void {
    let currentDate = new Date(this.datePipe.transform(this.CURRENT_DATE, "yyyy-MM-dd 00:00:00"));
    let weekStartDate = new Date(this.datePipe.transform(this.GIANTS_WEEK_START_DATE, "yyyy-MM-dd 00:00:00"));
    let weekEndDate = new Date(this.datePipe.transform(this.GIANTS_WEEK_END_DATE, "yyyy-MM-dd 00:00:00"));

    if ((currentDate.getTime() >= weekStartDate.getTime()) && (currentDate.getTime() <= weekEndDate.getTime())) {
      this.CELEBRATION_CHECK_BOX = true;
      this.data.IS_GIANTS_CELEBRATION_EVENT = true;

    } else {
      this.CELEBRATION_CHECK_BOX = false;
      this.data.IS_GIANTS_CELEBRATION_EVENT = false;
    }
  }

  onEventDateChange(date: Date): void {
    if (date) {
      this.CURRENT_DATE = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      this.celebrationWeekTitle();
      this.celebrationCheckBox();
    }
  }
}
