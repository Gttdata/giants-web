import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularcountwisedataComponent } from './circularcountwisedata.component';

describe('CircularcountwisedataComponent', () => {
  let component: CircularcountwisedataComponent;
  let fixture: ComponentFixture<CircularcountwisedataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircularcountwisedataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircularcountwisedataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
