import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { FederationMaster } from 'src/app/Models/FederationMaster';
import { InchargeAreaMatser } from 'src/app/Models/InchargeAreaMaster';
import { ApiService } from 'src/app/Service/api.service';
import { ManageUnitMembersComponent } from '../../UnitMaster/manage-unit-members/manage-unit-members.component';
import { FederationBodSendForApprovalComponent } from '../federation-bod-send-for-approval/federation-bod-send-for-approval.component';
import { ManageFederationMembersComponent } from '../manage-federation-members/manage-federation-members.component';

@Component({
  selector: 'app-assign-federation-members',
  templateUrl: './assign-federation-members.component.html',
  styleUrls: ['./assign-federation-members.component.css']
})

export class AssignFederationMembersComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: FederationMaster;
  @Input() drawerVisible: boolean;
  roleID: number;
  isSpinning: boolean = false;
  isUnitSpinning: boolean = false;
  namePattern = "([A-Za-z0-9 \s]){1,}";
  imageRetriveURL = this.api.retriveimgUrl + "profileImage/";
  loggedMemberRoleID = Number(this._cookie.get("roleId"));

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

  getInchargeAreas() {
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

  reset(myForm: NgForm) {
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

  showModal(rID: number): void {
    this.roleID = rID;
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  members = [];
  memberLoading: boolean = false;

  getMembers() {
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
  unitBOD: string = "";
  memberList = [];

  centralCommittee1Photo: string = "";
  centralCommittee1Name: string = "";
  centralCommittee1Mobile: string = "";
  centralCommittee1Federation: string = "";
  centralCommittee1Unit: string = "";
  centralCommittee1Group: string = "";
  centralCommittee1Email: string = "";
  centralCommittee1DOB: string = "";
  centralCommittee1Address: string = "";
  centralCommittee1InchargeOf: string = "";

  centralCommittee2Photo: string = "";
  centralCommittee2Name: string = "";
  centralCommittee2Mobile: string = "";
  centralCommittee2Federation: string = "";
  centralCommittee2Unit: string = "";
  centralCommittee2Group: string = "";
  centralCommittee2Email: string = "";
  centralCommittee2DOB: string = "";
  centralCommittee2Address: string = "";
  centralCommittee2InchargeOf: string = "";

  centralCommittee3Photo: string = "";
  centralCommittee3Name: string = "";
  centralCommittee3Mobile: string = "";
  centralCommittee3Federation: string = "";
  centralCommittee3Unit: string = "";
  centralCommittee3Group: string = "";
  centralCommittee3Email: string = "";
  centralCommittee3DOB: string = "";
  centralCommittee3Address: string = "";
  centralCommittee3InchargeOf: string = "";

  specialCommittee1Photo: string = "";
  specialCommittee1Name: string = "";
  specialCommittee1Mobile: string = "";
  specialCommittee1Federation: string = "";
  specialCommittee1Unit: string = "";
  specialCommittee1Group: string = "";
  specialCommittee1Email: string = "";
  specialCommittee1DOB: string = "";
  specialCommittee1Address: string = "";
  specialCommittee1InchargeOf: string = "";

  specialCommittee2Photo: string = "";
  specialCommittee2Name: string = "";
  specialCommittee2Mobile: string = "";
  specialCommittee2Federation: string = "";
  specialCommittee2Unit: string = "";
  specialCommittee2Group: string = "";
  specialCommittee2Email: string = "";
  specialCommittee2DOB: string = "";
  specialCommittee2Address: string = "";
  specialCommittee2InchargeOf: string = "";

  specialCommittee3Photo: string = "";
  specialCommittee3Name: string = "";
  specialCommittee3Mobile: string = "";
  specialCommittee3Federation: string = "";
  specialCommittee3Unit: string = "";
  specialCommittee3Group: string = "";
  specialCommittee3Email: string = "";
  specialCommittee3DOB: string = "";
  specialCommittee3Address: string = "";
  specialCommittee3InchargeOf: string = "";

  presidentPhoto: string = "";
  presidentName: string = "";
  presidentMobile: string = "";
  presidentFederation: string = "";
  presidentUnit: string = "";
  presidentGroup: string = "";
  presidentEmail: string = "";
  presidentDOB: string = "";
  presidentAddress: string = "";
  presidentInchargeOf: string = "";

  ippPhoto: string = "";
  ippName: string = "";
  ippMobile: string = "";
  ippFederation: string = "";
  ippUnit: string = "";
  ippGroup: string = "";
  ippEmail: string = "";
  ippDOB: string = "";
  ippAddress: string = "";
  ippInchargeOf: string = "";

  vp1Photo: string = "";
  vp1Name: string = "";
  vp1Mobile: string = "";
  vp1Federation: string = "";
  vp1Unit: string = "";
  vp1Group: string = "";
  vp1Email: string = "";
  vp1DOB: string = "";
  vp1Address: string = "";
  vp1InchargeOf: string = "";

  vp2Photo: string = "";
  vp2Name: string = "";
  vp2Mobile: string = "";
  vp2Federation: string = "";
  vp2Unit: string = "";
  vp2Group: string = "";
  vp2Email: string = "";
  vp2DOB: string = "";
  vp2Address: string = "";
  vp2InchargeOf: string = "";

  vp3Photo: string = "";
  vp3Name: string = "";
  vp3Mobile: string = "";
  vp3Federation: string = "";
  vp3Unit: string = "";
  vp3Group: string = "";
  vp3Email: string = "";
  vp3DOB: string = "";
  vp3Address: string = "";
  vp3InchargeOf: string = "";

  secretaryPhoto: string = "";
  secretaryName: string = "";
  secretaryMobile: string = "";
  secretaryFederation: string = "";
  secretaryUnit: string = "";
  secretaryGroup: string = "";
  secretaryEmail: string = "";
  secretaryDOB: string = "";
  secretaryAddress: string = "";
  secretaryInchargeOf: string = "";

  coSecretaryPhoto: string = "";
  coSecretaryName: string = "";
  coSecretaryMobile: string = "";
  coSecretaryFederation: string = "";
  coSecretaryUnit: string = "";
  coSecretaryGroup: string = "";
  coSecretaryEmail: string = "";
  coSecretaryDOB: string = "";
  coSecretaryAddress: string = "";
  coSecretaryInchargeOf: string = "";

  treasurerPhoto: string = "";
  treasurerName: string = "";
  treasurerMobile: string = "";
  treasurerFederation: string = "";
  treasurerUnit: string = "";
  treasurerGroup: string = "";
  treasurerEmail: string = "";
  treasurerDOB: string = "";
  treasurerAddress: string = "";
  treasurerInchargeOf: string = "";

  pro1Photo: string = "";
  pro1Name: string = "";
  pro1Mobile: string = "";
  pro1Federation: string = "";
  pro1Unit: string = "";
  pro1Group: string = "";
  pro1Email: string = "";
  pro1DOB: string = "";
  pro1Address: string = "";
  pro1InchargeOf: string = "";

  pro2Photo: string = "";
  pro2Name: string = "";
  pro2Mobile: string = "";
  pro2Federation: string = "";
  pro2Unit: string = "";
  pro2Group: string = "";
  pro2Email: string = "";
  pro2DOB: string = "";
  pro2Address: string = "";
  pro2InchargeOf: string = "";

  coOrdinatorPhoto: string = "";
  coOrdinatorName: string = "";
  coOrdinatorMobile: string = "";
  coOrdinatorFederation: string = "";
  coOrdinatorUnit: string = "";
  coOrdinatorGroup: string = "";
  coOrdinatorEmail: string = "";
  coOrdinatorDOB: string = "";
  coOrdinatorAddress: string = "";
  coOrdinatorInchargeOf: string = "";

  specialOfficer1Photo: string = "";
  specialOfficer1Name: string = "";
  specialOfficer1Mobile: string = "";
  specialOfficer1Federation: string = "";
  specialOfficer1Unit: string = "";
  specialOfficer1Group: string = "";
  specialOfficer1Email: string = "";
  specialOfficer1DOB: string = "";
  specialOfficer1Address: string = "";
  specialOfficer1InchargeOf: string = "";

  specialOfficer2Photo: string = "";
  specialOfficer2Name: string = "";
  specialOfficer2Mobile: string = "";
  specialOfficer2Federation: string = "";
  specialOfficer2Unit: string = "";
  specialOfficer2Group: string = "";
  specialOfficer2Email: string = "";
  specialOfficer2DOB: string = "";
  specialOfficer2Address: string = "";
  specialOfficer2InchargeOf: string = "";

  specialOfficer3Photo: string = "";
  specialOfficer3Name: string = "";
  specialOfficer3Mobile: string = "";
  specialOfficer3Federation: string = "";
  specialOfficer3Unit: string = "";
  specialOfficer3Group: string = "";
  specialOfficer3Email: string = "";
  specialOfficer3DOB: string = "";
  specialOfficer3Address: string = "";
  specialOfficer3InchargeOf: string = "";

  specialOfficer4Photo: string = "";
  specialOfficer4Name: string = "";
  specialOfficer4Mobile: string = "";
  specialOfficer4Federation: string = "";
  specialOfficer4Unit: string = "";
  specialOfficer4Group: string = "";
  specialOfficer4Email: string = "";
  specialOfficer4DOB: string = "";
  specialOfficer4Address: string = "";
  specialOfficer4InchargeOf: string = "";

  federationOfficer1Photo: string = "";
  federationOfficer1Name: string = "";
  federationOfficer1Mobile: string = "";
  federationOfficer1Federation: string = "";
  federationOfficer1Unit: string = "";
  federationOfficer1Group: string = "";
  federationOfficer1Email: string = "";
  federationOfficer1DOB: string = "";
  federationOfficer1Address: string = "";
  federationOfficer1InchargeOf: string = "";

  federationOfficer2Photo: string = "";
  federationOfficer2Name: string = "";
  federationOfficer2Mobile: string = "";
  federationOfficer2Federation: string = "";
  federationOfficer2Unit: string = "";
  federationOfficer2Group: string = "";
  federationOfficer2Email: string = "";
  federationOfficer2DOB: string = "";
  federationOfficer2Address: string = "";
  federationOfficer2InchargeOf: string = "";

  federationOfficer3Photo: string = "";
  federationOfficer3Name: string = "";
  federationOfficer3Mobile: string = "";
  federationOfficer3Federation: string = "";
  federationOfficer3Unit: string = "";
  federationOfficer3Group: string = "";
  federationOfficer3Email: string = "";
  federationOfficer3DOB: string = "";
  federationOfficer3Address: string = "";
  federationOfficer3InchargeOf: string = "";

  federationOfficer4Photo: string = "";
  federationOfficer4Name: string = "";
  federationOfficer4Mobile: string = "";
  federationOfficer4Federation: string = "";
  federationOfficer4Unit: string = "";
  federationOfficer4Group: string = "";
  federationOfficer4Email: string = "";
  federationOfficer4DOB: string = "";
  federationOfficer4Address: string = "";
  federationOfficer4InchargeOf: string = "";

  federationOfficer5Photo: string = "";
  federationOfficer5Name: string = "";
  federationOfficer5Mobile: string = "";
  federationOfficer5Federation: string = "";
  federationOfficer5Unit: string = "";
  federationOfficer5Group: string = "";
  federationOfficer5Email: string = "";
  federationOfficer5DOB: string = "";
  federationOfficer5Address: string = "";
  federationOfficer5InchargeOf: string = "";

  federationOfficer6Photo: string = "";
  federationOfficer6Name: string = "";
  federationOfficer6Mobile: string = "";
  federationOfficer6Federation: string = "";
  federationOfficer6Unit: string = "";
  federationOfficer6Group: string = "";
  federationOfficer6Email: string = "";
  federationOfficer6DOB: string = "";
  federationOfficer6Address: string = "";
  federationOfficer6InchargeOf: string = "";

  federationOfficer7Photo: string = "";
  federationOfficer7Name: string = "";
  federationOfficer7Mobile: string = "";
  federationOfficer7Federation: string = "";
  federationOfficer7Unit: string = "";
  federationOfficer7Group: string = "";
  federationOfficer7Email: string = "";
  federationOfficer7DOB: string = "";
  federationOfficer7Address: string = "";
  federationOfficer7InchargeOf: string = "";

  federationOfficer8Photo: string = "";
  federationOfficer8Name: string = "";
  federationOfficer8Mobile: string = "";
  federationOfficer8Federation: string = "";
  federationOfficer8Unit: string = "";
  federationOfficer8Group: string = "";
  federationOfficer8Email: string = "";
  federationOfficer8DOB: string = "";
  federationOfficer8Address: string = "";
  federationOfficer8InchargeOf: string = "";

  federationOfficer9Photo: string = "";
  federationOfficer9Name: string = "";
  federationOfficer9Mobile: string = "";
  federationOfficer9Federation: string = "";
  federationOfficer9Unit: string = "";
  federationOfficer9Group: string = "";
  federationOfficer9Email: string = "";
  federationOfficer9DOB: string = "";
  federationOfficer9Address: string = "";
  federationOfficer9InchargeOf: string = "";

  federationOfficer10Photo: string = "";
  federationOfficer10Name: string = "";
  federationOfficer10Mobile: string = "";
  federationOfficer10Federation: string = "";
  federationOfficer10Unit: string = "";
  federationOfficer10Group: string = "";
  federationOfficer10Email: string = "";
  federationOfficer10DOB: string = "";
  federationOfficer10Address: string = "";
  federationOfficer10InchargeOf: string = "";

  federationOfficer11Photo: string = "";
  federationOfficer11Name: string = "";
  federationOfficer11Mobile: string = "";
  federationOfficer11Federation: string = "";
  federationOfficer11Unit: string = "";
  federationOfficer11Group: string = "";
  federationOfficer11Email: string = "";
  federationOfficer11DOB: string = "";
  federationOfficer11Address: string = "";
  federationOfficer11InchargeOf: string = "";

  federationOfficer12Photo: string = "";
  federationOfficer12Name: string = "";
  federationOfficer12Mobile: string = "";
  federationOfficer12Federation: string = "";
  federationOfficer12Unit: string = "";
  federationOfficer12Group: string = "";
  federationOfficer12Email: string = "";
  federationOfficer12DOB: string = "";
  federationOfficer12Address: string = "";
  federationOfficer12InchargeOf: string = "";

  federationOfficer13Photo: string = "";
  federationOfficer13Name: string = "";
  federationOfficer13Mobile: string = "";
  federationOfficer13Federation: string = "";
  federationOfficer13Unit: string = "";
  federationOfficer13Group: string = "";
  federationOfficer13Email: string = "";
  federationOfficer13DOB: string = "";
  federationOfficer13Address: string = "";
  federationOfficer13InchargeOf: string = "";

  federationOfficer14Photo: string = "";
  federationOfficer14Name: string = "";
  federationOfficer14Mobile: string = "";
  federationOfficer14Federation: string = "";
  federationOfficer14Unit: string = "";
  federationOfficer14Group: string = "";
  federationOfficer14Email: string = "";
  federationOfficer14DOB: string = "";
  federationOfficer14Address: string = "";
  federationOfficer14InchargeOf: string = "";

  federationOfficer15Photo: string = "";
  federationOfficer15Name: string = "";
  federationOfficer15Mobile: string = "";
  federationOfficer15Federation: string = "";
  federationOfficer15Unit: string = "";
  federationOfficer15Group: string = "";
  federationOfficer15Email: string = "";
  federationOfficer15DOB: string = "";
  federationOfficer15Address: string = "";
  federationOfficer15InchargeOf: string = "";

  federationOfficer16Photo: string = "";
  federationOfficer16Name: string = "";
  federationOfficer16Mobile: string = "";
  federationOfficer16Federation: string = "";
  federationOfficer16Unit: string = "";
  federationOfficer16Group: string = "";
  federationOfficer16Email: string = "";
  federationOfficer16DOB: string = "";
  federationOfficer16Address: string = "";
  federationOfficer16InchargeOf: string = "";

  federationOfficer17Photo: string = "";
  federationOfficer17Name: string = "";
  federationOfficer17Mobile: string = "";
  federationOfficer17Federation: string = "";
  federationOfficer17Unit: string = "";
  federationOfficer17Group: string = "";
  federationOfficer17Email: string = "";
  federationOfficer17DOB: string = "";
  federationOfficer17Address: string = "";
  federationOfficer17InchargeOf: string = "";

  federationOfficer18Photo: string = "";
  federationOfficer18Name: string = "";
  federationOfficer18Mobile: string = "";
  federationOfficer18Federation: string = "";
  federationOfficer18Unit: string = "";
  federationOfficer18Group: string = "";
  federationOfficer18Email: string = "";
  federationOfficer18DOB: string = "";
  federationOfficer18Address: string = "";
  federationOfficer18InchargeOf: string = "";

  coOrdinator2Photo: string = "";
  coOrdinator2Name: string = "";
  coOrdinator2Mobile: string = "";
  coOrdinator2Federation: string = "";
  coOrdinator2Unit: string = "";
  coOrdinator2Group: string = "";
  coOrdinator2Email: string = "";
  coOrdinator2DOB: string = "";
  coOrdinator2Address: string = "";
  coOrdinator2InchargeOf: string = "";

  unit1DirectorPhoto: string = "";
  unit1DirectorName: string = "";
  unit1DirectorMobile: string = "";
  unit1DirectorFederation: string = "";
  unit1DirectorUnit: string = "";
  unit1DirectorGroup: string = "";
  unit1Email: string = "";
  unit1DOB: string = "";
  unit1Address: string = "";
  unit1InchargeOf: string = "";

  unit2DirectorPhoto: string = "";
  unit2DirectorName: string = "";
  unit2DirectorMobile: string = "";
  unit2DirectorFederation: string = "";
  unit2DirectorUnit: string = "";
  unit2DirectorGroup: string = "";
  unit2Email: string = "";
  unit2DOB: string = "";
  unit2Address: string = "";
  unit2InchargeOf: string = "";

  unit3DirectorPhoto: string = "";
  unit3DirectorName: string = "";
  unit3DirectorMobile: string = "";
  unit3DirectorFederation: string = "";
  unit3DirectorUnit: string = "";
  unit3DirectorGroup: string = "";
  unit3Email: string = "";
  unit3DOB: string = "";
  unit3Address: string = "";
  unit3InchargeOf: string = "";

  unit4DirectorPhoto: string = "";
  unit4DirectorName: string = "";
  unit4DirectorMobile: string = "";
  unit4DirectorFederation: string = "";
  unit4DirectorUnit: string = "";
  unit4DirectorGroup: string = "";
  unit4Email: string = "";
  unit4DOB: string = "";
  unit4Address: string = "";
  unit4InchargeOf: string = "";

  unit5DirectorPhoto: string = "";
  unit5DirectorName: string = "";
  unit5DirectorMobile: string = "";
  unit5DirectorFederation: string = "";
  unit5DirectorUnit: string = "";
  unit5DirectorGroup: string = "";
  unit5Email: string = "";
  unit5DOB: string = "";
  unit5Address: string = "";
  unit5InchargeOf: string = "";

  unit6DirectorPhoto: string = "";
  unit6DirectorName: string = "";
  unit6DirectorMobile: string = "";
  unit6DirectorFederation: string = "";
  unit6DirectorUnit: string = "";
  unit6DirectorGroup: string = "";
  unit6Email: string = "";
  unit6DOB: string = "";
  unit6Address: string = "";
  unit6InchargeOf: string = "";

  unit7DirectorPhoto: string = "";
  unit7DirectorName: string = "";
  unit7DirectorMobile: string = "";
  unit7DirectorFederation: string = "";
  unit7DirectorUnit: string = "";
  unit7DirectorGroup: string = "";
  unit7Email: string = "";
  unit7DOB: string = "";
  unit7Address: string = "";
  unit7InchargeOf: string = "";

  unit8DirectorPhoto: string = "";
  unit8DirectorName: string = "";
  unit8DirectorMobile: string = "";
  unit8DirectorFederation: string = "";
  unit8DirectorUnit: string = "";
  unit8DirectorGroup: string = "";
  unit8Email: string = "";
  unit8DOB: string = "";
  unit8Address: string = "";
  unit8InchargeOf: string = "";

  unit9DirectorPhoto: string = "";
  unit9DirectorName: string = "";
  unit9DirectorMobile: string = "";
  unit9DirectorFederation: string = "";
  unit9DirectorUnit: string = "";
  unit9DirectorGroup: string = "";
  unit9Email: string = "";
  unit9DOB: string = "";
  unit9Address: string = "";
  unit9InchargeOf: string = "";

  unit10DirectorPhoto: string = "";
  unit10DirectorName: string = "";
  unit10DirectorMobile: string = "";
  unit10DirectorFederation: string = "";
  unit10DirectorUnit: string = "";
  unit10DirectorGroup: string = "";
  unit10Email: string = "";
  unit10DOB: string = "";
  unit10Address: string = "";
  unit10InchargeOf: string = "";

  unit11DirectorPhoto: string = "";
  unit11DirectorName: string = "";
  unit11DirectorMobile: string = "";
  unit11DirectorFederation: string = "";
  unit11DirectorUnit: string = "";
  unit11DirectorGroup: string = "";
  unit11Email: string = "";
  unit11DOB: string = "";
  unit11Address: string = "";
  unit11InchargeOf: string = "";

  unit12DirectorPhoto: string = "";
  unit12DirectorName: string = "";
  unit12DirectorMobile: string = "";
  unit12DirectorFederation: string = "";
  unit12DirectorUnit: string = "";
  unit12DirectorGroup: string = "";
  unit12Email: string = "";
  unit12DOB: string = "";
  unit12Address: string = "";
  unit12InchargeOf: string = "";

  unit13DirectorPhoto: string = "";
  unit13DirectorName: string = "";
  unit13DirectorMobile: string = "";
  unit13DirectorFederation: string = "";
  unit13DirectorUnit: string = "";
  unit13DirectorGroup: string = "";
  unit13Email: string = "";
  unit13DOB: string = "";
  unit13Address: string = "";
  unit13InchargeOf: string = "";

  unit14DirectorPhoto: string = "";
  unit14DirectorName: string = "";
  unit14DirectorMobile: string = "";
  unit14DirectorFederation: string = "";
  unit14DirectorUnit: string = "";
  unit14DirectorGroup: string = "";
  unit14Email: string = "";
  unit14DOB: string = "";
  unit14Address: string = "";
  unit14InchargeOf: string = "";

  centralCommittee1YesNo: boolean = false;
  centralCommittee2YesNo: boolean = false;
  centralCommittee3YesNo: boolean = false;
  specialCommittee1YesNo: boolean = false;
  specialCommittee2YesNo: boolean = false;
  specialCommittee3YesNo: boolean = false;
  presidentYesNo: boolean = false;
  ippYesNo: boolean = false;
  vp1YesNo: boolean = false;
  vp2YesNo: boolean = false;
  vp3YesNo: boolean = false;
  secretaryYesNo: boolean = false;
  coSecretaryYesNo: boolean = false;
  treasurerYesNo: boolean = false;
  pro1YesNo: boolean = false;
  pro2YesNo: boolean = false;
  coOrdinatorYesNo: boolean = false;
  specialOfficer1YesNo: boolean = false;
  specialOfficer2YesNo: boolean = false;
  specialOfficer3YesNo: boolean = false;
  specialOfficer4YesNo: boolean = false;
  federationOfficer1YesNo: boolean = false;
  federationOfficer2YesNo: boolean = false;
  federationOfficer3YesNo: boolean = false;
  federationOfficer4YesNo: boolean = false;
  federationOfficer5YesNo: boolean = false;
  federationOfficer6YesNo: boolean = false;
  federationOfficer7YesNo: boolean = false;
  federationOfficer8YesNo: boolean = false;
  federationOfficer9YesNo: boolean = false;
  federationOfficer10YesNo: boolean = false;
  federationOfficer11YesNo: boolean = false;
  federationOfficer12YesNo: boolean = false;
  federationOfficer13YesNo: boolean = false;
  federationOfficer14YesNo: boolean = false;
  federationOfficer15YesNo: boolean = false;
  federationOfficer16YesNo: boolean = false;
  federationOfficer17YesNo: boolean = false;
  coOrdinator2YesNo: boolean = false;
  federationOfficer18YesNo: boolean = false;

  clearValues() {
    this.centralCommittee1Photo = "assets/anony.png";
    this.centralCommittee1Name = "";
    this.centralCommittee1Mobile = "";
    this.centralCommittee1Federation = "";
    this.centralCommittee1Unit = "";
    this.centralCommittee1Group = "";
    this.centralCommittee1Email = "";
    this.centralCommittee1DOB = "";
    this.centralCommittee1Address = "";
    this.centralCommittee1InchargeOf = "";

    this.centralCommittee2Photo = "assets/anony.png";
    this.centralCommittee2Name = "";
    this.centralCommittee2Mobile = "";
    this.centralCommittee2Federation = "";
    this.centralCommittee2Unit = "";
    this.centralCommittee2Group = "";
    this.centralCommittee2Email = "";
    this.centralCommittee2DOB = "";
    this.centralCommittee2Address = "";
    this.centralCommittee2InchargeOf = "";

    this.centralCommittee3Photo = "assets/anony.png";
    this.centralCommittee3Name = "";
    this.centralCommittee3Mobile = "";
    this.centralCommittee3Federation = "";
    this.centralCommittee3Unit = "";
    this.centralCommittee3Group = "";
    this.centralCommittee3Email = "";
    this.centralCommittee3DOB = "";
    this.centralCommittee3Address = "";
    this.centralCommittee3InchargeOf = "";

    this.specialCommittee1Photo = "assets/anony.png";
    this.specialCommittee1Name = "";
    this.specialCommittee1Mobile = "";
    this.specialCommittee1Federation = "";
    this.specialCommittee1Unit = "";
    this.specialCommittee1Group = "";
    this.specialCommittee1Email = "";
    this.specialCommittee1DOB = "";
    this.specialCommittee1Address = "";
    this.specialCommittee1InchargeOf = "";

    this.specialCommittee2Photo = "assets/anony.png";
    this.specialCommittee2Name = "";
    this.specialCommittee2Mobile = "";
    this.specialCommittee2Federation = "";
    this.specialCommittee2Unit = "";
    this.specialCommittee2Group = "";
    this.specialCommittee2Email = "";
    this.specialCommittee2DOB = "";
    this.specialCommittee2Address = "";
    this.specialCommittee2InchargeOf = "";

    this.specialCommittee3Photo = "assets/anony.png";
    this.specialCommittee3Name = "";
    this.specialCommittee3Mobile = "";
    this.specialCommittee3Federation = "";
    this.specialCommittee3Unit = "";
    this.specialCommittee3Group = "";
    this.specialCommittee3Email = "";
    this.specialCommittee3DOB = "";
    this.specialCommittee3Address = "";
    this.specialCommittee3InchargeOf = "";

    this.presidentPhoto = "assets/anony.png";
    this.presidentName = "";
    this.presidentMobile = "";
    this.presidentFederation = "";
    this.presidentUnit = "";
    this.presidentGroup = "";
    this.presidentEmail = "";
    this.presidentDOB = "";
    this.presidentAddress = "";
    this.presidentInchargeOf = "";

    this.ippPhoto = "assets/anony.png";
    this.ippName = "";
    this.ippMobile = "";
    this.ippFederation = "";
    this.ippUnit = "";
    this.ippGroup = "";
    this.ippEmail = "";
    this.ippDOB = "";
    this.ippAddress = "";
    this.ippInchargeOf = "";

    this.vp1Photo = "assets/anony.png";
    this.vp1Name = "";
    this.vp1Mobile = "";
    this.vp1Federation = "";
    this.vp1Unit = "";
    this.vp1Group = "";
    this.vp1Email = "";
    this.vp1DOB = "";
    this.vp1Address = "";
    this.vp1InchargeOf = "";

    this.vp2Photo = "assets/anony.png";
    this.vp2Name = "";
    this.vp2Mobile = "";
    this.vp2Federation = "";
    this.vp2Unit = "";
    this.vp2Group = "";
    this.vp2Email = "";
    this.vp2DOB = "";
    this.vp2Address = "";
    this.vp2InchargeOf = "";

    this.vp3Photo = "assets/anony.png";
    this.vp3Name = "";
    this.vp3Mobile = "";
    this.vp3Federation = "";
    this.vp3Unit = "";
    this.vp3Group = "";
    this.vp3Email = "";
    this.vp3DOB = "";
    this.vp3Address = "";
    this.vp3InchargeOf = "";

    this.secretaryPhoto = "assets/anony.png";
    this.secretaryName = "";
    this.secretaryMobile = "";
    this.secretaryFederation = "";
    this.secretaryUnit = "";
    this.secretaryGroup = "";
    this.secretaryEmail = "";
    this.secretaryDOB = "";
    this.secretaryAddress = "";
    this.secretaryInchargeOf = "";

    this.coSecretaryPhoto = "assets/anony.png";
    this.coSecretaryName = "";
    this.coSecretaryMobile = "";
    this.coSecretaryFederation = "";
    this.coSecretaryUnit = "";
    this.coSecretaryGroup = "";
    this.coSecretaryEmail = "";
    this.coSecretaryDOB = "";
    this.coSecretaryAddress = "";
    this.coSecretaryInchargeOf = "";

    this.treasurerPhoto = "assets/anony.png";
    this.treasurerName = "";
    this.treasurerMobile = "";
    this.treasurerFederation = "";
    this.treasurerUnit = "";
    this.treasurerGroup = "";
    this.treasurerEmail = "";
    this.treasurerDOB = "";
    this.treasurerAddress = "";
    this.treasurerInchargeOf = "";

    this.pro1Photo = "assets/anony.png";
    this.pro1Name = "";
    this.pro1Mobile = "";
    this.pro1Federation = "";
    this.pro1Unit = "";
    this.pro1Group = "";
    this.pro1Email = "";
    this.pro1DOB = "";
    this.pro1Address = "";
    this.pro1InchargeOf = "";

    this.pro2Photo = "assets/anony.png";
    this.pro2Name = "";
    this.pro2Mobile = "";
    this.pro2Federation = "";
    this.pro2Unit = "";
    this.pro2Group = "";
    this.pro2Email = "";
    this.pro2DOB = "";
    this.pro2Address = "";
    this.pro2InchargeOf = "";

    this.coOrdinatorPhoto = "assets/anony.png";
    this.coOrdinatorName = "";
    this.coOrdinatorMobile = "";
    this.coOrdinatorFederation = "";
    this.coOrdinatorUnit = "";
    this.coOrdinatorGroup = "";
    this.coOrdinatorEmail = "";
    this.coOrdinatorDOB = "";
    this.coOrdinatorAddress = "";
    this.coOrdinatorInchargeOf = "";

    this.specialOfficer1Photo = "assets/anony.png";
    this.specialOfficer1Name = "";
    this.specialOfficer1Mobile = "";
    this.specialOfficer1Federation = "";
    this.specialOfficer1Unit = "";
    this.specialOfficer1Group = "";
    this.specialOfficer1Email = "";
    this.specialOfficer1DOB = "";
    this.specialOfficer1Address = "";
    this.specialOfficer1InchargeOf = "";

    this.specialOfficer2Photo = "assets/anony.png";
    this.specialOfficer2Name = "";
    this.specialOfficer2Mobile = "";
    this.specialOfficer2Federation = "";
    this.specialOfficer2Unit = "";
    this.specialOfficer2Group = "";
    this.specialOfficer2Email = "";
    this.specialOfficer2DOB = "";
    this.specialOfficer2Address = "";
    this.specialOfficer2InchargeOf = "";

    this.specialOfficer3Photo = "assets/anony.png";
    this.specialOfficer3Name = "";
    this.specialOfficer3Mobile = "";
    this.specialOfficer3Federation = "";
    this.specialOfficer3Unit = "";
    this.specialOfficer3Group = "";
    this.specialOfficer3Email = "";
    this.specialOfficer3DOB = "";
    this.specialOfficer3Address = "";
    this.specialOfficer3InchargeOf = "";

    this.specialOfficer4Photo = "assets/anony.png";
    this.specialOfficer4Name = "";
    this.specialOfficer4Mobile = "";
    this.specialOfficer4Federation = "";
    this.specialOfficer4Unit = "";
    this.specialOfficer4Group = "";
    this.specialOfficer4Email = "";
    this.specialOfficer4DOB = "";
    this.specialOfficer4Address = "";
    this.specialOfficer4InchargeOf = "";

    this.federationOfficer1Photo = "assets/anony.png";
    this.federationOfficer1Name = "";
    this.federationOfficer1Mobile = "";
    this.federationOfficer1Federation = "";
    this.federationOfficer1Unit = "";
    this.federationOfficer1Group = "";
    this.federationOfficer1Email = "";
    this.federationOfficer1DOB = "";
    this.federationOfficer1Address = "";
    this.federationOfficer1InchargeOf = "";

    this.federationOfficer2Photo = "assets/anony.png";
    this.federationOfficer2Name = "";
    this.federationOfficer2Mobile = "";
    this.federationOfficer2Federation = "";
    this.federationOfficer2Unit = "";
    this.federationOfficer2Group = "";
    this.federationOfficer2Email = "";
    this.federationOfficer2DOB = "";
    this.federationOfficer2Address = "";
    this.federationOfficer2InchargeOf = "";

    this.federationOfficer3Photo = "assets/anony.png";
    this.federationOfficer3Name = "";
    this.federationOfficer3Mobile = "";
    this.federationOfficer3Federation = "";
    this.federationOfficer3Unit = "";
    this.federationOfficer3Group = "";
    this.federationOfficer3Email = "";
    this.federationOfficer3DOB = "";
    this.federationOfficer3Address = "";
    this.federationOfficer3InchargeOf = "";

    this.federationOfficer4Photo = "assets/anony.png";
    this.federationOfficer4Name = "";
    this.federationOfficer4Mobile = "";
    this.federationOfficer4Federation = "";
    this.federationOfficer4Unit = "";
    this.federationOfficer4Group = "";
    this.federationOfficer4Email = "";
    this.federationOfficer4DOB = "";
    this.federationOfficer4Address = "";
    this.federationOfficer4InchargeOf = "";

    this.federationOfficer5Photo = "assets/anony.png";
    this.federationOfficer5Name = "";
    this.federationOfficer5Mobile = "";
    this.federationOfficer5Federation = "";
    this.federationOfficer5Unit = "";
    this.federationOfficer5Group = "";
    this.federationOfficer5Email = "";
    this.federationOfficer5DOB = "";
    this.federationOfficer5Address = "";
    this.federationOfficer5InchargeOf = "";

    this.federationOfficer6Photo = "assets/anony.png";
    this.federationOfficer6Name = "";
    this.federationOfficer6Mobile = "";
    this.federationOfficer6Federation = "";
    this.federationOfficer6Unit = "";
    this.federationOfficer6Group = "";
    this.federationOfficer6Email = "";
    this.federationOfficer6DOB = "";
    this.federationOfficer6Address = "";
    this.federationOfficer6InchargeOf = "";

    this.federationOfficer7Photo = "assets/anony.png";
    this.federationOfficer7Name = "";
    this.federationOfficer7Mobile = "";
    this.federationOfficer7Federation = "";
    this.federationOfficer7Unit = "";
    this.federationOfficer7Group = "";
    this.federationOfficer7Email = "";
    this.federationOfficer7DOB = "";
    this.federationOfficer7Address = "";
    this.federationOfficer7InchargeOf = "";

    this.federationOfficer8Photo = "assets/anony.png";
    this.federationOfficer8Name = "";
    this.federationOfficer8Mobile = "";
    this.federationOfficer8Federation = "";
    this.federationOfficer8Unit = "";
    this.federationOfficer8Group = "";
    this.federationOfficer8Email = "";
    this.federationOfficer8DOB = "";
    this.federationOfficer8Address = "";
    this.federationOfficer8InchargeOf = "";

    this.federationOfficer9Photo = "assets/anony.png";
    this.federationOfficer9Name = "";
    this.federationOfficer9Mobile = "";
    this.federationOfficer9Federation = "";
    this.federationOfficer9Unit = "";
    this.federationOfficer9Group = "";
    this.federationOfficer9Email = "";
    this.federationOfficer9DOB = "";
    this.federationOfficer9Address = "";
    this.federationOfficer9InchargeOf = "";

    this.federationOfficer10Photo = "assets/anony.png";
    this.federationOfficer10Name = "";
    this.federationOfficer10Mobile = "";
    this.federationOfficer10Federation = "";
    this.federationOfficer10Unit = "";
    this.federationOfficer10Group = "";
    this.federationOfficer10Email = "";
    this.federationOfficer10DOB = "";
    this.federationOfficer10Address = "";
    this.federationOfficer10InchargeOf = "";

    this.federationOfficer11Photo = "assets/anony.png";
    this.federationOfficer11Name = "";
    this.federationOfficer11Mobile = "";
    this.federationOfficer11Federation = "";
    this.federationOfficer11Unit = "";
    this.federationOfficer11Group = "";
    this.federationOfficer11Email = "";
    this.federationOfficer11DOB = "";
    this.federationOfficer11Address = "";
    this.federationOfficer11InchargeOf = "";

    this.federationOfficer12Photo = "assets/anony.png";
    this.federationOfficer12Name = "";
    this.federationOfficer12Mobile = "";
    this.federationOfficer12Federation = "";
    this.federationOfficer12Unit = "";
    this.federationOfficer12Group = "";
    this.federationOfficer12Email = "";
    this.federationOfficer12DOB = "";
    this.federationOfficer12Address = "";
    this.federationOfficer12InchargeOf = "";

    this.federationOfficer13Photo = "assets/anony.png";
    this.federationOfficer13Name = "";
    this.federationOfficer13Mobile = "";
    this.federationOfficer13Federation = "";
    this.federationOfficer13Unit = "";
    this.federationOfficer13Group = "";
    this.federationOfficer13Email = "";
    this.federationOfficer13DOB = "";
    this.federationOfficer13Address = "";
    this.federationOfficer13InchargeOf = "";

    this.federationOfficer14Photo = "assets/anony.png";
    this.federationOfficer14Name = "";
    this.federationOfficer14Mobile = "";
    this.federationOfficer14Federation = "";
    this.federationOfficer14Unit = "";
    this.federationOfficer14Group = "";
    this.federationOfficer14Email = "";
    this.federationOfficer14DOB = "";
    this.federationOfficer14Address = "";
    this.federationOfficer14InchargeOf = "";

    this.federationOfficer15Photo = "assets/anony.png";
    this.federationOfficer15Name = "";
    this.federationOfficer15Mobile = "";
    this.federationOfficer15Federation = "";
    this.federationOfficer15Unit = "";
    this.federationOfficer15Group = "";
    this.federationOfficer15Email = "";
    this.federationOfficer15DOB = "";
    this.federationOfficer15Address = "";
    this.federationOfficer15InchargeOf = "";

    this.federationOfficer16Photo = "assets/anony.png";
    this.federationOfficer16Name = "";
    this.federationOfficer16Mobile = "";
    this.federationOfficer16Federation = "";
    this.federationOfficer16Unit = "";
    this.federationOfficer16Group = "";
    this.federationOfficer16Email = "";
    this.federationOfficer16DOB = "";
    this.federationOfficer16Address = "";
    this.federationOfficer16InchargeOf = "";

    this.federationOfficer17Photo = "assets/anony.png";
    this.federationOfficer17Name = "";
    this.federationOfficer17Mobile = "";
    this.federationOfficer17Federation = "";
    this.federationOfficer17Unit = "";
    this.federationOfficer17Group = "";
    this.federationOfficer17Email = "";
    this.federationOfficer17DOB = "";
    this.federationOfficer17Address = "";
    this.federationOfficer17InchargeOf = "";

    this.federationOfficer18Photo = "assets/anony.png";
    this.federationOfficer18Name = "";
    this.federationOfficer18Mobile = "";
    this.federationOfficer18Federation = "";
    this.federationOfficer18Unit = "";
    this.federationOfficer18Group = "";
    this.federationOfficer18Email = "";
    this.federationOfficer18DOB = "";
    this.federationOfficer18Address = "";
    this.federationOfficer18InchargeOf = "";

    this.coOrdinator2Photo = "assets/anony.png";
    this.coOrdinator2Name = "";
    this.coOrdinator2Mobile = "";
    this.coOrdinator2Federation = "";
    this.coOrdinator2Unit = "";
    this.coOrdinator2Group = "";
    this.coOrdinator2Email = "";
    this.coOrdinator2DOB = "";
    this.coOrdinator2Address = "";
    this.coOrdinator2InchargeOf = "";

    this.unit1DirectorPhoto = "assets/anony.png";
    this.unit1DirectorName = "";
    this.unit1DirectorMobile = "";
    this.unit1DirectorFederation = "";
    this.unit1DirectorUnit = "";
    this.unit1DirectorGroup = "";
    this.unit1Email = "";
    this.unit1DOB = "";
    this.unit1Address = "";
    this.unit1InchargeOf = "";

    this.unit2DirectorPhoto = "assets/anony.png";
    this.unit2DirectorName = "";
    this.unit2DirectorMobile = "";
    this.unit2DirectorFederation = "";
    this.unit2DirectorUnit = "";
    this.unit2DirectorGroup = "";
    this.unit2Email = "";
    this.unit2DOB = "";
    this.unit2Address = "";
    this.unit2InchargeOf = "";

    this.unit3DirectorPhoto = "assets/anony.png";
    this.unit3DirectorName = "";
    this.unit3DirectorMobile = "";
    this.unit3DirectorFederation = "";
    this.unit3DirectorUnit = "";
    this.unit3DirectorGroup = "";
    this.unit3Email = "";
    this.unit3DOB = "";
    this.unit3Address = "";
    this.unit3InchargeOf = "";

    this.unit4DirectorPhoto = "assets/anony.png";
    this.unit4DirectorName = "";
    this.unit4DirectorMobile = "";
    this.unit4DirectorFederation = "";
    this.unit4DirectorUnit = "";
    this.unit4DirectorGroup = "";
    this.unit4Email = "";
    this.unit4DOB = "";
    this.unit4Address = "";
    this.unit4InchargeOf = "";

    this.unit5DirectorPhoto = "assets/anony.png";
    this.unit5DirectorName = "";
    this.unit5DirectorMobile = "";
    this.unit5DirectorFederation = "";
    this.unit5DirectorUnit = "";
    this.unit5DirectorGroup = "";
    this.unit5Email = "";
    this.unit5DOB = "";
    this.unit5Address = "";
    this.unit5InchargeOf = "";

    this.unit6DirectorPhoto = "assets/anony.png";
    this.unit6DirectorName = "";
    this.unit6DirectorMobile = "";
    this.unit6DirectorFederation = "";
    this.unit6DirectorUnit = "";
    this.unit6DirectorGroup = "";
    this.unit6Email = "";
    this.unit6DOB = "";
    this.unit6Address = "";
    this.unit6InchargeOf = "";

    this.unit7DirectorPhoto = "assets/anony.png";
    this.unit7DirectorName = "";
    this.unit7DirectorMobile = "";
    this.unit7DirectorFederation = "";
    this.unit7DirectorUnit = "";
    this.unit7DirectorGroup = "";
    this.unit7Email = "";
    this.unit7DOB = "";
    this.unit7Address = "";
    this.unit7InchargeOf = "";

    this.unit8DirectorPhoto = "assets/anony.png";
    this.unit8DirectorName = "";
    this.unit8DirectorMobile = "";
    this.unit8DirectorFederation = "";
    this.unit8DirectorUnit = "";
    this.unit8DirectorGroup = "";
    this.unit8Email = "";
    this.unit8DOB = "";
    this.unit8Address = "";
    this.unit8InchargeOf = "";

    this.unit9DirectorPhoto = "assets/anony.png";
    this.unit9DirectorName = "";
    this.unit9DirectorMobile = "";
    this.unit9DirectorFederation = "";
    this.unit9DirectorUnit = "";
    this.unit9DirectorGroup = "";
    this.unit9Email = "";
    this.unit9DOB = "";
    this.unit9Address = "";
    this.unit9InchargeOf = "";

    this.unit10DirectorPhoto = "assets/anony.png";
    this.unit10DirectorName = "";
    this.unit10DirectorMobile = "";
    this.unit10DirectorFederation = "";
    this.unit10DirectorUnit = "";
    this.unit10DirectorGroup = "";
    this.unit10Email = "";
    this.unit10DOB = "";
    this.unit10Address = "";
    this.unit10InchargeOf = "";

    this.unit11DirectorPhoto = "assets/anony.png";
    this.unit11DirectorName = "";
    this.unit11DirectorMobile = "";
    this.unit11DirectorFederation = "";
    this.unit11DirectorUnit = "";
    this.unit11DirectorGroup = "";
    this.unit11Email = "";
    this.unit11DOB = "";
    this.unit11Address = "";
    this.unit11InchargeOf = "";

    this.unit12DirectorPhoto = "assets/anony.png";
    this.unit12DirectorName = "";
    this.unit12DirectorMobile = "";
    this.unit12DirectorFederation = "";
    this.unit12DirectorUnit = "";
    this.unit12DirectorGroup = "";
    this.unit12Email = "";
    this.unit12DOB = "";
    this.unit12Address = "";
    this.unit12InchargeOf = "";

    this.unit13DirectorPhoto = "assets/anony.png";
    this.unit13DirectorName = "";
    this.unit13DirectorMobile = "";
    this.unit13DirectorFederation = "";
    this.unit13DirectorUnit = "";
    this.unit13DirectorGroup = "";
    this.unit13Email = "";
    this.unit13DOB = "";
    this.unit13Address = "";
    this.unit13InchargeOf = "";

    this.unit14DirectorPhoto = "assets/anony.png";
    this.unit14DirectorName = "";
    this.unit14DirectorMobile = "";
    this.unit14DirectorFederation = "";
    this.unit14DirectorUnit = "";
    this.unit14DirectorGroup = "";
    this.unit14Email = "";
    this.unit14DOB = "";
    this.unit14Address = "";
    this.unit14InchargeOf = "";

    this.centralCommittee1YesNo = false;
    this.centralCommittee2YesNo = false;
    this.centralCommittee3YesNo = false;
    this.specialCommittee1YesNo = false;
    this.specialCommittee2YesNo = false;
    this.specialCommittee3YesNo = false;
    this.presidentYesNo = false;
    this.ippYesNo = false;
    this.vp1YesNo = false;
    this.vp2YesNo = false;
    this.vp3YesNo = false;
    this.secretaryYesNo = false;
    this.coSecretaryYesNo = false;
    this.treasurerYesNo = false;
    this.pro1YesNo = false;
    this.pro2YesNo = false;
    this.coOrdinatorYesNo = false;
    this.specialOfficer1YesNo = false;
    this.specialOfficer2YesNo = false;
    this.specialOfficer3YesNo = false;
    this.specialOfficer4YesNo = false;
    this.federationOfficer1YesNo = false;
    this.federationOfficer2YesNo = false;
    this.federationOfficer3YesNo = false;
    this.federationOfficer4YesNo = false;
    this.federationOfficer5YesNo = false;
    this.federationOfficer6YesNo = false;
    this.federationOfficer7YesNo = false;
    this.federationOfficer8YesNo = false;
    this.federationOfficer9YesNo = false;
    this.federationOfficer10YesNo = false;
    this.federationOfficer11YesNo = false;
    this.federationOfficer12YesNo = false;
    this.federationOfficer13YesNo = false;
    this.federationOfficer14YesNo = false;
    this.federationOfficer15YesNo = false;
    this.federationOfficer16YesNo = false;
    this.federationOfficer17YesNo = false;
    this.coOrdinator2YesNo = false;
    this.federationOfficer18YesNo = false;
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

  unitBODData = [];
  tempOpenedFederationID: number;

  getData1(dataParam: FederationMaster): void {
    this.ManageFederationMembersComponentVar.getIDs();
    this.tempOpenedFederationID = dataParam["FEDERATION_ID"];
    this.isSpinning = true;
    this.BOD = "";
    this.clearValues();

    this.BOD += dataParam.CENTRAL_COMMITTEE1 ? dataParam.CENTRAL_COMMITTEE1 + "," : "";
    this.BOD += dataParam.CENTRAL_COMMITTEE2 ? dataParam.CENTRAL_COMMITTEE2 + "," : "";
    this.BOD += dataParam.CENTRAL_COMMITTEE3 ? dataParam.CENTRAL_COMMITTEE3 + "," : "";
    this.BOD += dataParam.SPECIAL_COMMITTEE1 ? dataParam.SPECIAL_COMMITTEE1 + "," : "";
    this.BOD += dataParam.SPECIAL_COMMITTEE2 ? dataParam.SPECIAL_COMMITTEE2 + "," : "";
    this.BOD += dataParam.SPECIAL_COMMITTEE3 ? dataParam.SPECIAL_COMMITTEE3 + "," : "";
    this.BOD += dataParam.PRESIDENT ? dataParam.PRESIDENT + "," : "";
    this.BOD += dataParam.IPP ? dataParam.IPP + "," : "";
    this.BOD += dataParam.VP1 ? dataParam.VP1 + "," : "";
    this.BOD += dataParam.VP2 ? dataParam.VP2 + "," : "";
    this.BOD += dataParam.VP3 ? dataParam.VP3 + "," : "";
    this.BOD += dataParam.SECRETORY ? dataParam.SECRETORY + "," : "";
    this.BOD += dataParam.CO_SECRETORY ? dataParam.CO_SECRETORY + "," : "";
    this.BOD += dataParam.TREASURER ? dataParam.TREASURER + "," : "";
    this.BOD += dataParam.PRO1 ? dataParam.PRO1 + "," : "";
    this.BOD += dataParam.PRO2 ? dataParam.PRO2 + "," : "";
    this.BOD += dataParam.CO_ORDINATOR ? dataParam.CO_ORDINATOR + "," : "";
    this.BOD += dataParam.SPECIAL_OFFICER1 ? dataParam.SPECIAL_OFFICER1 + "," : "";
    this.BOD += dataParam.SPECIAL_OFFICER2 ? dataParam.SPECIAL_OFFICER2 + "," : "";
    this.BOD += dataParam.SPECIAL_OFFICER3 ? dataParam.SPECIAL_OFFICER3 + "," : "";
    this.BOD += dataParam.SPECIAL_OFFICER4 ? dataParam.SPECIAL_OFFICER4 + "," : "";
    this.BOD += dataParam.FEDERATION_OFFICER1 ? dataParam.FEDERATION_OFFICER1 + "," : "";
    this.BOD += dataParam.FEDERATION_OFFICER2 ? dataParam.FEDERATION_OFFICER2 + "," : "";
    this.BOD += dataParam.FEDERATION_OFFICER3 ? dataParam.FEDERATION_OFFICER3 + "," : "";
    this.BOD += dataParam.FEDERATION_OFFICER4 ? dataParam.FEDERATION_OFFICER4 + "," : "";
    this.BOD += dataParam.FEDERATION_OFFICER5 ? dataParam.FEDERATION_OFFICER5 + "," : "";
    this.BOD += dataParam.FEDERATION_OFFICER6 ? dataParam.FEDERATION_OFFICER6 + "," : "";
    this.BOD += dataParam.FEDERATION_OFFICER7 ? dataParam.FEDERATION_OFFICER7 + "," : "";
    this.BOD += dataParam.FEDERATION_OFFICER8 ? dataParam.FEDERATION_OFFICER8 + "," : "";
    this.BOD += dataParam.FEDERATION_OFFICER9 ? dataParam.FEDERATION_OFFICER9 + "," : "";
    this.BOD += dataParam.FEDERATION_OFFICER10 ? dataParam.FEDERATION_OFFICER10 + "," : "";
    this.BOD += dataParam.FEDERATION_OFFICER11 ? dataParam.FEDERATION_OFFICER11 + "," : "";
    this.BOD += dataParam.FEDERATION_OFFICER12 ? dataParam.FEDERATION_OFFICER12 + "," : "";
    this.BOD += dataParam.FEDERATION_OFFICER13 ? dataParam.FEDERATION_OFFICER13 + "," : "";
    this.BOD += dataParam.FEDERATION_OFFICER14 ? dataParam.FEDERATION_OFFICER14 + "," : "";
    this.BOD += dataParam.FEDERATION_OFFICER15 ? dataParam.FEDERATION_OFFICER15 + "," : "";
    this.BOD += dataParam.FEDERATION_OFFICER16 ? dataParam.FEDERATION_OFFICER16 + "," : "";
    this.BOD += dataParam.FEDERATION_OFFICER17 ? dataParam.FEDERATION_OFFICER17 + "," : "";
    this.BOD += dataParam.CO_ORDINATOR2 ? dataParam.CO_ORDINATOR2 + "," : "";
    this.BOD += dataParam.FEDERATION_OFFICER18 ? dataParam.FEDERATION_OFFICER18 + "," : "";

    if (this.BOD.length > 0) {
      this.BOD = this.BOD.substring(0, this.BOD.length - 1);

      this.api.getAllMembers(0, 0, "", "", " AND ID IN (" + this.BOD + ")").subscribe(data => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          this.memberList = data['data'];

          if (dataParam.CENTRAL_COMMITTEE1) {
            this.centralCommittee1YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.CENTRAL_COMMITTEE1);
            });

            this.centralCommittee1Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.centralCommittee1Photo != null) && (this.centralCommittee1Photo.trim() != ''))
              this.centralCommittee1Photo = this.api.retriveimgUrl + "profileImage/" + this.centralCommittee1Photo;

            else
              this.centralCommittee1Photo = "assets/anony.png";

            this.centralCommittee1Name = member.length > 0 ? member[0]["NAME"] : "";
            this.centralCommittee1Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.centralCommittee1Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.centralCommittee1Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.centralCommittee1Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.centralCommittee1DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.centralCommittee1Email = member.length > 0 ? member[0]["EMAIL_ID"] : "";
            this.centralCommittee1Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.centralCommittee1InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.CENTRAL_COMMITTEE2) {
            this.centralCommittee2YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.CENTRAL_COMMITTEE2);
            });

            this.centralCommittee2Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.centralCommittee2Photo != null) && (this.centralCommittee2Photo.trim() != ''))
              this.centralCommittee2Photo = this.api.retriveimgUrl + "profileImage/" + this.centralCommittee2Photo;

            else
              this.centralCommittee2Photo = "assets/anony.png";

            this.centralCommittee2Name = member.length > 0 ? member[0]["NAME"] : "";
            this.centralCommittee2Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.centralCommittee2Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.centralCommittee2Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.centralCommittee2Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.centralCommittee2DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.centralCommittee2Email = member.length > 0 ? member[0]["EMAIL_ID"] : "";
            this.centralCommittee2Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.centralCommittee2InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.CENTRAL_COMMITTEE3) {
            this.centralCommittee3YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.CENTRAL_COMMITTEE3);
            });

            this.centralCommittee3Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.centralCommittee3Photo != null) && (this.centralCommittee3Photo.trim() != ''))
              this.centralCommittee3Photo = this.api.retriveimgUrl + "profileImage/" + this.centralCommittee3Photo;

            else
              this.centralCommittee3Photo = "assets/anony.png";

            this.centralCommittee3Name = member.length > 0 ? member[0]["NAME"] : "";
            this.centralCommittee3Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.centralCommittee3Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.centralCommittee3Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.centralCommittee3Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.centralCommittee3DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.centralCommittee3Email = member.length > 0 ? member[0]["EMAIL_ID"] : "";
            this.centralCommittee3Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.centralCommittee3InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.SPECIAL_COMMITTEE1) {
            this.specialCommittee1YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.SPECIAL_COMMITTEE1);
            });

            this.specialCommittee1Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.specialCommittee1Photo != null) && (this.specialCommittee1Photo.trim() != ''))
              this.specialCommittee1Photo = this.api.retriveimgUrl + "profileImage/" + this.specialCommittee1Photo;

            else
              this.specialCommittee1Photo = "assets/anony.png";

            this.specialCommittee1Name = member.length > 0 ? member[0]["NAME"] : "";
            this.specialCommittee1Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.specialCommittee1Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.specialCommittee1Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.specialCommittee1Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.specialCommittee1DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.specialCommittee1Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.specialCommittee1Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.specialCommittee1InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.SPECIAL_COMMITTEE2) {
            this.specialCommittee2YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.SPECIAL_COMMITTEE2);
            });

            this.specialCommittee2Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.specialCommittee2Photo != null) && (this.specialCommittee2Photo.trim() != ''))
              this.specialCommittee2Photo = this.api.retriveimgUrl + "profileImage/" + this.specialCommittee2Photo;

            else
              this.specialCommittee2Photo = "assets/anony.png";

            this.specialCommittee2Name = member.length > 0 ? member[0]["NAME"] : "";
            this.specialCommittee2Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.specialCommittee2Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.specialCommittee2Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.specialCommittee2Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.specialCommittee2DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.specialCommittee2Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.specialCommittee2Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.specialCommittee2InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.SPECIAL_COMMITTEE3) {
            this.specialCommittee3YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.SPECIAL_COMMITTEE3);
            });

            this.specialCommittee3Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.specialCommittee3Photo != null) && (this.specialCommittee3Photo.trim() != ''))
              this.specialCommittee3Photo = this.api.retriveimgUrl + "profileImage/" + this.specialCommittee3Photo;

            else
              this.specialCommittee3Photo = "assets/anony.png";

            this.specialCommittee3Name = member.length > 0 ? member[0]["NAME"] : "";
            this.specialCommittee3Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.specialCommittee3Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.specialCommittee3Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.specialCommittee3Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.specialCommittee3DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.specialCommittee3Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.specialCommittee3Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.specialCommittee3InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.PRESIDENT) {
            this.presidentYesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.PRESIDENT);
            });

            this.presidentPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.presidentPhoto != null) && (this.presidentPhoto.trim() != ''))
              this.presidentPhoto = this.api.retriveimgUrl + "profileImage/" + this.presidentPhoto;

            else
              this.presidentPhoto = "assets/anony.png";

            this.presidentName = member.length > 0 ? member[0]["NAME"] : "";
            this.presidentMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.presidentFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.presidentUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.presidentGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.presidentDOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.presidentEmail = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.presidentAddress = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.presidentInchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.IPP) {
            this.ippYesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.IPP);
            });

            this.ippPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.ippPhoto != null) && (this.ippPhoto.trim() != ''))
              this.ippPhoto = this.api.retriveimgUrl + "profileImage/" + this.ippPhoto;

            else
              this.ippPhoto = "assets/anony.png";

            this.ippName = member.length > 0 ? member[0]["NAME"] : "";
            this.ippMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.ippFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.ippUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.ippGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.ippDOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.ippEmail = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.ippAddress = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.ippInchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.VP1) {
            this.vp1YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.VP1);
            });

            this.vp1Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.vp1Photo != null) && (this.vp1Photo.trim() != ''))
              this.vp1Photo = this.api.retriveimgUrl + "profileImage/" + this.vp1Photo;

            else
              this.vp1Photo = "assets/anony.png";

            this.vp1Name = member.length > 0 ? member[0]["NAME"] : "";
            this.vp1Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.vp1Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.vp1Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.vp1Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.vp1DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.vp1Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.vp1Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.vp1InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.VP2) {
            this.vp2YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.VP2);
            });

            this.vp2Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.vp2Photo != null) && (this.vp2Photo.trim() != ''))
              this.vp2Photo = this.api.retriveimgUrl + "profileImage/" + this.vp2Photo;

            else
              this.vp2Photo = "assets/anony.png";

            this.vp2Name = member.length > 0 ? member[0]["NAME"] : "";
            this.vp2Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.vp2Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.vp2Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.vp2Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.vp2DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.vp2Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.vp2Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.vp2InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.VP3) {
            this.vp3YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.VP3);
            });

            this.vp3Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.vp3Photo != null) && (this.vp3Photo.trim() != ''))
              this.vp3Photo = this.api.retriveimgUrl + "profileImage/" + this.vp3Photo;

            else
              this.vp3Photo = "assets/anony.png";

            this.vp3Name = member.length > 0 ? member[0]["NAME"] : "";
            this.vp3Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.vp3Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.vp3Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.vp3Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.vp3DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.vp3Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.vp3Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.vp3InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.SECRETORY) {
            this.secretaryYesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.SECRETORY);
            });

            this.secretaryPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.secretaryPhoto != null) && (this.secretaryPhoto.trim() != ''))
              this.secretaryPhoto = this.api.retriveimgUrl + "profileImage/" + this.secretaryPhoto;

            else
              this.secretaryPhoto = "assets/anony.png";

            this.secretaryName = member.length > 0 ? member[0]["NAME"] : "";
            this.secretaryMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.secretaryFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.secretaryUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.secretaryGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.secretaryDOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.secretaryEmail = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.secretaryAddress = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.secretaryInchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.CO_SECRETORY) {
            this.coSecretaryYesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.CO_SECRETORY);
            });

            this.coSecretaryPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.coSecretaryPhoto != null) && (this.coSecretaryPhoto.trim() != ''))
              this.coSecretaryPhoto = this.api.retriveimgUrl + "profileImage/" + this.coSecretaryPhoto;

            else
              this.coSecretaryPhoto = "assets/anony.png";

            this.coSecretaryName = member.length > 0 ? member[0]["NAME"] : "";
            this.coSecretaryMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.coSecretaryFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.coSecretaryUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.coSecretaryGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.coSecretaryDOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.coSecretaryEmail = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.coSecretaryAddress = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.coSecretaryInchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.TREASURER) {
            this.treasurerYesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.TREASURER)
            });

            this.treasurerPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.treasurerPhoto != null) && (this.treasurerPhoto.trim() != ''))
              this.treasurerPhoto = this.api.retriveimgUrl + "profileImage/" + this.treasurerPhoto;

            else
              this.treasurerPhoto = "assets/anony.png";

            this.treasurerName = member.length > 0 ? member[0]["NAME"] : "";
            this.treasurerMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.treasurerFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.treasurerUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.treasurerGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.treasurerDOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.treasurerEmail = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.treasurerAddress = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.treasurerInchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.PRO1) {
            this.pro1YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.PRO1);
            });

            this.pro1Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.pro1Photo != null) && (this.pro1Photo.trim() != ''))
              this.pro1Photo = this.api.retriveimgUrl + "profileImage/" + this.pro1Photo;

            else
              this.pro1Photo = "assets/anony.png";

            this.pro1Name = member.length > 0 ? member[0]["NAME"] : "";
            this.pro1Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.pro1Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.pro1Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.pro1Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.pro1DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.pro1Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.pro1Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.pro1InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.PRO2) {
            this.pro2YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.PRO2);
            });

            this.pro2Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.pro2Photo != null) && (this.pro2Photo.trim() != ''))
              this.pro2Photo = this.api.retriveimgUrl + "profileImage/" + this.pro2Photo;

            else
              this.pro2Photo = "assets/anony.png";

            this.pro2Name = member.length > 0 ? member[0]["NAME"] : "";
            this.pro2Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.pro2Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.pro2Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.pro2Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.pro2DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.pro2Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.pro2Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.pro2InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.CO_ORDINATOR) {
            this.coOrdinatorYesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.CO_ORDINATOR);
            });

            this.coOrdinatorPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.coOrdinatorPhoto != null) && (this.coOrdinatorPhoto.trim() != ''))
              this.coOrdinatorPhoto = this.api.retriveimgUrl + "profileImage/" + this.coOrdinatorPhoto;

            else
              this.coOrdinatorPhoto = "assets/anony.png";

            this.coOrdinatorName = member.length > 0 ? member[0]["NAME"] : "";
            this.coOrdinatorMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.coOrdinatorFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.coOrdinatorUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.coOrdinatorGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.coOrdinatorDOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.coOrdinatorEmail = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.coOrdinatorAddress = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.coOrdinatorInchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.SPECIAL_OFFICER1) {
            this.specialOfficer1YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.SPECIAL_OFFICER1);
            });

            this.specialOfficer1Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.specialOfficer1Photo != null) && (this.specialOfficer1Photo.trim() != ''))
              this.specialOfficer1Photo = this.api.retriveimgUrl + "profileImage/" + this.specialOfficer1Photo;

            else
              this.specialOfficer1Photo = "assets/anony.png";

            this.specialOfficer1Name = member.length > 0 ? member[0]["NAME"] : "";
            this.specialOfficer1Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.specialOfficer1Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.specialOfficer1Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.specialOfficer1Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.specialOfficer1DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.specialOfficer1Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.specialOfficer1Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.specialOfficer1InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.SPECIAL_OFFICER2) {
            this.specialOfficer2YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.SPECIAL_OFFICER2);
            });

            this.specialOfficer2Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.specialOfficer2Photo != null) && (this.specialOfficer2Photo.trim() != ''))
              this.specialOfficer2Photo = this.api.retriveimgUrl + "profileImage/" + this.specialOfficer2Photo;

            else
              this.specialOfficer2Photo = "assets/anony.png";

            this.specialOfficer2Name = member.length > 0 ? member[0]["NAME"] : "";
            this.specialOfficer2Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.specialOfficer2Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.specialOfficer2Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.specialOfficer2Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.specialOfficer2DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.specialOfficer2Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.specialOfficer2Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.specialOfficer2InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.SPECIAL_OFFICER3) {
            this.specialOfficer3YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.SPECIAL_OFFICER3);
            });

            this.specialOfficer3Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.specialOfficer3Photo != null) && (this.specialOfficer3Photo.trim() != ''))
              this.specialOfficer3Photo = this.api.retriveimgUrl + "profileImage/" + this.specialOfficer3Photo;

            else
              this.specialOfficer3Photo = "assets/anony.png";

            this.specialOfficer3Name = member.length > 0 ? member[0]["NAME"] : "";
            this.specialOfficer3Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.specialOfficer3Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.specialOfficer3Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.specialOfficer3Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.specialOfficer3DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.specialOfficer3Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.specialOfficer3Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.specialOfficer3InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.SPECIAL_OFFICER4) {
            this.specialOfficer4YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.SPECIAL_OFFICER4);
            });

            this.specialOfficer4Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.specialOfficer4Photo != null) && (this.specialOfficer4Photo.trim() != ''))
              this.specialOfficer4Photo = this.api.retriveimgUrl + "profileImage/" + this.specialOfficer4Photo;

            else
              this.specialOfficer4Photo = "assets/anony.png";

            this.specialOfficer4Name = member.length > 0 ? member[0]["NAME"] : "";
            this.specialOfficer4Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.specialOfficer4Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.specialOfficer4Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.specialOfficer4Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.specialOfficer4DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.specialOfficer4Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.specialOfficer4Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.specialOfficer4InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.FEDERATION_OFFICER1) {
            this.federationOfficer1YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.FEDERATION_OFFICER1);
            });

            this.federationOfficer1Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.federationOfficer1Photo != null) && (this.federationOfficer1Photo.trim() != ''))
              this.federationOfficer1Photo = this.api.retriveimgUrl + "profileImage/" + this.federationOfficer1Photo;

            else
              this.federationOfficer1Photo = "assets/anony.png";

            this.federationOfficer1Name = member.length > 0 ? member[0]["NAME"] : "";
            this.federationOfficer1Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.federationOfficer1Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.federationOfficer1Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.federationOfficer1Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.federationOfficer1DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.federationOfficer1Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.federationOfficer1Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.federationOfficer1InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.FEDERATION_OFFICER2) {
            this.federationOfficer2YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.FEDERATION_OFFICER2);
            });

            this.federationOfficer2Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.federationOfficer2Photo != null) && (this.federationOfficer2Photo.trim() != ''))
              this.federationOfficer2Photo = this.api.retriveimgUrl + "profileImage/" + this.federationOfficer2Photo;

            else
              this.federationOfficer2Photo = "assets/anony.png";

            this.federationOfficer2Name = member.length > 0 ? member[0]["NAME"] : "";
            this.federationOfficer2Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.federationOfficer2Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.federationOfficer2Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.federationOfficer2Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.federationOfficer2DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.federationOfficer2Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.federationOfficer2Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.federationOfficer2InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.FEDERATION_OFFICER3) {
            this.federationOfficer3YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.FEDERATION_OFFICER3);
            });

            this.federationOfficer3Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.federationOfficer3Photo != null) && (this.federationOfficer3Photo.trim() != ''))
              this.federationOfficer3Photo = this.api.retriveimgUrl + "profileImage/" + this.federationOfficer3Photo;

            else
              this.federationOfficer3Photo = "assets/anony.png";

            this.federationOfficer3Name = member.length > 0 ? member[0]["NAME"] : "";
            this.federationOfficer3Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.federationOfficer3Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.federationOfficer3Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.federationOfficer3Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.federationOfficer3DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.federationOfficer3Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.federationOfficer3Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.federationOfficer3InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.FEDERATION_OFFICER4) {
            this.federationOfficer4YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.FEDERATION_OFFICER4);
            });

            this.federationOfficer4Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.federationOfficer4Photo != null) && (this.federationOfficer4Photo.trim() != ''))
              this.federationOfficer4Photo = this.api.retriveimgUrl + "profileImage/" + this.federationOfficer4Photo;

            else
              this.federationOfficer4Photo = "assets/anony.png";

            this.federationOfficer4Name = member.length > 0 ? member[0]["NAME"] : "";
            this.federationOfficer4Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.federationOfficer4Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.federationOfficer4Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.federationOfficer4Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.federationOfficer4DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.federationOfficer4Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.federationOfficer4Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.federationOfficer4InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.FEDERATION_OFFICER5) {
            this.federationOfficer5YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.FEDERATION_OFFICER5);
            });

            this.federationOfficer5Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.federationOfficer5Photo != null) && (this.federationOfficer5Photo.trim() != ''))
              this.federationOfficer5Photo = this.api.retriveimgUrl + "profileImage/" + this.federationOfficer5Photo;

            else
              this.federationOfficer5Photo = "assets/anony.png";

            this.federationOfficer5Name = member.length > 0 ? member[0]["NAME"] : "";
            this.federationOfficer5Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.federationOfficer5Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.federationOfficer5Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.federationOfficer5Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.federationOfficer5DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.federationOfficer5Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.federationOfficer5Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.federationOfficer5InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.FEDERATION_OFFICER6) {
            this.federationOfficer6YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.FEDERATION_OFFICER6);
            });

            this.federationOfficer6Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.federationOfficer6Photo != null) && (this.federationOfficer6Photo.trim() != ''))
              this.federationOfficer6Photo = this.api.retriveimgUrl + "profileImage/" + this.federationOfficer6Photo;

            else
              this.federationOfficer6Photo = "assets/anony.png";

            this.federationOfficer6Name = member.length > 0 ? member[0]["NAME"] : "";
            this.federationOfficer6Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.federationOfficer6Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.federationOfficer6Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.federationOfficer6Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.federationOfficer6DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.federationOfficer6Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.federationOfficer6Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.federationOfficer6InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.FEDERATION_OFFICER7) {
            this.federationOfficer7YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.FEDERATION_OFFICER7);
            });

            this.federationOfficer7Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.federationOfficer7Photo != null) && (this.federationOfficer7Photo.trim() != ''))
              this.federationOfficer7Photo = this.api.retriveimgUrl + "profileImage/" + this.federationOfficer7Photo;

            else
              this.federationOfficer7Photo = "assets/anony.png";

            this.federationOfficer7Name = member.length > 0 ? member[0]["NAME"] : "";
            this.federationOfficer7Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.federationOfficer7Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.federationOfficer7Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.federationOfficer7Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.federationOfficer7DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.federationOfficer7Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.federationOfficer7Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.federationOfficer7InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.FEDERATION_OFFICER8) {
            this.federationOfficer8YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.FEDERATION_OFFICER8);
            });

            this.federationOfficer8Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.federationOfficer8Photo != null) && (this.federationOfficer8Photo.trim() != ''))
              this.federationOfficer8Photo = this.api.retriveimgUrl + "profileImage/" + this.federationOfficer8Photo;

            else
              this.federationOfficer8Photo = "assets/anony.png";

            this.federationOfficer8Name = member.length > 0 ? member[0]["NAME"] : "";
            this.federationOfficer8Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.federationOfficer8Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.federationOfficer8Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.federationOfficer8Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.federationOfficer8DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.federationOfficer8Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.federationOfficer8Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.federationOfficer8InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.FEDERATION_OFFICER9) {
            this.federationOfficer9YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.FEDERATION_OFFICER9);
            });

            this.federationOfficer9Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.federationOfficer9Photo != null) && (this.federationOfficer9Photo.trim() != ''))
              this.federationOfficer9Photo = this.api.retriveimgUrl + "profileImage/" + this.federationOfficer9Photo;

            else
              this.federationOfficer9Photo = "assets/anony.png";

            this.federationOfficer9Name = member.length > 0 ? member[0]["NAME"] : "";
            this.federationOfficer9Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.federationOfficer9Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.federationOfficer9Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.federationOfficer9Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.federationOfficer9DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.federationOfficer9Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.federationOfficer9Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.federationOfficer9InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.FEDERATION_OFFICER10) {
            this.federationOfficer10YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.FEDERATION_OFFICER10);
            });

            this.federationOfficer10Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.federationOfficer10Photo != null) && (this.federationOfficer10Photo.trim() != ''))
              this.federationOfficer10Photo = this.api.retriveimgUrl + "profileImage/" + this.federationOfficer10Photo;

            else
              this.federationOfficer10Photo = "assets/anony.png";

            this.federationOfficer10Name = member.length > 0 ? member[0]["NAME"] : "";
            this.federationOfficer10Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.federationOfficer10Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.federationOfficer10Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.federationOfficer10Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.federationOfficer10DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.federationOfficer10Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.federationOfficer10Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.federationOfficer10InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.FEDERATION_OFFICER11) {
            this.federationOfficer11YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.FEDERATION_OFFICER11);
            });

            this.federationOfficer11Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.federationOfficer11Photo != null) && (this.federationOfficer11Photo.trim() != ''))
              this.federationOfficer11Photo = this.api.retriveimgUrl + "profileImage/" + this.federationOfficer11Photo;

            else
              this.federationOfficer11Photo = "assets/anony.png";

            this.federationOfficer11Name = member.length > 0 ? member[0]["NAME"] : "";
            this.federationOfficer11Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.federationOfficer11Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.federationOfficer11Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.federationOfficer11Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.federationOfficer11DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.federationOfficer11Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.federationOfficer11Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.federationOfficer11InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.FEDERATION_OFFICER12) {
            this.federationOfficer12YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.FEDERATION_OFFICER12);
            });

            this.federationOfficer12Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.federationOfficer12Photo != null) && (this.federationOfficer12Photo.trim() != ''))
              this.federationOfficer12Photo = this.api.retriveimgUrl + "profileImage/" + this.federationOfficer12Photo;

            else
              this.federationOfficer12Photo = "assets/anony.png";

            this.federationOfficer12Name = member.length > 0 ? member[0]["NAME"] : "";
            this.federationOfficer12Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.federationOfficer12Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.federationOfficer12Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.federationOfficer12Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.federationOfficer12DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.federationOfficer12Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.federationOfficer12Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.federationOfficer12InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.FEDERATION_OFFICER13) {
            this.federationOfficer13YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.FEDERATION_OFFICER13);
            });

            this.federationOfficer13Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.federationOfficer13Photo != null) && (this.federationOfficer13Photo.trim() != ''))
              this.federationOfficer13Photo = this.api.retriveimgUrl + "profileImage/" + this.federationOfficer13Photo;

            else
              this.federationOfficer13Photo = "assets/anony.png";

            this.federationOfficer13Name = member.length > 0 ? member[0]["NAME"] : "";
            this.federationOfficer13Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.federationOfficer13Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.federationOfficer13Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.federationOfficer13Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.federationOfficer13DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.federationOfficer13Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.federationOfficer13Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.federationOfficer13InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.FEDERATION_OFFICER14) {
            this.federationOfficer14YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.FEDERATION_OFFICER14);
            });

            this.federationOfficer14Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.federationOfficer14Photo != null) && (this.federationOfficer14Photo.trim() != ''))
              this.federationOfficer14Photo = this.api.retriveimgUrl + "profileImage/" + this.federationOfficer14Photo;

            else
              this.federationOfficer14Photo = "assets/anony.png";

            this.federationOfficer14Name = member.length > 0 ? member[0]["NAME"] : "";
            this.federationOfficer14Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.federationOfficer14Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.federationOfficer14Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.federationOfficer14Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.federationOfficer14DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.federationOfficer14Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.federationOfficer14Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.federationOfficer14InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.FEDERATION_OFFICER15) {
            this.federationOfficer15YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.FEDERATION_OFFICER15);
            });

            this.federationOfficer15Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.federationOfficer15Photo != null) && (this.federationOfficer15Photo.trim() != ''))
              this.federationOfficer15Photo = this.api.retriveimgUrl + "profileImage/" + this.federationOfficer15Photo;

            else
              this.federationOfficer15Photo = "assets/anony.png";

            this.federationOfficer15Name = member.length > 0 ? member[0]["NAME"] : "";
            this.federationOfficer15Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.federationOfficer15Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.federationOfficer15Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.federationOfficer15Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.federationOfficer15DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.federationOfficer15Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.federationOfficer15Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.federationOfficer15InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.FEDERATION_OFFICER16) {
            this.federationOfficer16YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.FEDERATION_OFFICER16);
            });

            this.federationOfficer16Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.federationOfficer16Photo != null) && (this.federationOfficer16Photo.trim() != ''))
              this.federationOfficer16Photo = this.api.retriveimgUrl + "profileImage/" + this.federationOfficer16Photo;

            else
              this.federationOfficer16Photo = "assets/anony.png";

            this.federationOfficer16Name = member.length > 0 ? member[0]["NAME"] : "";
            this.federationOfficer16Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.federationOfficer16Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.federationOfficer16Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.federationOfficer16Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.federationOfficer16DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.federationOfficer16Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.federationOfficer16Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.federationOfficer16InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.FEDERATION_OFFICER17) {
            this.federationOfficer17YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.FEDERATION_OFFICER17);
            });

            this.federationOfficer17Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.federationOfficer17Photo != null) && (this.federationOfficer17Photo.trim() != ''))
              this.federationOfficer17Photo = this.api.retriveimgUrl + "profileImage/" + this.federationOfficer17Photo;

            else
              this.federationOfficer17Photo = "assets/anony.png";

            this.federationOfficer17Name = member.length > 0 ? member[0]["NAME"] : "";
            this.federationOfficer17Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.federationOfficer17Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.federationOfficer17Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.federationOfficer17Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.federationOfficer17DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.federationOfficer17Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.federationOfficer17Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.federationOfficer17InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.CO_ORDINATOR2) {
            this.coOrdinator2YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.CO_ORDINATOR2);
            });

            this.coOrdinator2Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.coOrdinator2Photo != null) && (this.coOrdinator2Photo.trim() != ''))
              this.coOrdinator2Photo = this.api.retriveimgUrl + "profileImage/" + this.coOrdinator2Photo;

            else
              this.coOrdinator2Photo = "assets/anony.png";

            this.coOrdinator2Name = member.length > 0 ? member[0]["NAME"] : "";
            this.coOrdinator2Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.federationOfficer17Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.coOrdinator2Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.coOrdinator2Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.coOrdinator2DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.coOrdinator2Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.coOrdinator2Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.coOrdinator2InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.FEDERATION_OFFICER18) {
            this.federationOfficer18YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.FEDERATION_OFFICER18);
            });

            this.federationOfficer18Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.federationOfficer18Photo != null) && (this.federationOfficer18Photo.trim() != ''))
              this.federationOfficer18Photo = this.api.retriveimgUrl + "profileImage/" + this.federationOfficer18Photo;

            else
              this.federationOfficer18Photo = "assets/anony.png";

            this.federationOfficer18Name = member.length > 0 ? member[0]["NAME"] : "";
            this.federationOfficer18Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.federationOfficer18Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.federationOfficer18Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.federationOfficer18Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.federationOfficer18DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.federationOfficer18Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.federationOfficer18Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.federationOfficer18InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });

    } else {
      this.isSpinning = false;
    }

    // Unit Directors
    this.isUnitSpinning = true;
    this.unitBOD = "";
    this.unitBODData = [];

    this.api.getAllUnitsTilesDetails(0, 0, "UNIT_ID", "asc", " AND FEDERATION_ID=" + dataParam["FEDERATION_ID"]).subscribe(data => {
      if (data["code"] == 200) {
        this.unitBODData = data["data"];

        for (var i = 0; i < this.unitBODData.length; i++) {
          this.unitBOD += this.unitBODData[i]["DIRECTOR"] ? this.unitBODData[i]["DIRECTOR"] + "," : "";
        }

        if (this.unitBOD.length > 0) {
          this.unitBOD = this.unitBOD.substring(0, this.unitBOD.length - 1);

          this.api.getAllMembers(0, 0, "", "", " AND ID IN (" + this.unitBOD + ")").subscribe(data => {
            if (data['code'] == 200) {
              this.isUnitSpinning = false;
              let unitMemberList = data['data'];

              if (this.unitBODData[0]["DIRECTOR"]) {
                var member = unitMemberList.filter(obj => {
                  return (obj.ID == this.unitBODData[0]["DIRECTOR"]);
                });

                this.unit1DirectorPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
                if ((this.unit1DirectorPhoto != null) && (this.unit1DirectorPhoto.trim() != ''))
                  this.unit1DirectorPhoto = this.api.retriveimgUrl + "profileImage/" + this.unit1DirectorPhoto;

                else
                  this.unit1DirectorPhoto = "assets/anony.png";

                this.unit1DirectorName = member.length > 0 ? member[0]["NAME"] : "";
                this.unit1DirectorMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
                this.unit1DirectorFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
                this.unit1DirectorUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
                this.unit1DirectorGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
                this.unit1DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
                this.unit1Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
                this.unit1Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
              }

              if (this.unitBODData[1]["DIRECTOR"]) {
                var member = unitMemberList.filter(obj => {
                  return (obj.ID == this.unitBODData[1]["DIRECTOR"]);
                });

                this.unit2DirectorPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
                if ((this.unit2DirectorPhoto != null) && (this.unit2DirectorPhoto.trim() != ''))
                  this.unit2DirectorPhoto = this.api.retriveimgUrl + "profileImage/" + this.unit2DirectorPhoto;

                else
                  this.unit2DirectorPhoto = "assets/anony.png";

                this.unit2DirectorName = member.length > 0 ? member[0]["NAME"] : "";
                this.unit2DirectorMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
                this.unit2DirectorFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
                this.unit2DirectorUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
                this.unit2DirectorGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
                this.unit2DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
                this.unit2Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
                this.unit2Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
              }

              if (this.unitBODData[2]["DIRECTOR"]) {
                var member = unitMemberList.filter(obj => {
                  return (obj.ID == this.unitBODData[2]["DIRECTOR"]);
                });

                this.unit3DirectorPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
                if ((this.unit3DirectorPhoto != null) && (this.unit3DirectorPhoto.trim() != ''))
                  this.unit3DirectorPhoto = this.api.retriveimgUrl + "profileImage/" + this.unit3DirectorPhoto;

                else
                  this.unit3DirectorPhoto = "assets/anony.png";

                this.unit3DirectorName = member.length > 0 ? member[0]["NAME"] : "";
                this.unit3DirectorMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
                this.unit3DirectorFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
                this.unit3DirectorUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
                this.unit3DirectorGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
                this.unit3DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
                this.unit3Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
                this.unit3Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
              }

              if (this.unitBODData[3]["DIRECTOR"]) {
                var member = unitMemberList.filter(obj => {
                  return (obj.ID == this.unitBODData[3]["DIRECTOR"]);
                });

                this.unit4DirectorPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
                if ((this.unit4DirectorPhoto != null) && (this.unit4DirectorPhoto.trim() != ''))
                  this.unit4DirectorPhoto = this.api.retriveimgUrl + "profileImage/" + this.unit4DirectorPhoto;

                else
                  this.unit4DirectorPhoto = "assets/anony.png";

                this.unit4DirectorName = member.length > 0 ? member[0]["NAME"] : "";
                this.unit4DirectorMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
                this.unit4DirectorFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
                this.unit4DirectorUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
                this.unit4DirectorGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
                this.unit4DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
                this.unit4Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
                this.unit4Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
              }

              if (this.unitBODData[4]["DIRECTOR"]) {
                var member = unitMemberList.filter(obj => {
                  return (obj.ID == this.unitBODData[4]["DIRECTOR"]);
                });

                this.unit5DirectorPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
                if ((this.unit5DirectorPhoto != null) && (this.unit5DirectorPhoto.trim() != ''))
                  this.unit5DirectorPhoto = this.api.retriveimgUrl + "profileImage/" + this.unit5DirectorPhoto;

                else
                  this.unit5DirectorPhoto = "assets/anony.png";

                this.unit5DirectorName = member.length > 0 ? member[0]["NAME"] : "";
                this.unit5DirectorMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
                this.unit5DirectorFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
                this.unit5DirectorUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
                this.unit5DirectorGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
                this.unit5DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
                this.unit5Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
                this.unit5Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
              }

              if (this.unitBODData[5]["DIRECTOR"]) {
                var member = unitMemberList.filter(obj => {
                  return (obj.ID == this.unitBODData[5]["DIRECTOR"]);
                });

                this.unit6DirectorPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
                if ((this.unit6DirectorPhoto != null) && (this.unit6DirectorPhoto.trim() != ''))
                  this.unit6DirectorPhoto = this.api.retriveimgUrl + "profileImage/" + this.unit6DirectorPhoto;

                else
                  this.unit6DirectorPhoto = "assets/anony.png";

                this.unit6DirectorName = member.length > 0 ? member[0]["NAME"] : "";
                this.unit6DirectorMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
                this.unit6DirectorFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
                this.unit6DirectorUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
                this.unit6DirectorGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
                this.unit6DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
                this.unit6Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
                this.unit6Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
              }

              if (this.unitBODData[6]["DIRECTOR"]) {
                var member = unitMemberList.filter(obj => {
                  return (obj.ID == this.unitBODData[6]["DIRECTOR"]);
                });

                this.unit7DirectorPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
                if ((this.unit7DirectorPhoto != null) && (this.unit7DirectorPhoto.trim() != ''))
                  this.unit7DirectorPhoto = this.api.retriveimgUrl + "profileImage/" + this.unit7DirectorPhoto;

                else
                  this.unit7DirectorPhoto = "assets/anony.png";

                this.unit7DirectorName = member.length > 0 ? member[0]["NAME"] : "";
                this.unit7DirectorMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
                this.unit7DirectorFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
                this.unit7DirectorUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
                this.unit7DirectorGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
                this.unit7DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
                this.unit7Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
                this.unit7Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
              }

              if (this.unitBODData[7]["DIRECTOR"]) {
                var member = unitMemberList.filter(obj => {
                  return (obj.ID == this.unitBODData[7]["DIRECTOR"]);
                });

                this.unit8DirectorPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
                if ((this.unit8DirectorPhoto != null) && (this.unit8DirectorPhoto.trim() != ''))
                  this.unit8DirectorPhoto = this.api.retriveimgUrl + "profileImage/" + this.unit8DirectorPhoto;

                else
                  this.unit8DirectorPhoto = "assets/anony.png";

                this.unit8DirectorName = member.length > 0 ? member[0]["NAME"] : "";
                this.unit8DirectorMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
                this.unit8DirectorFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
                this.unit8DirectorUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
                this.unit8DirectorGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
                this.unit8DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
                this.unit8Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
                this.unit8Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
              }

              if (this.unitBODData[8]["DIRECTOR"]) {
                var member = unitMemberList.filter(obj => {
                  return (obj.ID == this.unitBODData[8]["DIRECTOR"]);
                });

                this.unit9DirectorPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
                if ((this.unit9DirectorPhoto != null) && (this.unit9DirectorPhoto.trim() != ''))
                  this.unit9DirectorPhoto = this.api.retriveimgUrl + "profileImage/" + this.unit9DirectorPhoto;

                else
                  this.unit9DirectorPhoto = "assets/anony.png";

                this.unit9DirectorName = member.length > 0 ? member[0]["NAME"] : "";
                this.unit9DirectorMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
                this.unit9DirectorFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
                this.unit9DirectorUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
                this.unit9DirectorGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
                this.unit9DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
                this.unit9Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
                this.unit9Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
              }

              if (this.unitBODData[9]["DIRECTOR"]) {
                var member = unitMemberList.filter(obj => {
                  return (obj.ID == this.unitBODData[9]["DIRECTOR"]);
                });

                this.unit10DirectorPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
                if ((this.unit10DirectorPhoto != null) && (this.unit10DirectorPhoto.trim() != ''))
                  this.unit10DirectorPhoto = this.api.retriveimgUrl + "profileImage/" + this.unit10DirectorPhoto;

                else
                  this.unit10DirectorPhoto = "assets/anony.png";

                this.unit10DirectorName = member.length > 0 ? member[0]["NAME"] : "";
                this.unit10DirectorMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
                this.unit10DirectorFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
                this.unit10DirectorUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
                this.unit10DirectorGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
                this.unit10DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
                this.unit10Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
                this.unit10Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
              }

              if (this.unitBODData[10]["DIRECTOR"]) {
                var member = unitMemberList.filter(obj => {
                  return (obj.ID == this.unitBODData[10]["DIRECTOR"]);
                });

                this.unit11DirectorPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
                if ((this.unit11DirectorPhoto != null) && (this.unit11DirectorPhoto.trim() != ''))
                  this.unit11DirectorPhoto = this.api.retriveimgUrl + "profileImage/" + this.unit11DirectorPhoto;

                else
                  this.unit11DirectorPhoto = "assets/anony.png";

                this.unit11DirectorName = member.length > 0 ? member[0]["NAME"] : "";
                this.unit11DirectorMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
                this.unit11DirectorFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
                this.unit11DirectorUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
                this.unit11DirectorGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
                this.unit11DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
                this.unit11Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
                this.unit11Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
              }

              if (this.unitBODData[11]["DIRECTOR"]) {
                var member = unitMemberList.filter(obj => {
                  return (obj.ID == this.unitBODData[11]["DIRECTOR"]);
                });

                this.unit12DirectorPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
                if ((this.unit12DirectorPhoto != null) && (this.unit12DirectorPhoto.trim() != ''))
                  this.unit12DirectorPhoto = this.api.retriveimgUrl + "profileImage/" + this.unit12DirectorPhoto;

                else
                  this.unit12DirectorPhoto = "assets/anony.png";

                this.unit12DirectorName = member.length > 0 ? member[0]["NAME"] : "";
                this.unit12DirectorMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
                this.unit12DirectorFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
                this.unit12DirectorUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
                this.unit12DirectorGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
                this.unit12DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
                this.unit12Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
                this.unit12Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
              }

              if (this.unitBODData[12]["DIRECTOR"]) {
                var member = unitMemberList.filter(obj => {
                  return (obj.ID == this.unitBODData[12]["DIRECTOR"]);
                });

                this.unit13DirectorPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
                if ((this.unit13DirectorPhoto != null) && (this.unit13DirectorPhoto.trim() != ''))
                  this.unit13DirectorPhoto = this.api.retriveimgUrl + "profileImage/" + this.unit13DirectorPhoto;

                else
                  this.unit13DirectorPhoto = "assets/anony.png";

                this.unit13DirectorName = member.length > 0 ? member[0]["NAME"] : "";
                this.unit13DirectorMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
                this.unit13DirectorFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
                this.unit13DirectorUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
                this.unit13DirectorGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
                this.unit13DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
                this.unit13Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
                this.unit13Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
              }

              if (this.unitBODData[13]["DIRECTOR"]) {
                var member = unitMemberList.filter(obj => {
                  return (obj.ID == this.unitBODData[13]["DIRECTOR"]);
                });

                this.unit14DirectorPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
                if ((this.unit14DirectorPhoto != null) && (this.unit14DirectorPhoto.trim() != ''))
                  this.unit14DirectorPhoto = this.api.retriveimgUrl + "profileImage/" + this.unit14DirectorPhoto;

                else
                  this.unit14DirectorPhoto = "assets/anony.png";

                this.unit14DirectorName = member.length > 0 ? member[0]["NAME"] : "";
                this.unit14DirectorMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
                this.unit14DirectorFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
                this.unit14DirectorUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
                this.unit14DirectorGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
                this.unit14DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
                this.unit14Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
                this.unit14Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
              }
            }

          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });

        } else {
          this.isUnitSpinning = false;
        }
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  NEW_MEMBER_ID: number;

  handleOk(data: FederationMaster): void {
    this.isConfirmLoading = true;

    this.api.assignFederation(this.roleID, data, this.NEW_MEMBER_ID).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Updated Successfully", "");
        this.isConfirmLoading = false;
        this.isVisible = false;

        if (this.roleID == 1)
          data.PRESIDENT = this.NEW_MEMBER_ID;

        else if (this.roleID == 2)
          data.IPP = this.NEW_MEMBER_ID;

        else if (this.roleID == 3)
          data.VP1 = this.NEW_MEMBER_ID;

        else if (this.roleID == 4)
          data.VP2 = this.NEW_MEMBER_ID;

        else if (this.roleID == 5)
          data.VP3 = this.NEW_MEMBER_ID;

        else if (this.roleID == 6)
          data.SECRETORY = this.NEW_MEMBER_ID;

        else if (this.roleID == 7)
          data.CO_SECRETORY = this.NEW_MEMBER_ID;

        else if (this.roleID == 8)
          data.TREASURER = this.NEW_MEMBER_ID;

        else if (this.roleID == 9)
          data.PRO1 = this.NEW_MEMBER_ID;

        else if (this.roleID == 10)
          data.PRO2 = this.NEW_MEMBER_ID;

        else if (this.roleID == 11)
          data.CO_ORDINATOR = this.NEW_MEMBER_ID;

        else if (this.roleID == 12)
          data.SPECIAL_OFFICER1 = this.NEW_MEMBER_ID;

        else if (this.roleID == 13)
          data.SPECIAL_OFFICER2 = this.NEW_MEMBER_ID;

        else if (this.roleID == 14)
          data.SPECIAL_OFFICER3 = this.NEW_MEMBER_ID;

        else if (this.roleID == 15)
          data.SPECIAL_OFFICER4 = this.NEW_MEMBER_ID;

        this.getData1(data);
        this.NEW_MEMBER_ID = undefined;

      } else
        this.message.error("Failed to Update", "");
    });
  }

  memberDrawerTitle: string;
  memberDrawerRoleName: string;
  memberDrawerData: any;
  memberDrawerVisible: boolean = false;
  BOD_Position: number;
  @ViewChild(ManageFederationMembersComponent, { static: false }) ManageFederationMembersComponentVar: ManageFederationMembersComponent;

  addMembers(BODPosition: any): void {
    this.ManageFederationMembersComponentVar.onComponentInitialized();
    this.BOD_Position = BODPosition;
    let role = "";

    if (this.BOD_Position == 1)
      role = "President";

    else if (this.BOD_Position == 2)
      role = "IPP";

    else if (this.BOD_Position == 3)
      role = "Vice Precident 1";

    else if (this.BOD_Position == 4)
      role = "Vice Precident 2";

    else if (this.BOD_Position == 5)
      role = "Vice Precident 3";

    else if (this.BOD_Position == 6)
      role = "Secretary";

    else if (this.BOD_Position == 7)
      role = "Co Secretary";

    else if (this.BOD_Position == 8)
      role = "Treasurer";

    else if (this.BOD_Position == 9)
      role = "PRO 1";

    else if (this.BOD_Position == 10)
      role = "PRO 2";

    else if (this.BOD_Position == 11)
      role = "Co Ordinator 1";

    else if (this.BOD_Position == 12)
      role = "Special Officer 1";

    else if (this.BOD_Position == 13)
      role = "Special Officer 2";

    else if (this.BOD_Position == 14)
      role = "Special Officer 3";

    else if (this.BOD_Position == 15)
      role = "Special Officer 4";

    else if (this.BOD_Position == 16)
      role = "Federation Officer 1";

    else if (this.BOD_Position == 17)
      role = "Federation Officer 2";

    else if (this.BOD_Position == 18)
      role = "Federation Officer 3";

    else if (this.BOD_Position == 19)
      role = "Federation Officer 4";

    else if (this.BOD_Position == 20)
      role = "Federation Officer 5";

    else if (this.BOD_Position == 21)
      role = "Federation Officer 6";

    else if (this.BOD_Position == 22)
      role = "Federation Officer 7";

    else if (this.BOD_Position == 23)
      role = "Federation Officer 8";

    else if (this.BOD_Position == 24)
      role = "Federation Officer 9";

    else if (this.BOD_Position == 25)
      role = "Federation Officer 10";

    else if (this.BOD_Position == 26)
      role = "Federation Officer 11";

    else if (this.BOD_Position == 27)
      role = "Federation Officer 12";

    else if (this.BOD_Position == 28)
      role = "Federation Officer 13";

    else if (this.BOD_Position == 29)
      role = "Federation Officer 14";

    else if (this.BOD_Position == 30)
      role = "Federation Officer 15";

    else if (this.BOD_Position == 31)
      role = "Central Committee 1";

    else if (this.BOD_Position == 32)
      role = "Central Committee 2";

    else if (this.BOD_Position == 33)
      role = "Central Committee 3";

    else if (this.BOD_Position == 34)
      role = "Special Committee 1";

    else if (this.BOD_Position == 35)
      role = "Special Committee 2";

    else if (this.BOD_Position == 36)
      role = "Special Committee 3";

    else if (this.BOD_Position == 37)
      role = "Federation Officer 16";

    else if (this.BOD_Position == 38)
      role = "Federation Officer 17";

    else if (this.BOD_Position == 39)
      role = "Co Ordinator 2";

    else if (this.BOD_Position == 40)
      role = "Federation Officer 18";

    this.memberDrawerTitle = "aaa " + "Add Member for " + role;
    this.memberDrawerVisible = true;
    this.memberDrawerRoleName = role;
    this.ManageFederationMembersComponentVar.sortKey = "id";
    this.ManageFederationMembersComponentVar.sortValue = "desc";
    this.ManageFederationMembersComponentVar.search(true, BODPosition, this.data["FEDERATION_ID"]);
    // this.ManageFederationMembersComponentVar.getMembers(this.data["FEDERATION_ID"]);
  }

  memberDrawerClose(): void {
    this.memberDrawerVisible = false;
    this.unitMemberDrawerVisible = false;

    this.api.getFederationsTilesDetails(0, 0, "", "", " AND FEDERATION_ID=" + this.data["FEDERATION_ID"]).subscribe(data => {
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

  unitMemberDrawerTitle: string;
  unitMemberDrawerData: any;
  unitMemberDrawerVisible: boolean = false;
  unitBOD_Position: number;
  unitBODDataToInput: any;
  @ViewChild(ManageUnitMembersComponent, { static: false }) ManageUnitMembersComponentVar: ManageUnitMembersComponent;

  addUnit1Members(unitBOD_Position: any): void {
    this.unitBOD_Position = unitBOD_Position;
    this.unitBODDataToInput = this.unitBODData[0];

    let role = "";
    if (this.unitBOD_Position == 1)
      role = "Director";

    this.unitMemberDrawerTitle = "Add Member for Unit 1 " + role;
    this.unitMemberDrawerVisible = true;
    this.memberDrawerRoleName = "Unit 1 " + role;
    this.ManageUnitMembersComponentVar.sortKey = "id";
    this.ManageUnitMembersComponentVar.sortValue = "desc";
    this.ManageUnitMembersComponentVar.search(true, unitBOD_Position, this.unitBODData[0]["UNIT_ID"]);
    // this.ManageUnitMembersComponentVar.getMembers(this.unitBODData[0]["ID"]);
  }

  addUnit2Members(unitBOD_Position: any): void {
    this.unitBOD_Position = unitBOD_Position;
    this.unitBODDataToInput = this.unitBODData[1];

    let role = "";
    if (this.unitBOD_Position == 1)
      role = "Director";

    this.unitMemberDrawerTitle = "Add Member for Unit 2 " + role;
    this.unitMemberDrawerVisible = true;
    this.memberDrawerRoleName = "Unit 2 " + role;
    this.ManageUnitMembersComponentVar.sortKey = "id";
    this.ManageUnitMembersComponentVar.sortValue = "desc";
    this.ManageUnitMembersComponentVar.search(true, unitBOD_Position, this.unitBODData[1]["UNIT_ID"]);
    // this.ManageUnitMembersComponentVar.getMembers(this.unitBODData[1]["ID"]);
  }

  addUnit3Members(unitBOD_Position: any): void {
    this.unitBOD_Position = unitBOD_Position;
    this.unitBODDataToInput = this.unitBODData[2];

    let role = "";
    if (this.unitBOD_Position == 1)
      role = "Director";

    this.unitMemberDrawerTitle = "Add Member for Unit 3 " + role;
    this.unitMemberDrawerVisible = true;
    this.memberDrawerRoleName = "Unit 3 " + role;
    this.ManageUnitMembersComponentVar.sortKey = "id";
    this.ManageUnitMembersComponentVar.sortValue = "desc";
    this.ManageUnitMembersComponentVar.search(true, unitBOD_Position, this.unitBODData[2]["UNIT_ID"]);
    // this.ManageUnitMembersComponentVar.getMembers(this.unitBODData[2]["ID"]);
  }

  addUnit4Members(unitBOD_Position: any): void {
    this.unitBOD_Position = unitBOD_Position;
    this.unitBODDataToInput = this.unitBODData[3];

    let role = "";
    if (this.unitBOD_Position == 1)
      role = "Director";

    this.unitMemberDrawerTitle = "Add Member for Unit 4 " + role;
    this.unitMemberDrawerVisible = true;
    this.memberDrawerRoleName = "Unit 4 " + role;
    this.ManageUnitMembersComponentVar.sortKey = "id";
    this.ManageUnitMembersComponentVar.sortValue = "desc";
    this.ManageUnitMembersComponentVar.search(true, unitBOD_Position, this.unitBODData[3]["UNIT_ID"]);
    // this.ManageUnitMembersComponentVar.getMembers(this.unitBODData[3]["ID"]);
  }

  addUnit5Members(unitBOD_Position: any): void {
    this.unitBOD_Position = unitBOD_Position;
    this.unitBODDataToInput = this.unitBODData[4];

    let role = "";
    if (this.unitBOD_Position == 1)
      role = "Director";

    this.unitMemberDrawerTitle = "Add Member for Unit 5 " + role;
    this.unitMemberDrawerVisible = true;
    this.memberDrawerRoleName = "Unit 5 " + role;
    this.ManageUnitMembersComponentVar.sortKey = "id";
    this.ManageUnitMembersComponentVar.sortValue = "desc";
    this.ManageUnitMembersComponentVar.search(true, unitBOD_Position, this.unitBODData[4]["UNIT_ID"]);
    // this.ManageUnitMembersComponentVar.getMembers(this.unitBODData[4]["ID"]);
  }

  addUnit6Members(unitBOD_Position: any): void {
    this.unitBOD_Position = unitBOD_Position;
    this.unitBODDataToInput = this.unitBODData[5];

    let role = "";
    if (this.unitBOD_Position == 1)
      role = "Director";

    this.unitMemberDrawerTitle = "Add Member for Unit 6 " + role;
    this.unitMemberDrawerVisible = true;
    this.memberDrawerRoleName = "Unit 6 " + role;
    this.ManageUnitMembersComponentVar.sortKey = "id";
    this.ManageUnitMembersComponentVar.sortValue = "desc";
    this.ManageUnitMembersComponentVar.search(true, unitBOD_Position, this.unitBODData[5]["UNIT_ID"]);
    // this.ManageUnitMembersComponentVar.getMembers(this.unitBODData[5]["ID"]);
  }

  addUnit7Members(unitBOD_Position: any): void {
    this.unitBOD_Position = unitBOD_Position;
    this.unitBODDataToInput = this.unitBODData[6];

    let role = "";
    if (this.unitBOD_Position == 1)
      role = "Director";

    this.unitMemberDrawerTitle = "Add Member for Unit 7 " + role;
    this.unitMemberDrawerVisible = true;
    this.memberDrawerRoleName = "Unit 7 " + role;
    this.ManageUnitMembersComponentVar.sortKey = "id";
    this.ManageUnitMembersComponentVar.sortValue = "desc";
    this.ManageUnitMembersComponentVar.search(true, unitBOD_Position, this.unitBODData[6]["UNIT_ID"]);
    // this.ManageUnitMembersComponentVar.getMembers(this.unitBODData[6]["ID"]);
  }

  addUnit8Members(unitBOD_Position: any): void {
    this.unitBOD_Position = unitBOD_Position;
    this.unitBODDataToInput = this.unitBODData[7];

    let role = "";
    if (this.unitBOD_Position == 1)
      role = "Director";

    this.unitMemberDrawerTitle = "Add Member for Unit 8 " + role;
    this.unitMemberDrawerVisible = true;
    this.memberDrawerRoleName = "Unit 8 " + role;
    this.ManageUnitMembersComponentVar.sortKey = "id";
    this.ManageUnitMembersComponentVar.sortValue = "desc";
    this.ManageUnitMembersComponentVar.search(true, unitBOD_Position, this.unitBODData[7]["UNIT_ID"]);
    // this.ManageUnitMembersComponentVar.getMembers(this.unitBODData[7]["ID"]);
  }

  addUnit9Members(unitBOD_Position: any): void {
    this.unitBOD_Position = unitBOD_Position;
    this.unitBODDataToInput = this.unitBODData[8];

    let role = "";
    if (this.unitBOD_Position == 1)
      role = "Director";

    this.unitMemberDrawerTitle = "Add Member for Unit 9 " + role;
    this.unitMemberDrawerVisible = true;
    this.memberDrawerRoleName = "Unit 9 " + role;
    this.ManageUnitMembersComponentVar.sortKey = "id";
    this.ManageUnitMembersComponentVar.sortValue = "desc";
    this.ManageUnitMembersComponentVar.search(true, unitBOD_Position, this.unitBODData[8]["UNIT_ID"]);
    // this.ManageUnitMembersComponentVar.getMembers(this.unitBODData[8]["ID"]);
  }

  addUnit10Members(unitBOD_Position: any): void {
    this.unitBOD_Position = unitBOD_Position;
    this.unitBODDataToInput = this.unitBODData[9];

    let role = "";
    if (this.unitBOD_Position == 1)
      role = "Director";

    this.unitMemberDrawerTitle = "Add Member for Unit 10 " + role;
    this.unitMemberDrawerVisible = true;
    this.memberDrawerRoleName = "Unit 10 " + role;
    this.ManageUnitMembersComponentVar.sortKey = "id";
    this.ManageUnitMembersComponentVar.sortValue = "desc";
    this.ManageUnitMembersComponentVar.search(true, unitBOD_Position, this.unitBODData[9]["UNIT_ID"]);
    // this.ManageUnitMembersComponentVar.getMembers(this.unitBODData[9]["ID"]);
  }

  addUnit11Members(unitBOD_Position: any): void {
    this.unitBOD_Position = unitBOD_Position;
    this.unitBODDataToInput = this.unitBODData[10];

    let role = "";
    if (this.unitBOD_Position == 1)
      role = "Director";

    this.unitMemberDrawerTitle = "Add Member for Unit 11 " + role;
    this.unitMemberDrawerVisible = true;
    this.memberDrawerRoleName = "Unit 11 " + role;
    this.ManageUnitMembersComponentVar.sortKey = "id";
    this.ManageUnitMembersComponentVar.sortValue = "desc";
    this.ManageUnitMembersComponentVar.search(true, unitBOD_Position, this.unitBODData[10]["UNIT_ID"]);
    // this.ManageUnitMembersComponentVar.getMembers(this.unitBODData[10]["ID"]);
  }

  addUnit12Members(unitBOD_Position: any): void {
    this.unitBOD_Position = unitBOD_Position;
    this.unitBODDataToInput = this.unitBODData[11];

    let role = "";
    if (this.unitBOD_Position == 1)
      role = "Director";

    this.unitMemberDrawerTitle = "Add Member for Unit 12 " + role;
    this.unitMemberDrawerVisible = true;
    this.memberDrawerRoleName = "Unit 12 " + role;
    this.ManageUnitMembersComponentVar.sortKey = "id";
    this.ManageUnitMembersComponentVar.sortValue = "desc";
    this.ManageUnitMembersComponentVar.search(true, unitBOD_Position, this.unitBODData[11]["UNIT_ID"]);
    // this.ManageUnitMembersComponentVar.getMembers(this.unitBODData[11]["ID"]);
  }

  addUnit13Members(unitBOD_Position: any): void {
    this.unitBOD_Position = unitBOD_Position;
    this.unitBODDataToInput = this.unitBODData[12];

    let role = "";
    if (this.unitBOD_Position == 1)
      role = "Director";

    this.unitMemberDrawerTitle = "Add Member for Unit 13 " + role;
    this.unitMemberDrawerVisible = true;
    this.memberDrawerRoleName = "Unit 13 " + role;
    this.ManageUnitMembersComponentVar.sortKey = "id";
    this.ManageUnitMembersComponentVar.sortValue = "desc";
    this.ManageUnitMembersComponentVar.search(true, unitBOD_Position, this.unitBODData[12]["UNIT_ID"]);
    // this.ManageUnitMembersComponentVar.getMembers(this.unitBODData[12]["ID"]);
  }

  addUnit14Members(unitBOD_Position: any): void {
    this.unitBOD_Position = unitBOD_Position;
    this.unitBODDataToInput = this.unitBODData[13];

    let role = "";
    if (this.unitBOD_Position == 1)
      role = "Director";

    this.unitMemberDrawerTitle = "Add Member for Unit 14 " + role;
    this.unitMemberDrawerVisible = true;
    this.memberDrawerRoleName = "Unit 14 " + role;
    this.ManageUnitMembersComponentVar.sortKey = "id";
    this.ManageUnitMembersComponentVar.sortValue = "desc";
    this.ManageUnitMembersComponentVar.search(true, unitBOD_Position, this.unitBODData[13]["UNIT_ID"]);
    // this.ManageUnitMembersComponentVar.getMembers(this.unitBODData[13]["ID"]);
  }

  getWidth() {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 1000;
  }

  sendForApprovalToAdministrator(): void {
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();

    if (currentMonth <= 3) {
      currentYear = (currentYear - 1) + 1;

    } else {
      currentYear = currentYear;
    }

    this.isSpinning = true;
    let obj1 = new Object();
    obj1["FEDERATION_ID"] = this.data["FEDERATION_ID"];
    obj1["YEAR"] = currentYear;

    this.api.checkFederationBOD(obj1).subscribe(data => {
      if (data['code'] == 200) {
        this.message.success("New BOD Approval Email Sent to Administrator", "");
        this.isSpinning = false;
        this.gettingFederationBODStatus(this.data["FEDERATION_ID"]);

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
  federationBODStatusData: any[] = [];

  gettingFederationBODStatus(federationID: number): void {
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();

    if (currentMonth <= 3) {
      currentYear = (currentYear - 1) + 1;

    } else {
      currentYear = currentYear;
    }

    this.api.gettingFederationBODStatus(0, 0, "", "", " AND FEDERATION_ID=" + federationID + " AND YEAR=" + currentYear).subscribe(data => {
      if (data['code'] == 200) {
        this.federationBODStatusData = data["data"];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  cancel(): void { }

  sendApprovalDrawerTitle: string = "";
  sendApprovalDrawerVisible: boolean = false;
  @ViewChild(FederationBodSendForApprovalComponent, { static: false }) FederationBodSendForApprovalComponentVar: FederationBodSendForApprovalComponent;
  DOCUMENTS_LIST: any;
  PAYMENT_LIST: any;
  BIO_DATA_LIST: any;
  FEDERATION_INFO: any;
  NEW_FEDERATION_BOD: any[] = [];
  NEW_UNIT_BOD: any[] = [];

  sendForApprovalDrawerInitialization(): void {
    this.FederationBodSendForApprovalComponentVar.onComponentInitialized();
  }

  sendForApproval(): void {
    this.FEDERATION_INFO = this.data;
    this.sendApprovalDrawerTitle = "aaa " + "Send For Approval";

    if (this.data["FEDERATION_ID"]) {
      this.FederationBodSendForApprovalComponentVar.getFederationMemberData(this.data["FEDERATION_ID"]);
      this.FederationBodSendForApprovalComponentVar.getFederationcentralSpecialCommitteeMemberData(this.data["FEDERATION_ID"]);
    }

    // Getting Next Year BOD
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();

    if (currentMonth <= 3) {
      currentYear = (currentYear - 1) + 1;

    } else {
      currentYear = currentYear;
    }

    this.FederationBodSendForApprovalComponentVar.loadingRecords = true;

    this.api.gettingNewFederationBOD(this.data["FEDERATION_ID"], currentYear).subscribe(data => {
      if ((data['code'] == 200)) {
        this.FederationBodSendForApprovalComponentVar.loadingRecords = false;
        this.NEW_FEDERATION_BOD = data["data"];
        this.NEW_UNIT_BOD = data["data1"];
      }

    }, err => {
      this.FederationBodSendForApprovalComponentVar.loadingRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    // Get mailing list and new BOD list
    this.sendApprovalDrawerVisible = true;
    this.FederationBodSendForApprovalComponentVar.SUBJECT = "New Council List For The Year " + currentYear + " of " + this.data.NAME;
    this.FederationBodSendForApprovalComponentVar.DESCRIPTION = 'Respected Sir/ Madam, <br><span style="text-align: justify;">With reference to the above subject, <br>The Giants Welfare Foundation has selected the new council list of <b>' + this.data.NAME + '</b> for the year ' + currentYear + ' and sent for your information and necessary action. <br>Please check the links below for the same.</span><br><br>';

    let obj1 = new Object();
    obj1["FEDERATION_ID"] = this.data["FEDERATION_ID"];
    obj1["FEDERATION_NAME"] = this.data.NAME;
    obj1["YEAR"] = currentYear;

    this.api.sendForFederationApprovalToAdministrator(obj1).subscribe(data => {
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
    this.gettingFederationBODStatus(this.data["FEDERATION_ID"]);
  }

  get sendApprovalDrapwerCloseCallback() {
    return this.sendApprovalDrawerClose.bind(this);
  }
}