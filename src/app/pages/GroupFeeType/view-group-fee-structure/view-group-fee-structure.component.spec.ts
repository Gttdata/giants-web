import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGroupFeeStructureComponent } from './view-group-fee-structure.component';

describe('ViewGroupFeeStructureComponent', () => {
  let component: ViewGroupFeeStructureComponent;
  let fixture: ComponentFixture<ViewGroupFeeStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGroupFeeStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGroupFeeStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
