import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/tests/test-utils';
import { PrestamosModule } from '@/components/prestamos/prestamos-module';
import { PrestamoEstadoTag } from '@/components/prestamos/prestamo-estado-tag';

jest.mock('@/components/shared/page-header', () => ({
  PageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

jest.mock('@/components/prestamos/prestamo-form', () => ({
  PrestamoForm: ({ open }: { open: boolean }) => (open ? <div>Formulario préstamo</div> : null),
}));

jest.mock('@/components/prestamos/prestamos-filters', () => ({
  PrestamosFilters: () => <div>Filtros de préstamos</div>,
}));

jest.mock('@/components/shared/resource-table', () => ({
  ResourceTable: ({
    title,
    dataSource,
    rowClassName,
    columns,
  }: {
    title: string;
    dataSource: Array<{ id: string }>;
    rowClassName?: (record: { id: string; estado: string }) => string;
    columns: Array<{ key?: string; render?: (_value: unknown, record: { id: string; estado: string }) => React.ReactNode }>;
  }) => {
    const actionsColumn = columns.find((column) => column.key === 'actions');
    const firstRecord = dataSource[0] as { id: string; estado: string } | undefined;

    return (
      <section>
        <h2>{title}</h2>
        <div data-testid="rows-count">{dataSource.length}</div>
        {firstRecord && rowClassName ? <div data-testid="row-class">{rowClassName(firstRecord)}</div> : null}
        {firstRecord && actionsColumn?.render ? <div>{actionsColumn.render(undefined, firstRecord)}</div> : null}
      </section>
    );
  },
}));

jest.mock('@/hooks/use-prestamos', () => ({
  usePrestamosQuery: jest.fn(),
  usePrestamoMutations: jest.fn(),
}));

jest.mock('@/hooks/use-dependencias', () => ({
  useDependenciasQuery: jest.fn(),
}));

jest.mock('@/hooks/use-expediente', () => ({
  useExpedientesQuery: jest.fn(),
}));

const { usePrestamosQuery, usePrestamoMutations } = jest.requireMock('@/hooks/use-prestamos') as {
  usePrestamosQuery: jest.Mock;
  usePrestamoMutations: jest.Mock;
};

const { useDependenciasQuery } = jest.requireMock('@/hooks/use-dependencias') as {
  useDependenciasQuery: jest.Mock;
};

const { useExpedientesQuery } = jest.requireMock('@/hooks/use-expediente') as {
  useExpedientesQuery: jest.Mock;
};

describe('PrestamosModule', () => {
  const devolverMutation = { isPending: false, mutateAsync: jest.fn().mockResolvedValue(undefined) };

  beforeEach(() => {
    usePrestamosQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      data: {
        items: [
          {
            id: 'pre-1',
            expedienteId: 'exp-1',
            expedienteCodigo: 'EXP-2026-0001',
            expedienteNombre: 'Contratación de servicios legales',
            dependenciaSolicitanteId: 'dep-juridica',
            dependenciaSolicitanteNombre: 'Juridica',
            fechaPrestamo: '2026-03-10',
            fechaDevolucionEsperada: '2026-03-18',
            estado: 'Vencido',
            observacion: 'Pendiente devolución',
            createdAt: '2026-03-10T00:00:00.000Z',
          },
        ],
        meta: { page: 1, pageSize: 5, total: 1, totalPages: 1 },
      },
    });

    usePrestamoMutations.mockReturnValue({
      createMutation: { isPending: false, mutateAsync: jest.fn().mockResolvedValue(undefined) },
      devolverMutation,
    });

    useDependenciasQuery.mockReturnValue({
      data: {
        items: [{ id: 'dep-juridica', nombre: 'Juridica', codigo: 'JUR-003' }],
      },
    });

    useExpedientesQuery.mockReturnValue({
      data: {
        items: [{ id: 'exp-1', codigoExpediente: 'EXP-2026-0001', nombre: 'Contratación de servicios legales' }],
      },
    });
  });

  it('renderiza el módulo y lista préstamos', () => {
    renderWithProviders(<PrestamosModule />);

    expect(screen.getByText('Préstamos de Expedientes')).toBeInTheDocument();
    expect(screen.getByText('Listado de préstamos')).toBeInTheDocument();
    expect(screen.getByTestId('rows-count')).toHaveTextContent('1');
  });

  it('marca visualmente filas vencidas', () => {
    renderWithProviders(<PrestamosModule />);
    expect(screen.getByTestId('row-class')).toHaveTextContent('sgde-row-vencido');
  });

  it('permite confirmar devolución', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PrestamosModule />);

    await user.click(screen.getByRole('button', { name: /registrar devolución/i }));
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));

    expect(devolverMutation.mutateAsync).toHaveBeenCalled();
  });

  it('muestra estado vencido visualmente', () => {
    renderWithProviders(<PrestamoEstadoTag estado="Vencido" />);
    expect(screen.getByText('Vencido')).toBeInTheDocument();
  });
});
