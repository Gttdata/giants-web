import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMasterTilesComponent } from './group-master-tiles.component';

describe('GroupMasterTilesComponent', () => {
  let component: GroupMasterTilesComponent;
  let fixture: ComponentFixture<GroupMasterTilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMasterTilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMasterTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
