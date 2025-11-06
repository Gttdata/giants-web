import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLadyMemberComponent } from './new-lady-member.component';

describe('NewLadyMemberComponent', () => {
  let component: NewLadyMemberComponent;
  let fixture: ComponentFixture<NewLadyMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewLadyMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewLadyMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
