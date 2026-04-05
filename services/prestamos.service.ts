import { http } from '@/services/http';
import type { ApiListResponse } from '@/types/common';
import type { Prestamo, PrestamoDevolucionRequest, PrestamoFilters, PrestamoRequest } from '@/types/prestamo';

export async function fetchPrestamos(filters: PrestamoFilters) {
  const { data } = await http.get<ApiListResponse<Prestamo>>('/prestamos', {
    params: filters,
  });

  return data;
}

export async function createPrestamo(payload: PrestamoRequest) {
  const { data } = await http.post<{ message: string; item: Prestamo }>('/prestamos', payload);
  return data.item;
}

export async function registrarDevolucionPrestamo(id: string, payload: PrestamoDevolucionRequest) {
  const { data } = await http.put<{ message: string; item: Prestamo }>(`/prestamos/${id}/devolver`, payload);
  return data.item;
}
