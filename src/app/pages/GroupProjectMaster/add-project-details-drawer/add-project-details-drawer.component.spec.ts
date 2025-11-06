import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProjectDetailsDrawerComponent } from './add-project-details-drawer.component';

describe('AddProjectDetailsDrawerComponent', () => {
  let component: AddProjectDetailsDrawerComponent;
  let fixture: ComponentFixture<AddProjectDetailsDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProjectDetailsDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProjectDetailsDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
