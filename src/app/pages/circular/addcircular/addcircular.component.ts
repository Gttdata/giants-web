import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { CircularMaster } from 'src/app/Models/Circular';
import { DatePipe } from '@angular/common';
import { CircularTypeMaster } from 'src/app/Models/Circulartype';
import { ApiService } from 'src/app/Service/api.service';
import { Membermaster } from 'src/app/Models/MemberMaster';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { take } from 'rxjs/operators';
import { CompressImageService } from 'src/app/Service/image-compressor.service';
import { FederationMaster } from 'src/app/Models/FederationMaster';
import { CookieService } from 'ngx-cookie-service';
import { CircularemailsenderlistComponent } from '../circularemailsenderlist/circularemailsenderlist.component';
import { NzModalService } from 'ng-zorro-antd';
// import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-addcircular',
  templateUrl: './addcircular.component.html',
  styleUrls: ['./addcircular.component.css']
})

export class AddcircularComponent implements OnInit {
  @Input() data: CircularMaster = new CircularMaster();
  @Input() drawerClose: Function;
  @Input() drawerVisible: boolean = false;
  isSpinning: boolean = false;
  circularType: CircularTypeMaster[] = [];
  Members1: Membermaster[] = [];
  Members2: Membermaster[] = [];
  Members3: Membermaster[] = [];
  listOfData: any[];
  viewId: any;
  @Input() sign = '';
  @Input() isRemarkVisible: boolean;
  @Input() memberData = new Membermaster();

  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));

  homeFederationID: number = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
  homeUnitID: number = Number(sessionStorage.getItem("HOME_UNIT_ID"));
  homeGroupID: number = Number(sessionStorage.getItem("HOME_GROUP_ID"));

  RETRIVE_IMAGE_URL: string = this.api.retriveimgUrl;
  USER_ID: number = this.api.userId;
  isMember1Loading: boolean = false;
  isMember2Loading: boolean = false;
  isMember3Loading: boolean = false;

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

  constructor(private compressImage: CompressImageService, private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService, private _modal: NzModalService) { }

  ngOnInit(): void {
    this.getIDs();
    this.viewId = Number(localStorage.getItem('viewData'));
    this.getCirculartype();
    this.getMembers1();
    this.data.UPLOAD_STATUS = "S1";
  }

  getIDs(): void {
    this.federationID = Number(sessionStorage.getItem("FEDERATION_ID"));
    this.unitID = Number(sessionStorage.getItem("UNIT_ID"));
    this.groupID = Number(sessionStorage.getItem("GROUP_ID"));

    this.homeFederationID = Number(sessionStorage.getItem("HOME_FEDERATION_ID"));
    this.homeUnitID = Number(sessionStorage.getItem("HOME_UNIT_ID"));
    this.homeGroupID = Number(sessionStorage.getItem("HOME_GROUP_ID"));
    this.RETRIVE_IMAGE_URL = this.api.retriveimgUrl;
  }

  getMembers1() {
    this.isMember1Loading = true;

    this.api.getAllMembers(0, 0, "NAME", "asc", " AND STATUS=1 AND ID=" + this.api.userId).subscribe(data => {
      if (data['code'] == 200) {
        this.isMember1Loading = false;
        this.Members1 = data['data'];
      }

    }, err => {
      this.isMember1Loading = false;
      this.isSpinning = false;
    });
  }

  getMembers1OnEdit(memberID: number) {
    this.isMember1Loading = true;

    this.api.getAllMembers(0, 0, "NAME", "asc", " AND STATUS=1 AND ID=" + memberID).subscribe(data => {
      if (data['code'] == 200) {
        this.isMember1Loading = false;
        this.Members1 = data['data'];
      }

    }, err => {
      this.isMember1Loading = false;
      this.isSpinning = false;
    });
  }

  getMembers2OnEdit(memberID: number) {
    this.isMember2Loading = true;

    this.api.getAllMembers(0, 0, "NAME", "asc", " AND STATUS=1 AND ID=" + memberID).subscribe(data => {
      if (data['code'] == 200) {
        this.isMember2Loading = false;
        this.Members2 = data['data'];
      }

    }, err => {
      this.isMember2Loading = false;
      this.isSpinning = false;
    });
  }

  getMembers3OnEdit(memberID: number) {
    this.isMember3Loading = true;

    this.api.getAllMembers(0, 0, "NAME", "asc", " AND STATUS=1 AND ID=" + memberID).subscribe(data => {
      if (data['code'] == 200) {
        this.isMember3Loading = false;
        this.Members3 = data['data'];
      }

    }, err => {
      this.isMember3Loading = false;
      this.isSpinning = false;
    });
  }

  onSigningAuthority1TextChanged(name: string) {
    if (name.length >= 3) {
      this.isMember1Loading = true;

      this.api.getAllMembers(0, 0, "NAME", "asc", " AND FEDERATION_ID=" + this.homeFederationID + " AND STATUS=1 AND NAME like '%" + name + "%'").subscribe(data => {
        if (data['code'] == 200) {
          this.isMember1Loading = false;
          this.Members1 = data['data'];
        }

      }, err => {
        this.isMember1Loading = false;
        this.isSpinning = false;
      });
    }
  }

  onSigningAuthority2TextChanged(name: string) {
    if (name.length >= 3) {
      this.isMember2Loading = true;

      this.api.getAllMembers(0, 0, "NAME", "asc", " AND FEDERATION_ID=" + this.homeFederationID + " AND STATUS=1 AND NAME like '%" + name + "%'").subscribe(data => {
        if (data['code'] == 200) {
          this.isMember2Loading = false;
          this.Members2 = data['data'];
        }

      }, err => {
        this.isMember2Loading = false;
        this.isSpinning = false;
      });
    }
  }

  onSigningAuthority3TextChanged(name: string) {
    if (name.length >= 3) {
      this.isMember3Loading = true;

      this.api.getAllMembers(0, 0, "NAME", "asc", " AND FEDERATION_ID=" + this.homeFederationID + " AND STATUS=1 AND NAME like '%" + name + "%'").subscribe(data => {
        if (data['code'] == 200) {
          this.isMember3Loading = false;
          this.Members3 = data['data'];
        }

      }, err => {
        this.isMember3Loading = false;
        this.isSpinning = false;
      });
    }
  }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.pdfClear1();
    this.reset(myForm);
  }

  getwidth() {
    if (window.innerWidth <= 400) {
      return 380;

    } else {
      return 1000;
    }
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  getCirculartype() {
    this.api.getAllCircularType(0, 0, "NAME", "asc", " AND STATUS=1").subscribe(data => {
      this.circularType = data['data'];

    }, err => {
      this.isSpinning = false;
    });
  }

  alphaOnly(event: any) {
    event = event ? event : window.event;
    var charCode = event.which ? event.which : event.keyCode;

    if (charCode > 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122)) {
      return false;
    }

    return true;
  }

  omit(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }

  save(addNew: boolean, circularmaster: NgForm, saveAsDraft: boolean = false, circularStatus: string, submitToSigningAuthority2: boolean = false, rejectBySigningAuthority2: boolean = false, submitToSigningAuthority3: boolean = false, rejectBySigningAuthority3: boolean = false, approvedBySigningAuthority3: boolean = false, approvedBySigningAuthority2: boolean = false): void {
    var isOk = true;
    let msg = "";

    if ((this.data.DATE == undefined) || (this.data.DATE == null)) {
      isOk = false;
      this.message.error("Please Selct Valid Date", "");
    }

    if ((this.data.CIRCULAR_TYPE_ID == undefined) || (this.data.CIRCULAR_TYPE_ID == null)) {
      isOk = false;
      this.message.error("Please Select Circular Type", "");
    }

    if ((this.data.SUBJECT != undefined) && (this.data.SUBJECT != null)) {
      if (this.data.SUBJECT.trim() == '') {
        isOk = false;
        this.message.error("Please Enter Valid Subject", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Subject", "");
    }

    if ((this.data.DESCRIPTION != undefined) && (this.data.DESCRIPTION != null)) {
      if (this.data.DESCRIPTION.trim() == '') {
        isOk = false;
        this.message.error("Please Draft Valid Circular", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Draft Circular", "");
    }

    if (this.data.LETTER_HEAD == "SIGNING_AUTHORITY1") {
      this.data.LETTER_HEAD_ID = this.data.SIGNING_AUTHORITY1;

    } else if (this.data.LETTER_HEAD == "SIGNING_AUTHORITY2") {
      this.data.LETTER_HEAD_ID = this.data.SIGNING_AUTHORITY2;

    } else if (this.data.LETTER_HEAD == "SIGNING_AUTHORITY3") {
      this.data.LETTER_HEAD_ID = this.data.SIGNING_AUTHORITY3;

    } else {
      isOk = false;
      this.message.error("Please Select Letter Head", "");
    }

    if (this.data.SIGNING_AUTHORITY1 == undefined || this.data.SIGNING_AUTHORITY1 == null) {
      isOk = false;
      this.message.error("Please Select Signing Authority 1", "");
    }

    if (this.api.userId == this.data.SIGNING_AUTHORITY1) {
      this.data.UPLOAD_STATUS = 'S1';

    } else if (this.api.userId == this.data.SIGNING_AUTHORITY2) {
      this.data.UPLOAD_STATUS = 'S2';

    } else if (this.api.userId == this.data.SIGNING_AUTHORITY3) {
      this.data.UPLOAD_STATUS = 'S3';
    }

    if (rejectBySigningAuthority2) {
      if ((this.REJECT_REMARK_AUTH_2 != undefined) && (this.REJECT_REMARK_AUTH_2 != null)) {
        if (this.REJECT_REMARK_AUTH_2.trim() == "") {
          isOk = false;
          this.message.error("Please Enter Valid Rejection Remark", "");
        }

      } else {
        isOk = false;
        this.message.error("Please Enter Valid Rejection Remark", "");
      }
    }

    if (rejectBySigningAuthority3) {
      if ((this.REJECT_REMARK_AUTH_3 != undefined) && (this.REJECT_REMARK_AUTH_3 != null)) {
        if (this.REJECT_REMARK_AUTH_3.trim() == "") {
          isOk = false;
          this.message.error("Please Enter Valid Rejection Remark", "");
        }

      } else {
        isOk = false;
        this.message.error("Please Enter Valid Rejection Remark", "");
      }
    }

    if (isOk) {
      if (circularStatus == "D") {
        this.data.STATUS = "D";

        if (saveAsDraft) {
          this.data.SIGNING_AUTHORITY3_STATUS = "NA";
          this.data.SIGNING_AUTHORITY2_STATUS = "NA";
          this.data.SIGNING_AUTHORITY2_REMARK = "";
          this.data.SIGNING_AUTHORITY3_REMARK = "";
          this.data.SUBMITTED_TO_SIGNING_AUTHORITY2 = false;
          this.data.SUBMITTED_TO_SIGNING_AUTHORITY3 = false;
          msg = "Circular Saved as Draft";
        }

      } else if (circularStatus == "P") {
        this.data.STATUS = "P";
        msg = "Circular Published Successfully";
      }

      if (submitToSigningAuthority2) {
        this.data.SIGNING_AUTHORITY2_STATUS = "NA";
        this.data.SIGNING_AUTHORITY3_STATUS = "NA";
        this.data.SIGNING_AUTHORITY2_REMARK = "";
        this.data.SIGNING_AUTHORITY3_REMARK = "";
        this.data.SUBMITTED_TO_SIGNING_AUTHORITY2 = true;
        msg = "Circular Submitted to Signing Authority 2";
      }

      if (submitToSigningAuthority3) {
        this.data.SIGNING_AUTHORITY2_STATUS = "A";
        this.data.SUBMITTED_TO_SIGNING_AUTHORITY3 = true;
        msg = "Circular Submitted to Signing Authority 3";
      }

      if (approvedBySigningAuthority3) {
        this.data.SIGNING_AUTHORITY3_STATUS = "A";
        this.data.SIGNING_AUTHORITY3_REMARK = "";
        msg = "Circular Approved by Signing Authority 3";
      }

      if (approvedBySigningAuthority2) {
        this.data.SIGNING_AUTHORITY2_STATUS = "A";
        this.data.SIGNING_AUTHORITY2_REMARK = "";
        msg = "Circular Approved by Signing Authority 2";
      }

      if (rejectBySigningAuthority2) {
        this.data.SIGNING_AUTHORITY3_STATUS = "NA";
        this.data.SIGNING_AUTHORITY2_STATUS = "NA";
        this.data.SUBMITTED_TO_SIGNING_AUTHORITY2 = false;
        this.data.SUBMITTED_TO_SIGNING_AUTHORITY3 = false;
        this.data.SIGNING_AUTHORITY2_REMARK = this.REJECT_REMARK_AUTH_2;
        this.auth2RejectionModalVisible = false;
        msg = "Circular Rejected by Signing Authority 2";
      }

      if (rejectBySigningAuthority3) {
        this.data.SIGNING_AUTHORITY3_STATUS = "NA";
        this.data.SIGNING_AUTHORITY2_STATUS = "NA";
        this.data.SUBMITTED_TO_SIGNING_AUTHORITY2 = false;
        this.data.SUBMITTED_TO_SIGNING_AUTHORITY3 = false;
        this.data.SIGNING_AUTHORITY3_REMARK = this.REJECT_REMARK_AUTH_3;
        this.auth3RejectionModalVisible = false;
        msg = "Circular Rejected by Signing Authority 3";
      }

      this.isSpinning = true;
      this.data.DATE = this.datePipe.transform(this.data.DATE, 'yyyy-MM-dd');
      this.data.APPROVAL_DATETIME = this.datePipe.transform(this.data.DATE, 'yyyy-MM-dd');
      this.data.APPROVER_ID = this.api.userId;
      this.data.REMARK = '';
      this.data.ATTACHMENT = '';

      this.attachedpdfUpload1();
      this.data.ATTACHED_PDF1 = (this.attachedpdf1Str == "") ? " " : this.attachedpdf1Str;

      this.attachedpdfUpload2();
      this.data.ATTACHED_PDF2 = (this.attachedpdf2Str == "") ? " " : this.attachedpdf2Str;

      this.attachedpdfUpload3();
      this.data.ATTACHED_PDF3 = (this.attachedpdf3Str == "") ? " " : this.attachedpdf3Str;

      if (this.data.ID) {
        this.data.CREATER_ID = this.data.CREATER_ID;

        this.api.updateCircular(this.data).subscribe((successCode) => {
          if (successCode.code == 200) {
            this.message.success(msg, '');
            this.isSpinning = false;

            if (this.data.STATUS == "P") {
              this._modal.confirm({
                nzTitle: 'Are you want to send email?',
                nzOkText: 'Yes',
                nzOkType: 'primary',
                nzOnOk: (circularmaster: NgForm) => {
                  this.circularDrawerVisibleEmail = true;
                  this.circularDrawerDataID = successCode["CIRCULAR_ID"];
                  this.circularDrawerTitleEmail = "aaa " + "Circular Email Sender List";

                  this.CircularemailsenderlistComponentVar.getFederationMemberData(this.homeFederationID);
                  this.CircularemailsenderlistComponentVar.getFederationcentralSpecialCommitteeMemberData(this.homeFederationID);
                  this.CircularemailsenderlistComponentVar.getUnitMemberData(this.homeUnitID);
                  this.CircularemailsenderlistComponentVar.getSponseredGroupMemberData(this.homeGroupID);
                },

                nzCancelText: 'No',
                nzOnCancel: () => console.log('Cancel')
              });
            }

            if (!addNew) {
              this.close(circularmaster);
            }

          } else {
            this.message.error('Circular Creation Failed', '');
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

        this.data.CREATER_ID = this.api.userId;

        this.api.createCircular2(this.data).subscribe((successCode) => {
          if (successCode.code == 200) {
            this.message.success(msg, '');
            this.isSpinning = false;

            if (this.data.STATUS == "P") {
              this._modal.confirm({
                nzTitle: 'Are you want to send email?',
                nzOkText: 'Yes',
                nzOkType: 'primary',
                nzOnOk: (circularmaster: NgForm) => {
                  this.circularDrawerVisibleEmail = true;
                  this.circularDrawerDataID = successCode["CIRCULAR_ID"];
                  this.circularDrawerTitleEmail = "aaa " + "Circular Email Sender List";

                  this.CircularemailsenderlistComponentVar.getFederationMemberData(this.homeFederationID);
                  this.CircularemailsenderlistComponentVar.getFederationcentralSpecialCommitteeMemberData(this.homeFederationID);
                  this.CircularemailsenderlistComponentVar.getUnitMemberData(this.homeUnitID);
                  this.CircularemailsenderlistComponentVar.getSponseredGroupMemberData(this.homeGroupID);
                },

                nzCancelText: 'No',
                nzOnCancel: () => console.log('Cancel')
              });
            }

            if (!addNew) {
              this.close(circularmaster);

            } else {
              this.data = new CircularMaster();
            }

          } else {
            this.message.error('Circular Creation Failed', '');
            this.isSpinning = false;
          }
        });
      }

      this.attachedpdfFileURL1 = null;
      this.attachedpdfFileURL2 = null;
      this.attachedpdfFileURL3 = null;
    }
  }

  uploadSignature() {
    if (this.fileURL1) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.fileURL1.name.split('.').pop();
      var url = "SI" + number + "." + fileExt;

      this.api.onUpload2('signature', this.fileURL1, url).subscribe(res => {
        if (res["code"] == 200) {
          this.isSpinning = true;

          this.memberData['SIGNATURE'] = url;
          this.api.updateMember(this.memberData).subscribe(successCode => {
            if (successCode['code'] == 200) {
              this.message.success("Member Signature Updated Successfully", "");
              this.isSpinning = false;
              this.fileURL1 = null;
              this.selectedURL = '';
              this.sign = url;
              sessionStorage.setItem('Img', url);

            } else {
              this.message.error("Member Signature Updation Failed", "");
              this.isSpinning = false;
            }
          });

        } else {
          console.log("Not Uploaded");
        }
      });

    } else {
      this.message.error('Please select Signature File', '');
      this.isSpinning = false;
    }
  }

  cancel() { }

  ATTACHMENT: any = null;
  pdfFileURL2: any = null;
  pdf1Str: string;
  pdf2Str: string;
  fileURL1: any = null;
  selectedURL = '';

  onPdfFileSelected1(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.fileURL1 = <File>event.target.files[0];

      this.compressImage.compress(event.target.files[0]).pipe(take(1)).subscribe(compressedImage => {
        this.fileURL1 = compressedImage;
      })

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.selectedURL = reader.result as string;
        };
      }

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.fileURL1 = null;
    }
  }

  pdfClear1() {
    this.fileURL1 = null;
    this.memberData['SIGNATURE'] = null;
    this.selectedURL = '';
  }

  SIGNATURE1: string;
  MEMBER_ROLE1: string;
  UNIT_NAME1: string;
  CREATOR_NAME1: string;
  ROLE1_FEDERATION_UNIT_GROUP: string = "";

  SIGNATURE2: string;
  MEMBER_ROLE2: string;
  UNIT_NAME2: string;
  CREATOR_NAME2: string;
  ROLE2_FEDERATION_UNIT_GROUP: string = "";

  SIGNATURE3: string;
  MEMBER_ROLE3: string;
  UNIT_NAME3: string;
  CREATOR_NAME3: string;
  ROLE3_FEDERATION_UNIT_GROUP: string = "";

  GENDER1: string;
  GENDER3: string;
  GENDER2: string;
  isVisible: boolean = false;

  getSIGNING_AUTHORITY1() {
    this.api.getAllMembers(0, 0, "NAME", "asc", " AND ID=" + this.data.SIGNING_AUTHORITY1).subscribe(data => {
      if (data['code'] == 200 && (data['data'].length) > 0) {
        this.SIGNATURE1 = data['data'][0]['SIGNATURE'];
        this.MEMBER_ROLE1 = data['data'][0]['MEMBER_ROLE'];
        this.CREATOR_NAME1 = data['data'][0]['NAME'];
        this.GENDER1 = data['data'][0]['GENDER'];

        if (data['data'][0]['MEMBER_ROLE'] == 'Federation President') {
          this.ROLE1_FEDERATION_UNIT_GROUP = data['data'][0]['FEDERATION_NAME'];

        } else if (data['data'][0]['MEMBER_ROLE'] == 'Unit Director') {
          this.ROLE1_FEDERATION_UNIT_GROUP = data['data'][0]['UNIT_NAME'];

        } else if (data['data'][0]['MEMBER_ROLE'] == 'Group President') {
          this.ROLE1_FEDERATION_UNIT_GROUP = data['data'][0]['GROUP_NAME'];

        } else {
          this.ROLE1_FEDERATION_UNIT_GROUP = "";
        }

        this.loading_Records = false;
      }

    }, err => {
      if (err['ok'] == false)
        this.loading_Records = false;

      this.message.error("Server Not Found", "");
    });
  }

  getSIGNING_AUTHORITY2() {
    this.api.getAllMembers(0, 0, "NAME", "asc", " AND ID=" + this.data.SIGNING_AUTHORITY2).subscribe(data => {
      if (data['code'] == 200 && (data['data'].length) > 0) {
        this.SIGNATURE2 = data['data'][0]['SIGNATURE'];
        this.MEMBER_ROLE2 = data['data'][0]['MEMBER_ROLE'];
        this.CREATOR_NAME2 = data['data'][0]['NAME'];
        this.GENDER2 = data['data'][0]['GENDER'];

        if (data['data'][0]['MEMBER_ROLE'] == 'Federation President') {
          this.ROLE2_FEDERATION_UNIT_GROUP = data['data'][0]['FEDERATION_NAME'];

        } else if (data['data'][0]['MEMBER_ROLE'] == 'Unit Director') {
          this.ROLE2_FEDERATION_UNIT_GROUP = data['data'][0]['UNIT_NAME'];

        } else if (data['data'][0]['MEMBER_ROLE'] == 'Group President') {
          this.ROLE2_FEDERATION_UNIT_GROUP = data['data'][0]['GROUP_NAME'];

        } else {
          this.ROLE2_FEDERATION_UNIT_GROUP = "";
        }

        this.loading_Records = false;
      }

    }, err => {
      if (err['ok'] == false)
        this.loading_Records = false;

      this.message.error("Server Not Found", "");
    });
  }

  getSIGNING_AUTHORITY3() {
    this.api.getAllMembers(0, 0, "NAME", "asc", " AND ID=" + this.data.SIGNING_AUTHORITY3).subscribe(data => {
      if (data['code'] == 200 && (data['data'].length) > 0) {
        this.SIGNATURE3 = data['data'][0]['SIGNATURE'];
        this.MEMBER_ROLE3 = data['data'][0]['MEMBER_ROLE'];
        this.CREATOR_NAME3 = data['data'][0]['NAME'];
        this.GENDER3 = data['data'][0]['GENDER'];

        if (data['data'][0]['MEMBER_ROLE'] == 'Federation President') {
          this.ROLE3_FEDERATION_UNIT_GROUP = data['data'][0]['FEDERATION_NAME'];

        } else if (data['data'][0]['MEMBER_ROLE'] == 'Unit Director') {
          this.ROLE3_FEDERATION_UNIT_GROUP = data['data'][0]['UNIT_NAME'];

        } else if (data['data'][0]['MEMBER_ROLE'] == 'Group President') {
          this.ROLE3_FEDERATION_UNIT_GROUP = data['data'][0]['GROUP_NAME'];

        } else {
          this.ROLE3_FEDERATION_UNIT_GROUP = "";
        }

        this.loading_Records = false;
      }

    }, err => {
      if (err['ok'] == false)
        this.loading_Records = false;

      this.message.error("Server Not Found", "");
    });
  }

  currentIndex = -1;
  loading_Records: boolean = false;
  downloadBtn: boolean = false;
  displaySigningAuth2Sign: boolean = false;
  displaySigningAuth3Sign: boolean = false;
  federationInfo: FederationMaster = new FederationMaster();
  presidentInfo: Membermaster = new Membermaster();

  viewPDF(circularData: CircularMaster) {
    let federationID = this._cookie.get('HOME_FEDERATION_ID')
    this.isVisible = true;
    this.loading_Records = true;
    this.isSpinning = true;

    if (circularData.STATUS == "P") {
      this.downloadBtn = true;

    } else {
      this.downloadBtn = false;
    }

    if ((circularData.SIGNING_AUTHORITY2) && (circularData.SUBMITTED_TO_SIGNING_AUTHORITY2) && ((circularData.SIGNING_AUTHORITY2_STATUS == "A") || (circularData.SIGNING_AUTHORITY2 == this.USER_ID))) {
      this.displaySigningAuth2Sign = true;

    } else {
      this.displaySigningAuth2Sign = false;
    }

    if ((circularData.SIGNING_AUTHORITY3) && (circularData.SUBMITTED_TO_SIGNING_AUTHORITY3) && ((circularData.SIGNING_AUTHORITY3_STATUS == "A") || (circularData.SIGNING_AUTHORITY3 == this.USER_ID))) {
      this.displaySigningAuth3Sign = true;

    } else {
      this.displaySigningAuth3Sign = false;
    }

    this.getSIGNING_AUTHORITY1();
    this.getSIGNING_AUTHORITY2();
    this.getSIGNING_AUTHORITY3();

    if (this.data.LETTER_HEAD == "SIGNING_AUTHORITY1") {
      this.data.LETTER_HEAD_ID = this.data.SIGNING_AUTHORITY1;

    } else if (this.data.LETTER_HEAD == "SIGNING_AUTHORITY2") {
      this.data.LETTER_HEAD_ID = this.data.SIGNING_AUTHORITY2;

    } else if (this.data.LETTER_HEAD == "SIGNING_AUTHORITY3") {
      this.data.LETTER_HEAD_ID = this.data.SIGNING_AUTHORITY3;
    }

    this.api.getAllMembers(0, 0, "", "", " AND ID=" + this.data.LETTER_HEAD_ID).subscribe(data1 => {
      if ((data1['code'] == 200) && (data1['data'].length > 0)) {
        this.loading_Records = false;
        this.memberData = data1['data'][0];
        this.GENDER1 = data1['data'][0]['GENDER'];
      }

    }, err => {
      if (err['ok'] == false) {
        this.message.error("Server Not Found", "");
      }
    });

    // Get Federation Info
    this.api.getAllFederations(0, 0, "ID", "asc", " AND ID=" + federationID).subscribe(data => {
      if (data['code'] == 200) {
        this.federationInfo = data["data"][0];

        this.api.getAllMembers(0, 0, "NAME", "asc", " AND ID=" + this.federationInfo["PRESIDENT"]).subscribe(data => {
          if (data['code'] == 200) {
            this.presidentInfo = data['data'][0];
          }

        }, err => {
          if (err['ok'] == false)
            this.message.error("Server Not Found", "");
        });
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  public handlePrint(): void {
    const printContents = document.getElementById('printCircular').innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  }

  handleCancel() {
    this.api.getAllMembers(0, 0, "NAME", "asc", " AND ID=" + this.api.userId).subscribe(data1 => {
      if (data1['code'] == 200 && (data1['data'].length) > 0) {
        this.memberData = data1['data'][0];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    this.isVisible = false;
    this.isSpinning = false;
    this.CREATOR_NAME1 = null;
    this.MEMBER_ROLE1 = null;
    this.SIGNATURE1 = null;
    this.CREATOR_NAME2 = null;
    this.MEMBER_ROLE2 = null;
    this.SIGNATURE2 = null;
    this.CREATOR_NAME3 = null;
    this.MEMBER_ROLE3 = null;
    this.SIGNATURE3 = null;
  }

  signingAuthority2Change(authority2: number) {
    this.data.SIGNING_AUTHORITY3 = undefined;
  }

  signingAuthority1Change(authority1: number) {
    this.data.SIGNING_AUTHORITY2 = undefined;
    this.data.SIGNING_AUTHORITY3 = undefined;
  }

  REJECT_REMARK_AUTH_2: string = "";
  auth2RejectionModalVisible: boolean = false;

  auth2RejectionModalShow() {
    this.auth2RejectionModalVisible = true;
    this.REJECT_REMARK_AUTH_2 = undefined;
  }

  auth2RejectionModalClose() {
    this.auth2RejectionModalVisible = false;
  }

  REJECT_REMARK_AUTH_3: string = "";
  auth3RejectionModalVisible: boolean = false;

  auth3RejectionModalShow() {
    this.auth3RejectionModalVisible = true;
    this.REJECT_REMARK_AUTH_3 = undefined;
  }

  auth3RejectionModalClose() {
    this.auth3RejectionModalVisible = false;
  }

  msgForSigningAuth2() {
    this.message.info("Submited to Signing Authority 2", "");
  }

  msgForSigningAuth3() {
    this.message.info("Submited to Signing Authority 3", "");
  }

  circularTypeDrawerVisible: boolean;
  circularTypeDrawerTitle: string;
  circularTypeDrawerData: CircularTypeMaster = new CircularTypeMaster();

  addCircularType(): void {
    this.circularTypeDrawerTitle = "aaa " + "Add Circular Type";
    this.circularTypeDrawerData = new CircularTypeMaster();

    this.api.getAllCircularType(0, 0, 'SEQ_NO', 'desc', '').subscribe(data => {
      if (data['count'] == 0) {
        this.circularTypeDrawerData.SEQ_NO = 1;

      } else {
        this.circularTypeDrawerData.SEQ_NO = data['data'][0]['SEQ_NO'] + 1;
      }

    }, err => {
      console.log(err);
    })

    this.circularTypeDrawerVisible = true;
    this.circularTypeDrawerData.STATUS = true;
  }

  circularTypeDrawerClose(): void {
    this.getCirculartype();
    this.circularTypeDrawerVisible = false;
  }

  get circularTypeDrawerCloseCallback() {
    return this.circularTypeDrawerClose.bind(this);
  }

  editAccess: boolean = false;
  fileName: string = "Circular";

  generatePDF(): void {
    // var i = 0;
    // var date = new Date();
    // var datef = this.datePipe.transform(date, "dd-MM-yyyy");
    // var dates = this.datePipe.transform(date, "hh-mm-ss a");
    // var data = document.getElementById('printCircular');

    // html2pdf().from(data).set({ margin: [2, 10, 2, 5], pagebreak: { mode: ['css', 'legecy'] }, jsPDF: { unit: 'mm', format: 'A4', orientation: 'portrait' } }).toPdf().get('pdf').then(function (pdf) {
    //   this.pdfDownload = true;
    //   var totalPages = pdf.internal.getNumberOfPages();

    //   for (i = 1; i <= totalPages; i++) {
    //     pdf.setPage(i);
    //     pdf.setFontSize(12);
    //     pdf.setTextColor(150);
    //     pdf.text(i.toString(), pdf.internal.pageSize.getWidth() / 2, 10);
    //   }

    //   this.pdfDownload = false;

    // }).save(this.fileName + "_" + datef + "_" + dates + '.pdf');
  }

  attachedpdfFileURL1: any = null;
  attachedpdfFileURL2: any = null;
  attachedpdfFileURL3: any = null;
  attachedpdf1Str: string;
  attachedpdf2Str: string;
  attachedpdf3Str: string;
  folderName = "circularPdf";

  onAttachedPdfFileSelected1(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.attachedpdfFileURL1 = <File>event.target.files[0];

    } else {
      this.message.error('Please Choose Only pdf File', '');
      this.attachedpdfFileURL1 = null;
    }
  }

  onAttachedPdfFileSelected2(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.attachedpdfFileURL2 = <File>event.target.files[0];

    } else {
      this.message.error('Please Choose Only pdf File', '');
      this.attachedpdfFileURL2 = null;
    }
  }

  onAttachedPdfFileSelected3(event: any) {
    if (event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/png') {
      this.attachedpdfFileURL3 = <File>event.target.files[0];

    } else {
      this.message.error('Please Choose Only JPEG/ JPG/ PNG File', '');
      this.attachedpdfFileURL3 = null;
    }
  }

  attachedpdfUpload1() {
    this.attachedpdf1Str = "";

    if (!this.data.ID) {
      if (this.attachedpdfFileURL1) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.attachedpdfFileURL1.name.split('.').pop();
        var url = "C" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.attachedpdfFileURL1, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.attachedpdf1Str = url;

      } else {
        this.attachedpdf1Str = "";
      }

    } else {
      if (this.attachedpdfFileURL1) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.attachedpdfFileURL1.name.split('.').pop();
        var url = "C" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.attachedpdfFileURL1, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.attachedpdf1Str = url;

      } else {
        if (this.data.ATTACHED_PDF1) {
          let pdfURL = this.data.ATTACHED_PDF1.split("/");
          this.attachedpdf1Str = pdfURL[pdfURL.length - 1];

        } else
          this.attachedpdf1Str = "";
      }
    }
  }

  attachedpdfUpload2() {
    this.attachedpdf2Str = "";

    if (!this.data.ID) {
      if (this.attachedpdfFileURL2) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.attachedpdfFileURL2.name.split('.').pop();
        var url = "C" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.attachedpdfFileURL2, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.attachedpdf2Str = url;

      } else {
        this.attachedpdf2Str = "";
      }

    } else {
      if (this.attachedpdfFileURL2) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.attachedpdfFileURL2.name.split('.').pop();
        var url = "C" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.attachedpdfFileURL2, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.attachedpdf2Str = url;

      } else {
        if (this.data.ATTACHED_PDF2) {
          let pdfURL = this.data.ATTACHED_PDF2.split("/");
          this.attachedpdf2Str = pdfURL[pdfURL.length - 1];

        } else
          this.attachedpdf2Str = "";
      }
    }
  }

  attachedpdfUpload3() {
    this.attachedpdf3Str = "";

    if (!this.data.ID) {
      if (this.attachedpdfFileURL3) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.attachedpdfFileURL3.name.split('.').pop();
        var url = "CI" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.attachedpdfFileURL3, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.attachedpdf3Str = url;

      } else {
        this.attachedpdf3Str = "";
      }

    } else {
      if (this.attachedpdfFileURL3) {
        var number = Math.floor(100000 + Math.random() * 900000);
        var fileExt = this.attachedpdfFileURL3.name.split('.').pop();
        var url = "CI" + number + "." + fileExt;

        this.api.onUpload2(this.folderName, this.attachedpdfFileURL3, url).subscribe(res => {
          if (res["code"] == 200) {
            console.log("Uploaded");

          } else {
            console.log("Not Uploaded");
          }
        });

        this.attachedpdf3Str = url;

      } else {
        if (this.data.ATTACHED_PDF3) {
          let pdfURL = this.data.ATTACHED_PDF3.split("/");
          this.attachedpdf3Str = pdfURL[pdfURL.length - 1];

        } else
          this.attachedpdf3Str = "";
      }
    }
  }

  attachedpdfClear1() {
    this.attachedpdfFileURL1 = null;
    this.data.ATTACHED_PDF1 = null;
  }

  attachedpdfClear2() {
    this.attachedpdfFileURL2 = null;
    this.data.ATTACHED_PDF2 = null;
  }

  attachedpdfClear3() {
    this.attachedpdfFileURL3 = null;
    this.data.ATTACHED_PDF3 = null;
  }

  viewAttachedPDF(pdfURL: string) {
    window.open(this.api.retriveimgUrl + "circularPdf/" + pdfURL);
  }

  circularDrawerVisibleEmail: boolean = false;
  circularDrawerTitleEmail: string;
  circularDrawerDataID: number;
  @ViewChild(CircularemailsenderlistComponent, { static: false }) CircularemailsenderlistComponentVar: CircularemailsenderlistComponent;

  circularDrawerCloseEmail(): void {
    this.circularDrawerVisibleEmail = false;
  }

  get circularDrawerCloseEmailCallback() {
    return this.circularDrawerCloseEmail.bind(this);
  }
}
