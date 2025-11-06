import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberspaymentdetailsComponent } from './memberspaymentdetails.component';

describe('MemberspaymentdetailsComponent', () => {
  let component: MemberspaymentdetailsComponent;
  let fixture: ComponentFixture<MemberspaymentdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberspaymentdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberspaymentdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
