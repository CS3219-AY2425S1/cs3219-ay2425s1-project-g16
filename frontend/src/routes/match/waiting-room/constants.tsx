import { CircleCheckBig, CircleX, LoaderCircle } from 'lucide-react';

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  MESSAGE: 'message',
  JOIN_ROOM: 'joinRoom',
  MATCHING: 'MATCHING',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

export const FAILED_STATUS = {
  header: 'No match found',
  icon: <CircleX color='red' />,
  description: 'Match failed.',
};

export const WAITING_STATUS = {
  header: 'Waiting for a Partner...',
  icon: <LoaderCircle className='animate-spin' />,
  description: 'Connecting...',
};

export const CANCELLING_STATUS = {
  header: 'Cancelling Match....',
  icon: <LoaderCircle className='animate-spin' />,
  description: 'Loading...',
};

export const SUCCESS_STATUS = {
  header: 'Found a Match!',
  icon: <CircleCheckBig color='green' />,
  description: 'Match Details:',
};
