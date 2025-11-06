import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { LadyNewMemberModel } from 'src/app/Models/LadyMemberAward';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-new-lady-member',
  templateUrl: './new-lady-member.component.html',
  styleUrls: ['./new-lady-member.component.css']
})
export class NewLadyMemberComponent implements OnInit {

  constructor(private api: ApiService, private message: NzNotificationService,private datePipe: DatePipe) { }

  @Input() drawerClose!: Function;
  @Input() drawerVisible: boolean = false;
  @Input() data: LadyNewMemberModel = new LadyNewMemberModel();
  @Input() drawerWeekdataArray: any[];
  @Input() isRemarkVisible: boolean;
  @Input() NewMemberSaveInTable : Function;
  @Input() drawerNewMemberArray:any[] = [];
  @Input() NewLadyMemberDrawerClose:Function;
  ngOnInit() {
  }
  omit(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  validation=true;


  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  save(addNew: boolean) {
    this.validation=false;
    if(this.data.MEMBER_NAME.trim()=='' || this.data.MEMBER_NAME==undefined ){
      this.message.error("Please Enter Project Title","");
    }
    else{
      this.validation=true;
      this.data.YEAR = this.datePipe.transform(this.data.YEAR, "yyyy")
    this.NewMemberSaveInTable();
    }
  }
  close() {
    this.drawerVisible = false;
    this.validation=true;
    this.NewLadyMemberDrawerClose();
  }

}
