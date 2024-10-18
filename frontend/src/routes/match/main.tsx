import { observer } from 'mobx-react';
import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';

import { MatchForm } from './match-form';

export const Match = observer(() => {
  const { topics } = useLoaderData() as { topics: Promise<string[]> };

  return (
    <div className='m-auto flex grow items-center justify-center'>
      <Suspense fallback={<div>Loading topics...</div>}>
        <Await resolve={topics}>
          {(resolvedTopics) => (
            <div className='flex size-full items-center justify-center'>
              <MatchForm topics={resolvedTopics.topics} />
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
});
