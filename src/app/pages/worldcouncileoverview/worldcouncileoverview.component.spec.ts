import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldcouncileoverviewComponent } from './worldcouncileoverview.component';

describe('WorldcouncileoverviewComponent', () => {
  let component: WorldcouncileoverviewComponent;
  let fixture: ComponentFixture<WorldcouncileoverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorldcouncileoverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldcouncileoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
