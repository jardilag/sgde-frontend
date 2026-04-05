import { NextResponse } from 'next/server';
import { getDemoUser } from '@/services/mock-db';
import { SESSION_COOKIE_NAME } from '@/utils/constants';
import { validateDemoCredentials, validateLoginPayload } from '@/utils/validators';

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { correo?: unknown; contrasena?: unknown };
    const validation = validateLoginPayload(payload);

    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Verifique la información enviada.', errors: validation.errors },
        { status: 400 },
      );
    }

    const correo = String(payload.correo).trim();
    const contrasena = String(payload.contrasena);

    if (!validateDemoCredentials(correo, contrasena)) {
      return NextResponse.json(
        { message: 'Credenciales inválidas. Use la cuenta demo configurada.' },
        { status: 401 },
      );
    }

    const response = NextResponse.json(
      {
        message: 'Sesión iniciada correctamente.',
        token: 'demo-session-token',
        usuario: getDemoUser(),
      },
      { status: 200 },
    );

    response.cookies.set(SESSION_COOKIE_NAME, 'demo-session-token', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ message: 'No fue posible iniciar sesión.' }, { status: 500 });
  }
}