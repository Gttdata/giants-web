import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordDrawerComponent } from './change-password-drawer.component';

describe('ChangePasswordDrawerComponent', () => {
  let component: ChangePasswordDrawerComponent;
  let fixture: ComponentFixture<ChangePasswordDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasswordDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
