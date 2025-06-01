import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoFloatingCardComponent } from './pedido-floating-card.component';

describe('PedidoFloatingCardComponent', () => {
  let component: PedidoFloatingCardComponent;
  let fixture: ComponentFixture<PedidoFloatingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PedidoFloatingCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidoFloatingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
