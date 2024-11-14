import type { IGetRandomQuestionPayload, IQuestion } from '@/types';

import { questionServiceClient, routes } from './_hosts';

export async function getRandomQuestion(payload: IGetRandomQuestionPayload): Promise<IQuestion> {
  const response = await questionServiceClient.post<IQuestion>(
    routes.QUESTION_SERVICE.GET_RANDOM_QN.path,
    payload
  );

  if (response.status !== 200 || !response.data) {
    throw new Error(response.statusText || 'Failed to get a random question');
  }

  return response?.data ?? undefined;
}
