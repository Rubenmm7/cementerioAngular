import { TestBed } from '@angular/core/testing';

import { BusquedaPublicaService } from './busqueda-publica-service';

describe('BusquedaPublicaService', () => {
  let service: BusquedaPublicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusquedaPublicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
