import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGroupMeetingAttendiesComponent } from './view-group-meeting-attendies.component';

describe('ViewGroupMeetingAttendiesComponent', () => {
  let component: ViewGroupMeetingAttendiesComponent;
  let fixture: ComponentFixture<ViewGroupMeetingAttendiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGroupMeetingAttendiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGroupMeetingAttendiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
