export type RadicadoEstado = 'Abierto' | 'Pendiente' | 'Cerrado';

export interface Radicado {
  id: string;
  numeroRadicado: string;
  asunto: string;
  remitente: string;
  dependenciaDestino: string;
  estado: RadicadoEstado;
  fechaRadicacion: string;
  canalIngreso: string;
  createdAt: string;
}

export interface RadicadoRequest {
  numeroRadicado: string;
  asunto: string;
  remitente: string;
  dependenciaDestino: string;
  estado: RadicadoEstado;
  fechaRadicacion: string;
  canalIngreso: string;
}

export interface RadicadoFilters {
  q: string;
  page: number;
  pageSize: number;
}