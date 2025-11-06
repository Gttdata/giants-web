import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoManualDrawerComponent } from './video-manual-drawer.component';

describe('VideoManualDrawerComponent', () => {
  let component: VideoManualDrawerComponent;
  let fixture: ComponentFixture<VideoManualDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoManualDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoManualDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
