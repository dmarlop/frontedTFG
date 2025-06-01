import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitarPedidoComponent } from './tramitar-pedido.component';

describe('TramitarPedidoComponent', () => {
  let component: TramitarPedidoComponent;
  let fixture: ComponentFixture<TramitarPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TramitarPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TramitarPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
