import { observer } from 'mobx-react';
import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';

import { ScrollArea } from '@/components/ui/scroll-area';
import { usePageTitle } from '@/lib/hooks';
import { ROUTES } from '@/lib/routes';

import { MatchForm } from './match-form';

export const Match = observer(() => {
  usePageTitle(ROUTES.MATCH);
  const { topics, difficulties } = useLoaderData() as {
    topics: Promise<{ topics: Array<string> }>;
    difficulties: Promise<{ difficulties: Array<string> }>;
  };

  return (
    <ScrollArea className='flex size-full py-8'>
      <Suspense fallback={<div>Loading topics...</div>}>
        <Await resolve={Promise.all([topics, difficulties])}>
          {([resolvedTopics, resolvedDifficulties]) => {
            return (
              <MatchForm
                topics={resolvedTopics.topics}
                difficulties={resolvedDifficulties.difficulties}
              />
            );
          }}
        </Await>
      </Suspense>
    </ScrollArea>
  );
});
