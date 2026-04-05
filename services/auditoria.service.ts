import { http } from '@/services/http';
import type { ApiListResponse } from '@/types/common';
import type {
  AuditoriaExportResponse,
  AuditoriaFilters,
  AuditoriaOptions,
  AuditoriaRegistro,
} from '@/types/auditoria';

export async function fetchAuditoria(filters: AuditoriaFilters) {
  const { data } = await http.get<ApiListResponse<AuditoriaRegistro>>('/auditoria', {
    params: filters,
  });

  return data;
}

export async function fetchAuditoriaOptions() {
  const { data } = await http.get<AuditoriaOptions>('/auditoria/options');
  return data;
}

export async function exportAuditoria(filters: AuditoriaFilters) {
  const { data } = await http.get<AuditoriaExportResponse>('/auditoria/export', {
    params: filters,
  });

  return data;
}
