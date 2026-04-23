import { create } from 'zustand';
import { NewNoteData } from '@/types/note';
import { persist } from 'zustand/middleware';

type NoteDraftStore = {
  draft: NewNoteData;
  setDraft: (note: NewNoteData) => void;
  clearDraft: () => void;
};
const INITIAL_DRAFT: NewNoteData = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    set => ({
      draft: INITIAL_DRAFT,
      setDraft: note => set({ draft: note }),
      clearDraft: () => set({ draft: INITIAL_DRAFT }),
    }),
    {
      name: 'note-draft',
    }
  )
);
