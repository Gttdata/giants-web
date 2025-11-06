import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { GroupMaster } from 'src/app/Models/GroupMaster';
import { ApiService } from 'src/app/Service/api.service';
import { NgForm } from '@angular/forms';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CookieService } from 'ngx-cookie-service';
import { Membermaster } from 'src/app/Models/MemberMaster';
import { InchargeAreaMatser } from 'src/app/Models/InchargeAreaMaster';

@Component({
  selector: 'app-manage-group-members',
  templateUrl: './manage-group-members.component.html',
  styleUrls: ['./manage-group-members.component.css']
})

export class ManageGroupMembersComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: GroupMaster;
  @Input() BOD_Position: any;
  @Input() dataList: any[] = [];
  @Input() drawerVisible: boolean;
  @Input() memberDrawerRoleName: string;
  isSpinning: boolean = false;
  namePattern = "([A-Za-z0-9 \s]){1,}";
  roleID: number = this.api.roleId;
  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private _cookie: CookieService) { }

  ngOnInit() { }

  onComponentInitialized(): void {
    this.getIDs();
    this.getInchargeAreas();
    // this.getMembers();
  }

  getIDs(): void {
    this.federationID = Number(sessionStorage.getItem("FEDERATION_ID"));
    this.unitID = Number(sessionStorage.getItem("UNIT_ID"));
    this.groupID = Number(sessionStorage.getItem("GROUP_ID"));
  }

  close(myForm: NgForm): void {
    this.drawerClose();
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

  showModal(): void {
    this.isVisible = true;
    let currentYear = new Date().getFullYear();
    this.START_DATE = this.datePipe.transform(new Date(currentYear, 0, 1), "yyyy-MM-dd");
    this.END_DATE = this.datePipe.transform(new Date((currentYear), 11, 31), "yyyy-MM-dd");
    this.INCHARGE_OF = undefined;
    this.pdfFileURL1 = null;
    this.bioDataURL = "";
    this.bioDataYesNo = false;
    this.profilePhotoURL = null;
    this.existingProfilePhotoURL = "";
    this.profilePhotoYesNo = false;
    this.members = [];
  }

  handleCancel(): void {
    this.isConfirmLoading = false;
    this.isVisible = false;
    this.NEW_MEMBER_ID = undefined;
    this.START_DATE = undefined;
    this.END_DATE = undefined;
    this.INCHARGE_OF = undefined;
    this.search(true, this.BOD_Position, this.data["GROUP_ID"]);
  }

  members: any[] = [];
  memberLoading: boolean = false;

  getMembers(groupID: number) {
    this.members = [];
    this.memberLoading = true;

    this.api.getAllMembers(0, 0, "NAME", "asc", " AND GROUP_ID=" + groupID).subscribe(data => {
      if (data['code'] == 200) {
        this.memberLoading = false;
        this.members = data['data'];
      }

    }, err => {
      this.memberLoading = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getFederationWiseMembers(memberName: string): void {
    let groupFilter = " AND GROUP_ID=" + this.data["GROUP_ID"];

    if (memberName.length >= 3) {
      this.memberLoading = true;

      this.api.getAllMembers(0, 0, "NAME", "asc", " AND NAME LIKE '%" + memberName + "%'" + groupFilter).subscribe(data => {
        if (data['code'] == 200) {
          this.memberLoading = false;
          this.members = data['data'];
        }

      }, err => {
        this.memberLoading = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  getInitial(empName: string) {
    let initial: string = empName.charAt(0);
    return initial.trim();
  }

  NEW_MEMBER_ID: number;
  START_DATE: string;
  END_DATE: string;
  INCHARGE_OF: any;

  handleOk() {
    var isOK = true;

    if (this.NEW_MEMBER_ID == undefined || this.NEW_MEMBER_ID == null) {
      isOK = false;
      this.message.error("Please Select Valid Member", "");
    }

    if (this.START_DATE == undefined || this.START_DATE == null) {
      isOK = false;
      this.message.error("Please Select Valid Start Date", "");
    }

    if (this.END_DATE == undefined || this.END_DATE == null) {
      isOK = false;
      this.message.error("Please Select Valid End Date", "");
    }

    // if (this.BOD_Position == 1) {
    //   if (!this.bioDataYesNo) {
    //     isOK = false;
    //     this.message.error("Please Upload Valid Bio Data", "");
    //   }
    // }

    // if (!this.profilePhotoYesNo) {
    //   isOK = false;
    //   this.message.error("Please Upload Valid Profile Photo", "");
    // }

    if (isOK) {
      this.isConfirmLoading = true;

      // Update Incharge Areas
      this.INCHARGE_OF = this.INCHARGE_OF == undefined ? "" : this.INCHARGE_OF;

      if (this.INCHARGE_OF != "") {
        this.INCHARGE_OF = this.INCHARGE_OF.toString();

      } else {
        this.INCHARGE_OF = " ";
      }

      this.tempMemebrData.INCHARGE_OF = this.INCHARGE_OF;

      this.api.updateMember(this.tempMemebrData).subscribe(successCode => {
        if (successCode['code'] == 200) {
          console.log("Member Details Updated Successfully");
        }
      });

      var obj1 = new Object();
      obj1["GROUP_ID"] = this.data["GROUP_ID"];
      obj1["BOD_POSITION_ID"] = this.BOD_Position;
      obj1["MEMBER_ID"] = this.NEW_MEMBER_ID;
      obj1["START_DATE"] = this.datePipe.transform(this.START_DATE, "yyyy-MM-dd");
      obj1["END_DATE"] = this.datePipe.transform(this.END_DATE, "yyyy-MM-dd");
      obj1["APPLIED_BY_ID"] = this.api.userId;

      if (this.roleID == 3)
        obj1["KEY"] = "WORLD_COUNCIL";
      else
        obj1["KEY"] = "FEDERATION";

      this.api.assignGroupBOD(obj1).subscribe(successCode => {
        if (successCode['code'] == 200) {
          this.message.success("Memeber Added Successfully", "");
          this.search(true, this.BOD_Position, this.data["GROUP_ID"]);
          this.isVisible = false;
          this.isConfirmLoading = false;
          this.NEW_MEMBER_ID = undefined;
          this.START_DATE = undefined;
          this.END_DATE = undefined;
          this.INCHARGE_OF = undefined;

        } else {
          this.isConfirmLoading = false;
          this.NEW_MEMBER_ID = undefined;
          this.START_DATE = undefined;
          this.END_DATE = undefined;
          this.INCHARGE_OF = undefined;
          this.message.error("Failed to Add Member", "");
        }
      });
    }
  }

  today = new Date().setDate(new Date().getDate());

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) > 0;

  // disabledExpiryDate = (current: Date): boolean =>
  //   differenceInCalendarDays(current, this.today) < 0;

  disabledExpiryDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.START_DATE ? this.START_DATE : this.today) < 0;

  startDateChange() {
    this.END_DATE = undefined;
  }

  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  loadingRecords: boolean = true;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  columns: string[][] = [
    ["START_DATE", "Start Date"],
    ["END_DATE", "End Date"],
    ["MEMBER_NAME", "Name"],
    ["MOBILE_NUMBER", "Mobile No."],
    ["GROUP_NAME", "Group"],
    ["BOD_POSITION_ID", "Position"]];
  drawerTitle: string;
  drawerData: GroupMaster = new GroupMaster();

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true, this.BOD_Position, this.data["GROUP_ID"]);
  }

  search(reset: boolean = false, BOD_Position: any, groupID: any) {
    if (reset) {
      this.pageIndex = 1;
    }

    this.loadingRecords = true;
    var sort: string;

    try {
      sort = this.sortValue.startsWith("a") ? "asc" : "desc";

    } catch (error) {
      sort = "";
    }

    var likeQuery = "";

    if (this.searchText != "") {
      likeQuery = " AND (";

      this.columns.forEach(column => {
        likeQuery += " " + column[0] + " like '%" + this.searchText + "%' OR";
      });

      likeQuery = likeQuery.substring(0, likeQuery.length - 2) + ')';
    }

    this.api
      .getGroupBOD(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + " AND BOD_POSITION_ID=" + BOD_Position + " AND GROUP_ID=" + groupID)
      .subscribe(data => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.totalRecords = data['count'];
          this.dataList = data['data'];
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  changeStatus(status, data) {
    data["STATUS"] = status;
    let role = "";

    if (data["BOD_POSITION_ID"] == 1)
      role = "PRESIDENT";

    else if (data["BOD_POSITION_ID"] == 2)
      role = "VPI";

    else if (data["BOD_POSITION_ID"] == 3)
      role = "VPE";

    else if (data["BOD_POSITION_ID"] == 4)
      role = "SECRETARY";

    else if (data["BOD_POSITION_ID"] == 5)
      role = "TREASURER";

    else if (data["BOD_POSITION_ID"] == 6)
      role = "DIRECTOR 1";

    else if (data["BOD_POSITION_ID"] == 7)
      role = "DIRECTOR 2";

    else if (data["BOD_POSITION_ID"] == 8)
      role = "DIRECTOR 3";

    else if (data["BOD_POSITION_ID"] == 9)
      role = "DIRECTOR 4";

    else if (data["BOD_POSITION_ID"] == 10)
      role = "DIRECTOR 5";

    else if (data["BOD_POSITION_ID"] == 11)
      role = "IPP";

    data["ROLE_NAME"] = role + " " + data["NAME"];

    this.api
      .updateGroupBOD(data)
      .subscribe(successCode => {
        if (successCode['code'] == 200) {
          this.message.success("Status Updated Successfully", "");
          this.search(false, this.BOD_Position, this.data["GROUP_ID"]);

        } else {
          this.message.error("Failed to Update Status", "");
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  changeActiveStatus(activeStatus, data) {
    data["ACTIVE_STATUS"] = activeStatus;
    let role = "";

    if (data["BOD_POSITION_ID"] == 1)
      role = "PRESIDENT";

    else if (data["BOD_POSITION_ID"] == 2)
      role = "VPI";

    else if (data["BOD_POSITION_ID"] == 3)
      role = "VPE";

    else if (data["BOD_POSITION_ID"] == 4)
      role = "SECRETARY";

    else if (data["BOD_POSITION_ID"] == 5)
      role = "TREASURER";

    else if (data["BOD_POSITION_ID"] == 6)
      role = "DIRECTOR 1";

    else if (data["BOD_POSITION_ID"] == 7)
      role = "DIRECTOR 2";

    else if (data["BOD_POSITION_ID"] == 8)
      role = "DIRECTOR 3";

    else if (data["BOD_POSITION_ID"] == 9)
      role = "DIRECTOR 4";

    else if (data["BOD_POSITION_ID"] == 10)
      role = "DIRECTOR 5";

    else if (data["BOD_POSITION_ID"] == 11)
      role = "IPP";

    data["ROLE_NAME"] = role + " " + data["NAME"];

    this.api
      .updateGroupBOD(data)
      .subscribe(successCode => {
        if (successCode['code'] == 200) {
          this.message.success("Active Status Updated Successfully", "");
          this.search(false, this.BOD_Position, this.data["GROUP_ID"]);

        } else {
          this.message.error("Failed to Update Active Status", "");
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  getBODPositionIDFullForm(BODPositionID: number): string {
    if (BODPositionID == 1)
      return "President";

    else if (BODPositionID == 2)
      return "VPI";

    else if (BODPositionID == 3)
      return "VPE";

    else if (BODPositionID == 4)
      return "Secretary";

    else if (BODPositionID == 5)
      return "Treasurer";

    else if (BODPositionID == 6)
      return "Director 1";

    else if (BODPositionID == 7)
      return "Director 2";

    else if (BODPositionID == 8)
      return "Director 3";

    else if (BODPositionID == 9)
      return "Director 4";

    else if (BODPositionID == 10)
      return "Director 5";

    else if (BODPositionID == 11)
      return "IPP";
  }

  enableOrDisableStatusWise(status: string): boolean {
    if ((status == "P") && (((this.groupID == this.data["SPONSERED_GROUP"]) && (this.data["GROUP_STATUS"] == "C")) || (this.unitID == this.data.UNIT_ID) || (this.federationID == this.data["FEDERATION_ID"])))
      return false;

    else
      return true;
  }

  enableOrDisableActiveStatusWise(status: string): boolean {
    if ((status == "A") && (((this.groupID == this.data["SPONSERED_GROUP"]) && (this.data["GROUP_STATUS"] == "C")) || (this.groupID == this.data["GROUP_ID"]) || (this.unitID == this.data.UNIT_ID) || (this.federationID == this.data["FEDERATION_ID"])))
      return false;

    else
      return true;
  }

  folderName: string = "biodataUrl";
  pdfFileURL1: any = null;
  pdf1Str: string;

  onPdfFileSelected1(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.pdfFileURL1 = <File>event.target.files[0];

    } else {
      this.message.error('Please Choose Only pdf File', '');
      this.pdfFileURL1 = null;
    }
  }

  pdfUpload1() {
    this.pdf1Str = "";

    if (this.pdfFileURL1) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.pdfFileURL1.name.split('.').pop();
      var url = "BD" + number + "." + fileExt;

      this.api
        .onUpload2(this.folderName, this.pdfFileURL1, url)
        .subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

      this.pdf1Str = url;

    } else {
      this.pdf1Str = "";
    }
  }

  bioDataURL: string = "";
  existingProfilePhotoURL: string = "";
  tempMemebrData: Membermaster = new Membermaster();
  bioDataYesNo: boolean = false;
  profilePhotoYesNo: boolean = false;

  getMemberData(memberID: number) {
    this.pdfFileURL1 = null;
    this.bioDataURL = "";

    this.api.getAllMembers(0, 0, "", "", " AND ID=" + memberID).subscribe(data => {
      if ((data['code'] == 200) && (data['data'].length > 0)) {
        this.tempMemebrData = data["data"][0];
        this.bioDataURL = data["data"][0]["BIODATA_URL"] ? data["data"][0]["BIODATA_URL"] : "";
        this.existingProfilePhotoURL = data["data"][0]["PROFILE_IMAGE"] ? data["data"][0]["PROFILE_IMAGE"] : "";

        // Bio Data
        if (this.bioDataURL.trim() != "") {
          this.bioDataYesNo = true;

        } else {
          this.bioDataYesNo = false;
        }

        // Profile Photo
        if (this.existingProfilePhotoURL.trim() != "") {
          this.profilePhotoYesNo = true;

        } else {
          this.profilePhotoYesNo = false;
        }

        // Fill Incharge Areas
        if (data["data"][0]["INCHARGE_OF"] == " ") {
          this.INCHARGE_OF = undefined;

        } else {
          let inchargeStringArray = [];

          if ((data["data"][0]["INCHARGE_OF"] != undefined) && (data["data"][0]["INCHARGE_OF"] != null)) {
            inchargeStringArray = data["data"][0]["INCHARGE_OF"].split(',');
          }

          let inchargeArray = [];
          for (var i = 0; i < inchargeStringArray.length; i++) {
            inchargeArray.push(Number(inchargeStringArray[i]));
          }

          this.INCHARGE_OF = inchargeArray;
        }

      } else {
        this.bioDataYesNo = false;
        this.profilePhotoYesNo = false;
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  pdfClear1() {
    this.pdfFileURL1 = null;
    this.bioDataURL = "";
  }

  uploadBioData() {
    this.bioDataYesNo = false;

    if ((this.NEW_MEMBER_ID != undefined) && (this.NEW_MEMBER_ID != null)) {
      this.isConfirmLoading = true;
      this.pdfUpload1();
      this.tempMemebrData.BIODATA_URL = (this.pdf1Str == "") ? " " : this.pdf1Str;

      this.api.updateMember(this.tempMemebrData).subscribe(successCode => {
        if (successCode['code'] == 200) {
          this.message.success("Member Bio Data Updated Successfully", "");
          this.isConfirmLoading = false;
          this.bioDataYesNo = true;

        } else {
          this.message.error("Member Bio Data Updation Failed", "");
          this.isConfirmLoading = false;
          this.bioDataYesNo = false;
        }
      });

    } else {
      this.message.error("Please Select Valid Member Name", "");
      this.isConfirmLoading = false;
      this.bioDataYesNo = false;
    }
  }

  viewBioData(bioDataURL: string) {
    window.open(this.api.retriveimgUrl + "biodataUrl/" + bioDataURL);
  }

  profilePhotoFolderName: string = "profileImage";
  profilePhotoURL: any = null;
  profilePhotoStr: string;

  onProfilePhotoSelected(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.profilePhotoURL = <File>event.target.files[0];

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.profilePhotoURL = null;
    }
  }

  profilePhotoUpload() {
    this.profilePhotoStr = "";

    if (this.profilePhotoURL) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.profilePhotoURL.name.split('.').pop();
      var url = "PI" + number + "." + fileExt;

      this.api.onUpload2(this.profilePhotoFolderName, this.profilePhotoURL, url).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");

        } else {
          console.log("Not Uploaded");
        }
      });

      this.profilePhotoStr = url;

    } else {
      this.profilePhotoStr = "";
    }
  }

  profilePhotoClear() {
    this.profilePhotoURL = null;
    this.existingProfilePhotoURL = "";
  }

  uploadProfilePhoto() {
    this.profilePhotoYesNo = false;

    if ((this.NEW_MEMBER_ID != undefined) && (this.NEW_MEMBER_ID != null)) {
      this.isConfirmLoading = true;
      this.profilePhotoUpload();
      this.tempMemebrData.PROFILE_IMAGE = (this.profilePhotoStr == "") ? " " : this.profilePhotoStr;

      this.api.updateMember(this.tempMemebrData).subscribe(successCode => {
        if (successCode['code'] == 200) {
          this.message.success("Member Profile Photo Updated Successfully", "");
          this.isConfirmLoading = false;
          this.profilePhotoYesNo = true;

        } else {
          this.message.error("Member Profile Photo Updation Failed", "");
          this.isConfirmLoading = false;
          this.profilePhotoYesNo = false;
        }
      });

    } else {
      this.message.error("Please Select Valid Member Name", "");
      this.isConfirmLoading = false;
      this.profilePhotoYesNo = false;
    }
  }

  viewProfilePhoto(photoURL: string) {
    window.open(this.api.retriveimgUrl + "profileImage/" + photoURL);
  }

  inchargeAreas = [];

  getInchargeAreas() {
    this.api.getAllInchargeAreas(0, 0, "NAME", "asc", " AND STATUS=1").subscribe(data => {
      if (data['code'] == 200) {
        this.inchargeAreas = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  inchargeAreaDrawerVisible: boolean;
  inchargeAreaDrawerTitle: string;
  inchargeAreaDrawerData: InchargeAreaMatser = new InchargeAreaMatser();

  addInchargeOf(): void {
    this.inchargeAreaDrawerTitle = "aaa " + "Add Incharge Area";
    this.inchargeAreaDrawerData = new InchargeAreaMatser();
    this.inchargeAreaDrawerVisible = true;
  }

  inchargeAreaDrawerClose(): void {
    this.getInchargeAreas();
    this.inchargeAreaDrawerVisible = false;
  }

  get inchargeAreaDrawerCloseCallback() {
    return this.inchargeAreaDrawerClose.bind(this);
  }

  onDeleteBtnClick(data: any) {
    this.api.deleteGroupBOD(data["ID"]).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("BOD Member Deleted Successfully", "");
        this.search(false, this.BOD_Position, this.data["GROUP_ID"]);

      } else {
        this.message.error("Failed to Deletion", "");
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }
}