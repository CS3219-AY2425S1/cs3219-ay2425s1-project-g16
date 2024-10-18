import type { FC } from 'react';
import { RouterProvider as RRDProvider } from 'react-router-dom';

import { router } from '@/lib/router';

export const RouterProvider: FC = () => {
  return <RRDProvider router={router} />;
};
