import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupFeeTypeDrawerComponent } from './group-fee-type-drawer.component';

describe('GroupFeeTypeDrawerComponent', () => {
  let component: GroupFeeTypeDrawerComponent;
  let fixture: ComponentFixture<GroupFeeTypeDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupFeeTypeDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupFeeTypeDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
