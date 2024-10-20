import { useEffect, useState } from 'react';
import { FormProvider } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { MatchRequestStoreProvider } from '@/stores/match-request-store';

import { useRequestMatchForm } from './logic';
import { WaitingRoomModal } from './waiting-room';

interface MatchFormProps {
  topics: string[];
}

export const MatchForm = ({ topics }: MatchFormProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { form, onSubmit, matchRequestError, isMatchRequestPending, socketPort } =
    useRequestMatchForm();

  useEffect(() => {
    setIsModalOpen(!!socketPort);
  }, [socketPort]);

  return (
    <div className='flex size-full items-center justify-center'>
      <Card
        className={cn(
          'text-card-foreground bg-primary-foreground rounded-xl border border-border shadow',
          'flex max-w-[400px] size-full md:max-h-[600px]',
          'flex-col items-center justify-center'
        )}
      >
        <CardHeader className='mt-10 flex items-start justify-center'>
          <CardTitle className='text-3xl'>Find A Partner</CardTitle>
        </CardHeader>
        <CardContent className='size-full grow items-center justify-center'>
          <FormProvider {...form}>
            <form
              onSubmit={onSubmit}
              className='flex size-full h-full flex-col justify-center gap-2'
            >
              <FormField
                control={form.control}
                name='selectedTopics'
                rules={{ required: 'Please select at least one topic.' }}
                render={({ field }) => (
                  <FormItem className='md:w-[350px]'>
                    <FormLabel>Topics</FormLabel>
                    <MultiSelector
                      values={field.value}
                      onValuesChange={field.onChange}
                      className='whitespace-nowrap'
                    >
                      <FormControl>
                        <MultiSelectorTrigger className='bg-popover max-h-24 overflow-y-auto'>
                          <MultiSelectorInput placeholder='Select topic(s)' />
                        </MultiSelectorTrigger>
                      </FormControl>
                      <MultiSelectorContent>
                        <MultiSelectorList>
                          {topics.map((topic) => {
                            return (
                              <MultiSelectorItem value={topic} key={topic}>
                                {topic}
                              </MultiSelectorItem>
                            );
                          })}
                        </MultiSelectorList>
                      </MultiSelectorContent>
                      <FormMessage />
                    </MultiSelector>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='difficulty'
                rules={{ required: 'Please select a difficulty level.' }}
                render={({ field }) => (
                  <FormItem className='mt-2'>
                    <FormLabel>Difficulty</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='bg-popover'>
                          <SelectValue placeholder='Select difficulty' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='easy'>Easy</SelectItem>
                        <SelectItem value='medium'>Medium</SelectItem>
                        <SelectItem value='hard'>Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {matchRequestError !== null && (
                <p className='mt-2 text-center text-red-500'>
                  An error occurred requesting a match. Please try again later.
                </p>
              )}
              <Button disabled={isMatchRequestPending} className='mt-5 w-full' type='submit'>
                {isMatchRequestPending ? 'Finding Partner...' : 'Find Partner'}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
      <MatchRequestStoreProvider value={{ form }}>
        <WaitingRoomModal {...{ socketPort, isModalOpen, setIsModalOpen, form }} />
      </MatchRequestStoreProvider>
    </div>
  );
};
