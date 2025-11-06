import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterheadlistComponent } from './letterheadlist.component';

describe('LetterheadlistComponent', () => {
  let component: LetterheadlistComponent;
  let fixture: ComponentFixture<LetterheadlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterheadlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterheadlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
