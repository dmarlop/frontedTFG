// src/app/models/cliente.model.ts

export interface Direccion {
  /** UUID de la dirección */
  id: string;

  /** sub del usuario al que pertenece */
  usuarioSub: string;

  /** calle, número… */
  direccion: string;

  /** código postal (puede ser null) */
  codigoPostal?: string;

  /** municipio (puede ser null) */
  municipio?: string;

  /** provincia (puede ser null) */
  provincia?: string;

  /** true si es la dirección por defecto del usuario */
  esDefault: boolean;

  /** fechas en formato ISO */
  createdAt: string;
  
  updatedAt: string;
}

export interface Cliente {
  /** el “sub” (PK) de tu usuario */
  sub: string;

  email: string;
  nombre: string;

  /** puede venir vacío */
  apellido?: string;
  telefono?: string;

  /** campo comentario de la tabla usuario */
  comentario?: string;

  /** ‘comprador’ | ‘administrador’ */
  rol: 'comprador' | 'administrador';

  /** ‘Activo’ | ‘Baja’ */
  state: 'Activo' | 'Baja';

  /** fechas en ISO (ej. “2025-05-11T10:15:30”) */
  createdAt: string;
  updatedAt: string;

  /** opcionalmente, uno puede volcar aquí el listado de direcciones */
  direcciones?: Direccion[];
}

  