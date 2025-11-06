import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFederationMembersComponent } from './manage-federation-members.component';

describe('ManageFederationMembersComponent', () => {
  let component: ManageFederationMembersComponent;
  let fixture: ComponentFixture<ManageFederationMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageFederationMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageFederationMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
