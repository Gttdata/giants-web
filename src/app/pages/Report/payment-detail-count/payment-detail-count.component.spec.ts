import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailCountComponent } from './payment-detail-count.component';

describe('PaymentDetailCountComponent', () => {
  let component: PaymentDetailCountComponent;
  let fixture: ComponentFixture<PaymentDetailCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentDetailCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDetailCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
