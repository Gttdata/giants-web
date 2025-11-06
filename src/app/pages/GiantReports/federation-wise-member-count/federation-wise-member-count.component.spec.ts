import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FederationWiseMemberCountComponent } from './federation-wise-member-count.component';

describe('FederationWiseMemberCountComponent', () => {
  let component: FederationWiseMemberCountComponent;
  let fixture: ComponentFixture<FederationWiseMemberCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FederationWiseMemberCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FederationWiseMemberCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
