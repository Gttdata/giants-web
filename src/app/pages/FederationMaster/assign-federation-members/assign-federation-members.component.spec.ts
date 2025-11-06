import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignFederationMembersComponent } from './assign-federation-members.component';

describe('AssignFederationMembersComponent', () => {
  let component: AssignFederationMembersComponent;
  let fixture: ComponentFixture<AssignFederationMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignFederationMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignFederationMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
