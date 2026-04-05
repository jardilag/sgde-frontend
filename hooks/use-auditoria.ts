'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { exportAuditoria, fetchAuditoria, fetchAuditoriaOptions } from '@/services/auditoria.service';
import type { AuditoriaFilters } from '@/types/auditoria';

export const auditoriaKeys = {
  all: ['auditoria'] as const,
  list: (filters: AuditoriaFilters) => ['auditoria', filters] as const,
  options: ['auditoria', 'options'] as const,
};

export function useAuditoriaQuery(filters: AuditoriaFilters) {
  return useQuery({
    queryKey: auditoriaKeys.list(filters),
    queryFn: () => fetchAuditoria(filters),
  });
}

export function useAuditoriaOptionsQuery() {
  return useQuery({
    queryKey: auditoriaKeys.options,
    queryFn: fetchAuditoriaOptions,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAuditoriaMutations() {
  const exportMutation = useMutation({
    mutationFn: (filters: AuditoriaFilters) => exportAuditoria(filters),
  });

  return {
    exportMutation,
  };
}
