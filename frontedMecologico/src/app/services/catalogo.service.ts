import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Catalogo {
  id: string;
  nombre: string;
  status: 'Previo' | 'Activo' | 'Cerrado';
  fecha: string;
  startTime?: string;
  modifyTime?: string;
  
}
export interface CategoriaMini {
  id: string;
  nombre: string;
}
export interface ProductoCatalogo{
  id: string;
  productoId: string;
  nombreComercial: string;
  unidadDeVenta: string; 
  pvp: number;
  iva: number;
  imagenes: string[];
  categoriaNombre?: string;
  subcategoriaNombre?: string;
  caracteristicas?: string[];       
  ingredientes?: boolean; 
  ingredientesLista?: string [];
  categoriaId?: string;
  subcategoriaId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {


  private api = `${environment.catalogosApi}/catalogos`;
  constructor(private http: HttpClient) { }

  getCatalogos(): Observable<Catalogo[]>{
    return this.http.get<Catalogo[]>(this.api);
  }

  getProducto(catalogoId: string, productoCatalogoId: string): Observable<ProductoCatalogo> {
  return this.http.get<ProductoCatalogo>(
    `${this.api}/${catalogoId}/productos/${productoCatalogoId}`
  );
}

  getProductos(catId: string): Observable<ProductoCatalogo[]> {
    return this.http.get<ProductoCatalogo[]>(
      `${environment.catalogosApi}/catalogos/${catId}/productos`
    );
  }
  getCatalogo(catId: string): Observable<Catalogo> {
  
  return this.http.get<Catalogo>(`${this.api}/${catId}`);
}



}
