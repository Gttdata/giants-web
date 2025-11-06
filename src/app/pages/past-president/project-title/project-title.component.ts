import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PastPrecidentTitleDrawer } from 'src/app/Models/PastPrecident';
import { differenceInCalendarDays, setHours } from 'date-fns';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-project-title',
  templateUrl: './project-title.component.html',
  styleUrls: ['./project-title.component.css']
})
export class ProjectTitleComponent implements OnInit {

  @Input() data1: PastPrecidentTitleDrawer = new PastPrecidentTitleDrawer();
  @Input() isRemarkVisible: boolean;
  @Input() AddTable: Function;
  @Input() closeDrawerPast:Function
  @Input() drawerVisible: boolean = false;
  // INITIATED_PROJECT_DETAILS=[];
  // OUTSTANDING_PAST_PRESIDENT=[];
  today = new Date();
  constructor(private datePipe: DatePipe,private message: NzNotificationService) { }

  ngOnInit() {
  }
  validation=true;

  save(addNew: boolean) {
    
    this.validation=false;
    if(this.data1.PROJECT_TITLE.trim()=='' || this.data1.PROJECT_TITLE==undefined ){
      this.message.error("Please Enter Project Title","");
    }
    else if(this.data1.RESULT.trim()==''|| this.data1.RESULT==undefined){
      this.message.error("Please Enter Result","");
    }
    else if(this.data1.EFFECT_ON_SOCIETY.trim()==''|| this.data1.EFFECT_ON_SOCIETY==undefined){
      this.message.error("Please Enter Effect On Society","");
    }
    else if(this.data1.IMPLEMENTATION_DATE==undefined|| this.data1.IMPLEMENTATION_DATE==null){
      this.message.error("Please Select Date","");
    }
    else{
      this.validation=true;
    this.data1.IMPLEMENTATION_DATE = this.datePipe.transform(this.data1.IMPLEMENTATION_DATE, "yyyy-MM-dd")
    this.AddTable();
    }
  }
  close() {
    this.drawerVisible=false;
    this.closeDrawerPast();
  }
  omit(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  // disabledDate = (current: Date): boolean =>
  //   differenceInCalendarDays(current, this.today) > 0;
  onChange(result: Date): void {
    console.log("OnChange", result);
  }
}
