import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUnitMembersComponent } from './manage-unit-members.component';

describe('ManageUnitMembersComponent', () => {
  let component: ManageUnitMembersComponent;
  let fixture: ComponentFixture<ManageUnitMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageUnitMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUnitMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
