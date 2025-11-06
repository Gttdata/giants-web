import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { GroupMaster } from 'src/app/Models/GroupMaster';
import { ApiService } from 'src/app/Service/api.service';
import { AssignGroupMemberComponent } from '../GroupMaster/assign-group-member/assign-group-member.component';

@Component({
  selector: 'app-approve-group',
  templateUrl: './approve-group.component.html',
  styleUrls: ['./approve-group.component.css']
})

export class ApproveGroupComponent implements OnInit {
  formTitle: string = "Group Approval";
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  dataList: any[] = [];
  loadingRecords: boolean = true;
  sortKey: string = "ID";
  sortValue: string = "desc";
  searchText: string = "";
  filterQuery: string = "";
  columns: string[][] = [["FEDERATION_NAME", "Federation"], ["UNIT_NAME", "Unit"], ["NAME", "Group"], ["STATUS", "Active"]];
  drawerVisible: boolean = false;
  drawerTitle: string;
  drawerData: GroupMaster = new GroupMaster();
  isSpinning: boolean = false;
  emitted = false;
  filter = '';
  private categoriesSubject = new BehaviorSubject<Array<string>>([]);
  categories$ = this.categoriesSubject.asObservable();

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  constructor(private router: Router, private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  @HostListener('document:touchmove', ['$event'])
  @HostListener('document:wheel', ['$event'])

  onScroll(e: any) {
    if ((document.getElementById("activityItem").scrollTop + document.getElementById("activityItem").offsetHeight) >= document.getElementById("activityItem").scrollHeight && !this.emitted) {
      this.emitted = true;
      this.onScrollingFinished();

    } else if ((document.getElementById("activityItem").scrollTop + document.getElementById("activityItem").offsetHeight) < document.getElementById("activityItem").scrollHeight) {
      this.emitted = false;
    }
  }

  onScrollingFinished(): void {
    this.loadMore();
  }

  loadMore(): void {
    if (this.getNextItems()) {
      this.categoriesSubject.next(this.dataList);
    }
  }

  getNextItems(): boolean {
    if (this.dataList.length >= this.totalRecords) {
      return false;
    }

    this.search(false, true);
    return true;
  }

  ngOnInit() {
    this.search(true);
  }

  search(reset: boolean = false, loadMore: boolean = false): void {
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

    this.api.getAllGroupsTilesDetails(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery + " AND GROUP_STATUS='SFA'").subscribe(data => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.totalRecords = data['count'];

        if (loadMore) {
          this.dataList.push(...data['data']);

        } else {
          this.dataList = data['data'];
        }

        this.pageIndex++;
      }

    }, err => {
      this.loadingRecords = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  memberDrawerTitle: string;
  memberDrawerData: any;
  memberDrawerVisible: boolean = false;
  @ViewChild(AssignGroupMemberComponent, { static: false }) AssignGroupMemberComponentVar: AssignGroupMemberComponent;

  addMembers(data: GroupMaster): void {
    this.memberDrawerTitle = "aaa " + "Add BOD Member";
    this.memberDrawerData = Object.assign({}, data);
    this.memberDrawerVisible = true;
    this.AssignGroupMemberComponentVar.getData1(data);
  }

  memberDrawerClose(): void {
    this.memberDrawerVisible = false;
    this.search(true);
  }

  get memberDrawerCloseCallback() {
    return this.memberDrawerClose.bind(this);
  }

  getWidth(): number {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 1100;
  }

  isVisible: boolean = false;
  isConfirmLoading: boolean = false;
  modalTitle: string = "";
  STATUS: string = "A";
  REMARK: string = "";
  MEMBER_REMARK: string = "";
  PAYMENT_REMARK: string = "";
  BOD_REMARK: string = "";
  tempGroup: GroupMaster = new GroupMaster();

  showModal(group: GroupMaster): void {
    this.isVisible = true;
    this.isConfirmLoading = false;
    this.modalTitle = group.NAME;
    this.STATUS = "A";
    this.REMARK = undefined;
    this.MEMBER_REMARK = undefined;
    this.PAYMENT_REMARK = undefined;
    this.BOD_REMARK = undefined;
    this.tempGroup = group;
  }

  handleCancel(): void {
    this.isConfirmLoading = false;
    this.isVisible = false;
  }

  handleOk(): void {
    var isOK = true;

    if ((this.STATUS == undefined) || (this.STATUS == null)) {
      isOK = false;
      this.message.error("Please Select Valid Status", "");
    }

    if ((this.REMARK != undefined) && (this.REMARK != null)) {
      if (this.REMARK.trim() == '') {
        isOK = false;
        this.message.error("Please Enter Valid Remark", "");
      }

    } else {
      isOK = false;
      this.message.error("Please Enter Valid Remark", "");
    }

    if (this.STATUS == 'CA') {
      if ((this.MEMBER_REMARK != undefined) && (this.MEMBER_REMARK != null)) {
        if (this.MEMBER_REMARK.trim() == '') {
          isOK = false;
          this.message.error("Please Enter Valid Member Remark", "");
        }

      } else {
        isOK = false;
        this.message.error("Please Enter Valid Member Remark", "");
      }

      if ((this.PAYMENT_REMARK != undefined) && (this.PAYMENT_REMARK != null)) {
        if (this.PAYMENT_REMARK.trim() == '') {
          isOK = false;
          this.message.error("Please Enter Valid Payment Remark", "");
        }

      } else {
        isOK = false;
        this.message.error("Please Enter Valid Payment Remark", "");
      }

      if ((this.BOD_REMARK != undefined) && (this.BOD_REMARK != null)) {
        if (this.BOD_REMARK.trim() == '') {
          isOK = false;
          this.message.error("Please Enter Valid BOD Remark", "");
        }

      } else {
        isOK = false;
        this.message.error("Please Enter Valid BOD Remark", "");
      }

    } else {
      this.MEMBER_REMARK = "";
      this.PAYMENT_REMARK = "";
      this.BOD_REMARK = "";
    }

    if (isOK) {
      this.isConfirmLoading = true;
      this.tempGroup.GROUP_STATUS = this.STATUS;
      this.tempGroup.REMARKS = this.REMARK;
      this.tempGroup.MEMBER_REMARK = this.MEMBER_REMARK;
      this.tempGroup.PAYMENT_REMARK = this.PAYMENT_REMARK;
      this.tempGroup.BOD_REMARK = this.BOD_REMARK;

      this.api.approveGroup(this.tempGroup).subscribe(successCode => {
        if (successCode['code'] == 200) {
          this.message.success("Group Approved Successfully", "");
          this.search(true);
          this.isVisible = false;
          this.isConfirmLoading = false;

        } else {
          this.message.error("Failed to Group Approval", "");
          this.isConfirmLoading = false;
        }
      });
    }
  }

  goToPayments(group: GroupMaster): void {
    this.router.navigate(['/allpaymentreceipts', { group: group["GROUP_ID"] }]);
  }

  goToMemberMaster(group: GroupMaster): void {
    this.router.navigate(['/membermaster', { group: group["GROUP_ID"] }]);
  }
}
