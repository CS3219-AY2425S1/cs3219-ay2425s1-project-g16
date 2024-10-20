import crypto from 'crypto';

export async function createRoom(
  userId1: string,
  userId2: string,
  questionId: string
): Promise<string> {
  const combinedString = `uid1=${userId1}|uid2=${userId2}|qid=${questionId}`;
  const hash = crypto.createHash('sha256');
  const uniqueRoomName = hash.update(combinedString).digest('hex');
  return uniqueRoomName;
}
