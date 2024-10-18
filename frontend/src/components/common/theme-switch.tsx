import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { observer } from 'mobx-react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { darkModeStore } from '@/stores/dark-mode-store';

export const ThemeSwitch = observer(() => {
  return (
    <Tabs value={darkModeStore.mode} onValueChange={darkModeStore.toggle}>
      <TabsList>
        <TabsTrigger value='light'>
          <SunIcon />
        </TabsTrigger>
        <TabsTrigger value='dark'>
          <MoonIcon />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
});
