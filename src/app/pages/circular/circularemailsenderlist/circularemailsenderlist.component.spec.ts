import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularemailsenderlistComponent } from './circularemailsenderlist.component';

describe('CircularemailsenderlistComponent', () => {
  let component: CircularemailsenderlistComponent;
  let fixture: ComponentFixture<CircularemailsenderlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircularemailsenderlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircularemailsenderlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
