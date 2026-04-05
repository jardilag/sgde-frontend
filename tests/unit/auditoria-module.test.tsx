const { screen } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;
const { renderWithProviders } = require('@/tests/test-utils');
const { AuditoriaModule } = require('@/components/auditoria/auditoria-module');

jest.mock('@/components/shared/page-header', () => ({
  PageHeader: ({ title, extra }: { title: string; extra?: React.ReactNode }) => (
    <div>
      <h1>{title}</h1>
      {extra}
    </div>
  ),
}));

jest.mock('@/components/auditoria/auditoria-filters', () => ({
  AuditoriaFilters: ({ onApply }: { onApply: (value: { usuario?: string }) => void }) => (
    <div>
      <span>Filtros Auditoría</span>
      <button type="button" onClick={() => onApply({ usuario: 'Andrea Castro' })}>
        Aplicar usuario
      </button>
    </div>
  ),
}));

jest.mock('@/components/shared/resource-table', () => ({
  ResourceTable: ({ title, columns, dataSource }: { title: string; columns: Array<{ title: string }>; dataSource: Array<{ id: string }> }) => (
    <section>
      <h2>{title}</h2>
      <div data-testid="rows-count">{dataSource.length}</div>
      {columns.map((column) => (
        <span key={column.title}>{column.title}</span>
      ))}
    </section>
  ),
}));

jest.mock('@/hooks/use-auditoria', () => ({
  useAuditoriaQuery: jest.fn(),
  useAuditoriaOptionsQuery: jest.fn(),
  useAuditoriaMutations: jest.fn(),
}));

const { useAuditoriaQuery, useAuditoriaOptionsQuery, useAuditoriaMutations } = jest.requireMock('@/hooks/use-auditoria') as {
  useAuditoriaQuery: jest.Mock;
  useAuditoriaOptionsQuery: jest.Mock;
  useAuditoriaMutations: jest.Mock;
};

describe('AuditoriaModule', () => {
  const exportMutation = {
    isPending: false,
    mutateAsync: jest.fn().mockResolvedValue({ downloadUrl: '/api/auditoria/export?download=1' }),
  };

  beforeEach(() => {
    globalThis.open = jest.fn();

    useAuditoriaQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      data: {
        items: [
          {
            id: 'aud-1',
            fechaHora: '2026-04-05T10:35:00.000Z',
            usuario: 'Andrea Castro',
            accion: 'Crear',
            entidadAfectada: 'Transferencia',
            idEntidad: 'TRANS-2026-0003',
            descripcion: 'Registro de transferencia',
            ipAddress: '10.20.31.15',
          },
        ],
        meta: { page: 1, pageSize: 5, total: 1, totalPages: 1 },
      },
    });

    useAuditoriaOptionsQuery.mockReturnValue({
      data: {
        usuarios: ['Andrea Castro'],
        entidades: ['Transferencia'],
        acciones: ['Crear'],
      },
    });

    useAuditoriaMutations.mockReturnValue({
      exportMutation,
    });
  });

  it('renderiza tabla y columnas de auditoría', () => {
    renderWithProviders(<AuditoriaModule />);

    expect(screen.getByText('Auditoría del Sistema')).toBeInTheDocument();
    expect(screen.getByText('Historial de auditoría')).toBeInTheDocument();
    expect(screen.getByText('Fecha y hora')).toBeInTheDocument();
    expect(screen.getByText('Usuario')).toBeInTheDocument();
    expect(screen.getByText('Acción')).toBeInTheDocument();
    expect(screen.getByText('Entidad')).toBeInTheDocument();
    expect(screen.getByText('Descripción')).toBeInTheDocument();
    expect(screen.getByTestId('rows-count')).toHaveTextContent('1');
  });

  it('aplica cambio de filtros por usuario', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AuditoriaModule />);

    await user.click(screen.getByRole('button', { name: 'Aplicar usuario' }));

    expect(useAuditoriaQuery).toHaveBeenLastCalledWith(
      expect.objectContaining({
        usuario: 'Andrea Castro',
      }),
    );
  });

  it('consulta orden descendente por fecha', () => {
    renderWithProviders(<AuditoriaModule />);

    expect(useAuditoriaQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: 'fechaHora',
        sortDirection: 'desc',
      }),
    );
  });

  it('maneja exportación', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AuditoriaModule />);

    await user.click(screen.getByRole('button', { name: /Exportar auditoría/i }));

    expect(exportMutation.mutateAsync).toHaveBeenCalled();
    expect(globalThis.open).toHaveBeenCalledWith('/api/auditoria/export?download=1', '_blank', 'noopener,noreferrer');
  });
});
