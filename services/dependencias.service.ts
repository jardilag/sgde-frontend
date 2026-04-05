import { http } from '@/services/http';
import type { ApiListResponse } from '@/types/common';
import type { Dependencia, DependenciaFilters, DependenciaRequest } from '@/types/dependencia';

export async function fetchDependencias(filters: DependenciaFilters) {
  const { data } = await http.get<ApiListResponse<Dependencia>>('/dependencias', {
    params: filters,
  });

  return data;
}

export async function createDependencia(payload: DependenciaRequest) {
  const { data } = await http.post<{ message: string; item: Dependencia }>('/dependencias', payload);
  return data.item;
}

export async function updateDependencia(id: string, payload: DependenciaRequest) {
  const { data } = await http.put<{ message: string; item: Dependencia }>(`/dependencias/${id}`, payload);
  return data.item;
}

export async function deleteDependencia(id: string) {
  const { data } = await http.delete<{ message: string }>(`/dependencias/${id}`);
  return data;
}
