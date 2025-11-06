import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FederationMaster } from 'src/app/Models/FederationMaster';
import { UnitMaster } from 'src/app/Models/UnitMaster';
import { GroupMaster } from 'src/app/Models/GroupMaster';

@Component({
  selector: 'app-send-for-approval',
  templateUrl: './send-for-approval.component.html',
  styleUrls: ['./send-for-approval.component.css']
})

export class SendForApprovalComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() drawerVisible: boolean;
  @Input() DOCUMENTS_LIST: any;
  @Input() PAYMENT_LIST: any;
  @Input() BIO_DATA_LIST: any;
  @Input() GROUP_INFO: GroupMaster;
  @Input() GROUP_INFO_FOR_DRAWER: any;
  federationID = Number(this._cookie.get("FEDERATION_ID"));
  unitID = Number(this._cookie.get("UNIT_ID"));
  groupID = Number(this._cookie.get("GROUP_ID"));
  isSpinning: boolean = false;

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
  FEDERATION_ID: any[] = [];
  FEDERATION_CENTRAL_SPECIAL_COMMITTEE: any[] = [];
  UNIT_ID: any[] = [];
  GROUP_ID: any[] = [];
  federationSelect: boolean = false;
  centralSpecialCommittee: boolean = false;
  unitSelect: boolean = false;
  groupSelect: boolean = false;
  chairPersonID: number;
  deputyPersonID: number;
  adminPersonID: number;
  federationMembersLoading: boolean = false;
  unitMembersLoading: boolean = false;
  groupMembersLoading: boolean = false;
  federationCentralSpecialCommittee: boolean = false;

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() {
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

    this.api.getAllGroups(0, 0, "NAME", "asc", " AND STATUS=1").subscribe(data => {
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

  // get Federation Members
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
      this.federationMembersLoading = true;

      this.api.getAllMembers(0, 0, "", "", " AND ID IN (" + this.BOD + ")").subscribe(data => {
        if (data['code'] == 200) {
          this.federationMembersLoading = false;
          this.memberList = data['data'];
          this.FEDERATION_ID = this.federationmemberList;
        }

      }, err => {
        this.federationMembersLoading = false;

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
  centralSpecialCommitteeMemberList: any[] = [];
  centralSpecialCommitteeFederationmemberList: any[] = [];

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
      this.federationCentralSpecialCommittee = true;

      this.api.getAllMembers(0, 0, "", "", " AND ID IN (" + this.centralSpecialCommitteeBOD + ")").subscribe(data => {
        if (data['code'] == 200) {
          this.federationCentralSpecialCommittee = false;
          this.centralSpecialCommitteeMemberList = data['data'];
          this.FEDERATION_CENTRAL_SPECIAL_COMMITTEE = this.centralSpecialCommitteeFederationmemberList;
        }

      }, err => {
        this.federationCentralSpecialCommittee = false;

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

  unitBOD: string = "";
  unitBODMemberList: any[] = [];
  unitMemberList: any[] = [];

  // get Unit Members
  getUnitMemberData(unitID: number) {
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
      this.unitMembersLoading = true;

      this.api.getAllMembers(0, 0, "", "", " AND ID IN (" + this.unitBOD + ")").subscribe(data => {
        if (data['code'] == 200) {
          this.unitMembersLoading = false;
          this.unitBODMemberList = data['data'];
          this.UNIT_ID = this.unitMemberList;
        }

      }, err => {
        this.unitMembersLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  selectUnitsMember(status: boolean) {
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

  sponseredGroupBOD: string = "";
  sponseredGroupBODMemberList: any[] = [];
  sponseredGroupMemberList: any[] = [];
  groupBOD: string = "";
  groupBODMemberList: any[] = [];
  groupMemberList: any[] = [];

  // get Group Members
  getSponseredGroupMemberData(sponseredGroupID: number, groupID: number) {
    this.sponseredGroupBOD = "";
    this.sponseredGroupBODMemberList = [];
    this.sponseredGroupMemberList = [];
    this.GROUP_ID = [];

    let tempSponseredGroup = this.groups.filter(obj1 => {
      return obj1["ID"] == sponseredGroupID;
    });

    let sponseredGroupBOD: GroupMaster = tempSponseredGroup[0];

    if (tempSponseredGroup.length > 0) {
      this.sponseredGroupBOD += sponseredGroupBOD.PRESIDENT ? sponseredGroupBOD.PRESIDENT + "," : "";
      this.sponseredGroupBOD += sponseredGroupBOD.VPI ? sponseredGroupBOD.VPI + "," : "";
      this.sponseredGroupBOD += sponseredGroupBOD.VPE ? sponseredGroupBOD.VPE + "," : "";
      this.sponseredGroupBOD += sponseredGroupBOD.SECRETORY ? sponseredGroupBOD.SECRETORY + "," : "";
      this.sponseredGroupBOD += sponseredGroupBOD.TREASURER ? sponseredGroupBOD.TREASURER + "," : "";
      this.sponseredGroupBOD += sponseredGroupBOD.DIRECTOR1 ? sponseredGroupBOD.DIRECTOR1 + "," : "";
      this.sponseredGroupBOD += sponseredGroupBOD.DIRECTOR2 ? sponseredGroupBOD.DIRECTOR2 + "," : "";
      this.sponseredGroupBOD += sponseredGroupBOD.DIRECTOR3 ? sponseredGroupBOD.DIRECTOR3 + "," : "";
      this.sponseredGroupBOD += sponseredGroupBOD.DIRECTOR4 ? sponseredGroupBOD.DIRECTOR4 + "," : "";
      this.sponseredGroupBOD += sponseredGroupBOD.DIRECTOR5 ? sponseredGroupBOD.DIRECTOR5 + "," : "";

      if (sponseredGroupBOD.PRESIDENT && (sponseredGroupBOD.PRESIDENT.toString()).trim() != "") {
        this.sponseredGroupMemberList.push(sponseredGroupBOD.PRESIDENT ? sponseredGroupBOD.PRESIDENT : '');
      }

      if (sponseredGroupBOD.SECRETORY && (sponseredGroupBOD.SECRETORY.toString()).trim() != "") {
        this.sponseredGroupMemberList.push(sponseredGroupBOD.SECRETORY ? sponseredGroupBOD.SECRETORY : '');
      }
    }

    if (this.sponseredGroupBOD.length > 0) {
      this.sponseredGroupBOD = this.sponseredGroupBOD.substring(0, this.sponseredGroupBOD.length - 1);
      this.groupMembersLoading = true;

      this.api.getAllMembers(0, 0, "", "", " AND ID IN (" + this.sponseredGroupBOD + ")").subscribe(data => {
        if (data['code'] == 200) {
          this.groupMembersLoading = false;
          this.sponseredGroupBODMemberList.push(...data['data']);
          let temp = this.sponseredGroupMemberList.concat(this.groupMemberList);
          this.GROUP_ID = temp;
        }

      }, err => {
        this.groupMembersLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }

    // Current Group Info
    this.groupBOD = "";
    this.groupMemberList = [];

    let tempGroup = this.groups.filter(obj1 => {
      return obj1["ID"] == groupID;
    });

    let groupBOD: GroupMaster = tempGroup[0];

    if (tempGroup.length > 0) {
      this.groupBOD += groupBOD.PRESIDENT ? groupBOD.PRESIDENT + "," : "";
      this.groupBOD += groupBOD.VPI ? groupBOD.VPI + "," : "";
      this.groupBOD += groupBOD.VPE ? groupBOD.VPE + "," : "";
      this.groupBOD += groupBOD.SECRETORY ? groupBOD.SECRETORY + "," : "";
      this.groupBOD += groupBOD.TREASURER ? groupBOD.TREASURER + "," : "";
      this.groupBOD += groupBOD.DIRECTOR1 ? groupBOD.DIRECTOR1 + "," : "";
      this.groupBOD += groupBOD.DIRECTOR2 ? groupBOD.DIRECTOR2 + "," : "";
      this.groupBOD += groupBOD.DIRECTOR3 ? groupBOD.DIRECTOR3 + "," : "";
      this.groupBOD += groupBOD.DIRECTOR4 ? groupBOD.DIRECTOR4 + "," : "";
      this.groupBOD += groupBOD.DIRECTOR5 ? groupBOD.DIRECTOR5 + "," : "";

      if (groupBOD.PRESIDENT && (groupBOD.PRESIDENT.toString()).trim() != "") {
        this.groupMemberList.push(groupBOD.PRESIDENT ? groupBOD.PRESIDENT : '');
      }

      if (groupBOD.SECRETORY && (groupBOD.SECRETORY.toString()).trim() != "") {
        this.groupMemberList.push(groupBOD.SECRETORY ? groupBOD.SECRETORY : '');
      }
    }

    if (this.groupBOD.length > 0) {
      this.groupBOD = this.groupBOD.substring(0, this.groupBOD.length - 1);
      this.groupMembersLoading = true;

      this.api.getAllMembers(0, 0, "", "", " AND ID IN (" + this.groupBOD + ")").subscribe(data => {
        if (data['code'] == 200) {
          this.groupMembersLoading = false;
          this.sponseredGroupBODMemberList.push(...data['data']);
          let temp = this.groupMemberList.concat(this.sponseredGroupMemberList);
          this.GROUP_ID = temp;
        }

      }, err => {
        this.groupMembersLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  selectGroupsMember(status: boolean) {
    let tempGroupsMembers = [];

    if (status) {
      this.sponseredGroupBODMemberList.map(obj1 => {
        tempGroupsMembers.push(obj1["ID"]);
      });

      this.GROUP_ID = tempGroupsMembers;

    } else {
      this.GROUP_ID = [];
      let temp = this.sponseredGroupMemberList.concat(this.groupMemberList);
      this.GROUP_ID = temp;
    }
  }

  send(myForm: NgForm) {
    let obj1 = new Object();
    obj1["SUBJECT"] = this.SUBJECT;
    obj1["MAIL_BODY"] = this.DESCRIPTION;
    obj1["FEDERATION_ID"] = this.FEDERATION_ID;
    obj1["UNIT_ID"] = this.UNIT_ID;
    obj1["GROUP_ID"] = this.GROUP_ID;
    obj1["COMMITTEE_ID"] = this.FEDERATION_CENTRAL_SPECIAL_COMMITTEE;
    obj1["NEW_GROUP_ID"] = this.GROUP_INFO["GROUP_ID"];
    this.isSpinning = true;

    this.api.sendEmailForApproval(obj1).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.isSpinning = false;
        this.message.success("Email Send Successfully", "");
        this.close(myForm);

      } else {
        this.isSpinning = false;
        this.message.error("Failed to Send Email", "");
      }
    });
  }

  showBODList(url: string) {
    window.open(this.api.retriveimgUrl + "BODList/" + url);
  }

  showMailingList(url: string) {
    window.open(this.api.retriveimgUrl + "mailingList/" + url);
  }

  showOrientationLetter(url: string) {
    window.open(this.api.retriveimgUrl + "orientationLetter/" + url);
  }

  showBioData(url: string) {
    window.open(this.api.retriveimgUrl + "biodataUrl/" + url);
  }

  showPaymentReceipt(url: string) {
    window.open(this.api.retriveimgUrl + "paymentFiles/" + url);
  }

  cancel() { }
}
