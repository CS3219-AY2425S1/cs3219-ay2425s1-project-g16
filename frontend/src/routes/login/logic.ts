import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { getEmptyFieldErrorMessage } from '@/lib/forms';
import { login } from '@/services/user-service';

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
      const userID = _response?.data?.id;
      if (userID) {
        // TODO: Revalidate with is-authed User Svc EP and put as user
        // details provider on each route request
        localStorage.setItem('cachedUserID', userID);
      }

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
