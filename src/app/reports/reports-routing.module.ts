import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ReportsComponent } from "./reports.component";
import { FederationReportComponent } from "../pages/federation-report/federation-report.component";
import { UnitReportComponent } from "../pages/unit-report/unit-report.component";
import { GroupReportComponent } from "../pages/group-report/group-report.component";
import { MemberReportComponent } from "../pages/member-report/member-report.component";
import { CircularreportComponent } from "../pages/Report/circularreport/circularreport.component";
import { CommentReportComponent } from "../pages/Report/comment-report/comment-report.component";
import { EventreportComponent } from "../pages/Report/eventreport/eventreport.component";
import { MeetingReportComponent } from "../pages/Report/meeting-report/meeting-report.component";
import { PaymentReportComponent } from "../pages/Report/payment-report/payment-report.component";
import { PostReportComponent } from "../pages/Report/post-report/post-report.component";
import { ProjectTableDataComponent } from "../pages/Report/ProjectReport/project-table-data/project-table-data.component";
import { PaymentDetailsReportComponent } from "../pages/Report/payment-details-report/payment-details-report.component";
import { PaymentSummaryReportComponent } from "../pages/Report/payment-summary-report/payment-summary-report.component";
import { MonthlyDetailReportComponent } from "../pages/Report/monthly-detail-report/monthly-detail-report.component";
import { MonthlySummaryReportComponent } from "../pages/Report/monthly-summary-report/monthly-summary-report.component";
import { UnitdobComponent } from "../pages/GiantReports/unitdob/unitdob.component";
import { GroupbodComponent } from "../pages/GiantReports/groupbod/groupbod.component";
import { MemberWiseSummaryComponent } from "../pages/GiantReports/member-wise-summary/member-wise-summary.component";
import { FederationWiseMemberCountComponent } from "../pages/GiantReports/federation-wise-member-count/federation-wise-member-count.component";
import { UnitWiseMemberCountComponent } from "../pages/GiantReports/unit-wise-member-count/unit-wise-member-count.component";
import { GroupWiseMemberCountComponent } from "../pages/GiantReports/group-wise-member-count/group-wise-member-count.component";
import { GroupWiseMonthlyReportDetailsComponent } from "../pages/Report/group-wise-monthly-report-details/group-wise-monthly-report-details.component";
import { FederationWiseMonthlyReportDetailsComponent } from "../pages/Report/federation-wise-monthly-report-details/federation-wise-monthly-report-details.component";
import { UnitWiseMonthlyReportDetailsComponent } from "../pages/Report/unit-wise-monthly-report-details/unit-wise-monthly-report-details.component";
import { ActivitylogreportComponent } from "../pages/Report/activitylogreport/activitylogreport.component";
import { AniversaryandbirthdaylogreportComponent } from "../pages/Report/aniversaryandbirthdaylogreport/aniversaryandbirthdaylogreport.component";
import { GroupWiseDetailsComponent } from "../pages/Report/group-wise-details/group-wise-details.component";
import { LoginLogoutLogsComponent } from "../pages/Report/login-logout-logs/login-logout-logs.component";
import { DetailedGroupStatusReportComponent } from "../pages/Report/detailed-group-status-report/detailed-group-status-report.component";

const routes: Routes = [
  {
    path: "", component: ReportsComponent, children: [
      { path: "federation-report", component: FederationReportComponent },
      { path: "unit-report", component: UnitReportComponent },
      { path: "group-report", component: GroupReportComponent },
      { path: "member-report", component: MemberReportComponent },
      { path: "meeting-report", component: MeetingReportComponent },
      { path: "post-report", component: PostReportComponent },
      { path: "comment-report", component: CommentReportComponent },
      { path: "payment-report", component: PaymentReportComponent },
      { path: "project-report", component: ProjectTableDataComponent },
      { path: "event-report", component: EventreportComponent },
      { path: "circular-report", component: CircularreportComponent },
      { path: "payment-details-report", component: PaymentDetailsReportComponent },
      { path: "payment-summary-report", component: PaymentSummaryReportComponent },
      { path: "monthly-details-report", component: MonthlyDetailReportComponent },
      { path: "monthly-summary-report", component: MonthlySummaryReportComponent },
      { path: 'unit-list', component: UnitdobComponent },
      { path: 'group-list', component: GroupbodComponent },
      { path: 'member-details', component: MemberWiseSummaryComponent },
      { path: 'federation-wise-member-count', component: FederationWiseMemberCountComponent },
      { path: 'unit-wise-member-count', component: UnitWiseMemberCountComponent },
      { path: 'group-wise-member-count', component: GroupWiseMemberCountComponent },
      { path: 'federation-wise-monthly-report-details', component: FederationWiseMonthlyReportDetailsComponent },
      { path: 'unit-wise-monthly-report-details', component: UnitWiseMonthlyReportDetailsComponent },
      { path: 'group-wise-monthly-report-details', component: GroupWiseMonthlyReportDetailsComponent },
      { path: 'activity-log', component: ActivitylogreportComponent },
      { path: 'anniversary-birthday-log', component: AniversaryandbirthdaylogreportComponent },
      { path: 'login-logout-log', component: LoginLogoutLogsComponent },
      { path: 'group-wise-details', component: GroupWiseDetailsComponent },
      { path: 'detailed-group-status-report', component: DetailedGroupStatusReportComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ReportsRoutingModule { }