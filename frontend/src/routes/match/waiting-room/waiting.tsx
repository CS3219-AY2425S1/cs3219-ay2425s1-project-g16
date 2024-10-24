import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

import { Button } from '@/components/ui/button';
import { MATCHING_EVENT, WS_EVENT } from '@/lib/ws';
import { MATCHING_SOCKET } from '@/services/api-clients';
import { cancelMatch } from '@/services/match-service';
import { getUserId } from '@/services/user-service';
import { useMatchRequest } from '@/stores/match-request-store';

import { UI_STATUS } from './constants';

type IWaitingRoomProps = {
  socketPort: string | null;
  setIsModalOpen: (isOpen: boolean) => void;
};

type IWaitingRoomUIState = {
  connected: boolean;
  canCancel: boolean;
  uiState: (typeof UI_STATUS)[keyof typeof UI_STATUS];
};

export const WaitingRoom = ({ socketPort, setIsModalOpen }: IWaitingRoomProps) => {
  const navigate = useNavigate();
  const { values } = useMatchRequest();
  const [{ connected, canCancel, uiState }, setUIState] = useState<IWaitingRoomUIState>({
    connected: false,
    canCancel: false,
    uiState: UI_STATUS.WAITING_STATUS,
  });
  const { mutate: sendCancelRequest, isPending: isCancelling } = useMutation({
    mutationFn: cancelMatch,
    onSuccess: () => {
      // TODO: Add toaster notif or cancel success UI
      setIsModalOpen(false);
    },
    onError: () => {},
  });

  const countdownRef = useRef(31);
  const timerRef = useRef<number | null>(null);

  const updateDescription = (newDescription: string) => {
    setUIState((prevStatus) => ({
      ...prevStatus,
      uiState: {
        ...prevStatus.uiState,
        description: newDescription,
      },
    }));
  };

  useEffect(() => {
    if (isCancelling) {
      clearInterval(timerRef.current!);
      setUIState((state) => ({
        ...state,
        canCancel: false,
      }));
    } else if (connected) {
      timerRef.current = window.setInterval(() => {
        if (countdownRef.current > 1) {
          countdownRef.current -= 1;
          updateDescription(`Time left: ${countdownRef.current} seconds`);
        } else {
          countdownRef.current = 0;
          clearInterval(timerRef.current!);
          setUIState((prevState) => ({
            ...prevState,
            uiState: UI_STATUS.FAILED_STATUS,
          }));
        }
      }, 1000);
    }

    return () => clearInterval(timerRef.current!);
  }, [connected, isCancelling]);

  useEffect(() => {
    if (!socketPort) {
      setIsModalOpen(false);
      return;
    }

    const socket = io({
      path: MATCHING_SOCKET,
      reconnection: true,
      withCredentials: true,
    });

    socket.on(WS_EVENT.CONNECT, () => {
      console.log('Connected to server');
    });

    socket.emit(WS_EVENT.JOIN_ROOM, socketPort);

    socket.emit(WS_EVENT.START_QUEUING, {
      roomId: socketPort,
      userId: getUserId(),
      topic: values?.selectedTopics,
      difficulty: values?.difficulty,
    });

    socket.on(MATCHING_EVENT.QUEUED, () => {
      setUIState((prevState) => ({ ...prevState, connected: true }));
    });

    socket.on(WS_EVENT.MESSAGE, (data) => {
      console.log('Message from server:', data);
    });

    socket.on(MATCHING_EVENT.MATCHING, () => {
      console.log('Matching in progress');
      setUIState((prev) => ({ ...prev, canCancel: false }));
    });

    socket.on(MATCHING_EVENT.PENDING, () => {
      console.log('Waiting in pool');
      setUIState((prev) => ({ ...prev, canCancel: true }));
    });

    socket.on(MATCHING_EVENT.SUCCESS, (data) => {
      console.log(`Received match: ${JSON.stringify(data)}`);

      const roomId = data?.roomId;
      const questionId = data?.questionId;
      countdownRef.current = 0;
      clearInterval(timerRef.current!);

      setUIState((prevState) => ({ ...prevState, uiState: UI_STATUS.SUCCESS_STATUS }));
      updateDescription(`RoomId: ${roomId}\nQuestionId: ${questionId} `);
      socket.close();
    });

    socket.on(MATCHING_EVENT.FAILED, () => {
      countdownRef.current = 0;
      setUIState((prevState) => ({ ...prevState, uiState: UI_STATUS.FAILED_STATUS }));
    });

    socket.on(MATCHING_EVENT.ERROR, (errorMessage: string) => {
      countdownRef.current = 0;
      setUIState((prevState) => ({
        ...prevState,
        uiState: { ...UI_STATUS.FAILED_STATUS, description: errorMessage },
      }));
    });

    socket.on(MATCHING_EVENT.DISCONNECT, () => {
      socket.close();
    });

    return () => {
      socket?.close();
      clearInterval(timerRef.current!);
    };
  }, [socketPort, navigate, setIsModalOpen]);

  const handleCancel = async () => {
    setUIState((prevState) => ({
      ...prevState,
      uiState: UI_STATUS.CANCELLING_STATUS,
    }));
    countdownRef.current = 0;
    sendCancelRequest();
  };

  return (
    <div className='text-text flex flex-col items-center justify-center p-10'>
      <h1 className='mb-4 text-3xl'>{uiState.header}</h1>
      <div className='flex flex-col items-center justify-center'>
        {uiState.icon}
        {uiState.description.startsWith('RoomId') ? (
          <div className='flex flex-col gap-1'>
            <div className='flex flex-col gap-0'>
              <label className='text-lg'>Room Id:</label>
              <span className='text-md max-w-[400px] truncate text-balance font-mono'>
                {uiState.description.split('\nQuestionId: ')[0].replace('RoomId:', '')}
              </span>
            </div>
            <div className='flex flex-col'>
              <label className='text-lg'>Question Id:</label>
              <span className='font-mono text-lg'>
                {uiState.description.split('\nQuestionId: ')[1]}
              </span>
            </div>
          </div>
        ) : (
          <p className='mt-4 whitespace-pre-wrap text-lg'>{uiState.description}</p>
        )}
      </div>
      {countdownRef.current > 0 || isCancelling ? (
        <Button
          className='mt-5'
          variant='destructive'
          onClick={handleCancel}
          disabled={isCancelling || !canCancel}
        >
          Cancel
        </Button>
      ) : (
        <Button
          className='mt-5'
          variant='outline'
          onClick={() => {
            setIsModalOpen(false);
            // form?.reset()
          }}
        >
          Back
        </Button>
      )}
    </div>
  );
};
