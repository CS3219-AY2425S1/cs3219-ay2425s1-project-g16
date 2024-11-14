import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTableSortableHeader } from '@/components/ui/data-table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { IQuestionAttempt } from '@/types/question-types';

import { AttemptDetailsDialog } from './attempt-details';

export const columns: Array<ColumnDef<IQuestionAttempt>> = [
  {
    accessorKey: 'attemptId',
    header: 'ID',
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => (
      <DataTableSortableHeader column={column} title='Attempted' className='ml-4' />
    ),
    cell({ row }) {
      const attemptedTime = row.getValue('timestamp') as string;
      const label = new Date(attemptedTime).toLocaleString();
      return (
        <AttemptDetailsDialog triggerText={label} {...row.original}>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <Button variant='link'>{label}</Button>
              </TooltipTrigger>
              <TooltipContent>View Details</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </AttemptDetailsDialog>
      );
    },
  },
  {
    accessorKey: 'language',
    header: ({ column }) => (
      <DataTableSortableHeader column={column} title='Language' className='ml-auto' />
    ),
    cell({ row }) {
      return (
        <div>
          <Badge className='rounded-full' variant='secondary'>
            {row.getValue('language')}
          </Badge>
        </div>
      );
    },
  },
];
