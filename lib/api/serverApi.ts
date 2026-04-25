import 'server-only';

import type { AxiosResponse } from 'axios';
import { cookies } from 'next/headers';

import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

interface CheckSessionResponse {
  success: boolean;
}

const getCookieHeader = async () => {
  const cookieStore = await cookies();
  return cookieStore.toString();
};

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = '',
  tag,
}: FetchNotesParams): Promise<NotesResponse> => {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get<NotesResponse>('/notes', {
    params: { page, perPage, search, tag },
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
};

export const getMe = async (): Promise<User | null> => {
  const cookieHeader = await getCookieHeader();

  try {
    const { data } = await api.get<User>('/users/me', {
      headers: {
        Cookie: cookieHeader,
      },
    });

    return data;
  } catch {
    return null;
  }
};

export const checkSession = async (): Promise<
  AxiosResponse<CheckSessionResponse>
> => {
  const cookieHeader = await getCookieHeader();

  return api.get<CheckSessionResponse>('/auth/session', {
    headers: {
      Cookie: cookieHeader,
    },
  });
};

export const getCategories = async () => {
  const perPage = 12;
  let page = 1;
  let totalPages = 1;
  const tags: string[] = [];

  while (page <= totalPages) {
    const data = await fetchNotes({ page, perPage, search: '' });

    for (const note of data.notes) {
      if (note.tag && !tags.includes(note.tag)) {
        tags.push(note.tag);
      }
    }

    totalPages = data.totalPages;
    page += 1;
  }

  tags.sort();

  return tags.map(tag => ({ id: tag, tag }));
};
