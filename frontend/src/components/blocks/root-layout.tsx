import { Outlet } from 'react-router-dom';
import NavBar from './nav-bar';

export function RootLayout() {
  return (
    <div className='text-text bg-background flex min-h-screen flex-col overscroll-contain'>
      <NavBar />
      <main className='flex flex-1'>
        <Outlet />
      </main>
    </div>
  );
}
