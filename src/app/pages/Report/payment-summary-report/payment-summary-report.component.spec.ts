import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSummaryReportComponent } from './payment-summary-report.component';

describe('PaymentSummaryReportComponent', () => {
  let component: PaymentSummaryReportComponent;
  let fixture: ComponentFixture<PaymentSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
