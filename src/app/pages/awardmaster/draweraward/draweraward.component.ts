import { Component, OnInit, Input } from '@angular/core';
import { AwardsMaster } from 'src/app/Models/AwardsMaster';
import { ApiService } from 'src/app/Service/api.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-draweraward',
  templateUrl: './draweraward.component.html',
  styleUrls: ['./draweraward.component.css']
})

export class DrawerawardComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: AwardsMaster;
  isOk: boolean = true;
  isSpinning: boolean = false;

  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit() { }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  save(addNew: boolean, myForm: NgForm): void {
    this.isOk = true;
    this.isSpinning = true;

    if ((this.data.LEVEL == undefined || this.data.LEVEL.toString() == '' || this.data.LEVEL == null || this.data.LEVEL.trim() == '')
      && (this.data.AWARD_NAME == undefined || this.data.AWARD_NAME.toString() == '' || this.data.AWARD_NAME == null || this.data.AWARD_NAME.trim() == '')) {
      this.isOk = false;
      this.message.error('Please Enter all the mandatory field', '');

    } else if (this.data.LEVEL == undefined || this.data.LEVEL.toString() == '' || this.data.LEVEL == null || this.data.LEVEL.trim() == '') {
      this.isOk = false;
      this.message.error('Please Select Level', '');

    } else if (this.data.AWARD_NAME == undefined || this.data.AWARD_NAME.toString() == '' || this.data.AWARD_NAME == null || this.data.AWARD_NAME.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Award Name', '');
    }

    if (this.isOk) {
      this.isSpinning = true;

      if (this.data.ID) {
        this.api.updateAward(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Award updated Successfully", "");

            if (!addNew) {
              this.close(myForm);
            }

            this.isSpinning = false;

          } else {
            this.message.error("Failed to update Award", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.api.createAward(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Award added successfully", "");

            if (!addNew) {
              this.close(myForm);

            } else {
              this.data = new AwardsMaster();
            }

            this.isSpinning = false;

          } else {
            this.message.error("Failed to add Award", "");
            this.isSpinning = false;
          }
        });
      }
    }
  }

}
