import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/test-utils';
import { RadicadosModule } from '@/components/radicados/radicados-module';

jest.mock('@/hooks/use-radicados', () => ({
  useRadicadosQuery: jest.fn(),
  useRadicadoMutations: jest.fn(),
}));

const { useRadicadosQuery, useRadicadoMutations } = jest.requireMock('@/hooks/use-radicados') as {
  useRadicadosQuery: jest.Mock;
  useRadicadoMutations: jest.Mock;
};

describe('RadicadosModule', () => {
  beforeEach(() => {
    useRadicadosQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: {
        items: [
          {
            id: 'rad-1',
            numeroRadicado: 'RAD-2026-0001',
            asunto: 'Solicitud de acceso a expediente',
            remitente: 'Alcaldía Municipal de Villa Rica',
            dependenciaDestino: 'Archivo Central',
            estado: 'Abierto',
            fechaRadicacion: '2026-03-29',
            canalIngreso: 'Ventanilla única',
            createdAt: '2026-03-29T00:00:00.000Z',
          },
        ],
        meta: { page: 1, pageSize: 5, total: 1, totalPages: 1 },
      },
    });

    useRadicadoMutations.mockReturnValue({
      createMutation: { isPending: false, mutateAsync: jest.fn() },
      updateMutation: { isPending: false, mutateAsync: jest.fn() },
      deleteMutation: { isPending: false, mutateAsync: jest.fn() },
    });
  });

  it('muestra la tabla y acciones de radicados', () => {
    renderWithProviders(<RadicadosModule />);

    expect(screen.getByText('Radicados')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar por número, asunto, remitente o dependencia')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /editar/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /eliminar/i })[0]).toBeInTheDocument();
  });
});