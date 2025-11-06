import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmediatePastTitleDrawerComponent } from './immediate-past-title-drawer.component';

describe('ImmediatePastTitleDrawerComponent', () => {
  let component: ImmediatePastTitleDrawerComponent;
  let fixture: ComponentFixture<ImmediatePastTitleDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImmediatePastTitleDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImmediatePastTitleDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
