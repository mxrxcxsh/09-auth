'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './AuthNavigation.module.css';

export default function AuthNavigation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const clearIsAuthenticated = useAuthStore(
    state => state.clearIsAuthenticated
  );

  const handleLogout = async () => {
    await logout();
    clearIsAuthenticated();
    queryClient.removeQueries({ queryKey: ['me'] });
    queryClient.removeQueries({ queryKey: ['session'] });
    router.push('/sign-in');
    router.refresh();
  };

  if (isAuthenticated && user) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/profile" prefetch={false} className={css.navigationLink}>
            Profile
          </Link>
        </li>

        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user.email}</p>
          <button
            type="button"
            className={css.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>

      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
}
