import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveGroupComponent } from './approve-group.component';

describe('ApproveGroupComponent', () => {
  let component: ApproveGroupComponent;
  let fixture: ComponentFixture<ApproveGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
