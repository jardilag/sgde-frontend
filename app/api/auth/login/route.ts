import { NextResponse } from 'next/server';
import { getDemoUserByCredentials } from '@/services/mock-db';
import { SESSION_COOKIE_NAME } from '@/utils/constants';
import { validateDemoCredentials, validateLoginPayload } from '@/utils/validators';

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { correo?: unknown; contrasena?: unknown };
    const validation = validateLoginPayload(payload);

    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Verifique la informacion enviada.', errors: validation.errors },
        { status: 400 },
      );
    }

    const correo = String(payload.correo).trim();
    const contrasena = String(payload.contrasena);

    if (!validateDemoCredentials(correo, contrasena)) {
      return NextResponse.json(
        { message: 'Credenciales invalidas. Use una cuenta demo configurada.' },
        { status: 401 },
      );
    }

    const session = getDemoUserByCredentials(correo, contrasena);

    if (!session) {
      return NextResponse.json(
        { message: 'Credenciales invalidas. Use una cuenta demo configurada.' },
        { status: 401 },
      );
    }

    const response = NextResponse.json(
      {
        message: 'Sesion iniciada correctamente.',
        token: session.token,
        usuario: session.usuario,
      },
      { status: 200 },
    );

    response.cookies.set(SESSION_COOKIE_NAME, session.token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ message: 'No fue posible iniciar sesion.' }, { status: 500 });
  }
}
