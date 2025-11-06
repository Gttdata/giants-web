import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddprojectundertakenComponent } from './addprojectundertaken.component';

describe('AddprojectundertakenComponent', () => {
  let component: AddprojectundertakenComponent;
  let fixture: ComponentFixture<AddprojectundertakenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddprojectundertakenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddprojectundertakenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
