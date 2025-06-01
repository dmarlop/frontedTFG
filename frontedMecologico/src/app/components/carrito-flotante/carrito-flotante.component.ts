import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { CarritoService } from '../../services/carrito.service';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';
import { ClienteService } from '../../services/cliente.service';
import { Router } from '@angular/router';

interface Direccion {
  id: string;
  usuarioSub: string;
  direccion: string;
  codigoPostal: string;
  municipio: string;
  provincia: string;
  esDefault: boolean;
  createdAt: string;
  updatedAt: string | null;
}

@Component({
  selector: 'app-carrito-flotante',
  templateUrl: './carrito-flotante.component.html',
  styleUrls: ['./carrito-flotante.component.css'],
  standalone: false,
})
export class CarritoFlotanteComponent implements OnInit, OnDestroy {
  esCreacion = false;
  esEdicion = false;
  esSoloVisual = false;
  esTramitacionVisual = false;

  carrito: any[] = [];
  visible = false;
  mostrarErrorLogin = false;
  modoEntrega: string = 'recoger';
  direcciones: Direccion[] = [];
  direccionSeleccionada: string = '';

  private carritoSub!: Subscription;
  private loginSub!: Subscription;

  constructor(
    public carritoSrv: CarritoService,
    public pedidoSrv: PedidoService,
    public auth: AuthService,
    private clienteSrv: ClienteService,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carritoSub = this.carritoSrv.carrito$.subscribe(items => {
      this.carrito = items.map(item => ({
        ...item,
        unidadDeVenta: item.unidadDeVenta || '—',
        nombre: item.nombre || item.nombreComercial || item.nombreProducto || '—'
      }));
      this.visible = items.length > 0;
    });

    this.loginSub = this.auth.loginEvent$.subscribe(isLoggedIn => {
      this.actualizarEstadoLogin(isLoggedIn);
      this.obtenerDireccionesSiLogueado(isLoggedIn);
    });

    const yaLogueado = this.auth.isLogged();
    this.actualizarEstadoLogin(yaLogueado);
    this.obtenerDireccionesSiLogueado(yaLogueado);
  }

  private obtenerDireccionesSiLogueado(isLoggedIn: boolean): void {
    if (isLoggedIn) {
      const sub = this.auth.getUserSub();
      if (sub) {
        this.clienteSrv.getDirecciones(sub).subscribe(dirs => {
          this.direcciones = dirs;
        });
      }
    } else {
      this.direcciones = [];
    }
  }

  ngOnDestroy(): void {
    if (this.carritoSub) this.carritoSub.unsubscribe();
    if (this.loginSub) this.loginSub.unsubscribe();
  }

  calcularTotal(): number {
    return this.carrito.reduce((sum, item) => sum + (item.precio * item.cantidadPedida), 0);
  }

  eliminar(itemId: string) {
    this.carritoSrv.eliminarProducto(itemId);
  }

  confirmarCantidad(p: any): void {
    const nuevaCantidad = parseFloat(p.nuevaCantidad);
    if (nuevaCantidad > 0) {
      p.cantidadPedida = nuevaCantidad;
      p.editando = false;
    }
  }

  cerrar() {
    this.visible = false;
  }

  editarCantidad(p: any): void {
    p.editando = true;
    p.nuevaCantidad = p.cantidadPedida;
  }

  tramitarPedidoDesdeCreacion(): void {
    const usuarioSub = this.auth.getUserSub();
    if (!usuarioSub) {
      this.mostrarErrorLogin = true;
      return;
    }

    this.carritoSrv.setModoCreacion();
    this.router.navigate(['/tramitarPedidos']);
  }

  tramitarPedidoDesdeEdicion(): void {
    const usuarioSub = this.auth.getUserSub();
    if (!usuarioSub) {
      this.mostrarErrorLogin = true;
      return;
    }

    const pedidoId = this.carritoSrv.getPedidoEnEdicionId();
    if (pedidoId) {
      this.carritoSrv.setModoEdicion(pedidoId);
      this.router.navigate(['/tramitarPedidos']);
    }
  }

  tramitarPedidoDesdeTramitacionVisual(): void {
    const usuarioSub = this.auth.getUserSub();
    if (!usuarioSub) {
      this.mostrarErrorLogin = true;
      return;
    }

    const pedidoId = this.carritoSrv.getPedidoEnEdicionId();
    if (pedidoId) {
      this.carritoSrv.setModoTramitacionVisual(pedidoId);
      this.router.navigate(['/tramitarPedidos']);
    }
  }

  tramitarPedido(): void {
    const usuarioSub = this.auth.getUserSub();
    if (!usuarioSub) {
      this.mostrarErrorLogin = true;
      return;
    }

    this.carritoSrv.setModoEdicion(null);
    this.carritoSrv.setEstadoPedidoEnEdicion(null);
    this.carritoSrv.setPedidoEnEdicionId(null);

    this.router.navigate(['/tramitarPedidos']);
  }

  esEdicionActiva(): boolean {
    return this.carritoSrv.esModoEdicion();
  }

  esTramitacionVisualActiva(): boolean {
    return this.carritoSrv.esModoTramitacionVisual();
  }

  cerrarMensajeError(): void {
    this.mostrarErrorLogin = false;
  }

  guardarPedidoEditado(): void {
    const pedidoId = this.carritoSrv.getPedidoEnEdicionId();
    const productos = this.carritoSrv.getCarritoActual();

    console.log('📝 Guardando edición de pedido:', pedidoId, productos);

    this.tramitarPedidoDesdeEdicion();
  }

  tramitarVisualmenteElPedido(): void {
    const pedidoId = this.carritoSrv.getPedidoEnEdicionId();
    const productos = this.carritoSrv.getCarritoActual();

    console.log('📦 Tramitando visualmente pedido:', pedidoId, productos);

    this.tramitarPedidoDesdeTramitacionVisual();
  }

  cerrarYLimpiar(): void {
    this.carritoSrv.limpiarCarrito();
    this.visible = false;
  }

  private actualizarEstadoLogin(isLoggedIn: boolean): void {
    this.ngZone.run(() => {
      this.mostrarErrorLogin = !isLoggedIn;
      if (!isLoggedIn) {
        this.visible = false;
      }
      this.cdRef.detectChanges();
    });
  }
}
