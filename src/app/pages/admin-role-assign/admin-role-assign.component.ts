import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-admin-role-assign',
  templateUrl: './admin-role-assign.component.html',
  styleUrls: ['./admin-role-assign.component.css']
})

export class AdminRoleAssignComponent implements OnInit {
  formTitle: string = "Assign Role";
  members: any[] = [];
  memberLoading: boolean = false;
  chairPersonName: string = "";
  chairPersonMobileNo: string = "";
  chairPersonPhoto: string = "assets/anony.png";
  deputyPersonName: string = "";
  deputyPersonMobileNo: string = "";
  deputyPersonPhoto: string = "assets/anony.png";
  adminPersonName: string = "";
  adminPersonMobileNo: string = "";
  adminPersonPhoto: string = "assets/anony.png";

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() {
    this.getAdminData();
    this.getMembers();
  }

  getMembers(): void {
    this.memberLoading = true;

    this.api.getAllMembers(0, 0, "NAME", "asc", " AND FEDERATION_ID=0 AND UNIT_ID=0 AND GROUP_ID=0").subscribe(data => {
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
    let initial: string;

    if (empName.split(".").length == 2) {
      initial = empName.split(".")[1].trim().charAt(0);

    } else {
      initial = empName.split(".")[0].trim().charAt(0);
    }

    return initial;
  }

  loadingRecords: boolean = false;

  getAdminData(): void {
    this.loadingRecords = true;

    this.api.getAllMembers(0, 0, 'NAME', 'asc', ' AND ID IN (SELECT EMPLOYEE_ID from view_employee_role_mapping where ROLE_ID=60)').subscribe(data => {
      if ((data['code'] == 200) && (data["data"].length > 0)) {
        this.loadingRecords = false;
        this.chairPersonName = data['data'][0]["NAME"];
        this.chairPersonMobileNo = data['data'][0]["MOBILE_NUMBER"];
        let tempPhotoURL = data['data'][0]["PROFILE_IMAGE"].trim() == "" ? "" : data['data'][0]["PROFILE_IMAGE"];
        this.chairPersonPhoto = tempPhotoURL == "" ? "assets/anony.png" : this.api.retriveimgUrl + "profileImage/" + data['data'][0]["PROFILE_IMAGE"];

      } else {
        this.loadingRecords = false;
      }

    }, err => {
      this.loadingRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    this.loadingRecords = true;

    this.api.getAllMembers(0, 0, 'NAME', 'asc', ' AND ID IN (SELECT EMPLOYEE_ID from view_employee_role_mapping where ROLE_ID=61)').subscribe(data => {
      if ((data['code'] == 200) && (data["data"].length > 0)) {
        this.loadingRecords = false;
        this.deputyPersonName = data['data'][0]["NAME"];
        this.deputyPersonMobileNo = data['data'][0]["MOBILE_NUMBER"];
        let tempPhotoURL = data['data'][0]["PROFILE_IMAGE"].trim() == "" ? "" : data['data'][0]["PROFILE_IMAGE"];
        this.deputyPersonPhoto = tempPhotoURL == "" ? "assets/anony.png" : this.api.retriveimgUrl + "profileImage/" + data['data'][0]["PROFILE_IMAGE"];

      } else {
        this.loadingRecords = false;
      }

    }, err => {
      this.loadingRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    this.loadingRecords = true;

    this.api.getAllMembers(0, 0, 'NAME', 'asc', ' AND ID IN (SELECT EMPLOYEE_ID from view_employee_role_mapping where ROLE_ID=59)').subscribe(data => {
      if ((data['code'] == 200) && (data["data"].length > 0)) {
        this.loadingRecords = false;
        this.adminPersonName = data['data'][0]["NAME"];
        this.adminPersonMobileNo = data['data'][0]["MOBILE_NUMBER"];
        let tempPhotoURL = data['data'][0]["PROFILE_IMAGE"].trim() == "" ? "" : data['data'][0]["PROFILE_IMAGE"];
        this.adminPersonPhoto = tempPhotoURL == "" ? "assets/anony.png" : this.api.retriveimgUrl + "profileImage/" + data['data'][0]["PROFILE_IMAGE"];

      } else {
        this.loadingRecords = false;
      }

    }, err => {
      this.loadingRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  isVisible: boolean = false;
  isConfirmLoading: boolean = false;
  NEW_MEMBER_ID: number;
  POSITION: number;

  showModal(position: number): void {
    this.isVisible = true;
    this.NEW_MEMBER_ID = undefined;
    this.POSITION = position;
  }

  handleOk(): void {
    var isOK = true;

    if (this.NEW_MEMBER_ID == undefined || this.NEW_MEMBER_ID == null) {
      isOK = false;
      this.message.error("Please Select Valid Member", "");
    }

    if (isOK) {
      this.isConfirmLoading = true;
      var obj1 = new Object();
      obj1["POSITION"] = this.POSITION;
      obj1["MEMBER_ID"] = this.NEW_MEMBER_ID;

      this.api.assignAdminRoles(obj1).subscribe(successCode => {
        if (successCode['code'] == 200) {
          this.message.success("Role Assigned Successfully", "");
          this.getAdminData();
          this.isVisible = false;
          this.isConfirmLoading = false;
          this.NEW_MEMBER_ID = undefined;

        } else {
          this.message.error("Failed to Role Assign", "");
          this.getAdminData();
          this.isConfirmLoading = false;
          this.NEW_MEMBER_ID = undefined;
        }
      });
    }
  }

  handleCancel(): void {
    this.isConfirmLoading = false;
    this.isVisible = false;
    this.getAdminData();
  }
}
