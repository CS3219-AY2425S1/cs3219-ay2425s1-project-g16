// src/controllers/questionsController.ts
// src/controllers/unattempted-controller.ts
import { Request, Response } from 'express';

import { isValidUUID } from '@/lib/uuid';

import { getRandomQuestion } from '../services/get/get-random-question';

// Define types for query parameters
interface UnattemptedQuestionQuery {
  userId1: string;
  userId2: string;
  topics?: string | Array<string>;
  difficulty?: string;
}

export const fetchRandomQuestionByIncreasingAttemptCount = async (
  req: Request<unknown, unknown, Partial<UnattemptedQuestionQuery>, unknown>,
  res: Response
) => {
  const { userId1, userId2, topics: payloadTopics, difficulty } = req.body;

  if (userId1 === undefined || !isValidUUID(userId1)) {
    return res.status(400).json({ error: 'Invalid or missing userId1. It must be a valid id.' });
  }

  if (!userId2 || !isValidUUID(userId2)) {
    return res.status(400).json({ error: 'Invalid userId2. It must be a valid id if provided.' });
  }

  // Ensure topics is an array of strings
  const topics =
    typeof payloadTopics === 'string'
      ? payloadTopics.split(',')
      : Array.isArray(payloadTopics)
        ? payloadTopics.filter((topic) => !!topic)
        : undefined;

  try {
    const question = await getRandomQuestion({
      userId1,
      userId2,
      topics,
      difficulty,
    });

    if (question) {
      res.json(question);
      return;
    }

    res.status(404).json({ message: 'No unattempted questions found' });
    return;
  } catch (error) {
    console.error('Error fetching unattempted question:', error); // Log the actual error
    res
      .status(500)
      .json({ error: 'Error fetching unattempted question', details: (error as any).message });
  }
};
