import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ApiService } from 'src/app/Service/api.service';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { PaymentCollectionDetails } from 'src/app/Models/PaymentCollectionDetails';

interface ItemData {
  id: string;
  name: string;
  amount: string;
}

@Component({
  selector: 'app-paymentdetails',
  templateUrl: './paymentdetails.component.html',
  styleUrls: ['./paymentdetails.component.css']
})

export class PaymentdetailsComponent implements OnInit {
  i = 0;
  editId: string | null = null;
  listOfData: ItemData[] = [];
  @Input() drawerClose2!: Function;
  @Input() data: PaymentCollectionDetails = new PaymentCollectionDetails();
  @Input() drawerVisible2: boolean = false;
  @Input() loadingRecords: boolean = true;
  drawerData: PaymentCollectionDetails = new PaymentCollectionDetails();
  columns: string[][] = [["NAME", "Name"]];
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number = 1;
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  filterQuery: string = "";
  dataList: any[] = [];
  @Input() dataListForAmount: any[] = [];
  @Input() sum: number = 0;
  federationID: number = Number(this._cookie.get("FEDERATION_ID"));
  unitID: number = Number(this._cookie.get("UNIT_ID"));
  groupID: number = Number(this._cookie.get("GROUP_ID"));
  roleID: number = this.api.roleId;
  @Output() sumOfAmount = new EventEmitter<number>();
  @Output() memberPaymentData = new EventEmitter<any>();
  SEARCH_NAME: string;

  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
  }

  sentAmount(addNew: boolean, myForm: NgForm): void {
    var a = true;

    for (var i = 0; i < this.dataListForAmount.length; i++) {
      if ((this.dataListForAmount[i]['AMOUNT'] == null) || (Number(this.dataListForAmount[i]['AMOUNT']) > Number(this.dataListForAmount[i]['DUE_AMOUNT']))) {
        this.message.error("Please Check", " Current Pay Amount of " + this.dataListForAmount[i]['NAME']);
        a = false;
      }
    }

    if (a == true) {
      this.sumOfAmount.emit(this.sum);
      this.memberPaymentData.emit(this.dataListForAmount);
      this.close(myForm);
    }
  }

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() { }

  close(myForm: NgForm): void {
    this.drawerClose2();
  }

  drawerClose3(): void {
    this.drawerVisible2 = false;
  }

  get closeCallback2() {
    return this.drawerClose2.bind(this);
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true);
  }

  search(reset: boolean = false): void {
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

    this.api.getAllMembers(0, 0, this.sortKey, sort, " AND GROUP_ID=" + this.groupID).subscribe(data => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.totalRecords = data['count'];
        this.dataListForAmount = [];
        this.dataList = data['data'];

        for (var i = 0; i < this.dataList.length; i++) {
          this.dataListForAmount.push({
            ID: this.dataList[i]['ID'],
            NAME: this.dataList[i]['NAME'],
            FEE: this.dataList[i]['FEE'],
            PAID: this.dataList[i]['PAYMENT_COLLETED'],
            DUE_AMOUNT: this.dataList[i]['DUE_AMOUNT'],
            AMOUNT: 0,
            IS_NCF: this.dataList[i]['IS_NCF'],
          });

          if ((i + 1) == this.dataList.length) {
            this.dataListForAmount = [...[], ...this.dataListForAmount];
          }
        }
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }

  AmountSum(event: any, j: number): void {
    this.dataListForAmount[j]['AMOUNT'] = event;

    if (event != '' && this.dataListForAmount[j]['AMOUNT'] != '') {
      this.dataListForAmount[j]['AMOUNT'] = event;

      if (parseInt(this.dataListForAmount[j]['DUE_AMOUNT']) >= parseInt(this.dataListForAmount[j]['AMOUNT'])) {
        this.sum = 0;
        for (var i = 0; i < this.dataListForAmount.length; i++) {
          this.sum += Number(this.dataListForAmount[i]['AMOUNT']);
        }

      } else {
        this.dataListForAmount[j]['AMOUNT'] = 0;
        // this.message.error("Please Check", this.dataListForAmount[j]['NAME'] + "'s Paid Amount is Greater then Due Amount");
      }

    } else {
      this.dataListForAmount[j]['AMOUNT'] = 0;
    }
  }

  currentPayAmtChange(paidAmt: any, data: any): void {
    for (var i = 0; i < this.dataListForAmount.length; i++) {
      if (this.dataListForAmount[i]["ID"] == data["ID"]) {
        if (Number(paidAmt) <= Number(this.dataListForAmount[i]["DUE_AMOUNT"])) {
          this.dataListForAmount[i]["AMOUNT"] = Number(paidAmt);

        } else {
          this.dataListForAmount[i]["AMOUNT"] = "0";
          this.message.error("Please Check", data["NAME"] + "'s Paid Amount is Greater then Due Amount");
        }
      }
    }

    this.sum = 0;

    for (var i = 0; i < this.dataListForAmount.length; i++) {
      if (Number(this.dataListForAmount[i]["AMOUNT"]) <= Number(this.dataListForAmount[i]["DUE_AMOUNT"])) {
        this.sum += Number(this.dataListForAmount[i]['AMOUNT']);
      }
    }
  }

  AMOUNT_FOR_ALL: number;

  setAmount(amt: number): void {
    for (var i = 0; i < this.dataListForAmount.length; i++) {
      this.dataListForAmount[i]["AMOUNT"] = amt;
      this.AmountSum(this.dataListForAmount[i]["AMOUNT"], i);
    }

    this.sum = 0;
    for (var i = 0; i < this.dataListForAmount.length; i++) {
      if (Number(this.dataListForAmount[i]["AMOUNT"]) <= Number(this.dataListForAmount[i]["DUE_AMOUNT"])) {
        this.sum += Number(this.dataListForAmount[i]['AMOUNT']);
      }
    }
  }

  copyDueAmt(dueAmt: number, memberID: number): void {
    for (var i = 0; i < this.dataListForAmount.length; i++) {
      if (this.dataListForAmount[i]["ID"] == memberID) {
        this.dataListForAmount[i]["AMOUNT"] = dueAmt;
      }
    }

    for (var i = 0; i < this.dataListForAmount.length; i++) {
      this.AmountSum(this.dataListForAmount[i]["AMOUNT"], i);
    }
  }

  resetSearchBox(): void {
    this.SEARCH_NAME = "";
  }
}
