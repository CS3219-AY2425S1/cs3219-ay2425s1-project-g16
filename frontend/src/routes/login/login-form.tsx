import { Logo } from '@/components/common/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/lib/routes';

import { useLoginForm } from './logic';

export const LoginForm = () => {
  const { form, onSubmit, isPending } = useLoginForm();

  return (
    <Card className='bg-primary-foreground border-border mx-auto flex size-full max-w-sm flex-col justify-center md:ml-auto md:mr-8 md:max-h-[600px]'>
      <CardHeader className='flex items-center pb-10'>
        <CardTitle className='text-3xl'>Welcome Back To</CardTitle>
        <Logo className='text-2xl' />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder='jollyRancher' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' disabled={isPending} placeholder='••••••••' {...field} />
                  </FormControl>
                  <FormMessage />
                  <div className='flex w-full'>
                    <Button
                      variant='link'
                      className='hover:text-secondary-foreground ml-auto p-0 font-normal'
                      asChild
                    >
                      <a href={ROUTES.FORGOT_PASSWORD}>Forgot Password?</a>
                    </Button>
                  </div>
                </FormItem>
              )}
            />
            <Button className='w-full' type='submit'>
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='mx-auto text-center text-sm'>
        <span>Don&apos;t have an account?&nbsp;</span>
        <a href={ROUTES.SIGNUP} className='underline'>
          Sign up
        </a>
      </CardFooter>
    </Card>
  );
};
