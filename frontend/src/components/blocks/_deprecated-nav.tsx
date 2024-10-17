import { HamburgerMenuIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const Nav = () => {
  return (
    // {/* Nav Bar */}
    <header className='border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full backdrop-blur'>
      {/* Main Nav */}
      <div className='mr-4 hidden md:flex'>
        {/* Logo */}
        <Button variant='link' className='font-mono'>
          PeerPrep
        </Button>
        <nav className='flex items-center gap-4 text-sm lg:gap-6'>
          <a
            href='/link'
            className={cn(
              'transition-colors hover:text-foreground/80'
              // pathname === "/link" ? "text-foreground" : "text-foreground/60"
            )}
          >
            link
          </a>
        </nav>
      </div>
      {/* Mobile Nav */}
      <Button
        variant='ghost'
        className='mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden'
      >
        <HamburgerMenuIcon />
      </Button>
      {/* Right Group */}
      <div className='container flex h-14 max-w-screen-2xl items-center'>
        <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
          <div className='w-full flex-1 md:w-auto md:flex-none'>{/* Command Bar */}</div>
          <nav className='flex items-center'>{/* Links (Right) */}</nav>
        </div>
      </div>
    </header>
  );
};
