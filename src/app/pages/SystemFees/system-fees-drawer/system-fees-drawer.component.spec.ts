import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemFeesDrawerComponent } from './system-fees-drawer.component';

describe('SystemFeesDrawerComponent', () => {
  let component: SystemFeesDrawerComponent;
  let fixture: ComponentFixture<SystemFeesDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemFeesDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemFeesDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
