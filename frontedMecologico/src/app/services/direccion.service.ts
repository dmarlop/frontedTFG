// direccion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Direccion {
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

@Injectable({ providedIn: 'root' })
export class DireccionService {
  

private apiUrl = 'http://localhost:8089/clienteServer/api/usuarios';

  constructor(private http: HttpClient) {}


  getDirecciones(usuarioSub: string): Observable<Direccion[]> {
    return this.http.get<Direccion[]>(`${this.apiUrl}/${usuarioSub}/direccion`);
  }
}
