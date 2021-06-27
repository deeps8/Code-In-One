import { TestBed } from '@angular/core/testing';

import { CodeinoneService } from './codeinone.service';

describe('CodeinoneService', () => {
  let service: CodeinoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeinoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
