import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('🛡️ Evaluando AuthGuard...');
    
    const logged = this.auth.isLogged();
    console.log('🔍 Usuario autenticado:', logged);

    if (logged) {
      console.log('✅ Acceso permitido');
      return true;
    }

    console.warn('⛔ Acceso denegado, posible redirección inesperada');
    return false;
  }
}
