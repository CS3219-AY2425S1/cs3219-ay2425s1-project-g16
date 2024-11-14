import { usePageTitle } from '@/lib/hooks';
import { ROUTES } from '@/lib/routes';
import { ForgotPasswordForm } from '@/routes/forgot-password';

export const ForgotPassword = () => {
  usePageTitle(ROUTES.FORGOT_PASSWORD);
  return (
    <div className='m-auto flex'>
      <ForgotPasswordForm />
    </div>
  );
};
