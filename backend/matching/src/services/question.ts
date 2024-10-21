import type { IGetRandomQuestionPayload, IQuestion, IServiceResponse } from '@/types';

import { questionServiceClient, routes } from './_hosts';

export async function getRandomQuestion(payload: IGetRandomQuestionPayload): Promise<IQuestion> {
  const response = await questionServiceClient.post<IServiceResponse<{ question: IQuestion }>>(
    routes.QUESTION_SERVICE.GET_RANDOM_QN.path,
    payload
  );

  if (response.status !== 200 || !response.data.data) {
    throw new Error(response.data.error?.message || 'Failed to get a random question');
  }

  return response?.data?.data?.question ?? undefined;
}
