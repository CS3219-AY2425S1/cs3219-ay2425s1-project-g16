import { PersonIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/services/user-service';
import { useAuthedRoute } from '@/stores/auth-store';

import { Badge } from '../ui/badge';

export const UserDropdown = () => {
  const { email, username, isAdmin } = useAuthedRoute();
  const navigate = useNavigate();

  const { mutate: sendLogoutRequest } = useMutation({
    mutationFn: logout,
    onSuccess: (_response, _params, _context) => {
      navigate(0);
    },
  });

  const handleLogout = () => {
    sendLogoutRequest();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='overflow-hidden rounded-full'>
          <PersonIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='border-border translate-x-[-40px]'>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{username}</p>
            <p className='text-muted-foreground text-xs leading-none'>{email}</p>
            {isAdmin && (
              <>
                <div className='h-1' />
                <Badge className='w-min uppercase' variant='easy'>
                  Admin
                </Badge>
              </>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='hover:cursor-pointer' onClick={handleLogout}>
          Log&nbsp;out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
