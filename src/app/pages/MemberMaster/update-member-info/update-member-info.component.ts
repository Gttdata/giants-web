import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService, NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { Membermaster } from 'src/app/Models/MemberMaster';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-update-member-info',
  templateUrl: './update-member-info.component.html',
  styleUrls: ['./update-member-info.component.css']
})

export class UpdateMemberInfoComponent implements OnInit {
  passwordVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: Membermaster;
  @Input() drawerVisible: boolean;
  isSpinning: boolean = false;
  namePattern = "([A-Za-z0-9 \s]){1,}";
  emailpattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobpattern = /^[6-9]\d{9}$/;
  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  constructor(private msg: NzMessageService, private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() { }

  federations: any[] = [];

  gender = [
    { id: '1', value: 'Male' },
    { id: '2', value: 'Female' }
  ];

  getFederations(): void {
    // Federation filter
    var federationFilter = "";

    if (this.federationID != 0) {
      federationFilter = " AND ID=" + this.federationID;
    }

    // Unit filter
    var unitFilter = "";

    if (this.unitID != 0) {
      unitFilter = " AND ID=(SELECT FEDERATION_ID FROM unit_master WHERE ID=" + this.unitID + ")";
    }

    // Group filter
    var groupFilter = "";

    if (this.groupID != 0) {
      groupFilter = " AND ID=(SELECT FEDERATION_ID FROM unit_master WHERE ID=(SELECT UNIT_ID FROM group_master WHERE ID=" + this.groupID + "))";
    }

    this.federations = [];

    this.api.getAllFederations(0, 0, "NAME", "asc", " AND STATUS=1" + federationFilter + unitFilter + groupFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.federations = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  units: any[] = [];

  getUnits(federationID: any) {
    // Unit filter
    var unitFilter = "";

    if (this.unitID != 0) {
      unitFilter = " AND ID=" + this.unitID;
    }

    // Group filter
    var groupFilter = "";

    if (this.groupID != 0) {
      groupFilter = " AND ID=(SELECT UNIT_ID FROM group_master WHERE ID=" + this.groupID + ")";
    }

    this.units = [];
    this.data.UNIT_ID = undefined;

    this.groups = [];
    this.data.GROUP_ID = undefined;

    this.api.getAllUnits(0, 0, "NAME", "asc", " AND FEDERATION_ID=" + federationID + " AND STATUS=1" + unitFilter + groupFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.units = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  groups: any[] = [];

  getGroups(unitID: any) {
    // Group filter
    var groupFilter = "";

    if (this.groupID != 0) {
      groupFilter = " AND ID=" + this.groupID;
    }

    this.groups = [];
    this.data.GROUP_ID = undefined;

    this.api.getAllGroups(0, 0, "NAME", "asc", " AND UNIT_ID=" + unitID + " AND STATUS=1" + groupFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.groups = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  inchargeAreas: any[] = [];

  getInchargeAreas() {
    this.api.getAllInchargeAreas(0, 0, "NAME", "asc", " AND STATUS=1").subscribe(data => {
      if (data['code'] == 200) {
        this.inchargeAreas = data['data'];
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
    var isOk = true;

    if ((this.data.MOBILE_NUMBER != undefined) && (this.data.MOBILE_NUMBER != null)) {
      if (this.data.MOBILE_NUMBER.trim() != '') {
        if (!this.mobpattern.test(this.data.MOBILE_NUMBER.toString())) {
          isOk = false;
          this.message.error('Please Enter Valid Mobile Number', '');
        }

      } else {
        isOk = false;
        this.message.error("Please Enter Valid Mobile Number", "");
      }

    } else {
      isOk = false;
      this.message.error('Please Enter Mobile Number', '');
    }

    if ((this.data.GENDER == undefined) || (this.data.GENDER == null)) {
      isOk = false;
      this.message.error('Please Select Gender', '');
    }

    // Communication mail(s)
    if ((this.data.EMAIL_ID != undefined) && (this.data.EMAIL_ID != null))
      this.data.EMAIL_ID = this.data.EMAIL_ID.toString();

    else
      this.data.EMAIL_ID = "";

    if ((this.data.EMAIL_ID.trim() != "")) {
      if ((this.data.EMAIL_ID != undefined) && (this.data.EMAIL_ID != null)) {
        let tempEmails = this.data.EMAIL_ID.split(',');

        for (var i = 0; i < tempEmails.length; i++) {
          if (!this.emailpattern.test(tempEmails[i])) {
            isOk = false;
            this.message.error('Please Enter Valid Communication Email (' + tempEmails[i] + ')', '');
            this.data.EMAIL_ID = tempEmails;

          } else {
            this.data.EMAIL_ID = tempEmails;
          }
        }

      } else {
        isOk = false;
        this.message.error('Please Enter Communication Email', '');
      }

    } else {
      this.data.EMAIL_ID = undefined;
    }

    // Bussiness mail(s)
    if ((this.data.BUSSINESS_EMAIL != undefined) && (this.data.BUSSINESS_EMAIL != null))
      this.data.BUSSINESS_EMAIL = this.data.BUSSINESS_EMAIL.toString();

    else
      this.data.BUSSINESS_EMAIL = "";

    if (this.data.BUSSINESS_EMAIL.trim() != "") {
      if ((this.data.BUSSINESS_EMAIL != undefined) && (this.data.BUSSINESS_EMAIL != null)) {
        let tempEmails = this.data.BUSSINESS_EMAIL.split(',');

        for (var i = 0; i < tempEmails.length; i++) {
          if (!this.emailpattern.test(tempEmails[i])) {
            isOk = false;
            this.message.error('Please Enter Valid Business Email (' + tempEmails[i] + ')', '');
            this.data.BUSSINESS_EMAIL = tempEmails;

          } else {
            this.data.BUSSINESS_EMAIL = tempEmails;
          }
        }

      } else {
        isOk = false;
        this.message.error('Please Enter Business Email', '');
      }

    } else {
      this.data.BUSSINESS_EMAIL = undefined;
    }

    // Communication mobile(s)
    if ((this.data.COMMUNICATION_MOBILE_NUMBER != undefined) && (this.data.COMMUNICATION_MOBILE_NUMBER != null))
      this.data.COMMUNICATION_MOBILE_NUMBER = this.data.COMMUNICATION_MOBILE_NUMBER.toString();

    else
      this.data.COMMUNICATION_MOBILE_NUMBER = "";

    if (this.data.COMMUNICATION_MOBILE_NUMBER.trim() != "") {
      if ((this.data.COMMUNICATION_MOBILE_NUMBER != undefined) && (this.data.COMMUNICATION_MOBILE_NUMBER != null)) {
        let tempCommMobNos = this.data.COMMUNICATION_MOBILE_NUMBER.split(',');

        for (var i = 0; i < tempCommMobNos.length; i++) {
          if (!this.mobpattern.test(tempCommMobNos[i])) {
            isOk = false;
            this.message.error('Please Enter Valid Communication Mobile No. (' + tempCommMobNos[i] + ')', '');
            this.data.COMMUNICATION_MOBILE_NUMBER = tempCommMobNos;

          } else {
            this.data.COMMUNICATION_MOBILE_NUMBER = tempCommMobNos;
          }
        }

      } else {
        isOk = false;
        this.message.error('Please Enter Communication Mobile No.', '');
      }

    } else {
      this.data.COMMUNICATION_MOBILE_NUMBER = undefined;
    }

    if (isOk) {
      this.isSpinning = true;

      if (this.data.DOB) {
        this.data.DOB = this.datePipe.transform(this.data.DOB, "yyyy-MM-dd");

      } else {
        let defaultDate = new Date(1900, 0, 1);
        this.data.DOB = this.datePipe.transform(defaultDate, "yyyy-MM-dd");
      }

      if (this.data.ANNIVERSARY_DATE) {
        this.data.ANNIVERSARY_DATE = this.datePipe.transform(this.data.ANNIVERSARY_DATE, "yyyy-MM-dd");

      } else {
        let defaultDate = new Date(1900, 0, 1);
        this.data.ANNIVERSARY_DATE = this.datePipe.transform(defaultDate, "yyyy-MM-dd");
      }

      this.imageUpload1();
      this.data.PROFILE_IMAGE = (this.photo1Str == "") ? " " : this.photo1Str;

      this.imageUpload2();
      this.data.SIGNATURE = (this.photo2Str == "") ? " " : this.photo2Str;

      this.data.COMMUNICATION_MOBILE_NUMBER = this.data.COMMUNICATION_MOBILE_NUMBER ? this.data.COMMUNICATION_MOBILE_NUMBER.toString() : " ";
      this.data.EMAIL_ID = this.data.EMAIL_ID ? this.data.EMAIL_ID.toString() : " ";
      this.data.BUSSINESS_EMAIL = this.data.BUSSINESS_EMAIL ? this.data.BUSSINESS_EMAIL.toString() : " ";

      if (this.data.ID) {
        this.api.updateMember(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Profile Updated Successfully", "");
            this.isSpinning = false;

            if (!addNew) {
              this.close(myForm);
            }

          } else {
            this.message.error("Profile Updation Failed", "");
            this.isSpinning = false;
          }
        });
      }

      this.fileURL1 = null;
    }
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

  disabledExpiryDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) < 0;

  todayForBirth = new Date().setFullYear(new Date().getFullYear() - 18);

  disabledBirthDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.todayForBirth) > 0;

  dobOnOpen(status) {
    if (status)
      this.data.DOB = this.datePipe.transform(this.todayForBirth, "yyyy-MM-dd");
  }

  fileURL1: any = null;
  fileURL2: any = null

  clear1() {
    this.fileURL1 = null;
    this.data.PROFILE_IMAGE = null;
  }

  clear2() {
    this.fileURL2 = null;
    this.data.SIGNATURE = null;
  }

  onFileSelected1(event: any) {
    if ((event.target.files[0].type == 'image/jpeg') || (event.target.files[0].type == 'image/jpg') || (event.target.files[0].type == 'image/png')) {
      this.fileURL1 = <File>event.target.files[0];

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.data.PROFILE_IMAGE = reader.result as string;
        };
      }

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL1 = null;
    }
  }

  onFileSelected2(event: any) {
    if ((event.target.files[0].type == 'image/jpeg') || (event.target.files[0].type == 'image/jpg') || (event.target.files[0].type == 'image/png')) {
      this.fileURL2 = <File>event.target.files[0];

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.data.SIGNATURE = reader.result as string;
        };
      }

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL2 = null;
    }
  }


  folderName: string = "profileImage";
  photo1Str: string;

  imageUpload1() {
    this.photo1Str = "";

    if (!this.data.ID) {
      if (this.fileURL1) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL1.name.split('.').pop();
        var url = "PI" + number + "." + fileExt;

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
        var url = "PI" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL1, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo1Str = url;

      } else {
        if (this.data.PROFILE_IMAGE) {
          let photoURL = this.data.PROFILE_IMAGE.split("/");
          this.photo1Str = photoURL[photoURL.length - 1];

        } else
          this.photo1Str = "";
      }
    }
  }

  folderName2: string = "memberSignature";
  photo2Str: string;

  imageUpload2() {
    this.photo2Str = "";

    if (!this.data.ID) {
      if (this.fileURL2) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL2.name.split('.').pop();
        var url = "S" + number + "." + fileExt;

        this.api.onUpload2(this.folderName2, this.fileURL2, url).subscribe(res => {
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
        var url = "S" + number + "." + fileExt;

        this.api.onUpload2(this.folderName2, this.fileURL2, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo2Str = url;

      } else {
        if (this.data.SIGNATURE) {
          let photoURL = this.data.SIGNATURE.split("/");
          this.photo2Str = photoURL[photoURL.length - 1];

        } else
          this.photo2Str = "";
      }
    }
  }

  cancel(): void { }

  viewSignature(imageName: string): void {
    window.open(imageName);
  }

  viewProfilePhoto(imageName: string): void {
    window.open(imageName);
  }
}
