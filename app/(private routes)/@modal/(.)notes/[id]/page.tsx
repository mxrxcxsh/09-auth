import NotePreview from './NotePreview.client';
import { fetchNoteById } from '@/lib/api/serverApi';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';

type Props = {
  params: Promise<{ id: string }>;
};

const NotePage = async ({ params }: Props) => {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview />
    </HydrationBoundary>
  );
};
export default NotePage;
