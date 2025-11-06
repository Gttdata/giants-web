import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { CookieService } from 'ngx-cookie-service';
import { take } from 'rxjs/operators';
import { ApiService } from 'src/app/Service/api.service';
import { CompressImageService } from 'src/app/Service/image-compressor.service';

@Component({
  selector: 'app-add-new-notification-drawer',
  templateUrl: './add-new-notification-drawer.component.html',
  styleUrls: ['./add-new-notification-drawer.component.css']
})

export class AddNewNotificationDrawerComponent implements OnInit {
  @Input() drawerClose: Function;
  sharingMode: string = "I";
  USER_IDS = [];
  TITLE: string = "";
  DESCRIPTION: string = "";
  employeeList = [];
  userId = Number(this.cookie.get('userId'));
  roleId = Number(this.cookie.get('roleId'));
  orgId = Number(this.cookie.get('orgId'));
  federationId = Number(this.cookie.get('FEDERATION_ID'));
  unitId = Number(this.cookie.get('UNIT_ID'));
  groupId = Number(this.cookie.get('GROUP_ID'));
  heading: string = "";
  individualGrid: boolean = false;
  FederationGrid: boolean = false;
  unitGrid: boolean = false;
  groupGrid: boolean = false;
  entireOrg: boolean = false;
  isSpinning: boolean = false;
  NOTI_TYPE: string = "T";
  currentIndex: number;

  constructor(private compressImage: CompressImageService, private api: ApiService, private message: NzNotificationService, private cookie: CookieService) { }

  ngOnInit() {
    this.heading = "Select Member(s)";
  }

  reset(myForm: NgForm) {
    myForm.form.reset();
  }

  close(myForm: NgForm): void {
    this.drawerClose();
    this.reset(myForm);
    this.clear();
  }

  btnIndividualStatus = false;
  btnFederationStatus = false;
  btnUnitStatus = false;
  btnGroupStatus = false;
  btnEntireOrganisationStatus = false;

  disableRadioButtons() {
    this.userId = Number(this.cookie.get('userId'));
    this.roleId = Number(this.cookie.get('roleId'));
    this.orgId = Number(this.cookie.get('orgId'));
    this.federationId = Number(this.cookie.get('FEDERATION_ID'));
    this.unitId = Number(this.cookie.get('UNIT_ID'));
    this.groupId = Number(this.cookie.get('GROUP_ID'));

    if (this.roleId == 12) {
      this.btnIndividualStatus = true;
      this.btnFederationStatus = true;
      this.btnUnitStatus = true;
      this.btnGroupStatus = true;
      this.btnEntireOrganisationStatus = true;

    } else {
      this.btnIndividualStatus = true;
      // this.btnIndividualStatus = true;
      // this.btnFederationStatus = true;
      // this.btnUnitStatus = true;
      // this.btnGroupStatus = true;
      // this.btnEntireOrganisationStatus = true;

      if (this.federationId > 0) {
        this.btnGroupStatus = true;
        this.btnUnitStatus = true;
      }

      if (this.groupId > 0) {
        this.btnIndividualStatus = true;
      }

      if (this.unitId > 0) {
        this.btnGroupStatus = true;
      }
    }
  }

  changeRadio(btnValue) {
    this.employeeList = [];
    this.USER_IDS = [];
    this.userId = Number(this.cookie.get('userId'));
    this.roleId = Number(this.cookie.get('roleId'));
    this.orgId = Number(this.cookie.get('orgId'));
    this.federationId = Number(this.cookie.get('FEDERATION_ID'));
    this.unitId = Number(this.cookie.get('UNIT_ID'));
    this.groupId = Number(this.cookie.get('GROUP_ID'));

    if (this.federationId > 0) {
      if (btnValue == 'I') {
        this.heading = "Select Member(s)";
        this.individualGrid = true;
        this.FederationGrid = false;
        this.unitGrid = false;
        this.groupGrid = false;
        this.entireOrg = false;

      } else if (btnValue == 'F') {
        this.heading = "Select Federation(s)";
        this.individualGrid = false;
        this.FederationGrid = true;
        this.unitGrid = false;
        this.groupGrid = false;
        this.entireOrg = false;

      } else if (btnValue == 'U') {
        this.heading = "Select Unit(s)";
        this.individualGrid = false;
        this.FederationGrid = false;
        this.unitGrid = true;
        this.groupGrid = false;
        this.entireOrg = false;

      } else if (btnValue == 'G') {
        this.heading = "Select Group(s)";
        this.individualGrid = false;
        this.FederationGrid = false;
        this.unitGrid = false;
        this.groupGrid = true;
        this.entireOrg = false;
      }

    } else if (this.unitId > 0) {
      if (btnValue == 'I') {
        this.heading = "Select Member(s)";
        this.individualGrid = true;
        this.FederationGrid = false;
        this.unitGrid = false;
        this.groupGrid = false;
        this.entireOrg = false;

      } else if (btnValue == 'G') {
        this.heading = "Select Group(s)";
        this.individualGrid = false;
        this.FederationGrid = false;
        this.unitGrid = false;
        this.groupGrid = true;
        this.entireOrg = false;

      } else if (btnValue == 'EO') {
        this.heading = "Select Member(s)";
        this.individualGrid = false;
        this.FederationGrid = false;
        this.unitGrid = false;
        this.groupGrid = false;
        this.entireOrg = true;
      }

    } else if (this.groupId > 0) {
      if (btnValue == 'I') {
        this.heading = "Select Member(s)";
        this.individualGrid = true;
        this.FederationGrid = false;
        this.unitGrid = false;
        this.groupGrid = false;
        this.entireOrg = false;

      } else if (btnValue == 'EO') {
        this.heading = "Select Member(s)";
        this.individualGrid = false;
        this.FederationGrid = false;
        this.unitGrid = false;
        this.groupGrid = false;
        this.entireOrg = true;
      }

    } else if (this.federationId == 0 && this.unitId == 0 && this.groupId == 0 && this.roleId == 37) {
      var groupId = Number(this.cookie.get('HOME_GROUP_ID'));

      if (btnValue == 'I') {
        this.heading = "Select Member(s)";
        this.individualGrid = true;
        this.FederationGrid = false;
        this.unitGrid = false;
        this.groupGrid = false;
        this.entireOrg = false;
      }
    }
  }

  listLoading: boolean = false;

  changeRadioButton(no, btnValue) {
    this.userId = Number(this.cookie.get('userId'));
    this.roleId = Number(this.cookie.get('roleId'));
    this.orgId = Number(this.cookie.get('orgId'));
    this.federationId = Number(this.cookie.get('FEDERATION_ID'));
    this.unitId = Number(this.cookie.get('UNIT_ID'));
    this.groupId = Number(this.cookie.get('GROUP_ID'));

    if (this.federationId > 0) {
      if (btnValue == 'I') {
        this.heading = "Select Member(s)";
        this.individualGrid = true;
        this.FederationGrid = false;
        this.unitGrid = false;
        this.groupGrid = false;
        this.entireOrg = false;

        if (no.length >= 3) {
          this.listLoading = true;

          this.api.getAllMembers(0, 0, '', '', ' AND ID <>' + this.userId + " AND FEDERATION_ID=" + this.federationId + " AND NAME like '%" + no + "%'").subscribe(data => {
            if (data['code'] == 200) {
              this.listLoading = false;
              this.employeeList = data['data'];
            }

          }, err => {
            this.listLoading = false;
            this.employeeList = [];

            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
        }

      } else if (btnValue == 'F') {
        this.heading = "Select Federation(s)";
        this.individualGrid = false;
        this.FederationGrid = true;
        this.unitGrid = false;
        this.groupGrid = false;
        this.entireOrg = false;

        if (no.length >= 3) {
          this.listLoading = true;

          this.api.getAllFederations(0, 0, '', '', 'AND STATUS=1 ' + " AND NAME like '%" + no + "%'").subscribe(data => {
            if (data['code'] == 200) {
              this.listLoading = false;
              this.employeeList = data['data'];
            }

          }, err => {
            this.listLoading = false;
            this.employeeList = [];

            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
        }

      } else if (btnValue == 'U') {
        this.heading = "Select Unit(s)";
        this.individualGrid = false;
        this.FederationGrid = false;
        this.unitGrid = true;
        this.groupGrid = false;
        this.entireOrg = false;

        if (no.length >= 3) {
          this.listLoading = true;

          this.api.getAllUnits(0, 0, '', '', 'AND STATUS=1 AND FEDERATION_ID=' + this.federationId + " AND NAME like '%" + no + "%'").subscribe(data => {
            if (data['code'] == 200) {
              this.listLoading = false;
              this.employeeList = data['data'];
            }

          }, err => {
            this.listLoading = false;
            this.employeeList = [];

            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
        }

      } else if (btnValue == 'G') {
        this.heading = "Select Group(s)";
        this.individualGrid = false;
        this.FederationGrid = false;
        this.unitGrid = false;
        this.groupGrid = true;
        this.entireOrg = false;

        if (no.length >= 3) {
          this.listLoading = true;

          this.api.getAllGroups(0, 0, '', '', 'AND STATUS=1 AND FEDERATION_ID=' + this.federationId + " AND NAME like '%" + no + "%'").subscribe(data => {
            if (data['code'] == 200) {
              this.listLoading = false;
              this.employeeList = data['data'];
            }
          }, err => {
            this.listLoading = false;
            this.employeeList = [];

            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
        }
      }

    } else if (this.unitId > 0) {
      if (btnValue == 'I') {
        this.heading = "Select Member(s)";
        this.individualGrid = true;
        this.FederationGrid = false;
        this.unitGrid = false;
        this.groupGrid = false;
        this.entireOrg = false;

        if (no.length >= 3) {
          this.listLoading = true;

          this.api.getAllMembers(0, 0, '', '', ' AND ID <>' + this.userId + " AND UNIT_ID=" + this.unitId + " AND NAME like '%" + no + "%'").subscribe(data => {
            if (data['code'] == 200) {
              this.listLoading = false;
              this.employeeList = data['data'];
            }

          }, err => {
            this.listLoading = false;
            this.employeeList = [];

            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
        }

      } else if (btnValue == 'G') {
        this.heading = "Select Group(s)";
        this.individualGrid = false;
        this.FederationGrid = false;
        this.unitGrid = false;
        this.groupGrid = true;
        this.entireOrg = false;

        if (no.length >= 3) {
          this.listLoading = true;

          this.api.getAllGroups(0, 0, '', '', 'AND STATUS=1 AND UNIT_ID=' + this.unitId + " AND NAME like '%" + no + "%'").subscribe(data => {
            if (data['code'] == 200) {
              this.listLoading = false;
              this.employeeList = data['data'];
            }

          }, err => {
            this.listLoading = false;
            this.employeeList = [];

            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
        }

      } else if (btnValue == 'EO') {
        this.heading = "Select Member(s)";
        this.individualGrid = false;
        this.FederationGrid = false;
        this.unitGrid = false;
        this.groupGrid = false;
        this.entireOrg = true;
      }

    } else if (this.groupId > 0) {
      if (btnValue == 'I') {
        this.heading = "Select Member(s)";
        this.individualGrid = true;
        this.FederationGrid = false;
        this.unitGrid = false;
        this.groupGrid = false;
        this.entireOrg = false;

        if (no.length >= 3) {
          this.listLoading = true;

          this.api.getAllMembers(0, 0, '', '', 'AND ID <>' + this.userId + " AND GROUP_ID=" + this.groupId + " AND NAME like '%" + no + "%'").subscribe(data => {
            if (data['code'] == 200) {
              this.listLoading = false;
              this.employeeList = data['data'];
            }

          }, err => {
            this.listLoading = false;
            this.employeeList = [];

            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
        }

      } else if (btnValue == 'EO') {
        this.heading = "Select Member(s)";
        this.individualGrid = false;
        this.FederationGrid = false;
        this.unitGrid = false;
        this.groupGrid = false;
        this.entireOrg = true;
      }

    } else if (this.federationId == 0 && this.unitId == 0 && this.groupId == 0 && this.roleId == 37) {
      var groupId = Number(this.cookie.get('HOME_GROUP_ID'));

      if (btnValue == 'I') {
        this.heading = "Select Member(s)";
        this.individualGrid = true;
        this.FederationGrid = false;
        this.unitGrid = false;
        this.groupGrid = false;
        this.entireOrg = false;

        if (no.length >= 3) {
          this.listLoading = true;

          this.api.getAllMembers(0, 0, '', '', 'AND ID <>' + this.userId + " AND GROUP_ID=" + groupId + " AND NAME like '%" + no + "%'").subscribe(data => {
            if (data['code'] == 200) {
              this.listLoading = false;
              this.employeeList = data['data'];
            }

          }, err => {
            if (err['ok'] == false)
              this.message.error("Server Not Found", "");
          });
        }
      }
    }
  }

  getInitial(empName: string) {
    let initial: string = empName.charAt(0);
    return initial.trim();
  }

  save(myForm: NgForm): void {
    this.userId = Number(this.cookie.get('userId'));
    this.roleId = Number(this.cookie.get('roleId'));
    this.orgId = Number(this.cookie.get('orgId'));
    this.federationId = Number(this.cookie.get('FEDERATION_ID'));
    this.unitId = Number(this.cookie.get('UNIT_ID'));
    this.groupId = Number(this.cookie.get('GROUP_ID'));
    var isOk = true;

    // if (!this.entireOrg) {
    //   if (this.USER_IDS.length == 0) {
    //     isOk = false;

    //     if (this.individualGrid) {
    //       this.message.error("Please Select Valid Member(s)", "");

    //     } else if (this.FederationGrid) {
    //       this.message.error("Please Select Valid Federation(s)", "");

    //     } else if (this.unitGrid) {
    //       this.message.error("Please Select Valid Unit(s)", "");

    //     } else if (this.groupGrid) {
    //       this.message.error("Please Select Valid Group(s)", "");
    //     }
    //   }
    // }

    if ((this.USER_IDS.length == 0) && (this.individualGrid)) {
      isOk = false;
      this.message.error("Please Select Valid Member(s)", "");

    } else if ((this.USER_IDS.length == 0) && (this.FederationGrid)) {
      isOk = false;
      this.message.error("Please Select Valid Federation(s)", "");

    } else if ((this.USER_IDS.length == 0) && (this.unitGrid)) {
      this.message.error("Please Select Valid Unit(s)", "");
      isOk = false;

    } else if ((this.USER_IDS.length == 0) && (this.groupGrid)) {
      this.message.error("Please Select Valid Group(s)", "");
      isOk = false;

    } else if ((this.TITLE == undefined) || (this.TITLE.trim() == '')) {
      isOk = false;
      this.message.error("Please Enter Valid Notification Title", "");

    } else if ((this.DESCRIPTION == undefined) || (this.DESCRIPTION.trim() == '')) {
      isOk = false;
      this.message.error("Please Enter Valid Notification Description", "");

    } else if (this.NOTI_TYPE == 'I') {
      if (this.fileURL == null) {
        isOk = false;
        this.message.error("Please Select Valid Image", "");
      }
    }

    if (isOk) {
      var imageURL = "";
      this.imageUpload();
      imageURL = this.uploadedAttachmentStr;

      if (this.individualGrid) {
        this.isSpinning = true;
        var a = [];

        if (this.USER_IDS.length != 0) {
          for (var i = 0; i < this.USER_IDS.length; i++) {
            var obj1 = new Object();
            obj1['MEMBER_ID'] = this.USER_IDS[i];
            a.push(Object.assign({}, obj1));
          }

        } else {
          var obj1 = new Object();
          obj1['MEMBER_ID'] = this.USER_IDS;
          a.push(Object.assign({}, obj1));
        }

        this.api.notiDetailsAddBulk(this.userId, this.TITLE, this.DESCRIPTION, 1, a, this.orgId, imageURL, this.NOTI_TYPE, this.federationId, this.groupId, this.unitId).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.isSpinning = false;
            this.message.success("Notification Send Successfully", "");
            this.changeRadioButton('', 'I');
            this.close(myForm);

          } else {
            this.isSpinning = false;
            this.message.error("Failed to Send Notification", "");
          }

        }, err => {
          if (err['ok'] == false) {
            this.isSpinning = false;
            this.message.error("Failed to Send Notification", "");
          }
        });

      } else if (this.FederationGrid) {
        this.isSpinning = true;
        var a = [];

        if (this.USER_IDS.length != 0) {
          for (var i = 0; i < this.USER_IDS.length; i++) {
            var obj1 = new Object();
            obj1['FEDERATION_ID'] = this.USER_IDS[i];
            a.push(Object.assign({}, obj1));
          }

        } else {
          var obj1 = new Object();
          obj1['FEDERATION_ID'] = this.USER_IDS;
          a.push(Object.assign({}, obj1));
        }

        this.api.notiDetailsAddBulk(this.userId, this.TITLE, this.DESCRIPTION, 2, a, this.orgId, imageURL, this.NOTI_TYPE, this.federationId, this.groupId, this.unitId).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.isSpinning = false;
            this.message.success("Notification Send Successfully", "");
            this.changeRadioButton('', 'D');
            this.close(myForm);

          } else {
            this.isSpinning = false;
            this.message.error("Failed to Send Notification", "");
          }

        }, err => {
          if (err['ok'] == false) {
            this.isSpinning = false;
            this.message.error("Failed to Send Notification", "");
          }
        });

      } else if (this.unitGrid) {
        this.isSpinning = true;
        var a = [];

        if (this.USER_IDS.length != 0) {
          for (var i = 0; i < this.USER_IDS.length; i++) {
            var obj1 = new Object();
            obj1['UNIT_ID'] = this.USER_IDS[i];
            a.push(Object.assign({}, obj1));
          }

        } else {
          var obj1 = new Object();
          obj1['UNIT_ID'] = this.USER_IDS;
          a.push(Object.assign({}, obj1));
        }

        this.api.notiDetailsAddBulk(this.userId, this.TITLE, this.DESCRIPTION, 3, a, this.orgId, imageURL, this.NOTI_TYPE, this.federationId, this.groupId, this.unitId).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.isSpinning = false;
            this.message.success("Notification Send Successfully", "");
            this.changeRadioButton('', 'B');
            this.close(myForm);

          } else {
            this.isSpinning = false;
            this.message.error("Failed to Send Notification", "");
          }

        }, err => {
          if (err['ok'] == false) {
            this.isSpinning = false;
            this.message.error("Failed to Send Notification", "");
          }
        });

      } else if (this.groupGrid) {
        this.isSpinning = true;
        var a = [];

        if (this.USER_IDS.length != 0) {
          for (var i = 0; i < this.USER_IDS.length; i++) {
            var obj1 = new Object();
            obj1['GROUP_ID'] = this.USER_IDS[i];
            a.push(Object.assign({}, obj1));
          }

        } else {
          var obj1 = new Object();
          obj1['GROUP_ID'] = this.USER_IDS;
          a.push(Object.assign({}, obj1));
        }

        this.api.notiDetailsAddBulk(this.userId, this.TITLE, this.DESCRIPTION, 4, a, this.orgId, imageURL, this.NOTI_TYPE, this.federationId, this.groupId, this.unitId).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.isSpinning = false;
            this.message.success("Notification Send Successfully", "");
            this.changeRadioButton('', 'DE');
            this.close(myForm);

          } else {
            this.isSpinning = false;
            this.message.error("Failed to Send Notification", "");
          }

        }, err => {
          if (err['ok'] == false) {
            this.isSpinning = false;
            this.message.error("Failed to Send Notification", "");
          }
        });

      } else if (this.entireOrg) {
        this.isSpinning = true;
        var a = [];
        var obj1 = new Object();
        obj1['ORG_ID'] = this.orgId;
        a.push(Object.assign({}, obj1));

        this.api.notiDetailsAddBulk(this.userId, this.TITLE, this.DESCRIPTION, 5, a, this.orgId, imageURL, this.NOTI_TYPE, this.federationId, this.groupId, this.unitId).subscribe(successCode => {
          if (successCode['code'] == 200) {
            this.isSpinning = false;
            this.message.success("Notification Send Successfully", "");
            this.changeRadioButton('', 'EO');
            this.close(myForm);

          } else {
            this.isSpinning = false;
            this.message.error("Failed to Send Notification", "");
          }

        }, err => {
          if (err['ok'] == false) {
            this.isSpinning = false;
            this.message.error("Failed to Send Notification", "");
          }
        });
      }
    }
  }

  fileURL: File = null;
  photoURL: any;
  imageSrc1: string;

  onFileSelected(event) {
    if (event.target.files[0].type == "image/jpeg" || event.target.files[0].type == "image/jpg" || event.target.files[0].type == "image/png") {
      this.fileURL = <File>event.target.files[0];

      this.compressImage.compress(event.target.files[0]).pipe(take(1)).subscribe(compressedImage => {
        this.fileURL = compressedImage;
      })

      const reader = new FileReader();
      if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.imageSrc1 = reader.result as string;
          this.photoURL = this.imageSrc1;
        };
      }

    } else {
      this.message.error("Please Select only JPEG/ JPG/ PNG File", "");
      this.fileURL = null;
    }
  }

  clear() {
    this.fileURL = null;
    this.photoURL = null;
  }

  folderName = "notifications";
  uploadedAttachmentStr: string;

  imageUpload() {
    this.uploadedAttachmentStr = "";

    if (this.fileURL) {
      var number = Math.floor(100000 + Math.random() * 900000);
      var fileExt = this.fileURL.name.split('.').pop();
      var url = "N" + number + "." + fileExt;

      this.api.onUpload2(this.folderName, this.fileURL, url).subscribe(res => {
        if (res["code"] == 200) {
          console.log("Uploaded");

        } else {
          console.log("Not Uploaded");
        }
      });

      this.uploadedAttachmentStr = this.api.retriveimgUrl + "notifications/" + url;

    } else {
      this.uploadedAttachmentStr = "";
    }
  }
}
