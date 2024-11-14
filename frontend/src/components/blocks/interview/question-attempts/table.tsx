import {
  ArrowLeftIcon,
  ArrowRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ComboboxMulti } from '@/components/ui/combobox';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IQuestionAttempt } from '@/types/question-types';

interface QuestionTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>;
  data: Array<TData>;
  isError: boolean;
  pageSize?: number;
}

export function QuestionAttemptsTable<TValue>({
  columns,
  data,
  isError,
  pageSize,
}: QuestionTableProps<IQuestionAttempt, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSize ?? 10,
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { pagination, columnFilters, sorting },
    filterFns: {},
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  const setLanguages = (languages: Array<string>) => {
    setColumnFilters((columnFilters) => [
      ...columnFilters.filter((v) => v.id !== 'language'),
      ...languages.map((v) => ({ id: 'language', value: v })),
    ]);
  };

  return (
    <div className='relative flex max-h-full w-full grow flex-col'>
      <div className='flex items-center pb-4 pt-2'>
        <div className='flex flex-col gap-1'>
          <label className='ml-0.5 text-sm font-medium'>Filter by Language</label>
          <ComboboxMulti
            setValuesCallback={setLanguages}
            options={Array.from(new Set(data.map((v) => v.language))).map((v) => ({
              value: v,
              label: v,
            }))}
            placeholderText='Select a language filter'
            noOptionsText='None of the available languages match your search'
          />
        </div>
      </div>
      <div className='border-border sticky top-0 rounded-t-md border'>
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
        </Table>
      </div>
      <ScrollArea className='border-border size-full overflow-x-auto border-x'>
        <Table>
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
      </ScrollArea>
      <div className='border-border sticky bottom-0 rounded-b-md border'>
        <Table>
          <TableFooter className='border-t-border'>
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Pagination className='flex items-center justify-end space-x-2 p-2'>
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        variant='outline'
                        size='sm'
                        className='px-2'
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
                        className='px-2'
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                      >
                        <ArrowLeftIcon />
                      </Button>
                    </PaginationItem>
                    <PaginationItem className='text-sm'>
                      {table.getState().pagination.pageIndex + 1} of{' '}
                      {Math.max(1, table.getPageCount())}
                    </PaginationItem>
                    <PaginationItem className='ml-1'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='px-2'
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
                        className='px-2'
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage()}
                      >
                        <DoubleArrowRightIcon />
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
