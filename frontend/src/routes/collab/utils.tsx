import { QueryClient, queryOptions } from '@tanstack/react-query';
import { LoaderFunctionArgs } from 'react-router-dom';

import { getQuestionDetails } from '@/services/question-service';

export const questionDetailsQuery = (id: number) =>
  queryOptions({
    queryKey: ['qn', 'details', id],
    queryFn: async ({ signal: _ }) => getQuestionDetails(id),
  });

export const loader =
  (queryClient: QueryClient) =>
  async ({ request, params }: LoaderFunctionArgs) => {
    const searchParams = new URL(request.url).searchParams;
    const questionId = Number.parseInt(searchParams.get('questionId') ?? '1');

    await queryClient.ensureQueryData(questionDetailsQuery(questionId));

    return { roomId: params.roomId, questionId };
  };
