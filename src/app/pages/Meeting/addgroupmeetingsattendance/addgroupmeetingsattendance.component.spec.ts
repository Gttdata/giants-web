import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddgroupmeetingsattendanceComponent } from './addgroupmeetingsattendance.component';

describe('AddgroupmeetingsattendanceComponent', () => {
  let component: AddgroupmeetingsattendanceComponent;
  let fixture: ComponentFixture<AddgroupmeetingsattendanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddgroupmeetingsattendanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddgroupmeetingsattendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
