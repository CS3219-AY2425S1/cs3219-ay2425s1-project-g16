export type Question = {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: Array<string>;
  attempted: boolean;
};

export type IGetQuestionsResponse = {
  questions: Array<Question>;
  totalQuestions: number;
};
