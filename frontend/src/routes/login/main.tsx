import { observer } from 'mobx-react';

import { Hero, LoginForm } from '@/routes/login';

export const Login = observer(() => {
  return (
    <div className='flex w-full py-8'>
      <Hero />
      <div className='flex size-full items-center justify-center md:min-w-[40%] md:max-w-sm'>
        <LoginForm />
      </div>
    </div>
  );
});
