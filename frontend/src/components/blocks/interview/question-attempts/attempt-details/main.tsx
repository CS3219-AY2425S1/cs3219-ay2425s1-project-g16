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
      <DialogContent className='border-border text-primary flex max-h-dvh flex-col'>
        <DialogHeader>
          <DialogTitle className=''>
            Attempt&nbsp;<span className='font-mono'>{attemptId}</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <CodeViewer {...{ code, language }} />
        </DialogDescription>
        <DialogFooter>
          <span className='font-base text-sm'>Attempted at: {triggerText}</span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
