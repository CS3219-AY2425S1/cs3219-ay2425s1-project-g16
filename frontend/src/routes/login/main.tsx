import { observer } from 'mobx-react';

import { usePageTitle } from '@/lib/hooks';
import { ROUTES } from '@/lib/routes';
import { Hero, LoginForm } from '@/routes/login';

export const Login = observer(() => {
  usePageTitle(ROUTES.LOGIN);
  return (
    <div className='flex w-full py-8'>
      <Hero />
      <div className='flex size-full items-center justify-center md:min-w-[40%] md:max-w-sm'>
        <LoginForm />
      </div>
    </div>
  );
});
