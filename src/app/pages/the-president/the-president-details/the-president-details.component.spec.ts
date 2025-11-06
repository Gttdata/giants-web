import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThePresidentDetailsComponent } from './the-president-details.component';

describe('ThePresidentDetailsComponent', () => {
  let component: ThePresidentDetailsComponent;
  let fixture: ComponentFixture<ThePresidentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThePresidentDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThePresidentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
