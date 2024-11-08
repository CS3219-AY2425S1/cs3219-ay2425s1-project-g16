import { QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { type LoaderFunctionArgs, Navigate, useLoaderData } from 'react-router-dom';

import { usePageTitle } from '@/lib/hooks';
import { questionDetailsQuery } from '@/lib/queries/question-details';
import { ROUTES } from '@/lib/routes';
import { checkRoomAuthorization } from '@/services/collab-service';
import { useAuthedRoute } from '@/stores/auth-store';

import InterviewRoom from './interview-room';

export const loader =
  (queryClient: QueryClient) =>
  async ({ params, request }: LoaderFunctionArgs) => {
    const roomId = params.roomId;
    const url = new URL(request.url);
    const questionId = Number.parseInt(url.searchParams.get('questionId')!);
    await queryClient.ensureQueryData(questionDetailsQuery(questionId));
    return {
      roomId,
      questionId,
    };
  };

export const InterviewRoomContainer = () => {
  usePageTitle(ROUTES.INTERVIEW);
  const { roomId, questionId } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>;
  const { userId } = useAuthedRoute();

  const safeRoomId = roomId ?? '';

  const { data: authResult, error } = useSuspenseQuery({
    queryKey: ['checkRoomAuthorization', safeRoomId, userId, questionId],
    queryFn: () => checkRoomAuthorization(safeRoomId!, userId!, questionId),
  });

  if (error || !authResult?.isAuthed || !roomId) {
    return <Navigate to={ROUTES.HOME} />;
  }

  return <InterviewRoom questionId={questionId} roomId={roomId} />;
};
