import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryProvider, RouterProvider } from '@/components/providers';
import '@/styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider />
    </QueryProvider>
  </StrictMode>
);
