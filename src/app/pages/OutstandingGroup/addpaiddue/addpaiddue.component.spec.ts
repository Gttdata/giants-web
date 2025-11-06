import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddpaiddueComponent } from './addpaiddue.component';

describe('AddpaiddueComponent', () => {
  let component: AddpaiddueComponent;
  let fixture: ComponentFixture<AddpaiddueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddpaiddueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddpaiddueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
