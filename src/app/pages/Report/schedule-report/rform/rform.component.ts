import { Rform } from 'src/app/Models/rform';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/Service/api.service';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-rform',
  templateUrl: './rform.component.html',
  styleUrls: ['./rform.component.css']
})

export class RformComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: Rform;
  @Input() drawerVisible: boolean = false;
  namepatt = /[a-zA-Z][a-zA-Z ]+/;
  isSpinning: boolean;
  isOk: boolean;

  alphaOnly(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;
    if (
      charCode > 32 &&
      (charCode < 65 || charCode > 90) &&
      (charCode < 97 || charCode > 122)
    ) {
      return false;
    }

    return true;
  }

  close(): void {
    this.drawerClose();
  }

  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit() { }

  save(): void {
    this.isSpinning = false;
    this.isOk = true;

    if (this.data.REPORT_NAME == null || this.data.REPORT_NAME == '' || this.data.REPORT_NAME == undefined) {
      this.isOk = false;
      this.message.error('Please Enter Report Name', '');

    } else {
      if (this.isOk == true) {
        if (this.data.ID) {
          this.api.reportMasterupdate(this.data).subscribe(data => {
            if (data["code"] == 200) {
              this.message.success("Save Successfully", "");
              this.close();

            } else {
              this.message.error("Activities Of The Year Creation Failed", "");
              this.isSpinning = false;
            }
          })

        } else {
          this.api.reportMastercreate(this.data).subscribe(data => {
            if (data["code"] == 200) {
              this.message.success("Save Successfully", "");
              this.close();

            } else {
              this.message.error("Activities Of The Year Creation Failed", "");
              this.isSpinning = false;
            }
          })
        }
      }
    }
  }
}
