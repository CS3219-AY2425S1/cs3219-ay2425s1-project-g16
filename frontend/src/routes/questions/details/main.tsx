import { QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

import { WithNavBanner } from '@/components/blocks/authed/with-nav-banner';
import { Card } from '@/components/ui/card';

import { useCrumbs } from '@/lib/hooks/use-crumbs';
import { usePageTitle } from '@/lib/hooks/use-page-title';
import { QuestionDetails } from '@/components/blocks/questions/details';
import { questionDetailsQuery } from '@/lib/queries/question-details';

export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    const questionId = Number.parseInt(params.questionId ?? '1') ?? 1;
    await queryClient.ensureQueryData(questionDetailsQuery(questionId));
    return { questionId };
  };

export const QuestionDetailsPage = () => {
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
          <QuestionDetails questionDetails={questionDetails} />
        </Card>
        <div className='flex flex-1 flex-col' />
      </div>
    </WithNavBanner>
  );
};
