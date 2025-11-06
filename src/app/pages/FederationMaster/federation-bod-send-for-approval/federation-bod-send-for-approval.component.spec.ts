import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FederationBodSendForApprovalComponent } from './federation-bod-send-for-approval.component';

describe('FederationBodSendForApprovalComponent', () => {
  let component: FederationBodSendForApprovalComponent;
  let fixture: ComponentFixture<FederationBodSendForApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FederationBodSendForApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FederationBodSendForApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
