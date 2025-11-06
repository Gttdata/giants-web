import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { GroupMaster } from 'src/app/Models/GroupMaster';
import { ApiService } from 'src/app/Service/api.service';
import { NgForm } from '@angular/forms';
import { InchargeAreaMatser } from 'src/app/Models/InchargeAreaMaster';

@Component({
  selector: 'app-view-group-bod',
  templateUrl: './view-group-bod.component.html',
  styleUrls: ['./view-group-bod.component.css']
})

export class ViewGroupBodComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: GroupMaster;
  @Input() drawerVisible: boolean;
  isSpinning: boolean = false;
  leaveTypes = [];
  namePattern = "([A-Za-z0-9 \s]){1,}";

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.getMembers();
    this.getInchargeAreas();
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

  isVisible = false;
  isConfirmLoading = false;
  roleID: number;

  showModal(rID: number): void {
    this.roleID = rID;
    this.isVisible = true;
  }

  NEW_MEMBER_ID: number;

  handleOk(data: GroupMaster): void {
    this.api.assignGroup(this.roleID, data, this.NEW_MEMBER_ID).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Updated Successfully", "");
        this.isVisible = false;

        if (this.roleID == 1)
          data.PRESIDENT = this.NEW_MEMBER_ID;

        else if (this.roleID == 2)
          data.VPI = this.NEW_MEMBER_ID;

        else if (this.roleID == 3)
          data.VPE = this.NEW_MEMBER_ID;

        else if (this.roleID == 4)
          data.SECRETORY = this.NEW_MEMBER_ID;

        else if (this.roleID == 5)
          data.TREASURER = this.NEW_MEMBER_ID;

        else if (this.roleID == 6)
          data.DIRECTOR1 = this.NEW_MEMBER_ID;

        else if (this.roleID == 7)
          data.DIRECTOR2 = this.NEW_MEMBER_ID;

        else if (this.roleID == 8)
          data.DIRECTOR3 = this.NEW_MEMBER_ID;

        else if (this.roleID == 9)
          data.DIRECTOR4 = this.NEW_MEMBER_ID;

        else if (this.roleID == 10)
          data.DIRECTOR5 = this.NEW_MEMBER_ID;

        this.getData1(data);
        this.NEW_MEMBER_ID = undefined;

      } else
        this.message.error("Failed to Update", "");
    });
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  members = [];
  memberLoading = false;

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

  getInitial(empName) {
    let initial: string = empName.charAt(0);
    return initial.trim();
  }

  BOD: string = "";
  memberList = [];

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

  vpiPhoto: string = "";
  vpiName: string = "";
  vpiMobile: string = "";
  vpiFederation: string = "";
  vpiUnit: string = "";
  vpiGroup: string = "";
  vpiEmail: string = "";
  vpiDOB: string = "";
  vpiAddress: string = "";
  vpiInchargeOf: string = "";

  vpePhoto: string = "";
  vpeName: string = "";
  vpeMobile: string = "";
  vpeFederation: string = "";
  vpeUnit: string = "";
  vpeGroup: string = "";
  vpeEmail: string = "";
  vpeDOB: string = "";
  vpeAddress: string = "";
  vpeInchargeOf: string = "";

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

  director1Photo: string = "";
  director1Name: string = "";
  director1Mobile: string = "";
  director1Federation: string = "";
  director1Unit: string = "";
  director1Group: string = "";
  director1Email: string = "";
  director1DOB: string = "";
  director1Address: string = "";
  director1InchargeOf: string = "";

  director2Photo: string = "";
  director2Name: string = "";
  director2Mobile: string = "";
  director2Federation: string = "";
  director2Unit: string = "";
  director2Group: string = "";
  director2Email: string = "";
  director2DOB: string = "";
  director2Address: string = "";
  director2InchargeOf: string = "";

  director3Photo: string = "";
  director3Name: string = "";
  director3Mobile: string = "";
  director3Federation: string = "";
  director3Unit: string = "";
  director3Group: string = "";
  director3Email: string = "";
  director3DOB: string = "";
  director3Address: string = "";
  director3InchargeOf: string = "";

  director4Photo: string = "";
  director4Name: string = "";
  director4Mobile: string = "";
  director4Federation: string = "";
  director4Unit: string = "";
  director4Group: string = "";
  director4Email: string = "";
  director4DOB: string = "";
  director4Address: string = "";
  director4InchargeOf: string = "";

  director5Photo: string = "";
  director5Name: string = "";
  director5Mobile: string = "";
  director5Federation: string = "";
  director5Unit: string = "";
  director5Group: string = "";
  director5Email: string = "";
  director5DOB: string = "";
  director5Address: string = "";
  director5InchargeOf: string = "";

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

  presidentYesNo: boolean = false;
  vpiYesNo: boolean = false;
  vpeYesNo: boolean = false;
  secretaryYesNo: boolean = false;
  treasurerYesNo: boolean = false;
  director1YesNo: boolean = false;
  director2YesNo: boolean = false;
  director3YesNo: boolean = false;
  director4YesNo: boolean = false;
  director5YesNo: boolean = false;
  ippYesNo: boolean = false;

  clearValues() {
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

    this.vpiPhoto = "assets/anony.png";
    this.vpiName = "";
    this.vpiMobile = "";
    this.vpiFederation = "";
    this.vpiUnit = "";
    this.vpiGroup = "";
    this.vpiEmail = "";
    this.vpiDOB = "";
    this.vpiAddress = "";
    this.vpiInchargeOf = "";

    this.vpePhoto = "assets/anony.png";
    this.vpeName = "";
    this.vpeMobile = "";
    this.vpeFederation = "";
    this.vpeUnit = "";
    this.vpeGroup = "";
    this.vpeEmail = "";
    this.vpeDOB = "";
    this.vpeAddress = "";
    this.vpeInchargeOf = "";

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

    this.director1Photo = "assets/anony.png";
    this.director1Name = "";
    this.director1Mobile = "";
    this.director1Federation = "";
    this.director1Unit = "";
    this.director1Group = "";
    this.director1Email = "";
    this.director1DOB = "";
    this.director1Address = "";
    this.director1InchargeOf = "";

    this.director2Photo = "assets/anony.png";
    this.director2Name = "";
    this.director2Mobile = "";
    this.director2Federation = "";
    this.director2Unit = "";
    this.director2Group = "";
    this.director2Email = "";
    this.director2DOB = "";
    this.director2Address = "";
    this.director2InchargeOf = "";

    this.director3Photo = "assets/anony.png";
    this.director3Name = "";
    this.director3Mobile = "";
    this.director3Federation = "";
    this.director3Unit = "";
    this.director3Group = "";
    this.director3Email = "";
    this.director3DOB = "";
    this.director3Address = "";
    this.director3InchargeOf = "";

    this.director4Photo = "assets/anony.png";
    this.director4Name = "";
    this.director4Mobile = "";
    this.director4Federation = "";
    this.director4Unit = "";
    this.director4Group = "";
    this.director4Email = "";
    this.director4DOB = "";
    this.director4Address = "";
    this.director4InchargeOf = "";

    this.director5Photo = "assets/anony.png";
    this.director5Name = "";
    this.director5Mobile = "";
    this.director5Federation = "";
    this.director5Unit = "";
    this.director5Group = "";
    this.director5Email = "";
    this.director5DOB = "";
    this.director5Address = "";
    this.director5InchargeOf = "";

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

    this.presidentYesNo = false;
    this.vpiYesNo = false;
    this.vpeYesNo = false;
    this.secretaryYesNo = false;
    this.treasurerYesNo = false;
    this.director1YesNo = false;
    this.director2YesNo = false;
    this.director3YesNo = false;
    this.director4YesNo = false;
    this.director5YesNo = false;
  }

  getData1(dataParam: GroupMaster) {
    this.isSpinning = true;
    this.BOD = "";
    this.clearValues();

    this.BOD += dataParam.PRESIDENT ? dataParam.PRESIDENT + "," : "";
    this.BOD += dataParam.VPI ? dataParam.VPI + "," : "";
    this.BOD += dataParam.VPE ? dataParam.VPE + "," : "";
    this.BOD += dataParam.SECRETORY ? dataParam.SECRETORY + "," : "";
    this.BOD += dataParam.TREASURER ? dataParam.TREASURER + "," : "";
    this.BOD += dataParam.DIRECTOR1 ? dataParam.DIRECTOR1 + "," : "";
    this.BOD += dataParam.DIRECTOR2 ? dataParam.DIRECTOR2 + "," : "";
    this.BOD += dataParam.DIRECTOR3 ? dataParam.DIRECTOR3 + "," : "";
    this.BOD += dataParam.DIRECTOR4 ? dataParam.DIRECTOR4 + "," : "";
    this.BOD += dataParam.DIRECTOR5 ? dataParam.DIRECTOR5 + "," : "";
    this.BOD += dataParam["GROUP_IPP"] ? dataParam["GROUP_IPP"] + "," : "";

    if (this.BOD.length > 0) {
      this.BOD = this.BOD.substring(0, this.BOD.length - 1);

      this.api.getAllMembers(0, 0, "", "", " AND ID IN (" + this.BOD + ")").subscribe(data => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          this.memberList = data['data'];

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

          if (dataParam.VPI) {
            this.vpiYesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.VPI);
            });

            this.vpiPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.vpiPhoto != null) && (this.vpiPhoto.trim() != ''))
              this.vpiPhoto = this.api.retriveimgUrl + "profileImage/" + this.vpiPhoto;

            else
              this.vpiPhoto = "assets/anony.png";

            this.vpiName = member.length > 0 ? member[0]["NAME"] : "";
            this.vpiMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.vpiFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.vpiUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.vpiGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.vpiDOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.vpiEmail = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.vpiAddress = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.vpiInchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.VPE) {
            this.vpeYesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.VPE);
            });

            this.vpePhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.vpePhoto != null) && (this.vpePhoto.trim() != ''))
              this.vpePhoto = this.api.retriveimgUrl + "profileImage/" + this.vpePhoto;

            else
              this.vpePhoto = "assets/anony.png";

            this.vpeName = member.length > 0 ? member[0]["NAME"] : "";
            this.vpeMobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.vpeFederation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.vpeUnit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.vpeGroup = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.vpeDOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.vpeEmail = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.vpeAddress = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.vpeInchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
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

          if (dataParam.DIRECTOR1) {
            this.director1YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.DIRECTOR1);
            });

            this.director1Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.director1Photo != null) && (this.director1Photo.trim() != ''))
              this.director1Photo = this.api.retriveimgUrl + "profileImage/" + this.director1Photo;

            else
              this.director1Photo = "assets/anony.png";

            this.director1Name = member.length > 0 ? member[0]["NAME"] : "";
            this.director1Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.director1Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.director1Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.director1Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.director1DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.director1Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.director1Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.director1InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.DIRECTOR2) {
            this.director2YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.DIRECTOR2);
            });

            this.director2Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.director2Photo != null) && (this.director2Photo.trim() != ''))
              this.director2Photo = this.api.retriveimgUrl + "profileImage/" + this.director2Photo;

            else
              this.director2Photo = "assets/anony.png";

            this.director2Name = member.length > 0 ? member[0]["NAME"] : "";
            this.director2Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.director2Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.director2Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.director2Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.director2DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.director2Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.director2Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.director2InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.DIRECTOR3) {
            this.director3YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.DIRECTOR3);
            });

            this.director3Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.director3Photo != null) && (this.director3Photo.trim() != ''))
              this.director3Photo = this.api.retriveimgUrl + "profileImage/" + this.director3Photo;

            else
              this.director3Photo = "assets/anony.png";

            this.director3Name = member.length > 0 ? member[0]["NAME"] : "";
            this.director3Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.director3Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.director3Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.director3Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.director3DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.director3Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.director3Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.director3InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.DIRECTOR4) {
            this.director4YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.DIRECTOR4);
            });

            this.director4Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.director4Photo != null) && (this.director4Photo.trim() != ''))
              this.director4Photo = this.api.retriveimgUrl + "profileImage/" + this.director4Photo;

            else
              this.director4Photo = "assets/anony.png";

            this.director4Name = member.length > 0 ? member[0]["NAME"] : "";
            this.director4Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.director4Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.director4Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.director4Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.director4DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.director4Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.director4Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.director4InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam.DIRECTOR5) {
            this.director5YesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam.DIRECTOR5);
            });

            this.director5Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
            if ((this.director5Photo != null) && (this.director5Photo.trim() != ''))
              this.director5Photo = this.api.retriveimgUrl + "profileImage/" + this.director5Photo;

            else
              this.director5Photo = "assets/anony.png";

            this.director5Name = member.length > 0 ? member[0]["NAME"] : "";
            this.director5Mobile = member.length > 0 ? member[0]["MOBILE_NUMBER"] : "";
            this.director5Federation = member.length > 0 ? member[0]["FEDERATION_NAME"] : "";
            this.director5Unit = member.length > 0 ? member[0]["UNIT_NAME"] : "";
            this.director5Group = member.length > 0 ? member[0]["GROUP_NAME"] : "";
            this.director5DOB = member.length > 0 ? ((this.datePipe.transform(member[0]["DOB"], "yyyyMMdd") == "19000101") ? "" : this.getBirthDate(member[0]["DOB"], member[0]["IS_SHOW_YEAR"])) : "";
            this.director5Email = member.length > 0 ? (member[0]["EMAIL_ID"] ? member[0]["EMAIL_ID"].split(',')[0] : "") : "";
            this.director5Address = member.length > 0 ? ((member[0]["ADDRESS1"] ? member[0]["ADDRESS1"] : "") + " " + (member[0]["ADDRESS2"] ? member[0]["ADDRESS2"] : "")) : "";
            this.director5InchargeOf = member.length > 0 ? this.getInchargeName(member[0]["INCHARGE_OF"]) : "";
          }

          if (dataParam["GROUP_IPP"]) {
            this.ippYesNo = true;

            var member = this.memberList.filter(obj => {
              return (obj.ID == dataParam["GROUP_IPP"]);
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
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });

    } else {
      this.isSpinning = false;
    }
  }

  getInchargeName(inchargeIDs: string): string {
    let IDs = inchargeIDs.split(',');
    let inchargeNamesArray = [];

    for (var i = 0; i < IDs.length; i++) {
      this.inchargeAreas.filter((obj1: InchargeAreaMatser) => {
        if (obj1.ID == Number(IDs[i])) {
          inchargeNamesArray.push(obj1.NAME);
        }
      });
    }

    return inchargeNamesArray.toString();
  }

  inchargeAreas = [];

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

  getBirthDate(DOB: Date, showOrHideYear: boolean): string {
    let formattedDOB = "";
    if (showOrHideYear) {
      formattedDOB = this.datePipe.transform(DOB, "dd MMM yyyy");

    } else {
      formattedDOB = this.datePipe.transform(DOB, "dd MMM");
    }

    return formattedDOB;
  }
}
