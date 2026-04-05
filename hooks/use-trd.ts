'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createSerie,
  createSubserie,
  deleteSerie,
  deleteSubserie,
  fetchSeries,
  fetchSubseries,
  updateSerie,
  updateSubserie,
} from '@/services/trd.service';
import type { SerieFilters, SerieRequest, SubserieFilters, SubserieRequest } from '@/types/trd';

// ==================== SERIES QUERY KEYS ====================

export const seriesKeys = {
  all: ['series'] as const,
  list: (filters: SerieFilters) => ['series', filters] as const,
};

export const subseriesKeys = {
  all: ['subseries'] as const,
  list: (serieId: string, filters: Omit<SubserieFilters, 'serieId'>) =>
    ['subseries', serieId, filters] as const,
};

// ==================== SERIES HOOKS ====================

export function useSeriesQuery(filters: SerieFilters) {
  return useQuery({
    queryKey: seriesKeys.list(filters),
    queryFn: () => fetchSeries(filters),
  });
}

export function useSeriesMutations() {
  const queryClient = useQueryClient();

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: seriesKeys.all });
  };

  const createMutation = useMutation({
    mutationFn: createSerie,
    onSuccess: refresh,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SerieRequest }) => updateSerie(id, payload),
    onSuccess: refresh,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSerie,
    onSuccess: refresh,
  });

  return { createMutation, updateMutation, deleteMutation };
}

// ==================== SUBSERIES HOOKS ====================

export function useSubseriesQuery(serieId: string, filters: Omit<SubserieFilters, 'serieId'>) {
  return useQuery({
    queryKey: subseriesKeys.list(serieId, filters),
    queryFn: () => fetchSubseries({ ...filters, serieId }),
    enabled: !!serieId,
  });
}

export function useSubserieMutations(serieId: string) {
  const queryClient = useQueryClient();

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['subseries', serieId] });
  };

  const createMutation = useMutation({
    mutationFn: createSubserie,
    onSuccess: refresh,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SubserieRequest }) =>
      updateSubserie(serieId, id, payload),
    onSuccess: refresh,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSubserie(serieId, id),
    onSuccess: refresh,
  });

  return { createMutation, updateMutation, deleteMutation };
}
