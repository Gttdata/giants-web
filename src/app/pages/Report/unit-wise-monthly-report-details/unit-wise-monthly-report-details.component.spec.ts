import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitWiseMonthlyReportDetailsComponent } from './unit-wise-monthly-report-details.component';

describe('UnitWiseMonthlyReportDetailsComponent', () => {
  let component: UnitWiseMonthlyReportDetailsComponent;
  let fixture: ComponentFixture<UnitWiseMonthlyReportDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitWiseMonthlyReportDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitWiseMonthlyReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
