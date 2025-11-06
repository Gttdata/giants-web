import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupFeeTypeComponent } from './group-fee-type.component';

describe('GroupFeeTypeComponent', () => {
  let component: GroupFeeTypeComponent;
  let fixture: ComponentFixture<GroupFeeTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupFeeTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupFeeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
