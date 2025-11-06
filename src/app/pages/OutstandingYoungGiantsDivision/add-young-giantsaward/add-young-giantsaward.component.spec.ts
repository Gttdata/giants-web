import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddYoungGiantsawardComponent } from './add-young-giantsaward.component';

describe('AddYoungGiantsawardComponent', () => {
  let component: AddYoungGiantsawardComponent;
  let fixture: ComponentFixture<AddYoungGiantsawardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddYoungGiantsawardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddYoungGiantsawardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
