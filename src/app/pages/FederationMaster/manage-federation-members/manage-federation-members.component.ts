import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { FederationMaster } from 'src/app/Models/FederationMaster';
import { ApiService } from 'src/app/Service/api.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CookieService } from 'ngx-cookie-service';
import { Membermaster } from 'src/app/Models/MemberMaster';
import { InchargeAreaMatser } from 'src/app/Models/InchargeAreaMaster';

@Component({
  selector: 'app-manage-federation-members',
  templateUrl: './manage-federation-members.component.html',
  styleUrls: ['./manage-federation-members.component.css']
})

export class ManageFederationMembersComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: FederationMaster;
  @Input() BOD_Position: any;
  @Input() dataList: any[] = [];
  @Input() drawerVisible: boolean;
  isSpinning: boolean = false;
  namePattern = "([A-Za-z0-9 \s]){1,}";
  roleID: number = this.api.roleId;
  @Input() memberDrawerRoleName: string;
  federationID: number;
  unitID: number;
  groupID: number;

  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private _cookie: CookieService) { }

  ngOnInit() { }

  onComponentInitialized(): void {
    this.getIDs();
    this.getInchargeAreas();
  }

  getIDs() {
    this.federationID = Number(this._cookie.get("FEDERATION_ID"));
    this.unitID = Number(this._cookie.get("UNIT_ID"));
    this.groupID = Number(this._cookie.get("GROUP_ID"));
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

  isVisible = false;
  isConfirmLoading = false;

  showModal(): void {
    this.isVisible = true;
    let currentYear = new Date().getFullYear();
    this.START_DATE = this.datePipe.transform(new Date(currentYear, 0, 1), "yyyy-MM-dd");
    this.END_DATE = this.datePipe.transform(new Date(currentYear, 11, 31), "yyyy-MM-dd");
    this.INCHARGE_OF = undefined;
  }

  handleCancel(): void {
    this.isConfirmLoading = false;
    this.isVisible = false;
    this.NEW_MEMBER_ID = undefined;
    this.START_DATE = undefined;
    this.END_DATE = undefined;
    this.INCHARGE_OF = undefined;
    this.search(true, this.BOD_Position, this.data["FEDERATION_ID"]);
  }

  members = [];
  memberLoading = false;

  getMembers(federationID: number) {
    this.memberLoading = true;

    // AND ACTIVE_STATUS='A'
    this.api
      .getAllMembers(0, 0, "NAME", "asc", " AND FEDERATION_ID=" + federationID)
      .subscribe(data => {
        if (data['code'] == 200) {
          this.memberLoading = false;
          this.members = data['data'];
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  getFederationWiseMembers(memberName: string) {
    if (memberName.length >= 3) {
      this.memberLoading = true;

      this.api
        .getAllMembers(0, 0, "NAME", "asc", " AND FEDERATION_ID=" + this.federationID + " AND NAME LIKE '%" + memberName + "%'")
        .subscribe(data => {
          if (data['code'] == 200) {
            this.memberLoading = false;
            this.members = data['data'];
          }

        }, err => {
          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });
    }
  }

  getInitial(empName) {
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
      obj1["FEDERATION_ID"] = this.data["FEDERATION_ID"];
      obj1["BOD_POSITION_ID"] = this.BOD_Position;
      obj1["MEMBER_ID"] = this.NEW_MEMBER_ID;
      obj1["START_DATE"] = this.datePipe.transform(this.START_DATE, "yyyy-MM-dd");
      obj1["END_DATE"] = this.datePipe.transform(this.END_DATE, "yyyy-MM-dd");
      obj1["APPLIED_BY_ID"] = this.api.userId;

      if (this.roleID == 3) {
        obj1["KEY"] = "WORLD_COUNCIL";

      } else {
        obj1["KEY"] = "FEDERATION";
      }

      this.api.assignFederationBOD(obj1).subscribe(successCode => {
        if (successCode['code'] == 200) {
          this.message.success("Memeber Added Successfully", "");
          this.search(true, this.BOD_Position, this.data["FEDERATION_ID"]);
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

  formTitle = "Manage Federations";
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  loadingRecords = true;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  columns: string[][] = [["START_DATE", "Start Date"], ["END_DATE", "End Date"], ["MEMBER_NAME", "Name"], ["MOBILE_NUMBER", "Mobile No."], ["FEDERATION_NAME", "Federation"], ["BOD_POSITION_ID", "Position"]];
  drawerTitle: string;
  drawerData: FederationMaster = new FederationMaster();

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true, this.BOD_Position, this.data["FEDERATION_ID"]);
  }

  search(reset: boolean = false, BOD_Position: any, federationID: any) {
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

    this.api.getFederationBOD(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + " AND BOD_POSITION_ID=" + BOD_Position + " AND FEDERATION_ID=" + federationID).subscribe(data => {
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
      role = "IPP";
    else if (data["BOD_POSITION_ID"] == 3)
      role = "VP1";
    else if (data["BOD_POSITION_ID"] == 4)
      role = "VP2";
    else if (data["BOD_POSITION_ID"] == 5)
      role = "VP3";
    else if (data["BOD_POSITION_ID"] == 6)
      role = "SECRETARY";
    else if (data["BOD_POSITION_ID"] == 7)
      role = "CO SECRETARY";
    else if (data["BOD_POSITION_ID"] == 8)
      role = "TREASURER";
    else if (data["BOD_POSITION_ID"] == 9)
      role = "PRO1";
    else if (data["BOD_POSITION_ID"] == 10)
      role = "PRO2";
    else if (data["BOD_POSITION_ID"] == 11)
      role = "CO ORDINATOR";
    else if (data["BOD_POSITION_ID"] == 12)
      role = "SPECIAL OFFICER 1";
    else if (data["BOD_POSITION_ID"] == 13)
      role = "SPECIAL OFFICER 2";
    else if (data["BOD_POSITION_ID"] == 14)
      role = "SPECIAL OFFICER 3";
    else if (data["BOD_POSITION_ID"] == 15)
      role = "SPECIAL OFFICER 4";
    else if (data["BOD_POSITION_ID"] == 16)
      role = "FEDERATION OFFICER 1";
    else if (data["BOD_POSITION_ID"] == 17)
      role = "FEDERATION OFFICER 2";
    else if (data["BOD_POSITION_ID"] == 18)
      role = "FEDERATION OFFICER 3";
    else if (data["BOD_POSITION_ID"] == 19)
      role = "FEDERATION OFFICER 4";
    else if (data["BOD_POSITION_ID"] == 20)
      role = "FEDERATION OFFICER 5";
    else if (data["BOD_POSITION_ID"] == 21)
      role = "FEDERATION OFFICER 6";
    else if (data["BOD_POSITION_ID"] == 22)
      role = "FEDERATION OFFICER 7";
    else if (data["BOD_POSITION_ID"] == 23)
      role = "FEDERATION OFFICER 8";
    else if (data["BOD_POSITION_ID"] == 24)
      role = "FEDERATION OFFICER 9";
    else if (data["BOD_POSITION_ID"] == 25)
      role = "FEDERATION OFFICER 10";
    else if (data["BOD_POSITION_ID"] == 26)
      role = "FEDERATION OFFICER 11";
    else if (data["BOD_POSITION_ID"] == 27)
      role = "FEDERATION OFFICER 12";
    else if (data["BOD_POSITION_ID"] == 28)
      role = "FEDERATION OFFICER 13";
    else if (data["BOD_POSITION_ID"] == 29)
      role = "FEDERATION OFFICER 14";
    else if (data["BOD_POSITION_ID"] == 30)
      role = "FEDERATION OFFICER 15";

    data["ROLE_NAME"] = role + " " + data["FEDERATION_NAME"];

    this.api.updateFederationBOD(data).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Status Updated Successfully", "");
        this.search(false, this.BOD_Position, this.data["FEDERATION_ID"]);

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
      role = "President";
    else if (data["BOD_POSITION_ID"] == 2)
      role = "IPP";
    else if (data["BOD_POSITION_ID"] == 3)
      role = "Vice Precident 1";
    else if (data["BOD_POSITION_ID"] == 4)
      role = "Vice Precident 2";
    else if (data["BOD_POSITION_ID"] == 5)
      role = "Vice Precident 3";
    else if (data["BOD_POSITION_ID"] == 6)
      role = "Secretary";
    else if (data["BOD_POSITION_ID"] == 7)
      role = "Co Secretary";
    else if (data["BOD_POSITION_ID"] == 8)
      role = "Treasurer";
    else if (data["BOD_POSITION_ID"] == 9)
      role = "PRO 1";
    else if (data["BOD_POSITION_ID"] == 10)
      role = "PRO 2";
    else if (data["BOD_POSITION_ID"] == 11)
      role = "Co Ordinator";
    else if (data["BOD_POSITION_ID"] == 12)
      role = "Special Officer 1";
    else if (data["BOD_POSITION_ID"] == 13)
      role = "Special Officer 2";
    else if (data["BOD_POSITION_ID"] == 14)
      role = "Special Officer 3";
    else if (data["BOD_POSITION_ID"] == 15)
      role = "Special Officer 4";
    else if (data["BOD_POSITION_ID"] == 15)
      role = "SPECIAL OFFICER 4";
    else if (data["BOD_POSITION_ID"] == 16)
      role = "FEDERATION OFFICER 1";
    else if (data["BOD_POSITION_ID"] == 17)
      role = "FEDERATION OFFICER 2";
    else if (data["BOD_POSITION_ID"] == 18)
      role = "FEDERATION OFFICER 3";
    else if (data["BOD_POSITION_ID"] == 19)
      role = "FEDERATION OFFICER 4";
    else if (data["BOD_POSITION_ID"] == 20)
      role = "FEDERATION OFFICER 5";
    else if (data["BOD_POSITION_ID"] == 21)
      role = "FEDERATION OFFICER 6";
    else if (data["BOD_POSITION_ID"] == 22)
      role = "FEDERATION OFFICER 7";
    else if (data["BOD_POSITION_ID"] == 23)
      role = "FEDERATION OFFICER 8";
    else if (data["BOD_POSITION_ID"] == 24)
      role = "FEDERATION OFFICER 9";
    else if (data["BOD_POSITION_ID"] == 25)
      role = "FEDERATION OFFICER 10";
    else if (data["BOD_POSITION_ID"] == 26)
      role = "FEDERATION OFFICER 11";
    else if (data["BOD_POSITION_ID"] == 27)
      role = "FEDERATION OFFICER 12";
    else if (data["BOD_POSITION_ID"] == 28)
      role = "FEDERATION OFFICER 13";
    else if (data["BOD_POSITION_ID"] == 29)
      role = "FEDERATION OFFICER 14";
    else if (data["BOD_POSITION_ID"] == 30)
      role = "FEDERATION OFFICER 15";

    data["ROLE_NAME"] = role + " " + data["FEDERATION_NAME"];

    this.api.updateFederationBOD(data).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Active Status Updated Successfully", "");
        this.search(false, this.BOD_Position, this.data["FEDERATION_ID"]);

      } else {
        this.message.error("Failed to Update Active Status", "");
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getBODPositionIDFullForm(BODPositionID: number) {
    if (BODPositionID == 1)
      return "President";
    else if (BODPositionID == 2)
      return "IPP";
    else if (BODPositionID == 3)
      return "Vice President 1";
    else if (BODPositionID == 4)
      return "Vice President 2";
    else if (BODPositionID == 5)
      return "Vice President 3";
    else if (BODPositionID == 6)
      return "Secretary";
    else if (BODPositionID == 7)
      return "Co Secretary";
    else if (BODPositionID == 8)
      return "Treasurer";
    else if (BODPositionID == 9)
      return "PRO 1";
    else if (BODPositionID == 10)
      return "PRO 2";
    else if (BODPositionID == 11)
      return "Co Ordinator";
    else if (BODPositionID == 12)
      return "Special Officer 1";
    else if (BODPositionID == 13)
      return "Special Officer 2";
    else if (BODPositionID == 14)
      return "Special Officer 3";
    else if (BODPositionID == 15)
      return "Special Officer 4";
  }

  enableOrDisableStatusWise(status) {
    if ((status == "P") && ((this.roleID == 3) || (this.roleID == 59) || (this.roleID == 60) || (this.roleID == 61) || (this.federationID != 0)))
      return false;
    else
      return true;
  }

  enableOrDisableActiveStatusWise(status) {
    if ((status == "A") && ((this.roleID == 3) || (this.roleID == 59) || (this.roleID == 60) || (this.roleID == 61) || (this.federationID != 0)))
      return false;
    else
      return true;
  }

  bioDataURL: string = "";
  existingProfilePhotoURL: string = "";
  tempMemebrData: Membermaster = new Membermaster();
  bioDataYesNo: boolean = false;
  profilePhotoYesNo: boolean = false;
  folderName = "biodataUrl";
  pdfFileURL1: any = null;
  pdf1Str: string;

  getMemberData(memberID: number) {
    this.pdfFileURL1 = null;
    this.bioDataURL = "";

    this.api.getAllMembers(0, 0, "", "", " AND ID=" + memberID).subscribe(data => {
      if ((data['code'] == 200) && (data['data'].length > 0)) {
        console.log(data['data']);
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
    this.api.deleteFederationBOD(data["ID"]).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Council Member Deleted Successfully", "");
        this.search(false, this.BOD_Position, this.data["FEDERATION_ID"]);

      } else {
        this.message.error("Failed to Deletion", "");
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }
}