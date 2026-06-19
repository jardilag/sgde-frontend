export const SESSION_COOKIE_NAME = 'sgde_session';

export const AUTH_DEMO_USERS = [
  {
    id: 'demo-admin',
    nombre: 'Administrador SGDE',
    email: 'admin@sgde.gov.co',
    password: 'SGDE2026!',
    rol: 'Administrador',
    dependencia: 'Secretaria General',
    token: 'demo-admin-session-token',
  },
  {
    id: 'demo-gestor',
    nombre: 'Gestor Documental',
    email: 'gestor@sgde.gov.co',
    password: 'GESTOR2026!',
    rol: 'Gestor documental',
    dependencia: 'Archivo Central',
    token: 'demo-gestor-session-token',
  },
] as const;

export const AUTH_DEMO_CREDENTIALS = {
  email: AUTH_DEMO_USERS[0].email,
  password: AUTH_DEMO_USERS[0].password,
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
