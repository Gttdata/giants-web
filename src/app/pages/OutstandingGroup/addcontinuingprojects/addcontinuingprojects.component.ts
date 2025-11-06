import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ContinuingProjectDetails } from 'src/app/Models/ContinuingProjectDetails';

import { ApiService } from 'src/app/Service/api.service';


@Component({
  selector: 'app-addcontinuingprojects',
  templateUrl: './addcontinuingprojects.component.html',
  styleUrls: ['./addcontinuingprojects.component.css']
})

export class AddcontinuingprojectsComponent implements OnInit {
  @Input() drawerContiProjectClose: Function;
  @Input() contiProjectTable: Function;
  @Input() ContiProjectdata: ContinuingProjectDetails = new ContinuingProjectDetails();
  @Input() drawerContiProjectVisible: boolean;

  numberpattern = /^[6-9]\d{9}$/;
  isSpinning = false;
  isOk = true;

  @Output() contProjectChild: EventEmitter<any> = new EventEmitter<any>();

  constructor(private api: ApiService, private cookie: CookieService, private datePipe: DatePipe, private message: NzNotificationService) { }

  ngOnInit() {
  }

  alphaOnly(event: any) {
    event = (event) ? event : window.event;
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      return false;
    }
    return true;
  }

  save(addNew: boolean, myForm: NgForm) {

    this.isSpinning = false;
    this.isOk = true;

    if (this.ContiProjectdata.TITLE == undefined || this.ContiProjectdata.TITLE.toString() == '' || this.ContiProjectdata.TITLE == null) {
      this.isOk = false;
      this.message.error('Please Enter the Title', '');
    }
    else if (this.ContiProjectdata.DESCRIPTION == undefined || this.ContiProjectdata.DESCRIPTION.toString() == '' || this.ContiProjectdata.DESCRIPTION == null) {
      this.isOk = false;
      this.message.error('Please Enter the Description', '');
    }

    // console.log("this.ContiProject",  this.ContiProjectdata);

    if (this.isOk) {
      this.contiProjectTable();
      this.drawerContiProjectClose();
      this.isSpinning = false;
    }



    // if (!addNew)
    // this.close(myForm);
  }

  close(myForm: NgForm): void {
    this.drawerContiProjectClose();
    this.reset(myForm);
  }
  reset(myForm: NgForm) {
    myForm.form.reset();
  }


}
