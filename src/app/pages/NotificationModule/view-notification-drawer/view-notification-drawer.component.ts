import { DatePipe } from '@angular/common';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/Service/api.service';
import { AddNewNotificationDrawerComponent } from '../add-new-notification-drawer/add-new-notification-drawer.component';
import { SendEmailDrawerComponent } from '../send-email-drawer/send-email-drawer.component';

@Component({
  selector: 'app-view-notification-drawer',
  templateUrl: './view-notification-drawer.component.html',
  styleUrls: ['./view-notification-drawer.component.css']
})

export class ViewNotificationDrawerComponent implements OnInit {
  constructor(public api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private cookie: CookieService) { }

  private categoriesSubject = new BehaviorSubject<Array<string>>([]);
  emitted = false;
  @Input() closeCallback: Function;

  @HostListener('document:touchmove', ['$event'])
  @HostListener('document:wheel', ['$event'])

  onScroll(e: any) {
    if (Math.round(document.getElementById("viewNotiData").scrollTop + document.getElementById("viewNotiData").offsetHeight + 1) >= document.getElementById("viewNotiData").scrollHeight && !this.emitted) {
      this.emitted = true;
      this.onScrollingFinished();

    } else if (Math.round(document.getElementById("viewNotiData").scrollTop + document.getElementById("viewNotiData").offsetHeight + 1) < document.getElementById("viewNotiData").scrollHeight) {
      this.emitted = false;
    }
  }

  onScrollingFinished() {
    this.loadMore();
  }

  loadMore(): void {
    if (this.getNextItems()) {
      this.categoriesSubject.next(this.notificationData);
    }
  }

  getNextItems(): boolean {
    if (this.notificationData.length >= this.totalRecords) {
      return false;
    }

    this.getNotifications(false, true);
    return true;
  }

  ngOnInit() { }

  pageIndex: number = 1;
  pageSize: number = 10;
  totalRecords: number;
  notificationData: any[] = [];
  isSpinning: boolean = false;
  notificationDataLoad: boolean = false;
  userId = Number(this.cookie.get('userId'));
  roleId = Number(this.cookie.get('roleId'));
  orgId = Number(this.cookie.get('orgId'));
  federationId = Number(this.cookie.get('HOME_FEDERATION_ID'));
  unitId = Number(this.cookie.get('HOME_UNIT_ID'));
  groupId = Number(this.cookie.get('HOME_GROUP_ID'));
  expandDescription: any;

  getNotifications(reset: boolean = false, loadMore: boolean = false): void {
    if (this.notificationDataLoad) {
      if (reset) {
        this.pageIndex = 1;
        this.top();
      }

      this.userId = Number(this.cookie.get('userId'));
      this.roleId = Number(this.cookie.get('roleId'));
      this.orgId = Number(this.cookie.get('orgId'));
      this.federationId = Number(this.cookie.get('HOME_FEDERATION_ID'));
      this.unitId = Number(this.cookie.get('HOME_UNIT_ID'));
      this.groupId = Number(this.cookie.get('HOME_GROUP_ID'));
      this.isSpinning = true;

      this.api.getAllMyNotications(this.pageIndex, this.pageSize, this.userId, this.federationId, this.groupId, this.unitId).subscribe(data => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          this.totalRecords = data['count'];
          this.expandDescription = new Array(this.totalRecords).fill(false);

          if (loadMore) {
            this.notificationData.push(...data['data']);

          } else {
            this.notificationData = data['data'];
          }

          this.pageIndex++;
        }

      }, err => {
        this.isSpinning = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  sendNotiDrawerVisible: boolean = false;
  sendNotiDrawerTitle: string;
  @ViewChild(AddNewNotificationDrawerComponent, { static: false }) AddNewNotificationDrawerComponentVar: AddNewNotificationDrawerComponent;

  openSendNotiDrawer(): void {
    this.sendNotiDrawerVisible = true;
    this.sendNotiDrawerTitle = "aaa " + "Send Notification";
    this.AddNewNotificationDrawerComponentVar.sharingMode = "I";
    this.AddNewNotificationDrawerComponentVar.disableRadioButtons();
    this.AddNewNotificationDrawerComponentVar.changeRadio('I');
    this.AddNewNotificationDrawerComponentVar.NOTI_TYPE = "T";
  }

  sendNotiDrawerClose(): void {
    this.getNotifications(true);
    this.sendNotiDrawerVisible = false;
  }

  get sendNotiDrawerCloseCallback() {
    return this.sendNotiDrawerClose.bind(this);
  }

  sendEmailDrawerVisible: boolean = false;
  sendEmailDrawerTitle: string;
  @ViewChild(SendEmailDrawerComponent, { static: false }) SendEmailDrawerComponentVar: SendEmailDrawerComponent;

  openSendEmailDrawer(): void {
    this.sendEmailDrawerVisible = true;
    this.sendEmailDrawerTitle = "Send Email";
    this.SendEmailDrawerComponentVar.FROM_DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.SendEmailDrawerComponentVar.TO_DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.SendEmailDrawerComponentVar.getCount();
  }

  sendEmailDrawerClose(): void {
    this.sendEmailDrawerVisible = false;
  }

  get sendEmailDrawerCloseCallback() {
    return this.sendEmailDrawerClose.bind(this);
  }

  openImage(imgURL: string): void {
    window.open(imgURL);
  }

  close(): void {
    this.closeCallback();
  }

  getHeightOfDescription(index: number): void {
    this.expandDescription[index] = !this.expandDescription[index];
  }

  top(): void {
    setTimeout(() => {
      document.getElementById('top123').scrollIntoView();
    }, 1500);
  }

  getTextInOriginalFormat(text: string): string {
    const htmlString = text;

    const div = document.createElement('div');
    div.innerHTML = htmlString;

    return div.textContent.trim();
  }
}
