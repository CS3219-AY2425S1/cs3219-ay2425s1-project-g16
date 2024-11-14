import { usePageTitle } from '@/lib/hooks';
import { ROUTES } from '@/lib/routes';
import { SignUpForm } from '@/routes/signup';

export const SignUp = () => {
  usePageTitle(ROUTES.SIGNUP);
  return (
    <div className='m-auto flex'>
      <SignUpForm />
    </div>
  );
};
