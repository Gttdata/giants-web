import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignGroupMemberComponent } from './assign-group-member.component';

describe('AssignGroupMemberComponent', () => {
  let component: AssignGroupMemberComponent;
  let fixture: ComponentFixture<AssignGroupMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignGroupMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignGroupMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
