import React, { useState } from 'react';

import { useChat } from '@/lib/hooks/use-chat';
import { useAuthedRoute } from '@/stores/auth-store';

import { ChatLayout } from './chat/chat-layout';

interface PartnerChatProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
}

export const PartnerChat: React.FC<PartnerChatProps> = ({ isOpen, onClose, roomId }) => {
  const { userId } = useAuthedRoute();
  const { messages, sendMessage, connected, error } = useChat({ roomId });
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (message: string) => {
    setIsLoading(true);
    sendMessage(message);
    setIsLoading(false);
  };

  return (
    <ChatLayout
      isOpen={isOpen}
      onClose={onClose}
      messages={messages.map((msg) => ({
        text: msg.message,
        isUser: msg.senderId === userId,
        timestamp: new Date(msg.createdAt),
      }))}
      onSend={handleSend}
      isLoading={isLoading}
      error={connected ? error : 'Connecting...'}
      title='Chat Room'
    />
  );
};
