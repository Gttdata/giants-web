import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonType, NzNotificationService } from 'ng-zorro-antd';
import { GroupActivityMaster } from 'src/app/Models/GroupActivityMaster';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-group-project-activity-attendance-drawer',
  templateUrl: './group-project-activity-attendance-drawer.component.html',
  styleUrls: ['./group-project-activity-attendance-drawer.component.css']
})

export class GroupProjectActivityAttendanceDrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: GroupActivityMaster = new GroupActivityMaster();
  @Input() trainattendiesData: any[] = [];
  @Input() groupDetails: GroupActivityMaster;
  @Input() EVENT_ID: any;
  @Input() drawerVisible: boolean = false;
  isSpinning: boolean = false;
  formTitle: string = "Training Attendies Mapping";
  @Input() totalRecords: number = 1;
  SEARCH_NAME: string = "";
  GLOBAL_P_A: boolean = true;

  constructor(private api: ApiService, private router: Router, private datePipe: DatePipe, private message: NzNotificationService) { }

  ngOnInit() { }

  close(): void {
    this.drawerClose();
  }

  save(): void {
    this.isSpinning = true;

    this.api.addBulkEventAttendance(this.EVENT_ID, this.trainattendiesData, this.groupDetails.GROUP_ID, true, true).subscribe(data => {
      if (data['code'] == 200) {
        this.message.success("Event Attendance Created Successfully", "");
        this.drawerClose();
        this.isSpinning = false;
        this.drawerVisible = false;

      } else {
        this.message.error("Event Attendance Creation Failed", "");
        this.isSpinning = false;
      }

    }, err => {
      this.isSpinning = false;

      if (err['ok'] == false)
        this.message.error("Server Not Found", "");
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
