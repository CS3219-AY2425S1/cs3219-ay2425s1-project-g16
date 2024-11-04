import { logger } from '@/lib/utils';
import type { IMatchItemsResponse, IMatchType } from '@/types';

import { createRoom } from './collab';
import { getRandomQuestion } from './question';

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

    const topics = topic?.split('|') ?? [];
    const payload = {
      userId1,
      userId2,
      ...(searchIdentifier === 'difficulty' && difficulty ? { difficulty } : {}),
      ...(searchIdentifier === 'topic' && topic ? { topics } : {}),
      ...(searchIdentifier === 'exact match' && topic && difficulty ? { topics, difficulty } : {}),
    };

    // Get a random question
    const question = await getRandomQuestion(payload);

    if (!question) {
      logger.info('No matching question found');
      return undefined;
    }

    const roomId = await createRoom(
      userId1,
      userId2,
      question.id.toString(),
      question.attemptCount
    );

    logger.info('Successfully got match items');
    return {
      roomId,
      questionId: question.id,
    };
  } catch (error) {
    const { name, message, stack, cause } = error as Error;
    logger.error(`Error in getMatchItems: ${JSON.stringify({ name, message, stack, cause })}`);
    return undefined;
  }
}
