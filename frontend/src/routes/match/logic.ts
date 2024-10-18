import { QueryClient, queryOptions } from '@tanstack/react-query';
import { defer, LoaderFunctionArgs } from 'react-router-dom';

import { fetchTopics } from '@/services/question-service';

export interface MatchFormData {
  selectedTopics: string[];
  difficulty: string;
}

const getTopicsQueryConfig = () =>
  queryOptions({
    queryKey: ['topics'],
    queryFn: async () => fetchTopics(),
  });

export const loader =
  (queryClient: QueryClient) =>
  async ({ params: _ }: LoaderFunctionArgs) => {
    return defer({
      topics: queryClient.ensureQueryData(getTopicsQueryConfig()),
    });
  };
