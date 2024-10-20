import { observer } from 'mobx-react';
import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';

import { ScrollArea } from '@/components/ui/scroll-area';

import { MatchForm } from './match-form';

export const Match = observer(() => {
  const { topics } = useLoaderData() as { topics: Promise<Array<string>> };

  return (
    <ScrollArea className='flex size-full py-8'>
      <Suspense fallback={<div>Loading topics...</div>}>
        <Await resolve={topics}>
          {(resolvedTopics) => <MatchForm topics={resolvedTopics.topics} />}
        </Await>
      </Suspense>
    </ScrollArea>
  );
});
