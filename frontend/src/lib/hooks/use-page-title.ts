import { useEffect, useRef } from 'react';

import { getPageTitle } from '@/lib/routes';

export const usePageTitle = (path: string, customTitle?: string) => {
  const defaultTitle = useRef(document.title);
  const title = customTitle ?? getPageTitle(path);

  useEffect(() => {
    document.title = title;

    return () => {
      document.title = defaultTitle.current;
    };
  }, [title]);
};
