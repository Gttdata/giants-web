import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeMaster } from 'src/app/Models/employeemaster';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-change-password-drawer',
  templateUrl: './change-password-drawer.component.html',
  styleUrls: ['./change-password-drawer.component.css']
})

export class ChangePasswordDrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  passwordVisible1 = false;
  passwordVisible2 = false;
  passwordVisible3 = false;
  passwordVisible4 = false;

  userId = Number(this.cookie.get('userId'));
  roleId = Number(this.cookie.get('roleId'));
  orgId = Number(this.cookie.get('orgId'));
  deptId = Number(this.cookie.get('deptId'));
  branchId = Number(this.cookie.get('branchId'));
  designationId = Number(this.cookie.get('designationId'));

  password: string;
  isSpinning = false;
  roleLoading = false;

  OLD_PASSWORD: any;
  NEW_PASSWORD: any;
  RE_ENTER_PASSWORD: any;
  EXISTING_PASSWORD: any;

  constructor(private api: ApiService, private message: NzNotificationService, private cookie: CookieService) { }

  ngOnInit() { }

  close(myForm: NgForm): void {
    this.passwordVisible1 = false;
    this.passwordVisible2 = false;
    this.passwordVisible3 = false;
    this.passwordVisible4 = false;

    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  save(myForm: NgForm): void {
    if (this.EXISTING_PASSWORD != undefined && this.EXISTING_PASSWORD != "") {
      var isOk = true;

      if (this.OLD_PASSWORD != undefined) {
        if (this.OLD_PASSWORD.trim() == "") {
          isOk = false;
          this.message.error("Please Enter Old Password", "");
        }

      } else {
        isOk = false;
        this.message.error("Please Enter Old Password", "");
      }

      if (this.NEW_PASSWORD != undefined) {
        if (this.NEW_PASSWORD.trim() != "") {
          if (this.NEW_PASSWORD.length >= 8) {
            if (!this.api.passwordIsValid(this.NEW_PASSWORD)) {
              isOk = false;
              this.message.error("Please Enter Valid Password", "");
            }

          } else {
            isOk = false;
            this.message.error("Password Must be or Greater than 8 Characters", "");
          }

        } else {
          isOk = false;
          this.message.error("Please Enter New Password", "");
        }

      } else {
        isOk = false;
        this.message.error("Please Enter New Password", "");
      }

      if (this.RE_ENTER_PASSWORD != undefined) {
        if (this.RE_ENTER_PASSWORD.trim() == "") {
          isOk = false;
          this.message.error("Please Re-enter New Password", "");
        }

      } else {
        isOk = false;
        this.message.error("Please Re-enter New Password", "");
      }

      if (this.OLD_PASSWORD.trim() != "" && this.NEW_PASSWORD.trim() != "" && this.RE_ENTER_PASSWORD.trim() != "") {
        if (this.OLD_PASSWORD == this.EXISTING_PASSWORD) {
          if (this.NEW_PASSWORD == this.RE_ENTER_PASSWORD) {
            if (this.RE_ENTER_PASSWORD == this.EXISTING_PASSWORD) {
              isOk = false;
              this.message.error("New Password and Existing Password is Matches, Try Different Password", "");
            }

          } else {
            isOk = false;
            this.message.error("New Password and Re-entered Password does Not Match", "");
          }

        } else {
          isOk = false;
          this.message.error("Please Enter Correct Old Password", "");
        }
      }

      if (isOk) {
        if (this.dataList.ID) {
          this.isSpinning = true;
          this.dataList.PASSWORD = this.RE_ENTER_PASSWORD;

          this.api.updateemployeeMaster(this.dataList).subscribe(successCode => {
            if (successCode['code'] == "200") {
              this.message.success("Password Reset Successfully", "");
              this.isSpinning = false;
              this.close(myForm);
              this.logout();

            } else {
              this.message.error("Failed to Reset Password", "");
              this.isSpinning = false;
            }
          });
        }
      }
    }
  }

  dataList: EmployeeMaster = new EmployeeMaster();

  getInfo() {
    this.api.getAllemployeeMaster(0, 0, '', '', ' and ID=' + this.userId).subscribe(data => {
      if (data['code'] == 200) {
        this.dataList = Object.assign({}, data['data'][0]);
        this.EXISTING_PASSWORD = this.dataList.PASSWORD;
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  logout() {
    this.api.logout().subscribe(forms => {
      if (this.roleId != 1) {
        this.api.unsubscribeTokenToTopic(this.api.cloudID);

      } else {
        this.cookie.deleteAll();
        sessionStorage.clear();
        window.location.reload();

        // setTimeout(() => {
        //   window.location.reload();
        // }, 500);
      }

    }, err => {
      this.message.error("Failed to Logout", "");
    });
  }
}
