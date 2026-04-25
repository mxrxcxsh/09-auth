'use client';

import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getMe, updateMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import Loader from '@/app/loading';
import css from './EditProfilePage.module.css';

export default function EditProfilePage() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const { data: user, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: getMe,
  });

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: updateMe,
    onSuccess: updatedUser => {
      setUser(updatedUser);
      router.push('/profile');
      router.refresh();
    },
    onError: () => {
      setError('Failed to update profile');
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    updateMutation.mutate({ username: username.trim() });
  };

  if (isLoading || !user) {
    return <Loader />;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={updateMutation.isPending}
            >
              Save
            </button>

            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push('/profile')}
            >
              Cancel
            </button>
          </div>

          {error && <p className={css.error}>{error}</p>}
        </form>
      </div>
    </main>
  );
}
