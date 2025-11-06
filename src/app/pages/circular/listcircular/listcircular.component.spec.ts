import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListcircularComponent } from './listcircular.component';

describe('ListcircularComponent', () => {
  let component: ListcircularComponent;
  let fixture: ComponentFixture<ListcircularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListcircularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListcircularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
