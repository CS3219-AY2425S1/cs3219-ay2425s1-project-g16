import { Badge } from '@/components/ui/badge';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import { Question } from './logic';

export const columns: ColumnDef<Question>[] = [
  {
    accessorKey: 'attempted',
    header: 'Attempted',
    cell: ({ row }) => {
      const attempted = row.getValue<boolean>('attempted');
      return <div className='ml-3'>{attempted && <CheckCircledIcon />}</div>;
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'difficulty',
    header: 'Difficulty',
  },
  {
    accessorKey: 'topic',
    header: 'Topics',
    cell: ({ row }) => {
      const topics: string[] = row.getValue('topic');
      return (
        <div>
          {topics.map((topic) => (
            <Badge className='mr-1 text-xs' variant='outline'>
              {topic}
            </Badge>
          ))}
        </div>
      );
    },
  },
];
