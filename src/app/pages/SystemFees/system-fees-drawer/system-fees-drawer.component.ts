import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { SystemFeesMaster } from 'src/app/Models/SystemFeesMaster';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-system-fees-drawer',
  templateUrl: './system-fees-drawer.component.html',
  styleUrls: ['./system-fees-drawer.component.css']
})

export class SystemFeesDrawerComponent implements OnInit {
  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit(): void {
    this.getYear();
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }

  @Input() drawerClose: Function;
  @Input() data: SystemFeesMaster;
  isSpinning: boolean = false

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  isOk = true;

  save(addNew: boolean, myForm: NgForm): void {
    this.isOk = true;

    if (
      this.data.YEAR_ID == undefined ||
      this.data.YEAR_ID.toString() == "" ||
      this.data.YEAR_ID == null
    ) {
      this.isOk = false;
      this.message.error("Please select the Year", "");

    } else if (
      this.data.INT_FEE == undefined ||
      this.data.INT_FEE.toString() == "" ||
      this.data.INT_FEE == null
    ) {
      this.isOk = false;
      this.message.error("Please enter the International Fee", "");

    } else if (
      this.data.FED_FEE == undefined ||
      this.data.FED_FEE.toString() == "" ||
      this.data.FED_FEE == null
    ) {
      this.isOk = false;
      this.message.error("Please enter the Federation Fee", "");

    } else if (
      this.data.GR_FEE == undefined ||
      this.data.GR_FEE.toString() == "" ||
      this.data.GR_FEE == null
    ) {
      this.isOk = false;
      this.message.error("Please enter the Group Fee", "");

    } else if (
      this.data.INT_EMAIL == undefined ||
      this.data.INT_EMAIL.toString() == "" ||
      this.data.INT_EMAIL == null
    ) {
      this.isOk = false;
      this.message.error("Please enter the International Email Count", "");

    } else if (
      this.data.FED_EMAIL == undefined ||
      this.data.FED_EMAIL.toString() == "" ||
      this.data.FED_EMAIL == null
    ) {
      this.isOk = false;
      this.message.error("Please enter the Federation Email Count", "");

    } else if (
      this.data.GR_EMAIL == undefined ||
      this.data.GR_EMAIL.toString() == "" ||
      this.data.GR_EMAIL == null
    ) {
      this.isOk = false;
      this.message.error("Please enter the Group Email Count", "");

    } else if (
      this.data.INT_SMS == undefined ||
      this.data.INT_SMS.toString() == "" ||
      this.data.INT_SMS == null
    ) {
      this.isOk = false;
      this.message.error("Please enter the International SMS Count", "");

    } else if (
      this.data.FED_SMS == undefined ||
      this.data.FED_SMS.toString() == "" ||
      this.data.FED_SMS == null
    ) {
      this.isOk = false;
      this.message.error("Please enter the Federation SMS Count", "");

    } else if (
      this.data.GR_SMS == undefined ||
      this.data.GR_SMS.toString() == "" ||
      this.data.GR_SMS == null
    ) {
      this.isOk = false;
      this.message.error("Please enter the Group SMS Count", "");

    } else if (
      this.data.INT_WA == undefined ||
      this.data.INT_WA.toString() == "" ||
      this.data.INT_WA == null
    ) {
      this.isOk = false;
      this.message.error("Please enter the International WhatsApp Count", "");

    } else if (
      this.data.FED_WA == undefined ||
      this.data.FED_WA.toString() == "" ||
      this.data.FED_WA == null
    ) {
      this.isOk = false;
      this.message.error("Please enter the Federation WhatsApp Count", "");

    } else if (
      this.data.GR_WA == undefined ||
      this.data.GR_WA.toString() == "" ||
      this.data.GR_WA == null
    ) {
      this.isOk = false;
      this.message.error("Please enter the Group WhatsApp Count", "");
    }

    if (this.isOk) {
      this.isSpinning = true;

      if (this.data.ID) {
        this.api.updateSystemFees(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("System Fee Updated Successfully", "");
            this.isSpinning = false;

            if (!addNew) {
              this.close(myForm);
            }

          } else {
            this.message.error("System Fee Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.api.createSystemFees(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("System Fee Created Successfully", "");
            this.isSpinning = false;

            if (!addNew) {
              this.close(myForm);

            } else {
              this.data = new SystemFeesMaster();
            }

          } else {
            this.message.error("System Fee Creation Failed", "");
            this.isSpinning = false;
          }
        });
      }
    }
  }

  YearData: any[] = [];

  getYear() {
    this.api.getAllYears(0, 0, "", "", "").subscribe(data => {
      if (data['code'] == 200) {
        this.YearData = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }
}