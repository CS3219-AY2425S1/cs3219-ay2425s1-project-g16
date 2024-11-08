import { zodResolver } from '@hookform/resolvers/zod';
import { Cross2Icon } from '@radix-ui/react-icons';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { type Dispatch, type FC, type SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ComboboxExternal } from '@/components/ui/combobox';
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
import { getDifficultiesQueryConfig, getTopicsQueryConfig } from '@/routes/match/logic';
import { adminAddQuestion, adminUpdateQuestion } from '@/services/question-service';
import { useAuthedRoute } from '@/stores/auth-store';
import type { IGetQuestionDetailsResponse } from '@/types/question-types';

type AdminEditFormProps = {
  isFormOpen: boolean;
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
  questionDetails: IGetQuestionDetailsResponse['question'];
  mode?: 'create' | 'update';
};

const formSchema = z.object({
  title: z.string().min(1, 'Title must not be empty'),
  difficulty: z.string().min(1, 'Choose a difficulty'),
  topics: z
    .string()
    .min(1, 'Topic cannot be empty')
    .array()
    .min(1, 'There must be at least 1 topic'),
  description: z.string().min(1, 'Description must not be empty'),
});

export const AdminEditForm: FC<AdminEditFormProps> = ({
  questionDetails,
  isFormOpen,
  setIsFormOpen,
  mode = 'update',
}) => {
  const { userId } = useAuthedRoute();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...questionDetails,
      topics: questionDetails.topic,
      description: questionDetails.description,
      difficulty: questionDetails.difficulty as z.infer<typeof formSchema>['difficulty'],
    },
    mode: 'onSubmit',
  });

  const queryClient = useQueryClient();
  const {
    mutate: sendUpdate,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return mode === 'update'
        ? adminUpdateQuestion({ ...values, questionId: Number.parseInt(questionDetails.id!) })
        : adminAddQuestion(values);
    },
    onSuccess: () => {
      if (mode === 'update') {
        queryClient.refetchQueries({
          queryKey: ['qn', 'details', Number.parseInt(questionDetails.id!)],
        });
      } else {
        queryClient.refetchQueries({
          queryKey: ['questions', userId],
        });
      }

      setTimeout(() => {
        form.reset();
        setIsFormOpen(false);
      }, 500);
    },
  });

  const topicsQuery = useQuery(getTopicsQueryConfig());
  const difficultiesQuery = useQuery(getDifficultiesQueryConfig());

  const onSubmit = (formValues: z.infer<typeof formSchema>) => {
    const parsed = formSchema.safeParse(formValues);

    if (parsed.success) {
      sendUpdate(parsed.data);
    }
  };

  return (
    <>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='border-border flex h-dvh w-dvw max-w-screen-lg flex-col'>
          <DialogHeader className=''>
            <DialogTitle className='text-primary'>
              {mode === 'update' ? 'Edit Question Details' : 'Add a question'}
            </DialogTitle>
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
                          <SelectTrigger className='focus:ring-secondary-foreground/50 flex w-min min-w-[150px]'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className='border-secondary-foreground/50'>
                            {(
                              difficultiesQuery?.data?.difficulties ??
                              (['Easy', 'Medium', 'Hard'] as const)
                            ).map((value, index) => (
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
                  name='topics'
                  render={({ field }) => (
                    <FormItem className='flex flex-col gap-1 sm:col-span-2'>
                      <div className='flex items-end gap-2'>
                        <FormLabel>Topics</FormLabel>
                      </div>
                      <FormControl>
                        <div className='flex gap-2'>
                          <div className='mr-2 flex gap-2'>
                            <ComboboxExternal
                              itemName='Topic'
                              options={Array.from(
                                new Set([...(topicsQuery.data?.topics ?? []), ...field.value])
                              ).map((v) => ({
                                value: v,
                                label: v.replace(/^[a-zA-Z]/, (c) => c.toUpperCase()),
                              }))}
                              chosenOptions={field.value}
                              setChosenOptions={(value: Array<string>) => {
                                form.clearErrors('topics');
                                form.setValue('topics', value);
                              }}
                            />
                            <Button
                              className=''
                              disabled={isPending}
                              onClick={(e) => {
                                e.preventDefault();
                                form.resetField('topics');
                              }}
                              size='sm'
                            >
                              Reset
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <div className='flex max-h-[200px] flex-1 flex-wrap gap-2 overflow-auto'>
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
                                  'topics',
                                  field.value.filter((_value, idx) => idx !== index)
                                );
                              }}
                            />
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                              className='flex flex-1 resize-none font-mono'
                              disabled={isPending}
                              placeholder='lorem ipsum ...'
                            />
                          </FormControl>
                        </TabsContent>
                        <TabsContent
                          value='preview'
                          className='hidden data-[state=active]:flex data-[state=active]:flex-1'
                        >
                          <ScrollArea className='border-border flex h-full max-h-[calc(100dvh-424px)] max-w-screen-md flex-1 rounded-lg border p-4'>
                            <Markdown
                              rehypePlugins={[rehypeKatex]}
                              remarkPlugins={[remarkMath, remarkGfm]}
                              className='prose prose-neutral text-card-foreground prose-strong:text-card-foreground prose-pre:p-0 leading-tight'
                              components={{
                                code: ({ children, className, ...rest }) => {
                                  const match = /language-(\w+)/.exec(className || '');
                                  return match ? (
                                    <SyntaxHighlighter
                                      customStyle={{
                                        borderRadius: '0.3em',
                                        margin: 0,
                                      }}
                                      PreTag='div'
                                      style={oneLight}
                                      language={match[1]}
                                    >
                                      {String(children)}
                                    </SyntaxHighlighter>
                                  ) : (
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
                      form.handleSubmit(onSubmit);
                    }}
                    size='sm'
                    className='flex gap-2'
                  >
                    <span>
                      {isPending
                        ? 'Submitting'
                        : isSuccess
                          ? `${mode === 'create' ? 'Added' : 'Updated'}! Closing form...`
                          : 'Save Changes'}
                    </span>
                    {isPending && <Loader2 className='size-4 animate-spin' />}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
          <VisuallyHidden>
            <DialogFooter />
          </VisuallyHidden>
        </DialogContent>
      </Dialog>
    </>
  );
};
