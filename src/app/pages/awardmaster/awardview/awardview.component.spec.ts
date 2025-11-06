import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardviewComponent } from './awardview.component';

describe('AwardviewComponent', () => {
  let component: AwardviewComponent;
  let fixture: ComponentFixture<AwardviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
