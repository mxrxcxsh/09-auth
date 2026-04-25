import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface SessionResponse {
  success: boolean;
}

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

const matchesRoute = (pathname: string, routes: string[]) =>
  routes.some(route => pathname === route || pathname.startsWith(`${route}/`));

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivate = matchesRoute(pathname, privateRoutes);
  const isAuthPage = matchesRoute(pathname, authRoutes);

  if (!isPrivate && !isAuthPage) {
    return NextResponse.next();
  }

  const sessionResponse = await fetch(
    new URL('/api/auth/session', request.url),
    {
      method: 'GET',
      headers: {
        cookie: request.headers.get('cookie') ?? '',
      },
      cache: 'no-store',
    }
  );

  let session: SessionResponse = { success: false };

  try {
    session = (await sessionResponse.json()) as SessionResponse;
  } catch {
    session = { success: false };
  }

  const isAuthenticated = session.success;

  if (isPrivate && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
