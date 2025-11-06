import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlySummaryReportComponent } from './monthly-summary-report.component';

describe('MonthlySummaryReportComponent', () => {
  let component: MonthlySummaryReportComponent;
  let fixture: ComponentFixture<MonthlySummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlySummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlySummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
