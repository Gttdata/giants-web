import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupWiseMemberCountComponent } from './group-wise-member-count.component';

describe('GroupWiseMemberCountComponent', () => {
  let component: GroupWiseMemberCountComponent;
  let fixture: ComponentFixture<GroupWiseMemberCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupWiseMemberCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupWiseMemberCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
