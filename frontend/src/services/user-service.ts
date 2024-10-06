import { HttpStatusCode } from 'axios';
import type { IForgotPasswordPayload, ILoginPayload, ISignUpPayload } from '@/types/user-types';

import { userApiClient, userApiGetClient } from './api-clients';

const USER_SERVICE_ROUTES = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  SIGNUP: '/auth/register',
  FORGOT_PASSWORD: '',
  IS_AUTHED: '/auth-check/is-authed',
};

export const login = (userCredentials: ILoginPayload) => {
  return userApiClient.post(USER_SERVICE_ROUTES.LOGIN, userCredentials);
};

export const signUp = (signUpPayload: ISignUpPayload) => {
  return userApiClient.post(USER_SERVICE_ROUTES.SIGNUP, signUpPayload);
};

export const forgotPassword = (forgotPasswordPayload: IForgotPasswordPayload) => {
  return userApiClient.post(``, forgotPasswordPayload);
};

export const logout = () => {
  return userApiClient.post(USER_SERVICE_ROUTES.LOGOUT);
};

export const checkIsAuthed = (param?: { signal: AbortSignal }) => {
  return userApiGetClient
    .get(USER_SERVICE_ROUTES.IS_AUTHED, { signal: param?.signal })
    .catch((err) => {
      if (err !== null) {
        console.error(err);
        return { status: HttpStatusCode.Unauthorized, data: undefined };
      }
    })
    .then(async (response) => {
      if (response && response.status < 400) {
        return {
          isAuthed: true,
          expiresAt: response.data ? new Date(response.data.expiresAt) : new Date(),
        };
      }
      return {
        isAuthed: false,
      };
    });
};
