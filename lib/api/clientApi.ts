import { api } from './api';
import axios from 'axios';

import type { Note, CreateNote } from '@/types/note';
import type { User, RegisterRequest, LoginRequest } from '@/types/user';

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}
interface fetchNotesParams {
  page: number;
  perPage: number;
  query?: string;
  tag?: string;
}

interface CheckSessionRequest {
  success: boolean;
}

interface UserRequest {
  username: string;
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  query = '',
  tag,
}: fetchNotesParams): Promise<NotesResponse> => {
  const { data } = await api.get<NotesResponse>('/notes', {
    params: {
      page,
      perPage,
      search: query,
      tag,
    },
    // headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    // headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return data;
};

export const createNote = async (payload: CreateNote): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', payload, {
    // headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return data;
};

export const deleteNote = async (noteId: Note['id']): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${noteId}`, {
    // headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return data;
};

export const register = async (payload: RegisterRequest): Promise<User> => {
  const { data } = await api.post<User>('/auth/register', payload);
  return data;
};

export const login = async (payload: LoginRequest): Promise<User> => {
  const { data } = await api.post<User>('/auth/login', payload);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<boolean> => {
  try {
    const { data } = await api.get<CheckSessionRequest>('/auth/session');
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
export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export const updateMe = async (payload: UserRequest): Promise<User> => {
  const { data } = await api.patch<User>('/users/me', payload);
  return data;
};
