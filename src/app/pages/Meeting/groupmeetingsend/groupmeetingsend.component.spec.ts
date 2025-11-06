import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupmeetingsendComponent } from './groupmeetingsend.component';

describe('GroupmeetingsendComponent', () => {
  let component: GroupmeetingsendComponent;
  let fixture: ComponentFixture<GroupmeetingsendComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupmeetingsendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupmeetingsendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
