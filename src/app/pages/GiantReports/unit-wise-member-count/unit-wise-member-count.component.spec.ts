import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitWiseMemberCountComponent } from './unit-wise-member-count.component';

describe('UnitWiseMemberCountComponent', () => {
  let component: UnitWiseMemberCountComponent;
  let fixture: ComponentFixture<UnitWiseMemberCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitWiseMemberCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitWiseMemberCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
