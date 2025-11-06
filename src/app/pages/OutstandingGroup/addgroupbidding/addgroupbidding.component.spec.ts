import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddgroupbiddingComponent } from './addgroupbidding.component';

describe('AddgroupbiddingComponent', () => {
  let component: AddgroupbiddingComponent;
  let fixture: ComponentFixture<AddgroupbiddingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddgroupbiddingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddgroupbiddingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
