export interface AuthUser {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  dependencia: string;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  usuario: AuthUser;
}

export interface SessionState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}