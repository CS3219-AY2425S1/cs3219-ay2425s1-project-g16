import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { WithNavBanner } from '@/components/blocks/authed';
import { useCrumbs } from '@/lib/hooks';
import { getRooms } from '@/services/collab-service';
import { useAuthedRoute } from '@/stores/auth-store';
import { IInterviewRoom } from '@/types/collab-types';

export const InterviewsPage = () => {
  const { userId } = useAuthedRoute();
  const { crumbs } = useCrumbs();
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery<
    Array<IInterviewRoom>
  >({
    queryKey: ['interviews', userId],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => getRooms(userId, pageParam as number),
    getNextPageParam: (_lastPage, pages) => {
      if (_lastPage.length === 0) {
        return undefined;
      }

      return pages.length;
    },
  });

  useEffect(() => {
    if (!isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, isFetchingNextPage, hasNextPage]);

  const _rooms = useMemo(() => {
    return data ? data.pages.flatMap((page) => page) : [];
  }, [data]);

  return (
    <WithNavBanner crumbs={crumbs}>
      <div />
    </WithNavBanner>
  );
};
