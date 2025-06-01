import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { DireccionComponent } from './components/direccion/direccion.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import {
  MsalModule, MsalService, MSAL_INSTANCE,
  MSAL_GUARD_CONFIG, MsalGuard, MsalGuardConfiguration,
  MsalInterceptorConfiguration
} from '@azure/msal-angular';
import {
  PublicClientApplication, InteractionType, BrowserCacheLocation
} from '@azure/msal-browser';
import { CatalogosComponent } from './components/catalogos/catalogos.component';
import { CatalogoProductosComponent } from './components/catalogo-productos/catalogo-productos.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { FooterComponent } from './components/footer/footer.component';
import { LegalesComponent } from './components/legales/legales.component';
import { CopyrightComponent } from './components/copyright/copyright.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { ProductosComponent } from './components/productos/productos.component';
import { CampanasComponent } from './components/campanas/campanas.component';
import { CookiesComponent } from './components/cookies/cookies.component';
import { ComprasComponent } from './components/compras/compras.component';
import { CarritoFlotanteComponent } from './components/carrito-flotante/carrito-flotante.component';
import { CommonModule } from '@angular/common';
import { PedidosPendientesComponent } from './components/pedidos-pendientes/pedidos-pendientes.component';
import { PedidosFinalizadosComponent } from './components/pedidos-finalizados/pedidos-finalizados.component';
import { PedidosEntregadosComponent } from './components/pedidos-entregados/pedidos-entregados.component';
import { TramitarPedidoComponent } from './components/tramitar-pedido/tramitar-pedido.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es-ES');


export function msalInstanceFactory(): PublicClientApplication {
  return new PublicClientApplication({
    auth: {

      clientId: '52dd1ecc-a19c-4c4c-b030-9baf74cddef7',
      //clientId: '4669d7f1-0d4b-4e9b-83d9-42745b31d0ad',
      authority: 'https://login.microsoftonline.com/16811ddd-85a5-41f8-9de7-dd9e0a60cb14',
      //authority: 'https://login.microsoftonline.com/5935a814-f2e8-4074-bef8-0f11a03b0de7',
      redirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: 'http://localhost:4200',
      navigateToLoginRequestUrl: false
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: false
    }
  });
}

export function msalGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Popup,
    authRequest: { scopes: ['openid', 'profile', 'User.Read'] }
  };
}

export function msalInterceptorConfigFactory(): MsalInterceptorConfiguration {
  return { interactionType: InteractionType.Popup, protectedResourceMap: new Map() };
}


export function msalInit(instance: PublicClientApplication) {
  return () => {
    if (typeof window === 'undefined') {
      return Promise.resolve(true);
    }

    return instance.initialize()
      .then(() => instance.handleRedirectPromise())
      .then((response) => {
        if (response) {
          console.log('✅ Login interactivo detectado');
          // 🧹 Solo si venimos de un login, dejamos redirección
        } else {
          // 🧹 Si es una restauración automática de sesión (como al hacer F5)
          localStorage.removeItem('redirectAfterLogin'); // 🔥 Esta línea es clave
        }
        return true;
      })
      .catch(err => {
        console.error('MSAL init error', err);
        return true;
      });
  };
}


@NgModule({
  declarations: [
    AppComponent,
    ClienteComponent,
    DireccionComponent,
    HomeComponent,
    HeaderComponent,
    CatalogosComponent,
    CatalogoProductosComponent,
    FooterComponent,
    LegalesComponent,
    CopyrightComponent,
    NosotrosComponent,
    ProductosComponent,
    CampanasComponent,
    CookiesComponent,
    ComprasComponent,
    CarritoFlotanteComponent,
    PedidosPendientesComponent,
    PedidosFinalizadosComponent,
    PedidosEntregadosComponent,
    TramitarPedidoComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    CommonModule,      
    HttpClientModule,
    FontAwesomeModule,
    MsalModule.forRoot(
      msalInstanceFactory(),
      msalGuardConfigFactory(),
      msalInterceptorConfigFactory()
    )
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: MSAL_INSTANCE,    useFactory: msalInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: msalGuardConfigFactory },
    MsalService,
    MsalGuard,
    {
      provide: APP_INITIALIZER,
      useFactory: msalInit,
      deps: [MSAL_INSTANCE],
      multi: true
    },
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
