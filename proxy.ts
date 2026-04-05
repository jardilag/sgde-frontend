import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/documentos', '/radicados', '/prestamos', '/transferencias', '/auditoria', '/usuarios'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('sgde_session');
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !sessionCookie) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('from', pathname);

    return NextResponse.redirect(redirectUrl);
  }

  if (pathname === '/login' && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/documentos/:path*', '/radicados/:path*', '/prestamos/:path*', '/transferencias/:path*', '/auditoria/:path*', '/usuarios/:path*', '/login'],
};