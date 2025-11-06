import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { GroupMaster } from 'src/app/Models/GroupMaster';
import { ApiService } from 'src/app/Service/api.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CookieService } from 'ngx-cookie-service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-group-drawer',
  templateUrl: './group-drawer.component.html',
  styleUrls: ['./group-drawer.component.css']
})

export class GroupDrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: GroupMaster;
  @Input() drawerVisible: boolean;
  isSpinning: boolean = false;
  namePattern = "([A-Za-z0-9 \s]){1,}";
  panNumberPattern = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$";
  shortNamePattern = "([A-Za-z0-9- \s]){1,}";

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

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
      ['video']
    ]
  };

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() {
    this.getUnits();
    this.getGroups(0);
    this.getParentGroups();
  }

  changeOrientationDraftOnDateChange(date: any) {
    let tempOrentationDate = this.datePipe.transform(date ? date : new Date(), "dd MMM yyyy");
    this.data.ORIENTATION_DRAFT = "This is to certify that orientation meeting was conducted at " + (this.data.VENUE ? this.data.VENUE : "...") + ", on " + tempOrentationDate + " under my chairmanship. During this meeting president, DA and treasurer of " + (this.data.NAME ? this.data.NAME : "...") + " group were also present. In all 25 members from " + (this.data.NAME ? this.data.NAME : "...") + " group were present in this meeting to discuss on formation of new group. We were instrumentation to explain aims and objectives of giants and BOD was finalized, and minute's book was maintained. The aims and objectives of giants welfare foundation, constitution to be formed for smooth function of the group, annual and entrance fees to be paid to giants international every year were clearly explained to them. Guidance on projects and programs was also done during the orientations meeting.";
  }

  changeOrientationDraftOnVenueChange(venue: string) {
    let tempOrentationDate = this.datePipe.transform(this.data.ORIENTATION_DATE, "dd MMM yyyy");
    this.data.ORIENTATION_DRAFT = "This is to certify that orientation meeting was conducted at " + venue + ", on " + tempOrentationDate + " under my chairmanship. During this meeting president, DA and treasurer of " + (this.data.NAME ? this.data.NAME : "...") + " group were also present. In all 25 members from " + (this.data.NAME ? this.data.NAME : "...") + " group were present in this meeting to discuss on formation of new group. We were instrumentation to explain aims and objectives of giants and BOD was finalized, and minute's book was maintained. The aims and objectives of giants welfare foundation, constitution to be formed for smooth function of the group, annual and entrance fees to be paid to giants international every year were clearly explained to them. Guidance on projects and programs was also done during the orientations meeting.";
  }

  changeOrientationDraftOnGroupNameChange(groupName: string) {
    let tempOrentationDate = this.datePipe.transform(this.data.ORIENTATION_DATE, "dd MMM yyyy");
    this.data.ORIENTATION_DRAFT = "This is to certify that orientation meeting was conducted at " + (this.data.VENUE ? this.data.VENUE : "...") + ", on " + tempOrentationDate + " under my chairmanship. During this meeting president, DA and treasurer of " + groupName + " group were also present. In all 25 members from " + groupName + " group were present in this meeting to discuss on formation of new group. We were instrumentation to explain aims and objectives of giants and BOD was finalized, and minute`s book was maintained. The aims and objectives of giants welfare foundation, constitution to be formed for smooth function of the group, annual and entrance fees to be paid to giants international every year were clearly explained to them. Guidance on projects and programs was also done during the orientations meeting.";
  }

  units: any[] = [];
  unitLoading: boolean = false;

  getUnits() {
    // Federation filetr
    var federationFilter = "";

    if (this.federationID != 0) {
      federationFilter = " AND FEDERATION_ID=" + this.federationID;
    }

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
    this.unitLoading = true;

    this.api.getAllUnits(0, 0, "ID", "asc", " AND STATUS=1" + federationFilter + unitFilter + groupFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.unitLoading = false;
        this.units = data['data'];
      }

    }, err => {
      this.unitLoading = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  groups: any[] = [];
  groupLoading: boolean = false;

  getGroups(unitID: number): void {
    // Federation filter
    var federationFilter = "";

    if (this.federationID != 0) {
      federationFilter = " AND FEDERATION_ID=" + this.federationID;
    }

    // Unit filter
    var unitFilter = "";

    if (this.unitID != 0) {
      unitFilter = " AND UNIT_ID=" + this.unitID;
    }

    // Group filter
    var groupFilter = "";

    if (this.groupID != 0) {
      groupFilter = " AND ID=" + this.groupID;
    }

    // Unit selection filter
    let unitSelectionFilter = "";

    if (unitID != 0) {
      unitSelectionFilter = " AND UNIT_ID=" + unitID;
    }

    this.groups = [];
    this.data.SPONSERED_GROUP = undefined;
    this.groupLoading = true;

    this.api.getAllGroups(0, 0, "NAME", "asc", " AND STATUS=1" + groupFilter + unitFilter + federationFilter + unitSelectionFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.groupLoading = false;
        this.groups = data['data'];
      }

    }, err => {
      this.groupLoading = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  onUnitChange(unitID: number): void {
    this.getGroups(unitID ? unitID : 0);
  }

  parentGroups: any[] = [];

  getParentGroups() {
    this.parentGroups = [];
    this.data.PARENT_GROUP_ID = undefined;

    this.api.getAllGroups(0, 0, "NAME", "asc", " AND STATUS=1").subscribe(data => {
      if (data['code'] == 200) {
        this.parentGroups = data['data'];
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

  checkPANNumberIsValid(value: any): boolean {
    let regex = new RegExp(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/);
    return regex.test(value);
  }

  save(addNew: boolean, myForm: NgForm): void {
    var isOk = true;

    if ((this.data.UNIT_ID == undefined) || (this.data.UNIT_ID == null)) {
      isOk = false;
      this.message.error("Please Select Valid Unit", "");
    }

    if ((this.data.SPONSERED_GROUP == undefined) || (this.data.SPONSERED_GROUP == null)) {
      isOk = false;
      this.message.error("Please Select Valid Sponsered Group", "");
    }

    if ((this.data.NAME != undefined) && (this.data.NAME != null)) {
      if (this.data.NAME.trim() != '') {
        if (!this.api.checkTextBoxIsValid(this.data.NAME)) {
          isOk = false;
          this.message.error("Please Enter Valid Group Name", "");
        }

      } else {
        isOk = false;
        this.message.error("Please Enter Valid Group Name", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Group Name", "");
    }

    if ((this.data.SHORT_NAME != undefined) && (this.data.SHORT_NAME != null)) {
      if (this.data.SHORT_NAME.trim() != '') {
        if (!this.api.checkTextBoxWithDashIsValid(this.data.SHORT_NAME)) {
          isOk = false;
          this.message.error("Please Enter Valid Short Name", "");
        }

      } else {
        isOk = false;
        this.message.error("Please Enter Valid Short Name", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Short Name", "");
    }

    if ((this.data.GROUP_TYPE == undefined) || (this.data.GROUP_TYPE == null)) {
      isOk = false;
      this.message.error("Please Select Valid Group Type", "");
    }

    if ((this.data.TYPE == undefined) || (this.data.TYPE == null)) {
      isOk = false;
      this.message.error("Please Select Valid Group Area Type", "");
    }

    if (this.data.GROUP_TYPE == "Y") {
      if ((this.data.PARENT_GROUP_ID == undefined) || (this.data.PARENT_GROUP_ID == null)) {
        isOk = false;
        this.message.error("Please Select Valid Parent Group", "");
      }

    } else {
      this.data.PARENT_GROUP_ID = 0;
    }

    if ((this.data.BO_DATE == undefined) || (this.data.BO_DATE == null)) {
      isOk = false;
      this.message.error("Please Select Valid Date", "");
    }

    if ((this.data.ORIENTATION_DATE == undefined) || (this.data.ORIENTATION_DATE == null)) {
      isOk = false;
      this.message.error("Please Select Valid Orientation Date", "");
    }

    if ((this.data.VENUE != undefined) && (this.data.VENUE != null)) {
      if (this.data.VENUE.trim() == '') {
        isOk = false;
        this.message.error("Please Enter Valid Venue", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Venue", "");
    }

    if ((this.data.ORIENTATION_DRAFT != undefined) && this.data.ORIENTATION_DRAFT != null) {
      if (this.data.ORIENTATION_DRAFT.trim() == '') {
        isOk = false;
        this.message.error("Please Enter Valid Orientation Draft", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Orientation Draft", "");
    }

    this.data.PAN_NUMBER = this.data.PAN_NUMBER ? this.data.PAN_NUMBER : "";

    if (this.data.PAN_NUMBER.trim() != "") {
      if (!this.checkPANNumberIsValid(this.data.PAN_NUMBER)) {
        isOk = false;
        this.message.error("Please Enter Valid PAN Number", "");
      }
    }

    if (isOk) {
      this.isSpinning = true;
      this.data.BO_DATE = this.datePipe.transform(this.data.BO_DATE, "yyyy-MM-dd");
      this.data.ORIENTATION_DATE = this.datePipe.transform(this.data.ORIENTATION_DATE, "yyyy-MM-dd");

      // Bank info
      this.data.AD_ACC_NO = this.data.AD_ACC_NO ? this.data.AD_ACC_NO : " ";
      this.data.AD_BANK_NAME = this.data.AD_BANK_NAME ? this.data.AD_BANK_NAME : " ";
      this.data.AD_BRANCH_NAME = this.data.AD_BRANCH_NAME ? this.data.AD_BRANCH_NAME : " ";
      this.data.PR_ACC_NO = this.data.PR_ACC_NO ? this.data.PR_ACC_NO : " ";
      this.data.PR_BANK_NAME = this.data.PR_BANK_NAME ? this.data.PR_BANK_NAME : " ";
      this.data.PR_BRANCH_NAME = this.data.PR_BRANCH_NAME ? this.data.PR_BRANCH_NAME : " ";

      // PAN card info
      this.data.PAN_NUMBER = this.data.PAN_NUMBER ? this.data.PAN_NUMBER : " ";

      this.pdfUpload1();
      this.data.PAN_URL = (this.pdf1Str == "") ? " " : this.pdf1Str;

      if (this.data.ID) {
        this.api.updateGroup(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Group Details Updated Successfully", "");
            this.isSpinning = false;

            if (!addNew) {
              this.close(myForm);
            }

          } else {
            this.message.error("Group Details Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.api.createGroup(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Group Created Successfully", "");
            this.isSpinning = false;

            if (!addNew) {
              this.close(myForm);

            } else {
              this.data = new GroupMaster();
            }

          } else {
            this.message.error("Group Creation Failed", "");
            this.isSpinning = false;
          }
        });
      }

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
    differenceInCalendarDays(current, this.today) < 0;

  viewLetter(letterURL: string) {
    window.open(this.api.retriveimgUrl + "orientationLetter/" + letterURL);
  }

  onSponsoredGroupChange(sponsoredGroupID: number) {
    if (!this.data.ID) {
      if (sponsoredGroupID == 0) {
        this.data.GROUP_STATUS = "A";

      } else {
        this.data.GROUP_STATUS = "C";
      }
    }
  }

  folderName: string = "panImages";
  pdfFileURL1: any = null;
  pdf1Str: string;

  onPdfFileSelected1(event: any) {
    if ((event.target.files[0].type == 'application/pdf') || (event.target.files[0].type == 'image/jpeg') || (event.target.files[0].type == 'image/jpg') || (event.target.files[0].type == 'image/png')) {
      this.pdfFileURL1 = <File>event.target.files[0];

    } else {
      this.message.error('Please Choose Only pdf or Image File', '');
      this.pdfFileURL1 = null;
    }
  }

  pdfUpload1() {
    this.pdf1Str = "";

    if (!this.data.ID) {
      if (this.pdfFileURL1) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.pdfFileURL1.name.split('.').pop();
        var url = "PAN" + number + "." + fileExt;

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
        var url = "PAN" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.pdfFileURL1, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.pdf1Str = url;

      } else {
        if (this.data.PAN_URL) {
          this.pdf1Str = this.data.PAN_URL;

        } else
          this.pdf1Str = "";
      }
    }
  }

  viewPANCard(PANCardUrl: string): void {
    window.open(this.api.retriveimgUrl + this.folderName + "/" + PANCardUrl);
  }

  pdfClear1() {
    this.pdfFileURL1 = null;
    this.data.PAN_URL = null;
  }
}
