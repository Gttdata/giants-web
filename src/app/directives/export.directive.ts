import { Directive, Input, HostListener } from '@angular/core';
import { ExportService } from '../Service/export.service';

@Directive({
  selector: '[appExport]'
})

export class ExportDirective {
  constructor(private exportService: ExportService) { }

  @Input('appExport') dataList: any[];
  @Input() fileName: string;

  @HostListener('click', ['$event']) onClick($event) {
    console.log('clicked: ' + $event);
    console.log(this.fileName);

    if (this.fileName == "AttendanceReport") {
      this.dataList = this.dataList.map(({
        DATE: Date, IN_TIME: In_Time, IN_LOCATION: In_Location, IN_DISTANCE: In_Distance, OUT_TIME: Out_Time, OUT_LOCATION: Out_Location, OUT_DISTANCE: Out_Distance, WORKING_HOURS: Working_Hours, STATUS: Status }) =>
        ({ Date, In_Time, In_Location, In_Distance, Out_Location, Out_Time, Out_Distance, Working_Hours, Status }));
      console.log("heee :", this.dataList);
    }

    else if (this.fileName == "LeaveReport") {
      this.dataList = this.dataList.map(({
        DATE: Date, LEAVE_TYPE: leave_Type, APPLICATION_DATE: application_Date, REMARK: Remark, HEAD_STATUS: Head_Status, HEAD_TIME: Head_Time, HR_STATUS: HR_status, HR_REMARK: HR_Remark, HR_TIME: HR_Time, FINAL_STATUS: final_Status }) =>
        ({ Date, leave_Type, application_Date, Remark, Head_Status, Head_Time, HR_status, HR_Remark, HR_Time, final_Status }));
    }

    else if (this.fileName == "ExpenseReport") {
      this.dataList = this.dataList.map(({
        VOUCHER_NO: Voucher_No, DATE: Date, CLAIM_DATE: Claim_Date, EXPENSE_HEAD_NAME: Head, CUSTOMER_NAME: Customer, PARTY_NAME: Party, AMOUNT: Amount, DESCRIPTION: Description, PEOPLES_NAMES: People_With, ATTACHMENT: Attachment, HEAD_STATUS: Head_Status, HEAD_TIME: HEAD_Time, HEAD_REMARK: Head_Remark, AC_STATUS: Accountant_Status, AC_REMARK: Accountant_Remark, AC_TIME: Accountant_Time, STATUS: Status }) =>
        ({ Voucher_No, Date, Claim_Date, Head, Customer, Party, Amount, Description, People_With, Attachment, Head_Status, HEAD_Time, Head_Remark, Accountant_Status, Accountant_Remark, Accountant_Time, Status }));
    }

    else if (this.fileName == "EvaluationReport") {
      this.dataList = this.dataList.map(({
        CRITERIA_NAME: Criteria, RATING: Ratings, WEIGHTAGE: Weightage, POINTS: Points, REMARK: Remark, REPORTING_HEAD: Reporting_Head, EVALUATION_DATE: Evaluation_Date }) =>
        ({ Criteria, Ratings, Weightage, Points, Remark, Reporting_Head, Evaluation_Date }));
    }

    else if (this.fileName == "PayrollReport") {
      this.dataList = this.dataList.map(({
        EMP_NAME: Employee, TOTAL_WORKING: Total_Working, PRESENT: Present, APPROVED_LEAVE: Approved_Leave, UNAPPROVED_LEAVE: Unapproved_Leave, LATEMARKS: Latemark, APPROVED_LATEMARKS: Approved_Latemark, HALFDAY: Halfday, SALARY: Salary, LEAVE_DEDUCTION: Leave_Deduction, HALFDAY_DEDUCTION: Half_Deduction, PAYABLE_SALARY: Payable_Salary }) =>
        ({ Employee, Total_Working, Present, Approved_Leave, Unapproved_Leave, Latemark, Approved_Latemark, Halfday, Salary, Leave_Deduction, Half_Deduction, Payable_Salary }));
    }

    else if (this.fileName == "LeaveSummeryReport") {
      this.dataList = this.dataList.map(({
        EMPLOYEE_NAME: Employee, LEAVES_APPLIED: Leave_Applied, APPROVED_LEAVES: Approved_Leaves, REJECTED_LEAVES: Rejected_Leave, EXACT_LEAVES: Exact_Leaves }) =>
        ({ Employee, Leave_Applied, Approved_Leaves, Rejected_Leave }));
    }

    else if (this.fileName == "ExpenseSummeryReport") {
      this.dataList = this.dataList.map(({
        EMPLOYEE_NAME: Employee, CLAIMED: Claimed, APPROVED: Approved, REJECTED: Rejected, ONHOLD: OnHold }) =>
        ({ Employee, Claimed, Approved, Rejected, OnHold }));
    }

    else if (this.fileName == "AttendanceRegister") {
      this.dataList = this.dataList.map(({
        EMPLOYEE_NAME: Employee, 1: Date_1, 2: Date_2, 3: Date_3, 4: Date_4, 5: Date_5, 6: Date_6, 7: Date_7, 8: Date_8, 9: Date_9, 10: Date_10, 11: Date_11, 12: Date_12, 13: Date_13, 14: Date_14, 15: Date_15, 16: Date_16, 17: Date_17, 18: Date_18, 19: Date_19, 20: Date_20, 21: Date_21, 22: Date_22, 23: Date_23, 24: Date_24, 25: Date_25, 26: Date_26, 27: Date_27, 28: Date_28, 29: Date_29, 30: Date_30, 31: Date_31, WORKING: Working, PRESENT: Present, LEAVE_COUNT: Leave, ABSENT: Absent, LATEMARK: Latemark, HALFDAY: Halfday, HOLIDAY: Holiday }) =>
        ({ Employee, Date_1, Date_2, Date_3, Date_4, Date_5, Date_6, Date_7, Date_8, Date_9, Date_10, Date_11, Date_12, Date_13, Date_14, Date_15, Date_16, Date_17, Date_18, Date_19, Date_20, Date_21, Date_22, Date_23, Date_24, Date_25, Date_26, Date_27, Date_28, Date_29, Date_30, Date_31, Working, Present, Leave, Absent, Latemark, Halfday, Holiday }));
    }

    else if (this.fileName == "LatemarkReport") {
      this.dataList = this.dataList.map(({
        DATE: Date, EXPECTED_TIME: Expected_Time, REASON: Reason, STATUS: Status, REMARK: Remark, APPROVER_NAME: Approver_Name }) =>
        ({ Date, Expected_Time, Reason, Status, Remark, Approver_Name }));
    }

    else if (this.fileName == "LatemarkSummeryReport") {
      this.dataList = this.dataList.map(({
        EMPLOYEE_NAME: Employee, LATEMARK_APPLIED: Applied, APPROVED_LATEMARK: Approved, REJECTED_LATEMARK: Rejected, EXACT_LATEMARK: Exact }) =>
        ({ Employee, Applied, Approved, Rejected, Exact }));
    }

    this.exportService.exportExcel(this.dataList, this.fileName);
  }
}
