import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerAccessorLoginComponent } from './trainer-accessor-login.component';

describe('TrainerAccessorLoginComponent', () => {
  let component: TrainerAccessorLoginComponent;
  let fixture: ComponentFixture<TrainerAccessorLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainerAccessorLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainerAccessorLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
