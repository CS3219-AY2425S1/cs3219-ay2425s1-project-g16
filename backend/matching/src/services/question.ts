import axios from 'axios';

import { PEERPREP_QUESTION_HOST } from '@/config';

import { IGetRandomQuestionPayload, IQuestion, IServiceResponse } from '../types/index';

export async function getRandomQuestion(payload: IGetRandomQuestionPayload): Promise<IQuestion> {
  const response = await axios.post<IServiceResponse<{ question: IQuestion }>>(
    `${PEERPREP_QUESTION_HOST}/questions/random`,
    payload
  );

  if (response.status !== 200 || !response.data.data) {
    throw new Error(response.data.error?.message || 'Failed to get a random question');
  }

  return response.data.data.question;
}
