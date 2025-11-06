import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { FederationMaster } from 'src/app/Models/FederationMaster';
import { GroupMaster } from 'src/app/Models/GroupMaster';
import { MonthlyGroupReport } from 'src/app/Models/MonthlyGroupReport';
import { UnitMaster } from 'src/app/Models/UnitMaster';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-send-monthly-report',
  templateUrl: './send-monthly-report.component.html',
  styleUrls: ['./send-monthly-report.component.css']
})

export class SendMonthlyReportComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() monthlyReportDataIDForSendDrawer: number;
  isSpinning: boolean = false;
  namePattern = "([A-Za-z0-9 \s]){1,}";
  federationSelect: boolean = false;
  centralSpecialCommittee: boolean = false;
  unitSelect: boolean = false;
  groupSelect: boolean = false;
  FEDERATION_ID: any[] = [];
  FEDERATION_CENTRAL_SPECIAL_COMMITTEE: any[] = [];
  UNIT_ID: any[] = [];
  GROUP_ID: any[] = [];
  chairPersonID: number;
  deputyPersonID: number;
  adminPersonID: number;
  month: number;

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe) { }

  ngOnInit() {
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

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
    this.uploadFile = false;
    this.attachedpdfFileURL1 = null;
    this.attachedpdf1Str = "";
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  federations: any[] = [];

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

  BOD: string = "";
  memberList: any[] = [];
  federationmemberList = [];
  federationMembersLoading: boolean = false;
  unitMembersLoading: boolean = false;
  groupMembersLoading: boolean = false;
  committeeMembersLoading: boolean = false;

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
    this.BOD += federationData.CO_ORDINATOR2 ? federationData.CO_ORDINATOR2 + "," : "";
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
    this.BOD += federationData.FEDERATION_OFFICER18 ? federationData.FEDERATION_OFFICER18 + "," : "";

    if (federationData.PRESIDENT && (federationData.PRESIDENT.toString()).trim() != "") {
      this.federationmemberList.push(federationData.PRESIDENT ? federationData.PRESIDENT : '');
    }

    if (federationData.IPP && (federationData.IPP.toString()).trim() != "") {
      this.federationmemberList.push(federationData.IPP ? federationData.IPP : '');
    }

    if (federationData.SECRETORY && (federationData.SECRETORY.toString()).trim() != "") {
      this.federationmemberList.push(federationData.SECRETORY ? federationData.SECRETORY : '');
    }

    if (federationData.CO_SECRETORY && (federationData.CO_SECRETORY.toString()).trim() != "") {
      this.federationmemberList.push(federationData.CO_SECRETORY ? federationData.CO_SECRETORY : '');
    }

    if (federationData.VP1 && (federationData.VP1.toString()).trim() != "") {
      this.federationmemberList.push(federationData.VP1 ? federationData.VP1 : '');
    }

    if (federationData.VP2 && (federationData.VP2.toString()).trim() != "") {
      this.federationmemberList.push(federationData.VP2 ? federationData.VP2 : '');
    }

    if (federationData.VP3 && (federationData.VP3.toString()).trim() != "") {
      this.federationmemberList.push(federationData.VP3 ? federationData.VP3 : '');
    }

    if (this.BOD.length > 0) {
      this.BOD = this.BOD.substring(0, this.BOD.length - 1);
      this.federationMembersLoading = true;

      this.api.getAllMembers(0, 0, "NAME", "asc", " AND ID IN (" + this.BOD + ")").subscribe(data => {
        if (data['code'] == 200) {
          this.federationMembersLoading = false;
          this.memberList = data['data'];
          this.FEDERATION_ID = this.federationmemberList;
        }

      }, err => {
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

  units: any[] = [];

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

  unitBOD: string = "";
  unitBODMemberList: any[] = [];
  unitMemberList: any[] = [];

  // get Unit BOD Members
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

      this.api.getAllMembers(0, 0, "NAME", "asc", " AND ID IN (" + this.unitBOD + ")").subscribe(data => {
        if (data['code'] == 200) {
          this.unitMembersLoading = false;
          this.unitBODMemberList = data['data'];
          this.UNIT_ID = this.unitMemberList;
        }

      }, err => {
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


  groups: any[] = [];

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

  sponseredGroupBOD: string = "";
  sponseredGroupBODMemberList: any[] = [];
  sponseredGroupMemberList: any[] = [];
  groupBOD: string = "";
  groupBODMemberList: any[] = [];
  groupMemberList: any[] = [];

  // get Group's Current BOD and new BOD Members
  getSponseredGroupMemberData(groupID: number) {
    this.groupBOD = "";
    this.groupMemberList = [];

    let tempGroup = this.groups.filter(obj1 => {
      return obj1["ID"] == groupID;
    });

    let groupBOD: GroupMaster = tempGroup[0];

    if (tempGroup.length > 0) {
      this.groupBOD += groupBOD.PRESIDENT ? groupBOD.PRESIDENT + "," : "";
      this.groupBOD += groupBOD.IPP ? groupBOD.IPP + "," : "";
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
    }

    if (this.groupBOD.length > 0) {
      this.groupBOD = this.groupBOD.substring(0, this.groupBOD.length - 1);
      this.groupMembersLoading = true;

      this.api.getAllMembers(0, 0, "NAME", "asc", " AND ID IN (" + this.groupBOD + ")").subscribe(data => {
        if (data['code'] == 200) {
          this.groupMembersLoading = false;
          this.sponseredGroupBODMemberList = data['data'];
          this.GROUP_ID = this.groupMemberList;
        }

      }, err => {
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
      this.GROUP_ID = this.groupMemberList;
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
      this.committeeMembersLoading = true;

      this.api.getAllMembers(0, 0, "NAME", "asc", " AND ID IN (" + this.centralSpecialCommitteeBOD + ")").subscribe(data => {
        if (data['code'] == 200) {
          this.committeeMembersLoading = false;
          this.centralSpecialCommitteeMemberList = data['data'];
          this.FEDERATION_CENTRAL_SPECIAL_COMMITTEE = this.centralSpecialCommitteeFederationmemberList;
        }

      }, err => {
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

  attachedpdfFileURL1: any = null;
  attachedpdf1Str: string;
  folderName: string = "groupMonthlyReportDocuments";

  onAttachedPdfFileSelected1(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.attachedpdfFileURL1 = <File>event.target.files[0];
      this.existingUploadedFile = '';
      this.uploadFile = false;

    } else {
      this.message.error('Please Choose Only pdf File', '');
      this.attachedpdfFileURL1 = null;
      this.existingUploadedFile = '';
      this.uploadFile = false;
    }
  }

  attachedpdfUpload1() {
    this.attachedpdf1Str = "";

    if (this.attachedpdfFileURL1) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.attachedpdfFileURL1.name.split('.').pop();
      var url = "MR_" + number + "." + fileExt;

      this.api.onUpload2(this.folderName, this.attachedpdfFileURL1, url).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");

        } else {
          console.log("Not Uploaded");
        }
      });

      this.attachedpdf1Str = url;

    } else {
      this.attachedpdf1Str = "";
    }
  }

  attachedpdfClear1() {
    this.attachedpdfFileURL1 = null;
    this.existingUploadedFile = "";
    this.uploadFile = false;
  }

  uploadFile: boolean = false;

  uploadMonthlyReport() {
    this.attachedpdfUpload1();

    if (this.attachedpdf1Str != "") {
      let tempCurrentYear = new Date().getFullYear();
      this.isSpinning = true;

      this.api.getMonthlyGroupReport(0, 0, 'ID', 'asc', " AND MONTH=" + this.month + " AND YEAR=" + tempCurrentYear + " AND GROUP_ID=" + this.monthlyReportDataIDForSendDrawer + " AND IS_SUBMITTED='S'").subscribe(data => {
        if (data['code'] == 200) {
          let tempData: MonthlyGroupReport = data['data'][0];
          tempData.ATTECHMENT_FILE = this.attachedpdf1Str;
          tempData.MONTHLY_EVENT = [];
          tempData.MONTHLY_MEETING = [];
          tempData.MONTHLY_PROJECT = [];

          this.api.updateMonthlyGroupReport(tempData).subscribe(successCode => {
            if (successCode['code'] == 200) {
              this.isSpinning = false;
              this.uploadFile = true;
              this.message.success("Report Uploaded Successfully", "");

            } else {
              this.isSpinning = false;
              this.uploadFile = false;
              this.message.error("Failed to Upload Report", "");
            }
          });
        }
      });

    } else {
      this.message.info('Please Choose File', '');
    }
  }

  sendCircularPublishMail(myForm: NgForm): void {
    let isOk = true;

    if (!this.uploadFile) {
      isOk = false;
      this.message.info('Please Upload the File', '');
    }

    if ((this.FEDERATION_ID.length == 0) && (this.UNIT_ID.length == 0) && (this.GROUP_ID.length == 0) && (this.FEDERATION_CENTRAL_SPECIAL_COMMITTEE.length == 0)) {
      isOk = false;
      this.message.info('Please choose at least one member from federation or unit or group or central-special committee', '');
    }

    if (isOk) {
      let obj1 = new Object();
      obj1["ID"] = this.monthlyReportDataIDForSendDrawer;
      obj1["ATTECHMENT_FILE"] = (this.attachedpdf1Str.trim() != "") ? this.attachedpdf1Str : this.existingUploadedFile;
      obj1["FEDERATION_BOD"] = this.FEDERATION_ID;
      obj1["UNIT_BOD"] = this.UNIT_ID;
      obj1["GROUP_BOD"] = this.GROUP_ID;
      obj1["COMMITTEE_BOD"] = this.FEDERATION_CENTRAL_SPECIAL_COMMITTEE;
      obj1["FEDERATION_NAME"] = sessionStorage.getItem("HOME_FEDERATION_NAME");
      obj1["UNIT_NAME"] = sessionStorage.getItem("HOME_UNIT_NAME");
      obj1["GROUP_NAME"] = sessionStorage.getItem("HOME_GROUP_NAME");

      // Month selection
      let monthString = "";

      if (this.month == 1) {
        monthString = "January";

      } else if (this.month == 2) {
        monthString = "February";

      } else if (this.month == 3) {
        monthString = "March";

      } else if (this.month == 4) {
        monthString = "April";

      } else if (this.month == 5) {
        monthString = "May";

      } else if (this.month == 6) {
        monthString = "June";

      } else if (this.month == 7) {
        monthString = "July";

      } else if (this.month == 8) {
        monthString = "August";

      } else if (this.month == 9) {
        monthString = "September";

      } else if (this.month == 10) {
        monthString = "October";

      } else if (this.month == 11) {
        monthString = "November";

      } else if (this.month == 12) {
        monthString = "December";
      }

      obj1["MONTH"] = monthString;
      obj1["YEAR"] = new Date().getFullYear();
      this.isSpinning = true;

      this.api.sendGroupMonthlyReportMail(obj1).subscribe(data => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          this.message.success("Email Sent Successfully", "");
          this.close(myForm);

        } else {
          this.isSpinning = false;
          this.message.error(data['message'], "");
        }

      }, err => {
        this.isSpinning = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  existingUploadedFile: string = "";

  getMonthlyReportingData(month: number, groupID: number): void {
    let tempCurrentYear = new Date().getFullYear();
    this.isSpinning = true;

    this.api.getMonthlyGroupReport(0, 0, 'ID', 'asc', " AND MONTH=" + month + " AND YEAR=" + tempCurrentYear + " AND GROUP_ID=" + groupID + " AND IS_SUBMITTED='S'").subscribe(data => {
      if (data['code'] == 200) {
        if (data['data'][0]["ATTECHMENT_FILE"]) {
          this.isSpinning = false;
          this.uploadFile = true;
          this.attachedpdf1Str = "";
          this.existingUploadedFile = data['data'][0]["ATTECHMENT_FILE"];

        } else {
          this.isSpinning = false;
          this.uploadFile = false;
          this.attachedpdf1Str = "";
          this.existingUploadedFile = "";
        }
      }

    }, err => {
      this.isSpinning = false;
      this.uploadFile = false;
      this.attachedpdf1Str = "";
      this.existingUploadedFile = "";

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  openAttachedPdfFile(pdfURL: string): void {
    window.open(this.api.retriveimgUrl + this.folderName + "/" + pdfURL);
  }
}
