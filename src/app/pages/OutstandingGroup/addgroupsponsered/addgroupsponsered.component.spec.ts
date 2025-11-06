import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddgroupsponseredComponent } from './addgroupsponsered.component';

describe('AddgroupsponseredComponent', () => {
  let component: AddgroupsponseredComponent;
  let fixture: ComponentFixture<AddgroupsponseredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddgroupsponseredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddgroupsponseredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
