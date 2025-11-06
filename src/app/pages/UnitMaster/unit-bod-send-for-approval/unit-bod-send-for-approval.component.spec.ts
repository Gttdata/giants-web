import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitBodSendForApprovalComponent } from './unit-bod-send-for-approval.component';

describe('UnitBodSendForApprovalComponent', () => {
  let component: UnitBodSendForApprovalComponent;
  let fixture: ComponentFixture<UnitBodSendForApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitBodSendForApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitBodSendForApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
