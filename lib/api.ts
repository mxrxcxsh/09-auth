import axios from 'axios';

import type { Note, CreateNote } from '@/types/note';

const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

axios.defaults.baseURL = 'https://notehub-public.goit.study/api/';

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

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  query = '',
  tag,
}: fetchNotesParams): Promise<NotesResponse> => {
  const { data } = await axios.get<NotesResponse>('/notes', {
    params: {
      page,
      perPage,
      search: query,
      tag,
    },
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  console.log(data);
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await axios.get<Note>(`/notes/${id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return data;
};

export const createNote = async (payload: CreateNote): Promise<Note> => {
  const { data } = await axios.post<Note>('/notes', payload, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return data;
};

export const deleteNote = async (noteId: Note['id']): Promise<Note> => {
  const { data } = await axios.delete<Note>(`/notes/${noteId}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  return data;
};

export const getCategories = async () => {
  const perPage = 12;
  let page = 1;
  let totalPages = 1;
  const tags: string[] = [];

  while (page <= totalPages) {
    const data = await fetchNotes({ page, perPage, query: '' });

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
