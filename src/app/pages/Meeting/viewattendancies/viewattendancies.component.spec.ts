import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewattendanciesComponent } from './viewattendancies.component';

describe('ViewattendanciesComponent', () => {
  let component: ViewattendanciesComponent;
  let fixture: ComponentFixture<ViewattendanciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewattendanciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewattendanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
