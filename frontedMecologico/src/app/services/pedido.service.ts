import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Modelos que deberías tener en ../models/pedido.model.ts
export interface LineaPedido {
  codProductoCatalogo: string;
  cantidadPedida: number;
}

export interface Pedido {
  id: string;
  codUsuario: string;
  catalogoId?: string;
  direccion?: string;
  estado: string;
  fecha: string;
  productos: {
    id: string;
    codProductoCatalogo: string;
    cantidadPedida: number;
    cantidadEntregada: number;
    pvp: number;
    nombreProducto: string;         // ✅ Nuevo campo
    precioUnitario: number;         // ✅ Nuevo campo
    subtotal: number; 
  }[];
  totalPedidoBase?: {
    total: number;
    base: number;
    iva: number;
  };
  totalPedido?: {
    total: number;
    base: number;
    iva: number;
  };
  totalEntrega?: {
    total: number;
    base: number;
    iva: number;
  };
}

export interface PedidoCompletoCreateDto {
  codUsuario: string;
  catalogoId: string;
  direccion: string;
  entrega: number;
  lineas: LineaPedido[];
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private cartLinesSubject = new BehaviorSubject<LineaPedido[]>([]);
  cartLines$ = this.cartLinesSubject.asObservable();
  private api = `${environment.catalogosApi}/pedidos`;
  private pedidoActualSubject = new BehaviorSubject<Pedido | null>(null);
  pedidoActual$ = this.pedidoActualSubject.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getUserId(): string {
    return this.auth.getUserSub()!;
  }

  finalizarPedido(pedido: PedidoCompletoCreateDto): Observable<any> {
    console.log('📦 Enviando pedido al backend:', pedido);
    return this.http.post(`${this.api}`, pedido);
  }

  getPedidosPendientes(estado: string): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.api}/estado/Abierto`);
  }

  actualizarPedido(pedidoId: string, dto: any): Observable<any> {
  return this.http.put(`${this.api}/${pedidoId}`, dto);
}



  getPedidosPorCatalogo(catalogo: string): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.api}/catalogo/${catalogo}`);
  }
  getPedidosPorEstados(estados: string[]): Observable<Pedido[]> {
  const estadosParam = estados.join(',');  // "Abierto,Montando"
  return this.http.get<Pedido[]>(`${this.api}/filtrar?estados=${estadosParam}`);
}

actualizarEstadoPedido(pedidoId: string, nuevoEstado: string): Observable<any> {
  return this.http.put(`${this.api}/${pedidoId}/estado`, { nuevoEstado }, {
    headers: { 'Content-Type': 'application/json' }
  });
}

getPedidoPorId(pedidoId: string): Observable<Pedido> {
  return this.http.get<Pedido>(`${this.api}/${pedidoId}`);
}


  tramitarPedido(pedidoId: string, cambios: { productoCatalogoId: string, nuevaCantidad: number }[]) {
  return this.http.put<void>(
    `http://localhost:8087/catalogoServer/api/pedidos/${pedidoId}/productos/cantidad`,
    cambios
  );
}

}
