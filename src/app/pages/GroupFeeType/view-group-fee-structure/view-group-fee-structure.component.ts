import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from 'src/app/Service/api.service';
import { ExportService } from 'src/app/Service/export.service';

@Component({
  selector: 'app-view-group-fee-structure',
  templateUrl: './view-group-fee-structure.component.html',
  styleUrls: ['./view-group-fee-structure.component.css']
})

export class ViewGroupFeeStructureComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() drawerVisible: boolean;
  @Input() feeDetails = [];
  SAHELI: string = "";
  NORMAL: string = "";
  YOUNG: string = "";
  isSpinning: boolean = false;
  loadingRecords: boolean = false;
  federationID = Number(this._cookie.get("FEDERATION_ID"));
  unitID = Number(this._cookie.get("UNIT_ID"));
  groupID = Number(this._cookie.get("GROUP_ID"));
  federationLoading: boolean = false;
  unitLoading: boolean = false;
  groupLoading: boolean = false;
  internationalFeeStructure = [];
  pageIndex: number = 0;
  pageSize: number = 0;

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe, private _cookie: CookieService, private _exportService: ExportService) { }

  ngOnInit() {
    this.getFederations();
    this.getInternationFeeStructure();
  }

  getInternationFeeStructure() {
    this.api.getAdminFeeStructure(0, 0, "ID", "ASC", "").subscribe(data => {
      if (data['code'] == 200) {
        this.internationalFeeStructure = data['data'];
      }

    }, err => {
      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  FEDERATION_ID: any = [];
  UNIT_ID: any = [];
  GROUP_ID: any = [];
  federations: any = [];

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

    this.federations = [];
    this.federationLoading = true;
    this.api.getAllFederations(0, 0, "NAME", "asc", " AND STATUS=1" + federationFilter + unitFilter + groupFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.federationLoading = false;
        this.federations = data['data'];
      }

    }, err => {
      this.federationLoading = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });
  }

  units = [];

  getUnits(federationID) {
    var unitFilter = "";
    if (this.unitID != 0) {
      unitFilter = " AND ID=" + this.unitID;
    }

    var groupFilter = "";
    if (this.groupID != 0) {
      groupFilter = " AND ID=(SELECT UNIT_ID FROM group_master WHERE ID=" + this.groupID + ")";
    }

    this.units = [];
    this.UNIT_ID = [];
    this.UNIT_SWITCH = false;

    this.groups = [];
    this.GROUP_ID = [];
    this.GROUP_SWITCH = false;

    this.unitLoading = true;
    let federationFilter = federationID.length == 0 ? 0 : federationID;
    this.api.getAllUnits(0, 0, "NAME", "asc", " AND FEDERATION_ID IN (" + federationFilter + ") AND STATUS=1" + unitFilter + groupFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.unitLoading = false;
        this.units = data['data'];
      }

    }, err => {
      this.unitLoading = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    // Selection of Federations
    let a = this.federations.length;
    let b = federationID.length;

    if (a == b) {
      this.FEDERATION_SWITCH = true;

    } else {
      this.FEDERATION_SWITCH = false;
    }
  }

  groups = [];

  getGroups(unitID) {
    var groupFilter = "";
    if (this.groupID != 0) {
      groupFilter = " AND ID=" + this.groupID;
    }

    this.groups = [];
    this.GROUP_ID = [];
    this.GROUP_SWITCH = false;

    this.groupLoading = true;
    let unitFilter = unitID.length == 0 ? 0 : unitID;
    this.api.getAllGroups(0, 0, "NAME", "asc", " AND UNIT_ID IN (" + unitFilter + ") AND STATUS=1" + groupFilter).subscribe(data => {
      if (data['code'] == 200) {
        this.groupLoading = false;
        this.groups = data['data'];
      }

    }, err => {
      this.groupLoading = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
    });

    // Selection of Federations
    let a = this.units.length;
    let b = unitID.length;

    if (a == b) {
      this.UNIT_SWITCH = true;

    } else {
      this.UNIT_SWITCH = false;
    }
  }

  groupSelection(groupID) {
    let a = this.groups.length;
    let b = groupID.length;

    if (a == b) {
      this.GROUP_SWITCH = true;

    } else {
      this.GROUP_SWITCH = false;
    }
  }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }

  tempFeeDetails = [];

  save(addNew: boolean, myForm: NgForm) {
    let isOk = true;

    if ((this.GROUP_ID.length == 0)) {
      this.message.error("Please Select Valid Group(s)", "");
      isOk = false;
    }

    if (isOk) {
      this.tempFeeDetails = [];

      for (var i = 0; i < this.feeDetails.length; i++) {
        if (this.feeDetails[i]["SAHELI"] == "")
          this.feeDetails[i]["SAHELI"] = 0;

        if (this.feeDetails[i]["NORMAL"] == "")
          this.feeDetails[i]["NORMAL"] = 0;

        if (this.feeDetails[i]["YOUNG"] == "")
          this.feeDetails[i]["YOUNG"] = 0;
      }

      for (var i = 0; i < this.GROUP_ID.length; i++) {
        for (var j = 0; j < this.feeDetails.length; j++) {
          let obj1 = new Object();
          obj1["FEE_TYPE"] = this.feeDetails[j]["FEE_TYPE"];
          obj1["QUARTER"] = this.feeDetails[j]["QUARTER"];
          obj1["SAHELI"] = this.feeDetails[j]["SAHELI"];
          obj1["NORMAL"] = this.feeDetails[j]["NORMAL"];
          obj1["YOUNG"] = this.feeDetails[j]["YOUNG"];
          obj1["GROUP_ID"] = this.GROUP_ID[i];
          obj1["SEQUENCE_NO"] = j + 1;

          this.tempFeeDetails.push(Object.assign({}, obj1));
        }
      }

      let obj1 = new Object();
      obj1["GROUP_IDz"] = this.GROUP_ID;
      obj1["FEE_DETAILS"] = this.tempFeeDetails;
      this.isSpinning = true;

      this.api.submitGroupWiseFeeStructure(obj1).subscribe((successCode) => {
        if (successCode["code"] == 200) {
          this.message.success("Group Fee Details Submitted Successfully", "");
          this.isSpinning = false;
          this.close(myForm);

        } else {
          this.message.error("Failed to Submit Group Fee Details", "");
          this.isSpinning = false;
        }
      });
    }
  }

  onSaheliAmtChange(amt) {
    for (var i = 0; i < this.feeDetails.length; i++) {
      this.feeDetails[i]["SAHELI"] = amt;
    }
  }

  onNormalAmtChange(amt) {
    for (var i = 0; i < this.feeDetails.length; i++) {
      this.feeDetails[i]["NORMAL"] = amt;
    }
  }

  onYoungAmtChange(amt) {
    for (var i = 0; i < this.feeDetails.length; i++) {
      this.feeDetails[i]["YOUNG"] = amt;
    }
  }

  FEDERATION_SWITCH: boolean = false;
  UNIT_SWITCH: boolean = false;
  GROUP_SWITCH: boolean = false;

  selectFederations(status: boolean) {
    let tempFederations = [];

    if (status) {
      this.federations.map(obj1 => {
        tempFederations.push(obj1["ID"]);
      });

      this.FEDERATION_ID = tempFederations;
      this.getUnits(this.FEDERATION_ID);

    } else {
      this.FEDERATION_ID = [];
      this.getUnits(this.FEDERATION_ID);
    }
  }

  selectUnits(status: boolean) {
    let tempUnits = [];

    if (status) {
      this.units.map(obj1 => {
        tempUnits.push(obj1["ID"]);
      });

      this.UNIT_ID = tempUnits;
      this.getGroups(this.UNIT_ID);

    } else {
      this.UNIT_ID = [];
      this.getGroups(this.UNIT_ID);
    }
  }

  selectGroups(status: boolean) {
    let tempGroups = [];

    if (status) {
      this.groups.map(obj1 => {
        tempGroups.push(obj1["ID"]);
      });

      this.GROUP_ID = tempGroups;

    } else {
      this.GROUP_ID = [];
    }
  }
}
