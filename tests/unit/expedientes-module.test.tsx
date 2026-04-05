import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/test-utils';
import { ExpedientesModule } from '@/components/expedientes/expedientes-module';
import { ExpedienteDetail } from '@/components/expedientes/expediente-detail';
import { EstadoBadge } from '@/components/expedientes/estado-badge';
import { validateExpedientePayload } from '@/utils/validators';
import { EstadoExpediente } from '@/types/expediente';

jest.mock('@/hooks/use-expediente', () => ({
  useExpedientesQuery: jest.fn(),
  useExpedienteMutations: jest.fn(),
}));

const { useExpedientesQuery, useExpedienteMutations } = jest.requireMock('@/hooks/use-expediente') as {
  useExpedientesQuery: jest.Mock;
  useExpedienteMutations: jest.Mock;
};

const mockExpedientes = [
  {
    id: 'exp-1',
    codigoExpediente: 'EXP-2026-0001',
    nombre: 'Contratacion de servicios legales',
    fechaApertura: '2026-03-15',
    estadoActual: EstadoExpediente.ABIERTO,
    dependenciaId: 'dep-1',
    subserieId: 'sub-1',
    observacion: 'Observacion de prueba',
    createdAt: '2026-03-15T08:00:00.000Z',
    updatedAt: '2026-03-15T08:00:00.000Z',
  },
];

describe('Expedientes module', () => {
  beforeEach(() => {
    useExpedientesQuery.mockReturnValue({
      isLoading: false,
      isFetching: false,
      isError: false,
      data: {
        items: mockExpedientes,
        meta: { page: 1, pageSize: 10, total: 1, totalPages: 1 },
      },
    });

    useExpedienteMutations.mockReturnValue({
      createMutation: { isPending: false, mutateAsync: jest.fn() },
      updateMutation: { isPending: false, mutateAsync: jest.fn() },
      deleteMutation: { isPending: false, mutate: jest.fn() },
      cerrarMutation: { isPending: false, mutateAsync: jest.fn() },
      reabrirMutation: { isPending: false, mutateAsync: jest.fn() },
    });
  });

  it('renderiza la tabla de expedientes', () => {
    renderWithProviders(<ExpedientesModule />);

    expect(screen.getByText('Expedientes Archivísticos')).toBeInTheDocument();
    expect(screen.getByText('EXP-2026-0001')).toBeInTheDocument();
    expect(screen.getByText('Contratacion de servicios legales')).toBeInTheDocument();
  });

  it('renderiza filtros avanzados', () => {
    renderWithProviders(<ExpedientesModule />);

    expect(screen.getByText('Filtros Avanzados')).toBeInTheDocument();
  });

  it('valida formulario de expediente con campos obligatorios', () => {
    const result = validateExpedientePayload({
      codigoExpediente: '',
      nombre: '',
      fechaApertura: '',
      estadoActual: '',
      dependenciaId: '',
      subserieId: '',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.codigoExpediente).toBeTruthy();
    expect(result.errors.nombre).toBeTruthy();
    expect(result.errors.fechaApertura).toBeTruthy();
  });

  it('renderiza detalle de expediente', () => {
    renderWithProviders(
      <ExpedienteDetail
        open
        onClose={jest.fn()}
        expediente={{
          ...mockExpedientes[0],
          dependencia: { id: 'dep-1', nombre: 'Juridica' },
          subserie: { id: 'sub-1', codigo: 'JUR-01-01', nombre: 'Contratos' },
          documentosCount: 2,
          historialCount: 1,
        }}
      />,
    );

    expect(screen.getByText('Detalle: EXP-2026-0001')).toBeInTheDocument();
    expect(screen.getByText('Información General')).toBeInTheDocument();
    expect(screen.getByText('Documentos (2)')).toBeInTheDocument();
  });

  it('muestra cambio visual del estado', () => {
    const { rerender } = renderWithProviders(<EstadoBadge estado={EstadoExpediente.ABIERTO} />);
    expect(screen.getByText('Abierto')).toBeInTheDocument();

    rerender(<EstadoBadge estado={EstadoExpediente.CERRADO} />);
    expect(screen.getByText('Cerrado')).toBeInTheDocument();
  });
});
