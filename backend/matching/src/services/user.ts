import { routes, userServiceClient } from './_hosts';

export async function fetchAttemptedQuestions(userId: string): Promise<number[]> {
  const response = await userServiceClient.post<number[]>(
    routes.USER_SERVICE.ATTEMPTED_QNS.GET.path,
    {
      userId,
    }
  );

  if (response.status !== 200 || !response.data) {
    throw new Error(`Failed to fetch attempted questions for user ${userId}`);
  }

  return response.data || [];
}
