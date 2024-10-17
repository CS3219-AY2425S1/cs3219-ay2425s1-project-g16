import { observer } from 'mobx-react';
import { MatchForm } from './match-form';
import { Suspense } from 'react';
import { useLoaderData, Await } from 'react-router-dom';

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
