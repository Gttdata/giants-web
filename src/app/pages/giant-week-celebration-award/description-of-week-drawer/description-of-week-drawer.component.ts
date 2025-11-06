import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { DescriptionOfWeekModel } from 'src/app/Models/GiantWeekCelebration';

@Component({
  selector: 'app-description-of-week-drawer',
  templateUrl: './description-of-week-drawer.component.html',
  styleUrls: ['./description-of-week-drawer.component.css']
})
export class DescriptionOfWeekDrawerComponent implements OnInit {

  @Input() drawerClose!: Function;
  @Input() drawerVisible: boolean = false;
  @Input() data: DescriptionOfWeekModel = new DescriptionOfWeekModel();
  @Input() drawerWeekdataArray: any[];
  @Input() isRemarkVisible: boolean;
  validation = true;
  @Input() closeDescription: Function;
  @Input() DescriptionWeekSaveInTable: Function;
  @Input() ArrayDescriptionOfWeekSaveInTable: any[];
  isOk: boolean;

  constructor(private datePipe: DatePipe, private message: NzNotificationService) { }

  ngOnInit() {
  }
  onChange(result: Date): void {
    console.log('onChange: ', result);
  }
  close() {
    this.drawerVisible = false
    this.closeDescription();
  }
  save(addNew: boolean) {
    this.validation = false;
    if (this.data.DATE == null || this.data.DATE == undefined) {
      this.isOk = false
      this.message.error("Please Select Date", "");
    }else
    if (this.data.DESCRIPTION.trim() == '' || this.data.DESCRIPTION == undefined) {
      this.isOk = false
      this.message.error("Please Enter Description", "");
    } else 
     {
      this.validation = true;
      this.data.DATE = this.datePipe.transform(this.data.DATE, "yyyy-MM-dd")
      this.DescriptionWeekSaveInTable();
    }
  }
}
