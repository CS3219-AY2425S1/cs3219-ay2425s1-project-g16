import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';

import { getEmptyFieldErrorMessage } from '@/lib/forms';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/services/user-service';
import { useNavigate } from 'react-router-dom';

export const loginFormSchema = z.object({
  username: z.string().min(1, getEmptyFieldErrorMessage('Username')),
  password: z.string().min(1, getEmptyFieldErrorMessage('Password')),
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
