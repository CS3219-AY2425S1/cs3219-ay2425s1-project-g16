import '@/styles/globals.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { QueryProvider, RouterProvider } from '@/components/providers';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider />
    </QueryProvider>
  </StrictMode>
);
