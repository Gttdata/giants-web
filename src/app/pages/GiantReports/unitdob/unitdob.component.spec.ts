import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitdobComponent } from './unitdob.component';

describe('UnitdobComponent', () => {
  let component: UnitdobComponent;
  let fixture: ComponentFixture<UnitdobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitdobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitdobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
