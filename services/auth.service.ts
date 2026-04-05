import { http } from '@/services/http';
import type { AuthUser, LoginRequest, LoginResponse } from '@/types/auth';

export async function login(credentials: LoginRequest) {
  const { data } = await http.post<LoginResponse>('/auth/login', credentials);
  return data;
}

export async function logout() {
  const { data } = await http.post<{ message: string }>('/auth/logout');
  return data;
}

export async function fetchSession() {
  const { data } = await http.get<{ user: AuthUser }>('/auth/me');
  return data.user;
}