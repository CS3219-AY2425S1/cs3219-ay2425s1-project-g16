export type IYjsUserState = {
  user: { name: string; userId: string; color: string; colorLight: string };
};

export type IInterviewRoom = {
  roomId: string;
  questionId: number;
  userId1: string;
  userId2?: string;
  createdAt: string;
};
