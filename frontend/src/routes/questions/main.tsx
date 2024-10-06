import { queryOptions, useInfiniteQuery, type QueryClient } from '@tanstack/react-query';
import { Suspense, useEffect, useMemo } from 'react';
import { Await, defer, useLoaderData, type LoaderFunctionArgs } from 'react-router-dom';

import { WithNavBanner } from '@/components/blocks/authed/with-nav-banner';
import { Loading } from '@/components/blocks/loading';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCrumbs } from '@/lib/hooks/use-crumbs';
import { fetchQuestions, ROWS_PER_PAGE } from '@/services/question-service';
import type { IGetQuestionsResponse } from '@/types/question-types';

import { QuestionTable } from './question-table';
import { columns } from './table-columns';

const getListQuestionsQueryConfig = (pageNumber?: number) =>
  queryOptions({
    queryKey: ['qn', 'list', pageNumber],
    queryFn: async ({ signal: _ }) => fetchQuestions(pageNumber),
  });

export const loader =
  (queryClient: QueryClient) =>
  async ({ params: _ }: LoaderFunctionArgs) => {
    return defer({
      initialPage: queryClient.ensureQueryData(getListQuestionsQueryConfig()),
    });
  };

type IQuestionListServiceAPIResponse = Awaited<ReturnType<typeof fetchQuestions>>;
type IQuestionLoaderReturn = Awaited<ReturnType<ReturnType<typeof loader>>>['data'];
type IQuestionLoaderData = { initialPage?: IQuestionListServiceAPIResponse };

export function Questions() {
  const { crumbs } = useCrumbs();

  const initialData = useLoaderData() as IQuestionLoaderReturn as IQuestionLoaderData;

  const { data, fetchNextPage, hasNextPage, isError, isFetchingNextPage } = useInfiniteQuery<
    IGetQuestionsResponse,
    Error
  >({
    queryKey: ['questions'],
    queryFn: ({ pageParam }) => fetchQuestions(pageParam as number | undefined),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length;
      const totalPages = Math.ceil(lastPage.totalQuestions / ROWS_PER_PAGE);
      return nextPage < totalPages ? nextPage : undefined;
    },
    initialData: {
      pages: initialData?.initialPage?.questions ? [initialData.initialPage] : [],
      pageParams: initialData?.initialPage?.questions ? [0] : [],
    },
  });

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const questions = useMemo(() => {
    if (data) {
      return data.pages.flatMap((page) => page.questions);
    } else if (initialData?.initialPage?.questions) {
      return initialData.initialPage.questions;
    }
    return [];
  }, [data, initialData]);

  return (
    <WithNavBanner crumbs={crumbs}>
      <div className='flex w-full flex-1 overflow-hidden py-3'>
        <ScrollArea className='size-full px-6'>
          <Suspense fallback={<Loading />}>
            <Await resolve={initialData.initialPage}>
              <QuestionTable columns={columns} data={questions} isError={isError} />
            </Await>
          </Suspense>
        </ScrollArea>
      </div>
    </WithNavBanner>
  );
}
