import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo } from 'react';

import { CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getQuestionAttempts } from '@/services/question-service';
import { useAuthedRoute } from '@/stores/auth-store';
import { IPostGetQuestionAttemptsResponse } from '@/types/question-types';

import { columns } from './columns';
import { QuestionAttemptsTable } from './table';

type QuestionAttemptsProps = {
  questionId: number;
  pageSize?: number;
  className?: string;
};

export const QuestionAttemptsPane: React.FC<QuestionAttemptsProps> = ({
  questionId,
  pageSize,
  className,
}) => {
  const { userId } = useAuthedRoute();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isError } = useInfiniteQuery({
    queryKey: ['question', 'attempts', questionId, userId],
    queryFn: ({ pageParam }) =>
      getQuestionAttempts({ questionId, userId, ...(pageParam ? { offset: pageParam } : {}) }),
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length > 0 ? pages.length * 10 : undefined;
    },
    initialPageParam: 0,
  });
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  const attempts = useMemo(() => {
    return data?.pages.flatMap((v) => v as IPostGetQuestionAttemptsResponse) ?? [];
  }, [data]);
  return (
    <CardContent className={cn('flex h-full w-full p-0', className)}>
      <QuestionAttemptsTable
        columns={columns}
        data={attempts}
        isError={isError}
        pageSize={pageSize}
      />
    </CardContent>
  );
};
