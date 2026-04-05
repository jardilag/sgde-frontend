import { http } from '@/services/http';
import type { ApiListResponse } from '@/types/common';
import type { Usuario, UsuarioFilters, UsuarioRequest } from '@/types/usuario';

export async function fetchUsuarios(filters: UsuarioFilters) {
  const { data } = await http.get<ApiListResponse<Usuario>>('/usuarios', {
    params: filters,
  });

  return data;
}

export async function createUsuario(payload: UsuarioRequest) {
  const { data } = await http.post<{ message: string; item: Usuario }>('/usuarios', payload);
  return data.item;
}

export async function updateUsuario(id: string, payload: UsuarioRequest) {
  const { data } = await http.put<{ message: string; item: Usuario }>(`/usuarios/${id}`, payload);
  return data.item;
}

export async function deleteUsuario(id: string) {
  const { data } = await http.delete<{ message: string }>(`/usuarios/${id}`);
  return data;
}