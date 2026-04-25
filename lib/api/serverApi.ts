import axios from 'axios';
import { cookies } from 'next/headers';
import type { Note } from '@/types/note';
import type { User, CheckSessionRequest } from '@/types/user';

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
  query?: string;
}

const createServerApi = async () => {
  const cookieStore = await cookies();

  return axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    withCredentials: true,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
};

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = '',
  tag,
}: FetchNotesParams): Promise<NotesResponse> => {
  const serverApi = await createServerApi();

  const { data } = await serverApi.get<NotesResponse>('/notes', {
    params: { page, perPage, search, tag },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const serverApi = await createServerApi();
  const { data } = await serverApi.get<Note>(`/notes/${id}`);
  return data;
};

export const getMe = async (): Promise<User | null> => {
  const serverApi = await createServerApi();

  try {
    const { data } = await serverApi.get<User>('/users/me');
    return data;
  } catch {
    return null;
  }
};

export const checkSession = async (): Promise<boolean> => {
  const serverApi = await createServerApi();

  try {
    const { data } = await serverApi.get<CheckSessionRequest>('/auth/session');
    return Boolean(data?.success);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      if (status === 400 || status === 401) {
        return false;
      }
    }

    return false;
  }
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
