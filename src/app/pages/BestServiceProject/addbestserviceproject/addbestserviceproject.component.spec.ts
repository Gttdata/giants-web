import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbestserviceprojectComponent } from './addbestserviceproject.component';

describe('AddbestserviceprojectComponent', () => {
  let component: AddbestserviceprojectComponent;
  let fixture: ComponentFixture<AddbestserviceprojectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddbestserviceprojectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbestserviceprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
