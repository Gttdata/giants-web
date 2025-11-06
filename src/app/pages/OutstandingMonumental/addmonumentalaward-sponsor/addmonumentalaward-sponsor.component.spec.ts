import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmonumentalawardSponsorComponent } from './addmonumentalaward-sponsor.component';

describe('AddmonumentalawardSponsorComponent', () => {
  let component: AddmonumentalawardSponsorComponent;
  let fixture: ComponentFixture<AddmonumentalawardSponsorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddmonumentalawardSponsorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmonumentalawardSponsorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
