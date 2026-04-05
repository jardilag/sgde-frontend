import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/test-utils';
import { DependenciasModule } from '@/components/dependencias/dependencias-module';

jest.mock('@/hooks/use-dependencias', () => ({
  useDependenciasQuery: jest.fn(),
  useDependenciaMutations: jest.fn(),
}));

const { useDependenciasQuery, useDependenciaMutations } = jest.requireMock('@/hooks/use-dependencias') as {
  useDependenciasQuery: jest.Mock;
  useDependenciaMutations: jest.Mock;
};

describe('DependenciasModule', () => {
  beforeEach(() => {
    useDependenciasQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: {
        items: [
          {
            id: 'dep-1',
            nombre: 'Secretaría General',
            codigo: 'SG-001',
            descripcion: 'Gestión administrativa general.',
            estado: 'Activa',
            createdAt: '2026-03-29T00:00:00.000Z',
          },
        ],
        meta: { page: 1, pageSize: 5, total: 1, totalPages: 1 },
      },
    });

    useDependenciaMutations.mockReturnValue({
      createMutation: { isPending: false, mutateAsync: jest.fn() },
      updateMutation: { isPending: false, mutateAsync: jest.fn() },
      deleteMutation: { isPending: false, mutateAsync: jest.fn() },
    });
  });

  it('muestra la tabla y acciones de dependencias', () => {
    renderWithProviders(<DependenciasModule />);

    expect(screen.getByText('Dependencias')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar por nombre, código o descripción')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /editar/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /eliminar/i })[0]).toBeInTheDocument();
  });
});
