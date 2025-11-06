import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupProjectActivityAttendanceDrawerComponent } from './group-project-activity-attendance-drawer.component';

describe('GroupProjectActivityAttendanceDrawerComponent', () => {
  let component: GroupProjectActivityAttendanceDrawerComponent;
  let fixture: ComponentFixture<GroupProjectActivityAttendanceDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupProjectActivityAttendanceDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupProjectActivityAttendanceDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
