import { IRequestMatchResponse } from '@/types/match-types';

import { matchApiClient } from './api-clients';
import { getUserId } from './user-service';

const MATCHING_SERVICE_ROUTES = {
  REQUEST_MATCH: '/match/request',
  CANCEL_MATCH: '/match/cancel',
};

export const requestMatch = (
  params: { userId?: string } | undefined
): Promise<IRequestMatchResponse | null> => {
  const payload = {
    userId: params?.userId,
  };

  return matchApiClient
    .post(MATCHING_SERVICE_ROUTES.REQUEST_MATCH, payload)
    .then((res) => {
      const responseData = res.data as IRequestMatchResponse;

      if (!responseData.socketPort || responseData.socketPort.length === 0) {
        return null;
      }

      console.log(responseData);
      return responseData;
    })
    .catch((error) => {
      console.error('Request failed:', error);
      throw error;
    });
};

export const cancelMatch = () => {
  return matchApiClient.post(MATCHING_SERVICE_ROUTES.CANCEL_MATCH, { userId: getUserId() });
};
