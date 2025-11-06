import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupProjectActivityDrawerComponent } from './group-project-activity-drawer.component';

describe('GroupProjectActivityDrawerComponent', () => {
  let component: GroupProjectActivityDrawerComponent;
  let fixture: ComponentFixture<GroupProjectActivityDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupProjectActivityDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupProjectActivityDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
