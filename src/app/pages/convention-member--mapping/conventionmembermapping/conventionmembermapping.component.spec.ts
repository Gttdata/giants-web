import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConventionmembermappingComponent } from './conventionmembermapping.component';

describe('ConventionmembermappingComponent', () => {
  let component: ConventionmembermappingComponent;
  let fixture: ComponentFixture<ConventionmembermappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConventionmembermappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConventionmembermappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
