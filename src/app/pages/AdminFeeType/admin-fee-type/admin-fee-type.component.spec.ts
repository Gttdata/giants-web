import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFeeTypeComponent } from './admin-fee-type.component';

describe('AdminFeeTypeComponent', () => {
  let component: AdminFeeTypeComponent;
  let fixture: ComponentFixture<AdminFeeTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFeeTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFeeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
