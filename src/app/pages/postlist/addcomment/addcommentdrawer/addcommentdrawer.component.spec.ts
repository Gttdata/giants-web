import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcommentdrawerComponent } from './addcommentdrawer.component';

describe('AddcommentdrawerComponent', () => {
  let component: AddcommentdrawerComponent;
  let fixture: ComponentFixture<AddcommentdrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddcommentdrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddcommentdrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
