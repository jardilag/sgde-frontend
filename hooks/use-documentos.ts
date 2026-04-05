'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  actualizarDocumento,
  eliminarDocumento,
  fetchDocumentoByRadicado,
  fetchDocumentos,
  radicarDocumento,
} from '@/services/documento.service';
import type { DocumentoFilters, DocumentoRequest } from '@/types/documento';

export const documentosKeys = {
  all: ['documentos'] as const,
  list: (filters: DocumentoFilters) => ['documentos', filters] as const,
  byRadicado: (numeroRadicado: string) => ['documentos', 'radicado', numeroRadicado] as const,
};

export function useDocumentosQuery(filters: DocumentoFilters) {
  return useQuery({
    queryKey: documentosKeys.list(filters),
    queryFn: () => fetchDocumentos(filters),
  });
}

export function useDocumentoByRadicadoQuery(numeroRadicado: string | null) {
  return useQuery({
    queryKey: documentosKeys.byRadicado(numeroRadicado ?? ''),
    queryFn: () => fetchDocumentoByRadicado(numeroRadicado ?? ''),
    enabled: Boolean(numeroRadicado?.trim()),
  });
}

export function useDocumentoMutations() {
  const queryClient = useQueryClient();

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: documentosKeys.all });
  };

  const createMutation = useMutation({
    mutationFn: ({ payload, onProgress }: { payload: DocumentoRequest; onProgress?: (progress: number) => void }) =>
      radicarDocumento(payload, onProgress),
    onSuccess: refresh,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload, onProgress }: { id: string; payload: DocumentoRequest; onProgress?: (progress: number) => void }) =>
      actualizarDocumento(id, payload, onProgress),
    onSuccess: refresh,
  });

  const deleteMutation = useMutation({
    mutationFn: eliminarDocumento,
    onSuccess: refresh,
  });

  return { createMutation, updateMutation, deleteMutation };
}