import { DatePipe } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { BehaviorSubject } from 'rxjs';
import { Comments } from 'src/app/Models/comment';
import { Post } from 'src/app/Models/post';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-addcommentdrawer',
  templateUrl: './addcommentdrawer.component.html',
  styleUrls: ['./addcommentdrawer.component.css']
})

export class AddcommentdrawerComponent implements OnInit {
  @Input() drawerClose2: Function;
  @Input() dataa: Comments;
  member: Post = new Post();
  @Input() isSpinning: boolean;
  @Input() totalRecords = 1;
  @Input() dataList1 = [];
  filter = '';
  addDrawer2: boolean = false;
  DESCRIPTION1: string = "";
  private categoriesSubject = new BehaviorSubject<Array<string>>([]);
  categories$ = this.categoriesSubject.asObservable();
  emitted = false;
  pageIndex = 1;
  pageSize = 10;
  RETRIVE_IMAGE_URL: string = this.api.retriveimgUrl;
  postCommentLoad: boolean = false;
  expandPostComment: boolean[] = [];
  userID: number = this.api.userId;

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe) { }

  ngOnInit() { }

  @HostListener('document:touchmove', ['$event'])
  @HostListener('document:wheel', ['$event'])

  onScroll(e: any) {
    if (Math.round(document.getElementById("Comment").scrollTop + document.getElementById("Comment").offsetHeight + 1) >= document.getElementById("Comment").scrollHeight && !this.emitted) {
      this.emitted = true;
      this.onScrollingFinished();

    } else if (Math.round(document.getElementById("Comment").scrollTop + document.getElementById("Comment").offsetHeight + 1) < document.getElementById("Comment").scrollHeight) {
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

  search(reset: boolean = false, loadMore: boolean = false) {
    if (this.postCommentLoad) {
      if (reset) {
        this.pageIndex = 1;
      }

      this.isSpinning = true;

      this.api.getAllComments(this.pageIndex, this.pageSize, 'COMMENT_CREATED_DATETIME', 'DESC', ' AND IS_COMMENT_DELETE=false AND POST_ID=' + sessionStorage.getItem("Comment_Id")).subscribe((data) => {
        if (data['code'] == 200) {
          this.isSpinning = false;
          this.totalRecords = data['count'];
          this.expandPostComment = new Array(this.totalRecords).fill(false);

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

  addComment() {
    if ((this.dataa.COMMENT == undefined) || (this.dataa.COMMENT == null) || (this.dataa.COMMENT.trim() == '')) {
      this.message.error("Please Type Valid Comment", "");

    } else {
      this.isSpinning = true;
      this.dataa.COMMENT_CREATED_DATETIME = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:MM:SS a");
      this.dataa.MEMBER_ID = this.api.userId;
      this.dataa.STATUS = 1;

      this.api.createPostComment(this.dataa).subscribe(successCode => {
        if (successCode['code'] == 200) {
          this.isSpinning = false;
          this.message.success("Comment saved successfully", "");
          this.dataList1 = [];
          this.dataa.COMMENT = '';
          this.search(true, true);

        } else {
          this.isSpinning = false;
          this.message.error("Failed to save comment", "");
        }
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
    this.expandPostComment[index] = !this.expandPostComment[index];
  }

  DeleteComment(comment: Comments): void {
    this.isSpinning = true;
    comment.IS_COMMENT_DELETE = true;

    this.api.deletePostComment(comment).subscribe(successCode => {
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
