import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { PedidoService, Pedido } from '../../services/pedido.service';
import { ClienteService } from '../../services/cliente.service';
import { DireccionService } from '../../services/direccion.service';
import { Cliente, Direccion } from '../../models/cliente.model';
import { CatalogoService } from '../../services/catalogo.service';
import { CarritoService } from '../../services/carrito.service';
import { Router } from '@angular/router';

interface PedidoConCliente extends Pedido {
  nombreUsuario?: string;
  direccionPedido?: string;
}

@Component({
  selector: 'app-pedidos-pendientes',
  templateUrl: './pedidos-pendientes.component.html',
  styleUrls: ['./pedidos-pendientes.component.css'],
  standalone: false
})
export class PedidosPendientesComponent implements OnInit, OnDestroy {
  pedidos: PedidoConCliente[] = [];
  loading = false;
  error = '';
  private sub!: Subscription;
  isAddressVisible: Record<string, boolean> = {};
  isProductosVisible: Record<string, boolean> = {};
  unidadVentaPorProducto: Record<string, string> = {};
  cantidadesEditables: Record<string, string> = {};
  modoEdicion: Record<string, boolean> = {};

  paginaActual = 1;
  pedidosPorPagina = 5;

  catalogoId = '98082713-6ee7-426d-9d35-8d494a60404c';

  constructor(
    private pedidoSrv: PedidoService,
    private clienteSrv: ClienteService,
    private dirSrv: DireccionService,
    private catalogoSrv: CatalogoService,
    private carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.sub = this.pedidoSrv.getPedidosPorEstados(['Abierto', 'Tramitar', 'Montando', 'Enviado'])
      .pipe(
        switchMap(pedidosBase =>
          forkJoin(
            pedidosBase.map(p =>
              forkJoin({
                cliente: this.clienteSrv.getCliente(p.codUsuario).pipe(
                  catchError(() => of({
                    sub: p.codUsuario,
                    email: '',
                    nombre: '—desconocido—',
                    apellido: '',
                    telefono: '',
                    comentario: '',
                    rol: 'comprador',
                    state: 'Activo',
                    createdAt: '',
                    updatedAt: '',
                    direcciones: []
                  } as Cliente))
                ),
                direcciones: this.dirSrv.getDirecciones(p.codUsuario).pipe(
                  catchError(() => of([] as Direccion[]))
                ),
                pedido: of(p)
              }).pipe(
                switchMap(({ cliente, direcciones, pedido }) => {
                  const pc: PedidoConCliente = { ...pedido };
                  pc.nombreUsuario = cliente.nombre;
                  pc.direccionPedido = pedido.direccion || '—sin dirección—';

                  pedido.productos?.forEach(prod => {
                    const clave = `${this.catalogoId}_${prod.codProductoCatalogo}`;
                    if (!this.unidadVentaPorProducto[clave]) {
                      this.catalogoSrv.getProducto(this.catalogoId, prod.codProductoCatalogo).subscribe({
                        next: (res) => {
                          this.unidadVentaPorProducto[clave] = res.unidadDeVenta || '—';
                        },
                        error: () => {
                          this.unidadVentaPorProducto[clave] = '—';
                        }
                      });
                    }
                  });

                  return of(pc);
                })
              )
            )
          )
        )
      )
      .subscribe({
        next: enriched => {
          this.pedidos = enriched;
          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.error = 'Error al cargar pedidos con detalle de cliente';
          this.loading = false;
        }
      });
  }
estadoEditable: Record<string, string> = {};
mostrarSelectorEstado: Record<string, boolean> = {};

actualizarEstado(pedidoId: string, nuevoEstado: string): void {
  this.pedidoSrv.actualizarEstadoPedido(pedidoId, nuevoEstado).subscribe({
    next: () => {
      alert(`Estado actualizado a ${nuevoEstado}`);
      this.ngOnInit(); // Recarga pedidos
    },
    error: err => {
      console.error(err);
      alert('Error al actualizar el estado');
    }
  });
}

  tramitarVisualmente(pedidoId: string): void {
  this.pedidoSrv.getPedidoPorId(pedidoId).subscribe(pedido => {
    const catalogoId = '98082713-6ee7-426d-9d35-8d494a60404c';
    if (!catalogoId) {
      console.error('❌ Falta catalogoId');
      return;
    }

    this.carritoService.setModoTramitacionVisual(pedidoId);
    this.carritoService.setEstadoPedidoEnEdicion(pedido.estado);
    this.carritoService.setCarritoDesdePedido(pedido, catalogoId);

    this.router.navigate(['/catalogos/98082713-6ee7-426d-9d35-8d494a60404c']);
  });
}


  editarPedido(pedidoId: string): void {
  this.pedidoSrv.getPedidoPorId(pedidoId).subscribe(pedido => {
    const catalogoId = '98082713-6ee7-426d-9d35-8d494a60404c';

    if (!catalogoId) {
      console.error('❌ El pedido no tiene catalogoId');
      return;
    }

    this.carritoService.setModoEdicion(pedidoId);
     this.carritoService.setEstadoPedidoEnEdicion(pedido.estado);
    this.carritoService.setCarritoDesdePedido(pedido, catalogoId);
    this.router.navigate(['/catalogos/98082713-6ee7-426d-9d35-8d494a60404c']);
  });
}



  toggleDireccion(id: string): void {
    this.isAddressVisible[id] = !this.isAddressVisible[id];
  }

  toggleProductos(id: string): void {
    this.isProductosVisible[id] = !this.isProductosVisible[id];
  }

  editarCantidad(pedidoId: string, prodId: string, cantidadActual: number): void {
    const clave = pedidoId + '_' + prodId;
    this.cantidadesEditables[clave] = cantidadActual.toString();
    this.modoEdicion[clave] = true;
  }

  tramitar(pedidoId: string, productos: any[]): void {
    const cambios = productos
      .map(prod => {
        const clave = pedidoId + '_' + prod.codProductoCatalogo;
        const nuevaCantidad = parseFloat(this.cantidadesEditables[clave]);
        return (!isNaN(nuevaCantidad) && nuevaCantidad > 0)
          ? { productoCatalogoId: prod.codProductoCatalogo, nuevaCantidad }
          : null;
      })
      .filter(p => p !== null);

    if (cambios.length === 0) return;

    this.pedidoSrv.tramitarPedido(pedidoId, cambios).subscribe({
      next: () => {
        alert('Cambios aplicados y pedido tramitado');
        this.ngOnInit();
      },
      error: err => {
        console.error(err);
        alert('Error al tramitar el pedido');
      }
    });
  }

  get totalPaginas(): number {
    return Math.ceil(this.pedidos.length / this.pedidosPorPagina);
  }

  get pedidosPaginados(): PedidoConCliente[] {
    const inicio = (this.paginaActual - 1) * this.pedidosPorPagina;
    return this.pedidos.slice(inicio, inicio + this.pedidosPorPagina);
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }
  cancelarPedido(pedidoId: string): void {
  if (!confirm('¿Estás seguro de que deseas cancelar este pedido?')) return;

  this.pedidoSrv.actualizarEstadoPedido(pedidoId, 'Cancelado').subscribe({
    next: () => {
      alert('Pedido cancelado correctamente');
      this.ngOnInit(); // recarga la lista de pedidos
    },
    error: err => {
      console.error(err);
      alert('Error al cancelar el pedido');
    }
  });
}


  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
