import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InchargeAreaDrawerComponent } from './incharge-area-drawer.component';

describe('InchargeAreaDrawerComponent', () => {
  let component: InchargeAreaDrawerComponent;
  let fixture: ComponentFixture<InchargeAreaDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InchargeAreaDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InchargeAreaDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
