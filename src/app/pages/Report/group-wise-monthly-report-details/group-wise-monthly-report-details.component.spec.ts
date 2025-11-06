import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupWiseMonthlyReportDetailsComponent } from './group-wise-monthly-report-details.component';

describe('GroupWiseMonthlyReportDetailsComponent', () => {
  let component: GroupWiseMonthlyReportDetailsComponent;
  let fixture: ComponentFixture<GroupWiseMonthlyReportDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupWiseMonthlyReportDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupWiseMonthlyReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
