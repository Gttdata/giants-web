import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddgaintsbannerphotosComponent } from './addgaintsbannerphotos.component';

describe('AddgaintsbannerphotosComponent', () => {
  let component: AddgaintsbannerphotosComponent;
  let fixture: ComponentFixture<AddgaintsbannerphotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddgaintsbannerphotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddgaintsbannerphotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
