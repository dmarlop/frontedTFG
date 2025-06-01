import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogoService, Catalogo, ProductoCatalogo } from '../../services/catalogo.service';
import { CarritoService } from '../../services/carrito.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-catalogo-productos',
  templateUrl: './catalogo-productos.component.html',
  styleUrls: ['./catalogo-productos.component.css'],
  standalone: false
})
export class CatalogoProductosComponent implements OnInit {
  catalogoId!: string;
  catalogoNombre = '';
  private carritoSub!: Subscription;
  productosEnCarrito = new Set<string>();

  productos: ProductoCatalogo[] = [];
  loading = true;

  features: string[] = [];
  selectedFeatures: string[] = [];

  categories: string[] = [];
  selectedCategories: string[] = [];

  subcategories: string[] = [];
  selectedSubcategories: string[] = [];

  cantidades: Record<string, string> = {};
  erroresCantidad: Record<string, boolean> = {};
  detalleAbierto: Record<string, boolean> = {};

  paginaActual = 1;
  productosPorPagina = 10;

  constructor(
    private route: ActivatedRoute,
    private catalogoSrv: CatalogoService,
    private carritoSrv: CarritoService
  ) {
    this.catalogoId = this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadCatalogo();
    this.loadProductos();
    this.carritoSub = this.carritoSrv.carrito$.subscribe(items => {
      this.productosEnCarrito.clear();
      items.forEach(p => this.productosEnCarrito.add(p.codProductoCatalogo));
    });
  }

  private loadCatalogo(): void {
    this.catalogoSrv.getCatalogo(this.catalogoId).subscribe({
      next: (cat: Catalogo) => this.catalogoNombre = cat.nombre,
      error: err => console.error('Error cargando catálogo:', err)
    });
  }

  private loadProductos(): void {
    this.loading = true;
    this.catalogoSrv.getProductos(this.catalogoId).subscribe({
      next: prods => {
        this.productos = prods;
        prods.forEach(p => {
          this.cantidades[p.id] = '';
          this.erroresCantidad[p.id] = false;
        });

        this.features = Array.from(
          new Set(prods.flatMap(p => p.caracteristicas || []))
        ).sort();

        this.categories = Array.from(
          new Set(
            prods
              .map(p => p.categoriaNombre)
              .filter((n): n is string => n !== undefined)
          )
        ).sort();

        this.subcategories = Array.from(
          new Set(
            prods
              .map(p => p.subcategoriaNombre)
              .filter((n): n is string => n !== undefined)
          )
        ).sort();

        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  toggleFeature(feature: string): void {
    const i = this.selectedFeatures.indexOf(feature);
    if (i >= 0) this.selectedFeatures.splice(i, 1);
    else this.selectedFeatures.push(feature);
    this.paginaActual = 1;
  }

  toggleCategory(cat: string): void {
    const i = this.selectedCategories.indexOf(cat);
    if (i >= 0) this.selectedCategories.splice(i, 1);
    else this.selectedCategories.push(cat);
    this.paginaActual = 1;
  }

  toggleSubcategory(sub: string): void {
    const i = this.selectedSubcategories.indexOf(sub);
    if (i >= 0) this.selectedSubcategories.splice(i, 1);
    else this.selectedSubcategories.push(sub);
    this.paginaActual = 1;
  }

  get availableSubcategories(): string[] {
    if (!this.selectedCategories.length) {
      return this.subcategories;
    }
    return Array.from(
      new Set(
        this.productos
          .filter(p =>
            p.categoriaNombre !== undefined &&
            this.selectedCategories.includes(p.categoriaNombre)
          )
          .map(p => p.subcategoriaNombre)
          .filter((n): n is string => n !== undefined)
      )
    ).sort();
  }

  get filteredProducts(): ProductoCatalogo[] {
    return this.productos.filter(p => {
      const matchFeat = this.selectedFeatures.every(f =>
        p.caracteristicas?.includes(f)
      );

      const cat = p.categoriaNombre ?? '';
      const matchCat = !this.selectedCategories.length ||
        this.selectedCategories.includes(cat);

      const sub = p.subcategoriaNombre ?? '';
      const matchSub = !this.selectedSubcategories.length ||
        this.selectedSubcategories.includes(sub);

      return matchFeat && matchCat && matchSub;
    });
  }

  get totalPaginas(): number {
    return Math.ceil(this.filteredProducts.length / this.productosPorPagina);
  }

  get productosPaginados(): ProductoCatalogo[] {
    const inicio = (this.paginaActual - 1) * this.productosPorPagina;
    return this.filteredProducts.slice(inicio, inicio + this.productosPorPagina);
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }

  toggleDetalles(id: string): void {
    this.detalleAbierto[id] = !this.detalleAbierto[id];
  }
  
  
  validarYAgregar(p: ProductoCatalogo): void {
    const valor = this.cantidades[p.id];
    const qty = Number(valor);

    const invalido = valor === '' || isNaN(qty) || qty <= 0;
    this.erroresCantidad[p.id] = invalido;

    if (invalido) return;

    this.carritoSrv.agregarProducto({
      id: p.id,
      codProductoCatalogo: p.id,
      nombre: p.nombreComercial,
      pvp: p.pvp,
      cantidad: qty,
      unidadDeVenta: p.unidadDeVenta
    }, this.catalogoId);

    this.cantidades[p.id] = '';
    this.erroresCantidad[p.id] = false;
  }
}
