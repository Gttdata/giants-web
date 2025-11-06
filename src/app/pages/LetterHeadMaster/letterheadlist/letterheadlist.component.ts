import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { LetterHeadMaster } from 'src/app/Models/LetterHeadMaster';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-letterheadlist',
  templateUrl: './letterheadlist.component.html',
  styleUrls: ['./letterheadlist.component.css']
})
export class LetterheadlistComponent implements OnInit {
  drawerData: LetterHeadMaster = new LetterHeadMaster();
  drawerVisible!: boolean;
  drawerTitle!: string;

  pageIndex = 1;
  totalRecords = 1;
  dataList = [];
  loadingRecords = true;

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }
  
  
  ngOnInit() {
    this.search(true);
  }
  add() {
    this.drawerTitle = "Add New Letter Head";
    this.drawerData = new LetterHeadMaster();
    this.drawerVisible = true;
  }
  getWidth() {
    if (window.innerWidth <= 400)
      return 400;

    else
      return 700;
  }
  get closeCallback() {
    return this.drawerClose.bind(this);
  }
  drawerClose(): void {
    this.drawerVisible = false;
  }

  search(reset: boolean = false, loadMore: boolean = false) {
    if (reset) {
      this.pageIndex = 1;
    }
    

    this.loadingRecords = true;

    this.api.getAllLetterHead(0, 0,'' ,'' , '').subscribe(data => {
      if (data['code'] == 200) {
        this.loadingRecords = false;
        this.totalRecords = data['count'];

        if (loadMore) {
          this.dataList.push(...data['data']);

        } else {
          this.dataList = data['data'];
        }

        this.pageIndex++;
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  edit(data: LetterHeadMaster): void {
    this.drawerTitle = "aaa " + "Edit Meeting";
    this.drawerData = Object.assign({}, data);
    this.drawerVisible = true;
    

    if (this.drawerData.TEMPLATE_URL != " ")
      this.drawerData.TEMPLATE_URL = this.api.retriveimgUrl + "templateImages/" + this.drawerData.TEMPLATE_URL;
    else
      this.drawerData.TEMPLATE_URL = null;

    
    // Drawer Type
    // this.AddgroupmeetingsattendanceComponentVar.addDrawer = true;
   
  }
  getPhotoURL(photoURL: string) {
    return this.api.retriveimgUrl + "templateImages/" + photoURL;
  }
}
