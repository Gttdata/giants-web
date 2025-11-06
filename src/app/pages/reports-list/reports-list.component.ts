import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.css']
})

export class ReportsListComponent implements OnInit {
  formTitle: string = "Reports";
  federationID: number = Number(sessionStorage.getItem("FEDERATION_ID"));
  unitID: number = Number(sessionStorage.getItem("UNIT_ID"));
  groupID: number = Number(sessionStorage.getItem("GROUP_ID"));
  roleID: number = this.api.roleId;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.getIDs();
  }

  getIDs(): void {
    this.federationID = Number(sessionStorage.getItem("FEDERATION_ID"));
    this.unitID = Number(sessionStorage.getItem("UNIT_ID"));
    this.groupID = Number(sessionStorage.getItem("GROUP_ID"));
    this.roleID = this.api.roleId;
  }

  goToPaymentDetailsReport(): void {
    window.open("report/payment-details-report");
  }

  goToPaymentSummaryReport(): void {
    window.open("report/payment-summary-report");
  }

  goToMonthlyDetailsReport(): void {
    window.open("report/monthly-details-report");
  }

  goToMonthlySummaryReport(): void {
    window.open("report/monthly-summary-report");
  }

  goToUnitList(): void {
    window.open("report/unit-list");
  }

  goToGroupList(): void {
    window.open("report/group-list");
  }

  goToMemberDetails(): void {
    window.open("report/member-details");
  }

  goToFederationWiseMemberCount(): void {
    window.open("report/federation-wise-member-count");
  }

  goToUnitWiseMemberCount(): void {
    window.open("report/unit-wise-member-count");
  }

  goToGroupWiseMemberCount(): void {
    window.open("report/group-wise-member-count");
  }

  goToFederationWiseMonthlyReport(): void {
    window.open("report/federation-wise-monthly-report-details");
  }

  goToUnitWiseMonthlyReport(): void {
    window.open("report/unit-wise-monthly-report-details");
  }

  goToGroupWiseMonthlyReport(): void {
    window.open("report/group-wise-monthly-report-details");
  }

  goToActivityLogReport(): void {
    window.open("report/activity-log");
  }

  goToAnniversaryBirthdayLogReport(): void {
    window.open("report/anniversary-birthday-log");
  }

  goToLoginLogoutLogReport(): void {
    window.open("report/login-logout-log");
  }

  goToGroupWiseDetailsReport(): void {
    window.open("report/group-wise-details");
  }

  goToDetailedGroupStatusReport(): void {
    window.open("report/detailed-group-status-report");
  }
}