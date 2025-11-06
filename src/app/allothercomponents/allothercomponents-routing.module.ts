import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FederationMasterComponent } from '../pages/FederationMaster/federation-master/federation-master.component';
import { MemberMasterComponent } from '../pages/MemberMaster/member-master/member-master.component';
import { MemberUploadComponent } from '../pages/member-upload/member-upload.component';
import { ListcircularComponent } from '../pages/circular/listcircular/listcircular.component';
import { GroupProjectActivityTilesComponent } from '../pages/GroupProjectActivity/group-project-activity-tiles/group-project-activity-tiles.component';
import { PostlistComponent } from '../pages/postlist/postlist.component';
import { GroupmeetingsattendanceComponent } from '../pages/Meeting/groupmeetingsattendance/groupmeetingsattendance.component';
import { CommunityComponent } from '../pages/community/community.component';
import { UnitMasterTilesComponent } from '../pages/UnitMaster/unit-master-tiles/unit-master-tiles.component';
import { GroupMasterTilesComponent } from '../pages/GroupMaster/group-master-tiles/group-master-tiles.component';
import { ProjectslistComponent } from '../pages/GroupProjectMaster/projectslist/projectslist.component';
import { PaymentreceiptComponent } from '../pages/Payments/paymentreceipt/paymentreceipt.component';
import { AdminRoleAssignComponent } from '../pages/admin-role-assign/admin-role-assign.component';
import { ApproveGroupComponent } from '../pages/approve-group/approve-group.component';
import { AdminFeeTypeComponent } from '../pages/AdminFeeType/admin-fee-type/admin-fee-type.component';
import { GroupFeeTypeComponent } from '../pages/GroupFeeType/group-fee-type/group-fee-type.component';
import { WorldcouncileoverviewComponent } from '../pages/worldcouncileoverview/worldcouncileoverview.component';
import { MonthlyReportSubmissionComponent } from '../pages/MonthlyReport/monthly-report-submission/monthly-report-submission.component';
import { MonthlyReportViewComponent } from '../pages/MonthlyReport/monthly-report-view/monthly-report-view.component';
import { PostDetailsComponent } from '../pages/post-details/post-details.component';
import { ReportsListComponent } from '../pages/reports-list/reports-list.component';
import { PaymentApprovalByAdminComponent } from '../pages/Payments/payment-approval-by-admin/payment-approval-by-admin.component';
import { SystemFeesMasterComponent } from '../pages/SystemFees/system-fees-master/system-fees-master.component';
import { CircularDetailsComponent } from '../pages/circular/circular-details/circular-details.component';
import { EventDetailsComponent } from '../pages/GroupProjectActivity/event-details/event-details.component';
import { AwardBiddingComponent } from '../pages/award-bidding/award-bidding.component';
import { AwardviewComponent } from '../pages/awardmaster/awardview/awardview.component';
import { CertificateviewComponent } from '../pages/certificatemaster/certificateview/certificateview.component';
import { AwardcertificatemappingComponent } from '../pages/award-certificate-mapping/awardcertificatemapping/awardcertificatemapping.component';
import { ConventionmembermappingComponent } from '../pages/convention-member--mapping/conventionmembermapping/conventionmembermapping.component';
import { AllothercomponentsComponent } from './allothercomponents.component';

const routes: Routes = [
  {
    path: '', component: AllothercomponentsComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: WorldcouncileoverviewComponent },
      { path: 'posts', component: PostlistComponent },
      { path: 'meetings', component: GroupmeetingsattendanceComponent },
      { path: 'events', component: GroupProjectActivityTilesComponent },
      { path: 'circular', component: ListcircularComponent },
      { path: 'project', component: ProjectslistComponent },
      { path: 'community', component: CommunityComponent },
      { path: 'federations', component: FederationMasterComponent },
      { path: 'units', component: UnitMasterTilesComponent },
      { path: 'units/:federation', component: UnitMasterTilesComponent },
      { path: 'groups', component: GroupMasterTilesComponent },
      { path: 'groups/:federation', component: GroupMasterTilesComponent },
      { path: 'groups/:unit', component: GroupMasterTilesComponent },
      { path: 'members', component: MemberMasterComponent },
      { path: 'members/:group', component: MemberMasterComponent },
      { path: 'members/:unit', component: MemberMasterComponent },
      { path: 'members/:federation', component: MemberMasterComponent },
      { path: 'member-upload', component: MemberUploadComponent },
      { path: 'payment-approval', component: PaymentApprovalByAdminComponent },
      { path: 'allpaymentreceipts', component: PaymentreceiptComponent },
      { path: 'allpaymentreceipts/:group', component: PaymentreceiptComponent },
      { path: 'award-bidding', component: AwardBiddingComponent },
      { path: 'assign-admin-role', component: AdminRoleAssignComponent },
      { path: 'approve-group', component: ApproveGroupComponent },
      { path: 'fee-structure', component: AdminFeeTypeComponent },
      { path: 'group-fee-structure', component: GroupFeeTypeComponent },
      { path: 'system-fee-structure', component: SystemFeesMasterComponent },
      { path: 'monthly-report-submission', component: MonthlyReportSubmissionComponent },
      { path: 'giants-group-report', component: MonthlyReportViewComponent },
      { path: 'post-details', component: PostDetailsComponent },
      { path: 'post-details/:title', component: PostDetailsComponent },
      { path: 'event-details', component: EventDetailsComponent },
      { path: 'event-details/:title', component: EventDetailsComponent },
      { path: 'circular-details', component: CircularDetailsComponent },
      { path: 'circular-details/:title', component: CircularDetailsComponent },
      { path: 'reports', component: ReportsListComponent },
      { path: 'award-master', component: AwardviewComponent },
      { path: 'certificate-master', component: CertificateviewComponent },
      { path: 'award-certificate-mapping', component: AwardcertificatemappingComponent },
      { path: 'convention-member-mapping', component: ConventionmembermappingComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AllothercomponentsRoutingModule { }
