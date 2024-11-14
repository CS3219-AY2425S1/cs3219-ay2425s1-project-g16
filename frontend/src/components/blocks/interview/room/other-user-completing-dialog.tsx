import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';

import { COMPLETION_STATES } from '../constants';

type OtherUserCompletingDialogProps = {
  status: string;
};

export const OtherUserCompletingDialog: FC<OtherUserCompletingDialogProps> = ({ status }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (status === COMPLETION_STATES.SUCCESS) {
      setTimeout(() => {
        navigate('/');
      }, 200);
    }
  }, [status]);

  return (
    <Dialog open>
      <DialogContent className='text-primary border-border'>
        <DialogHeader className='text-lg font-medium'>
          {status === COMPLETION_STATES.PENDING
            ? 'The other user is marking this question attempt as complete. Please wait...'
            : status === COMPLETION_STATES.SUCCESS
              ? 'Question marked as completed. Navigating to home page...'
              : 'An Error occurred.'}
        </DialogHeader>
        {status !== COMPLETION_STATES.ERROR && ( // Block exit if not error
          <div className='bg-background absolute right-3 top-3 z-50 size-6' />
        )}
      </DialogContent>
    </Dialog>
  );
};
