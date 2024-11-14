import type {
  IGetDifficultiesResponse,
  IGetQuestionDetailsResponse,
  IGetQuestionsResponse,
  IGetTopicsResponse,
  IPostAddQuestionAttemptParams,
  IPostAddQuestionAttemptResponse,
  IPostGetQuestionAttemptsParams,
  IPostGetQuestionAttemptsResponse,
} from '@/types/question-types';

import { questionApiClient } from './api-clients';

const QUESTION_SERVICE_ROUTES = {
  GET_QUESTIONS: '/questions',
  GET_QUESTION_DETAILS: '/questions/<questionId>',
  GET_TOPICS: '/questions/topics',
  GET_DIFFICULTIES: '/questions/difficulties',
  POST_ADD_ATTEMPT: '/questions/newAttempt',
  POST_GET_ATTEMPTS: '/questions/attempts',

  // Question CRUD
  /* POST */
  ADD_QUESTION: '/questions/create',
  /* PUT */
  UPDATE_QUESTION: '/questions/<questionId>',
  /* DELETE */
  DELETE_QUESTION: '/questions/<questionId>',
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

export async function fetchQuestions(
  userId: string,
  pageNum: number = 0
): Promise<IGetQuestionsResponse> {
  const params = new URLSearchParams({
    userId,
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

export const addQuestionAttempt = (
  params: IPostAddQuestionAttemptParams
): Promise<IPostAddQuestionAttemptResponse> => {
  return questionApiClient.post(QUESTION_SERVICE_ROUTES.POST_ADD_ATTEMPT, params).then((res) => {
    return res.data as IPostAddQuestionAttemptResponse;
  });
};

export const getQuestionAttempts = (
  params: IPostGetQuestionAttemptsParams
): Promise<IPostGetQuestionAttemptsResponse> => {
  return questionApiClient
    .post(QUESTION_SERVICE_ROUTES.POST_GET_ATTEMPTS, { ...params, limit: 10 })
    .then((res) => res.data as IPostGetQuestionAttemptsResponse);
};

export const adminAddQuestion = (values: {
  title: string;
  difficulty: string;
  description: string;
  topics: Array<string>;
}) => {
  return questionApiClient
    .post(QUESTION_SERVICE_ROUTES.ADD_QUESTION, values)
    .then((res) => res.data as { message?: string });
};

export const adminUpdateQuestion = (values: {
  questionId: number;
  title: string;
  difficulty: string;
  description: string;
  topics: Array<string>;
}) => {
  const { questionId, ...rest } = values;
  return questionApiClient
    .put(QUESTION_SERVICE_ROUTES.UPDATE_QUESTION.replace(/<questionId>/, String(questionId)), rest)
    .then((res) => res.data as { message?: string });
};

export const adminDeleteQuestion = (questionId: number) => {
  return questionApiClient
    .delete(QUESTION_SERVICE_ROUTES.DELETE_QUESTION.replace(/<questionId>/, String(questionId)))
    .then((res) => res.data as { message?: string });
};
