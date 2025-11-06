import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmediacoveringsComponent } from './addmediacoverings.component';

describe('AddmediacoveringsComponent', () => {
  let component: AddmediacoveringsComponent;
  let fixture: ComponentFixture<AddmediacoveringsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddmediacoveringsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmediacoveringsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
