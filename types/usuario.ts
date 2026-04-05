export type UsuarioRol = 'Administrador' | 'Gestor documental' | 'Consulta';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: UsuarioRol;
  dependencia: string;
  activo: boolean;
  createdAt: string;
}

export interface UsuarioRequest {
  nombre: string;
  email: string;
  rol: UsuarioRol;
  dependencia: string;
  activo: boolean;
}

export interface UsuarioFilters {
  q: string;
  page: number;
  pageSize: number;
}