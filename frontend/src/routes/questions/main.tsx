import {
  // type QueryClient, queryOptions,
  useInfiniteQuery,
} from '@tanstack/react-query';
import {
  // Suspense,
  useEffect,
  useMemo,
} from 'react';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';

// import { Await, defer, type LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { WithNavBanner } from '@/components/blocks/authed';
// import { Loading } from '@/components/blocks/loading';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePageTitle } from '@/lib/hooks';
import { useCrumbs } from '@/lib/hooks/use-crumbs';
import { ROUTES } from '@/lib/routes';
import { fetchQuestions, ROWS_PER_PAGE } from '@/services/question-service';
import { useAuthedRoute } from '@/stores/auth-store';
import type { IGetQuestionsResponse } from '@/types/question-types';

import { QuestionTable } from './question-table';
import { columns } from './table-columns';

export const loader = (args: LoaderFunctionArgs) => {
  const route = new URL(args.request.url);
  const params = route.searchParams;
  const pageNum = params.get('page');
  return {
    pageNum,
  };
};

export function Questions() {
  const { pageNum } = useLoaderData() as ReturnType<typeof loader>;
  const { userId } = useAuthedRoute();
  usePageTitle(ROUTES.QUESTIONS);
  const { crumbs } = useCrumbs();

  const { data, fetchNextPage, hasNextPage, isError, isFetchingNextPage } = useInfiniteQuery<
    IGetQuestionsResponse,
    Error
  >({
    queryKey: ['questions', userId, pageNum],
    queryFn: ({ pageParam }) => fetchQuestions(userId, pageParam as number | undefined),
    initialPageParam: +(pageNum ?? ''),
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length;
      const totalPages = Math.ceil(lastPage.totalQuestions / ROWS_PER_PAGE);
      return nextPage < totalPages ? nextPage : undefined;
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
    }

    return [];
  }, [data]);

  return (
    <WithNavBanner crumbs={crumbs}>
      <div className='flex w-full flex-1 overflow-hidden py-3'>
        <ScrollArea className='size-full px-6'>
          <QuestionTable columns={columns} data={questions} isError={isError} />
        </ScrollArea>
      </div>
    </WithNavBanner>
  );
}
