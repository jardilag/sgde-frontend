import { validatePrestamoPayload } from '@/utils/validators';

describe('PrestamoForm', () => {
  it('valida campos obligatorios de préstamo', () => {
    const result = validatePrestamoPayload({
      expedienteId: '',
      dependenciaSolicitanteId: '',
      fechaPrestamo: '',
      fechaDevolucionEsperada: '',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.expedienteId).toBeTruthy();
    expect(result.errors.dependenciaSolicitanteId).toBeTruthy();
    expect(result.errors.fechaPrestamo).toBeTruthy();
    expect(result.errors.fechaDevolucionEsperada).toBeTruthy();
  });

  it('acepta un payload válido de préstamo', () => {
    const result = validatePrestamoPayload({
      expedienteId: 'exp-1',
      dependenciaSolicitanteId: 'dep-juridica',
      fechaPrestamo: '2026-03-10',
      fechaDevolucionEsperada: '2026-03-18',
      observacion: 'Control de préstamo',
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });
});
