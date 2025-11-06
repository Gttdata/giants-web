import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMemberDrawerComponent } from './new-member-drawer.component';

describe('NewMemberDrawerComponent', () => {
  let component: NewMemberDrawerComponent;
  let fixture: ComponentFixture<NewMemberDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewMemberDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewMemberDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
