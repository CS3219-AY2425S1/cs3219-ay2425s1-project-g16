import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import type { Dispatch, FC, SetStateAction } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { WaitingRoom } from './waiting';

type IMatchingModalProps = {
  socketPort: string;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export const WaitingRoomModal: FC<IMatchingModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  socketPort,
}) => {
  return (
    <Dialog modal={true} open={isModalOpen}>
      <DialogContent className='border-border max-h-[500px] [&>button]:hidden'>
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Waiting Room</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <VisuallyHidden>
          <DialogDescription>
            You are currently in the waiting room. Please wait while we find a match for you.
          </DialogDescription>
        </VisuallyHidden>
        <WaitingRoom socketPort={socketPort} setIsModalOpen={setIsModalOpen} />
      </DialogContent>
    </Dialog>
  );
};
