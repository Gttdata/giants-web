import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawermonthlyreportsubmissionComponent } from './drawermonthlyreportsubmission.component';

describe('DrawermonthlyreportsubmissionComponent', () => {
  let component: DrawermonthlyreportsubmissionComponent;
  let fixture: ComponentFixture<DrawermonthlyreportsubmissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawermonthlyreportsubmissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawermonthlyreportsubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
