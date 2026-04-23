'use client';

import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

type NotePreviewProps = {
  id?: string;
};

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const noteId = id ?? params.id;

  const {
    data: note,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  return (
    <Modal onClose={handleClose}>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{(error as Error).message}</p>}
      {note && (
        <div className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.tag}>{note.tag}</p>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>{note.createdAt}</p>
          </div>
          <button
            type="button"
            className={css.backBtn}
            onClick={() => router.back()}
          >
            Close
          </button>
        </div>
      )}
    </Modal>
  );
}
