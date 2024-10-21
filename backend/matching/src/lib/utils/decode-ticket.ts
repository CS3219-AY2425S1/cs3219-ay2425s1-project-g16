import { logger } from './logger';

type IDecodedTicket = {
  id: string;
  userId: string;
  socketPort: string;
  timestamp: string;
  difficulty?: string;
  topic?: string;
};

export const decodeStreamTicket = (id: string, items: Array<string>) => {
  const accum: Record<string, string> = { id };

  for (let i = 0; i < items.length; i = i + 2) {
    const key = items[i];
    const value = items[i + 1];
    accum[key] = key === 'topic' || key === 'difficulty' ? value.split(',').join('|') : value;
  }

  const out = accum as Partial<IDecodedTicket>;

  if (!out.userId || !out.socketPort || !out.timestamp || (!out.difficulty && !out.topic)) {
    logger.warn(`[utils::decodeStreamTicket]: Received invalid stream item`);
  }

  return out as IDecodedTicket;
};

export const decodePoolTicket = (items: Array<string>) => {
  const accum: Record<string, string> = {};

  for (let i = 0; i < items.length; i = i + 2) {
    const key = items[i];
    const value = items[i + 1];
    accum[key] = key === 'topic' || key === 'difficulty' ? value.split(',').join('|') : value;
  }

  const out = accum as Partial<IDecodedTicket>;

  if (
    !out.id ||
    !out.userId ||
    !out.socketPort ||
    !out.timestamp ||
    (!out.difficulty && !out.topic)
  ) {
    logger.warn(`[utils::decodePoolTicket]: Received invalid pool item`);
  }

  return out as IDecodedTicket;
};
