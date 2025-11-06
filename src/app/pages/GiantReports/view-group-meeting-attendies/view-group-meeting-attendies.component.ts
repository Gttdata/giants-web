import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { NzButtonType } from 'ng-zorro-antd';
import { GroupMeetAttendance } from 'src/app/Models/GroupMeetAttendance';

@Component({
  selector: 'app-view-group-meeting-attendies',
  templateUrl: './view-group-meeting-attendies.component.html',
  styleUrls: ['./view-group-meeting-attendies.component.css']
})

export class ViewGroupMeetingAttendiesComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: GroupMeetAttendance = new GroupMeetAttendance();
  @Input() trainattendiesData: any[] = [];
  @Input() MEETING_ID: any;
  @Input() drawerVisible: boolean = false;
  isSpinning = false
  formTitle = "Training Attendies Mapping";
  loadingRecords = false;
  isOk = true;
  filterQuery: string = "";
  filterValue = []
  isFilterApplied: NzButtonType = "default";
  isloadSpinning = false
  exportSpinning = false
  filterClass: string = "filter-invisible";
  current = new Date();
  isStatusSpinning = false;
  pageIndex = 1;
  pageSize = 10;
  @Input() totalRecords = 1;
  dataList: any = [];
  sortValue: string = "desc";
  sortKey: string = "id";
  searchText: string = "";
  DESIGNSTION_ID = 0;
  DEPARTMENT_ID = 0;
  departmentnm: any = [];
  designationm: any = [];
  a: any = [];
  b: any = [];
  dataList2 = [];
  column = [['MEETING_ID', 'Meeting Id'], ['MEMBER_NAME', 'Member Name'], ['P_A', 'Is Attending'], ["CLIENT_ID", "Client Id"]];

  constructor() { }

  ngOnInit() { }

  close() {
    this.drawerClose();
  }
}
