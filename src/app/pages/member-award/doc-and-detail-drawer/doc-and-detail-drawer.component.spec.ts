import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocAndDetailDrawerComponent } from './doc-and-detail-drawer.component';

describe('DocAndDetailDrawerComponent', () => {
  let component: DocAndDetailDrawerComponent;
  let fixture: ComponentFixture<DocAndDetailDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocAndDetailDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocAndDetailDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
