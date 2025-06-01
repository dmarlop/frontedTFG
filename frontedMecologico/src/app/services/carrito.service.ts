// carrito.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Pedido } from './pedido.service';
import { CatalogoService } from './catalogo.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoSubject = new BehaviorSubject<any[]>(this.cargarDesdeStorage());
  carrito$ = this.carritoSubject.asObservable();
  private catalogoId: string | null = null;

  private modoEdicion = false;
  private pedidoIdEnEdicion: string | null = null;
  private estadoPedidoEnEdicion: string | null = null;

  constructor(private catalogoSrv: CatalogoService) {}

  private cargarDesdeStorage(): any[] {
    const data = localStorage.getItem('carrito');
    return data ? JSON.parse(data) : [];
  }

  private guardarEnStorage(carrito: any[]): void {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  agregarProducto(producto: any, catalogoId: string): void {
    if (this.catalogoId && this.catalogoId !== catalogoId) {
      console.error('No se pueden mezclar productos de diferentes catálogos');
      return;
    }

    this.catalogoId = catalogoId;
    localStorage.setItem('catalogoId', catalogoId);

    const carritoActual = this.carritoSubject.value;
    const productoExistente = carritoActual.find(p => p.codProductoCatalogo === producto.id);

    if (productoExistente) {
      productoExistente.cantidadPedida += producto.cantidad;
    } else {
      carritoActual.push({
        codProductoCatalogo: producto.id,
        cantidadPedida: producto.cantidad,
        nombre: producto.nombre,
        precio: producto.pvp,
        unidadDeVenta: producto.unidadDeVenta || '—'
      });
    }

    this.carritoSubject.next([...carritoActual]);
    this.guardarEnStorage(carritoActual);
  }

  eliminarProducto(productoId: string): void {
    const carritoActual = this.carritoSubject.value
      .filter(p => p.codProductoCatalogo !== productoId);
    this.carritoSubject.next(carritoActual);
    this.guardarEnStorage(carritoActual);
  }

  limpiarCarrito(): void {
  this.carritoSubject.next([]);
  this.catalogoId = null;
  this.modoCreacionManual = false;
  this.modoEdicion = false;
  this.modoTramitacionVisual = false;
  this.pedidoIdEnEdicion = null;
  this.estadoPedidoEnEdicion = null;
  localStorage.removeItem('carrito');
  localStorage.removeItem('catalogoId');
}


  getCarritoActual(): any[] {
    return this.carritoSubject.value;
  }

  getCatalogoId(): string | null {
    if (!this.catalogoId) {
      this.catalogoId = localStorage.getItem('catalogoId');
    }
    return this.catalogoId;
  }

  actualizarCarrito(carrito: any[]): void {
    this.carritoSubject.next(carrito);
    this.guardarEnStorage(carrito);
  }

  // ✅ GESTIÓN DE MODO EDICIÓN
  private modoCreacionManual = false;

private modoTramitacionVisual = false;
setModoCreacion(): void {
  this.modoCreacionManual = true;
  this.modoEdicion = false;
  this.modoTramitacionVisual = false;
  this.pedidoIdEnEdicion = null;
  this.estadoPedidoEnEdicion = null;
}

esModoCreacion(): boolean {
  return this.modoCreacionManual;
}



  setModoEdicion(pedidoId: string | null): void {
    this.modoEdicion = pedidoId !== null;
    this.pedidoIdEnEdicion = pedidoId;
  }

  esModoEdicion(): boolean {
    return this.modoEdicion;
  }

  getPedidoEnEdicionId(): string | null {
    return this.pedidoIdEnEdicion;
  }

  setPedidoEnEdicionId(id: string | null): void {
    this.pedidoIdEnEdicion = id;
  }

  setEstadoPedidoEnEdicion(estado: string | null): void {
    this.estadoPedidoEnEdicion = estado;
  }

  getEstadoPedidoEnEdicion(): string | null {
    return this.estadoPedidoEnEdicion;
  }
setModoTramitacionVisual(pedidoId: string): void {
  this.modoTramitacionVisual = true;
  this.modoEdicion = false;
  this.modoCreacionManual = false;
  this.pedidoIdEnEdicion = pedidoId;
}
esModoTramitacionVisual(): boolean {
  return this.modoTramitacionVisual;
}

  setCarritoDesdePedido(pedido: Pedido, catalogoId: string) {
    if (!pedido || !pedido.productos || pedido.productos.length === 0) {
      console.warn('Pedido vacío o inválido');
      return;
    }

    const productos: any[] = [];
    let completados = 0;

    this.catalogoId = catalogoId;
    localStorage.setItem('catalogoId', catalogoId);

    pedido.productos.forEach(p => {
      this.catalogoSrv.getProducto(catalogoId, p.codProductoCatalogo).subscribe(prod => {
        productos.push({
          codProductoCatalogo: p.codProductoCatalogo,
          cantidadPedida: p.cantidadPedida,
          precio: p.precioUnitario,
          nombre: p.nombreProducto,
          unidadDeVenta: prod.unidadDeVenta || '—',
          editando: false
        });

        completados++;

        if (completados === pedido.productos.length) {
          this.carritoSubject.next(productos);
          this.guardarEnStorage(productos);
        }
      });
    });
  }
}
