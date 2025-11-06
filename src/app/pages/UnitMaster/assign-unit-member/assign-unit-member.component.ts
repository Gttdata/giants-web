import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { InchargeAreaMatser } from 'src/app/Models/InchargeAreaMaster';
import { UnitMaster } from 'src/app/Models/UnitMaster';
import { ApiService } from 'src/app/Service/api.service';
import { ManageUnitMembersComponent } from '../manage-unit-members/manage-unit-members.component';
import { UnitBodSendForApprovalComponent } from '../unit-bod-send-for-approval/unit-bod-send-for-approval.component';

@Component({
  selector: 'app-assign-unit-member',
  templateUrl: './assign-unit-member.component.html',
  styleUrls: ['./assign-unit-member.component.css']
})

export class AssignUnitMemberComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: UnitMaster;
  @Input() drawerVisible: boolean;
  isSpinning: boolean = false;
  namePattern = "([A-Za-z0-9 \s]){1,}";
  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() { }

  onComponentInitialized(): void {
    this.getIDs();
    this.getMembers();
    this.getInchargeAreas();
  }

  getIDs() {
    this.federationID = Number(sessionStorage.getItem("FEDERATION_ID"));
    this.unitID = Number(sessionStorage.getItem("UNIT_ID"));
    this.groupID = Number(sessionStorage.getItem("GROUP_ID"));
  }

  inchargeAreas: any[] = [];

  getInchargeAreas(): void {
    this.api.getAllInchargeAreas(0, 0, "NAME", "asc", "").subscribe(data => {
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

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }

  isVisible: boolean = false;
  isConfirmLoading: boolean = false;
  roleID: number;

  showModal(rID: number): void {
    this.roleID = rID;
    this.isVisible = true;
  }

  NEW_MEMBER_ID: number;

  handleOk(data: UnitMaster): void {
    this.isConfirmLoading = true;

    this.api.assignUnit(this.roleID, data, this.NEW_MEMBER_ID).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Updated Successfully", "");
        this.isConfirmLoading = true;
        this.isVisible = false;

        if (this.roleID == 1)
          data.DIRECTOR = this.NEW_MEMBER_ID;

        else if (this.roleID == 2)
          data.OFFICER1 = this.NEW_MEMBER_ID;

        else if (this.roleID == 3)
          data.OFFICER2 = this.NEW_MEMBER_ID;

        else if (this.roleID == 4)
          data.VP = this.NEW_MEMBER_ID;

        this.getData1(data);
        this.NEW_MEMBER_ID = undefined;

      } else
        this.message.error("Failed to Update", "");
    });
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  members: any[] = [];
  memberLoading: boolean = false;

  getMembers(): void {
    this.memberLoading = true;

    this.api.getAllMembers(0, 0, "NAME", "asc", "").subscribe(data => {
      if (data['code'] == 200) {
        this.memberLoading = false;
        this.members = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getInitial(empName: string): string {
    let initial: string = empName.charAt(0);
    return initial.trim();
  }

  BOD: string = "";
  memberList: any[] = [];

  directorPhoto: string = "";
  directorName: string = "";
  directorMobile: string = "";
  directorFederation: string = "";
  directorUnit: string = "";
  directorGroup: string = "";
  directorEmail: string = "";
  directorDOB: string = "";
  directorAddress: string = "";
  directorInchargeOf: string = "";

  officer1Photo: string = "";
  officer1Name: string = "";
  officer1Mobile: string = "";
  officer1Federation: string = "";
  officer1Unit: string = "";
  officer1Group: string = "";
  officer1Email: string = "";
  officer1DOB: string = "";
  officer1Address: string = "";
  officer1InchargeOf: string = "";

  officer2Photo: string = "";
  officer2Name: string = "";
  officer2Mobile: string = "";
  officer2Federation: string = "";
  officer2Unit: string = "";
  officer2Group: string = "";
  officer2Email: string = "";
  officer2DOB: string = "";
  officer2Address: string = "";
  officer2InchargeOf: string = "";

  vpPhoto: string = "";
  vpName: string = "";
  vpMobile: string = "";
  vpFederation: string = "";
  vpUnit: string = "";
  vpGroup: string = "";
  vpEmail: string = "";
  vpDOB: string = "";
  vpAddress: string = "";
  vpInchargeOf: string = "";

  directorYesNo: boolean = false;
  officer1YesNo: boolean = false;
  officer2YesNo: boolean = false;
  vpYesNo: boolean = false;

  clearValues(): void {
    this.directorPhoto = "assets/anony.png";
    this.directorName = "";
    this.directorMobile = "";
    this.directorFederation = "";
    this.directorUnit = "";
    this.directorGroup = "";
    this.directorEmail = "";
    this.directorDOB = "";
    this.directorAddress = "";
    this.directorInchargeOf = "";

    this.officer1Photo = "assets/anony.png";
    this.officer1Name = "";
    this.officer1Mobile = "";
    this.officer1Federation = "";
    this.officer1Unit = "";
    this.officer1Group = "";
    this.officer1Email = "";
    this.officer1DOB = "";
    this.officer1Address = "";
    this.officer1InchargeOf = "";

    this.officer2Photo = "assets/anony.png";
    this.officer2Name = "";
    this.officer2Mobile = "";
    this.officer2Federation = "";
    this.officer2Unit = "";
    this.officer2Group = "";
    this.officer2Email = "";
    this.officer2DOB = "";
    this.officer2Address = "";
    this.officer2InchargeOf = "";

    this.vpPhoto = "assets/anony.png";
    this.vpName = "";
    this.vpMobile = "";
    this.vpFederation = "";
    this.vpUnit = "";
    this.vpGroup = "";
    this.vpEmail = "";
    this.vpDOB = "";
    this.vpAddress = "";
    this.vpInchargeOf = "";

    this.directorYesNo = false;
    this.officer1YesNo = false;
    this.officer2YesNo = false;
    this.vpYesNo = false;
  }

  getInchargeName(inchargeIDs: string): string {
    let inchargeNamesArray = [];

    if (inchargeIDs && inchargeIDs.trim() != "") {
      let IDs = inchargeIDs.split(',');

      for (var i = 0; i < IDs.length; i++) {
        this.inchargeAreas.filter((obj1: InchargeAreaMatser) => {
          if (obj1.ID == Number(IDs[i])) {
            inchargeNamesArray.push(obj1.NAME);
          }
        });
      }
    }

    return inchargeNamesArray.toString();
  }

  getBirthDate(DOB: Date, showOrHideYear: boolean): string {
    let formattedDOB = "";

    if (showOrHideYear) {
      formattedDOB = this.datePipe.transform(DOB, "dd MMM yyyy");

    } else {
      formattedDOB = this.datePipe.transform(DOB, "dd MMM");
    }

    return formattedDOB;
  }

  tempOpenedUnitsFederationID: number;
  tempOpenedUnitID: number;

  getData1(dataParam: UnitMaster): void {
    this.ManageUnitMembersComponentVar.getIDs();
    this.tempOpenedUnitsFederationID = dataParam.FEDERATION_ID;
    this.tempOpenedUnitID = dataParam["UNIT_ID"];
    this.isSpinning = true;
    this.BOD = "";
    this.clearValues();

    this.BOD += dataParam.DIRECTOR ? dataParam.DIRECTOR + "," : "";
    this.BOD += dataParam.OFFICER1 ? dataParam.OFFICER1 + "," : "";
    this.BOD += dataParam.OFFICER2 ? dataParam.OFFICER2 + "," : "";
    this.BOD += dataParam.VP ? dataParam.VP + "," : "";

    if (this.BOD.length > 0) {
      this.BOD = this.BOD.substring(0, this.BOD.length - 1);

      this.api.getAllMembers(0, 0, "", "", " AND ID IN (" + this.BOD + ")").subscribe(data => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          this.memberList = data['data'];

          if (dataParam.DIRECTOR) {
            this.directorYesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.DIRECTOR);
            });

            this.directorPhoto = (member.length > 0) ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.directorPhoto != null) && (this.directorPhoto.trim() != ''))
              this.directorPhoto = this.api.retriveimgUrl + "profileImage/" + this.directorPhoto;

            else
              this.directorPhoto = "assets/anony.png";

            this.directorName = member.length > 0 ? member[0]["NAME"] : "";
            this.directorMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.directorFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.directorUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.directorGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.directorDOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.directorEmail = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.directorAddress = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.directorInchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.OFFICER1) {
            this.officer1YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.OFFICER1);
            });

            this.officer1Photo = (member.length > 0) ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.officer1Photo != null) && (this.officer1Photo.trim() != ''))
              this.officer1Photo = this.api.retriveimgUrl + "profileImage/" + this.officer1Photo;

            else
              this.officer1Photo = "assets/anony.png";

            this.officer1Name = member.length > 0 ? member[0]["NAME"] : "";
            this.officer1Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.officer1Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.officer1Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.officer1Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.officer1DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.officer1Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.officer1Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.officer1InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.OFFICER2) {
            this.officer2YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.OFFICER2);
            });

            this.officer2Photo = (member.length > 0) ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.officer2Photo != null) && (this.officer2Photo.trim() != ''))
              this.officer2Photo = this.api.retriveimgUrl + "profileImage/" + this.officer2Photo;

            else
              this.officer2Photo = "assets/anony.png";

            this.officer2Name = member.length > 0 ? member[0]["NAME"] : "";
            this.officer2Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.officer2Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.officer2Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.officer2Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.officer2DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.officer2Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.officer2Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.officer2InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.VP) {
            this.vpYesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.VP);
            });

            this.vpPhoto = (member.length > 0) ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.vpPhoto != null) && (this.vpPhoto.trim() != ''))
              this.vpPhoto = this.api.retriveimgUrl + "profileImage/" + this.vpPhoto;

            else
              this.vpPhoto = "assets/anony.png";

            this.vpName = member.length > 0 ? member[0]["NAME"] : "";
            this.vpMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.vpFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.vpUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.vpGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.vpDOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.vpEmail = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.vpAddress = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.vpInchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });

    } else {
      this.isSpinning = false;
    }
  }

  memberDrawerTitle: string;
  memberDrawerRoleName: string;
  memberDrawerData: any;
  memberDrawerVisible: boolean = false;
  BOD_Position: number;
  @ViewChild(ManageUnitMembersComponent, { static: false }) ManageUnitMembersComponentVar: ManageUnitMembersComponent;

  addMembers(BODPosition: any): void {
    this.BOD_Position = BODPosition;
    let role = "";

    if (this.BOD_Position == 1)
      role = "Director";

    else if (this.BOD_Position == 2)
      role = "Officer 1";

    else if (this.BOD_Position == 3)
      role = "Officer 2";

    else if (this.BOD_Position == 4)
      role = "Vice Precident";

    this.memberDrawerTitle = "Add Unit Members for " + role;
    this.memberDrawerVisible = true;
    this.memberDrawerRoleName = role;
    this.ManageUnitMembersComponentVar.sortKey = "id";
    this.ManageUnitMembersComponentVar.sortValue = "desc";
    this.ManageUnitMembersComponentVar.search(true, BODPosition, this.data["UNIT_ID"]);
    // this.ManageUnitMembersComponentVar.getMembers(this.data["UNIT_ID"]);
  }

  memberDrawerClose(): void {
    this.memberDrawerVisible = false;

    this.api.getAllUnitsTilesDetails(0, 0, "", "", " AND UNIT_ID=" + this.data["UNIT_ID"]).subscribe(data => {
      if (data['code'] == 200) {
        var updatedData = data['data'][0];
        this.getData1(updatedData);
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  get memberDrawerCloseCallback() {
    return this.memberDrawerClose.bind(this);
  }

  getWidth(): number {
    if (window.innerWidth <= 400)
      return 400;

    else
      return 1000;
  }

  sendForApprovalToFederationPresident(): void {
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();

    if (currentMonth <= 3) {
      currentYear = (currentYear - 1) + 1;

    } else {
      currentYear = currentYear;
    }

    this.isSpinning = true;
    let obj1 = new Object();
    obj1["UNIT_ID"] = this.data["UNIT_ID"];
    obj1["YEAR"] = currentYear;

    this.api.checkUnitBOD(obj1).subscribe(data => {
      if (data['code'] == 200) {
        this.message.success("New BOD Approval Email Sent to Federation President", "");
        this.isSpinning = false;
        this.gettingUnitBODStatus(this.data["UNIT_ID"]);

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

  sendForApprovalToUnitDirectorBtn: boolean = false;
  unitBODStatusData: any[] = [];

  gettingUnitBODStatus(unitID: number): void {
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();

    if (currentMonth <= 3) {
      currentYear = (currentYear - 1) + 1;

    } else {
      currentYear = currentYear;
    }

    this.api.gettingUnitBODStatus(0, 0, "", "", " AND UNIT_ID=" + unitID + " AND YEAR=" + currentYear).subscribe(data => {
      if ((data['code'] == 200)) {
        this.unitBODStatusData = data["data"];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  cancel() { }

  sendApprovalDrawerTitle: string = "";
  sendApprovalDrawerVisible: boolean = false;
  @ViewChild(UnitBodSendForApprovalComponent, { static: false }) UnitBodSendForApprovalComponentVar: UnitBodSendForApprovalComponent;
  DOCUMENTS_LIST: any;
  PAYMENT_LIST: any;
  BIO_DATA_LIST: any;
  UNIT_INFO: any;
  NEW_UNIT_BOD: any = [];

  sendForApprovalDrawerInitialization(): void {
    this.UnitBodSendForApprovalComponentVar.onComponentInitialized();
  }

  sendForApproval(): void {
    this.UNIT_INFO = this.data;
    this.sendApprovalDrawerTitle = "aaa " + "Send For Approval";

    if (this.data["FEDERATION_ID"]) {
      this.UnitBodSendForApprovalComponentVar.getFederationMemberData(this.data["FEDERATION_ID"]);
      this.UnitBodSendForApprovalComponentVar.getFederationcentralSpecialCommitteeMemberData(this.data["FEDERATION_ID"]);
    }

    if (this.data["UNIT_ID"]) {
      this.UnitBodSendForApprovalComponentVar.getUnitMemberData(this.data["UNIT_ID"]);
    }

    // Getting Next Year BOD
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();

    if (currentMonth <= 3) {
      currentYear = (currentYear - 1) + 1;

    } else {
      currentYear = currentYear;
    }

    this.UnitBodSendForApprovalComponentVar.loadingRecords = true;

    this.api.gettingNewUnitBOD(this.data["UNIT_ID"], currentYear).subscribe(data => {
      if ((data['code'] == 200)) {
        this.UnitBodSendForApprovalComponentVar.loadingRecords = false;
        this.NEW_UNIT_BOD = data["data"];
      }

    }, err => {
      this.UnitBodSendForApprovalComponentVar.loadingRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    // Get mailing list and new BOD list
    this.sendApprovalDrawerVisible = true;
    this.UnitBodSendForApprovalComponentVar.SUBJECT = "New BOD List For The Year " + currentYear + " of " + this.data["UNIT_NAME"];
    this.UnitBodSendForApprovalComponentVar.DESCRIPTION = 'Respected Sir/ Madam, <br><span style="text-align: justify;">With reference to the above subject, <br>The nomination committee has elected the new BOD list of <b>' + this.data["UNIT_NAME"] + '</b> for the year ' + currentYear + ' and sent for your information and necessary action. <br>Please check the links below for the same. </span><br><br>Enclosed here-with : <br>';

    let obj1 = new Object();
    obj1["UNIT_ID"] = this.data["UNIT_ID"];
    obj1["UNIT_NAME"] = this.data["UNIT_NAME"];
    obj1["YEAR"] = currentYear;

    this.api.sendForUnitApprovalToFederationPresident(obj1).subscribe(data => {
      if (data['code'] == 200) {
        this.DOCUMENTS_LIST = data["data"];

      } else {
        this.message.error(data['message'], "");
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  sendApprovalDrawerClose(): void {
    this.sendApprovalDrawerVisible = false;
    this.gettingUnitBODStatus(this.data["UNIT_ID"]);

    this.api.getAllUnitsTilesDetails(0, 0, "", "", " AND UNIT_ID=" + this.data["UNIT_ID"]).subscribe(data => {
      if (data['code'] == 200) {
        var updatedData = data['data'][0];
        this.getData1(updatedData);
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  get sendApprovalDrapwerCloseCallback() {
    return this.sendApprovalDrawerClose.bind(this);
  }

  deleteFinalisedBOD(): void {
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();

    if (currentMonth <= 3) {
      currentYear = (currentYear - 1) + 1;

    } else {
      currentYear = currentYear;
    }

    this.isSpinning = true;

    this.api.deleteFinalisedUnitBOD(this.data["UNIT_ID"], currentYear).subscribe(data => {
      if (data['code'] == 200) {
        this.isSpinning = false;
        this.message.success("Finalised BOD Deleted Successfully", "");
        this.gettingUnitBODStatus(this.data["UNIT_ID"]);
      }

    }, err => {
      this.isSpinning = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }
}