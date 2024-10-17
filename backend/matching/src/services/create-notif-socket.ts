export const createNotifSocket = (userId: string) => {
  const dateString = Date.now().toString(36);
  const roomId = `${userId}_${dateString}`;
  return roomId;
};
