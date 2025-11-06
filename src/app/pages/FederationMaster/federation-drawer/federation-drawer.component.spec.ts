import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FederationDrawerComponent } from './federation-drawer.component';

describe('FederationDrawerComponent', () => {
  let component: FederationDrawerComponent;
  let fixture: ComponentFixture<FederationDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FederationDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FederationDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
