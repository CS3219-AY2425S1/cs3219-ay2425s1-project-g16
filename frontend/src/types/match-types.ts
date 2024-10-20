export type IRequestMatchPayload = {
  userId: string;
  topic: string[];
  difficulty: string;
};

export type IRequestMatchResponse = {
  socketPort: string;
};
