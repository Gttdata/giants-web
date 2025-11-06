import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { DetailAndDocumentModel, MemberAwardModel, NewMemberModel } from 'src/app/Models/MemberAward';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-member-award',
  templateUrl: './member-award.component.html',
  styleUrls: ['./member-award.component.css']
})

export class MemberAwardComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() drawerVisible: boolean = false;
  @Input() data: MemberAwardModel = new MemberAwardModel();
  @Input() drawerWeekdataArray: any[];
  @Input() isRemarkVisible: boolean;
  @Input() drawerNewMemberArray: any[] = [];
  @Input() drawerDocAndDetailArray: any[] = [];

  constructor(private api: ApiService, private message: NzNotificationService, private cookie: CookieService, private datePipe: DatePipe) { }

  drawerNewMemberVisible: boolean = false;
  drawerDocAndDetailVisible: boolean = false;
  drawerNewMember: NewMemberModel = new NewMemberModel();
  drawerDocAndDetail: DetailAndDocumentModel = new DetailAndDocumentModel();

  ngOnInit() {
    this.LoadYears();
    this.Fordate();
  }

  omit(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }

  regularmeeting(PARTICIPATION_IN_MEETINGS, PARTICIPATION_IN_MEETINGS_OUT_OF) {
    if (PARTICIPATION_IN_MEETINGS_OUT_OF != '') {
      if (parseInt(PARTICIPATION_IN_MEETINGS) > parseInt(PARTICIPATION_IN_MEETINGS_OUT_OF)) {
        this.message.error("Participation In Meeting", "Please fill the corrected data");
        this.data.PARTICIPATION_IN_MEETINGS = null;
      }
    }
  }

  Projectmeeting(PARTICIPATION_IN_PROJECTS, PARTICIPATION_IN_PROJECTS_OUT_OF) {
    if (PARTICIPATION_IN_PROJECTS_OUT_OF != '') {
      if (parseInt(PARTICIPATION_IN_PROJECTS) > parseInt(PARTICIPATION_IN_PROJECTS_OUT_OF)) {
        this.message.error("Participation In Meeting", "Please fill the corrected data");
        this.data.PARTICIPATION_IN_PROJECTS = null;
      }
    }
  }

  Unitmeeting(PARTICIPATION_IN_UNIT_CONFERENCE, PARTICIPATION_IN_UNIT_CONFERENCE_OUT_OF) {
    if (PARTICIPATION_IN_UNIT_CONFERENCE_OUT_OF != '') {
      if (parseInt(PARTICIPATION_IN_UNIT_CONFERENCE) > parseInt(PARTICIPATION_IN_UNIT_CONFERENCE_OUT_OF)) {
        this.message.error("Unit Conference Meeting", "Please fill the corrected data");
        this.data.PARTICIPATION_IN_UNIT_CONFERENCE = null;
      }
    }
  }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  closeNewMemberDrawer() {
    this.drawerNewMemberVisible = false;
  }

  closeDetailAndDocDrawer() {
    this.drawerDocAndDetailVisible = false;
  }

  get closeCallbackNewMember() {
    return this.NewMemberSaveInTable.bind(this);
  }

  get closeCallbackDetailAndDoc() {
    return this.DocAndDetailSaveInTable.bind(this);
  }

  NewMemberDrawerClose() {
    this.drawerNewMemberVisible = false;
  }

  get callBackNewMemberclose() {
    return this.NewMemberDrawerClose.bind(this);
  }

  DocAndDetDrawerClose() {
    this.drawerDocAndDetailVisible = false;
  }

  get callBackDocAndDetclose() {
    return this.DocAndDetDrawerClose.bind(this);
  }

  currentIndex: number;
  NewMemberDataArray: any[] = [];
  DocAndDetailrDataArray: any[] = [];

  NewMemberSaveInTable() {
    if (this.currentIndex > -1) {
      this.drawerNewMemberArray[this.currentIndex] = this.drawerNewMember;
      this.drawerNewMemberArray = [...[], ...this.drawerNewMemberArray];

    } else {
      this.drawerNewMemberArray = [...this.drawerNewMemberArray, ...[this.drawerNewMember]];
    }

    this.currentIndex = -1;
    console.log("Conti Array", this.drawerNewMemberArray);
    this.drawerNewMemberVisible = false;
  }

  DocAndDetailSaveInTable() {
    console.log("this.currentIndex", this.currentIndex);

    // console.log("Closed function " + this.drawerNewMember);
    if (this.currentIndex > -1) {
      this.drawerDocAndDetailArray[this.currentIndex] = this.drawerDocAndDetail;
      this.drawerDocAndDetailArray = [...[], ...this.drawerDocAndDetailArray];

    } else {
      this.drawerDocAndDetailArray = [...this.drawerDocAndDetailArray, ...[this.drawerDocAndDetail]];
    }

    this.currentIndex = -1;
    console.log("Conti Array" + this.drawerDocAndDetailArray);
    this.drawerDocAndDetailVisible = false;
  }

  getwidth() {
    if (window.innerWidth < 400) {
      return 380;

    } else {
      return 800;
    }
  }

  drawerTitle: string;

  NewMember() {
    console.log("Drawer cllaed..");
    this.drawerTitle = "Add New Member";
    this.drawerNewMember = new NewMemberModel();
    this.drawerNewMemberVisible = true;
    this.currentIndex = -1
  }

  DetailAndDocument() {
    console.log("Drawer cllaed..");
    this.drawerTitle = "Add Details and Document";
    this.drawerDocAndDetail = new DetailAndDocumentModel();
    this.drawerDocAndDetailVisible = true;
    this.currentIndex = -1;
  }

  editDocAndDetaildata(data1: DetailAndDocumentModel, index: number): void {
    this.currentIndex = index
    console.log("this.currentIndex", this.currentIndex);
    this.drawerTitle = "Update Title Details";
    this.drawerDocAndDetail = Object.assign({}, data1);
    this.drawerDocAndDetail.OUTSTANDING_MEMBER_ID = this.data.ID;
    this.drawerDocAndDetailVisible = true;
  }

  editNewMemberdata(data1: NewMemberModel, index: number): void {
    this.currentIndex = index
    console.log("this.currentIndex", this.currentIndex);
    this.drawerTitle = "Update Title Details";
    this.drawerNewMember = Object.assign({}, data1);
    this.drawerNewMember.OUTSTANDING_MEMBER_ID = this.data.ID;
    this.drawerNewMemberVisible = true;
  }

  isOk: boolean = false
  isSpinning = false;
  isVisible = false;

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  ApplyForAward(myForm: any) {
    this.data.IS_SUBMITED = 'S';
    this.save(myForm);
  }

  save(myForm: NgForm) {
    var memberId = Number(this.cookie.get('userId'));
    this.data.GROUP_ID = Number(sessionStorage.getItem('HOME_GROUP_ID'));
    this.data.MEMBER_ID = Number(this.cookie.get('userId'));
    this.data.NEW_MEMBER_ADDED = this.drawerNewMemberArray;
    this.data.DETAILS_AND_DOCUMENT = this.drawerDocAndDetailArray;
    // this.data.CREATED_MODIFIED_DATE = this.datePipe.transform(this.data.CREATED_MODIFIED_DATE, "dd-MM-yyyy")
    let length = Number(this.data.DETAILS_AND_DOCUMENT.length);

    for (let i = 0; i < length; i++) {
      this.pdfUpload1(i);
      this.data.DETAILS_AND_DOCUMENT[i]['DOCUMENTS'] = (this.pdf1Str == "") ? " " : this.pdf1Str;
      console.log(this.data.DETAILS_AND_DOCUMENT[i]['DOCUMENTS'])
    }

    var GroupId = Number(sessionStorage.getItem('HOME_GROUP_ID'));
    this.data.AWARD_TYPE = "M";
    if (
      this.data.PARTICIPATION_IN_MEETINGS != undefined && this.data.PARTICIPATION_IN_MEETINGS_OUT_OF != undefined
      && this.data.PARTICIPATION_IN_PROJECTS != undefined && this.data.PARTICIPATION_IN_PROJECTS_OUT_OF != undefined
      && this.data.PARTICIPATION_IN_UNIT_CONFERENCE != undefined && this.data.PARTICIPATION_IN_UNIT_CONFERENCE_OUT_OF != undefined
      && this.data.PARTICIPATION_IN_GWF_PAST_CONVENTION == "" && this.data.NATIONAL_EXTENSION == ""
      && this.data.INTERNATIONAL_EXTENSION == "" && this.data.GROUP_ACTIVITIES == ""
      && this.data.FISCAL_ACTIVITIES == "" && this.data.OTHER_DETAILS == ""
    ) {
      this.isOk = false;
      this.data.IS_SUBMITED = 'D';
      this.message.error("All Feild Required", "");

    } else if (this.data.PARTICIPATION_IN_MEETINGS == undefined || this.data.PARTICIPATION_IN_MEETINGS <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = 'D';
      this.message.error('Please Enter Total Participation In Meeting Count', '')

    } else if (this.data.PARTICIPATION_IN_MEETINGS_OUT_OF == undefined || this.data.PARTICIPATION_IN_MEETINGS_OUT_OF <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = 'D';
      this.message.error('Please Enter Out Of Participation In Meeting Count', '')

    } else if (this.data.PARTICIPATION_IN_MEETINGS_OUT_OF < 0 && (this.data.PARTICIPATION_IN_MEETINGS_OUT_OF < this.data.PARTICIPATION_IN_MEETINGS)) {
      this.isOk = false;
      this.data.IS_SUBMITED = 'D';
      this.message.error('Please Enter Valid Out Of Participation In Meeting Count', '');

    } else if (this.data.PARTICIPATION_IN_PROJECTS == undefined || this.data.PARTICIPATION_IN_PROJECTS <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = 'D';
      this.message.error('Please Enter Total Participation In Project Count', '')

    } else if (this.data.PARTICIPATION_IN_PROJECTS_OUT_OF == undefined || this.data.PARTICIPATION_IN_PROJECTS_OUT_OF <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = 'D';
      this.message.error('Please Enter Out Of Participation In Project Count', '')

    } else if (this.data.PARTICIPATION_IN_PROJECTS_OUT_OF < 0 && (this.data.PARTICIPATION_IN_PROJECTS_OUT_OF < this.data.PARTICIPATION_IN_PROJECTS)) {
      this.isOk = false;
      this.data.IS_SUBMITED = 'D';
      this.message.error('Please Enter Valid Out Of Participation In Project Count', '');

    } else if (this.data.PARTICIPATION_IN_UNIT_CONFERENCE == undefined || this.data.PARTICIPATION_IN_UNIT_CONFERENCE <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = 'D';
      this.message.error('Please Enter Total Unit Conference Count', '')

    } else if (this.data.PARTICIPATION_IN_UNIT_CONFERENCE_OUT_OF == undefined || this.data.PARTICIPATION_IN_UNIT_CONFERENCE_OUT_OF <= 0) {
      this.isOk = false;
      this.data.IS_SUBMITED = 'D';
      this.message.error('Please Enter Out Of Unit Conference Count', '')

    } else if (this.data.PARTICIPATION_IN_UNIT_CONFERENCE_OUT_OF < 0 && (this.data.PARTICIPATION_IN_UNIT_CONFERENCE_OUT_OF < this.data.PARTICIPATION_IN_UNIT_CONFERENCE)) {
      this.isOk = false;
      this.data.IS_SUBMITED = 'D';
      this.message.error('Please Enter Valid Out Of Unit Conference Count', '');

    } else if (this.data.PARTICIPATION_IN_GWF_PAST_CONVENTION == undefined || this.data.PARTICIPATION_IN_GWF_PAST_CONVENTION.trim() == "") {
      this.isOk = false;
      this.data.IS_SUBMITED = 'D';
      this.message.error('Please Enter Participation in GWF Past Convention', '');

    } else if (this.data.NATIONAL_EXTENSION == null || this.data.NATIONAL_EXTENSION.trim() == '') {
      this.isOk = false;
      this.data.IS_SUBMITED = 'D';
      this.message.error('Please Enter National Extension', '')

    } else if (this.data.INTERNATIONAL_EXTENSION == null || this.data.INTERNATIONAL_EXTENSION.trim() == '') {
      this.isOk = false;
      this.data.IS_SUBMITED = 'D';
      this.message.error('Please Enter International Extension', '')

    } else if (this.data.GROUP_ACTIVITIES == null || this.data.GROUP_ACTIVITIES.trim() == '') {
      this.isOk = false;
      this.data.IS_SUBMITED = 'D';
      this.message.error('Please Enter Group Activities', '')

    } else if (this.data.FISCAL_ACTIVITIES == null || this.data.FISCAL_ACTIVITIES.trim() == '') {
      this.isOk = false;
      this.data.IS_SUBMITED = 'D';
      this.message.error('Please Enter Fiscal Activities', '')

    } else if (this.data.OTHER_DETAILS == null || this.data.OTHER_DETAILS.trim() == '') {
      this.isOk = false;
      this.data.IS_SUBMITED = 'D';
      this.message.error('Please Enter Other Details', '')

    } else {
      if (this.data.ID) {
        this.api.updatMemberAward(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Member Details Updated Successfully", "");
            this.isSpinning = false;
            this.drawerClose();

          } else {
            this.message.error("Member Details Updation Failed", "");
            this.isSpinning = false;
            this.drawerClose();
          }
        });

      } else {
        this.api.createMemberAward(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Member Created Successfully", "");
            this.isSpinning = false;

          } else {
            this.message.error("Member Creation Failed", "");
            this.isSpinning = false;
          }
        });
      }
    }
  }

  pdfFileURL1: any;
  folderName = "memberDocuments/";
  DocumentUrl = this.api.retriveimgUrl + "memberDocuments"
  pdf1Str: string;

  pdfUpload1(i: number) {
    this.pdf1Str = "";
    this.pdfFileURL1 = this.data.DETAILS_AND_DOCUMENT[i]['DOCUMENTS'];
    if (typeof (this.pdfFileURL1) != 'string') {
      if (!this.data.ID) {
        if (this.pdfFileURL1) {
          var number = Math.floor(100000 + Math.random() * 900000);
          console.log(typeof (this.pdfFileURL1));
          var fileExt = this.pdfFileURL1.name.split('.').pop();
          var url = "GA" + number + "." + fileExt;
          this.api.onUpload2(this.folderName, this.pdfFileURL1, url).subscribe(res => {
            if (res["code"] == 200) {
              console.log("Uploaded");
            } else {
              console.log("Not Uploaded");
            }
          });
          this.pdf1Str = url;
        } else {
          this.pdf1Str = "";
        }
      } else {
        if (this.pdfFileURL1) {
          var number = Math.floor(100000 + Math.random() * 900000);
          console.log(typeof (this.pdfFileURL1));
          var fileExt = this.pdfFileURL1.name.split('.').pop();
          var url = "GA" + number + "." + fileExt;
          this.api.onUpload2(this.folderName, this.pdfFileURL1, url).subscribe(res => {
            if (res["code"] == 200) {
              console.log("Uploaded");
            } else {
              console.log("Not Uploaded");
            }
          });
          this.pdf1Str = url;
        } else {
          if (this.data.DETAILS_AND_DOCUMENT[i]['DOCUMENTS']) {
            let pdfURL = this.data.DETAILS_AND_DOCUMENT[i]['DOCUMENTS'].split("/");
            this.pdf1Str = pdfURL[pdfURL.length - 1];
          } else
            this.pdf1Str = "";
        }
      }
    } else {
      this.pdf1Str = this.data.DETAILS_AND_DOCUMENT[i]['DOCUMENTS'];
    }
  }

  totalRecords = 1;
  OldFetchedData: string[] = [];
  FetchOldData() {
    // this.message.info("Fetch Old Data", "Data Fetched")
    const memberID = parseInt(this.cookie.get('userId'));
    // const groupID = Number(this.cookie.get("GROUP_ID"));

    this.api.getAllMemberAwardDetails(memberID).subscribe(data => {
      if (data['code'] == '200') {
        this.totalRecords = data['count'];
        this.OldFetchedData = data['data'];

      }
      this.data.PARTICIPATION_IN_MEETINGS = this.OldFetchedData[0]['MEETING_ATTEMPTED'];
      this.data.PARTICIPATION_IN_MEETINGS_OUT_OF = this.OldFetchedData[0]['MEETING_INVITED'];
      this.message.success(" Old Data Fetched Successfully ", "")

    }, err => {
      // this.GroupmeetsattendiesmapComponentVar.isSpinning = false;
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }


  year = new Date().getFullYear();
  baseYear = 2010;
  range = [];
  next_year = Number(this.year + 1)
  SelectedYear: any = this.year + "-" + this.next_year;
  currentDate = new Date();
  businessYearStartDate = new Date(this.currentDate.getFullYear() + 1, 3, 1);

  Fordate() {
    let currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= this.baseYear; i--) {
      this.range.push(i);
    }
  }

  CurrentYear: any;

  LoadYears() {
    this.SelectedYear = new Date().getFullYear();
    this.CurrentYear = this.SelectedYear;
  }

  selectChangeYear(itsYear: any) {
    this.data = new MemberAwardModel();
    this.drawerNewMemberArray = [];
    this.drawerDocAndDetailArray = [];
    this.SelectedYear = itsYear;
    var member = this.cookie.get('userId');

    this.api.getMemberAwardDetails(0, 0, "", "asc", " AND MEMBER_ID=" + member + " AND AWARD_TYPE = 'M'", this.SelectedYear).subscribe(data => {
      if (data['count'] > 0) {
        this.data = Object.assign({}, data['data'][0]);

        this.api.getNewMemberDrawer(0, 0, "", "asc", " AND OUTSTANDING_MEMBER_ID=" + this.data.ID).subscribe(dataSpons => {
          if (dataSpons['count'] > 0) {
            this.drawerNewMemberArray = dataSpons['data'];

          } else {
            this.drawerNewMemberArray = [];
          }
        });

        this.api.getDocAndDetailDrawer(0, 0, "", "asc", " AND OUTSTANDING_MEMBER_ID=" + this.data.ID).subscribe(dataSpons => {
          if (dataSpons['count'] > 0) {
            this.drawerDocAndDetailArray = dataSpons['data'];

          } else {
            this.drawerDocAndDetailArray = [];
          }
        });
      }
    });
  }
}
