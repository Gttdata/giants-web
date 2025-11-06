import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconsProviderModule } from '../icons-provider.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { NZ_I18N, en_US, NzDrawerModule, NzDropDownModule, NzEmptyModule, NzGridModule, NzInputModule, NzRadioModule, NzSpinModule, NzSwitchModule, NzTagModule, NzTimePickerModule, NzPopconfirmModule, NzToolTipModule } from 'ng-zorro-antd';
import { PostcountwisedataComponent } from "../pages/member-report/postcountwisedata/postcountwisedata.component";
import { CircularcountwisedataComponent } from "../pages/member-report/circularcountwisedata/circularcountwisedata.component";
import { ScheduleReportCreateComponent } from "../pages/Report/schedule-report/schedule-report-create/schedule-report-create.component";
import { PaymentReportComponent } from "../pages/Report/payment-report/payment-report.component";
import { PaymentDetailCountComponent } from "../pages/Report/payment-detail-count/payment-detail-count.component";
import { EventreportComponent } from "../pages/Report/eventreport/eventreport.component";
import { FederationReportComponent } from "../pages/federation-report/federation-report.component";
import { UnitReportComponent } from "../pages/unit-report/unit-report.component";
import { GroupReportComponent } from "../pages/group-report/group-report.component";
import { MemberReportComponent } from "../pages/member-report/member-report.component";
import { ScheduleReportComponent } from '../pages/Report/schedule-report/schedule-report.component'
import { RformComponent } from "../pages/Report/schedule-report/rform/rform.component";
import { RformtableComponent } from "../pages/Report/schedule-report/rformtable/rformtable.component";
import { CircularreportComponent } from "../pages/Report/circularreport/circularreport.component";
import { MeetingReportComponent } from "../pages/Report/meeting-report/meeting-report.component";
import { CommentReportComponent } from "../pages/Report/comment-report/comment-report.component";
import { PostReportComponent } from "../pages/Report/post-report/post-report.component";
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgxPrintModule } from 'ngx-print';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { WorldcouncileoverviewComponent } from '../pages/worldcouncileoverview/worldcouncileoverview.component';
import { ProjectTableDataComponent } from '../pages/Report/ProjectReport/project-table-data/project-table-data.component';
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
import { ViewUnitBodComponent } from "../pages/GiantReports/view-unit-bod/view-unit-bod.component";
import { ViewGroupBodComponent } from "../pages/GiantReports/view-group-bod/view-group-bod.component";
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { GroupWiseMonthlyReportDetailsComponent } from "../pages/Report/group-wise-monthly-report-details/group-wise-monthly-report-details.component";
import { FederationWiseMonthlyReportDetailsComponent } from "../pages/Report/federation-wise-monthly-report-details/federation-wise-monthly-report-details.component";
import { UnitWiseMonthlyReportDetailsComponent } from "../pages/Report/unit-wise-monthly-report-details/unit-wise-monthly-report-details.component";
import { ActivitylogreportComponent } from "../pages/Report/activitylogreport/activitylogreport.component";
import { AniversaryandbirthdaylogreportComponent } from "../pages/Report/aniversaryandbirthdaylogreport/aniversaryandbirthdaylogreport.component";
import { GroupWiseDetailsComponent } from "../pages/Report/group-wise-details/group-wise-details.component";
import { LoginLogoutLogsComponent } from "../pages/Report/login-logout-logs/login-logout-logs.component";
import { DetailedGroupStatusReportComponent } from "../pages/Report/detailed-group-status-report/detailed-group-status-report.component";

@NgModule({
  declarations: [ReportsComponent,
    FederationReportComponent,
    MemberReportComponent,
    UnitReportComponent,
    GroupReportComponent,
    ScheduleReportComponent,
    CircularreportComponent,
    MeetingReportComponent,
    CommentReportComponent,
    PostReportComponent,
    PostcountwisedataComponent,
    CircularcountwisedataComponent,
    ScheduleReportCreateComponent,
    PaymentReportComponent,
    PaymentDetailCountComponent,
    RformComponent,
    RformtableComponent,
    EventreportComponent,
    WorldcouncileoverviewComponent,
    ProjectTableDataComponent,
    PaymentDetailsReportComponent,
    PaymentSummaryReportComponent,
    MonthlyDetailReportComponent,
    MonthlySummaryReportComponent,
    UnitdobComponent,
    GroupbodComponent,
    MemberWiseSummaryComponent,
    FederationWiseMemberCountComponent,
    UnitWiseMemberCountComponent,
    GroupWiseMemberCountComponent,
    ViewUnitBodComponent,
    ViewGroupBodComponent,
    GroupWiseMonthlyReportDetailsComponent,
    FederationWiseMonthlyReportDetailsComponent,
    UnitWiseMonthlyReportDetailsComponent,
    ActivitylogreportComponent,
    AniversaryandbirthdaylogreportComponent,
    GroupWiseDetailsComponent,
    LoginLogoutLogsComponent,
    DetailedGroupStatusReportComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    NzSelectModule,
    IconsProviderModule,
    ReportsRoutingModule,
    NzTableModule,
    NzTreeSelectModule,
    NzModalModule,
    NzFormModule,
    NzDatePickerModule,
    NzButtonModule,
    NgxPrintModule,
    NzIconModule,
    NzDrawerModule,
    NzInputModule,
    NzSpinModule,
    NzTagModule,
    NzEmptyModule,
    NzDropDownModule,
    NzTimePickerModule,
    NzGridModule,
    NzRadioModule,
    NzSwitchModule,
    NzTreeSelectModule,
    NzPopconfirmModule,
    NzToolTipModule,
    NzPopoverModule
  ],

  providers: [{ provide: NZ_I18N, useValue: en_US },]
})

export class ReportsModule { }
