import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getDemoUser } from '@/services/mock-db';
import { SESSION_COOKIE_NAME } from '@/utils/constants';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);

  if (!session) {
    return NextResponse.json({ message: 'No hay sesión activa.' }, { status: 401 });
  }

  return NextResponse.json({ user: getDemoUser() }, { status: 200 });
}