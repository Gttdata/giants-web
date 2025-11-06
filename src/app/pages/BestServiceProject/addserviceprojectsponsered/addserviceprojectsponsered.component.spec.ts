import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddserviceprojectsponseredComponent } from './addserviceprojectsponsered.component';

describe('AddserviceprojectsponseredComponent', () => {
  let component: AddserviceprojectsponseredComponent;
  let fixture: ComponentFixture<AddserviceprojectsponseredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddserviceprojectsponseredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddserviceprojectsponseredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
