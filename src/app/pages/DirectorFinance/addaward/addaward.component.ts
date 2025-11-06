import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { Awardmaster } from 'src/app/Models/AwardMaster';
import { ApiService } from 'src/app/Service/api.service';
import { SponsorshipComponent } from '../sponsorship/sponsorship.component';
import { Sponsormaster } from 'src/app/Models/Sponsorship';
import { BehaviorSubject } from 'rxjs';
import { CompressImageService } from 'src/app/Service/image-compressor.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-addaward',
  templateUrl: './addaward.component.html',
  styleUrls: ['./addaward.component.css']
})

export class AddawardComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: Awardmaster = new Awardmaster()
  @Input() drawerVisible: boolean;
  @Input() id: number;
  @Input() drawerFinancedataArray: any[];
  @Input() data2: any = [];
  addDrawer: boolean = false;
  groupID = Number(this._cookie.get("GROUP_ID"));
  roleId = Number(this._cookie.get('roleId'));
  BUDGET = "";
  pageIndex = 1;
  pageSize = 10;
  sortKey: string = "NAME";
  sortValue: string = "ASC";
  filter = '';
  loadingRecords = true;
  dataList = [];
  numbers = new RegExp(/^[0-9]+$/);
  Yes = "1";
  No = "0";
  isSpinning: boolean = false;
  currentIndex = -1;
  drawerTitle1: string;
  PDFFILE: any;
  drawerData1: Sponsormaster = new Sponsormaster();
  drawerVisible1: boolean = false;
  private categoriesSubject = new BehaviorSubject<Array<string>>([]);
  categories$ = this.categoriesSubject.asObservable();
  totalRecords = 1;
  isOk = true;
  url1: any;
  validation = true;
  fileURL1: any = null;
  BUDGET_URL = ''
  directorOfFinanceData2 = [];

  fileURL2: any = null;
  INCOME_EXP_ACC_QTR1_URL = ''

  fileURL3: any = null;
  INCOME_EXP_ACC_QTR2_URL = ''

  fileURL4: any = null;
  INCOME_EXP_ACC_QTR3_URL = ''

  photo1Str: string;
  photo2Str: string;
  photo3Str: string;
  photo4Str: string;
  photo5Str: string;
  groups = [];
  isVisible = false;
  FetchOldData: string[];
  Jan_June: number;
  JULY_DEC: number;
  year = new Date().getFullYear();

  lastyear = new Date().getFullYear() - 1;
  Next_Year = this.year - 1;
  yearrange = [];
  SelectedYear: any;
  a = new Date();
  b = new Date(this.a.getFullYear() + 1, 3, 1);
  next_year = Number(this.year + 1)
  baseYear = 2020;
  YEAR: any
  pattern = Number("[1-8][0-9]")
  constructor(private _cookie: CookieService, private message: NzNotificationService, public api: ApiService, private datePipe: DatePipe, private compressImage: CompressImageService) { }

  ngOnInit() {
    this.getGroups();
    this.data.CREATED_DATE = new Date();
    this.YEAR = this.yearrange.toString();
    this.Fordate();
    this.abc1();
  }

  Fordate() {
    let currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= this.baseYear; i--) {
      this.yearrange.push(i);
    }
  }

  currentyear: any;

  abc1() {
    this.YEAR = new Date().getFullYear();
    this.currentyear = this.YEAR;
  }

  getGroups() {
    var groupFilter = "";
    if (this.groupID != 0) {
      groupFilter = " AND ID=" + this.groupID;
    }

    this.groups = [];

    this.api.getAllGroups(0, 0, "NAME", "asc", " AND STATUS=1" + groupFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.groups = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
    this.fileURL1 = null;
    this.data.BUDGET_URL = '';
    this.fileURL2 = null;
    this.data.INCOME_EXP_ACC_QTR1_URL = '';
    this.fileURL3 = null;
    this.data.INCOME_EXP_ACC_QTR2_URL = '';
    this.fileURL4 = null;
    this.data.INCOME_EXP_ACC_QTR3_URL = '';

  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }
  budgetAll(event) {
    this.data.IS_WORK_ON_BUDGET = event;
    if (this.data.IS_WORK_ON_BUDGET == true) {
      return this.data.BUDGET_URL
    } else if (this.data.IS_WORK_ON_BUDGET == false) {
      this.fileURL1 = null;
      this.data.BUDGET_URL = null;
    }
  }
  setUnitsAll(event) {



    this.data.IS_SUBMIT_PAST_YEAR_ACC_IN_MEETING = event;
    if (this.data.IS_SUBMIT_PAST_YEAR_ACC_IN_MEETING == true) {
      return this.data.PAST_YEAR_ACC_SUBMIT_IN_MEETING_DETAILS
    } else if (this.data.IS_SUBMIT_PAST_YEAR_ACC_IN_MEETING == false) {
      this.data.PAST_YEAR_ACC_SUBMIT_IN_MEETING_DETAILS = ""
    }
  }

  SelectAsset(event) {
    this.data.IS_AUDITED_PAST_YEAR_BALANCE_SHEET = event;
    if (this.data.IS_AUDITED_PAST_YEAR_BALANCE_SHEET == true) {
      return this.data.AUDITED_PAST_YEAR_BALANCE_SHEET_DETAILS;
    } else if (this.data.IS_AUDITED_PAST_YEAR_BALANCE_SHEET == false) {
    }
  }
  SelectAll(event) {

    this.data.IS_MAINTAINED_ASSET_REGISTER = event;
    if (this.data.IS_MAINTAINED_ASSET_REGISTER == true) {
      return this.data.ASSET_REGISTER_DETAILS
    } else if (this.data.IS_MAINTAINED_ASSET_REGISTER == false) {
      this.data.ASSET_REGISTER_DETAILS = ""
    }


  }

  pdfClear1() {
    this.fileURL1 = null;
    this.data.BUDGET_URL = null;
  }

  pdfClear2() {
    this.fileURL2 = null;
    this.data.INCOME_EXP_ACC_QTR1_URL = null;
  }
  pdfClear3() {
    this.fileURL3 = null;
    this.data.INCOME_EXP_ACC_QTR2_URL = null;
  }
  pdfClear4() {
    this.fileURL4 = null;
    this.data.INCOME_EXP_ACC_QTR3_URL = null;
  }
  IS_SUBMITED: string = "D";
  save(addNew: boolean, myForm: NgForm): void {

    this.data.MEMBER_ID = Number(this._cookie.get('userId'));
    this.data.DIR_FINANCE_SPONSORSHIP_DETAILS = this.data2;
    this.isOk = true;
    this.validation = false;

    if (this.data.MEMBER_NAME == undefined || this.data.MEMBER_NAME == null || this.data.MEMBER_NAME.trim() == '') {
      this.isOk = false;
      this.IS_SUBMITED = "D"
      this.message.error("Please Enter Valid  NAME", "");
    }
    if (this.data.DUES_PAID_DATE == undefined || this.data.DUES_PAID_DATE == null) {
      this.isOk = false;
      this.IS_SUBMITED = "D"
      this.message.error("Please Select Date", "");
    }
    else if (this.data.DUES_PAID_JAN_JUNE_DATE == undefined || this.data.DUES_PAID_JAN_JUNE_DATE == null) {
      this.isOk = false;
      this.IS_SUBMITED = "D"
      this.message.error("Please Selct January-June Date", "");
    }
    else if (this.data.DUES_PAID_JAN_JUNE_AMOUNT == undefined || this.data.DUES_PAID_JAN_JUNE_AMOUNT.toString() == '' || this.data.DUES_PAID_JAN_JUNE_AMOUNT == null) {
      this.isOk = false;
      this.IS_SUBMITED = "D"
      this.message.error("Please Enter Amount For January-June Period", "");
    }
    else if ((this.numbers.test(this.data.DUES_PAID_JAN_JUNE_AMOUNT.toString())) == false) {
      this.isOk = false;
      this.IS_SUBMITED = "D"
      this.message.error('Please enter Number only in Amount Field', '');
    }
    else if (this.data.DUES_PAID_JUL_DEC_DATE == undefined || this.data.DUES_PAID_JUL_DEC_DATE == null) {
      this.isOk = false;
      this.IS_SUBMITED = "D"
      this.message.error("Please Selct  January-June Date", "");

    }

    else if (this.data.DUES_PAID_JUL_DEC_AMOUNT == undefined || this.data.DUES_PAID_JUL_DEC_AMOUNT.toString() == '' || this.data.DUES_PAID_JUL_DEC_AMOUNT == null) {
      this.isOk = false;
      this.IS_SUBMITED = "D"
      this.message.error("Please Enter Amount For July-December Period", "");
    }
    else if ((this.numbers.test(this.data.DUES_PAID_JUL_DEC_AMOUNT.toString())) == false) {
      this.isOk = false;
      this.IS_SUBMITED = "D"
      this.message.error('Please enter Number only in Amount Field', '');
    }
    else
      if (this.data.IS_WORK_ON_BUDGET == true && (this.data.BUDGET_URL == null || this.data.BUDGET_URL == '')) {
        this.isOk = false;
        this.IS_SUBMITED = "D"
        this.message.error("Please Choose File", "");
      }
      else if (this.data.INCOME_EXP_ACC_QTR1 == undefined || this.data.INCOME_EXP_ACC_QTR1 == null || this.data.INCOME_EXP_ACC_QTR1.trim() == '') {
        this.isOk = false;
        this.IS_SUBMITED = "D"
        this.message.error("Please Enter Quarter1 Details", "");
      }
      else if (this.data.INCOME_EXP_ACC_QTR1_DATE == undefined || this.data.INCOME_EXP_ACC_QTR1_DATE == null) {
        this.isOk = false;
        this.IS_SUBMITED = "D"
        this.message.error("Please Select Quarter1 Date", "");
      }
      else if (this.data.INCOME_EXP_ACC_QTR1_URL == "" || this.data.INCOME_EXP_ACC_QTR1_URL == undefined) {
        this.isOk = false;
        this.IS_SUBMITED = "D"
        this.message.error("Please Choose Quarter1 File", "");
      }
      else if (this.data.INCOME_EXP_ACC_QTR2 == undefined || this.data.INCOME_EXP_ACC_QTR2 == null || this.data.INCOME_EXP_ACC_QTR2.trim() == '') {
        this.isOk = false;
        this.IS_SUBMITED = "D"
        this.message.error("Please Enter   Quarter2 Details", "");
      }
      else if (this.data.INCOME_EXP_ACC_QTR2_DATE == undefined || this.data.INCOME_EXP_ACC_QTR2_DATE == null) {
        this.isOk = false;
        this.IS_SUBMITED = "D"
        this.message.error("Please Select  Quarter2 Date", "");
      }
      else if (this.data.INCOME_EXP_ACC_QTR2_URL == "" || this.data.INCOME_EXP_ACC_QTR2_URL == undefined) {
        this.isOk = false;
        this.IS_SUBMITED = "D"
        this.message.error("Please Choose Quarter2 File", "");
      }
      else if (this.data.INCOME_EXP_ACC_QTR3 == undefined || this.data.INCOME_EXP_ACC_QTR3 == null || this.data.INCOME_EXP_ACC_QTR3.trim() == '') {
        this.isOk = false;
        this.IS_SUBMITED = "D"
        this.message.error("Please Enter Quarter3 Details", "");
      }
      else if (this.data.INCOME_EXP_ACC_QTR3_DATE == undefined || this.data.INCOME_EXP_ACC_QTR3_DATE == null) {
        this.isOk = false;
        this.IS_SUBMITED = "D"
        this.message.error("Please Select Quarter3 Date", "");
      }
      else if (this.data.INCOME_EXP_ACC_QTR3_URL == "" || this.data.INCOME_EXP_ACC_QTR3_URL == undefined) {
        this.isOk = false;
        this.IS_SUBMITED = "D"
        this.message.error("Please Choose Quarter3 File", "");
      }
      else if (this.data.LIABILITIES_DETAILS == undefined || this.data.LIABILITIES_DETAILS == null || this.data.LIABILITIES_DETAILS.trim() == '') {
        this.isOk = false;
        this.IS_SUBMITED = "D"
        this.message.error("Please add liabilites details", "");
      }
      else if (this.data.RECOMENDATION_REASON == undefined || this.data.RECOMENDATION_REASON == null || this.data.RECOMENDATION_REASON.trim() == '') {
        this.isOk = false;
        this.IS_SUBMITED = "D"
        this.message.error("Please add recommendation details", "");
      }
      else if (this.data.OTHER_INFORMATION == undefined || this.data.OTHER_INFORMATION == null || this.data.OTHER_INFORMATION.trim() == '') {
        this.message.error("Please add  other information", "");
        this.isOk = false;
        this.IS_SUBMITED = "D"
      }
      // this.data.INCHARGE_OF = this.data.INCHARGE_OF == undefined ? "" : this.data.INCHARGE_OF;
      else if (this.data.IS_SUBMIT_PAST_YEAR_ACC_IN_MEETING == true && (this.data.PAST_YEAR_ACC_SUBMIT_IN_MEETING_DETAILS == null || this.data.PAST_YEAR_ACC_SUBMIT_IN_MEETING_DETAILS == '')) {
        this.isOk = false;
        this.IS_SUBMITED = "D"
        this.message.error('Please Enter AUDITDETAILS', '')
      }
      else if (this.data.IS_AUDITED_PAST_YEAR_BALANCE_SHEET == true && (this.data.AUDITED_PAST_YEAR_BALANCE_SHEET_DETAILS == null || this.data.AUDITED_PAST_YEAR_BALANCE_SHEET_DETAILS == '')) {
        this.isOk = false;
        this.IS_SUBMITED = "D"
        this.message.error('Please Enter balance details', '')
      }
      else if (this.data.IS_ANY_OUTSTANDING_PAYMENT == true && (this.data.OUTSTANDING_PAYMENT_REASON == null || this.data.OUTSTANDING_PAYMENT_REASON == '')) {
        this.isOk = false;
        this.IS_SUBMITED = "D"
        this.message.error('Please Enter outstanding payment reason', '')
      }
      else if (this.data.IS_ANY_OUTSTANDING_PAYMENT == true && (this.data.OUTSTANDING_PAYMENT_DETAILS == null || this.data.OUTSTANDING_PAYMENT_DETAILS == '')) {
        this.isOk = false;
        this.IS_SUBMITED = "D"
        this.message.error('Please Enter outstanding payment details', '')
      }
      else if (this.data.IS_MAINTAINED_ASSET_REGISTER == true && (this.data.ASSET_REGISTER_DETAILS == null || this.data.ASSET_REGISTER_DETAILS == '')) {
        this.isOk = false;
        this.IS_SUBMITED = "D"
        this.message.error('Please Enter asset register', '')
      }
    if (this.data.IS_SUBMIT_PAST_YEAR_ACC_IN_MEETING == false) {
      this.data.PAST_YEAR_ACC_SUBMIT_IN_MEETING_DETAILS = " "
    }

    if (this.data.IS_AUDITED_PAST_YEAR_BALANCE_SHEET == false) {
      this.data.AUDITED_PAST_YEAR_BALANCE_SHEET_DETAILS = " "
    }
    if (this.data.IS_ANY_OUTSTANDING_PAYMENT == false) {
      this.data.OUTSTANDING_PAYMENT_REASON = " "
    }
    if (this.data.IS_ANY_OUTSTANDING_PAYMENT == false) {
      this.data.OUTSTANDING_PAYMENT_DETAILS = " "
    }
    if (this.data.IS_MAINTAINED_ASSET_REGISTER == false) {
      this.data.ASSET_REGISTER_DETAILS = " "
    }
    if (this.isOk) {
      this.validation = true;





      this.data.DUES_PAID_DATE = this.datePipe.transform(this.data.DUES_PAID_DATE, "yyyy-MM-dd");

      this.data.DUES_PAID_JAN_JUNE_DATE = this.datePipe.transform(this.data.DUES_PAID_JAN_JUNE_DATE, "yyyy-MM-dd");
      this.data.DUES_PAID_JUL_DEC_DATE = this.datePipe.transform(this.data.DUES_PAID_JUL_DEC_DATE, "yyyy-MM-dd");
      this.data.INCOME_EXP_ACC_QTR1_DATE = this.datePipe.transform(this.data.INCOME_EXP_ACC_QTR1_DATE, "yyyy-MM-dd");

      this.data.DATEPERIOD2 = this.datePipe.transform(this.data.DATEPERIOD2, "yyyy-MM-dd");

      this.data.INCOME_EXP_ACC_QTR2_DATE = this.datePipe.transform(this.data.INCOME_EXP_ACC_QTR2_DATE, "yyyy-MM-dd");
      this.data.INCOME_EXP_ACC_QTR3_DATE = this.datePipe.transform(this.data.INCOME_EXP_ACC_QTR3_DATE, "yyyy-MM-dd");

      this.data.PAST_YEAR_ACC_SUBMIT_IN_MEETING_DATE = this.datePipe.transform(this.data.PAST_YEAR_ACC_SUBMIT_IN_MEETING_DATE, "yyyy-MM-dd");

      this.data.AUDITED_PAST_YEAR_BALANCE_SHEET_DATE = this.datePipe.transform(this.data.AUDITED_PAST_YEAR_BALANCE_SHEET_DATE, "yyyy-MM-dd")


      // this.data.CREATED_DATE =this.datePipe.transform(this.data.CREATED_DATE, "yyyy-MM-dd");

      if (this.data.ID > 0) {
        this.imageUpload1()
        this.data.BUDGET_URL = (this.photo1Str == "") ? " " : this.photo1Str;
        this.imageUpload2()
        this.data.INCOME_EXP_ACC_QTR1_URL = (this.photo2Str == "") ? " " : this.photo2Str;
        this.imageUpload3()
        this.data.INCOME_EXP_ACC_QTR2_URL = (this.photo3Str == "") ? " " : this.photo3Str;
        this.imageUpload4()
        this.data.INCOME_EXP_ACC_QTR3_URL = (this.photo4Str == "") ? " " : this.photo4Str;
        this.api.UpdateDirectorFinance(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Director Finance Updated Successfully", "");
            this.isSpinning = false;

            if (!addNew)
              this.close(myForm);

          } else {
            this.message.error("Director Finance   Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.imageUpload1()
        this.data.BUDGET_URL = (this.photo1Str == "") ? " " : this.photo1Str;
        this.imageUpload2()
        this.data.INCOME_EXP_ACC_QTR1_URL = (this.photo2Str == "") ? " " : this.photo2Str;
        this.imageUpload3()
        this.data.INCOME_EXP_ACC_QTR2_URL = (this.photo3Str == "") ? " " : this.photo3Str;
        this.imageUpload4()
        this.data.INCOME_EXP_ACC_QTR3_URL = (this.photo4Str == "") ? " " : this.photo4Str;
        this.api.createDirectorFinance(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Director Finance Created Successfully", "");
            this.isSpinning = false;

            if (!addNew)
              this.close(myForm);

            else {
              this.data = new Awardmaster();
            }

          } else {
            this.message.error("Director Finance Creation Failed", "");
            this.isSpinning = false;

          }
        });
      }
    }
  }

  add(): void {
    this.drawerTitle1 = "Sponsorship";
    this.drawerData1 = new Sponsormaster();
    this.drawerVisible1 = true;
  }

  SelectYear(YEAR1: any) {
    this.YEAR = YEAR1;
    this.data = new Awardmaster()
    var member = this._cookie.get('userId');
    this.data2 = [];

    this.api.getFinanceDirector(0, 0, "", "asc", " AND MEMBER_ID=" + member, this.YEAR).subscribe(data3 => {
      if ((data3['code'] == 200) && (data3['count'] > 0)) {
        this.data = data3['data'][0];

        if (this.data.ID != null) {
          this.api.getAllFinanceSponsorshipdetails(0, 0, "", "asc", " AND DIRECTOR_FINANCE_ID=" + this.data.ID).subscribe(data3 => {
            if (data3['code'] == 200 && data3['count'] > 0) {
              this.data2 = data3['data'];
            }
          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
        }

      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
    // console.log(this.YEAR,this.data);
    // console.log( this.data2)
  }

  edit(data1: Sponsormaster, index: number): void {
    this.currentIndex = index;
    // console.log("this.currentIndex", this.currentIndex);
    this.drawerTitle1 = "Edit Member";
    this.drawerData1 = Object.assign({}, data1);
    this.drawerVisible1 = true;
    // console.log(this.drawerData1);

  }
  omit(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }


  setAll(event) {
    this.data.IS_ANY_OUTSTANDING_PAYMENT = event;

    if (this.data.IS_ANY_OUTSTANDING_PAYMENT == true) {
      this.data.OUTSTANDING_PAYMENT_REASON && this.data.OUTSTANDING_PAYMENT_DETAILS;

    } else if (this.data.IS_ANY_OUTSTANDING_PAYMENT == false) {
      this.data.OUTSTANDING_PAYMENT_REASON && this.data.OUTSTANDING_PAYMENT_DETAILS == "";
    }


  }



  SelectAll1(event) {
    this.data.IS_AUDITED_PAST_YEAR_BALANCE_SHEET = event;

    if (this.data.IS_AUDITED_PAST_YEAR_BALANCE_SHEET == true) {
      this.data.AUDITED_PAST_YEAR_BALANCE_SHEET_DETAILS;

    } else {
      this.data.AUDITED_PAST_YEAR_BALANCE_SHEET_DETAILS
    }

    if (this.data.AUDITED_PAST_YEAR_BALANCE_SHEET_DETAILS.length > 0)
      this.data.AUDITED_PAST_YEAR_BALANCE_SHEET_DETAILS
  }



  ApplyForAward(myForm: any) {


    this.data.IS_SUBMITED = "S"

    this.save(false, myForm);
  }


  @ViewChild(SponsorshipComponent, { static: false }) SponsorshipComponent !: SponsorshipComponent;

  updateData(i: any) {
    if (this.currentIndex == -1) {
      this.data2.push(this.drawerData1);
      // this.data2 = [...this.data2,this.data2];
    } else {
      this.data2[this.currentIndex] = this.drawerData1;
    }
    this.data2 = [...[], ...this.data2];
    this.currentIndex = -1
    // console.log(this.data2);
  }

  drawerClose1(): void {
    this.drawerVisible1 = false;
  }

  getWidth() {
    if (window.innerWidth <= 400)
      return 400;

    else
      return 800;
  }

  get closeCallback1() {
    return this.drawerClose1.bind(this);
  }


  fetchData() {
    const memberID = parseInt(this._cookie.get('userId'));
    var YEAR = this.yearrange.toString();
    this.api.getFetchData(memberID, YEAR).subscribe(data => {
      if (data['code'] == '200') {
        this.totalRecords = data['count'];
        this.FetchOldData = data['data'];
      }
      this.data.DUES_PAID_JAN_JUNE_AMOUNT = this.FetchOldData[0]['Jan_June'];
      this.data.DUES_PAID_JUL_DEC_AMOUNT = this.FetchOldData[0]['JULY_DEC'];
    },
      err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
  }

  folderName = "BudgetURL";

  imageUpload1() {
    this.photo1Str = "";

    if (!this.data.ID) {
      if (this.fileURL1) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL1.name.split('.').pop();
        var url = "PI" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL1, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");
            // this.message.success("File uploaded","");

          } else {
            console.log("Not Uploaded");
            // this.message.error("File not uploaded","");
          }
        });

        this.photo1Str = url;

      } else {
        this.photo1Str = "";
      }

    } else {
      if (this.fileURL1) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL1.name.split('.').pop();
        var url = "PI" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL1, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo1Str = url;

      } else {
        if (this.data.BUDGET_URL) {
          let photoURL = this.data.BUDGET_URL.split("/");
          this.photo1Str = photoURL[photoURL.length - 1];

        } else
          this.photo1Str = "";
      }
    }
  }

  folderName1 = 'incomeExpensesURL';

  imageUpload2() {
    this.photo2Str = "";

    if (!this.data.ID) {
      if (this.fileURL2) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL2.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName1, this.fileURL2, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo2Str = url;

      } else {
        this.photo2Str = "";
      }

    } else {
      if (this.fileURL2) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL2.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName1, this.fileURL2, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo2Str = url;

      } else {
        if (this.data.INCOME_EXP_ACC_QTR1_URL) {
          let photoURL = this.data.INCOME_EXP_ACC_QTR1_URL.split("/");
          this.photo2Str = photoURL[photoURL.length - 1];

        } else
          this.photo2Str = "";
      }
    }
  }


  imageUpload3() {
    this.photo3Str = "";

    if (!this.data.ID) {
      if (this.fileURL3) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL3.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName1, this.fileURL3, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo3Str = url;

      } else {
        this.photo3Str = "";
      }

    } else {
      if (this.fileURL3) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL3.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName1, this.fileURL3, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo3Str = url;

      } else {
        if (this.data.INCOME_EXP_ACC_QTR2_URL) {
          let photoURL = this.data.INCOME_EXP_ACC_QTR2_URL.split("/");
          this.photo3Str = photoURL[photoURL.length - 1];

        } else
          this.photo3Str = "";
      }
    }
  }

  imageUpload4() {
    this.photo4Str = "";

    if (!this.data.ID) {
      if (this.fileURL4) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL4.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName1, this.fileURL4, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo4Str = url;

      } else {
        this.photo4Str = "";
      }

    } else {
      if (this.fileURL4) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL4.name.split('.').pop();
        var url = "GM" + number + "." + fileExt;

        this.api.onUpload2(this.folderName1, this.fileURL4, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo4Str = url;

      } else {
        if (this.data.INCOME_EXP_ACC_QTR3_URL) {
          let photoURL = this.data.INCOME_EXP_ACC_QTR3_URL.split("/");
          this.photo4Str = photoURL[photoURL.length - 1];

        } else
          this.photo4Str = "";
      }
    }
  }


  onPdfFileSelected1(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png' || event.target.files[0].type == 'application/pdf') {
      this.fileURL1 = <File>event.target.files[0];
      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)
      this.compressImage.compress(event.target.files[0])
        .pipe(take(1))
        .subscribe(compressedImage => {
          console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
          // now you can do upload the compressed image         
          this.fileURL1 = compressedImage;
        })
      console.log("compressed image == ", this.fileURL1);
      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.data.BUDGET_URL = reader.result as string;
        };
      }

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG /pdf File', '');
      this.fileURL1 = null;

    }
  }


  onPdfFileSelected2(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png' || event.target.files[0].type == 'application/pdf') {
      this.fileURL2 = <File>event.target.files[0];
      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)
      this.compressImage.compress(event.target.files[0])
        .pipe(take(1))
        .subscribe(compressedImage => {
          console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
          // now you can do upload the compressed image         
          this.fileURL2 = compressedImage;
        })
      console.log("compressed image == ", this.fileURL2);
      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.data.INCOME_EXP_ACC_QTR1_URL = reader.result as string;
        };
      }

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG /pdf File', '');
      this.fileURL2 = null;
    }
  }

  onPdfFileSelected3(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png' || event.target.files[0].type == 'application/pdf') {
      this.fileURL3 = <File>event.target.files[0];
      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)
      this.compressImage.compress(event.target.files[0])
        .pipe(take(1))
        .subscribe(compressedImage => {
          console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
          // now you can do upload the compressed image         
          this.fileURL3 = compressedImage;
        })
      console.log("compressed image == ", this.fileURL3);
      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.data.INCOME_EXP_ACC_QTR2_URL = reader.result as string;
        };
      }

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG /pdf File', '');
      this.fileURL3 = null;
    }
  }


  onPdfFileSelected4(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png' || event.target.files[0].type == 'application/pdf') {
      this.fileURL4 = <File>event.target.files[0];
      console.log(`Image size before compressed: ${event.target.files[0].size} bytes.`)
      this.compressImage.compress(event.target.files[0])
        .pipe(take(1))
        .subscribe(compressedImage => {
          console.log(`Image size after compressed: ${compressedImage.size} bytes.`)
          // now you can do upload the compressed image         
          this.fileURL4 = compressedImage;
        })
      console.log("compressed image == ", this.fileURL4);
      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.data.INCOME_EXP_ACC_QTR3_URL = reader.result as string;
        };
      }
    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG /pdf File', '');
      this.fileURL4 = null;
    }
  }

  folderName3 = "financeCertificate";


  viewImage(photoUrl: string) {
    window.open(this.api.retriveimgUrl + "BudgetURL/" + photoUrl);
    console.log(window.open)
  }

  viewImage1(photoUrl1: string) {
    window.open(this.api.retriveimgUrl + "incomeExpensesURL/" + photoUrl1);
    console.log(window.open)
  }

  viewImage2(photoUrl2: string) {
    window.open(this.api.retriveimgUrl + "incomeExpensesURL/" + photoUrl2);
    console.log(window.open)
  }

  viewImage3(photoUrl3: string) {
    window.open(this.api.retriveimgUrl + "incomeExpensesURL/" + photoUrl3);
    console.log(window.open)
  }

  viewImage4(imageName4) {
    window.open(imageName4);
  }

  PhotoURL = this.api.retriveimgUrl + "BudgetURL";

  getPhotoURL(photoURL: any) {
    return this.api.retriveimgUrl + "BudgetURL" + photoURL;
  }

  getPhotoURL1(photoURL1: any) {
    return this.api.retriveimgUrl + "incomeExpensesURL/" + photoURL1;
  }

  imgurl = this.api.retriveimgUrl;
  // PhotoUrl2=this.api.retriveimgUrl+"incomeExpensesURL";

  modalDisplay(): void {
    this.isVisible = true;
    var member = this._cookie.get('userId');

    this.api.getFinanceDirector(0, 0, "", "asc", " AND MEMBER_ID=" + member, this.YEAR).subscribe(data => {
      if ((data['code'] == 200) && (data['data4'] > 0)) {
        this.data = data['data'][0];


        if (this.data.ID != null) {
          this.api.getAllFinanceSponsorshipdetails(0, 0, "", "asc", " AND DIRECTOR_FINANCE_ID=" + this.data.ID).subscribe(data3 => {
            if (data3['code'] == 200 && data3['count'] > 0) {
              this.drawerData1 = data3['data'];
              this.isVisible = true;
            } else {
              this.isVisible = true;

            }
          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
        }

      } else {
        this.isVisible = true;
        ;
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  handleCancel() {
    this.isVisible = false;
  }



}