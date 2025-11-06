import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupbiddinglistComponent } from './groupbiddinglist.component';

describe('GroupbiddinglistComponent', () => {
  let component: GroupbiddinglistComponent;
  let fixture: ComponentFixture<GroupbiddinglistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupbiddinglistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupbiddinglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
