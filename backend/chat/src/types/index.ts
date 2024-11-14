export interface IChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  message: string;
  createdAt: number;
}
