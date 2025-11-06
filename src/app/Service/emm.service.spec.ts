import { TestBed } from '@angular/core/testing';

import { EmmService } from './emm.service';

describe('EmmService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmmService = TestBed.get(EmmService);
    expect(service).toBeTruthy();
  });
});
