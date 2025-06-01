import { Component, OnInit } from '@angular/core';
import { Catalogo, CatalogoService } from '../../services/catalogo.service';
import { Router } from '@angular/router';
import { Pedido, PedidoService } from '../../services/pedido.service';
import { map } from 'rxjs';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-catalogos',
  templateUrl: './catalogos.component.html',
  styleUrl: './catalogos.component.css',
  standalone: false
})
export class CatalogosComponent implements OnInit {
  catalogos: Catalogo[] = [];
  loading   = true;
  
  isExpanded: Record<string, boolean> = {};
  pedidosPorCatalogo: Record<string, Pedido[]> = {};
  mostrarDetallesPedido: Record<string, boolean> = {};

  constructor(
    private srv: CatalogoService, 
    private pedidoSrv: PedidoService,  
    private router: Router,
    private carritoSrv: CarritoService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.srv.getCatalogos().subscribe({
      next: cats => {
        this.catalogos = cats;
        cats.forEach(c => this.isExpanded[c.id] = false);
        this.loading = false;
      },
      error: err => {
        console.error('Error cargando catálogos:', err);
        this.loading = false;
      }
    });
  }

  pedidos(c: Catalogo): Pedido[] {
    return this.pedidosPorCatalogo[c.id] || [];
  }

  toggleDetalle(c: Catalogo): void {
    const id = c.id;
    this.isExpanded[id] = !this.isExpanded[id];

    if (this.isExpanded[id] && !this.pedidosPorCatalogo[id]) {
      this.pedidoSrv.getPedidosPorCatalogo(id)
        .pipe(
          map((list: Pedido[]) =>
            list.filter(p =>
              ['Abierto', 'Montando', 'Enviado'].includes(p.estado)
            )
          )
        )
        .subscribe({
          next: (filtered: Pedido[]) => {
            this.pedidosPorCatalogo[id] = filtered;
          },
          error: err => {
            console.error(`Error cargando pedidos para catálogo ${id}:`, err);
            this.pedidosPorCatalogo[id] = [];
          }
        });
    }
  }

  hacerPedido(c: Catalogo): void {
    this.router.navigate(['/catalogos', c.id]);
  }

  iniciarNuevoPedido(c: Catalogo): void {
  this.carritoSrv.limpiarCarrito();
  this.router.navigate(['/catalogos', c.id]);
}

  consultarPedidos(c: Catalogo): void {
    this.router.navigate(['/pedidos'], { queryParams: { catalogo: c.id } });
  }

  toggleDetallePedido(pedidoId: string): void {
    this.mostrarDetallesPedido[pedidoId] = !this.mostrarDetallesPedido[pedidoId];
  }
}
