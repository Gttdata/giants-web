import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-video-manual-drawer',
  templateUrl: './video-manual-drawer.component.html',
  styleUrls: ['./video-manual-drawer.component.css']
})

export class VideoManualDrawerComponent implements OnInit {
  @Input() closeCallback: Function;

  constructor() { }

  ngOnInit() { }

  close() {
    this.closeCallback();
  }

  goToFirstVideo() {
    window.open("https://youtu.be/2vy8Pdlfcp0");
  }

  goToSecondVideo() {
    window.open("https://youtu.be/zDxxKvzyoeI");
  }

  goToThirdVideo() {
    window.open("https://youtu.be/9rpu27QuQ-c");
  }

  goToForthVideo() {
    window.open("https://youtu.be/qKRhUo7HXAA");
  }

  goToFifthVideo() {
    window.open("https://youtu.be/3biLhbZLL8s");
  }

  goToSixthVideo() {
    window.open("https://youtu.be/DlxmWvZpdSk");
  }

  goToSeventhVideo() {
    window.open("https://youtu.be/NJ7viKhrIKI");
  }

  goToEighthVideo() {
    window.open("https://youtu.be/DPA23Ud9gC8");
  }

  goToNinthVideo() {
    window.open("https://youtu.be/0TI8c8P7Jds");
  }

  goToTenthVideo() {
    window.open("https://youtu.be/A07vdGjyeiI");
  }

  goTo11thVideo() {
    window.open("https://youtu.be/2KGry1Z-Lvk");
  }

  goTo12thVideo() {
    window.open("https://youtu.be/nPv-qk-o3Ww");
  }

  goTo13thVideo() {
    window.open("https://youtu.be/VszsNG5hysE");
  }

  goTo14thVideo() {
    window.open("https://youtu.be/6Uf8UZf31qo");
  }

  goTo15thVideo() {
    window.open("https://youtu.be/pdJan61cqCQ");
  }

  goToHowToLogin() {
    window.open("https://youtu.be/sWmtOdIXxTY");
  }
}
