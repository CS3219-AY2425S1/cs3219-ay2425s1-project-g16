import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getEmptyFieldErrorMessage } from '@/lib/forms';

export const forgotPasswordSchema = z.object({
  email: z.string().email().min(1, getEmptyFieldErrorMessage('Email')),
});

export type IForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

const onSubmit = (_formData: IForgotPasswordSchema) => {};

export const useForgotPasswordForm = () => {
  const form = useForm<IForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  });

  return { form, onSubmit: form.handleSubmit(onSubmit) };
};
