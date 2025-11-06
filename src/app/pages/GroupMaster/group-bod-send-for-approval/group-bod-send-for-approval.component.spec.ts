import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupBodSendForApprovalComponent } from './group-bod-send-for-approval.component';

describe('GroupBodSendForApprovalComponent', () => {
  let component: GroupBodSendForApprovalComponent;
  let fixture: ComponentFixture<GroupBodSendForApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupBodSendForApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupBodSendForApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
