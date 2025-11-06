import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { ProjectExpensesModel } from 'src/app/Models/GiantWeekCelebration';

@Component({
  selector: 'app-project-expenses-drawer',
  templateUrl: './project-expenses-drawer.component.html',
  styleUrls: ['./project-expenses-drawer.component.css']
})
export class ProjectExpensesDrawerComponent implements OnInit {

  @Input() drawerClose!: Function;
  @Input() drawerVisible: boolean = false;
  @Input() data: ProjectExpensesModel = new ProjectExpensesModel();
  @Input() drawerWeekdataArray: any[];
  @Input() isRemarkVisible: boolean;
  validation = true;
  @Input() closeProjectExpen: Function;
  @Input() ArrayProjectExpensesDrawerDataSaveInTable: any[];
  @Input() ProjectExpensesSaveInTable: Function;

  constructor(private datePipe: DatePipe, private message: NzNotificationService) { }

  ngOnInit() {
  }

  isOk: boolean = false
  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }
  onChange(result: Date): void {
    console.log('onChange: ', result);
  }
  close() {
    this.drawerVisible = false
    this.closeProjectExpen();
  }
  save(addNew: boolean) {
    this.validation = false;
    if (this.data.PROJECT == null || this.data.PROJECT.trim() == '') {
      this.isOk = false
      this.message.error("Please Enter Project", "");
    }
    else if (this.data.SPONSORSHIP_DATE == null || this.data.SPONSORSHIP_DATE == undefined) {
      this.isOk = false
      this.message.error("Please Select Date", "");
    } else if (this.data.AMOUNT == undefined || this.data.AMOUNT <= 0) {
      this.isOk = false
      this.message.error("Please Enter Amount", "");
    } else if (this.data.EXPENSES_DETAILS == null || this.data.EXPENSES_DETAILS.trim() == '') {
      this.isOk = false
      this.message.error("Please Enter Expenses Details", "");
    }
    else {
      this.validation = true;
      this.data.SPONSORSHIP_DATE = this.datePipe.transform(this.data.SPONSORSHIP_DATE, "yyyy-MM-dd")
      this.ProjectExpensesSaveInTable();
      // this.reset(myForm)
    }
  }
  reset(myForm: NgForm) {
    myForm.form.reset();
  }
  omit(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
