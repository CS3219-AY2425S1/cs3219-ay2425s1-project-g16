import type { StatusCodes } from 'http-status-codes';

export type IServiceResponse<T> = {
  code: StatusCodes;
  error?: {
    message: string;
  };
  data?: T;
};
