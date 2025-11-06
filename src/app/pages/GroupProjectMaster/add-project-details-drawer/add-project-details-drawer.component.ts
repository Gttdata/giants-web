import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, HostListener } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { NgForm } from '@angular/forms';
import { GroupProjectMaster } from 'src/app/Models/GroupProjectMaster';
import { ProjectMaster } from 'src/app/Models/ProjectMaster';
import { CompressImageService } from 'src/app/Service/image-compressor.service';
import { take } from 'rxjs/operators';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-add-project-details-drawer',
  templateUrl: './add-project-details-drawer.component.html',
  styleUrls: ['./add-project-details-drawer.component.css']
})

export class AddProjectDetailsDrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: GroupProjectMaster;
  @Input() drawerVisible: boolean;
  isSpinning: boolean = false;
  namePattern = "([A-Za-z0-9 \s]){1,}";
  federationID = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID = Number(sessionStorage.getItem("UNIT_ID"));
  groupID = Number(sessionStorage.getItem("GROUP_ID"));
  homeFederationID: number = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
  homeUnitID: number = Number(sessionStorage.getItem("HOME_UNIT_ID"));
  homeGroupID: number = Number(sessionStorage.getItem("HOME_GROUP_ID"));
  roleID: number = this.api.roleId;
  addDrawer: boolean = false;

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
    ]
  };

  constructor(private compressImage: CompressImageService, private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService) { }

  // @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
  //   e.preventDefault();
  // }

  ngOnInit() {
    this.getGroups();
    this.getProjects();
  }

  groups: any[] = [];

  getGroups() {
    var groupFilter = "";
    if (this.groupID != 0) {
      groupFilter = " AND ID=" + this.groupID;
    }

    this.groups = [];

    this.api.getAllGroups(0, 0, "NAME", "asc", " AND STATUS=1" + groupFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.groups = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  projects: any[] = [];

  getProjects() {
    this.api.getAllProjects(0, 0, "NAME", "asc", " AND STATUS=1 AND ID=43").subscribe(data => {
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
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  save(addNew: boolean, myForm: NgForm, status: string = "D"): void {
    var isOk = true;

    if (this.data.DATE_OF_PROJECT == undefined || this.data.DATE_OF_PROJECT == null) {
      isOk = false;
      this.message.error("Please Selct Valid Date", "");
    }

    if (this.data.PROJECT_NAME != undefined && this.data.PROJECT_NAME != null) {
      if (this.data.PROJECT_NAME.trim() == '') {
        isOk = false;
        this.message.error("Please Enter Project Name", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Project Name", "");
    }

    if (this.data.PROJECT_TYPE_ID == undefined || this.data.PROJECT_TYPE_ID == null) {
      isOk = false;
      this.message.error("Please Selct Valid Project Type", "");
    }

    if (this.data.CURRENT_STATUS == undefined || this.data.CURRENT_STATUS == null) {
      isOk = false;
      this.message.error("Please Selct Valid Status", "");
    }

    if (isOk) {
      this.isSpinning = true;
      this.data.DATE_OF_PROJECT = this.datePipe.transform(this.data.DATE_OF_PROJECT, "yyyy-MM-dd");
      this.data.CREATOR_ID = this.api.userId;

      if (this.data.AWARDS_RECEIVED != null) {
        this.data.AWARDS_RECEIVED = this.data.AWARDS_RECEIVED.toString();
      }

      this.imageUpload1();
      this.data.PHOTO1 = (this.photo1Str == "") ? " " : this.photo1Str;

      this.imageUpload2();
      this.data.PHOTO2 = (this.photo2Str == "") ? " " : this.photo2Str;

      this.imageUpload3();
      this.data.PHOTO3 = (this.photo3Str == "") ? " " : this.photo3Str;

      if (status == "D") {
        this.data.STATUS = "D";

      } else if (status == "P") {
        this.data.STATUS = "P";
      }

      if (this.data.ID) {
        this.api.updategroupProjects(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Project Details Updated Successfully", "");
            this.isSpinning = false;

            if (!addNew) {
              this.close(myForm);
            }

          } else {
            this.message.error("Project Details Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        if (this.federationID > 0) {
          this.data.FEDERATION_ID_TO_SHOW = this.homeFederationID;
        }

        if (this.unitID > 0) {
          this.data.UNIT_ID_TO_SHOW = this.homeUnitID;
        }

        if (this.groupID > 0) {
          this.data.GROUP_ID_TO_SHOW = this.homeGroupID;
        }

        this.api.creategroupProjects(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Project Created Successfully", "");
            this.isSpinning = false;

            if (!addNew) {
              this.close(myForm);

            } else {
              this.data = new GroupProjectMaster();
            }

          } else {
            this.message.error("Project Creation Failed", "");
            this.isSpinning = false;
          }
        });
      }

      this.fileURL1 = null;
      this.originalFileURL1 = null;
      this.fileURL2 = null;
      this.originalFileURL2 = null;
      this.fileURL3 = null;
      this.originalFileURL3 = null;
      this.fileURL4 = null;
      this.originalFileURL4 = null;
      this.fileURL5 = null;
      this.originalFileURL5 = null;
      this.pdfFileURL1 = null;
      this.pdfFileURL2 = null;
    }
  }

  today = new Date().setDate(new Date().getDate());

  disabledDate = (current: Date): boolean =>
    differenceInCalendarDays(current, this.today) > 0;

  fileURL1: any = null;
  fileURL2: any = null;
  fileURL3: any = null;
  fileURL4: any = null;
  fileURL5: any = null;
  originalFileURL1: any = null;
  originalFileURL2: any = null;
  originalFileURL3: any = null;
  originalFileURL4: any = null;
  originalFileURL5: any = null;

  clear1() {
    this.fileURL1 = null;
    this.originalFileURL1 = null;
    this.data.PHOTO1 = null;
  }

  clear2() {
    this.fileURL2 = null;
    this.originalFileURL2 = null;
    this.data.PHOTO2 = null;
  }

  clear3() {
    this.fileURL3 = null;
    this.originalFileURL3 = null;
    this.data.PHOTO3 = null;
  }

  onFileSelected1(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL1 = <File>event.target.files[0];
      this.originalFileURL1 = <File>event.target.files[0];

      this.compressImage.compress(event.target.files[0]).pipe(take(1)).subscribe(compressedImage => {
        this.fileURL1 = compressedImage;
      });

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.data.PHOTO1 = reader.result as string;
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
      });

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.data.PHOTO2 = reader.result as string;
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
      });

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.data.PHOTO3 = reader.result as string;
        };
      }

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL3 = null;
      this.originalFileURL3 = null;
    }
  }

  folderName = "groupProjectPhotos";
  photo1Str: string;
  photo2Str: string;
  photo3Str: string;
  photo4Str: string;
  photo5Str: string;

  imageUpload1() {
    this.photo1Str = "";

    if (!this.data.ID) {
      if (this.fileURL1) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL1.name.split('.').pop();
        var url = "GA" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL1, url, this.originalFileURL1).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo1Str = url;

      } else {
        this.photo1Str = "";
      }

    } else {
      if (this.fileURL1) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL1.name.split('.').pop();
        var url = "GA" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL1, url, this.originalFileURL1).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo1Str = url;

      } else {
        if (this.data.PHOTO1) {
          let photoURL = this.data.PHOTO1.split("/");
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
        var url = "GA" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL2, url, this.originalFileURL2).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo2Str = url;

      } else {
        this.photo2Str = "";
      }

    } else {
      if (this.fileURL2) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL2.name.split('.').pop();
        var url = "GA" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL2, url, this.originalFileURL2).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo2Str = url;

      } else {
        if (this.data.PHOTO2) {
          let photoURL = this.data.PHOTO2.split("/");
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
        var url = "GA" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL3, url, this.originalFileURL3).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo3Str = url;

      } else {
        this.photo3Str = "";
      }

    } else {
      if (this.fileURL3) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.fileURL3.name.split('.').pop();
        var url = "GA" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.fileURL3, url, this.originalFileURL3).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.photo3Str = url;

      } else {
        if (this.data.PHOTO3) {
          let photoURL = this.data.PHOTO3.split("/");
          this.photo3Str = photoURL[photoURL.length - 1];

        } else
          this.photo3Str = "";
      }
    }
  }

  cancel() { }

  pdfFileURL1: any = null;
  pdfFileURL2: any = null;
  pdf1Str: string;
  pdf2Str: string;

  onPdfFileSelected1(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.pdfFileURL1 = <File>event.target.files[0];

    } else {
      this.message.error('Please Choose Only pdf File', '');
      this.pdfFileURL1 = null;
    }
  }

  onPdfFileSelected2(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.pdfFileURL2 = <File>event.target.files[0];

    } else {
      this.message.error('Please Choose Only pdf File', '');
      this.pdfFileURL2 = null;
    }
  }

  viewImage(imageName) {
    window.open(imageName);
  }

  numberOnly(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;

    // Allowing digits (0-9)
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }

    // Allowing only one dot
    if (charCode === 46) {
      var input = event.target.value || '';
      if (input.indexOf('.') === -1) {
        return true;
      }
    }

    return false; // Disallowing other characters
  }



  eventTypeDrawerVisible: boolean;
  eventTypeDrawerTitle: string;
  eventTypeDrawerData: ProjectMaster = new ProjectMaster();

  addProjectType(): void {
    this.eventTypeDrawerTitle = "aaa " + "Add Project Type";
    this.eventTypeDrawerData = new ProjectMaster();
    this.eventTypeDrawerVisible = true;
    this.eventTypeDrawerData.STATUS = true;
  }

  eventTypeDrawerClose(): void {
    this.getProjects();
    this.eventTypeDrawerVisible = false;
  }

  get eventTypeDrawerCloseCallback() {
    return this.eventTypeDrawerClose.bind(this);
  }

  previewModalVisible: boolean = false;

  previewModalOpen() {
    this.previewModalVisible = true;
  }

  previewModalCancel() {
    this.previewModalVisible = false;
  }

  getImageCount(photoURL1: string, photoURL2: string, photoURL3: string) {
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

  getCompleteStatus(status: string) {
    if (status == "P") {
      return "Upcoming";

    } else if (status == "S") {
      return "In Progress";

    } else if (status == "H") {
      return "On Hold";

    } else if (status == "C") {
      return "Completed";
    }
  }
}