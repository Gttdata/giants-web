import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPaymentDrawerComponent } from './member-payment-drawer.component';

describe('MemberPaymentDrawerComponent', () => {
  let component: MemberPaymentDrawerComponent;
  let fixture: ComponentFixture<MemberPaymentDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberPaymentDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberPaymentDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
