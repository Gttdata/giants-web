import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginLogoutLogsComponent } from './login-logout-logs.component';

describe('LoginLogoutLogsComponent', () => {
  let component: LoginLogoutLogsComponent;
  let fixture: ComponentFixture<LoginLogoutLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginLogoutLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginLogoutLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
