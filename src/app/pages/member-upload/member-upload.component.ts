import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { GroupMaster } from 'src/app/Models/GroupMaster';
import { Membermaster } from 'src/app/Models/MemberMaster';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-member-upload',
  templateUrl: './member-upload.component.html',
  styleUrls: ['./member-upload.component.css']
})

export class MemberUploadComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() drawerVisible: boolean;
  @Input() currentGroupInfo: GroupMaster;
  newArray: any[] = [];
  isSpinning: boolean = false;

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  constructor(private datePipe: DatePipe, private api: ApiService, private message: NzNotificationService, private _cookie: CookieService) { }

  ngOnInit() {
    this.getIDs();
    this.getGroups();
    console.log(this.makeAlphaNumericPassward(10));
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

  getIDs(): void {
    let unitFilter = "";
    unitFilter = " AND ID=(SELECT UNIT_ID FROM group_master WHERE ID=" + this.groupID + ")";

    this.api.getAllUnits(0, 0, "NAME", "asc", unitFilter).subscribe(data => {
      if ((data['code'] == 200) && (data['count'] > 0)) {
        this.federationIDForImport = data['data'][0]["FEDERATION_ID"];
        this.unitIDForImport = data['data'][0]["ID"];
        this.groupIDForImport = Number(this.groupID);
      }

    }, err => {
      console.log(err);
    });
  }

  fileReaded: any;
  nm: any;

  csv2Array(fileInput: any): void {
    this.fileReaded = fileInput.target.files[0];
    this.nm = this.fileReaded.name;
    let reader: FileReader = new FileReader();

    reader.readAsText(this.fileReaded);
    reader.onload = (e) => {
      let csv: any = reader.result;
      let allTextLines = csv.split(/\r|\n|\r/);
      let headers = allTextLines[0].split(',');
      let lines = [];

      for (let i = 0; i < allTextLines.length; i++) {
        let data = allTextLines[i].split(',');
        if (data.length === headers.length) {
          let tarr = [];

          for (let j = 0; j < headers.length; j++) {
            tarr.push(data[j]);
          }

          lines.push(tarr);
        }
      }

      lines.splice(0, 1);
      var mainObject = this;
      let srNo: number = 1;

      this.newArray = lines.map(function (item) {
        return {
          "TEMP_ID": srNo,
          "TEMP_STATUS": "Pending",
          "NAME": item[0],
          "MOBILE_NUMBER": item[1],
          "EMAIL_ID": item[2],
          "GENDER": item[3],
          "DOB": ((item[4] != '') ? (mainObject.datePipe.transform(new Date(Number(item[4].split('-')[2]), Number(item[4].split('-')[1]) - 1, Number(item[4].split('-')[0])), "yyyy-MM-dd")) : ""),
          "MARITAL_STATUS": item[5],
          "ANNIVERSARY_DATE": ((item[6] != '') ? (mainObject.datePipe.transform(new Date(Number(item[6].split('-')[2]), Number(item[6].split('-')[1]) - 1, Number(item[6].split('-')[0])), "yyyy-MM-dd")) : ""),
          "ADDRESS1": item[7],
          "ADDRESS2": item[8],
          "CITY": item[9],
          "PINCODE": item[10],
          "MEMBERSHIP_DATE": ((item[11] != '') ? (mainObject.datePipe.transform(new Date(Number(item[11].split('-')[2]), Number(item[11].split('-')[1]) - 1, Number(item[11].split('-')[0])), "yyyy-MM-dd")) : ""),
          "EXPIRY_DATE": ((item[12] != '') ? (mainObject.datePipe.transform(new Date(Number(item[12].split('-')[2]), Number(item[12].split('-')[1]) - 1, Number(item[12].split('-')[0])), "yyyy-MM-dd")) : "")
        }
      })
    }
  }

  deletefile(): void {
    this.nm = '';
    this.newArray = [];
  }

  clear(): void {
    this.nm = '';
    this.newArray = [];
  }

  columns: string[][] = [["TEMP_STATUS", "Status"], ["NAME", "Name"], ["MOBILE_NUMBER", "Mobile No."], ["EMAIL_ID", "Email"], ["GENDER", "Gender"], ["DOB", "DOB"], ["MARITAL_STATUS", "Marital Status"], ["ANNIVERSARY_DATE", "Anniversary Date"], ["ADDRESS1", "Address 1"], ["ADDRESS2", "Address 2"], ["CITY", "City"], ["PINCODE", "Pincode"], ["MEMBERSHIP_DATE", "Joining Date"]];

  close(): void {
    this.drawerClose();
  }

  federationIDForImport: number = 0;
  unitIDForImport: number = 0;
  groupIDForImport: number = 0;
  uploadedMembersCount: number = 0;
  duplicateMembersCount: number = 0;
  failedToUploadMembersCount: number = 0;
  dataListAfterImport: any[] = [];

  importData(): void {
    let isOk = true;
    this.uploadedMembersCount = 0;
    this.duplicateMembersCount = 0;
    this.failedToUploadMembersCount = 0;
    this.dataListAfterImport = [];

    if ((this.newArray.length == 0)) {
      this.message.error("Please Select CSV File", "");
    }

    for (var i = 0; i < this.newArray.length; i++) {
      if (this.newArray[i]["NAME"].trim() == '') {
        isOk = false;
        this.message.error("Please Enter Valid Name (Row No. : " + (i + 1) + ")", "");
      }

      if (this.newArray[i]["MOBILE_NUMBER"].trim() == '') {
        isOk = false;
        this.message.error("Please Enter Valid Mobile No. (Row No. : " + (i + 1) + ")", "");
      }

      if (this.newArray[i]["MEMBERSHIP_DATE"].trim() == '') {
        isOk = false;
        this.message.error("Please Enter Valid Joining Date (Row No. : " + (i + 1) + ")", "");
      }
    }

    if (isOk) {
      if (this.currentGroupInfo == undefined) {
        let groupInfo = this.groups.filter((obj1: GroupMaster) => {
          return obj1.ID == this.groupID;
        });

        this.currentGroupInfo = groupInfo[0];
      }

      if ((this.newArray.length > 0) && (this.federationIDForImport != 0) && (this.unitIDForImport != 0) && (this.groupIDForImport != 0)) {
        for (var i = 0; i < this.newArray.length; i++) {
          // Get gender
          let gender = "";

          if ((this.newArray[i]["GENDER"].trim()).toLowerCase() == "male") {
            gender = "M";

          } else if ((this.newArray[i]["GENDER"].trim()).toLowerCase() == "female") {
            gender = "F";

          } else if ((this.newArray[i]["GENDER"].trim()).toLowerCase() == "other") {
            gender = "F";

          } else {
            gender = "";
          }

          // Get marrital status
          let maritalStatus = "";

          if ((this.newArray[i]["MARITAL_STATUS"].trim()).toLowerCase() == "single") {
            maritalStatus = "S";

          } else if ((this.newArray[i]["MARITAL_STATUS"].trim()).toLowerCase() == "married") {
            maritalStatus = "M";

          } else if ((this.newArray[i]["MARITAL_STATUS"].trim()).toLowerCase() == "widowed") {
            maritalStatus = "W";

          } else if ((this.newArray[i]["MARITAL_STATUS"].trim()).toLowerCase() == "divorced") {
            maritalStatus = "D";

          } else if ((this.newArray[i]["MARITAL_STATUS"].trim()).toLowerCase() == "separated") {
            maritalStatus = "E";

          } else {
            maritalStatus = "";
          }

          var memberData: Membermaster = new Membermaster();
          memberData.NAME = this.newArray[i]["NAME"];
          memberData.MOBILE_NUMBER = this.newArray[i]["MOBILE_NUMBER"];
          memberData.EMAIL_ID = this.newArray[i]["EMAIL_ID"];
          // memberData.PASSWORD = this.generate8DigitRandomNumber();
          memberData.PASSWORD = "12345678";
          memberData.GENDER = gender;

          if (this.newArray[i]["DOB"] == null) {
            this.newArray[i]["DOB"] = "";
          }

          memberData.DOB = ((this.newArray[i]["DOB"]).trim() != "") ? this.datePipe.transform(this.newArray[i]["DOB"], "yyyy-MM-dd") : null;
          memberData.MARITAL_STATUS = maritalStatus;

          if (this.newArray[i]["ANNIVERSARY_DATE"] == null) {
            this.newArray[i]["ANNIVERSARY_DATE"] = "";
          }

          memberData.ANNIVERSARY_DATE = ((this.newArray[i]["ANNIVERSARY_DATE"]).trim() != "") ? this.datePipe.transform(this.newArray[i]["ANNIVERSARY_DATE"], "yyyy-MM-dd") : null;
          memberData.ADDRESS1 = this.newArray[i]["ADDRESS1"];
          memberData.ADDRESS2 = this.newArray[i]["ADDRESS2"];
          memberData.CITY = this.newArray[i]["CITY"];
          memberData.PINCODE = this.newArray[i]["PINCODE"];
          memberData.MEMBERSHIP_DATE = ((this.newArray[i]["MEMBERSHIP_DATE"]).trim() != "") ? this.datePipe.transform(this.newArray[i]["MEMBERSHIP_DATE"], "yyyy-MM-dd") : null;

          if (this.newArray[i]["EXPIRY_DATE"] == null) {
            this.newArray[i]["EXPIRY_DATE"] = "";
          }

          memberData.EXPIRY_DATE = ((this.newArray[i]["EXPIRY_DATE"]).trim() != "") ? this.datePipe.transform(this.newArray[i]["EXPIRY_DATE"], "yyyy-MM-dd") : null;

          if (this.currentGroupInfo["SPONSERED_GROUP"] == null) {
            memberData.ACTIVE_STATUS = "A";

          } else {
            if (this.currentGroupInfo["SPONSERED_GROUP"] == 0) {
              memberData.ACTIVE_STATUS = "A";

            } else {
              if (this.currentGroupInfo["GROUP_STATUS"] == "A") {
                memberData.ACTIVE_STATUS = "A";

              } else {
                memberData.ACTIVE_STATUS = "P";
              }
            }
          }

          memberData.FEDERATION_ID = this.federationIDForImport;
          memberData.UNIT_ID = this.unitIDForImport;
          memberData.GROUP_ID = this.groupIDForImport;
          memberData["TEMP_ID"] = this.newArray[i]["TEMP_ID"];
          memberData["TEMP_STATUS"] = this.newArray[i]["TEMP_STATUS"];
          let tempData = memberData;
          this.isSpinning = true;

          this.api.createMember(memberData).subscribe(successCode => {
            if (successCode['code'] == 200) {
              this.uploadedMembersCount = (this.uploadedMembersCount) + 1;
              tempData["TEMP_STATUS"] = "Upload";
              this.dataListAfterImport.push(tempData);
              this.updateImportedArray();

            } else if (successCode['code'] == 300) {
              this.duplicateMembersCount = (this.duplicateMembersCount) + 1;
              tempData["TEMP_STATUS"] = "Duplicate";
              this.dataListAfterImport.push(tempData);
              this.updateImportedArray();

            } else if (successCode['code'] == 301) {
              this.message.info("Group Fee Not Assigned", "");
              this.failedToUploadMembersCount = (this.failedToUploadMembersCount) + 1;
              tempData["TEMP_STATUS"] = "Failed";
              this.dataListAfterImport.push(tempData);
              this.updateImportedArray();

            } else {
              this.failedToUploadMembersCount = (this.failedToUploadMembersCount) + 1;
              tempData["TEMP_STATUS"] = "Failed";
              this.dataListAfterImport.push(tempData);
              this.updateImportedArray();
            }

          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
        }
      }
    }
  }

  updateImportedArray(): void {
    if (this.newArray.length == this.dataListAfterImport.length) {
      this.newArray = this.dataListAfterImport;
      this.isSpinning = false;

      if (this.uploadedMembersCount > 0) {
        this.message.success(this.uploadedMembersCount + " Member(s) Uploaded Successfully", "");
      }

      if (this.duplicateMembersCount > 0) {
        this.message.info(this.duplicateMembersCount + " Duplicate Member(s)", "");
      }

      if (this.failedToUploadMembersCount > 0) {
        this.message.error(this.failedToUploadMembersCount + " Member(s) Failed to Upload", "");
      }
    }
  }

  generate8DigitRandomNumber(): string {
    return String(Math.floor(Math.random() * 1E8));
  }

  cancel(): void { }

  makeAlphaNumericPassward(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#';
    const charactersLength = characters.length;
    let counter = 0;

    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }

    return result;
  }
}
