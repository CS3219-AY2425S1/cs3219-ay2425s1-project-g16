import { IServiceResponse } from '@/types';

export type IGetCollabRoomPayload = {
  userid1: string;
  userid2: string;
  questionid: string;
};

export type IGetCollabRoomResponse = IServiceResponse<{
  roomName: string;
}>;
