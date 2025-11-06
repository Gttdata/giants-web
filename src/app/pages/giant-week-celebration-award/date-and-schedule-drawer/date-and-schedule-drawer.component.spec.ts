import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateAndScheduleDrawerComponent } from './date-and-schedule-drawer.component';

describe('DateAndScheduleDrawerComponent', () => {
  let component: DateAndScheduleDrawerComponent;
  let fixture: ComponentFixture<DateAndScheduleDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateAndScheduleDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateAndScheduleDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
