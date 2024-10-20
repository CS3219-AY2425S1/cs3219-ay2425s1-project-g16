import { IMatchItemsResponse, IMatchType } from '../types/index';
import { createRoom } from './collab';
import { getRandomQuestion } from './question';
import { fetchAttemptedQuestions } from './user';

export async function getMatchItems(
  searchIdentifier: IMatchType,
  topic?: string,
  difficulty?: string,
  userId1?: string,
  userId2?: string
): Promise<IMatchItemsResponse | undefined> {
  try {
    if (!userId1 || !userId2) {
      throw new Error('Both user IDs are required');
    }

    const [attemptedQuestions1, attemptedQuestions2] = await Promise.all([
      fetchAttemptedQuestions(userId1),
      fetchAttemptedQuestions(userId2),
    ]);

    const allAttemptedQuestions = [...new Set([...attemptedQuestions1, ...attemptedQuestions2])];

    const payload = {
      attemptedQuestions: allAttemptedQuestions,
      ...(searchIdentifier === 'difficulty' && difficulty ? { difficulty } : {}),
      ...(searchIdentifier === 'topic' && topic ? { topic } : {}),
      ...(searchIdentifier === 'exact match' && topic && difficulty ? { topic, difficulty } : {}),
    };

    // Get a random question
    const question = await getRandomQuestion(payload);

    const roomName = await createRoom(userId1, userId2, question.id.toString());

    console.log('Successfully got match items');
    return {
      roomName,
      questionId: question.id,
      question,
    };
  } catch (error) {
    console.error('Error in getMatchItems:', error);
    return undefined;
  }
}
