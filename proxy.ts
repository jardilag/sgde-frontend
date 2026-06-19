import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AUTH_DEMO_USERS } from '@/utils/constants';

const protectedRoutes = ['/dashboard', '/documentos', '/radicados', '/prestamos', '/transferencias', '/auditoria', '/usuarios', '/expedientes', '/dependencias', '/trd'];
const gestorAllowedRoutes = ['/documentos', '/expedientes'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('sgde_session');
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const sessionUser = AUTH_DEMO_USERS.find((user) => user.token === sessionCookie?.value);

  if (isProtectedRoute && !sessionCookie) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('from', pathname);

    return NextResponse.redirect(redirectUrl);
  }

  if (isProtectedRoute && sessionUser?.rol === 'Gestor documental') {
    const canAccessRoute = gestorAllowedRoutes.some((route) => pathname.startsWith(route));

    if (!canAccessRoute) {
      return NextResponse.redirect(new URL('/documentos', request.url));
    }
  }

  if (pathname === '/login' && sessionCookie) {
    return NextResponse.redirect(new URL(sessionUser?.rol === 'Gestor documental' ? '/documentos' : '/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/documentos/:path*', '/radicados/:path*', '/prestamos/:path*', '/transferencias/:path*', '/auditoria/:path*', '/usuarios/:path*', '/expedientes/:path*', '/dependencias/:path*', '/trd/:path*', '/login'],
};
