import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  
  private apiUrl = 'http://localhost:8089/clienteServer/api/usuarios';

  constructor(private http: HttpClient) {}

  
  getCliente(sub: String): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${sub}`);
  }
  getDirecciones(sub: String): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8089/clienteServer/api/usuarios/${sub}/direccion`);
  }
  crearDireccion(sub: string, direccion: any): Observable<any> {
  return this.http.post(`http://localhost:8089/clienteServer/api/usuarios/${sub}/direccion`, direccion);
}

}
