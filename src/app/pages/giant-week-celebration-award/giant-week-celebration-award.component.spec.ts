import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiantWeekCelebrationAwardComponent } from './giant-week-celebration-award.component';

describe('GiantWeekCelebrationAwardComponent', () => {
  let component: GiantWeekCelebrationAwardComponent;
  let fixture: ComponentFixture<GiantWeekCelebrationAwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiantWeekCelebrationAwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiantWeekCelebrationAwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
