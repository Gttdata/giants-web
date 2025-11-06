import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { Membermaster } from 'src/app/Models/MemberMaster';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-member-payment-drawer',
  templateUrl: './member-payment-drawer.component.html',
  styleUrls: ['./member-payment-drawer.component.css']
})

export class MemberPaymentDrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Membermaster;
  @Input() drawerVisible: boolean;
  isSpinning: boolean = false;
  leaveTypes = [];
  namePattern = "([A-Za-z0-9 \s]){1,}";
  emailpattern =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  mobpattern = /^[6-9]\d{9}$/;
  formTitle = "Manage Members";
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  dataList = [];
  loadingRecords: boolean = true;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  columns: string[][] = [["DATE", "Date"], ["AMOUNT", "Amount"], ["MODE", "Mode"], ["REFERENCE_NO", "Reference/ UTR No."], ["PAYMENT_TYPE", "Payment Type"], ["DETAILS", "Details"]];
  paymentDrawerIsSpinning: boolean = false;

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.search(true);
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true);
  }

  search(reset: boolean = false) {
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

    // this.loadingRecords = true;
    // this.api.getAllMembers(this.pageIndex, this.pageSize, this.sortKey, sort, likeQuery).subscribe(data => {
    //   if (data['code'] == 200) {
    //     this.loadingRecords = false;
    //     this.totalRecords = data['count'];
    //     this.dataList = data['data'];
    //   }

    // }, err => {
    //   if (err['ok'] == false)
    //     this.message.error("Server Not Found", "");
    // });

    this.loadingRecords = false;
    this.dataList = [
      { 'DATE': '2022-09-18', 'AMOUNT': '1000', 'MODE': 'Cash', 'REFERENCE_NO': '', 'PAYMENT_TYPE': 'Member Fee', 'DETAILS': '' },
      { 'DATE': '2022-09-16', 'AMOUNT': '2000', 'MODE': 'Cheque', 'REFERENCE_NO': '2445689907866944', 'PAYMENT_TYPE': 'Donation', 'DETAILS': 'Donation' },
      { 'DATE': '2022-09-16', 'AMOUNT': '3000', 'MODE': 'NEFT', 'REFERENCE_NO': '265809675765', 'PAYMENT_TYPE': 'Donation', 'DETAILS': 'Donation' },
      { 'DATE': '2022-09-15', 'AMOUNT': '4000', 'MODE': 'UPI', 'REFERENCE_NO': '34779809756342', 'PAYMENT_TYPE': 'Member Fee', 'DETAILS': '' },
    ]
  }

  paymentDrawerVisible: boolean;
  paymentDrawerTitle: string;
  paymentDrawerData: Membermaster = new Membermaster();

  add(): void {
    this.paymentDrawerTitle = "Add Member";
    this.paymentDrawerData = new Membermaster();
    this.drawerVisible = true;
    this.paymentDrawerData.MEMBERSHIP_DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");

    let expiryDate = new Date().setFullYear(new Date().getFullYear() + 1);
    this.paymentDrawerData.EXPIRY_DATE = this.datePipe.transform(expiryDate, "yyyy-MM-dd");
  }

  // @ViewChild(MemberDrawerComponent, { static: false }) MemberDrawerComponentVar: MemberDrawerComponent;

  edit(data: Membermaster): void {
    // this.drawerTitle = "Update Member Details";
    // this.drawerData = Object.assign({}, data);
    // this.drawerVisible = true;

    // let inchargeStringArray = [];
    // if ((data.INCHARGE_OF != undefined) && (data.INCHARGE_OF != null)) {
    //   inchargeStringArray = data.INCHARGE_OF.split(',');
    // }

    // let inchargeArray = [];
    // for (var i = 0; i < inchargeStringArray.length; i++) {
    //   inchargeArray.push(Number(inchargeStringArray[i]));
    // }

    // this.drawerData.INCHARGE_OF = inchargeArray;

    // // Get Units and Groups
    // this.MemberDrawerComponentVar.getUnits(data.FEDERATION_ID);
    // this.MemberDrawerComponentVar.getGroups(data.UNIT_ID);
  }

  paymentDrawerClose(): void {
    this.search(true);
    this.drawerVisible = false;
  }

  get closeCallback() {
    return this.drawerClose.bind(this);
  }

  onSearching() {
    document.getElementById("button1").focus();
    this.search(true);
  }

  getGenderFullForm(gender) {
    if (gender == "M")
      return "Male";

    else if (gender == "F")
      return "Female";

    else if (gender == "O")
      return "Other";
  }

  close(): void {
    this.drawerClose();
  }
}
