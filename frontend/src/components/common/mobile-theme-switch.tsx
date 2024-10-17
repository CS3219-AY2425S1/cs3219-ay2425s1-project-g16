import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { observer } from 'mobx-react';

import { Button } from '@/components/ui/button';
import { darkModeStore } from '@/stores/dark-mode-store';

export const MobileThemeSwitch = observer(() => {
  return (
    <Button
      className='rounded-lg p-3'
      onClick={() => darkModeStore.toggle(darkModeStore.mode === 'light' ? 'dark' : 'light')}
    >
      {darkModeStore.mode === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
});
