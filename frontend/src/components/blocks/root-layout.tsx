import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthStoreProvider } from '@/stores/auth-store';

import NavBar from './nav-bar';

export function RootLayout() {
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  return (
    <div className='text-text bg-background flex min-h-screen flex-col overscroll-contain'>
      <AuthStoreProvider
        value={{
          ...{
            userId,
            setUserId,
            email,
            setEmail,
            username,
            setUsername,
            isAdmin,
            setIsAdmin,
          },
        }}
      >
        <NavBar />
        <main className='flex flex-1'>
          <Outlet />
        </main>
      </AuthStoreProvider>
    </div>
  );
}
