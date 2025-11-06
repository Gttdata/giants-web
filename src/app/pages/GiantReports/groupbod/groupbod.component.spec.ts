import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupbodComponent } from './groupbod.component';

describe('GroupbodComponent', () => {
  let component: GroupbodComponent;
  let fixture: ComponentFixture<GroupbodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupbodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupbodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
