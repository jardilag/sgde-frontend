export interface AuditoriaRegistro {
  id: string;
  fechaHora: string;
  usuario: string;
  accion: string;
  entidadAfectada: string;
  idEntidad: string;
  descripcion: string;
  ipAddress?: string;
}

export interface AuditoriaFilters {
  q: string;
  page: number;
  pageSize: number;
  usuario?: string;
  entidadAfectada?: string;
  accion?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  sortBy?: 'fechaHora';
  sortDirection?: 'asc' | 'desc';
}

export interface AuditoriaOptions {
  usuarios: string[];
  entidades: string[];
  acciones: string[];
}

export interface AuditoriaExportResponse {
  downloadUrl?: string;
  fileName?: string;
  contentBase64?: string;
  mimeType?: string;
}
