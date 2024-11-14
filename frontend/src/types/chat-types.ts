export interface Message {
  roomId: string;
  senderId: string | null;
  message: string;
  createdAt: number;
}
