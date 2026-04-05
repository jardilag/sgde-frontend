import type { DashboardSummary } from '@/types/dashboard';
import type { AuditoriaExportResponse, AuditoriaFilters, AuditoriaOptions, AuditoriaRegistro } from '@/types/auditoria';
import type { Dependencia, DependenciaRequest } from '@/types/dependencia';
import type { Documento, DocumentoRequest } from '@/types/documento';
import type { Expediente, ExpedienteRequest, EstadoExpediente } from '@/types/expediente';
import type { Prestamo, PrestamoDevolucionRequest, PrestamoRequest } from '@/types/prestamo';
import type { Radicado, RadicadoRequest } from '@/types/radicado';
import type {
  ExpedienteTransferible,
  InventarioDownloadResponse,
  Transferencia,
  TransferenciaRequest,
  TipoTransferencia,
} from '@/types/transferencia';
import type { Serie, SerieRequest, Subserie, SubserieRequest } from '@/types/trd';
import type { Usuario, UsuarioRequest } from '@/types/usuario';
import { AUTH_DEMO_CREDENTIALS } from '@/utils/constants';

const now = () => new Date().toISOString();
const randomUUID = () => globalThis.crypto.randomUUID();

const documentoSeed: Documento[] = [
  {
    id: randomUUID(),
    radicado: 'SGDE-2026-0001',
    numeroRadicado: 'SGDE-2026-0001',
    titulo: 'Resolucion de apertura de convocatoria',
    tipoDocumento: 'Resolucion',
    tipoRadicado: 'Entrada',
    dependencia: 'Secretaria General',
    dependenciaId: 'dep-secretaria',
    dependenciaNombre: 'Secretaria General',
    funcionarioResponsable: 'Laura Gomez',
    estado: 'Aprobado',
    fechaRadicacion: '2026-03-29',
    fechaDocumento: '2026-03-29',
    resumen: 'Documento de apertura para proceso de seleccion interna.',
    createdAt: now(),
  },
  {
    id: randomUUID(),
    radicado: 'SGDE-2026-0002',
    numeroRadicado: 'SGDE-2026-0002',
    titulo: 'Informe de gestion trimestral',
    tipoDocumento: 'Informe',
    tipoRadicado: 'Entrada',
    dependencia: 'Planeacion',
    dependenciaId: 'dep-planeacion',
    dependenciaNombre: 'Planeacion',
    funcionarioResponsable: 'Carlos Ruiz',
    estado: 'En revisión',
    fechaRadicacion: '2026-03-28',
    fechaDocumento: '2026-03-28',
    resumen: 'Reporte consolidado de avance de metas estrategicas.',
    createdAt: now(),
  },
  {
    id: randomUUID(),
    radicado: 'SGDE-2026-0003',
    numeroRadicado: 'SGDE-2026-0003',
    titulo: 'Circular de lineamientos internos',
    tipoDocumento: 'Circular',
    tipoRadicado: 'Interno',
    dependencia: 'Talento Humano',
    dependenciaId: 'dep-talento',
    dependenciaNombre: 'Talento Humano',
    funcionarioResponsable: 'Maria Torres',
    estado: 'Borrador',
    fechaRadicacion: '2026-03-27',
    fechaDocumento: '2026-03-27',
    resumen: 'Lineamientos para actualizacion de competencias.',
    createdAt: now(),
  },
  {
    id: randomUUID(),
    radicado: 'SGDE-2026-0004',
    numeroRadicado: 'SGDE-2026-0004',
    titulo: 'Acta de comite archivistico',
    tipoDocumento: 'Acta',
    tipoRadicado: 'Interno',
    dependencia: 'Archivo Central',
    dependenciaId: 'dep-archivo',
    dependenciaNombre: 'Archivo Central',
    funcionarioResponsable: 'Andres Molina',
    estado: 'Archivado',
    fechaRadicacion: '2026-03-25',
    fechaDocumento: '2026-03-25',
    resumen: 'Decisiones del comite para disposicion documental.',
    createdAt: now(),
  },
  {
    id: randomUUID(),
    radicado: 'SGDE-2026-0005',
    numeroRadicado: 'SGDE-2026-0005',
    titulo: 'Contrato de prestacion de servicios',
    tipoDocumento: 'Contrato',
    tipoRadicado: 'Salida',
    dependencia: 'Juridica',
    dependenciaId: 'dep-juridica',
    dependenciaNombre: 'Juridica',
    funcionarioResponsable: 'Sofia Perez',
    estado: 'En revisión',
    fechaRadicacion: '2026-03-24',
    fechaDocumento: '2026-03-24',
    resumen: 'Minuta contractual lista para revision juridica final.',
    createdAt: now(),
  },
];

const radicadoSeed: Radicado[] = [
  {
    id: randomUUID(),
    numeroRadicado: 'RAD-2026-0001',
    asunto: 'Solicitud de acceso a expediente',
    remitente: 'Alcaldia Municipal de Villa Rica',
    dependenciaDestino: 'Archivo Central',
    estado: 'Abierto',
    fechaRadicacion: '2026-03-29',
    canalIngreso: 'Ventanilla unica',
    createdAt: now(),
  },
  {
    id: randomUUID(),
    numeroRadicado: 'RAD-2026-0002',
    asunto: 'Requerimiento de informacion contractual',
    remitente: 'Contraloria Departamental',
    dependenciaDestino: 'Juridica',
    estado: 'Pendiente',
    fechaRadicacion: '2026-03-28',
    canalIngreso: 'Correo electronico',
    createdAt: now(),
  },
  {
    id: randomUUID(),
    numeroRadicado: 'RAD-2026-0003',
    asunto: 'Respuesta a derecho de peticion',
    remitente: 'Ciudadania',
    dependenciaDestino: 'Atencion al ciudadano',
    estado: 'Cerrado',
    fechaRadicacion: '2026-03-27',
    canalIngreso: 'Portal web',
    createdAt: now(),
  },
  {
    id: randomUUID(),
    numeroRadicado: 'RAD-2026-0004',
    asunto: 'Solicitud de certificacion laboral',
    remitente: 'Servidor publico',
    dependenciaDestino: 'Talento Humano',
    estado: 'Abierto',
    fechaRadicacion: '2026-03-26',
    canalIngreso: 'Ventanilla unica',
    createdAt: now(),
  },
  {
    id: randomUUID(),
    numeroRadicado: 'RAD-2026-0005',
    asunto: 'Consulta sobre archivo historico',
    remitente: 'Universidad Publica',
    dependenciaDestino: 'Archivo Central',
    estado: 'Pendiente',
    fechaRadicacion: '2026-03-24',
    canalIngreso: 'Correo electronico',
    createdAt: now(),
  },
];

const usuarioSeed: Usuario[] = [
  {
    id: randomUUID(),
    nombre: 'Andrea Castro',
    email: 'andrea.castro@sgde.gov.co',
    rol: 'Administrador',
    dependencia: 'Tecnologia',
    activo: true,
    createdAt: now(),
  },
  {
    id: randomUUID(),
    nombre: 'Luis Fernando Ospina',
    email: 'luis.ospina@sgde.gov.co',
    rol: 'Gestor documental',
    dependencia: 'Archivo Central',
    activo: true,
    createdAt: now(),
  },
  {
    id: randomUUID(),
    nombre: 'Natalia Moreno',
    email: 'natalia.moreno@sgde.gov.co',
    rol: 'Consulta',
    dependencia: 'Juridica',
    activo: false,
    createdAt: now(),
  },
  {
    id: randomUUID(),
    nombre: 'Jorge Herrera',
    email: 'jorge.herrera@sgde.gov.co',
    rol: 'Gestor documental',
    dependencia: 'Planeacion',
    activo: true,
    createdAt: now(),
  },
  {
    id: randomUUID(),
    nombre: 'Paula Rojas',
    email: 'paula.rojas@sgde.gov.co',
    rol: 'Consulta',
    dependencia: 'Atencion al ciudadano',
    activo: true,
    createdAt: now(),
  },
];

const dependenciaSeed: Dependencia[] = [
  {
    id: 'dep-secretaria',
    nombre: 'Secretaria General',
    codigo: 'SG-001',
    descripcion: 'Gestion administrativa general y coordinacion institucional.',
    estado: 'Activa',
    createdAt: now(),
  },
  {
    id: 'dep-archivo',
    nombre: 'Archivo Central',
    codigo: 'AC-002',
    descripcion: 'Administracion integral del acervo documental institucional.',
    estado: 'Activa',
    createdAt: now(),
  },
  {
    id: 'dep-juridica',
    nombre: 'Juridica',
    codigo: 'JUR-003',
    descripcion: 'Asesoria legal y revision de procesos contractuales.',
    estado: 'Activa',
    createdAt: now(),
  },
  {
    id: 'dep-planeacion',
    nombre: 'Planeacion',
    codigo: 'PLAN-004',
    descripcion: 'Diseno estrategico y seguimiento de metas institucionales.',
    estado: 'Activa',
    createdAt: now(),
  },
  {
    id: 'dep-talento',
    nombre: 'Talento Humano',
    codigo: 'TH-005',
    descripcion: 'Gestion de recursos humanos y desarrollo del personal.',
    estado: 'Activa',
    createdAt: now(),
  },
];

const serieIds = { sg: randomUUID(), ac: randomUUID(), jur: randomUUID() };

const serieSeed: Serie[] = [
  {
    id: serieIds.sg,
    codigo: 'SG-01',
    nombre: 'Administracion General',
    descripcion: 'Documentos relacionados con la administracion general de la entidad.',
    estado: 'Activa',
    createdAt: now(),
  },
  {
    id: serieIds.ac,
    codigo: 'AC-01',
    nombre: 'Actos Administrativos',
    descripcion: 'Resoluciones, acuerdos y decisiones administrativas.',
    estado: 'Activa',
    createdAt: now(),
  },
  {
    id: serieIds.jur,
    codigo: 'JUR-01',
    nombre: 'Asuntos Juridicos',
    descripcion: 'Documentacion legal, contratos y asesorias.',
    estado: 'Activa',
    createdAt: now(),
  },
];

const subserieSeed: Subserie[] = [
  {
    id: randomUUID(),
    serieId: serieIds.sg,
    codigo: 'SG-01-01',
    nombre: 'Correspondencia Interna',
    tiempoRetencionGestion: 3,
    tiempoRetencionCentral: 5,
    disposicionFinal: 'Eliminación',
    estado: 'Activa',
    createdAt: now(),
  },
  {
    id: randomUUID(),
    serieId: serieIds.sg,
    codigo: 'SG-01-02',
    nombre: 'Memorandos y Circulares',
    tiempoRetencionGestion: 2,
    tiempoRetencionCentral: 3,
    disposicionFinal: 'Eliminación',
    estado: 'Activa',
    createdAt: now(),
  },
  {
    id: randomUUID(),
    serieId: serieIds.ac,
    codigo: 'AC-01-01',
    nombre: 'Resoluciones',
    tiempoRetencionGestion: 5,
    tiempoRetencionCentral: 10,
    disposicionFinal: 'Conservación permanente',
    estado: 'Activa',
    createdAt: now(),
  },
  {
    id: randomUUID(),
    serieId: serieIds.ac,
    codigo: 'AC-01-02',
    nombre: 'Acuerdos de Junta Directiva',
    tiempoRetencionGestion: 5,
    tiempoRetencionCentral: 10,
    disposicionFinal: 'Conservación permanente',
    estado: 'Activa',
    createdAt: now(),
  },
  {
    id: randomUUID(),
    serieId: serieIds.jur,
    codigo: 'JUR-01-01',
    nombre: 'Contratos',
    tiempoRetencionGestion: 3,
    tiempoRetencionCentral: 5,
    disposicionFinal: 'Conservación permanente',
    estado: 'Activa',
    createdAt: now(),
  },
  {
    id: randomUUID(),
    serieId: serieIds.jur,
    codigo: 'JUR-01-02',
    nombre: 'Opiniones Juridicas',
    tiempoRetencionGestion: 2,
    tiempoRetencionCentral: 5,
    disposicionFinal: 'Conservación permanente',
    estado: 'Activa',
    createdAt: now(),
  },
];

const expedienteSeed: Expediente[] = [
  {
    id: randomUUID(),
    codigoExpediente: 'EXP-2026-0001',
    nombre: 'Contratacion de servicios legales',
    fechaApertura: '2026-03-15',
    estadoActual: 'Abierto' as EstadoExpediente,
    dependenciaId: dependenciaSeed[2].id,
    subserieId: subserieSeed[4].id,
    observacion: 'Proceso de licitacion abierta con tres proponentes.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: randomUUID(),
    codigoExpediente: 'EXP-2026-0002',
    nombre: 'Resolucion estrategica de planeacion',
    fechaApertura: '2026-03-10',
    fechaCierre: '2026-03-25',
    estadoActual: 'Cerrado' as EstadoExpediente,
    dependenciaId: dependenciaSeed[3].id,
    subserieId: subserieSeed[2].id,
    observacion: 'Expediente cerrado y archivado en central.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: randomUUID(),
    codigoExpediente: 'EXP-2026-0003',
    nombre: 'Memorandos de circulacion interna',
    fechaApertura: '2026-03-20',
    estadoActual: 'Abierto' as EstadoExpediente,
    dependenciaId: dependenciaSeed[0].id,
    subserieId: subserieSeed[1].id,
    observacion: 'Distribucion de directrices internas.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: randomUUID(),
    codigoExpediente: 'EXP-2026-0004',
    nombre: 'Correspondencia interinstitucional',
    fechaApertura: '2026-02-28',
    estadoActual: 'Abierto' as EstadoExpediente,
    dependenciaId: dependenciaSeed[1].id,
    subserieId: subserieSeed[0].id,
    observacion: 'Intercambio con entidades hermanas.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: randomUUID(),
    codigoExpediente: 'EXP-2026-0005',
    nombre: 'Acuerdos de junta directiva Q1',
    fechaApertura: '2026-01-15',
    fechaCierre: '2026-03-28',
    estadoActual: 'Cerrado' as EstadoExpediente,
    dependenciaId: dependenciaSeed[0].id,
    subserieId: subserieSeed[3].id,
    observacion: 'Decisiones del trimestre cerrado.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: randomUUID(),
    codigoExpediente: 'EXP-2026-0006',
    nombre: 'Asesorias juridicas en curso',
    fechaApertura: '2026-03-22',
    estadoActual: 'Abierto' as EstadoExpediente,
    dependenciaId: dependenciaSeed[2].id,
    subserieId: subserieSeed[5].id,
    observacion: 'Asesoramiento para nuevos proyectos.',
    createdAt: now(),
    updatedAt: now(),
  },
];

const prestamoSeed: Prestamo[] = [
  {
    id: randomUUID(),
    expedienteId: expedienteSeed[0].id,
    expedienteCodigo: expedienteSeed[0].codigoExpediente,
    expedienteNombre: expedienteSeed[0].nombre,
    dependenciaSolicitanteId: 'dep-juridica',
    dependenciaSolicitanteNombre: 'Juridica',
    fechaPrestamo: '2026-03-20',
    fechaDevolucionEsperada: '2026-03-28',
    fechaDevolucionReal: '2026-03-27',
    estado: 'Devuelto',
    observacion: 'Revisión contractual concluida y expediente retornado.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: randomUUID(),
    expedienteId: expedienteSeed[2].id,
    expedienteCodigo: expedienteSeed[2].codigoExpediente,
    expedienteNombre: expedienteSeed[2].nombre,
    dependenciaSolicitanteId: 'dep-talento',
    dependenciaSolicitanteNombre: 'Talento Humano',
    fechaPrestamo: '2026-03-29',
    fechaDevolucionEsperada: '2026-04-12',
    estado: 'Activo',
    observacion: 'Consulta para actualización de lineamientos internos.',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: randomUUID(),
    expedienteId: expedienteSeed[3].id,
    expedienteCodigo: expedienteSeed[3].codigoExpediente,
    expedienteNombre: expedienteSeed[3].nombre,
    dependenciaSolicitanteId: 'dep-archivo',
    dependenciaSolicitanteNombre: 'Archivo Central',
    fechaPrestamo: '2026-03-10',
    fechaDevolucionEsperada: '2026-03-18',
    estado: 'Vencido',
    observacion: 'Pendiente retorno para revisión de trazabilidad histórica.',
    createdAt: now(),
    updatedAt: now(),
  },
];

const transferenciaSeed: Transferencia[] = [
  {
    id: randomUUID(),
    tipoTransferencia: 'Primaria',
    fechaTransferencia: '2026-03-26',
    observacion: 'Transferencia primaria a archivo central con inventario validado.',
    expedientes: [
      {
        id: expedienteSeed[1].id,
        codigoExpediente: expedienteSeed[1].codigoExpediente,
        nombreExpediente: expedienteSeed[1].nombre,
        estadoExpediente: expedienteSeed[1].estadoActual,
      },
    ],
    cantidadExpedientes: 1,
    inventarioDisponible: true,
    inventarioNombreArchivo: 'FUID-TRANS-2026-0001.xlsx',
    createdAt: now(),
    updatedAt: now(),
  },
];

const auditoriaSeed: AuditoriaRegistro[] = [
  {
    id: randomUUID(),
    fechaHora: '2026-04-05T10:35:00.000Z',
    usuario: 'Andrea Castro',
    accion: 'Crear',
    entidadAfectada: 'Transferencia',
    idEntidad: 'TRANS-2026-0003',
    descripcion: 'Registro de transferencia primaria con 2 expedientes.',
    ipAddress: '10.20.31.15',
  },
  {
    id: randomUUID(),
    fechaHora: '2026-04-05T09:20:00.000Z',
    usuario: 'Luis Fernando Ospina',
    accion: 'Actualizar',
    entidadAfectada: 'Expediente',
    idEntidad: 'EXP-2026-0005',
    descripcion: 'Cierre de expediente para transferencia primaria.',
    ipAddress: '10.20.31.29',
  },
  {
    id: randomUUID(),
    fechaHora: '2026-04-04T16:10:00.000Z',
    usuario: 'Paula Rojas',
    accion: 'Consultar',
    entidadAfectada: 'Auditoria',
    idEntidad: 'AUD-QUERY-001',
    descripcion: 'Consulta de auditoría por rango de fechas.',
    ipAddress: '10.20.31.35',
  },
  {
    id: randomUUID(),
    fechaHora: '2026-04-04T14:05:00.000Z',
    usuario: 'Jorge Herrera',
    accion: 'Eliminar',
    entidadAfectada: 'Documento',
    idEntidad: 'SGDE-2026-0003',
    descripcion: 'Eliminación de documento borrador duplicado.',
    ipAddress: '10.20.31.44',
  },
  {
    id: randomUUID(),
    fechaHora: '2026-04-03T11:48:00.000Z',
    usuario: 'Andrea Castro',
    accion: 'Exportar',
    entidadAfectada: 'Auditoria',
    idEntidad: 'AUD-EXPORT-004',
    descripcion: 'Exportación de registros de auditoría para comité de control.',
  },
  {
    id: randomUUID(),
    fechaHora: '2026-04-03T08:17:00.000Z',
    usuario: 'Natalia Moreno',
    accion: 'Consultar',
    entidadAfectada: 'Radicado',
    idEntidad: 'RAD-2026-0002',
    descripcion: 'Consulta de trazabilidad de radicado con requerimiento externo.',
    ipAddress: '10.20.31.57',
  },
];

type MockDatabase = {
  auditoria: AuditoriaRegistro[];
  dependencias: Dependencia[];
  documentos: Documento[];
  prestamos: Prestamo[];
  transferencias: Transferencia[];
  radicados: Radicado[];
  series: Serie[];
  subseries: Subserie[];
  usuarios: Usuario[];
  expedientes: Expediente[];
};

const database: MockDatabase = {
  auditoria: auditoriaSeed,
  dependencias: dependenciaSeed,
  documentos: documentoSeed,
  prestamos: prestamoSeed,
  transferencias: transferenciaSeed,
  radicados: radicadoSeed,
  series: serieSeed,
  subseries: subserieSeed,
  usuarios: usuarioSeed,
  expedientes: expedienteSeed,
};

const normalize = (value: string) => value.toLowerCase().trim();

function matchesQuery(value: string, query: string) {
  return normalize(value).includes(normalize(query));
}

function paginate<T>(items: T[], page: number, pageSize: number) {
  const safePageSize = Math.max(pageSize, 1);
  const safePage = Math.max(page, 1);
  const total = items.length;
  const totalPages = Math.max(Math.ceil(total / safePageSize), 1);
  const start = (safePage - 1) * safePageSize;

  return {
    items: items.slice(start, start + safePageSize),
    meta: {
      page: safePage,
      pageSize: safePageSize,
      total,
      totalPages,
    },
  };
}

function applySort<T extends { createdAt: string }>(items: T[]) {
  return [...items].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

function resolvePrestamoEstado(prestamo: Prestamo) {
  if (prestamo.fechaDevolucionReal) {
    return 'Devuelto' as const;
  }

  const today = new Date().toISOString().slice(0, 10);
  if (prestamo.fechaDevolucionEsperada < today) {
    return 'Vencido' as const;
  }

  return 'Activo' as const;
}

export function getDemoUser() {
  return {
    id: 'demo-admin',
    nombre: 'Administrador SGDE',
    email: AUTH_DEMO_CREDENTIALS.email,
    rol: 'Administrador',
    dependencia: 'Secretaria General',
  };
}

function nextDocumentoRadicado() {
  const year = new Date().getFullYear();
  const sequence = String(database.documentos.length + 1).padStart(4, '0');

  return `SGDE-${year}-${sequence}`;
}

function buildDocumentoRecord(payload: DocumentoRequest, existing?: Documento): Documento {
  const dependencia = database.dependencias.find((item) => item.id === payload.dependenciaId);
  const expediente = payload.expedienteId ? database.expedientes.find((item) => item.id === payload.expedienteId) : undefined;
  const generatedRadicado = existing?.numeroRadicado ?? existing?.radicado ?? nextDocumentoRadicado();
  const file = payload.archivo;
  const metadata = file
    ? {
        nombreArchivo: file.name,
        mimeType: file.type || undefined,
        tamanioBytes: file.size,
        hash: `sha256-${file.name}-${file.size}`,
      }
    : existing?.metadata;

  const record = {
    id: existing?.id ?? randomUUID(),
    radicado: generatedRadicado,
    numeroRadicado: generatedRadicado,
    titulo: payload.titulo,
    tipoDocumento: payload.tipoDocumento,
    tipoRadicado: payload.tipoRadicado,
    fechaDocumento: payload.fechaDocumento,
    fechaRadicacion: payload.fechaDocumento,
    dependenciaId: payload.dependenciaId,
    dependenciaNombre: dependencia?.nombre,
    dependencia: dependencia?.nombre ?? existing?.dependencia ?? 'Sin dependencia',
    expedienteId: payload.expedienteId,
    expedienteCodigo: expediente?.codigoExpediente,
    observacion: payload.observacion,
    archivoNombre: file?.name ?? existing?.archivoNombre,
    mimeType: file?.type || existing?.mimeType,
    tamanioBytes: file?.size ?? existing?.tamanioBytes,
    archivoUrl: existing?.archivoUrl,
    previewUrl: existing?.previewUrl,
    hash: metadata?.hash,
    metadata,
    funcionarioResponsable: existing?.funcionarioResponsable ?? 'Mesa de entrada SGDE',
    estado: existing?.estado ?? 'Borrador',
    resumen: existing?.resumen ?? payload.observacion ?? payload.titulo,
    createdAt: existing?.createdAt ?? now(),
    updatedAt: now(),
  };

  if (existing) {
    return { ...existing, ...record };
  }

  return record as Documento;
}

export function listDocumentos(filters: {
  q: string;
  page: number;
  pageSize: number;
  numeroRadicado?: string;
  tipoRadicado?: string;
  dependenciaId?: string;
  titulo?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}) {
  const normalizedTitle = filters.titulo?.trim() ?? '';
  const filtered = applySort(
    database.documentos.filter((documento) => {
      const valuesToSearch = [
        documento.radicado,
        documento.numeroRadicado ?? '',
        documento.titulo,
        documento.tipoDocumento,
        documento.tipoRadicado ?? '',
        documento.dependencia,
        documento.dependenciaNombre ?? '',
        documento.funcionarioResponsable,
        documento.estado,
        documento.observacion ?? '',
      ];

      const matchesGeneralQuery = valuesToSearch.some((value) => matchesQuery(value, filters.q));
      const matchesRadicado = filters.numeroRadicado ? matchesQuery(documento.numeroRadicado ?? documento.radicado, filters.numeroRadicado) : true;
      const matchesTipo = filters.tipoRadicado ? documento.tipoRadicado === filters.tipoRadicado : true;
      const matchesDependencia = filters.dependenciaId ? documento.dependenciaId === filters.dependenciaId : true;
      const matchesTitulo = normalizedTitle ? matchesQuery(documento.titulo, normalizedTitle) : true;
      const fechaBase = documento.fechaDocumento ?? documento.fechaRadicacion;
      const matchesFechaDesde = filters.fechaDesde ? fechaBase >= filters.fechaDesde : true;
      const matchesFechaHasta = filters.fechaHasta ? fechaBase <= filters.fechaHasta : true;

      return matchesGeneralQuery && matchesRadicado && matchesTipo && matchesDependencia && matchesTitulo && matchesFechaDesde && matchesFechaHasta;
    }),
  );

  return paginate(filtered, filters.page, filters.pageSize);
}

export function createDocumento(payload: DocumentoRequest) {
  const documento = buildDocumentoRecord(payload);

  database.documentos = [documento, ...database.documentos];
  return documento;
}

export function updateDocumento(id: string, payload: DocumentoRequest) {
  const index = database.documentos.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const updated = buildDocumentoRecord(payload, database.documentos[index]);
  database.documentos[index] = updated;
  return updated;
}

export function deleteDocumento(id: string) {
  const before = database.documentos.length;
  database.documentos = database.documentos.filter((item) => item.id !== id);
  return database.documentos.length !== before;
}

export function listRadicados(filters: { q: string; page: number; pageSize: number }) {
  const filtered = applySort(
    database.radicados.filter((radicado) =>
      [
        radicado.numeroRadicado,
        radicado.asunto,
        radicado.remitente,
        radicado.dependenciaDestino,
        radicado.estado,
        radicado.canalIngreso,
      ].some((value) => matchesQuery(value, filters.q)),
    ),
  );

  return paginate(filtered, filters.page, filters.pageSize);
}

export function createRadicado(payload: RadicadoRequest) {
  const radicado: Radicado = {
    ...payload,
    id: randomUUID(),
    createdAt: now(),
  };

  database.radicados = [radicado, ...database.radicados];
  return radicado;
}

export function updateRadicado(id: string, payload: RadicadoRequest) {
  const index = database.radicados.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const updated: Radicado = {
    ...database.radicados[index],
    ...payload,
    id,
  };

  database.radicados[index] = updated;
  return updated;
}

export function deleteRadicado(id: string) {
  const before = database.radicados.length;
  database.radicados = database.radicados.filter((item) => item.id !== id);
  return database.radicados.length !== before;
}

export function listPrestamos(filters: {
  q: string;
  page: number;
  pageSize: number;
  estado?: string;
  dependenciaSolicitanteId?: string;
  expedienteId?: string;
}) {
  const filtered = applySort(
    database.prestamos
      .map((prestamo) => ({ ...prestamo, estado: resolvePrestamoEstado(prestamo) }))
      .filter((prestamo) => {
        const matchesGeneralQuery = [
          prestamo.expedienteCodigo ?? '',
          prestamo.expedienteNombre ?? '',
          prestamo.dependenciaSolicitanteNombre ?? '',
          prestamo.estado,
          prestamo.observacion ?? '',
        ].some((value) => matchesQuery(value, filters.q));

        const matchesEstado = filters.estado ? prestamo.estado === filters.estado : true;
        const matchesDependencia = filters.dependenciaSolicitanteId
          ? prestamo.dependenciaSolicitanteId === filters.dependenciaSolicitanteId
          : true;
        const matchesExpediente = filters.expedienteId ? prestamo.expedienteId === filters.expedienteId : true;

        return matchesGeneralQuery && matchesEstado && matchesDependencia && matchesExpediente;
      }),
  );

  return paginate(filtered, filters.page, filters.pageSize);
}

export function createPrestamo(payload: PrestamoRequest) {
  const expediente = database.expedientes.find((item) => item.id === payload.expedienteId);
  const dependencia = database.dependencias.find((item) => item.id === payload.dependenciaSolicitanteId);

  const prestamo: Prestamo = {
    id: randomUUID(),
    expedienteId: payload.expedienteId,
    expedienteCodigo: expediente?.codigoExpediente,
    expedienteNombre: expediente?.nombre,
    dependenciaSolicitanteId: payload.dependenciaSolicitanteId,
    dependenciaSolicitanteNombre: dependencia?.nombre,
    fechaPrestamo: payload.fechaPrestamo,
    fechaDevolucionEsperada: payload.fechaDevolucionEsperada,
    estado: 'Activo',
    observacion: payload.observacion,
    createdAt: now(),
    updatedAt: now(),
  };

  prestamo.estado = resolvePrestamoEstado(prestamo);
  database.prestamos = [prestamo, ...database.prestamos];

  return prestamo;
}

export function registrarDevolucionPrestamo(id: string, payload: PrestamoDevolucionRequest) {
  const index = database.prestamos.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const updated: Prestamo = {
    ...database.prestamos[index],
    fechaDevolucionReal: payload.fechaDevolucionReal,
    observacion: payload.observacion ?? database.prestamos[index].observacion,
    estado: 'Devuelto',
    updatedAt: now(),
  };

  database.prestamos[index] = updated;
  return updated;
}

function buildTransferenciaSnapshot(expediente: Expediente) {
  return {
    id: expediente.id,
    codigoExpediente: expediente.codigoExpediente,
    nombreExpediente: expediente.nombre,
    estadoExpediente: expediente.estadoActual,
  };
}

function isElegiblePrimaria(expediente: Expediente) {
  if (expediente.estadoActual !== 'Cerrado') return false;

  const hasPrimary = database.transferencias.some(
    (transferencia) =>
      transferencia.tipoTransferencia === 'Primaria' &&
      transferencia.expedientes.some((item) => item.id === expediente.id),
  );

  return !hasPrimary;
}

function isElegibleSecundaria(expediente: Expediente) {
  const hasPrimary = database.transferencias.some(
    (transferencia) =>
      transferencia.tipoTransferencia === 'Primaria' &&
      transferencia.expedientes.some((item) => item.id === expediente.id),
  );

  if (!hasPrimary) return false;

  const hasSecondary = database.transferencias.some(
    (transferencia) =>
      transferencia.tipoTransferencia === 'Secundaria' &&
      transferencia.expedientes.some((item) => item.id === expediente.id),
  );

  return !hasSecondary;
}

export function listExpedientesTransferibles(tipoTransferencia: TipoTransferencia) {
  const rows: ExpedienteTransferible[] = database.expedientes
    .filter((expediente) =>
      tipoTransferencia === 'Primaria' ? isElegiblePrimaria(expediente) : isElegibleSecundaria(expediente),
    )
    .map((expediente) => {
      const dependencia = database.dependencias.find((item) => item.id === expediente.dependenciaId);
      const subserie = database.subseries.find((item) => item.id === expediente.subserieId);

      return {
        id: expediente.id,
        codigoExpediente: expediente.codigoExpediente,
        nombre: expediente.nombre,
        estadoActual: expediente.estadoActual,
        dependenciaNombre: dependencia?.nombre,
        subserieNombre: subserie?.nombre,
        motivoElegible:
          tipoTransferencia === 'Primaria'
            ? 'Expediente cerrado sin transferencia primaria registrada.'
            : 'Cuenta con transferencia primaria y aun no registra secundaria.',
      };
    });

  return applySort(
    rows.map((item) => ({
      ...item,
      createdAt: now(),
    })),
  ).map(({ createdAt: _createdAt, ...item }) => item);
}

export function listTransferencias(filters: {
  q: string;
  page: number;
  pageSize: number;
  tipoTransferencia?: TipoTransferencia;
  fechaDesde?: string;
  fechaHasta?: string;
  expedienteId?: string;
}) {
  const filtered = applySort(
    database.transferencias.filter((transferencia) => {
      const matchesQueryValue = [
        transferencia.tipoTransferencia,
        transferencia.observacion ?? '',
        ...transferencia.expedientes.map((expediente) => expediente.codigoExpediente),
        ...transferencia.expedientes.map((expediente) => expediente.nombreExpediente),
      ].some((value) => matchesQuery(value, filters.q));

      const matchesTipo = filters.tipoTransferencia
        ? transferencia.tipoTransferencia === filters.tipoTransferencia
        : true;
      const matchesFechaDesde = filters.fechaDesde
        ? transferencia.fechaTransferencia >= filters.fechaDesde
        : true;
      const matchesFechaHasta = filters.fechaHasta
        ? transferencia.fechaTransferencia <= filters.fechaHasta
        : true;
      const matchesExpediente = filters.expedienteId
        ? transferencia.expedientes.some((expediente) => expediente.id === filters.expedienteId)
        : true;

      return (
        matchesQueryValue &&
        matchesTipo &&
        matchesFechaDesde &&
        matchesFechaHasta &&
        matchesExpediente
      );
    }),
  );

  return paginate(filtered, filters.page, filters.pageSize);
}

export function createTransferencia(payload: TransferenciaRequest) {
  const elegibles = new Set(listExpedientesTransferibles(payload.tipoTransferencia).map((item) => item.id));
  const hasInvalidExpediente = payload.expedienteIds.some((id) => !elegibles.has(id));

  if (hasInvalidExpediente) {
    return null;
  }

  const snapshots = payload.expedienteIds
    .map((id) => database.expedientes.find((expediente) => expediente.id === id))
    .filter((expediente): expediente is Expediente => Boolean(expediente))
    .map(buildTransferenciaSnapshot);

  const sequence = String(database.transferencias.length + 1).padStart(4, '0');
  const transferencia: Transferencia = {
    id: randomUUID(),
    tipoTransferencia: payload.tipoTransferencia,
    fechaTransferencia: payload.fechaTransferencia,
    observacion: payload.observacion,
    expedientes: snapshots,
    cantidadExpedientes: snapshots.length,
    inventarioDisponible: true,
    inventarioNombreArchivo: `FUID-TRANS-${new Date().getFullYear()}-${sequence}.xlsx`,
    createdAt: now(),
    updatedAt: now(),
  };

  database.transferencias = [transferencia, ...database.transferencias];
  return transferencia;
}

export function getTransferenciaInventario(id: string): InventarioDownloadResponse | null {
  const transferencia = database.transferencias.find((item) => item.id === id);
  if (!transferencia) return null;

  return {
    downloadUrl: `/api/transferencias/${id}/inventario?download=1`,
    fileName: transferencia.inventarioNombreArchivo ?? `FUID-${id}.xlsx`,
  };
}

function sortAuditoriaByFecha(items: AuditoriaRegistro[], direction: 'asc' | 'desc') {
  return [...items].sort((left, right) =>
    direction === 'asc'
      ? left.fechaHora.localeCompare(right.fechaHora)
      : right.fechaHora.localeCompare(left.fechaHora),
  );
}

export function listAuditoria(filters: AuditoriaFilters) {
  const filtered = database.auditoria.filter((item) => {
    const matchesQueryValue = [
      item.usuario,
      item.accion,
      item.entidadAfectada,
      item.idEntidad,
      item.descripcion,
      item.ipAddress ?? '',
    ].some((value) => matchesQuery(value, filters.q));

    const matchesUsuario = filters.usuario ? item.usuario === filters.usuario : true;
    const matchesEntidad = filters.entidadAfectada ? item.entidadAfectada === filters.entidadAfectada : true;
    const matchesAccion = filters.accion ? item.accion === filters.accion : true;
    const matchesFechaDesde = filters.fechaDesde ? item.fechaHora.slice(0, 10) >= filters.fechaDesde : true;
    const matchesFechaHasta = filters.fechaHasta ? item.fechaHora.slice(0, 10) <= filters.fechaHasta : true;

    return (
      matchesQueryValue &&
      matchesUsuario &&
      matchesEntidad &&
      matchesAccion &&
      matchesFechaDesde &&
      matchesFechaHasta
    );
  });

  const direction = filters.sortDirection ?? 'desc';
  const sorted = sortAuditoriaByFecha(filtered, direction);
  return paginate(sorted, filters.page, filters.pageSize);
}

export function getAuditoriaOptions(): AuditoriaOptions {
  return {
    usuarios: [...new Set(database.auditoria.map((item) => item.usuario))],
    entidades: [...new Set(database.auditoria.map((item) => item.entidadAfectada))],
    acciones: [...new Set(database.auditoria.map((item) => item.accion))],
  };
}

export function getAuditoriaExport(filters: AuditoriaFilters): AuditoriaExportResponse {
  const rows = listAuditoria({ ...filters, page: 1, pageSize: 1000 });
  const hasData = rows.items.length > 0;

  return {
    downloadUrl: hasData ? '/api/auditoria/export?download=1' : undefined,
    fileName: `AUDITORIA-${new Date().toISOString().slice(0, 10)}.csv`,
  };
}

export function listUsuarios(filters: { q: string; page: number; pageSize: number }) {
  const filtered = applySort(
    database.usuarios.filter((usuario) =>
      [usuario.nombre, usuario.email, usuario.rol, usuario.dependencia].some((value) =>
        matchesQuery(value, filters.q),
      ),
    ),
  );

  return paginate(filtered, filters.page, filters.pageSize);
}

export function createUsuario(payload: UsuarioRequest) {
  const usuario: Usuario = {
    ...payload,
    id: randomUUID(),
    createdAt: now(),
  };

  database.usuarios = [usuario, ...database.usuarios];
  return usuario;
}

export function updateUsuario(id: string, payload: UsuarioRequest) {
  const index = database.usuarios.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const updated: Usuario = {
    ...database.usuarios[index],
    ...payload,
    id,
  };

  database.usuarios[index] = updated;
  return updated;
}

export function deleteUsuario(id: string) {
  const before = database.usuarios.length;
  database.usuarios = database.usuarios.filter((item) => item.id !== id);
  return database.usuarios.length !== before;
}

export function listDependencias(filters: { q: string; page: number; pageSize: number }) {
  const filtered = applySort(
    database.dependencias.filter((dependencia) =>
      [dependencia.nombre, dependencia.codigo, dependencia.descripcion].some((value) =>
        matchesQuery(value, filters.q),
      ),
    ),
  );

  return paginate(filtered, filters.page, filters.pageSize);
}

export function createDependencia(payload: DependenciaRequest) {
  const dependencia: Dependencia = {
    ...payload,
    id: randomUUID(),
    createdAt: now(),
  };

  database.dependencias = [dependencia, ...database.dependencias];
  return dependencia;
}

export function updateDependencia(id: string, payload: DependenciaRequest) {
  const index = database.dependencias.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const updated: Dependencia = {
    ...database.dependencias[index],
    ...payload,
    id,
  };

  database.dependencias[index] = updated;
  return updated;
}

export function deleteDependencia(id: string) {
  const before = database.dependencias.length;
  database.dependencias = database.dependencias.filter((item) => item.id !== id);
  return database.dependencias.length !== before;
}

export function listSeries(filters: { q: string; page: number; pageSize: number }) {
  const filtered = applySort(
    database.series.filter((serie) =>
      [serie.codigo, serie.nombre, serie.descripcion].some((value) => matchesQuery(value, filters.q)),
    ),
  );

  return paginate(filtered, filters.page, filters.pageSize);
}

export function createSerie(payload: SerieRequest) {
  const serie: Serie = {
    ...payload,
    id: randomUUID(),
    createdAt: now(),
  };

  database.series = [serie, ...database.series];
  return serie;
}

export function updateSerie(id: string, payload: SerieRequest) {
  const index = database.series.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const updated: Serie = {
    ...database.series[index],
    ...payload,
    id,
  };

  database.series[index] = updated;
  return updated;
}

export function deleteSerie(id: string) {
  const before = database.series.length;
  database.series = database.series.filter((item) => item.id !== id);
  return database.series.length !== before;
}

export function listSubseries(serieId: string, filters: { q: string; page: number; pageSize: number }) {
  const filtered = applySort(
    database.subseries.filter(
      (subserie) =>
        subserie.serieId === serieId &&
        [subserie.codigo, subserie.nombre].some((value) => matchesQuery(value, filters.q)),
    ),
  );

  return paginate(filtered, filters.page, filters.pageSize);
}

export function createSubserie(payload: SubserieRequest) {
  const subserie: Subserie = {
    ...payload,
    id: randomUUID(),
    createdAt: now(),
  };

  database.subseries = [subserie, ...database.subseries];
  return subserie;
}

export function updateSubserie(serieId: string, id: string, payload: SubserieRequest) {
  const index = database.subseries.findIndex((item) => item.id === id && item.serieId === serieId);
  if (index < 0) return null;

  const updated: Subserie = {
    ...database.subseries[index],
    ...payload,
    id,
  };

  database.subseries[index] = updated;
  return updated;
}

export function deleteSubserie(serieId: string, id: string) {
  const before = database.subseries.length;
  database.subseries = database.subseries.filter((item) => !(item.id === id && item.serieId === serieId));
  return database.subseries.length !== before;
}

export function listExpedientes(filters: {
  q?: string;
  page: number;
  pageSize: number;
  dependenciaId?: string;
  subserieId?: string;
  estadoActual?: EstadoExpediente;
  fechaDesde?: string;
  fechaHasta?: string;
}) {
  const filtered = applySort(
    database.expedientes.filter((expediente) => {
      const matchText = (filters.q ?? '').trim().length
        ? [
            expediente.codigoExpediente,
            expediente.nombre,
            expediente.estadoActual,
            expediente.observacion || '',
          ].some((value) => matchesQuery(value, filters.q ?? ''))
        : true;

      const matchDependencia = filters.dependenciaId ? expediente.dependenciaId === filters.dependenciaId : true;
      const matchSubserie = filters.subserieId ? expediente.subserieId === filters.subserieId : true;
      const matchEstado = filters.estadoActual ? expediente.estadoActual === filters.estadoActual : true;
      const matchDesde = filters.fechaDesde ? expediente.fechaApertura >= filters.fechaDesde : true;
      const matchHasta = filters.fechaHasta ? expediente.fechaApertura <= filters.fechaHasta : true;

      return matchText && matchDependencia && matchSubserie && matchEstado && matchDesde && matchHasta;
    }),
  );

  return paginate(filtered, filters.page, filters.pageSize);
}

export function getExpedienteById(id: string) {
  return database.expedientes.find((item) => item.id === id) ?? null;
}

export function createExpediente(payload: ExpedienteRequest) {
  const expediente: Expediente = {
    ...payload,
    id: randomUUID(),
    createdAt: now(),
    updatedAt: now(),
  };

  database.expedientes = [expediente, ...database.expedientes];
  return expediente;
}

export function updateExpediente(id: string, payload: Partial<ExpedienteRequest>) {
  const index = database.expedientes.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const updated: Expediente = {
    ...database.expedientes[index],
    ...payload,
    id,
    updatedAt: now(),
  };

  database.expedientes[index] = updated;
  return updated;
}

export function deleteExpediente(id: string) {
  const before = database.expedientes.length;
  database.expedientes = database.expedientes.filter((item) => item.id !== id);
  return database.expedientes.length !== before;
}

export function cerrarExpediente(id: string, fechaCierre: string) {
  return updateExpediente(id, {
    estadoActual: 'Cerrado' as EstadoExpediente,
    fechaCierre,
  });
}

export function reabrirExpediente(id: string) {
  return updateExpediente(id, {
    estadoActual: 'Reabierto' as EstadoExpediente,
    fechaCierre: undefined,
  });
}

export function getDashboardSummary(): DashboardSummary {
  const nowDate = new Date();
  const currentYear = nowDate.getFullYear();
  const currentMonth = String(nowDate.getMonth() + 1).padStart(2, '0');

  const metricasExpedientes = ['Abierto', 'Cerrado', 'Suspendido', 'Reabierto'].map((estado) => ({
    estado,
    total: database.expedientes.filter((item) => item.estadoActual === estado).length,
  }));

  const radicacionesMes = database.radicados.filter((item) => item.fechaRadicacion.startsWith(`${currentYear}-${currentMonth}`)).length;
  const prestamosEnEstado = database.prestamos.map((item) => ({ ...item, estado: resolvePrestamoEstado(item) }));
  const prestamosActivos = prestamosEnEstado.filter((item) => item.estado === 'Activo').length;
  const prestamosVencidos = prestamosEnEstado.filter((item) => item.estado === 'Vencido').length;

  const transferenciasRealizadas = database.transferencias.length;

  const transferenciasResumen = ['Primaria', 'Secundaria'].map((tipoTransferencia) => ({
    tipoTransferencia: tipoTransferencia as 'Primaria' | 'Secundaria',
    total: database.transferencias.filter((item) => item.tipoTransferencia === tipoTransferencia).length,
  }));

  const actividadReciente = applySort(
    database.auditoria.map((item) => ({
      ...item,
      createdAt: item.fechaHora,
    })),
  )
    .slice(0, 8)
    .map(({ createdAt: _createdAt, ...item }) => ({
      id: item.id,
      fechaHora: item.fechaHora,
      usuario: item.usuario,
      accion: item.accion,
      entidadAfectada: item.entidadAfectada,
      descripcion: item.descripcion,
    }));

  const alertasPrestamos = prestamosEnEstado
    .filter((item) => item.estado === 'Vencido')
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      tipo: 'Prestamo' as const,
      titulo: `Préstamo vencido ${item.expedienteCodigo ?? item.expedienteId}`,
      fechaLimite: item.fechaDevolucionEsperada,
      severidad: 'Alta' as const,
      detalle: `La devolución esperada para ${item.expedienteNombre ?? 'expediente'} ya venció.`,
    }));

  const alertasTransferencia = listExpedientesTransferibles('Primaria').slice(0, 3).map((item) => ({
    id: `trans-alert-${item.id}`,
    tipo: 'Transferencia' as const,
    titulo: `Transferencia pendiente ${item.codigoExpediente}`,
    fechaLimite: nowDate.toISOString().slice(0, 10),
    severidad: 'Media' as const,
    detalle: 'Expediente elegible para transferencia primaria pendiente de gestión.',
  }));

  return {
    fechaCorte: nowDate.toISOString(),
    metricasExpedientes,
    metricasClave: [
      { key: 'radicacionesMes', label: 'Radicaciones del mes', total: radicacionesMes, hint: 'Registradas en el mes vigente' },
      { key: 'prestamosActivos', label: 'Préstamos activos', total: prestamosActivos, hint: 'En seguimiento operativo' },
      { key: 'prestamosVencidos', label: 'Préstamos vencidos', total: prestamosVencidos, hint: 'Requieren acción inmediata' },
      { key: 'transferenciasRealizadas', label: 'Transferencias realizadas', total: transferenciasRealizadas, hint: 'Primarias y secundarias acumuladas' },
    ],
    transferenciasResumen,
    actividadReciente,
    alertasVencimientos: [...alertasPrestamos, ...alertasTransferencia],
  };
}

