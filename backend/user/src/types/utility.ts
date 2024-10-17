import type { Request, Response } from 'express';
import type { StatusCodes } from 'http-status-codes';

export type IServiceResponse<T> = {
  code: StatusCodes;
  error?: {
    message: string;
  };
  data?: T;
};

export type IRouteHandler = <T>(req: Request, res: Response) => Promise<Response<T>>;
