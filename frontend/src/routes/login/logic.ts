import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';

import { getEmptyFieldErrorMessage } from '@/lib/forms';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/services/user-service';
import { useNavigate } from 'react-router-dom';

export const loginFormSchema = z.object({
  username: z.string().min(1, getEmptyFieldErrorMessage('Username')),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

type ILoginFormSchema = z.infer<typeof loginFormSchema>;

export const useLoginForm = () => {
  const navigate = useNavigate();
  const form = useForm<ILoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const { mutate: sendLoginRequest, isPending } = useMutation({
    mutationKey: ['login'],
    mutationFn: login,
    onSuccess: (_response, _params, _context) => {
      navigate(0);
    },
  });

  const onSubmit = (data: ILoginFormSchema) => {
    const parseResult = loginFormSchema.safeParse(data);
    if (parseResult.error || !parseResult.data) {
      return;
    }
    const payload = parseResult.data;
    sendLoginRequest(payload);
  };

  return { form, onSubmit: form.handleSubmit(onSubmit), isPending };
};
