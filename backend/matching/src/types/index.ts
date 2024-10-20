import { client } from '@/lib/db';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

export type ITopicDifficulty = (typeof DIFFICULTIES)[number];

export type IRequestMatchPayload = {
  userId: string;
  topic: string | string[];
  difficulty: string;
};

export type IQueueRequest = Partial<Pick<IRequestMatchPayload, 'topic' | 'difficulty'>> &
  Pick<IRequestMatchPayload, 'userId'> & {
    socketPort: string;
    timestamp: string;
  };

export type IPoolTicket = IQueueRequest;

export type IRedisClient = typeof client;

export type IStreamMessage = {
  id: string;
  message?: {
    // Stream
    [x: string]: string;
  };
  value?: Awaited<ReturnType<(typeof client)['ft']['search']>>['documents'][number]['value'];
};

export type IMatchType = 'difficulty' | 'topic' | 'exact match' | undefined;

export interface IServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string };
}

export interface IQuestion {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  topic: string[];
}

export interface IGetRandomQuestionPayload {
  attemptedQuestions: number[];
  difficulty?: string;
  topic?: string;
}

export interface IMatchItemsResponse {
  roomName: string;
  questionId: number;
  question: IQuestion;
}
