import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDuringServiceDrawerComponent } from './project-during-service-drawer.component';

describe('ProjectDuringServiceDrawerComponent', () => {
  let component: ProjectDuringServiceDrawerComponent;
  let fixture: ComponentFixture<ProjectDuringServiceDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectDuringServiceDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDuringServiceDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
