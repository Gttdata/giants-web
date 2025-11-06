import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastPresidentComponent } from './past-president.component';

describe('PastPresidentComponent', () => {
  let component: PastPresidentComponent;
  let fixture: ComponentFixture<PastPresidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastPresidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastPresidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
