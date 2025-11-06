import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyDetailReportComponent } from './monthly-detail-report.component';

describe('MonthlyDetailReportComponent', () => {
  let component: MonthlyDetailReportComponent;
  let fixture: ComponentFixture<MonthlyDetailReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyDetailReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
