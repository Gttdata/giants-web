import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEmailDrawerComponent } from './send-email-drawer.component';

describe('SendEmailDrawerComponent', () => {
  let component: SendEmailDrawerComponent;
  let fixture: ComponentFixture<SendEmailDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendEmailDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendEmailDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
