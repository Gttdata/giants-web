import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewNotificationDrawerComponent } from './add-new-notification-drawer.component';

describe('AddNewNotificationDrawerComponent', () => {
  let component: AddNewNotificationDrawerComponent;
  let fixture: ComponentFixture<AddNewNotificationDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewNotificationDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewNotificationDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
