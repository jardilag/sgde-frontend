import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/tests/test-utils';
import { DocumentoConsultaBar } from '@/components/documentos/documento-consulta-bar';
import { DocumentoDetailPanel } from '@/components/documentos/documento-detail-panel';

describe('Documentos components', () => {
  it('renderiza la consulta por radicado', () => {
    renderWithProviders(
      <DocumentoConsultaBar value="SGDE-2026-0001" onChange={jest.fn()} onSearch={jest.fn()} loading={false} />,
    );

    expect(screen.getByText('Consultar por número de radicado')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ej. SGDE-2026-0001')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Consultar' })).toBeInTheDocument();
  });

  it('renderiza el detalle de radicación con metadatos y preview', () => {
    renderWithProviders(
      <DocumentoDetailPanel
        open
        onClose={jest.fn()}
        documento={{
          id: 'doc-1',
          radicado: 'SGDE-2026-0006',
          numeroRadicado: 'SGDE-2026-0006',
          titulo: 'Solicitud de información contractual',
          tipoDocumento: 'Oficio',
          tipoRadicado: 'Entrada',
          dependencia: 'Juridica',
          dependenciaNombre: 'Juridica',
          fechaDocumento: '2026-04-05',
          fechaRadicacion: '2026-04-05',
          archivoNombre: 'radicacion.pdf',
          previewUrl: 'https://example.com/preview/radicacion.pdf',
          mimeType: 'application/pdf',
          tamanioBytes: 2048,
          hash: 'sha256-radicacion.pdf-2048',
          resumen: 'Observación de prueba',
          funcionarioResponsable: 'Mesa de entrada SGDE',
          estado: 'Borrador',
          createdAt: '2026-04-05T00:00:00.000Z',
        }}
      />,
    );

    expect(screen.getByText('Detalle de SGDE-2026-0006')).toBeInTheDocument();
    expect(screen.getByText('sha256-radicacion.pdf-2048')).toBeInTheDocument();
    expect(screen.getByText('Vista previa')).toBeInTheDocument();
  });

});
