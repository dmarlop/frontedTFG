import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './components/cliente/cliente.component';
import { DireccionComponent } from './components/direccion/direccion.component';
import { HomeComponent } from './components/home/home.component';
import { MsalGuard } from '@azure/msal-angular';
import { CatalogosComponent } from './components/catalogos/catalogos.component';
import { CatalogoProductosComponent } from './components/catalogo-productos/catalogo-productos.component';
import { LegalesComponent } from './components/legales/legales.component';
import { CopyrightComponent } from './components/copyright/copyright.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { ProductosComponent } from './components/productos/productos.component';
import { CampanasComponent } from './components/campanas/campanas.component';
import { CookiesComponent } from './components/cookies/cookies.component';
import { ComprasComponent } from './components/compras/compras.component';
import { PedidosEntregadosComponent } from './components/pedidos-entregados/pedidos-entregados.component';
import { PedidosFinalizadosComponent } from './components/pedidos-finalizados/pedidos-finalizados.component';
import { PedidosPendientesComponent } from './components/pedidos-pendientes/pedidos-pendientes.component';
import { AuthGuard } from './guards/auth.guard';
import { TramitarPedidoComponent } from './components/tramitar-pedido/tramitar-pedido.component';

const routes: Routes = [

  { path: 'cliente', component: ClienteComponent, canActivate:[AuthGuard] },
  { path: 'direccion', component: DireccionComponent },
  { path: 'catalogos', component: CatalogosComponent },
  { path: 'catalogos/:id', component: CatalogoProductosComponent},
  { path: 'legales', component: LegalesComponent },
  { path: 'copyright', component: CopyrightComponent },
  { path: 'nosotros', component: NosotrosComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'campanas', component: CampanasComponent },
  { path: 'cookies', component: CookiesComponent },
  { path: 'compras', component: ComprasComponent },
  { path: 'pedidosEntregados', component: PedidosEntregadosComponent },
  { path: 'pedidosPendientes', component: PedidosPendientesComponent },
  { path: 'pedidosFinalizados', component: PedidosFinalizadosComponent },
  { path: 'tramitarPedidos', component: TramitarPedidoComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
