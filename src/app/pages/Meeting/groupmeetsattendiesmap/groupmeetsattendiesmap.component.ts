import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GroupMeetAttendance } from 'src/app/Models/GroupMeetAttendance';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-groupmeetsattendiesmap',
  templateUrl: './groupmeetsattendiesmap.component.html',
  styleUrls: ['./groupmeetsattendiesmap.component.css']
})

export class GroupmeetsattendiesmapComponent implements OnInit {
  @Input() drawerClose!: Function;
  @Input() data: GroupMeetAttendance = new GroupMeetAttendance();
  @Input() trainattendiesData: any[] = [];
  @Input() groupDetails: GroupMeetAttendance;
  @Input() MEETING_ID: any;
  @Input() drawerVisible: boolean = false;
  isSpinning: boolean = false;
  @Input() totalRecords = 1;
  dataList: any = [];
  SEARCH_NAME: string = "";
  GLOBAL_P_A: boolean = true;

  constructor(private api: ApiService, private router: Router, private datePipe: DatePipe, private message: NzNotificationService) { }

  ngOnInit() { }

  close(): void {
    this.drawerClose();
  }

  CLIENT_ID: number = 1;

  save(): void {
    this.isSpinning = true;

    this.api.addBulkgroupMeetingAttendance(this.CLIENT_ID, this.MEETING_ID, this.trainattendiesData, this.groupDetails.GROUP_ID, true, true).subscribe(data => {
      if (data['code'] == 200) {
        this.message.success("Group Meeting Attendance Created Successfully", "");
        this.drawerClose();
        this.isSpinning = false;
        this.drawerVisible = false;

      } else {
        this.message.error("Group Meeting Attendance Creation Failed", "");
        this.isSpinning = false;
      }

    }, err => {
      this.isSpinning = false;
    });
  }

  resetSearchBox(): void {
    this.SEARCH_NAME = "";
  }

  onGlobalPAChange(status: boolean): void {
    this.indeterminate = false;

    for (let i = 0; i < this.trainattendiesData.length; i++) {
      this.trainattendiesData[i]['P_A'] = status;
    }

    this.calcPresentAbsent(this.trainattendiesData);
  }

  meetingTotalCount: number;
  meetingPresentCount: number;
  meetingAbsentCount: number;

  calcPresentAbsent(meetingAttendanceData: any): void {
    this.meetingTotalCount = 0;
    this.meetingPresentCount = 0;
    this.meetingAbsentCount = 0;

    for (let i = 0; i < meetingAttendanceData.length; i++) {
      if (meetingAttendanceData[i]['P_A'] == 1) {
        this.meetingPresentCount += 1;

      } else {
        this.meetingAbsentCount += 1;
      }
    }

    this.meetingTotalCount = this.meetingPresentCount + this.meetingAbsentCount;
  }

  indeterminate: boolean = false;

  onCheckBoxChanges(status: boolean, memberID: number): void {
    this.trainattendiesData.filter(obj1 => {
      if (obj1["MEMBER_ID"] == memberID) {
        obj1["P_A"] = status;
      }
    });

    this.calcPresentAbsent(this.trainattendiesData);

    if (this.trainattendiesData.every(item => !item["P_A"])) {
      this.GLOBAL_P_A = false;
      this.indeterminate = false;

    } else if (this.trainattendiesData.every(item => item["P_A"])) {
      this.GLOBAL_P_A = true;
      this.indeterminate = false;

    } else {
      this.indeterminate = true;
    }
  }
}
