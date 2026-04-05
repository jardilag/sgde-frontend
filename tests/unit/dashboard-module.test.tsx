import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/test-utils';
import { DashboardModule } from '@/components/dashboard/dashboard-module';

jest.mock('@/hooks/use-dashboard', () => ({
  useDashboardQuery: jest.fn(),
}));

const { useDashboardQuery } = jest.requireMock('@/hooks/use-dashboard') as {
  useDashboardQuery: jest.Mock;
};

const baseData = {
  fechaCorte: '2026-04-05T10:35:00.000Z',
  metricasExpedientes: [
    { estado: 'Abierto', total: 4 },
    { estado: 'Cerrado', total: 2 },
    { estado: 'Suspendido', total: 1 },
  ],
  metricasClave: [
    { key: 'radicacionesMes', label: 'Radicaciones del mes', total: 9, hint: 'Registradas en el mes vigente' },
    { key: 'prestamosActivos', label: 'Préstamos activos', total: 3, hint: 'En seguimiento operativo' },
    { key: 'prestamosVencidos', label: 'Préstamos vencidos', total: 1, hint: 'Requieren acción inmediata' },
    { key: 'transferenciasRealizadas', label: 'Transferencias realizadas', total: 4, hint: 'Primarias y secundarias acumuladas' },
  ],
  transferenciasResumen: [
    { tipoTransferencia: 'Primaria', total: 3 },
    { tipoTransferencia: 'Secundaria', total: 1 },
  ],
  actividadReciente: [
    {
      id: 'aud-1',
      fechaHora: '2026-04-05T10:35:00.000Z',
      usuario: 'Andrea Castro',
      accion: 'Crear',
      entidadAfectada: 'Transferencia',
      descripcion: 'Registro de transferencia primaria.',
    },
  ],
  alertasVencimientos: [
    {
      id: 'alert-1',
      tipo: 'Prestamo',
      titulo: 'Préstamo vencido EXP-2026-0004',
      fechaLimite: '2026-03-18',
      severidad: 'Alta',
      detalle: 'La devolución esperada ya venció.',
    },
  ],
};

describe('DashboardModule', () => {
  it('renderiza tarjetas de métricas', () => {
    useDashboardQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      isFetching: false,
      data: baseData,
      refetch: jest.fn(),
    });

    renderWithProviders(<DashboardModule />);

    expect(screen.getByText('Dashboard Ejecutivo SGDE')).toBeInTheDocument();
    expect(screen.getByText('Radicaciones del mes')).toBeInTheDocument();
    expect(screen.getByText('Préstamos activos')).toBeInTheDocument();
    expect(screen.getByText('Préstamos vencidos')).toBeInTheDocument();
    expect(screen.getAllByText('Transferencias realizadas').length).toBeGreaterThan(0);
  });

  it('renderiza actividad reciente y datos base del gráfico', () => {
    useDashboardQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      isFetching: false,
      data: baseData,
      refetch: jest.fn(),
    });

    renderWithProviders(<DashboardModule />);

    expect(screen.getByText('Actividad reciente del sistema')).toBeInTheDocument();
    expect(screen.getByText('Andrea Castro')).toBeInTheDocument();
    expect(screen.getByText('Expedientes por estado')).toBeInTheDocument();
    expect(screen.getByText('Abierto')).toBeInTheDocument();
    expect(screen.getByText('Cerrado')).toBeInTheDocument();
  });

  it('muestra loading state', () => {
    useDashboardQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      isFetching: false,
      data: undefined,
      refetch: jest.fn(),
    });

    const { container } = renderWithProviders(<DashboardModule />);
    expect(container.querySelector('.ant-skeleton')).toBeInTheDocument();
  });

  it('muestra error state', () => {
    useDashboardQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      isFetching: false,
      error: new Error('Fallo de API dashboard'),
      data: undefined,
      refetch: jest.fn(),
    });

    renderWithProviders(<DashboardModule />);

    expect(screen.getByText('No fue posible cargar el dashboard')).toBeInTheDocument();
    expect(screen.getByText('Fallo de API dashboard')).toBeInTheDocument();
  });
});
