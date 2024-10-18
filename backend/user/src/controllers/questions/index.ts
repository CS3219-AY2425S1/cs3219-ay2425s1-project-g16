import { StatusCodes } from 'http-status-codes';
import type { IRouteHandler } from '@/types';
import { getAttemptedQuestionsService, addAttemptedQuestionService } from '@/services/questions';

export const addAttemptedQuestion: IRouteHandler = async (req, res) => {
  const userId = req.params.userId; // Assuming the userId is passed as a route parameter
  const { questionId } = req.body; // Assuming the questionId is passed in the request body

  if (!userId || !questionId) {
    return res.status(StatusCodes.BAD_REQUEST).json('User ID and Question ID are required');
  }

  const { code, data, error } = await addAttemptedQuestionService(userId, questionId);

  if (error || code !== StatusCodes.OK || !data) {
    const sanitizedErr = error?.message ?? 'An error occurred.';
    return res.status(code).json(sanitizedErr);
  }

  return res.status(StatusCodes.OK).json(data);
};

export const getAttemptedQuestions: IRouteHandler = async (req, res) => {
  const userId = req.params.userId; // Assuming the userId is passed as a route parameter

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