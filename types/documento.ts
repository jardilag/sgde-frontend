export type DocumentoEstado = 'Borrador' | 'En revisión' | 'Aprobado' | 'Archivado';

export type TipoRadicadoDocumento = 'Entrada' | 'Salida' | 'Interno';

export interface DocumentoMetadata {
  nombreArchivo?: string;
  mimeType?: string;
  tamanioBytes?: number;
  hash?: string;
  paginas?: number;
}

export interface Documento {
  id: string;
  radicado: string;
  titulo: string;
  tipoDocumento: string;
  dependencia: string;
  funcionarioResponsable: string;
  estado: DocumentoEstado;
  fechaRadicacion: string;
  resumen: string;
  createdAt: string;
  numeroRadicado?: string;
  tipoRadicado?: TipoRadicadoDocumento;
  fechaDocumento?: string;
  dependenciaId?: string;
  dependenciaNombre?: string;
  expedienteId?: string;
  expedienteCodigo?: string;
  observacion?: string;
  archivoNombre?: string;
  archivoUrl?: string;
  previewUrl?: string;
  mimeType?: string;
  tamanioBytes?: number;
  hash?: string;
  metadata?: DocumentoMetadata;
  updatedAt?: string;
}

export interface DocumentoRequest {
  tipoDocumento: string;
  tipoRadicado: TipoRadicadoDocumento;
  titulo: string;
  fechaDocumento: string;
  dependenciaId: string;
  expedienteId?: string;
  observacion?: string;
  archivo: File;
}

export interface DocumentoFilters {
  q: string;
  page: number;
  pageSize: number;
  numeroRadicado?: string;
  tipoRadicado?: TipoRadicadoDocumento | '';
  dependenciaId?: string;
  titulo?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface DocumentoApiResponse {
  message: string;
  item: Documento;
}

export interface DocumentoConsultaResult {
  item?: Documento | null;
  found: boolean;
}