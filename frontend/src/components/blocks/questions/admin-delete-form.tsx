import { TrashIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Dispatch, FC, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { adminDeleteQuestion } from '@/services/question-service';

type AdminDeleteFormProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  questionId: number;
};

export const AdminDeleteForm: FC<AdminDeleteFormProps> = ({ isOpen, setIsOpen, questionId }) => {
  const navigate = useNavigate();
  const {
    mutate: deleteQuestion,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: (questionId: number) => adminDeleteQuestion(questionId),
    onSuccess: () => {
      setTimeout(() => {
        navigate('/');
      }, 700);
    },
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='flex'>
            Are you sure you want to delete question:&nbsp;`<pre>{questionId}</pre>`?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription />
        <AlertDialogFooter className='flex w-full justify-between'>
          <AlertDialogCancel disabled={isPending || isSuccess}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              event.preventDefault();
              deleteQuestion(questionId);
            }}
            disabled={isPending || isSuccess}
            className='flex items-center gap-2'
          >
            <span>{isPending ? 'Deleting...' : isSuccess ? 'Deleted Successfully' : 'Delete'}</span>
            {isPending ? <Loader2 className='size-4 animate-spin' /> : <TrashIcon />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
