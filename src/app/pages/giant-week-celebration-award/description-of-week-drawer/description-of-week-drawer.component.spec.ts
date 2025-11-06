import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionOfWeekDrawerComponent } from './description-of-week-drawer.component';

describe('DescriptionOfWeekDrawerComponent', () => {
  let component: DescriptionOfWeekDrawerComponent;
  let fixture: ComponentFixture<DescriptionOfWeekDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptionOfWeekDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionOfWeekDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
