type IGetMatchItemsParams = {
  userId1: string;
  userId2: string;
};

export const getMatchItems = ({ userId1, userId2 }: IGetMatchItemsParams) => {
  // TODO: Get Match Items
  const roomId = `${userId1}${userId2}`;
  const questionId = Math.floor(Math.random() * 20) + 1;

  return {
    roomId,
    questionId,
  };
};
