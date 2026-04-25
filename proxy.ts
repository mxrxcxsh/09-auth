import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

const matchesRoute = (pathname: string, routes: string[]) =>
  routes.some(route => pathname === route || pathname.startsWith(`${route}/`));

const applySetCookieHeaders = (
  response: NextResponse,
  sessionResponse: Response
) => {
  const setCookieHeaders =
    typeof sessionResponse.headers.getSetCookie === 'function'
      ? sessionResponse.headers.getSetCookie()
      : [];

  for (const header of setCookieHeaders) {
    const [nameValue, ...parts] = header.split(';').map(part => part.trim());
    const [name, ...valueParts] = nameValue.split('=');

    if (!name || valueParts.length === 0) continue;

    const value = valueParts.join('=');

    let path = '/';
    let maxAge: number | undefined;
    let expires: Date | undefined;

    for (const part of parts) {
      const [rawKey, ...rawVal] = part.split('=');
      const key = rawKey.toLowerCase();
      const val = rawVal.join('=');

      if (key === 'path' && val) path = val;
      if (key === 'max-age' && val) maxAge = Number(val);
      if (key === 'expires' && val) expires = new Date(val);
    }

    response.cookies.set(name, value, {
      path,
      maxAge,
      expires,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
  }
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivateRoute = matchesRoute(pathname, privateRoutes);
  const isAuthRoute = matchesRoute(pathname, authRoutes);

  if (!isPrivateRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  let isAuthenticated = Boolean(accessToken);
  let sessionResponse: Response | null = null;

  if (!accessToken && refreshToken) {
    sessionResponse = await fetch(new URL('/api/auth/session', request.url), {
      method: 'GET',
      headers: {
        cookie: request.headers.get('cookie') ?? '',
      },
      cache: 'no-store',
    });

    try {
      const data = (await sessionResponse.json()) as { success?: boolean };
      isAuthenticated = Boolean(data?.success);
    } catch {
      isAuthenticated = false;
    }
  }

  if (isPrivateRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    const response = NextResponse.redirect(new URL('/', request.url));

    if (sessionResponse) {
      applySetCookieHeaders(response, sessionResponse);
    }

    return response;
  }

  const response = NextResponse.next();

  if (sessionResponse && isAuthenticated) {
    applySetCookieHeaders(response, sessionResponse);
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
