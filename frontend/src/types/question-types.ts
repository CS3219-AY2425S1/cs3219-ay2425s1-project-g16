export type Question = {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: Array<string>;
  attempted: boolean;
};

export type QuestionDetails = {
  title: string;
  description: string;
  topic: Array<string>;
  difficulty: string;
  id?: string;
};

export type IGetQuestionsResponse = {
  questions: Array<Question>;
  totalQuestions: number;
};

export type IGetTopicsResponse = {
  topics: Array<string>;
};

export type IGetDifficultiesResponse = {
  difficulties: Array<string>;
};

export type IGetQuestionDetailsResponse = {
  question: QuestionDetails;
};

export type IPostAddQuestionAttemptParams = {
  questionId: number;
  userId1: string;
  userId2?: string; // Optional if userId2 is not always required
  code: string;
  language: string;
};

export type IPostAddQuestionAttemptResponse =
  | {
      message: string;
    }
  | {
      error: string;
      details: string;
    };

export type IPostGetQuestionAttemptsParams = {
  questionId: number;
  userId: string;
  limit?: number;
  offset?: number;
};

export type IQuestionAttempt = {
  attemptId: string;
  code: string;
  language: string;
  timestamp: string;
  userId1: string;
  userId2?: string;
};
export type IPostGetQuestionAttemptsResponse = Array<IQuestionAttempt>;
