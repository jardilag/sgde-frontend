'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPrestamo, fetchPrestamos, registrarDevolucionPrestamo } from '@/services/prestamos.service';
import type { PrestamoDevolucionRequest, PrestamoFilters, PrestamoRequest } from '@/types/prestamo';

export const prestamosKeys = {
  all: ['prestamos'] as const,
  list: (filters: PrestamoFilters) => ['prestamos', filters] as const,
};

export function usePrestamosQuery(filters: PrestamoFilters) {
  return useQuery({
    queryKey: prestamosKeys.list(filters),
    queryFn: () => fetchPrestamos(filters),
  });
}

export function usePrestamoMutations() {
  const queryClient = useQueryClient();

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: prestamosKeys.all });
  };

  const createMutation = useMutation({
    mutationFn: (payload: PrestamoRequest) => createPrestamo(payload),
    onSuccess: refresh,
  });

  const devolverMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PrestamoDevolucionRequest }) =>
      registrarDevolucionPrestamo(id, payload),
    onSuccess: refresh,
  });

  return { createMutation, devolverMutation };
}
