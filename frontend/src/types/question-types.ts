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
