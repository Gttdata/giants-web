import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification'
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from '../Service/api.service';
import { Useraccessmapping } from '../Models/useraccessmapping';

@Component({
  selector: 'app-emplogin',
  templateUrl: './emplogin.component.html',
  styleUrls: ['./emplogin.component.css']
})

export class EmploginComponent implements OnInit {
  EMAIL_ID = "";
  PASSWORD = "";
  passwordVisible: boolean = false;
  supportKey = "";
  ORGANIZATION_ID: number;
  isLogedIn: boolean = false;
  userAccessData: Useraccessmapping;
  userId: number = Number(this.cookie.get('userId'));
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: any[] = [];
  isSpinning: boolean = false;

  constructor(private router: Router, private api: ApiService, private message: NzNotificationService, private cookie: CookieService) { }

  ngOnInit(): void {
    if ((this.cookie.get('token') === '') || (this.cookie.get('userId') === '') || (this.cookie.get('token') === null)) {
      this.isLogedIn = false;
      this.router.navigate(['/adminlogin']);

    } else {
      this.isLogedIn = true;
      this.router.navigate(['/dashboard']);
    }

    const userId = '1';
    this.api.requestPermission(userId);
  }

  login(): void {
    this.EMAIL_ID = (this.EMAIL_ID == undefined) ? "" : this.EMAIL_ID;
    this.PASSWORD = (this.PASSWORD == undefined) ? "" : this.PASSWORD;

    if (this.EMAIL_ID == "") {
      this.message.error("Please Enter Valid Email", "");

    } else if (this.PASSWORD == "") {
      this.message.error("Please Enter Valid Password", "");

    } else {
      this.isSpinning = true;
      this.cookie.deleteAll();
      sessionStorage.clear();

      this.api.login(this.EMAIL_ID, this.PASSWORD).subscribe(data => {
        if (data['code'] == 200) {
          this.cookie.set('token', data["data"][0]["token"], 365, "", "", false, "Strict");
          this.cookie.set('userId', data["data"][0]['UserData'][0]['USER_ID'], 365, "", "", false, "Strict");
          this.cookie.set('userName', data["data"][0]['UserData'][0]['NAME'], 365, "", "", false, "Strict");
          this.cookie.set('roleId', data["data"][0]['UserData'][0]['ROLE_ID'], 365, "", "", false, "Strict");
          sessionStorage.setItem('userId', data["data"][0]['UserData'][0]['USER_ID']);
          sessionStorage.setItem('roleId', data["data"][0]['UserData'][0]['ROLE_ID']);
          sessionStorage.setItem('emailId', data["data"][0]['UserData'][0]['EMAIL_ID']);
          this.cookie.set('emailId', data["data"][0]['UserData'][0]['EMAIL_ID'], 365, "", "", false, "Strict")
          this.message.success("Successfully Logged In", "");

          // Add logs
          // this.api.addLog('L', 'Login Successfully', this.cookie.get('emailId')).subscribe(data => {
          //   console.log(data);

          // }, err => {
          //   console.log(err);

          //   if (err['ok'] == false)
          //     this.message.error("Server Not Found", "");
          // });

          window.location.reload();

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
