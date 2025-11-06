import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpressclippingComponent } from './addpressclipping.component';

describe('AddpressclippingComponent', () => {
  let component: AddpressclippingComponent;
  let fixture: ComponentFixture<AddpressclippingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddpressclippingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpressclippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
