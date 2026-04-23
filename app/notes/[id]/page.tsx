import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetails from './NoteDetails.client';
import { Metadata } from 'next';

interface NoteDetailsByIdProps {
  params: Promise<{
    id: string;
  }>;
}

export const generateMetadata = async ({
  params,
}: NoteDetailsByIdProps): Promise<Metadata> => {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return {
    title: `${note.title} - NoteHub`,
    description: note.content.slice(0, 160),
    openGraph: {
      title: `${note.title} | NoteHub`,
      description: note.content.slice(0, 160),
      url: `https://notehub.com/notes/${id}`,
      images: ['https://ac.goit.global/fullstack/react/notehub-og-meta.jpg'],
    },
  };
};

const NoteDetailsById = async ({ params }: NoteDetailsByIdProps) => {
  const id = (await params).id;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetails />
    </HydrationBoundary>
  );
};
export default NoteDetailsById;
