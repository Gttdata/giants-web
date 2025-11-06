import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { UnitMaster } from 'src/app/Models/UnitMaster';
import { ApiService } from 'src/app/Service/api.service';
import { NgForm } from '@angular/forms';
import { InchargeAreaMatser } from 'src/app/Models/InchargeAreaMaster';

@Component({
  selector: 'app-view-unit-bod',
  templateUrl: './view-unit-bod.component.html',
  styleUrls: ['./view-unit-bod.component.css']
})

export class ViewUnitBodComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: UnitMaster;
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

  isVisible: boolean = false;
  isConfirmLoading: boolean = false;
  roleID: number;

  showModal(rID: number): void {
    this.roleID = rID;
    this.isVisible = true;
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

  getInitial(empName) {
    let initial: string = empName.charAt(0);
    return initial.trim();
  }

  BOD: string = "";
  memberList = [];

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

  clearValues() {
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

  getData1(dataParam: UnitMaster) {
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

            this.directorPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
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

            this.officer1Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
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

            this.officer2Photo = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
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

            this.vpPhoto = member.length > 0 ? member[0]["PROFILE_IMAGE"] : "";
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
