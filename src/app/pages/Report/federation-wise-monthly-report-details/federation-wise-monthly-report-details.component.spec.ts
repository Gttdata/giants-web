import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FederationWiseMonthlyReportDetailsComponent } from './federation-wise-monthly-report-details.component';

describe('FederationWiseMonthlyReportDetailsComponent', () => {
  let component: FederationWiseMonthlyReportDetailsComponent;
  let fixture: ComponentFixture<FederationWiseMonthlyReportDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FederationWiseMonthlyReportDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FederationWiseMonthlyReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
