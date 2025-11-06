import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateviewComponent } from './certificateview.component';

describe('CertificateviewComponent', () => {
  let component: CertificateviewComponent;
  let fixture: ComponentFixture<CertificateviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificateviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
