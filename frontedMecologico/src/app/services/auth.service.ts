import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MsalService } from '@azure/msal-angular';
import { PopupRequest } from '@azure/msal-browser';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CarritoService } from './carrito.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loginEvent = new BehaviorSubject<boolean>(false);
  loginEvent$ = this.loginEvent.asObservable();

  constructor(
    private msal: MsalService,
    private router: Router,
    private carritoSrv: CarritoService, // ✅ CORREGIDO: inyectar correctamente con `private`
    @Inject(PLATFORM_ID) private platformId: object
  ) {
   
    this.updateAuthState();
  }

  isLogged(): boolean {
    const loggedIn = this.msal.instance.getAllAccounts().length > 0;
    
    return loggedIn;
  }

  loginIfNeeded(): void {
    console.log('🟢 loginIfNeeded() ejecutado');

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.isLogged()) {
      
      this.updateAuthState();
      return;
    }

    const req: PopupRequest = {
      scopes: ['openid', 'profile', 'User.Read'],
      prompt: 'select_account'
    };

    console.log('📢 Iniciando MSAL loginPopup...');
    this.msal.loginPopup(req).subscribe({
      next: (resp) => {
        
        this.msal.instance.setActiveAccount(resp.account);
        this.updateAuthState(true);

        
        this.router.navigateByUrl(this.router.url); // Redirige a la ruta actual
      },
      error: (err) => {
        console.error('❌ loginPopup error', err);
        this.updateAuthState(false);
      }
    });
  }

  getUserSub(): string | null {
    const all = this.msal.instance.getAllAccounts();
    console.log('MSAL all accounts:', all);
    let account = this.msal.instance.getActiveAccount() || all[0];
    console.log('MSAL activeAccount:', account);

    if (!account) {
      console.warn('AuthService.getUserSub: no hay cuenta MSAL');
      return null;
    }

    this.msal.instance.setActiveAccount(account);
    const claims = account.idTokenClaims as Record<string, any>;
    const oid = claims['oid'] as string | undefined;
    const sub = claims['sub'] as string | undefined;
    console.log('MSAL claims oid, sub:', oid, sub);

    return oid || sub || null;
  }

  logout(): void {
    console.log('🚪 Logout iniciado');
    const account = this.msal.instance.getActiveAccount();

    this.msal.logoutPopup({
      account,
      postLogoutRedirectUri: '/',
      mainWindowRedirectUri: '/'
    }).subscribe({
      next: () => {
        
        this.msal.instance.setActiveAccount(null);
        
        // Limpiar el carrito desde aquí
        this.carritoSrv.limpiarCarrito();
        
        this.updateAuthState(false);
        sessionStorage.clear();
        
        
      },
      error: (err) => {
       
        this.updateAuthState(false);
      }
    });
  }

  /**
   * Método privado para actualizar el estado de autenticación
   * @param forceValue Opcionalmente forzar un valor específico (true/false)
   */
  private updateAuthState(forceValue?: boolean): void {
    const newState = forceValue !== undefined ? forceValue : this.isLogged();
    this.loginEvent.next(newState);
    console.log('🔁 Estado de autenticación actualizado:', newState);
  }
}
