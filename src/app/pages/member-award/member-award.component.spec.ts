import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberAwardComponent } from './member-award.component';

describe('MemberAwardComponent', () => {
  let component: MemberAwardComponent;
  let fixture: ComponentFixture<MemberAwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberAwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberAwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
