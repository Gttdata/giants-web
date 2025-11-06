import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDrawerComponent } from './group-drawer.component';

describe('GroupDrawerComponent', () => {
  let component: GroupDrawerComponent;
  let fixture: ComponentFixture<GroupDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
