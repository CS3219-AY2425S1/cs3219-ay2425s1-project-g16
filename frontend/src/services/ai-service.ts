import { collabApiClient } from './api-clients';

const AI_SERVICE_ROUTES = {
  CHAT: '/ai/chat',
};

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatPayload {
  messages: Array<ChatMessage>;
  editorCode?: string;
  language?: string;
  questionDetails?: string;
}

interface ChatResponse {
  success: boolean;
  message: string;
}

export const sendChatMessage = async (
  payload: ChatPayload,
  onStream?: (chunk: string) => void
): Promise<ChatResponse> => {
  try {
    if (onStream) {
      // Streaming request
      await collabApiClient.post(AI_SERVICE_ROUTES.CHAT, payload, {
        headers: {
          Accept: 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
        responseType: 'text',
        onDownloadProgress: (progressEvent) => {
          const rawText: string = progressEvent.event.target.responseText;

          if (rawText) {
            onStream(rawText);
          }
        },
      });

      return {
        success: true,
        message: 'Streaming completed successfully',
      };
    } else {
      const response = await collabApiClient.post(AI_SERVICE_ROUTES.CHAT, payload);
      return response.data as ChatResponse;
    }
  } catch (err) {
    console.error('Error in sendChatMessage:', err);
    return {
      success: false,
      message: 'An error occurred while processing your request.',
    };
  }
};
