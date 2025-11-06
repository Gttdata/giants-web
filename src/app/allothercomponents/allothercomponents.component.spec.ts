import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllothercomponentsComponent } from './allothercomponents.component';

describe('AllothercomponentsComponent', () => {
  let component: AllothercomponentsComponent;
  let fixture: ComponentFixture<AllothercomponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllothercomponentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllothercomponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
