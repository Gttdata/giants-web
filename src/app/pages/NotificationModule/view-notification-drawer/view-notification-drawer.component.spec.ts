import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNotificationDrawerComponent } from './view-notification-drawer.component';

describe('ViewNotificationDrawerComponent', () => {
  let component: ViewNotificationDrawerComponent;
  let fixture: ComponentFixture<ViewNotificationDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewNotificationDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewNotificationDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
