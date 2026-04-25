'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Loader from '@/app/loading';
import { checkSession, getMe, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

const privateRoutes = ['/profile', '/notes'];
const authRoutes = ['/sign-in', '/sign-up'];

const matchesRoute = (pathname: string, routes: string[]) =>
  routes.some(route => pathname === route || pathname.startsWith(`${route}/`));

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { setUser, clearIsAuthenticated } = useAuthStore();

  const isPrivateRoute = matchesRoute(pathname, privateRoutes);
  const isAuthRoute = matchesRoute(pathname, authRoutes);
  const shouldCheckSession = isPrivateRoute || isAuthRoute;

  const { data: hasSession, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session', pathname],
    queryFn: checkSession,
    enabled: shouldCheckSession,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    enabled: shouldCheckSession && hasSession === true,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!shouldCheckSession) return;

    if (hasSession === true && user) {
      setUser(user);
      return;
    }

    if (hasSession === false) {
      clearIsAuthenticated();
    }
  }, [user, hasSession, shouldCheckSession, setUser, clearIsAuthenticated]);

  useEffect(() => {
    if (!shouldCheckSession) return;

    if (isPrivateRoute && hasSession === false) {
      logout()
        .catch(() => null)
        .finally(() => {
          clearIsAuthenticated();
          router.replace('/sign-in');
        });
    }

    if (isAuthRoute && hasSession === true) {
      router.replace('/profile');
    }
  }, [
    shouldCheckSession,
    isPrivateRoute,
    isAuthRoute,
    hasSession,
    router,
    clearIsAuthenticated,
  ]);

  if (isPrivateRoute && (isSessionLoading || (hasSession && isUserLoading))) {
    return <Loader />;
  }

  if (isPrivateRoute && !user) {
    return null;
  }

  return <>{children}</>;
}
