import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/routes';
import { CircleX, LoaderCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const SOCKET_EVENTS = {
  CONNECT: 'connect',
  MESSAGE: 'message',
  JOIN_ROOM: 'joinRoom',
  MATCHING: 'MATCHING',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

const FAILED_STATUS = {
  header: 'No match found',
  icon: <CircleX color='red' />,
  description: 'Match failed.',
};

const WAITING_STATUS = {
  header: 'Waiting for a Partner...',
  icon: <LoaderCircle className='animate-spin' />,
  description: 'Connecting...',
};

export const WaitingRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const socketPort = location.state?.socketPort;
  const [connected, setConnected] = useState(false);
  const countdownRef = useRef(31);
  const [status, setStatus] = useState(WAITING_STATUS);
  const timerRef = useRef<number | null>(null);

  const updateStatus = (newDescription: string) => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      description: newDescription,
    }));
  };

  useEffect(() => {
    if (connected) {
      timerRef.current = window.setInterval(() => {
        if (countdownRef.current > 0) {
          countdownRef.current -= 1;
          updateStatus(`Time left: ${countdownRef.current} seconds`);
        } else {
          clearInterval(timerRef.current!);
          setStatus(FAILED_STATUS);
        }
      }, 1000);
    }

    return () => clearInterval(timerRef.current!);
  }, [connected]);

  useEffect(() => {
    if (!socketPort) {
      navigate(ROUTES.MATCH);
      return;
    }
    const socket = io(`http://localhost:9004`, {
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
        clearInterval(timerRef.current!);

        navigate(`/collab/${roomId}?questionId=${questionId}`);
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
  }, [socketPort, navigate]);

  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <h1 className='mb-4 text-3xl'>{status.header}</h1>
      <div className='flex flex-col items-center justify-center'>
        {status.icon}
        <p className='mt-4 text-lg'>{status.description}</p>
      </div>
      {countdownRef.current > 0 ? (
        <Button className='mt-5' variant='destructive'>
          Cancel
        </Button>
      ) : (
        <Button className='mt-5' variant='outline'>
          <Link to={ROUTES.MATCH}>Back</Link>
        </Button>
      )}
    </div>
  );
};
