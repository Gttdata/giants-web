import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-circularcountwisedata',
  templateUrl: './circularcountwisedata.component.html',
  styleUrls: ['./circularcountwisedata.component.css']
})
export class CircularcountwisedataComponent implements OnInit {
  @Input() CircuCount = [];
  @Input() closeCircularCountDrawer: Function;
  @Input() circucountVisible: boolean;
  @Input() data_List:any[] = [];
  @Input() totalRecords: number;
  constructor(private api: ApiService) { }

  ngOnInit() {
  }
  getUserPhoto(photoURL: string) {
    if (photoURL == " ") {
      return "assets/anony.png";
    } else {
      return this.api.retriveimgUrl + "profileImage/" + photoURL;
    }
  }

}
