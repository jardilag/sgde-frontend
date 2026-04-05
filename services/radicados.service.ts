import { http } from '@/services/http';
import type { ApiListResponse } from '@/types/common';
import type { Radicado, RadicadoFilters, RadicadoRequest } from '@/types/radicado';

export async function fetchRadicados(filters: RadicadoFilters) {
  const { data } = await http.get<ApiListResponse<Radicado>>('/radicados', {
    params: filters,
  });

  return data;
}

export async function createRadicado(payload: RadicadoRequest) {
  const { data } = await http.post<{ message: string; item: Radicado }>('/radicados', payload);
  return data.item;
}

export async function updateRadicado(id: string, payload: RadicadoRequest) {
  const { data } = await http.put<{ message: string; item: Radicado }>(`/radicados/${id}`, payload);
  return data.item;
}

export async function deleteRadicado(id: string) {
  const { data } = await http.delete<{ message: string }>(`/radicados/${id}`);
  return data;
}