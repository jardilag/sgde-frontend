'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteUsuario, fetchUsuarios, createUsuario, updateUsuario } from '@/services/usuarios.service';
import type { UsuarioFilters, UsuarioRequest } from '@/types/usuario';

export const usuariosKeys = {
  all: ['usuarios'] as const,
  list: (filters: UsuarioFilters) => ['usuarios', filters] as const,
};

export function useUsuariosQuery(filters: UsuarioFilters) {
  return useQuery({
    queryKey: usuariosKeys.list(filters),
    queryFn: () => fetchUsuarios(filters),
  });
}

export function useUsuarioMutations() {
  const queryClient = useQueryClient();

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: usuariosKeys.all });
  };

  const createMutation = useMutation({
    mutationFn: createUsuario,
    onSuccess: refresh,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UsuarioRequest }) => updateUsuario(id, payload),
    onSuccess: refresh,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUsuario,
    onSuccess: refresh,
  });

  return { createMutation, updateMutation, deleteMutation };
}