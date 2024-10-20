import type {
  IGetDifficultiesResponse,
  IGetQuestionDetailsResponse,
  IGetQuestionsResponse,
  IGetTopicsResponse,
} from '@/types/question-types';

import { questionApiClient } from './api-clients';

const QUESTION_SERVICE_ROUTES = {
  GET_QUESTIONS: '/questions',
  GET_QUESTION_DETAILS: '/questions/<questionId>',
  GET_TOPICS: '/questions/topics',
  GET_DIFFICULTIES: '/questions/difficulties',
};

export const getQuestionDetails = (questionId: number): Promise<IGetQuestionDetailsResponse> => {
  // TODO: Add error handling and notifs
  return questionApiClient
    .get(QUESTION_SERVICE_ROUTES.GET_QUESTION_DETAILS.replace(/<questionId>/, String(questionId)))
    .then((v) => {
      return v.data as IGetQuestionDetailsResponse;
    });
};

export const ROWS_PER_PAGE = 8;

export async function fetchQuestions(pageNum: number = 0): Promise<IGetQuestionsResponse> {
  const params = new URLSearchParams({
    pageNum: String(pageNum),
    recordsPerPage: String(ROWS_PER_PAGE),
  }).toString();

  // TODO: Add error handling and notifs
  return questionApiClient
    .get(QUESTION_SERVICE_ROUTES.GET_QUESTIONS + `?${params}`)
    .then((res) => {
      return res.data as IGetQuestionsResponse;
    })
    .catch((err) => {
      console.error(err);
      return {
        questions: [],
        totalQuestions: 0,
      } as IGetQuestionsResponse;
    });
}

export const fetchTopics = (): Promise<IGetTopicsResponse> => {
  return questionApiClient.get(QUESTION_SERVICE_ROUTES.GET_TOPICS).then((res) => {
    return res.data as IGetTopicsResponse;
  });
};

export const fetchDifficulties = (): Promise<IGetDifficultiesResponse> => {
  return questionApiClient.get(QUESTION_SERVICE_ROUTES.GET_DIFFICULTIES).then((res) => {
    return res.data as IGetDifficultiesResponse;
  });
};
