import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawercertificateComponent } from './drawercertificate.component';

describe('DrawercertificateComponent', () => {
  let component: DrawercertificateComponent;
  let fixture: ComponentFixture<DrawercertificateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawercertificateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawercertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
