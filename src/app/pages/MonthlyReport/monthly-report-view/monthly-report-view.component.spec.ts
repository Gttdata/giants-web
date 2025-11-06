import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyReportViewComponent } from './monthly-report-view.component';

describe('MonthlyReportViewComponent', () => {
  let component: MonthlyReportViewComponent;
  let fixture: ComponentFixture<MonthlyReportViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyReportViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyReportViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
