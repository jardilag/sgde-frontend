import { http } from '@/services/http';
import type { ApiListResponse } from '@/types/common';
import type { Serie, SerieFilters, SerieRequest, Subserie, SubserieFilters, SubserieRequest } from '@/types/trd';

// ==================== SERIES ====================

export async function fetchSeries(filters: SerieFilters) {
  const { data } = await http.get<ApiListResponse<Serie>>('/series', {
    params: filters,
  });

  return data;
}

export async function createSerie(payload: SerieRequest) {
  const { data } = await http.post<{ message: string; item: Serie }>('/series', payload);
  return data.item;
}

export async function updateSerie(id: string, payload: SerieRequest) {
  const { data } = await http.put<{ message: string; item: Serie }>(`/series/${id}`, payload);
  return data.item;
}

export async function deleteSerie(id: string) {
  const { data } = await http.delete<{ message: string }>(`/series/${id}`);
  return data;
}

// ==================== SUBSERIES ====================

export async function fetchSubseries(filters: SubserieFilters) {
  const { data } = await http.get<ApiListResponse<Subserie>>(`/series/${filters.serieId}/subseries`, {
    params: { q: filters.q, page: filters.page, pageSize: filters.pageSize },
  });

  return data;
}

export async function createSubserie(payload: SubserieRequest) {
  const { data } = await http.post<{ message: string; item: Subserie }>(
    `/series/${payload.serieId}/subseries`,
    payload,
  );
  return data.item;
}

export async function updateSubserie(serieId: string, id: string, payload: SubserieRequest) {
  const { data } = await http.put<{ message: string; item: Subserie }>(
    `/series/${serieId}/subseries/${id}`,
    payload,
  );
  return data.item;
}

export async function deleteSubserie(serieId: string, id: string) {
  const { data } = await http.delete<{ message: string }>(`/series/${serieId}/subseries/${id}`);
  return data;
}
