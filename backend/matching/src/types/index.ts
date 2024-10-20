import { client } from '@/lib/db';
import { MATCHING_EVENT } from '@/ws/events';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

export type ITopicDifficulty = (typeof DIFFICULTIES)[number];

export type IRequestMatchRESTPayload = {
  userId: string;
};

export type IRequestMatchWSPayload = {
  topic: string | string[];
  difficulty: string;
};

export type IRequestMatchEvent = IRequestMatchWSPayload &
  IRequestMatchRESTPayload & {
    roomId: string;
  };

export type IQueueRequest = Partial<IRequestMatchWSPayload> &
  IRequestMatchRESTPayload & {
    socketPort: string;
    timestamp: string;
  };

export type IPoolTicket = IQueueRequest;

export type IRedisClient = typeof client;

export type IMatchEvent = (typeof MATCHING_EVENT)[keyof typeof MATCHING_EVENT];
export type IChildProcessMessage = {
  rooms: Array<string>;
  event: IMatchEvent;
  message?: unknown;
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
