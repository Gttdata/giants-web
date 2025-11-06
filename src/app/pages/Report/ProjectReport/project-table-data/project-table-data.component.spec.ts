import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTableDataComponent } from './project-table-data.component';

describe('ProjectTableDataComponent', () => {
  let component: ProjectTableDataComponent;
  let fixture: ComponentFixture<ProjectTableDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectTableDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTableDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
