import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemFeesMasterComponent } from './system-fees-master.component';

describe('SystemFeesMasterComponent', () => {
  let component: SystemFeesMasterComponent;
  let fixture: ComponentFixture<SystemFeesMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemFeesMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemFeesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
