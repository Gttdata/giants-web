import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LadyMemberAwardComponent } from './lady-member-award.component';

describe('LadyMemberAwardComponent', () => {
  let component: LadyMemberAwardComponent;
  let fixture: ComponentFixture<LadyMemberAwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LadyMemberAwardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LadyMemberAwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
