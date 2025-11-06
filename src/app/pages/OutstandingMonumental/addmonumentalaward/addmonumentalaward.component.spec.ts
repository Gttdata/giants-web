import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmonumentalawardComponent } from './addmonumentalaward.component';

describe('AddmonumentalawardComponent', () => {
  let component: AddmonumentalawardComponent;
  let fixture: ComponentFixture<AddmonumentalawardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddmonumentalawardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmonumentalawardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
