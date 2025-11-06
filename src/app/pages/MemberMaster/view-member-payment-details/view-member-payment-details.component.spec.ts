import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMemberPaymentDetailsComponent } from './view-member-payment-details.component';

describe('ViewMemberPaymentDetailsComponent', () => {
  let component: ViewMemberPaymentDetailsComponent;
  let fixture: ComponentFixture<ViewMemberPaymentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMemberPaymentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMemberPaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
