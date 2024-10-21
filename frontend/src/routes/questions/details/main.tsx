import { QueryClient, queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

import { WithNavBanner } from '@/components/blocks/authed/with-nav-banner';
import { useCrumbs } from '@/lib/hooks/use-crumbs';
import { usePageTitle } from '@/lib/hooks/use-page-title';
import { getQuestionDetails } from '@/services/question-service';

import { DetailsCard } from './details-card';

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
        <DetailsCard questionDetails={questionDetails} />
        <div className='flex flex-1 flex-col' />
      </div>
    </WithNavBanner>
  );
};
