import { PersonIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/services/user-service';

export const UserDropdown = () => {
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
      <DropdownMenuContent className='translate-x-[-40px]'>
        <DropdownMenuItem className='hover:cursor-pointer' onClick={handleLogout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
