import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { UnitMaster } from 'src/app/Models/UnitMaster';
import { ApiService } from 'src/app/Service/api.service';
import { NgForm } from '@angular/forms';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-manage-unit-members',
  templateUrl: './manage-unit-members.component.html',
  styleUrls: ['./manage-unit-members.component.css']
})

export class ManageUnitMembersComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: UnitMaster;
  @Input() BOD_Position: any;
  @Input() dataList: any[] = [];
  @Input() drawerVisible: boolean;
  @Input() memberDrawerRoleName: string;
  isSpinning: boolean = false;
  namePattern = "([A-Za-z0-9 \s]){1,}";
  roleID = this.api.roleId;
  federationID: number;
  unitID: number;
  groupID: number;

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() { }

  onComponentInitialized(): void {
    this.getIDs();
    // this.getMembers();
  }

  getIDs() {
    this.federationID = Number(this._cookie.get("FEDERATION_ID"));
    this.unitID = Number(this._cookie.get("UNIT_ID"));
    this.groupID = Number(this._cookie.get("GROUP_ID"));
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
    this.members = [];
    let currentYear = new Date().getFullYear();
    this.START_DATE = this.datePipe.transform(new Date(currentYear, 0, 1), "yyyy-MM-dd");
    this.END_DATE = this.datePipe.transform(new Date(currentYear, 11, 31), "yyyy-MM-dd");
  }

  handleCancel(): void {
    this.isConfirmLoading = false;
    this.isVisible = false;
    this.NEW_MEMBER_ID = undefined;
    this.START_DATE = undefined;
    this.END_DATE = undefined;
    this.search(true, this.BOD_Position, this.data["UNIT_ID"]);
  }

  members: any[] = [];
  memberLoading: boolean = false;

  getMembers(unitID: number) {
    this.memberLoading = true;

    this.api.getAllMembers(0, 0, "NAME", "asc", " AND UNIT_ID=" + unitID).subscribe(data => {
      if (data['code'] == 200) {
        this.memberLoading = false;
        this.members = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getFederationWiseMembers(memberName: string): void {
    let unitFilter = " AND UNIT_ID=" + this.data["UNIT_ID"];

    if (memberName.length >= 3) {
      this.memberLoading = true;

      this.api.getAllMembers(0, 0, "NAME", "asc", " AND NAME LIKE '%" + memberName + "%'" + unitFilter).subscribe(data => {
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

      var obj1 = new Object();
      obj1["UNIT_ID"] = this.data["UNIT_ID"];
      obj1["BOD_POSITION_ID"] = this.BOD_Position;
      obj1["MEMBER_ID"] = this.NEW_MEMBER_ID;
      obj1["START_DATE"] = this.datePipe.transform(this.START_DATE, "yyyy-MM-dd");
      obj1["END_DATE"] = this.datePipe.transform(this.END_DATE, "yyyy-MM-dd");
      obj1["APPLIED_BY_ID"] = this.api.userId;

      if (this.roleID == 3)
        obj1["KEY"] = "WORLD_COUNCIL";

      else
        obj1["KEY"] = "FEDERATION";

      this.api.assignUnitBOD(obj1).subscribe(successCode => {
        if (successCode['code'] == 200) {
          this.message.success("Memeber Added Successfully", "");
          this.search(true, this.BOD_Position, this.data["UNIT_ID"]);
          this.isVisible = false;
          this.isConfirmLoading = false;
          this.NEW_MEMBER_ID = undefined;
          this.START_DATE = undefined;
          this.END_DATE = undefined;

        } else {
          this.isConfirmLoading = false;
          this.NEW_MEMBER_ID = undefined;
          this.START_DATE = undefined;
          this.END_DATE = undefined;
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
  columns: string[][] = [["START_DATE", "Start Date"], ["END_DATE", "End Date"], ["MEMBER_NAME", "Name"], ["MOBILE_NUMBER", "Mobile No."], ["UNIT_NAME", "Unit"], ["BOD_POSITION_ID", "Position"]];
  drawerTitle: string;
  drawerData: UnitMaster = new UnitMaster();

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true, this.BOD_Position, this.data["UNIT_ID"]);
  }

  search(reset: boolean = false, BOD_Position: any, unitID: any) {
    if (reset) {
      this.pageIndex = 1;
    }

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

    this.loadingRecords = true;

    this.api.getUnitBOD(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + " AND BOD_POSITION_ID=" + BOD_Position + " AND UNIT_ID=" + unitID).subscribe(data => {
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
      role = "DIRECTOR";

    else if (data["BOD_POSITION_ID"] == 2)
      role = "OFFICER 1";

    else if (data["BOD_POSITION_ID"] == 3)
      role = "OFFICER 2";

    else if (data["BOD_POSITION_ID"] == 4)
      role = "VICE PRECIDENT";

    data["ROLE_NAME"] = role + " " + data["UNIT_NAME"];

    this.api.updateUnitBOD(data).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Status Updated Successfully", "");
        this.search(false, this.BOD_Position, this.data["UNIT_ID"]);

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
      role = "DIRECTOR";

    else if (data["BOD_POSITION_ID"] == 2)
      role = "OFFICER 1";

    else if (data["BOD_POSITION_ID"] == 3)
      role = "OFFICER 2";

    else if (data["BOD_POSITION_ID"] == 4)
      role = "VICE PRECIDENT";

    data["ROLE_NAME"] = role + " " + data["FEDERATION_NAME"];

    this.api.updateUnitBOD(data).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Active Status Updated Successfully", "");
        this.search(false, this.BOD_Position, this.data["UNIT_ID"]);

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
      return "Director";

    else if (BODPositionID == 2)
      return "Officer 1";

    else if (BODPositionID == 3)
      return "Officer 2";

    else if (BODPositionID == 4)
      return "Vice President";
  }

  enableOrDisableStatusWise(status) {
    if ((status == "P") && ((this.roleID == 3) || (this.federationID != 0)))
      return false;

    else
      return true;
  }

  enableOrDisableActiveStatusWise(status) {
    if ((status == "A") && ((this.roleID == 3) || (this.federationID != 0)))
      return false;

    else
      return true;
  }

  onDeleteBtnClick(data: any) {
    this.api.deleteUnitBOD(data["ID"]).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("BOD Member Deleted Successfully", "");
        this.search(false, this.BOD_Position, this.data["UNIT_ID"]);

      } else {
        this.message.error("Failed to Deletion", "");
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }
}