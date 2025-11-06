import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmediatePastPresidentComponent } from './immediate-past-president.component';

describe('ImmediatePastPresidentComponent', () => {
  let component: ImmediatePastPresidentComponent;
  let fixture: ComponentFixture<ImmediatePastPresidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImmediatePastPresidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImmediatePastPresidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
