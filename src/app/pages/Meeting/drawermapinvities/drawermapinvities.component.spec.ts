import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawermapinvitiesComponent } from './drawermapinvities.component';

describe('DrawermapinvitiesComponent', () => {
  let component: DrawermapinvitiesComponent;
  let fixture: ComponentFixture<DrawermapinvitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawermapinvitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawermapinvitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
