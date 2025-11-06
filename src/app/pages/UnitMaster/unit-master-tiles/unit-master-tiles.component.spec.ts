import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitMasterTilesComponent } from './unit-master-tiles.component';

describe('UnitMasterTilesComponent', () => {
  let component: UnitMasterTilesComponent;
  let fixture: ComponentFixture<UnitMasterTilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitMasterTilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitMasterTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
