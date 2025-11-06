import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerawardComponent } from './draweraward.component';

describe('DrawerawardComponent', () => {
  let component: DrawerawardComponent;
  let fixture: ComponentFixture<DrawerawardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawerawardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerawardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
