import { collabServiceClient, routes } from './_hosts';

export async function createRoom(
  userId1: string,
  userId2: string,
  questionId: string
): Promise<string> {
  const response = await collabServiceClient.get<{ roomName: string }>(
    routes.COLLAB_SERVICE.GET_ROOM.path,
    {
      params: {
        userid1: userId1,
        userid2: userId2,
        questionid: questionId,
      },
    }
  );

  if (response.status !== 200 || !response.data?.roomName) {
    throw new Error('Failed to create room');
  }

  return response?.data?.roomName ?? undefined;
}
