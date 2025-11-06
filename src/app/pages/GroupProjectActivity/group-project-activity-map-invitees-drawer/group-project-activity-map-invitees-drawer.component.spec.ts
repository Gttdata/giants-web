import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupProjectActivityMapInviteesDrawerComponent } from './group-project-activity-map-invitees-drawer.component';

describe('GroupProjectActivityMapInviteesDrawerComponent', () => {
  let component: GroupProjectActivityMapInviteesDrawerComponent;
  let fixture: ComponentFixture<GroupProjectActivityMapInviteesDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupProjectActivityMapInviteesDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupProjectActivityMapInviteesDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
