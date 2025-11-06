import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularreportComponent } from './circularreport.component';

describe('CircularreportComponent', () => {
  let component: CircularreportComponent;
  let fixture: ComponentFixture<CircularreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircularreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircularreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
