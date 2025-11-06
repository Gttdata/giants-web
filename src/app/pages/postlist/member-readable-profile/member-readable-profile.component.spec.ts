import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberReadableProfileComponent } from './member-readable-profile.component';

describe('MemberReadableProfileComponent', () => {
  let component: MemberReadableProfileComponent;
  let fixture: ComponentFixture<MemberReadableProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberReadableProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberReadableProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
