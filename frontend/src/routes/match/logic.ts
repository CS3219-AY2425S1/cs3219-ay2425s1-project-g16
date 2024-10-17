import { fetchTopics } from '@/services/question-service';
import { queryOptions, QueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs, defer } from 'react-router-dom';

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
