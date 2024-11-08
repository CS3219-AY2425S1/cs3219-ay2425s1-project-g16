import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Dispatch, FC, PropsWithChildren, SetStateAction, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { addQuestionAttempt } from '@/services/question-service';
import { IYjsUserState } from '@/types/collab-types';

import { COMPLETION_STATES } from '../constants';

type CompleteDialogProps = {
  userId: string;
  questionId: number;
  code: string;
  language: string;
  members: Array<IYjsUserState['user']>;
  setCode: Dispatch<SetStateAction<string>>;
  setCompleting: (state: string, resetId?: boolean) => void;
};

export const CompleteDialog: FC<PropsWithChildren<CompleteDialogProps>> = ({
  children,
  setCompleting,
  questionId,
  userId,
  code,
  setCode,
  language,
  members,
}) => {
  const navigate = useNavigate();

  const [isOpen, _setIsOpen] = useState(false);
  const setIsOpen = useCallback(
    (openState: boolean) => {
      _setIsOpen(openState);

      if (openState) {
        setCompleting('pending');
      } else {
        setCompleting('', true);
      }
    },
    [isOpen]
  );

  const { mutate: sendCompleteRequest, isPending } = useMutation({
    mutationFn: async () => {
      return await addQuestionAttempt({
        questionId,
        code,
        language,
        userId1: userId,
        userId2:
          members.length < 2 ? undefined : members.filter((v) => v.userId !== userId)[0].userId,
      });
    },
    onSuccess: () => {
      setCode('');
      setCompleting(COMPLETION_STATES.SUCCESS);
      // Navigate to home page
      setTimeout(() => {
        setCompleting(COMPLETION_STATES.EMPTY, true);
        setIsOpen(false);
        // Clear AI chat if moving away
        localStorage.removeItem('ai-assist-lang');
        localStorage.removeItem('ai_chat_history');
        navigate('/');
      }, 200);
    },
    onError: () => {
      setCompleting(COMPLETION_STATES.ERROR);
    },
  });

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='border-border'>
        <DialogHeader className='text-primary'>
          <DialogTitle>Are you sure you wish to mark this question as complete?</DialogTitle>
        </DialogHeader>
        <VisuallyHidden>
          <DialogDescription />
        </VisuallyHidden>
        <DialogFooter>
          <div className='flex w-full justify-between'>
            <Button
              variant='secondary'
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Go Back
            </Button>
            <Button
              disabled={isPending}
              onClick={() => sendCompleteRequest()}
              className='flex flex-row items-center gap-2'
            >
              <span>Complete Question</span>
              {isPending && <Loader2 className='animate-spin' />}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
