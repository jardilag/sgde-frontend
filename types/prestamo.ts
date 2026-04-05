export type PrestamoEstado = 'Activo' | 'Devuelto' | 'Vencido';

export interface Prestamo {
  id: string;
  expedienteId: string;
  expedienteCodigo?: string;
  expedienteNombre?: string;
  dependenciaSolicitanteId: string;
  dependenciaSolicitanteNombre?: string;
  fechaPrestamo: string;
  fechaDevolucionEsperada: string;
  fechaDevolucionReal?: string;
  estado: PrestamoEstado;
  observacion?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PrestamoRequest {
  expedienteId: string;
  dependenciaSolicitanteId: string;
  fechaPrestamo: string;
  fechaDevolucionEsperada: string;
  observacion?: string;
}

export interface PrestamoDevolucionRequest {
  fechaDevolucionReal: string;
  observacion?: string;
}

export interface PrestamoFilters {
  q: string;
  page: number;
  pageSize: number;
  estado?: PrestamoEstado | '';
  dependenciaSolicitanteId?: string;
  expedienteId?: string;
}
