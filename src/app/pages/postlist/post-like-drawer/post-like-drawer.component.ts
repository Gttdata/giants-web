import { DatePipe } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-post-like-drawer',
  templateUrl: './post-like-drawer.component.html',
  styleUrls: ['./post-like-drawer.component.css']
})

export class PostLikeDrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() isSpinning: boolean;
  @Input() dataList: any;
  private categoriesSubject = new BehaviorSubject<Array<string>>([]);
  categories$ = this.categoriesSubject.asObservable();
  emitted = false;
  pageIndex = 1;
  pageSize = 10;
  totalRecords: number;
  RETRIVE_IMAGE_URL: string = this.api.retriveimgUrl;
  postLikeLoad: boolean = false;
  postLikeID: number;

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe) { }

  ngOnInit() { }

  @HostListener('document:touchmove', ['$event'])
  @HostListener('document:wheel', ['$event'])

  onScroll(e: any) {
    if (Math.round(document.getElementById("like").scrollTop + document.getElementById("like").offsetHeight + 1) >= document.getElementById("like").scrollHeight && !this.emitted) {
      this.emitted = true;
      this.onScrollingFinished();

    } else if (Math.round(document.getElementById("like").scrollTop + document.getElementById("like").offsetHeight + 1) < document.getElementById("like").scrollHeight) {
      this.emitted = false;
    }
  }

  onScrollingFinished() {
    console.log("End");
    this.loadMore();
  }

  loadMore(): void {
    if (this.getNextItems()) {
      this.categoriesSubject.next(this.dataList);
    }
  }

  getNextItems(): boolean {
    console.log("End");

    if (this.dataList.length >= this.totalRecords) {
      return false;
    }

    this.search(false, true);
    return true;
  }

  search(reset: boolean = false, loadMore: boolean = false) {
    if (this.postLikeLoad) {
      if (reset) {
        this.pageIndex = 1;
      }

      this.isSpinning = true;

      this.api.getAllLike(this.pageIndex, this.pageSize, 'CREATED_MODIFIED_DATE', 'DESC', ' AND POST_ID=' + this.postLikeID).subscribe((data) => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          this.totalRecords = data['count'];

          if (loadMore) {
            this.dataList.push(...data['data']);

          } else {
            this.dataList = data['data'];
          }

          this.pageIndex++;
        }

      }, (err) => {
        this.isSpinning = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  close(myForm: NgForm) {
    this.drawerClose();
    this.postLikeLoad = false;
  }

  getProfilePhoto(photoURL: string) {
    if ((photoURL == null) || (photoURL.trim() == '')) {
      return 'assets/anony.png';

    } else {
      return this.api.retriveimgUrl + 'profileImage/' + photoURL;
    }
  }
}
