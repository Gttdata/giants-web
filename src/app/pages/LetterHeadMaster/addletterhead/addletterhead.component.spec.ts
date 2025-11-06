import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddletterheadComponent } from './addletterhead.component';

describe('AddletterheadComponent', () => {
  let component: AddletterheadComponent;
  let fixture: ComponentFixture<AddletterheadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddletterheadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddletterheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
