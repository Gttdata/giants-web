import { Component, OnInit, Input } from '@angular/core';
import { CertificateMaster } from 'src/app/Models/CertificateMaster';
import { ApiService } from 'src/app/Service/api.service';
import { NzNotificationService } from 'ng-zorro-antd';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-drawercertificate',
  templateUrl: './drawercertificate.component.html',
  styleUrls: ['./drawercertificate.component.css']
})

export class DrawercertificateComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: CertificateMaster;
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
      && (this.data.CERTIFICATE_NAME == undefined || this.data.CERTIFICATE_NAME.toString() == '' || this.data.CERTIFICATE_NAME == null || this.data.CERTIFICATE_NAME.trim() == '')) {
      this.isOk = false;
      this.message.error('Please Enter all the mandatory field', '');

    } else if (this.data.LEVEL == undefined || this.data.LEVEL.toString() == '' || this.data.LEVEL == null || this.data.LEVEL.trim() == '') {
      this.isOk = false;
      this.message.error('Please Select Level', '');

    } else if (this.data.CERTIFICATE_NAME == undefined || this.data.CERTIFICATE_NAME.toString() == '' || this.data.CERTIFICATE_NAME == null || this.data.CERTIFICATE_NAME.trim() == '') {
      this.isOk = false;
      this.message.error('Please Enter Certificate Name', '');
    }

    if (this.isOk) {
      this.isSpinning = true;

      if (this.data.ID) {
        this.api.updateCertificate(this.data).subscribe(successCode => {
          if (successCode['code'] == "200") {
            this.message.success("Certificate updated Successfully", "");

            if (!addNew) {
              this.close(myForm);
            }

            this.isSpinning = false;
          }

          else {
            this.message.error("Failed to update Certificate", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.api.createCertificate(this.data).subscribe(successCode => {
          if (successCode['code'] == "200") {
            this.message.success("Certificate added successfully", "");

            if (!addNew) {
              this.close(myForm);

            } else {
              this.data = new CertificateMaster();
            }

            this.isSpinning = false;

          } else {
            this.message.error("Failed to add Certificate", "");
            this.isSpinning = false;
          }
        });
      }
    }
  }
}
