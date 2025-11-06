import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../Service/api.service';
import { Useraccessmapping } from '../Models/useraccessmapping';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  EMAIL_ID = "";
  PASSWORD = "";
  passwordVisible: boolean = false;
  supportKey = "";
  ORGANIZATION_ID: number;
  isLogedIn: boolean = false;
  userAccessData: Useraccessmapping;
  userId = Number(this.cookie.get('userId'));
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: any[] = [];
  isSpinning: boolean = false;
  roleId = sessionStorage.getItem('roleId');

  constructor(private router: Router, private api: ApiService, private message: NzNotificationService, private cookie: CookieService) { }

  ngOnInit() {
    if ((this.cookie.get('token') === '') || (this.cookie.get('userId') === '') || (this.cookie.get('token') === null)) {
      this.isLogedIn = false;
      this.router.navigate(['/federationlogin']);

    } else {
      this.isLogedIn = true;
      this.router.navigate(['/dashboard']);
    }

    const userId = '1';
    this.api.requestPermission(userId);
  }

  login(): void {
    if ((this.EMAIL_ID == "") && (this.PASSWORD == ""))
      this.message.error("Please enter mobile No. and password", "");

    else {
      this.isSpinning = true;
      this.cookie.deleteAll();
      sessionStorage.clear();

      this.api.employeelogin(this.EMAIL_ID, this.PASSWORD).subscribe(data => {
        if (data['code'] == 200) {
          sessionStorage.setItem('userId', data["data"][0]['UserData'][0]['USER_ID']);
          sessionStorage.setItem('roleId', data["data"][0]['UserData'][0]['ROLE_ID']);
          sessionStorage.setItem('emailId', data["data"][0]['UserData'][0]['EMAIL_ID']);
          sessionStorage.setItem('orgId', data["data"][0]['UserData'][0]['ORG_ID']);

          this.cookie.set('token', data["data"][0]["token"], 365, "", "", false, "Strict");
          this.cookie.set('userId', data["data"][0]['UserData'][0]['USER_ID'], 365, "", "", false, "Strict");
          this.cookie.set('userName', data["data"][0]['UserData'][0]['NAME'], 365, "", "", false, "Strict");
          this.cookie.set('roleId', data["data"][0]['UserData'][0]['ROLE_ID'], 365, "", "", false, "Strict");
          this.cookie.set('orgId', data["data"][0]['UserData'][0]['ORG_ID'], 365, "", "", false, "Strict");
          this.cookie.set('deptId', data["data"][0]['UserData'][0]['DEPARTMENT_ID'], 365, "", "", false, "Strict");
          this.cookie.set('emailId', data["data"][0]['UserData'][0]['EMAIL_ID'], 365, "", "", false, "Strict")
          this.cookie.set('designationId', data["data"][0]['UserData'][0]['DESIGNATION_ID'], 365, "", "", false, "Strict")
          this.cookie.set('branchId', data["data"][0]['UserData'][0]['BRANCH_ID'], 365, "", "", false, "Strict");

          this.api.getChannels().subscribe(data => {
            if (data['code'] == 200) {
              this.cookie.set('channels', data["data"], 365, "", "", false, "Strict");
              let channels = data["data"].split(',');
              this.api.subscribeTokenToTopic(this.api.cloudID, channels);
            }

          }, err => {
            // if (err['ok'] == false)
            //   this.message.error("Server Not Found", "");
          });

        } else if (data['code'] == 404) {
          this.isSpinning = false;
          this.message.error(data['message'], "");
        }

      }, err => {
        this.isSpinning = false;
        this.message.error(JSON.stringify(err), "");
      });
    }
  }
}
