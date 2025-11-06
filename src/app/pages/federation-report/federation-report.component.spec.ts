import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FederationReportComponent } from './federation-report.component';

describe('FederationReportComponent', () => {
  let component: FederationReportComponent;
  let fixture: ComponentFixture<FederationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FederationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FederationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
