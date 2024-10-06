import { StatusCodes } from 'http-status-codes';
import type { Request, Response } from 'express';

import {
  getQuestionsService,
  getQuestionDetailsService,
  getRandomQuestionService,
  searchQuestionsByTitleService,
} from '@/services/get/index';
import type {
  ICreateQuestionPayload,
  IDeleteQuestionPayload,
  IUpdateQuestionPayload,
} from '@/services/post/types';

import {
  createQuestionService,
  deleteQuestionService,
  updateQuestionService,
} from '@/services/post';
import type {
  IGetQuestionsPayload,
  IGetQuestionPayload,
  IGetRandomQuestionPayload,
} from '@/services/get/types';

export const getQuestions = async (req: Request, res: Response): Promise<Response> => {
  const { questionName, difficulty, topic, pageNum, recordsPerPage } = req.query;
  const payload: IGetQuestionsPayload = {
    questionName: questionName as string,
    difficulty: difficulty as string,
    topic: topic as string[],
    pageNum: parseInt(pageNum as string) || 0,
    recordsPerPage: parseInt(recordsPerPage as string) || 20,
  };

  try {
    const result = await getQuestionsService(payload);
    if (!result.data || result.code >= 400) {
      return res.status(result.code).json({
        message: result.error?.message ?? 'An error occurred',
      });
    }
    return res.status(result.code).json(result.data);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'An error occurred', error });
  }
};

export const getQuestionDetails = async (req: Request, res: Response): Promise<Response> => {
  const payload: IGetQuestionPayload = {
    questionId: parseInt(req.params.questionId),
  };

  try {
    const result = await getQuestionDetailsService(payload);
    if (!result.data || result.code >= 400) {
      return res.status(result.code).json({
        message: result.error?.message ?? 'An error occurred',
      });
    }
    return res.status(result.code).json(result.data);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'An error occurred', error });
  }
};

export const getRandomQuestion = async (req: Request, res: Response): Promise<Response> => {
  const payload: IGetRandomQuestionPayload = {
    attemptedQuestions: req.body.attemptedQuestions,
    difficulty: req.body.difficulty,
    topic: req.body.topic,
  };
  try {
    const result = await getRandomQuestionService(payload);
    return res.status(result.code).json(result);
  } catch (error) {
    console.log('error', error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'An error occurred', error });
  }
};

export const searchQuestionsByTitle = async (req: Request, res: Response): Promise<Response> => {
  const { title } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (!title) {
    return res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ success: false, message: 'Title is required' });
  }

  try {
    const result = await searchQuestionsByTitleService(title.toString(), page, limit);
    return res.status(result.code).json(result);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'An error occurred', error });
  }
};

export const createQuestion = async (req: Request, res: Response): Promise<Response> => {
  const { title, description, difficulty, topics } = req.body;

  if (!title || !description || !difficulty) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json('Malformed');
  }

  const payload: ICreateQuestionPayload = {
    title,
    description,
    difficulty,
    topics,
  };

  try {
    const result = await createQuestionService(payload);
    if (!result.data || result.code >= 400) {
      return res.status(result.code).json({
        message: result.message ?? 'An error occurred',
      });
    }
    return res.status(result.code).json(result.data);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'An error occurred', error });
  }
};

export const updateQuestion = async (req: Request, res: Response): Promise<Response> => {
  const { title, description, difficulty, topics } = req.body;
  if (!title && !description && !difficulty && (!topics || !Array.isArray(topics))) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json('Malformed');
  }

  const payload: IUpdateQuestionPayload = {
    id: parseInt(req.params.questionId),
    title,
    description,
    difficulty,
    topics,
  };

  try {
    const result = await updateQuestionService(payload);
    return res.status(result.code).json(result);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'An error occurred', error });
  }
};

export const deleteQuestion = async (req: Request, res: Response): Promise<Response> => {
  const payload: IDeleteQuestionPayload = {
    id: parseInt(req.params.questionId),
  };

  try {
    const result = await deleteQuestionService(payload);
    return res.status(result.code).json(result.success ? 'Ok' : result.message);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'An error occurred', error });
  }
};
