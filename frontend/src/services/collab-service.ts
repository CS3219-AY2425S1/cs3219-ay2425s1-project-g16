import { collabApiGetClient } from './api-clients';

const COLLAB_SERVICE_ROUTES = {
  CHECK_ROOM_AUTH: '/room/auth?roomId=<roomId>&userId=<userId>&questionId=<questionId>',
};

export const checkRoomAuthorization = (roomId: string, userId: string, questionId: number) => {
  return collabApiGetClient
    .get(
      COLLAB_SERVICE_ROUTES.CHECK_ROOM_AUTH.replace(/<roomId>/, roomId)
        .replace(/<userId>/, userId)
        .replace(/<questionId>/, questionId.toString())
    )
    .then((response) => {
      return { isAuthed: response.status < 400 };
    })
    .catch((err) => {
      console.log(err);
      return { isAuthed: false };
    });
};
