import { DotsVerticalIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuthedRoute } from '@/stores/auth-store';
import type { IGetQuestionDetailsResponse } from '@/types/question-types';

import { AdminDeleteForm } from './admin-delete-form';
import { AdminEditForm } from './admin-edit-form';

export const QuestionDetails = ({
  questionDetails,
}: {
  questionDetails: IGetQuestionDetailsResponse['question'];
}) => {
  const { isAdmin } = useAuthedRoute();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  return (
    <ScrollArea className='h-full'>
      <CardHeader>
        <div className='flex flex-col gap-4'>
          <div className='flex w-full items-center gap-4'>
            <CardTitle className='text-2xl'>
              {questionDetails.id}.&nbsp;{questionDetails.title}
            </CardTitle>
            {isAdmin && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className='min-h-none ml-auto flex !h-6 items-center gap-2 rounded-lg px-2'
                      size='sm'
                    >
                      <span>Actions</span>
                      <DotsVerticalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='border-border flex flex-col gap-1'>
                    <DropdownMenuItem
                      onClick={() => setIsFormOpen((isOpen) => !isOpen)}
                      className='flex w-full justify-between gap-2 hover:cursor-pointer'
                    >
                      <span>Edit</span>
                      <Pencil1Icon />
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsDeleteDialogOpen((isOpen) => !isOpen)}
                      className='flex w-full justify-between gap-2 bg-red-50/20 text-red-600 hover:cursor-pointer focus:bg-red-100 focus:text-red-600 dark:bg-red-950/40 dark:text-red-500  focus:dark:bg-red-900'
                    >
                      <span>Delete</span>
                      <TrashIcon />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AdminEditForm {...{ questionDetails, isFormOpen, setIsFormOpen }} />
                <AdminDeleteForm
                  {...{
                    isOpen: isDeleteDialogOpen,
                    setIsOpen: setIsDeleteDialogOpen,
                    questionId: Number.parseInt(questionDetails.id!),
                  }}
                />
              </>
            )}
          </div>
          <div className='flex flex-wrap items-center gap-1'>
            <Badge
              variant={questionDetails.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'}
              className='flex w-min grow-0'
            >
              {questionDetails.difficulty}
            </Badge>
            <Separator orientation='vertical' className='mx-2 h-4' />
            <span className='text-sm font-medium'>Topics:</span>
            {questionDetails.topic.map((v, i) => (
              <Badge variant='secondary' className='flex w-min grow-0 whitespace-nowrap' key={i}>
                {v}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Markdown
          rehypePlugins={[rehypeKatex]}
          remarkPlugins={[remarkMath, remarkGfm]}
          className='prose prose-neutral text-card-foreground prose-strong:text-card-foreground prose-pre:bg-secondary prose-pre:text-secondary-foreground leading-normal'
          components={{
            code: ({ children, className, ...rest }) => {
              // const isCodeBlock = /language-(\w+)/.exec(className || '');

              return (
                <code
                  {...rest}
                  className='dark:bg-secondary dark:text-secondary-foreground rounded px-1.5 py-1 font-mono'
                >
                  {children}
                </code>
              );
            },
          }}
        >
          {questionDetails.description}
        </Markdown>
      </CardContent>
    </ScrollArea>
  );
};
