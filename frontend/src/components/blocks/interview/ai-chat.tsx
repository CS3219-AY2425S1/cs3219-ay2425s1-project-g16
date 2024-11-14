import { type LanguageName } from '@uiw/codemirror-extensions-langs';
import { MessageSquareIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { sendChatMessage } from '@/services/ai-service';

import { ChatLayout } from './chat/chat-layout';
import { ChatMessageType } from './chat/chat-message';

const STORAGE_KEY = 'ai_chat_history';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  editorCode?: string;
  language?: LanguageName;
  questionDetails?: string;
}

interface StoredChat {
  messages: Array<ChatMessageType>;
  questionDetails: string;
}

const prompts = [
  'Help me understand the code written.',
  'Give me some suggestions to solve the problem.',
];

export const AIChat: React.FC<AIChatProps> = ({
  isOpen,
  onClose,
  editorCode = '',
  language = 'python',
  questionDetails = '',
}) => {
  const [messages, setMessages] = useState<Array<ChatMessageType>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const streamingTextRef = useRef<string>('');
  const prevQuestionRef = useRef<string>(questionDetails);

  useEffect(() => {
    const loadMessages = () => {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const { messages: storedMessages, questionDetails: storedQuestion } = JSON.parse(
          stored
        ) as StoredChat;

        // If question has changed, clear the history
        if (storedQuestion !== questionDetails) {
          localStorage.removeItem(STORAGE_KEY);
          setMessages([]);
        } else {
          // Convert stored timestamps back to Date objects
          const messagesWithDates = storedMessages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          setMessages(messagesWithDates);
        }
      }
    };

    loadMessages();
    prevQuestionRef.current = questionDetails;
  }, [questionDetails]);

  const handleClearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([]);
  };

  useEffect(() => {
    if (messages.length > 0) {
      const dataToStore: StoredChat = {
        messages,
        questionDetails,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    }
  }, [messages, questionDetails]);

  const handleSend = async (userMessage: string): Promise<void> => {
    if (!userMessage.trim() || isLoading) return;

    // Reset streaming text reference
    streamingTextRef.current = '';

    // Add user message
    const newMessage: ChatMessageType = {
      text: userMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        messages: [...messages, newMessage].map((v) => ({
          role: v.isUser ? 'user' : 'assistant',
          content: v.text,
        })),
        editorCode,
        language,
        questionDetails,
      };

      // Add AI response placeholder
      setMessages((prev) => [
        ...prev,
        {
          text: '',
          isUser: false,
          timestamp: new Date(),
          isStreaming: true,
        },
      ]);

      const response = await sendChatMessage(payload, (chunk) => {
        // Update streaming text
        streamingTextRef.current = chunk;

        // Update the last message with the accumulated text
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            text: streamingTextRef.current,
            isUser: false,
            timestamp: new Date(),
            isStreaming: true,
          };
          return newMessages;
        });
      });

      if (response.success) {
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            text: newMessages[newMessages.length - 1].text,
            isUser: false,
            timestamp: new Date(),
            isStreaming: false,
          };
          return newMessages;
        });
      } else {
        setError('Failed to get response from AI');
        // Remove the streaming message if there was an error
        setMessages((prev) => prev.slice(0, -1));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred while fetching the response'
      );
      // Remove the streaming message if there was an error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      streamingTextRef.current = '';
    }
  };

  return (
    <ChatLayout
      isOpen={isOpen}
      onClose={onClose}
      messages={messages}
      onSend={handleSend}
      isLoading={isLoading}
      error={error}
      title='AI Assistant'
      onClearHistory={handleClearHistory}
      CustomPlaceHolderElem={({ onSend }) => (
        <div className='flex w-full flex-col gap-6 text-center'>
          <MessageSquareIcon className='mx-auto size-12 opacity-50' />
          <p>No messages yet. Start a conversation, or use one of these prompts:</p>
          <div className='flex flex-wrap justify-center gap-4'>
            {prompts.map((value, index) => (
              <Button
                key={index}
                variant='outline'
                size='sm'
                className='max-w-full whitespace-normal break-words rounded-xl '
                onClick={() => onSend(value)}
              >
                <span>{value}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    />
  );
};
