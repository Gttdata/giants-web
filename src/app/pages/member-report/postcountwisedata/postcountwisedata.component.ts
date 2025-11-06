import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-postcountwisedata',
  templateUrl: './postcountwisedata.component.html',
  styleUrls: ['./postcountwisedata.component.css']
})
export class PostcountwisedataComponent implements OnInit {
  @Input() DetailCount = [];
  @Input() closePostCountDrawer: Function;
  @Input() PostCountVisible: boolean;
  @Input() data_List:any[] = [];
  @Input() totalRecords: number;
  

  constructor(private api: ApiService, private message: NzNotificationService) { }

  ngOnInit() {
  }

  getUserPhoto(photoURL: string) {
    if (photoURL == " ") {
      return "assets/anony.png";
    } else {
      return this.api.retriveimgUrl + "profileImage/" + photoURL;
    }
  }
  getPhotoURL(photoURL: string) {
    return this.api.retriveimgUrl + "postImages/" + photoURL;
  }
}
