import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { Membermaster } from 'src/app/Models/MemberMaster';
import { Comments, Likes } from 'src/app/Models/comment';
import { ApiService } from 'src/app/Service/api.service';
import { PostLikeDrawerComponent } from '../post-like-drawer/post-like-drawer.component';
import { AddcommentdrawerComponent } from '../addcomment/addcommentdrawer/addcommentdrawer.component';
import { DatePipe } from '@angular/common';
import { Post } from 'src/app/Models/post';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-readable-profile',
  templateUrl: './member-readable-profile.component.html',
  styleUrls: ['./member-readable-profile.component.css']
})

export class MemberReadableProfileComponent implements OnInit {
  @Input() MemberProfiledrawerClose: Function
  @Input() drawerVisible: boolean;
  @Input() data: any = new Membermaster();
  @Input() postData: any[] = [];
  @Input() ForImage: any[] = [];
  @Input() passmember_id: number;
  @Input() totalRecords = 1;
  isSpinning: boolean = false;
  emitted: boolean = false;
  formTitle: string = 'Profile';
  expandDescription: any;
  homeFederationID: number = Number(this._cookie.get("HOME_FEDERATION_ID"));
  homeUnitID: number = Number(this._cookie.get("HOME_UNIT_ID"));
  homeGroupID: number = Number(this._cookie.get("HOME_GROUP_ID"));
  userID: number = this.api.userId;

  constructor(public api: ApiService, private datePipe: DatePipe, private message: NzNotificationService, private _cookie: CookieService, private modal: NzModalService) { }

  ngOnInit() { }

  @HostListener('document:touchmove', ['$event'])
  @HostListener('document:wheel', ['$event'])

  onScroll(e: any) {
    if (Math.round(document.getElementById("memberPost").scrollTop + document.getElementById("memberPost").offsetHeight + 1) >= document.getElementById("memberPost").scrollHeight && !this.emitted) {
      this.emitted = true;
      this.onScrollingFinished();

    } else if (Math.round(document.getElementById("memberPost").scrollTop + document.getElementById("memberPost").offsetHeight + 1) < document.getElementById("memberPost").scrollHeight) {
      this.emitted = false;
    }
  }

  private categoriesSubject = new BehaviorSubject<Array<string>>([]);
  categories$ = this.categoriesSubject.asObservable();

  onScrollingFinished() {
    console.log("End");
    this.loadMore();
  }

  loadMore(): void {
    if (this.getNextItems()) {
      this.categoriesSubject.next(this.postData);
    }
  }

  getNextItems(): boolean {
    console.log("End");

    if (this.postData.length >= this.totalRecords) {
      return false;
    }

    this.search(false, true);
    return true;
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.search(true);
  }

  pageIndex = 1;
  pageSize = 5;
  sortKey: string = "POST_CREATED_DATETIME";
  sortValue = 'desc';
  postLoad: boolean = false;

  search(reset: boolean = false, loadMore: boolean = false) {
    if (this.postLoad) {
      if (reset) {
        this.pageIndex = 1;
      }

      var sort: string;
      try {
        sort = this.sortValue.startsWith("a") ? "asc" : "desc";

      } catch (error) {
        sort = "";
      }

      var postAccessFilter = "";
      postAccessFilter = " AND ((IS_DELETED=0 AND POST_STATUS='P' AND POST_TYPE='P') OR (IS_DELETED=0 AND POST_STATUS='P' AND POST_TYPE='G' AND find_in_set('" + this.homeGroupID + "',TYPE_ID)) OR (IS_DELETED=0 AND POST_STATUS='P' AND POST_TYPE='U' AND find_in_set('" + this.homeUnitID + "',TYPE_ID)) OR (IS_DELETED=0 AND POST_STATUS='P' AND POST_TYPE='F' AND find_in_set('" + this.homeFederationID + "',TYPE_ID)))";
      this.isSpinning = true;

      this.api.getAllUaserposts(this.pageIndex, this.pageSize, this.sortKey, 'desc', " AND MEMBER_ID=" + this.passmember_id + postAccessFilter).subscribe(data => {
        if ((data['code'] == 200)) {
          this.isSpinning = false;
          this.totalRecords = data['count'];
          this.expandDescription = new Array(this.totalRecords).fill(false);

          if (loadMore) {
            this.postData.push(...data['data']);

          } else {
            this.postData = data['data'];
          }

          this.pageIndex++;

        } else {
          this.isSpinning = false;
        }

      }, err => {
        this.isSpinning = false;

        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  getProfilePhoto(photoURL: string) {
    if ((photoURL == null) || (photoURL.trim() == '')) {
      return 'assets/anony.png';

    } else {
      return this.api.retriveimgUrl + 'profileImage/' + photoURL;
    }
  }

  getPhotoURL(photoURL: string, status: boolean): string {
    if (status) {
      if (photoURL.startsWith("GA")) {
        return this.api.retriveimgUrl + "groupActivity/" + photoURL;

      } else {
        return this.api.retriveimgUrl + "postImages/" + photoURL;
      }

    } else {
      return this.api.retriveimgUrl + "postImages/" + photoURL;
    }
  }

  getImageCount(photoURL1: string, photoURL2: string) {
    let count: number = 0;

    if (photoURL1 != " ")
      count = count + 1;

    if (photoURL2 != " ")
      count = count + 1;

    return count;
  }

  drawerTitle2: string;
  selectedIndex: number = -1;
  drawerTitledata: string = "Post Details";
  DispAllImages: boolean = false;

  viewPhotoes(i: any) {
    this.selectedIndex = i;
    this.drawerTitle2 = "";
    this.DispAllImages = true;
    this.imgWidth1 = 60;
    this.imgWidth2 = 60;
    this.imgWidth3 = 60;
  }

  clickCount: number = 0;

  identifyClickOrDoubleClick(data: Post, i: any) {
    this.clickCount++;

    setTimeout(() => {
      if (this.clickCount === 1) {
        this.viewPhotoes(i);

      } else if (this.clickCount === 2) {
        this.likeTheButton(data.ID, i);
      }

      this.clickCount = 0;
    }, 200);
  }

  AllPostDrawerClose() {
    this.DispAllImages = false;
    this.selectedIndex = -1;
  }

  getWidth() {
    if (window.innerWidth <= 400)
      return 380;

    else
      return 800;
  }

  close() {
    this.drawerVisible = false;
    this.MemberProfiledrawerClose();
  }

  getHeightOfDescription(index: number) {
    this.expandDescription[index] = !this.expandDescription[index];
  }

  dataa2: Likes = new Likes();

  likeTheButton = (event: any, i: any) => {
    this.dataa2.MEMBER_ID = this.api.userId;
    this.dataa2.STATUS = 1;
    this.dataa2.POST_ID = event;
    this.isSpinning = true;

    this.api.createlike(this.dataa2).subscribe(successCode => {
      if (successCode['code'] == 200) {
        this.api.getAllUaserposts(1, 1, this.sortKey, 'desc', " AND ID=" + event).subscribe(data => {
          if ((data['code'] == 200) && (data['count'] > 0)) {
            this.isSpinning = false;
            this.postData[i] = data['data'][0];

          } else {
            this.isSpinning = false;
          }

        }, err => {
          this.isSpinning = false;

          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });

      } else {
        this.isSpinning = false;
      }
    });
  }

  dataList2 = [];
  likeDrawerTitle: string;
  @ViewChild(PostLikeDrawerComponent, { static: false }) PostLikeDrawerComponentVar: PostLikeDrawerComponent;

  like(event: any): void {
    this.likeDrawerTitle = "aaa " + "Likes";
    this.PostLikeDrawerComponentVar.dataList = [];
    this.PostLikeDrawerComponentVar.postLikeID = event;
    this.PostLikeDrawerComponentVar.pageIndex = 1;
    this.PostLikeDrawerComponentVar.pageSize = 10;
    this.PostLikeDrawerComponentVar.postLikeLoad = true;
    this.PostLikeDrawerComponentVar.search(true, true);
    this.drawerVisible4 = true;
  }

  drawerVisible4: boolean = false;

  drawerClose4(): void {
    this.drawerVisible4 = false;
  }

  get postLikeCloseCallback() {
    return this.drawerClose4.bind(this);
  }

  drawerTitle3: string;
  drawerData3: Comments = new Comments();
  drawerVisible3: boolean = false;
  dataList1 = [];
  @ViewChild(AddcommentdrawerComponent, { static: false }) AddcommentdrawerComponentVar: AddcommentdrawerComponent;

  addComment(postID: any, index: number) {
    this.drawerTitle3 = "aaa " + "Add your comment";
    this.drawerData3 = new Comments();
    this.drawerData3.POST_ID = Number(postID);
    sessionStorage.setItem("Comment_Id", postID);
    sessionStorage.setItem("Comment_Id_index", String(index));
    this.drawerData3.COMMENT_CREATED_DATETIME = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.dataList1 = [];
    this.AddcommentdrawerComponentVar.pageIndex = 1;
    this.AddcommentdrawerComponentVar.pageSize = 10;
    this.AddcommentdrawerComponentVar.postCommentLoad = true;
    this.AddcommentdrawerComponentVar.search(true, true);
    this.drawerVisible3 = true;
  }

  drawerClose3(): void {
    this.commentIncrease(sessionStorage.getItem("Comment_Id"), sessionStorage.getItem("Comment_Id_index"),);
    this.drawerVisible3 = false;
  }

  get closeCallback3() {
    return this.drawerClose3.bind(this);
  }

  commentIncrease = (postID: any, i: any) => {
    this.isSpinning = true;

    this.api.getAllUaserposts(1, 1, this.sortKey, 'desc', " AND ID=" + postID).subscribe(data => {
      if ((data['code'] == 200) && (data['count'] > 0)) {
        this.isSpinning = false;
        this.postData[i] = data['data'][0];

      } else {
        this.isSpinning = false;
      }

    }, err => {
      this.isSpinning = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  visible: boolean = false;
  currentPostLink: string = "";
  resharePostMemberID: number = 0;
  resharePostData: Post = new Post();
  name: string = '';
  url: string = '';
  hashtagsToPost: string = '';

  showMsg(postData: Post) {
    this.resharePostMemberID = postData.MEMBER_ID;
    this.resharePostData = postData;
    this.visible = true;
    this.name = postData.DESCRIPTION;
    this.url = this.api.retriveimgUrl + "postImages/" + postData.IMAGE_URL1;
    this.hashtagsToPost = postData.HASHTAGS ? postData.HASHTAGS : "";
    let link = this.api.baseUrl.split('/');
    let formLink = link[0] + "//" + link[2].split(':')[0];
    this.currentPostLink = formLink + "/post-details;title=" + postData.ID.toString();
  }

  CloseShare() {
    this.visible = false;
  }

  social(a: string) {
    // Twitter
    let twitterHashtags = "";

    if (this.hashtagsToPost != "") {
      twitterHashtags = '&hashtags=' + this.hashtagsToPost;
    }

    let twitter = 'http://twitter.com/intent/tweet?text=&url=' + this.currentPostLink + twitterHashtags;

    // Instagram
    // let Insta = 'https://instagram.com/accounts/login/?text=%20Check%20up%20this%20awesome%20content' + this.url;
    let Insta = 'https://instagram.com';

    // Linkdin
    let Linkdin = 'https://www.linkedin.com/sharing/share-offsite/?url=' + this.currentPostLink;

    // Facebook
    let facebook = 'https://www.facebook.com/sharer/sharer.php?u=' + this.currentPostLink;

    // WhatsApp
    let Whatsapp = 'https://api.whatsapp.com/send?text=' + this.currentPostLink;

    let b = '';

    if (a === 'Insta') {
      b = Insta;
    }

    if (a === 'twitter') {
      b = twitter;
    }

    if (a === 'Linkdin') {
      b = Linkdin;
    }

    if (a === 'facebook') {
      b = facebook;
    }

    if (a === 'Whatsapp') {
      b = Whatsapp;
    }

    let params = `width=600,height=400,left=200,top=100`;
    window.open(b, a, params);
  }

  copyPostLink() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.currentPostLink;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.message.success("Link Copied", "");
  }

  showPostDetails(postData: Post) {
    let obj1 = new Post();
    obj1.COMMENT_COUNT = 0;
    obj1.LIKE_COUNT = 0;
    obj1.DESCRIPTION = postData["DESCRIPTION"];
    obj1.HASHTAGS = postData["HASHTAGS"];
    obj1.IMAGE_URL1 = postData["IMAGE_URL1"];
    obj1.IMAGE_URL2 = postData["IMAGE_URL2"];
    obj1.IMAGE_URL3 = postData["IMAGE_URL3"];
    obj1.POST_CREATED_DATETIME = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:MM:SS a");
    obj1.POST_TYPE = "P";
    obj1.TYPE_ID = "0";
    obj1.STATUS = 1;
    obj1.POST_STATUS = "P";
    obj1.IS_DELETED = false;
    obj1.MEMBER_ID = this.api.userId;
    obj1.POST_CREATED_MEMBER_ID = postData["MEMBER_ID"];

    this.modal.confirm({
      nzTitle: 'Are you sure want to repost in public?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOnOk: (postlist: NgForm) => {
        this.isSpinning = true;

        this.api.addpost(obj1).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Post Created Successfully", "");
            this.isSpinning = false;
            this.search(true);
            this.visible = false;

          } else {
            this.message.error("Post Creation Failed", "");
            this.isSpinning = false;
            this.search(true);
            this.visible = false;
          }
        });
      },

      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  imgWidth1: number = 60;

  mouseWheelUpFunc1() {
    if (this.imgWidth1 > 200) {
      this.imgWidth1 = 200;
    }

    this.imgWidth1 = this.imgWidth1 + 20;
  }

  mouseWheelDownFunc1() {
    if (this.imgWidth1 < 60) {
      this.imgWidth1 = 60;
    }

    this.imgWidth1 = this.imgWidth1 - 20;
  }

  imgWidth2: number = 60;

  mouseWheelUpFunc2() {
    if (this.imgWidth2 > 200) {
      this.imgWidth2 = 200;
    }

    this.imgWidth2 = this.imgWidth2 + 20;
  }

  mouseWheelDownFunc2() {
    if (this.imgWidth2 < 60) {
      this.imgWidth2 = 60;
    }

    this.imgWidth2 = this.imgWidth2 - 20;
  }

  imgWidth3: number = 60;

  mouseWheelUpFunc3() {
    if (this.imgWidth3 > 200) {
      this.imgWidth3 = 200;
    }

    this.imgWidth3 = this.imgWidth3 + 20;
  }

  mouseWheelDownFunc3() {
    if (this.imgWidth3 < 60) {
      this.imgWidth3 = 60;
    }

    this.imgWidth3 = this.imgWidth3 - 20;
  }

  getDOB(dob: any, showHideYear: boolean) {
    if (dob != null && this.datePipe.transform(new Date(dob), "yyyyMMdd") != "19000101") {
      if (showHideYear) {
        return this.datePipe.transform(new Date(dob), "dd MMM yyyy");

      } else {
        return this.datePipe.transform(new Date(dob), "dd MMM");
      }

    } else {
      return "";
    }
  }
}