import { NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/utils/constants';

export async function POST() {
  const response = NextResponse.json({ message: 'Sesión cerrada correctamente.' }, { status: 200 });

  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}