import NotesFilterClient from '../NotesFilter.client';
import { fetchNotes } from '@/lib/api';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';
import { Metadata } from 'next';

interface NotesFiltersProps {
  params: Promise<{ slug: string[] }>;
}

export const generateMetadata = async ({
  params,
}: NotesFiltersProps): Promise<Metadata> => {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? 'All notes' : slug[0];

  return {
    title: `Notes - NoteHub`,
    description: `Browse NoteHub notes filtered by the ${tag} category.`,
    openGraph: {
      title: `Notes filtered by ${tag} | NoteHub`,
      description: `Browse NoteHub notes filtered by the ${tag} category.`,
      url: `https://notehub.com/notes/filter/${slug.join('/')}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
};

const NotesFilters = async ({ params }: NotesFiltersProps) => {
  const { slug } = await params;
  const tag = slug[0] === 'all' ? undefined : slug[0];

  const queryClient = new QueryClient();
  const page = 1;
  const perPage = 12;
  const query = '';

  await queryClient.prefetchQuery({
    queryKey: ['notes', 'filter', tag ?? 'all', page, query],
    queryFn: () => fetchNotes({ page, perPage, tag, query }),
  });

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesFilterClient tag={tag} />
      </HydrationBoundary>
    </div>
  );
};

export default NotesFilters;
