import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { logger } from '@/lib/utils';
import { isValidUUID } from '@/lib/uuid';
import { getQuestionAttempts } from '@/services/get/get-attempts';
import { addAttempt } from '@/services/post/addAttempt';

// Define the expected request body structure
interface AddAttemptRequestBody {
  questionId: number;
  userId1: string;
  userId2?: string; // Optional if userId2 is not always required
  code: string;
  language: string;
}

// Controller function to handle creating an attempt
export const createAttempt = async (
  req: Request<unknown, unknown, AddAttemptRequestBody>,
  res: Response
) => {
  const { questionId, userId1, userId2, code, language } = req.body;

  // Basic validation for required fields
  if (!questionId || !userId1 || !code || !language) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Call the service function to add the attempt
    const result = await addAttempt({
      questionId,
      userId1,
      userId2,
      code,
      language,
    });

    // Respond with success
    res.status(StatusCodes.OK).json({ message: 'Attempt added successfully', result });
  } catch (err) {
    const { name, message, stack, cause } = err as Error;
    logger.error({ name, message, stack, cause }, 'Error adding attempt');

    // Enhanced error response with error details
    res.status(500).json({
      error: 'Error adding attempt',
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};

export const getAttempts = async (
  req: Request<unknown, unknown, Partial<Parameters<typeof getQuestionAttempts>[0]>, unknown>,
  res: Response
) => {
  const { questionId, userId, limit, offset } = req.body;

  if (!questionId || isNaN(questionId) || !userId || !isValidUUID(userId)) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json('Malformed Request');
  }

  try {
    const result = await getQuestionAttempts({ questionId, userId, limit, offset });
    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    const { name, message, stack, cause } = err as Error;
    logger.error({ name, message, stack, cause }, 'Error retrieving attempts');

    // Enhanced error response with error details
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Error retrieving attempts',
      details: err instanceof Error ? err.message : 'Unknown error',
    });
  }
};
