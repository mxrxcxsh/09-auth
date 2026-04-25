'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import Empty from '@/components/Empty/Emty';
import { fetchNotes } from '@/lib/api/clientApi';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';
import css from '../NotesPage.module.css';

type NotesFilterClientProps = {
  tag?: string;
};

export default function NotesFilterClient({ tag }: NotesFilterClientProps) {
  const [page, setPage] = useState(1);
  const perPage = 12;
  const [query, setQuery] = useState('');
  const [inputValue, setInputValue] = useState('');

  const { data, error } = useQuery({
    queryKey: ['notes', 'filter', tag ?? 'all', page, query],
    queryFn: () => fetchNotes({ page, perPage, tag, query }),
    placeholderData: keepPreviousData,
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, 1000);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  if (error) {
    throw error;
  }

  const totalPages = data?.totalPages ?? 0;
  const notes = data?.notes ?? [];

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>
      {notes.length > 0 && <NoteList notes={notes} />}
      {notes.length === 0 && <Empty message="No notes found" />}
    </div>
  );
}
