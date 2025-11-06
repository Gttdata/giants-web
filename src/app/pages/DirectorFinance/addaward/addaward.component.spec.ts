import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddawardComponent } from './addaward.component';

describe('AddawardComponent', () => {
  let component: AddawardComponent;
  let fixture: ComponentFixture<AddawardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddawardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddawardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
