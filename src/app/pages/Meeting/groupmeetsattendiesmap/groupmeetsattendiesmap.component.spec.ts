import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupmeetsattendiesmapComponent } from './groupmeetsattendiesmap.component';

describe('GroupmeetsattendiesmapComponent', () => {
  let component: GroupmeetsattendiesmapComponent;
  let fixture: ComponentFixture<GroupmeetsattendiesmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupmeetsattendiesmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupmeetsattendiesmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
