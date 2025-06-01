import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Cliente, Direccion } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';
import { AuthService } from '../../services/auth.service';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-cliente',
  standalone: false,
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  cliente?: Cliente;
  panelDireccionesVisible = false;
  direcciones: any[] = [];

  constructor(
    private clienteService: ClienteService,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
  if (!isPlatformBrowser(this.platformId)) {
    return;
  }

  // 🔥 Eliminamos la lógica innecesaria de login, ya debería estar logueado
  if (!this.auth.isLogged()) {
    console.error('Intento de acceso sin sesión activa.');
    return;
  }

  // ✅ Obtener el usuario sub
  const sub = this.auth.getUserSub();
  console.log('Sub obtenido en ngOnInit:', sub);

  if (!sub) {
    console.error('No hay sub en el token, no puedo buscar el cliente.');
    return;
  }

  // ✅ Cargar los datos del cliente
  this.clienteService.getCliente(sub).subscribe({
    next: data => {
      this.cliente = data;
      console.log('Cliente recibido:', data);
    },
    error: err => console.error('Error al obtener el cliente:', err)
  });
}

  goToDirecciones(): void {
    // idem: sólo en browser
    if (!isPlatformBrowser(this.platformId)) return;

    this.panelDireccionesVisible = !this.panelDireccionesVisible;
    if (this.panelDireccionesVisible) {
      const sub = this.auth.getUserSub();
      console.log('Sub en goToDirecciones:', sub);
      if (!sub) return;
      this.clienteService.getDirecciones(sub).subscribe({
        next: dirs => {
          this.direcciones = dirs;
          console.log('Direcciones recibidas:', dirs);
        },
        error: err => console.error('Error al obtener direcciones:', err)
      });
    }
  }

  marcarComoActual(dir: any): void {
    console.log('Marcar como actual', dir);
  }
}