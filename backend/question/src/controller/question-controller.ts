import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import {
  getDifficultiesService,
  getQuestionDetailsService,
  getQuestionsService,
  getTopicsService,
  searchQuestionsByTitleService,
} from '@/services/get/index';
import type { IGetQuestionPayload, IGetQuestionsPayload } from '@/services/get/types';
import {
  createQuestionService,
  deleteQuestionService,
  updateQuestionService,
} from '@/services/post';
import type {
  ICreateQuestionPayload,
  IDeleteQuestionPayload,
  IUpdateQuestionPayload,
} from '@/services/post/types';

export const getQuestions = async (req: Request, res: Response): Promise<Response> => {
  const { questionName, difficulty, topic, pageNum, recordsPerPage, userId } = req.query;
  const payload: IGetQuestionsPayload = {
    questionName: questionName as string,
    difficulty: difficulty as string,
    topic: topic as Array<string>,
    pageNum: parseInt(pageNum as string) || 0,
    recordsPerPage: parseInt(recordsPerPage as string) || 20,
    userId: userId as string,
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

export const getTopics = async (req: Request, res: Response): Promise<Response> => {
  try {
    const result = await getTopicsService();
    return res.status(result.code).json(result.data);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'An error occurred', error });
  }
};

export const getDifficulties = async (req: Request, res: Response): Promise<Response> => {
  try {
    const result = await getDifficultiesService();
    return res.status(result.code).json(result.data);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'An error occurred', error });
  }
};
