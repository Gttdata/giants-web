import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { FederationMaster } from 'src/app/Models/FederationMaster';
import { UnitMaster } from 'src/app/Models/UnitMaster';
import { ApiService } from 'src/app/Service/api.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-federation-bod-send-for-approval',
  templateUrl: './federation-bod-send-for-approval.component.html',
  styleUrls: ['./federation-bod-send-for-approval.component.css']
})

export class FederationBodSendForApprovalComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() drawerVisible: boolean;
  @Input() DOCUMENTS_LIST: any;
  @Input() PAYMENT_LIST: any;
  @Input() BIO_DATA_LIST: any;
  @Input() FEDERATION_INFO: FederationMaster;
  @Input() GROUP_INFO_FOR_DRAWER: any;
  @Input() NEW_FEDERATION_BOD: any;
  @Input() NEW_UNIT_BOD: any;
  loadingRecords: boolean = false;
  federationID = Number(this._cookie.get("FEDERATION_ID"));
  unitID = Number(this._cookie.get("UNIT_ID"));
  groupID = Number(this._cookie.get("GROUP_ID"));
  isSpinning: boolean = false;
  pageIndex: number = 0;
  pageSize: number = 0;
  federationMemberLoading: boolean = false;
  centralSpecialCommitteeMemberLoading: boolean = false;

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

  SUBJECT: string;
  DESCRIPTION: string;
  REMARK: string;
  FEDERATION_ID = [];
  NEW_FEDERATION_BOD_ID = [];
  FEDERATION_CENTRAL_SPECIAL_COMMITTEE = [];
  UNIT_ID = [];
  GROUP_ID = [];
  federationSelect: boolean = false;
  centralSpecialCommittee: boolean = false;
  unitSelect: boolean = false;
  groupSelect: boolean = false;
  newGroupBODSelect: boolean = false;
  chairPersonID: number;
  deputyPersonID: number;
  adminPersonID: number;

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() { }

  onComponentInitialized(): void {
    this.getAdminData();
    this.getFederations();
    this.getUnits();
    this.getGroups();
  }

  getAdminData() {
    this.api.getAllMembers(0, 0, 'NAME', 'asc', ' AND ID=(SELECT EMPLOYEE_ID from view_employee_role_mapping where ROLE_ID=60)').subscribe(data => {
      if ((data['code'] == 200) && (data["data"].length > 0)) {
        this.chairPersonID = data['data'][0]["ID"];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    this.api.getAllMembers(0, 0, 'NAME', 'asc', ' AND ID=(SELECT EMPLOYEE_ID from view_employee_role_mapping where ROLE_ID=61)').subscribe(data => {
      if ((data['code'] == 200) && (data["data"].length > 0)) {
        this.deputyPersonID = data['data'][0]["ID"];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    this.api.getAllMembers(0, 0, 'NAME', 'asc', ' AND ID=(SELECT EMPLOYEE_ID from view_employee_role_mapping where ROLE_ID=59)').subscribe(data => {
      if ((data['code'] == 200) && (data["data"].length > 0)) {
        this.adminPersonID = data['data'][0]["ID"];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  close(myForm: NgForm) {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  federations = [];

  getFederations() {
    this.federations = [];

    this.api.getAllFederations(0, 0, "NAME", "asc", " AND STATUS=1").subscribe(data => {
      if (data['code'] == 200) {
        this.federations = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  units = [];

  getUnits() {
    this.units = [];

    this.api.getAllUnits(0, 0, "NAME", "asc", " AND STATUS=1").subscribe(data => {
      if (data['code'] == 200) {
        this.units = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  groups = [];

  getGroups() {
    this.groups = [];

    this.api.getAllGroups(0, 0, "NAME", "asc", "").subscribe(data => {
      if (data['code'] == 200) {
        this.groups = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  BOD: string = "";
  memberList = [];
  federationmemberList = [];

  // get Federation BOD Members
  getFederationMemberData(federationID: number) {
    this.BOD = "";
    this.federationmemberList = [];

    let tempFederation = this.federations.filter(obj1 => {
      return obj1["ID"] == federationID;
    });

    let federationData: FederationMaster = tempFederation[0];

    this.BOD += federationData.PRESIDENT ? federationData.PRESIDENT + "," : "";
    this.BOD += federationData.IPP ? federationData.IPP + "," : "";
    this.BOD += federationData.VP1 ? federationData.VP1 + "," : "";
    this.BOD += federationData.VP2 ? federationData.VP2 + "," : "";
    this.BOD += federationData.VP3 ? federationData.VP3 + "," : "";
    this.BOD += federationData.SECRETORY ? federationData.SECRETORY + "," : "";
    this.BOD += federationData.CO_SECRETORY ? federationData.CO_SECRETORY + "," : "";
    this.BOD += federationData.TREASURER ? federationData.TREASURER + "," : "";
    this.BOD += federationData.PRO1 ? federationData.PRO1 + "," : "";
    this.BOD += federationData.PRO2 ? federationData.PRO2 + "," : "";
    this.BOD += federationData.CO_ORDINATOR ? federationData.CO_ORDINATOR + "," : "";
    this.BOD += federationData.SPECIAL_OFFICER1 ? federationData.SPECIAL_OFFICER1 + "," : "";
    this.BOD += federationData.SPECIAL_OFFICER2 ? federationData.SPECIAL_OFFICER2 + "," : "";
    this.BOD += federationData.SPECIAL_OFFICER3 ? federationData.SPECIAL_OFFICER3 + "," : "";
    this.BOD += federationData.SPECIAL_OFFICER4 ? federationData.SPECIAL_OFFICER4 + "," : "";
    this.BOD += federationData.FEDERATION_OFFICER1 ? federationData.FEDERATION_OFFICER1 + "," : "";
    this.BOD += federationData.FEDERATION_OFFICER2 ? federationData.FEDERATION_OFFICER2 + "," : "";
    this.BOD += federationData.FEDERATION_OFFICER3 ? federationData.FEDERATION_OFFICER3 + "," : "";
    this.BOD += federationData.FEDERATION_OFFICER4 ? federationData.FEDERATION_OFFICER4 + "," : "";
    this.BOD += federationData.FEDERATION_OFFICER5 ? federationData.FEDERATION_OFFICER5 + "," : "";
    this.BOD += federationData.FEDERATION_OFFICER6 ? federationData.FEDERATION_OFFICER6 + "," : "";
    this.BOD += federationData.FEDERATION_OFFICER7 ? federationData.FEDERATION_OFFICER7 + "," : "";
    this.BOD += federationData.FEDERATION_OFFICER8 ? federationData.FEDERATION_OFFICER8 + "," : "";
    this.BOD += federationData.FEDERATION_OFFICER9 ? federationData.FEDERATION_OFFICER9 + "," : "";
    this.BOD += federationData.FEDERATION_OFFICER10 ? federationData.FEDERATION_OFFICER10 + "," : "";
    this.BOD += federationData.FEDERATION_OFFICER11 ? federationData.FEDERATION_OFFICER11 + "," : "";
    this.BOD += federationData.FEDERATION_OFFICER12 ? federationData.FEDERATION_OFFICER12 + "," : "";
    this.BOD += federationData.FEDERATION_OFFICER13 ? federationData.FEDERATION_OFFICER13 + "," : "";
    this.BOD += federationData.FEDERATION_OFFICER14 ? federationData.FEDERATION_OFFICER14 + "," : "";
    this.BOD += federationData.FEDERATION_OFFICER15 ? federationData.FEDERATION_OFFICER15 + "," : "";
    this.BOD += federationData.FEDERATION_OFFICER16 ? federationData.FEDERATION_OFFICER16 + "," : "";
    this.BOD += federationData.FEDERATION_OFFICER17 ? federationData.FEDERATION_OFFICER17 + "," : "";
    this.BOD += federationData.CO_ORDINATOR2 ? federationData.CO_ORDINATOR2 + "," : "";
    this.BOD += federationData.FEDERATION_OFFICER18 ? federationData.FEDERATION_OFFICER18 + "," : "";

    if (federationData.PRESIDENT && (federationData.PRESIDENT.toString()).trim() != "") {
      this.federationmemberList.push(federationData.PRESIDENT ? federationData.PRESIDENT : '');
    }

    if (federationData.SECRETORY && (federationData.SECRETORY.toString()).trim() != "") {
      this.federationmemberList.push(federationData.SECRETORY ? federationData.SECRETORY : '');
    }

    if (this.BOD.length > 0) {
      this.BOD = this.BOD.substring(0, this.BOD.length - 1);
      this.federationMemberLoading = true;

      this.api.getAllMembers(0, 0, "", "", " AND ID IN (" + this.BOD + ")").subscribe(data => {
        if (data['code'] == 200) {
          this.federationMemberLoading = false;
          this.memberList = data['data'];
          this.FEDERATION_ID = this.federationmemberList;
        }

      }, err => {
        this.federationMemberLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  selectFederationsMember(status: boolean) {
    let tempFederationsMembers = [];

    if (status) {
      this.memberList.map(obj1 => {
        tempFederationsMembers.push(obj1["ID"]);
      });

      this.FEDERATION_ID = tempFederationsMembers;

    } else {
      this.FEDERATION_ID = [];
      this.FEDERATION_ID = this.federationmemberList;
    }
  }

  centralSpecialCommitteeBOD: string = "";
  centralSpecialCommitteeMemberList = [];
  centralSpecialCommitteeFederationmemberList = [];

  // get Federation's Special and Central Committee
  getFederationcentralSpecialCommitteeMemberData(federationID: number) {
    this.centralSpecialCommitteeBOD = "";
    this.centralSpecialCommitteeFederationmemberList = [];

    let tempFederation = this.federations.filter(obj1 => {
      return obj1["ID"] == federationID;
    });

    let federationData: FederationMaster = tempFederation[0];

    this.centralSpecialCommitteeBOD += federationData.CENTRAL_COMMITTEE1 ? federationData.CENTRAL_COMMITTEE1 + "," : "";
    this.centralSpecialCommitteeBOD += federationData.CENTRAL_COMMITTEE2 ? federationData.CENTRAL_COMMITTEE2 + "," : "";
    this.centralSpecialCommitteeBOD += federationData.CENTRAL_COMMITTEE3 ? federationData.CENTRAL_COMMITTEE3 + "," : "";
    this.centralSpecialCommitteeBOD += federationData.SPECIAL_COMMITTEE1 ? federationData.SPECIAL_COMMITTEE1 + "," : "";
    this.centralSpecialCommitteeBOD += federationData.SPECIAL_COMMITTEE2 ? federationData.SPECIAL_COMMITTEE2 + "," : "";
    this.centralSpecialCommitteeBOD += federationData.SPECIAL_COMMITTEE3 ? federationData.SPECIAL_COMMITTEE3 + "," : "";

    this.centralSpecialCommitteeBOD += this.chairPersonID ? this.chairPersonID + "," : "";
    this.centralSpecialCommitteeBOD += this.deputyPersonID ? this.deputyPersonID + "," : "";
    this.centralSpecialCommitteeBOD += this.adminPersonID ? this.adminPersonID + "," : "";

    if (federationData.CENTRAL_COMMITTEE1 && (federationData.CENTRAL_COMMITTEE1.toString()).trim() != "") {
      this.centralSpecialCommitteeFederationmemberList.push(federationData.CENTRAL_COMMITTEE1 ? federationData.CENTRAL_COMMITTEE1 : '');
    }

    if (federationData.CENTRAL_COMMITTEE2 && (federationData.CENTRAL_COMMITTEE2.toString()).trim() != "") {
      this.centralSpecialCommitteeFederationmemberList.push(federationData.CENTRAL_COMMITTEE2 ? federationData.CENTRAL_COMMITTEE2 : '');
    }

    if (federationData.CENTRAL_COMMITTEE3 && (federationData.CENTRAL_COMMITTEE3.toString()).trim() != "") {
      this.centralSpecialCommitteeFederationmemberList.push(federationData.CENTRAL_COMMITTEE3 ? federationData.CENTRAL_COMMITTEE3 : '');
    }

    if (federationData.SPECIAL_COMMITTEE1 && (federationData.SPECIAL_COMMITTEE1.toString()).trim() != "") {
      this.centralSpecialCommitteeFederationmemberList.push(federationData.SPECIAL_COMMITTEE1 ? federationData.SPECIAL_COMMITTEE1 : '');
    }

    if (federationData.SPECIAL_COMMITTEE2 && (federationData.SPECIAL_COMMITTEE2.toString()).trim() != "") {
      this.centralSpecialCommitteeFederationmemberList.push(federationData.SPECIAL_COMMITTEE2 ? federationData.SPECIAL_COMMITTEE2 : '');
    }

    if (federationData.SPECIAL_COMMITTEE3 && (federationData.SPECIAL_COMMITTEE3.toString()).trim() != "") {
      this.centralSpecialCommitteeFederationmemberList.push(federationData.SPECIAL_COMMITTEE3 ? federationData.SPECIAL_COMMITTEE3 : '');
    }

    if (this.centralSpecialCommitteeBOD.length > 0) {
      this.centralSpecialCommitteeBOD = this.centralSpecialCommitteeBOD.substring(0, this.centralSpecialCommitteeBOD.length - 1);
      this.centralSpecialCommitteeMemberLoading = true;

      this.api.getAllMembers(0, 0, "", "", " AND ID IN (" + this.centralSpecialCommitteeBOD + ")").subscribe(data => {
        if (data['code'] == 200) {
          this.centralSpecialCommitteeMemberLoading = false;
          this.centralSpecialCommitteeMemberList = data['data'];
          this.FEDERATION_CENTRAL_SPECIAL_COMMITTEE = this.centralSpecialCommitteeFederationmemberList;
        }

      }, err => {
        this.centralSpecialCommitteeMemberLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  selectFederationsCentralSpecialCommitteeMember(status: boolean) {
    let tempFederationsCentralSpecialCommitteeMembers = [];

    if (status) {
      this.centralSpecialCommitteeMemberList.map(obj1 => {
        tempFederationsCentralSpecialCommitteeMembers.push(obj1["ID"]);
      });

      this.FEDERATION_CENTRAL_SPECIAL_COMMITTEE = tempFederationsCentralSpecialCommitteeMembers;

    } else {
      this.FEDERATION_CENTRAL_SPECIAL_COMMITTEE = [];
      this.FEDERATION_CENTRAL_SPECIAL_COMMITTEE = this.centralSpecialCommitteeFederationmemberList;
    }
  }

  onApproveBtnClick(myForm: NgForm, status: string) {
    let isOk = true;

    if (this.SUBJECT != undefined || this.SUBJECT != null) {
      if (this.SUBJECT.trim() == "") {
        isOk = false;
        this.message.error("Please Enter Valid Subject", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Subject", "");
    }

    if (this.DESCRIPTION != undefined || this.DESCRIPTION != null) {
      if (this.DESCRIPTION.trim() == "") {
        isOk = false;
        this.message.error("Please Enter Valid Description", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Description", "");
    }

    if (isOk) {
      this.isSpinning = true;
      let currentMonth = new Date().getMonth() + 1;
      let currentYear = new Date().getFullYear();

      if (currentMonth <= 3) {
        currentYear = (currentYear - 1) + 1;

      } else {
        currentYear = currentYear;
      }

      let unitIDs = [];
      for (var i = 0; i < this.NEW_UNIT_BOD.length; i++) {
        unitIDs.push(this.NEW_UNIT_BOD[i]["UNIT_ID"]);
      }

      let obj1 = new Object();
      obj1["SUBJECT"] = this.SUBJECT;
      obj1["MAIL_BODY"] = (this.FINAL_DESCRIPTION.trim() == "") ? this.DESCRIPTION : this.FINAL_DESCRIPTION;
      obj1["FEDERATION_BOD"] = this.FEDERATION_ID;
      obj1["UNIT_BOD"] = this.UNIT_ID;
      obj1["GROUP_BOD"] = this.GROUP_ID;
      obj1["FEDERATION_NEW_BOD"] = this.NEW_FEDERATION_BOD_ID;
      obj1["COMMITTEE_BOD"] = this.FEDERATION_CENTRAL_SPECIAL_COMMITTEE;
      obj1["FEDERATION_ID"] = this.FEDERATION_INFO["FEDERATION_ID"];
      obj1["UNIT_ID"] = unitIDs;
      obj1["REMARK"] = this.REMARK;
      obj1["NEW_MEMBER_LIST"] = this.NEW_FEDERATION_BOD;
      obj1["YEAR"] = currentYear;
      obj1["APPROVER_ID"] = this.api.userId;
      obj1["STATUS"] = status;
      obj1["GROUP_ID"] = sessionStorage.getItem('GROUP_ID');

      this.api.federationBODApproval(obj1).subscribe(successCode => {
        if (successCode['code'] == 200) {
          this.isSpinning = false;
          this.message.success("New BOD Approval Email Sent Successfully", "");
          this.close(myForm);

        } else {
          this.isSpinning = false;
          this.message.error("Failed to Send New BOD Approval Email", "");
        }
      });
    }
  }

  onRejectionBtnClick(myForm: NgForm, status: string) {
    let isOk = true;

    if (this.SUBJECT != undefined || this.SUBJECT != null) {
      if (this.SUBJECT.trim() == "") {
        isOk = false;
        this.message.error("Please Enter Valid Subject", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Subject", "");
    }

    if (this.DESCRIPTION != undefined || this.DESCRIPTION != null) {
      if (this.DESCRIPTION.trim() == "") {
        isOk = false;
        this.message.error("Please Enter Valid Description", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Description", "");
    }

    if (this.REMARK != undefined || this.REMARK != null) {
      if (this.REMARK.trim() == "") {
        isOk = false;
        this.message.error("Please Enter Valid Rejection Remark", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Rejection Remark", "");
    }

    if (isOk) {
      this.isSpinning = true;
      let currentMonth = new Date().getMonth() + 1;
      let currentYear = new Date().getFullYear();

      if (currentMonth <= 3) {
        currentYear = (currentYear - 1) + 1;

      } else {
        currentYear = currentYear;
      }

      let unitIDs = [];
      for (var i = 0; i < this.NEW_UNIT_BOD.length; i++) {
        unitIDs.push(this.NEW_UNIT_BOD[i]["UNIT_ID"]);
      }

      let obj1 = new Object();
      obj1["SUBJECT"] = this.SUBJECT;
      obj1["MAIL_BODY"] = (this.FINAL_DESCRIPTION.trim() == "") ? this.DESCRIPTION : this.FINAL_DESCRIPTION;
      obj1["FEDERATION_BOD"] = this.FEDERATION_ID;
      obj1["UNIT_BOD"] = this.UNIT_ID;
      obj1["GROUP_BOD"] = this.GROUP_ID;
      obj1["FEDERATION_NEW_BOD"] = this.NEW_FEDERATION_BOD_ID;
      obj1["COMMITTEE_BOD"] = this.FEDERATION_CENTRAL_SPECIAL_COMMITTEE;
      obj1["FEDERATION_ID"] = this.FEDERATION_INFO["FEDERATION_ID"];
      obj1["UNIT_ID"] = unitIDs;
      obj1["REMARK"] = this.REMARK;
      obj1["NEW_MEMBER_LIST"] = this.NEW_FEDERATION_BOD;
      obj1["YEAR"] = currentYear;
      obj1["APPROVER_ID"] = this.api.userId;
      obj1["STATUS"] = status;

      this.api.unitBODApproval(obj1).subscribe(successCode => {
        if (successCode['code'] == 200) {
          this.isSpinning = false;
          this.message.success("New BOD Rejection Email Sent Successfully", "");
          this.close(myForm);

        } else {
          this.isSpinning = false;
          this.message.error("Failed to Send New BOD Rejection Email", "");
        }
      });
    }
  }

  showBODList(url: string) {
    window.open(this.api.retriveimgUrl + "federationBODList/" + url);
  }

  showMailingList(url: string) {
    window.open(this.api.retriveimgUrl + "federationBODMailingList/" + url);
  }

  cancel() { }

  selectNewGroupsBODMember(status: boolean) {
    let tempGroupNewBODMembers = [];

    if (status) {
      this.NEW_FEDERATION_BOD.map((obj1: FederationMaster) => {
        tempGroupNewBODMembers.push(obj1["ID"]);
      });

      this.NEW_UNIT_BOD.map((obj1: UnitMaster) => {
        tempGroupNewBODMembers.push(obj1["ID"]);
      });

      this.NEW_FEDERATION_BOD_ID = tempGroupNewBODMembers;

    } else {
      this.NEW_FEDERATION_BOD_ID = [];
    }
  }

  FINAL_DESCRIPTION: string = "";

  onRemarkChanges(remark: string) {
    let editedDescription = this.DESCRIPTION;
    let editedRemark = remark;
    let finalDescription = editedDescription + "<b>Remark : </b><br>" + editedRemark;
    this.FINAL_DESCRIPTION = finalDescription;
  }

  getNewCouncilMemberRole(index: number) {
    if (index == 0) {
      return "Central Committee 1";
    }

    if (index == 1) {
      return "Central Committee 2";
    }

    if (index == 2) {
      return "Central Committee 3";
    }

    if (index == 3) {
      return "Special Committee 1";
    }

    if (index == 4) {
      return "Special Committee 2";
    }

    if (index == 5) {
      return "Special Committee 3";
    }

    if (index == 6) {
      return "President";
    }

    if (index == 7) {
      return "IPP";
    }

    if (index == 8) {
      return "Vice president 1";
    }

    if (index == 9) {
      return "Vice President 2";
    }

    if (index == 10) {
      return "Vice President 3";
    }

    if (index == 11) {
      return "Secretary";
    }

    if (index == 12) {
      return "Treasurer";
    }

    if (index == 13) {
      return "PRO 1";
    }

    if (index == 14) {
      return "PRO 2";
    }

    if (index == 15) {
      return "Co Ordinator 1";
    }

    if (index == 16) {
      return "Co Ordinator 2";
    }

    if (index == 17) {
      return "Special Officer 1";
    }

    if (index == 18) {
      return "Special Officer 2";
    }

    if (index == 19) {
      return "Special Officer 3";
    }

    if (index == 20) {
      return "Federation Officer 1";
    }

    if (index == 21) {
      return "Federation Officer 2";
    }

    if (index == 22) {
      return "Federation Officer 3";
    }

    if (index == 23) {
      return "Federation Officer 4";
    }

    if (index == 24) {
      return "Federation Officer 5";
    }

    if (index == 25) {
      return "Federation Officer 6";
    }

    if (index == 26) {
      return "Federation Officer 7";
    }

    if (index == 27) {
      return "Federation Officer 8";
    }

    if (index == 28) {
      return "Federation Officer 9";
    }

    if (index == 29) {
      return "Federation Officer 10";
    }

    if (index == 30) {
      return "Federation Officer 11";
    }

    if (index == 31) {
      return "Federation Officer 12";
    }

    if (index == 32) {
      return "Federation Officer 13";
    }

    if (index == 33) {
      return "Federation Officer 14";
    }

    if (index == 34) {
      return "Federation Officer 15";
    }

    if (index == 35) {
      return "Federation Officer 16";
    }

    if (index == 36) {
      return "Federation Officer 17";
    }

    if (index == 37) {
      return "Federation Officer 18";
    }
  }

  getNewUnitBODMemberRole(index: number) {
    if (index == 0) {
      return "Unit Director 1";
    }

    if (index == 1) {
      return "Unit Director 2";
    }

    if (index == 2) {
      return "Unit Director 3";
    }

    if (index == 3) {
      return "Unit Director 4";
    }

    if (index == 4) {
      return "Unit Director 5";
    }

    if (index == 5) {
      return "Unit Director 6";
    }

    if (index == 6) {
      return "Unit Director 7";
    }

    if (index == 7) {
      return "Unit Director 8";
    }

    if (index == 8) {
      return "Unit Director 9";
    }

    if (index == 9) {
      return "Unit Director 10";
    }

    if (index == 10) {
      return "Unit Director 11";
    }
  }
}
