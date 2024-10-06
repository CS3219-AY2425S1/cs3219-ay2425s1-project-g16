import type { IServiceResponse } from '@/types';

//=============================================================================
// /get
//=============================================================================
export type IGetQuestionsPayload = {
  // Filters
  questionName?: string;
  difficulty?: string;
  topic?: Array<string>;
  // Pagination
  pageNum?: number; // Default 0
  recordsPerPage?: number; // Default 20
};

export type IGetQuestionsResponse = IServiceResponse<{
  questions: Array<{
    id: number; // question's unique identifier or number
    title: string; // name or title of the question
    difficulty: string; // difficulty level (e.g., 'easy', 'medium', 'hard')
    topic: Array<string>; // array of topics the question belongs to
    attempted?: boolean; // whether the user has attempted this question
  }>;
  totalQuestions: number; // total number of questions matching the query
}>;

//=============================================================================
// /details
//=============================================================================
export type IGetQuestionPayload = {
  questionId: number;
};

export type IGetQuestionResponse = IServiceResponse<{
  question?: {
    title: string; // name or title of the question
    description: string; // question description
    difficulty: string; // difficulty level (e.g., 'easy', 'medium', 'hard')
    topic: Array<string>; // array of topics the question belongs to
  } | null;
}>;

//=============================================================================
// /random (For matching)
//=============================================================================
export type IGetRandomQuestionPayload = {
  attemptedQuestions?: number[];
  difficulty?: string;
  topic?: string[];
};

export type IGetRandomQuestionResponse = IServiceResponse<{
  question: {
    title: string; // name or title of the question
    description: string; // question description
    difficulty: string; // difficulty level (e.g., 'easy', 'medium', 'hard')
    topic: Array<string>; // array of topics the question belongs to
  } | null;
}>;
