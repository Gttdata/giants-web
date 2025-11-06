import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFeeTypeDrawerComponent } from './admin-fee-type-drawer.component';

describe('AdminFeeTypeDrawerComponent', () => {
  let component: AdminFeeTypeDrawerComponent;
  let fixture: ComponentFixture<AdminFeeTypeDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminFeeTypeDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFeeTypeDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
