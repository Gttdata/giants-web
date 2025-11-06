import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { Membermaster } from '../Models/MemberMaster';
import { Useraccessmapping } from '../Models/useraccessmapping';
import { ApiService } from '../Service/api.service';

@Component({
  selector: 'app-trainer-accessor-login',
  templateUrl: './trainer-accessor-login.component.html',
  styleUrls: ['./trainer-accessor-login.component.css']
})

export class TrainerAccessorLoginComponent implements OnInit {
  EMAIL_ID: string = "";
  current = 0;
  PASSWORD: string = "";
  passwordVisible: boolean = false;
  newPasswordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  supportKey = "";
  successMessage = "";
  ORGANIZATION_ID: number;
  isLogedIn = false;
  ForgotPass = false;
  isGetOTP = false;
  verifydone = false;
  userAccessData: Useraccessmapping;
  userId = Number(this.cookie.get('userId'));
  drawerVisible: boolean;
  drawerTitle: string;
  drawerData: any[] = [];
  isSpinning: boolean = false;
  roleId = sessionStorage.getItem('roleId');
  data = new Membermaster();
  years: any[] = [];
  colleges: any[] = [];
  branches: any[] = [];
  mobileVerified: boolean = false;
  emailVerified: boolean = false;
  mobileOTP: boolean = false;
  emailOTP: boolean = false;
  emailLoding: boolean = false;
  mobileLoading: boolean = false;
  MOBILE_OTP_TEXT: string = "Get OTP";
  EMAIL_OTP_TEXT: string = "Get OTP";
  isVisible1 = false;
  EXPIRY_MSG = "";
  checked = false;
  eopt: string = "";
  mopt: string = "";
  PASS = "";
  CPASS = "";
  errorMessage = "";
  forgot = false;
  maxTimeEmail: any = 180;
  timerEmail: any;
  maxTimeMobile: any = 180;
  timerMobile: any;
  actualMobile = "";
  actualEmail = "";
  EMAIL_OTP_NUMBER = "";
  MOBILE_OTP_NUMBER = "";
  registerationDone = false;
  expiryDate = "2023-1-31 23:55:00";
  expirtVisible = false;
  currentDate: Date;
  currentDate1: string;
  deviceId = "";
  R_ID = 0;
  MOBILE_NO = "";
  OTP = "";
  states: any[] = [];
  showInfo = true;
  windowScrolled = false;
  isAlreadyemail = false;
  RESUME_URL = null;
  isokfile = false;
  RESUME_FILE_URL: string;
  date = new Date();
  date1 = this.datePipe.transform(this.date, 'yyyyMMddHHmmss');
  mobpattern;
  addOnBeforeTemplate;
  resendTrue = false;

  constructor(private datePipe: DatePipe, private router: Router, private api: ApiService, private message: NzNotificationService, private cookie: CookieService) { }

  ngOnInit() {
    if ((this.cookie.get('token') === '') || (this.cookie.get('userId') === '') || (this.cookie.get('token') === null)) {
      this.isLogedIn = false;
      this.router.navigate(['/login']);

    } else {
      this.isLogedIn = true;
      this.router.navigate(['/dashboard']);
    }

    const userId = '1';
    this.api.requestPermission(userId);
  }

  ForgotPassWord() {
    this.ForgotPass = true;
  }

  Back1() {
    this.ForgotPass = false;
    this.isGetOTP = false;
  }

  Back2() {
    this.ForgotPass = true;
    this.isGetOTP = false;
    this.resendTrue = false;
    this.maxTimeMobile = 180;
    clearTimeout(this.timerMobile);
  }

  login(): void {
    this.EMAIL_ID = (this.EMAIL_ID == undefined) ? "" : this.EMAIL_ID;
    this.PASSWORD = (this.PASSWORD == undefined) ? "" : this.PASSWORD;

    if (this.EMAIL_ID == "") {
      this.message.error("Please Enter Valid Email or Mobile No.", "");

    } else if (this.PASSWORD == "") {
      this.message.error("Please Enter Valid Password", "");

    } else {
      this.isSpinning = true;
      this.ForgotPass = false;

      this.api.memberlogin(this.EMAIL_ID, this.PASSWORD).subscribe(data => {
        if (data['code'] == 200) {
          this.message.success("Successfully Logged In", "");
          this.cookie.deleteAll();
          sessionStorage.clear();

          sessionStorage.setItem('userId', data["data"][0]['UserData'][0]['USER_ID']);
          sessionStorage.setItem('roleId', data["data"][0]['UserData'][0]['ROLE_ID']);
          sessionStorage.setItem('emailId', data["data"][0]['UserData'][0]['EMAIL_ID']);
          sessionStorage.setItem('LOGIN_DATE_TIME', data["data"][0]['DATE_TIME']);
          sessionStorage.setItem('FILTER', "MF");

          this.cookie.set('token', data["data"][0]["token"], 365, "", "", false, "Strict");
          this.cookie.set('userId', data["data"][0]['UserData'][0]['USER_ID'], 365, "", "", false, "Strict");
          this.cookie.set('userName', data["data"][0]['UserData'][0]['NAME'], 365, "", "", false, "Strict");
          this.cookie.set('roleId', data["data"][0]['UserData'][0]['ROLE_ID'], 365, "", "", false, "Strict");
          this.cookie.set('roleName', data["data"][0]['UserData'][0]['ROLE_NAME'], 365, "", "", false, "Strict");
          this.cookie.set('mobileNo', data["data"][0]['UserData'][0]['MOBILE_NUMBER'], 365, "", "", false, "Strict");
          this.cookie.set('emailId', data["data"][0]['UserData'][0]['EMAIL_ID'], 365, "", "", false, "Strict")
          this.cookie.set("profile", data["data"][0]['UserData'][0]['PROFILE_IMAGE'], 365, "", "", false, "Strict");
          this.cookie.set("gender", data["data"][0]['UserData'][0]['GENDER'], 365, "", "", false, "Strict");

          // Subscribe topics
          window.location.reload();

          this.api.getMemberChannels().subscribe(data => {
            if (data['code'] == 200) {
              this.cookie.set('channels', data["data"], 365, "", "", false, "Strict");
              let channels = data["data"].split(',');
              this.api.subscribeTokenToTopic(this.api.cloudID, channels);
            }

          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
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

  mailformat = /^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
  phoneno = /^\d{10}$/;

  omit(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }

  isValidMobile(mobile: any) {
    const expression = /^[6-9]\d{9}$/;
    return expression.test(String("" + mobile).toLowerCase());
  }

  generateRandomNumber(n: any) {
    return Math.floor(Math.pow(10, n - 1) + Math.random() * (Math.pow(10, n) - Math.pow(10, n - 1) - 1));
    // return Math.floor(Math.random() * (9 * Math.pow(10, n - 1))) + Math.pow(10, n - 1);
  }

  checkMobileOtp(): void {
    if (!this.isValidOTP(this.mopt)) {
      this.message.error("Please enter valid OTP", "");

    } else {
      if (this.mopt.length == 6) {
        this.api.verifyOTP(this.data.MOBILE_NUMBER, this.mopt).subscribe(successCode => {
          if (successCode['code'] == "200") {
            this.mobileVerified = true;
            this.verifydone = true;
            this.mobileOTP = false;
            this.data.MOBILE_NUMBER = this.actualMobile;
            this.message.success("Your mobile number verified successfully", "");

          } else if (successCode['code'] == "300") {
            this.mopt = "";
            document.getElementById('mopt').focus();
            this.message.error("OTP is incorrect", "");
            this.verifydone = false;

          } else {
            document.getElementById('mopt').focus();
            this.message.error("Something went wrong", "");
            this.verifydone = false;
          }
        });

      } else {
        this.mopt = "";
        document.getElementById('mopt').focus();
        this.message.error("Please enter valid OTP", "");
        this.verifydone = false;
      }
    }
  }

  sendOtpCode(): void {
    if (this.isValidMobile(this.data.MOBILE_NUMBER)) {
      if (this.MOBILE_OTP_TEXT == "Get OTP") {
        this.isSpinning = true;
        this.MOBILE_OTP_NUMBER = "" + this.generateRandomNumber(6);

        this.api.sendSMS(this.data.MOBILE_NUMBER).subscribe(successCode => {
          if (successCode['code'] == "200") {
            this.message.success("OTP Sent Successfully", "OTP sent through WhatsApp, please check your WhatsApp");
            this.mobileLoading = true;
            this.isGetOTP = true;
            this.MOBILE_OTP_TEXT = "(" + this.maxTimeMobile + ")";
            this.mobileOTP = true;
            this.mopt = "";
            this.StartTimerMobile();
            this.actualMobile = this.data.MOBILE_NUMBER;
            this.isSpinning = false;

          } else if (successCode['code'] == "300") {
            this.message.error("Something Went Wrong", "This mobile number is not registered with our system. Please contact to administrator");
            this.isSpinning = false;
            this.isGetOTP = false;

          } else {
            this.message.error(successCode['message'], "");
            this.isSpinning = false;
          }
        });
      }

      else {
        this.isSpinning = true;

        this.api.resendSMS(this.data.MOBILE_NUMBER).subscribe(successCode => {
          if (successCode['code'] == "200") {
            this.message.success("OTP Sent Successfully", "OTP sent through WhatsApp, please check your WhatsApp");
            this.mobileLoading = true;
            this.isGetOTP = true;
            this.MOBILE_OTP_TEXT = "(" + this.maxTimeMobile + ")";
            this.mobileOTP = true;
            this.mopt = "";
            this.StartTimerMobile();
            this.actualMobile = this.data.MOBILE_NUMBER;
            this.isSpinning = false;

          } else if (successCode['code'] == "300") {
            this.message.error("Something Went Wrong", "This mobile number is not registered with our system. Please contact to administrator");
            this.isSpinning = false;
            this.isGetOTP = false;

          } else {
            this.message.error(successCode['message'], "");
            this.isSpinning = false;
          }
        });
      }

    } else {
      this.message.error("Please enter valid mobile number", "");
      this.isGetOTP = false;
    }
  }

  StartTimerMobile(): void {
    this.timerMobile = setTimeout(() => {
      this.resendTrue = false;
      this.maxTimeMobile--;

      if (this.maxTimeMobile > 0) {
        this.StartTimerMobile();

      } else {
        this.maxTimeMobile = 180;
        this.resendTrue = true;
        clearTimeout(this.timerMobile);
      }

    }, 1000);
  }


  isValidOTP(mobile: any): boolean {
    const expression = /^\d{6}$/;
    return expression.test(String("" + mobile).toLowerCase());
  }

  verifyOTP(): void {
    if (!this.isValidOTP(this.mopt)) {
      this.message.error("Please enter valid OTP", "");

    } else {
      if (this.mopt.length == 6) {
        this.api.verifyOTP(this.data.MOBILE_NUMBER, this.mopt).subscribe(successCode => {
          if (successCode['code'] == "200") {
            this.mobileVerified = true;
            this.mobileOTP = false;
            this.data.MOBILE_NUMBER = this.actualMobile;
            this.message.success("Your mobile No. verified successfully", "");

          } else if (successCode['code'] == "300") {
            this.mopt = "";
            document.getElementById('mopt').focus();
            this.message.error("OTP is incorrect", "");

          } else {
            document.getElementById('mopt').focus();
            this.message.error("Something went wrong", "");
          }
        });

      } else {
        this.mopt = "";
        document.getElementById('mopt').focus();
        this.message.error("Please enter valid OTP", "");
      }
    }
  }

  UpdatePassword(): void {
    let isOk = true;
    this.PASS = (this.PASS == undefined) ? "" : this.PASS;

    if (this.PASS.trim() != "") {
      if ((this.PASS != undefined) && (this.PASS != null)) {
        if (this.PASS.length >= 8) {
          if ((/^(?=\D*\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z])(?=[^@#]*[@#]).{8,15}$/.test(this.PASS))) {
            if (this.PASS != this.CPASS) {
              isOk = false;
              this.message.error("New password and Re-entered password not matches", "");
            }

          } else {
            isOk = false;
            this.message.error('Password must contains at least one uppercase letter, one lowercase letter, one number and one special character (@ or #)', '');
          }

        } else {
          isOk = false;
          this.message.error("Password must be greater than or equal to 8 characters", "");
        }

      } else {
        isOk = false;
        this.message.error("Please Enter New Password", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter New Password", "");
    }

    if (isOk) {
      this.isGetOTP = true;

      this.api.changepasss(this.data.MOBILE_NUMBER, this.PASS).subscribe(successCode => {
        this.isGetOTP = false;

        if (successCode['code'] == 200) {
          this.successMessage = 'Password Changed Successfully';
          this.message.success(this.successMessage, "");
          this.verifydone = false;
          this.ForgotPass = false;
          this.isGetOTP = false;
          this.isLogedIn = false;
          // this.data.MOBILE_NUMBER = this.actualMobile;
          this.data.MOBILE_NUMBER = undefined;
          this.PASS = undefined;
          this.CPASS = undefined;

        } else if (successCode['code'] == 300) {
          this.errorMessage = 'Something Went Wrong, Please Try Again';
          this.message.error(this.errorMessage, "");

        } else if (successCode['code'] == 400) {
          this.errorMessage = 'Something Went Wrong, Please Try Again';
          this.message.error(this.errorMessage, "");
        }

      }, err => {
        this.errorMessage = 'Something Went Wrong, Please Try Again';
        this.message.error(this.errorMessage, "");
        this.isSpinning = false;
      });
    }
  }
}
