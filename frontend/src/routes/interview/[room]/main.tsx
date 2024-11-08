import { useSuspenseQuery } from '@tanstack/react-query';
import { type LoaderFunctionArgs, Navigate, useLoaderData } from 'react-router-dom';

import { usePageTitle } from '@/lib/hooks';
import { ROUTES } from '@/lib/routes';
import { checkRoomAuthorization } from '@/services/collab-service';
import { useAuthedRoute } from '@/stores/auth-store';

import InterviewRoom from './interview-room';

export const loader = ({ params }: LoaderFunctionArgs) => {
  const roomId = params.roomId;

  return {
    roomId,
  };
};

export const InterviewRoomContainer = () => {
  usePageTitle(ROUTES.INTERVIEW);
  const { roomId } = useLoaderData() as ReturnType<typeof loader>;
  const { userId } = useAuthedRoute();

  const safeRoomId = roomId ?? '';

  const { data: authResult, error } = useSuspenseQuery({
    queryKey: ['checkRoomAuthorization', safeRoomId, userId],
    queryFn: () => checkRoomAuthorization(safeRoomId, userId),
  });

  if (error || !authResult?.isAuthed || !roomId || !authResult?.questionId) {
    return <Navigate to={ROUTES.HOME} />;
  }

  return <InterviewRoom questionId={authResult.questionId} roomId={roomId} />;
};
