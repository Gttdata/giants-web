import { DatePipe } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { BehaviorSubject } from 'rxjs';
import { EventComment } from 'src/app/Models/comment';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-add-comment',
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css']
})

export class AddCommentComponent implements OnInit {
  @Input() drawerClose2: Function;
  @Input() dataa: EventComment;
  @Input() dataList1 = [];
  @Input() isSpinning: boolean;
  @Input() totalRecords = 1;
  DETAILSModalVisible: boolean = false;
  filter = '';
  addDrawer2: boolean = false;
  DESCRIPTION1: string = "";
  private categoriesSubject = new BehaviorSubject<Array<string>>([]);
  categories$ = this.categoriesSubject.asObservable();
  emitted = false;
  pageIndex = 1;
  pageSize = 10;
  RETRIVE_IMAGE_URL: string = this.api.retriveimgUrl;
  eventCommentLoad: boolean = false;
  expandEventComment: boolean[] = [];
  userID: number = this.api.userId;

  constructor(public api: ApiService, private message: NzNotificationService, private datePipe: DatePipe) { }

  ngOnInit() { }

  @HostListener('document:touchmove', ['$event'])
  @HostListener('document:wheel', ['$event'])

  onScroll(e: any) {
    if (Math.round(document.getElementById("EventComment").scrollTop + document.getElementById("EventComment").offsetHeight + 1) >= document.getElementById("EventComment").scrollHeight && !this.emitted) {
      this.emitted = true;
      this.onScrollingFinished();

    } else if (Math.round(document.getElementById("EventComment").scrollTop + document.getElementById("EventComment").offsetHeight + 1) < document.getElementById("EventComment").scrollHeight) {
      this.emitted = false;
    }
  }

  onScrollingFinished() {
    console.log("End");
    this.loadMore();
  }

  loadMore(): void {
    if (this.getNextItems()) {
      this.categoriesSubject.next(this.dataList1);
    }
  }

  getNextItems(): boolean {
    console.log("End");

    if (this.dataList1.length >= this.totalRecords) {
      return false;
    }

    this.search(false, true);
    return true;
  }

  addComment() {
    if (this.dataa.COMMENT == undefined || this.dataa.COMMENT == null || this.dataa.COMMENT.trim() == '') {
      this.message.error("Please Type Valid Comment", "");

    } else {
      this.isSpinning = true;
      this.dataa.CREATED_MODIFIED_DATE = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:MM:SS a");
      this.dataa.MEMBER_ID = this.api.userId;
      this.dataa.STATUS = 1;

      this.api.createEventComment(this.dataa).subscribe(successCode => {
        if (successCode['code'] == 200) {
          this.isSpinning = false;
          this.message.success("Comment Added Successfully", "");
          this.dataList1 = [];
          this.dataa.COMMENT = '';
          this.search(true, true);

        } else {
          this.isSpinning = false;
          this.message.error("Failed To Save Comment", "");
        }
      });
    }
  }

  viewDETAILS(activity: any) {
    this.DETAILSModalVisible = true;
    this.DESCRIPTION1 = activity.COMMENT;
  }

  search(reset: boolean = false, loadMore: boolean = false): void {
    if (this.eventCommentLoad) {
      if (reset) {
        this.pageIndex = 1;
      }

      this.isSpinning = true;

      this.api.getAllEventComments(this.pageIndex, this.pageSize, 'CREATED_MODIFIED_DATE', 'DESC', ' AND IS_COMMENT_DELETE=false AND EVENT_ID=' + sessionStorage.getItem("Comment_Id")).subscribe((data) => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          this.totalRecords = data['count'];
          this.expandEventComment = new Array(this.totalRecords).fill(false);

          if (loadMore) {
            this.dataList1.push(...data['data']);

          } else {
            this.dataList1 = data['data'];
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
    this.drawerClose2();
    this.resetDrawer(myForm);
  }

  resetDrawer(myForm: NgForm) {
    myForm.form.reset();
  }

  getProfilePhoto(photoURL: string) {
    if ((photoURL == null) || (photoURL.trim() == '')) {
      return 'assets/anony.png';

    } else {
      return this.api.retriveimgUrl + 'profileImage/' + photoURL;
    }
  }

  showCommentInDetails(index: number): void {
    this.expandEventComment[index] = !this.expandEventComment[index];
  }

  DeleteComment(eventcomment: EventComment): void {
    this.isSpinning = true;
    eventcomment.IS_COMMENT_DELETE = true;

    this.api.deleteEventComment(eventcomment).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.message.success("Comment Deleted Successfully", "");
        this.search(true);

      } else {
        this.message.error("Failed to Comment Deletion", "");
        this.search(true);
      }
    });
  }

  cancle(): void { }
}
