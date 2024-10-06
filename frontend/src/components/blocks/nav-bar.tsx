import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import { Logo } from '@/components/common/logo';
import { MobileThemeSwitch } from '@/components/common/mobile-theme-switch';
import { ThemeSwitch } from '@/components/common/theme-switch';
import { UserDropdown } from '@/components/common/user-dropdown';
import { Button } from '@/components/ui/button';

import { useRouterLocation } from '@/lib/hooks';
import { ROUTES } from '@/lib/routes';

const NavBar = observer(() => {
  const { isLogin, isUnauthedRoute } = useRouterLocation();

  return (
    <header className='bg-secondary/80 border-border/40 sticky top-0 z-50 flex h-16 items-center gap-4 border px-4 backdrop-blur-md md:px-6'>
      {/* Desktop Nav */}
      <nav className='hidden w-full flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
        <Logo className='text-md' />
        {!isUnauthedRoute && (
          <>
            <Button variant='ghost'>Start</Button>
            <Button variant='ghost' asChild>
              <Link to={ROUTES.QUESTIONS}>Questions</Link>
            </Button>
          </>
        )}
        <div className='ml-auto flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
          <ThemeSwitch />
          {isUnauthedRoute ? (
            isLogin ? (
              <Button variant='outline' asChild>
                <a href={ROUTES.SIGNUP}>Sign Up</a>
              </Button>
            ) : (
              <Button variant='outline' asChild>
                <a href={ROUTES.LOGIN}>Log In</a>
              </Button>
            )
          ) : (
            <UserDropdown />
          )}
        </div>
      </nav>
      {/* Mobile Nav */}
      <div className='inline-flex w-full items-center justify-between md:hidden'>
        <div className='inline-flex items-center gap-4'>
          <HamburgerMenuIcon />
          <Logo />
        </div>
        <div>
          <MobileThemeSwitch />
        </div>
      </div>
    </header>
  );
});

export default NavBar;
