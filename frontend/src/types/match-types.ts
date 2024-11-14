export type IRequestMatchPayload = {
  userId: string;
  topic: Array<string>;
  difficulty: string;
};

export type IRequestMatchResponse = {
  socketPort: string;
};
