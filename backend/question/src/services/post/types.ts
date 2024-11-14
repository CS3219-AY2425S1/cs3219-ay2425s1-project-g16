export interface ICreateQuestionPayload {
  title: string;
  description: string;
  difficulty: string;
  topics: Array<string>;
}

export interface IUpdateQuestionPayload extends ICreateQuestionPayload {
  id: number;
}

export interface IDeleteQuestionPayload {
  id: number;
}

export interface Question {
  id: number;
  title: string;
  difficulty: string;
  topic: Array<string>;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
