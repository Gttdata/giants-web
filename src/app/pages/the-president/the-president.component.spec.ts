import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThePresidentComponent } from './the-president.component';

describe('ThePresidentComponent', () => {
  let component: ThePresidentComponent;
  let fixture: ComponentFixture<ThePresidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThePresidentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThePresidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
