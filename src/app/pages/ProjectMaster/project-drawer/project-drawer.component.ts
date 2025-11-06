import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { ProjectMaster } from 'src/app/Models/ProjectMaster';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-project-drawer',
  templateUrl: './project-drawer.component.html',
  styleUrls: ['./project-drawer.component.css']
})

export class ProjectDrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  @Input() data: ProjectMaster;
  @Input() drawerVisible: boolean;
  isSpinning = false;
  leaveTypes = [];
  namePattern = "([A-Za-z0-9 \s]){1,}";

  constructor(private api: ApiService, private message: NzNotificationService, private datePipe: DatePipe) { }

  ngOnInit() { }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  save(addNew: boolean, myForm: NgForm): void {
    var isOk = true;

    if (this.data.NAME != undefined && this.data.NAME != null) {
      if (this.data.NAME.trim() == '') {
        isOk = false;
        this.message.error("Please Enter Valid Type", "");
      }

    } else {
      isOk = false;
      this.message.error("Please Enter Valid Type", "");
    }

    if (isOk) {
      this.isSpinning = true;

      if (this.data.ID) {
        this.api.updateProject(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Type Details Updated Successfully", "");
            this.isSpinning = false;

            if (!addNew)
              this.close(myForm);

          } else {
            this.message.error("Type Details Updation Failed", "");
            this.isSpinning = false;
          }
        });

      } else {
        this.api.createProject(this.data).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.message.success("Type Created Successfully", "");
            this.isSpinning = false;

            if (!addNew)
              this.close(myForm);

            else {
              this.data = new ProjectMaster();
            }

          } else {
            this.message.error("Type Creation Failed", "");
            this.isSpinning = false;
          }
        });
      }
    }
  }

  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }

    return true;
  }
}
