import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectExpensesDrawerComponent } from './project-expenses-drawer.component';

describe('ProjectExpensesDrawerComponent', () => {
  let component: ProjectExpensesDrawerComponent;
  let fixture: ComponentFixture<ProjectExpensesDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectExpensesDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectExpensesDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
