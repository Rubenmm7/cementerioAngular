import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaDifuntos } from './busqueda-difuntos';

describe('BusquedaDifuntos', () => {
  let component: BusquedaDifuntos;
  let fixture: ComponentFixture<BusquedaDifuntos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusquedaDifuntos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusquedaDifuntos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
