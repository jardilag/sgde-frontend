import { validateDemoCredentials, validateLoginPayload } from '@/utils/validators';

describe('validaciones de autenticación', () => {
  it('valida un payload de login correcto', () => {
    const result = validateLoginPayload({
      correo: 'admin@sgde.gov.co',
      contrasena: 'SGDE2026!',
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('retorna errores cuando faltan campos obligatorios', () => {
    const result = validateLoginPayload({
      correo: '',
      contrasena: '',
    });

    expect(result.valid).toBe(false);
    expect(result.errors.correo).toBeDefined();
    expect(result.errors.contrasena).toBeDefined();
  });

  it('valida correctamente credenciales demo', () => {
    expect(validateDemoCredentials('admin@sgde.gov.co', 'SGDE2026!')).toBe(true);
    expect(validateDemoCredentials('admin@sgde.gov.co', 'incorrecta')).toBe(false);
  });
});