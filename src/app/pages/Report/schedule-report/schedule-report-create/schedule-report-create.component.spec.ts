import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleReportCreateComponent } from './schedule-report-create.component';

describe('ScheduleReportCreateComponent', () => {
  let component: ScheduleReportCreateComponent;
  let fixture: ComponentFixture<ScheduleReportCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleReportCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleReportCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
