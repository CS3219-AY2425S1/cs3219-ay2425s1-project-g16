import { cn } from '@/lib/utils';

import { MarkdownComponent } from './chat-markdown';

export interface ChatMessageType {
  text: string;
  isUser: boolean;
  timestamp: Date;
  isCode?: boolean;
  isStreaming?: boolean;
}

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-2 text-xs ${
          message.isUser ? 'bg-secondary/50' : 'bg-secondary'
        }`}
      >
        <MarkdownComponent
          className={cn(
            'prose prose-neutral text-sm text-primary',
            'prose-a:text-blue-500 prose-code:text-secondary-foreground prose-pre:ml-2 prose-pre:bg-transparent prose-pre:p-0',
            'prose-headings:text-primary prose-strong:text-primary prose-p:text-primary',
            'break-words'
          )}
        >
          {message.text}
        </MarkdownComponent>
        <div className='mt-1 text-xs opacity-60'>
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};
