import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupmeetingsattendanceComponent } from './groupmeetingsattendance.component';

describe('GroupmeetingsattendanceComponent', () => {
  let component: GroupmeetingsattendanceComponent;
  let fixture: ComponentFixture<GroupmeetingsattendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupmeetingsattendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupmeetingsattendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
