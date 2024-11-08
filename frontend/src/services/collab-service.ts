import { collabApiGetClient } from './api-clients';

const COLLAB_SERVICE_ROUTES = {
  CHECK_ROOM_AUTH: '/room/auth?roomId=<roomId>&userId=<userId>',
};

export const checkRoomAuthorization = (roomId: string, userId: string) => {
  return collabApiGetClient
    .get(
      COLLAB_SERVICE_ROUTES.CHECK_ROOM_AUTH.replace(/<roomId>/, roomId).replace(/<userId>/, userId)
    )
    .then((response) => {
      return { isAuthed: response.status < 400 };
    })
    .catch((err) => {
      console.log(err);
      return { isAuthed: false };
    });
};
