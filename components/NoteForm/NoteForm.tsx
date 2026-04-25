'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api/clientApi';
import { useNoteDraftStore } from '@/lib/store/noteStore';
import type { Category } from '@/types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  categories: Array<Category & { id?: string }>;
}

type FormErrors = {
  title?: string;
  content?: string;
  tag?: string;
  form?: string;
};

function NoteForm({ categories }: NoteFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<FormErrors>({});

  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      clearDraft();
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.back();
      router.refresh();
    },
    onError: () => {
      setErrors({ form: 'Unable to create note. Please try again.' });
    },
  });

  const handleCancel = () => {
    clearDraft();
    router.push('/notes/filter/all');
  };

  const handleChange = (
    evt: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = evt.target;
    setDraft({ ...draft, [name]: value });
  };

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const title = draft.title.trim();
    const content = draft.content.trim();
    const tag = draft.tag.trim();

    const nextErrors: FormErrors = {};

    if (!title) {
      nextErrors.title = 'Required';
    } else if (title.length < 3) {
      nextErrors.title = 'Min 3 characters';
    } else if (title.length > 50) {
      nextErrors.title = 'Max 50 characters';
    }

    if (!content) {
      nextErrors.content = 'Required';
    } else if (content.length > 500) {
      nextErrors.content = 'Max 500 characters';
    }

    if (!tag) {
      nextErrors.tag = 'Required';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    createNoteMutation.mutate({ title, content, tag });
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          value={draft.title}
          onChange={handleChange}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={handleChange}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          {categories.map(category => (
            <option key={category.id ?? category.tag} value={category.tag}>
              {category.tag}
            </option>
          ))}
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      {errors.form && <span className={css.error}>{errors.form}</span>}

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={createNoteMutation.isPending}
        >
          {createNoteMutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
