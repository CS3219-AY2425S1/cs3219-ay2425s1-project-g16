import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

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
import { requestMatch } from '@/services/match-service';

import { MatchFormData } from './logic';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { WaitingRoom } from './waiting-room/waiting';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface MatchFormProps {
  topics: string[];
}

export const MatchForm = ({ topics }: MatchFormProps) => {
  const form = useForm({
    defaultValues: {
      selectedTopics: [],
      difficulty: '',
    },
  });

  const { handleSubmit, control } = form;
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [socketPort, setSocketPort] = useState<string | null>(null);

  const onSubmit = async (data: MatchFormData) => {
    setLoading(true);
    setErrorMessage(null);

    const response = await requestMatch(data);

    if (!response || !response.socketPort) {
      setLoading(false);
      setErrorMessage('Error. Please try again later.');
    } else {
      const socketPort = response.socketPort;
      setSocketPort(socketPort);
      setIsModalOpen(true);
      setLoading(false);
    }
  };

  return (
    <div className='flex h-full items-center justify-center'>
      <Card className='text-card-foreground bg-primary-foreground border-border flex w-full max-w-[400px] flex-col items-center justify-center rounded-xl border shadow md:size-full md:max-h-[600px]'>
        <CardHeader className='mt-10 flex items-start justify-center'>
          <CardTitle className='text-3xl'>Find A Partner</CardTitle>
        </CardHeader>
        <CardContent className='size-full grow items-center justify-center'>
          <FormProvider {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex size-full h-full flex-col justify-center gap-2'
            >
              <FormField
                control={control}
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
                control={control}
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
              {errorMessage && <p className='mt-2 text-center text-red-500'>{errorMessage}</p>}
              <Button className='mt-5 w-full' type='submit'>
                {loading ? 'Finding Partner...' : 'Find Partner'}
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
      <Dialog modal={true} open={isModalOpen}>
        <DialogContent className='max-h-[500px] [&>button]:hidden'>
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>Waiting Room</DialogTitle>
            </VisuallyHidden>
          </DialogHeader>
          <VisuallyHidden>
            <DialogDescription>
              You are currently in the waiting room. Please wait while we find a match for you.
            </DialogDescription>
          </VisuallyHidden>
          <WaitingRoom socketPort={socketPort} setIsModalOpen={setIsModalOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
