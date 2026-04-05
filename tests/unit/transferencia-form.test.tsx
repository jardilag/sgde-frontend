import { validateTransferenciaPayload } from '@/utils/validators';

describe('TransferenciaForm', () => {
  it('valida seleccion de tipo y expedientes', () => {
    const result = validateTransferenciaPayload({
      tipoTransferencia: 'Primaria',
      fechaTransferencia: '2026-04-05',
      expedienteIds: ['exp-5', 'exp-2'],
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('rechaza payload sin expedientes', () => {
    const result = validateTransferenciaPayload({
      tipoTransferencia: 'Secundaria',
      fechaTransferencia: '2026-04-05',
      expedienteIds: [],
    });

    expect(result.valid).toBe(false);
    expect(result.errors.expedienteIds).toBeTruthy();
  });
});
