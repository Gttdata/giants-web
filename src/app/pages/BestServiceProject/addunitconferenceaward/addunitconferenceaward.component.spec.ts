import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddunitconferenceawardComponent } from './addunitconferenceaward.component';

describe('AddunitconferenceawardComponent', () => {
  let component: AddunitconferenceawardComponent;
  let fixture: ComponentFixture<AddunitconferenceawardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddunitconferenceawardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddunitconferenceawardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
