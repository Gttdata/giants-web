import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcircularComponent } from './addcircular.component';

describe('AddcircularComponent', () => {
  let component: AddcircularComponent;
  let fixture: ComponentFixture<AddcircularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcircularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcircularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
