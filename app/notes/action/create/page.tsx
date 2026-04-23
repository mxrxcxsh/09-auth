import type { Metadata } from 'next';
import { getCategories } from '@/lib/api';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './CreateNote.module.css';

export const metadata: Metadata = {
  title: 'Create Note - NoteHub',
  description: 'Create a new note in NoteHub and save your ideas in one place.',
  alternates: {
    canonical: 'https://notehub.com/notes/action/create',
  },
  openGraph: {
    title: 'Create Note - NoteHub',
    description:
      'Create a new note in NoteHub and save your ideas in one place.',
    url: 'https://notehub.com/notes/action/create',
    images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
  },
};

const CreateNote = async () => {
  const categories = await getCategories();

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm categories={categories} />
      </div>
    </main>
  );
};

export default CreateNote;
