import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentApprovalByAdminComponent } from './payment-approval-by-admin.component';

describe('PaymentApprovalByAdminComponent', () => {
  let component: PaymentApprovalByAdminComponent;
  let fixture: ComponentFixture<PaymentApprovalByAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentApprovalByAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentApprovalByAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
