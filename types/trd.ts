/**
 * Serie Documental
 * Entidad padre que representa una serie documental en la Tabla de Retención Documental (TRD)
 */
export interface Serie {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  estado: 'Activa' | 'Inactiva';
  createdAt: string;
}

/**
 * Subserie Documental
 * Entidad hija que especifica tiempos de retención y disposición final
 */
export interface Subserie {
  id: string;
  serieId: string;
  codigo: string;
  nombre: string;
  tiempoRetencionGestion: number; // en años
  tiempoRetencionCentral: number; // en años
  disposicionFinal: 'Eliminación' | 'Conservación permanente';
  estado: 'Activa' | 'Inactiva';
  createdAt: string;
}

/**
 * Request para crear/editar Serie
 */
export interface SerieRequest {
  codigo: string;
  nombre: string;
  descripcion: string;
  estado: 'Activa' | 'Inactiva';
}

/**
 * Request para crear/editar Subserie
 */
export interface SubserieRequest {
  serieId: string;
  codigo: string;
  nombre: string;
  tiempoRetencionGestion: number;
  tiempoRetencionCentral: number;
  disposicionFinal: 'Eliminación' | 'Conservación permanente';
  estado: 'Activa' | 'Inactiva';
}

/**
 * Filtros para listar Series
 */
export interface SerieFilters {
  q: string;
  page: number;
  pageSize: number;
}

/**
 * Filtros para listar Subseries de una Serie
 */
export interface SubserieFilters {
  serieId: string;
  q: string;
  page: number;
  pageSize: number;
}

/**
 * Estructura jerárquica: Serie con sus subseries incluidas
 */
export interface SerieExtended extends Serie {
  subseries: Subserie[];
}
