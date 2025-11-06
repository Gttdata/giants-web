import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberWiseSummaryComponent } from './member-wise-summary.component';

describe('MemberWiseSummaryComponent', () => {
  let component: MemberWiseSummaryComponent;
  let fixture: ComponentFixture<MemberWiseSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberWiseSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberWiseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
