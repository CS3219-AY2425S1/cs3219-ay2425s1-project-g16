import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/lib/routes';

export const HomePage = () => {
  // TODO: Add actual home page
  return <Navigate to={ROUTES.QUESTIONS} />;
};
