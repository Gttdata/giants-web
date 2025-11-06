import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardcertificatemappingComponent } from './awardcertificatemapping.component';

describe('AwardcertificatemappingComponent', () => {
  let component: AwardcertificatemappingComponent;
  let fixture: ComponentFixture<AwardcertificatemappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardcertificatemappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardcertificatemappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
