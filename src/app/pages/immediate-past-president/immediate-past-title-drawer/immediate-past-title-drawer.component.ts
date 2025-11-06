import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { ImmediatePastPrecidentTitleDrawer } from 'src/app/Models/ImmediatePastPresident';

@Component({
  selector: 'app-immediate-past-title-drawer',
  templateUrl: './immediate-past-title-drawer.component.html',
  styleUrls: ['./immediate-past-title-drawer.component.css']
})
export class ImmediatePastTitleDrawerComponent implements OnInit {

  @Input() data1: ImmediatePastPrecidentTitleDrawer = new ImmediatePastPrecidentTitleDrawer();
  @Input() isRemarkVisible: boolean;
  @Input() AddTable: Function;
  @Input() drawerVisible: boolean = false;
  @Input() closeDrawerImmediat:Function;
  // INITIATED_PROJECT_DETAILS=[];
  // OUTSTANDING_PAST_PRESIDENT=[];
  today = new Date();
  constructor(private datePipe: DatePipe,private message: NzNotificationService) { }
  validation=true;
  ngOnInit() {
  }

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
    this.drawerVisible=false
    this.closeDrawerImmediat();
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
