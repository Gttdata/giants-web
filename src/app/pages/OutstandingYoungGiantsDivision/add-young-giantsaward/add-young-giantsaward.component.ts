import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { NzNotificationService } from "ng-zorro-antd";
import { CookieService } from "ngx-cookie-service";
import { OustandingYoungGiantsDivisionMaster } from "src/app/Models/OutstandingYoungGiantsDivision";
import { ApiService } from "src/app/Service/api.service";

@Component({
  selector: "app-add-young-giantsaward",
  templateUrl: "./add-young-giantsaward.component.html",
  styleUrls: ["./add-young-giantsaward.component.css"],
})

export class AddYoungGiantsawardComponent implements OnInit {
  groupID = this._cookie.get("HOME_GROUP_ID");
  @Input() drawerClose: Function;
  @Input() drawerVisible: boolean = false;
  @Input() data: OustandingYoungGiantsDivisionMaster = new OustandingYoungGiantsDivisionMaster();

  constructor(
    public api: ApiService,
    private message: NzNotificationService,
    private datePipe: DatePipe,
    private _cookie: CookieService
  ) { }

  validation = true;
  isSpinning = false;
  isOk = true;
  isVisible = false;

  ngOnInit() {
    this.year = new Date().getFullYear();
    this.SelectedYear = this.year
    this.currentYear = this.SelectedYear;
    this.Fordate();
    this.LoadYears();
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  ApplySubmit(myForm: NgForm) {
    this.data.IS_SUBMITED = 'S';
    this.save(false, myForm);
  }

  save(addNew: boolean, myForm: NgForm): void {
    this.isSpinning = false;
    this.isOk = true;
    this.data.GROUP_ID = parseInt(this.groupID);

    if ((this.data.DESCRIPTION_OF_COHESIVE_WELLKNIT == "" || this.data.DESCRIPTION_OF_COHESIVE_WELLKNIT == undefined || this.data.DESCRIPTION_OF_COHESIVE_WELLKNIT.toString() == "" || this.data.DESCRIPTION_OF_COHESIVE_WELLKNIT == null)
      && (this.data.DESCRIPTION_OF_COHESIVE_WELLKNIT == "" || this.data.DESCRIPTION_OF_COHESIVE_WELLKNIT == undefined || this.data.DESCRIPTION_OF_COHESIVE_WELLKNIT.toString() == "" || this.data.DESCRIPTION_OF_COHESIVE_WELLKNIT == null)
      && (this.data.NO_OF_MEMBERS == undefined || this.data.NO_OF_MEMBERS.toString() == "" || this.data.NO_OF_MEMBERS == null)
      && (this.data.NO_OF_WELL_KNIT == undefined || this.data.NO_OF_WELL_KNIT.toString() == "" || this.data.NO_OF_WELL_KNIT == null)
      && (this.data.ACTIVE_PARTICIPATION_MEMBERS == undefined || this.data.ACTIVE_PARTICIPATION_MEMBERS.toString() == "" || this.data.ACTIVE_PARTICIPATION_MEMBERS == null)
      && (this.data.ACTIVE_PARTICIPATION_MEMBERS_PERCENTAGE == undefined || this.data.ACTIVE_PARTICIPATION_MEMBERS_PERCENTAGE.toString() == "" || this.data.ACTIVE_PARTICIPATION_MEMBERS_PERCENTAGE == null || this.data.ACTIVE_PARTICIPATION_MEMBERS_PERCENTAGE > 100 || this.data.ACTIVE_PARTICIPATION_MEMBERS_PERCENTAGE == 0)
      && (this.data.NO_OF_REGULAR_MEET == undefined || this.data.NO_OF_REGULAR_MEET.toString() == "" || this.data.NO_OF_REGULAR_MEET == null)
      && (this.data.PERCENTAGE_OF_REGULAR_MEET == undefined || this.data.PERCENTAGE_OF_REGULAR_MEET.toString() == "" || this.data.PERCENTAGE_OF_REGULAR_MEET == null || this.data.PERCENTAGE_OF_REGULAR_MEET > 100 || this.data.PERCENTAGE_OF_REGULAR_MEET == 0)
      && (
        this.data.BOARD_MEETINGS == undefined ||
        this.data.BOARD_MEETINGS.toString() == "" ||
        this.data.BOARD_MEETINGS == null
      )
      && (
        this.data.BOARD_PRESENT_DIR == undefined ||
        this.data.BOARD_PRESENT_DIR.toString() == "" ||
        this.data.BOARD_PRESENT_DIR == null ||
        this.data.BOARD_PRESENT_DIR > 100 ||
        this.data.BOARD_PRESENT_DIR == 0
      )
      && (
        this.data.NO_OF_PARENT_BODY_MEET == undefined ||
        this.data.NO_OF_PARENT_BODY_MEET.toString() == "" ||
        this.data.NO_OF_PARENT_BODY_MEET == null
      )
      && (
        this.data.PERCENTAGE_OF_PARENT_BODY_MEET == undefined ||
        this.data.PERCENTAGE_OF_PARENT_BODY_MEET.toString() == "" ||
        this.data.PERCENTAGE_OF_PARENT_BODY_MEET == null ||
        this.data.PERCENTAGE_OF_PARENT_BODY_MEET > 100 ||
        this.data.PERCENTAGE_OF_PARENT_BODY_MEET == 0
      )
      && (
        this.data.DESCRIPTION_OF_NAME_FAME ||
        this.data.DESCRIPTION_OF_NAME_FAME == undefined ||
        this.data.DESCRIPTION_OF_NAME_FAME.toString() == "" ||
        this.data.DESCRIPTION_OF_NAME_FAME == null
      )
      && (
        this.data.BANK_NAME == undefined ||
        this.data.BANK_NAME.toString() == "" ||
        this.data.BANK_NAME == null
      )
      && (
        this.data.BANK_ACCOUNT_NUMBER == undefined ||
        this.data.BANK_ACCOUNT_NUMBER.toString() == "" ||
        this.data.BANK_ACCOUNT_NUMBER == null
      )
      && (
        this.data.DESCRIPTION_PROJECT_DETAILS ||
        this.data.DESCRIPTION_PROJECT_DETAILS == undefined ||
        this.data.DESCRIPTION_PROJECT_DETAILS.toString() == "" ||
        this.data.DESCRIPTION_PROJECT_DETAILS == null
      )

    ){
      this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error("Please enter all the mandatory fields", "");
    }
    else{
      if ( this.data.DESCRIPTION_OF_COHESIVE_WELLKNIT == undefined || this.data.DESCRIPTION_OF_COHESIVE_WELLKNIT.toString() == "" || this.data.DESCRIPTION_OF_COHESIVE_WELLKNIT == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error("Please enter the divisions cohesive and well-knit", "");
      } else if (this.data.NO_OF_MEMBERS == undefined || this.data.NO_OF_MEMBERS.toString() == "" || this.data.NO_OF_MEMBERS == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error("Please enter the no of members ", "");
      } else if (this.data.NO_OF_WELL_KNIT == undefined || this.data.NO_OF_WELL_KNIT.toString() == "" || this.data.NO_OF_WELL_KNIT == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error("Please enter the no of well knit ", "");
      } else if (this.data.Swicthing1 == true && (this.data.PARENT_GROUP_DESCRIPTION || this.data.PARENT_GROUP_DESCRIPTION == undefined || this.data.PARENT_GROUP_DESCRIPTION.toString() == "" || this.data.PARENT_GROUP_DESCRIPTION == null)
      ) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error(
          "Whether Project undertaken and/or worked in co-ordination with the parent group field required",
          ""
        );
      } else if (this.data.ACTIVE_PARTICIPATION_MEMBERS == undefined || this.data.ACTIVE_PARTICIPATION_MEMBERS.toString() == "" || this.data.ACTIVE_PARTICIPATION_MEMBERS == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error(
          "Please enter the active participation of members ",
          ""
        );
      } else if (this.data.ACTIVE_PARTICIPATION_MEMBERS_PERCENTAGE == undefined || this.data.ACTIVE_PARTICIPATION_MEMBERS_PERCENTAGE.toString() == "" || this.data.ACTIVE_PARTICIPATION_MEMBERS_PERCENTAGE == null || this.data.ACTIVE_PARTICIPATION_MEMBERS_PERCENTAGE > 100 || this.data.ACTIVE_PARTICIPATION_MEMBERS_PERCENTAGE == 0) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error(
          "Please enter the percentage of active participation of members",
          ""
        );
      } else if (this.data.NO_OF_REGULAR_MEET == undefined || this.data.NO_OF_REGULAR_MEET.toString() == "" || this.data.NO_OF_REGULAR_MEET == null) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error("Please enter the No of regular meet ", "");
      } else if (this.data.PERCENTAGE_OF_REGULAR_MEET == undefined || this.data.PERCENTAGE_OF_REGULAR_MEET.toString() == "" || this.data.PERCENTAGE_OF_REGULAR_MEET == null || this.data.PERCENTAGE_OF_REGULAR_MEET > 100 || this.data.PERCENTAGE_OF_REGULAR_MEET == 0) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error("Please enter the percentage of regular meet", "");
      } else if (
        this.data.BOARD_MEETINGS == undefined ||
        this.data.BOARD_MEETINGS.toString() == "" ||
        this.data.BOARD_MEETINGS == null
      ) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error("Please enter the no of board meet ", "");
      } else if (
        this.data.BOARD_PRESENT_DIR == undefined ||
        this.data.BOARD_PRESENT_DIR.toString() == "" ||
        this.data.BOARD_PRESENT_DIR == null ||
        this.data.BOARD_PRESENT_DIR > 100 ||
        this.data.BOARD_PRESENT_DIR == 0
      ) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error("Please enter the percentage of board meet ", "");
      } else if (
        this.data.NO_OF_PARENT_BODY_MEET == undefined ||
        this.data.NO_OF_PARENT_BODY_MEET.toString() == "" ||
        this.data.NO_OF_PARENT_BODY_MEET == null
      ) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error("Please enter the no of parent body meet ", "");
      } else if (
        this.data.PERCENTAGE_OF_PARENT_BODY_MEET == undefined ||
        this.data.PERCENTAGE_OF_PARENT_BODY_MEET.toString() == "" ||
        this.data.PERCENTAGE_OF_PARENT_BODY_MEET == null ||
        this.data.PERCENTAGE_OF_PARENT_BODY_MEET > 100 ||
        this.data.PERCENTAGE_OF_PARENT_BODY_MEET == 0
      ) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error(
          "Please enter the percentage of parent body meet ",
          ""
        );
      } else if (
        this.data.Swicthing2 == true &&
        (this.data.NO_OF_YG == undefined ||
          this.data.NO_OF_YG.toString() == "" ||
          this.data.NO_OF_YG == 0)
      ) {
        {
          this.isOk = false;
          this.data.IS_SUBMITED = 'D';
          this.message.error("Please enter the no of YG", "");
        }
      } else if (
        this.data.Swicthing2 == true &&
        (this.data.PERCENTAGE_OF_YG == undefined ||
          this.data.PERCENTAGE_OF_YG.toString() == "" ||
          this.data.PERCENTAGE_OF_YG == 0 ||
          this.data.PERCENTAGE_OF_YG > 100)
      ) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error("Please enter the percentage of YG", "");
      } else if (
        this.data.Swicthing3 == true &&
        (this.data.DESCRIPTION_OF_PRESIDENT_MEET_PROJECT ||
          this.data.DESCRIPTION_OF_PRESIDENT_MEET_PROJECT == undefined ||
          this.data.DESCRIPTION_OF_PRESIDENT_MEET_PROJECT.toString() == "" ||
          this.data.DESCRIPTION_OF_PRESIDENT_MEET_PROJECT == null)
      ) {
        {
          this.isOk = false;
          this.data.IS_SUBMITED = 'D';
          this.message.error(
            "Whether president of the parent group was invited to you meetings and project field required",
            ""
          );
        }
      } else if (        
        this.data.DESCRIPTION_OF_NAME_FAME == undefined ||
        this.data.DESCRIPTION_OF_NAME_FAME.toString() == "" ||
        this.data.DESCRIPTION_OF_NAME_FAME == null
      ) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error("Please enter the description of name and fame ", "");
      } else if (
        this.data.BANK_NAME == undefined ||
        this.data.BANK_NAME.toString() == "" ||
        this.data.BANK_NAME == null
      ) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error("Please enter the bank name ", "");
      } else if (
        this.data.BANK_ACCOUNT_NUMBER == undefined ||
        this.data.BANK_ACCOUNT_NUMBER.toString() == "" ||
        this.data.BANK_ACCOUNT_NUMBER == null
      ) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error("Please enter the bank account number ", "");
      } else if (
        this.data.DESCRIPTION_PROJECT_DETAILS == undefined ||
        this.data.DESCRIPTION_PROJECT_DETAILS.toString() == "" ||
        this.data.DESCRIPTION_PROJECT_DETAILS == null
      ) {
        this.isOk = false;
        this.data.IS_SUBMITED = 'D';
        this.message.error(
          "Please enter the description of project details ",
          ""
        );
      } else {
        if (this.data.Swicthing1 != true) {
          this.data.PARENT_GROUP_DESCRIPTION = "";
        }
        if (this.data.Swicthing2 != true) {
          this.data.NO_OF_YG = 0;
          this.data.PERCENTAGE_OF_YG = 0;
        }
        if (this.data.Swicthing3 != true) {
          this.data.DESCRIPTION_OF_PRESIDENT_MEET_PROJECT = "";
        }
      }
    }


    if (this.isOk) {
      this.isSpinning = true;

      if (this.data.ID) {
        this.api
          .updateOutstandingYoungGiantsDivision(this.data)
          .subscribe((successCode) => {
            if (successCode["code"] == 200) {
              this.message.success(
                "Outstanding Young Giants Division Award Updated Successfully",
                ""
              );

              this.isSpinning = false;

              if (!addNew)
                this.close(myForm);

            } else {
              this.message.error(
                "Outstanding Young Giants Division Award Updation Failed",
                ""
              );
              this.isSpinning = false;
            }
          });

      } else {
        this.api
          .createOutstandingYoungGiantsDivision(this.data)
          .subscribe((successCode) => {
            if (successCode["code"] == 200) {
              this.message.success(
                "Outstanding Young Giants Division Award Created Successfully",
                ""
              );
              this.isSpinning = false;

              if (!addNew) this.close(myForm);
              else {
                this.data = new OustandingYoungGiantsDivisionMaster();
              }
            } else {
              this.message.error(
                "Outstanding Young Giants Division Award Creation Failed",
                ""
              );
              this.isSpinning = false;
            }
          });
      }
    }
        
      
  }

  totalRecords = 1;
  OldFetchedData: string[] = [];

  FetchOldData() {
    const memberID = parseInt(this._cookie.get("userId"));
    const groupID = Number(this._cookie.get("GROUP_ID"));

    this.api.getAllYoungGiantsDetails(memberID, groupID).subscribe((data) => {
      if (data["code"] == "200") {
        this.totalRecords = data["count"];
        this.OldFetchedData = data["data"];
      }

      this.data.ACTIVE_PARTICIPATION_MEMBERS =
        this.OldFetchedData[0]["ACTIVE_MEMBERS"];
      this.data.ACTIVE_PARTICIPATION_MEMBERS_PERCENTAGE =
        this.OldFetchedData[0]["ACTIVE_MEMBER_PERCENTAGE"];
      this.data.NO_OF_REGULAR_MEET = this.OldFetchedData[0]["MEETINGS"];
      this.data.PERCENTAGE_OF_REGULAR_MEET =
        this.OldFetchedData[0]["REGULAR_MEETING_PERCENTAGE"];
      this.data.NO_OF_YG = this.OldFetchedData[0]["PRESENT_DIR"];
      this.data.PERCENTAGE_OF_YG =
        this.OldFetchedData[0]["PRESENT_DIR_PERCENTAGE"];
      this.data.NO_OF_MEMBERS = this.OldFetchedData[0]["TOTAL_MEMBERS"];

      this.data.BOARD_MEETINGS = this.OldFetchedData[0]["BOARD_MEETINGS"];

      this.data.BOARD_PRESENT_DIR = this.OldFetchedData[0]["BOARD_PRESENT_DIR"];
      

    },
      (err) => {
        if (err["ok"] == false) this.message.error("Server Not Found", "");
      }
    );
  }

  year = new Date().getFullYear();
  baseYear = 2020;
  range = [];
  // next_year = Number(this.year + 1)
  // SelectedYear: any = this.year + "-" + this.next_year;
  // currentYear: any = this.year - 1 + "-" + this.year;
  // currentDate = new Date();
  // businessYearStartDate = new Date(this.currentDate.getFullYear() + 1, 3, 1);

  currentYear: any;
  SelectedYear: any;

  Fordate() {
    let currentYear = new Date().getFullYear();

    for (let i = currentYear; i >= this.baseYear; i--) {
      this.range.push(i);
    }
  }

  LoadYears() {
    this.SelectedYear = new Date().getFullYear();
  }

  selectChangeYear() {
    this.data = new OustandingYoungGiantsDivisionMaster();

    this.api.getOutstandingYoungGiantsDivision(0, 0, "ID", "ASC", "AND GROUP_ID=" + this.groupID, this.SelectedYear).subscribe((data) => {
      if (data["count"] > 0) {
        this.data = Object.assign({}, data["data"][0]);
      }
    });
  }
}
