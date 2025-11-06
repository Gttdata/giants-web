import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { FederationMaster } from 'src/app/Models/FederationMaster';
import { UnitMaster } from 'src/app/Models/UnitMaster';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-unit-bod-send-for-approval',
  templateUrl: './unit-bod-send-for-approval.component.html',
  styleUrls: ['./unit-bod-send-for-approval.component.css']
})

export class UnitBodSendForApprovalComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() drawerVisible: boolean;
  @Input() DOCUMENTS_LIST: any;
  @Input() PAYMENT_LIST: any;
  @Input() BIO_DATA_LIST: any;
  @Input() UNIT_INFO: UnitMaster;
  @Input() GROUP_INFO_FOR_DRAWER: any;
  @Input() NEW_UNIT_BOD: any;
  loadingRecords: boolean = false;
  federationID = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID = Number(sessionStorage.getItem("UNIT_ID"));
  groupID = Number(sessionStorage.getItem("GROUP_ID"));
  isSpinning: boolean = false;
  pageIndex: number = 0;
  pageSize: number = 0;
  federationMemberLoading: boolean = false;
  unitMemberLoading: boolean = false;
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
  FEDERATION_ID: any[] = [];
  NEW_UNIT_BOD_ID: any[] = [];
  FEDERATION_CENTRAL_SPECIAL_COMMITTEE: any[] = [];
  UNIT_ID: any[] = [];
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

  getAdminData(): void {
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

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm): void {
    myForm.form.reset();
  }

  federations: any[] = [];

  getFederations(): void {
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

  units: any[] = [];

  getUnits(): void {
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

  groups: any[] = [];

  getGroups(): void {
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
  memberList: any[] = [];
  federationmemberList: any[] = [];

  // get Federation BOD Members
  getFederationMemberData(federationID: number): void {
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

  selectFederationsMember(status: boolean): void {
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
  centralSpecialCommitteeMemberList: any[] = [];
  centralSpecialCommitteeFederationmemberList: any[] = [];

  // get Federation's Special and Central Committee
  getFederationcentralSpecialCommitteeMemberData(federationID: number): void {
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

  selectFederationsCentralSpecialCommitteeMember(status: boolean): void {
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

  unitBOD: string = "";
  unitBODMemberList: any[] = [];
  unitMemberList: any[] = [];

  // get Unit BOD Members
  getUnitMemberData(unitID: number): void {
    this.unitBOD = "";
    this.unitMemberList = [];

    let tempUnit = this.units.filter(obj1 => {
      return obj1["ID"] == unitID;
    });

    let unitData: UnitMaster = tempUnit[0];

    this.unitBOD += unitData.DIRECTOR ? unitData.DIRECTOR + "," : "";
    this.unitBOD += unitData.OFFICER1 ? unitData.OFFICER1 + "," : "";
    this.unitBOD += unitData.OFFICER2 ? unitData.OFFICER2 + "," : "";
    this.unitBOD += unitData.VP ? unitData.VP + "," : "";

    if (unitData.DIRECTOR && (unitData.DIRECTOR.toString()).trim() != "") {
      this.unitMemberList.push(unitData.DIRECTOR ? unitData.DIRECTOR : '');
    }

    if (this.unitBOD.length > 0) {
      this.unitBOD = this.unitBOD.substring(0, this.unitBOD.length - 1);
      this.unitMemberLoading = true;

      this.api.getAllMembers(0, 0, "", "", " AND ID IN (" + this.unitBOD + ")").subscribe(data => {
        if (data['code'] == 200) {
          this.unitMemberLoading = false;
          this.unitBODMemberList = data['data'];
          this.UNIT_ID = this.unitMemberList;
        }

      }, err => {
        this.unitMemberLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  selectUnitsMember(status: boolean): void {
    let tempUnitsMembers = [];

    if (status) {
      this.unitBODMemberList.map(obj1 => {
        tempUnitsMembers.push(obj1["ID"]);
      });

      this.UNIT_ID = tempUnitsMembers;

    } else {
      this.UNIT_ID = [];
      this.UNIT_ID = this.unitMemberList;
    }
  }

  selectNewGroupsBODMember(status: boolean): void {
    let tempGroupNewBODMembers = [];

    if (status) {
      this.NEW_UNIT_BOD.map(obj1 => {
        tempGroupNewBODMembers.push(obj1["ID"]);
      });

      this.NEW_UNIT_BOD_ID = tempGroupNewBODMembers;

    } else {
      this.NEW_UNIT_BOD_ID = [];
    }
  }

  onApproveBtnClick(myForm: NgForm, status: string): void {
    let isOk = true;

    if ((this.SUBJECT != undefined) || (this.SUBJECT != null)) {
      if (this.SUBJECT.trim() == "") {
        isOk = false;
        this.message.error("Please Enter Valid Subject", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Subject", "");
    }

    if ((this.DESCRIPTION != undefined) || (this.DESCRIPTION != null)) {
      if (this.DESCRIPTION.trim() == "") {
        isOk = false;
        this.message.error("Please Enter Valid Description", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Description", "");
    }

    if ((this.FEDERATION_ID.length == 0) && (this.UNIT_ID.length == 0) && (this.NEW_UNIT_BOD_ID.length == 0) && (this.FEDERATION_CENTRAL_SPECIAL_COMMITTEE.length == 0)) {
      isOk = false;
      this.message.info("Please Select at Least One member to send Email", "");
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

      let obj1 = new Object();
      obj1["SUBJECT"] = this.SUBJECT;
      obj1["MAIL_BODY"] = this.DESCRIPTION;
      obj1["FEDERATION_BOD"] = this.FEDERATION_ID;
      obj1["UNIT_BOD"] = this.UNIT_ID;
      obj1["UNIT_NEW_BOD"] = this.NEW_UNIT_BOD_ID;
      obj1["COMMITTEE_BOD"] = this.FEDERATION_CENTRAL_SPECIAL_COMMITTEE;
      obj1["UNIT_ID"] = this.UNIT_INFO["UNIT_ID"];
      obj1["REMARK"] = this.REMARK;
      obj1["NEW_MEMBER_LIST"] = this.NEW_UNIT_BOD;
      obj1["YEAR"] = currentYear;
      obj1["APPROVER_ID"] = this.api.userId;
      obj1["STATUS"] = status;

      this.api.unitBODApproval(obj1).subscribe(successCode => {
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

  onRejectionBtnClick(myForm: NgForm, status: string): void {
    let isOk = true;

    if ((this.SUBJECT != undefined) || (this.SUBJECT != null)) {
      if (this.SUBJECT.trim() == "") {
        isOk = false;
        this.message.info("Please Enter Valid Subject", "");
      }

    } else {
      isOk = false;
      this.message.info("Please Enter Valid Subject", "");
    }

    if ((this.DESCRIPTION != undefined) || (this.DESCRIPTION != null)) {
      if (this.DESCRIPTION.trim() == "") {
        isOk = false;
        this.message.info("Please Enter Valid Description", "");
      }

    } else {
      isOk = false;
      this.message.info("Please Enter Valid Description", "");
    }

    if ((this.REMARK != undefined) || (this.REMARK != null)) {
      if (this.REMARK.trim() == "") {
        isOk = false;
        this.message.info("Please Enter Valid Rejection Remark", "");
      }

    } else {
      isOk = false;
      this.message.info("Please Enter Valid Rejection Remark", "");
    }

    if ((this.FEDERATION_ID.length == 0) && (this.UNIT_ID.length == 0) && (this.NEW_UNIT_BOD_ID.length == 0) && (this.FEDERATION_CENTRAL_SPECIAL_COMMITTEE.length == 0)) {
      isOk = false;
      this.message.info("Please Select at Least One member to send Email", "");
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

      let obj1 = new Object();
      obj1["SUBJECT"] = this.SUBJECT;
      obj1["MAIL_BODY"] = this.DESCRIPTION;
      obj1["FEDERATION_BOD"] = this.FEDERATION_ID;
      obj1["UNIT_BOD"] = this.UNIT_ID;
      obj1["UNIT_NEW_BOD"] = this.NEW_UNIT_BOD_ID;
      obj1["COMMITTEE_BOD"] = this.FEDERATION_CENTRAL_SPECIAL_COMMITTEE;
      obj1["UNIT_ID"] = this.UNIT_INFO["UNIT_ID"];
      obj1["REMARK"] = this.REMARK;
      obj1["NEW_MEMBER_LIST"] = this.NEW_UNIT_BOD;
      obj1["YEAR"] = currentYear;
      obj1["APPROVER_ID"] = this.api.userId;
      obj1["STATUS"] = status;

      this.api.unitBODApproval(obj1).subscribe(successCode => {
        if (successCode['code'] == 200) {
          this.isSpinning = false;
          this.message.success("New BOD Rejection Email Send Successfully", "");
          this.close(myForm);

        } else {
          this.isSpinning = false;
          this.message.error("Failed to Send New BOD Rejection Email", "");
        }
      });
    }
  }

  showBODList(url: string): void {
    window.open(this.api.retriveimgUrl + "unitBODList/" + url);
  }

  showMailingList(url: string): void {
    window.open(this.api.retriveimgUrl + "unitBODMailingList/" + url);
  }

  cancel(): void { }

  getNewBODRole(index: number): string {
    if (index == 0) {
      return "Director";
    }

    if (index == 1) {
      return "Officer 1";
    }

    if (index == 2) {
      return "Officer 2";
    }

    if (index == 3) {
      return "Vice President";
    }
  }
}
