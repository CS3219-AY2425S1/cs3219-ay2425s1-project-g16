import { EventEmitter } from 'events';

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIRequest {
  messages: OpenAIMessage[];
  editorCode?: string;
  language?: string;
  questionDetails?: string;
}

// Helper to create system message with context
const createSystemMessage = (editorCode?: string, language?: string, questionDetails?: string) => {
  return {
    role: 'system' as const,
    content: `You are a mentor in a coding interview.
You are helping a user with a coding problem.
${questionDetails ? `\nQuestion Context:\n${JSON.stringify(questionDetails, null, 2)}` : ''}

${editorCode ? `\nCurrent Code in the Editor written by the user in language: (${language || 'unknown'}):\n${editorCode}` : ''}


If they do not ask for questions related to their code or the question context, you can provide general coding advice anyways. Be very concise and conversational in your responses.

Your response should only be max 4-5 sentences. Do NOT provide code in your answers, but instead try to guide them and give tips for how to solve it. YOU MUST NOT SOLVE THE PROBLEM FOR THEM, OR WRITE ANY CODE. Guide the user towards the solution, don't just give the solution. MAX 4-5 SENTENCES. Ask questions instead of giving answers. Be conversational and friendly.`,
  };
};

// Regular response function
export async function getOpenAIResponse(request: OpenAIRequest) {
  const { messages, editorCode, language, questionDetails } = request;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        createSystemMessage(editorCode, language, questionDetails),
        ...messages,
        {
          role: 'assistant',
          content:
            '<This is an internal reminder to the assistant to not provide code solutions, but to guide the user towards the solution. Max 4-5 sentences responses please.>',
        },
      ],
    });

    if (response.choices && response.choices[0].message) {
      return {
        success: true,
        message: response.choices[0].message.content,
      };
    } else {
      throw new Error('No valid response from OpenAI');
    }
  } catch (error) {
    throw new Error((error as Error)?.message || 'Failed to query OpenAI');
  }
}

// Streaming response function
export async function getOpenAIStreamResponse(request: OpenAIRequest): Promise<EventEmitter> {
  const { messages, editorCode, language, questionDetails } = request;
  const stream = new EventEmitter();

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [createSystemMessage(editorCode, language, questionDetails), ...messages],
      stream: true,
    });

    // Process the streaming response
    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content || '';

      if (content) {
        stream.emit('data', content);
      }
    }

    stream.emit('end');
  } catch (error) {
    stream.emit('error', error);
  }

  return stream;
}
