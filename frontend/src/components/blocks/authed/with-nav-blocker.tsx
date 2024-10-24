import { FC, PropsWithChildren } from 'react';
import { useBlocker } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export const WithNavBlocker: FC<PropsWithChildren> = ({ children }) => {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => currentLocation.pathname !== nextLocation.pathname
  );
  return (
    <>
      {blocker.state === 'blocked' && (
        <Dialog modal open>
          <DialogContent className='text-primary border-secondary-foreground/40 flex flex-col gap-8'>
            <h1 className='text-lg font-medium'>
              Are you sure you want to navigate away from this page?
            </h1>
            <div className='flex flex-row justify-between'>
              <Button onClick={blocker.reset}>
                <span>Cancel</span>
              </Button>
              <Button variant='destructive' onClick={blocker.proceed}>
                <span>Leave Page</span>
              </Button>
            </div>
            <div
              id='blockDialogClose'
              className='bg-background absolute right-4 top-4 z-50 size-4'
            />
          </DialogContent>
        </Dialog>
      )}
      {children}
    </>
  );
};
