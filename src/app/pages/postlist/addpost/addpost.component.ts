import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MentionOnSearchTypes, NzMentionComponent, NzNotificationService } from 'ng-zorro-antd';
import { ApiService } from 'src/app/Service/api.service';
import { AbstractControl, NgForm } from '@angular/forms';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { CookieService } from 'ngx-cookie-service';
import { Post } from 'src/app/Models/post';
import { CompressImageService } from 'src/app/Service/image-compressor.service';
import { take } from 'rxjs/operators';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css']
})

export class AddpostComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: Post;
  @Input() drawerVisible: boolean;
  isSpinning: boolean = false;
  namePattern = "([A-Za-z0-9 \s]){1,}";
  federationID = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID = Number(sessionStorage.getItem("UNIT_ID"));
  groupID = Number(sessionStorage.getItem("GROUP_ID"));
  homeFederationID = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
  homeUnitID = Number(sessionStorage.getItem("HOME_UNIT_ID"));
  homeGroupID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
  roleID: number = this.api.roleId;
  addDrawer: boolean = false;
  SELECT_ALL: boolean = false;
  EVENT_ID: number = 0;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '25rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
    ],
    customClasses: [],
    uploadUrl: '',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['fonts', 'uploadUrl'],
      [
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'removeFormat',
        'toggleEditorMode'
      ]
    ],
  };

  constructor(private compressImage: CompressImageService, private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  ngOnInit() {
    this.getIDs();
    this.getHashtags();
  }

  getIDs(): void {
    this.federationID = Number(sessionStorage.getItem("FEDERATION_ID"));
    this.unitID = Number(sessionStorage.getItem("UNIT_ID"));
    this.groupID = Number(sessionStorage.getItem("GROUP_ID"));

    this.homeFederationID = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
    this.homeUnitID = Number(sessionStorage.getItem("HOME_UNIT_ID"));
    this.homeGroupID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
  }

  hashtags: any[] = [];

  getHashtags(): void {
    this.hashtags = [];
    this.data.HASHTAGS = undefined;

    this.api.getAllHashtags(0, 0, "NAME", "asc", " AND STATUS=1").subscribe(data => {
      if (data['code'] == 200) {
        this.hashtags = data['data'];

        if (this.hashtags.length != 0) {
          let hashtags = "";

          for (var i = 0; i < this.hashtags.length; i++) {
            hashtags = hashtags + this.hashtags[i]["NAME"] + ',';
          }

          hashtags = hashtags.substring(0, hashtags.length - 1);
          this.data.HASHTAGS = hashtags.split(',');
        }
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  projects: any[] = [];

  getProjects(): void {
    this.api.getAllUnits(0, 0, "NAME", "asc", " AND STATUS=1").subscribe(data => {
      if (data['code'] == 200) {
        this.projects = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
    this.EVENT_ID = 0;
  }

  reset(myForm: NgForm): void {
    myForm.form.reset();
  }

  save(addNew: boolean, myForm: NgForm, postStatus: string = "D"): void {
    var isOk = true;

    if ((this.data.DESCRIPTION != undefined) && (this.data.DESCRIPTION != null)) {
      if (this.data.DESCRIPTION.trim() == "") {
        isOk = false;
        this.message.error("Please Write Something", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Write Something", "");
    }

    if (this.data.POST_TYPE == "F") {
      if ((this.data.TYPE_ID == undefined) || (this.data.TYPE_ID == null) || (this.data.TYPE_ID.length == 0)) {
        isOk = false;
        this.message.error("Please Select Valid Federation(s)", "");
      }
    }

    if (this.data.POST_TYPE == "U") {
      if ((this.data.TYPE_ID == undefined) || (this.data.TYPE_ID == null) || (this.data.TYPE_ID.length == 0)) {
        isOk = false;
        this.message.error("Please Select Valid Unit(s)", "");
      }
    }

    if (this.data.POST_TYPE == "G") {
      if ((this.data.TYPE_ID == undefined) || (this.data.TYPE_ID == null) || (this.data.TYPE_ID.length == 0)) {
        isOk = false;
        this.message.error("Please Select Valid Group(s)", "");
      }
    }


    if (isOk) {
      this.isSpinning = true;
      this.data.POST_CREATED_DATETIME = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:MM:SS a");
      this.data.MEMBER_ID = this.api.userId;
      this.data.STATUS = 1;
      this.data["EVENT_ID"] = this.EVENT_ID;

      if (postStatus == "D") {
        this.data.POST_STATUS = "D";

      } else if (postStatus == "P") {
        this.data.POST_STATUS = "P";
      }

      if (this.data.HASHTAGS != null) {
        this.data.HASHTAGS = this.data.HASHTAGS.toString();
      }

      this.imageUpload1();
      this.data.IMAGE_URL1 = (this.photo1Str == "") ? " " : this.photo1Str;

      this.imageUpload2();
      this.data.IMAGE_URL2 = (this.photo2Str == "") ? " " : this.photo2Str;

      this.imageUpload3();
      this.data.IMAGE_URL3 = (this.photo3Str == "") ? " " : this.photo3Str;

      if (this.data.POST_TYPE == "P") {
        this.data.TYPE_ID = "0";

      } else {
        this.data.TYPE_ID = this.data.TYPE_ID.toString();
      }

      if (this.data.ID) {
        setTimeout(() => {
          this.api.updatePost(this.data).subscribe(successCode => {
            if (successCode['code'] == 200) {
              this.message.success("Post Updated Successfully", "");
              this.isSpinning = false;

              if (!addNew) {
                this.close(myForm);
              }

            } else {
              this.message.error("Post Updation Failed", "");
              this.isSpinning = false;
            }
          });

        }, 1500);

      } else {
        setTimeout(() => {
          this.api.addpost(this.data).subscribe(successCode => {
            if (successCode['code'] == 200) {
              this.message.success("Post Created Successfully", "");
              this.isSpinning = false;

              if (!addNew) {
                this.close(myForm);

              } else {
                this.data = new Post();
              }

            } else {
              this.message.error("Post Creation Failed", "");
              this.isSpinning = false;
            }
          });

        }, 1500);
      }

      this.fileURL1 = null;
      this.originalFileURL1 = null;
      this.fileURL2 = null;
      this.originalFileURL2 = null;
      this.fileURL3 = null;
      this.originalFileURL3 = null;
    }
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }

  today = new Date().setDate(new Date().getDate());

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) > 0;

  fileURL1: any = null;
  fileURL2: any = null;
  fileURL3: any = null;
  originalFileURL1: any = null;
  originalFileURL2: any = null;
  originalFileURL3: any = null;

  clear1() {
    this.fileURL1 = null;
    this.data.IMAGE_URL1 = null;
  }

  clear2() {
    this.fileURL2 = null;
    this.data.IMAGE_URL2 = null;
  }

  clear3() {
    this.fileURL3 = null;
    this.data.IMAGE_URL3 = null;
  }

  onFileSelected1(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL1 = <File>event.target.files[0];
      this.originalFileURL1 = <File>event.target.files[0];

      this.compressImage.compress(event.target.files[0]).pipe(take(1)).subscribe(compressedImage => {
        this.fileURL1 = compressedImage;
      })

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.data.IMAGE_URL1 = reader.result as string;
        };
      }

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL1 = null;
      this.originalFileURL1 = null;
    }
  }

  onFileSelected2(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL2 = <File>event.target.files[0];
      this.originalFileURL2 = <File>event.target.files[0];

      this.compressImage.compress(event.target.files[0]).pipe(take(1)).subscribe(compressedImage => {
        this.fileURL2 = compressedImage;
      })

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.data.IMAGE_URL2 = reader.result as string;
        };
      }

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL2 = null;
      this.originalFileURL2 = null;
    }
  }

  onFileSelected3(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL3 = <File>event.target.files[0];
      this.originalFileURL3 = <File>event.target.files[0];

      this.compressImage.compress(event.target.files[0]).pipe(take(1)).subscribe(compressedImage => {
        this.fileURL3 = compressedImage;
      })

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.data.IMAGE_URL3 = reader.result as string;
        };
      }

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL3 = null;
      this.originalFileURL3 = null;
    }
  }

  folderName = "uploadPostImage";
  photo1Str: string;
  photo2Str: string;
  photo3Str: string;

  imageUpload1() {
    this.photo1Str = "";

    if (!this.data.ID) {
      if (this.fileURL1) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL1.name.split('.').pop();
        var url = "P" + number + "." + fileExt;
        this.photo1Str = url;

        this.api.onUpload2(this.folderName, this.fileURL1, url, this.originalFileURL1).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");


          } else {
            console.log("Not Uploaded");
          }
        });

      } else {
        if (this.data.IMAGE_URL1) {
          let photoURL = this.data.IMAGE_URL1.split("/");
          this.photo1Str = photoURL[photoURL.length - 1];

        } else
          this.photo1Str = "";
      }

    } else {
      if (this.fileURL1) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL1.name.split('.').pop();
        var url = "P" + number + "." + fileExt;
        this.photo1Str = url;

        this.api.onUpload2(this.folderName, this.fileURL1, url, this.originalFileURL1).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

      } else {
        if (this.data.IMAGE_URL1) {
          let photoURL = this.data.IMAGE_URL1.split("/");
          this.photo1Str = photoURL[photoURL.length - 1];

        } else
          this.photo1Str = "";
      }
    }
  }

  imageUpload2() {
    this.photo2Str = "";

    if (!this.data.ID) {
      if (this.fileURL2) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL2.name.split('.').pop();
        var url = "P" + number + "." + fileExt;
        this.photo2Str = url;

        this.api.onUpload2(this.folderName, this.fileURL2, url, this.originalFileURL2).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

      } else {
        if (this.data.IMAGE_URL2) {
          let photoURL = this.data.IMAGE_URL2.split("/");
          this.photo2Str = photoURL[photoURL.length - 1];

        } else
          this.photo2Str = "";
      }

    } else {
      if (this.fileURL2) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL2.name.split('.').pop();
        var url = "P" + number + "." + fileExt;
        this.photo2Str = url;

        this.api.onUpload2(this.folderName, this.fileURL2, url, this.originalFileURL2).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

      } else {
        if (this.data.IMAGE_URL2) {
          let photoURL = this.data.IMAGE_URL2.split("/");
          this.photo2Str = photoURL[photoURL.length - 1];

        } else
          this.photo2Str = "";
      }
    }
  }

  imageUpload3() {
    this.photo3Str = "";

    if (!this.data.ID) {
      if (this.fileURL3) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL3.name.split('.').pop();
        var url = "P" + number + "." + fileExt;
        this.photo3Str = url;

        this.api.onUpload2(this.folderName, this.fileURL3, url, this.originalFileURL3).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

      } else {
        if (this.data.IMAGE_URL3) {
          let photoURL = this.data.IMAGE_URL3.split("/");
          this.photo3Str = photoURL[photoURL.length - 1];

        } else
          this.photo3Str = "";
      }

    } else {
      if (this.fileURL3) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL3.name.split('.').pop();
        var url = "P" + number + "." + fileExt;
        this.photo3Str = url;

        this.api.onUpload2(this.folderName, this.fileURL3, url, this.originalFileURL3).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

      } else {
        if (this.data.IMAGE_URL3) {
          let photoURL = this.data.IMAGE_URL3.split("/");
          this.photo3Str = photoURL[photoURL.length - 1];

        } else
          this.photo3Str = "";
      }
    }
  }

  viewImage(d: any) { }

  cancel() { }

  suggestions = [];
  mentionLoading: boolean = false;

  onSearchChange({ value }: MentionOnSearchTypes): void {
    console.log(value);

    this.fetchSuggestions(value, suggestions => {
      console.log(suggestions);
      this.suggestions = suggestions;
    });
  }

  fetchSuggestions(value: string, callback: (suggestions: string[]) => void): void {
    let users = [];

    if (value.length >= 3) {
      this.mentionLoading = true;

      this.api.getAllMembers(0, 0, "NAME", "ASC", " AND NAME like '%" + value + "%'").subscribe(data => {
        if (data['code'] == 200) {
          let suggessionData = data["data"];

          for (var i = 0; i < suggessionData.length; i++) {
            users.push(suggessionData[i]["NAME"]);
          }

          callback(users);
          this.mentionLoading = false;
        }

      }, err => {
        if (err['ok'] == false)
          this.message.error("Server Not Found", "");
      });
    }
  }

  // fetchSuggestions(value: string, callback: (suggestions: string[]) => void): void {
  //   let users = [];

  //   if (value.length >= 3) {
  //     this.mentionLoading = true;

  //     this.api.getAllMembers(0, 0, "NAME", "ASC", " AND NAME like '%" + value + "%'").subscribe(data => {
  //       if (data['code'] == 200) {
  //         let suggessionData = data["data"];

  //         for (var i = 0; i < suggessionData.length; i++) {
  //           let obj1 = new Object();
  //           obj1["id"] = suggessionData[i]["ID"];
  //           obj1["name"] = suggessionData[i]["NAME"];
  //           users.push(Object.assign({}, obj1));
  //         }

  //         callback(users);
  //         this.mentionLoading = false;
  //       }

  //     }, err => {
  //       if (err['ok'] == false)
  //         this.message.error("Server Not Found", "");
  //     });
  //   }
  // }

  @ViewChild('mentions', { static: true }) mentionChild!: NzMentionComponent;
  MENTION_DATA: any;

  getMentions(): any {
    console.log(this.mentionChild.getMentions());
  }

  valueWith = (data: { name: string; id: string }): string => data.name;

  onSelect(value: string): void {
    console.log(value);
  }

  previewModalVisible: boolean = false;

  previewModalOpen() {
    if ((this.data.DESCRIPTION != undefined) && (this.data.DESCRIPTION != null)) {
      if (this.data.DESCRIPTION.trim() != "") {
        this.previewModalVisible = true;
      }
    }
  }

  previewModalCancel() {
    this.previewModalVisible = false;
  }

  getImageCount(photoURL1: string, photoURL2: string, photoURL3: string,) {
    let count: number = 0;
    photoURL1 = photoURL1 ? photoURL1 : "";
    photoURL2 = photoURL2 ? photoURL2 : "";
    photoURL3 = photoURL3 ? photoURL3 : "";

    if (photoURL1.trim() != "")
      count = count + 1;

    if (photoURL2.trim() != "")
      count = count + 1;

    if (photoURL3.trim() != "")
      count = count + 1;

    return count;
  }

  getStyle() {
    return 'none';
  }

  shareWithinPlaceHolder: string;

  onSharingTypeChange(sharingType: string) {
    if (sharingType == "F") {
      this.shareWithinPlaceHolder = "Type here to search federation(s)";
      this.SELECT_ALL = false;
      this.getFederations();

    } else if (sharingType == "U") {
      this.shareWithinPlaceHolder = "Type here to search unit(s)";
      this.SELECT_ALL = false;
      this.getUnits();

    } else if (sharingType == "G") {
      this.shareWithinPlaceHolder = "Type here to search group(s)";
      this.SELECT_ALL = false;
      this.getGroups();
    }
  }

  typeIDs = [];
  shareWithinLoading: boolean = false;

  getFederations() {
    var federationFilter = "";

    if (this.federationID != 0) {
      federationFilter = " AND ID=" + this.federationID;
    }

    var unitFilter = "";

    if (this.unitID != 0) {
      unitFilter = " AND ID=(SELECT FEDERATION_ID FROM unit_master WHERE ID=" + this.unitID + ")";
    }

    var groupFilter = "";

    if (this.groupID != 0) {
      groupFilter = " AND ID=(SELECT FEDERATION_ID FROM unit_master WHERE ID=(SELECT UNIT_ID FROM group_master WHERE ID=" + this.groupID + "))";
    }

    var homeFederationFilter = "";

    if ((this.federationID == 0) && (this.unitID == 0) && (this.groupID == 0)) {
      homeFederationFilter = " AND ID=" + this.homeFederationID;
    }

    this.typeIDs = [];
    this.data.TYPE_ID = undefined;
    this.shareWithinLoading = true;

    this.api.getAllFederations(0, 0, "NAME", "asc", " AND STATUS=1" + federationFilter + unitFilter + groupFilter + homeFederationFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.shareWithinLoading = false;
        this.typeIDs = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getUnits() {
    var federationFilter = "";

    if (this.federationID != 0) {
      federationFilter = " AND FEDERATION_ID=" + this.federationID;
    }

    var unitFilter = "";

    if (this.unitID != 0) {
      unitFilter = " AND ID=" + this.unitID;
    }

    var groupFilter = "";

    if (this.groupID != 0) {
      groupFilter = " AND ID=(SELECT UNIT_ID FROM group_master WHERE ID=" + this.groupID + ")";
    }

    var homeUnitFilter = "";

    if ((this.federationID == 0) && (this.unitID == 0) && (this.groupID == 0)) {
      homeUnitFilter = " AND ID=" + this.homeUnitID;
    }

    this.typeIDs = [];
    this.data.TYPE_ID = undefined;
    this.shareWithinLoading = true;

    this.api.getAllUnits(0, 0, "ID", "asc", " AND STATUS=1" + federationFilter + unitFilter + groupFilter + homeUnitFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.shareWithinLoading = false;
        this.typeIDs = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  getGroups() {
    var federationFilter = "";

    if (this.federationID != 0) {
      federationFilter = " AND FEDERATION_ID=" + this.federationID;
    }

    var unitFilter = "";

    if (this.unitID != 0) {
      unitFilter = " AND UNIT_ID=" + this.unitID;
    }

    var groupFilter = "";

    if (this.groupID != 0) {
      groupFilter = " AND ID=" + this.groupID;
    }

    var homeGroupFilter = "";

    if ((this.federationID == 0) && (this.unitID == 0) && (this.groupID == 0)) {
      homeGroupFilter = " AND ID=" + this.homeGroupID;
    }

    this.typeIDs = [];
    this.data.TYPE_ID = undefined;
    this.shareWithinLoading = true;

    this.api.getAllGroups(0, 0, "NAME", "asc", " AND STATUS=1" + federationFilter + unitFilter + groupFilter + homeGroupFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.shareWithinLoading = false;
        this.typeIDs = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  onSelectAllChange(status: boolean) {
    if (status) {
      let allTypeIDs = [];

      for (var i = 0; i < this.typeIDs.length; i++) {
        allTypeIDs.push(this.typeIDs[i]["ID"]);
      }

      this.data.TYPE_ID = allTypeIDs;

    } else {
      this.data.TYPE_ID = undefined;
    }
  }

  deleteFirstImage(): void {
    if ((!this.fileURL2) && (!this.data.IMAGE_URL2)) {
      this.fileURL1 = undefined;
      this.data.IMAGE_URL1 = undefined;

    } else {
      this.message.info("Deletion Not Allowed", "");
    }
  }

  deleteSecondImage(): void {
    if ((!this.fileURL3) && (!this.data.IMAGE_URL3)) {
      this.fileURL2 = undefined;
      this.data.IMAGE_URL2 = undefined;

    } else {
      this.message.info("Deletion Not Allowed", "");
    }
  }

  deleteThirdImage(): void {
    this.fileURL3 = undefined;
    this.data.IMAGE_URL3 = undefined;
  }
}
