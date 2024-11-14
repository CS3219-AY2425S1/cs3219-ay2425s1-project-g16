import { desc, eq, type InferSelectModel, or } from 'drizzle-orm';
import { StatusCodes } from 'http-status-codes';

import { db, rooms } from '@/lib/db';
import { logger } from '@/lib/utils';
import type { IServiceResponse } from '@/types';

import type { IGetRoomsPayload } from './types';

export const getRoomsService = async (
  params: IGetRoomsPayload
): Promise<IServiceResponse<Array<InferSelectModel<typeof rooms>>>> => {
  const { offset, limit: rawLimit, userId } = params;
  const limit = rawLimit && rawLimit > 0 ? rawLimit : 10;
  let query = db
    .select()
    .from(rooms)
    .where(or(eq(rooms.userId1, userId), eq(rooms.userId2, userId)))
    .limit(limit)
    .$dynamic();

  if (offset) {
    query = query.offset(offset * limit);
  }

  query = query.orderBy(desc(rooms.createdAt));

  try {
    const result = await query;
    return {
      code: StatusCodes.OK,
      data: result,
    };
  } catch (error) {
    const { name, message, stack, cause } = error as Error;
    logger.error(`An error occurred: ` + JSON.stringify({ name, message, stack, cause }));
    return {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      error: {
        message,
      },
    };
  }
};
