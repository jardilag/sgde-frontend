'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteRadicado, fetchRadicados, createRadicado, updateRadicado } from '@/services/radicados.service';
import type { RadicadoFilters, RadicadoRequest } from '@/types/radicado';

export const radicadosKeys = {
  all: ['radicados'] as const,
  list: (filters: RadicadoFilters) => ['radicados', filters] as const,
};

export function useRadicadosQuery(filters: RadicadoFilters) {
  return useQuery({
    queryKey: radicadosKeys.list(filters),
    queryFn: () => fetchRadicados(filters),
  });
}

export function useRadicadoMutations() {
  const queryClient = useQueryClient();

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: radicadosKeys.all });
  };

  const createMutation = useMutation({
    mutationFn: createRadicado,
    onSuccess: refresh,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RadicadoRequest }) => updateRadicado(id, payload),
    onSuccess: refresh,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRadicado,
    onSuccess: refresh,
  });

  return { createMutation, updateMutation, deleteMutation };
}