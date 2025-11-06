import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrganizationMaster } from '../Models/organization-master';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs'
import { NzNotificationService } from 'ng-zorro-antd'
import { Department } from '../Models/department';

@Injectable({
  providedIn: 'root'
})

export class EmmService {
  currentMessage = new BehaviorSubject(null);
  cloudID
  ORGANIZATION_ID = this.cookie.get('ORGANIZATION_ID')
  clientId = 1
  httpHeaders = new HttpHeaders();
  options = {
    headers: this.httpHeaders
  };

  // baseUrl = "http://192.168.3.55:4440/api"
  // baseUrl = "http://192.168.0.9:8000/"
  baseUrl = "https://tickdesk.kredpool.com:9440/"
  url = this.baseUrl + "api/"
  loggerUrl = this.baseUrl + "logger/"
  imgUrl = this.baseUrl + "upload/"
  retriveimgUrl = this.baseUrl + "static/";

  constructor(private cookie: CookieService, private message: NzNotificationService, private httpClient: HttpClient) {
    if (this.cookie.get('deviceId') === '' || this.cookie.get('deviceId') === null) {
      var deviceId = Math.floor(100000 + Math.random() * 900000)
      this.cookie.set('deviceId', deviceId.toString(), 365, "", "", false, "Strict");
      //localStorage.setItem("deviceId",deviceId.toString())
    }

    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': '9876543210',
      'deviceid': this.cookie.get('deviceId'),
      'visitorid': this.cookie.get('visitorId'),
      'supportkey': this.cookie.get('supportKey'),
      'Token': this.cookie.get('token'),
    });

    this.options = {
      headers: this.httpHeaders
    };

    // this.angularFireMessaging.messaging.subscribe(
    //   (_messaging) => {
    //     _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    //     _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    //   }
    // )
  }

  login(email: string, password: string) {
    this.httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': '9876543210',
      'deviceid': this.cookie.get('deviceId'),
      'visitorid': this.cookie.get('visitorId'),
      'supportkey': this.cookie.get('supportKey'),
      'Token': this.cookie.get('token'),
    });

    this.options = {
      headers: this.httpHeaders
    };

    var data = {
      username: email,
      password: password,
      cloudid: this.cloudID,
    };

    console.log(this.options.headers)
    return this.httpClient.post(this.baseUrl + "user/login", JSON.stringify(data), this.options);
  }


  receiveMessage() {
    // this.angularFireMessaging.messages.subscribe(
    //   (payload) => {
    //     console.log("new message received. ", payload);
    //     this.message.info(payload['data']['title']+payload['data']['body'],"")
    //     this.currentMessage.next(payload);
    //   })
  }

  requestPermission(userId) {
    // this.angularFireMessaging.requestToken.subscribe(
    //   (token) => {
    //     console.log(token);
    //     this.cloudID=token
    //     console.log("tokan"+this.cloudID)
    //    //this.updateToken(userId, token);
    //   },
    //   (err) => {
    //     console.error('Unable to get permission to notify.', err);
    //   }
    // );
  }

  httpHeaders1 = new HttpHeaders({
    'Accept': 'application/json',
    'apikey': '9876543210',
    'Token': this.cookie.get('token'),
  });

  options1 = {
    headers: this.httpHeaders1
  };


  onUpload(folderName, selectedFile, filename) {
    console.log(this.httpHeaders1)
    const fd = new FormData()
    fd.append("Image", selectedFile, filename)

    this.httpClient.post(this.imgUrl + folderName, fd, this.options1)
      .subscribe(res => {
        console.log(res);
      });
  }

  loggerInit() {
    console.log("looger")
    var data = {};

    return this.httpClient.post(this.loggerUrl + "init", JSON.stringify(data), this.options);
  }

  getAllOrganizations(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<OrganizationMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter
    };

    return this.httpClient.post<OrganizationMaster[]>(this.url + "organization/get", JSON.stringify(data), this.options);
  }

  createOrganization(organization: OrganizationMaster): Observable<number> {
    organization.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(this.url + "organization/create/", JSON.stringify(organization), this.options);
  }

  updateOrganization(organization: OrganizationMaster): Observable<number> {
    organization.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(this.url + "organization/update/", JSON.stringify(organization), this.options);
  }

  mapEvaluationCriteria(roleId1: number, data1: string[]): Observable<number> {
    var data = {
      roleId: roleId1,
      data: data1,
    };

    return this.httpClient.post<number>(this.url + "roleCriteriaMapping/addBulk", data, this.options);
  }

  mapLeaves(roleId1: number, data1: string[]): Observable<number> {
    var data = {
      roleId: roleId1,
      data: data1,
    };

    return this.httpClient.post<number>(this.url + "roleLeaveMapping/addBulk", data, this.options);
  }

  addRoleDetails(roleId1: number, data1: string[]): Observable<number> {
    var data = {
      roleId: roleId1,
      data: data1,
    };

    return this.httpClient.post<number>(this.url + "roleDetails/addBulk", data, this.options);
  }

  generateFiles(type: string, id1: number): Observable<string[]> {
    var data = {
      id: id1
    };

    return this.httpClient.post<string[]>(this.url + "generate/" + type + "/", JSON.stringify(data), this.options);
  }

  getAllDepartments(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<Department[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter
    };

    return this.httpClient.post<Department[]>(this.url + "department/get", JSON.stringify(data), this.options);
  }

  createDepartment(department: Department): Observable<number> {
    department.ORG_ID = +this.ORGANIZATION_ID
    department.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(this.url + "department/create/", JSON.stringify(department), this.options);
  }

  updateDepartment(department: Department): Observable<number> {
    department.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(this.url + "department/update/", JSON.stringify(department), this.options);
  }
}