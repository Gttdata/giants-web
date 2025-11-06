import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { DetailAndDocumentModel } from 'src/app/Models/MemberAward';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-doc-and-detail-drawer',
  templateUrl: './doc-and-detail-drawer.component.html',
  styleUrls: ['./doc-and-detail-drawer.component.css']
})
export class DocAndDetailDrawerComponent implements OnInit {

  @Input() drawerClose!: Function;
  @Input() drawerVisible: boolean = false;
  @Input() data: DetailAndDocumentModel = new DetailAndDocumentModel();
  @Input() drawerWeekdataArray: any[];
  @Input() isRemarkVisible: boolean;
  @Input() DocAndDetailSaveInTable: Function
  @Input() drawerDocAndDetailArray: any[] = [];
  @Input() DocAndDetDrawerClose :Function

  constructor(private api: ApiService, private message: NzNotificationService) { }
  DocumentUrl = this.api.retriveimgUrl + "memberDocuments"
  ngOnInit() {
  }
  omit(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  validation = true;


  onChange(result: Date): void {
    console.log('onChange: ', result);
  }
  isOk:boolean=false;
  save(addNew: boolean) {
    this.validation = false;

    if (this.data.DETAILS.trim() == "" || this.data.DETAILS == undefined) {
      this.isOk=false;
      this.message.error("Please Enter Details", "");
    }
    else if(this.data.DOCUMENTS==null){
      this.isOk=false;
      this.message.error("Please Select File","")
    }
    else {
      this.validation = true;
      // this.data.YEAR = this.datePipe.transform(this.data.YEAR, "yyyy")
      this.DocAndDetailSaveInTable();
    }
  }
  close() {
    this.drawerVisible = false;
    this.validation=true;
    this.DocAndDetDrawerClose();
  }

  folderName = "outstandingVicePresident";
  photo1Str: string;
  fileURL1: any;
  onFileSelected1(event: any) {
    if (event.target.files[0].type == 'application/pdf') {
      this.data.DOCUMENTS = <File>event.target.files[0];
    } else {
      this.message.error('Please Choose Only PDF File', '');
      this.data.DOCUMENTS = null;
    }
  }
  clear1() {
    this.fileURL1 = null;
    this.data.DOCUMENTS = '';
  }


}
