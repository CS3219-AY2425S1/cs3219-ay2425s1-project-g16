import { DotsVerticalIcon, TrashIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableSortableHeader } from '@/components/ui/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/lib/routes';
import { useAuthedRoute } from '@/stores/auth-store';
import { IInterviewRoom } from '@/types/collab-types';

export const columns: Array<ColumnDef<IInterviewRoom>> = [
  {
    id: 'roomId',
    accessorKey: 'roomId',
    header: 'Room Link',
    cell: ({ row }) => (
      <Button variant='link'>
        <Link to={ROUTES.INTERVIEW.replace(':roomId', row.getValue('roomId'))}>
          {((row.getValue('roomId') as string) ?? '').slice(0, 6)}
        </Link>
      </Button>
    ),
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableSortableHeader column={column} title='Interview Started At' />
    ),
    cell: ({ row }) => {
      return <span>{new Date(row.getValue('createdAt')).toLocaleString()}</span>;
    },
  },
  {
    id: 'question',
    accessorKey: 'questionId',
    header: ({ column }) => <DataTableSortableHeader column={column} title='Question Id' />,
  },
  {
    id: 'users',
    header: 'Users',
    cell: ({ row }) => {
      const { userId } = useAuthedRoute();
      const { userId1, userId2 } = row.original;
      const isMe = (value?: string) => userId === value;
      return (
        <div className='flex gap-2'>
          {[userId1, userId2].map((value, index) => (
            <Badge key={index} variant={isMe(value) ? 'easy' : 'secondary'}>
              <span className='uppercase'>{isMe(value) ? 'Me' : value?.slice(0, 6)}</span>
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row: _ }) => {
      // const { isAdmin } = useAuthedRoute();
      return (
        <DropdownMenu>
          {/* <DropdownMenuTrigger disabled={!isAdmin}> */}
          <DropdownMenuTrigger disabled>
            <DotsVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className='flex justify-between gap-2'>
              <span>Delete Room</span>
              <TrashIcon />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
