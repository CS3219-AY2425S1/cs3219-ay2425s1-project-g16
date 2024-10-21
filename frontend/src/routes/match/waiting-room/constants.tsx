import { CircleCheckBig, CircleX, LoaderCircle } from 'lucide-react';

export const UI_STATUS = {
  FAILED_STATUS: {
    header: 'No match found',
    icon: <CircleX color='red' />,
    description: 'Match failed.',
  },
  WAITING_STATUS: {
    header: 'Waiting for a Partner...',
    icon: <LoaderCircle className='animate-spin' />,
    description: 'Connecting...',
  },
  CANCELLING_STATUS: {
    header: 'Cancelling Match....',
    icon: <LoaderCircle className='animate-spin' />,
    description: 'Loading...',
  },
  SUCCESS_STATUS: {
    header: 'Found a Match!',
    icon: <CircleCheckBig color='green' />,
    description: 'Match Details:',
  },
};
