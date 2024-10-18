import { IMatchType } from "@/types";
import axios from 'axios';

interface IGetRandomQuestionPayload {
  attemptedQuestions: number[];
  difficulty?: string;
  topic?: string;
}

interface IQuestion {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  topic: string[];
}

interface IServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: { message: string };
}

interface IMatchItemsResponse {
  roomId: string;
  questionId: number;
  question: IQuestion;
}

export const getMatchItems = async (
  searchIdentifier: IMatchType,
  topic?: string,
  difficulty?: string,
  userId1?: string,
  userId2?: string
): Promise<IServiceResponse<IMatchItemsResponse>> => {
  const userEndpoint = `${process.env.USER_SERVER_ENDPOINT}`;
  const questionEndpoint = `${process.env.QUESTION_SERVER_ENDPOINT}`;
  const collabServerEndpoint = `${process.env.COLLAB_SERVER_ENDPOINT}`;

  try {
    if (!userId1 || !userId2) {
      throw new Error('Both user IDs are required');
    }

    // Fetch attempted questions for both users
    const [attemptedQuestions1, attemptedQuestions2] = await Promise.all([
      fetchAttemptedQuestions(userEndpoint, userId1),
      fetchAttemptedQuestions(userEndpoint, userId2)
    ]);

    // Combine attempted questions from both users
    const allAttemptedQuestions = [...new Set([...attemptedQuestions1, ...attemptedQuestions2])];

    // Prepare payload for the /random endpoint
    const payload: IGetRandomQuestionPayload = {
      attemptedQuestions: allAttemptedQuestions,
    };

    if (searchIdentifier === 'difficulty' && difficulty) {
      payload.difficulty = difficulty;
    } else if (searchIdentifier === 'topic' && topic) {
      payload.topic = topic;
    } else if (searchIdentifier === 'exact match' && topic && difficulty) {
      payload.topic = topic;
      payload.difficulty = difficulty;
    }

    // Query the question endpoint using the /random endpoint
    const questionResponse = await axios.post<IServiceResponse<{ question: IQuestion }>>(
      `${questionEndpoint}/random`,
      payload
    );

    if (!questionResponse.data.success || !questionResponse.data.data?.question) {
      throw new Error(questionResponse.data.error?.message || 'Failed to get a random question');
    }

    const questionId = questionResponse.data.data.question.id;

    // Update attempted questions for both users
    await Promise.all([
      updateAttemptedQuestions(userEndpoint, userId1, questionId),
      updateAttemptedQuestions(userEndpoint, userId2, questionId)
    ]);

    // Query the collab server for the room ID
    const roomResponse = await axios.get<IServiceResponse<{ roomId: string }>>(
      `${collabServerEndpoint}/rooms`,
      {
        params: {
          userId1,
          userId2,
          questionId: questionId.toString(),
        }
      }
    );

    if (!roomResponse.data.success || !roomResponse.data.data?.roomId) {
      throw new Error(roomResponse.data.error?.message || 'Failed to create room');
    }

    return {
      success: true,
      data: {
        roomId: roomResponse.data.data.roomId,
        questionId: questionId,
        question: questionResponse.data.data.question,
      }
    };
  } catch (error) {
    console.error('Error in getMatchItems:', error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      }
    };
  }
};

async function fetchAttemptedQuestions(userEndpoint: string, userId: string): Promise<number[]> {
  const response = await axios.get<IServiceResponse<{ attemptedQuestions: number[] }>>(
    `${userEndpoint}/user/${userId}/attempted-questions`
  );
  if (!response.data.success || !response.data.data?.attemptedQuestions) {
    throw new Error(`Failed to fetch attempted questions for user ${userId}`);
  }
  return response.data.data.attemptedQuestions;
}

async function updateAttemptedQuestions(userEndpoint: string, userId: string, questionId: number): Promise<void> {
  const response = await axios.post<IServiceResponse<{ message: string }>>(
    `${userEndpoint}/user/${userId}/attempted-question`,
    { questionId }
  );
  if (!response.data.success) {
    throw new Error(`Failed to update attempted questions for user ${userId}`);
  }
}