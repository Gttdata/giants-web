import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-payment-detail-count',
  templateUrl: './payment-detail-count.component.html',
  styleUrls: ['./payment-detail-count.component.css']
})
export class PaymentDetailCountComponent implements OnInit {
  // @Input() data_post: REPORTSCHEDULE;
  @Input() DetailCount = [];
  @Input() closePayCountDrawer: Function;
  @Input() drawerVisible: boolean;
  @Input() data_List:any[] = [];
  @Input() totalRecords: number;
  constructor(public api: ApiService, private message: NzNotificationService) { }

  ngOnInit() {
  }

  pageIndex=1
  // DetailCount=[];
  pageSize=10
  loadingRecords=false;
  // getCountDetails(){
  //   this.api.getPaymentDetailCount(this.pageIndex, this.pageSize, "", "asc", "").subscribe(data => {
  //     if ((data['code'] == 200)) {
  //       this.DetailCount = data['data'];
  //       this.loadingRecords = false;
  //     } else {
  //       this.message.error("Server Not Found", "");
  //     }
  //   }, err => {
  //     if (err['ok'] == false)
  //       this.message.error("Server Not Found", "");
  //   });
  // }
  getUserPhoto(photoURL: string) {
    if (photoURL == " ") {
      return "assets/anony.png";

    } else {
      return this.api.retriveimgUrl + "profileImage/" + photoURL;
    }
  }
}
