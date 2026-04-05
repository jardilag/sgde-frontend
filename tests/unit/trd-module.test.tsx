import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/test-utils';
import { TrdModule } from '@/components/trd/trd-module';

jest.mock('@/hooks/use-trd', () => ({
  useSeriesQuery: jest.fn(),
  useSeriesMutations: jest.fn(),
  useSubseriesQuery: jest.fn(),
  useSubserieMutations: jest.fn(),
}));

const { useSeriesQuery, useSeriesMutations, useSubseriesQuery, useSubserieMutations } = jest.requireMock('@/hooks/use-trd') as {
  useSeriesQuery: jest.Mock;
  useSeriesMutations: jest.Mock;
  useSubseriesQuery: jest.Mock;
  useSubserieMutations: jest.Mock;
};

const mockSeries = [
  {
    id: 'serie-1',
    codigo: 'SG-01',
    nombre: 'Administración General',
    descripcion: 'Documentos generales.',
    estado: 'Activa',
    createdAt: '2026-03-29T00:00:00.000Z',
  },
  {
    id: 'serie-2',
    codigo: 'AC-01',
    nombre: 'Actos Administrativos',
    descripcion: 'Resoluciones y acuerdos.',
    estado: 'Activa',
    createdAt: '2026-03-28T00:00:00.000Z',
  },
];

describe('TrdModule', () => {
  beforeEach(() => {
    useSeriesQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: {
        items: mockSeries,
        meta: { page: 1, pageSize: 5, total: 2, totalPages: 1 },
      },
    });

    useSeriesMutations.mockReturnValue({
      createMutation: { isPending: false, mutateAsync: jest.fn() },
      updateMutation: { isPending: false, mutateAsync: jest.fn() },
      deleteMutation: { isPending: false, mutateAsync: jest.fn() },
    });

    useSubseriesQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: {
        items: [],
        meta: { page: 1, pageSize: 5, total: 0, totalPages: 1 },
      },
    });

    useSubserieMutations.mockReturnValue({
      createMutation: { isPending: false, mutateAsync: jest.fn() },
      updateMutation: { isPending: false, mutateAsync: jest.fn() },
      deleteMutation: { isPending: false, mutateAsync: jest.fn() },
    });
  });

  it('renderiza la lista de series', () => {
    renderWithProviders(<TrdModule />);

    expect(screen.getByText('Tabla de Retención Documental (TRD)')).toBeInTheDocument();
    expect(screen.getByText('Administración General')).toBeInTheDocument();
    expect(screen.getByText('Actos Administrativos')).toBeInTheDocument();
  });

  it('abre el drawer de nueva serie', () => {
    renderWithProviders(<TrdModule />);

    const newSerieButtons = screen.getAllByRole('button', { name: /nueva serie/i });
    expect(newSerieButtons.length).toBeGreaterThan(0);
  });
});
