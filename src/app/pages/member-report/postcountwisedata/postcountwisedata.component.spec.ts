import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostcountwisedataComponent } from './postcountwisedata.component';

describe('PostcountwisedataComponent', () => {
  let component: PostcountwisedataComponent;
  let fixture: ComponentFixture<PostcountwisedataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostcountwisedataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostcountwisedataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
