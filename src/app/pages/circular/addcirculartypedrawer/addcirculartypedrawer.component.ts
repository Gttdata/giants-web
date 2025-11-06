import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CircularTypeMaster } from 'src/app/Models/Circulartype';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-addcirculartypedrawer',
  templateUrl: './addcirculartypedrawer.component.html',
  styleUrls: ['./addcirculartypedrawer.component.css']
})

export class AddcirculartypedrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: CircularTypeMaster;
  @Input() drawerVisible: boolean;
  isSpinning = false;
  namePattern = "([A-Za-z0-9 \s]){1,}";

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe) { }

  ngOnInit() { }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  save(addNew: boolean, myForm: NgForm): void {
    var isOk = true;

    if (this.data.NAME != undefined && this.data.NAME != null) {
      if (this.data.NAME.trim() == '') {
        isOk = false;
        this.message.error("Please Enter Valid Circular Type", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Circular Type", "");
    }

    if (this.data.SEQ_NO == null || this.data.SEQ_NO == undefined) {
      isOk = false;
      this.message.error('Please Enter Sequence Number', '');
    }

    if (isOk) {
      this.isSpinning = true;

      if (this.data.ID) {
        this.api.updateCircularType(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Circular Type Updated Successfully', '');
            this.isSpinning = false;

            if (!addNew)
              this.close(myForm);

          } else {
            this.message.error('Circular Type Updation Failed', '');
            this.isSpinning = false;
          }
        });

      } else {
        this.api.createCircularType(this.data).subscribe((successCode) => {
          if (successCode.code == '200') {
            this.message.success('Circular Type Created Successfully', '');
            this.isSpinning = false;

            if (!addNew)
              this.close(myForm);

            else {
              this.data = new CircularTypeMaster();
            }

          } else {
            this.message.error('Circular Type Creation Failed', '');
            this.isSpinning = false;
          }
        });
      }
    }
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }
}
