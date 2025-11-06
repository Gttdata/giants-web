import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})

export class EventDetailsComponent implements OnInit {
  eventTitle: string = "";
  eventDetails: any[] = [];
  loadingPage: boolean = false;

  constructor(private _Activatedroute: ActivatedRoute, private router: Router, private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        let details = ev.url.split('=')[(ev.url.split('=').length) - 1];
        this.eventTitle = details;
        this.loadingPage = true;

        this.api.getEventDetails(this.eventTitle).subscribe(data => {
          if (data['code'] == 200) {
            this.loadingPage = false;
            this.eventDetails = data['data'];
          }

        }, err => {
          this.loadingPage = false;

          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });
      }
    });
  }

  getUserPhoto(photoURL: string): string {
    if ((photoURL == null) || (photoURL.trim() == '')) {
      return 'assets/anony.png';

    } else {
      return this.api.retriveimgUrl + 'profileImage/' + photoURL;
    }
  }

  getPhotoURL(photoURL: string): string {
    return this.api.retriveimgUrl + "groupActivity/" + photoURL;
  }

  getTimeInAM_PM(time: any): string {
    return this.datePipe.transform(new Date(), "yyyy-MM-dd" + " " + time);
  }
}
