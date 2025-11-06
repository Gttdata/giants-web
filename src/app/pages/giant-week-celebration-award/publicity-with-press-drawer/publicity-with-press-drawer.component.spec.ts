import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicityWithPressDrawerComponent } from './publicity-with-press-drawer.component';

describe('PublicityWithPressDrawerComponent', () => {
  let component: PublicityWithPressDrawerComponent;
  let fixture: ComponentFixture<PublicityWithPressDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicityWithPressDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicityWithPressDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
