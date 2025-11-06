import { Component, Input, OnInit } from '@angular/core';
import { GroupMeetAttendance } from 'src/app/Models/GroupMeetAttendance';

@Component({
  selector: 'app-viewattendancies',
  templateUrl: './viewattendancies.component.html',
  styleUrls: ['./viewattendancies.component.css']
})

export class ViewattendanciesComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: GroupMeetAttendance = new GroupMeetAttendance();
  @Input() totalRecords = 1;
  isSpinning = false;
  pageIndex: number = 0;
  pageSize: number = 0;

  constructor() { }

  ngOnInit() { }

  close(): void {
    this.drawerClose();
  }
}
