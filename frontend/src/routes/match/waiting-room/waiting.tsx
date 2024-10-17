import { Button } from '@/components/ui/button';
import { cancelMatch } from '@/services/match-service';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  WAITING_STATUS,
  FAILED_STATUS,
  SOCKET_EVENTS,
  CANCELLING_STATUS,
  SUCCESS_STATUS,
} from './constants';

interface WaitingRoomProps {
  socketPort: string | null;
  setIsModalOpen: (isOpen: boolean) => void;
}

export const WaitingRoom = ({ socketPort, setIsModalOpen }: WaitingRoomProps) => {
  const navigate = useNavigate();

  const [connected, setConnected] = useState(false);
  const [cancel, setCancel] = useState(false);
  const countdownRef = useRef(31);
  const [status, setStatus] = useState(WAITING_STATUS);
  const timerRef = useRef<number | null>(null);

  const updateDescription = (newDescription: string) => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      description: newDescription,
    }));
  };

  useEffect(() => {
    if (cancel) {
      clearInterval(timerRef.current!);
      setStatus(CANCELLING_STATUS);
    } else if (connected) {
      timerRef.current = window.setInterval(() => {
        if (countdownRef.current > 1) {
          countdownRef.current -= 1;
          updateDescription(`Time left: ${countdownRef.current} seconds`);
        } else {
          countdownRef.current = 0;
          clearInterval(timerRef.current!);
          setStatus(FAILED_STATUS);
        }
      }, 1000);
    }

    return () => clearInterval(timerRef.current!);
  }, [connected, cancel]);

  useEffect(() => {
    if (!socketPort) {
      setIsModalOpen(false);
      return;
    }
    const socket = io({
      path: '/matching-socket/',
      reconnection: true,
      withCredentials: true,
    });

    socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('Connected to server');
      setConnected(true);
      socket.emit(SOCKET_EVENTS.JOIN_ROOM, socketPort);

      socket.on(SOCKET_EVENTS.MESSAGE, (data) => {
        console.log('Message from server:', data);
      });

      socket.on(SOCKET_EVENTS.MATCHING, () => {
        console.log('Matching in progress');
      });

      socket.on(SOCKET_EVENTS.PENDING, () => {
        console.log('Waiting in pool');
      });

      socket.on(SOCKET_EVENTS.SUCCESS, (data) => {
        console.log(`Received match: ${JSON.stringify(data)}`);

        const roomId = data?.roomId;
        const questionId = data?.questionId;
        countdownRef.current = 0;
        clearInterval(timerRef.current!);

        setStatus(SUCCESS_STATUS);
        updateDescription(`RoomId: ${roomId}\nQuestionId: ${questionId} `);
      });

      socket.on(SOCKET_EVENTS.FAILED, () => {
        console.log('Matching failed');
        countdownRef.current = 0;
        setStatus(FAILED_STATUS);
      });
    });

    return () => {
      socket.close();
      clearInterval(timerRef.current!);
    };
  }, [socketPort, navigate, setIsModalOpen]);

  const handleCancel = async () => {
    try {
      setCancel(true);
      countdownRef.current = 0;
      await cancelMatch();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to cancel match:', error);
    }
  };

  return (
    <div className='text-text flex flex-col items-center justify-center p-10'>
      <h1 className='mb-4 text-3xl'>{status.header}</h1>
      <div className='flex flex-col items-center justify-center'>
        {status.icon}
        <p className='mt-4 whitespace-pre-wrap text-lg'>{status.description}</p>
      </div>
      {countdownRef.current > 0 || cancel ? (
        <Button className='mt-5' variant='destructive' onClick={handleCancel} disabled={cancel}>
          Cancel
        </Button>
      ) : (
        <Button className='mt-5' variant='outline' onClick={() => setIsModalOpen(false)}>
          Back
        </Button>
      )}
    </div>
  );
};
