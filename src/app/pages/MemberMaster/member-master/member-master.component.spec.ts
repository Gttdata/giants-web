import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberMasterComponent } from './member-master.component';

describe('MemberMasterComponent', () => {
  let component: MemberMasterComponent;
  let fixture: ComponentFixture<MemberMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
