import { Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className='text-text bg-background flex min-h-screen flex-col overscroll-contain'>
      <Outlet />
    </div>
  );
}
