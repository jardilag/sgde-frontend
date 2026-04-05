export interface DashboardExpedienteEstadoMetric {
  estado: string;
  total: number;
}

export interface DashboardTopMetric {
  key:
    | 'radicacionesMes'
    | 'prestamosActivos'
    | 'prestamosVencidos'
    | 'transferenciasRealizadas';
  label: string;
  total: number;
  hint: string;
}

export interface DashboardActividadReciente {
  id: string;
  fechaHora: string;
  usuario: string;
  accion: string;
  entidadAfectada: string;
  descripcion: string;
}

export interface DashboardAlertaVencimiento {
  id: string;
  tipo: 'Prestamo' | 'Transferencia';
  titulo: string;
  fechaLimite: string;
  severidad: 'Media' | 'Alta';
  detalle: string;
}

export interface DashboardTransferenciaResumen {
  tipoTransferencia: 'Primaria' | 'Secundaria';
  total: number;
}

export interface DashboardSummary {
  fechaCorte: string;
  metricasExpedientes: DashboardExpedienteEstadoMetric[];
  metricasClave: DashboardTopMetric[];
  transferenciasResumen: DashboardTransferenciaResumen[];
  actividadReciente: DashboardActividadReciente[];
  alertasVencimientos: DashboardAlertaVencimiento[];
}