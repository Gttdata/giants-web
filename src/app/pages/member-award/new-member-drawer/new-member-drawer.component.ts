import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { NewMemberModel } from 'src/app/Models/MemberAward';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-new-member-drawer',
  templateUrl: './new-member-drawer.component.html',
  styleUrls: ['./new-member-drawer.component.css']
})
export class NewMemberDrawerComponent implements OnInit {

  constructor(private api: ApiService, private message: NzNotificationService,private datePipe: DatePipe) { }

  @Input() drawerClose!: Function;
  @Input() drawerVisible: boolean = false;
  @Input() data: NewMemberModel = new NewMemberModel();
  @Input() drawerWeekdataArray: any[];
  @Input() isRemarkVisible: boolean;
  @Input() NewMemberSaveInTable : Function;
  @Input() drawerNewMemberArray:any[] = [];
  @Input() NewMemberDrawerClose:Function;
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
    this.NewMemberDrawerClose();
  }

}
