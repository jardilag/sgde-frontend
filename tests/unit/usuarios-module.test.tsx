import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/test-utils';
import { UsuariosModule } from '@/components/usuarios/usuarios-module';

jest.mock('@/hooks/use-usuarios', () => ({
  useUsuariosQuery: jest.fn(),
  useUsuarioMutations: jest.fn(),
}));

const { useUsuariosQuery, useUsuarioMutations } = jest.requireMock('@/hooks/use-usuarios') as {
  useUsuariosQuery: jest.Mock;
  useUsuarioMutations: jest.Mock;
};

describe('UsuariosModule', () => {
  beforeEach(() => {
    useUsuariosQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: {
        items: [
          {
            id: 'usr-1',
            nombre: 'Andrea Castro',
            email: 'andrea.castro@sgde.gov.co',
            rol: 'Administrador',
            dependencia: 'Tecnología',
            activo: true,
            createdAt: '2026-03-29T00:00:00.000Z',
          },
        ],
        meta: { page: 1, pageSize: 5, total: 1, totalPages: 1 },
      },
    });

    useUsuarioMutations.mockReturnValue({
      createMutation: { isPending: false, mutateAsync: jest.fn() },
      updateMutation: { isPending: false, mutateAsync: jest.fn() },
      deleteMutation: { isPending: false, mutateAsync: jest.fn() },
    });
  });

  it('muestra la tabla y acciones de usuarios', () => {
    renderWithProviders(<UsuariosModule />);

    expect(screen.getByText('Usuarios')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar por nombre, correo, rol o dependencia')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /editar/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /eliminar/i })[0]).toBeInTheDocument();
  });
});