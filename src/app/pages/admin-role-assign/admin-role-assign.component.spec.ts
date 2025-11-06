import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoleAssignComponent } from './admin-role-assign.component';

describe('AdminRoleAssignComponent', () => {
  let component: AdminRoleAssignComponent;
  let fixture: ComponentFixture<AdminRoleAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRoleAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRoleAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
