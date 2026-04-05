export type TipoTransferencia = 'Primaria' | 'Secundaria';

export interface TransferenciaExpedienteSnapshot {
  id: string;
  codigoExpediente: string;
  nombreExpediente: string;
  estadoExpediente: string;
}

export interface Transferencia {
  id: string;
  tipoTransferencia: TipoTransferencia;
  fechaTransferencia: string;
  observacion?: string;
  expedientes: TransferenciaExpedienteSnapshot[];
  cantidadExpedientes: number;
  inventarioDisponible: boolean;
  inventarioNombreArchivo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransferenciaRequest {
  tipoTransferencia: TipoTransferencia;
  fechaTransferencia: string;
  observacion?: string;
  expedienteIds: string[];
}

export interface TransferenciaFilters {
  q: string;
  page: number;
  pageSize: number;
  tipoTransferencia?: TipoTransferencia;
  fechaDesde?: string;
  fechaHasta?: string;
  expedienteId?: string;
}

export interface ExpedienteTransferible {
  id: string;
  codigoExpediente: string;
  nombre: string;
  estadoActual: string;
  dependenciaNombre?: string;
  subserieNombre?: string;
  motivoElegible: string;
}

export interface InventarioDownloadResponse {
  downloadUrl?: string;
  fileName?: string;
  contentBase64?: string;
  mimeType?: string;
}
