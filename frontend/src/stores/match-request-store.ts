import { createContext, useContext } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { IRequestMatchFormSchema } from '@/routes/match/logic';

const matchRequestContext = createContext<{ form?: UseFormReturn<IRequestMatchFormSchema> }>({});

export const MatchRequestStoreProvider = matchRequestContext.Provider;

export const useMatchRequest = () => {
  const { form } = useContext(matchRequestContext);
  const values = form?.watch();
  return {
    values,
  };
};
