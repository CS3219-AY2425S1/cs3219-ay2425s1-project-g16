import { useEffect, useRef } from 'react';
import { getPageTitle } from '@/lib/routes';

export const usePageTitle = (path: string) => {
  const isDocumentDefined = typeof document !== 'undefined';
  const originalTitle = useRef(isDocumentDefined ? document.title : null);
  useEffect(() => {
    if (!isDocumentDefined) {
      return;
    }
    if (document.title !== path) {
      document.title = getPageTitle(path);
    }
    return () => {
      if (originalTitle.current) {
        document.title = originalTitle.current;
      }
    };
  }, []);
};
