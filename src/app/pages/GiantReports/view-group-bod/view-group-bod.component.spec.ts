import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGroupBodComponent } from './view-group-bod.component';

describe('ViewGroupBodComponent', () => {
  let component: ViewGroupBodComponent;
  let fixture: ComponentFixture<ViewGroupBodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGroupBodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGroupBodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
