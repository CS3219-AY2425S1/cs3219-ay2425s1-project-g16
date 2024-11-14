import { type BreadCrumb, getBreadCrumbs } from '@/lib/routes';

import { useRouterLocation } from './use-router-location';

export const useCrumbs = (...extraCrumbs: Array<BreadCrumb>) => {
  const {
    location: { pathname },
  } = useRouterLocation();
  const crumbs = getBreadCrumbs(pathname);
  return {
    crumbs: [...crumbs, ...extraCrumbs].map((v) => ({
      ...v,
      path: v.path.replace('<CURRENT>', pathname),
    })),
  };
};
