import { collabApiGetClient } from './api-clients';

const COLLAB_SERVICE_ROUTES = {
  CHECK_ROOM_AUTH: '/room/auth',
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
    .catch((err) => {
      console.log(err);
      return { isAuthed: false, questionId: undefined };
    });
};
