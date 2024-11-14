import { z } from 'zod';

import { forgotPasswordSchema } from '@/routes/forgot-password/logic';
import { loginFormSchema } from '@/routes/login/logic';
import { signUpSchema } from '@/routes/signup/logic';

export type ILoginPayload = z.infer<typeof loginFormSchema>;
export type ISignUpPayload = Omit<z.infer<typeof signUpSchema>, 'confirmPassword'>;
export type IForgotPasswordPayload = z.infer<typeof forgotPasswordSchema>;
