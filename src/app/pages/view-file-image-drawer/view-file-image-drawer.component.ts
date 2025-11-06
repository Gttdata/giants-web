import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from 'src/app/Service/api.service';

@Component({
  selector: 'app-view-file-image-drawer',
  templateUrl: './view-file-image-drawer.component.html',
  styleUrls: ['./view-file-image-drawer.component.css']
})

export class ViewFileImageDrawerComponent implements OnInit {
  @Input() files: any[] = [];
  @Input() sanitizedLink: any;

  constructor(private sanitizer: DomSanitizer, private _api: ApiService) { }

  ngOnInit() { }

  ngOnChanges() {
    // console.log(this.files);
    // console.log(this.sanitizedLink);
  }

  getSanitizedURL(fileURL: string): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
  }
}
