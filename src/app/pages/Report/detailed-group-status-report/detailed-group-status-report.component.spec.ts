import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedGroupStatusReportComponent } from './detailed-group-status-report.component';

describe('DetailedGroupStatusReportComponent', () => {
  let component: DetailedGroupStatusReportComponent;
  let fixture: ComponentFixture<DetailedGroupStatusReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedGroupStatusReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedGroupStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
