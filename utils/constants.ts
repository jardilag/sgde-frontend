export const SESSION_COOKIE_NAME = 'sgde_session';

export const AUTH_DEMO_CREDENTIALS = {
  email: 'admin@sgde.gov.co',
  password: 'SGDE2026!',
};

export const APP_ROUTES = {
  dashboard: '/dashboard',
  documentos: '/documentos',
  radicados: '/radicados',
  prestamos: '/prestamos',
  transferencias: '/transferencias',
  auditoria: '/auditoria',
  dependencias: '/dependencias',
  trd: '/trd',
  expedientes: '/expedientes',
  usuarios: '/usuarios',
  login: '/login',
};

export const DEFAULT_PAGE_SIZE = 5;

export const STATUS_BADGE_TEXT: Record<string, string> = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  borrador: 'Borrador',
  'en revisión': 'En revisión',
  aprobado: 'Aprobado',
  archivado: 'Archivado',
  abierto: 'Abierto',
  cerrado: 'Cerrado',
  pendiente: 'Pendiente',
  devuelto: 'Devuelto',
  vencido: 'Vencido',
};
