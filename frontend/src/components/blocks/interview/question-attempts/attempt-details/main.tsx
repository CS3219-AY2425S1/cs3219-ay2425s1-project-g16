import type { FC, PropsWithChildren } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { IQuestionAttempt } from '@/types/question-types';

import { CodeViewer } from './code-viewer';

type AttemptDetailsPaneProps = {
  triggerText: string;
} & IQuestionAttempt;

export const AttemptDetailsDialog: FC<PropsWithChildren<AttemptDetailsPaneProps>> = ({
  children,
  triggerText,
  code,
  language,
  attemptId,
}) => {
  return (
    <Dialog>
      {children ? (
        <DialogTrigger>{children}</DialogTrigger>
      ) : (
        <DialogTrigger>{triggerText}</DialogTrigger>
      )}
      <DialogContent className='border-border text-primary max-w-screen-md'>
        <DialogHeader>
          <DialogTitle className=''>
            Attempt&nbsp;<span className='font-mono'>{attemptId}</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className='size-full max-h-[calc(100dvh-200px)] overflow-auto'>
          <CodeViewer {...{ code, language }} />
        </DialogDescription>
        <DialogFooter>
          <span className='font-base text-sm'>Attempted at: {triggerText}</span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
