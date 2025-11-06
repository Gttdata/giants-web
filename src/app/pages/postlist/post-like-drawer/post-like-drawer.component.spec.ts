import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostLikeDrawerComponent } from './post-like-drawer.component';

describe('PostLikeDrawerComponent', () => {
  let component: PostLikeDrawerComponent;
  let fixture: ComponentFixture<PostLikeDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostLikeDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostLikeDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
