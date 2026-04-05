/**
 * React Query hooks para Expedientes
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expedienteService } from '@/services/expediente.service';
import { ExpedienteRequest, ExpedienteFilters } from '@/types/expediente';

// Query keys
export const expedienteKeys = {
  all: ['expedientes'] as const,
  lists: () => [...expedienteKeys.all, 'list'] as const,
  list: (filters?: ExpedienteFilters) => [...expedienteKeys.lists(), { filters }] as const,
  details: () => [...expedienteKeys.all, 'detail'] as const,
  detail: (id: string) => [...expedienteKeys.details(), id] as const,
  historial: (id: string) => [...expedienteKeys.detail(id), 'historial'] as const,
  documentos: (id: string) => [...expedienteKeys.detail(id), 'documentos'] as const,
};

/**
 * Hook para obtener lista de expedientes
 */
export function useExpedientesQuery(filters?: ExpedienteFilters) {
  return useQuery({
    queryKey: expedienteKeys.list(filters),
    queryFn: () => expedienteService.fetchExpedientes(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para obtener detalle de expediente
 */
export function useExpedienteDetailQuery(id: string | null) {
  return useQuery({
    queryKey: expedienteKeys.detail(id || ''),
    queryFn: () => expedienteService.fetchExpedienteById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obtener historial de expediente
 */
export function useHistorialQuery(expedienteId: string | null) {
  return useQuery({
    queryKey: expedienteKeys.historial(expedienteId || ''),
    queryFn: () => expedienteService.fetchHistorial(expedienteId!),
    enabled: !!expedienteId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para obtener documentos de expediente
 */
export function useDocumentosQuery(expedienteId: string | null) {
  return useQuery({
    queryKey: expedienteKeys.documentos(expedienteId || ''),
    queryFn: () => expedienteService.fetchDocumentos(expedienteId!),
    enabled: !!expedienteId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook para mutations (crear, actualizar, eliminar)
 */
export function useExpedienteMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: ExpedienteRequest) => expedienteService.createExpediente(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expedienteKeys.lists() });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ExpedienteRequest> }) =>
      expedienteService.updateExpediente(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expedienteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expedienteKeys.details() });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => expedienteService.deleteExpediente(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expedienteKeys.lists() });
    },
  });

  const cerrarMutation = useMutation({
    mutationFn: ({ id, fechaCierre }: { id: string; fechaCierre: string }) =>
      expedienteService.cerrarExpediente(id, fechaCierre),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: expedienteKeys.list() });
      queryClient.invalidateQueries({ queryKey: expedienteKeys.detail(id) });
    },
  });

  const reabrirMutation = useMutation({
    mutationFn: (id: string) => expedienteService.reabrirExpediente(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: expedienteKeys.list() });
      queryClient.invalidateQueries({ queryKey: expedienteKeys.detail(id) });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    cerrarMutation,
    reabrirMutation,
  };
}
