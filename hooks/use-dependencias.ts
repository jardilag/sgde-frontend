'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createDependencia, deleteDependencia, fetchDependencias, updateDependencia } from '@/services/dependencias.service';
import type { DependenciaFilters, DependenciaRequest } from '@/types/dependencia';

export const dependenciasKeys = {
  all: ['dependencias'] as const,
  list: (filters: DependenciaFilters) => ['dependencias', filters] as const,
};

export function useDependenciasQuery(filters: DependenciaFilters) {
  return useQuery({
    queryKey: dependenciasKeys.list(filters),
    queryFn: () => fetchDependencias(filters),
  });
}

export function useDependenciaMutations() {
  const queryClient = useQueryClient();

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: dependenciasKeys.all });
  };

  const createMutation = useMutation({
    mutationFn: createDependencia,
    onSuccess: refresh,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DependenciaRequest }) => updateDependencia(id, payload),
    onSuccess: refresh,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDependencia,
    onSuccess: refresh,
  });

  return { createMutation, updateMutation, deleteMutation };
}
