import { Outlet } from 'react-router-dom';

import { cn } from '@/lib/utils';

export const AuthedLayout = () => {
  return (
    <div
      id='main'
      className={cn(
        'flex w-full flex-col overscroll-contain',
        'h-[calc(100dvh-64px)]' // The nav is 64px
      )}
    >
      <Outlet />
    </div>
  );
};
