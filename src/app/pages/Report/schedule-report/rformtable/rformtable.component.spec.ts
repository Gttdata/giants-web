import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RformtableComponent } from './rformtable.component';

describe('RformtableComponent', () => {
  let component: RformtableComponent;
  let fixture: ComponentFixture<RformtableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RformtableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RformtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
