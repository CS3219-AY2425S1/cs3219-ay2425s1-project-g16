import { IPoolTicket, IStreamMessage } from '@/types';

export const decodePoolTicket = (ticket: IStreamMessage) => {
  const { userId, socketPort, topic, difficulty, timestamp } = ticket.message
    ? (ticket.message as IPoolTicket)
    : (ticket.value as IPoolTicket);
  return {
    id: ticket.id,
    userId,
    socketPort,
    timestamp,
    topic,
    difficulty,
  };
};
