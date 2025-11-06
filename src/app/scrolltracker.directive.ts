import { Directive, EventEmitter, HostListener, Output, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appScrolltracker]'
})
export class ScrolltrackerDirective {
  @Output() scrollingFinished = new EventEmitter<void>();

  emitted = false;
  private domElement: HTMLElement;
  constructor(private elementRef: ElementRef) {
    this.domElement = this.elementRef.nativeElement as HTMLElement
  }
  @HostListener('document:wheel', ['$event'])
  onScroll(e: any) {
    if ((document.getElementById("outerItem").scrollTop +document.getElementById("outerItem").offsetHeight ) >= document.getElementById("outerItem").scrollHeight && !this.emitted) {
      this.emitted = true;
      this.scrollingFinished.emit();
    } else if ((document.getElementById("outerItem").scrollTop +document.getElementById("outerItem").offsetHeight ) < document.getElementById("outerItem").scrollHeight) {
      this.emitted = false;
    }
  }

}
