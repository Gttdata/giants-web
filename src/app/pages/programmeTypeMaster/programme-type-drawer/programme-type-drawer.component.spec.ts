import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgrammeTypeDrawerComponent } from './programme-type-drawer.component';

describe('ProgrammeTypeDrawerComponent', () => {
  let component: ProgrammeTypeDrawerComponent;
  let fixture: ComponentFixture<ProgrammeTypeDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgrammeTypeDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgrammeTypeDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
