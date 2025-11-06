import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUnitBodComponent } from './view-unit-bod.component';

describe('ViewUnitBodComponent', () => {
  let component: ViewUnitBodComponent;
  let fixture: ComponentFixture<ViewUnitBodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUnitBodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUnitBodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
