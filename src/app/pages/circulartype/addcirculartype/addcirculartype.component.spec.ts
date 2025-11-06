import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcirculartypeComponent } from './addcirculartype.component';

describe('AddcirculartypeComponent', () => {
  let component: AddcirculartypeComponent;
  let fixture: ComponentFixture<AddcirculartypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcirculartypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcirculartypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
