import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFileImageDrawerComponent } from './view-file-image-drawer.component';

describe('ViewFileImageDrawerComponent', () => {
  let component: ViewFileImageDrawerComponent;
  let fixture: ComponentFixture<ViewFileImageDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFileImageDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFileImageDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
