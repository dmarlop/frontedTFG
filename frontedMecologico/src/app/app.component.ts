import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService } from '@azure/msal-angular';
import { EventMessage, EventType } from '@azure/msal-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent implements OnInit {

  constructor(
    private msalBroadcast: MsalBroadcastService,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Bloquear la redirección automática al cliente
    if (window.location.pathname === '/cliente') {
      console.warn('Redirección forzada a "/" para evitar salto a /cliente');
      this.router.navigate(['/']);
    }

    // Interceptar eventos MSAL
    this.msalBroadcast.msalSubject$.subscribe((event: EventMessage) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        console.log('🎯 Login exitoso capturado por app.component.ts');
        // Forzamos una ruta controlada después del login
        this.router.navigate(['/']);
      }
    });
  }
}
