import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { CHAT_SOCKET } from '@/services/api-clients';
import { useAuthedRoute } from '@/stores/auth-store';
import { Message } from '@/types/chat-types';

const WS_EVENT = {
  // client events
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'leaveRoom',
  SEND_MESSAGE: 'sendMessage',
  // server events
  CONNECT: 'connect',
  JOINED_ROOM: 'joinedRoom',
  LEFT_ROOM: 'leftRoof',
  NEW_MESSAGE: 'newMessage',
  DISCONNECT: 'disconnect',
  MESSAGE_HISTORY: 'messageHistory',
};

interface UseChatProps {
  roomId: string;
}

export const useChat = ({ roomId }: UseChatProps) => {
  const { userId } = useAuthedRoute();
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io({
      path: CHAT_SOCKET,
      reconnection: true,
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on(WS_EVENT.CONNECT, () => {
      console.log('Connected to server');
      setConnected(true);
      socket.emit(WS_EVENT.JOIN_ROOM, roomId);
    });

    socket.on(WS_EVENT.NEW_MESSAGE, (data: Message) => {
      console.log('Message from server:', data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on(WS_EVENT.JOINED_ROOM, () => {
      console.log(`Joined room: ${roomId}`);
    });

    socket.on(WS_EVENT.MESSAGE_HISTORY, (data: Array<Message>) => {
      setMessages(data);
      console.log(`Retrieved Message history`);
    });

    socket.on(WS_EVENT.DISCONNECT, () => {
      console.log('Disconnected from server');
      setConnected(false);
      socket.close();
    });

    socket.on('error', (errorMessage: string) => {
      console.error('Error:', errorMessage);
      setError(errorMessage);
    });

    return () => {
      socket?.emit(WS_EVENT.LEAVE_ROOM, roomId);
      socket?.close();
    };
  }, [roomId]);

  const sendMessage = useCallback(
    (messageContent: string) => {
      const messageData = {
        roomId,
        senderId: userId,
        message: messageContent,
        createdAt: Date.now(),
      };

      socketRef.current?.emit(WS_EVENT.SEND_MESSAGE, messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    },
    [roomId, userId]
  );

  return { messages, sendMessage, connected, error };
};
