import { zodResolver } from '@hookform/resolvers/zod';
import { QueryClient, queryOptions, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { defer, LoaderFunctionArgs } from 'react-router-dom';
import { z } from 'zod';

import { requestMatch } from '@/services/match-service';
import { fetchDifficulties, fetchTopics } from '@/services/question-service';
import { useAuthedRoute } from '@/stores/auth-store';

export interface MatchFormData {
  selectedTopics: Array<string>;
  difficulty: string;
}

export const getTopicsQueryConfig = () =>
  queryOptions({
    queryKey: ['topics'],
    queryFn: async () => fetchTopics(),
  });

export const getDifficultiesQueryConfig = () => {
  return queryOptions({
    queryKey: ['difficulties'],
    queryFn: async () => fetchDifficulties(),
  });
};

export const loader =
  (queryClient: QueryClient) =>
  async ({ params: _ }: LoaderFunctionArgs) => {
    return defer({
      topics: queryClient.ensureQueryData(getTopicsQueryConfig()),
      difficulties: queryClient.ensureQueryData(getDifficultiesQueryConfig()),
    });
  };

const formSchema = z.object({
  selectedTopics: z.array(z.string()).min(1, 'Please select at least one topic'),
  difficulty: z.string().min(1, 'Please select a difficulty'),
});

export type IRequestMatchFormSchema = z.infer<typeof formSchema>;

export const useRequestMatchForm = () => {
  const { userId } = useAuthedRoute();

  const [socketPort, setSocketPort] = useState('');

  const form = useForm<IRequestMatchFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedTopics: [],
      difficulty: '',
    },
    mode: 'onSubmit',
  });
  const { selectedTopics: topic, difficulty } = form.watch();

  const { mutate, error, isPending, isSuccess } = useMutation({
    mutationKey: ['requestMatch', topic, difficulty],
    mutationFn: () => {
      return requestMatch({ userId });
    },
    onSuccess(data, _variables, _context) {
      if (data && data.socketPort) {
        setSocketPort(data.socketPort);
        return;
      }
    },
  });

  const onSubmit = (_data: IRequestMatchFormSchema) => {
    mutate();
  };

  return {
    form,
    socketPort,
    onSubmit: form.handleSubmit(onSubmit),
    matchRequestError: error,
    isMatchRequestPending: isPending,
    isMatchRequestSuccess: isSuccess,
  };
};
