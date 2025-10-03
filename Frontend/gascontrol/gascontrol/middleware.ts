// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = ['/relatorios', '/leituras', '/usuario'];
const STATIC_PREFIXES = ['/_next', '/assets', '/favicon.ico'];

function startsWithAny(pathname: string, prefixes: string[]) {
  return prefixes.some((p) => pathname.startsWith(p));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Permitir arquivos estáticos
  if (startsWithAny(pathname, STATIC_PREFIXES)) {
    return NextResponse.next();
  }

  const basic = req.cookies.get('basic')?.value;
  const isLogged = Boolean(basic);

  // Bloquear login quando já logado
  if (pathname === '/login' && isLogged) {
    const url = req.nextUrl.clone();
    url.pathname = '/relatorios';
    return NextResponse.redirect(url);
  }

  // Proteger rotas privadas
  if (startsWithAny(pathname, PROTECTED_PREFIXES)) {
    if (!isLogged) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/relatorios/:path*',
    '/leituras/:path*',
    '/usuario/:path*',
    '/login',
    '/((?!_next/static|_next/image|favicon.ico|assets/).*)',
  ],
};
