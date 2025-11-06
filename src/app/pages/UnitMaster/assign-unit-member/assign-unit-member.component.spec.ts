import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignUnitMemberComponent } from './assign-unit-member.component';

describe('AssignUnitMemberComponent', () => {
  let component: AssignUnitMemberComponent;
  let fixture: ComponentFixture<AssignUnitMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignUnitMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignUnitMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
