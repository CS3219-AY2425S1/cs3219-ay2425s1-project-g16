import { db } from '@/lib/db/index';
import { questionAttempts } from '@/lib/db/schema';

// Define the data structure for an attempt
interface AttemptData {
  questionId: number;
  userId1: string;
  userId2?: string;
  code: string;
  language: string;
}

// Function to add an attempt to the database
export const addAttempt = async (attemptData: AttemptData) => {
  return await db.insert(questionAttempts).values({
    questionId: attemptData.questionId,
    userId1: attemptData.userId1,
    userId2: attemptData.userId2,
    code: attemptData.code,
    language: attemptData.language,
  });
};
