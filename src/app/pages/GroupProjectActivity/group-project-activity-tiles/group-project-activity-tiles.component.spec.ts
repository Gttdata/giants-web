import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupProjectActivityTilesComponent } from './group-project-activity-tiles.component';

describe('GroupProjectActivityTilesComponent', () => {
  let component: GroupProjectActivityTilesComponent;
  let fixture: ComponentFixture<GroupProjectActivityTilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupProjectActivityTilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupProjectActivityTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
