export interface Dependencia {
  id: string;
  nombre: string;
  codigo: string;
  descripcion: string;
  estado: 'Activa' | 'Inactiva';
  createdAt: string;
}

export interface DependenciaRequest {
  nombre: string;
  codigo: string;
  descripcion: string;
  estado: 'Activa' | 'Inactiva';
}

export interface DependenciaFilters {
  q: string;
  page: number;
  pageSize: number;
}
