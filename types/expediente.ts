/**
 * Tipos para el módulo de Expedientes
 */

export enum EstadoExpediente {
  ABIERTO = 'Abierto',
  CERRADO = 'Cerrado',
  SUSPENDIDO = 'Suspendido',
  REABIERTO = 'Reabierto',
}

/**
 * Expediente base
 */
export interface Expediente {
  id: string;
  codigoExpediente: string;
  nombre: string;
  fechaApertura: string; // ISO 8601
  fechaCierre?: string;
  estadoActual: EstadoExpediente;
  dependenciaId: string;
  subserieId: string;
  observacion?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Solicitud para crear o actualizar expediente
 */
export interface ExpedienteRequest {
  codigoExpediente: string;
  nombre: string;
  fechaApertura: string;
  fechaCierre?: string;
  estadoActual: EstadoExpediente;
  dependenciaId: string;
  subserieId: string;
  observacion?: string;
}

/**
 * Filtros para búsqueda de expedientes
 */
export interface ExpedienteFilters {
  codigoExpediente?: string;
  nombre?: string;
  dependenciaId?: string;
  subserieId?: string;
  estadoActual?: EstadoExpediente;
  fechaDesde?: string;
  fechaHasta?: string;
}

/**
 * Expediente extendido con información relacionada
 */
export interface ExpedienteExtended extends Expediente {
  dependencia?: {
    id: string;
    nombre: string;
  };
  subserie?: {
    id: string;
    codigo: string;
    nombre: string;
  };
  documentosCount?: number;
  historialCount?: number;
}

/**
 * Entrada de historial de expediente
 */
export interface HistorialExpediente {
  id: string;
  expedienteId: string;
  accion: string; // 'creado', 'editado', 'cerrado', 'reabierto', etc.
  detalles?: string;
  usuarioId?: string;
  fechaAccion: string;
}

/**
 * Documento asociado a expediente
 */
export interface DocumentoExpediente {
  id: string;
  expedienteId: string;
  radicadoId?: string;
  titulo: string;
  tipoDocumento: string;
  fechaCarga: string;
  tamanio?: number; // en bytes
}
