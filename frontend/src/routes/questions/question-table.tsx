import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  PlusIcon,
} from '@radix-ui/react-icons';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { AdminEditForm } from '@/components/blocks/questions/admin-edit-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuthedRoute } from '@/stores/auth-store';

interface QuestionTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: Array<TData>;
  isError: boolean;
}

export function QuestionTable<TData, TValue>({
  columns,
  data,
  isError,
}: QuestionTableProps<TData, TValue>) {
  const { isAdmin } = useAuthedRoute();
  const [_searchParams, setSearchParams] = useSearchParams();
  const [isAdminAddFormOpen, setIsAdminAddFormOpen] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 12,
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { pagination, columnFilters },
    filterFns: {},
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
  });

  const handleDifficultyFilterChange = (value: string) => {
    setColumnFilters(value === 'all' ? [] : [{ id: 'difficulty', value }]);
  };

  const handleStatusFilterChange = (value: string) => {
    setColumnFilters(value == 'all' ? [] : [{ id: 'attempted', value: value === 'attempted' }]);
  };

  useEffect(() => {
    const newParams = new URLSearchParams();
    newParams.set('pageNum', String(pagination.pageIndex));
    setSearchParams(newParams);
  }, [pagination.pageIndex]);

  return (
    <div className='flex size-full flex-col'>
      <div className='flex items-center py-4'>
        <div className='mr-2'>
          <Select onValueChange={handleStatusFilterChange}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All</SelectItem>
              <SelectItem value='attempted'>Attempted</SelectItem>
              <SelectItem value='not-attempted'>Not attempted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className='mr-2'>
          <Select onValueChange={handleDifficultyFilterChange}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue placeholder='Difficulty' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All</SelectItem>
              <SelectItem value='Easy'>Easy</SelectItem>
              <SelectItem value='Medium'>Medium</SelectItem>
              <SelectItem value='Hard'>Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder='Search questions...'
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
          className='max-w-sm'
        />
        {isAdmin && (
          <>
            <Button
              onClick={() => setIsAdminAddFormOpen((open) => !open)}
              className='ml-12 flex gap-2'
              variant='outline'
              size='sm'
            >
              <span>Add Question</span>
              <PlusIcon />
            </Button>
            <AdminEditForm
              mode='create'
              isFormOpen={isAdminAddFormOpen}
              setIsFormOpen={setIsAdminAddFormOpen}
              questionDetails={{
                title: '',
                topic: [],
                description: '',
                difficulty: '',
              }}
            />
          </>
        )}
      </div>
      <div className='border-border rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className='border-border/60 bg-primary-foreground text-primary'
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {!isError && table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className='border-border/60 even:bg-secondary/10'>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination className='flex items-center justify-end space-x-2 py-4'>
        <PaginationContent>
          <PaginationItem>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <DoubleArrowLeftIcon />
            </Button>
          </PaginationItem>
          <PaginationItem className='mr-1'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ArrowLeftIcon />
            </Button>
          </PaginationItem>
          <PaginationItem className='text-sm'>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </PaginationItem>
          <PaginationItem className='ml-1'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ArrowRightIcon />
            </Button>
          </PaginationItem>
          <PaginationItem>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              <DoubleArrowRightIcon />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
