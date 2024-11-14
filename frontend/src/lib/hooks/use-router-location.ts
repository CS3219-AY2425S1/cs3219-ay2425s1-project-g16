import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { ROUTES, UNAUTHED_ROUTES } from '@/lib/routes';

export const useRouterLocation = () => {
  const location = useLocation();

  const data = useMemo(() => {
    const { pathname } = location;
    return {
      isUnauthedRoute: UNAUTHED_ROUTES.includes(pathname),
      isLogin: pathname === ROUTES.LOGIN,
    };
  }, [location]);
  return {
    location,
    ...data,
  };
};
