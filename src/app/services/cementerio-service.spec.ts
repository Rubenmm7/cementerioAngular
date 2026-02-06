import { TestBed } from '@angular/core/testing';
import { CementerioService } from './cementerio-service';

describe('CementerioService', () => {
  let service: CementerioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CementerioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
