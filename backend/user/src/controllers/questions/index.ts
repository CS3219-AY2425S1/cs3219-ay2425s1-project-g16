import { StatusCodes } from 'http-status-codes';

import { addAttemptedQuestionService, getAttemptedQuestionsService } from '@/services/questions';
import type { IRouteHandler } from '@/types';

export const addAttemptedQuestion: IRouteHandler = async (req, res) => {
  const { questionId, userIds } = req.body; // Assuming the questionId is passed in the request body

  if (!userIds || !questionId) {
    return res.status(StatusCodes.BAD_REQUEST).json('User ID and Question ID are required');
  }

  const { code, data, error } = await addAttemptedQuestionService(userIds, questionId);

  if (error || code !== StatusCodes.OK || !data) {
    const sanitizedErr = error?.message ?? 'An error occurred.';
    return res.status(code).json(sanitizedErr);
  }

  return res.status(StatusCodes.OK).json(data);
};

export const getAttemptedQuestions: IRouteHandler = async (req, res) => {
  const userId = req.body.userId;

  if (!userId) {
    return res.status(StatusCodes.BAD_REQUEST).json('User ID is required');
  }

  const { code, data, error } = await getAttemptedQuestionsService(userId);

  if (error || code !== StatusCodes.OK || !data) {
    const sanitizedErr = error?.message ?? 'An error occurred.';
    return res.status(code).json(sanitizedErr);
  }

  return res.status(StatusCodes.OK).json(data);
};
