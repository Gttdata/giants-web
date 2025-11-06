import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventLikeDrawerComponent } from './event-like-drawer.component';

describe('EventLikeDrawerComponent', () => {
  let component: EventLikeDrawerComponent;
  let fixture: ComponentFixture<EventLikeDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventLikeDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventLikeDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
