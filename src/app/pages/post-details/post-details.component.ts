import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
// import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})

export class PostDetailsComponent implements OnInit {
  postTitle: string = "";
  postDetails: any[] = [];
  loadingPage: boolean = false;

  constructor(private _Activatedroute: ActivatedRoute, private router: Router, private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        let details = ev.url.split('=')[(ev.url.split('=').length) - 1];
        this.postTitle = details;

        // this.postTitle = this.decryptData(details);
        // console.log(this.decryptData(details));

        // this.postTitle = this._Activatedroute.snapshot.paramMap.get("title");
        // console.log(this.postTitle);

        this.loadingPage = true;

        this.api.getCopyLink(this.postTitle).subscribe(data => {
          if (data['code'] == 200) {
            this.loadingPage = false;
            this.postDetails = data['data'];
          }

        }, err => {
          this.loadingPage = false;

          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });
      }
    });
  }

  // decryptData(data: any) {
  //   try {
  //     const bytes = CryptoJS.AES.decrypt(data, this.api.encryptSecretKey);

  //     if (bytes.toString()) {
  //       return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  //     }

  //     return data;

  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  getUserPhoto(photoURL: string): string {
    if ((photoURL == null) || (photoURL.trim() == '')) {
      return 'assets/anony.png';

    } else {
      return this.api.retriveimgUrl + 'profileImage/' + photoURL;
    }
  }

  getPhotoURL(photoURL: string): string {
    return this.api.retriveimgUrl + "postImages/" + photoURL;
  }

  getImageCount(photoURL1: string, photoURL2: string): number {
    let count: number = 0;

    if (photoURL1 != " ")
      count = count + 1;

    if (photoURL2 != " ")
      count = count + 1;

    return count;
  }
}
