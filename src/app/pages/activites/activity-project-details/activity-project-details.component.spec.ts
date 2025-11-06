import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityProjectDetailsComponent } from './activity-project-details.component';

describe('ActivityProjectDetailsComponent', () => {
  let component: ActivityProjectDetailsComponent;
  let fixture: ComponentFixture<ActivityProjectDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityProjectDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityProjectDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
