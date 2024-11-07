import { zodResolver } from '@hookform/resolvers/zod';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { type Dispatch, type FC, type SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { IGetQuestionDetailsResponse } from '@/types/question-types';

type AdminEditFormProps = {
  isFormOpen: boolean;
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
  questionDetails: IGetQuestionDetailsResponse['question'];
};

const formSchema = z.object({
  title: z.string().min(1),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  topic: z.string().min(1).array().min(1),
  description: z.string().min(1),
});

export const AdminEditForm: FC<AdminEditFormProps> = ({
  questionDetails,
  isFormOpen,
  setIsFormOpen,
}) => {
  const [addedTopic, setAddedTopic] = useState('');
  const {
    mutate: sendUpdate,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {},
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...questionDetails,
      description: questionDetails.description,
      difficulty: questionDetails.difficulty as z.infer<typeof formSchema>['difficulty'],
    },
    mode: 'onSubmit',
  });

  const onSubmit = (formValues: z.infer<typeof formSchema>) => {
    sendUpdate(formValues);
  };

  const addTopic = (topic: string) => {
    const val = new Set(form.getValues('topic').map((v) => v.toLowerCase()));
    val.add(topic.toLowerCase());
    form.setValue(
      'topic',
      Array.from(val).map((v) => v.replace(/^[a-z]/, (c) => c.toUpperCase()))
    );
  };

  return (
    <>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='border-border flex h-dvh w-dvw max-w-screen-lg flex-col'>
          <DialogHeader className=''>
            <DialogTitle className='text-primary'>Edit Question Details</DialogTitle>
          </DialogHeader>
          <DialogDescription className='h-full'>
            <Form {...form}>
              <form
                className='text-primary flex h-full flex-col gap-4'
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} placeholder='someQuestionTitle' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex w-full flex-col gap-4 sm:grid sm:grid-cols-3 sm:gap-8'>
                  <FormField
                    control={form.control}
                    name='difficulty'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <FormControl>
                          <Select
                            disabled={isPending}
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className='focus:ring-secondary-foreground/50'>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className='border-secondary-foreground/50'>
                              {(['Easy', 'Medium', 'Hard'] as const).map((value, index) => (
                                <SelectItem key={index} value={value}>
                                  {value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='topic'
                    render={({ field }) => (
                      <FormItem className='flex flex-col gap-1 sm:col-span-2'>
                        <div className='flex items-end gap-2'>
                          <FormLabel>Topics</FormLabel>
                        </div>
                        <FormControl>
                          <div className='flex flex-1 items-start gap-2'>
                            <div className='mr-2 flex gap-2'>
                              <Input
                                disabled={isPending}
                                value={addedTopic}
                                onChange={(e) => {
                                  setAddedTopic(e.currentTarget.value);
                                }}
                                className='w-[150px]'
                                placeholder='New topic'
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter' && addedTopic) {
                                    event.preventDefault();
                                    addTopic(addedTopic);
                                    setAddedTopic('');
                                  }
                                }}
                              />
                              <Button
                                onClick={() => {
                                  addTopic(addedTopic);
                                  setAddedTopic('');
                                }}
                                disabled={isPending || !addedTopic}
                                className='flex w-min gap-1'
                                size='sm'
                              >
                                <span>Add</span>
                                <PlusIcon />
                              </Button>
                              <Button
                                className=''
                                disabled={isPending}
                                onClick={() => {
                                  form.resetField('topic');
                                }}
                                size='sm'
                              >
                                Reset
                              </Button>
                            </div>
                            <div className='scrollbar-thumb-primary flex max-h-[64px] flex-1 flex-wrap gap-2 overflow-auto'>
                              {field.value.map((value, index) => (
                                <Badge
                                  key={index}
                                  className='flex size-min gap-2 whitespace-nowrap rounded-full'
                                >
                                  <span>{value}</span>
                                  <Cross2Icon
                                    className='hover:scale-105 hover:cursor-pointer'
                                    onClick={() => {
                                      if (isPending) {
                                        return;
                                      }

                                      form.setValue(
                                        'topic',
                                        field.value.filter((_value, idx) => idx !== index)
                                      );
                                    }}
                                  />
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem className='flex flex-1 flex-col'>
                      <Tabs defaultValue='edit' className='flex flex-1 flex-col'>
                        <TabsList className='flex w-min'>
                          <TabsTrigger value='edit'>Description</TabsTrigger>
                          <TabsTrigger value='preview'>Preview</TabsTrigger>
                        </TabsList>
                        <TabsContent
                          value='edit'
                          className='hidden data-[state=active]:flex data-[state=active]:flex-1'
                        >
                          <FormControl>
                            <Textarea
                              {...field}
                              className='flex flex-1 resize-none'
                              disabled={isPending}
                              placeholder='lorem ipsum ...'
                            />
                          </FormControl>
                        </TabsContent>
                        <TabsContent
                          value='preview'
                          className='hidden data-[state=active]:flex data-[state=active]:flex-1'
                        >
                          <ScrollArea className='border-border flex h-full max-h-[calc(100dvh-336px)] max-w-screen-md flex-1 rounded-lg border p-4'>
                            <Markdown
                              rehypePlugins={[rehypeKatex]}
                              remarkPlugins={[remarkMath, remarkGfm]}
                              className='prose prose-neutral text-card-foreground prose-strong:text-card-foreground leading-normal'
                              components={{
                                code: ({ children, className, ...rest }) => {
                                  return (
                                    <code
                                      {...rest}
                                      className='bg-secondary text-secondary-foreground rounded px-1.5 py-1 font-mono'
                                    >
                                      {children}
                                    </code>
                                  );
                                },
                              }}
                            >
                              {form.watch('description')}
                            </Markdown>
                          </ScrollArea>
                        </TabsContent>
                      </Tabs>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </DialogDescription>
          <DialogFooter>
            <div className='flex w-full items-center justify-between'>
              <Button
                disabled={isPending || isSuccess}
                variant='secondary'
                size='sm'
                onClick={() => {
                  form.reset();
                  setIsFormOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={isPending || isSuccess}
                onClick={() => {
                  onSubmit(form.getValues());
                }}
                size='sm'
                className='flex gap-2'
              >
                <span>
                  {isPending ? 'Submitting' : isSuccess ? 'Updated! Closing form' : 'Save Changes'}
                </span>
                {isPending && <Loader2 className='size-4 animate-spin' />}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
