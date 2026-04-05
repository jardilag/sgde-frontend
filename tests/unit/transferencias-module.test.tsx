const { screen } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;
const { renderWithProviders } = require('@/tests/test-utils');
const { TransferenciasModule } = require('@/components/transferencias/transferencias-module');

jest.mock('@/components/shared/page-header', () => ({
  PageHeader: ({ title, onAction }: { title: string; onAction?: () => void }) => (
    <div>
      <h1>{title}</h1>
      <button type="button" onClick={onAction}>Registrar transferencia</button>
    </div>
  ),
}));

jest.mock('@/components/transferencias/transferencias-filters', () => ({
  TransferenciasFilters: () => <div>Filtros transferencias</div>,
}));

jest.mock('@/components/transferencias/expedientes-eligibles-table', () => ({
  ExpedientesElegiblesTable: () => <div>Tabla elegibles</div>,
}));

jest.mock('@/components/shared/resource-table', () => ({
  ResourceTable: ({
    title,
    dataSource,
    columns,
  }: {
    title: string;
    dataSource: Array<{ id: string }>;
    columns: Array<{ key?: string; render?: (_value: unknown, record: { id: string }) => React.ReactNode }>;
  }) => {
    const actionsColumn = columns.find((column) => column.key === 'actions');
    const firstRecord = dataSource[0];

    return (
      <section>
        <h2>{title}</h2>
        <div data-testid="rows-count">{dataSource.length}</div>
        {firstRecord && actionsColumn?.render ? <div>{actionsColumn.render(undefined, firstRecord)}</div> : null}
      </section>
    );
  },
}));

jest.mock('@/components/transferencias/transferencia-form', () => ({
  TransferenciaForm: ({
    open,
    onSubmit,
    onTipoTransferenciaChange,
  }: {
    open: boolean;
    onSubmit: (payload: {
      tipoTransferencia: 'Primaria' | 'Secundaria';
      fechaTransferencia: string;
      expedienteIds: string[];
    }) => Promise<void>;
    onTipoTransferenciaChange: (tipo: 'Primaria' | 'Secundaria') => void;
  }) =>
    open ? (
      <div>
        <h3>Formulario transferencia</h3>
        <button
          type="button"
          onClick={() => onTipoTransferenciaChange('Secundaria')}
        >
          Seleccionar tipo secundaria
        </button>
        <button
          type="button"
          onClick={() =>
            onSubmit({
              tipoTransferencia: 'Secundaria',
              fechaTransferencia: '2026-04-05',
              expedienteIds: ['exp-2', 'exp-5'],
            })
          }
        >
          Confirmar transferencia
        </button>
      </div>
    ) : null,
}));

jest.mock('@/hooks/use-transferencias', () => ({
  useTransferenciasQuery: jest.fn(),
  useExpedientesTransferiblesQuery: jest.fn(),
  useTransferenciaMutations: jest.fn(),
}));

jest.mock('@/hooks/use-expediente', () => ({
  useExpedientesQuery: jest.fn(),
}));

const {
  useTransferenciasQuery,
  useExpedientesTransferiblesQuery,
  useTransferenciaMutations,
} = jest.requireMock('@/hooks/use-transferencias') as {
  useTransferenciasQuery: jest.Mock;
  useExpedientesTransferiblesQuery: jest.Mock;
  useTransferenciaMutations: jest.Mock;
};

const { useExpedientesQuery } = jest.requireMock('@/hooks/use-expediente') as {
  useExpedientesQuery: jest.Mock;
};

describe('TransferenciasModule', () => {
  const createMutation = { isPending: false, mutateAsync: jest.fn().mockResolvedValue(undefined) };
  const downloadMutation = {
    isPending: false,
    mutateAsync: jest.fn().mockResolvedValue({ downloadUrl: '/api/transferencias/trans-1/inventario?download=1' }),
  };

  beforeEach(() => {
    globalThis.open = jest.fn();

    useTransferenciasQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      data: {
        items: [
          {
            id: 'trans-1',
            tipoTransferencia: 'Primaria',
            fechaTransferencia: '2026-04-05',
            observacion: 'Transferencia inicial',
            expedientes: [
              {
                id: 'exp-2',
                codigoExpediente: 'EXP-2026-0002',
                nombreExpediente: 'Resolucion estrategica',
                estadoExpediente: 'Cerrado',
              },
            ],
            cantidadExpedientes: 1,
            inventarioDisponible: true,
            createdAt: '2026-04-05T00:00:00.000Z',
            updatedAt: '2026-04-05T00:00:00.000Z',
          },
        ],
        meta: { page: 1, pageSize: 5, total: 1, totalPages: 1 },
      },
    });

    useExpedientesTransferiblesQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      data: [
        {
          id: 'exp-2',
          codigoExpediente: 'EXP-2026-0002',
          nombre: 'Resolucion estrategica',
          estadoActual: 'Cerrado',
          motivoElegible: 'Expediente cerrado',
        },
      ],
    });

    useTransferenciaMutations.mockReturnValue({
      createMutation,
      downloadMutation,
    });

    useExpedientesQuery.mockReturnValue({
      data: {
        items: [
          {
            id: 'exp-2',
            codigoExpediente: 'EXP-2026-0002',
            nombre: 'Resolucion estrategica',
          },
        ],
      },
    });
  });

  it('renderiza tabla de transferencias', () => {
    renderWithProviders(<TransferenciasModule />);

    expect(screen.getByText('Transferencias Documentales')).toBeInTheDocument();
    expect(screen.getByText('Listado de transferencias')).toBeInTheDocument();
    expect(screen.getByTestId('rows-count')).toHaveTextContent('1');
  });

  it('renderiza formulario y permite seleccionar tipo/expedientes', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TransferenciasModule />);

    await user.click(screen.getByRole('button', { name: 'Registrar transferencia' }));
    expect(screen.getByText('Formulario transferencia')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Seleccionar tipo secundaria' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar transferencia' }));

    expect(createMutation.mutateAsync).toHaveBeenCalledWith({
      tipoTransferencia: 'Secundaria',
      fechaTransferencia: '2026-04-05',
      expedienteIds: ['exp-2', 'exp-5'],
    });
  });

  it('maneja descarga de inventario', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TransferenciasModule />);

    await user.click(screen.getByRole('button', { name: /descargar inventario/i }));

    expect(downloadMutation.mutateAsync).toHaveBeenCalledWith('trans-1');
    expect(globalThis.open).toHaveBeenCalled();
  });
});
