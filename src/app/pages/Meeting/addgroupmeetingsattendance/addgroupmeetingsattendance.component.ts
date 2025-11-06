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
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { programmeTypeMaster } from 'src/app/Models/programmeTypeMaster';

@Component({
  selector: 'app-addgroupmeetingsattendance',
  templateUrl: './addgroupmeetingsattendance.component.html',
  styleUrls: ['./addgroupmeetingsattendance.component.css']
})

export class AddgroupmeetingsattendanceComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: GroupMeetAttendance = new GroupMeetAttendance();
  @Input() drawerVisible: boolean = false;
  isSpinning: boolean = false;
  isOk: boolean = true;
  posnopatt = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
  emailpattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  namepatt = /^[a-zA-Z \-\']+/
  mobpattern = /^[6-9]\d{9}$/
  today = new Date();
  START_TIME: any = null;
  END_TIME: any = null;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);
  federationID = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID = Number(sessionStorage.getItem("UNIT_ID"));
  groupID = Number(sessionStorage.getItem("GROUP_ID"));
  homeFederationID = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
  homeUnitID = Number(sessionStorage.getItem("HOME_UNIT_ID"));
  homeGroupID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
  roleID: number = this.api.roleId;
  addDrawer: boolean = false;
  uploadMinutes: boolean = false;

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

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) < 0;

  ngOnInit(): void {
    this.getProgrammeTypes();
    this.getCurrentGroups();
  }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  Facebookurl = '';
  // var abc = "https://www.google.com/calendar/render?action=TEMPLATE&text=Your+Event+Name&dates=20140127T224000Z/20140320T221500Z&details=For+details,+link+here:+http://www.example.com&location=Waldorf+Astoria,+301+Park+Ave+,+New+York,+NY+10022&sf=true&output=xml";
  // var ac = "https://calendar.google.com/calendar/u/0/r/eventedit?text=Event+Title&details=Example+of+some+description.+See+more+at+https://stackoverflow.com/questions/10488831/link-to-add-to-google-calendar&location=123+Some+Place,+City&dates=20200222T150000Z/20200222T163000Z";
  GoogleCalender = '';
  GoogleDATE: any;
  GoogleFROM_TIME: any;
  GoogleTO_TIME: any;
  Email = '';
  MEETING_ID: number;
  GROUP_ID: number;
  drawerData2 = [];

  // GoogleMAP(): void {
  //   this.drawerData2 = [];
  //   this.GROUP_ID = Number(this._cookie.get("HOME_GROUP_ID"));

  //   this.api.getAllgroupMeetingAttendanceDetails(this.MEETING_ID, this.GROUP_ID).subscribe(data => {
  //     if (data['code'] == '200') {
  //       for (let i = 0; i < data['count']; i++) {
  //         this.drawerData2 = [...this.drawerData2, ...data['data'][i]['EMAIL_ID']];
  //       console.log(data['data'][i]['EMAIL_ID']);
  //       }
  //     }

  //   }, err => {
  //     if (err['ok'] == false)
  //       this.message.error("Server Not Found", "");
  //   });

  //   this.Email = this.drawerData2.toString();
  //   console.log("emails",this.drawerData2);
  // }

  save(addNew: boolean, myForm: NgForm, status: string = "D"): void {
    this.isOk = true;
    this.isSpinning = false;

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

    if (this.data.TYPE_OF_MEET == undefined || this.data.TYPE_OF_MEET == null) {
      this.isOk = false;
      this.message.error('Please Select Meeting Type', '');
    }

    if (this.data.FROM_TIME > this.data.TO_TIME) {
      this.isOk = false;
      this.message.error('Please Select Valid To Time', '');
    }

    if (this.data.VENUE != undefined && this.data.VENUE != null) {
      if (this.data.VENUE.trim() == '') {
        this.isOk = false;
        this.message.error("Please Enter Venue", "");
      }

    } else {
      this.isOk = false;
      this.message.error("Please Enter Valid Venue", "");
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

    if (this.uploadMinutes) {
      if ((this.data.MINUTES != undefined) && (this.data.MINUTES != null)) {
        if (this.data.MINUTES.trim() == '') {
          this.isOk = false;
          this.message.error('Please Enter Valid Minutes', '');
        }

      } else {
        this.isOk = false;
        this.message.error('Please Enter Minutes', '');
      }
    }

    // if (this.data.MEETING_TYPE == "F") {
    //   if ((this.data.TYPE_ID == undefined) || (this.data.TYPE_ID == null) || (this.data.TYPE_ID.length == 0)) {
    //     this.isOk = false;
    //     this.message.error("Please Select Valid Federation(s)", "");
    //   }
    // }

    // if (this.data.MEETING_TYPE == "U") {
    //   if ((this.data.TYPE_ID == undefined) || (this.data.TYPE_ID == null) || (this.data.TYPE_ID.length == 0)) {
    //     this.isOk = false;
    //     this.message.error("Please Select Valid Unit(s)", "");
    //   }
    // }

    // if (this.data.MEETING_TYPE == "G") {
    //   if ((this.data.TYPE_ID == undefined) || (this.data.TYPE_ID == null) || (this.data.TYPE_ID.length == 0)) {
    //     this.isOk = false;
    //     this.message.error("Please Select Valid Group(s)", "");
    //   }
    // }

    if (this.data.IS_HOSTED) {
      if ((this.data.HOSTING_LEVEL == undefined) || (this.data.HOSTING_LEVEL == null)) {
        this.isOk = false;
        this.message.error("Please Select Valid Hosting Level", "");
      }

      if ((this.data.HOSTING_LEVEL == undefined) || (this.data.HOSTING_LEVEL == null) || (this.data.HOSTED_BY_GROUP_IDS.length == 0)) {
        this.isOk = false;
        this.message.error("Please Select Valid Hosted By Group(s)", "");
      }

      if ((this.data.HOSTED_PROGRAMME_ID == undefined) || (this.data.HOSTED_PROGRAMME_ID == null)) {
        this.isOk = false;
        this.message.error("Please Select Valid Programme Type", "");
      }

    } else {
      this.data.HOSTING_LEVEL = " ";
      this.data.HOSTED_BY_GROUP_IDS = "0";
      this.data.HOSTED_PROGRAMME_ID = "0";
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

      if (status == "D") {
        this.data.STATUS = "D";

      } else if (status == "P") {
        this.data.STATUS = "P";
      }

      // if (this.data.MEETING_TYPE == "P") {
      //   this.data.TYPE_ID = "0";

      // } else {
      //   this.data.TYPE_ID = this.data.TYPE_ID.toString();
      // }

      this.GoogleDATE = this.data.DATE;
      this.GoogleFROM_TIME = this.data.FROM_TIME;
      this.GoogleTO_TIME = this.data.TO_TIME;
      var Form = this.datePipe.transform(this.GoogleDATE, 'yyyyMMdd') + 'T' + this.datePipe.transform(this.GoogleFROM_TIME, 'HHmmss');
      var To = this.datePipe.transform(this.GoogleDATE, 'yyyyMMdd') + 'T' + this.datePipe.transform(this.GoogleTO_TIME, 'HHmmss');
      this.Facebookurl = 'https://www.facebook.com/sharer/sharer.php?u=';
      this.data.DATE = this.datePipe.transform(this.data.DATE, "yyyy-MM-dd");
      this.data.FROM_TIME = this.datePipe.transform(this.data.FROM_TIME, "HH:mm" + ":00");
      this.data.TO_TIME = this.datePipe.transform(this.data.TO_TIME, "HH:mm" + ":00");
      this.data.CREATOR_ID = this.api.userId;
      this.data.HOSTED_BY_GROUP_IDS = this.data.HOSTED_BY_GROUP_IDS.toString();

      // Add to google calendar
      let currentDateTime: Date = new Date(this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'));
      let meetingStartDateTime: Date = new Date(this.datePipe.transform(this.data.DATE, 'yyyy-MM-dd') + 'T' + this.data.FROM_TIME);

      if (this.data.ID) {
        this.api.updategroupMeeting(this.data).subscribe(successCode => {
          if (successCode["code"] == 200) {
            this.message.success("Meeting Updated Successfully", "");
            this.isSpinning = false;

            if ((this.data.STATUS == "P") && (!this.uploadMinutes) && (meetingStartDateTime.getTime() > currentDateTime.getTime())) {
              this.GoogleCalender = "https://calendar.google.com/calendar/r/eventedit?text=" + this.data.MEETING_SUB + "&details=" + this.data.AGENDA + "&location=" + this.data.VENUE + "&dates=" + Form + "/" + To + "&ctz=Asia%2FKolkata";
              this.isVisible = true;
            }

            if (!addNew) {
              this.close(myForm);
            }

          } else {
            this.message.error("Meeting Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        if ((this.federationID > 0) || ((this.data.IS_HOSTED) && (this.data.HOSTING_LEVEL == "F"))) {
          this.data.FEDERATION_ID_TO_SHOW = this.homeFederationID;
        }

        if ((this.unitID > 0) || ((this.data.IS_HOSTED) && (this.data.HOSTING_LEVEL == "U"))) {
          this.data.UNIT_ID_TO_SHOW = this.homeUnitID;
        }

        if ((this.groupID > 0) && (!this.data.IS_HOSTED)) {
          this.data.GROUP_ID_TO_SHOW = this.homeGroupID;
        }

        this.data.MINUTES = "";

        this.api.creategroupMeeting(this.data).subscribe(successCode => {
          if (successCode["code"] == 200) {
            this.message.success("Meeting Created Successfully", "");
            this.isSpinning = false;
            this.MEETING_ID = successCode['data'];

            if ((this.data.STATUS == "P") && (!this.uploadMinutes) && (meetingStartDateTime.getTime() > currentDateTime.getTime())) {
              this.GoogleCalender = "https://calendar.google.com/calendar/r/eventedit?text=" + this.data.MEETING_SUB + "&details=" + this.data.AGENDA + "&location=" + this.data.VENUE + "&dates=" + Form + "/" + To + "&ctz=Asia%2FKolkata";
              this.isVisible = true;
            }

            if (!addNew) {
              this.close(myForm);

            } else {
              this.data = new GroupMeetAttendance();
            }

          } else {
            this.message.error("Meeting Creation Failed", "");
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
    if ((event.target.files[0].type == 'image/jpeg') || (event.target.files[0].type == 'image/jpg') || (event.target.files[0].type == 'image/png')) {
      this.fileURL1 = <File>event.target.files[0];
      this.originalFileURL1 = <File>event.target.files[0];

      this.compressImage.compress(event.target.files[0]).pipe(take(1)).subscribe(compressedImage => {
        this.fileURL1 = compressedImage;
      });

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
      this.originalFileURL5 = null;
    }
  }

  onFileSelected2(event: any) {
    if ((event.target.files[0].type == 'image/jpeg') || (event.target.files[0].type == 'image/jpg') || (event.target.files[0].type == 'image/png')) {
      this.fileURL2 = <File>event.target.files[0];
      this.originalFileURL2 = <File>event.target.files[0];

      this.compressImage.compress(event.target.files[0]).pipe(take(1)).subscribe(compressedImage => {
        this.fileURL2 = compressedImage;
      });

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
    if ((event.target.files[0].type == 'image/jpeg') || (event.target.files[0].type == 'image/jpg') || (event.target.files[0].type == 'image/png')) {
      this.fileURL3 = <File>event.target.files[0];
      this.originalFileURL3 = <File>event.target.files[0];

      this.compressImage.compress(event.target.files[0]).pipe(take(1)).subscribe(compressedImage => {
        this.fileURL3 = compressedImage;
      });

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
      });

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
      });

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

  folderName: string = "groupMeeting";
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
        var url = "GM" + number + "." + fileExt;

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
        var url = "GM" + number + "." + fileExt;

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
        var url = "GM" + number + "." + fileExt;

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
        var url = "GM" + number + "." + fileExt;

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
        var url = "GM" + number + "." + fileExt;

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
        var url = "GM" + number + "." + fileExt;

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
        var url = "GM" + number + "." + fileExt;

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
        var url = "GM" + number + "." + fileExt;

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
        var url = "GM" + number + "." + fileExt;

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

  isVisible: boolean = false;

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
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

  shareWithinPlaceHolder: string;
  shareWithinTitle: string;
  SELECT_ALL: boolean = false;

  onSharingTypeChange(sharingType: string) {
    if (sharingType == "F") {
      this.shareWithinTitle = "Select Federation";
      this.shareWithinPlaceHolder = "Type here to search federation(s)";
      this.SELECT_ALL = false;
      this.getFederations();

    } else if (sharingType == "U") {
      this.shareWithinTitle = "Select Unit";
      this.shareWithinPlaceHolder = "Type here to search unit(s)";
      this.SELECT_ALL = false;
      this.getUnits();

    } else if (sharingType == "G") {
      this.shareWithinTitle = "Select Group";
      this.shareWithinPlaceHolder = "Type here to search group(s)";
      this.SELECT_ALL = false;
      this.getFilteredGroups();
    }
  }

  typeIDs: any[] = [];
  shareWithinLoading: boolean = false;

  getFederations() {
    var federationFilter = "";

    if (this.federationID != 0) {
      federationFilter = " AND ID=" + this.federationID;
    }

    var unitFilter = "";

    if (this.unitID != 0) {
      unitFilter = " AND ID=(SELECT FEDERATION_ID FROM unit_master WHERE ID=" + this.unitID + ")";
    }

    var groupFilter = "";

    if (this.groupID != 0) {
      groupFilter = " AND ID=(SELECT FEDERATION_ID FROM unit_master WHERE ID=(SELECT UNIT_ID FROM group_master WHERE ID=" + this.groupID + "))";
    }

    var homeFederationFilter = "";

    if ((this.federationID == 0) && (this.unitID == 0) && (this.groupID == 0)) {
      homeFederationFilter = " AND ID=" + this.homeFederationID;
    }

    this.typeIDs = [];
    this.data.TYPE_ID = undefined;
    this.shareWithinLoading = true;

    this.api.getAllFederations(0, 0, "NAME", "asc", " AND STATUS=1" + federationFilter + unitFilter + groupFilter + homeFederationFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.shareWithinLoading = false;
        this.typeIDs = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getUnits() {
    var federationFilter = "";

    if (this.federationID != 0) {
      federationFilter = " AND FEDERATION_ID=" + this.federationID;
    }

    var unitFilter = "";

    if (this.unitID != 0) {
      unitFilter = " AND ID=" + this.unitID;
    }

    var groupFilter = "";

    if (this.groupID != 0) {
      groupFilter = " AND ID=(SELECT UNIT_ID FROM group_master WHERE ID=" + this.groupID + ")";
    }

    var homeUnitFilter = "";

    if ((this.federationID == 0) && (this.unitID == 0) && (this.groupID == 0)) {
      homeUnitFilter = " AND ID=" + this.homeUnitID;
    }

    this.typeIDs = [];
    this.data.TYPE_ID = undefined;
    this.shareWithinLoading = true;

    this.api.getAllUnits(0, 0, "NAME", "asc", " AND STATUS=1" + federationFilter + unitFilter + groupFilter + homeUnitFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.shareWithinLoading = false;
        this.typeIDs = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getFilteredGroups() {
    var federationFilter = "";

    if (this.federationID != 0) {
      federationFilter = " AND FEDERATION_ID=" + this.federationID;
    }

    var unitFilter = "";

    if (this.unitID != 0) {
      unitFilter = " AND UNIT_ID=" + this.unitID;
    }

    var groupFilter = "";

    if (this.groupID != 0) {
      groupFilter = " AND ID=" + this.groupID;
    }

    var homeGroupFilter = "";

    if ((this.federationID == 0) && (this.unitID == 0) && (this.groupID == 0)) {
      homeGroupFilter = " AND ID=" + this.homeGroupID;
    }

    this.typeIDs = [];
    this.data.TYPE_ID = undefined;
    this.shareWithinLoading = true;

    this.api.getAllGroups(0, 0, "NAME", "asc", " AND STATUS=1" + federationFilter + unitFilter + groupFilter + homeGroupFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.shareWithinLoading = false;
        this.typeIDs = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  onSelectAllChange(status: boolean) {
    if (status) {
      let allTypeIDs = [];

      for (var i = 0; i < this.typeIDs.length; i++) {
        allTypeIDs.push(this.typeIDs[i]["ID"]);
      }

      this.data.TYPE_ID = allTypeIDs;

    } else {
      this.data.TYPE_ID = undefined;
    }
  }

  groups: any[] = [];
  isGroupLoading: boolean = false;

  getCurrentGroups(): void {
    this.isGroupLoading = true;

    this.api.getAllGroups(0, 0, "NAME", "asc", " AND ID=" + this.homeGroupID).subscribe(data => {
      if (data['code'] == 200) {
        this.isGroupLoading = false;
        this.groups = data['data'];
      }

    }, err => {
      this.isGroupLoading = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getExistingGroups(groupIDs: string): void {
    this.isGroupLoading = true;

    this.api.getAllGroups(0, 0, "NAME", "asc", " AND ID IN (" + groupIDs + ")").subscribe(data => {
      if (data['code'] == 200) {
        this.isGroupLoading = false;
        this.groups = data['data'];
      }

    }, err => {
      this.isGroupLoading = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getGroups(groupName: string): void {
    if (groupName.length >= 3) {
      this.isGroupLoading = true;

      this.api.getAllGroups(0, 0, "NAME", "asc", " AND STATUS=1 AND NAME LIKE '%" + groupName + "%' AND FEDERATION_ID=" + this.homeFederationID + " AND UNIT_ID=" + this.homeUnitID).subscribe(data => {
        if (data['code'] == 200) {
          this.isGroupLoading = false;
          this.groups = data['data'];
        }

      }, err => {
        this.isGroupLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  programmeTypeDrawerVisible: boolean = false;
  programmeTypeDrawerTitle: string;
  programmeTypeDrawerData: programmeTypeMaster = new programmeTypeMaster();

  addProgrammeType(): void {
    this.programmeTypeDrawerTitle = "aaa " + "Add Programme Type";
    this.programmeTypeDrawerData = new programmeTypeMaster();
    this.programmeTypeDrawerVisible = true;
    this.programmeTypeDrawerData.STATUS = true;
  }

  programmeTypeDrawerClose(): void {
    this.getProgrammeTypes();
    this.programmeTypeDrawerVisible = false;
  }

  get programmeTypeDrawerCloseCallback() {
    return this.programmeTypeDrawerClose.bind(this);
  }

  programmeTypes: any[] = [];

  getProgrammeTypes(): void {
    this.api.getAllProgrammeTypes(0, 0, "NAME", "asc", " AND STATUS=1").subscribe(data => {
      if (data['code'] == 200) {
        this.programmeTypes = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  onHostSwitchChange(switchVaue: boolean): void {
    if (!this.data.ID) {
      this.data.HOSTING_LEVEL = null;
      this.getCurrentGroups();
      this.data.HOSTED_BY_GROUP_IDS = [this.homeGroupID];
      this.data.HOSTED_PROGRAMME_ID = null;

      if (switchVaue) {
        this.data.TYPE_OF_MEET = "O";

      } else {
        this.data.TYPE_OF_MEET = "G";
      }
    }
  }
}
