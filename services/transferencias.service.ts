import { http } from '@/services/http';
import type { ApiListResponse } from '@/types/common';
import type {
  ExpedienteTransferible,
  InventarioDownloadResponse,
  Transferencia,
  TransferenciaFilters,
  TransferenciaRequest,
  TipoTransferencia,
} from '@/types/transferencia';

export async function fetchTransferencias(filters: TransferenciaFilters) {
  const { data } = await http.get<ApiListResponse<Transferencia>>('/transferencias', {
    params: filters,
  });

  return data;
}

export async function createTransferencia(payload: TransferenciaRequest) {
  const { data } = await http.post<{ message: string; item: Transferencia }>('/transferencias', payload);
  return data.item;
}

export async function fetchExpedientesTransferibles(tipoTransferencia: TipoTransferencia) {
  const { data } = await http.get<{ items: ExpedienteTransferible[] }>('/transferencias/eligibles', {
    params: { tipoTransferencia },
  });

  return data.items;
}

export async function descargarInventarioTransferencia(id: string) {
  const { data } = await http.get<InventarioDownloadResponse>(`/transferencias/${id}/inventario`);
  return data;
}
