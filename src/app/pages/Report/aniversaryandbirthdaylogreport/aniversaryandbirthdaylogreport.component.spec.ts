import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AniversaryandbirthdaylogreportComponent } from './aniversaryandbirthdaylogreport.component';

describe('AniversaryandbirthdaylogreportComponent', () => {
  let component: AniversaryandbirthdaylogreportComponent;
  let fixture: ComponentFixture<AniversaryandbirthdaylogreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AniversaryandbirthdaylogreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AniversaryandbirthdaylogreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
