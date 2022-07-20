import { TestBed } from '@angular/core/testing';

import { AutGardGuard } from './aut-gard.guard';

describe('AutGardGuard', () => {
  let guard: AutGardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AutGardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
