import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcontinuingprojectsComponent } from './addcontinuingprojects.component';

describe('AddcontinuingprojectsComponent', () => {
  let component: AddcontinuingprojectsComponent;
  let fixture: ComponentFixture<AddcontinuingprojectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcontinuingprojectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcontinuingprojectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
