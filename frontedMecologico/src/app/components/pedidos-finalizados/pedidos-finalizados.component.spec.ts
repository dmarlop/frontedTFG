import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosFinalizadosComponent } from './pedidos-finalizados.component';

describe('PedidosFinalizadosComponent', () => {
  let component: PedidosFinalizadosComponent;
  let fixture: ComponentFixture<PedidosFinalizadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PedidosFinalizadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosFinalizadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
