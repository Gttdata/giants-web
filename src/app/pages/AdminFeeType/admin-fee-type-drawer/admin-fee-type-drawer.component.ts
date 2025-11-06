import { DatePipe } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-admin-fee-type-drawer',
  templateUrl: './admin-fee-type-drawer.component.html',
  styleUrls: ['./admin-fee-type-drawer.component.css']
})

export class AdminFeeTypeDrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() drawerVisible: boolean;
  @Input() feeDetails = [];
  SAHELI: string = "";
  NORMAL: string = "";
  YOUNG: string = "";
  isSpinning: boolean = false;
  pageIndex: number = 0;
  pageSize: number = 0;
  YEAR: string;

  constructor(
    private api: ApiService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private _cookie: CookieService,
    private _exportService: ExportService) { }

  ngOnInit() {
    this.getYears();
  }

  years: any = [];

  getYears() {
    this.api.getAllYears(0, 0, "", "", "").subscribe(data => {
      if (data['code'] == 200) {
        this.years = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }

  save(addNew: boolean, myForm: NgForm) {
    let isOk = true;

    if (this.YEAR == undefined || this.YEAR == null) {
      isOk = false;
      this.message.error('Please Select Valid Year', '');
    }

    if (isOk) {
      for (var i = 0; i < this.feeDetails.length; i++) {
        if (i == 0) {
          this.feeDetails[i]["EXPIRY_DATE"] = null;

        } else {
          this.feeDetails[i]["EXPIRY_DATE"] = this.datePipe.transform(this.feeDetails[i]["EXPIRY_DATE"], "yyyy-MM-dd");
        }
      }

      for (var i = 0; i < this.feeDetails.length; i++) {
        this.feeDetails[i]["SEQUENCE_NO"] = i + 1;

        if (this.feeDetails[i]["SAHELI"] == "") {
          this.feeDetails[i]["SAHELI"] = 0;
        }

        if (this.feeDetails[i]["NORMAL"] == "") {
          this.feeDetails[i]["NORMAL"] = 0;
        }

        if (this.feeDetails[i]["YOUNG"] == "") {
          this.feeDetails[i]["YOUNG"] = 0;
        }
      }

      let obj1 = new Object();
      obj1["YEAR"] = this.YEAR;
      obj1["FEE_DETAILS"] = this.feeDetails;
      this.isSpinning = true;

      this.api.submitAdminFeeStructure(obj1).subscribe((successCode) => {
        if (successCode["code"] == 200) {
          this.message.success("Fee Details Submitted Successfully", "");
          this.isSpinning = false;
          this.close(myForm);

        } else {
          this.message.error("Failed to Submit Fee Details", "");
          this.isSpinning = false;
        }
      });
    }
  }

  onSaheliAmtChange(amt: number) {
    for (var i = 0; i < this.feeDetails.length; i++) {
      this.feeDetails[i]["SAHELI"] = amt;
    }
  }

  onNormalAmtChange(amt: number) {
    for (var i = 0; i < this.feeDetails.length; i++) {
      this.feeDetails[i]["NORMAL"] = amt;
    }
  }

  onYoungAmtChange(amt: number) {
    for (var i = 0; i < this.feeDetails.length; i++) {
      this.feeDetails[i]["YOUNG"] = amt;
    }
  }

  onYearChange(selectedYear: any): void {
    this.YEAR = selectedYear;

    this.feeDetails.forEach(element => {
      element["EXPIRY_DATE"] = new Date(new Date(Number(this.YEAR), 11, 31).getFullYear(), 11, 31);
    });
  }
}
