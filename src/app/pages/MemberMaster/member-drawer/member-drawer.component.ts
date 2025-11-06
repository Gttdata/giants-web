import { Component, Input, OnInit } from '@angular/core';
import { Membermaster } from 'src/app/Models/MemberMaster';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { ApiService } from 'src/app/Service/api.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { GroupMaster } from 'src/app/Models/GroupMaster';
import { InchargeAreaMatser } from 'src/app/Models/InchargeAreaMaster';

@Component({
  selector: 'app-member-drawer',
  templateUrl: './member-drawer.component.html',
  styleUrls: ['./member-drawer.component.css']
})

export class MemberDrawerComponent implements OnInit {
  passwordVisible: boolean = false;
  @Input() drawerClose: Function;
  @Input() data: Membermaster;
  @Input() drawerVisible: boolean;
  @Input() currentGroupInfo: any[] = [];
  isSpinning: boolean = false;
  namePattern = "([A-Za-z0-9 \s]){1,}";
  emailpattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobpattern = /^[6-9]\d{9}$/;

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  roleID: number = Number(this._cookie.get("roleId"));
  readOnly: boolean = false;

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() {
    this.getFederations();
    this.getInchargeAreas();
  }

  federations: any[] = [];

  getFederations(): void {
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

  getUnits(federationID: number): void {
    if (federationID) {
      var unitFilter = "";

      if (this.unitID != 0) {
        unitFilter = " AND ID=" + this.unitID;
      }

      var groupFilter = "";

      if (this.groupID != 0) {
        groupFilter = " AND ID=(SELECT UNIT_ID FROM group_master WHERE ID=" + this.groupID + ")";
      }

      this.units = [];
      this.data.UNIT_ID = undefined;

      this.groups = [];
      this.data.GROUP_ID = undefined;

      this.api.getAllUnits(0, 0, "ID", "asc", " AND FEDERATION_ID=" + federationID + " AND STATUS=1" + unitFilter + groupFilter).subscribe(data => {
        if (data['code'] == 200) {
          this.units = data['data'];
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  groups: any[] = [];

  getGroups(unitID: number): void {
    if (unitID) {
      var groupFilter = "";

      if (this.groupID != 0) {
        groupFilter = " AND (ID=" + this.groupID + " OR SPONSERED_GROUP=" + this.groupID + ")";
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
  }

  getGroupInfo(groupID: number): void {
    let groupInfo = this.groups.filter((obj1: GroupMaster) => {
      return obj1.ID == groupID;
    });

    this.currentGroupInfo = groupInfo[0];
  }

  getGroupInfoFromEdit(groupID: number): void {
    this.api.getAllGroups(0, 0, "NAME", "asc", " AND ID=" + groupID).subscribe(data => {
      if (data['code'] == 200) {
        let groups = data['data'];
        this.currentGroupInfo = groups[0];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  inchargeAreas: any[] = [];

  getInchargeAreas(): void {
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

  reset(myForm: NgForm): void {
    myForm.form.reset();
  }

  save(addNew: boolean, myForm: NgForm): void {
    var isOk = true;

    if ((this.data.SALUTATION == undefined) || (this.data.SALUTATION == null)) {
      isOk = false;
      this.message.error('Please Select Salutation', '');
    }

    if ((this.data.NAME != undefined) && (this.data.NAME != null)) {
      if (this.data.NAME.trim() != '') {
        if (!this.api.checkTextBoxIsValid(this.data.NAME)) {
          isOk = false;
          this.message.error("Please Enter Valid Member Name", "");
        }

      } else {
        isOk = false;
        this.message.error("Please Enter Valid Member Name", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Member Name", "");
    }

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

    if ((this.data.MEMBERSHIP_DATE == undefined) || (this.data.MEMBERSHIP_DATE == null)) {
      isOk = false;
      this.message.error('Please Select Membership From Date', '');
    }

    if (this.roleID != 1) {
      if ((this.data.FEDERATION_ID == undefined) || (this.data.FEDERATION_ID == null)) {
        isOk = false;
        this.message.error('Please Select Federation', '');
      }

      if ((this.data.UNIT_ID == undefined) || (this.data.UNIT_ID == null)) {
        isOk = false;
        this.message.error('Please Select Unit', '');
      }

      if ((this.data.GROUP_ID == undefined) || (this.data.GROUP_ID == null)) {
        isOk = false;
        this.message.error('Please Select Group', '');
      }

    } else {
      this.data.FEDERATION_ID = 0;
      this.data.UNIT_ID = 0;
      this.data.GROUP_ID = 0;
    }

    // Communication mail(s)
    if ((this.data.EMAIL_ID != undefined) && (this.data.EMAIL_ID != null))
      this.data.EMAIL_ID = this.data.EMAIL_ID.toString();

    else
      this.data.EMAIL_ID = "";

    if (this.data.EMAIL_ID.trim() != "") {
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

    // Password
    this.data.PASSWORD = (this.data.PASSWORD == undefined) ? "" : this.data.PASSWORD;

    if (this.data.PASSWORD.trim() != "") {
      if ((this.data.PASSWORD != undefined) && (this.data.PASSWORD != null)) {
        if (this.data.PASSWORD.trim() != "") {
          if (this.data.PASSWORD.length >= 8) {
            if (!this.api.passwordIsValid(this.data.PASSWORD)) {
              isOk = false;
              this.message.error("Please Enter Valid Password", "");
            }

          } else {
            isOk = false;
            this.message.error("Password Must be or Greater than 8 Characters", "");
          }

        } else {
          isOk = false;
          this.message.error("Please Enter Password", "");
        }

      } else {
        isOk = false;
        this.message.error("Please Enter Password", "");
      }
    }

    // Incharge of IDs
    this.data.INCHARGE_OF = this.data.INCHARGE_OF ? this.data.INCHARGE_OF : "";
    this.data.INCHARGE_OF = (this.data.INCHARGE_OF.length > 0) ? this.data.INCHARGE_OF : undefined;

    if (isOk) {
      this.isSpinning = true;

      if (this.currentGroupInfo) {
        if ((this.currentGroupInfo["SPONSERED_GROUP"] == undefined) || (this.currentGroupInfo["SPONSERED_GROUP"] == null)) {
          this.data.ACTIVE_STATUS = "A";

        } else {
          if (this.currentGroupInfo["SPONSERED_GROUP"] == 0) {
            this.data.ACTIVE_STATUS = "A";

          } else {
            if (this.currentGroupInfo["GROUP_STATUS"] == "A") {
              this.data.ACTIVE_STATUS = "A";

            } else {
              this.data.ACTIVE_STATUS = "P";
            }
          }
        }

      } else {
        this.data.ACTIVE_STATUS = "A";
      }


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

      this.data.MEMBERSHIP_DATE = this.datePipe.transform(this.data.MEMBERSHIP_DATE, "yyyy-MM-dd");

      if (this.data.IS_NCF) {
        this.data.EXPIRY_DATE = this.datePipe.transform(new Date(2050, 11, 31), "yyyy-MM-dd");

      } else {
        this.data.EXPIRY_DATE = this.datePipe.transform(this.data.EXPIRY_DATE, "yyyy-MM-dd");
      }

      //  Incharge of IDs
      this.data.INCHARGE_OF = this.data.INCHARGE_OF ? this.data.INCHARGE_OF.toString() : " ";

      // Password
      if ((this.data.PASSWORD == undefined) || (this.data.PASSWORD == null) || (this.data.PASSWORD.trim() == "")) {
        // this.data.PASSWORD = this.api.generate8DigitRandomNumber();
        this.data.PASSWORD = "12345678";
      }

      this.imageUpload1();
      this.data.PROFILE_IMAGE = (this.photo1Str == "") ? " " : this.photo1Str;

      this.imageUpload2();
      this.data.SIGNATURE = (this.photo2Str == "") ? " " : this.photo2Str;

      this.pdfUpload1();
      this.data.BIODATA_URL = (this.pdf1Str == "") ? " " : this.pdf1Str;

      this.data.COMMUNICATION_MOBILE_NUMBER = this.data.COMMUNICATION_MOBILE_NUMBER ? this.data.COMMUNICATION_MOBILE_NUMBER.toString() : " ";
      this.data.EMAIL_ID = this.data.EMAIL_ID ? this.data.EMAIL_ID.toString() : " ";
      this.data.BUSSINESS_EMAIL = this.data.BUSSINESS_EMAIL ? this.data.BUSSINESS_EMAIL.toString() : " ";

      // Update member name as per salutation
      this.data.NAME = this.data.SALUTATION + ' ' + (this.data.NAME.split(".")[this.data.NAME.split(".").length - 1].trim());

      if (this.data.IS_NCF) {
        this.data.NAME = "NCF " + this.data.NAME;
      }

      if (this.data.IS_HONORABLE) {
        this.data.NAME = "HON " + this.data.NAME;
      }

      if (this.data.ID) {
        this.api.updateMember(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Member Details Updated Successfully", "");
            this.isSpinning = false;

            if (!addNew) {
              this.close(myForm);
            }

          } else if (successCode['code'] == 300) {
            this.message.error("Mobile No. Already Exist", "");
            this.isSpinning = false;

          } else if (successCode['code'] == 301) {
            this.message.error("Group Fee Not Assigned", "");
            this.isSpinning = false;

          } else if (successCode['code'] == 302) {
            this.message.error("First clear dues of " + this.data.NAME, "");
            this.isSpinning = false;

          } else {
            this.message.error("Member Details Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.api.createMember(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Member Added Successfully", "");
            this.isSpinning = false;

            if (!addNew) {
              this.close(myForm);

            } else {
              this.data = new Membermaster();
            }

          } else if (successCode['code'] == 300) {
            this.message.error("Mobile No. Already Exist", "");
            this.isSpinning = false;

          } else if (successCode['code'] == 301) {
            this.message.error("Group Fee Not Assigned", "");
            this.isSpinning = false;

          } else if (successCode['code'] == 302) {
            this.message.error("First clear dues of " + this.data.NAME, "");
            this.isSpinning = false;

          } else {
            this.message.error("Member Creation Failed", "");
            this.isSpinning = false;
          }
        });
      }

      this.fileURL1 = null;
      this.fileURL2 = null;
      this.pdfFileURL1 = null;
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
    if (status) {
      this.data.DOB = this.datePipe.transform(this.todayForBirth, "yyyy-MM-dd");
    }
  }

  fileURL1: any = null;

  clear1() {
    this.fileURL1 = null;
    this.data.PROFILE_IMAGE = null;
  }

  viewImage(imageName): void {
    window.open(imageName);
  }

  onFileSelected1(event: any): void {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
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

  fileURL2: any = null;

  clear2() {
    this.fileURL2 = null;
    this.data.SIGNATURE = null;
  }

  viewSignature(imageName): void {
    window.open(imageName);
  }

  onFileSelected2(event: any): void {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
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

  imageUpload1(): void {
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

  imageUpload2(): void {
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

  bioDataFolderName: string = "biodataUrl";
  pdfFileURL1: any = null;
  pdf1Str: string;

  onPdfFileSelected1(event: any): void {
    if (event.target.files[0].type == 'application/pdf') {
      this.pdfFileURL1 = <File>event.target.files[0];

    } else {
      this.message.error('Please Choose Only pdf File', '');
      this.pdfFileURL1 = null;
    }
  }

  pdfUpload1(): void {
    this.pdf1Str = "";

    if (!this.data.ID) {
      if (this.pdfFileURL1) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.pdfFileURL1.name.split('.').pop();
        var url = "BD" + number + "." + fileExt;

        this.api.onUpload2(this.bioDataFolderName, this.pdfFileURL1, url).subscribe(res => {
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
        var url = "BD" + number + "." + fileExt;

        this.api.onUpload2(this.bioDataFolderName, this.pdfFileURL1, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.pdf1Str = url;

      } else {
        if (this.data.BIODATA_URL) {
          let bioDataURL = this.data.BIODATA_URL.split("/");
          this.pdf1Str = bioDataURL[bioDataURL.length - 1];

        } else
          this.pdf1Str = "";
      }
    }
  }

  pdfClear1(): void {
    this.pdfFileURL1 = null;
    this.data.BIODATA_URL = null;
  }

  viewBioData(bioDataUrl: string): void {
    window.open(this.api.retriveimgUrl + "biodataUrl/" + bioDataUrl);
  }

  joiningDateChange(joiningDate: Date): void {
    this.data.EXPIRY_DATE = undefined;
  }

  getAllFederations(ID: number): void {
    this.federations = [];

    this.api.getAllFederations(0, 0, "NAME", "asc", " AND ID=" + ID).subscribe(data => {
      if (data['code'] == 200) {
        this.federations = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getAllUnits(federationID: number): void {
    this.units = [];

    this.api.getAllUnits(0, 0, "ID", "asc", " AND FEDERATION_ID=" + federationID).subscribe(data => {
      if (data['code'] == 200) {
        this.units = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getAllGroups(unitID: number): void {
    this.groups = [];

    this.api.getAllGroups(0, 0, "NAME", "asc", " AND UNIT_ID=" + unitID).subscribe(data => {
      if (data['code'] == 200) {
        this.groups = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  inchargeAreaDrawerVisible: boolean;
  inchargeAreaDrawerTitle: string;
  inchargeAreaDrawerData: InchargeAreaMatser = new InchargeAreaMatser();

  addInchargeOf(): void {
    this.inchargeAreaDrawerTitle = "aaa " + "Add Incharge Area";
    this.inchargeAreaDrawerData = new InchargeAreaMatser();
    this.inchargeAreaDrawerVisible = true;
  }

  inchargeAreaDrawerClose(): void {
    this.getInchargeAreas();
    this.inchargeAreaDrawerVisible = false;
  }

  get inchargeAreaDrawerCloseCallback() {
    return this.inchargeAreaDrawerClose.bind(this);
  }
}
