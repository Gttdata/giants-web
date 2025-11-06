import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyReportSubmissionComponent } from './monthly-report-submission.component';

describe('MonthlyReportSubmissionComponent', () => {
  let component: MonthlyReportSubmissionComponent;
  let fixture: ComponentFixture<MonthlyReportSubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyReportSubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyReportSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
