import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardBiddingComponent } from './award-bidding.component';

describe('AwardBiddingComponent', () => {
  let component: AwardBiddingComponent;
  let fixture: ComponentFixture<AwardBiddingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardBiddingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardBiddingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
