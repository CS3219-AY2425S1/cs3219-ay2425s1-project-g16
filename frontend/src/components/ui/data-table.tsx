import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from './button';

export const DataTableSortableHeader = <TData,>({
  column,
  title,
  className,
}: {
  column: Column<TData>;
  title: string;
} & React.HTMLAttributes<HTMLButtonElement>) => (
  <Button
    variant='ghost'
    size='sm'
    className={cn('text-sm p-1 flex gap-2 items-center translate-x-[-4px]', className)}
    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  >
    {title}
    {column.getIsSorted() === 'asc' ? (
      <ArrowDown className='size-4' />
    ) : column.getIsSorted() === 'desc' ? (
      <ArrowUp className='size-4' />
    ) : (
      <ArrowUpDown className='size-4' />
    )}
  </Button>
);
