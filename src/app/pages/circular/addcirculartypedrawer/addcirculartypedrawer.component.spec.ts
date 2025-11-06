import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcirculartypedrawerComponent } from './addcirculartypedrawer.component';

describe('AddcirculartypedrawerComponent', () => {
  let component: AddcirculartypedrawerComponent;
  let fixture: ComponentFixture<AddcirculartypedrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcirculartypedrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcirculartypedrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
