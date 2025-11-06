import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocAndDetailsDraweComponent } from './doc-and-details-drawe.component';

describe('DocAndDetailsDraweComponent', () => {
  let component: DocAndDetailsDraweComponent;
  let fixture: ComponentFixture<DocAndDetailsDraweComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocAndDetailsDraweComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocAndDetailsDraweComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
