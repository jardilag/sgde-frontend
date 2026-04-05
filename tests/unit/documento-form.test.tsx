import { buildDocumentoFormData } from '@/services/documento.service';
import { validateDocumentoArchivo } from '@/components/documentos/documento-form';
import type { DocumentoRequest } from '@/types/documento';

describe('documento helpers', () => {
  it('rechaza archivos con tipo inválido', () => {
    const file = new File(['test'], 'archivo.exe', { type: 'application/x-msdownload' });

    expect(validateDocumentoArchivo(file)).toBe('Solo se permiten archivos PDF, PNG, JPG o DOCX.');
  });

  it('rechaza archivos que superan el tamaño permitido', () => {
    const file = new File([new Uint8Array(25 * 1024 * 1024 + 1)], 'archivo.pdf', { type: 'application/pdf' });

    expect(validateDocumentoArchivo(file)).toBe('El archivo supera el tamaño máximo permitido de 25 MB.');
  });

  it('construye FormData con los campos de radicación', () => {
    const archivo = new File(['%PDF-1.4'], 'radicacion.pdf', { type: 'application/pdf' });
    const payload: DocumentoRequest = {
      tipoDocumento: 'Oficio',
      tipoRadicado: 'Entrada',
      titulo: 'Solicitud de información',
      fechaDocumento: '2026-04-05',
      dependenciaId: 'dep-juridica',
      expedienteId: 'exp-1',
      observacion: 'Radicación de prueba',
      archivo,
    };

    const formData = buildDocumentoFormData(payload);

    expect(formData.get('tipoDocumento')).toBe('Oficio');
    expect(formData.get('tipoRadicado')).toBe('Entrada');
    expect(formData.get('titulo')).toBe('Solicitud de información');
    expect(formData.get('fechaDocumento')).toBe('2026-04-05');
    expect(formData.get('dependenciaId')).toBe('dep-juridica');
    expect(formData.get('expedienteId')).toBe('exp-1');
    expect(formData.get('observacion')).toBe('Radicación de prueba');
    expect(formData.get('archivo')).toBe(archivo);
  });
});
