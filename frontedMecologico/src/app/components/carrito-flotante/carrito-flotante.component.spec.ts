import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarritoFlotanteComponent } from './carrito-flotante.component';

describe('CarritoFlotanteComponent', () => {
  let component: CarritoFlotanteComponent;
  let fixture: ComponentFixture<CarritoFlotanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarritoFlotanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarritoFlotanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
