import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { ApiService } from 'src/app/Service/api.service';
import { PaymentCollection } from 'src/app/Models/PaymentCollection';
import { NgForm } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { PaymentCollectionDetails } from 'src/app/Models/PaymentCollectionDetails';
import { PaymentdetailsComponent } from '../paymentdetails/paymentdetails.component';

@Component({
  selector: 'app-addpayment',
  templateUrl: './addpayment.component.html',
  styleUrls: ['./addpayment.component.css']
})

export class AddpaymentComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: PaymentCollection = new PaymentCollection();
  @Input() drawerVisible: boolean = false;
  drawerVisible2!: boolean;
  drawerTitle2!: string;
  drawerData2: PaymentCollectionDetails = new PaymentCollectionDetails();
  isSpinning: boolean = false;
  isOk: boolean = true;
  posnopatt = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/
  emailpattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  namepatt = /^[a-zA-Z \-\']+/
  mobpattern = /^[6-9]\d{9}$/
  today = new Date();
  START_TIME: any = null;
  END_TIME: any = null;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);

  federationID = sessionStorage.getItem("FEDERATION_ID");
  unitID = sessionStorage.getItem("UNIT_ID");
  groupID = sessionStorage.getItem("HOME_GROUP_ID");

  roleID: number = this.api.roleId;
  userId: number = Number(this._cookie.get('userId'));
  @Input() sum = 0;
  @Input() groupIDForPayment: number;
  memberPaymentDetails: any[] = [];
  fileURL: any;
  dataListForAmount: any[] = [];
  @Input() sumZero = 0;
  PAYMENT_MODE_TYPE: string = "ONL";
  @Input() currentGroupDetails: any[] = [];

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) > 0;

  ngOnInit() { }

  save(addNew: boolean, myForm: NgForm): void {
    this.isOk = true;
    this.isSpinning = false;

    if ((this.data.DATE == undefined) || (this.data.DATE == null) || (this.data.DATE == '')) {
      this.isOk = false;
      this.message.error('Please Select Date', '');
    }

    if ((this.data.AMOUNT == undefined) || (this.data.AMOUNT == null) || (this.data.AMOUNT == 0)) {
      this.isOk = false;
      this.message.error("Please Enter the Amount", "");
    }

    // if ((this.data.PAYMENT_TYPE == undefined) || (this.data.PAYMENT_TYPE == null) || (this.data.PAYMENT_TYPE == '')) {
    //   this.isOk = false;
    //   this.message.error('Please Enter Payment Type', '');
    // }

    if (this.PAYMENT_MODE_TYPE == "OFFL") {
      if ((this.data.PAYMENT_MODE == undefined) || (this.data.PAYMENT_MODE == null) || (this.data.PAYMENT_MODE == '')) {
        this.isOk = false;
        this.message.error('Please Select Payment Mode', '');
      }
    }

    if (this.PAYMENT_MODE_TYPE == "OFFL") {
      if ((this.data.PAYMENT_REFERENCE_NO == undefined) || (this.data.PAYMENT_REFERENCE_NO == null) || (this.data.PAYMENT_REFERENCE_NO == '')) {
        this.isOk = false;
        this.message.error('Please Enter Payment Reference No.', '');
      }
    }

    if (this.PAYMENT_MODE_TYPE == "OFFL") {
      if ((this.data.FILE_URL == undefined) || (this.data.FILE_URL == null) || (this.data.FILE_URL == '') || (this.data.FILE_URL == ' ')) {
        this.isOk = false;
        this.message.error('Please Upload Transaction Receipt', '');
      }
    }

    if ((this.data.NARRATION == undefined) || (this.data.NARRATION == null) || (this.data.NARRATION == '')) {
      this.isOk = false;
      this.message.error('Please Enter Valid Narration', '');
    }

    if (this.isOk) {
      this.isSpinning = true;
      this.data.PAYMENT_DETAILS = this.memberPaymentDetails;
      this.data.MEMBER_ID = this.userId;
      this.data.GROUP_ID = this.groupIDForPayment;

      if ((this.data.CHILD_GROUP_ID == undefined) || (this.data.CHILD_GROUP_ID == null)) {
        this.data.CHILD_GROUP_ID = 0;
        this.data.CHILD_GROUP_AMOUNT = 0;
      }

      if (this.fileURL != null) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL.name.split('.').pop();
        var d = this.datePipe.transform(new Date(), 'yyyyMMdd');
        var url = '';
        url = (d == null) ? '' : (d + number + '.' + fileExt);

        if ((this.data.FILE_URL != undefined) && (this.data.FILE_URL.trim() != '')) {
          var arr = this.data.FILE_URL.split('/');

          if (arr.length > 1) {
            url = arr[5];
          }
        }

        this.data.FILE_URL = url;

        this.api.createdocumentsDetails('paymentFile', this.fileURL, url).subscribe(res => {
          if (res["code"] == 200) {
            // this.message.success('Information Updated Successfully', '');
            // this.isSpinning = false;

          } else {
            // this.message.error('Information Not Saved', '');
            // this.isSpinning = false;
          }
        });

      } else {
        this.data.FILE_URL = "";
      }

      this.data.DATE = this.datePipe.transform(this.data.DATE, "yyyy-MM-dd");

      if (this.PAYMENT_MODE_TYPE == "ONL") {
        this.data.PAYMENT_TRANSACTION_MODE = "ONL";
        this.data.RECEIVED_STATUS = "A";

      } else if (this.PAYMENT_MODE_TYPE == "OFFL") {
        this.data.PAYMENT_TRANSACTION_MODE = "OFFL";
        this.data.RECEIVED_STATUS = "P";
      }

      if (this.data.ID) {
        this.api.updateMembersPayment(this.data).subscribe(successCode => {
          if (successCode["code"] == 200) {
            this.message.success("Payment Updated Successfully", "");
            this.isSpinning = false;

            if (!addNew) {
              this.close(myForm);
            }

          } else {
            this.message.error("Payment Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.api.createMembersPayment(this.data).subscribe(successCode => {
          if (successCode["code"] == 200) {
            this.message.success("Payment Generated Successfully", "");
            this.isSpinning = false;

            if (!addNew) {
              this.close(myForm);

            } else {
              this.data = new PaymentCollection();
            }

          } else {
            this.message.error("Payment Generation Failed", "");
            this.isSpinning = false;
          }
        });
      }
    }
  }

  dataList: any[] = [];
  totalRecords: number = 1;
  loadingRecords: boolean = true;
  @ViewChild(PaymentdetailsComponent, { static: false }) PaymentdetailsComponentVar: PaymentdetailsComponent;

  add(): void {
    this.drawerTitle2 = "aaa " + "Payment Details";
    this.drawerData2 = new PaymentCollectionDetails();
    this.sum = 0;
    this.drawerVisible2 = true;
    this.loadingRecords = true;
    this.PaymentdetailsComponentVar.SEARCH_NAME = "";
    this.PaymentdetailsComponentVar.AMOUNT_FOR_ALL = undefined;

    if (this.sum == 0) {
      let activeStatusFilter = "";

      if (this.currentGroupDetails["GROUP_STATUS"] == "A") {
        activeStatusFilter = " AND ACTIVE_STATUS='A'";
      }

      this.api.getAllMembers(0, 0, "NAME", "asc", activeStatusFilter + " AND GROUP_ID=" + this.groupIDForPayment).subscribe(data => {
        if (data['code'] == 200) {
          this.totalRecords = data['count'];
          this.dataListForAmount = [];
          this.dataList = data['data'];

          let amtToPay = 0;

          for (var i = 0; i < this.dataList.length; i++) {
            this.dataListForAmount.push({
              ID: this.dataList[i]['ID'],
              NAME: this.dataList[i]['NAME'],
              FEE: this.dataList[i]['FEE'],
              PAID: this.dataList[i]['PAYMENT_COLLETED'],
              DUE_AMOUNT: this.dataList[i]['DUE_AMOUNT'],
              AMOUNT: this.dataList[i]['DUE_AMOUNT'],
              IS_NCF: this.dataList[i]['IS_NCF']
            });

            amtToPay = amtToPay + this.dataList[i]['DUE_AMOUNT'];

            if ((i + 1) == this.dataList.length) {
              this.loadingRecords = false;
              this.dataListForAmount = [...[], ...this.dataListForAmount];
              this.sum = amtToPay;
            }
          }
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });

    } else {
      this.dataListForAmount = [];
      this.drawerVisible2 = true;
      this.loadingRecords = false;
    }
  }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  drawerClose2(): void {
    this.drawerVisible2 = false;
  }

  get closeCallback2() {
    return this.drawerClose2.bind(this);
  }

  sentAmount(event: any) {
    this.sum = (event);
    this.data.AMOUNT = this.sum;
    this.CHILD_PARENT_GROUP_AMOUNT = this.data.CHILD_GROUP_AMOUNT + (this.data.AMOUNT ? this.data.AMOUNT : 0);
  }

  sentAllData(event: any) {
    this.memberPaymentDetails = (event);
    console.log(this.memberPaymentDetails);
  }

  fileURLToDisplay: any;
  displayUploadFile: boolean = false;

  onFileSelected(event: any) {
    if (
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'image/png' ||
      event.target.files[0].type == 'application/pdf' ||
      event.target.files[0].type == 'application/doc'
    ) {
      this.fileURL = <File>event.target.files[0];

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.fileURLToDisplay = reader.result as string;
        };
      }

      if ((event.target.files[0].type == 'application/pdf') || (event.target.files[0].type == 'application/doc')) {
        this.displayUploadFile = false;

      } else {
        this.displayUploadFile = true;
      }

    } else {
      this.message.error('Please select only JPEG/ JPG/ PNG /PDF file type', '');
      this.fileURL = null;
      this.data.FILE_URL = '';
    }
  }

  removeImage() {
    this.data.FILE_URL = '';
    this.fileURL = '';
  }

  payNow() {
    if (this.data.AMOUNT && this.data.AMOUNT > 0) {
      // onButtonClick("donate", this.data.AMOUNT);
      this.message.info('Coming Soon', '');

    } else {
      // this.message.info('Please enter valid amount', '');
      this.message.info('Coming Soon', '');
    }
  }

  childGroups = [];
  CHILD_GROUP_ID: number;

  getChildGroups(parentGroupID: number) {
    this.childGroups = [];
    this.data.CHILD_GROUP_ID = undefined;

    this.api.getAllGroups(0, 0, "NAME", "asc", " AND STATUS=1 AND PARENT_GROUP_ID=" + parentGroupID).subscribe(data => {
      if (data['code'] == 200) {
        this.childGroups = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  onChildGroupChange(childGroupID: number) {
    if (childGroupID == null) {
      this.data.CHILD_GROUP_AMOUNT = 0;

    } else {
      this.data.CHILD_GROUP_AMOUNT = 250;
    }

    this.CHILD_PARENT_GROUP_AMOUNT = this.data.CHILD_GROUP_AMOUNT + (this.data.AMOUNT ? this.data.AMOUNT : 0);
  }

  CHILD_PARENT_GROUP_AMOUNT: number;
}
