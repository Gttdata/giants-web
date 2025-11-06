import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CircularTypeMaster } from 'src/app/Models/Circulartype';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-addcirculartype',
  templateUrl: './addcirculartype.component.html',
  styleUrls: ['./addcirculartype.component.css']
})

export class AddcirculartypeComponent implements OnInit {
  @Input() data: CircularTypeMaster = new CircularTypeMaster();
  @Input() drawerClose!: Function;
  @Input() drawerVisible: boolean = false;
  isSpinning: boolean = false;

  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit(): void { }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  alphaOnly(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;

    if (charCode > 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      return false;
    }

    return true;
  }

  omit(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
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

            if (!addNew) {
              this.close(myForm);
            }

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

            if (!addNew) {
              this.close(myForm);

            } else {
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
}
