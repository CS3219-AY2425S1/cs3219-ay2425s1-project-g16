import { DetailsCard } from '../questions/details/details-card';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';
import { loader, questionDetailsQuery } from './utils';

export const Collab = () => {
  const { questionId } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof loader>>>;
  const { data: details } = useSuspenseQuery(questionDetailsQuery(questionId));

  const questionDetails = useMemo(() => {
    return details.question;
  }, [details]);

  return (
    <div className='flex flex-1 overflow-hidden'>
      <DetailsCard questionDetails={questionDetails} />
      <div className='flex flex-1 flex-col' />
    </div>
  );
};
