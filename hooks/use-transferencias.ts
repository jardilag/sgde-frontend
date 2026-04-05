'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTransferencia,
  descargarInventarioTransferencia,
  fetchExpedientesTransferibles,
  fetchTransferencias,
} from '@/services/transferencias.service';
import type { TransferenciaFilters, TransferenciaRequest, TipoTransferencia } from '@/types/transferencia';

export const transferenciasKeys = {
  all: ['transferencias'] as const,
  list: (filters: TransferenciaFilters) => ['transferencias', filters] as const,
  elegibles: (tipoTransferencia: TipoTransferencia) => ['transferencias', 'eligibles', tipoTransferencia] as const,
};

export function useTransferenciasQuery(filters: TransferenciaFilters) {
  return useQuery({
    queryKey: transferenciasKeys.list(filters),
    queryFn: () => fetchTransferencias(filters),
  });
}

export function useExpedientesTransferiblesQuery(tipoTransferencia: TipoTransferencia) {
  return useQuery({
    queryKey: transferenciasKeys.elegibles(tipoTransferencia),
    queryFn: () => fetchExpedientesTransferibles(tipoTransferencia),
  });
}

export function useTransferenciaMutations() {
  const queryClient = useQueryClient();

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: transferenciasKeys.all });
  };

  const createMutation = useMutation({
    mutationFn: (payload: TransferenciaRequest) => createTransferencia(payload),
    onSuccess: refresh,
  });

  const downloadMutation = useMutation({
    mutationFn: (id: string) => descargarInventarioTransferencia(id),
  });

  return {
    createMutation,
    downloadMutation,
  };
}
