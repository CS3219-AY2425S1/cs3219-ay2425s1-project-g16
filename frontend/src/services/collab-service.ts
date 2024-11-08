import { IInterviewRoom } from '@/types/collab-types';

import { collabApiGetClient } from './api-clients';

const COLLAB_SERVICE_ROUTES = {
  CHECK_ROOM_AUTH: '/room/auth',
  GET_ROOMS: '/room/rooms',
};

export const checkRoomAuthorization = (roomId: string, userId: string) => {
  const searchParams = new URLSearchParams();
  searchParams.set('roomId', roomId);
  searchParams.set('userId', userId);
  return collabApiGetClient
    .get(`${COLLAB_SERVICE_ROUTES.CHECK_ROOM_AUTH}?${searchParams.toString()}`)
    .then((response) => {
      return { isAuthed: response.status < 400, questionId: response.data?.questionId };
    })
    .catch((_err) => {
      return { isAuthed: false, questionId: undefined };
    });
};

export const getRooms = (userId: string, offset?: number, limit?: number) => {
  const searchParams = new URLSearchParams();
  searchParams.set('userId', userId);

  if (offset) {
    searchParams.set('offset', String(offset));
  }

  if (limit) {
    searchParams.set('limit', String(limit));
  }

  return collabApiGetClient
    .get(`${COLLAB_SERVICE_ROUTES.GET_ROOMS}?${searchParams.toString()}`)
    .then((response) => response.data as Array<IInterviewRoom>)
    .catch((_err) => []);
};
