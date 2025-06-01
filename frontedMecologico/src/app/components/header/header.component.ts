import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // 🔔 Escuchar el evento de login para redirigir a /cliente cuando se complete
    this.auth.loginEvent$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigateByUrl('/cliente');
      }
    });
  }

  goCliente() {
    if (this.auth.isLogged()) {
      // ✅ Si el usuario ya está logueado, lo llevamos directamente a /cliente
      this.router.navigateByUrl('/cliente');
    } else {
      // ❌ Si NO está logueado, primero iniciamos sesión
      this.auth.loginIfNeeded();
    }
  }

  closeDropdown(ev: Event) {
    (ev.target as HTMLElement).closest('.dropdown')?.querySelector('.btn')
      ?.dispatchEvent(new Event('click'));
  }

  login(): void {
    this.auth.loginIfNeeded();
  }

  logout(): void {
    this.auth.logout();
  }
}
