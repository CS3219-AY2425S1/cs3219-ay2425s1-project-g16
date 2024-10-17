import { QueryClient, queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import Markdown from 'react-markdown';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { WithNavBanner } from '@/components/blocks/authed/with-nav-banner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { useCrumbs } from '@/lib/hooks/use-crumbs';
import { usePageTitle } from '@/lib/hooks/use-page-title';
import { getQuestionDetails } from '@/services/question-service';

const questionDetailsQuery = (id: number) =>
  queryOptions({
    queryKey: ['qn', 'details', id],
    queryFn: async ({ signal: _ }) => getQuestionDetails(id),
  });

export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const questionId = Number.parseInt(params.questionId ?? '1') ?? 1;
    await queryClient.ensureQueryData(questionDetailsQuery(questionId));
    return { questionId };
  };

export const QuestionDetails = () => {
  const { questionId } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>;
  const { data: details } = useSuspenseQuery(questionDetailsQuery(questionId));
  const questionDetails = useMemo(() => {
    return details.question;
  }, [details]);
  const { crumbs } = useCrumbs({
    path: '<CURRENT>',
    title: `${questionId}. ${questionDetails.title}`,
  });
  usePageTitle(details.question.title);

  return (
    <WithNavBanner crumbs={[...crumbs]}>
      <div className='flex flex-1 overflow-hidden'>
        <Card className='border-border m-4 w-1/3 max-w-[500px] overflow-hidden p-4 md:w-2/5'>
          <ScrollArea className='h-full'>
            <CardHeader>
              <div className='flex flex-col gap-4'>
                <div className='flex w-full items-center gap-4'>
                  <CardTitle className='text-2xl'>
                    {questionDetails.id}.&nbsp;{questionDetails.title}
                  </CardTitle>
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
                    <Badge
                      variant='secondary'
                      className='flex w-min grow-0 whitespace-nowrap'
                      key={i}
                    >
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
        </Card>
        <div className='flex flex-1 flex-col' />
      </div>
    </WithNavBanner>
  );
};
