import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-memberspaymentdetails',
  templateUrl: './memberspaymentdetails.component.html',
  styleUrls: ['./memberspaymentdetails.component.css']
})

export class MemberspaymentdetailsComponent implements OnInit {
  @Input() drawerClose4!: Function;
  @Input() drawerVisible4: boolean = false;
  @Input() paymentCollectionID: number;
  @Input() paymentDataId: any = [];
  pageIndex = 1;
  pageSize = 10;
  totalRecords = 1;
  totalRecords2 = 1;
  dataList = [];
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  isFilterApplied: string = "default";
  scheduleId = 0;
  empId = 0;
  drawerVisible!: boolean;
  drawerTitle!: string;
  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));
  roleID: number = this.api.roleId;
  currentDate = new Date();
  isSpinning: boolean = false;

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() { }

  viewDetails(): void {
    console.log("paymentCollectionID" + this.paymentCollectionID);
  }

  get closeCallback() {
    return this.drawerClose4.bind(this);
  }

  close(myForm: NgForm): void {
    this.drawerClose4();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }
}
