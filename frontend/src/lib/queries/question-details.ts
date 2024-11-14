import { queryOptions } from '@tanstack/react-query';

import { getQuestionDetails } from '@/services/question-service';

export const questionDetailsQuery = (id: number) =>
  queryOptions({
    queryKey: ['qn', 'details', id],
    queryFn: async ({ signal: _ }) => getQuestionDetails(id),
  });
