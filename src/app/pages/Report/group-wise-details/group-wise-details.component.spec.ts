import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupWiseDetailsComponent } from './group-wise-details.component';

describe('GroupWiseDetailsComponent', () => {
  let component: GroupWiseDetailsComponent;
  let fixture: ComponentFixture<GroupWiseDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupWiseDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupWiseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
