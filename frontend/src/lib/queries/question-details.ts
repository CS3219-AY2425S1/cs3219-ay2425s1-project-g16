import { getQuestionDetails } from '@/services/question-service';
import { queryOptions } from '@tanstack/react-query';

export const questionDetailsQuery = (id: number) =>
  queryOptions({
    queryKey: ['qn', 'details', id],
    queryFn: async ({ signal: _ }) => getQuestionDetails(id),
  });
