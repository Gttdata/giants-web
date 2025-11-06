import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FederationMasterComponent } from './federation-master.component';

describe('FederationMasterComponent', () => {
  let component: FederationMasterComponent;
  let fixture: ComponentFixture<FederationMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FederationMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FederationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
