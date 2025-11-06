import { Injectable } from "@angular/core";
import { BehaviorSubject, concat, Observable, of } from "rxjs";
import { HttpHeaders, HttpClient, HttpEvent, HttpParams, HttpRequest } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { NzNotificationService } from "ng-zorro-antd";
import { AngularFireMessaging } from "@angular/fire/messaging";
import { FederationMaster } from "../Models/FederationMaster";
import { UnitMaster } from "../Models/UnitMaster";
import { ProjectMaster } from "../Models/ProjectMaster";
import { InchargeAreaMatser } from "../Models/InchargeAreaMaster";
import { GroupMaster } from "../Models/GroupMaster";
import { Membermaster } from "../Models/MemberMaster";
import { GroupMeetAttendance } from "../Models/GroupMeetAttendance";
import { GroupActivityMaster } from "../Models/GroupActivityMaster";
import { InchargeActivity } from "../Models/InchargeActivity";
import { InchargeMeeting } from "../Models/InchargeMeeting";
import { Comments, EventComment, Likes } from "../Models/comment";
import { GroupProjectMaster } from "../Models/GroupProjectMaster";
import { PaymentCollection } from "../Models/PaymentCollection";
import { VicePresident } from "../Models/vice-president";
import { OutstandingGroupMaster } from "../Models/OutstandingGroupMaster";
import { Awardmaster } from "../Models/AwardMaster";
import { BestServiceProjectMaster } from "../Models/BestServiceProjectMaster";
import { OutstandingMonumental } from "../Models/OutstandingMonumental";
import { OustandingYoungGiantsDivisionMaster } from "../Models/OutstandingYoungGiantsDivision";
import { REPORTSCHEDULE } from "../Models/report-schedule";
import { Rform } from "../Models/rform";
import { MonthlyReportSubmission } from "../Models/MonthlyReportSubmission";
import { LetterHeadMaster } from "../Models/LetterHeadMaster";
import { catchError } from "rxjs/operators";
import { MonthlyGroupReport } from "../Models/MonthlyGroupReport";
import { SystemFeesMaster } from "../Models/SystemFeesMaster";
import { Post } from "../Models/post";
import { programmeTypeMaster } from "../Models/programmeTypeMaster";
import { CertificateMaster } from "../Models/CertificateMaster";
import { AwardsMaster } from "../Models/AwardsMaster";
import { ConventionalMemberMapping } from "../Models/ConventionalMemberMapping";
import { AuditReport } from "../Models/AuditReport";

@Injectable({
  providedIn: "root",
})

export class ApiService {
  currentMessage = new BehaviorSubject(null);
  cloudID: any;
  clientId: number = 1;
  defaultHashtags: string = "GiantsWelfareFoundation,giants,SocialWork";

  httpHeaders = new HttpHeaders();
  options = {
    headers: this.httpHeaders,
  };

  httpHeaders1 = new HttpHeaders();
  options1 = {
    headers: this.httpHeaders1,
  };

  gmUrl = "https://gm.tecpool.in:8078/";

  // Local Server URL
  // baseUrl = "http://192.168.29.186:8930/";
  // baseUrl = "https://7bef-2405-201-1011-1028-780b-24d3-9cab-d536.ngrok-free.app/";

  // Development Server URL
  // baseUrl = "https://giantsdemo.uvtechsoft.com:8928/";

  // Production Server URL
  baseUrl = "https://memberportal.giantsinternational.org:8929/";

  url = this.baseUrl + "api/";
  //loggerUrl =  this.baseUrl + "logger/";
  imgUrl = this.baseUrl + "upload/";
  apkUrl = this.baseUrl + "upload/App/";
  retriveimgUrl = this.baseUrl + "static/";
  applicationId: number = 1;
  moduleId: number = Number(this.cookie.get("moduleId"));
  userId: number = Number(this.cookie.get("userId"));
  roleId: number = Number(this.cookie.get("roleId"));
  orgId: number = Number(this.cookie.get("orgId"));
  deviceId: number = Number(this.cookie.get("deviceId"));
  encryptSecretKey = 'giantswelfarefoundation';
  EncryptKey: number = 1203199320052021;
  EncryptIV: number = 1203199320052021;

  constructor(
    private cookie: CookieService,
    private message: NzNotificationService,
    private httpClient: HttpClient,
    private angularFireMessaging: AngularFireMessaging,
  ) {
    if ((this.cookie.get("deviceId") === "") || (this.cookie.get("deviceId") === null)) {
      var deviceId = this.randomstring(16);
      this.cookie.set("deviceId", deviceId.toString(), 365, "", "", false, "Strict");
    }

    this.httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      apikey: "uEasCQeYxENglqc9uiHQ5xRvjB73PtSi",
      applicationkey: "JCuYZ9tY949LohRi",
      deviceid: this.cookie.get("deviceId"),
      supportkey: this.cookie.get("supportKey"),
      Token: this.cookie.get("token"),
    });

    this.options = {
      headers: this.httpHeaders,
    };

    this.angularFireMessaging.messaging.subscribe((_messaging) => {
      _messaging.onMessage = _messaging.onMessage.bind(_messaging);
      _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    });
  }

  login(email: string, password: string): Observable<any[]> {
    this.httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      apikey: "uEasCQeYxENglqc9uiHQ5xRvjB73PtSi",
      applicationkey: "JCuYZ9tY949LohRi",
      deviceid: this.cookie.get("deviceId"),
      supportkey: this.cookie.get("supportKey"),
      Token: this.cookie.get("token"),
    });

    this.options = {
      headers: this.httpHeaders,
    };

    var data = {
      username: email,
      password: password,
      TYPE: "W",
      DEVICE_ID: "A",
    };

    return this.httpClient.post<any[]>(
      this.baseUrl + "user/login",
      JSON.stringify(data),
      this.options
    );
  }

  employeelogin(email: string, password: string): Observable<any[]> {
    this.httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      apikey: "uEasCQeYxENglqc9uiHQ5xRvjB73PtSi",
      applicationkey: "JCuYZ9tY949LohRi",
      deviceid: this.cookie.get("deviceId"),
      supportkey: this.cookie.get("supportKey"),
      Token: this.cookie.get("token"),
    });

    this.options = {
      headers: this.httpHeaders,
    };

    var data = {
      username: email,
      password: password,
      TYPE: "W",
      DEVICE_ID: "A",
    };

    return this.httpClient.post<any[]>(
      this.baseUrl + "employee/login",
      JSON.stringify(data),
      this.options
    );
  }

  memberlogin(email: string, password: string): Observable<any[]> {
    this.httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      apikey: "uEasCQeYxENglqc9uiHQ5xRvjB73PtSi",
      applicationkey: "JCuYZ9tY949LohRi",
      deviceid: this.cookie.get("deviceId"),
      supportkey: this.cookie.get("supportKey"),
      Token: this.cookie.get("token"),
    });

    this.options = {
      headers: this.httpHeaders,
    };

    var data = {
      username: email,
      password: password,
      TYPE: "W",
      DEVICE_ID: "A",
    };

    return this.httpClient.post<any[]>(
      this.baseUrl + "member/login",
      JSON.stringify(data),
      this.options
    );
  }

  trainerAccessorlogin(email: string, password: string): Observable<any[]> {
    this.httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      apikey: "uEasCQeYxENglqc9uiHQ5xRvjB73PtSi",
      applicationkey: "JCuYZ9tY949LohRi",
      deviceid: this.cookie.get("deviceId"),
      supportkey: this.cookie.get("supportKey"),
      Token: this.cookie.get("token"),
    });

    this.options = {
      headers: this.httpHeaders,
    };

    var data = {
      username: email,
      password: password,
      TYPE: "W",
      DEVICE_ID: "A",
    };

    return this.httpClient.post<any[]>(
      this.baseUrl + "trainer/login",
      JSON.stringify(data),
      this.options
    );
  }

  randomstring(L) {
    var s = "";

    var randomchar = function () {
      var n = Math.floor(Math.random() * 62);
      if (n < 10) return n; //1-10
      if (n < 36) return String.fromCharCode(n + 55); //A-Z
      return String.fromCharCode(n + 61); //a-z
    };

    while (s.length < L) s += randomchar();
    return s;
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe((payload) => {
      console.log("new message received. ", payload);
      this.currentMessage.next(payload);
      this.message.info(
        payload["notification"]["title"],
        payload["notification"]["body"],
        { nzDuration: 0 }
      );
    });
  }

  subscribeTokenToTopic(token: any, topic: any) {
    this.httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `key= AAAAVM2R_rI:APA91bGOluvSPCVNouGePNI0KxG1XhF09u69xB5s9tnqhFddvCLGZcMqoEnQrmSMM-CXUfLh2uZZPB0JGeDiavayd4oSl3ADw_Ft6iS0jGqBkysT3_upWREyEGphtaTEhyqtL3Obubfh`,
    });

    var options22 = {
      headers: this.httpHeaders,
    };

    let httpReqs = topic.map((i) =>
      this.httpClient.post(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${i}`, {}, options22).pipe(catchError((err) => of({ err })))
    );

    concat(...httpReqs).subscribe((data) => {
      // window.location.reload();
    });

    return true;
  }

  unsubscribeTokenToTopic(token) {
    var d = this.cookie.get("channels");
    var channels = d.split(",");
    var bodyArray = [];

    for (var i = 0; i < channels.length; i++) {
      if (channels[i] != null && channels[i].trim() != "") {
        var b = {
          to: "/topics/" + channels[i],
          registration_tokens: [token],
        };

        bodyArray.push(b);
      }

      if (i == channels.length - 1) {
        this.httpHeaders = new HttpHeaders({
          "Content-Type": "application/json",
          Authorization: `key= AAAAVM2R_rI:APA91bGOluvSPCVNouGePNI0KxG1XhF09u69xB5s9tnqhFddvCLGZcMqoEnQrmSMM-CXUfLh2uZZPB0JGeDiavayd4oSl3ADw_Ft6iS0jGqBkysT3_upWREyEGphtaTEhyqtL3Obubfh`,
        });

        var options22 = {
          headers: this.httpHeaders,
        };

        let httpReqs = bodyArray.map((i) =>
          this.httpClient.post(`https://iid.googleapis.com/iid/v1:batchRemove`, i, options22).pipe(catchError((err) => of({ err })))
        );

        concat(...httpReqs).subscribe((data) => {
          this.cookie.deleteAll();
          sessionStorage.clear();
          window.location.reload();
        });
      }
    }

    return true;

    // fetch(`https://iid.googleapis.com/iid/v1:batchRemove`, {
    //   method: 'POST',
    //   body: JSON.stringify(b),
    //   headers: new Headers({
    //     'Content-Type': 'application/json',
    //     'Authorization': `key= AAAAVM2R_rI:APA91bGOluvSPCVNouGePNI0KxG1XhF09u69xB5s9tnqhFddvCLGZcMqoEnQrmSMM-CXUfLh2uZZPB0JGeDiavayd4oSl3ADw_Ft6iS0jGqBkysT3_upWREyEGphtaTEhyqtL3Obubfh`
    //   })
    // })
    //   .then((response) => {
    //     if (response.status < 200 || response.status >= 400) {
    //       console.log(response.status, response);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(error.result);
    //   });
  }

  // public async updatePushToken(token: string,userId) {
  //   try {
  //     const devices = await this.angularFireMessaging.firestore.collection('Devices').where('token', '==', token).get();

  //     if (devices.empty) {
  //       const deviceInfo = this.deviceService.getDeviceInfo();
  //       const data = {
  //         token: token,
  //         userId: userId,
  //         deviceType: 'web',
  //         deviceInfo: {
  //           browser: deviceInfo.browser,
  //           userAgent: deviceInfo.userAgent
  //         },
  //         createdAt: firestore.FieldValue.serverTimestamp()
  //       };

  //       await this.angularFireMessaging.firestore.collection('Devices').add(data);
  //       console.log('New Device Added');
  //     } else {
  //       console.log('Already existing Device');
  //     }
  //   } catch (error) {
  //     console.log("Error Message", error);
  //   }
  // }

  requestPermission(userId) {
    this.angularFireMessaging.requestToken.subscribe((token) => {
      console.log(token);
      this.cloudID = token;

    }, (err) => {
      console.error("Unable to get permission to notify.", err);
    });
  }

  onUploadNewMethod(selectedFile, ext, fKey) {
    this.httpHeaders1 = new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json',
      'f_key': fKey,
      'f_ext': ext,
      'supportkey': this.cookie.get('supportKey'),
      'apikey': 'uEasCQeYxENglqc9uiHQ5xRvjB73PtSi',
      'applicationkey': 'JCuYZ9tY949LohRi',
      'Token': this.cookie.get('token'),
    });

    this.options1 = {
      headers: this.httpHeaders1,
    };

    const fd = new FormData();
    fd.append("F_DATA", selectedFile);
    fd.append("F_EXT", ext);
    fd.append("F_KEY", fKey);
    return this.httpClient.post(
      this.baseUrl + "file/upload",
      fd,
      this.options1
    );
  }

  getFile(lkey) {
    var data = {
      L_KEY: lkey,
    };

    return this.httpClient.post(
      this.baseUrl + "file/getFile",
      JSON.stringify(data),
      this.options
    );
  }

  onUpload(folderName, selectedFile, filename) {
    //console.log(this.httpHeaders1)
    const fd = new FormData();
    fd.append("Image", selectedFile, filename);
    //console.log("selected file" + JSON.stringify(selectedFile))
    //console.log("form data: " + fd)
    this.httpClient
      .post(this.imgUrl + folderName, fd, this.options1)
      .subscribe((res) => {
        //console.log(res);
      });
  }

  onUpload2(folderName, selectedFile, filename, selectedOriginalFile: any = "") {
    this.httpHeaders1 = new HttpHeaders({
      'Accept': 'application/json',
      'apikey': 'uEasCQeYxENglqc9uiHQ5xRvjB73PtSi',
      'applicationkey': 'JCuYZ9tY949LohRi',
      'deviceid': this.cookie.get('deviceId'),
      'supportkey': this.cookie.get('supportKey'),
      'Token': this.cookie.get('token'),
    });

    this.options1 = {
      headers: this.httpHeaders1,
    };

    const fd = new FormData();
    fd.append("Image", selectedFile, filename);

    if (selectedOriginalFile != "") {
      fd.append("originalImage", selectedOriginalFile, filename);
    }

    return this.httpClient.post(this.imgUrl + folderName, fd, this.options1);
  }

  onFileUploadWithProgress(folderName, selectedFile, filename): Observable<HttpEvent<any>> {
    this.httpHeaders1 = new HttpHeaders({
      'supportkey': this.cookie.get('supportKey'),
      'apikey': 'uEasCQeYxENglqc9uiHQ5xRvjB73PtSi',
      'applicationkey': 'JCuYZ9tY949LohRi',
      'Token': this.cookie.get('token'),
    });

    const fd = new FormData();
    fd.append("Apk", selectedFile, filename);
    let params = new HttpParams();

    const options = {
      headers: this.httpHeaders1,
      params: params,
      reportProgress: true,
    };

    const req = new HttpRequest("POST", this.apkUrl, fd, options);
    return this.httpClient.request(req);
  }

  onFileUpload2(file): Observable<HttpEvent<any>> {
    this.httpHeaders1 = new HttpHeaders({
      supportkey: this.cookie.get("supportKey"),
      apikey: "uEasCQeYxENglqc9uiHQ5xRvjB73PtSi",
      applicationkey: "JCuYZ9tY949LohRi",
      Token: this.cookie.get("token"),
    });

    const fd = new FormData();
    fd.append("FILE", file);
    let params = new HttpParams();

    const options = {
      headers: this.httpHeaders1,
      params: params,
      reportProgress: true,
    };

    const req = new HttpRequest(
      "POST",
      this.url + "folder/upload/",
      fd,
      options
    );

    return this.httpClient.request(req);
  }

  loggerInit() {
    var data = {
      CLIENT_ID: this.clientId,
    };

    this.httpHeaders1 = new HttpHeaders({
      Accept: "application/json",
      supportkey: this.cookie.get("supportKey"),
      apikey: "SLQphsR7FlH8K3jRFnv23Mayp8jlnp9R",
      applicationkey: "JCuYZ9tY949LohRi",
      Token: this.cookie.get("token"),
      deviceid: this.cookie.get("deviceId"),
      "Content-Type": "application/json",
    });

    this.options1 = {
      headers: this.httpHeaders1,
    };

    return this.httpClient.post(
      this.gmUrl + "device/init",
      JSON.stringify(data),
      this.options1
    );
  }

  addLog(type, text, userId): Observable<number> {
    var data = {
      LOG_TYPE: type,
      LOG_TEXT: text,
      USER_ID: userId,
      CLIENT_ID: this.clientId,
    };

    return this.httpClient.post<number>(
      this.gmUrl + "device/addLog",
      JSON.stringify(data),
      this.options
    );
  }

  getAllclusterMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "cluster/get",
      JSON.stringify(data),
      this.options
    );
  }

  createclusterMaster(ticketGroup: any): Observable<any> {
    ticketGroup.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + "cluster/create/",
      JSON.stringify(ticketGroup),
      this.options
    );
  }

  updateclusterMaster(ticketGroup: any): Observable<any> {
    ticketGroup.CLIENT_ID = this.clientId;

    return this.httpClient.put<any>(
      this.url + "cluster/update/",
      JSON.stringify(ticketGroup),
      this.options
    );
  }

  getAllclusterbranchMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "clusterBranch/get",
      JSON.stringify(data),
      this.options
    );
  }

  createclusterbranchMaster(ticketGroup: any): Observable<any> {
    ticketGroup.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + "clusterBranch/create/",
      JSON.stringify(ticketGroup),
      this.options
    );
  }

  updateclusterbranchMaster(ticketGroup: any): Observable<any> {
    ticketGroup.CLIENT_ID = this.clientId;

    return this.httpClient.put<any>(
      this.url + "clusterBranch/update/",
      JSON.stringify(ticketGroup),
      this.options
    );
  }

  getAllemployeeMaster(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "employee/get",
      JSON.stringify(data),
      this.options
    );
  }

  createemployeeMaster(ticketGroup: any): Observable<any> {
    ticketGroup.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + "employee/create/",
      JSON.stringify(ticketGroup),
      this.options
    );
  }

  updateemployeeMaster(ticketGroup: any): Observable<any> {
    ticketGroup.CLIENT_ID = this.clientId;

    return this.httpClient.put<any>(
      this.url + "employee/update/",
      JSON.stringify(ticketGroup),
      this.options
    );
  }

  getAllRoles(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<[]>(
      this.url + "role/get",
      JSON.stringify(data),
      this.options
    );
  }

  checkTextBoxIsValid1(value: any) {
    const expression = /^[A-Za-z1-9 ]*$/;
    return expression.test(String("" + value).toLowerCase());
  }

  getChannels(): Observable<number> {
    this.httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      apiKey: "uEasCQeYxENglqc9uiHQ5xRvjB73PtSi",
      applicationkey: "JCuYZ9tY949LohRi",
      supportKey: this.cookie.get("supportKey"),
      TOKEN: this.cookie.get("token")
    });

    this.options = {
      headers: this.httpHeaders,
    };

    var data = {
      CLOUD_ID: this.cloudID,
      EMPLOYEE_ID: Number(this.cookie.get("userId"))
    };

    return this.httpClient.post<any>(this.url + "employee/submitToken/", JSON.stringify(data), this.options);
  }

  getMemberChannels(): Observable<number> {
    this.httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      apiKey: "uEasCQeYxENglqc9uiHQ5xRvjB73PtSi",
      applicationkey: "JCuYZ9tY949LohRi",
      supportKey: this.cookie.get("supportKey"),
      TOKEN: this.cookie.get("token"),
    });

    this.options = {
      headers: this.httpHeaders,
    };

    var data = {
      CLOUD_ID: this.cloudID,
      EMPLOYEE_ID: Number(this.cookie.get("userId"))
    };

    return this.httpClient.post<any>(this.url + "member/submitToken/", JSON.stringify(data), this.options);
  }

  logout(): Observable<number> {
    this.httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      apiKey: "uEasCQeYxENglqc9uiHQ5xRvjB73PtSi",
      applicationkey: "JCuYZ9tY949LohRi",
      supportKey: this.cookie.get("supportKey"),
      TOKEN: this.cookie.get("token"),
    });

    this.options = {
      headers: this.httpHeaders,
    };

    var data = {
      EMPLOYEE_ID: Number(this.cookie.get("userId")),
      DATE_TIME: sessionStorage.getItem("LOGIN_DATE_TIME"),
    };

    return this.httpClient.post<any>(this.url + "employee/clearToken/", JSON.stringify(data), this.options);
  }

  getAllnotification(): Observable<number> {
    this.httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
      apiKey: "uEasCQeYxENglqc9uiHQ5xRvjB73PtSi",
      applicationkey: "JCuYZ9tY949LohRi",
      supportKey: this.cookie.get("supportKey"),
      TOKEN: this.cookie.get("token"),
    });

    this.options = {
      headers: this.httpHeaders,
    };

    var data = {
      EMPLOYEE_ID: Number(this.cookie.get("userId")),
    };

    return this.httpClient.post<any>(
      this.url + "employee/getNotifications/",
      JSON.stringify(data),
      this.options
    );
  }

  onFileUpload(folderID, file, ownerID, tag, desc) {
    this.httpHeaders1 = new HttpHeaders({
      supportkey: this.cookie.get("supportKey"),
      apikey: "uEasCQeYxENglqc9uiHQ5xRvjB73PtSi",
      applicationkey: "JCuYZ9tY949LohRi",
      Token: this.cookie.get("token"),
    });

    this.options1 = {
      headers: this.httpHeaders1,
    };

    const fd = new FormData();
    fd.append("PARENT_ID", folderID);
    fd.append("FOLDER_FILE", "L");
    fd.append("FILE", file);
    fd.append("OWNER_ID", ownerID);
    fd.append("TAGS", tag);
    fd.append("DESCRIPTION", desc);

    return this.httpClient.post(this.url + "folder/upload/", fd, this.options1);
  }

  onFileUpload1(
    folderID,
    file,
    ownerID,
    tag,
    desc
  ): Observable<HttpEvent<any>> {
    this.httpHeaders1 = new HttpHeaders({
      supportkey: this.cookie.get("supportKey"),
      apikey: "uEasCQeYxENglqc9uiHQ5xRvjB73PtSi",
      applicationkey: "JCuYZ9tY949LohRi",
      Token: this.cookie.get("token"),
    });

    const fd = new FormData();
    fd.append("PARENT_ID", folderID);
    fd.append("FOLDER_FILE", "L");
    fd.append("FILE", file);
    fd.append("OWNER_ID", ownerID);
    fd.append("TAGS", tag);
    fd.append("DESCRIPTION", desc);

    let params = new HttpParams();

    const options = {
      headers: this.httpHeaders1,
      params: params,
      reportProgress: true,
    };

    const req = new HttpRequest(
      "POST",
      this.url + "folder/upload/",
      fd,
      options
    );

    return this.httpClient.request(req);
  }

  // Text box Validation
  checkTextBoxIsValid(value: any) {
    const expression = /^[A-Za-z0-9. ]*$/;
    return expression.test(String("" + value).toLowerCase());
  }

  // Text box Validation
  checkTextBoxWithDashIsValid(value: any) {
    const expression = /^[A-Za-z0-9- ]*$/;
    return expression.test(String("" + value).toLowerCase());
  }

  // Text box Validation
  checkTextBoxIsValidWithRoundBrackets(value: any) {
    const expression = /^[A-Za-z0-9() ]*$/;
    return expression.test(String("" + value).toLowerCase());
  }

  // Text box Validation
  checkTextBoxIsValidWithComma(value: any) {
    const expression = /^[A-Za-z0-9, ]*$/;
    return expression.test(String("" + value).toLowerCase());
  }

  getAllFederations(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<FederationMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<FederationMaster[]>(
      this.url + "federation/get",
      JSON.stringify(data),
      this.options
    );
  }

  getAllFederationsOpenAPI(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<FederationMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<FederationMaster[]>(
      this.baseUrl + "federation/get",
      JSON.stringify(data),
      this.options
    );
  }

  getFederationsTilesDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<FederationMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<FederationMaster[]>(
      this.url + "federation/getTilesFederationCount",
      JSON.stringify(data),
      this.options
    );
  }

  updateFederationBOD(federationBODData: any): Observable<number> {
    federationBODData.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "federationBOD/update",
      JSON.stringify(federationBODData),
      this.options
    );
  }

  deleteFederationBOD(id: number): Observable<number> {
    var data = {
      ID: id
    };

    return this.httpClient.post<number>(this.url + "federationBOD/delete", JSON.stringify(data), this.options);
  }

  getFederationBOD(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<FederationMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<FederationMaster[]>(
      this.url + "federationBOD/get",
      JSON.stringify(data),
      this.options
    );
  }

  updateGroupBOD(groupBODData: any): Observable<number> {
    groupBODData.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "groupBOD/update",
      JSON.stringify(groupBODData),
      this.options
    );
  }

  deleteGroupBOD(id: number): Observable<number> {
    var data = {
      ID: id
    };

    return this.httpClient.post<number>(this.url + "groupBOD/delete", JSON.stringify(data), this.options);
  }

  getGroupBOD(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<FederationMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<FederationMaster[]>(
      this.url + "groupBOD/get",
      JSON.stringify(data),
      this.options
    );
  }

  updateUnitBOD(unitBODData: any): Observable<number> {
    unitBODData.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "unitBOD/update",
      JSON.stringify(unitBODData),
      this.options
    );
  }

  deleteUnitBOD(id: number): Observable<number> {
    var data = {
      ID: id
    };

    return this.httpClient.post<number>(this.url + "unitBOD/delete", JSON.stringify(data), this.options);
  }

  getUnitBOD(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<[]>(
      this.url + "unitBOD/get",
      JSON.stringify(data),
      this.options
    );
  }

  createFederation(model: FederationMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "federation/create",
      JSON.stringify(model),
      this.options
    );
  }

  updateFederation(model: FederationMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "federation/update",
      JSON.stringify(model),
      this.options
    );
  }

  assignFederation(
    whose: number,
    model: FederationMaster,
    presidentID: number
  ): Observable<number> {
    var data = {
      ROLE_ID: whose,
      ID: model.ID,
      PRESIDENT: presidentID,
      IPP: presidentID,
      VP1: presidentID,
      VP2: presidentID,
      VP3: presidentID,
      SECRETORY: presidentID,
      CO_SECRETORY: presidentID,
      TREASURER: presidentID,
      PRO1: presidentID,
      PRO2: presidentID,
      CO_ORDINATOR: presidentID,
      SPECIAL_OFFICER1: presidentID,
      SPECIAL_OFFICER2: presidentID,
      SPECIAL_OFFICER3: presidentID,
      SPECIAL_OFFICER4: presidentID,
    };

    return this.httpClient.post<number>(
      this.url + "federation/assignFederation",
      JSON.stringify(data),
      this.options
    );
  }

  assignFederationBOD(federationMemberData: any): Observable<number> {
    federationMemberData["CLIENT_ID"] = this.clientId;

    return this.httpClient.post<number>(
      this.url + "federationBOD/assignBOD",
      JSON.stringify(federationMemberData),
      this.options
    );
  }

  assignAdminRoles(memberData: any): Observable<number> {
    memberData["CLIENT_ID"] = this.clientId;

    return this.httpClient.post<number>(
      this.url + "member/assignSpecialBody",
      JSON.stringify(memberData),
      this.options
    );
  }

  sendForApproval(data: any): Observable<number> {
    return this.httpClient.post<number>(
      this.url + "group/sendApproval",
      JSON.stringify(data),
      this.options
    );
  }

  sendApprovalEmailFromUnitDirector(data: any): Observable<number> {
    return this.httpClient.post<number>(
      this.url + "groupBODStatus/checkPDFList",
      JSON.stringify(data),
      this.options
    );
  }

  sendForApprovalToUnitDirector(data: any): Observable<number> {
    return this.httpClient.post<number>(this.url + "groupBODStatus/checkGroupBOD", JSON.stringify(data), this.options);
  }

  sendForGroupApprovalToUnitDirector(data: any): Observable<number> {
    return this.httpClient.post<number>(this.url + "groupBODStatus/checkGroupBOD", JSON.stringify(data), this.options);
  }

  sendToUnitDirector(newGroupID: number, groupID: number): Observable<number> {
    var data = {
      NEW_GROUP_ID: newGroupID,
      GROUP_ID: groupID
    };

    return this.httpClient.post<number>(
      this.url + "group/sendToUnitDirector",
      JSON.stringify(data),
      this.options
    );
  }

  assignUnit(
    whose: number,
    model: UnitMaster,
    presidentID: number
  ): Observable<number> {
    var data = {
      ROLE_ID: whose,
      ID: model.ID,
      DIRECTOR: presidentID,
      OFFICER1: presidentID,
      OFFICER2: presidentID,
      VP: presidentID,
    };

    return this.httpClient.post<number>(
      this.url + "unit/assignUnit",
      JSON.stringify(data),
      this.options
    );
  }

  assignUnitBOD(unitMemberData: any): Observable<number> {
    unitMemberData["CLIENT_ID"] = this.clientId;

    return this.httpClient.post<number>(
      this.url + "unitBOD/assignBOD",
      JSON.stringify(unitMemberData),
      this.options
    );
  }

  assignGroup(
    whose: number,
    model: GroupMaster,
    presidentID: number
  ): Observable<number> {
    var data = {
      ROLE_ID: whose,
      ID: model.ID,
      PRESIDENT: presidentID,
      VPI: presidentID,
      VPE: presidentID,
      SECRETORY: presidentID,
      TREASURER: presidentID,
      DIRECTOR1: presidentID,
      DIRECTOR2: presidentID,
      DIRECTOR3: presidentID,
      DIRECTOR4: presidentID,
      DIRECTOR5: presidentID,
    };

    return this.httpClient.post<number>(
      this.url + "group/assignGroup",
      JSON.stringify(data),
      this.options
    );
  }

  assignGroupBOD(federationMemberData: any): Observable<number> {
    federationMemberData["CLIENT_ID"] = this.clientId;

    return this.httpClient.post<number>(
      this.url + "groupBOD/assignBOD",
      JSON.stringify(federationMemberData),
      this.options
    );
  }

  sendEmailForApproval(mailData: any): Observable<number> {
    mailData["CLIENT_ID"] = this.clientId;

    return this.httpClient.post<number>(
      this.url + "group/sendEmail",
      JSON.stringify(mailData),
      this.options
    );
  }

  groupBODApproval(mailData: any): Observable<number> {
    mailData["CLIENT_ID"] = this.clientId;

    return this.httpClient.post<number>(
      this.url + "groupBODStatus/groupBODApproval",
      JSON.stringify(mailData),
      this.options
    );
  }

  getAllProjects(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<ProjectMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<ProjectMaster[]>(
      this.url + "project/get",
      JSON.stringify(data),
      this.options
    );
  }

  createProject(model: ProjectMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "project/create",
      JSON.stringify(model),
      this.options
    );
  }

  updateProject(model: ProjectMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "project/update",
      JSON.stringify(model),
      this.options
    );
  }

  getAllProgrammeTypes(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<programmeTypeMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<programmeTypeMaster[]>(
      this.url + "programmeType/get",
      JSON.stringify(data),
      this.options
    );
  }

  createProgrammeType(programmeTypeData: programmeTypeMaster): Observable<number> {
    programmeTypeData.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "programmeType/create",
      JSON.stringify(programmeTypeData),
      this.options
    );
  }

  updateProgrammeType(programmeTypeData: programmeTypeMaster): Observable<number> {
    programmeTypeData.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "programmeType/update",
      JSON.stringify(programmeTypeData),
      this.options
    );
  }

  getAllUnits(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<UnitMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<UnitMaster[]>(
      this.url + "unit/get",
      JSON.stringify(data),
      this.options
    );
  }

  getAllUnitsTilesDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<UnitMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<UnitMaster[]>(
      this.url + "unit/getTilesUnitCount",
      JSON.stringify(data),
      this.options
    );
  }

  createUnit(model: UnitMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "unit/create",
      JSON.stringify(model),
      this.options
    );
  }

  updateUnit(model: UnitMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "unit/update",
      JSON.stringify(model),
      this.options
    );
  }

  getAllInchargeAreas(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<InchargeAreaMatser[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<InchargeAreaMatser[]>(
      this.url + "inchargeArea/get",
      JSON.stringify(data),
      this.options
    );
  }

  createInchargeArea(model: InchargeAreaMatser): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "inchargeArea/create",
      JSON.stringify(model),
      this.options
    );
  }

  updateInchargeArea(model: InchargeAreaMatser): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "inchargeArea/update",
      JSON.stringify(model),
      this.options
    );
  }

  getAllGroups(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<GroupMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<GroupMaster[]>(
      this.url + "group/get",
      JSON.stringify(data),
      this.options
    );
  }

  getAllGroupsTilesDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<GroupMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<GroupMaster[]>(
      this.url + "group/getTilesGroupData",
      JSON.stringify(data),
      this.options
    );
  }

  gettingBODStatus(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<GroupMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<GroupMaster[]>(this.url + "groupBODStatus/get", JSON.stringify(data), this.options);
  }

  gettingUnitBODStatus(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<UnitMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<UnitMaster[]>(this.url + "unitBODStatus/get", JSON.stringify(data), this.options);
  }

  gettingFederationBODStatus(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<UnitMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<UnitMaster[]>(this.url + "federationBODStatus/get", JSON.stringify(data), this.options);
  }

  gettingNewGroupBOD(groupID: number, year: number): Observable<GroupMaster[]> {
    var data = {
      GROUP_ID: groupID,
      YEAR: year,
    };

    return this.httpClient.post<GroupMaster[]>(this.url + "groupBODStatus/newGroupBOD", JSON.stringify(data), this.options);
  }

  deleteFinalisedGroupBOD(groupID: number, year: number): Observable<[]> {
    var data = {
      GROUP_ID: groupID,
      YEAR: year
    };

    return this.httpClient.post<[]>(this.url + "groupBODStatus/delete", JSON.stringify(data), this.options);
  }

  deleteFinalisedUnitBOD(unitID: number, year: number): Observable<[]> {
    var data = {
      UNIT_ID: unitID,
      YEAR: year
    };

    return this.httpClient.post<[]>(this.url + "unitBODStatus/delete", JSON.stringify(data), this.options);
  }

  gettingNewUnitBOD(unitID: number, year: number): Observable<UnitMaster[]> {
    var data = {
      UNIT_ID: unitID,
      YEAR: year,
    };

    return this.httpClient.post<UnitMaster[]>(this.url + "unitBODStatus/newUnitBOD", JSON.stringify(data), this.options);
  }

  gettingNewFederationBOD(federationID: number, year: number): Observable<UnitMaster[]> {
    var data = {
      FEDERATION_ID: federationID,
      YEAR: year,
    };

    return this.httpClient.post<UnitMaster[]>(this.url + "federationBODStatus/newFederationBOD", JSON.stringify(data), this.options);
  }

  createGroup(model: GroupMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(this.url + "group/create", JSON.stringify(model), this.options);
  }

  updateGroup(model: GroupMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "group/update",
      JSON.stringify(model),
      this.options
    );
  }

  approveGroup(model: GroupMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "group/approveGroup",
      JSON.stringify(model),
      this.options
    );
  }

  getAllMembers(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Membermaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<Membermaster[]>(
      this.url + "member/get",
      JSON.stringify(data),
      this.options
    );
  }

  getAllMembersOpenAPI(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Membermaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<Membermaster[]>(
      this.baseUrl + "member/get",
      JSON.stringify(data),
      this.options
    );
  }

  getFederationWiseMemberCount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Membermaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<Membermaster[]>(
      this.url +
      "federationwiseMemberSummaryReport/getFederationwiseMemberSummaryReport",
      JSON.stringify(data),
      this.options
    );
  }

  getUnitWiseMemberCount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Membermaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<Membermaster[]>(
      this.url + "unitwiseMemberSummaryReport/getUnitwiseMemberSummaryReport",
      JSON.stringify(data),
      this.options
    );
  }

  getGroupWiseMemberCount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Membermaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<Membermaster[]>(
      this.url + "groupwiseMemberSummaryReport/getGroupwiseMemberSummaryReport",
      JSON.stringify(data),
      this.options
    );
  }

  createMember(model: Membermaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "member/create",
      JSON.stringify(model),
      this.options
    );
  }

  updateMember(model: Membermaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "member/update",
      JSON.stringify(model),
      this.options
    );
  }

  getAllgroupMeeting(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Membermaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<Membermaster[]>(
      this.url + "groupMeeting/getMeetingData",
      JSON.stringify(data),
      this.options
    );
  }

  creategroupMeeting(model: GroupMeetAttendance): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "groupMeeting/createMeeting",
      JSON.stringify(model),
      this.options
    );
  }

  updategroupMeeting(model: GroupMeetAttendance): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "groupMeeting/update",
      JSON.stringify(model),
      this.options
    );
  }

  getAllgroupMeetingAttendanceDetails(meetingID: number, groupID: number): Observable<[]> {
    var data = {
      MEETING_ID: meetingID,
      GROUP_ID: groupID
    };

    return this.httpClient.post<[]>(
      this.url + "groupMeetingAttendance/getDetails",
      JSON.stringify(data),
      this.options
    );
  }

  getAllEventAttendanceDetails(eventID: number, groupID: number): Observable<[]> {
    var data = {
      EVENT_ID: eventID,
      GROUP_ID: groupID
    };

    return this.httpClient.post<[]>(
      this.url + "eventAttendance/getDetails",
      JSON.stringify(data),
      this.options
    );
  }

  getAllInchargeMeeting(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<InchargeMeeting[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<InchargeMeeting[]>(
      this.url + "inchargeMeeting/get",
      JSON.stringify(data),
      this.options
    );
  }

  createInchargeMeeting(model: InchargeMeeting): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "inchargeMeeting/create",
      JSON.stringify(model),
      this.options
    );
  }

  updateInchargeMeeting(model: InchargeMeeting): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "inchargeMeeting/update",
      JSON.stringify(model),
      this.options
    );
  }

  getAllInchargeMeetingAttendanceDetails(
    MEETING_ID: number
  ): Observable<Membermaster[]> {
    var data = {
      MEETING_ID: MEETING_ID,
    };

    return this.httpClient.post<Membermaster[]>(
      this.url + "inchargeMeetingAttendance/getDetails",
      JSON.stringify(data),
      this.options
    );
  }

  addBulkInchargeMeetingAttendance(
    CLIENT_ID: number,
    MEETING_ID: number,
    datas: any
  ): Observable<any> {
    var data = {
      CLIENT_ID: CLIENT_ID,
      MEETING_ID: MEETING_ID,
      data: datas,
    };

    this.options = {
      headers: this.httpHeaders,
    };

    return this.httpClient.post<any>(
      this.url + "inchargeMeetingAttendance/addBulk",
      JSON.stringify(data),
      this.options
    );
  }

  unitMembershipReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<UnitMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<UnitMaster[]>(
      this.url + "unit/unitMembershipReport",
      JSON.stringify(data),
      this.options
    );
  }

  getAllGroupActivities(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<GroupActivityMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<GroupActivityMaster[]>(
      this.url + "groupProjectActivity/get",
      JSON.stringify(data),
      this.options
    );
  }

  getAllGroupActivitiesUser(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    memberID: number
  ): Observable<GroupActivityMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      memberId: memberID,
    };

    return this.httpClient.post<GroupActivityMaster[]>(
      this.url + "groupProjectActivity/getUser",
      JSON.stringify(data),
      this.options
    );
  }

  createGroupActivity(model: GroupActivityMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "groupProjectActivity/createActivity",
      JSON.stringify(model),
      this.options
    );
  }

  updateGroupActivity(model: GroupActivityMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "groupProjectActivity/update",
      JSON.stringify(model),
      this.options
    );
  }

  getAllInchargeActivities(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<InchargeActivity[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<InchargeActivity[]>(
      this.url + "inchargeProjectActivity/get",
      JSON.stringify(data),
      this.options
    );
  }

  createInchargeActivity(model: InchargeActivity): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "inchargeProjectActivity/create",
      JSON.stringify(model),
      this.options
    );
  }

  updateInchargeActivity(model: InchargeActivity): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "inchargeProjectActivity/update",
      JSON.stringify(model),
      this.options
    );
  }

  // Registration
  sendSMS(MOBILE_NUMBER: any) {
    var data = {
      MOBILE_NUMBER: MOBILE_NUMBER,
    };

    return this.httpClient.post<[]>(
      this.baseUrl + "member/sendOTP",
      JSON.stringify(data),
      this.options
    );
  }

  resendSMS(MOBILE_NUMBER: any) {
    var data = {
      MOBILE_NUMBER: MOBILE_NUMBER,
    };

    return this.httpClient.post<[]>(
      this.baseUrl + "member/sendOTP",
      JSON.stringify(data),
      this.options
    );
  }

  verifyOTP(MOBILE_NUMBER: any, OTP: any) {
    var data = {
      MOBILE_NUMBER: MOBILE_NUMBER,
      OTP: OTP,
    };

    return this.httpClient.post<[]>(
      this.baseUrl + "member/verifyOtp",
      JSON.stringify(data),
      this.options
    );
  }

  createMember2(model: Membermaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.baseUrl + "member/register",
      JSON.stringify(model),
      this.options
    );
  }

  getAllFederations2(filter: string): Observable<any[]> {
    var data = {
      filter: filter + " AND STATUS=1",
    };

    return this.httpClient.post<any[]>(
      this.baseUrl + "member/getFederation",
      JSON.stringify(data),
      this.options
    );
  }

  getAllUnits2(filter: string): Observable<any[]> {
    var data = {
      filter: filter + " AND STATUS=1",
    };

    return this.httpClient.post<any[]>(
      this.baseUrl + "member/getUnit",
      JSON.stringify(data),
      this.options
    );
  }

  getAllGroup2(filter: string): Observable<any[]> {
    var data = {
      filter: filter + " AND STATUS=1",
    };

    return this.httpClient.post<any[]>(
      this.baseUrl + "member/getGroup",
      JSON.stringify(data),
      this.options
    );
  }

  // 8 Digit Random Number
  generate8DigitRandomNumber() {
    return String(Math.floor(Math.random() * 1e8));
  }

  getFederationPresidentCount(
    federationID: number,
    unitID: number,
    groupID: number
  ): Observable<[]> {
    var data = {
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<[]>(
      this.url + "federation/getDashboardData",
      JSON.stringify(data),
      this.options
    );
  }

  getUnitDirectorCount(
    federationID: number,
    unitID: number,
    groupID: number
  ): Observable<[]> {
    var data = {
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<[]>(
      this.url + "unit/getDashboardData",
      JSON.stringify(data),
      this.options
    );
  }

  getGroupPresidentCount(
    federationID: number,
    unitID: number,
    groupID: number
  ): Observable<[]> {
    var data = {
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<[]>(
      this.url + "group/getDashboardData",
      JSON.stringify(data),
      this.options
    );
  }

  getLatest10MembersFederationWise(
    federationID: number,
    unitID: number,
    groupID: number
  ): Observable<Membermaster[]> {
    var data = {
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<Membermaster[]>(
      this.url + "federation/getTop10MemberByMembership",
      JSON.stringify(data),
      this.options
    );
  }

  getLatest10MembersUnitWise(
    federationID: number,
    unitID: number,
    groupID: number
  ): Observable<Membermaster[]> {
    var data = {
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<Membermaster[]>(
      this.url + "unit/getTop10MemberByMembership",
      JSON.stringify(data),
      this.options
    );
  }

  getLatest10MembersGroupWise(
    federationID: number,
    unitID: number,
    groupID: number
  ): Observable<Membermaster[]> {
    var data = {
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<Membermaster[]>(
      this.url + "group/getTop10MemberByMembership",
      JSON.stringify(data),
      this.options
    );
  }

  getUpcoming5ActivitiesFederationWise(
    federationID: number,
    unitID: number,
    groupID: number
  ): Observable<[]> {
    var data = {
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<[]>(
      this.url + "federation/getUpcomingActivity",
      JSON.stringify(data),
      this.options
    );
  }

  getUpcoming5ActivitiesUnitWise(
    federationID: number,
    unitID: number,
    groupID: number
  ): Observable<[]> {
    var data = {
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<[]>(
      this.url + "unit/getUpcomingActivity",
      JSON.stringify(data),
      this.options
    );
  }

  getUpcoming5ActivitiesGroupWise(
    federationID: number,
    unitID: number,
    groupID: number
  ): Observable<[]> {
    var data = {
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<[]>(
      this.url + "group/getUpcomingActivity",
      JSON.stringify(data),
      this.options
    );
  }

  getUpcoming5MeetingFederationWise(
    federationID: number,
    unitID: number,
    groupID: number
  ): Observable<[]> {
    var data = {
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<[]>(
      this.url + "federation/getUpcomingMeeting",
      JSON.stringify(data),
      this.options
    );
  }

  getUpcoming5MeetingUnitWise(
    federationID: number,
    unitID: number,
    groupID: number
  ): Observable<[]> {
    var data = {
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<[]>(
      this.url + "unit/getUpcomingMeeting",
      JSON.stringify(data),
      this.options
    );
  }

  getUpcoming5Meetings(userID: number): Observable<[]> {
    var data = {
      MEMBER_ID: userID
    };

    return this.httpClient.post<[]>(this.url + "group/getUpcomingMeeting", JSON.stringify(data), this.options);
  }

  getGroupWiseActivityCount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<[]>(
      this.url + "groupProjectActivity/getProjectActivitySummaryReport",
      JSON.stringify(data),
      this.options
    );
  }

  getGroupWiseMeetingCount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<[]>(
      this.url + "groupMeeting/getMeetingSummaryReport",
      JSON.stringify(data),
      this.options
    );
  }

  getReportDetails(
    month: string,
    year: number,
    groupID: number
  ): Observable<any> {
    var data = {
      MONTH: month,
      YEAR: year,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<any>(
      this.url + "groupMeeting/getReportDetails",
      JSON.stringify(data),
      this.options
    );
  }

  getAllCircularType(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "circularType/get",
      JSON.stringify(data),
      this.options
    );
  }

  createCircularType(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + "circularType/create/",
      JSON.stringify(role),
      this.options
    );
  }

  updateCircularType(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;

    return this.httpClient.put<any>(
      this.url + "circularType/update/",
      JSON.stringify(role),
      this.options
    );
  }

  getAllCircular(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "circular/get",
      JSON.stringify(data),
      this.options
    );
  }

  createCircular(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + "circular/create/",
      JSON.stringify(role),
      this.options
    );
  }

  updateCircular(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;

    return this.httpClient.put<any>(
      this.url + "circular/update/",
      JSON.stringify(role),
      this.options
    );
  }

  userchangepassord(role: any): Observable<any> {
    return this.httpClient.post<any>(
      this.url + "member/changepassword",
      JSON.stringify(role),
      this.options
    );
  }

  getAllHashtags(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<[]>(
      this.url + "hashtag/get",
      JSON.stringify(data),
      this.options
    );
  }

  getAllpost(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "post/get",
      JSON.stringify(data),
      this.options
    );
  }

  createpost(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + "post/create/",
      JSON.stringify(role),
      this.options
    );
  }

  updatePost(role: Post): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(this.url + "post/updatePost/", JSON.stringify(role), this.options);
  }

  addpost(role: Post): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(this.url + "post/addpost", JSON.stringify(role), this.options);
  }

  changepasss(MOBILE_NO: any, PASS: any): Observable<any> {
    var data = {
      MOBILE_NUMBER: MOBILE_NO,
      PASSWORD: PASS,
    };

    return this.httpClient.post<[]>(
      this.baseUrl + "member/forgotpassword",
      JSON.stringify(data),
      this.options
    );
  }

  createCircular2(role: any): Observable<any> {
    role.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(this.url + "circular/createCircular/", JSON.stringify(role), this.options);
  }

  createPostComment(comment: any): Observable<any> {
    comment.CLIENT_ID = this.clientId;
    return this.httpClient.post<any>(this.url + "comment/commentPost", JSON.stringify(comment), this.options);
  }

  createEventComment(comments: any): Observable<any> {
    comments.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + "groupProjectActivity/commentEvent",
      JSON.stringify(comments),
      this.options
    );
  }

  getAllEventComments(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<EventComment[]>(
      this.url + "groupProjectActivity/getComments",
      JSON.stringify(data),
      this.options
    );
  }

  getAllComments(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<Comment[]>(
      this.url + "comment/get",
      JSON.stringify(data),
      this.options
    );
  }

  getAllLike(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<Likes[]>(
      this.url + "likemapping/get",
      JSON.stringify(data),
      this.options
    );
  }

  createlike(ticketGroup: any): Observable<any> {
    ticketGroup.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + "likemapping/likePost",
      JSON.stringify(ticketGroup),
      this.options
    );
  }

  updatelike(organization: any): Observable<number> {
    organization.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "likemapping/update/",
      JSON.stringify(organization),
      this.options
    );
  }

  getAllEventLike(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<Likes[]>(
      this.url + "groupProjectActivity/getLikes",
      JSON.stringify(data),
      this.options
    );
  }

  createEventlike(ticketGroup: any): Observable<any> {
    ticketGroup.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + "groupProjectActivity/likeEvent",
      JSON.stringify(ticketGroup),
      this.options
    );
  }

  updateEventlike(organization: any): Observable<number> {
    organization.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "groupProjectActivity/update",
      JSON.stringify(organization),
      this.options
    );
  }

  getAllUaserposts(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      memberId: Number(this.cookie.get("userId")),
    };

    return this.httpClient.post<Comment[]>(
      this.url + "post/getUser",
      JSON.stringify(data),
      this.options
    );
  }

  getAllgroupProjects(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Membermaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<Membermaster[]>(
      this.url + "groupProjects/get",
      JSON.stringify(data),
      this.options
    );
  }

  creategroupProjects(model: GroupProjectMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "groupProjects/create",
      JSON.stringify(model),
      this.options
    );
  }

  updategroupProjects(model: GroupProjectMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "groupProjects/update",
      JSON.stringify(model),
      this.options
    );
  }

  getAllgroupProjectData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Membermaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<Membermaster[]>(
      this.url + "groupProjects/get",
      JSON.stringify(data),
      this.options
    );
  }

  createMembersPayment(model: PaymentCollection): Observable<number> {
    model.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(this.url + "paymentCollection/payment", JSON.stringify(model), this.options);
  }

  updateMembersPayment(model: PaymentCollection): Observable<number> {
    return this.httpClient.put<number>(this.url + "paymentCollection/update", JSON.stringify(model), this.options
    );
  }

  getAllMembershipPayment(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Membermaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<Membermaster[]>(
      this.url + "paymentCollection/get",
      JSON.stringify(data),
      this.options
    );
  }

  getMembershipPaymentDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Membermaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<Membermaster[]>(
      this.url + "paymentCollectionDetail/get",
      JSON.stringify(data),
      this.options
    );
  }

  createdocumentsDetails(folderName, selectedFile, filename) {
    this.httpHeaders1 = new HttpHeaders({
      Accept: "application/json",
      apikey: "uEasCQeYxENglqc9uiHQ5xRvjB73PtSi",
      applicationkey: "JCuYZ9tY949LohRi",
      deviceid: this.cookie.get("deviceId"),
      supportkey: this.cookie.get("supportKey"),
      Token: this.cookie.get("token"),
    });

    this.options1 = {
      headers: this.httpHeaders1,
    };

    const fd = new FormData();
    fd.append("File", selectedFile, filename);
    return this.httpClient.post(this.imgUrl + folderName, fd, this.options1);
  }

  getAllMemberPaymentDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Membermaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<Membermaster[]>(
      this.url + "paymentCollectionDetail/get",
      JSON.stringify(data),
      this.options
    );
  }

  getVicePresident(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: any
  ): Observable<VicePresident[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR
    };

    return this.httpClient.post<VicePresident[]>(
      this.baseUrl + "api/outstandingVicePresident/get",
      JSON.stringify(data),
      this.options
    );
  }

  VicePresidentCrete(data: any): Observable<VicePresident[]> {
    data.CLIENT_ID = this.clientId;

    return this.httpClient.post<VicePresident[]>(
      this.baseUrl + "api/outstandingVicePresident/create",
      JSON.stringify(data),
      this.options
    );
  }

  updatVicePresident(data: any): Observable<VicePresident[]> {
    return this.httpClient.put<VicePresident[]>(
      this.baseUrl + "api/outstandingVicePresident/update",
      JSON.stringify(data),
      this.options
    );
  }

  createPastPresident(createPastPrecidentAward: any): Observable<any> {
    createPastPrecidentAward.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + "outstandingPastPresident/addDetails",
      JSON.stringify(createPastPrecidentAward),
      this.options
    );
  }

  UpdatePastPresident(createPastPrecidentAward: any): Observable<any> {
    createPastPrecidentAward.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + "outstandingPastPresident/updateDetails",
      JSON.stringify(createPastPrecidentAward),
      this.options
    );
  }

  updatePaymentStatus(paymentID: number, status: string): Observable<any> {
    var data = {
      PAYMENT_ID: paymentID,
      RECEIVED_STATUS: status,
    };

    return this.httpClient.post<any>(this.url + "paymentCollection/offlinePayStatus", JSON.stringify(data), this.options);
  }

  getAllPastPresident(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR
    };

    return this.httpClient.post<any>(
      this.url + "outstandingPastPresident/get",
      JSON.stringify(data),
      this.options
    );
  }

  getAllPastPresidentInitiatedProjectdetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "initiatedProjectDetails/get",
      JSON.stringify(data),
      this.options
    );
  }

  getAllOutstandingGroups(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<GroupMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<GroupMaster[]>(
      this.url + "outstandingGroup/get",
      JSON.stringify(data),
      this.options
    );
  }

  createOutstandingGroup(model: OutstandingGroupMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "outstandingGroup/addDetails",
      JSON.stringify(model),
      this.options
    );
  }

  updateOutstandingGroup(model: OutstandingGroupMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "outstandingGroup/updateDetails",
      JSON.stringify(model),
      this.options
    );
  }

  onUploadMedia(folderName, selectedFile, filename) {
    this.httpHeaders1 = new HttpHeaders({
      Accept: "application/json",
      apikey: "uEasCQeYxENglqc9uiHQ5xRvjB73PtSi",
      applicationkey: "JCuYZ9tY949LohRi",
      deviceid: this.cookie.get("deviceId"),
      supportkey: this.cookie.get("supportKey"),
      Token: this.cookie.get("token"),
    });

    this.options1 = {
      headers: this.httpHeaders1,
    };

    const fd = new FormData();
    fd.append("Image", selectedFile, filename);
    return this.httpClient.post(this.imgUrl + folderName, fd, this.options1);
  }

  getOutstandingGroup(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
    };

    return this.httpClient.post<any>(
      this.url + "outstandingGroup/get",
      JSON.stringify(data),
      this.options
    );
  }

  getContinuproject(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "countinuingProjectDetails/get",
      JSON.stringify(data),
      this.options
    );
  }

  getDuePaidToFundation(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "duesPaidToFoundation/get",
      JSON.stringify(data),
      this.options
    );
  }

  getUndertakenProject(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "undertakenProjectGroup/get",
      JSON.stringify(data),
      this.options
    );
  }

  getMediaCoverage(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "mediaCoverings/get",
      JSON.stringify(data),
      this.options
    );
  }

  getGroupSponser(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "newSponseredGroupDetail/get",
      JSON.stringify(data),
      this.options
    );
  }

  getAllWeekCelebration(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string, YEAR: string): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR
    };

    return this.httpClient.post<any>(this.url + "outstandingGiantsWeekCelebrations/get", JSON.stringify(data), this.options);
  }

  getAllDateAndScheduledetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "scheduleOfGiantsWeek/get",
      JSON.stringify(data),
      this.options
    );
  }

  getAllProjectDuringdetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "projectDuringGiantsServiceWeek/get",
      JSON.stringify(data),
      this.options
    );
  }

  getAllProjectExpensesdetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "projectExpensesDetailsOfSponsorship/get",
      JSON.stringify(data),
      this.options
    );
  }

  getAllDescriptiondetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "descriptionOfWeek/get",
      JSON.stringify(data),
      this.options
    );
  }

  getAllPublicitydetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "publicityWithPress/get",
      JSON.stringify(data),
      this.options
    );
  }

  createWeekCelebration(createPastPrecidentAward: any): Observable<any> {
    createPastPrecidentAward.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + "outstandingGiantsWeekCelebrations/addDetails",
      JSON.stringify(createPastPrecidentAward),
      this.options
    );
  }

  UpdateWeekCelebration(createPastPrecidentAward: any): Observable<any> {
    createPastPrecidentAward.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + "outstandingGiantsWeekCelebrations/updateDetails",
      JSON.stringify(createPastPrecidentAward),
      this.options
    );
  }

  getActivitics(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR
    };

    return this.httpClient.post<any>(
      this.url + "outstandingActivitiesInformation/get",
      JSON.stringify(data),
      this.options
    );
  }

  getActiviticDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "activitiesProjectDetails/get",
      JSON.stringify(data),
      this.options
    );
  }

  createActivites(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.baseUrl + "api/outstandingActivitiesInformation/addDetails",
      JSON.stringify(data),
      this.options
    );
  }

  updatActivites(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(
      this.baseUrl + "api/outstandingActivitiesInformation/updateDetails",
      JSON.stringify(data),
      this.options
    );
  }

  getFinanceDirector(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: string
  ): Observable<Awardmaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR
    };

    return this.httpClient.post<Awardmaster[]>(
      this.url + "directorOffinance/get",
      JSON.stringify(data),
      this.options
    );
  }

  createDirectorFinance(directorFinance: any): Observable<any> {
    directorFinance.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + "directorOffinance/addDetails",
      JSON.stringify(directorFinance),
      this.options
    );
  }

  UpdateDirectorFinance(directorFinance: any): Observable<any> {
    directorFinance.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + "directorOffinance/updateDetails",
      JSON.stringify(directorFinance),
      this.options
    );
  }

  getAllFinanceSponsorshipdetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "dirFinanceSponsorshipDetail/get",
      JSON.stringify(data),
      this.options
    );
  }

  getAdministration(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: any
  ): Observable<VicePresident[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR
    };

    return this.httpClient.post<VicePresident[]>(
      this.url + "directorsOfAdministration/get",
      JSON.stringify(data),
      this.options
    );
  }

  createAdministration(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + "directorsOfAdministration/create",
      JSON.stringify(data),
      this.options
    );
  }

  updatAdministration(data: any): Observable<any[]> {
    return this.httpClient.put<any[]>(
      this.url + "directorsOfAdministration/update",
      JSON.stringify(data),
      this.options
    );
  }

  getNewMemberDrawer(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "newMemberAdded/get",
      JSON.stringify(data),
      this.options
    );
  }

  getDocAndDetailDrawer(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "detailsAndDocuments/get",
      JSON.stringify(data),
      this.options
    );
  }

  getMemberAwardDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR
    };

    return this.httpClient.post<any>(
      this.url + "oustandingMemberAndLady/get",
      JSON.stringify(data),
      this.options
    );
  }

  getAllMemberAwardDetails(MEMBER_ID: number): Observable<[]> {
    var data = { MEMBER_ID: MEMBER_ID, };
    return this.httpClient.post<[]>(this.url + "oustandingMemberAndLady/getOldMemberData", JSON.stringify(data), this.options);
  }

  createMemberAward(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + "oustandingMemberAndLady/addDetails",
      JSON.stringify(data),
      this.options
    );
  }

  updatMemberAward(data: any): Observable<any[]> {
    return this.httpClient.post<any>(
      this.url + "oustandingMemberAndLady/updateDetails",
      JSON.stringify(data),
      this.options
    );
  }

  getPresident(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR
    };

    return this.httpClient.post<any>(
      this.url + "outstandingPresident/get",
      JSON.stringify(data),
      this.options
    );
  }

  getPresidentDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "outstandingPresidentDetails/get",
      JSON.stringify(data),
      this.options
    );
  }

  createPresident(data: any): Observable<any> {
    data.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + "outstandingPresident/addDetails",
      JSON.stringify(data),
      this.options
    );
  }

  updatePresident(data: any): Observable<any[]> {
    return this.httpClient.post<any[]>(
      this.url + "outstandingPresident/updateDetails",
      JSON.stringify(data),
      this.options
    );
  }

  getBestServiceProject(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
    };

    return this.httpClient.post<any>(
      this.url + "bestServiceProject/get",
      JSON.stringify(data),
      this.options
    );
  }

  getServiceProjectSponser(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "serviceProjectSponseredDetails/get",
      JSON.stringify(data),
      this.options
    );
  }

  getUnitConfernceAward(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "unitConferenceAwardDetails/get",
      JSON.stringify(data),
      this.options
    );
  }

  createBestServiceProject(model: BestServiceProjectMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "bestServiceProject/addDetails",
      JSON.stringify(model),
      this.options
    );
  }

  updateBestServiceProject(model: BestServiceProjectMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "bestServiceProject/updateDetails",
      JSON.stringify(model),
      this.options
    );
  }

  getAllOutstandingMonumental(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<GroupMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<GroupMaster[]>(
      this.url + "outstandingGroup/get",
      JSON.stringify(data),
      this.options
    );
  }

  createOutstandingMonumental(model: OutstandingMonumental): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "outstandingMonumentalAward/addDetails",
      JSON.stringify(model),
      this.options
    );
  }

  updateOutstandingMonumental(model: OutstandingMonumental): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "outstandingMonumentalAward/updateDetails",
      JSON.stringify(model),
      this.options
    );
  }

  getOutstandingMonumental(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: String
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
    };

    return this.httpClient.post<any>(
      this.url + "outstandingMonumentalAward/get",
      JSON.stringify(data),
      this.options
    );
  }

  getOutstandingMonumentalSpons(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "monumentalProjectSponsorship/get",
      JSON.stringify(data),
      this.options
    );
  }

  getOutstandingMonumentalBanner(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "monumentalBannerPhotos/get",
      JSON.stringify(data),
      this.options
    );
  }

  getOutstandingMonumentalMediaClip(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "monumentalPressClipping/get",
      JSON.stringify(data),
      this.options
    );
  }

  getAdminFeeStructure(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<[]>(
      this.url + "adminFeeStructure/get",
      JSON.stringify(data),
      this.options
    );
  }

  submitAdminFeeStructure(feeDetails: any): Observable<number> {
    feeDetails.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(this.url + "adminFeeStructure/addAdminFees", JSON.stringify(feeDetails), this.options);
  }

  getGroupWiseFeeStructure(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<[]>(
      this.url + "groupFeeStructure/get",
      JSON.stringify(data),
      this.options
    );
  }

  submitGroupWiseFeeStructure(feeDetails: any): Observable<number> {
    feeDetails.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "groupFeeStructure/addGroupFees",
      JSON.stringify(feeDetails),
      this.options
    );
  }

  updateFees(groupType: string, groupID: number, year: any): Observable<number> {
    var data = {
      GROUP_TYPE: groupType,
      GROUP_ID: groupID,
      YEAR: year,
    }

    return this.httpClient.post<number>(this.url + "groupFeeStructure/updateFees", JSON.stringify(data), this.options);
  }

  getCommunityData(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string, federatinID: number): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      FEDERATION_ID: federatinID
    };

    return this.httpClient.post<[]>(this.url + "federation/getAllDataCommunity", JSON.stringify(data), this.options);
  }

  getOutstandingYoungGiantsDivision(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR
    };

    return this.httpClient.post<any>(
      this.url + "outstandingYoungGiantsDivision/get",
      JSON.stringify(data),
      this.options
    );
  }

  createOutstandingYoungGiantsDivision(model: OustandingYoungGiantsDivisionMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "outstandingYoungGiantsDivision/create",
      JSON.stringify(model),
      this.options
    );
  }

  updateOutstandingYoungGiantsDivision(model: OustandingYoungGiantsDivisionMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "outstandingYoungGiantsDivision/update",
      JSON.stringify(model),
      this.options
    );
  }

  getFederationReport(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string, YEAR: any, FilterQuery: string, FEDERATION_ID: any, UNIT_ID: any, GROUP_ID: any): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      FilterQuery: FilterQuery,
      FEDERATION_ID: FEDERATION_ID,
      UNIT_ID: UNIT_ID,
      GROUP_ID: GROUP_ID
    };

    return this.httpClient.post<any>(this.url + "getMainDetails/getFederationDetails", JSON.stringify(data), this.options);
  }

  getUnitReport(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string, YEAR: any, FilterQuery: string, FEDERATION_ID: any, UNIT_ID: any, GROUP_ID: any): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      FilterQuery: FilterQuery,
      FEDERATION_ID: FEDERATION_ID,
      UNIT_ID: UNIT_ID,
      GROUP_ID: GROUP_ID
    };

    return this.httpClient.post<any>(this.url + "getMainDetails/getUnitDetails", JSON.stringify(data), this.options);
  }

  getGroupReport(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string, YEAR: any, FilterQuery: string, FEDERATION_ID: any, UNIT_ID: any, GROUP_ID: any): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      FilterQuery: FilterQuery,
      FEDERATION_ID: FEDERATION_ID,
      UNIT_ID: UNIT_ID,
      GROUP_ID: GROUP_ID
    };

    return this.httpClient.post<any>(this.url + "getMainDetails/getGroupDetails", JSON.stringify(data), this.options);
  }


  getMemberReport(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string, YEAR: any, FilterQuery: string, FEDERATION_ID: any, UNIT_ID: any, GROUP_ID: any): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      FilterQuery: FilterQuery,
      FEDERATION_ID: FEDERATION_ID,
      UNIT_ID: UNIT_ID,
      GROUP_ID: GROUP_ID
    };

    return this.httpClient.post<any>(this.url + "getMainDetails/getMemberDetails", JSON.stringify(data), this.options);
  }

  getAllgroupMeetingAttendancy(MEETING_ID: number): Observable<[]> {
    var data = {
      MEETING_ID: MEETING_ID,
    };

    return this.httpClient.post<[]>(
      this.url + "groupMeetingAttendance/getMeetingAttendanceDetails",
      JSON.stringify(data),
      this.options
    );
  }

  getEventAttendanceData(eventID: number): Observable<[]> {
    var data = {
      EVENT_ID: eventID
    };

    return this.httpClient.post<[]>(
      this.url + "eventAttendance/getEventAttendanceDetails",
      JSON.stringify(data),
      this.options
    );
  }

  getReportMatstar(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<GroupMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<GroupMaster[]>(
      this.url + "reportMaster/get",
      JSON.stringify(data),
      this.options
    );
  }

  reportMastercreate(model: Rform): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "reportMaster/create",
      JSON.stringify(model),
      this.options
    );
  }

  reportMasterupdate(model: Rform): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "reportMaster/update",
      JSON.stringify(model),
      this.options
    );
  }

  getScheduledReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<GroupMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<GroupMaster[]>(
      this.url + "reportSchedule/get",
      JSON.stringify(data),
      this.options
    );
  }

  reportScheduledCreate(model: REPORTSCHEDULE): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "reportSchedule/create",
      JSON.stringify(model),
      this.options
    );
  }

  reportScheduledUpdate(model: REPORTSCHEDULE): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "reportSchedule/update",
      JSON.stringify(model),
      this.options
    );
  }

  getReportMeeting(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: any,
    FEDERATION_ID: any,
    GROUP_ID: any,
    UNIT_ID: any

  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      FEDERATION_ID: FEDERATION_ID,
      GROUP_ID: GROUP_ID,
      UNIT_ID: UNIT_ID
    };

    return this.httpClient.post<any>(
      this.url + "groupMeeting/getMeetingDetails",
      JSON.stringify(data),
      this.options
    );
  }

  getReportPost(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: any,
    FEDERATION_ID: any,
    GROUP_ID: any,
    UNIT_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      FEDERATION_ID: FEDERATION_ID,
      GROUP_ID: GROUP_ID,
      UNIT_ID: UNIT_ID
    };

    return this.httpClient.post<any>(
      this.url + "post/getPostDetails",
      JSON.stringify(data),
      this.options
    );
  }

  getReportComment(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: any,
    FEDERATION_ID: any,
    GROUP_ID: any,
    UNIT_ID: any
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      FEDERATION_ID: FEDERATION_ID,
      GROUP_ID: GROUP_ID,
      UNIT_ID: UNIT_ID
    };

    return this.httpClient.post<any>(
      this.url + "comment/getCommentDetails",
      JSON.stringify(data),
      this.options
    );
  }

  deleteSchedule(model: any): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "reportSchedule/updateStatus",
      JSON.stringify(model),
      this.options
    );
  }

  getInvitees(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<GroupMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<GroupMaster[]>(
      this.url + "groupMeeting/getCountWiseDetails",
      JSON.stringify(data),
      this.options
    );
  }

  getLikeMapping(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<GroupMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<GroupMaster[]>(
      this.url + "likemapping/getCountWiseLikeDetails",
      JSON.stringify(data),
      this.options
    );
  }

  getCommentMapping(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<GroupMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<GroupMaster[]>(
      this.url + "comment/getCountWiseCommentDetails",
      JSON.stringify(data),
      this.options
    );
  }

  getPaymentReport(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string, YEAR: any, FilterQuery: string, FEDERATION_ID: any, UNIT_ID: any, GROUP_ID: any): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      FilterQuery: FilterQuery,
      FEDERATION_ID: FEDERATION_ID,
      UNIT_ID: UNIT_ID,
      GROUP_ID: GROUP_ID
    };

    return this.httpClient.post<GroupMaster[]>(this.url + "paymentStatisticsDetails/getPaymentDetails", JSON.stringify(data), this.options);
  }

  getPaymentDetailCount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<GroupMaster[]>(
      this.url + "paymentStatisticsDetails/getCountWiseDetails",
      JSON.stringify(data),
      this.options
    );
  }

  getSubmittedReportDetails(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<MonthlyReportSubmission[]>(
      this.url + "monthlyReportSubmission/get",
      JSON.stringify(data),
      this.options
    );
  }

  createSubmittedReportDetails(reportData: any): Observable<any> {
    reportData.CLIENT_ID = this.clientId;

    return this.httpClient.post<any>(
      this.url + "monthlyReportSubmission/create",
      JSON.stringify(reportData),
      this.options
    );
  }

  updateSubmittedReportDetails(reportData: any): Observable<number> {
    reportData.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "monthlyReportSubmission/update",
      JSON.stringify(reportData),
      this.options
    );
  }

  getMeetingStat(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: string,
    federationID: number,
    unitID: number,
    groupID: number
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<any>(
      this.url + "meetingStatisticsDetails/meetingOverview",
      JSON.stringify(data),
      this.options
    );
  }

  getPostStat(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: string,
    federationID: number,
    unitID: number,
    groupID: number
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<any>(
      this.url + "postStatisticsDetails/postOverview",
      JSON.stringify(data),
      this.options
    );
  }

  getMainCouncileCount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
    };

    return this.httpClient.post<any>(
      this.url + "federation/getTilesCountData",
      JSON.stringify(data),
      this.options
    );
  }

  getCircularStat(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: string,
    federationID: number,
    unitID: number,
    groupID: number
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<any>(
      this.url + "circularStatisticsDetails/circularOverview",
      JSON.stringify(data),
      this.options
    );
  }

  getEventsStat(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: string,
    federationID: number,
    unitID: number,
    groupID: number
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<any>(
      this.url + "eventStatisticsDetails/eventOverview",
      JSON.stringify(data),
      this.options
    );
  }

  getProjectsStat(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: string,
    federationID: number,
    unitID: number,
    groupID: number
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<any>(
      this.url + "projectStatisticsDetails/projectOverview",
      JSON.stringify(data),
      this.options
    );
  }

  getCommunityDataYearwise(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: string,
    federationID: number,
    unitID: number,
    groupID: number
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<[]>(
      this.url + "federation/getAllDataDashboard",
      JSON.stringify(data),
      this.options
    );
  }

  getPaymentStat(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: string,
    federationID: number,
    unitID: number,
    groupID: number
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<any>(
      this.url + "paymentStatisticsDetails/paymentOverview",
      JSON.stringify(data),
      this.options
    );
  }

  getCircularDetailCount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<GroupMaster[]>(
      this.url + "circular/getCountWiseCircularDetails",
      JSON.stringify(data),
      this.options
    );
  }

  getPostDetailCount(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<GroupMaster[]>(
      this.url + "post/getCountWisePostDetails",
      JSON.stringify(data),
      this.options
    );
  }

  getProjectDeatils(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string,
    YEAR: string,
    FilterQuery: string,
    UNIT_ID: number,
    FEDERATION_ID: number,
    GROUP_ID: number
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      FilterQuery: FilterQuery,
      FEDERATION_ID: FEDERATION_ID,
      UNIT_ID: UNIT_ID,
      GROUP_ID: GROUP_ID
    };

    return this.httpClient.post<[]>(
      this.url + "groupProjects/getProjectDetails",
      JSON.stringify(data),
      this.options
    );
  }

  getEventreport(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string, YEAR: string, FilterQuery: string, federationID: number, unitID: number, groupID: number): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      FilterQuery: FilterQuery,
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID
    };

    return this.httpClient.post<any>(this.url + "groupProjectActivity/getEventDetails", JSON.stringify(data), this.options);
  }

  getCircularreport(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string, YEAR: string, FilterQuery: string, federationID: number, unitID: number, groupID: number): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: YEAR,
      FilterQuery: FilterQuery,
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID
    };

    return this.httpClient.post<any>(this.url + "circular/getCircularDetails", JSON.stringify(data), this.options);
  }

  getAllMyNotications(pageIndex: number, pageSize: number, MEMBER_ID: number, FEDERATION_ID: number, GROUP_ID: number, UNIT_ID: number): Observable<any[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      MEMBER_ID: MEMBER_ID,
      FEDERATION_ID: FEDERATION_ID,
      GROUP_ID: GROUP_ID,
      UNIT_ID: UNIT_ID,
    };

    return this.httpClient.post<any[]>(this.url + "notification/getNotifications", JSON.stringify(data), this.options);
  }

  notiDetailsAddBulk(empID: number, title: string, desc: string, sharingType: number, nData: any, orgId: number, imageUrl: string, notiType: string, federationID: number, unitID: number, groupID: number): Observable<[]> {
    for (var i = 0; i < nData.length; i++) {
      nData[i].CLIENT_ID = this.clientId;
    }

    var data = {
      TITLE: title,
      DESCRIPTION: desc,
      data: nData,
      SHARING_TYPE: sharingType,
      MEMBER_ID: empID,
      ORG_ID: orgId,
      IS_PANEL: 1,
      ATTACHMENT: imageUrl,
      TYPE: notiType,
      FEDERATION_ID: federationID,
      UNIT_ID: unitID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<[]>(this.url + "notification/sendNotification", JSON.stringify(data), this.options);
  }

  getOutstandingDetails(MEMBER_ID: number, groupID: number): Observable<[]> {
    var data = {
      MEMBER_ID: MEMBER_ID,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<[]>(
      this.url + "outstandingGroup/getOutstandingGroupDetails",
      JSON.stringify(data),
      this.options
    );
  }

  getPaymentDetails(memberID: number): Observable<[]> {
    var data = {
      MEMBER_ID: memberID,
    };

    return this.httpClient.post<[]>(
      this.url + "member/getMemberPaymentDetails",
      JSON.stringify(data),
      this.options
    );
  }

  createLetterHead(model: LetterHeadMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "template/create",
      JSON.stringify(model),
      this.options
    );
  }

  updateLetterHead(model: LetterHeadMaster): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "template/update",
      JSON.stringify(model),
      this.options
    );
  }

  getAllLetterHead(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<Membermaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<Membermaster[]>(
      this.url + "template/get",
      JSON.stringify(data),
      this.options
    );
  }

  sendEmail(fromDate: any, toDate: any, orgId: number) {
    var data = {
      FROM_DATE: fromDate,
      TO_DATE: toDate,
      ORG_ID: orgId,
    };

    return this.httpClient.post<[]>(
      this.url + "scheduler/sendEmail",
      JSON.stringify(data),
      this.options
    );
  }

  getcountData(fromDate: any, toDate: any, orgId: number) {
    var data = {
      FROM_DATE: fromDate,
      TO_DATE: toDate,
      ORG_ID: orgId,
    };

    return this.httpClient.post<[]>(
      this.url + "scheduler/sendEmployeeReport",
      JSON.stringify(data),
      this.options
    );
  }

  passwordIsValid(value: any) {
    const expression = /^[A-Za-z0-9@#]*$/;
    return expression.test(String("" + value).toLowerCase());
  }

  getAllEmpRoleMap(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(
      this.url + "employeeRoleMapping/get",
      JSON.stringify(data),
      this.options
    );
  }

  getOutstandingPastPresidentOldDetails(MEMBER_ID: number): Observable<[]> {
    var data = {
      MEMBER_ID: MEMBER_ID,
    };

    return this.httpClient.post<[]>(this.url + "outstandingPastPresident/getOldPastPresidentData", JSON.stringify(data), this.options
    );
  }

  getAllVicePresidentDetails(MEMBER_ID: number, groupID: number, YEAR: any): Observable<[]> {
    var data = {
      MEMBER_ID: MEMBER_ID,
      GROUP_ID: groupID,
      YEAR: YEAR
    };

    return this.httpClient.post<[]>(this.url + "outstandingVicePresident/getGroupVicePresidentDetails", JSON.stringify(data), this.options);
  }

  getOutstandingPresidentOldDetails(MEMBER_ID: number): Observable<[]> {
    var data = {
      MEMBER_ID: MEMBER_ID
    };

    return this.httpClient.post<[]>(this.url + "outstandingPresident/getOldPresidentData", JSON.stringify(data), this.options
    );
  }

  getDirectorOfAdminDetails(MEMBER_ID: number): Observable<[]> {
    var data = {
      MEMBER_ID: MEMBER_ID
    };

    return this.httpClient.post<[]>(this.url + "directorsOfAdministration/getAdministrationDetails", JSON.stringify(data), this.options);
  }

  getFetchData(MEMBER_ID: number, YEAR: string): Observable<[]> {
    var data = {
      MEMBER_ID: MEMBER_ID, YEAR: YEAR
    };

    return this.httpClient.post<[]>(this.url + "directorOffinance/getAmountDetails", JSON.stringify(data), this.options);
  }

  getAllYoungGiantsDetails(MEMBER_ID: number, groupID: number): Observable<[]> {
    var data = {
      MEMBER_ID: MEMBER_ID, GROUP_ID: groupID,
    };

    return this.httpClient.post<[]>(this.url + "outstandingYoungGiantsDivision/getOutstandingYoungGiantsDivisionDetails", JSON.stringify(data), this.options);
  }

  getCopyLink(postID: any): Observable<[]> {
    var data = {
      POST_ID: postID
    };

    return this.httpClient.post<[]>(this.url + "webPostDetails", JSON.stringify(data), this.options);
  }

  getEventDetails(eventID: any): Observable<[]> {
    var data = {
      EVENT_ID: eventID
    };

    return this.httpClient.post<[]>(this.url + "webEventDetails/get", JSON.stringify(data), this.options);
  }

  getCircularLink(circularID: any): Observable<[]> {
    var data = {
      CIRCULAR_ID: circularID
    };

    return this.httpClient.post<[]>(this.baseUrl + "getWebCircularDetails/get", JSON.stringify(data), this.options);
  }

  getPaymentSummaryReport(
    FilterQuery: string,
    YEAR: any,
    FEDERATION_ID: any,
    GROUP_ID: any,
    UNIT_ID: any,
  ): Observable<any> {
    var data = {
      FilterQuery: FilterQuery,
      YEAR: YEAR,
      FEDERATION_ID: FEDERATION_ID,
      GROUP_ID: GROUP_ID,
      UNIT_ID: UNIT_ID,
    };

    return this.httpClient.post<any>(
      this.url + "paymentStatisticsDetails/getPaymentReportSummary",
      JSON.stringify(data),
      this.options
    );
  }

  getPaymentDetailsReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    FilterQuery: string,
    YEAR: any,
    FEDERATION_ID: any,
    GROUP_ID: any,
    UNIT_ID: any,
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      FilterQuery: FilterQuery,
      YEAR: YEAR,
      FEDERATION_ID: FEDERATION_ID,
      GROUP_ID: GROUP_ID,
      UNIT_ID: UNIT_ID,
    };

    return this.httpClient.post<any>(
      this.url + "paymentStatisticsDetails/getPaymentReportDetails",
      JSON.stringify(data),
      this.options
    );
  }

  getMonthlySummaryReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    FilterQuery: string,
    YEAR: any,
    MONTH: any,
    FEDERATION_ID: any,
    GROUP_ID: any,
    UNIT_ID: any,
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      FilterQuery: FilterQuery,
      YEAR: YEAR,
      MONTH: MONTH,
      FEDERATION_ID: FEDERATION_ID,
      GROUP_ID: GROUP_ID,
      UNIT_ID: UNIT_ID,
    };

    return this.httpClient.post<any>(
      this.url + "monthlyReport/getMonthlyPaymentSummary",
      JSON.stringify(data),
      this.options
    );
  }

  getMonthlyDetailsReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    FilterQuery: string,
    YEAR: any,
    MONTH: any,
    FEDERATION_ID: any,
    GROUP_ID: any,
    UNIT_ID: any,
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      FilterQuery: FilterQuery,
      YEAR: YEAR,
      MONTH: MONTH,
      FEDERATION_ID: FEDERATION_ID,
      GROUP_ID: GROUP_ID,
      UNIT_ID: UNIT_ID,
    };

    return this.httpClient.post<any>(
      this.url + "monthlyReport/getMonthlyPaymentDetailed",
      JSON.stringify(data),
      this.options
    );
  }

  getAllMonthlyGroupReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<GroupMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<GroupMaster[]>(
      this.url + "groupmonthlyreport/get",
      JSON.stringify(data),
      this.options
    );
  }

  getMonthlyGroupReport(pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(this.url + "groupmonthlyreport/get", JSON.stringify(data), this.options);
  }

  sendApprovalEmailFromFederationPresident(data: any): Observable<number> {
    return this.httpClient.post<number>(this.url + "unitBODStatus/checkPDFList", JSON.stringify(data), this.options);
  }

  checkUnitBOD(data: any): Observable<number> {
    return this.httpClient.post<number>(this.url + "unitBODStatus/checkUnitBOD", JSON.stringify(data), this.options);
  }

  sendForUnitApprovalToFederationPresident(data: any): Observable<number> {
    return this.httpClient.post<number>(this.url + "unitBODStatus/checkPDFList", JSON.stringify(data), this.options);
  }

  sendForFederationApprovalToAdministrator(data: any): Observable<number> {
    return this.httpClient.post<number>(this.url + "federationBODStatus/checkPDFList", JSON.stringify(data), this.options);
  }

  unitBODApproval(mailData: any): Observable<number> {
    mailData["CLIENT_ID"] = this.clientId;
    return this.httpClient.post<number>(this.url + "unitBODStatus/unitBODApproval", JSON.stringify(mailData), this.options);
  }

  checkFederationBOD(data: any): Observable<number> {
    return this.httpClient.post<number>(this.url + "federationBODStatus/checkFederationBOD", JSON.stringify(data), this.options);
  }

  federationBODApproval(mailData: any): Observable<number> {
    mailData["CLIENT_ID"] = this.clientId;
    return this.httpClient.post<number>(this.url + "federationBodStatus/federationBODApproval", JSON.stringify(mailData), this.options);
  }

  getAllYears(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<[]>(this.url + "year/get", JSON.stringify(data), this.options);
  }

  getAllSystemFees(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<SystemFeesMaster[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter
    };

    return this.httpClient.post<SystemFeesMaster[]>(this.url + "systemFees/get", JSON.stringify(data), this.options);
  }

  createSystemFees(SystemFees: SystemFeesMaster): Observable<number> {
    SystemFees.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(this.url + "systemFees/create", JSON.stringify(SystemFees), this.options);
  }

  updateSystemFees(SystemFees: SystemFeesMaster): Observable<number> {
    SystemFees.CLIENT_ID = this.clientId;
    return this.httpClient.put<number>(this.url + "systemFees/update", JSON.stringify(SystemFees), this.options);
  }

  sendCircularPublishMail(data: any): Observable<number> {
    return this.httpClient.post<number>(this.url + "circular/sendCircularMail", JSON.stringify(data), this.options);
  }

  sendGroupMonthlyReportMail(data: any): Observable<number> {
    return this.httpClient.post<number>(this.url + "groupmonthlyreport/sendReportMail", JSON.stringify(data), this.options);
  }

  ProjectsOfTheMonth(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(this.url + "monthlyProjects/get", JSON.stringify(data), this.options);
  }

  EventsOfTheMonth(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<any>(this.url + "monthlyEvent/get", JSON.stringify(data), this.options);
  }

  MeetingsOfTheMonth(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter
    };

    return this.httpClient.post<any>(this.url + "monthlyMeeting/get", JSON.stringify(data), this.options);
  }

  AddedMemberList(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter
    };

    return this.httpClient.post<any>(this.url + "member/get", JSON.stringify(data), this.options);
  }

  saveMapInvities(CLIENT_ID: number, MEETING_ID: number, datas: any, IS_ATTENDANCE_MARKED: boolean, IS_INVITION_SEND: boolean): Observable<any> {
    var data = {
      CLIENT_ID: CLIENT_ID,
      MEETING_ID: MEETING_ID,
      data: datas,
      IS_ATTENDANCE_MARKED: IS_ATTENDANCE_MARKED,
      IS_INVITION_SEND: IS_INVITION_SEND,
    };

    this.options = {
      headers: this.httpHeaders,
    };

    return this.httpClient.post<any>(this.url + "groupMeetingAttendance/addBulk", JSON.stringify(data), this.options);
  }

  saveEventMapInvities(eventID: number, dataArray: any, attendanceMarkedStatus: boolean, invitationSendStatus: boolean): Observable<any> {
    var data = {
      CLIENT_ID: this.clientId,
      EVENT_ID: eventID,
      data: dataArray,
      IS_ATTENDANCE_MARKED: attendanceMarkedStatus,
      IS_INVITION_SEND: invitationSendStatus,
    };

    this.options = {
      headers: this.httpHeaders,
    };

    return this.httpClient.post<any>(this.url + "eventAttendance/addBulk", JSON.stringify(data), this.options);
  }

  getAllInvitiees(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter
    };

    return this.httpClient.post<any>(this.url + "groupMeetingAttendance/getDetails", JSON.stringify(data), this.options);
  }

  addBulkgroupMeetingAttendance(
    CLIENT_ID: number,
    MEETING_ID: number,
    datas: any,
    groupID: number,
    IS_ATTENDANCE_MARKED: boolean,
    IS_INVITION_SEND: boolean
  ): Observable<any> {
    var data = {
      CLIENT_ID: CLIENT_ID,
      MEETING_ID: MEETING_ID,
      data: datas,
      GROUP_ID: groupID,
      IS_ATTENDANCE_MARKED: IS_ATTENDANCE_MARKED,
      IS_INVITION_SEND: IS_INVITION_SEND,
    };

    this.options = {
      headers: this.httpHeaders,
    };

    return this.httpClient.post<any>(this.url + "groupMeetingAttendance/addBulk", JSON.stringify(data), this.options);
  }

  addBulkEventAttendance(eventID: number, dataArray: any, groupID: number, attendanceMarkedStatus: boolean, invitationSendStatus: boolean): Observable<any> {
    var data = {
      CLIENT_ID: this.clientId,
      EVENT_ID: eventID,
      data: dataArray,
      GROUP_ID: groupID,
      IS_ATTENDANCE_MARKED: attendanceMarkedStatus,
      IS_INVITION_SEND: invitationSendStatus,
    };

    this.options = {
      headers: this.httpHeaders,
    };


    return this.httpClient.post<any>(this.url + "eventAttendance/addBulk", JSON.stringify(data), this.options);
  }

  createMonthlyGroupReport(model: MonthlyGroupReport): Observable<number> {
    model.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(this.url + "groupmonthlyreport/addDetails", JSON.stringify(model), this.options);
  }

  updateMonthlyGroupReport(model: MonthlyGroupReport): Observable<number> {
    model.CLIENT_ID = this.clientId;
    return this.httpClient.post<number>(this.url + "groupmonthlyreport/updateDetails", JSON.stringify(model), this.options);
  }

  groupMonthlyReportFetchOldData(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string, groupID: number, month: number, year: number): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      GROUP_ID: groupID,
      MONTH: month,
      YEAR: year
    };

    return this.httpClient.post<any>(this.url + "groupmonthlyreport/fetchOldData", JSON.stringify(data), this.options);
  }

  getGroupWiseMonthlyReportDetails(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string, year: number): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: year
    };

    return this.httpClient.post<[]>(this.url + "groupmonthlyreport/getReportDetails", JSON.stringify(data), this.options);
  }

  getUnitWiseMonthlyReportDetails(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string, year: number): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: year
    };

    return this.httpClient.post<[]>(this.url + "groupmonthlyreport/getUnitReportDetails", JSON.stringify(data), this.options);
  }

  getFederationWiseMonthlyReportDetails(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string, year: number): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: year
    };

    return this.httpClient.post<[]>(this.url + "groupmonthlyreport/getFederationReportDetails", JSON.stringify(data), this.options);
  }

  getActivityReport(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string, TYPE: any): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      TYPE: TYPE,
    };

    return this.httpClient.post<any>(this.url + "activitylogdetails/getActivityLogReport", JSON.stringify(data), this.options);
  }

  getAnniversaryReport(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string, TYPE: any): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      TYPE: TYPE
    };

    return this.httpClient.post<any>(this.url + "activitylogdetails/getLogReport", JSON.stringify(data), this.options);
  }

  getLoginLogoutReport(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string): Observable<any> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter
    };

    return this.httpClient.post<any>(this.url + "activitylogdetails/getLoginLogoutReport", JSON.stringify(data), this.options);
  }

  deleteMonthlyReportingRecord(month: number, year: number, groupID: number): Observable<any> {
    var data = {
      MONTH: month,
      YEAR: year,
      GROUP_ID: groupID,
    };

    return this.httpClient.post<any>(this.url + "groupmonthlyreport/deleteMonthlyReport", JSON.stringify(data), this.options);
  }

  getGroupStatusWiseReport(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string, year: number): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: year
    };

    return this.httpClient.post<[]>(this.url + "group/getGroupStatusWiseReport", JSON.stringify(data), this.options);
  }

  createAward(award: AwardsMaster): Observable<number> {
    award.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "award/create/",
      JSON.stringify(award),
      this.options
    );
  }

  updateAward(award: AwardsMaster): Observable<number> {
    award.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "award/update/",
      JSON.stringify(award),
      this.options
    );
  }

  getAllAwards(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<[]>(
      this.url + "award/get",
      JSON.stringify(data),
      this.options
    );
  }

  createCertificate(certificate: CertificateMaster): Observable<number> {
    certificate.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "certificate/create/",
      JSON.stringify(certificate),
      this.options
    );
  }

  updateCertificate(certificate: CertificateMaster): Observable<number> {
    certificate.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "certificate/update/",
      JSON.stringify(certificate),
      this.options
    );
  }

  getAllCertificate(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<[]>(
      this.url + "certificate/get",
      JSON.stringify(data),
      this.options
    );
  }

  getAwardMapping(
    groupID: number,
    year: number,
    awardLevel: string,
    awardType: string,
  ): Observable<any> {
    var data = {
      GROUP_ID: groupID,
      YEAR: year,
      AWARD_LEVEL: awardLevel,
      AWARD_TYPE: awardType
    };

    return this.httpClient.post<any>(
      this.url + "awardMapping/getMappingData",
      JSON.stringify(data),
      this.options
    );
  }

  updateAwardCertificateMapping(groupID: number, year: number, awardLevel: string, awardType: string, awardMappingData: any): Observable<number> {
    var data = {
      GROUP_ID: groupID,
      YEAR: year,
      AWARD_LEVEL: awardLevel,
      AWARD_TYPE: awardType,
      DATA: awardMappingData
    };

    return this.httpClient.post<number>(
      this.url + "awardMapping/addBulk",
      JSON.stringify(data),
      this.options
    );
  }

  getGlobalSettingData(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<[]>(
      this.baseUrl + "globalSettings/getVersion",
      JSON.stringify(data),
      this.options
    );
  }

  getConventionalMemberMapping(
    YEAR: number,
    GROUP_ID: number,
  ): Observable<Membermaster[]> {
    var data = {
      YEAR: YEAR,
      GROUP_ID: GROUP_ID
    };

    return this.httpClient.post<Membermaster[]>(
      this.url + "conventionMapping/getMappingData",
      JSON.stringify(data),
      this.options
    );
  }

  saveConventionalMemberMapping(groupID: number, conventionalmapping: ConventionalMemberMapping[], year: any): Observable<number> {
    var data = {
      GROUP_ID: groupID,
      YEAR: year,
      CLIENT_ID: this.clientId,
      data: conventionalmapping,
    };

    return this.httpClient.post<number>(
      this.url + "conventionMapping/addBulk/",
      JSON.stringify(data),
      this.options
    );
  }

  getAuditReport(
    pageIndex: number,
    pageSize: number,
    sortKey: string,
    sortValue: string,
    filter: string
  ): Observable<AuditReport[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
    };

    return this.httpClient.post<AuditReport[]>(
      this.url + "auditReport/get",
      JSON.stringify(data),
      this.options
    );
  }

  createAuditReport(model: AuditReport): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.post<number>(
      this.url + "auditReport/create",
      JSON.stringify(model),
      this.options
    );
  }

  updateAuditReport(model: AuditReport): Observable<number> {
    model.CLIENT_ID = this.clientId;

    return this.httpClient.put<number>(
      this.url + "auditReport/update",
      JSON.stringify(model),
      this.options
    );
  }

  getDetailedGroupStatusWiseReport(pageIndex: number, pageSize: number, sortKey: string, sortValue: string, filter: string, year: number): Observable<[]> {
    var data = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortKey: sortKey,
      sortValue: sortValue,
      filter: filter,
      YEAR: year
    };

    return this.httpClient.post<[]>(this.url + "group/getGroupStatusReport", JSON.stringify(data), this.options);
  }

  deletePostComment(data: Comments): Observable<any> {
    return this.httpClient.put<any>(this.url + "comment/delete", JSON.stringify(data), this.options);
  }

  deleteEventComment(data: EventComment): Observable<any> {
    return this.httpClient.put<any>(this.url + "groupProjectActivity/delete", JSON.stringify(data), this.options);
  }
}
