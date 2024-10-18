import { MatchFormData } from '@/routes/match/logic';
import { IRequestMatchResponse } from '@/types/match-types';

import { matchApiClient } from './api-clients';

const MATCHING_SERVICE_ROUTES = {
  REQUEST_MATCH: '/match/request',
  CANCEL_MATCH: '/match/cancel',
};

export const requestMatch = (data: MatchFormData): Promise<IRequestMatchResponse | null> => {
  const payload = {
    userId: localStorage.getItem('cachedUserID'),
    topic: data.selectedTopics,
    difficulty: data.difficulty,
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
      return null;
    });
};

export const cancelMatch = () => {
  return true;
  //return matchApiClient.post(MATCHING_SERVICE_ROUTES.CANCEL_MATCH);
};
