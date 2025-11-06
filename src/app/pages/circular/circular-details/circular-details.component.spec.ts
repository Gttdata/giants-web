import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularDetailsComponent } from './circular-details.component';

describe('CircularDetailsComponent', () => {
  let component: CircularDetailsComponent;
  let fixture: ComponentFixture<CircularDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircularDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircularDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
