import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitDrawerComponent } from './unit-drawer.component';

describe('UnitDrawerComponent', () => {
  let component: UnitDrawerComponent;
  let fixture: ComponentFixture<UnitDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
