import { NgModule } from "@angular/core";
import { AsyncPipe, CommonModule, DatePipe } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { ExportDirective } from "../directives/export.directive";
import { AppRoutingModule } from "../app-routing.module";
import { AppComponent } from "../app.component";
import { IconsProviderModule } from "../icons-provider.module";
import {
  NZ_I18N, en_US, NzAutocompleteModule, NzAvatarModule, NzBadgeModule, NzButtonModule, NzCardModule, NzCheckboxModule, NzCommentModule, NzDatePickerModule, NzDividerModule, NzDrawerModule, NzDropDownModule, NzEmptyModule, NzFormModule, NzGridModule, NzIconModule, NzInputModule, NzInputNumberModule, NzLayoutModule, NzListModule, NzMentionModule, NzMenuModule, NzMessageModule, NzModalModule, NzNotificationModule, NzRadioModule, NzSelectModule, NzSpinModule, NzStepsModule, NzTableModule, NzTagModule, NzTimePickerModule, NzToolTipModule, NzTreeSelectModule, NzSwitchModule, NzPaginationModule, NzPopconfirmModule
} from "ng-zorro-antd";
import { FormsModule } from "@angular/forms";
import { LoginComponent } from "../login/login.component";
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { AngularFireModule } from "@angular/fire";
import { environment } from "src/environments/environment";
import { CookieService } from "ngx-cookie-service";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { ViewNotificationDrawerComponent } from "../pages/NotificationModule/view-notification-drawer/view-notification-drawer.component";
import { AddNewNotificationDrawerComponent } from "../pages/NotificationModule/add-new-notification-drawer/add-new-notification-drawer.component";
import { SendEmailDrawerComponent } from "../pages/NotificationModule/send-email-drawer/send-email-drawer.component";
import { NgxPrintModule } from "ngx-print";
import { FederationMasterComponent } from "../pages/FederationMaster/federation-master/federation-master.component";
import { FederationDrawerComponent } from "../pages/FederationMaster/federation-drawer/federation-drawer.component";
import { AssignFederationMembersComponent } from "../pages/FederationMaster/assign-federation-members/assign-federation-members.component";
import { UnitDrawerComponent } from "../pages/UnitMaster/unit-drawer/unit-drawer.component";
import { GroupDrawerComponent } from "../pages/GroupMaster/group-drawer/group-drawer.component";
import { InchargeAreaDrawerComponent } from "../pages/InchargeAreaMaster/incharge-area-drawer/incharge-area-drawer.component";
import { ProjectDrawerComponent } from "../pages/ProjectMaster/project-drawer/project-drawer.component";
import { MemberMasterComponent } from "../pages/MemberMaster/member-master/member-master.component";
import { MemberDrawerComponent } from "../pages/MemberMaster/member-drawer/member-drawer.component";
import { AssignUnitMemberComponent } from "../pages/UnitMaster/assign-unit-member/assign-unit-member.component";
import { AssignGroupMemberComponent } from "../pages/GroupMaster/assign-group-member/assign-group-member.component";
import { ViewGroupMeetingAttendiesComponent } from "../pages/GiantReports/view-group-meeting-attendies/view-group-meeting-attendies.component";
import { GroupProjectActivityDrawerComponent } from "../pages/GroupProjectActivity/group-project-activity-drawer/group-project-activity-drawer.component";
import { MemberPaymentDrawerComponent } from "../pages/MemberMaster/member-payment-drawer/member-payment-drawer.component";
import { ManageFederationMembersComponent } from "../pages/FederationMaster/manage-federation-members/manage-federation-members.component";
import { ManageUnitMembersComponent } from "../pages/UnitMaster/manage-unit-members/manage-unit-members.component";
import { ManageGroupMembersComponent } from "../pages/GroupMaster/manage-group-members/manage-group-members.component";
import { MemberUploadComponent } from "../pages/member-upload/member-upload.component";
import { ChartsModule } from "ng2-charts";
import { GiantsreportComponent } from "../pages/GiantReports/giantsreport/giantsreport.component";
import { AddcirculartypeComponent } from "../pages/circulartype/addcirculartype/addcirculartype.component";
import { ListcircularComponent } from "../pages/circular/listcircular/listcircular.component";
import { AddcircularComponent } from "../pages/circular/addcircular/addcircular.component";
import { ScrolltrackerDirective } from "../scrolltracker.directive";
import { GroupProjectActivityTilesComponent } from "../pages/GroupProjectActivity/group-project-activity-tiles/group-project-activity-tiles.component";
import { PostlistComponent } from "../pages/postlist/postlist.component";
import { AddpostComponent } from "../pages/postlist/addpost/addpost.component";
import { AddgroupmeetingsattendanceComponent } from "../pages/Meeting/addgroupmeetingsattendance/addgroupmeetingsattendance.component";
import { GroupmeetsattendiesmapComponent } from "../pages/Meeting/groupmeetsattendiesmap/groupmeetsattendiesmap.component";
import { GroupmeetingsattendanceComponent } from "../pages/Meeting/groupmeetingsattendance/groupmeetingsattendance.component";
import { GroupmeetingsendComponent } from "../pages/Meeting/groupmeetingsend/groupmeetingsend.component";
import { CommunityComponent } from "../pages/community/community.component";
import { UnitMasterTilesComponent } from "../pages/UnitMaster/unit-master-tiles/unit-master-tiles.component";
import { GroupMasterTilesComponent } from "../pages/GroupMaster/group-master-tiles/group-master-tiles.component";
import { UpdateMemberInfoComponent } from "../pages/MemberMaster/update-member-info/update-member-info.component";
import { CommunityPageComponent } from "../pages/community-page/community-page.component";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { AddcommentdrawerComponent } from "../pages/postlist/addcomment/addcommentdrawer/addcommentdrawer.component";
import { AddCommentComponent } from "../pages/GroupProjectActivity/add-comment/add-comment.component";
import { ProjectslistComponent } from "../pages/GroupProjectMaster/projectslist/projectslist.component";
import { AddProjectDetailsDrawerComponent } from "../pages/GroupProjectMaster/add-project-details-drawer/add-project-details-drawer.component";
import { PaymentreceiptComponent } from "../pages/Payments/paymentreceipt/paymentreceipt.component";
import { PaymentdetailsComponent } from "../pages/Payments/paymentdetails/paymentdetails.component";
import { AddpaymentComponent } from "../pages/Payments/addpayment/addpayment.component";
import { MemberspaymentdetailsComponent } from "../pages/Payments/memberspaymentdetails/memberspaymentdetails.component";
import { VicePresidentComponent } from "../pages/vice-president/vice-president.component";
import { PastPresidentComponent } from "../pages/past-president/past-president.component";
import { ProjectTitleComponent } from "../pages/past-president/project-title/project-title.component";
import { ImmediatePastPresidentComponent } from "../pages/immediate-past-president/immediate-past-president.component";
import { ImmediatePastTitleDrawerComponent } from "../pages/immediate-past-president/immediate-past-title-drawer/immediate-past-title-drawer.component";
import { AdministrationComponent } from "../pages/administration/administration.component";
import { GroupbiddinglistComponent } from "../pages/OutstandingGroup/groupbiddinglist/groupbiddinglist.component";
import { AddgroupbiddingComponent } from "../pages/OutstandingGroup/addgroupbidding/addgroupbidding.component";
import { AddprojectundertakenComponent } from "../pages/OutstandingGroup/addprojectundertaken/addprojectundertaken.component";
import { AddpaiddueComponent } from "../pages/OutstandingGroup/addpaiddue/addpaiddue.component";
import { AddmediacoveringsComponent } from "../pages/OutstandingGroup/addmediacoverings/addmediacoverings.component";
import { AddcontinuingprojectsComponent } from "../pages/OutstandingGroup/addcontinuingprojects/addcontinuingprojects.component";
import { AddgroupsponseredComponent } from "../pages/OutstandingGroup/addgroupsponsered/addgroupsponsered.component";
import { GiantWeekCelebrationAwardComponent } from "../pages/giant-week-celebration-award/giant-week-celebration-award.component";
import { DateAndScheduleDrawerComponent } from "../pages/giant-week-celebration-award/date-and-schedule-drawer/date-and-schedule-drawer.component";
import { ProjectDuringServiceDrawerComponent } from "../pages/giant-week-celebration-award/project-during-service-drawer/project-during-service-drawer.component";
import { ProjectExpensesDrawerComponent } from "../pages/giant-week-celebration-award/project-expenses-drawer/project-expenses-drawer.component";
import { DescriptionOfWeekDrawerComponent } from "../pages/giant-week-celebration-award/description-of-week-drawer/description-of-week-drawer.component";
import { PublicityWithPressDrawerComponent } from "../pages/giant-week-celebration-award/publicity-with-press-drawer/publicity-with-press-drawer.component";
import { ActivitesComponent } from "../pages/activites/activites.component";
import { ActivityProjectDetailsComponent } from "../pages/activites/activity-project-details/activity-project-details.component";
import { AddawardComponent } from "../pages/DirectorFinance/addaward/addaward.component";
import { SponsorshipComponent } from "../pages/DirectorFinance/sponsorship/sponsorship.component";
import { SendForApprovalComponent } from "../pages/send-for-approval/send-for-approval.component";
import { AdminRoleAssignComponent } from "../pages/admin-role-assign/admin-role-assign.component";
import { ApproveGroupComponent } from "../pages/approve-group/approve-group.component";
import { LadyMemberAwardComponent } from "../pages/lady-member-award/lady-member-award.component";
import { NewLadyMemberComponent } from "../pages/lady-member-award/new-lady-member/new-lady-member.component";
import { DocAndDetailsDraweComponent } from "../pages/lady-member-award/doc-and-details-drawe/doc-and-details-drawe.component";
import { MemberAwardComponent } from "../pages/member-award/member-award.component";
import { NewMemberDrawerComponent } from "../pages/member-award/new-member-drawer/new-member-drawer.component";
import { DocAndDetailDrawerComponent } from "../pages/member-award/doc-and-detail-drawer/doc-and-detail-drawer.component";
import { ThePresidentComponent } from "../pages/the-president/the-president.component";
import { ThePresidentDetailsComponent } from "../pages/the-president/the-president-details/the-president-details.component";
import { AddbestserviceprojectComponent } from "../pages/BestServiceProject/addbestserviceproject/addbestserviceproject.component";
import { AddserviceprojectsponseredComponent } from "../pages/BestServiceProject/addserviceprojectsponsered/addserviceprojectsponsered.component";
import { AddunitconferenceawardComponent } from "../pages/BestServiceProject/addunitconferenceaward/addunitconferenceaward.component";
import { AddgaintsbannerphotosComponent } from "../pages/OutstandingMonumental/addgaintsbannerphotos/addgaintsbannerphotos.component";
import { AddmonumentalawardComponent } from "../pages/OutstandingMonumental/addmonumentalaward/addmonumentalaward.component";
import { AddmonumentalawardSponsorComponent } from "../pages/OutstandingMonumental/addmonumentalaward-sponsor/addmonumentalaward-sponsor.component";
import { AddpressclippingComponent } from "../pages/OutstandingMonumental/addpressclipping/addpressclipping.component";
import { AdminFeeTypeComponent } from "../pages/AdminFeeType/admin-fee-type/admin-fee-type.component";
import { AdminFeeTypeDrawerComponent } from "../pages/AdminFeeType/admin-fee-type-drawer/admin-fee-type-drawer.component";
import { GroupFeeTypeComponent } from "../pages/GroupFeeType/group-fee-type/group-fee-type.component";
import { GroupFeeTypeDrawerComponent } from "../pages/GroupFeeType/group-fee-type-drawer/group-fee-type-drawer.component";
import { ViewGroupFeeStructureComponent } from "../pages/GroupFeeType/view-group-fee-structure/view-group-fee-structure.component";
import { AddYoungGiantsawardComponent } from "../pages/OutstandingYoungGiantsDivision/add-young-giantsaward/add-young-giantsaward.component";
import { MonthlyReportSubmissionComponent } from "../pages/MonthlyReport/monthly-report-submission/monthly-report-submission.component";
import { MonthlyReportViewComponent } from "../pages/MonthlyReport/monthly-report-view/monthly-report-view.component";
import { ViewattendanciesComponent } from "../pages/Meeting/viewattendancies/viewattendancies.component";
import { GroupBodSendForApprovalComponent } from "../pages/GroupMaster/group-bod-send-for-approval/group-bod-send-for-approval.component";
import { ViewMemberPaymentDetailsComponent } from "../pages/MemberMaster/view-member-payment-details/view-member-payment-details.component";
import { AllothercomponentsRoutingModule } from "./allothercomponents-routing.module";
import { AllothercomponentsComponent } from "./allothercomponents.component";
import { EmploginComponent } from "../emplogin/emplogin.component";
import { TrainerAccessorLoginComponent } from "../trainer-accessor-login/trainer-accessor-login.component";
import { ChangePasswordDrawerComponent } from "../pages/CommonModule/change-password-drawer/change-password-drawer.component";
import { PostDetailsComponent } from "../pages/post-details/post-details.component";
import { AddletterheadComponent } from "../pages/LetterHeadMaster/addletterhead/addletterhead.component";
import { LetterheadlistComponent } from "../pages/LetterHeadMaster/letterheadlist/letterheadlist.component";
import { AddcirculartypedrawerComponent } from "../pages/circular/addcirculartypedrawer/addcirculartypedrawer.component";
import { MemberReadableProfileComponent } from "../pages/postlist/member-readable-profile/member-readable-profile.component";
import { ReportsListComponent } from '../pages/reports-list/reports-list.component';
import { DrawermonthlyreportsubmissionComponent } from '../pages/MonthlyReport/drawermonthlyreportsubmission/drawermonthlyreportsubmission.component';
import { PaymentApprovalByAdminComponent } from '../pages/Payments/payment-approval-by-admin/payment-approval-by-admin.component'
import { UnitBodSendForApprovalComponent } from "../pages/UnitMaster/unit-bod-send-for-approval/unit-bod-send-for-approval.component";
import { FederationBodSendForApprovalComponent } from "../pages/FederationMaster/federation-bod-send-for-approval/federation-bod-send-for-approval.component";
import { SystemFeesMasterComponent } from "../pages/SystemFees/system-fees-master/system-fees-master.component";
import { SystemFeesDrawerComponent } from "../pages/SystemFees/system-fees-drawer/system-fees-drawer.component";
import { CircularemailsenderlistComponent } from '../pages/circular/circularemailsenderlist/circularemailsenderlist.component';
import { CircularDetailsComponent } from "../pages/circular/circular-details/circular-details.component";
import { VideoManualDrawerComponent } from "../pages/VideoManual/video-manual-drawer/video-manual-drawer.component";
import { EventDetailsComponent } from '../pages/GroupProjectActivity/event-details/event-details.component';
import { SearchPipePipe } from "../Pipe/search-pipe.pipe";
import { PostLikeDrawerComponent } from "../pages/postlist/post-like-drawer/post-like-drawer.component";
import { EventLikeDrawerComponent } from "../pages/GroupProjectActivity/event-like-drawer/event-like-drawer.component";
import { DrawermapinvitiesComponent } from '../pages/Meeting/drawermapinvities/drawermapinvities.component';
import { MouseWheelDirective } from 'src/app/mousewheel.directive';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { AwardBiddingComponent } from "../pages/award-bidding/award-bidding.component";
import { SendMonthlyReportComponent } from "../pages/MonthlyReport/send-monthly-report/send-monthly-report.component";
import { ProgrammeTypeDrawerComponent } from "../pages/programmeTypeMaster/programme-type-drawer/programme-type-drawer.component";
import { AwardviewComponent } from '../pages/awardmaster/awardview/awardview.component';
import { DrawerawardComponent } from "../pages/awardmaster/draweraward/draweraward.component";
import { CertificateviewComponent } from '../pages/certificatemaster/certificateview/certificateview.component';
import { DrawercertificateComponent } from "../pages/certificatemaster/drawercertificate/drawercertificate.component";
import { AwardcertificatemappingComponent } from '../pages/award-certificate-mapping/awardcertificatemapping/awardcertificatemapping.component';
import { ConventionmembermappingComponent } from '../pages/convention-member--mapping/conventionmembermapping/conventionmembermapping.component';
import { GroupProjectActivityMapInviteesDrawerComponent } from "../pages/GroupProjectActivity/group-project-activity-map-invitees-drawer/group-project-activity-map-invitees-drawer.component";
import { GroupProjectActivityAttendanceDrawerComponent } from "../pages/GroupProjectActivity/group-project-activity-attendance-drawer/group-project-activity-attendance-drawer.component";
import { ViewFileImageDrawerComponent } from '../pages/view-file-image-drawer/view-file-image-drawer.component'

@NgModule({
  declarations: [
    AllothercomponentsComponent,
    AppComponent,
    EmploginComponent,
    LoginComponent,
    TrainerAccessorLoginComponent,
    ViewNotificationDrawerComponent,
    AddNewNotificationDrawerComponent,
    SendEmailDrawerComponent,
    ExportDirective,
    FederationMasterComponent,
    FederationDrawerComponent,
    UnitDrawerComponent,
    GroupDrawerComponent,
    InchargeAreaDrawerComponent,
    ProjectDrawerComponent,
    AssignFederationMembersComponent,
    MemberMasterComponent,
    MemberDrawerComponent,
    AssignUnitMemberComponent,
    AssignGroupMemberComponent,
    ViewGroupMeetingAttendiesComponent,
    GroupProjectActivityDrawerComponent,
    MemberPaymentDrawerComponent,
    ManageFederationMembersComponent,
    ManageUnitMembersComponent,
    ManageGroupMembersComponent,
    MemberUploadComponent,
    GiantsreportComponent,
    AddcirculartypeComponent,
    ListcircularComponent,
    AddcircularComponent,
    ScrolltrackerDirective,
    GroupProjectActivityTilesComponent,
    PostlistComponent,
    AddpostComponent,
    AddgroupmeetingsattendanceComponent,
    GroupmeetsattendiesmapComponent,
    GroupmeetingsattendanceComponent,
    GroupmeetingsendComponent,
    CommunityComponent,
    UnitMasterTilesComponent,
    GroupMasterTilesComponent,
    UpdateMemberInfoComponent,
    CommunityPageComponent,
    AddcommentdrawerComponent,
    AddCommentComponent,
    ProjectslistComponent,
    AddProjectDetailsDrawerComponent,
    PaymentreceiptComponent,
    PaymentdetailsComponent,
    AddpaymentComponent,
    MemberspaymentdetailsComponent,
    VicePresidentComponent,
    PastPresidentComponent,
    ProjectTitleComponent,
    ImmediatePastPresidentComponent,
    ImmediatePastTitleDrawerComponent,
    AdministrationComponent,
    GroupbiddinglistComponent,
    AddgroupbiddingComponent,
    AddprojectundertakenComponent,
    AddpaiddueComponent,
    AddmediacoveringsComponent,
    AddcontinuingprojectsComponent,
    AddgroupsponseredComponent,
    GiantWeekCelebrationAwardComponent,
    DateAndScheduleDrawerComponent,
    ProjectDuringServiceDrawerComponent,
    ProjectExpensesDrawerComponent,
    DescriptionOfWeekDrawerComponent,
    PublicityWithPressDrawerComponent,
    ActivitesComponent,
    ActivityProjectDetailsComponent,
    AddawardComponent,
    SponsorshipComponent,
    SendForApprovalComponent,
    AdminRoleAssignComponent,
    ApproveGroupComponent,
    LadyMemberAwardComponent,
    NewLadyMemberComponent,
    DocAndDetailsDraweComponent,
    MemberAwardComponent,
    NewMemberDrawerComponent,
    DocAndDetailDrawerComponent,
    ThePresidentComponent,
    ThePresidentDetailsComponent,
    AddbestserviceprojectComponent,
    AddserviceprojectsponseredComponent,
    AddunitconferenceawardComponent,
    AddgaintsbannerphotosComponent,
    AddmonumentalawardComponent,
    AddmonumentalawardSponsorComponent,
    AddpressclippingComponent,
    AdminFeeTypeComponent,
    AdminFeeTypeDrawerComponent,
    GroupFeeTypeComponent,
    GroupFeeTypeDrawerComponent,
    ViewGroupFeeStructureComponent,
    AddYoungGiantsawardComponent,
    MonthlyReportSubmissionComponent,
    MonthlyReportViewComponent,
    ViewattendanciesComponent,
    GroupBodSendForApprovalComponent,
    ViewMemberPaymentDetailsComponent,
    ChangePasswordDrawerComponent,
    PostDetailsComponent,
    AddletterheadComponent,
    LetterheadlistComponent,
    AddcirculartypedrawerComponent,
    MemberReadableProfileComponent,
    ReportsListComponent,
    DrawermonthlyreportsubmissionComponent,
    PaymentApprovalByAdminComponent,
    UnitBodSendForApprovalComponent,
    FederationBodSendForApprovalComponent,
    SystemFeesMasterComponent,
    SystemFeesDrawerComponent,
    CircularemailsenderlistComponent,
    CircularDetailsComponent,
    VideoManualDrawerComponent,
    EventDetailsComponent,
    SearchPipePipe,
    PostLikeDrawerComponent,
    EventLikeDrawerComponent,
    DrawermapinvitiesComponent,
    MouseWheelDirective,
    AwardBiddingComponent,
    SendMonthlyReportComponent,
    ProgrammeTypeDrawerComponent,
    AwardviewComponent,
    CertificateviewComponent,
    DrawerawardComponent,
    DrawercertificateComponent,
    AwardcertificatemappingComponent,
    ConventionmembermappingComponent,
    GroupProjectActivityMapInviteesDrawerComponent,
    GroupProjectActivityAttendanceDrawerComponent,
    ViewFileImageDrawerComponent
  ],

  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    NzSwitchModule,
    NgxPrintModule,
    AngularFireModule.initializeApp(environment.firebase),
    ChartsModule,
    AngularEditorModule,
    AllothercomponentsRoutingModule,
    NzMentionModule,
    NzLayoutModule,
    NzMenuModule,
    NzFormModule,
    NzInputModule,
    NzTableModule,
    NzDrawerModule,
    NzSpinModule,
    NzSelectModule,
    NzDropDownModule,
    NzIconModule,
    NzNotificationModule,
    NzButtonModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzTreeSelectModule,
    NzRadioModule,
    NzDividerModule,
    NzTagModule,
    NzModalModule,
    NzCheckboxModule,
    NzMessageModule,
    NzBadgeModule,
    NzStepsModule,
    NzCardModule,
    NzCommentModule,
    NzListModule,
    NzToolTipModule,
    NzAutocompleteModule,
    NzEmptyModule,
    NzSpinModule,
    NzGridModule,
    NzAvatarModule,
    NzTimePickerModule,
    NzPaginationModule,
    NzPopconfirmModule,
    NzPopoverModule
  ],

  providers: [
    { provide: NZ_I18N, useValue: en_US },
    CookieService,
    AsyncPipe,
    DatePipe,
  ],
  // bootstrap: [AppComponent]
})

export class AllothercomponentsModule { }
