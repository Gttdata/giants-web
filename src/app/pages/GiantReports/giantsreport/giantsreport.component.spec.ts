import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiantsreportComponent } from './giantsreport.component';

describe('GiantsreportComponent', () => {
  let component: GiantsreportComponent;
  let fixture: ComponentFixture<GiantsreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiantsreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiantsreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
