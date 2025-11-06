import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-view-member-payment-details',
  templateUrl: './view-member-payment-details.component.html',
  styleUrls: ['./view-member-payment-details.component.css']
})

export class ViewMemberPaymentDetailsComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() drawerVisible: boolean;
  loadingRecords: boolean = false;
  paymentData: any = [];
  TOTAL_CREDIT_AMT: number = 0;
  TOTAL_DEBIT_AMT: number = 0;
  TOTAL_PENDING_AMT: number = 0;
  columns: string[][] = [
    ["DATE", "Transaction Date"],
    ["TRANSACTION_TYPE", "Particulars"],
    ["CREDIT_AMOUNT", "CR Amount"],
    ["DEBIT_AMOUNT", "DR Amount"],
    ["PENDING", "Pending Amount"]];
  pageIndex: number = 0;
  pageSize: number = 0;

  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private datePipe: DatePipe) { }

  ngOnInit() { }

  close(): void {
    this.drawerClose();
  }

  getPaymentDetails(memberID: number) {
    this.loadingRecords = true;
    this.paymentData = [];

    this.api
      .getPaymentDetails(memberID)
      .subscribe(data => {
        if (data['code'] == 200) {
          this.loadingRecords = false;
          this.paymentData = data['data'];

          let totalCredit = 0;
          let totalDebit = 0;
          let totalPending = 0;

          for (var i = 0; i < this.paymentData.length; i++) {
            totalCredit = totalCredit + this.paymentData[i]["CREDIT_AMOUNT"];
            totalDebit = totalDebit + this.paymentData[i]["DEBIT_AMOUNT"];
            totalPending = totalPending + this.paymentData[i]["PENDING"];
          }

          this.TOTAL_CREDIT_AMT = totalCredit;
          this.TOTAL_DEBIT_AMT = totalDebit;
          this.TOTAL_PENDING_AMT = totalPending;
        }

      }, err => {
        this.loadingRecords = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }
}
