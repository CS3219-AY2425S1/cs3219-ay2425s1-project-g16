import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { Badge } from '@/components/ui/badge';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuthedRoute } from '@/stores/auth-store';
import type { IGetQuestionDetailsResponse } from '@/types/question-types';

import { AdminEditForm } from './admin-edit-form';

export const QuestionDetails = ({
  questionDetails,
}: {
  questionDetails: IGetQuestionDetailsResponse['question'];
}) => {
  const { isAdmin } = useAuthedRoute();
  return (
    <ScrollArea className='h-full'>
      <CardHeader>
        <div className='flex flex-col gap-4'>
          <div className='flex w-full items-center gap-4'>
            <CardTitle className='text-2xl'>
              {questionDetails.id}.&nbsp;{questionDetails.title}
            </CardTitle>
            {isAdmin && <AdminEditForm questionDetails={questionDetails} />}
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
          className='prose prose-neutral text-card-foreground prose-strong:text-card-foreground leading-normal'
          components={{
            code: ({ children, className, ...rest }) => {
              // const isCodeBlock = /language-(\w+)/.exec(className || '');

              return (
                <code
                  {...rest}
                  className='bg-secondary text-secondary-foreground rounded px-1.5 py-1 font-mono'
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
